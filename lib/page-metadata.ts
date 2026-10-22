import { brand } from "./brand";
import type { Metadata } from "next";
import type { PageEntry } from "@/app/route-map";

export function pageMetadata(entry: PageEntry): Metadata {
  return {
    title: `${entry.title} | ${brand.name}`,
    description: `Explore ${entry.title.toLowerCase()} on the ${brand.name} global trade platform.`,
  };
}
