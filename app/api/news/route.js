import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get('industry') || 'technology';

  try {
    // Option 1: Google News RSS (requires RSS to JSON conversion)
    const searchTerms = {
      'Web Development': 'web development programming',
      'Data Science': 'data science AI machine learning',
      'Product Management': 'product management agile',
      'All': 'technology career jobs'
    };

    const searchTerm = searchTerms[industry] || searchTerms['All'];
    
    // Using NewsAPI.org (free tier available)
    // You'll need to sign up for an API key at https://newsapi.org/
    const API_KEY = process.env.NEWS_API_KEY || 'your-api-key-here';
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTerm)}&sortBy=publishedAt&language=en&pageSize=5&apiKey=${API_KEY}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('News API request failed');
    }

    const data = await response.json();
    
    // Format the response
    const articles = data.articles?.map(article => ({
      title: article.title,
      url: article.url,
      date: new Date(article.publishedAt).toISOString().split('T')[0],
      source: article.source.name
    })) || [];

    return NextResponse.json({ articles });

  } catch (error) {
    console.error('Error fetching news:', error);
    
    // Fallback to mock data
    const MOCK_NEWS = {
      "Web Development": [
        { title: "React 19 Released with New Features", url: "https://react.dev/blog/2024/react-19", date: "2024-06-01", source: "React Blog" },
        { title: "Next.js 15: What's New?", url: "https://nextjs.org/blog/next-15", date: "2024-05-20", source: "Next.js Blog" },
        { title: "WebAssembly Gains Traction in Production", url: "https://webassembly.org/roadmap/", date: "2024-05-10", source: "WebAssembly" },
      ],
      "Data Science": [
        { title: "AI Outperforms Humans in Data Analysis", url: "https://www.nature.com/articles/s41586-024-00000-0", date: "2024-06-02", source: "Nature" },
        { title: "Python Remains Top Language for Data Science", url: "https://www.kdnuggets.com/2024/05/python-data-science.html", date: "2024-05-18", source: "KDnuggets" },
        { title: "Big Data Trends in 2024", url: "https://www.forbes.com/sites/bigdata/2024/05/05/", date: "2024-05-05", source: "Forbes" },
      ],
      "Product Management": [
        { title: "Agile Product Management in 2024", url: "https://www.producthunt.com/posts/agile-2024", date: "2024-06-03", source: "Product Hunt" },
        { title: "Top PM Tools Compared", url: "https://www.productmanager.com/tools-2024", date: "2024-05-22", source: "Product Manager" },
        { title: "How AI is Changing Product Roadmaps", url: "https://techcrunch.com/2024/05/12/ai-product-roadmaps/", date: "2024-05-12", source: "TechCrunch" },
      ],
      "All": [
        { title: "Tech Hiring Surges in 2024", url: "https://www.reuters.com/technology/tech-hiring-2024", date: "2024-06-04", source: "Reuters" },
        { title: "Remote Work: The New Normal", url: "https://www.bbc.com/worklife/remote-work-2024", date: "2024-05-25", source: "BBC" },
        { title: "Upskilling for the Future", url: "https://hbr.org/2024/05/upskilling-future", date: "2024-05-15", source: "Harvard Business Review" },
      ],
    };

    return NextResponse.json({ 
      articles: MOCK_NEWS[industry] || MOCK_NEWS["All"],
      fallback: true 
    });
  }
} 