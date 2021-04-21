export interface StoredCartItemInterface extends CartItemInterface {
  uuid: string;
}

export interface CartItemInterface {
  item: string;
  item_options: CartItemOptionsInterface;
  uuid?: string;
}

interface CartItemOptionsInterface {
  excluded_ingredients: string[];
  extra_ingredients: string[];
  quantity: number;
  variation?: string;
  comments?: string;
  price: number;
  name: string;
  description: string;
}
