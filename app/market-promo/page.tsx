import MarketingPage from "@/components/pages/marketing-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/market-promo",
  "title": "Bring your business to the world",
  "kind": "suppliers-promo"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <MarketingPage entry={entry} />
    </RoutePage>
  );
}
