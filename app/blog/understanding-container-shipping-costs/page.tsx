import EditorialPage from "@/components/pages/editorial-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/blog/understanding-container-shipping-costs",
  "title": "What goes into a container shipping quote?",
  "kind": "article",
  "key": "understanding-container-shipping-costs"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <EditorialPage entry={entry} />
    </RoutePage>
  );
}
