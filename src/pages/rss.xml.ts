import rss from "@astrojs/rss";
import { SITE } from "@config";
import { getAllPostsForSlug } from "lib/ghost";

export async function GET() {
  const posts = await getAllPostsForSlug();
  return rss({
    title: SITE.title,
    description: SITE.desc,
    site: SITE.website,
    items: posts.map(data => ({
      link: `posts/${data.slug}`,
      title: data.title,
      description: data.excerpt,
      pubDate: new Date(data.updated_at ?? data.created_at),
    })),
  });
}
