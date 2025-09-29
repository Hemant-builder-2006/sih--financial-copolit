# Shopify Integration Guide

This guide explains how to use the new ShopifyNode in your React Flow canvas to connect and analyze Shopify store data with AI.

## Setup Instructions

### 1. Environment Configuration

Copy `.env.example` to `.env.local` and configure your Shopify credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
SHOPIFY_STORE_URL=your-store-name.myshopify.com
SHOPIFY_API_KEY=shpat_your_access_token_here
```

### 2. Getting Shopify API Credentials

1. **Go to your Shopify Admin Dashboard**
2. **Navigate to Apps → Develop apps**
3. **Create a new app** or select an existing one
4. **Configure Admin API access scopes**:
   - `read_products` (required)
   - `read_orders` (required)  
   - `read_shop` (required)
   - `read_customers` (optional)
   - `read_inventory` (optional)
5. **Install the app** and copy the Admin API access token
6. **Add credentials to `.env.local`**

## How to Use

### Creating a Shopify Node

1. Click the **+ Add Node** button in the toolbar
2. Select **Shopify Store** from the dropdown
3. A new Shopify node will appear on the canvas

### Configuring the Shopify Node

**Option 1: Use Environment Variables (Recommended)**
- Check "Use Environment Settings" 
- Click "Fetch Data"

**Option 2: Manual Configuration**
- Uncheck "Use Environment Settings"
- Enter your Shopify store URL (e.g., `mystore.myshopify.com`)
- Enter your Admin API access token
- Click "Fetch Data"

### Data Retrieved

The Shopify node fetches:
- **Shop Information**: Name, domain, email, currency, timezone, plan
- **Products Summary**: Total count and recent 5 products
- **Orders Summary**: Total count and recent 5 orders

### Connecting to AI Node

1. **Create an AI Node** (if you don't have one)
2. **Connect Shopify to AI**: Drag from the Shopify node's output handle (right side) to the AI node's input handle (left side)
3. **Run AI Analysis**: Click any action button in the AI node (Analyze, etc.)

The AI will receive formatted Shopify data including:
```
[Shopify Store Data]

Store Information:
- Name: My Store
- Domain: mystore.myshopify.com
- Email: contact@mystore.com
- Currency: USD
- Timezone: America/New_York
- Plan: Shopify
- Created: 1/15/2023

Products Overview:
- Total Products: 150
- Recent Products:
  • Premium T-Shirt (MyBrand) - active
  • Coffee Mug Set (MyBrand) - active

Orders Overview:
- Total Orders: 2,847
- Recent Orders:
  • #1002: $45.99 USD - paid
  • #1001: $23.50 USD - paid
```

## Example AI Analysis Prompts

Once connected, you can ask the AI to analyze your Shopify data:

- **"Analyze my store's recent performance"**
- **"What insights can you provide about my product mix?"**
- **"Compare my recent orders and suggest improvements"**
- **"Identify trends in my store data"**
- **"Create a business summary based on my Shopify metrics"**

## API Security

- ✅ API keys are stored securely in environment variables
- ✅ Never exposed to the frontend
- ✅ Server-side API calls only
- ✅ Proper error handling for rate limits and API failures

## Troubleshooting

### Common Issues

**"Failed to fetch shop info: 401"**
- Check your API access token
- Ensure the token has required scopes (read_products, read_orders, read_shop)

**"Shopify store URL and API key are required"**
- Verify `.env.local` file exists and has correct variable names
- Restart your development server after adding environment variables

**Rate Limiting**
- Shopify has API rate limits (40 requests/second for Plus stores, 20/second for others)
- The system will show appropriate error messages when limits are reached

### Debug Steps

1. **Check Environment Variables**: Ensure `.env.local` is configured correctly
2. **Verify API Scopes**: Make sure your Shopify app has the required permissions
3. **Test API Manually**: Try making a request to your Shopify Admin API directly
4. **Check Browser Console**: Look for detailed error messages in the developer console

## Files Created

- `pages/api/shopify.ts` - Backend API route for Shopify integration
- `components/node-types/ShopifyNode.tsx` - Shopify node React component
- Updated `components/node-types/AINode.tsx` - Enhanced to consume Shopify data
- Updated `components/node-types/interfaces.ts` - Added ShopifyNodeData type
- Updated `src/app/ReactFlowCanvas.tsx` - Added Shopify node to toolbar
- `.env.example` - Environment variable template

## Next Steps

1. **Set up your Shopify credentials** in `.env.local`
2. **Add a Shopify node** to your canvas
3. **Fetch your store data**
4. **Connect to an AI node** for analysis
5. **Experiment with different AI prompts** to get insights about your store

The Shopify integration is now fully functional and ready to provide AI-powered insights into your e-commerce business! 🚀