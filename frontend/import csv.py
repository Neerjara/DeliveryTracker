import csv
import random
from datetime import datetime, timedelta
from Faker import Faker

fake = Faker()
TOTAL_RECORDS = 50000  # Generate 50k orders

statuses = ["Processing", "Shipped", "OutForDelivery", "Delivered", "Cancelled"]
products = [
    "Wireless Headphones", "Smart Fitness Watch", "Ergonomic Keyboard",
    "27-inch 4K Monitor", "Gaming Mouse", "USB-C Multiport Adapter"
]

with open("raw_delivery_orders.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Id", "OrderNumber", "CustomerName", "ProductName", "Amount", "Status", "Location", "OrderDate", "EstimatedDeliveryDate"])

    for i in range(1, TOTAL_RECORDS + 1):
        status = random.choice(statuses)
        order_date = fake.date_time_between(start_date="-30d", end_date="now")
        est_delivery = order_date + timedelta(days=random.randint(2, 7)) if status != "Cancelled" else None

        writer.writerow([
            i,
            f"ORD-{10000 + i}",
            fake.name(),
            random.choice(products),
            round(random.uniform(19.99, 599.99), 2),
            status,
            f"{fake.street_address()}, {fake.city()} {fake.state_abbr()}",
            order_date.strftime("%Y-%m-%d %H:%M:%S"),
            est_delivery.strftime("%Y-%m-%d %H:%M:%S") if est_delivery else ""
        ])

print(f"Generated raw_delivery_orders.csv with {TOTAL_RECORDS} records!")