import React from 'react';
import { Package, Plus, RefreshCw } from 'lucide-react';

interface HeaderProps {
  onOpenCreateModal: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCreateModal, onRefresh, isRefreshing }) => {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <Package size={24} />
        </div>
        <div>
          <h1 className="brand-title">DeliveryTracker</h1>
          <p className="brand-subtitle">Order Delivery Microservice Dashboard</p>
        </div>
      </div>

      <div className="header-actions">
        <button className="btn btn-secondary" onClick={onRefresh} disabled={isRefreshing} title="Refresh data">
          <RefreshCw size={16} style={{ animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
          <span>Refresh</span>
        </button>

        <button className="btn btn-primary" onClick={onOpenCreateModal}>
          <Plus size={18} />
          <span>New Order</span>
        </button>
      </div>
    </header>
  );
};
