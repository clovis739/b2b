import ProductPage from "@/components/pages/product-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/products/fasteners-commercial-bulk-pack-12-1",
  "title": "Fasteners – Commercial Bulk Pack",
  "kind": "product",
  "key": "fasteners-commercial-bulk-pack-12-1"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <ProductPage entry={entry} />
    </RoutePage>
  );
}
