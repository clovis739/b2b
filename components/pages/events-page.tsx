"use client";
import Link from "next/link";
import Image from "next/image";
import { PageEntry } from "../../app/route-map";
import { events } from "../../app/site-data";
import { Icon } from "../../app/ui";
import { Photo, Intro } from "../shared/presentation";

import { usePageController } from "../../hooks/use-page-controller";
import { formatEventDates } from "../../lib/event-dates";

export default function EventsPage({ entry }: { entry: PageEntry }) {
  const { query, country, setCountry, searchBar } = usePageController();

  const event = events.find((e) => e.slug === entry.key);
  const listedEvents = events.filter((e) => e.sourceUrl);
  return event ? (
    <>
      <section className="split-hero">
        <div>
          <span className="page-kicker">
            {event.category}
            {!event.sourceUrl && " · SAMPLE EVENT"}
          </span>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <p>
            {formatEventDates(event.start, event.end)}
            <br />
            {event.venue}
            <br />
            {event.city}, {event.country}
          </p>
          <button
            className="primary"
            onClick={() => {
              const endDate = new Date(`${event.end}T00:00:00Z`);
              endDate.setUTCDate(endDate.getUTCDate() + 1);
              const calendarEnd = endDate
                .toISOString()
                .slice(0, 10)
                .replaceAll("-", "");
              const data = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\nUID:${event.slug}@local-demo\r\nDTSTAMP:20261021T000000Z\r\nDTSTART;VALUE=DATE:${event.start.replaceAll("-", "")}\r\nDTEND;VALUE=DATE:${calendarEnd}\r\nSUMMARY:${event.title}${event.sourceUrl ? "" : " (sample event)"}\r\nLOCATION:${event.city}\\, ${event.country}\r\nEND:VEVENT\r\nEND:VCALENDAR`;
              const a = document.createElement("a");
              const u = URL.createObjectURL(
                new Blob([data], { type: "text/calendar" }),
              );
              a.href = u;
              a.download = `${event.slug}.ics`;
              a.click();
              URL.revokeObjectURL(u);
            }}
          >
            {event.sourceUrl
              ? "Add to calendar"
              : "Add sample event to calendar"}{" "}
            <Icon name="arrow" size={16} />
          </button>
        </div>
        {event.logo ? (
          <div className="event-detail-logo">
            <Image
              src={event.logo}
              alt={`${event.title} logo`}
              fill
              sizes="(max-width:700px) 90vw, 50vw"
            />
          </div>
        ) : (
          <Photo name={event.image} alt={event.title} />
        )}
      </section>
      <div className="content-panel">
        <h2>About this event</h2>
        <p>
          {event.description}{" "}
          {event.sourceUrl
            ? "Event information was checked against Globy on 21 October 2026. Confirm dates, venue and admission with the organizer before making travel plans."
            : "Dates, venue and organizer information are illustrative. This page does not represent a confirmed real event."}
        </p>
        <Link href="/events-calendar">
          Browse all events <Icon name="arrow" size={16} />
        </Link>
      </div>
    </>
  ) : (
    <>
      <Intro
        entry={entry}
        description="Discover exhibitions, conferences, and conversations that bring businesses together."
      />
      <div className="listing-controls">
        {searchBar("Search events, cities, or industries")}
        <select
          aria-label="Event country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">All countries</option>
          {listedEvents.map((e) => (
            <option key={e.country}>{e.country}</option>
          ))}
        </select>
        <Link className="outline-button" href="/events-calendar/submit">
          Promote an event
        </Link>
      </div>
      <div className="editorial-grid">
        {listedEvents
          .filter(
            (e) =>
              (!country || e.country === country) &&
              `${e.title} ${e.city} ${e.category}`
                .toLowerCase()
                .includes(query.toLowerCase()),
          )
          .map((e) => (
            <Link
              className="editorial-card"
              key={e.slug}
              href={`/events-calendar/${e.slug}`}
            >
              {e.logo ? (
                <div className="event-listing-logo">
                  <Image
                    src={e.logo}
                    alt={`${e.title} logo`}
                    fill
                    sizes="(max-width:700px) 90vw, 33vw"
                  />
                </div>
              ) : (
                <Photo name={e.image} alt={e.title} />
              )}
              <small>{e.category}</small>
              <h2>{e.title}</h2>
              <p>{formatEventDates(e.start, e.end)}</p>
              <p>
                {e.city}, {e.country}
              </p>
              <span className="text-button">
                Event details <Icon name="arrow" size={15} />
              </span>
            </Link>
          ))}
      </div>
      {!listedEvents.some(
        (e) =>
          (!country || e.country === country) &&
          `${e.title} ${e.city} ${e.category}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ) && (
        <div className="empty-state">
          <h3>No events match your filters.</h3>
          <Link className="outline-button" href="/events-calendar/submit">
            Submit an event
          </Link>
        </div>
      )}
    </>
  );
}
