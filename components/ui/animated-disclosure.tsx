"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { gsap, useGSAP } from "@/lib/motion";

export default function AnimatedDisclosure({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const detail = useRef<HTMLDetailsElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const icon = useRef<SVGSVGElement>(null);
  const expanded = useRef(defaultOpen);
  const tween = useRef<gsap.core.Timeline | null>(null);
  const { contextSafe } = useGSAP(
    () => () => {
      tween.current?.kill();
    },
    { scope: detail },
  );

  function toggle(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    contextSafe(() => {
      const element = detail.current;
      const content = panel.current;
      if (!element || !content) return;
      expanded.current = !expanded.current;
      const opening = expanded.current;
      const wasOpen = element.open;
      const height = wasOpen ? content.getBoundingClientRect().height : 0;
      tween.current?.kill();
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) {
        element.open = opening;
        gsap.set(content, { clearProps: "height,opacity,overflow" });
        gsap.set(icon.current, { rotation: opening ? 180 : 0 });
        return;
      }
      element.open = true;
      gsap.set(content, {
        height,
        overflow: "hidden",
        opacity: wasOpen ? gsap.getProperty(content, "opacity") : 0,
      });
      tween.current = gsap
        .timeline({
          onComplete: () => {
            element.open = opening;
            gsap.set(content, { clearProps: "height,opacity,overflow" });
            tween.current = null;
          },
        })
        .to(
          content,
          {
            height: opening ? content.scrollHeight : 0,
            opacity: opening ? 1 : 0,
            duration: 0.32,
            ease: "power2.inOut",
          },
          0,
        )
        .to(
          icon.current,
          { rotation: opening ? 180 : 0, duration: 0.25, ease: "power2.out" },
          0,
        );
    })();
  }

  return (
    <details className="animated-disclosure" ref={detail} open={defaultOpen}>
      <summary onClick={toggle}>
        <span>{title}</span>
        <ChevronDown
          ref={icon}
          size={20}
          aria-hidden="true"
          style={defaultOpen ? { transform: "rotate(180deg)" } : undefined}
        />
      </summary>
      <div ref={panel} className="animated-disclosure-panel">
        <div className="animated-disclosure-content">{children}</div>
      </div>
    </details>
  );
}
