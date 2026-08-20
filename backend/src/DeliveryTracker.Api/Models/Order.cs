namespace DeliveryTracker.Api.Models;

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public OrderStatus Status { get; set; }
    public string Location { get; set; } = string.Empty;
    public DateTime OrderDate { get; set; }
    public DateTime? EstimatedDeliveryDate { get; set; }
}
