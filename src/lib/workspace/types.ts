/**
 * The workspace: everything behind the sign-in, for the people who run
 * counselling rather than the students who buy it.
 */

export const ROLES = ["OWNER", "MANAGER", "ANALYST", "MENTOR"] as const;
export type Role = (typeof ROLES)[number];

export const CATEGORIES = ["GEN", "EWS", "OBC_NCL", "SC", "ST", "UNKNOWN"] as const;
export type Category = (typeof CATEGORIES)[number];

export const GENDERS = ["MALE", "FEMALE", "OTHER", "UNDISCLOSED"] as const;
export type Gender = (typeof GENDERS)[number];

export const STATUSES = ["PAID", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "REFUNDED", "CANCELLED"] as const;
export type EnrolStatus = (typeof STATUSES)[number];

export const CATEGORY_LABEL: Record<Category, string> = {
  GEN: "General",
  EWS: "EWS",
  OBC_NCL: "OBC-NCL",
  SC: "SC",
  ST: "ST",
  UNKNOWN: "Not given",
};

export const GENDER_LABEL: Record<Gender, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
  UNDISCLOSED: "Not given",
};

export const STATUS_LABEL: Record<EnrolStatus, string> = {
  PAID: "Paid",
  ASSIGNED: "Assigned",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  REFUNDED: "Refunded",
  CANCELLED: "Cancelled",
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
  /** scrypt: salt:hash, both hex */
  passwordHash: string;
  active: boolean;
  createdAt: string;

  /** Their own picture and one line about themselves. */
  avatarId: string | null;
  about: string | null;

  /* Message keys. The private half is stored already encrypted with their
     password, so what sits here is useless without it. */
  publicJwk: string | null;
  wrappedPrivate: string | null;
  keySalt: string | null;
};

export type Progress = {
  firstCallAt: string | null;
  checklistSentAt: string | null;
  shortlistSentAt: string | null;
  finalListSentAt: string | null;
};

export const EMPTY_PROGRESS: Progress = {
  firstCallAt: null,
  checklistSentAt: null,
  shortlistSentAt: null,
  finalListSentAt: null,
};

export type Enrolment = {
  id: string;
  /** The gateway's payment id. Unique, so a repeated webhook cannot duplicate. */
  paymentRef: string;
  orderRef: string | null;
  amountPaise: number;
  currency: string;
  paidAt: string;
  planCode: string | null;
  /** Someone who paid outside the gateway and was typed in by hand. */
  manualEntry: boolean;

  fullName: string;
  email: string;
  phone: string | null;
  rank: number | null;
  category: Category;
  gender: Gender;
  homeState: string | null;
  counselling: string | null;
  notes: string | null;

  status: EnrolStatus;
  mentorId: string | null;
  assignedAt: string | null;
  assignedById: string | null;

  progress: Progress;
  createdAt: string;
  /** Bumped on every write. The assignment board uses it to detect a clash. */
  updatedAt: string;
};

export type AuditAction = "signin" | "assign" | "reassign" | "unassign" | "progress" | "enrol" | "message";

export type AuditEvent = {
  id: string;
  actorId: string;
  actorName: string;
  action: AuditAction;
  enrolmentId: string | null;
  detail: string;
  createdAt: string;
};

export type Attachment = {
  id: string;
  /** The name is chosen by the sender, so it is locked with the message too. */
  name: string;
  type: string;
  size: number;
  /** Set for images, so a screenshot shows without opening it. */
  isImage: boolean;
  /** This file's own starting block, needed to unlock its bytes. */
  iv: string;
};

export type Sealed = { iv: string; data: string };

export type Message = {
  id: string;
  fromId: string;
  fromName: string;
  /** null means everyone in the workspace. */
  toId: string | null;
  toName: string | null;
  /** The locked text. The server never holds the readable version. */
  body: Sealed | null;
  /** The sender's public key, so a reader can work out the shared secret. */
  senderPublicJwk: string;
  /** The one-message key, wrapped once for each person allowed to read it. */
  keys: { userId: string; iv: string; data: string }[];
  attachments: Attachment[];
  createdAt: string;
  /** Ids of the people who have opened it. */
  readBy: string[];
};

export type Database = {
  users: User[];
  enrolments: Enrolment[];
  audit: AuditEvent[];
  messages: Message[];
};

/** Who may do what. Checked on the server for every mutation, never only in the UI. */
export const can = {
  seeEveryone: (role: Role) => role !== "MENTOR",
  assign: (role: Role) => role === "OWNER" || role === "MANAGER",
  editAnyProgress: (role: Role) => role === "OWNER" || role === "MANAGER",
  editOwnProgress: (role: Role) => role === "MENTOR",
  export: (role: Role) => role !== "MENTOR",
  /** Everyone can write to everyone. A mentor with a question needs that. */
  message: () => true,
} as const;

export const ROLE_LABEL: Record<Role, string> = {
  OWNER: "Owner",
  MANAGER: "Manager",
  ANALYST: "Analyst",
  MENTOR: "Mentor",
};

/** Where each role lands after signing in. */
export const HOME_FOR: Record<Role, string> = {
  OWNER: "/portal/overview",
  MANAGER: "/portal/overview",
  ANALYST: "/portal/overview",
  MENTOR: "/portal/my",
};
