"use client";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

import { useLogisticsController } from "../../hooks/use-logistics-controller";

export default function FreightIndex() {
  const { range, setRange } = useLogisticsController();
  return (
    <div className="content-panel freight-index">
      <div className="section-title">
        <div>
          <span className="page-kicker">ILLUSTRATIVE DATA</span>
          <h2>Freight rate movements</h2>
        </div>
        <select
          aria-label="Chart time range"
          value={range}
          onChange={(e) => setRange(e.target.value)}
        >
          {["3 months", "6 months", "1 year", "2 years"].map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>
      <p>Sample trend, USD per container. These values are not market data.</p>
      <svg
        viewBox="0 0 800 220"
        role="img"
        aria-label={`Illustrative freight trend over ${range}`}
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#cbd9bb" />
            <stop offset="1" stopColor="#fafcf7" />
          </linearGradient>
        </defs>
        {[40, 90, 140, 190].map((y) => (
          <path key={y} d={`M10 ${y}H790`} stroke="#e7ecdf" />
        ))}
        <path
          d={
            range === "3 months"
              ? "M10 180 100 120 190 140 280 100 370 115 460 50 550 70 640 40 790 70V210H10Z"
              : "M10 90 100 120 190 80 280 150 370 115 460 160 550 100 640 140 790 70V210H10Z"
          }
          fill="url(#chart-fill)"
        />
        <path
          d={
            range === "3 months"
              ? "M10 180 100 120 190 140 280 100 370 115 460 50 550 70 640 40 790 70"
              : "M10 90 100 120 190 80 280 150 370 115 460 160 550 100 640 140 790 70"
          }
          stroke="#779756"
          strokeWidth="3"
          fill="none"
        />
      </svg>
      <Link className="text-button" href="/freight-calculator">
        Explore sample freight estimates <Icon name="arrow" size={16}/>
      </Link>
    </div>
  );
}
