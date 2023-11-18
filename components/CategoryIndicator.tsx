import {
  categories as categoriesObject,
  CategoryKey,
} from "../src/feed/categories.ts";

type Props = {
  categories: CategoryKey[];
};

const size = 8;

const getSegments = (colors: string[]) => {
  const radius = size / 2;

  if (colors.length === 1) {
    return (
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        fill={colors[0]}
      />
    );
  }

  const totalColors = colors.length;

  const segmentAngle = 360 / totalColors;
  let startAngle = -90;

  const segments = colors.map((color, index) => {
    const endAngle = startAngle + segmentAngle;

    const x1 = radius + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = radius + radius * Math.sin((startAngle * Math.PI) / 180);

    const x2 = radius + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = radius + radius * Math.sin((endAngle * Math.PI) / 180);

    const pathData = `
      M ${radius} ${radius}
      L ${x1} ${y1}
      A ${radius} ${radius} 0 ${
      endAngle - startAngle > 180 ? 1 : 0
    } 1 ${x2} ${y2}
      Z
    `;

    startAngle = endAngle;

    return <path key={index} d={pathData} fill={color} />;
  });

  return segments;
};

export default function CategoryIndicator({ categories }: Props) {
  const segments = getSegments(
    categories.map((category) => categoriesObject[category].color),
  );
  const title = categories.map((category) => categoriesObject[category].label)
    .join(", ");

  return (
    <div>
      <svg
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{title}</title>
        {segments}
      </svg>
    </div>
  );
}
