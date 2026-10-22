import SupplierPage from "@/components/pages/supplier-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/suppliers/fashion-accessories-global-trading",
  "title": "Fashion Global Trading",
  "kind": "supplier",
  "key": "fashion-accessories-global-trading"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <SupplierPage entry={entry} />
    </RoutePage>
  );
}
