"use client";
import { useState } from "react";
import { RotateCcw, Eye } from "lucide-react";
import type { Cargo, Vehicle, VehiclePlan } from "@/lib/load-planner";
const colors = [
  "#005bff",
  "#00816c",
  "#b56522",
  "#8051a3",
  "#c34661",
  "#147d99",
];
export default function LoadPreview({
  plan,
  vehicle,
  cargo,
}: {
  plan: VehiclePlan;
  vehicle: Vehicle;
  cargo: Cargo[];
}) {
  const [view, setView] = useState<"perspective" | "top">("perspective");
  const scale = 610 / (vehicle.length + vehicle.width * 0.6);
  const point = (x: number, y: number, z: number) =>
    view === "top"
      ? `${45 + x * scale},${50 + y * scale}`
      : `${45 + (x + y * 0.6) * scale},${180 + (y * 0.4 - z * 0.75) * scale}`;
  const polygon = (points: number[][]) =>
    points.map(([x, y, z]) => point(x, y, z)).join(" ");
  const { length: l, width: w, height: h } = vehicle;
  return (
    <section
      className="load-visual-panel"
      aria-label="Cargo placement visualization"
    >
      <div className="load-visual-toolbar">
        <span>
          <Eye size={17} /> Load preview
        </span>
        <div>
          <button
            type="button"
            aria-pressed={view === "perspective"}
            onClick={() => setView("perspective")}
          >
            3D view
          </button>
          <button
            type="button"
            aria-pressed={view === "top"}
            onClick={() => setView("top")}
          >
            Top view
          </button>
          <button
            type="button"
            aria-label="Reset view"
            onClick={() => setView("perspective")}
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>
      <svg
        viewBox={
          view === "top"
            ? `0 0 720 ${Math.max(230, 100 + w * scale)}`
            : "0 0 720 370"
        }
        role="img"
        aria-label={`${view === "top" ? "Top" : "Isometric"} view of ${vehicle.name}, showing ${plan.displayed} cargo items`}
      >
        <polygon
          points={polygon([
            [0, 0, 0],
            [l, 0, 0],
            [l, w, 0],
            [0, w, 0],
          ])}
          fill="#e3eaf4"
          stroke="#8798af"
        />
        {view !== "top" && (
          <>
            <polygon
              points={polygon([
                [0, w, 0],
                [l, w, 0],
                [l, w, h],
                [0, w, h],
              ])}
              fill="#dce6f240"
              stroke="#a6b7cb"
            />
            <polygon
              points={polygon([
                [l, 0, 0],
                [l, w, 0],
                [l, w, h],
                [l, 0, h],
              ])}
              fill="#dce6f240"
              stroke="#a6b7cb"
            />
          </>
        )}
        {[...plan.placements]
          .sort((a, b) => a.x + a.y - a.z - (b.x + b.y - b.z))
          .map((p, i) => {
            const { x, y, z, l: bl, w: bw, h: bh } = p;
            return (
              <g
                key={i}
                fill={colors[p.cargoIndex % colors.length]}
                stroke="white"
                strokeWidth=".65"
              >
                <title>{cargo[p.cargoIndex].name}</title>
                {view !== "top" && (
                  <>
                    <polygon
                      points={polygon([
                        [x, y, z],
                        [x + bl, y, z],
                        [x + bl, y, z + bh],
                        [x, y, z + bh],
                      ])}
                      opacity=".75"
                    />
                    <polygon
                      points={polygon([
                        [x, y, z],
                        [x, y + bw, z],
                        [x, y + bw, z + bh],
                        [x, y, z + bh],
                      ])}
                      opacity=".9"
                    />
                  </>
                )}
                <polygon
                  points={polygon([
                    [x, y, z + bh],
                    [x + bl, y, z + bh],
                    [x + bl, y + bw, z + bh],
                    [x, y + bw, z + bh],
                  ])}
                />
              </g>
            );
          })}
        <polygon
          points={polygon([
            [0, 0, 0],
            [l, 0, 0],
            [l, w, 0],
            [0, w, 0],
          ])}
          fill="none"
          stroke="#8296b0"
          strokeWidth="1.2"
        />
      </svg>
      <ul className="load-legend">
        {cargo.map((c, i) => (
          <li key={c.id}>
            <span style={{ background: colors[i % colors.length] }} />
            {c.name}: {plan.counts[i]}
          </li>
        ))}
      </ul>
      <p className="load-note">
        {plan.counts.reduce((a, b) => a + b, 0) > plan.displayed
          ? `Showing ${plan.displayed} items of this load. `
          : ""}
        Schematic placement preview; verify clearance, restraint and weight
        distribution before loading.
      </p>
    </section>
  );
}
