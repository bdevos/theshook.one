import { ENTRIES, KvEntry, LAST_UPDATED } from "./kv.ts";

export const deleteEntries = async (kvUrl?: string) => {
  const kv = await Deno.openKv(kvUrl);
  const res = kv.list<KvEntry>({ prefix: [ENTRIES] });
  for await (const { key } of res) {
    await kv.delete(key);
  }
  await kv.delete([LAST_UPDATED]);
};
