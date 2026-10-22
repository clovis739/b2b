import CargoPage from "@/components/pages/cargo-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/offers/ceramic-tiles-dubai",
  "title": "Ceramic floor tiles",
  "kind": "cargo-detail",
  "key": "ceramic-tiles-dubai"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <CargoPage entry={entry} />
    </RoutePage>
  );
}
