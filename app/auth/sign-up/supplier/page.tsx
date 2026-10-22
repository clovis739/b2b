import AuthenticationPage from "@/components/pages/authentication-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/auth/sign-up/supplier",
  "title": "Create your supplier account",
  "kind": "auth",
  "key": "supplier"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <AuthenticationPage entry={entry} />
    </RoutePage>
  );
}
