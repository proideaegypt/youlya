import type { StoreRole } from "@/lib/middleware/assert-permission";

export type DashboardRole = StoreRole | "super_admin" | "moderator" | "customer_service";

const roleHierarchy: Record<DashboardRole, number> = {
  super_admin: 100,
  owner: 90,
  admin: 80,
  moderator: 60,
  agent: 40,
  customer_service: 30,
  viewer: 10,
};

export function roleLevel(role: DashboardRole): number {
  return roleHierarchy[role] ?? 0;
}

export function hasMinimumRole(userRole: DashboardRole, required: DashboardRole): boolean {
  return roleLevel(userRole) >= roleLevel(required);
}

export function canManageSettings(role: DashboardRole): boolean {
  return hasMinimumRole(role, "admin");
}

export function canManageSecrets(role: DashboardRole): boolean {
  return hasMinimumRole(role, "super_admin");
}

export function canManageChannels(role: DashboardRole): boolean {
  return hasMinimumRole(role, "super_admin");
}

export function canManageShipping(role: DashboardRole): boolean {
  return hasMinimumRole(role, "moderator");
}

export function canManageRoles(role: DashboardRole): boolean {
  return hasMinimumRole(role, "super_admin");
}

export function canViewDashboard(role: DashboardRole): boolean {
  return hasMinimumRole(role, "viewer");
}

export function canHandleInbox(role: DashboardRole): boolean {
  return hasMinimumRole(role, "customer_service");
}

export function canEditOwnProfile(role: DashboardRole): boolean {
  return hasMinimumRole(role, "viewer");
}

export function requireRole(userRole: DashboardRole, required: DashboardRole): void {
  if (!hasMinimumRole(userRole, required)) {
    throw new Error("forbidden: insufficient role");
  }
}
