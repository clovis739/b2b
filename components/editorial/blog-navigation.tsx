import Link from "next/link";
import { blogCategories, slugify } from "@/app/site-data";

export default function BlogNavigation({ category }: { category?: string }) {
  return (
    <nav className="blog-topic-nav" aria-label="Insights categories">
      <Link href="/blog" aria-current={!category ? "page" : undefined}>
        Home
      </Link>
      {blogCategories.map((topic) => (
        <Link
          key={topic}
          href={`/blog/${slugify(topic)}`}
          aria-current={category === topic ? "page" : undefined}
        >
          {topic}
        </Link>
      ))}
      <Link href="/blog/authors">Our authors</Link>
    </nav>
  );
}
