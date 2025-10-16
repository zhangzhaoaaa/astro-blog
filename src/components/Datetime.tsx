import { LOCALE } from "@config";
import { CalendarIcon } from "@heroicons/react/24/outline";

interface DatetimesProps {
  pubDatetime: string | Date;
  modDatetime: string | Date | undefined | null;
}

interface Props extends DatetimesProps {
  size?: "sm" | "lg";
  className?: string;
  minutesRead?: string; // from remark plugin (e.g., "6 min read")
  wordCount?: number;
}

export default function Datetime({
  pubDatetime,
  modDatetime,
  size = "sm",
  className,
  minutesRead,
  wordCount,
}: Props) {
  return (
    <div
      className={`flex flex-wrap items-center gap-x-0 opacity-80 lg:gap-x-2 ${className}`}
    >
      <CalendarIcon
        className={`${
          size === "sm" ? "scale-90" : "scale-100"
        } inline-block h-6 w-6 min-w-[1.375rem]`}
        aria-hidden="true"
      />
      {modDatetime ? (
        <span className={`italic ${size === "sm" ? "text-sm" : "text-base"}`}>
          更新时间:
        </span>
      ) : (
        <span className="sr-only">Published:</span>
      )}
      <span
        className={`mr-2 italic ${size === "sm" ? "text-sm" : "text-base"}`}
      >
        <FormattedDatetime
          pubDatetime={pubDatetime}
          modDatetime={modDatetime}
        />
      </span>
      {minutesRead && wordCount ? (
        <span className="text-sm text-gray-500">
          阅读时间: {minutesRead} | 字数: {wordCount}
        </span>
      ) : (
        ""
      )}
    </div>
  );
}

const FormattedDatetime = ({ pubDatetime, modDatetime }: DatetimesProps) => {
  const myDatetime = new Date(modDatetime ? modDatetime : pubDatetime);

  const date = myDatetime.toLocaleDateString(LOCALE.langTag, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      <time dateTime={myDatetime.toISOString()}>{date}</time>
    </>
  );
};
