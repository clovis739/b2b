"use client";
import Link from "next/link";
import { FormEvent } from "react";
import { Icon } from "../../app/ui";
export default function InquiryForm({
  type,
  title,
  profile,
  onSubmit,
  contextTitle,
  contextPath,
}: {
  type: string;
  title: string;
  profile: string;
  onSubmit: (event: FormEvent<HTMLFormElement>, type: string) => void;
  contextTitle?: string;
  contextPath?: string;
}) {
  return (
    <form className="page-form" onSubmit={(e) => onSubmit(e, type)}>
      <h2>{title}</h2>
      {contextTitle && (
        <input type="hidden" name="reference" value={contextTitle} />
      )}
      {contextPath && (
        <input type="hidden" name="referencePath" value={contextPath} />
      )}
      <p className="form-note notice">
        Save a private draft to your workspace. Sign-in enables account storage;
        guest drafts stay on this device. This does not send a message to a business.
      </p>
      <label>
        {type === "event-form"
          ? "Event name"
          : type === "contact"
            ? "Subject"
            : "Product / subject"}
        <input
          name="product"
          required
          maxLength={180}
          placeholder={
            type === "event-form"
              ? "Name of your trade event"
              : "What does your business need?"
          }
        />
      </label>
      <div className="form-row">
        <label>
          Full name
          <input name="name" required defaultValue={profile} maxLength={100} />
        </label>
        <label>
          Business email
          <input name="email" type="email" required />
        </label>
      </div>
      <div className="form-row">
        <label>
          Company
          <input name="company" required />
        </label>
        <label>
          Country
          <input name="country" required />
        </label>
      </div>
      {type === "event-form" && (
        <div className="form-row">
          <label>
            Start date
            <input name="start" type="date" required />
          </label>
          <label>
            End date
            <input name="end" type="date" required />
          </label>
        </div>
      )}
      {type === "freight-form" && (
        <div className="form-row">
          <label>
            Origin port
            <input name="origin" required />
          </label>
          <label>
            Ready to ship
            <input name="ready" type="date" required />
          </label>
        </div>
      )}
      {type !== "contact" && type !== "event-form" && (
        <div className="form-row">
          <label>
            Quantity
            <input name="quantity" required placeholder="e.g. 20 metric tons" />
          </label>
          <label>
            Destination / location
            <input name="destination" required />
          </label>
        </div>
      )}
      {type === "event-form" && (
        <label>
          Venue / city
          <input name="venue" required />
        </label>
      )}
      <label>
        Tell us more
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={5}
          placeholder="Specifications, delivery timeline, and any questions…"
        />
      </label>
      <button className="primary">
        Save {type === "contact" ? "message" : "request"} draft{" "}
        <Icon name="arrow" size={16} />
      </button>
      <Link href="/workspace/inquiries" className="text-button">
        View saved drafts
      </Link>
    </form>
  );
}
