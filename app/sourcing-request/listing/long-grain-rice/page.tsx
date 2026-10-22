import SourcingRequestsPage from "@/components/pages/sourcingrequests-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/sourcing-request/listing/long-grain-rice",
  "title": "Long grain white rice, 5% broken",
  "kind": "rfq",
  "key": "long-grain-rice"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <SourcingRequestsPage entry={entry} />
    </RoutePage>
  );
}
