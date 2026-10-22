import CatalogPage from "@/components/pages/catalog-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/gifts-and-crafts/other-gifts-and-crafts",
  "title": "Other Gifts & Crafts",
  "kind": "listing",
  "sector": "gifts-and-crafts",
  "category": "other-gifts-and-crafts"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <CatalogPage entry={entry} />
    </RoutePage>
  );
}
