export type ShopifyProduct = {
  shopifyProductId: string;
  shopifyProductGid: string;
  title: string;
  handle: string;
  vendor?: string;
  productType?: string;
  status: string;
  tags: string[];
  imageUrl?: string;
  variants: ShopifyProductVariant[];
};

export type ShopifyProductVariant = {
  shopifyVariantId: string;
  shopifyVariantGid: string;
  shopifyProductId: string;
  title: string;
  sku?: string;
  barcode?: string;
  price: number;
  compareAtPrice?: number;
  inventoryQuantity: number;
  inventoryPolicy: string;
  selectedOptions: Array<{ name: string; value: string }>;
  size?: string;
  color?: string;
};

export type ShopifySyncResult = {
  ok: boolean;
  products: ShopifyProduct[];
  productCount: number;
  variantCount: number;
  missingSkuCount: number;
  hasMorePages: boolean;
  endCursor?: string;
  error?: string;
  errorCode?: string;
};

function getCredentials() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const accessToken = process.env.SHOPIFY_ADMIN_API_TOKEN;
  const apiVersion = process.env.SHOPIFY_API_VERSION || "2024-01";
  if (!storeDomain || !accessToken) {
    return null;
  }
  return { storeDomain, accessToken, apiVersion };
}

function normalizeGid(gid: string): string {
  // Extract numeric ID from gid://shopify/Product/123456
  const match = gid.match(/\/([^\/]+)$/);
  return match ? match[1] : gid;
}

