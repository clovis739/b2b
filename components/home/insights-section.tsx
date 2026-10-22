import { Icon } from "@/components/ui/icon";
import Image from "next/image";
import Link from "next/link";
import { articles } from "../../app/site-data";
import SectionHeading from "./section-heading";
import Carousel from "../motion/carousel";
export default function InsightsSection() {
  return (
    <section className="clone-section">
      <SectionHeading
        title="The latest from Insights"
        description="Industry-tailored articles, news and analysis from across global trade."
        href="/blog"
        action="Read all content"
      />
      <Carousel label="Industry insights" className="insight-carousel">
        {articles.map((a) => (
          <article key={a.slug}>
            <Link className="clone-insight-image" href={`/blog/${a.slug}`}>
              <Image
                src={`/images/${a.image}.jpg`}
                alt={a.title}
                fill
                sizes="(max-width:700px) 100vw, 33vw"
              />
              <span>{a.category}</span>
            </Link>
            <div className="clone-insight-meta">
              <span>{a.category}</span>
              <span>{a.minutes} min read</span>
            </div>
            <h3>
              <Link href={`/blog/${a.slug}`}>{a.title}</Link>
            </h3>
            <p>{a.summary}</p>
            <Link className="clone-insight-category" href="/blog">
              {a.category}
              <span>
                Explore more <Icon name="external" size={16} />
              </span>
            </Link>
          </article>
        ))}
      </Carousel>
    </section>
  );
}
