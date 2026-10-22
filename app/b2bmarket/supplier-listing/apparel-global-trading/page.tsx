import SupplierPage from "@/components/pages/supplier-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/supplier-listing/apparel-global-trading",
  "title": "Apparel Global Trading",
  "kind": "supplier",
  "key": "apparel-global-trading"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <SupplierPage entry={entry} />
    </RoutePage>
  );
}
