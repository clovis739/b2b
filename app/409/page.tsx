import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/409",
  title: "409 Conflict",
  kind: "status",
  key: "409",
};
export const metadata = {
  title: entry.title + " | Globy",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={409} preview />;
}
