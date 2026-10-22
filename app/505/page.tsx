import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/505",
  title: "505 HTTP Version Not Supported",
  kind: "status",
  key: "505",
};
export const metadata = {
  title: entry.title + " | Vantora",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={505} preview />;
}
