CREATE TABLE IF NOT EXISTS last_product_recommendations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id text NOT NULL,
  slot_number integer NOT NULL,
  shopify_product_id text,
  shopify_variant_id text,
  title text,
  price numeric,
  image_url text,
  size_asked text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_product_rec_conv
  ON last_product_recommendations(conversation_id);
ALTER TABLE last_product_recommendations DISABLE ROW LEVEL SECURITY;
