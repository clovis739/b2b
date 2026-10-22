import LoadFeatures from "./features";
import LoadHowItWorks from "./how-it-works";
import Link from "next/link";
import {
  ArrowRight,
  Container,
  ScanEye,
  Coins,
  SlidersHorizontal,
  Truck,
  Factory,
  Store,
  Warehouse,
  ClipboardCheck,
  MoveRight,
} from "lucide-react";

export default function LoadGuide() {
  return (
    <div className="load-guide">
      <section className="load-overview">
        <div>
          <span className="page-kicker">MORE ROOM FOR YOUR CARGO</span>
          <h2>Container &amp; Truck Load Calculator</h2>
          <p>
            Bring cargo dimensions, quantities and equipment capacity into one
            plan. Compare a standard container with a truck and review how much
            space each order needs.
          </p>
          <p>
            Our local planner creates a conservative arrangement using separate
            lengthwise sections for each product. Use the visual result to start
            a practical discussion with your loading team.
          </p>
        </div>
      </section>
      <section>
        <div className="load-section-heading">
          <span className="page-kicker">A CLEAR PATH FROM PRODUCT TO PLAN</span>
          <h2>How It Works?</h2>
        </div>
        <LoadHowItWorks />
      </section>
      <section className="load-benefits">
        <div className="load-section-heading">
          <h2>Why Use Our Load Calculator?</h2>
          <p>Compare capacity and shipment choices before booking equipment.</p>
        </div>
        <div className="load-four-grid">
          {(
            [
              [
                Coins,
                "Cost-Effective Shipping",
                [
                  "Review the number of loads needed.",
                  "Identify unused volume in a selected load.",
                  "Compare equipment sizes before requesting quotes.",
                ],
              ],
              [
                SlidersHorizontal,
                "Advanced Optimization Features",
                [
                  "Describe boxes, pallets, sacks and barrels by their bounding dimensions.",
                  "Set upright stacking and horizontal rotation preferences.",
                  "Add several product types to one shipment.",
                ],
              ],
              [
                ScanEye,
                "Smart 3D Visualization",
                [
                  "Switch between isometric and overhead views.",
                  "Recognize product types using color-coded blocks.",
                  "Review the quantity allocated to each load.",
                ],
              ],
              [
                Truck,
                "Flexibility for Any Business",
                [
                  "Standard and high-cube equipment presets.",
                  "Refrigerated containers and truck options.",
                  "Custom dimensions for equipment confirmed with your carrier.",
                ],
              ],
            ] as const
          ).map(([Icon, title, items]) => (
            <article className="info-card" key={String(title)}>
              <Icon size={28} />
              <h3>{String(title)}</h3>
              <ul>
                {items.map((text) => (
                  <li key={text}>{text}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="load-note">
          Capacity planning does not certify safe weight distribution, axle
          loading, stability or regulatory compliance. Confirm those details
          with your carrier and loading specialists.
        </p>
      </section>
      <section className="load-audience">
        <div className="load-section-heading">
          <h2>Who Benefits from Our Load Calculator?</h2>
        </div>
        <div>
          {(
            [
              [
                Truck,
                "Logistics & Freight Companies",
                "Prepare capacity estimates for customer shipments.",
              ],
              [
                Factory,
                "Manufacturers & Suppliers",
                "Plan dispatch quantities before production leaves the site.",
              ],
              [
                Store,
                "Retailers & Distributors",
                "Compare replenishment orders and equipment requirements.",
              ],
              [
                Warehouse,
                "Warehouse Operators",
                "Prepare a starting point for packing and dispatch.",
              ],
              [
                ClipboardCheck,
                "Customs Brokers",
                "Keep shipment dimensions and quantities with the planning brief.",
              ],
            ] as const
          ).map(([Icon, title, text]) => (
            <article key={String(title)}>
              <Icon size={25} />
              <h3>{String(title)}</h3>
              <p>{String(text)}</p>
            </article>
          ))}
        </div>
      </section>
      <LoadFeatures />
      <section className="load-related">
        <div className="load-section-heading">
          <h2>Plan Your Cargo with Our Calculators</h2>
        </div>
        <div className="load-three-grid">
          {(
            [
              [
                "Container Loading Calculator",
                "Plan rectangular cargo inside container equipment.",
                "container-loading-calculator",
              ],
              [
                "Pallet Container Calculator",
                "Start with common pallet dimensions and adjust the loaded height.",
                "pallet-container-calculator",
              ],
              [
                "Container CBM Calculator",
                "Review shipment volume alongside equipment capacity.",
                "container-cbm-calculator",
              ],
            ] as const
          ).map(([title, text, slug]) => (
            <Link
              className="info-card"
              href={`/load-calculator/${slug}`}
              key={slug}
            >
              <Container size={27} />
              <h3>{title}</h3>
              <p>{text}</p>
              <ArrowRight size={18} />
            </Link>
          ))}
        </div>
      </section>
      <section className="load-cta">
        <div>
          <span className="page-kicker">MAKE YOUR NEXT LOAD COUNT</span>
          <h2>Get Started with Our Load Calculator Today!</h2>
          <p>
            Add the products, choose your equipment and review a capacity
            estimate.
          </p>
        </div>
        <a className="primary" href="#load-planner">
          Try it now <MoveRight size={20} />
        </a>
      </section>
    </div>
  );
}
