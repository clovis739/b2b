import { Box, Cylinder, Rotate3D } from "lucide-react";
import LoadHowMotion from "./how-motion";

const blue = "#4877ff";
const border = "#d4deef";

function CargoIllustration() {
  return (
    <svg
      viewBox="0 0 680 340"
      aria-hidden="true"
      className="load-how-illustration"
    >
      <g fill="white" stroke={border} strokeWidth="1.5">
        <rect x="116" y="66" width="430" height="210" rx="11" />
        <rect
          x="92"
          y="71"
          width="435"
          height="216"
          rx="11"
          transform="rotate(9 310 180)"
        />
      </g>
      <g fill="none" stroke="#b9c6dc" strokeDasharray="5 5" strokeWidth="1.5">
        <path d="M162 142 271 78 442 166 339 285Z" />
        <path d="M162 142 156 184 339 285 343 245M442 166 436 208 339 285M271 78 268 120" />
      </g>
      <path
        d="M181 153Q198 111 260 103Q267 84 272 105Q342 116 413 165Q440 168 422 179Q401 221 342 230Q333 251 329 231Q255 223 181 175Q157 171 181 164Z"
        fill="#eaf2ff"
        stroke={blue}
        strokeWidth="1.7"
      />
      <g fill="white" stroke={border} strokeWidth="1.5">
        <rect
          x="20"
          y="101"
          width="176"
          height="53"
          rx="12"
          transform="rotate(-4 100 128)"
        />
        <rect
          x="491"
          y="35"
          width="169"
          height="54"
          rx="12"
          transform="rotate(7 570 62)"
        />
        <rect
          x="226"
          y="266"
          width="181"
          height="55"
          rx="12"
          transform="rotate(-4 310 293)"
        />
      </g>
      <g fontSize="17" fill="#202934" fontWeight="600">
        <g transform="rotate(-4 100 128)">
          <rect x="30" y="110" width="67" height="35" rx="8" fill="#eaf2ff" />
          <rect x="122" y="110" width="62" height="35" rx="8" fill="#f3f5f7" />
          <text x="38" y="133">
            Height
          </text>
          <text x="104" y="133">
            =
          </text>
          <text x="130" y="133">
            7′ 10″
          </text>
        </g>
        <g transform="rotate(7 570 62)">
          <rect x="501" y="44" width="65" height="35" rx="8" fill="#eaf2ff" />
          <rect x="590" y="44" width="60" height="35" rx="8" fill="#f3f5f7" />
          <text x="510" y="67">
            Width
          </text>
          <text x="573" y="67">
            =
          </text>
          <text x="598" y="67">
            7′ 9″
          </text>
        </g>
        <g transform="rotate(-4 310 293)">
          <rect x="236" y="275" width="70" height="35" rx="8" fill="#eaf2ff" />
          <rect x="332" y="275" width="66" height="35" rx="8" fill="#f3f5f7" />
          <text x="242" y="298">
            Length
          </text>
          <text x="313" y="298">
            =
          </text>
          <text x="338" y="298">
            39′ 6″
          </text>
        </g>
      </g>
    </svg>
  );
}

function TruckDrawing() {
  return (
    <g stroke={blue} strokeWidth="1.6" strokeLinejoin="round" fill="#eaf2ff">
      <path d="M244 129 337 122 424 180 424 237 335 237 335 129 244 135Z" />
      <path d="M236 135Q225 144 220 173L220 232 310 232 310 129Z" />
      <path d="M225 159 301 153 301 181 223 185Z" />
      <path d="M307 142 326 153 326 178 307 181Z" />
      <path d="M220 191 302 188 302 224 220 224Z" />
      <path d="M231 194 280 193 274 220 239 220Z" fill="white" />
      <path d="m233 199 45-1m-43 6 41-1m-39 6 37-1m-35 6 33-1" fill="none" />
      <rect x="219" y="227" width="87" height="10" rx="2" />
      <path d="M333 130 424 188M338 234 424 234M221 240 421 240" fill="none" />
      {[240, 308, 348, 365, 397, 415].map((x, i) => (
        <g key={x}>
          <ellipse
            cx={x}
            cy={i === 0 ? 240 : 239}
            rx={i === 1 ? 14 : 9}
            ry={i === 1 ? 19 : 12}
          />
          <ellipse
            cx={x}
            cy={i === 0 ? 240 : 239}
            rx={i === 1 ? 6 : 3.5}
            ry={i === 1 ? 10 : 6}
            fill="white"
          />
        </g>
      ))}
    </g>
  );
}

