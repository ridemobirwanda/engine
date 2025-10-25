import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { listProducts } from '@/services/productsApi';
import { getCategoryBySlug } from '@/services/categoriesApi';

export interface Product {
  id: string;
  name: string;
  description: string | null;
  short_description: string | null;
  price: number;
  compare_price: number | null;
  brand: string | null;
  model: string | null;
  engine_type: string | null;
  displacement: string | null;
  fuel_type: string | null;
  condition: string | null;
  stock_quantity: number | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  images: any;
  specifications: any;
  created_at: string;
  category_id?: string;
}

export const useProducts = (categorySlug?: string) => {
  // Use React Query for caching and background updates
  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products', categorySlug],
    queryFn: async () => {
      try {
        let categoryId: string | undefined;

        if (categorySlug && categorySlug !== 'all-products') {
          // First get category ID
          const category = await getCategoryBySlug(categorySlug);
          if (category && category.is_active) {
            categoryId = String(category.id);
          }
        }

        const data = await listProducts({
          is_active: true,
          category_id: categoryId,
          limit: 50,
        });

        if (!data || data.length === 0) {
          console.log('No database products found');
          return [];
        }

        // Transform the data to ensure images is always an array
        return data.map(product => ({
          ...product,
          id: String(product.id),
          images: Array.isArray(product.images) ? product.images : (product.images ? [product.images] : [])
        }));
      } catch (error) {
        console.warn('Products fetch error:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - products don't change often
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1, // Only retry once
    retryDelay: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  // Memoize filtered products to prevent unnecessary re-renders
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Add any filtering logic here if needed
      return true;
    });
  }, [products]);

  return {
    products: filteredProducts,
    isLoading: isLoading && products.length === 0, // Only show loading if no data at all
    error,
    hasData: products.length > 0,
  };
};

export const useProductSearch = (searchQuery: string, products: Product[]) => {
  return useMemo(() => {
    if (!searchQuery.trim()) return products;
    
    const query = searchQuery.toLowerCase();
    return products.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.brand?.toLowerCase().includes(query) ||
      product.model?.toLowerCase().includes(query) ||
      product.engine_type?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);
};