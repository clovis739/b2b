"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";
import { categoryPath, sectors } from "../../app/site-data";
import { Icon } from "../../app/ui";
import { Intro } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";

export default function DirectoryPage({ entry }: { entry: PageEntry }) {
  const { query, searchBar } = usePageController();
  return (
    <>
      <Intro
        entry={entry}
        description="Explore every sector. Find the products that move your business forward."
      />
      {searchBar("Search categories")}
      <div className="directory-grid">
        {sectors
          .filter((s) =>
            `${s.name} ${s.children.map((c) => c.name).join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase()),
          )
          .map((s) => (
            <section className="directory-card" key={s.slug}>
              <Link href={categoryPath(s.slug)}>
                <Icon name={s.icon} />
                <h2>{s.name}</h2>
                <Icon name="arrow" size={16} />
              </Link>
              <ul>
                {s.children.map((c) => (
                  <li key={c.slug}>
                    <Link href={categoryPath(s.slug, c.slug)}>
                      {c.name}
                      <Icon name="chevron" size={12} />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
      </div>
    </>
  );
}
