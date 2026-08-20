using DeliveryTracker.Api.Models;
using DeliveryTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly IOrderService _orderService;

    public DashboardController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>
    /// Return summary dashboard metrics.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(DashboardSummary))]
    public IActionResult GetDashboard()
    {
        var summary = _orderService.GetDashboardSummary();
        return Ok(summary);
    }
}
