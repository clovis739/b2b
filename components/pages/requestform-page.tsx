"use client";
import Link from "next/link";
import { PageEntry } from "../../app/route-map";

import { Icon } from "../../app/ui";
import { Intro } from "../shared/presentation";

import RfqForm from "../../app/rfq-form";
import { usePageController } from "../../hooks/use-page-controller";
import {
  ContactForm,
  FreightRequestForm,
  CargoListingForm,
  EventSubmissionForm,
} from "../forms/workflow-forms";

export default function RequestFormPage({ entry }: { entry: PageEntry }) {
  const { profile, save } = usePageController();
  const forms = {
    "freight-form": FreightRequestForm,
    "cargo-form": CargoListingForm,
    "event-form": EventSubmissionForm,
    contact: ContactForm,
  };
  const FormComponent = forms[entry.kind as keyof typeof forms];
  const tips: Record<
    string,
    { title: string; body: string; points: string[] }
  > = {
    contact: {
      title: "Let’s find the right next step.",
      body: "Choose a topic and describe the help or information you need.",
      points: [
        "Use a useful subject line.",
        "Include a business contact email.",
        "Describe your question or feedback clearly.",
      ],
    },
    "freight-form": {
      title: "A useful quote starts with clear cargo details.",
      body: "Provide the route, equipment, weight and cargo ready date.",
      points: [
        "Use the exact loading and delivery locations.",
        "Include total gross weight and package count.",
        "Describe required handling and services.",
      ],
    },
    "cargo-form": {
      title: "Help buyers understand the cargo.",
      body: "Present the lot’s current condition, location and available documents.",
      points: [
        "Specify quantity and packaging.",
        "Include the current port or storage location.",
        "Describe condition and document availability.",
      ],
    },
    "event-form": {
      title: "Make your event easy to discover.",
      body: "Provide clear dates, location, industry and organizer information.",
      points: [
        "Check the start and end dates.",
        "Include a venue and city.",
        "Provide an organizer contact and event website.",
      ],
    },
    "request-form": {
      title: "Keep your sourcing details together.",
      body: "Give suppliers the information needed for a useful response.",
      points: [
        "Specify product quality and packaging.",
        "Include quantity and destination.",
        "Describe delivery timing and trade terms.",
      ],
    },
  };
  const tip = tips[entry.kind];
  return (
    <>
      <Intro
        entry={entry}
        description="A clear brief is the beginning of a better connection."
      />
      <div className="form-page-layout">
        {entry.kind === "request-form" ? (
          <RfqForm
            profile={profile}
            onSubmit={(e) => save(e, "request-form")}
          />
        ) : (
          <FormComponent profile={profile} onSubmit={save} />
        )}
        <aside className="form-aside">
          <Icon name="mail" size={36} />
          <h2>{tip.title}</h2>
          <p>{tip.body}</p>
          <ul>
            {tip.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <Link href="/help-center">Visit the help center <Icon name="arrow" size={16}/></Link>
        </aside>
      </div>
    </>
  );
}
