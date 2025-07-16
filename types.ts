
export interface Product {
  id: string;
  name: string;
  type: 'white' | 'black' | 'mixed' | 'custom';
  price: number;
  description: string;
  longDescription: string;
  image: string;
  rating: number;
  reviewCount: number;
  stock: number;
  origin: string;
  growthEnvironment: string;
}

export interface CartItem extends Product {
  quantity: number;
  customComposition?: {
    white: number;
    black: number;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string; // Optional for Google Sign-In users
  orders: Order[];
  addresses: Address[];
  paymentMethods: PaymentMethod[];
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
  total: number;
}

export interface Address {
    id: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}

export type PaymentMethod =
  | {
      id: string;
      type: 'Credit Card';
      last4: string;
      expiry: string;
    }
  | {
      id: string;
      type: 'Checking Account';
      accountLast4: string;
      routingNumber: string;
    };
