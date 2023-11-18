import { parseFeed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import {
  categoriesArray,
  type CategoryKey,
  theVergeFeedUrl,
} from "./categories.ts";
import { type FeedEntry } from "https://deno.land/x/rss@0.5.8/src/types/mod.ts";
import { type KvEntryId } from "../kv/kv.ts";

export const getEntries = async () => {
  const settled = await Promise.allSettled(getEntriesPromises());
  const entries = settled
    .flatMap(settledResult)
    .filter((entry): entry is KvEntryId => entry !== null);

  return deduplicateCategories(entries);
};

const getEntriesPromises = () => {
  return (categoriesArray()).map(
    async ({ category }) => {
      const entries = await getEntriesByCategory(category);
      return entries.map((entry) => toKvEntry(entry, category));
    },
  );
};

const deduplicateCategories = (entries: KvEntryId[]) => {
  return entries.reduce((acc, entry) => {
    const knownIndex = acc.findIndex(({ id }) => entry.id === id);
    if (knownIndex >= 0) {
      acc[knownIndex] = {
        id: acc[knownIndex].id,
        entry: {
          ...acc[knownIndex].entry,
          categories: [
            ...acc[knownIndex].entry.categories,
            ...entry.entry.categories,
          ],
        },
      };
      return acc;
    }
    return [...acc, entry];
  }, [] as KvEntryId[]);
};

const getEntriesByCategory = async (category: CategoryKey) => {
  try {
    const response = await fetch(theVergeFeedUrl(category));
    const xml = await response.text();
    const { entries } = await parseFeed(xml);
    return entries;
  } catch {
    // The feed lookup seems to fail every once in a while, when that is the case the server responds with
    // content-length: 0
    // content-type: text/html
    // It seems be be an issue with the feed and after some time the feed seems to work again. I tried
    // a bunch of things, but if even happens in the browser every once in a while.
    console.error(`getEntriesByCategory ${category} failed`);
    return [];
  }
};

const toKvEntry = (
  entry: FeedEntry,
  category: CategoryKey,
): KvEntryId | null => {
  const { id, published } = entry;
  const href = entry.links.at(-1)?.href;
  const title = entry.title?.value;

  if (!href || !title || !published) {
    return null;
  }

  return {
    id,
    entry: { categories: [category], href, title, published },
  };
};

const settledResult = (
  result: PromiseSettledResult<(KvEntryId | null)[]>,
) => {
  if (result.status === "rejected") {
    console.error(`settledResult rejected`, result.reason);
    return [];
  }
  return result.value;
};
