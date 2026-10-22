import type { ReactNode } from "react";
import type { PageEntry } from "@/app/route-map";
import { PageProvider } from "@/hooks/use-page-controller";
import PageFrame from "./page-frame";
import PageMotion from "@/components/motion/page-motion";

export default function RoutePage({
  entry,
  children,
}: {
  entry: PageEntry;
  children: ReactNode;
}) {
  return (
    <PageMotion>
      <PageProvider entry={entry}>
        {entry.kind === "home" ? (
          children
        ) : (
          <PageFrame entry={entry}>{children}</PageFrame>
        )}
      </PageProvider>
    </PageMotion>
  );
}
