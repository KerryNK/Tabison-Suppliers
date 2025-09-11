import api from '../api/client';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  specifications: Record<string, string>;
  stock: number;
  sku: string;
  supplier: {
    id: string;
    name: string;
  };
  status: 'active' | 'draft' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  category: string;
  specifications: Record<string, string>;
  stock: number;
  sku: string;
  supplierId: string;
  status?: Product['status'];
}

export interface ProductUpdateData extends Partial<ProductCreateData> {
  id: string;
}

export interface ProductFilters {
  category?: string;
  supplier?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: Product['status'];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

class ProductService {
  async getAllProducts(filters?: ProductFilters): Promise<{
    products: Product[];
    total: number;
    page: number;
    pages: number;
  }> {
    try {
      const { data } = await api.get('/products', { params: filters });
      return data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product> {
    try {
      const { data } = await api.get(`/products/${id}`);
      return data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  async createProduct(productData: ProductCreateData): Promise<Product> {
    try {
      const { data } = await api.post('/products', productData);
      return data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  async updateProduct({ id, ...updateData }: ProductUpdateData): Promise<Product> {
    try {
      const { data } = await api.put(`/products/${id}`, updateData);
      return data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.delete(`/products/${id}`);
      return data;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  async uploadProductImages(productId: string, files: File[]): Promise<{ imageUrls: string[] }> {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const { data } = await api.post(`/products/${productId}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return data;
    } catch (error) {
      console.error('Error uploading product images:', error);
      throw error;
    }
  }

  async deleteProductImage(productId: string, imageUrl: string): Promise<{ success: boolean }> {
    try {
      const { data } = await api.delete(`/products/${productId}/images`, {
        data: { imageUrl },
      });
      return data;
    } catch (error) {
      console.error('Error deleting product image:', error);
      throw error;
    }
  }

  async updateProductStatus(productId: string, status: Product['status']): Promise<Product> {
    try {
      const { data } = await api.put(`/products/${productId}/status`, { status });
      return data;
    } catch (error) {
      console.error('Error updating product status:', error);
      throw error;
    }
  }

  async updateProductStock(productId: string, stock: number): Promise<Product> {
    try {
      const { data } = await api.put(`/products/${productId}/stock`, { stock });
      return data;
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }
}

export const productService = new ProductService();
export default productService;
