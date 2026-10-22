"use client";
import { LogisticsProvider } from "../hooks/use-logistics-controller";
import LoadCalculator from "../components/logistics/load";
import LandedCostCalculator from "../components/logistics/landed";
import ContainerTracker from "../components/logistics/tracking";
import FreightIndex from "../components/logistics/index";
import FreightRoutes from "../components/logistics/freight-routes";
export { calculateLoad } from "../lib/logistics";
export default function LogisticsTools({
  kind,
  variant,
}: {
  kind: string;
  variant?: string;
}) {
  const Component =
    kind === "load"
      ? LoadCalculator
      : kind === "landed"
        ? LandedCostCalculator
        : kind === "tracking"
          ? ContainerTracker
          : kind === "index"
            ? FreightIndex
            : FreightRoutes;
  return (
    <LogisticsProvider kind={kind} variant={variant}>
      <Component />
    </LogisticsProvider>
  );
}
