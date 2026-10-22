import SourceArticlePage from "@/components/editorial/source-article-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/blog/iran-us-diplomacy-what-it-means-for-global-trade-energy-and-logistics-367fce","title":"Iran - U.S. Diplomacy: What It Means for Global Trade, Energy, and Logistics","kind":"article","key":"iran-us-diplomacy-what-it-means-for-global-trade-energy-and-logistics-367fce"};
export const metadata = pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><SourceArticlePage entry={entry}/></RoutePage>;}
