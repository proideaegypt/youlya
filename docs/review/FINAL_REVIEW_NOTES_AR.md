# Final Review Notes — Arabic/Egyptian

النسخة دي معمولة عشان تبدأ Codex بيها اليوم، مش عشان تبقى app كامل جاهز.

## أقوى قرارات النسخة

- Shopify هو source of truth.
- Product name من Shopify title.
- Product code من Shopify variant SKU.
- مفيش اختراع product codes.
- n8n orchestration فقط.
- Next.js هو مكان business logic.
- Phase 0 يركز على commerce safety فقط.
- Dashboard/SaaS/RAG يتأجلوا لحد ما Youlya live تبقى مستقرة.

## أهم إصلاح

ملف السيناريوهات كان فيه fake header row باسم `id`. النسخة النهائية شالته وبقت:

```text
80 CONV
10 DASH
90 total
```

## أهم حاجة Codex لازم ينفذها

```text
Message turn
Product search
Product mapping
Select product
Cart
Shipping
Confirmation
Shopify COD order
Handoff
Logs
Tests
```

## ممنوع في أول build

```text
Full SaaS
Multi-channel
RAG
Billing
Campaign engine
Marketplace
Heavy analytics
```

## سبب إن مفيش products حقيقية

مش عندنا Shopify export أو API credentials في الملفات. لذلك النسخة بتحدد contract واضح:

```text
الاسم = Shopify title
الكود = variant SKU
لو SKU ناقص = warning وليس اختراع
```

Codex بعد ما تضيف Shopify credentials يعمل sync حقيقي.

## جملة البداية لـ Codex

```text
Read START_HERE_FOR_CODEX.md and COPY_TO_CODEX_GPT53.md. Start Phase 0 only. Do not build full SaaS or full dashboard. Implement safe commerce core first.
```
