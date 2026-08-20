using DeliveryTracker.Api.Models;

namespace DeliveryTracker.Api.Services;

public interface IOrderService
{
    IEnumerable<Order> GetAllOrders();
    Order? GetOrderById(int id);
    IEnumerable<Order> GetOrdersByStatus(OrderStatus status);
    IEnumerable<Order> SearchOrders(string query);
    Order CreateOrder(CreateOrderDto dto);
    Order? UpdateOrder(int id, UpdateOrderDto dto);
    bool DeleteOrder(int id);
    DashboardSummary GetDashboardSummary();
}
