import type { MenuCategory } from '@/lib/menu'

let counter = 0
const id = () => `fallback-${++counter}`

type SeedItem = [name: string, description: string, price: number, badges: string[], popular?: boolean]

function makeCategory(
  name: string,
  slug: string,
  description: string,
  sort_order: number,
  items: SeedItem[],
): MenuCategory {
  const category_id = id()
  return {
    id: category_id,
    name,
    slug,
    description,
    sort_order,
    items: items.map(([itemName, desc, price, badges, popular], index) => ({
      id: id(),
      category_id,
      name: itemName,
      description: desc,
      price_mvr: price,
      image_url: null,
      badges,
      is_popular: Boolean(popular),
      is_available: true,
      sort_order: index + 1,
    })),
  }
}

/** Mirror of scripts/002_seed_menu_data.sql so the site renders before Supabase is connected. */
export const fallbackMenu: MenuCategory[] = [
  makeCategory('Breakfast', 'breakfast', 'Start your island morning with comforting breakfast plates.', 1, [
    ['Maldivian Breakfast Set', 'Mas huni, roshi, boiled egg, and tea.', 65, ['Breakfast', 'Local Favourite'], true],
    ['Continental Breakfast', 'Toast, eggs, sausage, fruit, and tea or coffee.', 85, ['Breakfast']],
    ['Omelette Plate', 'Fluffy omelette served with toast.', 55, ['Breakfast']],
    ['Pancakes with Honey', 'Stack of pancakes drizzled with honey.', 60, ['Breakfast']],
    ['Tuna & Egg Roshi Wrap', 'Roshi wrap filled with spiced tuna and egg.', 50, ['Breakfast']],
  ]),
  makeCategory('Maldivian Favourites', 'maldivian-favourites', 'Local flavours and home-style Maldivian cooking.', 2, [
    ['Mas Huni & Roshi', 'Classic shredded tuna with coconut, served with roshi.', 45, ['Local Favourite'], true],
    ['Garudhiya Rice Meal', 'Traditional tuna broth with rice and sides.', 75, ['Local Favourite']],
    ['Rihaakuru Fried Rice', 'Fried rice with rich Maldivian fish paste.', 80, ['Local Favourite']],
    ['Tuna Curry with Rice', 'Spiced tuna curry served with steamed rice.', 85, []],
    ['Grilled Fish with Rice & Salad', 'Fresh grilled fish with rice and garden salad.', 120, ["Chef's Pick"], true],
  ]),
  makeCategory('Fried Rice & Noodles', 'fried-rice-noodles', 'Wok-tossed rice and noodle bowls, made fresh.', 3, [
    ['Chicken Fried Rice', 'Wok-fried rice with chicken and vegetables.', 80, ['Popular'], true],
    ['Tuna Fried Rice', 'Fried rice tossed with local tuna.', 75, []],
    ['Egg Fried Rice', 'Simple, comforting egg fried rice.', 65, []],
    ['Vegetable Fried Rice', 'Fried rice with mixed garden vegetables.', 60, []],
    ['Seafood Fried Rice', 'Fried rice loaded with mixed seafood.', 95, ["Chef's Pick"]],
    ['Chicken Noodles', 'Stir-fried noodles with chicken and vegetables.', 80, []],
    ['Vegetable Noodles', 'Stir-fried noodles with mixed vegetables.', 65, []],
  ]),
  makeCategory('Kothu Roshi', 'kothu-roshi', 'Chopped roshi stir-fried with your choice of filling.', 4, [
    ['Chicken Kothu Roshi', 'Chopped roshi stir-fried with chicken and spices.', 85, ['Popular'], true],
    ['Tuna Kothu Roshi', 'Chopped roshi stir-fried with tuna.', 80, ['Local Favourite']],
    ['Beef Kothu Roshi', 'Chopped roshi stir-fried with tender beef.', 95, []],
    ['Vegetable Kothu Roshi', 'Chopped roshi stir-fried with vegetables.', 70, []],
    ['Cheese Kothu Roshi', 'Chopped roshi with melted cheese and spices.', 90, ['New']],
  ]),
  makeCategory('Biryani & Rice Meals', 'biryani-rice-meals', 'Fragrant biryanis and hearty rice bowls.', 5, [
    ['Chicken Biryani', 'Fragrant spiced rice with chicken.', 95, ['Popular'], true],
    ['Fish Biryani', 'Spiced biryani rice with local fish.', 95, []],
    ['Beef Biryani', 'Rich biryani rice with tender beef.', 110, ["Chef's Pick"]],
    ['Vegetable Biryani', 'Aromatic biryani rice with vegetables.', 75, []],
    ['Chicken Rice Bowl', 'Comforting rice bowl with seasoned chicken.', 90, []],
  ]),
  makeCategory('Pasta', 'pasta', 'Western pasta favourites with an island twist.', 6, [
    ['Chicken Alfredo Pasta', 'Creamy alfredo pasta with chicken.', 110, ['Popular'], true],
    ['Tomato Basil Pasta', 'Pasta in a fresh tomato and basil sauce.', 90, []],
    ['Tuna Pasta', 'Pasta tossed with local tuna.', 95, []],
    ['Seafood Pasta', 'Pasta with mixed seafood in a savoury sauce.', 125, ["Chef's Pick"]],
    ['Spicy Chicken Pasta', 'Pasta with chicken and a spicy kick.', 105, ['New']],
  ]),
  makeCategory('Sandwiches & Snacks', 'sandwiches-snacks', 'Quick bites, sandwiches, and shareable snacks.', 7, [
    ['Chicken Sandwich', 'Grilled chicken sandwich with fresh fillings.', 65, []],
    ['Tuna Sandwich', 'Classic tuna sandwich.', 60, ['Local Favourite']],
    ['Club Sandwich', 'Triple-stacked club sandwich.', 85, ['Popular'], true],
    ['Egg Sandwich', 'Simple egg sandwich.', 45, []],
    ['Chicken Submarine', 'Loaded chicken sub roll.', 95, []],
    ['French Fries', 'Crispy golden fries.', 45, []],
    ['Chicken Nuggets', 'Crispy chicken nuggets.', 60, []],
  ]),
  makeCategory('Drinks', 'drinks', 'Fresh juices, hot drinks, and refreshments.', 8, [
    ['Fresh Juice', 'Seasonal fresh fruit juice.', 45, ['Popular'], true],
    ['Iced Tea', 'Chilled iced tea.', 35, []],
    ['Lime Juice', 'Refreshing fresh lime juice.', 30, []],
    ['Soft Drinks', 'Assorted soft drinks.', 25, []],
    ['Bottled Water', 'Chilled bottled water.', 15, []],
    ['Coffee', 'Freshly brewed coffee.', 30, []],
    ['Tea', 'Hot tea.', 15, []],
  ]),
]
