import MarketplacePage from "@/components/pages/marketplace-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket",
  "title": "B2B Marketplace",
  "kind": "market"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <MarketplacePage entry={entry} />
    </RoutePage>
  );
}
