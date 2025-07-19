// src/services/directusService.ts
const API_BASE_URL = import.meta.env.VITE_DIRECTUS_API_URL || 'https://api.thedojolab.com';

export interface DirectusProduct {
  id: number;
  status: string;
  title: string;
  slug: string;
  description: string | null;
  price: string;
  stock: number;
  image: string | null;
  category: number;
}

export interface DirectusFeaturedProduct {
  id: number;
  status: string;
  product: DirectusProduct;
}

export interface DirectusCategory {
  id: number;
  status: string;
  name: string;
  slug: string;
  icon: string | null;
}

export interface DirectusCategoryWithCount extends DirectusCategory {
  product_count: number;
}

class DirectusService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async fetchFeaturedProducts(): Promise<DirectusProduct[]> {
    try {
      console.log('🔄 Fetching featured products from Directus...');
      
      const response = await fetch(`${this.baseUrl}/items/featured_products?fields=*,product.*`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Featured products fetched:', data);

      const featuredProducts = data.data
        .filter((item: DirectusFeaturedProduct) => 
          (item.status === 'published' || item.status === 'draft') && 
          item.product && 
          (item.product.status === 'published' || item.product.status === 'draft')
        )
        .map((item: DirectusFeaturedProduct) => item.product);

      console.log('📦 Processed featured products:', featuredProducts);
      return featuredProducts;

    } catch (error) {
      console.error('❌ Error fetching featured products:', error);
      throw error;
    }
  }

  async fetchAllProducts(): Promise<DirectusProduct[]> {
    try {
      console.log('🔄 Fetching all products from Directus...');
      
      const response = await fetch(`${this.baseUrl}/items/products?filter[status][_in]=published,draft`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ All products fetched:', data);
      
      return data.data;

    } catch (error) {
      console.error('❌ Error fetching products:', error);
      throw error;
    }
  }

  async fetchCategories(): Promise<DirectusCategory[]> {
    try {
      console.log('🔄 Fetching categories from Directus...');
      
      const response = await fetch(`${this.baseUrl}/items/category?filter[status][_eq]=published`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Categories fetched:', data);
      
      return data.data;

    } catch (error) {
      console.error('❌ Error fetching categories:', error);
      throw error;
    }
  }

  async fetchCategoriesWithProducts(): Promise<DirectusCategoryWithCount[]> {
    try {
      console.log('🔄 Fetching categories with product counts...');
      
      // Obtener todas las categorías publicadas
      const [categoriesResponse, productsResponse] = await Promise.all([
        fetch(`${this.baseUrl}/items/category?filter[status][_eq]=published`),
        fetch(`${this.baseUrl}/items/products?filter[status][_in]=published,draft&fields=id,category`)
      ]);

      if (!categoriesResponse.ok || !productsResponse.ok) {
        throw new Error('Failed to fetch categories or products');
      }

      const [categoriesData, productsData] = await Promise.all([
        categoriesResponse.json(),
        productsResponse.json()
      ]);

      const categories: DirectusCategory[] = categoriesData.data;
      const products: DirectusProduct[] = productsData.data;

      // Contar productos por categoría
      const productCountByCategory = products.reduce((acc, product) => {
        const categoryId = product.category;
        acc[categoryId] = (acc[categoryId] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      // Agregar conteo a categorías y filtrar las que tienen productos
      const categoriesWithProducts = categories
        .map(category => ({
          ...category,
          product_count: productCountByCategory[category.id] || 0
        }))
        .filter(category => category.product_count > 0)
        .sort((a, b) => a.name.localeCompare(b.name));

      console.log('✅ Categories with products:', categoriesWithProducts);
      console.log('📊 Product count summary:', productCountByCategory);
      
      return categoriesWithProducts;

    } catch (error) {
      console.error('❌ Error fetching categories with products:', error);
      throw error;
    }
  }

  async fetchProductsByCategory(categoryId: number): Promise<DirectusProduct[]> {
    try {
      console.log(`🔄 Fetching products for category ${categoryId}...`);
      
      const response = await fetch(
        `${this.baseUrl}/items/products?filter[category][_eq]=${categoryId}&filter[status][_in]=published,draft`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`✅ Products for category ${categoryId}:`, data.data);
      
      return data.data;

    } catch (error) {
      console.error(`❌ Error fetching products for category ${categoryId}:`, error);
      throw error;
    }
  }

  formatPrice(price: string): number {
    return parseFloat(price);
  }

  getImageUrl(imageId: string | null): string {
    if (!imageId) {
      console.log('⚠️ No image ID provided, using fallback');
      return '/cookies.webp';
    }
    
    if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
      console.log('✅ Using full URL:', imageId);
      return imageId;
    }
    
    const imageUrl = `${this.baseUrl}/assets/${imageId}`;
    console.log('🔗 Constructed image URL for ID:', imageId, '-> URL:', imageUrl);
    return imageUrl;
  }
}

export const directusService = new DirectusService();

// Para debugging en consola
(window as any).directus = {
  fetchFeatured: () => directusService.fetchFeaturedProducts(),
  fetchAll: () => directusService.fetchAllProducts(),
  fetchCategories: () => directusService.fetchCategories(),
  fetchCategoriesWithProducts: () => directusService.fetchCategoriesWithProducts(),
  fetchProductsByCategory: (id: number) => directusService.fetchProductsByCategory(id)
};

console.log('🔌 Directus service ready! Try: directus.fetchCategoriesWithProducts()');