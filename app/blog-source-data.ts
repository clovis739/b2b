export type SourcePost = {
  slug: string;
  title: string;
  category: string;
  author: string;
  published: string;
  summary: string;
  image: string;
  imageAlt: string;
};
// Metadata snapshot from the public Globy blog, checked 21 October 2026.
// Topic-specific replacement photography; provenance: reference/blog-image-sources.json.
export const sourcePosts: SourcePost[] = [
  {
    slug: "iran-us-diplomacy-what-it-means-for-global-trade-energy-and-logistics-367fce",
    title:
      "Iran - U.S. Diplomacy: What It Means for Global Trade, Energy, and Logistics",
    category: "Market experts",
    author: "Girish Joshi",
    published: "2026-10-16",
    summary: "A perspective on diplomacy and international commerce.",
    image: "/images/blog/diplomacy-trade.jpg",
    imageAlt: "Container ship and cranes at an international freight terminal",
  },
  {
    slug: "building-stronger-procurement-teams-how-to-scale-negotiation-excellence-across-an-organization-ad6530",
    title:
      "Building Stronger Procurement Teams: How to Scale Negotiation Excellence Across an Organization",
    category: "Market experts",
    author: "Glenn Gardner",
    published: "2026-10-16",
    summary: "Procurement team development and negotiation capabilities.",
    image: "/images/blog/procurement-team.jpg",
    imageAlt: "Business team collaborating around laptops and documents",
  },
  {
    slug: "top-10-chemical-industry-events-in-europe-that-help-you-discover-new-technologies-build-partnerships-and-expand-markets-3a11bc",
    title:
      "Top 10 Chemical Industry Events in Europe That Help You Discover New Technologies, Build Partnerships, and Expand Markets",
    category: "Exhibitions",
    author: "Globy curated materials",
    published: "2026-10-16",
    summary: "A selection of European chemical-sector exhibitions.",
    image: "/images/blog/chemical-events.jpg",
    imageAlt: "Industry conference audience attending a presentation",
  },
  {
    slug: "why-traditional-supply-planning-falls-short-the-case-for-demand-driven-replenishment-ffc2ec",
    title:
      "Why Traditional Supply Planning Falls Short: The Case for Demand-Driven Replenishment",
    category: "Market experts",
    author: "Simon Eagle",
    published: "2026-10-16",
    summary: "A perspective on replenishment and supply planning.",
    image: "/images/blog/supply-planning.jpg",
    imageAlt: "Warehouse shelves and packed orders ready for distribution",
  },
  {
    slug: "mexico-tightens-avocado-export-rules-as-prices-plunge-despite-shipment-surge-d2be74",
    title:
      "Mexico Tightens Avocado Export Rules as Prices Plunge Despite Shipment Surge",
    category: "News",
    author: "Globy curated materials",
    published: "2026-10-16",
    summary: "An update concerning Mexico's avocado exports.",
    image: "/images/blog/avocado-exports.jpg",
    imageAlt:
      "Halved avocado showing its flesh and seed against a pink background",
  },
  {
    slug: "how-to-write-an-effective-unclaimed-cargo-listing-on-globy-a-step-by-step-guide-ef8d8f",
    title:
      "How to Write an Effective Unclaimed Cargo Listing on Globy: A Step-by-Step Guide",
    category: "Trade guide",
    author: "Globy curated materials",
    published: "2026-01-12",
    summary: "A guide to preparing an unclaimed-cargo listing.",
    image: "/images/blog/unclaimed-cargo.jpg",
    imageAlt: "Aerial view of colorful shipping containers in a cargo terminal",
  },
  {
    slug: "how-albertas-potential-separation-could-reshape-global-trade-a124ad",
    title: "How Alberta’s Potential Separation Could Reshape Global Trade",
    category: "Analysis",
    author: "Globy curated materials",
    published: "2026-09-19",
    summary: "An analysis of a potential change in Canada's trade landscape.",
    image: "/images/blog/alberta-trade.jpg",
    imageAlt: "Calgary skyline in Alberta at sunset",
  },
  {
    slug: "the-ai-boom-is-reshaping-trans-pacific-trade-can-logistics-keep-up-94f05f",
    title:
      "The AI Boom Is Reshaping Trans-Pacific Trade. Can Logistics Keep Up?",
    category: "Logistics & Supply chain",
    author: "Globy curated materials",
    published: "2026-10-12",
    summary: "AI-related cargo demand and transport capacity.",
    image: "/images/blog/ai-logistics.jpg",
    imageAlt: "Server racks and network cables in a data center",
  },
];
export const sourcePostPath = (post: SourcePost) => `/blog/${post.slug}`;
const date = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
  timeZone: "UTC",
});
export const sourcePostDate = (post: SourcePost) =>
  date.format(new Date(`${post.published}T00:00:00Z`));
