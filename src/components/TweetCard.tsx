import React from "react";
import {
  ClockIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

export interface TweetCardProps {
  tweet: {
    slug: string;
    title?: string;
    pubDatetime: string;
    tags: string[];
    excerpt: string;
    wordCount: number;
    readingTime: number;
    featured?: boolean;
    sourceUrl: string;
  };
  showActions?: boolean;
  variant?: "default" | "compact" | "featured";
}

const TweetCard: React.FC<TweetCardProps> = ({
  tweet,
  variant = "default",
}) => {
  const formatDate = (dateString: string) => {
    // 直接返回原始字符串，因为它已经是您想要的格式
    return dateString;
  };

  const convertToISOString = (dateString: string) => {
    // 解析 "2025-10-13 13:30" 格式
    const match = dateString.match(
      /(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})/
    );
    if (match) {
      const [, year, month, day, hour, minute] = match;
      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );
      return date.toISOString();
    }
    return new Date().toISOString(); // fallback
  };

  const cardClasses = [
    "tweet-card",
    "bg-skin-card",
    "border",
    "border-skin-line",
    "rounded-lg",
    "p-6",
    "transition-all",
    "duration-300",
    "hover:shadow-md",
    "hover:border-skin-accent/20",
    "hover:-translate-y-1",
    variant === "featured" && "featured",
    variant === "compact" && "compact",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article className={cardClasses}>
      {tweet.featured && (
        <div className="mb-3 flex items-center gap-1 text-sm text-skin-accent">
          <span>✨</span>
          <span>精选推文</span>
        </div>
      )}

      {tweet.title && tweet.title.trim() && (
        <header className="tweet-header">
          <h2 className="mb-3 text-lg font-semibold text-skin-accent">
            {tweet.title}
          </h2>
        </header>
      )}

      <div className="tweet-content mb-4 leading-relaxed text-skin-base">
        <p>{tweet.excerpt}</p>
      </div>

      {tweet.tags.length > 0 && (
        <div className="tweet-tags mb-4">
          {tweet.tags.map(tag => (
            <span
              key={tag}
              className="mb-1 mr-2 inline-block rounded-full bg-skin-accent/10 px-2 py-1 text-xs text-skin-accent transition-colors hover:bg-skin-accent/20"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="tweet-meta flex items-center justify-between text-sm text-skin-muted">
        <time
          dateTime={convertToISOString(tweet.pubDatetime)}
          className="flex items-center gap-1 p-2"
        >
          <ClockIcon className="h-4 w-4 fill-none text-skin-muted" />
          {formatDate(tweet.pubDatetime)}
        </time>

        <div className="tweet-actions flex items-center gap-2">
          {/* <a
            href={`/tweets/${tweet.slug}`}
            className="tweet-action p-2 rounded-lg hover:bg-skin-accent/10 focus:bg-skin-accent/10 transition-colors focus-outline text-skin-muted hover:text-skin-accent"
            title="查看详情"
            aria-label={`查看推文详情: ${tweet.title || tweet.excerpt.substring(0, 30)}...`}
          >
            <DocumentTextIcon className="w-4 h-4 fill-none" />
          </a> */}

          <a
            href={tweet.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="tweet-action focus-outline rounded-lg p-2 text-skin-muted transition-colors hover:bg-skin-accent/10 hover:text-skin-accent focus:bg-skin-accent/10"
            title="查看原始推文"
            aria-label="在新标签页中打开原始推文"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4 fill-none" />
          </a>
        </div>
      </div>
    </article>
  );
};

export default TweetCard;
