export type OrderItem = {
  name: string;
  slug: string;
  quantity: number;
  image: string;
  price: number;
  color: string;
  size: string;
};

export type ShippingAddress = {
  fullName: string | undefined;
  address: string | undefined;
  city: string | undefined;
  postalCode: string | undefined;
  country: string | undefined;
};
