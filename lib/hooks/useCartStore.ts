import { create } from 'zustand';
import { round2 } from '../utils';
import { OrderItem } from '../models/OrderModel';

type Cart = {
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
};

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
};

export const cartStore = create<Cart>(() => initialState);

export default function useCartService() {
  const { items, itemsPrice, taxPrice, shippingPrice, totalPrice } =
    cartStore();

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    increase: (item: OrderItem) => {
      const existItem = items.find((x) => x.slug === item.slug);

      const updatedItems = existItem
        ? items.map((x) =>
            x.slug === item.slug
              ? { ...existItem, quantity: existItem.quantity + 1 }
              : x
          )
        : [...items, { ...item, quantity: 1 }];

      calcPrice(updatedItems);
      cartStore.setState({
        items: updatedItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
    },
    decrease: (item: OrderItem) => {
      const existItem = items.find((x) => x.slug === item.slug);
      if (!existItem) return;

      const updatedItems =
        existItem.quantity === 1
          ? items.filter((x) => x.slug !== item.slug)
          : items.map((x) =>
              item.slug ? { ...existItem, quantity: existItem.quantity - 1 } : x
            );

      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrice(updatedItems);
      cartStore.setState({
        items: updatedItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      });
    },
  };
}

const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = round2(
    items.reduce((a, c) => a + c.quantity * c.price, 0)
  );
  const taxPrice = round2(Number(itemsPrice * 0.15));
  const shippingPrice = round2(itemsPrice > 100 ? 0 : 100);
  const totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  };
};
