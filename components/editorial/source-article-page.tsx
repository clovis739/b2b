import Link from "next/link";
import Image from "next/image";
import {
  sourcePosts,
  sourcePostPath,
  sourcePostDate,
} from "@/app/blog-source-data";
import { slugify } from "@/app/site-data";
import type { PageEntry } from "@/app/route-map";
import { Icon } from "@/components/ui/icon";
import BlogNavigation from "./blog-navigation";
import {
  blogArticleContent,
  articleWordCount,
} from "@/lib/blog-article-content";

export default function SourceArticlePage({ entry }: { entry: PageEntry }) {
  const article = sourcePosts.find((post) => post.slug === entry.key)!;
  const content = blogArticleContent[article.slug];
  const readingMinutes = Math.ceil(articleWordCount(content) / 220);
  const related = sourcePosts
    .filter((post) => post.slug !== article.slug)
    .sort(
      (a, b) =>
        Number(b.category === article.category) -
        Number(a.category === article.category),
    )
    .slice(0, 3);
  return (
    <div className="source-article-page">
      <BlogNavigation category={article.category} />
      <article className="article-page source-article">
        <Link
          className="text-button"
          href={`/blog/${slugify(article.category)}`}
        >
          <Icon name="left" size={16} /> Back to {article.category}
        </Link>
        <header>
          <Link
            className="page-kicker"
            href={`/blog/${slugify(article.category)}`}
          >
            {article.category}
          </Link>
          <h1>{article.title}</h1>
          <div className="article-byline">
            <span>Local editorial explainer</span>
            <span>{readingMinutes} min read</span>
          </div>
          <p className="article-lead">{article.summary}</p>
        </header>
        <figure className="source-article-figure">
          <div className="source-article-image">
            <Image
              src={article.image}
              alt={article.imageAlt}
              fill
              sizes="(max-width:1200px) 100vw, 1180px"
              preload
            />
          </div>
          <figcaption>Illustrative editorial photograph · Unsplash</figcaption>
        </figure>
        <p className="source-article-note">
          Independently written companion to the Globy source article, listed by{" "}
          {article.author} on{" "}
          <time dateTime={article.published}>{sourcePostDate(article)}</time>.
          The original article text is not reproduced here.
        </p>
        <div className="source-reading-layout">
          <aside className="source-contents">
            <nav aria-label="On this page">
              <h2>On this page</h2>
              <ol>
                {content.sections.map((section) => (
                  <li key={section.id}>
                    <a href={`#${section.id}`}>{section.title}</a>
                  </li>
                ))}
                <li>
                  <a href="#conclusion">The takeaway</a>
                </li>
              </ol>
            </nav>
          </aside>
          <div className="article-body source-longform">
            <section className="source-introduction" aria-label="Introduction">
              {content.introduction.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
            <section
              className="source-takeaways"
              aria-labelledby="key-takeaways"
            >
              <h2 id="key-takeaways">Key takeaways</h2>
              <ul>
                {content.takeaways.map((takeaway) => (
                  <li key={takeaway}>{takeaway}</li>
                ))}
              </ul>
            </section>
            {content.sections.map((section) => (
              <section key={section.id} aria-labelledby={section.id}>
                <h2 id={section.id} tabIndex={-1}>
                  {section.title}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
            <section aria-labelledby="conclusion">
              <h2 id="conclusion" tabIndex={-1}>
                The takeaway
              </h2>
              <p>{content.conclusion}</p>
            </section>
            <section
              className="source-further-reading"
              aria-labelledby="further-reading"
            >
              <h2 id="further-reading">Sources &amp; further reading</h2>
              {content.resources && (
                <ul>
                  {content.resources.map((resource) => (
                    <li key={resource.url}>{resource.title}</li>
                  ))}
                </ul>
              )}
            </section>
            <Link className="text-button" href="/blog">
              <Icon name="left" size={16} /> Back to all insights
            </Link>
          </div>
        </div>
      </article>
      <section className="source-related">
        <h2>More insights</h2>
        <div>
          {related.map((post) => (
            <Link
              className="blog-article-card"
              key={post.slug}
              href={sourcePostPath(post)}
            >
              <div className="source-related-image">
                <Image
                  src={post.image}
                  alt=""
                  fill
                  sizes="(max-width:700px) 100vw, 33vw"
                />
              </div>
              <span className="page-kicker">{post.category}</span>
              <h3>{post.title}</h3>
              <small>{post.author}</small>
              <Icon name="arrow" size={18} />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
