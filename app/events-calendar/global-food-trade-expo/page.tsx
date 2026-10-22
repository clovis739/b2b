import EventsPage from "@/components/pages/events-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/events-calendar/global-food-trade-expo",
  "title": "Global Food Trade Expo",
  "kind": "event",
  "key": "global-food-trade-expo"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <EventsPage entry={entry} />
    </RoutePage>
  );
}
