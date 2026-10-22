"use client";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/motion";
export default function LoadingState() {
  const scope = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add(
        "(prefers-reduced-motion: no-preference)",
        () => {
          gsap.to(".motion-loading-ring", {
            rotation: 360,
            repeat: -1,
            duration: 1,
            ease: "none",
          });
          gsap.to(".motion-skeleton", {
            opacity: 0.4,
            duration: 0.7,
            stagger: 0.1,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          });
        },
        scope,
      );
      return () => media.revert();
    },
    { scope },
  );
  return (
    <main
      ref={scope}
      className="container site-content motion-loading"
      aria-busy="true"
    >
      <div className="motion-loading-title" role="status">
        <span className="motion-loading-ring" aria-hidden="true" />
        <h1>Loading your next opportunity…</h1>
      </div>
      <p>Preparing the page for you.</p>
      <div
        className="motion-skeleton motion-skeleton-heading"
        aria-hidden="true"
      />
      <div className="motion-loading-grid" aria-hidden="true">
        {[0, 1, 2].map((n) => (
          <div className="motion-skeleton motion-skeleton-card" key={n} />
        ))}
      </div>
    </main>
  );
}
