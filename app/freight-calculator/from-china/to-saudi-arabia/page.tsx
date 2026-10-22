import LogisticsPage from "@/components/pages/logistics-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/freight-calculator/from-china/to-saudi-arabia",
  "title": "Freight from china to saudi arabia",
  "kind": "freight",
  "key": "china|saudi-arabia"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <LogisticsPage entry={entry} />
    </RoutePage>
  );
}
