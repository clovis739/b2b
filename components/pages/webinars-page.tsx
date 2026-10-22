"use client";
import { useState } from "react";
import { PageEntry } from "../../app/route-map";
import { Icon, Modal } from "../../app/ui";
import { Intro, Photo } from "../shared/presentation";
import { usePageController } from "../../hooks/use-page-controller";

const sessions = [
  {
    id: "sourcing",
    title: "Getting started with global sourcing",
    image: "office",
    topic: "Sourcing",
    duration: "30 min",
    agenda: [
      "Writing a useful product brief",
      "Comparing supplier responses",
      "Preparing your first sample order",
    ],
    notes: [
      "Start with a consistent specification: product, quantity, quality criteria, packaging and destination.",
      "Compare offers using the same unit, currency and shipping terms. Keep exclusions and unanswered questions visible.",
      "Ask suppliers about samples, inspection options, production timing and the next steps before committing to an order.",
    ],
  },
  {
    id: "freight",
    title: "Understanding your freight quote",
    image: "shipping",
    topic: "Logistics",
    duration: "25 min",
    agenda: [
      "Ocean freight and local charges",
      "Container equipment and cargo details",
      "Quote validity and exclusions",
    ],
    notes: [
      "Ask which charges are included in the offer: freight, origin handling, destination handling, inland movement and additional services may be separate.",
      "Provide the same origin, destination, equipment, cargo weight and ready date to each provider for a meaningful comparison.",
      "Confirm currency, validity period, exclusions and how changes to your shipment will affect the quoted amount.",
    ],
  },
  {
    id: "events",
    title: "Preparing for a trade show",
    image: "event",
    topic: "Business connections",
    duration: "20 min",
    agenda: [
      "Choosing the right event",
      "Planning supplier conversations",
      "Organizing the follow-up",
    ],
    notes: [
      "Identify the businesses and product categories you want to explore before choosing an event.",
      "Prepare a short introduction and a clear statement of what you need. Schedule meetings where possible.",
      "Keep useful notes for each discussion and follow up with the information or specifications you agreed to share.",
    ],
  },
];
export default function WebinarsPage({ entry }: { entry: PageEntry }) {
  const { save, profile } = usePageController();
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("");
  const [selected, setSelected] = useState<(typeof sessions)[number] | null>(
    null,
  );
  const filtered = sessions.filter(
    (s) =>
      (!topic || s.topic === topic) &&
      `${s.title} ${s.topic}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <>
      <Intro
        entry={entry}
        description="Workshop topics and practical notes for your next sourcing or logistics conversation."
      />
      <div className="listing-controls">
        <div className="filter-search">
          <Icon name="search" size={17} />
          <input
            aria-label="Search learning sessions"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search learning sessions"
          />
        </div>
        <select
          aria-label="Filter session topic"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
        >
          <option value="">All topics</option>
          {sessions.map((s) => (
            <option key={s.topic}>{s.topic}</option>
          ))}
        </select>
      </div>
      <div className="editorial-grid">
        {filtered.map((s) => (
          <article className="editorial-card" key={s.id}>
            <Photo name={s.image} alt={s.title} />
            <small>
              {s.topic} · {s.duration} · Workshop preview
            </small>
            <h2>{s.title}</h2>
            <p>{s.agenda.join(" · ")}</p>
            <button className="outline-button" onClick={() => setSelected(s)}>
              View agenda & notes <Icon name="arrow" size={16} />
            </button>
          </article>
        ))}
      </div>
      {!filtered.length && (
        <div className="empty-state">
          <h3>No sessions match your search.</h3>
          <button
            className="outline-button"
            onClick={() => {
              setTopic("");
              setQuery("");
            }}
          >
            Show all sessions
          </button>
        </div>
      )}
      {selected && (
        <Modal title={selected.title} onClose={() => setSelected(null)}>
          <div className="session-detail">
            <span className="page-kicker">
              {selected.topic} · {selected.duration}
            </span>
            <p className="form-note notice">
              Original workshop notes for this preview. No live webinar or
              recording is connected.
            </p>
            <h3>What you’ll learn</h3>
            <ol>
              {selected.agenda.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ol>
            <h3>Workshop notes</h3>
            {selected.notes.map((n, i) => (
              <section key={n}>
                <h4>{selected.agenda[i]}</h4>
                <p>{n}</p>
              </section>
            ))}
            <form
              className="page-form"
              onSubmit={(e) => {
                save(e, "webinar-interest");
                setSelected(null);
              }}
            >
              <h3>Save your interest</h3>
              <input type="hidden" name="product" value={selected.title} />
              <input
                type="hidden"
                name="message"
                value={`Interested in the ${selected.topic} workshop: ${selected.title}`}
              />
              <label>
                Your name
                <input name="name" required defaultValue={profile} />
              </label>
              <label>
                Email
                <input name="email" type="email" required />
              </label>
              <button className="primary">
                Save interest locally <Icon name="arrow" size={16} />
              </button>
            </form>
          </div>
        </Modal>
      )}
    </>
  );
}
