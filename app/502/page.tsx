import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/502",
  title: "502 Bad Gateway",
  kind: "status",
  key: "502",
};
export const metadata = {
  title: entry.title + " | Vantora",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={502} preview />;
}
