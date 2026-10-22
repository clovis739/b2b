import LogisticsPage from "@/components/pages/logistics-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/freight-calculator/from-united-states/to-united-arab-emirates",
  "title": "Freight from united states to united arab emirates",
  "kind": "freight",
  "key": "united-states|united-arab-emirates"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <LogisticsPage entry={entry} />
    </RoutePage>
  );
}
