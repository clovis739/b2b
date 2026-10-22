import Link from "next/link";
import { tradeShows } from "../../app/event-data";
import Image from "next/image";
import { formatEventDates } from "../../lib/event-dates";
import { Icon } from "../../app/ui";
import Carousel from "../motion/carousel";
export default function EventsSection() {
  return (
    <section className="clone-section clone-events">
      <div className="clone-events-intro">
        <span className="clone-calendar-symbol">
          <Icon name="calendar" size={62} />
          <span>
            <Icon name="check" size={28} />
          </span>
        </span>
        <h2>Trade show calendar</h2>
        <p>
          Use our event calendar to navigate trade events worldwide, promote
          your business and build connections in the real world.
        </p>
        <Link href="/events-calendar" className="clone-link-button">
          Browse all events <Icon name="arrow" size={18} />
        </Link>
        <div className="clone-event-tags">
          <span>Conferences</span>
          <span>Niche exhibitions</span>
          <span>Trade Expos</span>
        </div>
      </div>
      <Carousel
        label="Trade shows"
        className="event-carousel"
        desktop={2}
        tablet={2}
      >
        {tradeShows.map((e) => (
          <Link
            className="home-trade-show"
            href={`/events-calendar/${e.slug}`}
            key={e.slug}
          >
            <div className="trade-show-logo">
              <Image
                src={e.logo!}
                alt={`${e.title} logo`}
                fill
                sizes="(max-width:700px) 80vw, 300px"
              />
            </div>
            <h3>{e.title}</h3>
            <p>
              <Icon name="calendar" size={14} />
              {formatEventDates(e.start, e.end)}
            </p>
            <p>
              <Icon name="location" size={14} />
              {e.city}, {e.country}
            </p>
            <span className="event-sector-tag">{e.category}</span>
          </Link>
        ))}
      </Carousel>
    </section>
  );
}
