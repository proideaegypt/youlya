export type StoreRole = "owner" | "admin" | "agent" | "viewer";

export class PermissionError extends Error {
  constructor(message = "forbidden") {
    super(message);
  }
}

const rolePermissions: Record<StoreRole, string[]> = {
  owner: ["*"],
  admin: [
    "orders:create",
    "orders:update",
    "orders:cancel",
    "products:read",
    "conversations:read",
    "handoff:create",
    "settings:read",
  ],
  agent: ["orders:create", "products:read", "conversations:read", "handoff:create"],
  viewer: ["products:read", "conversations:read"],
};

export function assertPermission(role: StoreRole, permission: string): void {
  const allowed = rolePermissions[role] ?? [];
  if (allowed.includes("*") || allowed.includes(permission)) return;
  throw new PermissionError();
}

