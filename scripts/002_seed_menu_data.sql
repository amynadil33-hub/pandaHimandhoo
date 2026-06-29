-- Panda Restaurant — Menu seed data
-- Run after 001_create_menu_schema.sql. Safe to re-run (idempotent on slug/name).

-- ---------------------------------------------------------------------------
-- Categories
-- ---------------------------------------------------------------------------
insert into public.menu_categories (name, slug, description, sort_order, is_active)
values
  ('Breakfast',            'breakfast',            'Start your island morning with comforting breakfast plates.', 1, true),
  ('Maldivian Favourites', 'maldivian-favourites', 'Local flavours and home-style Maldivian cooking.',           2, true),
  ('Fried Rice & Noodles', 'fried-rice-noodles',   'Wok-tossed rice and noodle bowls, made fresh.',              3, true),
  ('Kothu Roshi',          'kothu-roshi',          'Chopped roshi stir-fried with your choice of filling.',      4, true),
  ('Biryani & Rice Meals', 'biryani-rice-meals',   'Fragrant biryanis and hearty rice bowls.',                   5, true),
  ('Pasta',                'pasta',                'Western pasta favourites with an island twist.',             6, true),
  ('Sandwiches & Snacks',  'sandwiches-snacks',    'Quick bites, sandwiches, and shareable snacks.',             7, true),
  ('Drinks',               'drinks',               'Fresh juices, hot drinks, and refreshments.',                8, true)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Items
-- Uses a CTE to resolve category ids from slugs.
-- ---------------------------------------------------------------------------
with cat as (
  select id, slug from public.menu_categories
)
insert into public.menu_items
  (category_id, name, description, price_mvr, badges, is_popular, sort_order)
