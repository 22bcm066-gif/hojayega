import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { formatInr } from "@/lib/utils";
import type { TaskCategory } from "@/lib/types";

const FALLBACK_CATEGORIES: TaskCategory[] = [
  { id: "1", slug: "grocery-pickup", name: "Grocery pickup", icon: "shopping-cart", description: "Pick up groceries from a store or market and deliver them to your door.", basePriceHint: 150, active: true, sortOrder: 1 },
  { id: "2", slug: "document-pickup", name: "Document pickup & drop", icon: "file-text", description: "Collect or deliver documents between offices, homes, and government counters.", basePriceHint: 120, active: true, sortOrder: 2 },
  { id: "3", slug: "queue-standing", name: "Queue standing", icon: "users", description: "A verified helper stands in line for you.", basePriceHint: 200, active: true, sortOrder: 3 },
  { id: "4", slug: "shopping", name: "Shopping assistance", icon: "shopping-bag", description: "Buy specific items from a list at a shop or mall on your behalf.", basePriceHint: 150, active: true, sortOrder: 4 },
  { id: "5", slug: "handyman", name: "Small handyman jobs", icon: "wrench", description: "Minor fixes, mounting, and small repairs around the house.", basePriceHint: 250, active: true, sortOrder: 5 },
  { id: "6", slug: "medicine-delivery", name: "Medicine delivery", icon: "pill", description: "Pick up prescriptions from a pharmacy and deliver them.", basePriceHint: 100, active: true, sortOrder: 6 },
  { id: "7", slug: "furniture-assembly", name: "Furniture assembly", icon: "hammer", description: "Assemble flat-pack furniture, including IKEA pieces.", basePriceHint: 350, active: true, sortOrder: 7 },
  { id: "8", slug: "airport-pickup", name: "Airport pickup & drop", icon: "plane", description: "Reliable pickup or drop-off to the airport.", basePriceHint: 400, active: true, sortOrder: 8 },
];

async function getCategories(): Promise<TaskCategory[]> {
  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";
    const res = await fetch(`${base}/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return FALLBACK_CATEGORIES;
    const data = (await res.json()) as TaskCategory[];
    return data.length ? data.slice(0, 8) : FALLBACK_CATEGORIES;
  } catch {
    return FALLBACK_CATEGORIES;
  }
}

export async function PopularTasks() {
  const categories = await getCategories();

  return (
    <section id="tasks" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Popular tasks in Ahmedabad</h2>
          <p className="mt-3 max-w-xl text-lg text-muted">
            We launched focused on the errands people need most — more categories are rolling out as the helper network grows.
          </p>
        </div>
        <Link href="/login" className="hidden shrink-0 items-center gap-1 text-sm font-medium text-brand-600 hover:underline sm:flex dark:text-brand-300">
          Post a task <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href="/login"
            className="group rounded-2xl border border-border bg-surface p-5 shadow-soft transition-all hover:-translate-y-1 hover:shadow-raised"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 transition-colors group-hover:bg-brand-100">
              <CategoryIcon icon={cat.icon} className="h-5 w-5 text-brand-500" />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">{cat.name}</h3>
            <p className="mt-1 line-clamp-2 text-xs text-muted">{cat.description}</p>
            {cat.basePriceHint && (
              <p className="mt-3 text-xs font-medium text-muted">From {formatInr(cat.basePriceHint)}</p>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
