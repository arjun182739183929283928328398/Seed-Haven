
import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from 'react';
import { CartItem, Product, User } from './types';
import { CredentialResponse } from 'google-one-tap';
import { jwtDecode } from 'jwt-decode';


// --- LocalStorage Helpers ---
const getUsersFromStorage = (): Record<string, User> => {
  const users = localStorage.getItem('seedhaven_users');
  return users ? JSON.parse(users) : {};
};

const saveUsersToStorage = (users: Record<string, User>) => {
  localStorage.setItem('seedhaven_users', JSON.stringify(users));
};

const getActiveUserEmailFromStorage = (): string | null => {
  return localStorage.getItem('seedhaven_active_user');
};

const setActiveUserEmailInStorage = (email: string | null) => {
  if (email) {
    localStorage.setItem('seedhaven_active_user', email);
  } else {
    localStorage.removeItem('seedhaven_active_user');
  }
};


// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  signup: (name: string, email: string, pass: string) => boolean;
  loginWithGoogle: (credentialResponse: CredentialResponse) => void;
  updateUser: (updatedUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
      const activeEmail = getActiveUserEmailFromStorage();
      if (!activeEmail) return null;
      const users = getUsersFromStorage();
      return users[activeEmail] || null;
  });

  const login = (email: string, pass: string): boolean => {
    const users = getUsersFromStorage();
    const existingUser = users[email];
    if (existingUser && existingUser.password === pass) {
      setUser(existingUser);
      setActiveUserEmailInStorage(email);
      return true;
    }
    alert("Invalid credentials. Please try again, or create an account if you're new here.");
    return false;
  };

  const logout = () => {
    setUser(null);
    setActiveUserEmailInStorage(null);
  };
  
  const signup = (name: string, email: string, pass: string): boolean => {
    const users = getUsersFromStorage();
    if (users[email]) {
      alert("User with this email already exists.");
      return false;
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        password: pass,
        orders: [],
        addresses: [],
        paymentMethods: [],
    };
    users[email] = newUser;
    saveUsersToStorage(users);
    setUser(newUser);
    setActiveUserEmailInStorage(email);
    alert("Signup successful! A confirmation email has been sent to your address.");
    return true;
  };
  
  const loginWithGoogle = (credentialResponse: CredentialResponse) => {
    const users = getUsersFromStorage();
    const decoded: { email: string, name: string, sub: string } = jwtDecode(credentialResponse.credential!);
    
    let userToLogin = users[decoded.email];

    if (!userToLogin) {
      // If user doesn't exist, create a new one
      userToLogin = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        // no password for Google users
        orders: [],
        addresses: [],
        paymentMethods: [],
      };
      users[decoded.email] = userToLogin;
      saveUsersToStorage(users);
    }
    
    setUser(userToLogin);
    setActiveUserEmailInStorage(decoded.email);
  };
  
  const updateUser = (updatedUser: User) => {
      if(!user || user.email !== updatedUser.email) return; // safety check
      const users = getUsersFromStorage();
      users[updatedUser.email] = updatedUser;
      saveUsersToStorage(users);
      setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, signup, loginWithGoogle, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// --- Cart Context ---
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, customComposition?: { white: number, black: number }) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart from localStorage when user logs in
  useEffect(() => {
    if (user) {
      const savedCart = localStorage.getItem(`seedhaven_cart_${user.id}`);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } else {
      setCartItems([]); // Clear cart on logout
    }
  }, [user]);

  // Save cart to localStorage on any change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`seedhaven_cart_${user.id}`, JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  const addToCart = useCallback((product: Product, quantity: number, customComposition?: { white: number, black: number }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id && item.type !== 'custom');
      
      if (product.type === 'custom') {
          const customProduct: CartItem = { 
              ...product, 
              id: `custom-${Date.now()}`, 
              quantity, 
              customComposition 
          };
          return [...prevItems, customProduct];
      }

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if(user){
        localStorage.removeItem(`seedhaven_cart_${user.id}`);
    }
  }, [user]);

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};