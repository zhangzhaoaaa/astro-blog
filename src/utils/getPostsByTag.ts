import type { CollectionEntry } from "astro:content";
import getSortedPosts from "./getSortedPosts";
import { slugifyAll, slugifyStr } from "./slugify";

const getPostsByTag = (posts: CollectionEntry<"blog">[], tag: string) => {
  // Normalize incoming tag param to slug to match stored slugs from post tags
  const tagSlug = slugifyStr(tag);
  return getSortedPosts(
    posts?.filter(post => slugifyAll(post.data.tags).includes(tagSlug)) || []
  );
};

export default getPostsByTag;