function extractSizeColor(selectedOptions: Array<{ name: string; value: string }>) {
  let size: string | undefined;
  let color: string | undefined;
  for (const opt of selectedOptions) {
    const nameLower = opt.name.toLowerCase();
    if (nameLower === "size" || nameLower === "المقاس" || nameLower === "مقاس") {
      size = opt.value;
    }
    if (nameLower === "color" || nameLower === "اللون" || nameLower === "لون") {
      color = opt.value;
    }
  }
  return { size, color };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const PRODUCTS_QUERY = `
query GetProducts($first: Int!, $after: String) {
  products(first: $first, after: $after) {
    pageInfo {
      hasNextPage
      endCursor
    }
    nodes {
      id
      title
      handle
      vendor
      productType
      status
      tags
      featuredMedia {
        ... on MediaImage {
          image {
            url
            altText
          }
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          sku
          barcode
          price
          compareAtPrice
          inventoryQuantity
          inventoryPolicy
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
}
`;

export async function fetchShopifyProductsPage(
  first: number = 50,
  after?: string,
): Promise<ShopifySyncResult> {
  const creds = getCredentials();
  if (!creds) {
    return {
      ok: false,
      products: [],
      productCount: 0,
      variantCount: 0,
      missingSkuCount: 0,
      hasMorePages: false,
      error: "Shopify credentials missing",
      errorCode: "SHOPIFY_CREDENTIALS_MISSING",
    };
  }

  const { storeDomain, accessToken, apiVersion } = creds;
  const url = `https://${storeDomain}/admin/api/${apiVersion}/graphql.json`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query: PRODUCTS_QUERY,
        variables: { first, after: after || null },
      }),
    });

    if (res.status === 429) {
      return {
        ok: false,
        products: [],
        productCount: 0,
        variantCount: 0,
        missingSkuCount: 0,
        hasMorePages: false,
        error: "Shopify rate limit exceeded",
        errorCode: "SHOPIFY_RATE_LIMIT",
      };
    }

    if (!res.ok) {
      const text = await res.text();
      return {
        ok: false,
        products: [],
        productCount: 0,
        variantCount: 0,
        missingSkuCount: 0,
        hasMorePages: false,
        error: `Shopify API error: ${res.status} ${text.slice(0, 200)}`,
        errorCode: "SHOPIFY_API_ERROR",
      };
    }

    const json = (await res.json()) as {
      data?: {
        products?: {
          pageInfo: { hasNextPage: boolean; endCursor: string | null };
          nodes: Array<{
            id: string;
            title: string;
            handle: string;
            vendor?: string;
            productType?: string;
            status: string;
            tags: string[];
            featuredMedia?: {
              image?: { url?: string; altText?: string };
            };
            variants: {
              nodes: Array<{
                id: string;
                title: string;
                sku?: string;
                barcode?: string;
                price: string;
                compareAtPrice?: string;
                inventoryQuantity: number;
                inventoryPolicy: string;
                selectedOptions: Array<{ name: string; value: string }>;
              }>;
            };
          }>;
        };
      };
      errors?: Array<{ message: string }>;
    };

    if (json.errors && json.errors.length > 0) {
      return {
        ok: false,
        products: [],
        productCount: 0,
        variantCount: 0,
        missingSkuCount: 0,
        hasMorePages: false,
        error: `GraphQL errors: ${json.errors.map((e) => e.message).join(", ")}`,
        errorCode: "SHOPIFY_GRAPHQL_ERROR",
      };
    }

    const productsData = json.data?.products;
    if (!productsData) {
      return {
        ok: false,
        products: [],
        productCount: 0,
        variantCount: 0,
        missingSkuCount: 0,
        hasMorePages: false,
        error: "No products data in Shopify response",
        errorCode: "SHOPIFY_EMPTY_RESPONSE",
      };
    }

    let missingSkuCount = 0;
    const products: ShopifyProduct[] = productsData.nodes.map((node) => {
      const productId = normalizeGid(node.id);
      const variants = node.variants.nodes.map((v) => {
        const variantId = normalizeGid(v.id);
        const { size, color } = extractSizeColor(v.selectedOptions);
        const sku = v.sku?.trim();
        if (!sku) missingSkuCount += 1;
        return {
          shopifyVariantId: variantId,
          shopifyVariantGid: v.id,
          shopifyProductId: productId,
          title: v.title,
          sku,
          barcode: v.barcode,
          price: Number(v.price) || 0,
          compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
          inventoryQuantity: v.inventoryQuantity ?? 0,
          inventoryPolicy: v.inventoryPolicy,
          selectedOptions: v.selectedOptions,
          size,
          color,
        };
      });

      return {
        shopifyProductId: productId,
        shopifyProductGid: node.id,
        title: node.title,
        handle: node.handle,
        vendor: node.vendor,
        productType: node.productType,
        status: node.status,
        tags: node.tags || [],
        imageUrl: node.featuredMedia?.image?.url,
        variants,
      };
    });

    return {
      ok: true,
      products,
      productCount: products.length,
      variantCount: products.reduce((sum, p) => sum + p.variants.length, 0),
      missingSkuCount,
      hasMorePages: productsData.pageInfo.hasNextPage,
      endCursor: productsData.pageInfo.endCursor || undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      products: [],
      productCount: 0,
      variantCount: 0,
      missingSkuCount: 0,
      hasMorePages: false,
      error: message,
      errorCode: "SHOPIFY_NETWORK_ERROR",
    };
  }
}

export async function fetchAllShopifyProducts(
  first: number = 50,
  maxPages: number = 100,
  onPage?: (pageResult: ShopifySyncResult, pageNumber: number) => void,
): Promise<ShopifySyncResult> {
  const allProducts: ShopifyProduct[] = [];
  let cursor: string | undefined;
  let pageNumber = 0;
  let totalMissingSku = 0;

  while (pageNumber < maxPages) {
    const result = await fetchShopifyProductsPage(first, cursor);
    if (!result.ok) {
      return {
        ...result,
        products: allProducts,
        productCount: allProducts.length,
        variantCount: allProducts.reduce((sum, p) => sum + p.variants.length, 0),
        missingSkuCount: totalMissingSku,
      };
    }

    pageNumber += 1;
    allProducts.push(...result.products);
    totalMissingSku += result.missingSkuCount;

    if (onPage) {
      onPage(result, pageNumber);
    }

    if (!result.hasMorePages || !result.endCursor) {
      break;
    }

    cursor = result.endCursor;
    // Rate limit safety: sleep 500ms between pages
    await sleep(500);
  }

  return {
    ok: true,
    products: allProducts,
    productCount: allProducts.length,
    variantCount: allProducts.reduce((sum, p) => sum + p.variants.length, 0),
    missingSkuCount: totalMissingSku,
    hasMorePages: false,
  };
}
