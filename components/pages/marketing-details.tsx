import Link from "next/link";
import { Icon } from "../../app/ui";
import { navigation } from "../../lib/navigation";

export default function MarketingDetails({ kind }: { kind: string }) {
  if (kind === "logistics")
    return (
      <section className="page-section">
        <div className="section-title">
          <h2>Plan your shipment from every angle.</h2>
        </div>
        <div className="three-column">
          {navigation[1].links.map((l) => (
            <Link className="info-card" key={l.href} href={l.href}>
              <Icon name={l.icon} size={26} />
              <h3>{l.title}</h3>
              <p>{l.description}</p>
              <Icon name="arrow" size={16} />
            </Link>
          ))}
        </div>
      </section>
    );
  if (kind === "cargo-promo")
    return (
      <section className="page-section">
        <div className="section-title">
          <h2>Two paths to a new opportunity.</h2>
        </div>
        <div className="two-column">
          <article className="info-card">
            <Icon name="box" size={28} />
            <h3>I have available cargo</h3>
            <p>
              Describe the lot, quantity, condition and storage location. Keep
              document availability and release requirements in your listing
              brief.
            </p>
            <Link className="primary" href="/unclaimed-cargo/create">
              Prepare a cargo listing <Icon name="arrow" size={16} />
            </Link>
          </article>
          <article className="info-card">
            <Icon name="search" size={28} />
            <h3>I’m looking for cargo</h3>
            <p>
              Browse sample lots and prepare questions about specifications,
              inspection, documentation, location and commercial terms.
            </p>
            <Link className="outline-button" href="/unclaimed-cargo">
              Browse available cargo <Icon name="arrow" size={16} />
            </Link>
          </article>
        </div>
      </section>
    );
  if (kind === "suppliers-promo")
    return (
      <section className="page-section">
        <div className="section-title">
          <h2>Build a useful buyer-facing presence.</h2>
        </div>
        <div className="three-column">
          {[
            [
              "user",
              "Company profile",
              "Bring your business identity, location and catalog into a public supplier page.",
            ],
            [
              "box",
              "Product listings",
              "Present specifications, price basis and minimum order information clearly.",
            ],
            [
              "mail",
              "Sourcing opportunities",
              "Explore buyer requests and prepare a response with your offer details.",
            ],
          ].map(([icon, title, body]) => (
            <article className="info-card" key={title}>
              <Icon name={icon} size={28} />
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>
        <div className="market-rfq-callout">
          <div>
            <h2>Start with your company and products.</h2>
            <p>
              Create a demo supplier profile, then prepare local product listing
              drafts.
            </p>
          </div>
          <Link
            className="primary"
            href="/auth/sign-up/supplier/create-account"
          >
            Create supplier profile <Icon name="arrow" size={16} />
          </Link>
        </div>
      </section>
    );
  return (
    <section className="page-section">
      <div className="section-title">
        <h2>A clearer brief. A better conversation.</h2>
      </div>
      <div className="two-column">
        <article className="info-card">
          <Icon name="mail" size={28} />
          <h3>For buyers</h3>
          <p>
            Specify the product, quantity, destination and delivery terms. Keep
            requirements in a local RFQ draft that you can edit and download.
          </p>
          <Link className="primary" href="/rfqs/add-rfq">
            Create an RFQ <Icon name="arrow" size={16} />
          </Link>
        </article>
        <article className="info-card">
          <Icon name="globe" size={28} />
          <h3>For suppliers</h3>
          <p>
            Review buyer requirements and prepare a quotation with
            specifications, quantities, price basis and lead time.
          </p>
          <Link className="outline-button" href="/sourcing-request/listing">
            Explore buyer requests <Icon name="arrow" size={16} />
          </Link>
        </article>
      </div>
    </section>
  );
}
