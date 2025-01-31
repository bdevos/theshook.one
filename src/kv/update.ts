import { getEntries } from "../feed/getEntries.ts";
import { calculateExpireIn } from "./expireIn.ts";
import { ENTRIES, KvEntryId, LAST_UPDATED } from "./kv.ts";
import { listEntryCategories } from "./list.ts";

export const updateEntries = async (kvUrl?: string) => {
  const kv = await Deno.openKv(kvUrl);

  const prevEntryCategories = await listEntryCategories(kv);
  const entries = await getEntries(prevEntryCategories);

  await update(kv, entries);
  await kv.set([LAST_UPDATED], new Date());
};

const update = async (kv: Deno.Kv, entries: KvEntryId[]) => {
  const kvSetPromises = entries.map(async ({ id, entry }) => {
    const expireIn = calculateExpireIn(entry);

    if (expireIn > 0) {
      return await kv.set([ENTRIES, id], entry, { expireIn });
    }
  });
  const kvSetSettled = await Promise.allSettled(kvSetPromises);
  const kvSetFulfilled = kvSetSettled.filter((kvSet) => {
    if (kvSet.status === "rejected") {
      console.error(`KV set rejected`, kvSet.reason);
      return false;
    }
    return true;
  });

  console.log(`Successfully updated ${kvSetFulfilled.length} entries`);
};
