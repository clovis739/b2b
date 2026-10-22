import SourcingRequestsPage from "@/components/pages/sourcingrequests-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/sourcing-request/listing/cotton-t-shirts",
  "title": "Plain cotton T-shirts, assorted sizes",
  "kind": "rfq",
  "key": "cotton-t-shirts"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <SourcingRequestsPage entry={entry} />
    </RoutePage>
  );
}
