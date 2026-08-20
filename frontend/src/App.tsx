import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, CreateOrderDto, UpdateOrderDto, DashboardSummary } from './types/order';
import { apiService } from './services/api';
import { Header } from './components/Header';
import { MetricCards } from './components/MetricCards';
import { FilterBar } from './components/FilterBar';
import { OrdersTable } from './components/OrdersTable';
import { OrderDetailsModal } from './components/OrderDetailsModal';
import { OrderFormModal } from './components/OrderFormModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Modals state
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrder, setDeletingOrder] = useState<Order | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      const summaryData = await apiService.getDashboardSummary();
      setSummary(summaryData);
    } catch (err: any) {
      console.error('Failed to fetch summary metrics', err);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      let data: Order[];
      if (searchQuery.trim()) {
        data = await apiService.searchOrders(searchQuery.trim());
      } else if (selectedStatus !== 'ALL') {
        data = await apiService.getOrdersByStatus(selectedStatus as OrderStatus);
      } else {
        data = await apiService.getAllOrders();
      }
      setOrders(data);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to connect to DeliveryTracker API microservice.');
      setOrders([]);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [searchQuery, selectedStatus]);

  useEffect(() => {
    fetchDashboardData();
    fetchOrders();
  }, [fetchDashboardData, fetchOrders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchDashboardData(), fetchOrders()]);
  };

  const handleOpenCreateModal = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleOpenEditModal = (order: Order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleCreateOrder = async (dto: CreateOrderDto) => {
    await apiService.createOrder(dto);
    await Promise.all([fetchDashboardData(), fetchOrders()]);
  };

  const handleUpdateOrder = async (id: number, dto: UpdateOrderDto) => {
    await apiService.updateOrder(id, dto);
    await Promise.all([fetchDashboardData(), fetchOrders()]);
  };

  const handleDeleteOrder = async (id: number) => {
    await apiService.deleteOrder(id);
    await Promise.all([fetchDashboardData(), fetchOrders()]);
  };

  return (
    <div className="app-container">
      <Header
        onOpenCreateModal={handleOpenCreateModal}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {errorMessage && (
        <div className="alert alert-error">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{errorMessage}</span>
          </div>
          <button className="btn btn-secondary" onClick={fetchOrders} style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem' }}>
            Retry
          </button>
        </div>
      )}

      <MetricCards summary={summary} />

      <div className="glass-card">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
        />

        <OrdersTable
          orders={orders}
          isLoading={isLoading}
          onViewDetails={(order) => setViewingOrder(order)}
          onEdit={handleOpenEditModal}
          onDelete={(order) => setDeletingOrder(order)}
        />
      </div>

      {/* Detail Modal */}
      <OrderDetailsModal
        order={viewingOrder}
        onClose={() => setViewingOrder(null)}
      />

      {/* Form Modal (Create / Edit) */}
      <OrderFormModal
        isOpen={isFormOpen}
        editingOrder={editingOrder}
        onClose={() => setIsFormOpen(false)}
        onSubmitCreate={handleCreateOrder}
        onSubmitUpdate={handleUpdateOrder}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        order={deletingOrder}
        onClose={() => setDeletingOrder(null)}
        onConfirmDelete={handleDeleteOrder}
      />
    </div>
  );
};

export default App;
