"use client";
import Link from "next/link";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/motion";
import { Icon } from "../../app/ui";
const steps = [
  {
    title: "Create a product request in a minute",
    description:
      "Add product specifications, quantity, and your preferred destination.",
  },
  {
    title: "Get multiple quotes from trusted suppliers",
    description:
      "Keep the details together and compare what each supplier can offer.",
  },
  {
    title: "Negotiate and choose the best offer!",
    description:
      "Ask the right questions and agree the next step directly with your partner.",
  },
];
export default function SourcingSection() {
  const [active, setActive] = useState(0);
  const preview = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const media = gsap.matchMedia();
      media.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          preview.current,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            clearProps: "opacity,transform",
          },
        );
      });
      return () => media.revert();
    },
    { dependencies: [active], scope: preview },
  );
  return (
    <section className="clone-section clone-sourcing">
      <div>
        <h2>Efficient product sourcing</h2>
        <p>Create one RFQ and get multiple quotes from trusted suppliers.</p>
        <div className="clone-sourcing-steps">
          {steps.map((s, i) => (
            <button
              key={s.title}
              className={i === active ? "active" : ""}
              onClick={() => setActive(i)}
              aria-pressed={i === active}
            >
              <span>{i + 1}</span>
              <div>
                <small>Step {i + 1}</small>
                <h3>{s.title}</h3>
                {active === i && <p>{s.description}</p>}
              </div>
            </button>
          ))}
        </div>
        <Link href="/rfqs/add-rfq" className="primary">
          Get quotes <Icon name="arrow" size={18} />
        </Link>
        <small className="free-note">*100% Free</small>
      </div>
      <div className="clone-rfq-preview" aria-live="polite">
        <div className="rfq-preview-content" ref={preview}>
        <div className="rfq-preview-top">
          <span className="rfq-preview-icon">
            <Icon
              name={active === 0 ? "mail" : active === 1 ? "list" : "check"}
              size={32}
            />
          </span>
          <span>
            Request for quotation<small>{steps[active].title}</small>
          </span>
        </div>
        {active === 0 ? (
          <>
            <div className="mock-field">
              <small>Product</small>
              <strong>Fresh red onions, export quality</strong>
            </div>
            <div className="mock-field-row">
              <div className="mock-field">
                <small>Quantity</small>
                <strong>20 metric tons</strong>
              </div>
              <div className="mock-field">
                <small>Destination</small>
                <strong>🇳🇬 Nigeria</strong>
              </div>
            </div>
            <div className="mock-field">
              <small>Sourcing requirements</small>
              <p>
                Fresh harvest, uniform sizes, export packing. Please include
                shipment terms and lead time.
              </p>
            </div>
          </>
        ) : active === 1 ? (
          <div className="mock-proposals">
            {[
              "Fresh Produce Exports",
              "Global Harvest Trading",
              "Greenline Suppliers",
            ].map((t, i) => (
              <div key={t}>
                <span>{t[0]}</span>
                <div>
                  <strong>{t}</strong>
                  <small>Sample proposal · {i + 2} days lead time</small>
                </div>
                <Icon name="check" size={17} />
              </div>
            ))}
          </div>
        ) : (
          <div className="mock-complete">
            <Icon name="shield" size={70} />
            <h3>A better connection starts with a clear conversation.</h3>
            <p>
              Keep specifications, quality and delivery requirements in view as
              you compare your options.
            </p>
          </div>
        )}
        <span className="preview-label">Illustrative request preview</span>
        </div>
      </div>
    </section>
  );
}
