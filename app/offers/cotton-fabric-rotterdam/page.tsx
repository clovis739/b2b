import CargoPage from "@/components/pages/cargo-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/offers/cotton-fabric-rotterdam",
  "title": "Cotton fabric rolls",
  "kind": "cargo-detail",
  "key": "cotton-fabric-rotterdam"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <CargoPage entry={entry} />
    </RoutePage>
  );
}
