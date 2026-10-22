import CatalogPage from "@/components/pages/catalog-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/food-and-beverage/other-food-and-beverages",
  "title": "Other Food & Beverages",
  "kind": "listing",
  "sector": "food-and-beverage",
  "category": "other-food-and-beverages"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <CatalogPage entry={entry} />
    </RoutePage>
  );
}
