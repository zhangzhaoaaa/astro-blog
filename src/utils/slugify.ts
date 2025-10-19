import GithubSlugger from "github-slugger";

// Slugify a single string. Accepts an optional slugger to support deduping across a batch.
export const slugifyStr = (str: string, slugger?: GithubSlugger) =>
  (slugger ?? new GithubSlugger()).slug(str);

// Slugify an array of strings using a single slugger instance to ensure uniqueness within the array
export const slugifyAll = (arr: string[]) => {
  const slugger = new GithubSlugger();
  return arr.map(s => slugifyStr(s, slugger));
};
