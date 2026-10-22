import EventsPage from "@/components/pages/events-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/events-calendar/global-textile-sourcing-show",
  "title": "Global Textile Sourcing Show",
  "kind": "event",
  "key": "global-textile-sourcing-show"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <EventsPage entry={entry} />
    </RoutePage>
  );
}
