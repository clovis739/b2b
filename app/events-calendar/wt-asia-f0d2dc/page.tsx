import EventsPage from "@/components/pages/events-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry:PageEntry = {"path":"/events-calendar/wt-asia-f0d2dc","title":"WT Asia","kind":"event","key":"wt-asia-f0d2dc"};
export const metadata=pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><EventsPage entry={entry}/></RoutePage>;}
