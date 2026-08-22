import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ShieldAlert, Sparkles } from 'lucide-react';
import { dbService } from '../services/db';
import { Product, CATEGORIES } from '../data/mockProducts';
import { useApp } from '../context/AppContext';
import { Modal } from '../components/Modal';

export const SellerProducts: React.FC = () => {
  const { user, addToast } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form Fields State
  const [formFields, setFormFields] = useState({
    name: '',
    category: CATEGORIES[0],
    description: '',
    price: 0,
    stock: 0,
    image_url: ''
  });

  const sellerId = user?.seller_id || 'seller-5';
  const sellerName = user?.name || 'Malabar Crunch Snacks';

  const fetchSellerProducts = async () => {
    // 1. Try to load products from cache instantly
    const cached = localStorage.getItem('onam_products_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Product[];
        const filtered = parsed.filter(p => p.seller_id === sellerId);
        setProducts(filtered);
        setLoading(false);
      } catch (e) {}
    } else {
      setLoading(true);
    }

    // 2. Fetch fresh products from Supabase
    try {
      const all = await dbService.getProducts();
      const filtered = all.filter(p => p.seller_id === sellerId);
      setProducts(filtered);
      
      // Update cache
      localStorage.setItem('onam_products_cache', JSON.stringify(all));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, [user]);

  const handleOpenAddModal = () => {
    setSelectedProduct(null);
    setFormFields({
      name: '',
      category: CATEGORIES[0],
      description: '',
      price: 250,
      stock: 10,
      image_url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=600&q=80'
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setFormFields({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      stock: product.stock,
      image_url: product.image_url
    });
    setIsFormModalOpen(true);
  };

  const handleOpenDeleteModal = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleToggleActive = async (product: Product) => {
    try {
      const updatedProduct = {
        ...product,
        is_active: !product.is_active
      };
      await dbService.saveProduct(updatedProduct);
      addToast(`${product.name} is now ${updatedProduct.is_active ? 'Active' : 'Inactive'}`, 'info');
      fetchSellerProducts();
    } catch (e) {
      addToast("Failed to update product status", "error");
    }
  };

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? Number(value) : value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (!formFields.name || !formFields.description || !formFields.image_url) {
      addToast("Please fill in all fields", "error");
      return;
    }
    if (formFields.price <= 0) {
      addToast("Price must be greater than zero", "error");
      return;
    }
    if (formFields.stock < 0) {
      addToast("Stock cannot be negative", "error");
      return;
    }

    try {
      const productPayload: Omit<Product, 'id' | 'created_at'> & { id?: string } = {
        id: selectedProduct?.id,
        name: formFields.name,
        category: formFields.category,
        description: formFields.description,
        price: formFields.price,
        stock: formFields.stock,
        image_url: formFields.image_url,
        seller_id: sellerId,
        seller_name: sellerName,
        is_active: selectedProduct ? selectedProduct.is_active : true,
        rating: selectedProduct ? selectedProduct.rating : 5.0,
        reviews_count: selectedProduct ? selectedProduct.reviews_count : 0
      };

      await dbService.saveProduct(productPayload);
      addToast(selectedProduct ? "Product updated successfully!" : "New product added!", "success");
      setIsFormModalOpen(false);
      fetchSellerProducts();
    } catch (err) {
      console.error(err);
      addToast("Failed to save product", "error");
    }
  };

  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    try {
      await dbService.deleteProduct(selectedProduct.id);
      addToast("Product deleted successfully", "success");
      setIsDeleteModalOpen(false);
      fetchSellerProducts();
    } catch (e) {
      addToast("Failed to delete product", "error");
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
      
      {/* Header with Add Product */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-onam-gold/20 pb-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-onam-green">Manage Products</h2>
          <p className="text-sm text-onam-charcoal/60 font-light mt-1">
            Maintain catalog listings, pricing, and active statuses
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="bg-onam-green hover:bg-onam-green-light text-onam-cream font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer self-end sm:self-auto"
        >
          <Plus className="w-4 h-4 text-onam-gold" />
          Add Product
        </button>
      </div>

      {/* Product List Table */}
      {products.length === 0 ? (
        <div className="bg-white border border-onam-gold/20 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4 shadow-sm">
          <span className="text-5xl block">🌱</span>
          <h3 className="font-serif font-bold text-xl text-onam-green">No Listings Found</h3>
          <p className="text-sm text-onam-charcoal/60 font-sans leading-relaxed">
            You haven't listed any products yet. Click "Add Product" above to list your first traditional Onam item.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-onam-gold/20 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans border-collapse">
              <thead>
                <tr className="bg-onam-cream-dark/40 text-onam-green border-b border-onam-gold/20 font-bold">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-onam-gold/10">
                {products.map((product) => {
                  const isOutOfStock = product.stock === 0;
                  const isLowStock = product.stock > 0 && product.stock <= 5;
                  
                  return (
                    <tr key={product.id} className="hover:bg-onam-cream-dark/10 transition-colors">
                      {/* Product Thumbnail */}
                      <td className="px-6 py-4">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-onam-gold/15 bg-onam-cream-dark/10 shrink-0"
                        />
                      </td>

                      {/* Product Name */}
                      <td className="px-6 py-4 font-semibold text-onam-green text-sm max-w-xs truncate">
                        {product.name}
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4 font-medium text-onam-charcoal/80">
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="px-6 py-4 font-bold text-onam-green text-sm">
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>

                      {/* Stock indicator */}
                      <td className="px-6 py-4">
                        {isOutOfStock ? (
                          <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 uppercase">Out of Stock</span>
                        ) : isLowStock ? (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 uppercase">Low: {product.stock} units</span>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 uppercase">{product.stock} in stock</span>
                        )}
                      </td>

                      {/* Toggle status */}
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer border ${
                            product.is_active
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                          }`}
                        >
                          {product.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-2 text-onam-green hover:bg-onam-cream-dark/50 rounded-xl transition-colors border border-onam-gold/20"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => handleOpenDeleteModal(product)}
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-rose-100"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRUD Add/Edit Product Modal Form */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={selectedProduct ? "Edit Product Details" : "Add New Festive Product"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 font-sans text-xs">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Product Name</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Kasavu Border Cotton Mundu"
              value={formFields.name}
              onChange={handleFormInputChange}
              className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Category</label>
            <select
              name="category"
              value={formFields.category}
              onChange={handleFormInputChange}
              className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green outline-none"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Description Details</label>
            <textarea
              name="description"
              required
              rows={3}
              placeholder="Describe craftsmanship, thread count, materials used, etc."
              value={formFields.description}
              onChange={handleFormInputChange}
              className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green resize-none"
            />
          </div>

          {/* Price & Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Price (₹)</label>
              <input
                type="number"
                name="price"
                required
                min={1}
                placeholder="₹"
                value={formFields.price}
                onChange={handleFormInputChange}
                className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
              />
            </div>
            
            <div className="space-y-1.5">
              <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                required
                min={0}
                placeholder="Qty"
                value={formFields.stock}
                onChange={handleFormInputChange}
                className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
              />
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-onam-charcoal/70 uppercase tracking-wide block font-bold">Product Image URL</label>
            <input
              type="text"
              name="image_url"
              required
              placeholder="https://images.unsplash.com/..."
              value={formFields.image_url}
              onChange={handleFormInputChange}
              className="w-full bg-onam-cream-dark/30 px-3.5 py-2.5 rounded-xl border border-onam-gold/25 focus:outline-none focus:ring-1 focus:ring-onam-green"
            />
          </div>

          {/* Read-only details */}
          <div className="p-3 bg-onam-cream-dark/30 border border-onam-gold/15 rounded-xl flex items-center justify-between text-[10px] text-onam-charcoal/60">
            <span>Listing Owner: <strong className="text-onam-green">{sellerName}</strong></span>
            <span>Seller ID: <strong className="text-onam-green">{sellerId}</strong></span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 border border-onam-gold/40 text-onam-green rounded-xl text-xs font-bold font-sans cursor-pointer hover:bg-onam-cream-dark/20"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-onam-green hover:bg-onam-green-light text-onam-cream rounded-xl text-xs font-bold font-sans flex items-center gap-1 cursor-pointer shadow"
            >
              <Sparkles className="w-3.5 h-3.5 text-onam-gold" />
              {selectedProduct ? 'Save Changes' : 'Publish Listing'}
            </button>
          </div>

        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete Listing"
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="flex gap-3 text-rose-700 bg-rose-50 border border-rose-100 p-3.5 rounded-xl leading-relaxed">
            <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600" />
            <span>
              Are you sure you want to permanently delete **{selectedProduct?.name}**? This will remove the item from the customer storefront and cannot be undone.
            </span>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 border border-onam-gold/40 text-onam-green rounded-xl text-xs font-bold cursor-pointer hover:bg-onam-cream-dark/20"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProduct}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
};
export default SellerProducts;
