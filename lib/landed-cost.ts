export type LandedCosts = {
  quantity: number;
  unitPrice: number;
  freight: number;
  insurance: number;
  dutyRate: number;
  taxRate: number;
  brokerage: number;
  inland: number;
  other: number;
  sellingPrice: number;
  customsValue?: number;
  taxBase?: number;
  recoverableTax: boolean;
};
export function calculateLandedCost(input: LandedCosts) {
  for (const [key, value] of Object.entries(input)) {
    if (typeof value === "number" && (!Number.isFinite(value) || value < 0))
      throw new RangeError("Invalid " + key);
  }
  if (input.quantity <= 0) throw new RangeError("Quantity must be positive");
  const goods = input.quantity * input.unitPrice;
  const customsValue =
    input.customsValue ?? goods + input.freight + input.insurance;
  const duty = (customsValue * input.dutyRate) / 100;
  const taxBase = input.taxBase ?? customsValue + duty;
  const tax = (taxBase * input.taxRate) / 100;
  const cashOutlay =
    goods +
    input.freight +
    input.insurance +
    duty +
    tax +
    input.brokerage +
    input.inland +
    input.other;
  const landed = cashOutlay - (input.recoverableTax ? tax : 0);
  const perUnit = landed / input.quantity;
  const revenue = input.quantity * input.sellingPrice;
  const profit = revenue - landed;
  const profitPerUnit = input.sellingPrice - perUnit;
  const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
  const markup = landed > 0 ? (profit / landed) * 100 : 0;
  const output = {
    goods,
    customsValue,
    duty,
    taxBase,
    tax,
    cashOutlay,
    landed,
    perUnit,
    revenue,
    profit,
    profitPerUnit,
    margin,
    markup,
  };
  if (Object.values(output).some((value) => !Number.isFinite(value)))
    throw new RangeError("Calculation exceeds supported values");
  return output;
}
export const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
