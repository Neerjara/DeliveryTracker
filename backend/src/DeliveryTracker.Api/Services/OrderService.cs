using DeliveryTracker.Api.Models;

namespace DeliveryTracker.Api.Services;

public class OrderService : IOrderService
{
    private readonly List<Order> _orders;
    private readonly object _lock = new();
    private int _nextId = 6;

    public OrderService()
    {
        _orders = new List<Order>
        {
            new Order
            {
                Id = 1,
                OrderNumber = "ORD-1001",
                CustomerName = "John Doe",
                ProductName = "Wireless Noise-Canceling Headphones",
                Amount = 199.99m,
                Status = OrderStatus.Processing,
                Location = "Distribution Center - Seattle WA",
                OrderDate = new DateTime(2026, 8, 18, 10, 30, 0, DateTimeKind.Utc),
                EstimatedDeliveryDate = new DateTime(2026, 8, 24, 17, 0, 0, DateTimeKind.Utc)
            },
            new Order
            {
                Id = 2,
                OrderNumber = "ORD-1002",
                CustomerName = "Jane Smith",
                ProductName = "Smart Fitness Watch",
                Amount = 249.50m,
                Status = OrderStatus.Shipped,
                Location = "In Transit - Chicago IL",
                OrderDate = new DateTime(2026, 8, 17, 14, 15, 0, DateTimeKind.Utc),
                EstimatedDeliveryDate = new DateTime(2026, 8, 22, 12, 0, 0, DateTimeKind.Utc)
            },
            new Order
            {
                Id = 3,
                OrderNumber = "ORD-1003",
                CustomerName = "Alice Johnson",
                ProductName = "Ergonomic Mechanical Keyboard",
                Amount = 129.95m,
                Status = OrderStatus.OutForDelivery,
                Location = "Local Courier Van - Austin TX",
                OrderDate = new DateTime(2026, 8, 16, 9, 0, 0, DateTimeKind.Utc),
                EstimatedDeliveryDate = new DateTime(2026, 8, 20, 18, 0, 0, DateTimeKind.Utc)
            },
            new Order
            {
                Id = 4,
                OrderNumber = "ORD-1004",
                CustomerName = "Bob Williams",
                ProductName = "27-inch 4K UHD Monitor",
                Amount = 450.00m,
                Status = OrderStatus.Delivered,
                Location = "Front Porch - San Francisco CA",
                OrderDate = new DateTime(2026, 8, 12, 11, 45, 0, DateTimeKind.Utc),
                EstimatedDeliveryDate = new DateTime(2026, 8, 15, 15, 30, 0, DateTimeKind.Utc)
            },
            new Order
            {
                Id = 5,
                OrderNumber = "ORD-1005",
                CustomerName = "Charlie Brown",
                ProductName = "Ultra Light Gaming Mouse",
                Amount = 69.99m,
                Status = OrderStatus.Cancelled,
                Location = "Warehouse - Fulfillment Canceled",
                OrderDate = new DateTime(2026, 8, 19, 16, 20, 0, DateTimeKind.Utc),
                EstimatedDeliveryDate = null
            }
        };
    }

    public IEnumerable<Order> GetAllOrders()
    {
        lock (_lock)
        {
            return _orders.ToList();
        }
    }

    public Order? GetOrderById(int id)
    {
        lock (_lock)
        {
            return _orders.FirstOrDefault(o => o.Id == id);
        }
    }

    public IEnumerable<Order> GetOrdersByStatus(OrderStatus status)
    {
        lock (_lock)
        {
            return _orders.Where(o => o.Status == status).ToList();
        }
    }

    public IEnumerable<Order> SearchOrders(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return Enumerable.Empty<Order>();
        }

        var normalizedQuery = query.Trim().ToLowerInvariant();

        lock (_lock)
        {
            return _orders.Where(o =>
                o.OrderNumber.ToLowerInvariant().Contains(normalizedQuery) ||
                o.CustomerName.ToLowerInvariant().Contains(normalizedQuery) ||
                o.ProductName.ToLowerInvariant().Contains(normalizedQuery)).ToList();
        }
    }

    public Order CreateOrder(CreateOrderDto dto)
    {
        lock (_lock)
        {
            var newId = _nextId++;
            var newOrder = new Order
            {
                Id = newId,
                OrderNumber = $"ORD-{1000 + newId}",
                CustomerName = dto.CustomerName,
                ProductName = dto.ProductName,
                Amount = dto.Amount,
                Status = dto.Status,
                Location = dto.Location,
                OrderDate = dto.OrderDate ?? DateTime.UtcNow,
                EstimatedDeliveryDate = dto.EstimatedDeliveryDate
            };
            _orders.Add(newOrder);
            return newOrder;
        }
    }

    public Order? UpdateOrder(int id, UpdateOrderDto dto)
    {
        lock (_lock)
        {
            var existing = _orders.FirstOrDefault(o => o.Id == id);
            if (existing == null)
            {
                return null;
            }

            existing.CustomerName = dto.CustomerName;
            existing.ProductName = dto.ProductName;
            existing.Amount = dto.Amount;
            existing.Status = dto.Status;
            existing.Location = dto.Location;
            existing.OrderDate = dto.OrderDate;
            existing.EstimatedDeliveryDate = dto.EstimatedDeliveryDate;

            return existing;
        }
    }

    public bool DeleteOrder(int id)
    {
        lock (_lock)
        {
            var existing = _orders.FirstOrDefault(o => o.Id == id);
            if (existing == null)
            {
                return false;
            }

            return _orders.Remove(existing);
        }
    }

    public DashboardSummary GetDashboardSummary()
    {
        lock (_lock)
        {
            return new DashboardSummary
            {
                TotalOrders = _orders.Count,
                Processing = _orders.Count(o => o.Status == OrderStatus.Processing),
                Shipped = _orders.Count(o => o.Status == OrderStatus.Shipped),
                OutForDelivery = _orders.Count(o => o.Status == OrderStatus.OutForDelivery),
                Delivered = _orders.Count(o => o.Status == OrderStatus.Delivered),
                Cancelled = _orders.Count(o => o.Status == OrderStatus.Cancelled),
                TotalOrderValue = _orders.Sum(o => o.Amount)
            };
        }
    }
}
