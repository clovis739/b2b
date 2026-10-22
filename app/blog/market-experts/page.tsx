import EditorialPage from "@/components/pages/editorial-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/blog/market-experts",
  "title": "Market experts",
  "kind": "blog",
  "key": "Market experts"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <EditorialPage entry={entry} />
    </RoutePage>
  );
}
