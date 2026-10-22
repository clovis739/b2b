"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";
import { articles, blogCategories, slugify } from "../../app/site-data";
import { Icon } from "../../app/ui";
import { Photo, Intro } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";
import BlogHub from "../editorial/blog-hub";

export default function EditorialPage({ entry }: { entry: PageEntry }) {
  const { query, searchBar } = usePageController();

  const article = articles.find((a) => a.slug === entry.key);
  if(entry.kind === "blog") return <BlogHub key={entry.path} entry={entry}/>;
  return article ? (
    <article className="article-page">
      <span className="page-kicker">
        {article.category} · {article.minutes} MIN READ
      </span>
      <h1>{article.title}</h1>
      <p className="article-lead">{article.summary}</p>
      <div className="article-byline">
        <Link href="/blog/author/globy-editorial">{article.author}</Link>
        <span>Original demonstration editorial</span>
      </div>
      <Photo name={article.image} alt={article.title} />
      <div className="article-body">
        {article.sections.map(([title, body]) => (
          <section key={title}>
            <h2>{title}</h2>
            <p>{body}</p>
          </section>
        ))}
        <Link className="text-button" href="/blog">
          <Icon name="left" size={16}/> Back to insights
        </Link>
      </div>
    </article>
  ) : (
    <>
      <Intro
        entry={entry}
        description="Perspectives, practical guides, and ideas for your next business connection."
      />
      <div className="category-chips">
        <Link className="outline-button" href="/blog">
          All insights
        </Link>
        {blogCategories.map((c) => (
          <Link className="outline-button" key={c} href={`/blog/${slugify(c)}`}>
            {c}
          </Link>
        ))}
        <Link className="outline-button" href="/blog/authors">
          Our authors
        </Link>
      </div>
      {entry.kind === "authors" ? (
        <Link className="author-card" href="/blog/author/globy-editorial">
          <span className="company-avatar">G</span>
          <h2>Globy editorial</h2>
          <p>
            Original trade guides and sourcing ideas for this demonstration
            site.
          </p>
          <Icon name="arrow" />
        </Link>
      ) : (
        <>
          {entry.kind === "author" && (
            <div className="content-panel">
              <h2>Globy editorial</h2>
              <p>
                Practical, original content written for this independent local
                marketplace build.
              </p>
            </div>
          )}
          {searchBar("Search insights")}
          <div className="editorial-grid">
            {articles
              .filter(
                (a) =>
                  (!entry.key ||
                    entry.kind === "author" ||
                    a.category === entry.key) &&
                  `${a.title} ${a.summary}`
                    .toLowerCase()
                    .includes(query.toLowerCase()),
              )
              .map((a) => (
                <Link
                  className="editorial-card"
                  key={a.slug}
                  href={`/blog/${a.slug}`}
                >
                  <Photo name={a.image} alt={a.title} />
                  <small>
                    {a.category} · {a.minutes} min read
                  </small>
                  <h2>{a.title}</h2>
                  <p>{a.summary}</p>
                  <span className="text-button">
                    Read article <Icon name="arrow" size={15} />
                  </span>
                </Link>
              ))}
          </div>
        </>
      )}
    </>
  );
}
