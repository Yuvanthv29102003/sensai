import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get('industry') || 'technology';

  try {
    // LinkedIn Job Search API via RapidAPI
    const url = `https://linkedin-job-search-api.p.rapidapi.com/jobs/search?keywords=${encodeURIComponent(industry)}&location=Worldwide&datePosted=month&page=1`;
    const response = await fetch(url, {
      headers: {
        'x-rapidapi-host': 'linkedin-job-search-api.p.rapidapi.com',
        'x-rapidapi-key': '317287c1a9mshfd179d486eb458cp180768jsnd1f6c777f425',
      },
    });

    const rawText = await response.text();
    console.log('LinkedIn API raw response:', rawText);

    if (!response.ok) {
      throw new Error('LinkedIn API request failed: ' + response.status + ' ' + response.statusText);
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (parseErr) {
      console.error('Error parsing LinkedIn API response:', parseErr);
      throw new Error('Failed to parse LinkedIn API response');
    }

    // The API returns jobs, so extract unique companies
    const companiesMap = {};
    (data.jobs || []).forEach(job => {
      if (job.company && !companiesMap[job.company]) {
        companiesMap[job.company] = {
          name: job.company,
          logo: job.company_logo || '/logo.png',
          location: job.location || 'Worldwide',
          careers: job.company_link || job.job_url || '#',
        };
      }
    });
    const companies = Object.values(companiesMap).slice(0, 9); // Limit to 9 for dashboard

    return NextResponse.json({ companies });
  } catch (error) {
    console.error('Error fetching companies:', error);
    // Fallback to mock data
    const MOCK_COMPANIES = [
      { name: "Google", logo: "/logo.png", location: "Mountain View, CA", careers: "https://careers.google.com/" },
      { name: "Meta", logo: "/logo.png", location: "Menlo Park, CA", careers: "https://www.metacareers.com/" },
      { name: "Shopify", logo: "/logo.png", location: "Remote", careers: "https://www.shopify.com/careers" },
    ];
    return NextResponse.json({ companies: MOCK_COMPANIES, fallback: true });
  }
} 