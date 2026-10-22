import SourcingRequestsPage from "@/components/pages/sourcingrequests-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/sourcing-request/listing/shipping-boxes",
  "title": "Recyclable corrugated shipping boxes",
  "kind": "rfq",
  "key": "shipping-boxes"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <SourcingRequestsPage entry={entry} />
    </RoutePage>
  );
}
