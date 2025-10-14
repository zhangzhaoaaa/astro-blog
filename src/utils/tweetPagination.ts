import type { TweetWithMeta } from "./getTweets";

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageSize: number;
}

export interface PaginatedTweets {
  tweets: TweetWithMeta[];
  pagination: PaginationInfo;
}

/**
 * Paginate an array of tweets
 */
export function paginateTweets(
  tweets: TweetWithMeta[],
  page: number = 1,
  pageSize: number = 20
): PaginatedTweets {
  const totalCount = tweets.length;
  const totalPages = Math.ceil(totalCount / pageSize);
  const currentPage = Math.max(1, Math.min(page, totalPages));

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedTweets = tweets.slice(startIndex, endIndex);

  return {
    tweets: paginatedTweets,
    pagination: {
      currentPage,
      totalPages,
      totalCount,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
      pageSize,
    },
  };
}

/**
 * Get page numbers for pagination navigation
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

/**
 * Calculate infinite scroll batches
 */
export function getInfiniteScrollBatch(
  tweets: TweetWithMeta[],
  batchNumber: number,
  batchSize: number = 10
): TweetWithMeta[] {
  const startIndex = (batchNumber - 1) * batchSize;
  const endIndex = startIndex + batchSize;
  return tweets.slice(startIndex, endIndex);
}

/**
 * Check if more batches are available for infinite scroll
 */
export function hasMoreBatches(
  totalCount: number,
  currentBatch: number,
  batchSize: number = 10
): boolean {
  return currentBatch * batchSize < totalCount;
}
