import PolicyPage from "@/components/pages/policy-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/privacy-policy",
  "title": "Privacy policy",
  "kind": "policy",
  "key": "privacy"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <PolicyPage entry={entry} />
    </RoutePage>
  );
}
