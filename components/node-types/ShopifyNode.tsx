import React, { useState, useRef } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { ShoppingBag, ExternalLink, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { BaseNodeProps, sizeConfig, ShopifyNodeData } from './interfaces';
import { useNodeActions } from './useNodeActions';
import { useAppStore } from '../../store/useAppStore';
import { recalculateKPIs } from '../../lib/api-utils';

const ShopifyNode: React.FC<BaseNodeProps<ShopifyNodeData>> = ({ id, data, selected }) => {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLTextAreaElement>(null);
  const [storeUrl, setStoreUrl] = useState(data.storeUrl || '');
  const [apiKey, setApiKey] = useState('');
  const [useDefault, setUseDefault] = useState(false);

  const { addAlert } = useAppStore();
  const {
    updateNode,
    deleteNode,
    handleTitleEdit,
    handleDescEdit,
    handleSizeChange,
  } = useNodeActions(id, data);

  const currentSize = data.size || 'medium';
  const currentWidth = data.width || sizeConfig[currentSize as keyof typeof sizeConfig].width;
  const currentHeight = data.height || sizeConfig[currentSize as keyof typeof sizeConfig].height;

  React.useEffect(() => {
    if (data.isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
    if (data.isEditingDesc && descInputRef.current) {
      descInputRef.current.focus();
      descInputRef.current.select();
    }
  }, [data.isEditingTitle, data.isEditingDesc]);

  const handleTitleSubmit = (value: string) => {
    updateNode({ title: value, isEditingTitle: false });
  };

  const handleDescSubmit = (value: string) => {
    updateNode({ description: value, isEditingDesc: false });
  };

  const handleFetchData = async () => {
    if (!useDefault && !storeUrl.trim()) {
      addAlert?.('Please enter a Shopify store URL or use default settings', 'warning');
      return;
    }

    if (!useDefault && !apiKey.trim()) {
      addAlert?.('Please enter an API key or use default settings', 'warning');
      return;
    }

    updateNode({ fetchStatus: 'loading', errorMessage: undefined });

    try {
      const response = await fetch('/api/shopify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          storeUrl: useDefault ? undefined : storeUrl,
          apiKey: useDefault ? undefined : apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || `API request failed with status ${response.status}`);
      }

      // Update node with fetched data
      updateNode({ 
        shopData: data,
        storeUrl: useDefault ? undefined : storeUrl,
        fetchStatus: 'success',
        errorMessage: undefined
      });

      addAlert?.(`Successfully fetched data from ${data.shop?.name || 'Shopify store'}`, 'info');

      // Recalculate KPIs in background
      recalculateKPIs().catch(console.error);

    } catch (error) {
      console.error('Shopify fetch error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch Shopify data';
      
      updateNode({ 
        fetchStatus: 'error',
        errorMessage
      });

      addAlert?.(errorMessage, 'danger');
    }
  };

  const handleUseDefault = () => {
    setUseDefault(!useDefault);
    if (!useDefault) {
      setStoreUrl('');
      setApiKey('');
    }
  };

  const formatCurrency = (amount: string, currency: string) => {
    try {
      const num = parseFloat(amount);
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'USD',
      }).format(num);
    } catch {
      return `${amount} ${currency}`;
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <NodeResizer
        color="#8B5CF6"
        isVisible={selected}
        minWidth={280}
        minHeight={320}
        onResize={(event, { width, height }) => {
          updateNode({ width, height });
        }}
      />
      
      <Card 
        className="bg-white shadow-lg border-2 border-purple-200 hover:border-purple-400 transition-colors"
        style={{ width: currentWidth, height: currentHeight }}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-2">
            <ShoppingBag className="w-5 h-5 text-purple-600" />
            {data.isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                defaultValue={data.title}
                className="flex-1 text-sm font-semibold bg-transparent border-none outline-none"
                onBlur={(e) => handleTitleSubmit(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  } else if (e.key === 'Escape') {
                    updateNode({ isEditingTitle: false });
                  }
                }}
              />
            ) : (
              <h3 
                className="flex-1 text-sm font-semibold cursor-pointer hover:text-purple-600"
                onClick={handleTitleEdit}
              >
                {data.title}
              </h3>
            )}
            <div className="flex items-center gap-1">
              {data.fetchStatus === 'success' && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
              {data.fetchStatus === 'error' && (
                <AlertCircle className="w-4 h-4 text-red-500" />
              )}
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-6 w-6"
                onClick={deleteNode}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          {data.isEditingDesc ? (
            <textarea
              ref={descInputRef}
              defaultValue={data.description}
              className="w-full text-xs text-gray-600 bg-transparent border-none outline-none resize-none"
              rows={2}
              onBlur={(e) => handleDescSubmit(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  updateNode({ isEditingDesc: false });
                }
              }}
            />
          ) : (
            <p 
              className="text-xs text-gray-600 cursor-pointer hover:text-gray-800"
              onClick={handleDescEdit}
            >
              {data.description}
            </p>
          )}
        </CardHeader>

        <CardContent className="py-2 px-4 space-y-3">
          {/* Configuration Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`use-default-${id}`}
                checked={useDefault}
                onChange={handleUseDefault}
                className="w-3 h-3"
              />
              <label htmlFor={`use-default-${id}`} className="text-xs text-gray-600">
                Use Environment Settings
              </label>
            </div>
            
            {!useDefault && (
              <>
                <input
                  type="text"
                  placeholder="Store URL (e.g., mystore.myshopify.com)"
                  value={storeUrl}
                  onChange={(e) => setStoreUrl(e.target.value)}
                  className="w-full text-xs p-2 border rounded"
                  disabled={data.fetchStatus === 'loading'}
                />
                <input
                  type="password"
                  placeholder="API Access Token"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full text-xs p-2 border rounded"
                  disabled={data.fetchStatus === 'loading'}
                />
              </>
            )}

            <Button
              onClick={handleFetchData}
              disabled={data.fetchStatus === 'loading'}
              className="w-full text-xs h-7"
              size="sm"
            >
              {data.fetchStatus === 'loading' ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Fetching...
                </>
              ) : (
                'Fetch Data'
              )}
            </Button>
          </div>

          {/* Error Display */}
          {data.fetchStatus === 'error' && data.errorMessage && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
              {data.errorMessage}
            </div>
          )}

          {/* Data Preview Section */}
          {data.shopData && data.fetchStatus === 'success' && (
            <div className="space-y-2 text-xs">
              {/* Shop Info */}
              {data.shopData.shop && (
                <div className="bg-purple-50 p-2 rounded">
                  <div className="font-medium text-purple-800 mb-1">
                    {data.shopData.shop.name}
                  </div>
                  <div className="text-purple-600">
                    {data.shopData.shop.domain} • {data.shopData.shop.currency}
                  </div>
                  <div className="text-purple-600">
                    Plan: {data.shopData.shop.plan_name}
                  </div>
                </div>
              )}

              {/* Products Summary */}
              {data.shopData.products && (
                <div className="bg-blue-50 p-2 rounded">
                  <div className="font-medium text-blue-800 mb-1">
                    Products: {data.shopData.products.count}
                  </div>
                  {data.shopData.products.recent.slice(0, 2).map(product => (
                    <div key={product.id} className="text-blue-600 truncate">
                      • {product.title}
                    </div>
                  ))}
                  {data.shopData.products.recent.length > 2 && (
                    <div className="text-blue-500">
                      +{data.shopData.products.recent.length - 2} more...
                    </div>
                  )}
                </div>
              )}

              {/* Orders Summary */}
              {data.shopData.orders && (
                <div className="bg-green-50 p-2 rounded">
                  <div className="font-medium text-green-800 mb-1">
                    Orders: {data.shopData.orders.count}
                  </div>
                  {data.shopData.orders.recent.slice(0, 2).map(order => (
                    <div key={order.id} className="text-green-600">
                      • {order.name}: {formatCurrency(order.total_price, order.currency)}
                    </div>
                  ))}
                  {data.shopData.orders.recent.length > 2 && (
                    <div className="text-green-500">
                      +{data.shopData.orders.recent.length - 2} more...
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>

        {/* Output Handle */}
        <Handle
          type="source"
          position={Position.Right}
          id="shopify-data"
          className="w-3 h-3 bg-purple-500 border-2 border-white"
        />
      </Card>
    </>
  );
};

export default ShopifyNode;