import EventsPage from "@/components/pages/events-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/events-calendar/business-connections-summit",
  "title": "Business Connections Summit",
  "kind": "event",
  "key": "business-connections-summit"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <EventsPage entry={entry} />
    </RoutePage>
  );
}
