import AboutPage from "@/components/pages/about-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/about-us",
  "title": "About Vantora",
  "kind": "about"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <AboutPage entry={entry} />
    </RoutePage>
  );
}
