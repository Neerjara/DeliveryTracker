namespace DeliveryTracker.Api.Models;

public class DashboardSummary
{
    public int TotalOrders { get; set; }
    public int Processing { get; set; }
    public int Shipped { get; set; }
    public int OutForDelivery { get; set; }
    public int Delivered { get; set; }
    public int Cancelled { get; set; }
    public decimal TotalOrderValue { get; set; }
}
