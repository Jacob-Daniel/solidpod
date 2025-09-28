import Link from "next/link";
import type { Tags } from "@/lib/types";

export default function TagList({ tags }: { tags: Tags[] }) {
  return (
    <div className="col-span-6 flex flex-wrap gap-2 justify-center">
      {tags.map((tag, index) => {
        const colorClass = "";
        return (
          <Link
            key={tag.id}
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/archive/tag/${tag.slug}`}
            className={`px-3 py-1 border border-border rounded text-base hover:shadow transition ${colorClass} hover:border-gray-400`}
          >
            {tag.name}
          </Link>
        );
      })}
    </div>
  );
}
