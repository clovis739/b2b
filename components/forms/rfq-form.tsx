"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { sectors } from "../../app/site-data";
import { Icon } from "../ui/icon";
import SelectField from "./select-field";
import { useWorkspace } from "../../hooks/use-workspace";

export default function RfqForm({
  profile,
  onSubmit,
}: {
  profile: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const [sector, setSector] = useState("");
  const { ready } = useWorkspace();
  const categories = sectors.find((s) => s.slug === sector)?.children || [];
  return (
    <form
      className="page-form rfq-form"
      onSubmit={(e) => {
        onSubmit(e);
        setSector("");
      }}
    >
      <p className="notice form-note">
        This saves your RFQ as a private workspace draft. Sign in for account
        storage. It does not publish the request or send it to suppliers.
      </p>
      <fieldset>
        <legend>
          <span>01</span> What would you like to source?
        </legend>
        <label>
          Product name <span className="field-required">Required</span>
          <input
            name="product"
            required
            maxLength={180}
            placeholder="e.g. Fresh red onions, export grade"
            autoComplete="off"
          />
        </label>
        <div className="form-row">
          <SelectField
            label="Product sector"
            name="sector"
            required
            value={sector}
            onChange={(e) => setSector(e.target.value)}
          >
            <option value="" disabled>
              Select sector
            </option>
            {sectors.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Product category"
            name="category"
            required
            disabled={!sector}
            key={sector}
            defaultValue=""
          >
            <option value="" disabled>
              {sector ? "Select category" : "Select a sector first"}
            </option>
            {categories.map((c) => (
              <option value={c.name} key={c.slug}>
                {c.name}
              </option>
            ))}
          </SelectField>
        </div>
        <label>
          Product specifications
          <textarea
            name="message"
            required
            minLength={20}
            maxLength={5000}
            rows={6}
            placeholder="Describe the variety, grade, materials, dimensions, packaging, certifications, or other requirements."
          />
          <span className="field-hint">
            Include enough detail for a supplier to prepare a useful quote.
            Minimum 20 characters.
          </span>
        </label>
        <div className="form-row">
          <label>
            Required quantity
            <input
              name="quantity"
              type="number"
              min="0.01"
              step="0.01"
              max="1000000000"
              required
              placeholder="20"
            />
          </label>
          <SelectField
            label="Unit"
            name="unit"
            required
            defaultValue="Metric tons"
          >
            {[
              "Metric tons",
              "Kilograms",
              "Units",
              "Pieces",
              "Liters",
              "Containers",
              "Pallets",
              "Sets",
            ].map((u) => (
              <option key={u}>{u}</option>
            ))}
          </SelectField>
        </div>
        <div className="form-row">
          <label>
            Target unit price (optional)
            <input
              type="number"
              name="targetPrice"
              min="0.01"
              step="0.01"
              placeholder="Your preferred price"
            />
          </label>
          <SelectField label="Currency" name="currency" defaultValue="USD">
            {["USD", "EUR", "GBP", "NGN", "AED", "INR"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </SelectField>
        </div>
      </fieldset>
      <fieldset>
        <legend>
          <span>02</span> Delivery requirements
        </legend>
        <div className="form-row">
          <label>
            Destination country
            <input
              name="destination"
              required
              maxLength={100}
              placeholder="e.g. Nigeria"
              autoComplete="country-name"
            />
          </label>
          <label>
            Destination port / city
            <input
              name="port"
              required
              maxLength={120}
              placeholder="e.g. Apapa Port, Lagos"
            />
          </label>
        </div>
        <div className="form-row">
          <SelectField
            label="Preferred delivery terms"
            name="deliveryTerms"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select terms
            </option>
            {[
              "To be agreed",
              "EXW",
              "FCA",
              "FOB",
              "CFR",
              "CIF",
              "DAP",
              "DPU",
              "DDP",
            ].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </SelectField>
          <label>
            Required delivery date (optional)
            <input name="deliveryDate" type="date" />
          </label>
        </div>
        <SelectField
          label="Buying frequency"
          name="frequency"
          defaultValue="One-time purchase"
        >
          {[
            "One-time purchase",
            "Weekly",
            "Monthly",
            "Quarterly",
            "Ongoing supply — to be agreed",
          ].map((t) => (
            <option key={t}>{t}</option>
          ))}
        </SelectField>
      </fieldset>
      <fieldset>
        <legend>
          <span>03</span> Your business details
        </legend>
        <div className="form-row">
          <label>
            Contact name
            <input
              name="name"
              defaultValue={profile}
              required
              maxLength={100}
              autoComplete="name"
            />
          </label>
          <label>
            Business email
            <input
              name="email"
              type="email"
              required
              maxLength={180}
              autoComplete="email"
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Company name
            <input
              name="company"
              required
              maxLength={180}
              autoComplete="organization"
            />
          </label>
          <label>
            Company country
            <input
              name="country"
              required
              maxLength={100}
              placeholder="Where is your business based?"
            />
          </label>
        </div>
      </fieldset>
      <div className="rfq-form-actions">
        <button className="primary" type="submit" disabled={!ready}>
          Save RFQ draft <Icon name="arrow" size={17} />
        </button>
        <Link href="/workspace/inquiries" className="outline-button">
          View my requests
        </Link>
      </div>
      <p className="form-note">
        Guest drafts stay on this device. You can review or remove drafts in
        your workspace.
      </p>
    </form>
  );
}
