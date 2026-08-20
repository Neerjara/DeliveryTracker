using System.ComponentModel.DataAnnotations;

namespace DeliveryTracker.Api.Models;

public class UpdateOrderDto
{
    [Required(ErrorMessage = "Customer name is required.")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "Customer name must be between 2 and 100 characters.")]
    public string CustomerName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Product name is required.")]
    [StringLength(150, MinimumLength = 2, ErrorMessage = "Product name must be between 2 and 150 characters.")]
    public string ProductName { get; set; } = string.Empty;

    [Range(0.01, 100000.00, ErrorMessage = "Amount must be greater than 0.")]
    public decimal Amount { get; set; }

    public OrderStatus Status { get; set; }

    [Required(ErrorMessage = "Location is required.")]
    public string Location { get; set; } = string.Empty;

    public DateTime OrderDate { get; set; }
    public DateTime? EstimatedDeliveryDate { get; set; }
}
