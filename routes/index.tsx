import { Head } from "$fresh/runtime.ts";
import { categories, Category } from "../categories.ts";
import { Icon } from "../icons/Icon.tsx";
import Updated from "../icons/Updated.tsx";
import { SettingsButton } from "../islands/SettingsButton.tsx";

type Link = {
  category: Category;
  title: string;
  id: string;
  url: string;
  published: Date;
  updated: Date;
};

const links: Link[] = [{
  category: "apple",
  title: "iFixit tears down… Apple’s FineWoven cases",
  url:
    "https://www.theverge.com/2023/9/22/23886030/apple-finewoven-cases-ifixit-teardown",
  id:
    "https://www.theverge.com/2023/9/22/23886030/apple-finewoven-cases-ifixit-teardown",
  published: new Date(),
  updated: new Date(),
}, {
  category: "climate-change",
  title: "Apple iPhone 15 Pro and Pro Max review: by the numbers",
  url: "https://www.theverge.com/23879619/apple-iphone-15-pro-max-review",
  id: "https://www.theverge.com/23879619/apple-iphone-15-pro-max-review",
  published: new Date(),
  updated: new Date(),
}, {
  category: "facebook",
  title: "Hulu’s No One Will Save You is taut, minimalist sci-fi horror",
  url: "https://www.theverge.com/23883971/no-one-will-save-you-review-hulu",
  id: "https://www.theverge.com/23883971/no-one-will-save-you-review-hulu",
  published: new Date(),
  updated: new Date(),
}];

export default function Home() {
  return (
    <>
      <Head>
        <title>theshook.¹</title>
      </Head>
      <div class="mx-auto max-w-4xl px-2 sm:px-6 lg:px-8">
        <div class="flex h-12 justify-between items-center">
          <div class="text-8xl">🫨</div>
          <div>
            <SettingsButton />
          </div>
        </div>
        <ul className="mt-8">
          {links.map(({ id, url, title, category }) => (
            <li key={id} className="">
              <a
                href={url}
                target="_blank"
                className="flex flex-row text-[0.75rem] gap-2 whitespace-nowrap items-baseline"
              >
                <div className="font-mono text-[0.55rem]">
                  10:00
                </div>
                <div className="grow truncate font-sans">
                  {title}
                </div>
                <div className="text-[0.9rem] h-2">
                  <Icon category={category} />
                </div>
              </a>
            </li>
          ))}
          <li className="relative">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <h3 className="relative flex justify-start">
              <span className="font-mono bg-gray-100 ml-2 px-1 text-[0.7rem] font-bold leading-6 text-gray-900">
                YESTERDAY
              </span>
            </h3>
          </li>
          <li>
          </li>
          <li>
            <h3 className="font-mono text-[0.6rem] font-bold">SEP 21</h3>
          </li>
        </ul>
        <div class="flex font-mono text-[0.9rem] text-gray-300 gap-1">
          <Updated /> just now
        </div>
      </div>
    </>
  );
}
