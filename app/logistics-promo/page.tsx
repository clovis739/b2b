import MarketingPage from "@/components/pages/marketing-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/logistics-promo",
  "title": "Your logistics, connected",
  "kind": "logistics"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <MarketingPage entry={entry} />
    </RoutePage>
  );
}
