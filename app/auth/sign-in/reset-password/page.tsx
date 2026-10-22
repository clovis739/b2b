import AuthenticationPage from "@/components/pages/authentication-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";
import { pageMetadata } from "@/lib/page-metadata";

const entry: PageEntry = {
  "path": "/auth/sign-in/reset-password",
  "title": "Reset your password",
  "kind": "auth",
  "key": "reset"
};

export const metadata = pageMetadata(entry);

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <AuthenticationPage entry={entry} />
    </RoutePage>
  );
}
