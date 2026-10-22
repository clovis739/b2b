import HelpPage from "@/components/pages/help-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/help-center/logistics-tools/can-i-track-a-real-shipment",
  "title": "Can I track a real shipment?",
  "kind": "help-article",
  "key": "Can I track a real shipment?"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <HelpPage entry={entry} />
    </RoutePage>
  );
}
