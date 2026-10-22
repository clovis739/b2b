import SourceArticlePage from "@/components/editorial/source-article-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";
const entry: PageEntry = {"path":"/blog/how-to-write-an-effective-unclaimed-cargo-listing-on-globy-a-step-by-step-guide-ef8d8f","title":"How to Write an Effective Unclaimed Cargo Listing on Globy: A Step-by-Step Guide","kind":"article","key":"how-to-write-an-effective-unclaimed-cargo-listing-on-globy-a-step-by-step-guide-ef8d8f"};
export const metadata = pageMetadata(entry);
export default function Page(){return <RoutePage entry={entry}><SourceArticlePage entry={entry}/></RoutePage>;}