function EquipmentIllustration() {
  return (
    <svg
      viewBox="0 0 680 340"
      aria-hidden="true"
      className="load-how-illustration"
    >
      <g
        transform="rotate(-14 230 155)"
        fill="white"
        stroke={border}
        strokeWidth="1.5"
      >
        <rect x="45" y="66" width="400" height="198" rx="5" />
        <rect x="405" y="80" width="22" height="22" rx="4" />
        <text
          x="65"
          y="104"
          fill="#202934"
          stroke="none"
          fontSize="21"
          fontWeight="600"
        >
          20 Standard
        </text>
        <text x="65" y="238" fill={blue} stroke="none" fontSize="16">
          Learn more
        </text>
      </g>
      <g
        transform="rotate(11 460 195)"
        fill="white"
        stroke={border}
        strokeWidth="1.5"
      >
        <rect x="296" y="105" width="338" height="190" rx="5" />
        <rect x="596" y="119" width="21" height="21" rx="4" />
        <text
          x="318"
          y="141"
          fill="#202934"
          stroke="none"
          fontSize="19"
          fontWeight="600"
        >
          40 High Cube
        </text>
        <text x="556" y="274" fill="#202934" stroke="none" fontSize="16">
          − 1 +
        </text>
      </g>
      <rect
        x="101"
        y="73"
        width="475"
        height="234"
        rx="6"
        fill="white"
        stroke={border}
        strokeWidth="1.5"
      />
      <text x="122" y="113" fill="#202934" fontSize="22" fontWeight="600">
        Tautliner (Curtainsider)
      </text>
      <rect
        x="524"
        y="94"
        width="29"
        height="29"
        rx="5"
        fill="white"
        stroke={border}
      />
      <TruckDrawing />
      <text x="121" y="280" fill={blue} fontSize="17" fontWeight="500">
        Learn more
      </text>
      <g fill="white" stroke={border} strokeWidth="1.2">
        <rect x="465" y="256" width="91" height="30" rx="5" />
        <path d="M495 256v30m30-30v30" />
      </g>
      <g fontSize="20" fill="#26364e">
        <text x="473" y="277">
          −
        </text>
        <text x="505" y="277" fontSize="16">
          1
        </text>
        <text x="532" y="277">
          +
        </text>
      </g>
    </svg>
  );
}

