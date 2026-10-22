import StatusPage from "@/components/status/status-page";
import type { PageEntry } from "@/app/route-map";
const entry: PageEntry = {
  path: "/506",
  title: "506 Variant Also Negotiates",
  kind: "status",
  key: "506",
};
export const metadata = {
  title: entry.title + " | Globy",
  robots: { index: false, follow: false },
};
export default function Page() {
  return <StatusPage code={506} preview />;
}
