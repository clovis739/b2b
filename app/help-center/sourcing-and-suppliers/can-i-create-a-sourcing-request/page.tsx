import HelpPage from "@/components/pages/help-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/help-center/sourcing-and-suppliers/can-i-create-a-sourcing-request",
  "title": "Can I create a sourcing request?",
  "kind": "help-article",
  "key": "Can I create a sourcing request?"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <HelpPage entry={entry} />
    </RoutePage>
  );
}
