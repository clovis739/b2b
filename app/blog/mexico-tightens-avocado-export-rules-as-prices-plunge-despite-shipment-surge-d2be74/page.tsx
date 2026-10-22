import SourceArticlePage from "@/components/editorial/source-article-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/blog/mexico-tightens-avocado-export-rules-as-prices-plunge-despite-shipment-surge-d2be74","title":"Mexico Tightens Avocado Export Rules as Prices Plunge Despite Shipment Surge","kind":"article","key":"mexico-tightens-avocado-export-rules-as-prices-plunge-despite-shipment-surge-d2be74"};
export const metadata = pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><SourceArticlePage entry={entry}/></RoutePage>;}
