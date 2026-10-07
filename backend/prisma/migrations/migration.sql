ALTER TABLE "products"
ADD CONSTRAINT "products_price_cents_positive"
CHECK ("price_cents" > 0);

ALTER TABLE "inventory"
ADD CONSTRAINT "inventory_available_non_negative"
CHECK ("available" >= 0);

ALTER TABLE "inventory"
ADD CONSTRAINT "inventory_reserved_non_negative"
CHECK ("reserved" >= 0);

ALTER TABLE "orders"
ADD CONSTRAINT "orders_total_cents_non_negative"
CHECK ("total_cents" >= 0);

ALTER TABLE "order_items"
ADD CONSTRAINT "order_items_quantity_positive"
CHECK ("quantity" > 0);

ALTER TABLE "payments"
ADD CONSTRAINT "payments_amount_cents_positive"
CHECK ("amount_cents" > 0);