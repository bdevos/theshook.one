import { parseFeed } from "https://deno.land/x/rss@0.5.8/mod.ts";
import {
  categoriesArray,
  type CategoryKey,
  mergeCategories,
  theVergeFeedUrl,
} from "./categories.ts";
import { type FeedEntry } from "https://deno.land/x/rss@0.5.8/src/types/mod.ts";
import { type KvEntryId } from "../kv/kv.ts";
import { decodeTitle } from "../formatters.ts";

export const getEntries = async (
  prevEntryCategories: Record<string, CategoryKey[]>,
) => {
  const settled = await Promise.allSettled(getEntriesPromises());
  const entries = settled
    .flatMap(settledResult)
    .filter((entry): entry is KvEntryId => entry !== null);

  return deduplicateCategories(entries, prevEntryCategories);
};

const getEntriesPromises = () => {
  return categoriesArray().map(async ({ category }) => {
    const entries = await getEntriesByCategory(category);
    return entries.map((entry) => toKvEntry(entry, category));
  });
};

const deduplicateCategories = (
  entries: KvEntryId[],
  prevEntryCategories: Record<string, CategoryKey[]>,
) => {
  return entries.reduce((acc, entry) => {
    const knownIndex = acc.findIndex(({ id }) => entry.id === id);
    if (knownIndex >= 0) {
      const prevCategories =
        acc[knownIndex].id in prevEntryCategories
          ? prevEntryCategories[acc[knownIndex].id]
          : [];

      acc[knownIndex] = {
        id: acc[knownIndex].id,
        entry: {
          ...acc[knownIndex].entry,
          categories: mergeCategories(
            ...acc[knownIndex].entry.categories,
            ...entry.entry.categories,
            ...prevCategories,
          ),
        },
      };
      return acc;
    }
    return [...acc, entry];
  }, [] as KvEntryId[]);
};

const getXmlWithRetry = async (category: CategoryKey) => {
  let retries = 0;
  while (retries < 3) {
    // I want the first request to contain no hash, since I would like to just get the CDN cached what-ever version
    const hash = retries === 0 ? null : crypto.randomUUID();
    const response = await fetch(theVergeFeedUrl(category, hash));
    const xml = await response.text();

    if (xml.length === 0 && response.status === 200) {
      retries++;
      continue;
    }
    return xml;
  }
};

const getEntriesByCategory = async (category: CategoryKey) => {
  try {
    const xml = (await getXmlWithRetry(category)) ?? "";
    const { entries } = await parseFeed(xml);
    return entries ?? [];
  } catch {
    // The feed lookup seems to fail every once in a while, when that is the case the server responds with
    // content-length: 0
    // content-type: text/html
    // It seems be be an issue with the feed and after some time it seems to work again. I tried
    // a bunch of things, but it even happens in the browser every once in a while.
    console.error(`getEntriesByCategory ${category} failed`);
    return [];
  }
};

const toKvEntry = (
  entry: FeedEntry,
  category: CategoryKey,
): KvEntryId | null => {
  const { id, published } = entry;
  const href =
    entry.links?.find((entry) => entry?.type === "text/html")?.href ??
    entry.links.at(-1)?.href;
  const title = decodeTitle(entry.title?.value);

  if (!href || !title || !published) {
    return null;
  }

  return {
    id,
    entry: { categories: [category], href, title, published },
  };
};

const settledResult = (result: PromiseSettledResult<(KvEntryId | null)[]>) => {
  if (result.status === "rejected") {
    console.error(`settledResult rejected`, result.reason);
    return [];
  }
  return result.value;
};
