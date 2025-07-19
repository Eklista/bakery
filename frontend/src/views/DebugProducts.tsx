// src/views/DebugProducts.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { directusService } from '../services/directusService';
import { groqTranslator } from '../services/groqTranslator';
import { useCart } from '../contexts/CartContext';
import type { DirectusProduct } from '../services/directusService';
import type { ProductCardData } from '../components/products/ProductCard';

export const DebugProducts: React.FC = () => {
  const { i18n } = useTranslation();
  const { addItem } = useCart();
  
  // Estados
  const [allProducts, setAllProducts] = useState<ProductCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [debugMode] = useState(true);

  // Filtros
  const filteredProducts = useMemo(() => {
    console.log('🔍 [DEBUG] Filtering products...', {
      allProductsLength: allProducts.length,
      searchTerm,
      selectedCategory,
      allProducts: allProducts.map(p => ({ id: p.id, title: p.title, category: p.category }))
    });

    if (allProducts.length === 0) {
      console.log('⚠️ [DEBUG] No products to filter');
      return [];
    }

    let filtered = [...allProducts];

    // Filtrar por categoría
    if (selectedCategory !== null) {
      filtered = filtered.filter(product => {
        const matches = Number(product.category) === Number(selectedCategory);
        console.log(`📂 [DEBUG] Product ${product.id} category ${product.category} vs ${selectedCategory} = ${matches}`);
        return matches;
      });
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      filtered = filtered.filter(product => {
        const matches = product.title.toLowerCase().includes(searchTerm.toLowerCase());
        console.log(`🔎 [DEBUG] Product ${product.id} title "${product.title}" vs "${searchTerm}" = ${matches}`);
        return matches;
      });
    }

    console.log('✅ [DEBUG] Final filtered products:', filtered.length, filtered);
    return filtered;
  }, [allProducts, selectedCategory, searchTerm]);

  // Localizar productos
  const localizeProducts = useCallback(async (rawProducts: DirectusProduct[]) => {
    console.log('🌐 [DEBUG] Localizing products:', rawProducts);
    
    if (i18n.language === 'es') {
      const localizedProducts: ProductCardData[] = rawProducts.map(product => ({
        id: product.id,
        title: product.title,
        description: product.description || 'Producto de prueba',
        price: directusService.formatPrice(product.price),
        image: directusService.getImageUrl(product.image),
        slug: product.slug,
        stock: product.stock,
        category: product.category ? Number(product.category) : undefined,
        featured: false
      }));
      
      console.log('📦 [DEBUG] Spanish products mapped:', localizedProducts);
      setAllProducts(localizedProducts);
      return;
    }

    // Inglés - traducir
    try {
      const localizedProducts = await Promise.all(
        rawProducts.map(async (product) => {
          const translatedTitle = await groqTranslator.translate(product.title, 'es', 'en');
          const translatedDesc = await groqTranslator.translate(product.description || 'Producto de prueba', 'es', 'en');

          return {
            id: product.id,
            title: translatedTitle,
            description: translatedDesc,
            price: directusService.formatPrice(product.price),
            image: directusService.getImageUrl(product.image),
            slug: product.slug,
            stock: product.stock,
            category: product.category ? Number(product.category) : undefined,
            featured: false
          };
        })
      );
      
      console.log('📦 [DEBUG] English products mapped:', localizedProducts);
      setAllProducts(localizedProducts);
    } catch (err) {
      console.error('❌ [DEBUG] Translation failed:', err);
      setError('Translation failed');
    }
  }, [i18n.language]);

  // Fetch products
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📦 [DEBUG] Starting fetch...');

      const rawProducts = await directusService.fetchAllProducts();
      console.log('📦 [DEBUG] Raw products from Directus:', rawProducts);
      
      if (rawProducts.length === 0) {
        console.log('⚠️ [DEBUG] No products found');
        setError('No products found');
        return;
      }

      await localizeProducts(rawProducts);
      console.log('✅ [DEBUG] Products localized successfully');
      
    } catch (err) {
      console.error('❌ [DEBUG] Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [localizeProducts]);

  // Effect
  useEffect(() => {
    console.log('🚀 [DEBUG] Component mounted');
    fetchProducts();
  }, [fetchProducts]);

  // Test handlers
  const addTestProduct = () => {
    const testProduct: ProductCardData = {
      id: 999,
      title: 'Test Product',
      description: 'This is a test product',
      price: 25.00,
      image: '/cookies.webp',
      slug: 'test-product',
      stock: 10,
      category: 1,
      featured: false
    };
    
    console.log('🧪 [DEBUG] Adding test product:', testProduct);
    setAllProducts(prev => [...prev, testProduct]);
  };

  const clearProducts = () => {
    console.log('🧹 [DEBUG] Clearing all products');
    setAllProducts([]);
  };

  if (loading) {
    return (
      <div className="pt-20 p-8">
        <h1 className="text-3xl font-bold mb-4">🔍 DEBUG MODE - Loading...</h1>
        <div className="bg-yellow-100 p-4 rounded">
          <p>Loading products from Directus...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 p-8">
        <h1 className="text-3xl font-bold mb-4">🔍 DEBUG MODE - Error</h1>
        <div className="bg-red-100 p-4 rounded">
          <p>Error: {error}</p>
          <button 
            onClick={fetchProducts}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 p-8">
      <h1 className="text-3xl font-bold mb-4">🔍 DEBUG MODE - Products</h1>
      
      {/* Debug Controls */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h2 className="text-xl font-bold mb-4">Debug Controls</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <button 
            onClick={addTestProduct}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Test Product
          </button>
          
          <button 
            onClick={clearProducts}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Clear Products
          </button>
          
          <button 
            onClick={fetchProducts}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Refetch Products
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Search:</label>
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Search products..."
            />
          </div>
          
          <div>
            <label className="block mb-2">Category:</label>
            <select 
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="1">Category 1</option>
              <option value="6">Category 6</option>
            </select>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-blue-100 p-4 rounded mb-6">
        <h2 className="text-xl font-bold mb-4">Debug Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong>All Products:</strong> {allProducts.length}
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(allProducts.map(p => ({ id: p.id, title: p.title, category: p.category })), null, 2)}
            </pre>
          </div>
          
          <div>
            <strong>Filtered Products:</strong> {filteredProducts.length}
            <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-32">
              {JSON.stringify(filteredProducts.map(p => ({ id: p.id, title: p.title, category: p.category })), null, 2)}
            </pre>
          </div>
          
          <div>
            <strong>Filters:</strong>
            <ul className="mt-2 text-xs">
              <li>Search: "{searchTerm}"</li>
              <li>Category: {selectedCategory || 'null'}</li>
              <li>Language: {i18n.language}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Products Render Test</h2>
        
        {filteredProducts.length === 0 ? (
          <div className="bg-yellow-100 p-4 rounded">
            <p>No products to display</p>
            <p>All products: {allProducts.length}</p>
            <p>Filtered: {filteredProducts.length}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProducts.map((product, index) => (
              <div key={product.id} className="border p-4 rounded bg-white">
                <div className="text-sm text-gray-500">Index: {index} | ID: {product.id}</div>
                <h3 className="font-bold">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
                <p className="text-green-600 font-bold">${product.price}</p>
                <p className="text-xs">Category: {product.category}</p>
                <p className="text-xs">Stock: {product.stock}</p>
                
                <button 
                  onClick={() => {
                    console.log('🛒 [DEBUG] Adding to cart:', product);
                    addItem({
                      id: product.id,
                      title: product.title,
                      price: product.price,
                      image: product.image
                    });
                  }}
                  className="mt-2 bg-amber-500 text-white px-3 py-1 rounded text-sm"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raw Data */}
      {debugMode && (
        <div className="bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-bold mb-4">Raw Data</h2>
          <div className="text-xs">
            <details>
              <summary>All Products Raw Data</summary>
              <pre className="mt-2 bg-white p-2 rounded overflow-auto max-h-64">
                {JSON.stringify(allProducts, null, 2)}
              </pre>
            </details>
            
            <details className="mt-4">
              <summary>Filtered Products Raw Data</summary>
              <pre className="mt-2 bg-white p-2 rounded overflow-auto max-h-64">
                {JSON.stringify(filteredProducts, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};