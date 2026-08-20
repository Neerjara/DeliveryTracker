import React, { useState, useEffect } from 'react';
import { Order, CreateOrderDto, UpdateOrderDto, OrderStatus } from '../types/order';
import { X, Check } from 'lucide-react';

interface OrderFormModalProps {
  isOpen: boolean;
  editingOrder: Order | null;
  onClose: () => void;
  onSubmitCreate: (dto: CreateOrderDto) => Promise<void>;
  onSubmitUpdate: (id: number, dto: UpdateOrderDto) => Promise<void>;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({
  isOpen,
  editingOrder,
  onClose,
  onSubmitCreate,
  onSubmitUpdate,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<OrderStatus>('Processing');
  const [location, setLocation] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (editingOrder) {
      setCustomerName(editingOrder.customerName);
      setProductName(editingOrder.productName);
      setAmount(editingOrder.amount.toString());
      setStatus(editingOrder.status);
      setLocation(editingOrder.location);
      setEstimatedDeliveryDate(
        editingOrder.estimatedDeliveryDate
          ? new Date(editingOrder.estimatedDeliveryDate).toISOString().split('T')[0]
          : ''
      );
    } else {
      setCustomerName('');
      setProductName('');
      setAmount('');
      setStatus('Processing');
      setLocation('');
      setEstimatedDeliveryDate('');
    }
    setErrorMsg(null);
  }, [editingOrder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      return;
    }

    if (!customerName.trim() || !productName.trim() || !location.trim()) {
      setErrorMsg('Customer name, product name, and location are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingOrder) {
        const dto: UpdateOrderDto = {
          customerName: customerName.trim(),
          productName: productName.trim(),
          amount: parsedAmount,
          status,
          location: location.trim(),
          orderDate: editingOrder.orderDate,
          estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate).toISOString() : null,
        };
        await onSubmitUpdate(editingOrder.id, dto);
      } else {
        const dto: CreateOrderDto = {
          customerName: customerName.trim(),
          productName: productName.trim(),
          amount: parsedAmount,
          status,
          location: location.trim(),
          orderDate: new Date().toISOString(),
          estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate).toISOString() : null,
        };
        await onSubmitCreate(dto);
      }
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving the order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {editingOrder ? `Edit Order #${editingOrder.orderNumber}` : 'Create New Delivery Order'}
          </h3>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {errorMsg && (
          <div className="alert alert-error">
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Customer Name</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Product Name</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Wireless Headphones"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Amount ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                className="form-input"
                required
                placeholder="199.99"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Order Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="OutForDelivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Current Tracking Location</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Distribution Center - Seattle WA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Estimated Delivery Date (Optional)</label>
            <input
              type="date"
              className="form-input"
              value={estimatedDeliveryDate}
              onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="spinner" style={{ width: 16, height: 16, borderTopColor: '#fff' }} />
              ) : (
                <Check size={18} />
              )}
              <span>{editingOrder ? 'Save Changes' : 'Create Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
