import { deleteEntries } from "./src/kv/delete.ts";
import { updateEntries } from "./src/kv/update.ts";

const entries = async (arg: string) => {
  switch (arg) {
    case "delete":
      await deleteEntries();
      return;
    case "update":
      await updateEntries();
      return;
    default:
      console.log(`Unknown argument "${arg}"`);
      return;
  }
};

await entries(Deno.args[0]);
