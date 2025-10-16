import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type TweetEntry = CollectionEntry<"tweets">;

export interface TweetWithMeta extends TweetEntry {
  excerpt: string;
  wordCount: number;
  readingTime: number;
}

/**
 * Parse date format "2025-10-13 13:30" or "2025-9-23 12:59" to Date object
 */
function parseDateTime(dateString: string): Date {
  // Handle "YYYY-MM-DD HH:MM" or "YYYY-M-D H:MM" format
  const match = dateString.match(
    /(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})/
  );
  if (match) {
    const [, year, month, day, hour, minute] = match;
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1, // Month is 0-indexed
      parseInt(day),
      parseInt(hour),
      parseInt(minute)
    );

    // Check if the date is valid
    if (!isNaN(date.getTime())) {
      return date;
    }
  }

  // Fallback: try to parse as regular date
  const fallbackDate = new Date(dateString);
  if (!isNaN(fallbackDate.getTime())) {
    return fallbackDate;
  }

  // If all parsing fails, return current date
  console.warn(`Failed to parse date: ${dateString}, using current date`);
  return new Date();
}

/**
 * Get all published tweets, sorted by publication date (newest first)
 */
export async function getTweets(): Promise<TweetEntry[]> {
  const tweets = await getCollection("tweets", ({ data }) => {
    return !data.draft;
  });

  return tweets.sort((a, b) => {
    const dateA = parseDateTime(a.data.pubDatetime);
    const dateB = parseDateTime(b.data.pubDatetime);
    return dateB.getTime() - dateA.getTime();
  });
}

/**
 * Get tweets with additional metadata (excerpt, word count, reading time)
 */
export async function getTweetsWithMeta(): Promise<TweetWithMeta[]> {
  const tweets = await getTweets();

  return tweets.map(tweet => {
    const content = tweet.body || "";
    const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200)); // 200 words per minute
    const excerpt =
      content.length > 300 ? content.substring(0, 300).trim() + "..." : content;

    return {
      ...tweet,
      excerpt,
      wordCount,
      readingTime,
    };
  });
}

/**
 * Get a specific tweet by slug
 */
export async function getTweetBySlug(
  slug: string
): Promise<TweetEntry | undefined> {
  const tweets = await getTweets();
  return tweets.find(tweet => tweet.slug === slug);
}

/**
 * Get featured tweets
 */
export async function getFeaturedTweets(): Promise<TweetEntry[]> {
  const tweets = await getTweets();
  return tweets.filter(tweet => tweet.data.featured);
}

/**
 * Get tweets by tag
 */
export async function getTweetsByTag(tag: string): Promise<TweetEntry[]> {
  const tweets = await getTweets();
  return tweets.filter(tweet =>
    tweet.data.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

/**
 * Get all unique tags from tweets
 */
export async function getTweetTags(): Promise<string[]> {
  const tweets = await getTweets();
  const tags = new Set<string>();

  tweets.forEach(tweet => {
    tweet.data.tags.forEach(tag => tags.add(tag));
  });

  return Array.from(tags).sort();
}
