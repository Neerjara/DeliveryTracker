import { Order, CreateOrderDto, UpdateOrderDto, DashboardSummary, OrderStatus } from '../types/order';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = `HTTP ${response.status} ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === 'string') {
        errorMessage = errorData;
      } else if (errorData.errors) {
        errorMessage = Object.values(errorData.errors).flat().join(', ');
      }
    } catch {
      // Fallback
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const apiService = {
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE_URL}/dashboard`);
    return handleResponse<DashboardSummary>(res);
  },

  async getAllOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE_URL}/orders`);
    return handleResponse<Order[]>(res);
  },

  async getOrderById(id: number): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`);
    return handleResponse<Order>(res);
  },

  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    const res = await fetch(`${API_BASE_URL}/orders/status/${status}`);
    return handleResponse<Order[]>(res);
  },

  async searchOrders(query: string): Promise<Order[]> {
    const res = await fetch(`${API_BASE_URL}/orders/search?query=${encodeURIComponent(query)}`);
    return handleResponse<Order[]>(res);
  },

  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
    return handleResponse<Order>(res);
  },

  async updateOrder(id: number, dto: UpdateOrderDto): Promise<Order> {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dto)
    });
    return handleResponse<Order>(res);
  },

  async deleteOrder(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<void>(res);
  }
};
