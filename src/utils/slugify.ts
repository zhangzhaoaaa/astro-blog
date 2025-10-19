import GithubSlugger from "github-slugger";

// Use a fresh slugger instance per call to avoid cross-call state
// adding numeric suffixes like `-1` for repeated inputs during a build.
export const slugifyStr = (str: string) => new GithubSlugger().slug(str);

export const slugifyAll = (arr: string[]) => arr.map(slugifyStr);
