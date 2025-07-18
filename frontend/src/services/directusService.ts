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

      // Extraer solo los productos que están publicados o en borrador (para testing)
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

  formatPrice(price: string): number {
    return parseFloat(price);
  }

  getImageUrl(imageId: string | null): string {
    if (!imageId) {
      console.log('⚠️ No image ID provided, using fallback');
      return '/cookies.webp';
    }
    
    // Si ya es una URL completa (S3), devolverla tal como está
    if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
      console.log('✅ Using full URL:', imageId);
      return imageId;
    }
    
    // Construir la URL de Directus para el asset
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
  fetchCategories: () => directusService.fetchCategories()
};

console.log('🔌 Directus service ready! Try: directus.fetchFeatured()');