select c.id, v.name, v.description, v.price_mvr, v.badges, v.is_popular, v.sort_order
from (
  values
    -- Breakfast
    ('breakfast', 'Maldivian Breakfast Set', 'Mas huni, roshi, boiled egg, and tea.', 65, array['Breakfast','Local Favourite'], true, 1),
    ('breakfast', 'Continental Breakfast', 'Toast, eggs, sausage, fruit, and tea or coffee.', 85, array['Breakfast'], false, 2),
    ('breakfast', 'Omelette Plate', 'Fluffy omelette served with toast.', 55, array['Breakfast'], false, 3),
    ('breakfast', 'Pancakes with Honey', 'Stack of pancakes drizzled with honey.', 60, array['Breakfast'], false, 4),
    ('breakfast', 'Tuna & Egg Roshi Wrap', 'Roshi wrap filled with spiced tuna and egg.', 50, array['Breakfast'], false, 5),

    -- Maldivian Favourites
    ('maldivian-favourites', 'Mas Huni & Roshi', 'Classic shredded tuna with coconut, served with roshi.', 45, array['Local Favourite'], true, 1),
    ('maldivian-favourites', 'Garudhiya Rice Meal', 'Traditional tuna broth with rice and sides.', 75, array['Local Favourite'], false, 2),
    ('maldivian-favourites', 'Rihaakuru Fried Rice', 'Fried rice with rich Maldivian fish paste.', 80, array['Local Favourite'], false, 3),
    ('maldivian-favourites', 'Tuna Curry with Rice', 'Spiced tuna curry served with steamed rice.', 85, array[]::text[], false, 4),
    ('maldivian-favourites', 'Grilled Fish with Rice & Salad', 'Fresh grilled fish with rice and garden salad.', 120, array['Chef''s Pick'], true, 5),

    -- Fried Rice & Noodles
    ('fried-rice-noodles', 'Chicken Fried Rice', 'Wok-fried rice with chicken and vegetables.', 80, array['Popular'], true, 1),
    ('fried-rice-noodles', 'Tuna Fried Rice', 'Fried rice tossed with local tuna.', 75, array[]::text[], false, 2),
    ('fried-rice-noodles', 'Egg Fried Rice', 'Simple, comforting egg fried rice.', 65, array[]::text[], false, 3),
    ('fried-rice-noodles', 'Vegetable Fried Rice', 'Fried rice with mixed garden vegetables.', 60, array[]::text[], false, 4),
    ('fried-rice-noodles', 'Seafood Fried Rice', 'Fried rice loaded with mixed seafood.', 95, array['Chef''s Pick'], false, 5),
    ('fried-rice-noodles', 'Chicken Noodles', 'Stir-fried noodles with chicken and vegetables.', 80, array[]::text[], false, 6),
    ('fried-rice-noodles', 'Vegetable Noodles', 'Stir-fried noodles with mixed vegetables.', 65, array[]::text[], false, 7),

    -- Kothu Roshi
    ('kothu-roshi', 'Chicken Kothu Roshi', 'Chopped roshi stir-fried with chicken and spices.', 85, array['Popular'], true, 1),
    ('kothu-roshi', 'Tuna Kothu Roshi', 'Chopped roshi stir-fried with tuna.', 80, array['Local Favourite'], false, 2),
    ('kothu-roshi', 'Beef Kothu Roshi', 'Chopped roshi stir-fried with tender beef.', 95, array[]::text[], false, 3),
    ('kothu-roshi', 'Vegetable Kothu Roshi', 'Chopped roshi stir-fried with vegetables.', 70, array[]::text[], false, 4),
    ('kothu-roshi', 'Cheese Kothu Roshi', 'Chopped roshi with melted cheese and spices.', 90, array['New'], false, 5),

    -- Biryani & Rice Meals
    ('biryani-rice-meals', 'Chicken Biryani', 'Fragrant spiced rice with chicken.', 95, array['Popular'], true, 1),
    ('biryani-rice-meals', 'Fish Biryani', 'Spiced biryani rice with local fish.', 95, array[]::text[], false, 2),
    ('biryani-rice-meals', 'Beef Biryani', 'Rich biryani rice with tender beef.', 110, array['Chef''s Pick'], false, 3),
    ('biryani-rice-meals', 'Vegetable Biryani', 'Aromatic biryani rice with vegetables.', 75, array[]::text[], false, 4),
    ('biryani-rice-meals', 'Chicken Rice Bowl', 'Comforting rice bowl with seasoned chicken.', 90, array[]::text[], false, 5),

    -- Pasta
    ('pasta', 'Chicken Alfredo Pasta', 'Creamy alfredo pasta with chicken.', 110, array['Popular'], true, 1),
    ('pasta', 'Tomato Basil Pasta', 'Pasta in a fresh tomato and basil sauce.', 90, array[]::text[], false, 2),
    ('pasta', 'Tuna Pasta', 'Pasta tossed with local tuna.', 95, array[]::text[], false, 3),
    ('pasta', 'Seafood Pasta', 'Pasta with mixed seafood in a savoury sauce.', 125, array['Chef''s Pick'], false, 4),
    ('pasta', 'Spicy Chicken Pasta', 'Pasta with chicken and a spicy kick.', 105, array['New'], false, 5),

    -- Sandwiches & Snacks
    ('sandwiches-snacks', 'Chicken Sandwich', 'Grilled chicken sandwich with fresh fillings.', 65, array[]::text[], false, 1),
    ('sandwiches-snacks', 'Tuna Sandwich', 'Classic tuna sandwich.', 60, array['Local Favourite'], false, 2),
    ('sandwiches-snacks', 'Club Sandwich', 'Triple-stacked club sandwich.', 85, array['Popular'], true, 3),
    ('sandwiches-snacks', 'Egg Sandwich', 'Simple egg sandwich.', 45, array[]::text[], false, 4),
    ('sandwiches-snacks', 'Chicken Submarine', 'Loaded chicken sub roll.', 95, array[]::text[], false, 5),
    ('sandwiches-snacks', 'French Fries', 'Crispy golden fries.', 45, array[]::text[], false, 6),
    ('sandwiches-snacks', 'Chicken Nuggets', 'Crispy chicken nuggets.', 60, array[]::text[], false, 7),

    -- Drinks
    ('drinks', 'Fresh Juice', 'Seasonal fresh fruit juice.', 45, array['Popular'], true, 1),
    ('drinks', 'Iced Tea', 'Chilled iced tea.', 35, array[]::text[], false, 2),
    ('drinks', 'Lime Juice', 'Refreshing fresh lime juice.', 30, array[]::text[], false, 3),
    ('drinks', 'Soft Drinks', 'Assorted soft drinks.', 25, array[]::text[], false, 4),
    ('drinks', 'Bottled Water', 'Chilled bottled water.', 15, array[]::text[], false, 5),
    ('drinks', 'Coffee', 'Freshly brewed coffee.', 30, array[]::text[], false, 6),
    ('drinks', 'Tea', 'Hot tea.', 15, array[]::text[], false, 7)
) as v(cat_slug, name, description, price_mvr, badges, is_popular, sort_order)
join cat c on c.slug = v.cat_slug
where not exists (
  select 1 from public.menu_items mi where mi.name = v.name
);
