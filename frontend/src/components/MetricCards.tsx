import React from 'react';
import { DashboardSummary } from '../types/order';
import { Package, Clock, Truck, Navigation, CheckCircle2, XCircle, DollarSign } from 'lucide-react';

interface MetricCardsProps {
  summary: DashboardSummary | null;
}

export const MetricCards: React.FC<MetricCardsProps> = ({ summary }) => {
  if (!summary) return null;

  const metrics = [
    { label: 'Total Orders', val: summary.totalOrders, icon: Package, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.15)' },
    { label: 'Processing', val: summary.processing, icon: Clock, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
    { label: 'Shipped', val: summary.shipped, icon: Truck, color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.15)' },
    { label: 'Out for Delivery', val: summary.outForDelivery, icon: Navigation, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
    { label: 'Delivered', val: summary.delivered, icon: CheckCircle2, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
    { label: 'Cancelled', val: summary.cancelled, icon: XCircle, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
    { label: 'Total Value', val: `$${summary.totalOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, icon: DollarSign, color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' }
  ];

  return (
    <div className="metrics-grid">
      {metrics.map((m, idx) => {
        const Icon = m.icon;
        return (
          <div key={idx} className="metric-card">
            <div className="metric-icon-box" style={{ backgroundColor: m.bg, color: m.color }}>
              <Icon size={22} />
            </div>
            <div>
              <div className="metric-val">{m.val}</div>
              <div className="metric-lbl">{m.label}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
