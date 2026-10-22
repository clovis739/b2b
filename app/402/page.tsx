import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/402",
  title: "402 Payment Required",
  kind: "status",
  key: "402",
};
export const metadata = {
  title: entry.title + " | Vantora",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={402} preview />;
}
