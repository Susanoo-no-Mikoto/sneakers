import { useContext } from 'react';

import { AppContext } from '../App';

export const useCart = () => {
  const { cartItems, setCartItems } = useContext(AppContext);
  const totalPrice: number = cartItems.reduce(
    (sum: number, obj: { id: number; title: string; imageUrl: string; price: string }) =>
      parseInt(obj.price.replace(/[^\d]/g, '')) + sum,
    0,
  );
  return { cartItems, setCartItems, totalPrice };
};
