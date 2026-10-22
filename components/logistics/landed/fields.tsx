import { cloneElement, useId, type ReactElement } from "react";

export type LandedForm = {
  product: string;
  category: string;
  hsCode: string;
  quantity: string;
  units: string;
  unitPrice: string;
  weight: string;
  shippingType: "sea" | "air" | "road";
  container: string;
  containers: string;
  insured: boolean;
  origin: string;
  destination: string;
  packaging: string;
  packages: string;
  freight: string;
  insurance: string;
  dutyRate: string;
  taxRate: string;
  brokerage: string;
  inland: string;
  other: string;
  sellingPrice: string;
  customsValue: string;
  taxBase: string;
  recoverableTax: boolean;
};
export const initialLandedForm: LandedForm = {
  product: "",
  category: "",
  hsCode: "",
  quantity: "1",
  units: "Pieces",
  unitPrice: "",
  weight: "",
  shippingType: "sea",
  container: "20 ft standard",
  containers: "1",
  insured: true,
  origin: "",
  destination: "",
  packaging: "Cartons",
  packages: "1",
  freight: "",
  insurance: "0",
  dutyRate: "0",
  taxRate: "0",
  brokerage: "0",
  inland: "0",
  other: "0",
  sellingPrice: "",
  customsValue: "",
  taxBase: "",
  recoverableTax: false,
};

export function Field({
  label,
  hint,
  children,
  suffix,
}: {
  label: string;
  hint?: string;
  children: ReactElement<{ id?: string; "aria-describedby"?: string }>;
  suffix?: string;
}) {
  const id = useId();
  const control = cloneElement(children, {
    id,
    "aria-describedby": hint ? `${id}-hint` : undefined,
  });
  return (
    <div className="landed-field">
      <label htmlFor={id}>{label}</label>
      {suffix !== undefined ? (
        <span className="landed-number">
          {control}
          <span aria-hidden="true">{suffix}</span>
        </span>
      ) : (
        control
      )}
      {hint && <small id={`${id}-hint`}>{hint}</small>}
    </div>
  );
}

export function NumberField({
  label,
  value,
  onChange,
  suffix = "USD",
  min = "0",
  max = "1000000000000",
  required = true,
  step = "any",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
  min?: string;
  max?: string;
  required?: boolean;
  step?: string;
  hint?: string;
}) {
  return (
    <Field label={label} hint={hint} suffix={suffix}>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={required ? "Enter amount" : "Calculated automatically"}
      />
    </Field>
  );
}
