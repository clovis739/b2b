import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/413",
  title: "413 Content Too Large",
  kind: "status",
  key: "413",
};
export const metadata = {
  title: entry.title + " | Vantora",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={413} preview />;
}
