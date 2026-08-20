WITH source AS (
    SELECT * FROM {{ source('raw_data', 'raw_orders') }}
)

SELECT
    CAST(id AS INT) AS order_id,
    TRIM(order_number) AS order_number,
    TRIM(customer_name) AS customer_name,
    TRIM(product_name) AS product_name,
    CAST(amount AS DECIMAL(10, 2)) AS amount,
    TRIM(status) AS status,
    TRIM(location) AS location,
    CAST(order_date AS TIMESTAMP) AS order_date,
    CAST(estimated_delivery_date AS TIMESTAMP) AS estimated_delivery_date,
    CURRENT_TIMESTAMP() AS _ingested_at
FROM source
