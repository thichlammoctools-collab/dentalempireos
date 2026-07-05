globalThis.process ??= {};
globalThis.process.env ??= {};
import { env } from "cloudflare:workers";
import { j as json, n as notFound, b as badRequest } from "./api-helpers_DYIwbpI_.mjs";
import { g as getQuestion, r as replyToQuestion, u as updateQuestionStatus, c as createNotification } from "./question-db_BOj0TAm2.mjs";
const prerender = false;
const POST = async ({ params, request, locals }) => {
  const adminUser = locals.user;
  if (!adminUser) {
    console.error("[admin reply] unauthorized — no user in locals");
    return json({ error: "unauthorized" }, 401);
  }
  const id = params.id;
  if (!id) return notFound();
  console.log(`[admin reply] questionId=${id}, adminUserId=${adminUser.id}, adminEmail=${adminUser.email}`);
  const question = await getQuestion(env.DB, id);
  if (!question) {
    console.error(`[admin reply] question not found: ${id}`);
    return notFound();
  }
  const body = await request.json().catch(() => null);
  if (!body) return badRequest("Invalid JSON body");
  const { body: content } = body;
  if (!content) return badRequest("body is required");
  console.log(`[admin reply] content length=${content.length}, question status=${question.status}`);
  try {
    const reply = await replyToQuestion(env.DB, id, adminUser.id, content, true);
    console.log(`[admin reply] reply created: id=${reply.id}`);
    if (question.status === "open") {
      try {
        await updateQuestionStatus(env.DB, id, "answered");
        console.log("[admin reply] status updated to answered");
      } catch (err) {
        console.error("[admin reply] failed to update question status:", err);
      }
    }
    try {
      await createNotification(
        env.DB,
        question.user_id,
        "question_reply",
        `Tác giả đã trả lời: ${question.title}`,
        content.length > 200 ? content.slice(0, 200) + "..." : content,
        `/my-questions/${id}`
      );
      console.log("[admin reply] notification created");
    } catch (err) {
      console.error("[admin reply] failed to create notification:", err);
    }
    return json(reply, 201);
  } catch (err) {
    console.error("[admin reply] FAILED to create reply:", err);
    return json({ error: "Failed to create reply" }, 500);
  }
};
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
