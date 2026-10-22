import SourceArticlePage from "@/components/editorial/source-article-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/blog/the-ai-boom-is-reshaping-trans-pacific-trade-can-logistics-keep-up-94f05f","title":"The AI Boom Is Reshaping Trans-Pacific Trade. Can Logistics Keep Up?","kind":"article","key":"the-ai-boom-is-reshaping-trans-pacific-trade-can-logistics-keep-up-94f05f"};
export const metadata = pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><SourceArticlePage entry={entry}/></RoutePage>;}
