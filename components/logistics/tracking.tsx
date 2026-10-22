"use client";

import { Icon } from "../../app/ui";

import { useLogisticsController } from "../../hooks/use-logistics-controller";

export default function ContainerTracker() {
  const { result, setResult, setError, number, setNumber, demo, setDemo } =
    useLogisticsController();
  return (
    <>
      <form
        className="page-form tracking-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!number.trim()) {
            setError("Enter a tracking reference.");
            return;
          }
          setError("");
          setResult(true);
        }}
      >
        <h2>Where’s your next shipment?</h2>
        <p className="form-note">
          Tracking interface preview. No live carrier network is connected.
        </p>
        <label>
          Container / bill of lading number
          <input
            required
            value={number}
            onChange={(e) => {
              setNumber(e.target.value);
              setResult(false);
              setDemo(false);
            }}
            placeholder="Enter your shipment reference"
            maxLength={40}
          />
        </label>
        <label>
          Carrier
          <select>
            <option>Auto-detect</option>
            <option>Maersk</option>
            <option>MSC</option>
            <option>CMA CGM</option>
            <option>Hapag-Lloyd</option>
          </select>
        </label>
        <button className="primary">
          Check reference <Icon name="search" size={17} />
        </button>
        <button
          type="button"
          className="text-button"
          onClick={() => {
            setNumber("DEMO1234567");
            setDemo(true);
            setResult(true);
          }}
        >
          Explore a sample shipment timeline <Icon name="arrow" size={16}/>
        </button>
      </form>
      {result && (
        <div className="content-panel tool-result" role="status">
          <span className="page-kicker">
            {demo ? "DEMONSTRATION SHIPMENT" : "LIVE LOOKUP UNAVAILABLE"}
          </span>
          <h2>{number}</h2>
          {demo ? (
            <>
              <p>Illustrative route: Shanghai <Icon name="arrow" size={16}/> Singapore <Icon name="arrow" size={16}/> Rotterdam</p>
              <ol className="tracking-timeline">
                {[
                  "Booking confirmed",
                  "Loaded at origin port",
                  "Vessel departed · In transit",
                  "Arrival at destination · Estimated",
                  "Available for collection · Pending",
                ].map((s, i) => (
                  <li className={i < 3 ? "complete" : ""} key={s}>
                    <span>{i + 1}</span>
                    <div>
                      <strong>{s}</strong>
                      <p>Demonstration milestone — not a carrier update</p>
                    </div>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p>
              This preview cannot retrieve carrier updates. Use the sample
              shipment above to explore the interface or contact your logistics
              provider for current status.
            </p>
          )}
        </div>
      )}
    </>
  );
}
