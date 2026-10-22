import { Download, Pencil, ArrowRight } from "lucide-react";
import Link from "next/link";
import { calculateLandedCost, formatUSD } from "@/lib/landed-cost";
import type { LandedForm } from "./fields";

export default function LandedResults({
  data,
  result,
  edit,
}: {
  data: LandedForm;
  result: ReturnType<typeof calculateLandedCost>;
  edit: () => void;
}) {
  const rows: [string, number][] = [
    ["Goods", result.goods],
    ["Freight", Number(data.freight)],
    ["Insurance", data.insured ? Number(data.insurance) : 0],
    ["Customs duty", result.duty],
    ["Import tax", result.tax],
    ["Brokerage & handling", Number(data.brokerage)],
    ["Inland delivery", Number(data.inland)],
    ["Other costs", Number(data.other)],
  ];
  function download() {
    const escape = (value: string | number) => {
      const text =
        typeof value === "string" && /^\s*[=+@-]/.test(value)
          ? "'" + value
          : String(value);
      return '"' + text.replaceAll('"', '""') + '"';
    };
    const csv = [
      ["Planning estimate", data.product],
      ["Currency", "USD"],
      ["Product category", data.category],
      ["HS code (unverified)", data.hsCode],
      ["Unit purchase price", data.unitPrice],
      ["Quantity", data.quantity],
      ["Units", data.units],
      ["Origin", data.origin],
      ["Destination", data.destination],
      ["Shipping mode", data.shippingType],
      ["Total weight kg", data.weight],
      ["Packaging", data.packaging],
      ["Package count", data.packages],
      ...(data.shippingType === "sea"
        ? [
            ["Container type", data.container],
            ["Container count", data.containers],
          ]
        : []),
      ...rows,
      ["Import tax recoverable", String(data.recoverableTax)],
      ["Cash outlay", result.cashOutlay],
      ["Total landed cost", result.landed],
      ["Landed cost per unit", result.perUnit],
      ["Selling price per unit", data.sellingPrice],
      ["Profit per unit", result.profitPerUnit],
      ["Order profit", result.profit],
      ["Order revenue", result.revenue],
      ["Gross margin percent", result.margin],
      ["Customs value assumption", result.customsValue],
      ["Tax base assumption", result.taxBase],
    ]
      .map((row) => row.map(escape).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "landed-cost-estimate.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <div className="landed-results">
      <div className="landed-result-heading">
        <div>
          <span className="page-kicker">YOUR COST BREAKDOWN</span>
          <h2>{data.product}</h2>
          <p>
            {data.origin} <ArrowRight size={14} /> {data.destination} ·{" "}
            {data.quantity} {data.units.toLowerCase()}
          </p>
        </div>
        <button className="outline-button" onClick={edit}>
          <Pencil size={16} /> Edit inputs
        </button>
      </div>
      <div className="landed-metrics">
        <article>
          <span>Landed cost per unit</span>
          <strong>{formatUSD(result.perUnit)}</strong>
          <small>Total {formatUSD(result.landed)}</small>
        </article>
        <article>
          <span>Gross margin</span>
          <strong className={result.margin < 0 ? "landed-negative" : ""}>
            {result.margin.toFixed(1)}%
          </strong>
          <small>At {formatUSD(Number(data.sellingPrice))} per unit</small>
        </article>
        <article>
          <span>Profit per unit</span>
          <strong className={result.profit < 0 ? "landed-negative" : ""}>
            {formatUSD(result.profitPerUnit)}
          </strong>
          <small>Order profit {formatUSD(result.profit)}</small>
        </article>
      </div>
      <div className="landed-result-grid">
        <section className="landed-card">
          <h3>Order cost breakdown</h3>
          <dl className="landed-breakdown">
            {rows.map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{formatUSD(value)}</dd>
              </div>
            ))}
            <div>
              <dt>Cash outlay</dt>
              <dd>{formatUSD(result.cashOutlay)}</dd>
            </div>
            {data.recoverableTax && (
              <div>
                <dt>Less recoverable import tax</dt>
                <dd>−{formatUSD(result.tax)}</dd>
              </div>
            )}
            <div className="landed-total">
              <dt>Landed cost</dt>
              <dd>{formatUSD(result.landed)}</dd>
            </div>
          </dl>
        </section>
        <section className="landed-card">
          <h3>Your calculation assumptions</h3>
          <p>
            All costs are entered in USD. Freight and insurance amounts cover
            the full shipment.
          </p>
          <dl className="landed-breakdown">
            <div>
              <dt>Customs value</dt>
              <dd>{formatUSD(result.customsValue)}</dd>
            </div>
            <div>
              <dt>Duty rate</dt>
              <dd>{data.dutyRate}%</dd>
            </div>
            <div>
              <dt>Tax base</dt>
              <dd>{formatUSD(result.taxBase)}</dd>
            </div>
            <div>
              <dt>Tax rate</dt>
              <dd>{data.taxRate}%</dd>
            </div>
            <div>
              <dt>Import tax recoverable</dt>
              <dd>{data.recoverableTax ? "Yes" : "No"}</dd>
            </div>
          </dl>
          <p>
            Estimates depend on your inputs. Confirm classification, valuation,
            applicable rates and tax treatment for your shipment.
          </p>
        </section>
      </div>
      <div className="landed-result-actions">
        <button className="primary" onClick={download}>
          <Download size={17} /> Download estimate
        </button>
        <Link
          className="outline-button"
          href="/freight-calculator/freight-request"
        >
          Request a freight quote <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
