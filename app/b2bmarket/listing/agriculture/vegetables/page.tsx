import CatalogPage from "@/components/pages/catalog-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/agriculture/vegetables",
  "title": "Vegetables",
  "kind": "listing",
  "sector": "agriculture",
  "category": "vegetables"
};

export const metadata = { title: "Vegetables Wholesale | Globy Marketplace" };

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <CatalogPage entry={entry} />
    </RoutePage>
  );
}
