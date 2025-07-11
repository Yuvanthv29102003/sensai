"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsights } from "./dashboard";

/**
 * Update user profile and optionally create industry insight.
 */
export async function updateUser(data) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });
  if (!user) throw new Error("User not found");

  // Check if insight already exists
  let industryInsight = await db.industryInsight.findUnique({
    where: { industry: data.industry },
  });

  // If not, generate insights (outside transaction!)
  let generatedInsights = null;
  if (!industryInsight) {
    generatedInsights = await generateAIInsights(data.industry);
  }

  try {
    // Use transaction for DB-only actions
    const result = await db.$transaction(async (tx) => {
      if (!industryInsight && generatedInsights) {
        industryInsight = await tx.industryInsight.create({
          data: {
            industry: data.industry,
            ...generatedInsights,
            nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          },
        });
      }

      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          industry: data.industry,
          experience: data.experience,
          bio: data.bio,
          skills: data.skills,
        },
      });

      return { updatedUser, industryInsight };
    });

    revalidatePath("/");
    return { success: true, user: result.updatedUser };
  } catch (error) {
    console.error("Error updating user and industry:", error);
    throw new Error("Failed to update profile");
  }
}

/**
 * Returns whether the user has completed onboarding (i.e., has an industry set)
 */
export async function getUserOnboardingStatus() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  try {
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      select: { industry: true },
    });

    return {
      isOnboarded: !!user?.industry,
    };
  } catch (error) {
    console.error("Error checking onboarding status:", error);
    throw new Error("Failed to check onboarding status");
  }
}
