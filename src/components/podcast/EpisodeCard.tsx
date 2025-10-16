/**
 * EpisodeCard Component
 *
 * Displays individual podcast episode information with play controls.
 */

import { useState } from "react";
import {
  ClockIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import type { PodcastEpisode } from "../../types";

export interface EpisodeCardProps {
  episode: PodcastEpisode;
}

function formatDuration(duration?: number): string {
  if (duration === undefined) return "--:--";
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;

  const pad = (value: number) => value.toString().padStart(2, "0");
  if (hours > 0) {
    return `${hours}:${pad(minutes)}:${pad(seconds)}`;
  }
  return `${minutes}:${pad(seconds)}`;
}

function formatDate(isoDate: string): string {
  try {
    const date = new Date(isoDate);
    if (Number.isNaN(date.getTime())) return isoDate;
    return new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (error) {
    console.error("[EpisodeCard] Failed to format date", error);
    return isoDate;
  }
}

export default function EpisodeCard({ episode }: EpisodeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  // Playback removed: no play or queue interactions

  const toggleDescription = () => {
    setIsExpanded(prev => !prev);
  };

  const descriptionText = episode.descriptionPlain.trim();
  const shouldShowToggle = descriptionText.length > 140;
  const visibleDescription = isExpanded
    ? descriptionText
    : descriptionText.slice(0, 140);

  return (
    <article className="group rounded-lg border border-skin-line bg-skin-card p-4 transition hover:border-skin-accent">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {/* Episode info */}
        <div className="flex-1 space-y-2">
          <header className="space-y-1">
            <h3 className="text-lg font-semibold leading-tight text-skin-accent">
              {episode.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-skin-base/70">
              <span>{formatDate(episode.pubDate)}</span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4 fill-none" />
                {formatDuration(episode.duration)}
              </span>
              {episode.explicit && (
                <span className="rounded bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-500 dark:bg-red-500/10">
                  Explicit
                </span>
              )}
            </div>
          </header>

          {/* Description */}
          {descriptionText && (
            <div className="text-sm leading-relaxed text-skin-base/80">
              {visibleDescription}
              {shouldShowToggle && !isExpanded && "…"}
              {shouldShowToggle && (
                <button
                  type="button"
                  onClick={toggleDescription}
                  className="ml-2 text-sm font-medium text-skin-accent underline-offset-2 hover:underline"
                >
                  {isExpanded ? "收起" : "展开"}
                </button>
              )}
            </div>
          )}

          {/* Secondary actions */}
          <div className="flex flex-wrap gap-2 pt-2 text-sm">
            {episode.link && (
              <a
                href={episode.link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 rounded border border-skin-line px-3 py-1 text-skin-accent transition hover:border-skin-accent"
              >
                原文链接
                <ArrowTopRightOnSquareIcon className="h-3 w-3 fill-none" />
              </a>
            )}
            <span className="inline-flex items-center gap-1 rounded bg-skin-card-muted px-3 py-1 text-xs uppercase tracking-wide text-skin-base/70">
              #{episode.showTitle}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
