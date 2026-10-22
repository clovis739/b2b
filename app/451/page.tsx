import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/451",
  title: "451 Unavailable For Legal Reasons",
  kind: "status",
  key: "451",
};
export const metadata = {
  title: entry.title + " | Globy",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={451} preview />;
}
