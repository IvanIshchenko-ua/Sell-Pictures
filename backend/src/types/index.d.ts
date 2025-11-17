export interface Painting {
  id: number;
  title: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  created_at: string;
}

export interface OrderItem {
  painting_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_comment?: string;
  total_amount: number;
  created_at: string;
}

export interface OrderCreatePayload {
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  customer_comment?: string;
  total_amount: number;
  items: OrderItem[];
}

export interface Admin {
  id: number;
  username: string;
  password_hash: string;
}

export interface AdminJwtPayload {
  id: number;
  username: string;
}
