export type OrderStatus = 'Processing' | 'Shipped' | 'OutForDelivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  location: string;
  orderDate: string;
  estimatedDeliveryDate?: string | null;
}

export interface CreateOrderDto {
  customerName: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  location: string;
  orderDate?: string;
  estimatedDeliveryDate?: string | null;
}

export interface UpdateOrderDto {
  customerName: string;
  productName: string;
  amount: number;
  status: OrderStatus;
  location: string;
  orderDate: string;
  estimatedDeliveryDate?: string | null;
}

export interface DashboardSummary {
  totalOrders: number;
  processing: number;
  shipped: number;
  outForDelivery: number;
  delivered: number;
  cancelled: number;
  totalOrderValue: number;
}
