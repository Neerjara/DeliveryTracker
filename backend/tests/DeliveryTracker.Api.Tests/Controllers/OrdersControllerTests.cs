using DeliveryTracker.Api.Controllers;
using DeliveryTracker.Api.Models;
using DeliveryTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace DeliveryTracker.Api.Tests.Controllers;

public class OrdersControllerTests
{
    private readonly OrdersController _controller;
    private readonly OrderService _orderService;

    public OrdersControllerTests()
    {
        _orderService = new OrderService();
        _controller = new OrdersController(_orderService);
    }

    [Fact]
    public void GetAllOrders_ShouldReturnOkWithOrders()
    {
        var actionResult = _controller.GetAllOrders();
        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var orders = Assert.IsAssignableFrom<IEnumerable<Order>>(okResult.Value);
        Assert.Equal(5, orders.Count());
    }

    [Fact]
    public void GetOrderById_WithValidId_ShouldReturnOk()
    {
        var actionResult = _controller.GetOrderById(1);
        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var order = Assert.IsType<Order>(okResult.Value);
        Assert.Equal(1, order.Id);
    }

    [Fact]
    public void GetOrderById_WithInvalidId_ShouldReturnNotFound()
    {
        var actionResult = _controller.GetOrderById(999);
        Assert.IsType<NotFoundObjectResult>(actionResult);
    }

    [Fact]
    public void GetOrdersByStatus_WithValidStatus_ShouldReturnOk()
    {
        var actionResult = _controller.GetOrdersByStatus("Shipped");
        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var orders = Assert.IsAssignableFrom<IEnumerable<Order>>(okResult.Value);
        Assert.Single(orders);
    }

    [Fact]
    public void GetOrdersByStatus_WithInvalidStatus_ShouldReturnBadRequest()
    {
        var actionResult = _controller.GetOrdersByStatus("UnknownStatus");
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    [Fact]
    public void SearchOrders_WithValidQuery_ShouldReturnOk()
    {
        var actionResult = _controller.SearchOrders("Headphones");
        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var orders = Assert.IsAssignableFrom<IEnumerable<Order>>(okResult.Value);
        Assert.Single(orders);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void SearchOrders_WithEmptyQuery_ShouldReturnBadRequest(string? query)
    {
        var actionResult = _controller.SearchOrders(query);
        Assert.IsType<BadRequestObjectResult>(actionResult);
    }

    [Fact]
    public void CreateOrder_WithValidDto_ShouldReturnCreatedAtAction()
    {
        var dto = new CreateOrderDto
        {
            CustomerName = "New Customer",
            ProductName = "New Product",
            Amount = 99.99m,
            Status = OrderStatus.Processing,
            Location = "Main Store"
        };

        var actionResult = _controller.CreateOrder(dto);
        var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult);
        var order = Assert.IsType<Order>(createdResult.Value);
        Assert.Equal("New Customer", order.CustomerName);
    }

    [Fact]
    public void UpdateOrder_WithValidId_ShouldReturnOk()
    {
        var dto = new UpdateOrderDto
        {
            CustomerName = "Updated Customer",
            ProductName = "Updated Product",
            Amount = 150.00m,
            Status = OrderStatus.Delivered,
            Location = "Updated Address"
        };

        var actionResult = _controller.UpdateOrder(1, dto);
        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var order = Assert.IsType<Order>(okResult.Value);
        Assert.Equal("Updated Customer", order.CustomerName);
    }

    [Fact]
    public void UpdateOrder_WithInvalidId_ShouldReturnNotFound()
    {
        var dto = new UpdateOrderDto
        {
            CustomerName = "Ghost",
            ProductName = "Ghost Product",
            Amount = 10.00m,
            Status = OrderStatus.Processing,
            Location = "Ghost Location"
        };

        var actionResult = _controller.UpdateOrder(999, dto);
        Assert.IsType<NotFoundObjectResult>(actionResult);
    }

    [Fact]
    public void DeleteOrder_WithValidId_ShouldReturnNoContent()
    {
        var actionResult = _controller.DeleteOrder(1);
        Assert.IsType<NoContentResult>(actionResult);
    }

    [Fact]
    public void DeleteOrder_WithInvalidId_ShouldReturnNotFound()
    {
        var actionResult = _controller.DeleteOrder(999);
        Assert.IsType<NotFoundObjectResult>(actionResult);
    }
}
