import SourceArticlePage from "@/components/editorial/source-article-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/blog/building-stronger-procurement-teams-how-to-scale-negotiation-excellence-across-an-organization-ad6530","title":"Building Stronger Procurement Teams: How to Scale Negotiation Excellence Across an Organization","kind":"article","key":"building-stronger-procurement-teams-how-to-scale-negotiation-excellence-across-an-organization-ad6530"};
export const metadata = pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><SourceArticlePage entry={entry}/></RoutePage>;}
