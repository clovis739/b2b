import WorkspacePage from "@/components/pages/workspace-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/workspace/inquiries",
  "title": "Your inquiries & requests",
  "kind": "workspace",
  "key": "inquiries"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <WorkspacePage entry={entry} />
    </RoutePage>
  );
}
