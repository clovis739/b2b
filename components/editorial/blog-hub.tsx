"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { blogCategories, slugify } from "@/app/site-data";
import {
  sourcePosts as articles,
  sourcePostPath,
  sourcePostDate,
  type SourcePost,
} from "@/app/blog-source-data";
import { Icon } from "@/components/ui/icon";
import BlogNavigation from "./blog-navigation";
import type { PageEntry } from "@/app/route-map";

type Article = SourcePost;
const topicDescriptions: Record<string, string> = {
  News: "Developments shaping product sourcing and international business.",
  "Trade guide":
    "Practical steps for finding suppliers and planning your next order.",
  Analysis: "A closer look at the decisions behind resilient supply chains.",
  "Market experts": "Ideas for better procurement and supplier relationships.",
  "Logistics & Supply chain":
    "Understand freight, transport planning and shipment costs.",
  Exhibitions: "Make the most of industry events and business connections.",
};

export default function BlogHub({ entry }: { entry: PageEntry }) {
  const [query, setQuery] = useState("");
  const category = entry.key;
  const list = articles.filter(
    (a) =>
      (!category || a.category === category) &&
      `${a.title} ${a.category} ${a.summary}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const featured = list[0];
  const filtered = Boolean(query.trim() || category);
  return (
    <div className="blog-hub">
      <BlogNavigation category={category} />
      <header className="blog-masthead">
        <div>
          <span className="page-kicker">VANTORA INSIGHTS</span>
          <h1>{category || "Ideas that move business forward."}</h1>
          <p>
            {category
              ? topicDescriptions[category]
              : "Sourcing perspectives, practical trade guides and logistics know-how."}
          </p>
        </div>
        <label className="blog-search">
          <Icon name="search" size={19} />
          <input
            type="search"
            aria-label="Search insights"
            placeholder="Search insights…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </header>
      <p className="blog-content-note">
        Explore local editorial explainers based on Globy article topics. Images
        are illustrative photography from Unsplash.
      </p>
      {filtered ? (
        <section className="blog-results">
          <div className="blog-section-heading">
            <h2>{query ? "Search results" : category}</h2>
            <span role="status">
              {list.length} {list.length === 1 ? "article" : "articles"}
            </span>
          </div>
          {list.length ? (
            <div className="blog-card-grid">
              {list.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="search" size={32} />
              <h2>No articles found</h2>
              <p>Try another title, topic or keyword.</p>
              <button className="outline-button" onClick={() => setQuery("")}>
                Clear search
              </button>
              <Link className="text-button" href="/blog">
                Browse all insights
              </Link>
            </div>
          )}
        </section>
      ) : (
        <>
          <section className="blog-recent">
            <div className="blog-section-heading">
              <h2>Recently published</h2>
              <span>Globy publication snapshot</span>
            </div>
            {featured && (
              <div className="blog-feature-layout">
                <ArticleCard article={featured} featured />
                <div className="blog-recent-list">
                  {list.slice(1, 4).map((a) => (
                    <Link
                      className="blog-compact-card"
                      key={a.slug}
                      href={sourcePostPath(a)}
                    >
                      <div className="blog-compact-image">
                        <Image
                          src={a.image}
                          alt={a.imageAlt}
                          fill
                          sizes="(max-width:700px) 100px, 140px"
                        />
                      </div>
                      <div>
                        <span className="blog-category">{a.category}</span>
                        <h3>{a.title}</h3>
                        <small>
                          {a.author} · {sourcePostDate(a)}
                        </small>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
          <div className="blog-topic-grid">
            {blogCategories.map((topic) => {
              const items = articles.filter((a) => a.category === topic);
              return (
                <section className="blog-topic-section" key={topic}>
                  <div className="blog-section-heading">
                    <h2>
                      <Link href={`/blog/${slugify(topic)}`}>{topic}</Link>
                    </h2>
                    <Link
                      className="blog-view-all"
                      href={`/blog/${slugify(topic)}`}
                      aria-label={`View all ${topic} articles`}
                    >
                      View all <Icon name="arrow" size={17} />
                    </Link>
                  </div>
                  <p className="blog-topic-description">
                    {topicDescriptions[topic]}
                  </p>
                  {items.map((a) => (
                    <ArticleCard key={a.slug} article={a} />
                  ))}
                </section>
              );
            })}
          </div>
          <aside className="blog-author-callout">
            <div>
              <span className="page-kicker">
                THE PEOPLE BEHIND THE PERSPECTIVES
              </span>
              <h2>Meet our authors</h2>
              <p>Explore the contributors featured on Globy.</p>
            </div>
            <Link href="/blog/authors" className="outline-button">
              Our authors <Icon name="arrow" size={18} />
            </Link>
          </aside>
        </>
      )}
    </div>
  );
}
function ArticleCard({
  article: a,
  featured = false,
}: {
  article: Article;
  featured?: boolean;
}) {
  return (
    <article
      className={`blog-article-card ${featured ? "blog-featured-card" : ""}`}
    >
      <Link
        href={sourcePostPath(a)}
        className="blog-card-image"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={a.image}
          alt=""
          fill
          sizes={
            featured
              ? "(max-width:750px) 100vw, 55vw"
              : "(max-width:750px) 100vw, 45vw"
          }
        />
      </Link>
      <div className="blog-card-copy">
        <div className="blog-card-meta">
          <Link className="blog-category" href={`/blog/${slugify(a.category)}`}>
            {a.category}
          </Link>
          <span>{sourcePostDate(a)}</span>
        </div>
        <h3>
          <Link href={sourcePostPath(a)}>{a.title}</Link>
        </h3>
        <p>{a.summary}</p>
        <div className="blog-card-byline">
          <Link href={sourcePostPath(a)}>
            <span aria-hidden="true">G</span>
            {a.author}
          </Link>
          <Link
            className="blog-read-link"
            href={sourcePostPath(a)}
            aria-label={`Read ${a.title}`}
          >
            <Icon name="arrow" size={19} />
          </Link>
        </div>
      </div>
    </article>
  );
}
