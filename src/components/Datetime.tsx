import { LOCALE } from "@config";

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
      className={`lg:gap-x-2 flex flex-wrap items-center gap-x-0 opacity-80 ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          size === "sm" ? "scale-90" : "scale-100"
        } inline-block h-6 w-6 min-w-[1.375rem] fill-skin-base`}
        aria-hidden="true"
      >
        <path d="M7 11h2v2H7zm0 4h2v2H7zm4-4h2v2h-2zm0 4h2v2h-2zm4-4h2v2h-2zm0 4h2v2h-2z"></path>
        <path d="M5 22h14c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-2V2h-2v2H9V2H7v2H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2zM19 8l.001 12H5V8h14z"></path>
      </svg>
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
