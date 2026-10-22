import HelpPage from "@/components/pages/help-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/help-center/logistics-tools/are-freight-rates-live",
  "title": "Are freight rates live?",
  "kind": "help-article",
  "key": "Are freight rates live?"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <HelpPage entry={entry} />
    </RoutePage>
  );
}
