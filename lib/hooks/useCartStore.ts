import { create } from 'zustand';
import { round2 } from '../utils';
import { OrderItem, ShippingAddress } from '../models/OrderModel';
import { persist } from 'zustand/middleware';

type Cart = {
  items: OrderItem[];
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;

  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
};

const initialState: Cart = {
  items: [],
  itemsPrice: 0,
  taxPrice: 0,
  shippingPrice: 0,
  totalPrice: 0,
  paymentMethod: 'PayPal',
  shippingAddress: {
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
  },
};

export const cartStore = create<Cart>()(
  persist(() => initialState, {
    name: 'cartStore',
  })
);

export default function useCartService() {
  const {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,
  } = cartStore();

  return {
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    shippingAddress,

    increase: (item: OrderItem) => {
      const existItem = items.find((x) => x.slug === item.slug);

      const updatedCartItems = existItem
        ? items.map((x) =>
            x.slug === item.slug
              ? { ...existItem, quantity: existItem.quantity + 1 }
              : x
          )
        : [...items, { ...item, quantity: 1 }];
      const { itemsPrice, taxPrice, shippingPrice, totalPrice } =
        calcPrice(updatedCartItems);
      cartStore.setState({
        items: updatedCartItems,
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
    saveShippingAddress: (shippingAddress: ShippingAddress) => {
      cartStore.setState({ shippingAddress });
    },
    savePaymentMethod: (paymentMethod: string) => {
      cartStore.setState({ paymentMethod });
    },
    clear: () => {
      cartStore.setState(initialState);
    },
  };
}

const calcPrice = (items: OrderItem[]) => {
  const itemsPrice = round2(
      items.reduce((a, c) => a + c.quantity * c.price, 0)
    ),
    shippingPrice = round2(itemsPrice > 100 ? 0 : 100),
    taxPrice = round2(Number(itemsPrice * 0.15)),
    totalPrice = round2(itemsPrice + taxPrice + shippingPrice);

  return {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  };
};
