"use client";
import { ReactNode, useRef } from "react";
import { gsap, motion, useGSAP } from "@/lib/motion";
import { Icon } from "./icon";
export function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const closing = useRef(false);
  const { contextSafe } = useGSAP(() => {
    const previous = document.activeElement;
    const dialog = ref.current;
    dialog?.showModal();
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        dialog,
        { opacity: 0, y: 18, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.3,
          ease: motion.ease,
          clearProps: "opacity,transform",
        },
      );
    });
    return () => {
      media.revert();
      dialog?.close();
      if (previous instanceof HTMLElement) previous.focus();
    };
  }, []);
  const close = () =>
    contextSafe(() => {
      if (closing.current) return;
      closing.current = true;
      gsap.to(ref.current, {
        opacity: 0,
        y: 12,
        scale: 0.985,
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : motion.exit,
        ease: "power2.in",
        onComplete: onClose,
        overwrite: true,
      });
    })();
  return (
    <dialog
      ref={ref}
      className="modal"
      onCancel={(e) => {
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      aria-labelledby="modal-title"
    >
      <div className="modal-head">
        <h2 id="modal-title">{title}</h2>
        <button
          className="icon-button"
          onClick={close}
          aria-label="Close dialog"
        >
          <Icon name="close" />
        </button>
      </div>
      {children}
    </dialog>
  );
}
