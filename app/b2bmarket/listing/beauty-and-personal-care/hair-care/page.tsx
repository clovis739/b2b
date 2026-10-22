import CatalogPage from "@/components/pages/catalog-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/beauty-and-personal-care/hair-care",
  "title": "Hair Care",
  "kind": "listing",
  "sector": "beauty-and-personal-care",
  "category": "hair-care"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <CatalogPage entry={entry} />
    </RoutePage>
  );
}
