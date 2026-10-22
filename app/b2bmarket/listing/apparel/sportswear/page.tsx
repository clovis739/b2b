import CatalogPage from "@/components/pages/catalog-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/apparel/sportswear",
  "title": "Sportswear",
  "kind": "listing",
  "sector": "apparel",
  "category": "sportswear"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <CatalogPage entry={entry} />
    </RoutePage>
  );
}
