import type { Metadata } from "next";
import type { PageEntry } from "@/app/route-map";

export function pageMetadata(entry: PageEntry): Metadata {
  return {
    title: `${entry.title} | Globy`,
    description: `Explore ${entry.title.toLowerCase()} on the Globy-inspired global trade platform.`,
  };
}
