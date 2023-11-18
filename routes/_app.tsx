import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <body class="bg-neutral-50 dark:bg-black">
      <Component />
    </body>
  );
}
