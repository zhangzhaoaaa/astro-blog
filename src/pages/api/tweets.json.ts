import type { APIRoute } from "astro";
import { getTweetsWithMeta } from "../../utils/getTweets";

// Parse date format "2025-10-13 13:30" to Date object
function parseDateTime(dateString: string): Date {
  const match = dateString.match(
    /(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})/
  );
  if (match) {
    const [, year, month, day, hour, minute] = match;
    return new Date(
      parseInt(year),
      parseInt(month) - 1, // Month is 0-indexed
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );
  }
  // Fallback: try to parse as regular date
  return new Date(dateString);
}

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URLSearchParams(url.search);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "6");

    // Get all tweets
    const allTweets = await getTweetsWithMeta();

    // Calculate pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const tweets = allTweets.slice(startIndex, endIndex);

    // Prepare response
    const response = {
      tweets: tweets.map(tweet => ({
        slug: tweet.slug,
        data: {
          title: tweet.data.title,
          pubDatetime: tweet.data.pubDatetime, // Keep original format, don't convert to ISO
          tags: tweet.data.tags,
          featured: tweet.data.featured || false,
          draft: tweet.data.draft || false,
          sourceUrl: tweet.data.sourceUrl,
        },
        body: tweet.body,
        excerpt: tweet.excerpt,
        wordCount: tweet.wordCount,
        readingTime: tweet.readingTime,
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(allTweets.length / limit),
        totalCount: allTweets.length,
        hasNextPage: endIndex < allTweets.length,
        hasPreviousPage: page > 1,
        pageSize: limit,
      },
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error("Error fetching tweets:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to fetch tweets",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
