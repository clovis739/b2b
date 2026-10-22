import ProductPage from "@/components/pages/product-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/listing/products/monocrystalline-solar-panel-550-w-7-0",
  "title": "Monocrystalline Solar Panel 550 W",
  "kind": "product",
  "key": "monocrystalline-solar-panel-550-w-7-0"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <ProductPage entry={entry} />
    </RoutePage>
  );
}
