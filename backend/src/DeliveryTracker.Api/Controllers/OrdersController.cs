using DeliveryTracker.Api.Models;
using DeliveryTracker.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace DeliveryTracker.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    /// <summary>
    /// Return all orders.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Order>))]
    public IActionResult GetAllOrders()
    {
        var orders = _orderService.GetAllOrders();
        return Ok(orders);
    }

    /// <summary>
    /// Return one order by ID.
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Order))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult GetOrderById(int id)
    {
        var order = _orderService.GetOrderById(id);
        if (order == null)
        {
            return NotFound(new { message = $"Order with ID {id} was not found." });
        }
        return Ok(order);
    }

    /// <summary>
    /// Return orders filtered by status.
    /// </summary>
    [HttpGet("status/{status}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Order>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult GetOrdersByStatus(string status)
    {
        if (!Enum.TryParse<OrderStatus>(status, true, out var parsedStatus))
        {
            var validStatuses = string.Join(", ", Enum.GetNames<OrderStatus>());
            return BadRequest(new { message = $"Invalid status '{status}'. Valid statuses are: {validStatuses}." });
        }

        var orders = _orderService.GetOrdersByStatus(parsedStatus);
        return Ok(orders);
    }

    /// <summary>
    /// Search orders by order number, customer name, or product name.
    /// </summary>
    [HttpGet("search")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(IEnumerable<Order>))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult SearchOrders([FromQuery] string? query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return BadRequest(new { message = "Search query cannot be empty." });
        }

        var orders = _orderService.SearchOrders(query);
        return Ok(orders);
    }

    /// <summary>
    /// Create a new order.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created, Type = typeof(Order))]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult CreateOrder([FromBody] CreateOrderDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdOrder = _orderService.CreateOrder(dto);
        return CreatedAtAction(nameof(GetOrderById), new { id = createdOrder.Id }, createdOrder);
    }

    /// <summary>
    /// Update an existing order.
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(Order))]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public IActionResult UpdateOrder(int id, [FromBody] UpdateOrderDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updatedOrder = _orderService.UpdateOrder(id, dto);
        if (updatedOrder == null)
        {
            return NotFound(new { message = $"Order with ID {id} was not found." });
        }

        return Ok(updatedOrder);
    }

    /// <summary>
    /// Delete an order by ID.
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public IActionResult DeleteOrder(int id)
    {
        var success = _orderService.DeleteOrder(id);
        if (!success)
        {
            return NotFound(new { message = $"Order with ID {id} was not found." });
        }

        return NoContent();
    }
}
