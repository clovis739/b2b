import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { httpStatuses } from "@/lib/http-status";
import type { PageEntry } from "@/app/route-map";
import PageMotion from "@/components/motion/page-motion";

const entry: PageEntry = {
  path: "/status",
  title: "HTTP status pages",
  kind: "status",
};
export const metadata = {
  title: entry.title + " | Vantora",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <PageMotion>
      <main className="container http-status-gallery" data-page-kind="status">
        <header className="page-intro">
          <span className="page-kicker">SYSTEM PAGES</span>
          <h1>Clear guidance at every turn.</h1>
          <p>
            Browse the client and server error screens. These preview pages
            leave your account and data unchanged.
          </p>
        </header>
        {[4, 5].map((group) => (
          <section key={group} aria-labelledby={`status-${group}`}>
            <div className="http-status-group">
              <h2 id={`status-${group}`}>
                {group === 4 ? "Client errors" : "Server errors"}
              </h2>
              <span>{group}xx</span>
            </div>
            <div className="http-status-grid">
              {httpStatuses
                .filter((s) => Math.floor(s.code / 100) === group)
                .map((s) => (
                  <Link
                    className="info-card http-status-card"
                    href={`/${s.code}`}
                    key={s.code}
                  >
                    <span>{s.code}</span>
                    <h3>{s.name}</h3>
                    <p>{s.title}</p>
                    <ArrowRight size={18} />
                  </Link>
                ))}
            </div>
          </section>
        ))}
      </main>
    </PageMotion>
  );
}
