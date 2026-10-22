import Image from "next/image";
import { Check } from "lucide-react";
import AnimatedDisclosure from "@/components/ui/animated-disclosure";

const features = [
  {
    title: "Efficient Cargo Planning",
    items: [
      "Use dimensions, item weights and stacking preferences in one estimate.",
      "Review the cargo allocated to each load.",
      "Compare available container and truck equipment.",
    ],
  },
  {
    title: "Optimized Weight Distribution",
    items: [
      "Check the total weight against the selected payload limit.",
      "Review the weight of each planned load.",
      "Axle loading and center-of-gravity certification require a separate check.",
    ],
  },
  {
    title: "Interactive 3D Load Visualization",
    items: [
      "Switch between isometric and overhead views.",
      "Identify cargo types using the color legend.",
      "Review a schematic arrangement before discussing the plan with your carrier.",
    ],
  },
];
export default function LoadFeatures() {
  return (
    <section className="load-feature-section load-features-reference">
      <div className="load-guide-photo load-container-banner">
        <Image
          src="/images/containers.jpg"
          alt="Shipping containers arranged in a cargo terminal"
          fill
          sizes="(max-width:888px) 100vw, (max-width:1400px) 300px, 520px"
        />
      </div>
      <div className="load-feature-content">
        <h2>Key Features of Our Container &amp; Truck Load Calculator</h2>
        <div className="load-feature-accordion">
          {features.map((feature, index) => (
            <AnimatedDisclosure
              key={feature.title}
              title={feature.title}
              defaultOpen={index === 0}
            >
              <ul>
                {feature.items.map((item) => (
                  <li key={item}>
                    <Check size={15} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </AnimatedDisclosure>
          ))}
        </div>
      </div>
    </section>
  );
}
