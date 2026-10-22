import RequestFormPage from "@/components/pages/requestform-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/events-calendar/submit",
  "title": "Promote your event",
  "kind": "event-form"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <RequestFormPage entry={entry} />
    </RoutePage>
  );
}
