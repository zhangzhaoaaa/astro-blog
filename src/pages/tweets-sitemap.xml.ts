import type { APIRoute } from "astro";
import { getTweetsWithMeta } from "../utils/getTweets";

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
  // Invalid format - return current date as fallback
  console.warn(`Unable to parse date: ${dateString}`);
  return new Date();
}

export const GET: APIRoute = async () => {
  const tweets = await getTweetsWithMeta();

  // Generate sitemap XML for tweets
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${new URL(
      "/tweets",
      import.meta.env.SITE || "https://localhost:4321"
    )}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
  </url>
  ${tweets
    .map(
      (tweet: any) => `
  <url>
    <loc>${new URL(
      `/tweets/${tweet.slug}`,
      import.meta.env.SITE || "https://localhost:4321"
    )}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
    <lastmod>${
      parseDateTime(tweet.data.pubDatetime).toISOString().split("T")[0]
    }</lastmod>
  </url>`
    )
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
