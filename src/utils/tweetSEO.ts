export interface TweetStructuredData {
  "@context": "https://schema.org";
  "@type": "BlogPosting";
  headline: string;
  datePublished: string;
  dateModified?: string;
  author: {
    "@type": "Person";
    name: string;
  };
  publisher: {
    "@type": "Organization";
    name: string;
  };
  mainEntityOfPage: {
    "@type": "WebPage";
    "@id": string;
  };
  keywords?: string[];
  wordCount?: number;
  url: string;
}

export function generateTweetStructuredData(
  tweet: {
    slug: string;
    title?: string;
    pubDatetime: Date;
    tags?: string[];
    wordCount?: number;
  },
  siteConfig: {
    title: string;
    author: string;
    baseUrl: string;
  }
): TweetStructuredData {
  const tweetUrl = `${siteConfig.baseUrl}/tweets/${tweet.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: tweet.title || "Untitled Tweet",
    datePublished: tweet.pubDatetime.toISOString(),
    dateModified: tweet.pubDatetime.toISOString(),
    author: {
      "@type": "Person",
      name: siteConfig.author,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.title,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": tweetUrl,
    },
    keywords: tweet.tags || [],
    wordCount: tweet.wordCount || 0,
    url: tweetUrl,
  };
}

export function generateTweetsListStructuredData(
  tweets: Array<{
    slug: string;
    title?: string;
    pubDatetime: Date;
    tags?: string[];
    excerpt?: string;
  }>,
  siteConfig: {
    title: string;
    baseUrl: string;
  }
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "我的推文",
    description: "分享快速想法和更新的地方",
    url: `${siteConfig.baseUrl}/tweets`,
    numberOfItems: tweets.length,
    itemListElement: tweets.map((tweet, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "BlogPosting",
        "@id": `${siteConfig.baseUrl}/tweets/${tweet.slug}`,
        headline: tweet.title || "Untitled Tweet",
        datePublished: tweet.pubDatetime.toISOString(),
        url: `${siteConfig.baseUrl}/tweets/${tweet.slug}`,
        description: tweet.excerpt || "",
      },
    })),
  };
}
