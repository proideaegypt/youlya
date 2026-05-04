import { randomUUID } from "node:crypto";
import { getMockState } from "@/lib/adapters/supabase/mock-store";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type ApprovedKnowledgeSnippet = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  sourceType: string;
  updatedAt: string;
};

type SuggestionStatus = "pending" | "approved" | "rejected" | "published";

export async function retrieveApprovedKnowledge(storeId: string, query: string, limit = 5): Promise<ApprovedKnowledgeSnippet[]> {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const normalized = query.trim().toLowerCase();
    return getMockState().knowledgeBase
      .filter((row) => row.store_id === storeId && row.status === "published")
      .map((row) => row as { id: string; title: string; content: string; tags?: string[]; source_type?: string; updated_at?: string })
      .filter((row) => !normalized || row.title.toLowerCase().includes(normalized) || row.content.toLowerCase().includes(normalized))
      .slice(0, limit)
      .map((row) => ({
        id: row.id,
        title: row.title,
        content: row.content,
        tags: row.tags ?? [],
        sourceType: row.source_type ?? "manual",
        updatedAt: row.updated_at ?? new Date().toISOString(),
      }));
  }

  const { data, error } = await supabase
    .from("knowledge_base")
    .select("id,title,content,tags,source_type,updated_at")
    .eq("store_id", storeId)
    .eq("status", "published")
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data.map((row) => ({
    id: String(row.id),
    title: String(row.title),
    content: String(row.content),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    sourceType: String(row.source_type ?? "manual"),
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
  }));
}

export function buildApprovedKnowledgePrompt(snippets: ApprovedKnowledgeSnippet[]): string {
  if (snippets.length === 0) return "No approved knowledge snippets available.";
  return snippets
    .map((snippet, index) => {
      const safeText = snippet.content.slice(0, 600);
      return `${index + 1}. [${snippet.title}] ${safeText}`;
    })
    .join("\n");
}

export async function listKnowledgeModeration(storeId: string) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    const suggestions = getMockState().knowledgeSuggestions.filter((row) => row.store_id === storeId);
    const byStatus = (status: SuggestionStatus) => suggestions.filter((row) => row.status === status).length;
    return {
      counts: {
        pending: byStatus("pending"),
        approved: byStatus("approved"),
        rejected: byStatus("rejected"),
        published: byStatus("published"),
      },
      suggestions,
    };
  }

  const { data } = await supabase
    .from("knowledge_suggestions")
    .select("id,title,suggestion_text,status,source_type,source_ref,reviewer_note,approved_at,rejected_at,published_at,created_at")
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .limit(200);

  const suggestions = (data ?? []).map((row) => ({
    id: String(row.id),
    title: String(row.title),
    suggestion_text: String(row.suggestion_text),
    status: String(row.status ?? "pending"),
    source_type: String(row.source_type ?? "learning"),
    source_ref: row.source_ref ? String(row.source_ref) : null,
    reviewer_note: row.reviewer_note ? String(row.reviewer_note) : null,
    approved_at: row.approved_at ? String(row.approved_at) : null,
    rejected_at: row.rejected_at ? String(row.rejected_at) : null,
    published_at: row.published_at ? String(row.published_at) : null,
    created_at: String(row.created_at),
  }));

  const byStatus = (status: SuggestionStatus) => suggestions.filter((row) => row.status === status).length;
  return {
    counts: {
      pending: byStatus("pending"),
      approved: byStatus("approved"),
      rejected: byStatus("rejected"),
      published: byStatus("published"),
    },
    suggestions,
  };
}

export async function reviewSuggestion(input: {
  storeId: string;
  suggestionId: string;
  action: "approve" | "reject" | "publish";
  actor: string;
  reviewerNote?: string;
}) {
  const now = new Date().toISOString();
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    const state = getMockState();
    const idx = state.knowledgeSuggestions.findIndex((row) => row.id === input.suggestionId && row.store_id === input.storeId);
    if (idx < 0) return { ok: false as const, error: "suggestion_not_found" };
    const row = state.knowledgeSuggestions[idx];
    if (input.action === "approve") {
      row.status = "approved";
      row.approved_by = input.actor;
      row.approved_at = now;
      row.reviewer_note = input.reviewerNote ?? null;
    } else if (input.action === "reject") {
      row.status = "rejected";
      row.rejected_by = input.actor;
      row.rejected_at = now;
      row.reviewer_note = input.reviewerNote ?? null;
    } else {
      const kbId = randomUUID();
      state.knowledgeBase.push({
        id: kbId,
        store_id: input.storeId,
        title: row.title,
        content: row.suggestion_text,
        source_type: row.source_type,
        source_ref: row.source_ref,
        tags: [],
        status: "published",
        published_at: now,
        updated_at: now,
      });
      state.knowledgeVersions.push({
        id: randomUUID(),
        store_id: input.storeId,
        knowledge_id: kbId,
        version_no: 1,
        content: row.suggestion_text,
        change_note: "Published from approved suggestion",
        created_by: input.actor,
        created_at: now,
      });
      row.status = "published";
      row.published_knowledge_id = kbId;
      row.published_at = now;
      row.reviewer_note = input.reviewerNote ?? null;
    }
    return { ok: true as const };
  }

  const { data: suggestion } = await supabase
    .from("knowledge_suggestions")
    .select("id,title,suggestion_text,source_type,source_ref,status")
    .eq("id", input.suggestionId)
    .eq("store_id", input.storeId)
    .maybeSingle();

  if (!suggestion) return { ok: false as const, error: "suggestion_not_found" };

  if (input.action === "approve") {
    await supabase.from("knowledge_suggestions").update({
      status: "approved",
      approved_by: input.actor,
      approved_at: now,
      reviewer_note: input.reviewerNote ?? null,
      updated_at: now,
    }).eq("id", input.suggestionId).eq("store_id", input.storeId);
    return { ok: true as const };
  }

  if (input.action === "reject") {
    await supabase.from("knowledge_suggestions").update({
      status: "rejected",
      rejected_by: input.actor,
      rejected_at: now,
      reviewer_note: input.reviewerNote ?? null,
      updated_at: now,
    }).eq("id", input.suggestionId).eq("store_id", input.storeId);
    return { ok: true as const };
  }

  const { data: insertedKnowledge } = await supabase.from("knowledge_base").insert({
    store_id: input.storeId,
    title: suggestion.title,
    content: suggestion.suggestion_text,
    source_type: suggestion.source_type ?? "learning",
    source_ref: suggestion.source_ref,
    status: "published",
    published_at: now,
    created_by: input.actor,
    updated_at: now,
  }).select("id").maybeSingle();

  if (!insertedKnowledge?.id) return { ok: false as const, error: "publish_insert_failed" };

  await supabase.from("knowledge_versions").insert({
    store_id: input.storeId,
    knowledge_id: insertedKnowledge.id,
    version_no: 1,
    content: suggestion.suggestion_text,
    change_note: "Published from approved suggestion",
    created_by: input.actor,
    created_at: now,
  });

  await supabase.from("knowledge_suggestions").update({
    status: "published",
    published_knowledge_id: insertedKnowledge.id,
    published_at: now,
    reviewer_note: input.reviewerNote ?? null,
    updated_at: now,
  }).eq("id", input.suggestionId).eq("store_id", input.storeId);

  return { ok: true as const };
}
