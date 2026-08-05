import Image from "next/image";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-14 w-14 text-base",
  xl: "h-20 w-20 text-xl",
};

export function Avatar({
  src,
  name,
  size = "md",
  className,
}: {
  src?: string | null;
  name?: string | null;
  size?: keyof typeof sizeClasses;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-100 font-semibold text-brand-700 dark:text-brand-300",
        sizeClasses[size],
        className,
      )}
    >
      {src ? (
        <Image src={src} alt={name ?? "avatar"} fill sizes="80px" className="object-cover" />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}
