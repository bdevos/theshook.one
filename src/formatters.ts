import { addDays } from "./date.ts";

export const dateFormatter = (timeZone: string | undefined) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone,
  });

export const timeFormatter = (timeZone: string | undefined) =>
  new Intl.DateTimeFormat("nl-NL", {
    timeStyle: "short",
    timeZone,
  });

export const formatDay = (date: Date, timeZone: string | undefined) => {
  const formatter = dateFormatter(timeZone);
  const formattedDate = formatter.format(date);

  const todayAsString = formatter.format(new Date());
  const yesterdayAsString = formatter.format(addDays(new Date(), -1));

  if (formattedDate === todayAsString) {
    return "Today";
  } else if (formattedDate === yesterdayAsString) {
    return "Yesterday";
  } else {
    return formatter.format(date);
  }
};

export const decodeTitle = (title: string): string => {
  return title
    .replace(/&#8216;/g, "'") // Left single quote
    .replace(/&#8217;/g, "'") // Right single quote
    .replace(/&#8220;/g, '"') // Left double quote
    .replace(/&#8221;/g, '"') // Right double quote
    .replace(/&quot;/g, '"') // Double quote
    .replace(/&apos;/g, "'") // Single quote
    .replace(/&amp;/g, "&") // Ampersand
    .replace(/&#038;/g, "&") // Ampersand
    .replace(/&lt;/g, "<") // Less than
    .replace(/&gt;/g, ">"); // Greater than
};
