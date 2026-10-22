"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Ship,
  Plane,
  Truck,
  ShieldCheck,
  Package,
} from "lucide-react";
import { sectors } from "@/app/site-data";
import { calculateLandedCost, formatUSD } from "@/lib/landed-cost";
import {
  Field,
  NumberField,
  initialLandedForm,
  type LandedForm,
} from "./landed/fields";
import LandedResults from "./landed/results";
import LandedGuide from "./landed/guide";
import { gsap, useGSAP } from "@/lib/motion";
const steps = [
  "Product",
  "Route and packaging",
  "Custom calculating",
  "Result",
];
export default function LandedCostCalculator() {
  const [data, setData] = useState<LandedForm>(initialLandedForm);
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0);
  const [error, setError] = useState("");
  const heading = useRef<HTMLHeadingElement>(null);
  const progress = useRef<HTMLElement>(null);
  const shouldFocus = useRef(false);
  useEffect(() => {
    if (shouldFocus.current) {
      heading.current?.focus({ preventScroll: true });
      shouldFocus.current = false;
    }
  }, [step]);
  const { contextSafe } = useGSAP();
  function update<K extends keyof LandedForm>(key: K, value: LandedForm[K]) {
    setData((current) => ({ ...current, [key]: value }));
    setFurthest((current) => Math.min(current, step));
    setError("");
  }
  const numeric = (value: string) =>
    Number.isFinite(Number(value)) ? Math.max(0, Number(value)) : 0;
  const costs = {
    quantity: numeric(data.quantity),
    unitPrice: numeric(data.unitPrice),
    freight: numeric(data.freight),
    insurance: data.insured ? numeric(data.insurance) : 0,
    dutyRate: numeric(data.dutyRate),
    taxRate: numeric(data.taxRate),
    brokerage: numeric(data.brokerage),
    inland: numeric(data.inland),
    other: numeric(data.other),
    sellingPrice: numeric(data.sellingPrice),
    customsValue:
      data.customsValue === "" ? undefined : numeric(data.customsValue),
    taxBase: data.taxBase === "" ? undefined : numeric(data.taxBase),
    recoverableTax: data.recoverableTax,
  };
  const result = calculateLandedCost({
    ...costs,
    quantity: Math.max(costs.quantity, 0.001),
  });
  function go(next: number) {
    shouldFocus.current = true;
    setStep(next);
    setError("");
    contextSafe(() => {
      const target = progress.current;
      if (!target) return;
      gsap.to(window, {
        duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 0.6,
        scrollTo: { y: target, offsetY: 100 },
        overwrite: "auto",
        ease: "power2.out",
      });
    })();
  }
  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 0 && !data.product.trim()) {
      setError("Enter a product name.");
      return;
    }
    if (step === 1 && (!data.origin.trim() || !data.destination.trim())) {
      setError("Enter both route countries.");
      return;
    }
    if (
      step === 1 &&
      data.origin.trim().toLowerCase() === data.destination.trim().toLowerCase()
    ) {
      setError(
        "Choose different origin and destination countries for this import estimate.",
      );
      return;
    }
    setFurthest((current) => Math.max(current, step + 1));
    go(step + 1);
  }
  const number = (
    key: keyof LandedForm,
    label: string,
    options: {
      suffix?: string;
      min?: string;
      max?: string;
      required?: boolean;
      step?: string;
      hint?: string;
    } = {},
  ) => (
    <NumberField
      label={label}
      value={String(data[key])}
      onChange={(value) => update(key, value)}
      {...options}
    />
  );
  return (
    <div className="landed-calculator">
      <nav
        ref={progress}
        id="landed-calculator-steps"
        aria-label="Calculation progress"
        className="landed-stepper"
      >
        <ol>
          {steps.map((label, index) => (
            <li key={label}>
              <button
                type="button"
                aria-current={step === index ? "step" : undefined}
                disabled={index > furthest || index > step}
                onClick={() => go(index)}
              >
                <span>{index < step ? <Check size={18} /> : index + 1}</span>
                <strong>{label}</strong>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      <h2 className="sr-only" ref={heading} tabIndex={-1}>
        {steps[step]}
      </h2>
      {step === 3 ? (
        <LandedResults data={data} result={result} edit={() => go(0)} />
      ) : (
        <form onSubmit={next} className="landed-form" aria-label={steps[step]}>
          <div className="landed-form-main">
            {step === 0 && (
              <>
                <section
                  className="landed-card"
                  id="product-pricing"
                  aria-labelledby="product-pricing-title"
                >
                  <header>
                    <span className="landed-section-icon">
                      <Package size={22} />
                    </span>
                    <div>
                      <h2 id="product-pricing-title">Product &amp; price</h2>
                      <p>Add the item and purchase terms for your estimate.</p>
                    </div>
                  </header>
                  <div className="landed-fields">
                    <Field label="Product name">
                      <input
                        autoComplete="off"
                        required
                        maxLength={160}
                        value={data.product}
                        onChange={(e) => update("product", e.target.value)}
                        placeholder="Enter product name"
                      />
                    </Field>
                    <Field label="Product category">
                      <select
                        required
                        value={data.category}
                        onChange={(e) => update("category", e.target.value)}
                      >
                        <option value="">Select product category</option>
                        {sectors.map((sector) => (
                          <option key={sector.slug} value={sector.name}>
                            {sector.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field
                      label="Product HS code"
                      hint="Optional, 6–10 digits. Confirm the classification with your customs adviser."
                    >
                      <input
                        inputMode="numeric"
                        pattern="[0-9]{6,10}"
                        maxLength={10}
                        value={data.hsCode}
                        onChange={(e) => update("hsCode", e.target.value)}
                        placeholder="Enter HS code"
                      />
                    </Field>
                    <div className="landed-fields-pair">
                      {number("quantity", "Quantity", {
                        suffix: "",
                        min: "0.001",
                        max: "1000000000",
                      })}
                      <Field label="Units">
                        <select
                          value={data.units}
                          onChange={(e) => update("units", e.target.value)}
                        >
                          {[
                            "Pieces",
                            "Kilograms",
                            "Metric tons",
                            "Litres",
                            "Cartons",
                            "Pallets",
                          ].map((unit) => (
                            <option key={unit}>{unit}</option>
                          ))}
                        </select>
                      </Field>
                    </div>
                    {number("unitPrice", "Unit price, USD", { min: "0.0001" })}
                    {number("weight", "Total weight of cargo, kg", {
                      suffix: "kg",
                      min: "0.001",
                    })}
                  </div>
                </section>
                <section
                  className="landed-card"
                  id="shipping-type"
                  aria-labelledby="shipping-type-title"
                >
                  <header>
                    <span className="landed-section-icon">
                      <Ship size={22} />
                    </span>
                    <div>
                      <h2 id="shipping-type-title">Shipping type</h2>
                      <p>Choose how your shipment will travel.</p>
                    </div>
                  </header>
                  <fieldset className="landed-shipping">
                    <legend className="sr-only">Shipping type</legend>
                    {(
                      [
                        ["sea", "Sea container", Ship],
                        ["air", "Air", Plane],
                        ["road", "Road", Truck],
                      ] as const
                    ).map(([value, label, ModeIcon]) => (
                      <label key={value}>
                        <input
                          type="radio"
                          name="shipping-type"
                          value={value}
                          checked={data.shippingType === value}
                          onChange={() => update("shippingType", value)}
                        />
                        <span>
                          <ModeIcon size={25} />
                          <strong>{label}</strong>
                        </span>
                      </label>
                    ))}
                  </fieldset>
                  {data.shippingType === "sea" && (
                    <div className="landed-fields landed-shipping-fields">
                      <Field label="Container type">
                        <select
                          value={data.container}
                          onChange={(e) => update("container", e.target.value)}
                        >
                          {[
                            "20 ft standard",
                            "40 ft standard",
                            "40 ft high cube",
                          ].map((type) => (
                            <option key={type}>{type}</option>
                          ))}
                        </select>
                      </Field>
                      {number("containers", "Number of containers", {
                        step: "1",
                        suffix: "",
                        min: "1",
                        max: "10000",
                      })}
                    </div>
                  )}
                  <label className="landed-checkbox">
                    <input
                      type="checkbox"
                      checked={data.insured}
                      onChange={(e) => update("insured", e.target.checked)}
                    />
                    <span>
                      Include cargo insurance
                      <small>Add your insurance quote in the cost step.</small>
                    </span>
                    <ShieldCheck size={21} />
                  </label>
                </section>
              </>
            )}
            {step === 1 && (
              <section className="landed-card">
                <header>
                  <span className="landed-section-icon">
                    <Truck size={22} />
                  </span>
                  <div>
                    <h2>Route and packaging</h2>
                    <p>
                      Set the shipment locations and how the goods are packed.
                    </p>
                  </div>
                </header>
                <div className="landed-fields">
                  <Field label="Origin country">
                    <input
                      required
                      maxLength={80}
                      autoComplete="off"
                      placeholder="Country of origin"
                      value={data.origin}
                      onChange={(e) => update("origin", e.target.value)}
                    />
                  </Field>
                  <Field label="Destination country">
                    <input
                      required
                      maxLength={80}
                      autoComplete="off"
                      placeholder="Country of import"
                      value={data.destination}
                      onChange={(e) => update("destination", e.target.value)}
                    />
                  </Field>
                  <Field label="Packaging">
                    <select
                      value={data.packaging}
                      onChange={(e) => update("packaging", e.target.value)}
                    >
                      {[
                        "Cartons",
                        "Pallets",
                        "Crates",
                        "Bags",
                        "Bulk",
                        "Other",
                      ].map((pack) => (
                        <option key={pack}>{pack}</option>
                      ))}
                    </select>
                  </Field>
                  {number("packages", "Number of packages", {
                    step: "1",
                    suffix: "",
                    min: "1",
                    max: "1000000000",
                  })}
                </div>
                <p className="landed-assumption">
                  Transport details describe your shipment. They do not generate
                  a live freight quote; enter the full quoted cost in the next
                  step.
                </p>
              </section>
            )}
            {step === 2 && (
              <>
                <section className="landed-card">
                  <header>
                    <div>
                      <h2>Custom calculating</h2>
                      <p>
                        Use your own quotes and applicable rates. All amounts
                        cover the full shipment unless marked per unit.
                      </p>
                    </div>
                  </header>
                  <div className="landed-fields">
                    {number("freight", "Freight cost, USD")}
                    {data.insured && number("insurance", "Insurance cost, USD")}
                    {number("dutyRate", "Customs duty rate", {
                      suffix: "%",
                      max: "1000",
                    })}
                    {number("taxRate", "Import tax rate", {
                      suffix: "%",
                      max: "1000",
                    })}
                    {number("brokerage", "Brokerage & handling, USD")}
                    {number("inland", "Inland transportation, USD")}
                    {number("other", "Other import costs, USD")}
                    {number(
                      "sellingPrice",
                      "Expected selling price / unit, USD",
                      { min: "0.0001" },
                    )}
                  </div>
                  <label className="landed-checkbox">
                    <input
                      type="checkbox"
                      checked={data.recoverableTax}
                      onChange={(e) =>
                        update("recoverableTax", e.target.checked)
                      }
                    />
                    <span>
                      Exclude recoverable import tax from margin
                      <small>Tax is still included in the cash outlay.</small>
                    </span>
                  </label>
                </section>
                <section className="landed-card">
                  <h3>Valuation assumptions</h3>
                  <p className="landed-assumption">
                    By default, duty uses goods + freight + insurance; import
                    tax uses that customs value + duty. Override these bases if
                    your shipment requires a different calculation.
                  </p>
                  <div className="landed-fields">
                    {number("customsValue", "Customs value override, USD", {
                      required: false,
                    })}
                    {number("taxBase", "Import tax base override, USD", {
                      required: false,
                    })}
                  </div>
                </section>
              </>
            )}
            {error && (
              <p role="alert" className="landed-error">
                {error}
              </p>
            )}
            <div className="landed-form-actions">
              {step > 0 && (
                <button
                  className="outline-button"
                  type="button"
                  onClick={() => go(step - 1)}
                >
                  <ArrowLeft size={16} /> Back
                </button>
              )}
              <button className="primary" type="submit">
                {step === 2 ? "Calculate landed cost" : "Continue calculation"}
                <ArrowRight size={17} />
              </button>
            </div>
          </div>
          <aside className="landed-estimate">
            <span className="page-kicker">YOUR SHIPMENT</span>
            <h3>{data.product || "Start with your product"}</h3>
            <dl>
              <div>
                <dt>Quantity</dt>
                <dd>
                  {data.quantity || "0"} {data.units.toLowerCase()}
                </dd>
              </div>
              <div>
                <dt>Goods value</dt>
                <dd>{formatUSD(result.goods)}</dd>
              </div>
              <div>
                <dt>Transport</dt>
                <dd>
                  {data.shippingType === "sea"
                    ? "Sea container"
                    : data.shippingType === "air"
                      ? "Air"
                      : "Road"}
                </dd>
              </div>
              {data.shippingType === "sea" && (
                <div>
                  <dt>Equipment</dt>
                  <dd>
                    {data.containers} × {data.container}
                  </dd>
                </div>
              )}
            </dl>
            <p>
              <ShieldCheck size={19} /> Use confirmed quotes to improve your
              estimate.
            </p>
          </aside>
        </form>
      )}
      <LandedGuide />
    </div>
  );
}
