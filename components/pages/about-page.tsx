import Link from "next/link";
import type { PageEntry } from "@/app/route-map";
import { Icon } from "@/components/ui/icon";

const participants = [
  ["user", "Buyers"],
  ["box", "Suppliers"],
  ["globe", "Logistics providers"],
  ["send", "Freight forwarders"],
  ["ship", "Carriers"],
  ["shield", "Insurance companies"],
  ["file", "Customs specialists"],
];
const journey = [
  [
    "search",
    "Find a supplier",
    "Discover products and business partners.",
    "/b2bmarket",
  ],
  [
    "ship",
    "Calculate logistics costs",
    "Compare routes and freight estimates.",
    "/freight-calculator",
  ],
  ["shield", "Insurance", "Consider protection for your cargo.", null],
  [
    "file",
    "Customs duties & taxes",
    "Plan import costs before ordering.",
    "/landed-cost/product",
  ],
  [
    "message",
    "Connect & make the deal",
    "Discuss specifications and commercial terms.",
    "/trade",
  ],
  [
    "calendar",
    "Select the best sailing",
    "Explore departures for your route.",
    "/shipping-schedules",
  ],
  [
    "send",
    "Finalize transportation",
    "Prepare your shipment requirements.",
    "/freight-calculator/freight-request",
  ],
  [
    "location",
    "Track the shipment",
    "Follow the shipment journey.",
    "/tracking",
  ],
  [
    "list",
    "Final landed cost",
    "Bring the cost components together.",
    "/landed-cost/product",
  ],
  ["file", "Documents & delivery", "Keep shipment paperwork organized.", null],
] as const;

export default function AboutPage({ entry }: { entry: PageEntry }) {
  return (
    <div className="about-reference" aria-label={entry.title}>
      <section className="about-mission">
        <span className="about-eyebrow">Our Mission</span>
        <h1>
          Making global trade and logistics{" "}
          <span>simpler, more transparent and accessible.</span>
        </h1>
        <p>
          From finding a supplier to planning delivery, business works better
          when the next step is clear.
        </p>
        <a href="#trade-journey" className="about-scroll-link">
          Explore the trade journey <Icon name="down" size={18} />
        </a>
      </section>

      <section className="about-problem about-section">
        <div className="about-section-intro">
          <span className="about-eyebrow">The problem</span>
          <h2>
            One transaction.
            <br />
            Too many disconnected processes.
          </h2>
          <p>
            Buyers, suppliers and shipment specialists often work in separate
            systems. Information gets repeated, and decisions become harder to
            coordinate.
          </p>
        </div>
        <div className="about-participants">
          {participants.map(([icon, label]) => (
            <div className="about-participant" key={label}>
              <span>
                <Icon name={icon} size={25} />
              </span>
              <strong>{label}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="about-created about-section">
        <span className="about-eyebrow">A more connected approach</span>
        <h2>
          Vantora was created
          <br />
          <span>to change this.</span>
        </h2>
        <p>
          A shared digital workspace can bring product discovery, business
          conversations and shipment planning closer together.
        </p>
        <div
          className="about-statistics"
          aria-label="Vantora platform features"
        >
          {[
            ["10", "Connected trade steps"],
            ["33", "Product sectors"],
            ["5", "Planning & tracking tools"],
            ["1", "Connected workspace"],
          ].map(([number, label]) => (
            <div key={label}>
              <strong>{number}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <small>Platform figures presented on Vantora’s About Us page.</small>
      </section>

      <section className="about-experience about-section">
        <div>
          <span className="about-eyebrow">
            Built on real industry experience
          </span>
          <h2>
            Industry knowledge.
            <br />A connected digital future.
          </h2>
        </div>
        <div>
          <p>
            Practical trade experience shapes the questions every shipment needs
            answered: what is being bought, how will it move, and what will it
            cost?
          </p>
          <p>Useful technology makes those answers easier to find and share.</p>
        </div>
      </section>

      <section className="about-journey about-section" id="trade-journey">
        <header>
          <span className="about-eyebrow">
            The complete international trade journey
          </span>
          <h2>
            From supplier discovery
            <br />
            to final delivery.
          </h2>
          <p>Ten connected steps, with your business at the center.</p>
        </header>
        <ol className="about-journey-grid">
          {journey.map(([icon, title, description, href], i) => (
            <li className="about-journey-card" key={title}>
              <div className="about-journey-top">
                <span className="about-step-number">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Icon name={icon} size={26} />
              </div>
              <h3>{title}</h3>
              <p>{description}</p>
              {href && (
                <Link href={href} aria-label={title}>
                  Explore <Icon name="arrow" size={16} />
                </Link>
              )}
            </li>
          ))}
        </ol>
      </section>

      <section className="about-ecosystem about-section">
        <span className="about-eyebrow">
          One platform. One global trade journey.
        </span>
        <h2>Bring the pieces together.</h2>
        <p>
          People, services and shipment information belong in a connected
          process.
        </p>
        <div className="about-ecosystem-flow">
          {[
            ["box", "Supplier"],
            ["message", "Trade"],
            ["shield", "Insurance"],
            ["file", "Customs"],
            ["globe", "Logistics"],
            ["ship", "Shipment"],
            ["location", "Tracking"],
            ["file", "Documents"],
          ].map(([icon, label]) => (
            <div key={label}>
              <Icon name={icon} size={28} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="about-vision about-section">
        <span className="about-eyebrow">Our Vision</span>
        <h2>
          A simpler way
          <br />
          to trade with the world.
        </h2>
        <p>Trade, logistics and technology working together.</p>
        <div className="about-vision-pillars">
          <span>Trade</span>
          <Icon name="arrow" size={22} />
          <span>Logistics</span>
          <Icon name="arrow" size={22} />
          <span>Technology</span>
        </div>
        <Link className="primary" href="/b2bmarket">
          Explore the marketplace <Icon name="arrow" size={18} />
        </Link>
        <strong className="about-signoff">
          Vantora — Connecting Global Trade &amp; Logistics
        </strong>
      </section>
    </div>
  );
}
