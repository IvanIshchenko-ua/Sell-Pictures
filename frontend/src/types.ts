export interface Painting {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
}

export interface CartItem {
  painting: Painting;
  quantity: number;
}

export interface OrderItemPayload {
  painting_id: number;
  quantity: number;
  price: number;
}

export interface OrderCreatePayload {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_comment?: string;
  total_amount: number;
  items: OrderItemPayload[];
}
