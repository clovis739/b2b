import ProductPage from "@/components/pages/product-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/products/ores-wholesale-supply-21-0",
  "title": "Ores – Wholesale Supply",
  "kind": "product",
  "key": "ores-wholesale-supply-21-0"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <ProductPage entry={entry} />
    </RoutePage>
  );
}
