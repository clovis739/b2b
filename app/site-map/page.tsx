import PageDirectoryPage from "@/components/pages/pagedirectory-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/site-map",
  "title": "Explore every page",
  "kind": "sitemap"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <PageDirectoryPage entry={entry} />
    </RoutePage>
  );
}
