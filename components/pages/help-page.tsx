"use client";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";
import { faqGroups, slugify } from "../../app/site-data";

import { Intro } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";

export default function HelpPage({ entry }: { entry: PageEntry }) {
  const { query, searchBar } = usePageController();
  return (
    <>
      <Intro
        entry={entry}
        description="Find a useful answer. Take the next step with confidence."
      />
      {entry.kind === "help-article" ? (
        <article className="content-panel reading-panel">
          <h2>{entry.title}</h2>
          <p>
            {
              faqGroups
                .flatMap((g) => g.questions)
                .find(([q]) => q === entry.key)?.[1]
            }
          </p>
          <Link href="/help-center" className="text-button">
            <Icon name="left" size={16}/> All help topics
          </Link>
        </article>
      ) : (
        <>
          {searchBar("Search help topics")}
          <div className="help-grid">
            {faqGroups
              .filter((g) => !entry.key || g.title === entry.key)
              .map((g) => (
                <section className="content-panel" key={g.title}>
                  <h2>
                    <Link href={`/help-center/${slugify(g.title)}`}>
                      {g.title}
                    </Link>
                  </h2>
                  {g.questions
                    .filter(([q, a]) =>
                      `${q} ${a}`.toLowerCase().includes(query.toLowerCase()),
                    )
                    .map(([q, a]) => (
                      <details key={q}>
                        <summary>{q}</summary>
                        <p>{a}</p>
                        <Link
                          className="text-button"
                          href={`/help-center/${slugify(g.title)}/${slugify(q)}`}
                        >
                          Read answer <Icon name="arrow" size={16}/>
                        </Link>
                      </details>
                    ))}
                </section>
              ))}
          </div>
        </>
      )}
    </>
  );
}
