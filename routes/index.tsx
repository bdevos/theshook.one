import { Head } from "$fresh/runtime.ts";
import { Handlers, PageProps } from "$fresh/server.ts";
import CategoryIndicator from "../components/CategoryIndicator.tsx";
import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";
import Time from "../components/Time.tsx";
import { getLastUpdated, type LastUpdated } from "../src/kv/lastUpdated.ts";
import { listEntriesByDate } from "../src/kv/list.ts";
import { type KvEntry } from "../src/kv/kv.ts";
import {
  getDisabledCategories,
  getLastVisit,
  setDisabledCategoriesCookie,
  setLastVisitCookie,
} from "../src/cookies.ts";

type HomeProps = {
  entriesByDate: Record<string, KvEntry[]>;
  lastVisit: Date | undefined;
  lastUpdated: LastUpdated | null;
};

export const handler: Handlers<HomeProps> = {
  async GET(req, ctx) {
    const kv = await Deno.openKv();
    const lastVisit = getLastVisit(req.headers);
    const disabledCategories = getDisabledCategories(req.headers);

    const entriesByDate = await listEntriesByDate(kv, disabledCategories);
    const lastUpdated = await getLastUpdated(kv);

    const res = await ctx.render({
      lastVisit,
      entriesByDate,
      lastUpdated,
    });

    setDisabledCategoriesCookie(res.headers, disabledCategories);
    setLastVisitCookie(res.headers);

    return res;
  },
};

export default function Home(
  { data: { lastVisit, lastUpdated, entriesByDate } }: PageProps<HomeProps>,
) {
  return (
    <>
      <Head>
        <title>theshook.¹</title>
      </Head>
      <div class="mx-auto max-w-2xl mt-2 px-1">
        <Header
          label={
            <a href="https://www.theverge.com/">
              The Verge Feed
            </a>
          }
        />
        <ul class="mt-2">
          {Object.entries(entriesByDate).map(([date, entries]) => (
            <>
              {date !== "Today" && (
                <li class="relative py-1">
                  <div
                    class="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div class="w-full border-t border-neutral-300 dark:border-neutral-500" />
                  </div>
                  <h2 class="relative flex justify-start">
                    <span class="font-mono bg-neutral-50 dark:bg-black ml-3 px-1 text-[0.7rem] font-bold leading-4 text-neutral-800 dark:text-neutral-100">
                      {date}
                    </span>
                  </h2>
                </li>
              )}

              {entries.map(({ categories, href, title, published }) => (
                <li
                  key={href}
                  class="flex flex-row gap-2 whitespace-nowrap items-center"
                >
                  <CategoryIndicator categories={categories} />
                  <Time lastVisit={lastVisit} published={published} />
                  <a
                    href={href}
                    target="_blank"
                    class="text-neutral-900 dark:text-neutral-50 visited:text-fuchsia-800 dark:visited:text-fuchsia-200 truncate text-base leading-relaxed"
                  >
                    {title}
                  </a>
                </li>
              ))}
            </>
          ))}
        </ul>
        <Footer lastUpdated={lastUpdated} />
      </div>
    </>
  );
}
