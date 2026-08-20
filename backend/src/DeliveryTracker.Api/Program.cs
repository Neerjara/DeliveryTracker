using System.Text.Json.Serialization;
using DeliveryTracker.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Convert Enums to string representation (e.g. "Processing" instead of 0)
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

// Register OrderService using ASP.NET Core Dependency Injection
builder.Services.AddSingleton<IOrderService, OrderService>();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "DeliveryTracker API",
        Version = "v1",
        Description = "ASP.NET Core Web API for Order Delivery Tracker (Microservice)"
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "DeliveryTracker API v1");
    c.RoutePrefix = "swagger";
});

app.UseCors("AllowFrontend");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
