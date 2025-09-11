import api from '../api/client';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  name: string;
  price: number;
  image: string;
  attributes?: Record<string, string>;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}

class CartService {
  private cartKey = 'shopping_cart';

  async getCart(): Promise<Cart> {
    try {
      // Try to get cart from API for logged-in users
      if (localStorage.getItem('auth_token')) {
        const { data } = await api.get<Cart>('/cart');
        return data;
      }
      
      // Return local cart for guests
      return this.getLocalCart();
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  async addToCart(productId: string, quantity: number = 1): Promise<Cart> {
    try {
      if (localStorage.getItem('auth_token')) {
        const { data } = await api.post<Cart>('/cart/items', { productId, quantity });
        return data;
      }
      
      return this.addToLocalCart(productId, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
    try {
      if (localStorage.getItem('auth_token')) {
        const { data } = await api.put<Cart>(`/cart/items/${itemId}`, { quantity });
        return data;
      }
      
      return this.updateLocalCartItem(itemId, quantity);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  async removeFromCart(itemId: string): Promise<Cart> {
    try {
      if (localStorage.getItem('auth_token')) {
        const { data } = await api.delete<Cart>(`/cart/items/${itemId}`);
        return data;
      }
      
      return this.removeFromLocalCart(itemId);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  async clearCart(): Promise<void> {
    try {
      if (localStorage.getItem('auth_token')) {
        await api.delete('/cart');
      }
      
      localStorage.removeItem(this.cartKey);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  }

  async mergeLocalCart(): Promise<Cart | null> {
    try {
      const localCart = this.getLocalCart();
      if (localCart.items.length === 0) return null;

      const { data } = await api.post<Cart>('/cart/merge', {
        items: localCart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      localStorage.removeItem(this.cartKey);
      return data;
    } catch (error) {
      console.error('Error merging cart:', error);
      throw error;
    }
  }

  // Local cart management for guest users
  private getLocalCart(): Cart {
    const cart = localStorage.getItem(this.cartKey);
    if (!cart) {
      return this.createEmptyCart();
    }
    return JSON.parse(cart);
  }

  private async addToLocalCart(productId: string, quantity: number): Promise<Cart> {
    const cart = this.getLocalCart();
    const existingItem = cart.items.find(item => item.productId === productId);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Fetch product details
      const { data: product } = await api.get(`/products/${productId}`);
      cart.items.push({
        id: Math.random().toString(36).substr(2, 9),
        productId,
        quantity,
        name: product.name,
        price: product.price,
        image: product.images[0],
      });
    }

    return this.updateLocalCart(cart);
  }

  private updateLocalCartItem(itemId: string, quantity: number): Cart {
    const cart = this.getLocalCart();
    const item = cart.items.find(item => item.id === itemId);
    
    if (item) {
      item.quantity = quantity;
    }

    return this.updateLocalCart(cart);
  }

  private removeFromLocalCart(itemId: string): Cart {
    const cart = this.getLocalCart();
    cart.items = cart.items.filter(item => item.id !== itemId);
    return this.updateLocalCart(cart);
  }

  private updateLocalCart(cart: Cart): Cart {
    // Recalculate totals
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.tax = cart.subtotal * 0.16; // 16% VAT
    cart.shipping = cart.subtotal > 10000 ? 0 : 500; // Free shipping over 10,000 KES
    cart.total = cart.subtotal + cart.tax + cart.shipping;
    cart.updatedAt = new Date().toISOString();

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    return cart;
  }

  private createEmptyCart(): Cart {
    const cart: Cart = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'guest',
      items: [],
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    return cart;
  }
}

export const cartService = new CartService();
export default cartService;
