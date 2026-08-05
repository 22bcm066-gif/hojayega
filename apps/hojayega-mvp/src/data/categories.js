import {
  Package,
  ShoppingCart,
  Timer,
  Hammer,
  Sparkles,
  Wrench,
  Truck,
  Laptop,
  ListChecks,
} from 'lucide-react'

export const CATEGORIES = [
  {
    id: 'delivery',
    name: 'Delivery',
    icon: Package,
    color: '#FF6B00',
    description: 'Parcels, food, medicines & packages moved across town.',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: ShoppingCart,
    color: '#2563EB',
    description: 'Groceries, medicines & everyday shopping, handled for you.',
  },
  {
    id: 'queue-holding',
    name: 'Queue Holding',
    icon: Timer,
    color: '#9333EA',
    description: 'RTO, passport office, banks — someone waits, you don’t.',
  },
  {
    id: 'assembly',
    name: 'Assembly',
    icon: Hammer,
    color: '#0D9488',
    description: 'Furniture, fixtures & flat-pack builds assembled fast.',
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: Sparkles,
    color: '#DB2777',
    description: 'Homes, offices & move-in cleanups, done right.',
  },
  {
    id: 'repairs',
    name: 'Repairs',
    icon: Wrench,
    color: '#CA8A04',
    description: 'Small fixes around the house, sorted quickly.',
  },
  {
    id: 'moving',
    name: 'Moving',
    icon: Truck,
    color: '#DC2626',
    description: 'Luggage, boxes & furniture shifted with care.',
  },
  {
    id: 'digital-work',
    name: 'Digital Work',
    icon: Laptop,
    color: '#4F46E5',
    description: 'Remote tasks — design, data entry, research & more.',
  },
  {
    id: 'errands',
    name: 'Errands',
    icon: ListChecks,
    color: '#16A34A',
    description: 'Printing, drop-offs, pickups & everyday to-dos.',
  },
]

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name)

export function getCategory(name) {
  return CATEGORIES.find((c) => c.name === name || c.id === name)
}
