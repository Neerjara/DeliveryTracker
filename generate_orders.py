import csv
import random
from datetime import datetime, timedelta

TOTAL_RECORDS = 50000

first_names = ["John", "Jane", "Alice", "Bob", "Charlie", "David", "Emily", "Frank", "Grace", "Hannah", "Ian", "Julia", "Kevin", "Laura", "Michael", "Nina", "Oliver", "Paula", "Quinn", "Rachel", "Sam", "Tina", "Ulysses", "Victoria", "Will", "Xena", "Yusuf", "Zoe"]
last_names = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson", "White"]

products = [
    "Wireless Noise-Canceling Headphones",
    "Smart Fitness Watch",
    "Ergonomic Mechanical Keyboard",
    "27-inch 4K UHD Monitor",
    "Ultra Light Gaming Mouse",
    "USB-C Multiport Adapter Hub",
    "Ergonomic Standing Desk",
    "HD Webcam 1080p Autofocus",
    "Bluetooth Portable Speaker",
    "Noise-Isolating Earbuds"
]

statuses = ["Processing", "Shipped", "OutForDelivery", "Delivered", "Cancelled"]

locations = [
    "Distribution Center - Seattle WA",
    "In Transit - Chicago IL",
    "Local Courier Van - Austin TX",
    "Front Porch - San Francisco CA",
    "Warehouse - Denver CO",
    "Sorting Facility - Atlanta GA",
    "Fulfillment Hub - Dallas TX",
    "Regional Hub - Boston MA",
    "Transit Station - Phoenix AZ",
    "Logistics Center - Miami FL"
]

base_date = datetime(2026, 1, 1)

print(f"Generating {TOTAL_RECORDS:,} orders to raw_delivery_orders.csv...")

with open("raw_delivery_orders.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Id", "OrderNumber", "CustomerName", "ProductName", "Amount", "Status", "Location", "OrderDate", "EstimatedDeliveryDate"])

    for i in range(1, TOTAL_RECORDS + 1):
        cust_name = f"{random.choice(first_names)} {random.choice(last_names)}"
        prod_name = random.choice(products)
        amount = round(random.uniform(19.99, 499.99), 2)
        status = random.choice(statuses)
        location = random.choice(locations)
        
        # Random order date in last 60 days
        random_days = random.randint(0, 60)
        random_seconds = random.randint(0, 86400)
        order_date = base_date + timedelta(days=random_days, seconds=random_seconds)
        
        est_delivery = order_date + timedelta(days=random.randint(2, 6)) if status != "Cancelled" else None

        writer.writerow([
            i,
            f"ORD-{10000 + i}",
            cust_name,
            prod_name,
            f"{amount:.2f}",
            status,
            location,
            order_date.strftime("%Y-%m-%d %H:%M:%S"),
            est_delivery.strftime("%Y-%m-%d %H:%M:%S") if est_delivery else ""
        ])

print(f"SUCCESS: Created raw_delivery_orders.csv with {TOTAL_RECORDS:,} records!")
