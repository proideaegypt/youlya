export default async function OrderSafetyPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return (
    <div className="space-y-3">
      <h1 className="text-xl font-semibold">تفاصيل أمان الطلب #{id}</h1>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm">
        <div>Safety status: SAFE_TO_CREATE</div>
        <div>Product mapping proof: pending</div>
        <div>Idempotency key: pending</div>
        <div>Audit trail: pending</div>
      </div>
    </div>
  );
}
