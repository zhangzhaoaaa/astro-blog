import React, { useState, useEffect, useRef, useCallback } from "react";
import TweetCard from "./TweetCard";
import LoadingSpinner from "./LoadingSpinner";
import type { TweetWithMeta } from "../utils/getTweets";
import type { PaginationInfo } from "../utils/tweetPagination";

export interface TweetGridProps {
  tweets: TweetWithMeta[];
  pagination: PaginationInfo;
  variant?: "default" | "compact";
  enableInfiniteScroll?: boolean;
}

const TweetGrid: React.FC<TweetGridProps> = ({
  tweets: initialTweets,
  pagination: initialPagination,
  variant = "default",
  enableInfiniteScroll = false,
}) => {
  const [tweets, setTweets] = useState(initialTweets);
  const [pagination, setPagination] = useState(initialPagination);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Format tweet data for TweetCard
  const formatTweetForCard = (tweet: TweetWithMeta) => ({
    slug: tweet.slug,
    title: tweet.data.title,
    pubDatetime: tweet.data.pubDatetime,
    tags: tweet.data.tags,
    excerpt: tweet.excerpt,
    wordCount: tweet.wordCount,
    readingTime: tweet.readingTime,
    featured: tweet.data.featured,
    sourceUrl: tweet.data.sourceUrl,
  });

  // Load more tweets for infinite scroll
  const loadMoreTweets = useCallback(async () => {
    if (loading || !pagination.hasNextPage) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/tweets.json?page=${pagination.currentPage + 1}&limit=6`
      );

      if (!response.ok) {
        throw new Error("Failed to load tweets");
      }

      const data = await response.json();

      setTweets(prev => [...prev, ...data.tweets]);
      setPagination(data.pagination);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load more tweets"
      );
    } finally {
      setLoading(false);
    }
  }, [loading, pagination.hasNextPage, pagination.currentPage]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!enableInfiniteScroll) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMoreTweets();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    );

    const target = observerTarget.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [enableInfiniteScroll, loadMoreTweets]);

  const gridClasses = [
    "tweets-grid",
    "grid",
    "grid-cols-1",
    "gap-6",
    "max-w-2xl",
    "mx-auto",
  ].join(" ");

  if (tweets.length === 0) {
    return (
      <div className="tweets-empty py-16 text-center">
        <div className="mb-4 text-6xl">📝</div>
        <h2 className="mb-3 text-2xl font-bold text-skin-accent">还没有推文</h2>
        <p className="text-lg text-skin-muted">快来分享你的第一条推文吧！</p>
      </div>
    );
  }

  return (
    <div className="tweets-container">
      <div className={gridClasses}>
        {tweets.map((tweet, index) => (
          <div
            key={`${tweet.slug}-${index}`}
            className="tweet-enter"
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <TweetCard
              tweet={formatTweetForCard(tweet)}
              variant={variant === "compact" ? "compact" : "default"}
            />
          </div>
        ))}
      </div>

      {/* Infinite Scroll Loading Indicator */}
      {enableInfiniteScroll && (
        <div
          ref={observerTarget}
          className="tweet-loading flex items-center justify-center py-8"
        >
          {loading && (
            <LoadingSpinner
              size="medium"
              text="加载更多推文..."
              variant="accent"
            />
          )}

          {error && (
            <div className="text-center">
              <p className="mb-2 text-red-500">{error}</p>
              <button
                onClick={loadMoreTweets}
                className="rounded bg-skin-accent px-4 py-2 text-skin-inverted transition-colors hover:bg-skin-accent/80"
              >
                重试
              </button>
            </div>
          )}

          {!pagination.hasNextPage &&
            !loading &&
            tweets.length > initialTweets.length && (
              <p className="text-center text-skin-muted">
                🎉 所有推文已加载完毕
              </p>
            )}
        </div>
      )}

      {/* Standard Pagination (if infinite scroll is disabled) */}
      {!enableInfiniteScroll && pagination.totalPages > 1 && (
        <div className="pagination mt-8 flex items-center justify-center gap-2">
          {pagination.hasPreviousPage && (
            <a
              href={`/tweets?page=${pagination.currentPage - 1}`}
              className="rounded border border-skin-line bg-skin-card px-4 py-2 transition-colors hover:bg-skin-accent/10"
            >
              上一页
            </a>
          )}

          <span className="px-4 py-2 text-skin-muted">
            第 {pagination.currentPage} 页，共 {pagination.totalPages} 页
          </span>

          {pagination.hasNextPage && (
            <a
              href={`/tweets?page=${pagination.currentPage + 1}`}
              className="rounded border border-skin-line bg-skin-card px-4 py-2 transition-colors hover:bg-skin-accent/10"
            >
              下一页
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default TweetGrid;
