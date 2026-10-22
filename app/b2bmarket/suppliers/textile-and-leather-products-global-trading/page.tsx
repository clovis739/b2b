import SupplierPage from "@/components/pages/supplier-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/suppliers/textile-and-leather-products-global-trading",
  "title": "Textile Global Trading",
  "kind": "supplier",
  "key": "textile-and-leather-products-global-trading"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <SupplierPage entry={entry} />
    </RoutePage>
  );
}
