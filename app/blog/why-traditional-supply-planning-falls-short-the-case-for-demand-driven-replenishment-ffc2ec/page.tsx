import SourceArticlePage from "@/components/editorial/source-article-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/blog/why-traditional-supply-planning-falls-short-the-case-for-demand-driven-replenishment-ffc2ec","title":"Why Traditional Supply Planning Falls Short: The Case for Demand-Driven Replenishment","kind":"article","key":"why-traditional-supply-planning-falls-short-the-case-for-demand-driven-replenishment-ffc2ec"};
export const metadata = pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><SourceArticlePage entry={entry}/></RoutePage>;}
