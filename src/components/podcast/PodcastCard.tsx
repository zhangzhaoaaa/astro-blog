/**
 * PodcastCard Component
 *
 * Displays a podcast show card with cover art, title, and author
 * Navigates to show detail page on click
 */

import type { PodcastShow } from "../../types";
import { MicrophoneIcon } from "@heroicons/react/24/outline";

interface Props {
  show: PodcastShow;
}

export default function PodcastCard({ show }: Props) {
  return (
    <a
      href={`/podcasts/${show.slug}`}
      className="group block overflow-hidden rounded-lg border border-skin-line bg-skin-card p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
    >
      {/* Cover Image */}
      <div className="mb-4 aspect-square w-full overflow-hidden rounded-md bg-skin-card-muted">
        <img
          src={show.image}
          alt={`${show.title} cover art`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
          onError={e => {
            // Fallback to placeholder if image fails to load
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/assets/podcast-placeholder.svg";
          }}
        />
      </div>

      {/* Show Info */}
      <div className="space-y-2">
        {/* Title */}
        <h3 className="line-clamp-2 text-lg font-semibold text-skin-accent transition-colors group-hover:text-skin-accent">
          {show.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-skin-base opacity-80">{show.author}</p>

        {/* Episode Count */}
        <div className="flex items-center gap-2 text-xs text-skin-base opacity-60">
          <MicrophoneIcon className="h-4 w-4" />
          <span>{show.episodeCount} 集</span>
        </div>

        {/* Explicit Badge (if applicable) */}
        {show.explicit && (
          <span className="inline-block rounded bg-red-500/20 px-2 py-0.5 text-xs font-medium text-red-500 dark:bg-red-500/10 dark:text-red-400">
            Explicit
          </span>
        )}
      </div>
    </a>
  );
}
