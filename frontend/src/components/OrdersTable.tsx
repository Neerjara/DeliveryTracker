import React from 'react';
import { Order } from '../types/order';
import { Eye, Edit3, Trash2, PackageOpen } from 'lucide-react';

interface OrdersTableProps {
  orders: Order[];
  isLoading: boolean;
  onViewDetails: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (order: Order) => void;
}

export const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  isLoading,
  onViewDetails,
  onEdit,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="empty-state">
        <div className="spinner" style={{ margin: '0 auto 1rem auto' }}></div>
        <p>Loading orders from microservice API...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <PackageOpen className="empty-icon" size={48} />
        <h3>No Orders Found</h3>
        <p>Try adjusting your search query or status filter.</p>
      </div>
    );
  }

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="table-container">
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Customer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Location</th>
            <th>Est. Delivery</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>
                <strong style={{ color: 'var(--text-primary)' }}>{o.orderNumber}</strong>
              </td>
              <td>{o.customerName}</td>
              <td>{o.productName}</td>
              <td style={{ fontWeight: 600, color: 'var(--accent-emerald)' }}>
                ${o.amount.toFixed(2)}
              </td>
              <td>
                <span className={`badge badge-${o.status}`}>
                  {o.status === 'OutForDelivery' ? 'Out for Delivery' : o.status}
                </span>
              </td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{o.location}</td>
              <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                {formatDate(o.estimatedDeliveryDate)}
              </td>
              <td>
                <div className="actions-cell">
                  <button
                    className="btn-icon-only"
                    onClick={() => onViewDetails(o)}
                    title="View details"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    className="btn-icon-only"
                    onClick={() => onEdit(o)}
                    title="Edit order"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    className="btn-icon-only"
                    style={{ color: 'var(--accent-rose)' }}
                    onClick={() => onDelete(o)}
                    title="Delete order"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
