/**
 * EpisodeList Component
 *
 * Renders an episode list with lazy loading batches for long lists.
 */

import { useEffect, useMemo, useState } from "react";
import type { PodcastEpisode } from "../../types";
import EpisodeCard from "./EpisodeCard";

export interface EpisodeListProps {
  episodes: PodcastEpisode[];
}

const BATCH_SIZE = 20;
const LOAD_THRESHOLD_PX = 280;

export default function EpisodeList({ episodes }: EpisodeListProps) {
  const sortedEpisodes = useMemo(() => {
    return [...episodes].sort((a, b) => {
      const dateA = new Date(a.pubDate).getTime();
      const dateB = new Date(b.pubDate).getTime();
      return dateB - dateA;
    });
  }, [episodes]);

  const [visibleCount, setVisibleCount] = useState(
    Math.min(BATCH_SIZE, sortedEpisodes.length)
  );

  useEffect(() => {
    setVisibleCount(Math.min(BATCH_SIZE, sortedEpisodes.length));
  }, [sortedEpisodes.length]);

  useEffect(() => {
    if (sortedEpisodes.length <= BATCH_SIZE) {
      return undefined;
    }

    const handleScroll = () => {
      if (typeof window === "undefined") return;
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;
      const distanceToBottom = scrollHeight - (scrollY + innerHeight);

      if (distanceToBottom < LOAD_THRESHOLD_PX) {
        setVisibleCount(prev =>
          Math.min(prev + BATCH_SIZE, sortedEpisodes.length)
        );
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sortedEpisodes.length]);

  if (sortedEpisodes.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-skin-line bg-skin-card-muted/40 p-6 text-center text-sm text-skin-base/70">
        暂无剧集
      </div>
    );
  }

  const visibleEpisodes = sortedEpisodes.slice(0, visibleCount);

  return (
    <div className="space-y-4">
      {visibleEpisodes.map(episode => (
        <EpisodeCard key={episode.id} episode={episode} />
      ))}

      {visibleCount < sortedEpisodes.length && (
        <div className="flex justify-center pt-4">
          <button
            type="button"
            onClick={() =>
              setVisibleCount(prev =>
                Math.min(prev + BATCH_SIZE, sortedEpisodes.length)
              )
            }
            className="rounded-full border border-skin-line px-4 py-2 text-sm text-skin-accent transition hover:border-skin-accent"
          >
            加载更多剧集
          </button>
        </div>
      )}
    </div>
  );
}
