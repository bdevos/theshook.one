import { deleteEntries } from "./src/kv/delete.ts";
import { updateEntries } from "./src/kv/update.ts";

const entries = async (arg?: string) => {
  const kvUrl = Deno.env.get("DENO_KV_URL");

  switch (arg) {
    case "delete":
      await deleteEntries(kvUrl);
      return;
    case "update":
      await updateEntries(kvUrl);
      return;
    default:
      console.log(`Unknown argument "${arg}"`);
      return;
  }
};

await entries(Deno.args.at(0));
