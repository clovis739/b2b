import ProductPage from "@/components/pages/product-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/products/broccoli-crowns-fresh-bulk-supply-24",
  "title": "Broccoli Crowns, Fresh Bulk Supply",
  "kind": "product",
  "key": "broccoli-crowns-fresh-bulk-supply-24"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <ProductPage entry={entry} />
    </RoutePage>
  );
}
