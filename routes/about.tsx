import { Head } from "$fresh/runtime.ts";
import Header from "../components/Header.tsx";

export default function About() {
  return (
    <>
      <Head>
        <title>About | theshook.¹</title>
      </Head>
      <div class="mx-auto max-w-2xl mt-2 px-1">
        <Header label="About" disableSettings />
        <div className="m-3 text-base text-neutral-900 leading-relaxed">
          <p>
            This is here for whatever reason
          </p>

          <h2 class="mt-4 text-lg font-semibold leading-loose">
            Inspired by
          </h2>

          <p>
            This is here for whatever reason This is here for whatever reason
            This is here for whatever reason This is here for whatever reason
          </p>
        </div>
      </div>
    </>
  );
}
