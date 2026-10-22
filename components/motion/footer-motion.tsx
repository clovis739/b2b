"use client";
import { ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import { gsap, useGSAP } from "@/lib/motion";

export default function FooterMotion({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          all: "(min-width: 0px)",
          reduced: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const safe = (fn: () => void) => context.add(fn);
          const animate = (link: HTMLAnchorElement, active: boolean) =>
            safe(() => {
              gsap.to(link, {
                "--footer-hover": active ? 1 : 0,
                "--footer-bg-scale": active ? 1 : 0.94,
                duration: context.conditions!.reduced ? 0 : 0.22,
                ease: "power2.out",
                overwrite: true,
              });
            });
          const links = root.current!.querySelectorAll<HTMLAnchorElement>("a");
          const cleanup = [...links].map((link) => {
            const enter = () => animate(link, true);
            const leave = () => animate(link, link.matches(":focus-visible"));
            const blur = () => animate(link, link.matches(":hover"));
            link.addEventListener("pointerenter", enter);
            link.addEventListener("pointerleave", leave);
            link.addEventListener("focus", enter);
            link.addEventListener("blur", blur);
            return () => {
              link.removeEventListener("pointerenter", enter);
              link.removeEventListener("pointerleave", leave);
              link.removeEventListener("focus", enter);
              link.removeEventListener("blur", blur);
            };
          });
          return () => cleanup.forEach((remove) => remove());
        },
      );
      return () => media.revert();
    },
    { scope: root },
  );
  return (
    <footer
      ref={root}
      className="clone-footer"
      data-theme={pathname?.startsWith("/landed-cost/") ? "teal" : "blue"}
    >
      {children}
    </footer>
  );
}
