import { difference } from "https://deno.land/std@0.206.0/datetime/mod.ts";
import { kv, LAST_UPDATED } from "./kv.ts";

export type LastUpdated = {
  minutes: number;
  hours: number;
};

export const getLastUpdated = async (): Promise<LastUpdated | null> => {
  const { value: lastUpdated } = await kv.get<Date>([LAST_UPDATED]);

  if (lastUpdated === null) {
    return null;
  }

  const { minutes = 0, hours = 0 } = difference(lastUpdated, new Date(), {
    units: ["minutes", "hours"],
  });

  return {
    minutes,
    hours,
  };
};
