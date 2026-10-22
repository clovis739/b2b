"use client";
import {
  ArrowRight,
  Check,
  CalendarDays,
  Container,
  Plus,
  Equal,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AnimatedDisclosure from "@/components/ui/animated-disclosure";

const costComponents = [
  [
    "Product cost",
    "The purchase amount for the complete order, using your agreed pricing unit.",
  ],
  [
    "Freight",
    "The international transport charge from your carrier or forwarder.",
  ],
  ["Insurance", "The quoted premium for covering the cargo in transit."],
  [
    "Customs duty",
    "The duty amount calculated from your entered rate and customs value.",
  ],
  [
    "VAT or GST",
    "Import tax based on the rate and valuation assumptions you enter.",
  ],
  [
    "Brokerage and handling",
    "Clearance services and cargo handling charges not included elsewhere.",
  ],
  [
    "Inland transportation",
    "Delivery from the arrival terminal to your receiving location.",
  ],
  [
    "Other costs",
    "Separate expenses such as storage, inspection or document preparation.",
  ],
];
const questions = [
  [
    "What is landed cost?",
    "It is the combined cost of the goods and the expenses needed to bring them to their receiving location. Include each relevant expense once.",
  ],
  [
    "What is the difference between product cost and landed cost?",
    "Product cost covers the purchase. Landed cost adds the transport, import and delivery expenses you include in your estimate.",
  ],
  [
    "What is landed cost per unit?",
    "Divide the complete landed cost by the quantity in your chosen pricing unit. For a 100-piece order costing $2,500, that is $25 per piece.",
  ],
  [
    "Does landed cost include customs duty?",
    "Include applicable duty using a confirmed classification, valuation basis and rate. This calculator uses your inputs; it does not retrieve tariff schedules or verify HS codes.",
  ],
  [
    "Does landed cost include VAT or GST?",
    "Include import tax in the cash outlay. If it is recoverable for your business, the calculator can exclude it from the cost used for margin.",
  ],
  [
    "Can I use the calculator to estimate profit margin?",
    "Yes. Add your expected selling price in the cost step. The result compares that price with estimated landed cost and shows profit per unit, order profit and gross margin.",
  ],
  [
    "Are the results exact?",
    "No. They are planning estimates from the amounts and rates you enter. Refresh the calculation when quotes or assumptions change, and confirm actual charges before committing to an order.",
  ],
];
const outputs = [
  "Total landed cost for the shipment",
  "Landed cost per pricing unit",
  "Separate freight, duty and tax amounts",
  "Profit per unit and across the order",
  "Gross margin at your entered selling price",
];

function Formula({
  label,
  terms,
  denominator,
  multiplier,
}: {
  label: string;
  terms: string[];
  denominator?: string;
  multiplier?: string;
}) {
  return (
    <article className="landed-formula-card">
      <h3>{label}</h3>
      <div
        className="landed-equation"
        aria-label={
          label +
          " equals " +
          terms.join(" plus ") +
          (denominator ? " divided by " + denominator : "") +
          (multiplier ? " multiplied by " + multiplier : "")
        }
      >
        <Equal size={19} aria-hidden="true" />
        <div className="landed-fraction">
          <div>
            {terms.map((term, index) => (
              <span className="landed-equation-term" key={term}>
                {index > 0 && <Plus size={14} aria-hidden="true" />}
                <span className="landed-chip">{term}</span>
              </span>
            ))}
          </div>
          {denominator && (
            <span className="landed-denominator">
              <span className="landed-chip">{denominator}</span>
            </span>
          )}
        </div>
        {multiplier && (
          <span className="landed-multiplier">× {multiplier}</span>
        )}
      </div>
    </article>
  );
}
export default function LandedGuide() {
  return (
    <div className="landed-guide">
      <section
        className="landed-video-section"
        id="calculator-tutorial"
        aria-labelledby="calculator-tutorial-title"
      >
        <div>
          <span className="page-kicker">GET STARTED</span>
          <h2 id="calculator-tutorial-title">See How the Calculator Works</h2>
          <p>
            Take a quick tour of the information to prepare, the calculation
            steps and the final breakdown.
          </p>
          <ol>
            <li>Enter your product quantity and purchase price.</li>
            <li>Add shipment details and delivery terms.</li>
            <li>Include freight, duty, tax and other costs.</li>
            <li>Review your landed cost and profit margin.</li>
          </ol>
        </div>
        <div className="landed-video">
          <a
            href="#landed-calculator-steps"
            aria-label="Start your landed cost calculation"
          >
            <Image
              src="/images/vantora-landed-cost.svg"
              alt="Landed cost calculator preview"
              fill
              sizes="(max-width:750px) 100vw, 50vw"
            />
            <span>
              <ArrowRight size={26} />
            </span>
          </a>
        </div>
      </section>
      <section
        className="landed-explainer"
        id="calculator-outputs"
        aria-labelledby="calculator-outputs-title"
      >
        <div>
          <span className="page-kicker">FROM QUOTE TO FINAL COST</span>
          <h2 id="calculator-outputs-title">What the Calculator Shows</h2>
          <p>
            Bring the purchase, shipment expenses and expected selling price
            into one estimate. Review both the money required for the order and
            the unit economics behind your pricing decision.
          </p>
          <small className="landed-section-note">
            Calculated from your entered quotes, rates and assumptions.
          </small>
        </div>
        <ul>
          {outputs.map((text) => (
            <li key={text}>
              <Check size={20} />
              {text}
            </li>
          ))}
        </ul>
      </section>
      <section
        className="landed-cost-components"
        id="landed-cost-components"
        aria-labelledby="landed-cost-components-title"
      >
        <h2 id="landed-cost-components-title">
          What Is Included in Landed Cost?
        </h2>
        <p>
          Build your estimate from the charges relevant to this order and the
          delivery responsibilities you agreed with each provider.
        </p>
        <div className="landed-table-wrap">
          <table>
            <caption className="sr-only">
              Eight cost components for a landed-cost estimate
            </caption>
            <thead>
              <tr>
                <th scope="col">Cost</th>
                <th scope="col">What it covers</th>
              </tr>
            </thead>
            <tbody>
              {costComponents.map(([name, description]) => (
                <tr key={name}>
                  <th scope="row">{name}</th>
                  <td>{description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          Check the scope of each quote before adding a charge. A transport or
          supplier offer may already include insurance, handling or delivery.
        </p>
      </section>
      <section
        className="landed-formula-section"
        id="landed-cost-formula"
        aria-labelledby="landed-cost-formula-title"
      >
        <h2 id="landed-cost-formula-title">How Landed Cost Is Calculated</h2>
        <p>
          First build the shipment total. Then divide it by the quantity
          expressed in the same units as your purchase price.
        </p>
        <div>
          <Formula
            label="Landed cost"
            terms={[
              "Goods",
              "Freight",
              "Insurance",
              "Duty",
              "Import tax",
              "Other import costs",
            ]}
          />
          <Formula
            label="Landed cost per unit"
            terms={["Total landed cost"]}
            denominator="Order quantity"
          />
        </div>
        <p className="landed-section-note">
          Illustration: a 100-piece order with $2,500 of landed costs works out
          to $25 per piece. If you mark import tax as recoverable, our margin
          calculation excludes it while the cash-outlay total retains it.
        </p>
      </section>
      <section
        className="landed-supplier-price"
        id="supplier-price-comparison"
        aria-labelledby="supplier-price-comparison-title"
      >
        <div className="landed-section-heading">
          <span className="page-kicker">LOOK BEYOND THE QUOTE</span>
          <h2 id="supplier-price-comparison-title">
            Why the Supplier Price Is Not Enough
          </h2>
          <p>
            Use the same delivery basis when comparing offers. Extra shipment
            expenses can change the apparent advantage of a lower purchase
            price.
          </p>
        </div>
        <div className="landed-price-example">
          <div className="landed-price-start">
            <span>Supplier price / piece</span>
            <strong>$20.00</strong>
          </div>
          <div className="landed-price-additions">
            <div>
              <span>Freight & insurance</span>
              <strong>+ $2.50</strong>
            </div>
            <div>
              <span>Duty & import tax</span>
              <strong>+ $1.50</strong>
            </div>
            <div>
              <span>Handling & other costs</span>
              <strong>+ $1.00</strong>
            </div>
          </div>
          <div className="landed-price-finish">
            <span>Estimated landed cost / piece</span>
            <strong>$25.00</strong>
          </div>
        </div>
        <p className="landed-section-note">
          Illustrative amounts only. In this example, basing profit on the
          supplier price would overlook $5 of costs on each piece.
        </p>
      </section>
      <section
        className="landed-compare-section"
        id="compare-before-ordering"
        aria-labelledby="compare-before-ordering-title"
      >
        <div>
          <span className="page-kicker">MAKE THE COMPARISON EARLY</span>
          <h2 id="compare-before-ordering-title">
            Compare Costs Before You Order
          </h2>
          <p>
            Run a separate estimate for each shortlisted offer. Keep the
            currency, product specification, pricing unit and delivery
            assumptions consistent, then adjust the quantity or transport quote
            to explore alternatives.
          </p>
          <p>
            Use Edit inputs to revisit a scenario and download its CSV before
            comparing the next one.
          </p>
        </div>
        <div className="landed-comparison-tools">
          <Link className="info-card" href="/shipping-schedules">
            <CalendarDays size={25} />
            <h3>Vessel Schedule Tracking</h3>
            <p>Review sailing information while planning the shipment.</p>
            <ArrowRight size={18} />
          </Link>
          <Link className="info-card" href="/tracking">
            <Container size={25} />
            <h3>Container Tracker</h3>
            <p>Open shipment tracking after your cargo is dispatched.</p>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
      <section
        className="landed-margin-section"
        id="landed-profit-margin"
        aria-labelledby="landed-profit-margin-title"
      >
        <h2 id="landed-profit-margin-title">Landed Cost and Profit Margin</h2>
        <p>
          Compare unit cost with your expected selling price. This is a gross
          estimate before any additional business overheads you have not
          included.
        </p>
        <Formula
          label="Profit margin (%)"
          terms={["Selling price - landed cost per unit"]}
          denominator="Selling price"
          multiplier="100"
        />
        <div className="landed-margin-example">
          <div>
            <span>Landed cost / piece</span>
            <strong>$25.00</strong>
          </div>
          <div>
            <span>Selling price / piece</span>
            <strong>$40.00</strong>
          </div>
          <div>
            <span>Profit / piece</span>
            <strong>$15.00</strong>
          </div>
          <div>
            <span>Gross margin</span>
            <strong>37.5%</strong>
          </div>
        </div>
        <p className="landed-section-note">
          Margin uses selling price as its denominator. Markup uses cost
          instead: these illustrative figures represent 60% markup, while gross
          margin is 37.5%.
        </p>
      </section>
      <section
        className="landed-duty-section"
        id="customs-duty-impact"
        aria-labelledby="customs-duty-impact-title"
      >
        <div>
          <span className="page-kicker">CHECK YOUR IMPORT ASSUMPTIONS</span>
          <h2 id="customs-duty-impact-title">
            How Customs Duty Affects the Calculation
          </h2>
          <p>
            Classification, valuation and the applicable rate need to be
            established for the particular shipment. Enter a confirmed duty rate
            and use the customs-value override if the default basis is
            unsuitable.
          </p>
          <p>
            Keep these inputs with your estimate so a later quote or
            classification review can be reflected in a revised result.
          </p>
        </div>
        <aside className="landed-duty-example">
          <span>Illustrative duty calculation</span>
          <strong>$8,000 × 6% = $480</strong>
          <p>
            An example of the arithmetic, not a tariff recommendation. The
            calculator does not determine your applicable rate.
          </p>
        </aside>
      </section>
      <section
        className="landed-faq"
        id="landed-cost-faq"
        aria-labelledby="landed-cost-faq-title"
      >
        <h2 id="landed-cost-faq-title">Frequently Asked Questions</h2>
        {questions.map(([question, answer]) => (
          <AnimatedDisclosure title={question} key={question}>
            <p>{answer}</p>
          </AnimatedDisclosure>
        ))}
      </section>
    </div>
  );
}
