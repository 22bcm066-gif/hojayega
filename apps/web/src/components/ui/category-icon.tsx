import {
  ShoppingCart,
  FileText,
  Users,
  ShoppingBag,
  Wrench,
  Pill,
  Package,
  Hammer,
  Zap,
  Droplet,
  Printer,
  Laptop,
  Plane,
  Clock,
  PawPrint,
  Sprout,
  Monitor,
  Camera,
  Car,
  Shirt,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "shopping-cart": ShoppingCart,
  "file-text": FileText,
  users: Users,
  "shopping-bag": ShoppingBag,
  wrench: Wrench,
  pill: Pill,
  package: Package,
  hammer: Hammer,
  zap: Zap,
  droplet: Droplet,
  printer: Printer,
  laptop: Laptop,
  plane: Plane,
  clock: Clock,
  "paw-print": PawPrint,
  sprout: Sprout,
  monitor: Monitor,
  camera: Camera,
  car: Car,
  shirt: Shirt,
  sparkles: Sparkles,
};

export function CategoryIcon({ icon, className }: { icon: string; className?: string }) {
  const Icon = ICON_MAP[icon] ?? Sparkles;
  return <Icon className={className} />;
}
