import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatTile({
  icon: Icon,
  label,
  value,
  hint,
  className,
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl border border-border bg-surface p-4 shadow-soft", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50">
            <Icon className="h-3.5 w-3.5 text-brand-500" />
          </div>
        )}
      </div>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}
