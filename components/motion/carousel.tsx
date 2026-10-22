"use client";
import { Icon } from "@/components/ui/icon";
import { Children, ReactNode, useEffect, useId, useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion";

export default function Carousel({
  children,
  label,
  className = "",
  desktop = 3,
  tablet = 2,
  autoplay = false,
}: {
  children: ReactNode;
  label: string;
  className?: string;
  desktop?: number;
  tablet?: number;
  autoplay?: boolean;
}) {
  const slides = Children.toArray(children);
  const id = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const moved = useRef(false);
  const [index, setIndex] = useState(0);
  const [layout, setLayout] = useState({ width: 0, count: desktop });
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  const [visible, setVisible] = useState(false);
  const [reduced, setReduced] = useState(true);
  const count = Math.min(layout.count, slides.length);
  const last = Math.max(0, slides.length - count);
  const current = Math.min(index, last);
  const gap = 20;
  const width = layout.width ? (layout.width - (count - 1) * gap) / count : 0;
  useEffect(() => {
    const element = viewport.current;
    if (!element) return;
    const measure = () =>
      setLayout({
        width: element.clientWidth,
        count: innerWidth < 700 ? 1 : innerWidth < 1100 ? tablet : desktop,
      });
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(element);
    window.addEventListener("resize", measure);
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 },
    );
    observer.observe(element);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    update();
    preference.addEventListener("change", update);
    return () => {
      resize.disconnect();
      observer.disconnect();
      window.removeEventListener("resize", measure);
      preference.removeEventListener("change", update);
    };
  }, [desktop, tablet]);
  useGSAP(
    () => {
      if (track.current)
        gsap.set(track.current, { x: -(width + gap) * current });
    },
    { dependencies: [width] },
  );
  useGSAP(
    () => {
      if (track.current)
        gsap.to(track.current, {
          x: -(width + gap) * current,
          duration: reduced ? 0 : 0.55,
          ease: "power3.inOut",
          overwrite: true,
        });
    },
    { dependencies: [current, reduced] },
  );
  useGSAP(
    () => {
      if (!autoplay || paused || interacting || reduced || !visible || !last)
        return;
      const timer = gsap.delayedCall(5, () => {
        if (!document.hidden) setIndex(current === last ? 0 : current + 1);
      });
      return () => {
        timer.kill();
      };
    },
    {
      dependencies: [
        autoplay,
        paused,
        interacting,
        reduced,
        visible,
        current,
        last,
      ],
    },
  );
  const go = (next: number) => {
    setPaused(true);
    setIndex(Math.max(0, Math.min(last, next)));
  };
  return (
    <section
      className={`gsap-carousel ${className}`}
      aria-label={label}
      aria-roledescription="carousel"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setInteracting(false);
      }}
    >
      <div
        ref={viewport}
        className="carousel-viewport"
        id={id}
        tabIndex={0}
        aria-label={`${label} slides. Use left and right arrow keys.`}
        onKeyDown={(e) => {
          if (e.target !== e.currentTarget) return;
          if (["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) {
            e.preventDefault();
            go(
              e.key === "Home"
                ? 0
                : e.key === "End"
                  ? last
                  : current + (e.key === "ArrowRight" ? 1 : -1),
            );
          }
        }}
        onPointerDown={(e) => {
          if (e.pointerType !== "mouse") {
            pointer.current = { x: e.clientX, y: e.clientY };
            moved.current = false;
          }
        }}
        onPointerMove={(e) => {
          if (pointer.current && Math.abs(e.clientX - pointer.current.x) > 12)
            moved.current = true;
        }}
        onPointerUp={(e) => {
          if (!pointer.current) return;
          const dx = e.clientX - pointer.current.x;
          const dy = e.clientY - pointer.current.y;
          pointer.current = null;
          if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy))
            go(current + (dx < 0 ? 1 : -1));
        }}
        onPointerCancel={() => {
          pointer.current = null;
        }}
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            moved.current = false;
          }
        }}
      >
        <div ref={track} className="carousel-track" style={{ gap }}>
          {slides.map((slide, i) => (
            <div
              className="carousel-slide"
              key={i}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}`}
              inert={i < current || i >= current + count}
              style={{ flexBasis: width ? `${width}px` : `${100 / count}%` }}
            >
              {slide}
            </div>
          ))}
        </div>
      </div>
      {last > 0 && (
        <div className="carousel-controls">
          <span
            className="carousel-count"
            aria-live={autoplay && !paused ? "off" : "polite"}
          >
            {current + 1}
            {count > 1
              ? `–${Math.min(slides.length, current + count)}`
              : ""} / {slides.length}
          </span>
          <div className="carousel-dots">
            {Array.from({ length: last + 1 }, (_, i) => (
              <button
                type="button"
                key={i}
                aria-label={`Show ${label.toLowerCase()} starting at slide ${i + 1}`}
                aria-current={current === i ? "true" : undefined}
                onClick={() => go(i)}
              />
            ))}
          </div>
          {autoplay && (
            <button
              type="button"
              className="carousel-play"
              onClick={() => setPaused(!paused)}
              aria-label={
                paused
                  ? `Play ${label.toLowerCase()}`
                  : `Pause ${label.toLowerCase()}`
              }
            >
              {paused ? "Play" : "Pause"}
            </button>
          )}
          <button
            className="carousel-arrow"
            type="button"
            aria-label={`Previous ${label.toLowerCase()}`}
            aria-controls={id}
            disabled={current === 0}
            onClick={() => go(current - 1)}
          >
            <Icon name="left" size={16}/>
          </button>
          <button
            className="carousel-arrow"
            type="button"
            aria-label={`Next ${label.toLowerCase()}`}
            aria-controls={id}
            disabled={current === last}
            onClick={() => go(current + 1)}
          >
            <Icon name="arrow" size={16}/>
          </button>
        </div>
      )}
    </section>
  );
}
