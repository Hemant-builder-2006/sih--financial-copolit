import type { NextApiRequest, NextApiResponse } from 'next';

interface ShopifyShop {
  id: number;
  name: string;
  email: string;
  domain: string;
  province: string;
  country: string;
  address1: string;
  zip: string;
  city: string;
  phone: string;
  created_at: string;
  updated_at: string;
  country_code: string;
  country_name: string;
  currency: string;
  customer_email: string;
  timezone: string;
  shop_owner: string;
  money_format: string;
  money_with_currency_format: string;
  weight_unit: string;
  province_code: string;
  taxes_included: boolean;
  auto_configure_tax_inclusivity: boolean;
  tax_shipping: boolean;
  county_taxes: boolean;
  plan_display_name: string;
  plan_name: string;
  has_discounts: boolean;
  has_gift_cards: boolean;
  myshopify_domain: string;
  google_apps_domain: string;
  google_apps_login_enabled: boolean;
  money_in_emails_format: string;
  money_with_currency_in_emails_format: string;
  eligible_for_payments: boolean;
  requires_extra_payments_agreement: boolean;
  password_enabled: boolean;
  has_storefront: boolean;
  eligible_for_card_reader_giveaway: boolean;
  finances: boolean;
  primary_location_id: number;
  cookie_consent_level: string;
  visitor_tracking_consent_preference: string;
  checkout_api_supported: boolean;
  multi_location_enabled: boolean;
  setup_required: boolean;
  pre_launch_enabled: boolean;
  enabled_presentment_currencies: string[];
}

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  published_scope: string;
  tags: string;
  status: string;
  admin_graphql_api_id: string;
  variants: any[];
  options: any[];
  images: any[];
  image: any;
}

interface ShopifyOrder {
  id: number;
  admin_graphql_api_id: string;
  app_id: number;
  browser_ip: string;
  buyer_accepts_marketing: boolean;
  cancel_reason: string;
  cancelled_at: string;
  cart_token: string;
  checkout_id: number;
  checkout_token: string;
  client_details: any;
  closed_at: string;
  confirmed: boolean;
  contact_email: string;
  created_at: string;
  currency: string;
  current_subtotal_price: string;
  current_subtotal_price_set: any;
  current_total_discounts: string;
  current_total_discounts_set: any;
  current_total_duties_set: any;
  current_total_price: string;
  current_total_price_set: any;
  current_total_tax: string;
  current_total_tax_set: any;
  customer_locale: string;
  device_id: number;
  discount_codes: any[];
  email: string;
  estimated_taxes: boolean;
  financial_status: string;
  fulfillment_status: string;
  gateway: string;
  landing_site: string;
  landing_site_ref: string;
  location_id: number;
  name: string;
  note: string;
  note_attributes: any[];
  number: number;
  order_number: number;
  order_status_url: string;
  original_total_duties_set: any;
  payment_gateway_names: string[];
  phone: string;
  presentment_currency: string;
  processed_at: string;
  processing_method: string;
  reference: string;
  referring_site: string;
  source_identifier: string;
  source_name: string;
  source_url: string;
  subtotal_price: string;
  subtotal_price_set: any;
  tags: string;
  tax_lines: any[];
  taxes_included: boolean;
  test: boolean;
  token: string;
  total_discounts: string;
  total_discounts_set: any;
  total_line_items_price: string;
  total_line_items_price_set: any;
  total_outstanding: string;
  total_price: string;
  total_price_set: any;
  total_price_usd: string;
  total_shipping_price_set: any;
  total_tax: string;
  total_tax_set: any;
  total_tip_received: string;
  total_weight: number;
  updated_at: string;
  user_id: number;
  billing_address: any;
  customer: any;
  discount_applications: any[];
  fulfillments: any[];
  line_items: any[];
  payment_terms: any;
  refunds: any[];
  shipping_address: any;
  shipping_lines: any[];
}

interface ShopifyRequest {
  storeUrl?: string;
  apiKey?: string;
}

