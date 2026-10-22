import EventsPage from "@/components/pages/events-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/events-calendar/international-logistics-forum",
  "title": "International Logistics Forum",
  "kind": "event",
  "key": "international-logistics-forum"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <EventsPage entry={entry} />
    </RoutePage>
  );
}
