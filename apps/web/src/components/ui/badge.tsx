import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "success" | "warning" | "danger" | "info";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-surface-raised text-muted border border-border",
  brand: "bg-brand-50 text-brand-700 dark:text-brand-300",
  success: "bg-success-bg text-success",
  warning: "bg-warning-bg text-warning",
  danger: "bg-danger-bg text-danger",
  info: "bg-info-bg text-info",
};

export function Badge({ tone = "neutral", className, ...props }: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}

const TASK_STATUS_TONE: Record<string, Tone> = {
  DRAFT: "neutral",
  POSTED: "info",
  ACCEPTED: "brand",
  HELPER_EN_ROUTE: "brand",
  IN_PROGRESS: "warning",
  AWAITING_CUSTOMER_APPROVAL: "warning",
  COMPLETED: "success",
  CANCELLED: "neutral",
  DISPUTED: "danger",
  REFUNDED: "neutral",
};

const TASK_STATUS_LABEL: Record<string, string> = {
  DRAFT: "Draft",
  POSTED: "Finding a helper",
  ACCEPTED: "Helper assigned",
  HELPER_EN_ROUTE: "Helper en route",
  IN_PROGRESS: "In progress",
  AWAITING_CUSTOMER_APPROVAL: "Awaiting your approval",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  DISPUTED: "Disputed",
  REFUNDED: "Refunded",
};

export function TaskStatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge tone={TASK_STATUS_TONE[status] ?? "neutral"} className={className}>
      {TASK_STATUS_LABEL[status] ?? status}
    </Badge>
  );
}

const KYC_TONE: Record<string, Tone> = {
  NOT_STARTED: "neutral",
  PENDING: "warning",
  IN_REVIEW: "warning",
  APPROVED: "success",
  REJECTED: "danger",
};

export function KycStatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <Badge tone={KYC_TONE[status] ?? "neutral"} className={className}>
      {status.replace("_", " ")}
    </Badge>
  );
}
