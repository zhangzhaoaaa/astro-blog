/**
 * Podcast Data Accessor
 *
 * Provides convenient functions to access podcast data
 * Mirrors pattern from getTweets.ts
 * Caches results during build for performance
 */

import type { PodcastShow, PodcastEpisode } from "../types";
import { fetchAllPodcasts, fetchEpisodesForShow } from "./rss/fetchFeeds";

// Cache for build-time memoization
let cachedShows: PodcastShow[] | null = null;
const cachedEpisodes: Map<string, PodcastEpisode[]> = new Map();

/**
 * Get all podcast shows sorted by title
 * @returns Array of PodcastShow entities
 */
export async function getAllPodcasts(): Promise<PodcastShow[]> {
  if (cachedShows) {
    return cachedShows;
  }

  const shows = await fetchAllPodcasts();

  console.log(`[Podcast Accessor] Fetched ${shows.length} shows`);

  // Sort by title alphabetically
  // shows.sort((a, b) => a.title.localeCompare(b.title));

  cachedShows = shows;
  return shows;
}

/**
 * Get a single podcast show by slug
 * @param slug - Show identifier
 * @returns PodcastShow or undefined if not found
 */
export async function getPodcastBySlug(
  slug: string
): Promise<PodcastShow | undefined> {
  const shows = await getAllPodcasts();
  return shows.find(show => show.slug === slug);
}

/**
 * Get all episodes for a specific show, sorted by publication date (newest first)
 * @param showSlug - Show identifier
 * @returns Array of PodcastEpisode entities
 */
export async function getEpisodesByShow(
  showSlug: string
): Promise<PodcastEpisode[]> {
  // Check cache first
  if (cachedEpisodes.has(showSlug)) {
    return cachedEpisodes.get(showSlug)!;
  }

  const episodes = await fetchEpisodesForShow(showSlug);

  // Sort by publication date descending (newest first)
  episodes.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime();
    const dateB = new Date(b.pubDate).getTime();
    return dateB - dateA;
  });

  cachedEpisodes.set(showSlug, episodes);
  return episodes;
}

/**
 * Get a single episode by ID
 * @param episodeId - Episode identifier (format: "show-slug-episode-slug")
 * @returns PodcastEpisode or undefined if not found
 */
export async function getEpisodeById(
  episodeId: string
): Promise<PodcastEpisode | undefined> {
  // Extract show slug from episode ID
  const showSlug = episodeId.split("-")[0];

  if (!showSlug) {
    return undefined;
  }

  const episodes = await getEpisodesByShow(showSlug);
  return episodes.find(ep => ep.id === episodeId);
}

/**
 * Get total episode count across all shows
 * @returns Total number of episodes
 */
export async function getTotalEpisodeCount(): Promise<number> {
  const shows = await getAllPodcasts();
  return shows.reduce((sum, show) => sum + show.episodeCount, 0);
}

/**
 * Search podcasts and episodes by query
 * @param query - Search query
 * @returns Object with matching shows and episodes
 */
export async function searchPodcasts(query: string): Promise<{
  shows: PodcastShow[];
  episodes: PodcastEpisode[];
}> {
  const lowerQuery = query.toLowerCase();
  const shows = await getAllPodcasts();

  // Search shows
  const matchingShows = shows.filter(
    show =>
      show.title.toLowerCase().includes(lowerQuery) ||
      show.descriptionPlain.toLowerCase().includes(lowerQuery) ||
      show.author.toLowerCase().includes(lowerQuery)
  );

  // Search episodes across all shows
  const allEpisodes: PodcastEpisode[] = [];
  for (const show of shows) {
    const episodes = await getEpisodesByShow(show.slug);
    allEpisodes.push(...episodes);
  }

  const matchingEpisodes = allEpisodes.filter(
    episode =>
      episode.title.toLowerCase().includes(lowerQuery) ||
      episode.descriptionPlain.toLowerCase().includes(lowerQuery)
  );

  return {
    shows: matchingShows,
    episodes: matchingEpisodes,
  };
}
