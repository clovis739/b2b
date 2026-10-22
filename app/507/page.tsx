import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/507",
  title: "507 Insufficient Storage",
  kind: "status",
  key: "507",
};
export const metadata = {
  title: entry.title + " | Globy",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={507} preview />;
}
