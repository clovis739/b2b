export type SiteEvent = {
  slug: string;
  title: string;
  category: string;
  city: string;
  country: string;
  start: string;
  end: string;
  venue: string;
  image: string;
  description: string;
  logo?: string;
  sourceUrl?: string;
  organizerUrl?: string;
  logoSource?: string;
};

// Public Globy event records and their original media-hosted logos, checked 21 October 2026.
export const tradeShows: SiteEvent[] = [
  {
    slug: "figap-mexico-f8db75",
    title: "FIGAP Mexico",
    category: "Agriculture",
    city: "Guadalajara",
    country: "Mexico",
    start: "2026-10-21",
    end: "2026-10-23",
    venue: "Expo Guadalajara",
    image: "event",
    logo: "/images/events/figap-mexico.webp",
    sourceUrl: "https://globy.com/events-calendar/figap-mexico-f8db75",
    organizerUrl: "https://figap.com/",
    logoSource:
      "https://media.globy.com/public/events/672b58a8d1088f0061c35905/logo/672b58a8d1088f0061c35939/672b58a8d1088f0061c35939_lg.webp",
    description:
      "An industry exhibition focused on livestock production, animal nutrition and processing equipment.",
  },
  {
    slug: "imlabop-ceb6a8",
    title: "ImLabOp",
    category: "Medical",
    city: "Algiers",
    country: "Algeria",
    start: "2026-10-21",
    end: "2026-10-25",
    venue: "Palais des Expositions SAFEX",
    image: "event",
    logo: "/images/events/imlabop.webp",
    sourceUrl: "https://globy.com/events-calendar/imlabop-ceb6a8",
    organizerUrl: "https://imlab.dz/",
    logoSource:
      "https://media.globy.com/public/events/683559e324b333010c04819a/logo/683559e324b333010c04819b/683559e324b333010c04819b_lg.webp",
    description:
      "A trade exhibition for laboratory equipment, medical imaging and operating-room technologies.",
  },
  {
    slug: "figas-vehigas-73d48e",
    title: "FIGAS & VEHIGAS",
    category: "Energy",
    city: "Lima",
    country: "Peru",
    start: "2026-10-21",
    end: "2026-10-23",
    venue: "Jockey Exhibition Center",
    image: "event",
    logo: "/images/events/figas-vehigas.webp",
    sourceUrl: "https://globy.com/events-calendar/figas-vehigas-73d48e",
    organizerUrl: "https://www.figas.thaiscorp.com/",
    logoSource:
      "https://media.globy.com/public/events/691dbc30e66a7d00263ab3ff/logo/691dbc30e66a7d00263ab400/691dbc30e66a7d00263ab400_lg.webp",
    description:
      "An exhibition covering gas technologies and equipment for industrial and vehicle applications.",
  },
  {
    slug: "ecofair-971d73",
    title: "ECOFair",
    category: "Environment & Waste",
    city: "Belgrade",
    country: "Serbia",
    start: "2026-10-21",
    end: "2026-10-23",
    venue: "Belgrade Fair",
    image: "event",
    logo: "/images/events/ecofair.webp",
    sourceUrl: "https://globy.com/events-calendar/ecofair-971d73",
    organizerUrl: "https://sajam-energetika-ecofair.talkb2b.net/",
    logoSource:
      "https://media.globy.com/public/events/69650920594cc8246e94e12a/logo/69650920594cc8246e94e12b/69650920594cc8246e94e12b_lg.webp",
    description:
      "An environmental technology fair featuring waste management, recycling and resource-efficiency solutions.",
  },
  {
    slug: "wt-asia-f0d2dc",
    title: "WT Asia",
    category: "Electronics",
    city: "Jakarta",
    country: "Indonesia",
    start: "2026-10-22",
    end: "2026-10-23",
    venue: "Grand City Expo (as listed by Globy)",
    image: "event",
    logo: "/images/events/wt-asia.webp",
    sourceUrl: "https://globy.com/events-calendar/wt-asia-f0d2dc",
    organizerUrl: "https://wtprocessandmachinery.com/",
    logoSource:
      "https://media.globy.com/public/events/699ff6114e30b4002696409f/logo/699ff6114e30b400269640a0/699ff6114e30b400269640a0_lg.webp",
    description:
      "A process and machinery trade exhibition. The source lists Jakarta, while its description mentions Surabaya; confirm the venue with the organizer.",
  },
];
