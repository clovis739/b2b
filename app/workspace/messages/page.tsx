import TradePage from "@/components/pages/trade-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/workspace/messages","title":"Member messages","kind":"workspace","key":"messages"};
export const metadata = pageMetadata(entry);
export default function Page() {return <RoutePage entry={entry}><TradePage entry={entry}/></RoutePage>;}
