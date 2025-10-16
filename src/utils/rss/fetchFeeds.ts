/**
 * RSS Feed Fetcher
 *
 * Fetches RSS feeds from configured sources and transforms them into typed entities
 * Handles fetch failures gracefully and provides placeholder data
 */

import { PODCAST_SOURCES, type PodcastSource } from "@config";
import type { PodcastShow, PodcastEpisode } from "../../types";
import { parseRSSFeed, parseDuration, stripHtml } from "./parseRSS";
import { slug as slugify } from "github-slugger";

/**
 * Fetch all enabled podcast shows from configured RSS sources
 * @returns Array of PodcastShow entities (empty array if all fail)
 */
export async function fetchAllPodcasts(): Promise<PodcastShow[]> {
  const enabledSources = PODCAST_SOURCES.filter(source => source.enabled);

  console.log(`[RSS Fetcher] Fetching ${enabledSources.length} RSS feeds...`);

  const fetchPromises = enabledSources.map(async source => {
    const feed = await parseRSSFeed(source.url);
    if (!feed) {
      console.warn(`[RSS Fetcher] Skipping source: ${source.name}`);
      return null;
    }
    return transformFeedToShow(feed, source);
  });

  const results = await Promise.all(fetchPromises);
  const shows = results.filter((show): show is PodcastShow => show !== null);

  console.log(`[RSS Fetcher] Successfully fetched ${shows.length} shows`);

  return shows;
}

/**
 * Transform RSS feed to PodcastShow entity
 */
export function transformFeedToShow(
  feed: any,
  source: PodcastSource
): PodcastShow {
  // Extract iTunes metadata if available (handle raw tags too)
  const itunesAuthor =
    feed.itunes?.author || feed["itunes:author"] || feed.author || "Unknown";
  const itunesImage =
    feed.itunes?.image?.href ||
    feed.itunes?.image ||
    feed["itunes:image"]?.href ||
    feed["itunes:image"] ||
    feed.image?.url ||
    feed.image ||
    "/assets/podcast-placeholder.svg";
  const itunesSummary =
    feed.itunes?.summary || feed["itunes:summary"] || feed.description || "";
  const explicit =
    (feed.itunes?.explicit || feed["itunes:explicit"] || "no")
      .toString()
      .toLowerCase() === "yes";

  // Log minimal feed metadata for debugging
  console.log(`[RSS Fetcher] Processing feed: ${feed.title || "Untitled"}`);

  // Get categories - iTunes categories can be nested
  const categories: string[] = [];
  if (feed.itunes?.categories) {
    feed.itunes.categories.forEach((cat: any) => {
      if (typeof cat === "string") {
        categories.push(cat);
      } else if (cat?.$ && cat.$.text) {
        categories.push(cat.$.text);
      }
    });
  }

  return {
    slug: source.slug,
    title: feed.title || source.name,
    rssFeedUrl: source.url,
    description: feed.description || "",
    descriptionPlain: stripHtml(itunesSummary || feed.description || ""),
    link: feed.link || undefined,
    language: feed.language || "en",
    image: itunesImage,
    imageLocal: undefined,
    author: itunesAuthor,
    copyright: feed.copyright || undefined,
    categories: categories,
    explicit: explicit,
    episodeCount: feed.items?.length || 0,
    lastBuildDate: feed.lastBuildDate || new Date().toISOString(),
    fetchedAt: new Date().toISOString(),
    source: source.slug,
  };
}

/**
 * Transform RSS item to PodcastEpisode entity
 */
export function transformItemToEpisode(
  item: any,
  show: PodcastShow
): PodcastEpisode | null {
  // Resolve audio enclosure: standard RSS enclosure, media:content, or first of enclosures
  const mediaContent = (item as any)["media:content"] ?? item.mediaContent;
  const mediaArr = Array.isArray(mediaContent)
    ? mediaContent
    : mediaContent
      ? [mediaContent]
      : [];
  const enclosureUrl =
    item.enclosure?.url ||
    (mediaArr.length ? mediaArr[0]?.url : undefined) ||
    (Array.isArray(item.enclosures) ? item.enclosures[0]?.url : undefined);

  if (!enclosureUrl) {
    console.warn(`[RSS Fetcher] Skipping episode without audio: ${item.title}`);
    return null;
  }

  const episodeSlug = slugify(item.title || "untitled");
  const episodeId = `${show.slug}-${episodeSlug}`;

  // Parse duration
  const durationString =
    item.itunes?.duration || item["itunes:duration"] || item.itunesDuration;
  const duration = parseDuration(durationString);

  // Parse episode/season numbers
  const episodeNumber = item.itunes?.episode
    ? parseInt(item.itunes.episode, 10)
    : item["itunes:episode"]
      ? parseInt(item["itunes:episode"], 10)
      : item.itunesEpisode
        ? parseInt(item.itunesEpisode, 10)
        : undefined;
  const seasonNumber = item.itunes?.season
    ? parseInt(item.itunes.season, 10)
    : item["itunes:season"]
      ? parseInt(item["itunes:season"], 10)
      : item.itunesSeason
        ? parseInt(item.itunesSeason, 10)
        : undefined;

  // Check explicit content
  const explicit =
    (
      item.itunes?.explicit ||
      item["itunes:explicit"] ||
      item.itunesExplicit ||
      "no"
    )
      .toString()
      .toLowerCase() === "yes";

  return {
    id: episodeId,
    slug: episodeSlug,
    guid: item.guid || item.id || episodeId,
    showSlug: show.slug,
    title: item.title || "Untitled Episode",
    description: item.contentEncoded || item.content || item.description || "",
    descriptionPlain: stripHtml(
      item.contentEncoded || item.content || item.description || ""
    ),
    link: item.link || undefined,
    pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
    enclosure: {
      url: enclosureUrl,
      type:
        item.enclosure?.type ||
        (mediaArr.length ? mediaArr[0]?.type : undefined) ||
        "audio/mpeg",
      length: parseInt(item.enclosure?.length || "0", 10),
    },
    duration: duration,
    episodeNumber: episodeNumber,
    seasonNumber: seasonNumber,
    explicit: explicit,
    showTitle: show.title,
    showImage: show.image,
    // Audio proxy removed; keep original enclosure URL only
    proxyAudioUrl: undefined,
  };
}

/**
 * Fetch all episodes for a specific show
 * @param showSlug - Show identifier
 * @returns Array of PodcastEpisode entities
 */
export async function fetchEpisodesForShow(
  showSlug: string
): Promise<PodcastEpisode[]> {
  const source = PODCAST_SOURCES.find(s => s.slug === showSlug && s.enabled);

  if (!source) {
    console.warn(`[RSS Fetcher] Show not found or disabled: ${showSlug}`);
    return [];
  }

  const feed = await parseRSSFeed(source.url);
  if (!feed || !feed.items) {
    return [];
  }

  const show = transformFeedToShow(feed, source);
  const episodes = feed.items
    .map((item: any) => transformItemToEpisode(item, show))
    .filter((ep: PodcastEpisode | null): ep is PodcastEpisode => ep !== null);

  return episodes;
}
