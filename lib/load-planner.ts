export type Cargo = {
  id: number;
  name: string;
  type: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
  rotate: boolean;
  stack: boolean;
};
export type Vehicle = {
  id: string;
  name: string;
  kind: "container" | "truck";
  length: number;
  width: number;
  height: number;
  payload: number;
};
export const loadVehicles: Vehicle[] = [
  {
    id: "20-standard",
    name: "20 ft standard",
    kind: "container",
    length: 589,
    width: 235,
    height: 239,
    payload: 28200,
  },
  {
    id: "40-standard",
    name: "40 ft standard",
    kind: "container",
    length: 1203,
    width: 235,
    height: 239,
    payload: 26700,
  },
  {
    id: "40-high-cube",
    name: "40 ft high cube",
    kind: "container",
    length: 1203,
    width: 235,
    height: 269,
    payload: 26500,
  },
  {
    id: "20-reefer",
    name: "20 ft refrigerated",
    kind: "container",
    length: 544,
    width: 229,
    height: 227,
    payload: 27000,
  },
  {
    id: "40-reefer",
    name: "40 ft refrigerated",
    kind: "container",
    length: 1158,
    width: 229,
    height: 250,
    payload: 29000,
  },
  {
    id: "box-truck",
    name: "Box truck",
    kind: "truck",
    length: 600,
    width: 240,
    height: 240,
    payload: 7000,
  },
  {
    id: "semi-trailer",
    name: "Curtainside semi-trailer",
    kind: "truck",
    length: 1360,
    width: 245,
    height: 270,
    payload: 24000,
  },
];
export type Placement = {
  x: number;
  y: number;
  z: number;
  l: number;
  w: number;
  h: number;
  cargoIndex: number;
};
export type VehiclePlan = {
  counts: number[];
  weight: number;
  volume: number;
  placements: Placement[];
  displayed: number;
};
function orientations(c: Cargo) {
  return c.rotate
    ? [
        [c.length, c.width, c.height],
        [c.width, c.length, c.height],
      ]
    : [[c.length, c.width, c.height]];
}
export function planCargo(cargo: Cargo[], vehicle: Vehicle) {
  if (!cargo.length || cargo.length > 12)
    throw Error("Add between one and twelve cargo types.");
  for (const c of cargo)
    if (
      !c.name.trim() ||
      ![c.length, c.width, c.height, c.weight, c.quantity].every(
        (n) => Number.isFinite(n) && n > 0,
      ) ||
      !Number.isInteger(c.quantity) ||
      c.quantity > 1000000
    )
      throw Error(
        "Enter valid dimensions, weights and whole quantities for every product.",
      );
  if (
    ![vehicle.length, vehicle.width, vehicle.height, vehicle.payload].every(
      (n) => Number.isFinite(n) && n > 0,
    )
  )
    throw Error("Enter valid equipment dimensions and payload.");
  const remaining = cargo.map((c) => c.quantity);
  const plans: VehiclePlan[] = [];
  const impossible: number[] = [];
  cargo.forEach((c, i) => {
    if (
      c.weight > vehicle.payload ||
      !orientations(c).some(
        ([l, w, h]) =>
          l <= vehicle.length && w <= vehicle.width && h <= vehicle.height,
      )
    )
      impossible.push(i);
  });
  if (impossible.length)
    return { plans, impossible, remaining, totalVolume: 0, totalWeight: 0 };
  while (remaining.some((n) => n > 0)) {
    if (plans.length >= 1000)
      throw Error(
        "This estimate exceeds 1,000 loads. Reduce the quantity or choose larger equipment.",
      );
    let cursor = 0;
    const plan: VehiclePlan = {
      counts: cargo.map(() => 0),
      weight: 0,
      volume: 0,
      placements: [],
      displayed: 0,
    };
    const order = cargo
      .map((c, i) => ({ i, volume: c.length * c.width * c.height }))
      .sort((a, b) => b.volume - a.volume);
    for (const { i } of order) {
      const c = cargo[i];
      let best:
        | {
            l: number;
            w: number;
            h: number;
            across: number;
            high: number;
            take: number;
            used: number;
          }
        | undefined;
      for (const [l, w, h] of orientations(c)) {
        const across = Math.floor(vehicle.width / w);
        const high = c.stack ? Math.floor(vehicle.height / h) : 1;
        const cross = across * high;
        const max = Math.floor((vehicle.length - cursor) / l) * cross;
        const take = Math.min(
          remaining[i],
          max,
          Math.floor((vehicle.payload - plan.weight) / c.weight),
        );
        if (take > 0) {
          const used = Math.ceil(take / cross) * l;
          if (
            !best ||
            take > best.take ||
            (take === best.take && used < best.used)
          )
            best = { l, w, h, across, high, take, used };
        }
      }
      if (!best) continue;
      const { l, w, h, across, high, take, used } = best;
      const cross = across * high;
      const sampleCount = Math.min(take, 180 - plan.placements.length);
      for (let n = 0; n < sampleCount; n++) {
        plan.placements.push({
          x: cursor + Math.floor(n / cross) * l,
          y: (n % across) * w,
          z: Math.floor((n % cross) / across) * h,
          l,
          w,
          h,
          cargoIndex: i,
        });
      }
      plan.counts[i] = take;
      plan.weight += take * c.weight;
      plan.volume += (take * c.length * c.width * c.height) / 1e6;
      remaining[i] -= take;
      cursor += used;
    }
    if (!plan.counts.some((n) => n > 0))
      throw Error("No loading arrangement could be found.");
    plan.displayed = plan.placements.length;
    plans.push(plan);
  }
  return {
    plans,
    impossible,
    remaining,
    totalVolume: cargo.reduce(
      (n, c) => n + (c.length * c.width * c.height * c.quantity) / 1e6,
      0,
    ),
    totalWeight: cargo.reduce((n, c) => n + c.weight * c.quantity, 0),
  };
}
