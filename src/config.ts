import type { Site, SocialObjects } from "./types";

export const SITE: Site = {
  website: "https://zeromike.live/",
  author: "zeromike",
  desc: "终身学习者",
  title: "zeromike",
  ogImage: "favicon.png",
  lightAndDarkMode: true,
  postPerPage: 5,
};

export const LOCALE = {
  lang: "zh", // html lang code. Set this empty and default will be "en"
  langTag: ["zh-CN"], // BCP 47 Language Tags. Set this empty [] to use the environment default
} as const;

export const LOGO_IMAGE = {
  enable: true,
  width: 20,
  height: 20,
};

export const SOCIALS: SocialObjects = [
  {
    name: "Twitter",
    href: "https://twitter.com/coolzeromike",
    linkTitle: `${SITE.title} on Twitter`,
    active: true,
  },
  {
    name: "Mail",
    href: "mailto:tellig9527@gmail.com",
    linkTitle: `发邮件 ${SITE.title}`,
    active: true,
  },
];
