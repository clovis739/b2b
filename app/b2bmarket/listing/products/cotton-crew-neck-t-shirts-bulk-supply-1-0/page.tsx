import ProductPage from "@/components/pages/product-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/products/cotton-crew-neck-t-shirts-bulk-supply-1-0",
  "title": "Cotton Crew Neck T-Shirts – Bulk Supply",
  "kind": "product",
  "key": "cotton-crew-neck-t-shirts-bulk-supply-1-0"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <ProductPage entry={entry} />
    </RoutePage>
  );
}
