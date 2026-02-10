import { PaginatedResults } from '@weco/common/services/prismic/types';
import {
  ShopImage,
  ShopProduct,
  ShopProductBasic,
  ShopProductVariant,
} from '@weco/content/types/shop';

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN =
  process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// GraphQL queries

const PRODUCTS_QUERY = `
  query Products($first: Int!, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        cursor
        node {
          id
          handle
          title
          description(truncateAt: 200)
          featuredImage {
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const PRODUCT_BY_HANDLE_QUERY = `
  query ProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      description
      descriptionHtml
      availableForSale
      featuredImage {
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

const CART_CREATE_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// Fetch wrapper

type ShopifyResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_ACCESS_TOKEN) {
    throw new Error(
      'SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_ACCESS_TOKEN must be set'
    );
  }

  const response = await fetch(
    `https://${SHOPIFY_STORE_DOMAIN}/api/2026-01/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    }
  );

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.status}`);
  }

  const json: ShopifyResponse<T> = await response.json();

  if (json.errors) {
    throw new Error(`Shopify GraphQL error: ${json.errors[0].message}`);
  }

  return json.data;
}

// Transformers

type ShopifyImageNode = {
  url: string;
  altText: string | null;
  width: number;
  height: number;
};

type ShopifyProductNode = {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale?: boolean;
  featuredImage: ShopifyImageNode | null;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  images?: {
    edges: { node: ShopifyImageNode }[];
  };
  variants?: {
    edges: {
      node: {
        id: string;
        title: string;
        availableForSale: boolean;
        price: { amount: string; currencyCode: string };
      };
    }[];
  };
};

function transformImage(node: ShopifyImageNode): ShopImage {
  return {
    url: node.url,
    altText: node.altText,
    width: node.width,
    height: node.height,
  };
}

function transformProductBasic(node: ShopifyProductNode): ShopProductBasic {
  return {
    id: node.id,
    handle: node.handle,
    title: node.title,
    description: node.description,
    featuredImage: node.featuredImage
      ? transformImage(node.featuredImage)
      : null,
    priceRange: {
      minVariantPrice: {
        amount: node.priceRange.minVariantPrice.amount,
        currencyCode: node.priceRange.minVariantPrice.currencyCode,
      },
      maxVariantPrice: {
        amount: node.priceRange.maxVariantPrice.amount,
        currencyCode: node.priceRange.maxVariantPrice.currencyCode,
      },
    },
  };
}

function transformProduct(node: ShopifyProductNode): ShopProduct {
  const basic = transformProductBasic(node);
  return {
    ...basic,
    descriptionHtml: node.descriptionHtml || '',
    images: (node.images?.edges || []).map(edge => transformImage(edge.node)),
    variants: (node.variants?.edges || []).map(
      (edge): ShopProductVariant => ({
        id: edge.node.id,
        title: edge.node.title,
        availableForSale: edge.node.availableForSale,
        price: {
          amount: edge.node.price.amount,
          currencyCode: edge.node.price.currencyCode,
        },
      })
    ),
    availableForSale: node.availableForSale || false,
  };
}

// Public API

type ProductsResponse = {
  products: {
    edges: { cursor: string; node: ShopifyProductNode }[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
};

type ProductByHandleResponse = {
  product: ShopifyProductNode | null;
};

type CartCreateResponse = {
  cartCreate: {
    cart: {
      checkoutUrl: string;
    } | null;
    userErrors: { field: string[]; message: string }[];
  };
};

export async function fetchShopProducts({
  page,
  pageSize,
  query,
}: {
  page: number;
  pageSize: number;
  query?: string;
}): Promise<PaginatedResults<ShopProductBasic>> {
  // Shopify uses cursor-based pagination, so we iterate to reach the requested page
  let cursor: string | null = null;
  let currentPage = 1;

  while (currentPage < page) {
    const data = await shopifyFetch<ProductsResponse>(PRODUCTS_QUERY, {
      first: pageSize,
      after: cursor,
      query,
    });

    if (!data.products.pageInfo.hasNextPage) {
      // Requested page is beyond available data
      return {
        currentPage: page,
        results: [],
        pageSize,
        totalResults: (currentPage - 1) * pageSize + data.products.edges.length,
        totalPages: currentPage,
      };
    }

    cursor = data.products.pageInfo.endCursor;
    currentPage++;
  }

  const data = await shopifyFetch<ProductsResponse>(PRODUCTS_QUERY, {
    first: pageSize,
    after: cursor,
    query,
  });

  const results = data.products.edges.map(edge =>
    transformProductBasic(edge.node)
  );

  // Estimate total pages: we know at least this many pages exist
  const hasNextPage = data.products.pageInfo.hasNextPage;
  const totalPages = hasNextPage ? page + 1 : page;
  const totalResults = hasNextPage
    ? totalPages * pageSize
    : (page - 1) * pageSize + results.length;

  return {
    currentPage: page,
    results,
    pageSize,
    totalResults,
    totalPages,
  };
}

export async function fetchShopProduct(
  handle: string
): Promise<ShopProduct | undefined> {
  const data = await shopifyFetch<ProductByHandleResponse>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );

  if (!data.product) {
    return undefined;
  }

  return transformProduct(data.product);
}

export async function createShopCheckout(
  lines: { variantId: string; quantity: number }[]
): Promise<string | undefined> {
  const data = await shopifyFetch<CartCreateResponse>(CART_CREATE_MUTATION, {
    input: {
      lines: lines.map(line => ({
        merchandiseId: line.variantId,
        quantity: line.quantity,
      })),
    },
  });

  if (data.cartCreate.userErrors.length > 0) {
    console.error('Shopify cart create error:', data.cartCreate.userErrors);
    return undefined;
  }

  return data.cartCreate.cart?.checkoutUrl;
}
