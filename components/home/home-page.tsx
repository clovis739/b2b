import Link from "next/link";
import { Icon } from "../../app/ui";
import HeroSearch from "./hero-search";
import SectorSection from "./sector-section";
import ServiceTabs from "./service-tabs";
import FreightSection from "./freight-section";
import SourcingSection from "./sourcing-section";
import EventsSection from "./events-section";
import InsightsSection from "./insights-section";
import JoinSection from "./join-section";

export default function HomePage({
  marketplace = false,
}: {
  marketplace?: boolean;
}) {
  return (
    <main className="clone-home" data-page-kind="home">
      <HeroSearch marketplace={marketplace} />
      <section className="clone-sourcing-strip">
        <h2>Search products and suppliers worldwide</h2>
        <div>
          <Link href="/rfqs/add-rfq">
            <span>
              <Icon name="mail" size={24} />
            </span>
            Request for Quotation <span><Icon name="external" size={16}/></span>
          </Link>
          <Link href="/market-promo">
            <span>
              <Icon name="box" size={24} />
            </span>
            Sell on Vantora <span><Icon name="external" size={16}/></span>
          </Link>
        </div>
      </section>
      <SectorSection />
      <ServiceTabs />
      <FreightSection />
      <SourcingSection />
      <EventsSection />
      <InsightsSection />
      <JoinSection />
    </main>
  );
}
