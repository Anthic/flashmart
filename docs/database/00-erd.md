# 00 - ERD

```mermaid
erDiagram
    USERS ||--o{ REFRESH_TOKENS : has
    USERS ||--o{ ORDERS : places
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : "appears in"
    PRODUCTS ||--|| INVENTORY : has
    PRODUCTS ||--o{ FLASH_SALE_ITEMS : "sold in"
    FLASH_SALES ||--|{ FLASH_SALE_ITEMS : includes
    ORDERS ||--o{ PAYMENTS : "paid by"
    CATEGORIES ||--o{ PRODUCTS : groups

    USERS {
        uuid id PK
        string email UK
        string password_hash
        string name
        enum role
        timestamptz created_at
        timestamptz updated_at
    }
    REFRESH_TOKENS {
        uuid id PK
        uuid user_id FK
        string token_hash UK
        uuid family_id
        timestamptz expires_at
        timestamptz revoked_at
    }
    CATEGORIES {
        uuid id PK
        string name UK
        string slug UK
    }
    PRODUCTS {
        uuid id PK
        uuid category_id FK
        string name
        text description
        int price_cents
        enum status
        timestamptz created_at
        timestamptz updated_at
    }
    INVENTORY {
        uuid product_id PK
        int available
        int reserved
        int version
        timestamptz updated_at
    }
    FLASH_SALES {
        uuid id PK
        string title
        timestamptz starts_at
        timestamptz ends_at
        enum status
    }
    FLASH_SALE_ITEMS {
        uuid flash_sale_id PK
        uuid product_id PK
        int sale_price_cents
        int sale_quantity
        int per_user_limit
    }
    ORDERS {
        uuid id PK
        uuid user_id FK
        enum status
        int total_cents
        string idempotency_key UK
        timestamptz created_at
        timestamptz updated_at
    }
    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid product_id FK
        int quantity
        int unit_price_cents
    }
    PAYMENTS {
        uuid id PK
        uuid order_id FK
        enum status
        int amount_cents
        string provider_ref
        string idempotency_key UK
        timestamptz created_at
    }
    OUTBOX_EVENTS {
        uuid id PK
        string aggregate_type
        uuid aggregate_id
        string event_type
        jsonb payload
        timestamptz created_at
        timestamptz published_at
    }
    PROCESSED_MESSAGES {
        string message_id PK
        string consumer PK
        timestamptz processed_at
    }
```

## Relationship notes
- 1 user -> many orders; 1 order -> many items; 1 order -> maybe many payment attempts
- inventory is 1:1 with product (split from products because it is updated far more often: avoids bloating hot rows)
- order_items copies unit_price_cents so later price changes never rewrite history
- outbox_events and processed_messages are infrastructure tables (Phase 3 and 5)