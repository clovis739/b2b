import type { PageKind } from "../app/route-map";

export const pageTypes = {
  status: {
    title: "HTTP status pages",
    group: "Support",
    features: [
      "39 client and server error screens",
      "Recovery actions and support links",
      "404 and runtime error handling",
    ],
  },
  home: {
    title: "Homepage",
    group: "Marketplace",
    features: [
      "Product and freight search",
      "Service tabs and sourcing shortcuts",
      "Events and insights",
    ],
  },
  market: {
    title: "Marketplace landing",
    group: "Marketplace",
    features: [
      "Sector navigation",
      "Featured products and suppliers",
      "Search and sourcing actions",
    ],
  },
  directory: {
    title: "Category directory",
    group: "Marketplace",
    features: [
      "33 product sectors",
      "Searchable category tree",
      "Category links",
    ],
  },
  listing: {
    title: "Product listing",
    group: "Marketplace",
    features: [
      "Search and country filters",
      "Price sorting and pagination",
      "Save products",
    ],
  },
  product: {
    title: "Product details",
    group: "Marketplace",
    features: [
      "Product imagery and specifications",
      "Pricing and supplier profile",
      "Local supplier inquiry",
    ],
  },
  supplier: {
    title: "Supplier profile",
    group: "Marketplace",
    features: ["Company overview", "Supplier catalog", "Contact inquiry"],
  },
  saved: {
    title: "Saved products",
    group: "Marketplace",
    features: [
      "Browser-persisted shortlist",
      "Remove saved products",
      "Browse product details",
    ],
  },
  "suppliers-promo": {
    title: "Sell on Vantora",
    group: "Sourcing",
    features: ["Supplier benefits", "Listing workflow", "Supplier signup"],
  },
  "rfq-promo": {
    title: "Sourcing introduction",
    group: "Sourcing",
    features: [
      "Buyer and supplier journeys",
      "Request workflow",
      "Create or browse RFQs",
    ],
  },
  rfqs: {
    title: "Sourcing requests",
    group: "Sourcing",
    features: [
      "Search buyer requirements",
      "Quantity and destination",
      "Quotation actions",
    ],
  },
  rfq: {
    title: "Sourcing request details",
    group: "Sourcing",
    features: [
      "Buyer requirements",
      "Delivery information",
      "Local quotation form",
    ],
  },
  "request-form": {
    title: "Create RFQ",
    group: "Sourcing",
    features: [
      "Product sector and specifications",
      "Quantity and delivery terms",
      "Persist a local RFQ draft",
    ],
  },
  "cargo-promo": {
    title: "Cargo introduction",
    group: "Sourcing",
    features: [
      "Cargo-owner and buyer paths",
      "Cargo resolution overview",
      "Browse or list cargo",
    ],
  },
  cargo: {
    title: "Available cargo",
    group: "Sourcing",
    features: [
      "Search cargo and locations",
      "Lot quantities and prices",
      "Cargo details",
    ],
  },
  "cargo-detail": {
    title: "Cargo details",
    group: "Sourcing",
    features: [
      "Lot description and location",
      "Quantity and offer information",
      "Local cargo inquiry",
    ],
  },
  "cargo-form": {
    title: "List cargo",
    group: "Sourcing",
    features: [
      "Cargo details and condition",
      "Port, quantity and availability",
      "Local cargo listing draft",
    ],
  },
  freight: {
    title: "Freight calculator",
    group: "Logistics",
    features: [
      "Origin, destination and equipment",
      "Sample estimate comparisons",
      "Cheapest or fastest sorting",
    ],
  },
  "freight-form": {
    title: "Freight quote request",
    group: "Logistics",
    features: [
      "Route and equipment",
      "Cargo dimensions and weight",
      "Local freight inquiry",
    ],
  },
  load: {
    title: "Load calculator",
    group: "Logistics",
    features: [
      "Box, pallet and CBM modes",
      "Rotation and weight constraints",
      "Container capacity estimate",
    ],
  },
  landed: {
    title: "Landed cost calculator",
    group: "Logistics",
    features: [
      "Purchase, freight, duty and tax",
      "Landed unit cost",
      "Gross margin estimate",
    ],
  },
  tracking: {
    title: "Container tracker",
    group: "Logistics",
    features: [
      "Shipment reference input",
      "Carrier selection",
      "Clearly labeled sample timeline",
    ],
  },
  schedules: {
    title: "Shipping schedules",
    group: "Logistics",
    features: [
      "Route and departure date",
      "Sample transit options",
      "Prepare a freight inquiry",
    ],
  },
  logistics: {
    title: "Logistics overview",
    group: "Logistics",
    features: [
      "Logistics service links",
      "Sample rate trend chart",
      "Planning tools",
    ],
  },
  "shipping-cost": {
    title: "Shipping cost guide",
    group: "Logistics",
    features: [
      "Route cost planning",
      "Equipment estimates",
      "Shipping cost breakdown",
    ],
  },
  blog: {
    title: "Insights listing",
    group: "Resources",
    features: ["Category navigation", "Article search", "Editorial cards"],
  },
  article: {
    title: "Article details",
    group: "Resources",
    features: [
      "Title, author and reading time",
      "Original article sections",
      "Related navigation",
    ],
  },
  authors: {
    title: "Author directory",
    group: "Resources",
    features: [
      "Contributor profile cards",
      "Author links",
      "Editorial information",
    ],
  },
  author: {
    title: "Author profile",
    group: "Resources",
    features: [
      "Contributor introduction",
      "Author’s articles",
      "Article search",
    ],
  },
  events: {
    title: "Event calendar",
    group: "Resources",
    features: [
      "Search events and industries",
      "Country filter",
      "Event details",
    ],
  },
  event: {
    title: "Event details",
    group: "Resources",
    features: [
      "Date, venue and location",
      "Event description",
      "Calendar export",
    ],
  },
  "event-form": {
    title: "Submit an event",
    group: "Resources",
    features: [
      "Dates, industry and venue",
      "Organizer information",
      "Local event submission draft",
    ],
  },
  webinars: {
    title: "Webinars",
    group: "Resources",
    features: [
      "Session topics and agendas",
      "Workshop notes",
      "Save interest locally",
    ],
  },
  about: {
    title: "About the platform",
    group: "Company",
    features: [
      "Platform purpose",
      "Sourcing and logistics services",
      "Contact and business links",
    ],
  },
  contact: {
    title: "Contact",
    group: "Company",
    features: [
      "Subject and contact details",
      "Message validation",
      "Local contact draft",
    ],
  },
  help: {
    title: "Help center",
    group: "Support",
    features: ["Search questions", "Help collections", "Expandable answers"],
  },
  "help-article": {
    title: "Help article",
    group: "Support",
    features: [
      "Question and answer",
      "Collection navigation",
      "Return to help center",
    ],
  },
  auth: {
    title: "Account screens",
    group: "Account",
    features: [
      "Sign-in and buyer/supplier variants",
      "Password visibility and validation",
      "Database accounts and cookie sessions",
    ],
  },
  workspace: {
    title: "Business workspace",
    group: "Account",
    features: [
      "Account and guest workspaces",
      "Search, download and delete drafts",
      "Product draft creation",
    ],
  },
  policy: {
    title: "Policy pages",
    group: "Company",
    features: [
      "Terms, privacy and storage information",
      "Readable policy sections",
      "Local-data controls",
    ],
  },
  sitemap: {
    title: "Page directory",
    group: "Support",
    features: [
      "41 page-type overview",
      "Representative route links",
      "Search all local URLs",
    ],
  },
} satisfies Record<
  PageKind,
  { title: string; group: string; features: string[] }
>;
