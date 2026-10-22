import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/426",
  title: "426 Upgrade Required",
  kind: "status",
  key: "426",
};
export const metadata = {
  title: entry.title + " | Globy",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={426} preview />;
}
