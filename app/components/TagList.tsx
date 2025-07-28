import Link from "next/link";

type Tag = {
  id: number;
  name: string;
  slug: string;
};

type TagListProps = {
  tags: Tag[];
};

export default function TagList({ tags }: TagListProps) {
  const bgColors = [
    "bg-red-100 text-red-800",
    "bg-blue-100 text-blue-800",
    "bg-green-100 text-green-800",
    "bg-yellow-100 text-yellow-800",
    "bg-purple-100 text-purple-800",
    "bg-pink-100 text-pink-800",
    "bg-teal-100 text-teal-800",
    "bg-orange-100 text-orange-800",
  ];
  return (
    <div className="col-span-12 flex flex-wrap gap-1">
      {tags.map((tag, index) => {
        const colorClass = bgColors[index % bgColors.length];
        return (
          <Link
            key={tag.id}
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/petitions/tag/${tag.slug}`}
            className={`px-3 py-1 border border-gray-300 rounded text-sm hover:shadow transition ${colorClass}`}
          >
            {tag.name}
          </Link>
        );
      })}
    </div>
  );
}
