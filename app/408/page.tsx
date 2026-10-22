import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/408",
  title: "408 Request Timeout",
  kind: "status",
  key: "408",
};
export const metadata = {
  title: entry.title + " | Vantora",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={408} preview />;
}
