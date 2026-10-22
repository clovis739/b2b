import WebinarsPage from "@/components/pages/webinars-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/webinars",
  "title": "Ideas worth connecting over",
  "kind": "webinars"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <WebinarsPage entry={entry} />
    </RoutePage>
  );
}
