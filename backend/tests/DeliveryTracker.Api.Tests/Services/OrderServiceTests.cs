using DeliveryTracker.Api.Models;
using DeliveryTracker.Api.Services;
using Xunit;

namespace DeliveryTracker.Api.Tests.Services;

public class OrderServiceTests
{
    private readonly OrderService _orderService;

    public OrderServiceTests()
    {
        _orderService = new OrderService();
    }

    [Fact]
    public void GetAllOrders_ShouldReturnInitialMockOrders()
    {
        var result = _orderService.GetAllOrders();
        Assert.NotNull(result);
        Assert.Equal(5, result.Count());
    }

    [Fact]
    public void GetOrderById_WithValidId_ShouldReturnOrder()
    {
        var result = _orderService.GetOrderById(1);
        Assert.NotNull(result);
        Assert.Equal(1, result!.Id);
        Assert.Equal("ORD-1001", result.OrderNumber);
    }

    [Fact]
    public void GetOrderById_WithInvalidId_ShouldReturnNull()
    {
        var result = _orderService.GetOrderById(999);
        Assert.Null(result);
    }

    [Theory]
    [InlineData(OrderStatus.Processing, 1)]
    [InlineData(OrderStatus.Shipped, 1)]
    [InlineData(OrderStatus.OutForDelivery, 1)]
    [InlineData(OrderStatus.Delivered, 1)]
    [InlineData(OrderStatus.Cancelled, 1)]
    public void GetOrdersByStatus_ShouldReturnMatchingOrders(OrderStatus status, int expectedCount)
    {
        var result = _orderService.GetOrdersByStatus(status);
        Assert.NotNull(result);
        Assert.Equal(expectedCount, result.Count());
        Assert.All(result, o => Assert.Equal(status, o.Status));
    }

    [Fact]
    public void SearchOrders_ByCustomerName_ShouldReturnMatchingOrders()
    {
        var result = _orderService.SearchOrders("Jane Smith");
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("Jane Smith", result.First().CustomerName);
    }

    [Fact]
    public void SearchOrders_ByProductName_ShouldReturnMatchingOrders()
    {
        var result = _orderService.SearchOrders("Keyboard");
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("ORD-1003", result.First().OrderNumber);
    }

    [Fact]
    public void SearchOrders_ByOrderNumber_ShouldReturnMatchingOrder()
    {
        var result = _orderService.SearchOrders("ORD-1004");
        Assert.NotNull(result);
        Assert.Single(result);
        Assert.Equal("Bob Williams", result.First().CustomerName);
    }

    [Theory]
    [InlineData("")]
    [InlineData("   ")]
    public void SearchOrders_WithEmptyQuery_ShouldReturnEmptyEnumerable(string query)
    {
        var result = _orderService.SearchOrders(query);
        Assert.NotNull(result);
        Assert.Empty(result);
    }

    [Fact]
    public void CreateOrder_ShouldAddNewOrderAndAssignIdAndOrderNumber()
    {
        var dto = new CreateOrderDto
        {
            CustomerName = "David Miller",
            ProductName = "USB-C Hub",
            Amount = 49.99m,
            Status = OrderStatus.Processing,
            Location = "Warehouse - Denver CO"
        };

        var created = _orderService.CreateOrder(dto);

        Assert.NotNull(created);
        Assert.Equal(6, created.Id);
        Assert.Equal("ORD-1006", created.OrderNumber);
        Assert.Equal("David Miller", created.CustomerName);

        var allOrders = _orderService.GetAllOrders();
        Assert.Equal(6, allOrders.Count());
    }

    [Fact]
    public void UpdateOrder_WithValidId_ShouldUpdateProperties()
    {
        var updateDto = new UpdateOrderDto
        {
            CustomerName = "John Doe Updated",
            ProductName = "Wireless Headphones Pro",
            Amount = 219.99m,
            Status = OrderStatus.Shipped,
            Location = "In Transit - Portland OR",
            OrderDate = new DateTime(2026, 8, 18, 10, 30, 0, DateTimeKind.Utc),
            EstimatedDeliveryDate = new DateTime(2026, 8, 25, 17, 0, 0, DateTimeKind.Utc)
        };

        var updated = _orderService.UpdateOrder(1, updateDto);

        Assert.NotNull(updated);
        Assert.Equal("John Doe Updated", updated!.CustomerName);
        Assert.Equal(OrderStatus.Shipped, updated.Status);
        Assert.Equal(219.99m, updated.Amount);
    }

    [Fact]
    public void UpdateOrder_WithInvalidId_ShouldReturnNull()
    {
        var updateDto = new UpdateOrderDto
        {
            CustomerName = "Ghost",
            ProductName = "Ghost Item",
            Amount = 10.00m,
            Status = OrderStatus.Processing,
            Location = "Nowhere"
        };

        var result = _orderService.UpdateOrder(999, updateDto);
        Assert.Null(result);
    }

    [Fact]
    public void DeleteOrder_WithValidId_ShouldRemoveOrder()
    {
        var success = _orderService.DeleteOrder(1);

        Assert.True(success);
        Assert.Null(_orderService.GetOrderById(1));
        Assert.Equal(4, _orderService.GetAllOrders().Count());
    }

    [Fact]
    public void DeleteOrder_WithInvalidId_ShouldReturnFalse()
    {
        var success = _orderService.DeleteOrder(999);
        Assert.False(success);
        Assert.Equal(5, _orderService.GetAllOrders().Count());
    }

    [Fact]
    public void GetDashboardSummary_ShouldReturnAccurateCalculations()
    {
        var summary = _orderService.GetDashboardSummary();

        Assert.NotNull(summary);
        Assert.Equal(5, summary.TotalOrders);
        Assert.Equal(1, summary.Processing);
        Assert.Equal(1, summary.Shipped);
        Assert.Equal(1, summary.OutForDelivery);
        Assert.Equal(1, summary.Delivered);
        Assert.Equal(1, summary.Cancelled);
        Assert.Equal(1099.43m, summary.TotalOrderValue);
    }
}
