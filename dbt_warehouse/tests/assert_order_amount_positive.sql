-- Data Quality Test: Ensure no orders have negative or zero amounts
SELECT order_id, amount
FROM {{ ref('stg_orders') }}
WHERE amount <= 0
