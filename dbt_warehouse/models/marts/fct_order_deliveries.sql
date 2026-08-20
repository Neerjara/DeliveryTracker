WITH orders AS (
    SELECT * FROM {{ ref('stg_orders') }}
)

SELECT
    status,
    COUNT(order_id) AS total_orders,
    ROUND(SUM(amount), 2) AS total_order_value,
    ROUND(AVG(amount), 2) AS avg_order_value,
    ROUND(AVG(DATEDIFF(day, order_date, estimated_delivery_date)), 1) AS avg_estimated_days
FROM orders
GROUP BY status
ORDER BY total_orders DESC
