import { ENTRIES, kv, KvEntry } from "./kv.ts";

export const deleteEntries = async () => {
  const res = kv.list<KvEntry>({ prefix: [ENTRIES] });
  for await (const { key } of res) {
    await kv.delete(key);
  }
};
