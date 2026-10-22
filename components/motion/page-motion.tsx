"use client";
import { ReactNode, useRef } from "react";
import {
  cardSelector,
  gsap,
  motion,
  revealSelector,
  ScrollTrigger,
  useGSAP,
} from "@/lib/motion";

export default function PageMotion({ children }: { children: ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const root = scope.current;
      if (!root) return;
      const media = gsap.matchMedia();
      media.add(
        {
          all: "(min-width: 0px)",
          reduced: "(prefers-reduced-motion: reduce)",
          pointer: "(hover: hover) and (pointer: fine)",
        },
        (context) => {
          const { reduced, pointer } = context.conditions!;
          root.dataset.motion = reduced ? "reduced" : "active";
          if (reduced)
            return () => {
              delete root.dataset.motion;
            };
          const records = new Map<
            HTMLElement,
            { tween: gsap.core.Tween; trigger?: ScrollTrigger }
          >();
          let pendingScan: gsap.core.Tween | undefined;
          let refresh: gsap.core.Tween | undefined;
          let pressed: HTMLElement | null = null;
          const safe = (fn: () => void) => context.add(fn);
          gsap.from(
            root.querySelectorAll(
              ".page-intro > *, .clone-hero > :not(.clone-globe-grid), .split-hero > div:first-child > *, .auth-pitch > :not(.site-photo), .article-page > h1, .article-lead",
            ),
            {
              opacity: 0,
              y: 18,
              duration: motion.enter,
              stagger: 0.055,
              ease: motion.ease,
              clearProps: "opacity,transform",
            },
          );
          function scan() {
            for (const [element, record] of records) {
              if (!root!.contains(element)) {
                record.trigger?.kill();
                record.tween.kill();
                gsap.killTweensOf(element);
                records.delete(element);
              }
            }
            let index = 0;
            root!
              .querySelectorAll<HTMLElement>(revealSelector)
              .forEach((element) => {
                if (
                  records.has(element) ||
                  element.parentElement?.closest(revealSelector)
                )
                  return;
                const bounds = element.getBoundingClientRect();
                if (!bounds.width || !bounds.height) return;
                const offscreen = bounds.top > window.innerHeight * 0.94;
                element.dataset.motionReveal = offscreen
                  ? "pending"
                  : "entering";
                const tween = gsap.fromTo(
                  element,
                  { opacity: 0, y: 20 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: motion.enter,
                    delay: offscreen ? 0 : (index++ % 4) * 0.045,
                    ease: motion.ease,
                    paused: offscreen,
                    clearProps: "opacity,transform",
                    onComplete: () => {
                      element.dataset.motionReveal = "complete";
                    },
                  },
                );
                const trigger = offscreen
                  ? ScrollTrigger.create({
                      trigger: element,
                      start: "top 94%",
                      once: true,
                      onEnter: () => tween.play(),
                    })
                  : undefined;
                records.set(element, { tween, trigger });
              });
            refresh?.kill();
            refresh = gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
          }
          scan();
          const observer = new MutationObserver(() => {
            pendingScan?.kill();
            pendingScan = gsap.delayedCall(0.06, () => safe(scan));
          });
          observer.observe(root, { childList: true, subtree: true });
          function revealFocused(target: Element) {
            const element = target.closest<HTMLElement>("[data-motion-reveal]");
            const record = element && records.get(element);
            if (record) {
              record.tween.progress(1);
              record.trigger?.kill();
            }
          }
          function hover(card: HTMLElement, active: boolean) {
            safe(() => {
              revealFocused(card);
              card.dataset.motionHover = active ? "active" : "idle";
              gsap.to(card, {
                "--card-lift": active ? "-6px" : "0px",
                duration: motion.hover,
                ease: motion.ease,
                overwrite: "auto",
              });
              const images = card.querySelectorAll(
                ".site-photo img, .product-image img, .clone-insight-image img",
              );
              if (images.length)
                gsap.to(images, {
                  scale: active ? 1.045 : 1,
                  duration: 0.5,
                  ease: motion.ease,
                  overwrite: "auto",
                });
            });
          }
          const over = (event: PointerEvent) => {
            if (!pointer || event.pointerType === "touch") return;
            const card = (event.target as Element).closest<HTMLElement>(
              cardSelector,
            );
            if (
              card &&
              root.contains(card) &&
              !(
                event.relatedTarget instanceof Node &&
                card.contains(event.relatedTarget)
              )
            )
              hover(card, true);
          };
          const out = (event: PointerEvent) => {
            if (!pointer || event.pointerType === "touch") return;
            const card = (event.target as Element).closest<HTMLElement>(
              cardSelector,
            );
            if (
              card &&
              !(
                event.relatedTarget instanceof Node &&
                card.contains(event.relatedTarget)
              ) &&
              !card.contains(document.activeElement)
            )
              hover(card, false);
          };
          const focusIn = (event: FocusEvent) => {
            const target = event.target as Element;
            revealFocused(target);
            const card = target.closest<HTMLElement>(cardSelector);
            if (card && target.matches(":focus-visible")) hover(card, true);
          };
          const focusOut = (event: FocusEvent) => {
            const card = (event.target as Element).closest<HTMLElement>(
              cardSelector,
            );
            if (
              card &&
              !(
                event.relatedTarget instanceof Node &&
                card.contains(event.relatedTarget)
              ) &&
              !card.matches(":hover")
            )
              hover(card, false);
          };
          const release = () => {
            if (pressed) {
              const target = pressed;
              safe(() =>
                gsap.to(target, {
                  scale: 1,
                  duration: 0.2,
                  clearProps: "transform",
                  overwrite: "auto",
                }),
              );
              pressed = null;
            }
          };
          const press = (event: PointerEvent) => {
            const button = (event.target as Element).closest<HTMLElement>(
              "button:not(:disabled), .primary, .outline-button, .clone-link-button",
            );
            if (!button || button.closest(cardSelector) === button) return;
            release();
            pressed = button;
            safe(() =>
              gsap.to(button, {
                scale: 0.97,
                duration: 0.12,
                overwrite: "auto",
              }),
            );
          };
          const imageLoaded = (event: Event) => {
            if (event.target instanceof HTMLImageElement)
              safe(() => {
                gsap.fromTo(
                  event.target,
                  { opacity: 0.35 },
                  { opacity: 1, duration: 0.4, clearProps: "opacity" },
                );
                refresh?.kill();
                refresh = gsap.delayedCall(0.1, () => ScrollTrigger.refresh());
              });
          };
          root.addEventListener("pointerover", over);
          root.addEventListener("pointerout", out);
          root.addEventListener("focusin", focusIn);
          root.addEventListener("focusout", focusOut);
          root.addEventListener("pointerdown", press);
          root.addEventListener("load", imageLoaded, true);
          document.addEventListener("pointerup", release);
          document.addEventListener("pointercancel", release);
          return () => {
            observer.disconnect();
            pendingScan?.kill();
            refresh?.kill();
            root.removeEventListener("pointerover", over);
            root.removeEventListener("pointerout", out);
            root.removeEventListener("focusin", focusIn);
            root.removeEventListener("focusout", focusOut);
            root.removeEventListener("pointerdown", press);
            root.removeEventListener("load", imageLoaded, true);
            document.removeEventListener("pointerup", release);
            document.removeEventListener("pointercancel", release);
            root
              .querySelectorAll<HTMLElement>("[data-motion-hover]")
              .forEach((element) => {
                delete element.dataset.motionHover;
              });
            root
              .querySelectorAll<HTMLElement>("[data-motion-reveal]")
              .forEach((element) => {
                delete element.dataset.motionReveal;
              });
            delete root.dataset.motion;
          };
        },
      );
      return () => media.revert();
    },
    { scope },
  );
  return (
    <div ref={scope} className="motion-page">
      {children}
    </div>
  );
}
