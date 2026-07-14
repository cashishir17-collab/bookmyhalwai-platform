export type UserRole = "customer" | "vendor" | "sales" | "admin";

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  phoneNumber?: string | null;
  role: UserRole;
  createdAt?: unknown;
  updatedAt?: unknown;
}
