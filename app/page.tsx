import HomePage from "@/components/home/home-page";
import RoutePage from "@/components/shared/route-page";
import type { PageEntry } from "@/app/route-map";

const entry: PageEntry = {
  "path": "/",
  "title": "Global trade, connected",
  "kind": "home"
};

export const metadata = { title: "Globy | Global Sourcing & Logistics" };

export default function Page() {
  return (
    <RoutePage entry={entry}>
      <HomePage />
    </RoutePage>
  );
}
