import ProductPage from "@/components/pages/product-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/products/iqf-frozen-broccoli-florets-12",
  "title": "IQF Frozen Broccoli Florets",
  "kind": "product",
  "key": "iqf-frozen-broccoli-florets-12"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <ProductPage entry={entry} />
    </RoutePage>
  );
}
