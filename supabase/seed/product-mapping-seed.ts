export type ProductMappingSeedRow = {
  store_id: string;
  conversation_id: string;
  customer_id: string;
  search_id: string | null;
  index: number;
  product_id: string;
  variant_id: string;
  displayed_title: string;
  displayed_size_options: string[];
  displayed_price: number;
  inventory_at_show_time: number;
  image_url: string | null;
  expires_at: string;
};

const now = Date.now();

export const productMappingSeed: ProductMappingSeedRow[] = [
  {
    store_id: "00000000-0000-0000-0000-000000000001",
    conversation_id: "11111111-1111-1111-1111-111111111111",
    customer_id: "22222222-2222-2222-2222-222222222221",
    search_id: null,
    index: 1,
    product_id: "33333333-3333-3333-3333-333333333331",
    variant_id: "gid://shopify/ProductVariant/11",
    displayed_title: "بيجامة شتوي أسود",
    displayed_size_options: ["M", "XL"],
    displayed_price: 950,
    inventory_at_show_time: 4,
    image_url: null,
    expires_at: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    store_id: "00000000-0000-0000-0000-000000000001",
    conversation_id: "11111111-1111-1111-1111-111111111111",
    customer_id: "22222222-2222-2222-2222-222222222221",
    search_id: null,
    index: 2,
    product_id: "33333333-3333-3333-3333-333333333332",
    variant_id: "gid://shopify/ProductVariant/22",
    displayed_title: "روب قطن وردي",
    displayed_size_options: ["XL"],
    displayed_price: 900,
    inventory_at_show_time: 3,
    image_url: null,
    expires_at: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    store_id: "00000000-0000-0000-0000-000000000001",
    conversation_id: "11111111-1111-1111-1111-111111111111",
    customer_id: "22222222-2222-2222-2222-222222222221",
    search_id: null,
    index: 3,
    product_id: "33333333-3333-3333-3333-333333333333",
    variant_id: "gid://shopify/ProductVariant/31",
    displayed_title: "بوركيني أسود",
    displayed_size_options: ["L"],
    displayed_price: 1200,
    inventory_at_show_time: 5,
    image_url: null,
    expires_at: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    store_id: "00000000-0000-0000-0000-000000000001",
    conversation_id: "11111111-1111-1111-1111-111111111111",
    customer_id: "22222222-2222-2222-2222-222222222221",
    search_id: null,
    index: 4,
    product_id: "33333333-3333-3333-3333-333333333334",
    variant_id: "gid://shopify/ProductVariant/41",
    displayed_title: "Expired Mapping Example",
    displayed_size_options: ["M"],
    displayed_price: 700,
    inventory_at_show_time: 1,
    image_url: null,
    expires_at: new Date(now - 60 * 1000).toISOString(),
  },
];

