import UpdatedIcon from "./icons/UpdatedIcon.tsx";
import { type LastUpdated } from "../src/kv/lastUpdated.ts";

type Props = {
  lastUpdated: LastUpdated | null;
};

const parseUpdated = ({ minutes, hours }: LastUpdated): string => {
  if (minutes <= 1) {
    return "Just now";
  } else if (hours < 1) {
    return `${minutes} minutes ago`;
  } else if (hours === 1) {
    return "an hour ago";
  } else {
    return `${hours} hours ago`;
  }
};

export default function Footer({ lastUpdated }: Props) {
  return (
    <div class="flex flex-row justify-center items-center pt-6 pb-8 text-xs text-neutral-700 dark:text-neutral-500 gap-x-8">
      {lastUpdated && (
        <span class="flex flex-row items-center gap-x-1">
          <UpdatedIcon /> {parseUpdated(lastUpdated)}
        </span>
      )}
      <a href="/about">About</a>
    </div>
  );
}
