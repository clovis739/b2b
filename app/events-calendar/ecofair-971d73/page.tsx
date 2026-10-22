import EventsPage from "@/components/pages/events-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry:PageEntry = {"path":"/events-calendar/ecofair-971d73","title":"ECOFair","kind":"event","key":"ecofair-971d73"};
export const metadata=pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><EventsPage entry={entry}/></RoutePage>;}
