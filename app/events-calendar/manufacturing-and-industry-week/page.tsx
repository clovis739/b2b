import EventsPage from "@/components/pages/events-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/events-calendar/manufacturing-and-industry-week",
  "title": "Manufacturing & Industry Week",
  "kind": "event",
  "key": "manufacturing-and-industry-week"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <EventsPage entry={entry} />
    </RoutePage>
  );
}
