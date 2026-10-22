import AuthenticationPage from "@/components/pages/authentication-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/auth/sign-up/buyer/create-account",
  "title": "Create your buyer account",
  "kind": "auth",
  "key": "buyer"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <AuthenticationPage entry={entry} />
    </RoutePage>
  );
}
