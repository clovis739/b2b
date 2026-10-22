import LogisticsPage from "@/components/pages/logistics-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/freight-calculator/from-india/to-nigeria",
  "title": "Freight from india to nigeria",
  "kind": "freight",
  "key": "india|nigeria"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <LogisticsPage entry={entry} />
    </RoutePage>
  );
}
