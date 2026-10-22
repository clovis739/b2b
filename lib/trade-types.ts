export type TradeListing = {
  id: string;
  owner_id: string;
  kind: "product" | "rfq";
  title: string;
  fields: {
    description: string;
    category: string;
    country: string;
    quantity: string;
    price: string;
    unit: string;
  };
  status: "pending" | "approved" | "rejected" | "withdrawn";
  review_note: string;
  created_at: number;
  updated_at: number;
  owner_name: string;
};
export type Thread = {
  id: string;
  listing_id: string;
  title: string;
  partner: string;
  created_at: number;
};
export type TradeMessage = {
  id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  quote_amount: number | null;
  currency: string | null;
  created_at: number;
};
