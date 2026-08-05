export type TaskStatus =
  | "DRAFT"
  | "POSTED"
  | "ACCEPTED"
  | "HELPER_EN_ROUTE"
  | "IN_PROGRESS"
  | "AWAITING_CUSTOMER_APPROVAL"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED"
  | "REFUNDED";

export type KycStatus = "NOT_STARTED" | "PENDING" | "IN_REVIEW" | "APPROVED" | "REJECTED";
export type HelperAvailability = "ONLINE" | "OFFLINE" | "BUSY";

export interface User {
  id: string;
  phone: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  city: string;
  isHelper: boolean;
  referralCode: string;
  status: string;
  createdAt: string;
  helperProfile?: HelperProfile | null;
  adminProfile?: { id: string; permissionLevel: string } | null;
  wallet?: Wallet | null;
  addresses?: Address[];
}

export interface HelperProfile {
  id: string;
  userId: string;
  bio: string | null;
  skills: string[];
  languages: string[];
  kycStatus: KycStatus;
  availability: HelperAvailability;
  rating: string | number;
  totalJobsCompleted: number;
  totalJobsCancelled: number;
  totalEarnings: string | number;
  currentLat?: number | null;
  currentLng?: number | null;
  serviceRadiusKm?: number;
  isTopRated?: boolean;
  categories?: { category: TaskCategory }[];
  kycDocuments?: KycDocument[];
  bankAccount?: BankAccount | null;
  user?: { name: string | null; avatarUrl: string | null; city?: string; phone?: string };
}

export interface KycDocument {
  id: string;
  type: string;
  fileUrl: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string | null;
}

export interface BankAccount {
  id: string;
  accountHolderName: string;
  accountNumberMasked: string;
  ifsc: string;
  bankName: string;
  verified: boolean;
}

export interface TaskCategory {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  basePriceHint?: string | number | null;
  active: boolean;
  sortOrder: number;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
  line2?: string | null;
  landmark?: string | null;
  city: string;
  state: string;
  pincode: string;
  lat: number;
  lng: number;
  isDefault: boolean;
}

export interface Task {
  id: string;
  code: string;
  title: string;
  description: string;
  photos: string[];
  status: TaskStatus;
  priceOffered: string | number;
  priceFinal?: string | number | null;
  currency: string;
  isUrgent: boolean;
  scheduledFor?: string | null;
  completionOtp?: string;
  proofPhotos: string[];
  proofNotes?: string | null;
  createdAt: string;
  acceptedAt?: string | null;
  completedAt?: string | null;
  distanceKm?: number | null;
  category: TaskCategory;
  customer?: { id?: string; name: string | null; avatarUrl: string | null; phone?: string };
  helper?: (HelperProfile & { user?: { id?: string; name: string | null; avatarUrl: string | null; phone?: string } }) | null;
  pickupAddress?: Address | null;
  dropAddress?: Address | null;
  siteAddress?: Address | null;
  statusEvents?: TaskStatusEvent[];
  escrow?: Escrow | null;
  chat?: { id: string } | null;
  dispute?: Dispute | null;
  reviews?: Review[];
}

export interface TaskStatusEvent {
  id: string;
  status: TaskStatus;
  actorType: "CUSTOMER" | "HELPER" | "ADMIN" | "SYSTEM";
  note?: string | null;
  createdAt: string;
}

export interface Escrow {
  id: string;
  amount: string | number;
  platformFee: string | number;
  helperPayout: string | number;
  status: "HOLDING" | "RELEASED" | "REFUNDED" | "PARTIALLY_REFUNDED" | "DISPUTED_HOLD";
}

export interface Wallet {
  id: string;
  balance: string | number;
  pendingBalance: string | number;
  currency: string;
  transactions?: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  type: string;
  amount: string | number;
  balanceAfter: string | number;
  description: string;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string | null;
  tags: string[];
  direction: "CUSTOMER_TO_HELPER" | "HELPER_TO_CUSTOMER";
  createdAt: string;
  reviewer?: { name: string | null; avatarUrl: string | null };
}

export interface Dispute {
  id: string;
  reason: string;
  description: string;
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED_CUSTOMER" | "RESOLVED_HELPER" | "RESOLVED_SPLIT" | "CLOSED";
  resolutionNote?: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  readAt?: string | null;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  type: "TEXT" | "IMAGE" | "VOICE_NOTE" | "SYSTEM";
  content?: string | null;
  mediaUrl?: string | null;
  createdAt: string;
  sender?: { name: string | null; avatarUrl: string | null };
}
