import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <body class="bg-gray-100 dark:bg-black">
      <Component />
    </body>
  );
}
