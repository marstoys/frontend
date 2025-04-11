import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductsType } from '../components/NewProducts';

interface BasketItem extends ProductsType {
  quantity: number;
}

interface BasketContextType {
  basketItems: BasketItem[];
  addToBasket: (product: ProductsType, quantity: number) => void;
  removeFromBasket: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  basketCount: number;
  shopCount: number;
  totalPrice: number;
  token: string | null;
  setToken: (token: string | null) => void;
}

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>([]);
  const [basketCount, setBasketCount] = useState<number>(0);
  const [shopCount, setShopCount] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    }
  }, [token]);
  useEffect(() => {
    setToken(localStorage.getItem('token'))
  }, [token]);
  useEffect(() => {
    const savedBasket = localStorage.getItem('basket');
    if (savedBasket) {
      const parsedBasket = JSON.parse(savedBasket);
      setBasketItems(parsedBasket);
      // Calculate total count of all items
      const totalCount = parsedBasket.reduce((sum: number, item: BasketItem) => sum + item.quantity, 0);
      setBasketCount(totalCount);
      // Set shop count to the number of different types of products
      setShopCount(parsedBasket.length);
      calculateTotalPrice(parsedBasket);
    }
  }, []);

  const addToBasket = (product: ProductsType, quantity: number = 1) => {
    setBasketItems(prevItems => {
      // Check if the product already exists in the basket
      const existingItemIndex = prevItems.findIndex(item => item.id === product.id);

      let updatedItems;
      if (existingItemIndex >= 0) {
        // If the product exists, update its quantity
        updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity
        };
      } else {
        // If the product doesn't exist, add it with the specified quantity
        updatedItems = [...prevItems, { ...product, quantity }];
      }

      // Save to localStorage
      localStorage.setItem('basket', JSON.stringify(updatedItems));

      // Update basket count
      const totalCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      setBasketCount(totalCount);

      // Update shop count
      setShopCount(updatedItems.length);

      // Calculate total price
      calculateTotalPrice(updatedItems);

      return updatedItems;
    });
  };

  const removeFromBasket = (productId: number) => {
    setBasketItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== productId);
      localStorage.setItem('basket', JSON.stringify(updatedItems));
      const totalCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      setBasketCount(totalCount);
      setShopCount(updatedItems.length);
      calculateTotalPrice(updatedItems);
      return updatedItems;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromBasket(productId);
      return;
    }

    setBasketItems(prevItems => {
      const updatedItems = prevItems?.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      localStorage.setItem('basket', JSON.stringify(updatedItems));
      const totalCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
      setBasketCount(totalCount);
      calculateTotalPrice(updatedItems);
      return updatedItems;
    });
  };
  const calculateTotalPrice = (basket: BasketItem[]) => {
    const total = basket.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseInt(item.price) : item.price;
      return sum + (price * item.quantity);
    }, 0);

    setTotalPrice(total);
  };

  return (
    <BasketContext.Provider value={{ basketItems, addToBasket, removeFromBasket, updateQuantity, basketCount, shopCount, totalPrice, token, setToken }}>
      {children}
    </BasketContext.Provider>
  );
};

export const useBasket = () => {
  const context = useContext(BasketContext);
  if (context === undefined) {
    throw new Error('useBasket must be used within a BasketProvider');
  }
  return context;
};
