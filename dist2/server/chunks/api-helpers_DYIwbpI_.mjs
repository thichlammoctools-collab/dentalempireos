globalThis.process ??= {};
globalThis.process.env ??= {};
function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}
function badRequest(message) {
  return json({ error: message }, 400);
}
function notFound(message = "Không tìm thấy") {
  return json({ error: message }, 404);
}
function slugify(input) {
  return input.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
export {
  badRequest as b,
  json as j,
  notFound as n,
  slugify as s
};
