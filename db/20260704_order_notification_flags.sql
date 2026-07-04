alter table orders
add column if not exists new_order_telegram_sent boolean default false,
add column if not exists confirmed_order_telegram_sent boolean default false,
add column if not exists last_notification_sent_at timestamp with time zone;
