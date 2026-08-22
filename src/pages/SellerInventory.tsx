import React, { useEffect, useState } from 'react';
import { RefreshCw, PackageOpen, Check, Save } from 'lucide-react';
import { dbService } from '../services/db';
import { Product } from '../data/mockProducts';
import { useApp } from '../context/AppContext';

interface StockState {
  [productId: string]: number;
}

export const SellerInventory: React.FC = () => {
  const { user, addToast } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [productSales, setProductSales] = useState<{ [productId: string]: number }>({});
  const [loading, setLoading] = useState(true);

  // Local state for stock inputs
  const [stockInputs, setStockInputs] = useState<StockState>({});
  const [isUpdating, setIsUpdating] = useState<{ [productId: string]: boolean }>({});

  const sellerId = user?.seller_id || 'seller-5';

  const fetchInventoryData = async () => {
    setLoading(true);
    try {
      const allProducts = await dbService.getProducts();
      const allOrders = await dbService.getOrders();

      const sProducts = allProducts.filter(p => p.seller_id === sellerId);
      setProducts(sProducts);

      // Pre-populate stock inputs
      const initialInputs: StockState = {};
      sProducts.forEach(p => {
        initialInputs[p.id] = p.stock;
      });
      setStockInputs(initialInputs);

      // Calculate sales per product
      const salesMap: { [productId: string]: number } = {};
      sProducts.forEach(p => {
        salesMap[p.id] = 0;
      });

      allOrders.forEach(order => {
        if (order.status !== 'cancelled') {
          order.items.forEach(item => {
            if (item.seller_id === sellerId && salesMap[item.product_id] !== undefined) {
              salesMap[item.product_id] += item.quantity;
            }
          });
        }
      });

      setProductSales(salesMap);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventoryData();
  }, [user]);

  const handleStockInputChange = (productId: string, val: number) => {
    if (val < 0) return;
    setStockInputs(prev => ({ ...prev, [productId]: val }));
  };

  const handleIncrement = (productId: string) => {
    setStockInputs(prev => ({ ...prev, [productId]: (prev[productId] || 0) + 1 }));
  };

  const handleDecrement = (productId: string) => {
    setStockInputs(prev => ({
      ...prev,
      [productId]: Math.max(0, (prev[productId] || 0) - 1)
    }));
  };

  const handleSaveStock = async (product: Product) => {
    const newStock = stockInputs[product.id];
    if (newStock === undefined || newStock < 0) {
      addToast("Invalid stock value", "error");
      return;
    }

    setIsUpdating(prev => ({ ...prev, [product.id]: true }));
    try {
      const updatedProduct = {
        ...product,
        stock: newStock
      };
      await dbService.saveProduct(updatedProduct);
      addToast(`Inventory for ${product.name} updated to ${newStock} units`, 'success');
      fetchInventoryData();
    } catch (e) {
      addToast("Failed to save inventory", "error");
    } finally {
      setIsUpdating(prev => ({ ...prev, [product.id]: false }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse py-4">
        <div className="h-8 bg-onam-cream-dark rounded w-1/4" />
        <div className="h-48 bg-white border border-onam-gold/15 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between border-b border-onam-gold/20 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-onam-green">Inventory Control</h2>
          <p className="text-sm text-onam-charcoal/60 font-light mt-1">
            Review stock levels, total unit sales, and quick update stock values
          </p>
        </div>
        
        <button
          onClick={fetchInventoryData}
          className="p-2.5 bg-white hover:bg-onam-cream-dark/50 text-onam-green hover:text-onam-gold rounded-xl border border-onam-gold/25 transition-colors cursor-pointer"
          title="Refresh Inventory"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Inventory Table Grid */}
      {products.length === 0 ? (
        <div className="bg-white border border-onam-gold/20 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <span className="text-5xl block">📊</span>
          <h3 className="font-serif font-bold text-xl text-onam-green">No Stock Items</h3>
          <p className="text-sm text-onam-charcoal/60 font-sans leading-relaxed">
            You don't have any listings in your store. Add products in the Product Manager first.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-onam-gold/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-onam-cream-dark/40 text-onam-green border-b border-onam-gold/20 font-bold">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Total Units Sold</th>
                  <th className="px-6 py-4">Stock Status</th>
                  <th className="px-6 py-4 text-center">Adjust Stock Level</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-onam-gold/10">
                {products.map((product) => {
                  const sales = productSales[product.id] || 0;
                  const currentInputStock = stockInputs[product.id] ?? product.stock;
                  
                  // Status helper
                  const getStockBadge = (stockVal: number) => {
                    if (stockVal === 0) {
                      return <span className="bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Out of Stock</span>;
                    }
                    if (stockVal <= 10) {
                      return <span className="bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">Low Stock</span>;
                    }
                    return <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">In Stock</span>;
                  };

                  return (
                    <tr key={product.id} className="hover:bg-onam-cream-dark/10 transition-colors">
                      
                      {/* Image */}
                      <td className="px-6 py-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-11 h-11 object-cover rounded-lg border border-onam-gold/15 bg-onam-cream-dark/10"
                        />
                      </td>

                      {/* Title */}
                      <td className="px-6 py-4 font-semibold text-onam-green text-sm max-w-xs truncate">
                        {product.name}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 font-medium text-onam-charcoal/70">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold text-onam-green text-sm">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>

                      {/* Total Sales */}
                      <td className="px-6 py-4 font-bold text-onam-green flex items-center gap-1.5 pt-7">
                        <PackageOpen className="w-4 h-4 text-onam-gold-dark" />
                        {sales} units
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        {getStockBadge(product.stock)}
                      </td>

                      {/* Stock Adjuster */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5 max-w-[130px] mx-auto border border-onam-gold/30 rounded-xl bg-onam-cream px-1">
                          <button
                            onClick={() => handleDecrement(product.id)}
                            className="px-2 py-1 text-onam-green hover:bg-onam-cream-dark rounded-l-lg font-bold transition-colors"
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={currentInputStock}
                            onChange={(e) => handleStockInputChange(product.id, Number(e.target.value))}
                            className="w-12 text-center text-xs font-bold text-onam-green bg-transparent border-none outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                          <button
                            onClick={() => handleIncrement(product.id)}
                            className="px-2 py-1 text-onam-green hover:bg-onam-cream-dark rounded-r-lg font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Save stock */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSaveStock(product)}
                          disabled={isUpdating[product.id] || currentInputStock === product.stock}
                          className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1 mx-auto cursor-pointer border ${
                            currentInputStock !== product.stock
                              ? 'bg-onam-gold text-onam-green border-onam-gold-dark hover:scale-105 shadow-sm'
                              : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                          }`}
                        >
                          {isUpdating[product.id] ? (
                            <span>...</span>
                          ) : (
                            <>
                              <Save className="w-3.5 h-3.5" />
                              Save
                            </>
                          )}
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
export default SellerInventory;
