import HelpPage from "@/components/pages/help-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/help-center/logistics-tools/how-is-the-load-plan-calculated",
  "title": "How is the load plan calculated?",
  "kind": "help-article",
  "key": "How is the load plan calculated?"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <HelpPage entry={entry} />
    </RoutePage>
  );
}