interface ShopifyResponse {
  shop?: {
    name: string;
    email: string;
    domain: string;
    currency: string;
    timezone: string;
    plan_name: string;
    created_at: string;
  };
  products?: {
    count: number;
    recent: Array<{
      id: number;
      title: string;
      vendor: string;
      product_type: string;
      created_at: string;
      status: string;
    }>;
  };
  orders?: {
    count: number;
    recent: Array<{
      id: number;
      name: string;
      email: string;
      total_price: string;
      currency: string;
      financial_status: string;
      fulfillment_status: string;
      created_at: string;
    }>;
  };
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ShopifyResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { storeUrl, apiKey }: ShopifyRequest = req.body;

    // Use provided credentials or fall back to environment variables
    const shopifyStoreUrl = storeUrl || process.env.SHOPIFY_STORE_URL;
    const shopifyApiKey = apiKey || process.env.SHOPIFY_API_KEY;

    if (!shopifyStoreUrl || !shopifyApiKey) {
      return res.status(400).json({ 
        error: 'Shopify store URL and API key are required' 
      });
    }

    // Clean store URL to get just the domain
    const storeDomain = shopifyStoreUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
    const baseUrl = `https://${storeDomain}/admin/api/2023-10`;

    const headers = {
      'X-Shopify-Access-Token': shopifyApiKey,
      'Content-Type': 'application/json',
    };

    // Fetch shop information
    const shopResponse = await fetch(`${baseUrl}/shop.json`, { headers });
    if (!shopResponse.ok) {
      throw new Error(`Failed to fetch shop info: ${shopResponse.status} ${shopResponse.statusText}`);
    }
    const shopData = await shopResponse.json();
    const shop: ShopifyShop = shopData.shop;

    // Fetch recent products
    const productsResponse = await fetch(`${baseUrl}/products.json?limit=5&fields=id,title,vendor,product_type,created_at,status`, { headers });
    if (!productsResponse.ok) {
      throw new Error(`Failed to fetch products: ${productsResponse.status} ${productsResponse.statusText}`);
    }
    const productsData = await productsResponse.json();
    const products: ShopifyProduct[] = productsData.products;

    // Get total product count
    const productCountResponse = await fetch(`${baseUrl}/products/count.json`, { headers });
    if (!productCountResponse.ok) {
      throw new Error(`Failed to fetch product count: ${productCountResponse.status} ${productCountResponse.statusText}`);
    }
    const productCountData = await productCountResponse.json();

    // Fetch recent orders
    const ordersResponse = await fetch(`${baseUrl}/orders.json?limit=5&status=any&fields=id,name,email,total_price,currency,financial_status,fulfillment_status,created_at`, { headers });
    if (!ordersResponse.ok) {
      throw new Error(`Failed to fetch orders: ${ordersResponse.status} ${ordersResponse.statusText}`);
    }
    const ordersData = await ordersResponse.json();
    const orders: ShopifyOrder[] = ordersData.orders;

    // Get total order count
    const orderCountResponse = await fetch(`${baseUrl}/orders/count.json?status=any`, { headers });
    if (!orderCountResponse.ok) {
      throw new Error(`Failed to fetch order count: ${orderCountResponse.status} ${orderCountResponse.statusText}`);
    }
    const orderCountData = await orderCountResponse.json();

    // Format response
    const response: ShopifyResponse = {
      shop: {
        name: shop.name,
        email: shop.email,
        domain: shop.domain,
        currency: shop.currency,
        timezone: shop.timezone,
        plan_name: shop.plan_name,
        created_at: shop.created_at,
      },
      products: {
        count: productCountData.count,
        recent: products.map(product => ({
          id: product.id,
          title: product.title,
          vendor: product.vendor,
          product_type: product.product_type,
          created_at: product.created_at,
          status: product.status,
        })),
      },
      orders: {
        count: orderCountData.count,
        recent: orders.map(order => ({
          id: order.id,
          name: order.name,
          email: order.email,
          total_price: order.total_price,
          currency: order.currency,
          financial_status: order.financial_status,
          fulfillment_status: order.fulfillment_status || 'unfulfilled',
          created_at: order.created_at,
        })),
      },
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Shopify API error:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Failed to fetch Shopify data' 
    });
  }
}