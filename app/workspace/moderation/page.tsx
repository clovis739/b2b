import TradePage from "@/components/pages/trade-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/workspace/moderation","title":"Submission moderation","kind":"workspace","key":"moderation"};
export const metadata = pageMetadata(entry);
export default function Page() {return <RoutePage entry={entry}><TradePage entry={entry}/></RoutePage>;}
