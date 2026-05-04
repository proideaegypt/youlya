import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import {
  channelDisplayLabel,
  getOrderChannel,
  getOrderTotal,
  getPrimaryOrderProductKey,
  supportedInsightChannels,
} from "@/lib/services/products-intelligence-service";

function unauthorized() {
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

const STORE_ID = "ef77af08-688d-4354-8096-d89f6046f0c2";

export async function GET() {
  const cookieStore = await cookies();
  const hasSession = cookieStore.getAll().some((c) => c.name.startsWith("sb-"));
  if (!hasSession) return unauthorized();

  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return NextResponse.json({
      hasData: false,
      totalOrders: 0,
      ordersByChannel: [],
      revenueByChannel: [],
      topProductsByChannel: [],
      supportedChannels: supportedInsightChannels.map((channel) => ({
        channel,
        label: channelDisplayLabel(channel),
        ordersCount: 0,
        revenue: 0,
        topProduct: null,
        hasData: false,
      })),
      message: "لا توجد بيانات قنوات متاحة",
    });
  }

  try {
    const { count: totalOrders } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("store_id", STORE_ID);

    const hasData = (totalOrders ?? 0) > 0;

    if (!hasData) {
      return NextResponse.json({
        hasData: false,
        totalOrders: 0,
        ordersByChannel: [],
        revenueByChannel: [],
        topProductsByChannel: [],
        message: "ستظهر تحليلات القنوات بعد ربط القنوات وتسجيل الطلبات",
      });
    }

    // Fetch orders with channel info
    const { data: orders } = await supabase
      .from("orders")
      .select("source_channel, channel, total_price, product_id, line_items_json")
      .eq("store_id", STORE_ID)
      .limit(5000);

    const channelCounts = new Map<string, number>();
    const channelRevenue = new Map<string, number>();
    const productChannelCounts = new Map<string, Map<string, number>>();
    const topProductByChannel = new Map<string, { productId: string; count: number }>();

    for (const o of orders ?? []) {
      const ch = getOrderChannel(o);
      channelCounts.set(ch, (channelCounts.get(ch) ?? 0) + 1);
      channelRevenue.set(ch, (channelRevenue.get(ch) ?? 0) + getOrderTotal(o));

      const pid = getPrimaryOrderProductKey(o);
      if (!pid) continue;
      if (!productChannelCounts.has(pid)) productChannelCounts.set(pid, new Map());
      productChannelCounts.get(pid)!.set(ch, (productChannelCounts.get(pid)!.get(ch) ?? 0) + 1);
      const current = topProductByChannel.get(ch);
      const nextCount = (productChannelCounts.get(pid)!.get(ch) ?? 0);
      if (!current || nextCount > current.count) {
        topProductByChannel.set(ch, { productId: pid, count: nextCount });
      }
    }

    const ordersByChannel = Array.from(channelCounts.entries()).map(([channel, count]) => ({ channel, count }));
    const revenueByChannel = Array.from(channelRevenue.entries()).map(([channel, revenue]) => ({ channel, revenue: Math.round(revenue * 100) / 100 }));

    // Top products by channel
    const topProductsByChannel: Array<{ productId: string; channel: string; count: number }> = [];
    for (const [pid, chMap] of productChannelCounts.entries()) {
      let topCh = "unknown";
      let topCount = 0;
      for (const [ch, cnt] of chMap.entries()) {
        if (cnt > topCount) {
          topCh = ch;
          topCount = cnt;
        }
      }
      topProductsByChannel.push({ productId: pid, channel: topCh, count: topCount });
    }
    topProductsByChannel.sort((a, b) => b.count - a.count);

    const supportedChannels = supportedInsightChannels.map((channel) => {
      const ordersCount = channelCounts.get(channel) ?? 0;
      const revenue = Math.round((channelRevenue.get(channel) ?? 0) * 100) / 100;
      const topProduct = topProductByChannel.get(channel)?.productId ?? null;
      return {
        channel,
        label: channelDisplayLabel(channel),
        ordersCount,
        revenue,
        topProduct,
        hasData: ordersCount > 0,
      };
    });

    return NextResponse.json({
      hasData: true,
      totalOrders: totalOrders ?? 0,
      ordersByChannel,
      revenueByChannel,
      topProductsByChannel: topProductsByChannel.slice(0, 20),
      supportedChannels,
    });
  } catch (err) {
    console.error("products intelligence channels error", err);
    return NextResponse.json({
      hasData: false,
      totalOrders: 0,
      ordersByChannel: [],
      revenueByChannel: [],
      topProductsByChannel: [],
      supportedChannels: supportedInsightChannels.map((channel) => ({
        channel,
        label: channelDisplayLabel(channel),
        ordersCount: 0,
        revenue: 0,
        topProduct: null,
        hasData: false,
      })),
      message: "خطأ في تحميل بيانات القنوات",
    });
  }
}
