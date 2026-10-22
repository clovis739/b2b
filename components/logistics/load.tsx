"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Package,
  Container,
  Truck,
  Check,
  Download,
  Pencil,
} from "lucide-react";
import {
  loadVehicles,
  planCargo,
  type Cargo,
  type Vehicle,
} from "@/lib/load-planner";
import { useLogisticsController } from "@/hooks/use-logistics-controller";
import { gsap, useGSAP } from "@/lib/motion";
import LoadPreview from "./load/preview";
import LoadGuide from "./load/guide";
import { Field, NumberField } from "./landed/fields";
const steps = ["Products", "Container & Trucks", "Stuffing result"];
function product(id: number, pallet = false): Cargo {
  return {
    id,
    name: pallet ? "Loaded pallets" : "Product " + id,
    type: pallet ? "Pallets" : "Boxes",
    length: pallet ? 120 : 60,
    width: pallet ? 80 : 40,
    height: pallet ? 140 : 40,
    weight: pallet ? 250 : 20,
    quantity: 100,
    rotate: true,
    stack: !pallet,
  };
}
export default function LoadCalculator() {
  const { variant } = useLogisticsController();
  const [cargo, setCargo] = useState<Cargo[]>([
    product(1, variant === "pallets"),
  ]);
  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<"container" | "truck">("container");
  const [vehicleId, setVehicleId] = useState("20-standard");
  const [custom, setCustom] = useState<Vehicle>({
    id: "custom",
    name: "Custom equipment",
    kind: "container",
    length: 600,
    width: 240,
    height: 240,
    payload: 10000,
  });
  const [result, setResult] = useState<ReturnType<typeof planCargo> | null>(
    null,
  );
  const [selected, setSelected] = useState(0);
  const [error, setError] = useState("");
  const serial = useRef(1);
  const heading = useRef<HTMLHeadingElement>(null);
  const wizard = useRef<HTMLElement>(null);
  const focus = useRef(false);
  const { contextSafe } = useGSAP();
  const vehicle =
    vehicleId === "custom"
      ? custom
      : loadVehicles.find((v) => v.id === vehicleId)!;
  useEffect(() => {
    if (focus.current) {
      heading.current?.focus({ preventScroll: true });
      focus.current = false;
    }
  }, [step]);
  function go(next: number) {
    focus.current = true;
    setStep(next);
    setError("");
    contextSafe(() => {
      if (!wizard.current) return;
      gsap.to(window, {
        duration: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? 0
          : 0.6,
        scrollTo: { y: wizard.current, offsetY: 100 },
        overwrite: "auto",
        ease: "power2.out",
      });
    })();
  }
  function update(
    id: number,
    key: keyof Cargo,
    value: string | number | boolean,
  ) {
    setCargo((list) =>
      list.map((c) => (c.id === id ? { ...c, [key]: value } : c)),
    );
    setResult(null);
    setError("");
  }
  function advance(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 0) {
      if (cargo.some((c) => !c.name.trim())) {
        setError("Give each product a name.");
        return;
      }
      go(1);
      return;
    }
    try {
      const next = planCargo(cargo, vehicle);
      setResult(next);
      setSelected(0);
      go(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Check your cargo details.");
    }
  }
  function download() {
    if (!result) return;
    const escape = (v: string | number) =>
      '"' +
      (typeof v === "string" && /^\s*[=+@-]/.test(v)
        ? "'" + v
        : String(v)
      ).replaceAll('"', '""') +
      '"';
    const rows = [
      [
        "Load",
        "Equipment",
        "Product",
        "Quantity",
        "Load weight kg",
        "Load volume m3",
      ],
      ...result.plans.flatMap((p, i) =>
        cargo.map((c, j) => [
          i + 1,
          vehicle.name,
          c.name,
          p.counts[j],
          p.weight,
          p.volume,
        ]),
      ),
    ];
    const url = URL.createObjectURL(
      new Blob([rows.map((row) => row.map(escape).join(",")).join("\r\n")], {
        type: "text/csv;charset=utf-8",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "cargo-loading-estimate.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="load-calculator">
      <section
        id="load-planner"
        ref={wizard}
        className="load-planner"
        aria-label="Load planner"
      >
        <nav className="load-stepper" aria-label="Load planning progress">
          <ol>
            {steps.map((label, i) => (
              <li key={label}>
                <button
                  type="button"
                  disabled={i > step}
                  aria-current={i === step ? "step" : undefined}
                  onClick={() => go(i)}
                >
                  <span>{i < step ? <Check size={18} /> : i + 1}</span>
                  {label}
                </button>
              </li>
            ))}
          </ol>
        </nav>
        <h2 className="sr-only" tabIndex={-1} ref={heading}>
          {steps[step]}
        </h2>
        {step < 2 ? (
          <form
            className="load-planner-form"
            aria-label={steps[step]}
            onSubmit={advance}
          >
            {step === 0 ? (
              <>
                <div className="load-form-heading">
                  <div>
                    <span className="page-kicker">CARGO DETAILS</span>
                    <h2>Your products</h2>
                    <p>
                      Use outside dimensions including packaging. All dimensions
                      are in centimeters.
                    </p>
                  </div>
                  <span className="load-count-chip">
                    {cargo.length} / 12 types
                  </span>
                </div>
                <div className="load-product-list">
                  {cargo.map((c, index) => (
                    <section
                      className="load-product-card"
                      key={c.id}
                      aria-label={"Product " + (index + 1)}
                    >
                      <header>
                        <span>
                          <Package size={19} /> Product {index + 1}
                        </span>
                        {cargo.length > 1 && (
                          <button
                            type="button"
                            className="load-delete"
                            aria-label={"Remove " + c.name}
                            onClick={() => {
                              setCargo((list) =>
                                list.filter((row) => row.id !== c.id),
                              );
                              setResult(null);
                            }}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </header>
                      <div className="load-product-fields">
                        <Field label="Product name">
                          <input
                            value={c.name}
                            onChange={(e) =>
                              update(c.id, "name", e.target.value)
                            }
                            required
                            maxLength={100}
                          />
                        </Field>
                        <Field label="Cargo type">
                          <select
                            value={c.type}
                            onChange={(e) =>
                              update(c.id, "type", e.target.value)
                            }
                          >
                            {[
                              "Boxes",
                              "Pallets",
                              "Sacks",
                              "Barrels",
                              "Custom bounding box",
                            ].map((type) => (
                              <option key={type}>{type}</option>
                            ))}
                          </select>
                        </Field>
                        {(
                          [
                            ["length", "Length (cm)"],
                            ["width", "Width (cm)"],
                            ["height", "Height (cm)"],
                            ["weight", "Weight per item (kg)"],
                            ["quantity", "Quantity"],
                          ] as const
                        ).map(([key, label]) => (
                          <NumberField
                            key={key}
                            label={label}
                            value={String(c[key] || "")}
                            onChange={(v) => update(c.id, key, Number(v))}
                            suffix={
                              key === "weight"
                                ? "kg"
                                : key === "quantity"
                                  ? ""
                                  : "cm"
                            }
                            min={key === "quantity" ? "1" : "0.1"}
                            max={
                              key === "quantity"
                                ? "1000000"
                                : key === "weight"
                                  ? "100000"
                                  : "2000"
                            }
                            step={key === "quantity" ? "1" : "any"}
                          />
                        ))}
                      </div>
                      <div className="load-cargo-rules">
                        <label>
                          <input
                            type="checkbox"
                            checked={c.rotate}
                            onChange={(e) =>
                              update(c.id, "rotate", e.target.checked)
                            }
                          />{" "}
                          Allow horizontal rotation
                        </label>
                        <label>
                          <input
                            type="checkbox"
                            checked={c.stack}
                            onChange={(e) =>
                              update(c.id, "stack", e.target.checked)
                            }
                          />{" "}
                          Stack upright
                        </label>
                      </div>
                      {c.type !== "Boxes" && (
                        <p className="load-note">
                          Uses the outer rectangular dimensions. Sacks, barrels
                          and irregular shapes are not shape-nested.
                        </p>
                      )}
                    </section>
                  ))}
                </div>
                <button
                  className="outline-button load-add"
                  type="button"
                  disabled={cargo.length >= 12}
                  onClick={() => {
                    serial.current++;
                    setCargo((list) => [...list, product(serial.current)]);
                    setResult(null);
                  }}
                >
                  <Plus size={18} /> Add product
                </button>
              </>
            ) : (
              <>
                <div className="load-form-heading">
                  <div>
                    <span className="page-kicker">CHOOSE YOUR EQUIPMENT</span>
                    <h2>Container &amp; Trucks</h2>
                    <p>
                      Preset dimensions are planning assumptions. Confirm actual
                      equipment with your carrier.
                    </p>
                  </div>
                </div>
                <fieldset className="load-mode">
                  <legend className="sr-only">Equipment category</legend>
                  {(
                    [
                      ["container", "Containers", Container],
                      ["truck", "Trucks", Truck],
                    ] as const
                  ).map(([value, label, Icon]) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="equipment-category"
                        checked={kind === value}
                        onChange={() => {
                          setKind(value);
                          setVehicleId(
                            loadVehicles.find((v) => v.kind === value)!.id,
                          );
                          setCustom((v) => ({ ...v, kind: value }));
                          setResult(null);
                        }}
                      />
                      <span>
                        <Icon size={24} />
                        {label}
                      </span>
                    </label>
                  ))}
                </fieldset>
                <div className="load-equipment-fields">
                  <Field label="Equipment">
                    <select
                      value={vehicleId}
                      onChange={(e) => {
                        setVehicleId(e.target.value);
                        setResult(null);
                      }}
                    >
                      {loadVehicles
                        .filter((v) => v.kind === kind)
                        .map((v) => (
                          <option value={v.id} key={v.id}>
                            {v.name}
                          </option>
                        ))}
                      <option value="custom">Custom equipment</option>
                    </select>
                  </Field>
                  {vehicleId === "custom" &&
                    (
                      [
                        ["length", "Internal length (cm)"],
                        ["width", "Internal width (cm)"],
                        ["height", "Internal height (cm)"],
                        ["payload", "Payload limit (kg)"],
                      ] as const
                    ).map(([key, label]) => (
                      <NumberField
                        key={key}
                        label={label}
                        value={String(custom[key] || "")}
                        min="1"
                        max="100000"
                        suffix={key === "payload" ? "kg" : "cm"}
                        onChange={(v) =>
                          setCustom((current) => ({
                            ...current,
                            [key]: Number(v),
                          }))
                        }
                      />
                    ))}
                </div>
                <div className="load-equipment-spec">
                  <Container size={40} />
                  <div>
                    <h3>{vehicle.name}</h3>
                    <p>
                      {vehicle.length} × {vehicle.width} × {vehicle.height} cm
                      inside
                    </p>
                    <span>
                      Payload limit: {vehicle.payload.toLocaleString("en-US")}{" "}
                      kg
                    </span>
                  </div>
                </div>
                <p className="load-note">
                  The estimate uses separate lengthwise sections by product,
                  with upright stacking and optional 90-degree horizontal
                  rotation. It does not model axle loads, restraint or door
                  clearance.
                </p>
              </>
            )}
            {error && (
              <p className="load-error" role="alert">
                {error}
              </p>
            )}
            <div className="load-actions">
              {step > 0 && (
                <button
                  type="button"
                  className="outline-button"
                  onClick={() => go(step - 1)}
                >
                  <ArrowLeft size={17} /> Back
                </button>
              )}
              <button className="primary" type="submit">
                {step === 0
                  ? "Continue to equipment"
                  : "Calculate loading plan"}
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        ) : (
          result && (
            <div className="load-results">
              <div className="load-form-heading">
                <div>
                  <span className="page-kicker">YOUR PLANNING ESTIMATE</span>
                  <h2>Stuffing result</h2>
                </div>
                <button className="outline-button" onClick={() => go(0)}>
                  <Pencil size={16} /> Edit products
                </button>
              </div>
              {result.impossible.length ? (
                <div className="load-error" role="alert">
                  <h3>Some cargo cannot fit this equipment</h3>
                  <p>
                    {result.impossible.map((i) => cargo[i].name).join(", ")}{" "}
                    exceeds the dimension or payload limits. Adjust the product
                    or choose other equipment.
                  </p>
                  <button className="outline-button" onClick={() => go(1)}>
                    Change equipment
                  </button>
                </div>
              ) : (
                <>
                  <div className="load-metrics">
                    {[
                      ["Loads required", String(result.plans.length)],
                      [
                        "Total cargo volume",
                        result.totalVolume.toFixed(2) + " m³",
                      ],
                      [
                        "Total cargo weight",
                        result.totalWeight.toLocaleString("en-US") + " kg",
                      ],
                      [
                        "Selected load space use",
                        (
                          (result.plans[selected].volume /
                            ((vehicle.length * vehicle.width * vehicle.height) /
                              1e6)) *
                          100
                        ).toFixed(1) + "%",
                      ],
                    ].map(([label, value]) => (
                      <article key={label}>
                        <span>{label}</span>
                        <strong>{value}</strong>
                      </article>
                    ))}
                  </div>
                  <div className="load-result-layout">
                    <LoadPreview
                      plan={result.plans[selected]}
                      vehicle={vehicle}
                      cargo={cargo}
                    />
                    <aside className="load-selected">
                      <Field label="View load">
                        <select
                          value={selected}
                          onChange={(e) => setSelected(Number(e.target.value))}
                        >
                          {result.plans.map((_, i) => (
                            <option value={i} key={i}>
                              Load {i + 1}
                            </option>
                          ))}
                        </select>
                      </Field>
                      <h3>{vehicle.name}</h3>
                      <dl>
                        <div>
                          <dt>Loaded weight</dt>
                          <dd>
                            {result.plans[selected].weight.toLocaleString(
                              "en-US",
                            )}{" "}
                            kg
                          </dd>
                        </div>
                        <div>
                          <dt>Payload use</dt>
                          <dd>
                            {(
                              (result.plans[selected].weight /
                                vehicle.payload) *
                              100
                            ).toFixed(1)}
                            %
                          </dd>
                        </div>
                      </dl>
                      <ul>
                        {cargo.map((c, i) => (
                          <li key={c.id}>
                            <span>{c.name}</span>
                            <strong>{result.plans[selected].counts[i]}</strong>
                          </li>
                        ))}
                      </ul>
                    </aside>
                  </div>
                  <div className="load-actions">
                    <button
                      type="button"
                      className="outline-button"
                      onClick={() => go(1)}
                    >
                      <ArrowLeft size={17} /> Change equipment
                    </button>
                    <button className="primary" onClick={download}>
                      <Download size={17} /> Download loading estimate
                    </button>
                  </div>
                </>
              )}
              <p className="load-note">
                This capacity estimate is not a certified stuffing plan. Check
                lifting, support, securing, center of gravity, axle limits,
                refrigeration airflow and equipment clearances before use.
              </p>
            </div>
          )
        )}
      </section>
      <LoadGuide />
    </div>
  );
}
