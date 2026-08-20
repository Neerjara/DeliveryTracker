import React from 'react';
import { Order } from '../types/order';
import { X, Calendar, MapPin, DollarSign, User, Package, Hash } from 'lucide-react';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className={`badge badge-${order.status}`}>
              {order.status === 'OutForDelivery' ? 'Out for Delivery' : order.status}
            </span>
            <h3 className="modal-title">{order.orderNumber}</h3>
          </div>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="metric-card" style={{ padding: '0.85rem 1rem' }}>
            <User size={18} style={{ color: 'var(--accent-primary)' }} />
            <div>
              <div className="metric-lbl">Customer</div>
              <div style={{ fontWeight: 600 }}>{order.customerName}</div>
            </div>
          </div>

          <div className="metric-card" style={{ padding: '0.85rem 1rem' }}>
            <Package size={18} style={{ color: 'var(--accent-cyan)' }} />
            <div>
              <div className="metric-lbl">Product Item</div>
              <div style={{ fontWeight: 600 }}>{order.productName}</div>
            </div>
          </div>

          <div className="form-grid">
            <div className="metric-card" style={{ padding: '0.85rem 1rem' }}>
              <DollarSign size={18} style={{ color: 'var(--accent-emerald)' }} />
              <div>
                <div className="metric-lbl">Amount</div>
                <div style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>
                  ${order.amount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="metric-card" style={{ padding: '0.85rem 1rem' }}>
              <Hash size={18} style={{ color: 'var(--accent-purple)' }} />
              <div>
                <div className="metric-lbl">System ID</div>
                <div style={{ fontWeight: 600 }}>#{order.id}</div>
              </div>
            </div>
          </div>

          <div className="metric-card" style={{ padding: '0.85rem 1rem' }}>
            <MapPin size={18} style={{ color: 'var(--accent-amber)' }} />
            <div>
              <div className="metric-lbl">Current Location</div>
              <div style={{ fontWeight: 600 }}>{order.location}</div>
            </div>
          </div>

          <div className="form-grid">
            <div className="metric-card" style={{ padding: '0.85rem 1rem' }}>
              <Calendar size={18} style={{ color: 'var(--text-secondary)' }} />
              <div>
                <div className="metric-lbl">Order Placed</div>
                <div style={{ fontSize: '0.85rem' }}>
                  {new Date(order.orderDate).toLocaleString()}
                </div>
              </div>
            </div>

            <div className="metric-card" style={{ padding: '0.85rem 1rem' }}>
              <Calendar size={18} style={{ color: 'var(--accent-cyan)' }} />
              <div>
                <div className="metric-lbl">Est. Delivery</div>
                <div style={{ fontSize: '0.85rem' }}>
                  {order.estimatedDeliveryDate
                    ? new Date(order.estimatedDeliveryDate).toLocaleDateString()
                    : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
