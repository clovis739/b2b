import Link from "next/link";
import { sectors, categoryPath } from "../../app/site-data";
import { Icon } from "../../app/ui";
import SectionHeading from "./section-heading";
export default function SectorSection() {
  return (
    <section className="clone-section">
      <SectionHeading title="Wide range of product sectors" />
      <div className="clone-sector-grid">
        {sectors.slice(0, 7).map((s, i) => (
          <Link
            href={categoryPath(s.slug)}
            key={s.slug}
            className="clone-sector-card"
          >
            <span className="clone-sector-icon">
              <Icon
                name={
                  ["leaf", "user", "box", "filter", "box", "grid", "grid"][i]
                }
                size={27}
              />
            </span>
            <h3>
              {s.name} <span><Icon name="external" size={16}/></span>
            </h3>
            <p>{s.children.map((c) => c.name).join(", ")}</p>
          </Link>
        ))}
        <div className="clone-sector-all">
          <strong>+{sectors.length - 7}</strong>
          <p>More sectors and sourcing opportunities for your business.</p>
          <Link href="/b2bmarket/category-listing">
            View all <Icon name="arrow" size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
