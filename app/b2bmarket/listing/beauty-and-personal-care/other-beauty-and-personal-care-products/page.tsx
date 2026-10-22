import CatalogPage from "@/components/pages/catalog-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/beauty-and-personal-care/other-beauty-and-personal-care-products",
  "title": "Other Beauty & Personal Care Products",
  "kind": "listing",
  "sector": "beauty-and-personal-care",
  "category": "other-beauty-and-personal-care-products"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <CatalogPage entry={entry} />
    </RoutePage>
  );
}
