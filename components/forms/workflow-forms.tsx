"use client";
import Link from "next/link";
import { FormEvent, ReactNode, useId } from "react";
import { Icon } from "../../app/ui";
import { sectors } from "../../app/site-data";

type Submit = (event: FormEvent<HTMLFormElement>, type: string) => void;
type FormProps = { profile: string; onSubmit: Submit };
function Field({
  label,
  name,
  type = "text",
  placeholder,
  optional = false,
  value,
  min,
  max,
  step,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  optional?: boolean;
  value?: string;
  min?: string;
  max?: string;
  step?: string;
}) {
  return (
    <label>
      {label}
      {optional && <span className="field-optional">Optional</span>}
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={!optional}
        defaultValue={value}
        min={min}
        max={max}
        step={step}
        maxLength={type === "text" ? 180 : undefined}
        onChange={(e) => e.currentTarget.setCustomValidity("")}
      />
    </label>
  );
}
function Select({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  const id = useId();
  return (
    <div className="workflow-select">
      <label htmlFor={id}>{label}</label>
      <select id={id} name={name} required defaultValue="">
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}
function Message({
  label = "Additional requirements",
  optional = false,
}: {
  label?: string;
  optional?: boolean;
}) {
  return (
    <label>
      {label}
      <textarea
        name="message"
        required={!optional}
        minLength={optional ? undefined : 10}
        maxLength={4000}
        rows={5}
        placeholder="Share the details needed to prepare a useful response."
      />
    </label>
  );
}
function ContactFields({
  profile,
  companyRequired = true,
}: {
  profile: string;
  companyRequired?: boolean;
}) {
  return (
    <>
      <div className="form-row">
        <Field label="Contact name" name="name" value={profile} />
        <Field label="Business email" name="email" type="email" />
      </div>
      <div className="form-row">
        <Field label="Company" name="company" optional={!companyRequired} />
        <Field
          label="Company country"
          name="country"
          optional={!companyRequired}
        />
      </div>
    </>
  );
}
function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <fieldset>
      <legend>
        <span>{number}</span>
        {title}
      </legend>
      {children}
    </fieldset>
  );
}
function Shell({
  title,
  type,
  onSubmit,
  children,
}: {
  title: string;
  type: string;
  onSubmit: Submit;
  children: ReactNode;
}) {
  return (
    <form
      className="page-form workflow-form"
      onSubmit={(e) => {
        const fields = new FormData(e.currentTarget);
        const start = String(fields.get("start") || "");
        const end = String(fields.get("end") || "");
        if (start && end && end < start) {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem(
            "end",
          ) as HTMLInputElement;
          input.setCustomValidity(
            "The end date must be on or after the start date.",
          );
          input.reportValidity();
          return;
        }
        onSubmit(e, type);
      }}
    >
      <h2>{title}</h2>
      <p className="form-note notice">
        Saved as a private draft in your workspace. Guest drafts stay on this
        device. This form does not send or publish anything externally.
      </p>
      {children}
      <div className="rfq-form-actions">
        <button className="primary" type="submit">
          Save{" "}
          {type === "product"
            ? "product"
            : type === "contact"
              ? "message"
              : "request"}{" "}
          draft <Icon name="arrow" size={17} />
        </button>
        <Link
          className="outline-button"
          href={
            type === "product" ? "/workspace/products" : "/workspace/inquiries"
          }
        >
          View drafts
        </Link>
      </div>
    </form>
  );
}
export function ContactForm({ profile, onSubmit }: FormProps) {
  return (
    <Shell title="Send us a message" type="contact" onSubmit={onSubmit}>
      <input type="hidden" name="product" value="Contact message" />
      <ContactFields profile={profile} companyRequired={false} />
      <Select
        label="Topic"
        name="topic"
        options={[
          "Marketplace & sourcing",
          "Logistics tools",
          "Account support",
          "Partnerships",
          "Feedback",
          "Other",
        ]}
      />
      <Field label="Subject" name="subject" placeholder="How can we help?" />
      <Message label="Your message" />
    </Shell>
  );
}
export function FreightRequestForm({ profile, onSubmit }: FormProps) {
  return (
    <Shell
      title="Tell us about your shipment"
      type="freight-form"
      onSubmit={onSubmit}
    >
      <Section number="01" title="Route and equipment">
        <Field
          label="Cargo / commodity"
          name="product"
          placeholder="e.g. Bagged long grain rice"
        />
        <div className="form-row">
          <Field label="Origin country" name="originCountry" />
          <Field label="Destination country" name="destination" />
        </div>
        <div className="form-row">
          <Field
            label="Port / place of loading"
            name="originPort"
            placeholder="e.g. Shanghai"
          />
          <Field
            label="Port / place of delivery"
            name="destinationPort"
            placeholder="e.g. Lagos"
          />
        </div>
        <div className="form-row">
          <Select
            label="Equipment"
            name="equipment"
            options={[
              "20 ft standard",
              "40 ft standard",
              "40 ft high cube",
              "20 ft reefer",
              "40 ft reefer",
              "Less than container load",
              "Air freight",
            ]}
          />
          <Field label="Cargo ready date" name="ready" type="date" />
        </div>
      </Section>
      <Section number="02" title="Cargo details">
        <div className="form-row">
          <Field
            label="Number of packages / containers"
            name="quantity"
            type="number"
            min="1"
            step="1"
          />
          <Field
            label="Total gross weight (kg)"
            name="weight"
            type="number"
            min="0.01"
            step="0.01"
          />
        </div>
        <div className="form-row">
          <Field
            label="Total volume (m³)"
            name="volume"
            type="number"
            min="0.01"
            step="0.01"
            optional
          />
          <Select
            label="Delivery terms"
            name="terms"
            options={[
              "To be agreed",
              "EXW",
              "FCA",
              "FOB",
              "CFR",
              "CIF",
              "DAP",
              "DDP",
            ]}
          />
        </div>
        <Message label="Handling and service requirements" />
      </Section>
      <Section number="03" title="Business contact">
        <ContactFields profile={profile} />
      </Section>
    </Shell>
  );
}
export function CargoListingForm({ profile, onSubmit }: FormProps) {
  return (
    <Shell
      title="Describe your available cargo"
      type="cargo-form"
      onSubmit={onSubmit}
    >
      <Section number="01" title="Cargo information">
        <Field
          label="Cargo title"
          name="product"
          placeholder="e.g. Cotton fabric rolls, available stock lot"
        />
        <Select
          label="Product sector"
          name="sector"
          options={sectors.map((s) => s.name)}
        />
        <div className="form-row">
          <Field
            label="Quantity"
            name="quantity"
            type="number"
            min="0.01"
            step="0.01"
          />
          <Select
            label="Unit"
            name="unit"
            options={[
              "Metric tons",
              "Kilograms",
              "Units",
              "Containers",
              "Pallets",
              "Rolls",
              "Sets",
            ]}
          />
        </div>
        <div className="form-row">
          <Select
            label="Condition"
            name="condition"
            options={[
              "New / unused",
              "Surplus stock",
              "Used",
              "Inspection required",
            ]}
          />
          <Select
            label="Packaging"
            name="packaging"
            options={[
              "Containerized",
              "Pallets",
              "Bags",
              "Boxes",
              "Rolls",
              "Bulk / loose",
              "Other",
            ]}
          />
        </div>
        <Message label="Cargo description and specifications" />
      </Section>
      <Section number="02" title="Location and commercial details">
        <div className="form-row">
          <Field label="Cargo country" name="locationCountry" />
          <Field label="Port / storage location" name="destination" />
        </div>
        <div className="form-row">
          <Field
            label="Asking price for the lot (USD)"
            name="price"
            type="number"
            min="0"
            step="0.01"
            optional
          />
          <Field label="Available from" name="available" type="date" />
        </div>
        <Field
          label="Documents available"
          name="documents"
          placeholder="e.g. Packing list, invoice, inspection report"
          optional
        />
      </Section>
      <Section number="03" title="Cargo owner contact">
        <ContactFields profile={profile} />
      </Section>
    </Shell>
  );
}
export function EventSubmissionForm({ profile, onSubmit }: FormProps) {
  return (
    <Shell
      title="Share your business event"
      type="event-form"
      onSubmit={onSubmit}
    >
      <Section number="01" title="Event details">
        <Field label="Event name" name="product" />
        <div className="form-row">
          <Select
            label="Event type"
            name="eventType"
            options={[
              "Exhibition",
              "Conference",
              "Trade show",
              "Networking event",
              "Webinar",
            ]}
          />
          <Select
            label="Industry"
            name="sector"
            options={sectors.map((s) => s.name)}
          />
        </div>
        <div className="form-row">
          <Field label="Start date" name="start" type="date" />
          <Field label="End date" name="end" type="date" />
        </div>
        <div className="form-row">
          <Field label="Country" name="destination" />
          <Field label="City" name="city" />
        </div>
        <Field label="Venue" name="venue" />
        <Field
          label="Event website"
          name="website"
          type="url"
          placeholder="https://"
          optional
        />
        <Message label="About the event" />
      </Section>
      <Section number="02" title="Organizer information">
        <ContactFields profile={profile} />
      </Section>
    </Shell>
  );
}
export function ProductDraftForm({ profile, onSubmit }: FormProps) {
  return (
    <Shell
      title="Create a product listing draft"
      type="product"
      onSubmit={onSubmit}
    >
      <Field label="Product title" name="product" />
      <Select
        label="Sector"
        name="sector"
        options={sectors.map((s) => s.name)}
      />
      <div className="form-row">
        <Field
          label="Unit price (USD)"
          name="price"
          type="number"
          min="0"
          step="0.01"
          optional
        />
        <Select
          label="Price unit"
          name="unit"
          options={["Unit", "Kilogram", "Metric ton", "Liter", "Set", "Pallet"]}
        />
      </div>
      <div className="form-row">
        <Field
          label="Minimum order quantity"
          name="quantity"
          type="number"
          min="0.01"
          step="0.01"
        />
        <Field label="Product origin" name="origin" />
      </div>
      <Message label="Description and specifications" />
      <Field
        label="Packaging and shipping information"
        name="packaging"
        optional
      />
      <input
        type="hidden"
        name="contact"
        value={profile || "Local workspace owner"}
      />
    </Shell>
  );
}
