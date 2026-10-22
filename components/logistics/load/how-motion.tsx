"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/motion";

export default function LoadHowMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        {
          all: "(min-width: 0px)",
          reduced: "(prefers-reduced-motion: reduce)",
          pointer: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          if (context.conditions!.reduced) return;
          const cleanups: (() => void)[] = [];
          scope.current
            ?.querySelectorAll<HTMLElement>(".load-how-card")
            .forEach((card, index) => {
              const svg = card.querySelector(".load-how-illustration");
              if (!svg) return;
              const groups = svg.querySelectorAll(":scope > g");
              const timeline = gsap.timeline({
                paused: true,
                defaults: { duration: 0.55, ease: "power2.inOut" },
              });
              if (index === 0) {
                timeline
                  .to(
                    groups[0],
                    { y: -5, rotation: -2, transformOrigin: "50% 50%" },
                    0,
                  )
                  .to(groups[1], { opacity: 0.65, y: -6 }, 0)
                  .to(
                    svg.querySelector(":scope > path"),
                    { y: -8, scale: 1.025, transformOrigin: "50% 50%" },
                    0,
                  )
                  .to(groups[2], { y: -14, x: 5 }, 0)
                  .to(groups[3], { y: -14, x: 5 }, 0);
              } else if (index === 1) {
                timeline
                  .to(
                    groups[0],
                    {
                      x: -12,
                      y: -11,
                      rotation: "-=3",
                      transformOrigin: "50% 50%",
                    },
                    0,
                  )
                  .to(
                    groups[1],
                    {
                      x: 12,
                      y: 6,
                      rotation: "+=3",
                      transformOrigin: "50% 50%",
                    },
                    0,
                  )
                  .to(groups[2], { x: 10, y: -6 }, 0);
              } else if (index === 2) {
                timeline
                  .to(groups[0], { x: -7, y: -10 }, 0)
                  .to(groups[1], { x: 10, y: 10 }, 0)
                  .to(
                    groups[2],
                    { rotation: "+=2", y: -6, transformOrigin: "50% 50%" },
                    0,
                  )
                  .to(
                    groups[2]?.querySelector("g"),
                    {
                      rotation: "+=42",
                      transformOrigin: "50% 50%",
                      duration: 0.7,
                    },
                    0,
                  );
              } else {
                timeline
                  .to(
                    groups[0],
                    { x: 5, y: -10, rotation: -2, transformOrigin: "50% 70%" },
                    0,
                  )
                  .to(
                    groups[1],
                    { x: 5, y: -10, rotation: -2, transformOrigin: "50% 70%" },
                    0,
                  )
                  .to(
                    groups[2],
                    {
                      x: -10,
                      y: -5,
                      rotation: "-=4",
                      transformOrigin: "50% 50%",
                    },
                    0,
                  );
              }
              const enter = (event: PointerEvent) => {
                if (
                  context.conditions!.pointer &&
                  event.pointerType !== "touch"
                )
                  timeline.timeScale(1).play();
              };
              const leave = () => {
                if (!card.matches(":focus-within"))
                  timeline.timeScale(1.4).reverse();
              };
              const focus = () => timeline.timeScale(1).play();
              const blur = () => {
                if (!card.matches(":hover")) timeline.timeScale(1.4).reverse();
              };
              card.addEventListener("pointerenter", enter);
              card.addEventListener("pointerleave", leave);
              card.addEventListener("focusin", focus);
              card.addEventListener("focusout", blur);
              cleanups.push(() => {
                timeline.kill();
                card.removeEventListener("pointerenter", enter);
                card.removeEventListener("pointerleave", leave);
                card.removeEventListener("focusin", focus);
                card.removeEventListener("focusout", blur);
              });
            });
          return () => cleanups.forEach((cleanup) => cleanup());
        },
      );
      return () => media.revert();
    },
    { scope },
  );
  return (
    <div className="load-how-grid" ref={scope}>
      {children}
    </div>
  );
}
