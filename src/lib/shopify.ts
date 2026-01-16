// Shopify Storefront API Configuration
// Replace these with your actual Shopify store credentials
const SHOPIFY_STOREFRONT_TOKEN = '7b079bc595938244568b08a3286fe24b';
const SHOPIFY_DOMAIN = 'xgn97e-x0.myshopify.com';

const STOREFRONT_API_URL = `https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`;

// Types
export interface ShopifyProduct {
  node: {
    id: string;
    handle: string;
    title: string;
    description: string;
    descriptionHtml: string;
    options: Array<{
      id: string;
      name: string;
      values: string[];
    }>;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          availableForSale: boolean;
          price: {
            amount: string;
            currencyCode: string;
          };
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
  };
}

export interface CartItem {
  variantId: string;
  quantity: number;
  product: ShopifyProduct;
  selectedOptions: Array<{ name: string; value: string }>;
  price: { amount: string; currencyCode: string };
  lineId: string | null;
}

// GraphQL Queries
const PRODUCTS_QUERY = `
  query Products($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          handle
          title
          description
          descriptionHtml
          options {
            id
            name
            values
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
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
      options {
        id
        name
        values
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 10) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 50) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
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

export const CART_QUERY = `
  query Cart($cartId: ID!) {
    cart(id: $cartId) {
      id
      checkoutUrl
      lines(first: 100) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                price {
                  amount
                  currencyCode
                }
                selectedOptions {
                  name
                  value
                }
                product {
                  id
                  handle
                  title
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const CREATE_CART_MUTATION = `
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 1) {
          edges {
            node {
              id
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const ADD_LINE_MUTATION = `
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const UPDATE_LINE_MUTATION = `
  mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const REMOVE_LINE_MUTATION = `
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        id
      }
      userErrors {
        field
        message
      }
    }
  }
`;

// API Request Helper
export async function storefrontApiRequest<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(STOREFRONT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json = await response.json();

  if (json.errors) {
    console.error('Shopify GraphQL errors:', json.errors);
    throw new Error(json.errors[0]?.message || 'GraphQL error');
  }

  return json.data;
}

// Product Fetching
export async function fetchProducts(first: number = 20): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest<{ products: { edges: ShopifyProduct[] } }>(
    PRODUCTS_QUERY,
    { first }
  );
  return data.products.edges;
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct['node'] | null> {
  const data = await storefrontApiRequest<{ product: ShopifyProduct['node'] | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle }
  );
  return data.product;
}

// Cart Operations
export async function createShopifyCart(item: CartItem): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest<{
    cartCreate: {
      cart: { id: string; checkoutUrl: string; lines: { edges: Array<{ node: { id: string } }> } } | null;
      userErrors: Array<{ field: string; message: string }>;
    };
  }>(CREATE_CART_MUTATION, {
    input: {
      lines: [{ merchandiseId: item.variantId, quantity: item.quantity }],
    },
  });

  if (data.cartCreate.userErrors.length > 0) {
    console.error('Cart creation errors:', data.cartCreate.userErrors);
    return null;
  }

  const cart = data.cartCreate.cart;
  if (!cart) return null;

  return {
    cartId: cart.id,
    checkoutUrl: cart.checkoutUrl,
    lineId: cart.lines.edges[0]?.node.id || '',
  };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: CartItem
): Promise<{ success: boolean; lineId?: string; cartNotFound?: boolean }> {
  try {
    const data = await storefrontApiRequest<{
      cartLinesAdd: {
        cart: { lines: { edges: Array<{ node: { id: string; merchandise: { id: string } } }> } } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(ADD_LINE_MUTATION, {
      cartId,
      lines: [{ merchandiseId: item.variantId, quantity: item.quantity }],
    });

    if (data.cartLinesAdd.userErrors.length > 0) {
      const cartNotFoundError = data.cartLinesAdd.userErrors.some(
        (e) => e.message.includes('not found') || e.message.includes('does not exist')
      );
      return { success: false, cartNotFound: cartNotFoundError };
    }

    const newLine = data.cartLinesAdd.cart?.lines.edges.find(
      (edge) => edge.node.merchandise.id === item.variantId
    );

    return { success: true, lineId: newLine?.node.id };
  } catch (error) {
    console.error('Failed to add line to cart:', error);
    return { success: false };
  }
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  try {
    const data = await storefrontApiRequest<{
      cartLinesUpdate: {
        cart: { id: string } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(UPDATE_LINE_MUTATION, {
      cartId,
      lines: [{ id: lineId, quantity }],
    });

    if (data.cartLinesUpdate.userErrors.length > 0) {
      const cartNotFoundError = data.cartLinesUpdate.userErrors.some(
        (e) => e.message.includes('not found') || e.message.includes('does not exist')
      );
      return { success: false, cartNotFound: cartNotFoundError };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update cart line:', error);
    return { success: false };
  }
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  try {
    const data = await storefrontApiRequest<{
      cartLinesRemove: {
        cart: { id: string } | null;
        userErrors: Array<{ field: string; message: string }>;
      };
    }>(REMOVE_LINE_MUTATION, {
      cartId,
      lineIds: [lineId],
    });

    if (data.cartLinesRemove.userErrors.length > 0) {
      const cartNotFoundError = data.cartLinesRemove.userErrors.some(
        (e) => e.message.includes('not found') || e.message.includes('does not exist')
      );
      return { success: false, cartNotFound: cartNotFoundError };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to remove cart line:', error);
    return { success: false };
  }
}
