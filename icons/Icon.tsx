import { Category } from "../categories.ts";

type Props = {
  category: Category;
};

export const Icon = ({ category }: Props) => {
  switch (category) {
    case "apple":
      return <>🍎</>;
    case "apps":
      return <>📱</>;
    case "climate-change":
      return <>♻️</>;
    case "creators":
      return <>👷</>;
    case "cryptocurrency":
      return <>💸</>;
    case "cyber-security":
      return <>🧑‍💻</>;
    case "elon-musk":
      return <>🤡</>;
    // case "facebook":
    //   return <></>;
    case "film":
      return <>🎬</>;
    case "gadgets":
      return <>🤖</>;
    case "games":
      return <>👾</>;
    case "good-deals":
      return <>🤝</>;
    // case "google":
    case "how-to":
      return <>🧰</>;
    // case "meta":
    // case "microsoft":
    case "policy":
      return <>📑</>;
    case "reviews":
      return <>🚦</>;
    // case "samsung":
    //   return <></>;
    case "science":
      return <>🧬</>;
    case "space":
      return <>🚀</>;
    case "streaming-wars":
      return <>📼</>;
    // case "tesla":
    // case "tiktok":
    case "transportation":
      return <>🚛</>;
    case "tv":
      return <>📺</>;
    case "twitter":
      return <>𝕏</>;
    // case "youtube":
    //   return <></>;
    default:
      return null;
  }
};
