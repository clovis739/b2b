"use client";
import Link from "next/link";
import { Icon } from "../../app/ui";
import { equipment, ports } from "../../lib/logistics";
import { useLogisticsController } from "../../hooks/use-logistics-controller";
import LogisticsTools from "../../app/tools";
export default function FreightRoutes() {
  const {
    kind,
    result,
    origin,
    destination,
    error,
    equipmentIndex,
    setEquipment,
    price,
    freightSort,
    setFreightSort,
    submit,
    routeFields,
  } = useLogisticsController();
  const isSchedules = kind === "schedules";
  const baseRate =
    1200 + ports.indexOf(origin) * 180 + ports.indexOf(destination) * 120;
  const rates = [
    { name: "Ocean Connect", price: baseRate, days: 32 },
    { name: "Global Sea Lines", price: baseRate + 350, days: 26 },
    { name: "Horizon Freight", price: baseRate + 180, days: 29 },
  ].sort((a, b) =>
    freightSort === "price" ? a.price - b.price : a.days - b.days,
  );
  return (
    <>
      <form className="route-tool" onSubmit={submit}>
        <div className="route-tool-fields">
          {routeFields}
          <label>
            {isSchedules ? "Departure date" : "Equipment"}
            {isSchedules ? (
              <input type="date" required defaultValue="2026-11-01" />
            ) : (
              <select
                value={equipmentIndex}
                onChange={(e) => setEquipment(+e.target.value)}
              >
                {equipment.map((c, i) => (
                  <option value={i} key={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </label>
          <button className="primary">
            {isSchedules ? "Find sample sailings" : "Calculate sample estimate"}
            <Icon name="arrow" size={16} />
          </button>
        </div>
        <p className="form-note">
          Demonstration data only. No live tariffs, carrier schedules or
          bookings are connected.
        </p>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
      </form>
      {result && (
        <section className="page-section" aria-live="polite">
          <div className="section-title">
            <div>
              <span className="page-kicker">ILLUSTRATIVE RESULTS</span>
              <h2>
                {origin.split(",")[0]} <Icon name="arrow" size={16}/> {destination.split(",")[0]}
              </h2>
            </div>
            <select
              aria-label="Sort freight results"
              value={freightSort}
              onChange={(e) => setFreightSort(e.target.value)}
            >
              <option value="price">Lowest sample price</option>
              <option value="days">Fastest transit</option>
            </select>
          </div>
          <div className="freight-results">
            {rates.map((r) => (
              <article className="freight-rate" key={r.name}>
                <div>
                  <span className="company-avatar">
                    <Icon name="ship" size={23} />
                  </span>
                  <h3>{r.name}</h3>
                  <small>Demonstration provider</small>
                </div>
                <div>
                  <span>{origin.split(",")[0]}</span>
                  <Icon name="arrow" />
                  <span>{destination.split(",")[0]}</span>
                </div>
                <div>
                  <strong>{r.days} days</strong>
                  <small>Sample transit · 1 transfer</small>
                </div>
                {!isSchedules && (
                  <div>
                    <strong>
                      US$ {(r.price * (equipmentIndex ? 1.65 : 1)).toFixed(0)}
                    </strong>
                    <small>Illustrative ocean freight</small>
                  </div>
                )}
                <Link
                  className="outline-button"
                  href="/freight-calculator/freight-request"
                >
                  Prepare inquiry <Icon name="arrow" size={15} />
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}
      {kind === "shipping-cost" && (
        <article className="content-panel reading-panel">
          <h2>Understand the full shipment cost.</h2>
          <p>
            Ocean freight, origin handling, destination charges, customs
            services and inland transportation can appear as separate quote
            items. Ask your provider to confirm inclusions, exclusions and rate
            validity.
          </p>
          <h2>Choose the equipment your cargo needs.</h2>
          <p>
            Container dimensions, weight limits, packaging and transport
            conditions affect your plan. Use the load calculator for a simple
            packing estimate and confirm suitability with your logistics
            provider.
          </p>
          <div className="button-row">
            {["china", "india", "vietnam", "netherlands"].map((c) => (
              <Link
                className="outline-button"
                key={c}
                href={`/container-shipping-cost/from-${c}-to-usa`}
              >
                From {c} to USA
              </Link>
            ))}
          </div>
        </article>
      )}
      <LogisticsTools kind="index" />
    </>
  );
}
