"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  FormEvent,
  ReactNode,
} from "react";
import { equipment, ports, routePort } from "../lib/logistics";
import { Icon } from "../app/ui";
function useController(kind: string, variant?: string) {
  const [result, setResult] = useState(false);
  const [origin, setOrigin] = useState(
    routePort(variant?.split("|")[0], ports[0]),
  );
  const [destination, setDestination] = useState(
    routePort(
      variant?.split("|")[1],
      kind === "shipping-cost" ? ports[5] : ports[3],
    ),
  );
  const [error, setError] = useState("");
  const [equipmentIndex, setEquipment] = useState(0);
  const [length, setLength] = useState(variant === "pallets" ? 120 : 60);
  const [width, setWidth] = useState(variant === "pallets" ? 80 : 40);
  const [height, setHeight] = useState(variant === "pallets" ? 140 : 40);
  const [weight, setWeight] = useState(20);
  const [quantity, setQuantity] = useState(100);
  const [number, setNumber] = useState("");
  const [demo, setDemo] = useState(false);
  const [price, setPrice] = useState(20);
  const [shipping, setShipping] = useState(500);
  const [duty, setDuty] = useState(5);
  const [tax, setTax] = useState(7.5);
  const [sale, setSale] = useState(40);
  const [range, setRange] = useState("6 months");
  const [freightSort, setFreightSort] = useState("price");
  useEffect(() => {
    if (kind !== "freight") return;
    const params = new URLSearchParams(window.location.search);
    const from = params.get("from");
    const to = params.get("to");
    // Hydrate the external browser URL, unavailable in a static server render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (from) setOrigin(routePort(from, ports[0]));
    if (to) setDestination(routePort(to, ports[3]));
  }, [kind]);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (
      ["freight", "schedules", "shipping-cost"].includes(kind) &&
      origin === destination
    ) {
      setError("Choose different origin and destination ports.");
      setResult(false);
      return;
    }
    setError("");
    setResult(true);
  };
  const routeFields = (
    <>
      <label>
        Origin port
        <select
          value={origin}
          onChange={(e) => {
            setOrigin(e.target.value);
            setResult(false);
          }}
        >
          {[...new Set([...ports, origin, destination])].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
      <button
        className="swap-button"
        type="button"
        aria-label="Swap origin and destination"
        onClick={() => {
          setOrigin(destination);
          setDestination(origin);
          setResult(false);
        }}
      >
        ⇄
      </button>
      <label>
        Destination port
        <select
          value={destination}
          onChange={(e) => {
            setDestination(e.target.value);
            setResult(false);
          }}
        >
          {[...new Set([...ports, origin, destination])].map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </label>
    </>
  );
  return {
    kind,
    variant,
    result,
    setResult,
    origin,
    setOrigin,
    destination,
    setDestination,
    error,
    setError,
    equipmentIndex,
    setEquipment,
    length,
    setLength,
    width,
    setWidth,
    height,
    setHeight,
    weight,
    setWeight,
    quantity,
    setQuantity,
    number,
    setNumber,
    demo,
    setDemo,
    price,
    setPrice,
    shipping,
    setShipping,
    duty,
    setDuty,
    tax,
    setTax,
    sale,
    setSale,
    range,
    setRange,
    freightSort,
    setFreightSort,
    submit,
    routeFields,
  };
}
const Context = createContext<ReturnType<typeof useController> | null>(null);
export function LogisticsProvider({
  kind,
  variant,
  children,
}: {
  kind: string;
  variant?: string;
  children: ReactNode;
}) {
  return (
    <Context.Provider value={useController(kind, variant)}>
      {children}
    </Context.Provider>
  );
}
export function useLogisticsController() {
  const value = useContext(Context);
  if (!value) throw new Error("LogisticsProvider required");
  return value;
}
