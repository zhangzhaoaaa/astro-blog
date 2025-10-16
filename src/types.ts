import type socialIcons from "@assets/socialIcons";
import { z } from "zod";
// Keep only types needed for content/RSS; playback-specific schemas removed
const RelativeOrAbsoluteUrlSchema = z
  .string()
  .min(1)
  .refine(value => {
    if (value.startsWith("/")) return true;
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  }, "Must be a valid URL or path starting with /");

export type Site = {
  website: string;
  author: string;
  desc: string;
  title: string;
  ogImage?: string;
  lightAndDarkMode: boolean;
  postPerPage: number;
};

export type SocialObjects = {
  name: keyof typeof socialIcons;
  href: string;
  active: boolean;
  linkTitle: string;
}[];

// ============================================================================
// Podcast Types
// ============================================================================

export const PodcastShowSchema = z.object({
  // Identity
  slug: z.string().min(1),
  title: z.string().min(1).max(200),
  rssFeedUrl: z.string().url(),

  // Metadata
  description: z.string(),
  descriptionPlain: z.string(),
  link: z.string().url().optional(),
  language: z.string().optional(),

  // Media
  image: z.string().url(),
  imageLocal: z.string().optional(),

  // Attribution
  author: z.string().min(1),
  copyright: z.string().optional(),

  // Classification
  categories: z.array(z.string()),
  explicit: z.boolean(),

  // Podcast-specific
  episodeCount: z.number().int().nonnegative(),
  lastBuildDate: z.string().datetime(),

  // Internal
  fetchedAt: z.string().datetime(),
  source: z.string(),
});

export type PodcastShow = z.infer<typeof PodcastShowSchema>;

export const PodcastEpisodeSchema = z.object({
  // Identity
  id: z.string(),
  slug: z.string(),
  guid: z.string(),

  // Parent reference
  showSlug: z.string(),

  // Metadata
  title: z.string().min(1).max(300),
  description: z.string(),
  descriptionPlain: z.string(),
  link: z.string().url().optional(),

  // Temporal
  pubDate: z.string().datetime(),

  // Audio file
  enclosure: z.object({
    url: z.string().url(),
    type: z.string(),
    length: z.number().int().nonnegative(),
  }),

  // Podcast-specific
  duration: z.number().int().nonnegative().optional(), // Duration in seconds
  episodeNumber: z.number().int().positive().optional(),
  seasonNumber: z.number().int().positive().optional(),
  explicit: z.boolean().optional(),

  // Internal
  showTitle: z.string(),
  showImage: z.string().url(),
  proxyAudioUrl: RelativeOrAbsoluteUrlSchema.optional(),
});

export type PodcastEpisode = z.infer<typeof PodcastEpisodeSchema>;

// Playback-related schemas removed (EpisodeSnapshot, QueueItem, PlaybackQueue, PlaybackState)
