"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingStars({
  value,
  onChange,
  size = 20,
  readonly = false,
}: {
  value: number;
  onChange?: (value: number) => void;
  size?: number;
  readonly?: boolean;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn("transition-transform", !readonly && "hover:scale-110 cursor-pointer")}
          aria-label={`${star} star`}
        >
          <Star
            size={size}
            className={star <= Math.round(value) ? "fill-accent-400 text-accent-400" : "fill-transparent text-border-strong"}
          />
        </button>
      ))}
    </div>
  );
}
