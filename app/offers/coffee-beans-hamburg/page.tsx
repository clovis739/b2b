import CargoPage from "@/components/pages/cargo-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/offers/coffee-beans-hamburg",
  "title": "Green coffee beans",
  "kind": "cargo-detail",
  "key": "coffee-beans-hamburg"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <CargoPage entry={entry} />
    </RoutePage>
  );
}
