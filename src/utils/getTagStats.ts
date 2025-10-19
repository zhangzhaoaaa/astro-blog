import type { CollectionEntry } from "astro:content";
import { slugifyStr } from "@utils/slugify";

export interface TagStat {
  tag: string; // slug
  tagName: string; // human-readable label
  count: number;
}

/**
 * Compute tag statistics from blog posts (excluding draft).
 */
export const getTagStats = (posts: CollectionEntry<"blog">[]): TagStat[] => {
  const counts = new Map<string, { tagName: string; count: number }>();

  for (const post of posts) {
    if (post.data.draft) continue;
    const cleaned = (post.data.tags || [])
      .map(t => (typeof t === "string" ? t.trim() : ""))
      .filter(t => t.length > 0);
    const uniqueTags = Array.from(new Set(cleaned));
    for (const t of uniqueTags) {
      const slug = slugifyStr(t);
      const prev = counts.get(slug);
      if (prev) {
        prev.count += 1;
      } else {
        counts.set(slug, { tagName: t, count: 1 });
      }
    }
  }

  return Array.from(counts.entries())
    .map(([tag, v]) => ({ tag, tagName: v.tagName, count: v.count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
};

export default getTagStats;
