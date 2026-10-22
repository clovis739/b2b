import SourceArticlePage from "@/components/editorial/source-article-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/blog/top-10-chemical-industry-events-in-europe-that-help-you-discover-new-technologies-build-partnerships-and-expand-markets-3a11bc","title":"Top 10 Chemical Industry Events in Europe That Help You Discover New Technologies, Build Partnerships, and Expand Markets","kind":"article","key":"top-10-chemical-industry-events-in-europe-that-help-you-discover-new-technologies-build-partnerships-and-expand-markets-3a11bc"};
export const metadata = pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><SourceArticlePage entry={entry}/></RoutePage>;}