function PlacementIllustration() {
  return (
    <svg
      viewBox="0 0 680 340"
      aria-hidden="true"
      className="load-how-illustration"
    >
      <g transform="rotate(-8 210 105)">
        <rect
          x="29"
          y="74"
          width="303"
          height="61"
          rx="5"
          fill="white"
          stroke={border}
          strokeWidth="1.5"
        />
        <text x="48" y="112" fill="#202934" fontSize="16" fontWeight="600">
          Cargo volume
        </text>
        <text x="218" y="112" fill="#52637b" fontSize="16">
          19.60 m³
        </text>
      </g>
      <g transform="rotate(8 485 268)">
        <rect
          x="375"
          y="232"
          width="259"
          height="60"
          rx="5"
          fill="white"
          stroke={border}
          strokeWidth="1.5"
        />
        <text x="470" y="257" fill="#202934" fontSize="16">
          10600.00 kg
        </text>
        <text x="486" y="278" fill="#8190a6" fontSize="12">
          50% of max weight
        </text>
      </g>
      <g transform="rotate(-1 340 170)">
        <rect
          x="105"
          y="76"
          width="487"
          height="176"
          rx="6"
          fill="white"
          stroke={border}
          strokeWidth="1.5"
        />
        <g transform="rotate(-90 192 164)" fill="none" strokeWidth="18">
          {[
            [blue, 0, 20],
            ["#8755fa", 20, 20],
            ["#f43675", 40, 20],
            ["#12b77b", 60, 20],
            ["#ff8500", 80, 20],
          ].map(([color, start, length]) => (
            <circle
              key={String(color)}
              cx="192"
              cy="164"
              r="51"
              pathLength="100"
              stroke={String(color)}
              strokeDasharray={`${length} ${100 - Number(length)}`}
              strokeDashoffset={-Number(start)}
            />
          ))}
        </g>
        <g fill="#202934" fontSize="13">
          <text x="302" y="136" fontWeight="600">
            Boxes
          </text>
          <text x="374" y="136">
            150
          </text>
          <text x="419" y="136">
            10.00 m³
          </text>
          <text x="497" y="136">
            9000.00 kg
          </text>
          <text x="302" y="169" fontWeight="600">
            Rolls
          </text>
          <text x="374" y="169">
            50
          </text>
          <text x="419" y="169">
            4.80 m³
          </text>
          <text x="497" y="169">
            800.00 kg
          </text>
          <text x="302" y="202" fontWeight="600">
            Barrels
          </text>
          <text x="374" y="202">
            50
          </text>
          <text x="419" y="202">
            4.80 m³
          </text>
          <text x="497" y="202">
            800.00 kg
          </text>
        </g>
        <Box
          x="271"
          y="118"
          width="22"
          height="22"
          color={blue}
          strokeWidth="1.6"
        />
        <Cylinder
          x="271"
          y="151"
          width="22"
          height="22"
          color="#ff3974"
          strokeWidth="1.6"
          transform="rotate(90 282 162)"
        />
        <Cylinder
          x="271"
          y="184"
          width="22"
          height="22"
          color="#9161fa"
          strokeWidth="1.6"
        />
      </g>
    </svg>
  );
}

function ContainerIllustration() {
  return (
    <svg
      viewBox="0 0 680 340"
      aria-hidden="true"
      className="load-how-illustration"
    >
      <g
        fill="#eaf2ff"
        stroke="#005bff"
        strokeWidth="2.4"
        strokeLinejoin="round"
      >
        <path d="M154 91 492 23 549 95 208 163Z" fill="#f4f8ff" />
        <path d="M208 163 549 95 549 226 208 296Z" />
        <path d="M154 91 208 163 208 296 154 224Z" />
      </g>
      <g fill="none" stroke="#005bff" strokeWidth="2">
        {Array.from({ length: 14 }, (_, i) => {
          const x = 232 + i * 22;
          return <path key={i} d={`M${x} ${163 - (x - 208) * 0.2}v133`} />;
        })}
        <path d="M174 118v133m15-112v133" />
      </g>
      <g transform="rotate(3 177 210)">
        <rect
          x="116"
          y="183"
          width="151"
          height="49"
          rx="10"
          fill="white"
          stroke={border}
          strokeWidth="1.4"
        />
        <text x="139" y="215" fontSize="20" fontWeight="500" fill="#202934">
          3D view
        </text>
        <Rotate3D
          x="215"
          y="196"
          width="24"
          height="24"
          color="#26364e"
          strokeWidth="1.7"
        />
      </g>
    </svg>
  );
}

export default function LoadHowItWorks() {
  const cards = [
    {
      title: "Enter Cargo Details",
      description: "Input cargo dimensions, weight and quantity",
      Illustration: CargoIllustration,
    },
    {
      title: "Choose a Container or Truck",
      description:
        "Select from standard 20ft and 40ft containers or various truck types.",
      Illustration: EquipmentIllustration,
    },
    {
      title: "Optimize Load Placement",
      description:
        "The system calculates the most efficient arrangement based on cargo characteristics.",
      Illustration: PlacementIllustration,
    },
    {
      title: "Get a 3D Visualization",
      description:
        "See a clear, interactive view of how your cargo will be loaded.",
      Illustration: ContainerIllustration,
    },
  ];
  return (
    <LoadHowMotion>
      {cards.map(({ title, description, Illustration }, index) => (
        <article
          className="info-card load-how-card"
          key={title}
          tabIndex={0}
          aria-labelledby={`load-how-title-${index}`}
        >
          <div className="load-how-copy">
            <h3 id={`load-how-title-${index}`}>{title}</h3>
            <p>{description}</p>
          </div>
          <Illustration />
        </article>
      ))}
    </LoadHowMotion>
  );
}
