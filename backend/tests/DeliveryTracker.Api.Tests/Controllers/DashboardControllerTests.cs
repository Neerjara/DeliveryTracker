using DeliveryTracker.Api.Controllers;
using DeliveryTracker.Api.Models;
using DeliveryTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace DeliveryTracker.Api.Tests.Controllers;

public class DashboardControllerTests
{
    private readonly DashboardController _controller;
    private readonly OrderService _orderService;

    public DashboardControllerTests()
    {
        _orderService = new OrderService();
        _controller = new DashboardController(_orderService);
    }

    [Fact]
    public void GetDashboard_ShouldReturnOkWithSummaryMetrics()
    {
        // Act
        var actionResult = _controller.GetDashboard();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(actionResult);
        var summary = Assert.IsType<DashboardSummary>(okResult.Value);
        Assert.Equal(5, summary.TotalOrders);
        Assert.Equal(1099.43m, summary.TotalOrderValue);
    }
}
