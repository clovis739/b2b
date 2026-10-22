import EditorialPage from "@/components/pages/editorial-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/blog/supplier-communication-that-works",
  "title": "Better procurement starts with clearer conversations",
  "kind": "article",
  "key": "supplier-communication-that-works"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <EditorialPage entry={entry} />
    </RoutePage>
  );
}
