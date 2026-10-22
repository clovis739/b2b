export const equipment = [
  {
    name: "20 ft standard",
    length: 589,
    width: 235,
    height: 239,
    weight: 28200,
  },
  {
    name: "40 ft standard",
    length: 1203,
    width: 235,
    height: 239,
    weight: 26700,
  },
  {
    name: "40 ft high cube",
    length: 1203,
    width: 235,
    height: 269,
    weight: 26500,
  },
];

export const ports = [
  "Shanghai, China",
  "Nhava Sheva, India",
  "Rotterdam, Netherlands",
  "Lagos, Nigeria",
  "Jebel Ali, UAE",
  "New York, United States",
  "Hamburg, Germany",
  "Alexandria, Egypt",
  "Genoa, Italy",
];

export function routePort(slug: string | undefined, fallback: string) {
  if (slug && ports.includes(slug)) return slug;
  const match: Record<string, string> = {
    china: ports[0],
    india: ports[1],
    netherlands: ports[2],
    nigeria: ports[3],
    "united-arab-emirates": ports[4],
    "united-states": ports[5],
    egypt: ports[7],
    germany: ports[6],
    italy: ports[8],
    algeria: "Algiers, Algeria",
    spain: "Valencia, Spain",
    "saudi-arabia": "Jeddah, Saudi Arabia",
    vietnam: "Ho Chi Minh City, Vietnam",
  };
  return slug ? match[slug] || fallback : fallback;
}

export function calculateLoad(
  length: number,
  width: number,
  height: number,
  weight: number,
  quantity: number,
  equipmentIndex: number,
) {
  const c = equipment[equipmentIndex];
  const orientations = [
    [length, width, height],
    [length, height, width],
    [width, length, height],
    [width, height, length],
    [height, length, width],
    [height, width, length],
  ];
  const capacity = Math.max(
    ...orientations.map(
      ([l, w, h]) =>
        Math.floor(c.length / l) *
        Math.floor(c.width / w) *
        Math.floor(c.height / h),
    ),
  );
  const weightCapacity = weight > 0 ? Math.floor(c.weight / weight) : capacity;
  const fit = Math.min(capacity, weightCapacity, quantity);
  const volume = (length * width * height) / 1e6;
  return {
    fit,
    capacity,
    containers: fit > 0 ? Math.ceil(quantity / fit) : 0,
    volume: volume * quantity,
    utilization:
      ((fit * volume) / ((c.length * c.width * c.height) / 1e6)) * 100,
    totalWeight: quantity * weight,
  };
}
