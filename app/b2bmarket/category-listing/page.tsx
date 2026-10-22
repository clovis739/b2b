import DirectoryPage from "@/components/pages/directory-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/b2bmarket/category-listing",
  "title": "All product categories",
  "kind": "directory"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <DirectoryPage entry={entry} />
    </RoutePage>
  );
}
