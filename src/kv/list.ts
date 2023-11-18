import { CategoryKey } from "../feed/categories.ts";
import { formatDay } from "../formatters.ts";
import { ENTRIES, KvEntry } from "./kv.ts";

export const listEntriesByDate = async (
  kv: Deno.Kv,
  disabledCategories: CategoryKey[],
) => {
  const res = kv.list<KvEntry>({ prefix: [ENTRIES] });
  const entries: KvEntry[] = [];
  for await (const { value } of res) {
    if (
      !value.categories.some((category) =>
        disabledCategories.includes(category)
      )
    ) {
      entries.push(value);
    }
  }

  return splitByDay(entries);
};

const splitByDay = (entries: KvEntry[]) => {
  return entries.toSorted((a, b) =>
    b.published.getTime() - a.published.getTime()
  ).reduce((acc, entry) => {
    const date = formatDay(entry.published);
    return { ...acc, [date]: [...acc[date] ?? [], entry] };
  }, {} as Record<string, KvEntry[]>);
};
