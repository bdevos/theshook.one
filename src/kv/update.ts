import { getEntries } from "../feed/getEntries.ts";
import { calculateExpireIn } from "./expireIn.ts";
import { ENTRIES, kv, LAST_UPDATED } from "./kv.ts";

export const updateEntries = async () => {
  await update();
  await kv.set([LAST_UPDATED], new Date());
};

const update = async () => {
  const entries = await getEntries();
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
