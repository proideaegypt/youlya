"use client";

import { useState } from "react";
import { ShoppingBag, Search, Filter, Eye } from "lucide-react";

const sampleOrders = [
  { id: "#Y-1024", customer: "Nour", total: "1,280 EGP", status: "confirmed", safety: "safe", createdAt: "2026-05-01 14:30" },
  { id: "#Y-1023", customer: "Maha", total: "940 EGP", status: "pending", safety: "review", createdAt: "2026-05-01 13:15" },
  { id: "#Y-1022", customer: "Ahmed", total: "2,100 EGP", status: "confirmed", safety: "safe", createdAt: "2026-05-01 11:45" },
  { id: "#Y-1021", customer: "Fatima", total: "750 EGP", status: "pending", safety: "safe", createdAt: "2026-05-01 10:20" },
];

const statusBadge = (status: string) => {
  const classes: Record<string, string> = {
    confirmed: "bg-emerald-500/15 text-emerald-500",
    pending: "bg-amber-500/15 text-amber-500",
    cancelled: "bg-red-500/15 text-red-400",
  };
  return classes[status] || "bg-muted text-muted-foreground";
};

const safetyBadge = (safety: string) => {
  const classes: Record<string, string> = {
    safe: "bg-emerald-500/15 text-emerald-500",
    review: "bg-amber-500/15 text-amber-500",
  };
  return classes[safety] || "bg-muted text-muted-foreground";
};

export default function OrdersPage() {
  const [filter, setFilter] = useState<"all" | "confirmed" | "pending">("all");
  const [search, setSearch] = useState("");

  const filteredOrders = sampleOrders.filter((order) => {
    if (filter !== "all" && order.status !== filter) return false;
    if (search && !order.id.toLowerCase().includes(search.toLowerCase()) && !order.customer.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <section className="rounded-2xl bg-card p-6 md:p-8 shadow-sm ring-1 ring-border">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-balance text-2xl font-semibold text-foreground">الطلبات</h1>
          <p className="mt-2 text-muted-foreground">Orders</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 rounded-full border border-border bg-background pl-9 pr-3 text-sm"
              aria-label="Search orders"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="h-10 rounded-full border border-border bg-background px-3 text-sm"
            aria-label="Filter orders by status"
          >
            <option value="all">All</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/15">
              <ShoppingBag className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total Orders</p>
              <p className="text-xl font-bold">{sampleOrders.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15">
              <Filter className="h-5 w-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Confirmed</p>
              <p className="text-xl font-bold">{sampleOrders.filter((o) => o.status === "confirmed").length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-background p-4 ring-1 ring-border">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15">
              <Filter className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{sampleOrders.filter((o) => o.status === "pending").length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredOrders.length === 0 ? (
        <div className="flex min-h-[140px] items-center justify-center rounded-xl border border-dashed border-border bg-background p-6 text-center">
          <p className="text-sm text-muted-foreground">No orders match your filters.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs font-semibold text-muted-foreground">
                <th className="px-3 py-3 text-start">Order</th>
                <th className="px-3 py-3 text-start">Customer</th>
                <th className="px-3 py-3 text-start">Total</th>
                <th className="px-3 py-3 text-start">Status</th>
                <th className="px-3 py-3 text-start">Safety</th>
                <th className="px-3 py-3 text-start">Created</th>
                <th className="px-3 py-3 text-start"></th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50 transition hover:bg-muted">
                  <td className="px-3 py-3 font-semibold">{order.id}</td>
                  <td className="px-3 py-3">{order.customer}</td>
                  <td className="px-3 py-3 font-medium">{order.total}</td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${safetyBadge(order.safety)}`}>
                      {order.safety}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-muted-foreground">{order.createdAt}</td>
                  <td className="px-3 py-3">
                    <button className="inline-flex items-center gap-1 rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition hover:bg-muted">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
