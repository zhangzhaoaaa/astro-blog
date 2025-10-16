/**
 * RSS Parser Wrapper
 *
 * Wraps rss-parser to fetch and parse podcast RSS feeds
 * Handles parsing errors gracefully
 */

import Parser from "rss-parser";

// Initialize parser with custom fields to improve compatibility with various podcast feeds (e.g., Ximalaya)
const parser = new Parser({
  customFields: {
    // Expose raw iTunes tags and common image for feeds that use them
    feed: [
      "itunes:author",
      "itunes:image",
      "itunes:summary",
      "itunes:explicit",
      "image",
    ],
    // Expose raw iTunes and media fields on items
    item: [
      "itunes:duration",
      "itunes:episode",
      "itunes:season",
      "itunes:explicit",
      "content:encoded",
      "media:content",
      "enclosures",
    ],
  },
} as any);

export type ParsedFeed = any;
export type ParsedItem = any;

/**
 * Parse RSS feed from URL
 * @param url - RSS feed URL
 * @returns Parsed feed data or null if parsing fails
 */
export async function parseRSSFeed(url: string): Promise<ParsedFeed | null> {
  try {
    const feed = await parser.parseURL(url);
    return feed;
  } catch (error) {
    // Some providers (e.g., Ximalaya) reject default requests with 406.
    // Fallback: fetch XML with browser-like headers and parse from string.
    console.warn(
      `[RSS Parser] parseURL failed for ${url}. Falling back to manual fetch...`,
      error
    );
    try {
      const headers: Record<string, string> = {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36",
        Accept: "application/rss+xml, application/xml;q=0.9, */*;q=0.8",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
      };
      // Use origin as Referer when possible
      try {
        const origin = new URL(url).origin;
        headers["Referer"] = origin + "/";
      } catch (_) {
        // ignore URL parse issues
      }

      const res = await fetch(url, { headers });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const xml = await res.text();
      const feed = await (parser as any).parseString(xml);
      return feed;
    } catch (fallbackErr) {
      console.error(
        `[RSS Parser] Fallback fetch failed for: ${url}`,
        fallbackErr
      );
      return null;
    }
  }
}

/**
 * Parse duration string to seconds
 * Supports formats: HH:MM:SS, MM:SS, or raw seconds
 * @param duration - Duration string from RSS feed
 * @returns Duration in seconds, or undefined if invalid
 */
export function parseDuration(duration?: string): number | undefined {
  if (!duration) return undefined;

  // If already a number (seconds)
  const asNumber = parseInt(duration, 10);
  if (!isNaN(asNumber)) return asNumber;

  // Parse HH:MM:SS or MM:SS format
  const parts = duration.split(":").map(p => parseInt(p, 10));
  if (parts.some(isNaN)) return undefined;

  if (parts.length === 3) {
    // HH:MM:SS
    const [hours, minutes, seconds] = parts;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    // MM:SS
    const [minutes, seconds] = parts;
    return minutes * 60 + seconds;
  }

  return undefined;
}

/**
 * Strip HTML tags from text
 * @param html - HTML string
 * @returns Plain text
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp;
    .replace(/&amp;/g, "&") // Replace &amp;
    .replace(/&lt;/g, "<") // Replace &lt;
    .replace(/&gt;/g, ">") // Replace &gt;
    .replace(/&quot;/g, '"') // Replace &quot;
    .replace(/&#39;/g, "'") // Replace &#39;
    .trim();
}
