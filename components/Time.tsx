import { timeFormatter } from "../src/formatters.ts";

type Props = {
  lastVisit: Date | undefined;
  published: Date;
};

export default function Time({ lastVisit, published }: Props) {
  const isBold = lastVisit && published > lastVisit;

  return (
    <span
      class={`text-xs font-mono tabular-nums tracking-tighter ${
        isBold
          ? "font-bold text-neutral-900 dark:text-neutral-50"
          : "font-normal text-neutral-700 dark:text-neutral-200"
      }`}
    >
      {timeFormatter.format(published)}
    </span>
  );
}
