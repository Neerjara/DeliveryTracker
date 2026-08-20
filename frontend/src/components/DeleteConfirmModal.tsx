import React, { useState } from 'react';
import { Order } from '../types/order';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  order: Order | null;
  onClose: () => void;
  onConfirmDelete: (id: number) => Promise<void>;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  order,
  onClose,
  onConfirmDelete,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!order) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onConfirmDelete(order.id);
      onClose();
    } catch (err) {
      // Error handled by parent alert
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)' }}>
            <AlertTriangle size={20} />
            <h3 className="modal-title">Delete Order</h3>
          </div>
          <button className="btn-icon-only" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Are you sure you want to delete order <strong style={{ color: 'var(--text-primary)' }}>{order.orderNumber}</strong> ({order.productName}) for <strong style={{ color: 'var(--text-primary)' }}>{order.customerName}</strong>?
        </p>

        <p style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', fontStyle: 'italic' }}>
          This action cannot be undone.
        </p>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting ? (
              <div className="spinner" style={{ width: 16, height: 16, borderTopColor: '#fff' }} />
            ) : (
              <Trash2 size={16} />
            )}
            <span>Delete Permanently</span>
          </button>
        </div>
      </div>
    </div>
  );
};
