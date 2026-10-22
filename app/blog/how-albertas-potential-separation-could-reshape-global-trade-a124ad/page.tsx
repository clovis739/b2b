import SourceArticlePage from "@/components/editorial/source-article-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/blog/how-albertas-potential-separation-could-reshape-global-trade-a124ad","title":"How Alberta’s Potential Separation Could Reshape Global Trade","kind":"article","key":"how-albertas-potential-separation-could-reshape-global-trade-a124ad"};
export const metadata = pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><SourceArticlePage entry={entry}/></RoutePage>;}
