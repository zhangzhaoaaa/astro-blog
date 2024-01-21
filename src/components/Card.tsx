import { slugifyStr } from "@utils/slugify";
import Datetime from "./Datetime";
import { IconCalendarMonth } from "@tabler/icons-react";
import type { PostOrPage } from "@tryghost/content-api";
import "@styles/card.css";
import dayjs from "dayjs";
export interface Props {
  href?: string;
  frontmatter: PostOrPage;
  secHeading?: boolean;
}

const renderTime = (time: string | null) => {
  return (
    <span className="text-sm text-neutral-400">
      更新时间 {dayjs(time).format("YYYY-MM-DD")}
    </span>
  );
};

export default function Card({ href, frontmatter, secHeading = true }: Props) {
  const {
    title = "",
    created_at = "",
    updated_at = "",
    excerpt,
    feature_image,
  } = frontmatter;
  console.log("title....", href, title, created_at, updated_at, feature_image);
  const headerProps = {
    style: { viewTransitionName: slugifyStr(title) },
    className: "text-lg font-medium decoration-dashed hover:underline",
  };

  return (
    <a href={href}>
      <li className="blog-detail-card my-6">
        <div className="card-img">
          <img
            src={
              feature_image ||
              "https://images.unsplash.com/photo-1682685795463-0674c065f315?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wxfDF8YWxsfDF8fHx8fHwyfHwxNzA0OTkyNDg0fA&ixlib=rb-4.0.3&q=80&w=2000"
            }
            alt="descriptive text"
          />
        </div>
        <div className="card-content">
          <div>
            {secHeading ? (
              <h2 {...headerProps}>{title}</h2>
            ) : (
              <h3 {...headerProps}>{title}</h3>
            )}
          </div>
          <p className="line-clamp-2">{excerpt}</p>
          <p>{renderTime(updated_at)}</p>
        </div>
      </li>
    </a>
  );
}
