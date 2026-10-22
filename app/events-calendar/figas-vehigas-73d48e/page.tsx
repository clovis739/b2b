import EventsPage from "@/components/pages/events-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry:PageEntry = {"path":"/events-calendar/figas-vehigas-73d48e","title":"FIGAS & VEHIGAS","kind":"event","key":"figas-vehigas-73d48e"};
export const metadata=pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><EventsPage entry={entry}/></RoutePage>;}
