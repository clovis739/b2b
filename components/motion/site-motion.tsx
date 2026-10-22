"use client";
import { Icon } from "@/components/ui/icon";
import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { gsap, motion, useGSAP } from "@/lib/motion";

export default function SiteMotion() {
  const progress = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const search = useSearchParams().toString();
  useEffect(() => {
    document.dispatchEvent(new Event("site:navigation-complete"));
  }, [pathname, search]);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add(
      { all: "(min-width: 0px)", reduced: "(prefers-reduced-motion: reduce)" },
      (context) => {
        const reduced = context.conditions!.reduced;
        const topButton = back.current;
        let scrolling: gsap.core.Tween | undefined;
        let timeout: gsap.core.Tween | undefined;
        let pending = false;
        let shown = false;
        const safe = (fn: () => void) => context.add(fn);
        const complete = () =>
          safe(() => {
            if (!pending) return;
            pending = false;
            timeout?.kill();
            gsap.to(progress.current, {
              scaleX: 1,
              duration: 0.2,
              overwrite: true,
              onComplete: () => {
                safe(() =>
                  gsap.to(progress.current, { opacity: 0, duration: 0.18 }),
                );
              },
            });
          });
        const scroll = (target: HTMLElement | number, focus?: HTMLElement) =>
          safe(() => {
            scrolling?.kill();
            scrolling = gsap.to(window, {
              duration: reduced ? 0 : 0.85,
              ease: "power3.inOut",
              scrollTo: {
                y: target,
                offsetY: typeof target === "number" ? 0 : 100,
                autoKill: true,
              },
              onComplete: () => {
                if (focus) {
                  if (
                    !focus.hasAttribute("tabindex") &&
                    !focus.matches("a,button,input,select,textarea")
                  )
                    focus.tabIndex = -1;
                  focus.focus({ preventScroll: true });
                }
              },
            });
          });
        const click = (event: MouseEvent) => {
          if (
            event.defaultPrevented ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const link = (event.target as Element).closest<HTMLAnchorElement>(
            "a[href]",
          );
          if (
            !link ||
            link.hasAttribute("download") ||
            (link.target && link.target !== "_self")
          )
            return;
          const url = new URL(link.href, location.href);
          if (url.origin !== location.origin) return;
          const samePage =
            url.pathname === location.pathname &&
            url.search === location.search;
          if (samePage && url.hash) {
            let id;
            try {
              id = decodeURIComponent(url.hash.slice(1));
            } catch {
              return;
            }
            const target = Array.from(
              document.querySelectorAll<HTMLElement>("[id]"),
            ).find(
              (element) =>
                element.id === id && element.getClientRects().length > 0,
            );
            if (!target) return;
            event.preventDefault();
            if (location.hash !== url.hash)
              history.pushState(null, "", url.pathname + url.search + url.hash);
            scroll(target, target);
          } else if (!samePage && !reduced)
            safe(() => {
              pending = true;
              timeout?.kill();
              gsap.fromTo(
                progress.current,
                { opacity: 1, scaleX: 0.04 },
                {
                  scaleX: 0.86,
                  duration: 1.2,
                  ease: "power2.out",
                  overwrite: true,
                },
              );
              timeout = gsap.delayedCall(8, complete);
            });
        };
        const onScroll = () => {
          const visible = window.scrollY > 600;
          if (shown === visible) return;
          shown = visible;
          safe(() =>
            gsap.to(topButton, {
              autoAlpha: visible ? 1 : 0,
              y: visible ? 0 : 10,
              duration: reduced ? 0 : motion.hover,
              overwrite: true,
            }),
          );
        };
        const top = () =>
          scroll(0, document.getElementById("page-content") || undefined);
        const cancel = (event: KeyboardEvent) => {
          if (
            [
              "ArrowDown",
              "ArrowUp",
              "PageDown",
              "PageUp",
              "Home",
              "End",
              " ",
            ].includes(event.key) &&
            !(event.target as Element).closest(
              "input,textarea,select,[contenteditable=true]",
            )
          )
            scrolling?.kill();
        };
        const toggle = (event: Event) => {
          const detail = event.target;
          if (
            !(detail instanceof HTMLDetailsElement) ||
            !detail.open ||
            !detail.closest(".clone-header") ||
            reduced
          )
            return;
          const panel = detail.querySelector(":scope > div");
          if (panel)
            safe(() =>
              gsap.fromTo(
                panel,
                { opacity: 0, y: -8 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.25,
                  ease: motion.ease,
                  clearProps: "opacity,transform",
                  overwrite: "auto",
                },
              ),
            );
        };
        const animated = new WeakSet<Element>();
        const overlays = new MutationObserver(() => {
          if (reduced) return;
          document
            .querySelectorAll(".clone-cookie,.clone-chat-panel")
            .forEach((panel) => {
              if (animated.has(panel)) return;
              animated.add(panel);
              safe(() =>
                gsap.from(panel, {
                  opacity: 0,
                  y: 12,
                  duration: 0.32,
                  clearProps: "opacity,transform",
                  ease: motion.ease,
                }),
              );
            });
        });
        overlays.observe(document.body, { subtree: true, childList: true });
        document.addEventListener("click", click, true);
        document.addEventListener("toggle", toggle, true);
        document.addEventListener("site:navigation-complete", complete);
        document.addEventListener("keydown", cancel);
        window.addEventListener("scroll", onScroll, { passive: true });
        topButton?.addEventListener("click", top);
        onScroll();
        return () => {
          overlays.disconnect();
          timeout?.kill();
          scrolling?.kill();
          document.removeEventListener("click", click, true);
          document.removeEventListener("toggle", toggle, true);
          document.removeEventListener("site:navigation-complete", complete);
          document.removeEventListener("keydown", cancel);
          window.removeEventListener("scroll", onScroll);
          topButton?.removeEventListener("click", top);
        };
      },
    );
    return () => media.revert();
  }, []);
  return (
    <>
      <div
        ref={progress}
        className="motion-navigation-progress"
        aria-hidden="true"
      />
      <button
        ref={back}
        type="button"
        className="motion-back-top"
        aria-label="Back to top"
      >
        <Icon name="up" size={20}/>
      </button>
    </>
  );
}
