import type { APIRoute } from "astro";
import { getTweetsWithMeta } from "../../utils/getTweets";

// Pagination defaults and guards
const DEFAULT_LIMIT = 6; // Reasonable page size default
const MAX_LIMIT = 100; // Hard cap to prevent large requests

export const GET: APIRoute = async ({ url }) => {
  try {
    const searchParams = new URLSearchParams(url.search);
    // Parse and validate page
    const rawPage = searchParams.get("page");
    let page = Number.parseInt(rawPage ?? "", 10);
    if (Number.isNaN(page) || page <= 0) {
      page = 1;
    }

    // Parse, validate, and clamp limit
    const rawLimit = searchParams.get("limit");
    let limit = Number.parseInt(rawLimit ?? "", 10);
    if (Number.isNaN(limit) || limit <= 0) {
      limit = DEFAULT_LIMIT;
    }
    // Enforce maximum limit to avoid heavy queries
    limit = Math.min(limit, MAX_LIMIT);

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
