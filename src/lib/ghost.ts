import GhostContentAPI from "@tryghost/content-api";
import { CONSTANT } from "./constant";

// 使用站点凭证创建 API 实例
export const ghostClient = new GhostContentAPI({
  url: "https://zeromikede-shi-guang-ji.ghost.io", // 这是 Ghost 站点运行在本地环境中的默认 URL
  key: import.meta.env.CONTENT_API_KEY,
  version: "v3",
});
/**
 * 分页获取所有博客信息
 */
export const getAllPosts = async (page: number) => {
  return await ghostClient.posts
    .browse({
      limit: CONSTANT.pageSize,
      page,
    })
    .catch(err => {
      console.error(err);
    });
};

/**
 * 分页获取所有博客信息
 */
export const getAllPostsForSlug = async () => {
  return await ghostClient.posts
    .browse({
      limit: "all",
    })
    .catch(err => {
      console.error(err);
    });
};

export const getBlogDetail = async (params: any) => {
  const { slug } = params;
  return await ghostClient.posts
    .read({
      slug: slug,
    })
    .catch(err => {
      console.error(err);
    });
};
