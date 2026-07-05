globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, b as defineScriptVars, a as addAttribute, m as maybeRenderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_BVTcsmXt.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_CB59U0YH.mjs";
import { env } from "cloudflare:workers";
import { g as getApp, p as parseAppConfig } from "./app-db_BINE4Y41.mjs";
import { g as getActiveModelsWithProvider } from "./ai-provider-db_DV3FpOjN.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$id = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$id;
  const id = Astro2.params.id;
  if (!id) return Astro2.redirect("/admin/apps");
  let app;
  try {
    app = await getApp(env.DB, id);
  } catch {
    return Astro2.redirect("/admin/apps");
  }
  if (!app) return Astro2.redirect("/admin/apps");
  const config = parseAppConfig(app.config_json);
  const promptVi = config.prompt_vi ?? "";
  const promptEn = config.prompt_en ?? "";
  const modelOverride = config.model_override ?? "";
  const maxTokensOverride = config.max_tokens_override ?? "";
  let activeModels = [];
  try {
    const map = await getActiveModelsWithProvider(env.DB);
    for (const [, { provider, models }] of map) {
      for (const m of models) {
        if (m.is_active) {
          activeModels.push({ providerName: provider.name, modelId: m.model_id, modelName: m.name });
        }
      }
    }
  } catch {
  }
  const typeLabels = {
    survey: "Khảo sát",
    ebook_ai: "Ebook AI",
    course_ai: "Khóa học AI",
    tool: "Công cụ",
    generator: "Tạo nội dung"
  };
  const typeColors = {
    survey: "bg-purple-500/20 text-purple-300",
    ebook_ai: "bg-blue-500/20 text-blue-300",
    course_ai: "bg-green-500/20 text-green-300",
    tool: "bg-amber-500/20 text-amber-300",
    generator: "bg-pink-500/20 text-pink-300"
  };
  const statusColors = {
    draft: "bg-gray-500/20 text-gray-400",
    active: "bg-green-500/20 text-green-300",
    archived: "bg-red-500/20 text-red-300"
  };
  const statusLabels = {
    draft: "Bản nháp",
    active: "Đang hoạt động",
    archived: "Lưu trữ"
  };
  const statusDotColors = {
    draft: "bg-gray-400",
    active: "bg-green-400",
    archived: "bg-red-400"
  };
  function getInitials(name) {
    return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  }
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": app.name }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="space-y-6"> <!-- Header --> <div class="flex items-start justify-between gap-4"> <div class="min-w-0 flex-1"> <div class="text-xs text-on-surface-variant/60 mb-2 flex items-center gap-1.5"> <a href="/admin/apps" class="hover:text-primary transition-colors flex items-center gap-1"> <span class="material-symbols-outlined text-[14px]">arrow_back</span>\nỨng dụng AI\n</a> <span class="text-on-surface-variant/30">/</span> <span class="text-on-surface-variant/80">', '</span> </div> <div class="flex items-center gap-3"> <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20"> <span class="text-white text-sm font-bold">', '</span> </div> <div class="min-w-0 flex-1"> <h1 class="text-2xl font-bold text-on-surface tracking-tight truncate">', '</h1> <div class="flex items-center gap-2 mt-1.5"> <span', "> ", " </span> <span", "> <span", "></span> ", ' </span> <span class="font-mono text-xs text-on-surface-variant/40">#', '</span> </div> </div> </div> </div> <a href="/admin/apps" class="btn-icon w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all flex-shrink-0" title="Đóng"> <span class="material-symbols-outlined">close</span> </a> </div> <div class="grid grid-cols-1 lg:grid-cols-5 gap-6"> <!-- Basic fields (left, 2 cols) --> <div class="lg:col-span-2"> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center gap-2 mb-5"> <span class="material-symbols-outlined text-primary text-[20px]">info</span> <h2 class="text-lg font-bold text-on-surface">Thông tin cơ bản</h2> </div> <form id="basic-form" class="space-y-4"> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Tên <span class="text-tertiary">*</span></label> <input type="text" name="name" required', ' class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Slug</label> <input type="text" name="slug"', ' class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Loại</label> <input type="text"', ' disabled class="w-full px-3.5 py-2.5 bg-surface-container/60 border border-outline-variant/15 rounded-xl text-on-surface-variant/50 text-sm cursor-not-allowed"> <p class="text-[11px] text-on-surface-variant/40 mt-1.5">Loại ứng dụng không thể thay đổi sau khi tạo</p> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Trạng thái</label> <select name="status" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"> <option value="draft"', '>Bản nháp</option> <option value="active"', '>Đang hoạt động</option> <option value="archived"', '>Lưu trữ</option> </select> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Mô tả</label> <textarea name="description" rows="3" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none">', '</textarea> </div> <div class="flex items-center gap-2.5 py-1"> <input type="checkbox" name="is_free" id="is_free"', ' class="accent-primary w-4 h-4 rounded"> <label for="is_free" class="text-sm text-on-surface-variant cursor-pointer">Miễn phí (user không cần thanh toán để dùng)</label> </div> <button type="submit" id="submit-basic" class="w-full btn-primary-metallic bg-primary text-white py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"> <span class="material-symbols-outlined text-[18px]">save</span>\nLưu thông tin\n</button> </form> </div> </div> <!-- Config panel (right, 3 cols) --> <div class="lg:col-span-3 space-y-4"> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-5"> <div class="flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[20px]">tune</span> <h2 class="text-lg font-bold text-on-surface">Cấu hình AI</h2> </div> <span class="text-[10px] font-mono px-2 py-1 rounded-md bg-surface-container-high text-on-surface-variant/50 uppercase tracking-wider">config_json</span> </div> ', " ", ' </div> <!-- Metadata card --> <div class="glass-card rounded-2xl p-5"> <div class="flex items-center gap-2 mb-4"> <span class="material-symbols-outlined text-on-surface-variant/50 text-[18px]">database</span> <h3 class="text-sm font-bold text-on-surface/80 uppercase tracking-wider">Thông tin hệ thống</h3> </div> <dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-xs"> <div> <dt class="text-on-surface-variant/50 uppercase tracking-wider text-[10px] font-semibold mb-1">ID</dt> <dd class="font-mono text-on-surface/80 truncate">', '</dd> </div> <div> <dt class="text-on-surface-variant/50 uppercase tracking-wider text-[10px] font-semibold mb-1">Slug</dt> <dd class="font-mono text-on-surface/80 truncate">/', '</dd> </div> <div> <dt class="text-on-surface-variant/50 uppercase tracking-wider text-[10px] font-semibold mb-1">Tạo lúc</dt> <dd class="text-on-surface/70">', '</dd> </div> <div> <dt class="text-on-surface-variant/50 uppercase tracking-wider text-[10px] font-semibold mb-1">Cập nhật</dt> <dd class="text-on-surface/70">', "</dd> </div> </dl> </div> </div> </div> </div> <script>(function(){", `
    // ── Toast helper ──
    function showToast(msg, type) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(msg, type || 'info');
      } else {
        alert(msg);
      }
    }

    // ── Char counter ──
    const promptVi = document.querySelector('textarea[name="prompt_vi"]');
    const promptEn = document.querySelector('textarea[name="prompt_en"]');
    const charCountVi = document.getElementById('char-count-vi');
    const charCountEn = document.getElementById('char-count-en');
    promptVi?.addEventListener('input', () => {
      if (charCountVi) charCountVi.textContent = promptVi.value.length + ' ký tự';
    });
    promptEn?.addEventListener('input', () => {
      if (charCountEn) charCountEn.textContent = promptEn.value.length + ' ký tự';
    });

    // ── Basic form ──
    const basicForm = document.getElementById('basic-form');
    const submitBasic = document.getElementById('submit-basic');
    basicForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(basicForm);
      submitBasic.disabled = true;
      submitBasic.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Đang lưu...';
      const body = {
        name: fd.get('name')?.toString().trim(),
        slug: fd.get('slug')?.toString().trim(),
        description: fd.get('description')?.toString().trim() || null,
        status: fd.get('status')?.toString(),
        is_free: fd.has('is_free') ? 1 : 0,
      };
      try {
        const res = await fetch(\`/api/admin/apps/\${appId}\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          showToast('Đã lưu thông tin', 'success');
          setTimeout(() => window.location.reload(), 600);
        } else {
          showToast('Lưu thất bại', 'error');
          submitBasic.disabled = false;
          submitBasic.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu thông tin';
        }
      } catch {
        showToast('Lỗi kết nối. Vui lòng thử lại.', 'error');
        submitBasic.disabled = false;
        submitBasic.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu thông tin';
      }
    });

    // ── Config form ──
    const configForm = document.getElementById('config-form');
    const submitConfig = document.getElementById('submit-config');
    configForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(configForm);
      submitConfig.disabled = true;
      submitConfig.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Đang lưu...';
      const config = {
        prompt_vi: fd.get('prompt_vi')?.toString() || undefined,
        prompt_en: fd.get('prompt_en')?.toString() || undefined,
        model_override: fd.get('model_override')?.toString() || undefined,
        max_tokens_override: fd.get('max_tokens_override')?.toString()
          ? parseInt(fd.get('max_tokens_override').toString(), 10)
          : undefined,
      };
      Object.keys(config).forEach((k) => config[k] === undefined && delete config[k]);
      try {
        const res = await fetch(\`/api/admin/apps/\${appId}\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config_json: JSON.stringify(config) }),
        });
        if (res.ok) {
          showToast('Đã lưu cấu hình', 'success');
        } else {
          showToast('Lưu cấu hình thất bại', 'error');
        }
      } catch {
        showToast('Lỗi kết nối. Vui lòng thử lại.', 'error');
      } finally {
        submitConfig.disabled = false;
        submitConfig.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu cấu hình';
      }
    });

    // ── Reset config ──
    document.getElementById('reset-config')?.addEventListener('click', async () => {
      if (!confirm('Xóa toàn bộ config_json và quay về prompt mặc định trong code?')) return;
      try {
        const res = await fetch(\`/api/admin/apps/\${appId}\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config_json: null }),
        });
        if (res.ok) {
          showToast('Đã reset về mặc định', 'success');
          setTimeout(() => window.location.reload(), 600);
        } else {
          showToast('Reset thất bại', 'error');
        }
      } catch {
        showToast('Lỗi kết nối', 'error');
      }
    });
  })();<\/script> `], [" ", '<div class="space-y-6"> <!-- Header --> <div class="flex items-start justify-between gap-4"> <div class="min-w-0 flex-1"> <div class="text-xs text-on-surface-variant/60 mb-2 flex items-center gap-1.5"> <a href="/admin/apps" class="hover:text-primary transition-colors flex items-center gap-1"> <span class="material-symbols-outlined text-[14px]">arrow_back</span>\nỨng dụng AI\n</a> <span class="text-on-surface-variant/30">/</span> <span class="text-on-surface-variant/80">', '</span> </div> <div class="flex items-center gap-3"> <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/20"> <span class="text-white text-sm font-bold">', '</span> </div> <div class="min-w-0 flex-1"> <h1 class="text-2xl font-bold text-on-surface tracking-tight truncate">', '</h1> <div class="flex items-center gap-2 mt-1.5"> <span', "> ", " </span> <span", "> <span", "></span> ", ' </span> <span class="font-mono text-xs text-on-surface-variant/40">#', '</span> </div> </div> </div> </div> <a href="/admin/apps" class="btn-icon w-9 h-9 flex items-center justify-center rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-all flex-shrink-0" title="Đóng"> <span class="material-symbols-outlined">close</span> </a> </div> <div class="grid grid-cols-1 lg:grid-cols-5 gap-6"> <!-- Basic fields (left, 2 cols) --> <div class="lg:col-span-2"> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center gap-2 mb-5"> <span class="material-symbols-outlined text-primary text-[20px]">info</span> <h2 class="text-lg font-bold text-on-surface">Thông tin cơ bản</h2> </div> <form id="basic-form" class="space-y-4"> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Tên <span class="text-tertiary">*</span></label> <input type="text" name="name" required', ' class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Slug</label> <input type="text" name="slug"', ' class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Loại</label> <input type="text"', ' disabled class="w-full px-3.5 py-2.5 bg-surface-container/60 border border-outline-variant/15 rounded-xl text-on-surface-variant/50 text-sm cursor-not-allowed"> <p class="text-[11px] text-on-surface-variant/40 mt-1.5">Loại ứng dụng không thể thay đổi sau khi tạo</p> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Trạng thái</label> <select name="status" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"> <option value="draft"', '>Bản nháp</option> <option value="active"', '>Đang hoạt động</option> <option value="archived"', '>Lưu trữ</option> </select> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Mô tả</label> <textarea name="description" rows="3" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none">', '</textarea> </div> <div class="flex items-center gap-2.5 py-1"> <input type="checkbox" name="is_free" id="is_free"', ' class="accent-primary w-4 h-4 rounded"> <label for="is_free" class="text-sm text-on-surface-variant cursor-pointer">Miễn phí (user không cần thanh toán để dùng)</label> </div> <button type="submit" id="submit-basic" class="w-full btn-primary-metallic bg-primary text-white py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"> <span class="material-symbols-outlined text-[18px]">save</span>\nLưu thông tin\n</button> </form> </div> </div> <!-- Config panel (right, 3 cols) --> <div class="lg:col-span-3 space-y-4"> <div class="glass-card rounded-2xl p-6"> <div class="flex items-center justify-between mb-5"> <div class="flex items-center gap-2"> <span class="material-symbols-outlined text-primary text-[20px]">tune</span> <h2 class="text-lg font-bold text-on-surface">Cấu hình AI</h2> </div> <span class="text-[10px] font-mono px-2 py-1 rounded-md bg-surface-container-high text-on-surface-variant/50 uppercase tracking-wider">config_json</span> </div> ', " ", ' </div> <!-- Metadata card --> <div class="glass-card rounded-2xl p-5"> <div class="flex items-center gap-2 mb-4"> <span class="material-symbols-outlined text-on-surface-variant/50 text-[18px]">database</span> <h3 class="text-sm font-bold text-on-surface/80 uppercase tracking-wider">Thông tin hệ thống</h3> </div> <dl class="grid grid-cols-2 gap-x-4 gap-y-3 text-xs"> <div> <dt class="text-on-surface-variant/50 uppercase tracking-wider text-[10px] font-semibold mb-1">ID</dt> <dd class="font-mono text-on-surface/80 truncate">', '</dd> </div> <div> <dt class="text-on-surface-variant/50 uppercase tracking-wider text-[10px] font-semibold mb-1">Slug</dt> <dd class="font-mono text-on-surface/80 truncate">/', '</dd> </div> <div> <dt class="text-on-surface-variant/50 uppercase tracking-wider text-[10px] font-semibold mb-1">Tạo lúc</dt> <dd class="text-on-surface/70">', '</dd> </div> <div> <dt class="text-on-surface-variant/50 uppercase tracking-wider text-[10px] font-semibold mb-1">Cập nhật</dt> <dd class="text-on-surface/70">', "</dd> </div> </dl> </div> </div> </div> </div> <script>(function(){", `
    // ── Toast helper ──
    function showToast(msg, type) {
      if (typeof window !== 'undefined' && window.showToast) {
        window.showToast(msg, type || 'info');
      } else {
        alert(msg);
      }
    }

    // ── Char counter ──
    const promptVi = document.querySelector('textarea[name="prompt_vi"]');
    const promptEn = document.querySelector('textarea[name="prompt_en"]');
    const charCountVi = document.getElementById('char-count-vi');
    const charCountEn = document.getElementById('char-count-en');
    promptVi?.addEventListener('input', () => {
      if (charCountVi) charCountVi.textContent = promptVi.value.length + ' ký tự';
    });
    promptEn?.addEventListener('input', () => {
      if (charCountEn) charCountEn.textContent = promptEn.value.length + ' ký tự';
    });

    // ── Basic form ──
    const basicForm = document.getElementById('basic-form');
    const submitBasic = document.getElementById('submit-basic');
    basicForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(basicForm);
      submitBasic.disabled = true;
      submitBasic.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Đang lưu...';
      const body = {
        name: fd.get('name')?.toString().trim(),
        slug: fd.get('slug')?.toString().trim(),
        description: fd.get('description')?.toString().trim() || null,
        status: fd.get('status')?.toString(),
        is_free: fd.has('is_free') ? 1 : 0,
      };
      try {
        const res = await fetch(\\\`/api/admin/apps/\\\${appId}\\\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });
        if (res.ok) {
          showToast('Đã lưu thông tin', 'success');
          setTimeout(() => window.location.reload(), 600);
        } else {
          showToast('Lưu thất bại', 'error');
          submitBasic.disabled = false;
          submitBasic.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu thông tin';
        }
      } catch {
        showToast('Lỗi kết nối. Vui lòng thử lại.', 'error');
        submitBasic.disabled = false;
        submitBasic.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu thông tin';
      }
    });

    // ── Config form ──
    const configForm = document.getElementById('config-form');
    const submitConfig = document.getElementById('submit-config');
    configForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(configForm);
      submitConfig.disabled = true;
      submitConfig.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Đang lưu...';
      const config = {
        prompt_vi: fd.get('prompt_vi')?.toString() || undefined,
        prompt_en: fd.get('prompt_en')?.toString() || undefined,
        model_override: fd.get('model_override')?.toString() || undefined,
        max_tokens_override: fd.get('max_tokens_override')?.toString()
          ? parseInt(fd.get('max_tokens_override').toString(), 10)
          : undefined,
      };
      Object.keys(config).forEach((k) => config[k] === undefined && delete config[k]);
      try {
        const res = await fetch(\\\`/api/admin/apps/\\\${appId}\\\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config_json: JSON.stringify(config) }),
        });
        if (res.ok) {
          showToast('Đã lưu cấu hình', 'success');
        } else {
          showToast('Lưu cấu hình thất bại', 'error');
        }
      } catch {
        showToast('Lỗi kết nối. Vui lòng thử lại.', 'error');
      } finally {
        submitConfig.disabled = false;
        submitConfig.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu cấu hình';
      }
    });

    // ── Reset config ──
    document.getElementById('reset-config')?.addEventListener('click', async () => {
      if (!confirm('Xóa toàn bộ config_json và quay về prompt mặc định trong code?')) return;
      try {
        const res = await fetch(\\\`/api/admin/apps/\\\${appId}\\\`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ config_json: null }),
        });
        if (res.ok) {
          showToast('Đã reset về mặc định', 'success');
          setTimeout(() => window.location.reload(), 600);
        } else {
          showToast('Reset thất bại', 'error');
        }
      } catch {
        showToast('Lỗi kết nối', 'error');
      }
    });
  })();<\/script> `])), maybeRenderHead(), app.name, getInitials(app.name), app.name, addAttribute(`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold ${typeColors[app.type] ?? "bg-gray-500/20 text-gray-400"}`, "class"), typeLabels[app.type] ?? app.type, addAttribute(`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-xs font-semibold ${statusColors[app.status] ?? "bg-gray-500/20 text-gray-400"}`, "class"), addAttribute(`w-1.5 h-1.5 rounded-full ${statusDotColors[app.status] ?? "bg-gray-400"} flex-shrink-0`, "class"), statusLabels[app.status] ?? app.status, app.id, addAttribute(app.name, "value"), addAttribute(app.slug, "value"), addAttribute(typeLabels[app.type] ?? app.type, "value"), addAttribute(app.status === "draft", "selected"), addAttribute(app.status === "active", "selected"), addAttribute(app.status === "archived", "selected"), app.description ?? "", addAttribute(app.is_free === 1, "checked"), (app.type === "survey" || app.type === "tool") && renderTemplate`<form id="config-form" class="space-y-4"> <div class="grid grid-cols-1 md:grid-cols-2 gap-4"> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">AI Model</label> ${activeModels.length > 0 ? renderTemplate`<select name="model_override" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"> <option value="">— Mặc định —</option> ${activeModels.map((m) => renderTemplate`<option${addAttribute(m.modelId, "value")}${addAttribute(modelOverride === m.modelId, "selected")}> ${m.providerName} · ${m.modelName} </option>`)} </select>` : renderTemplate`<input type="text" name="model_override"${addAttribute(modelOverride, "value")} placeholder="claude-sonnet-4-6" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all">`} <p class="text-[11px] text-on-surface-variant/40 mt-1.5">Để trống để dùng model mặc định</p> </div> <div> <label class="block text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5">Max tokens override</label> <input type="number" name="max_tokens_override"${addAttribute(maxTokensOverride, "value")} placeholder="4096" class="w-full px-3.5 py-2.5 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-on-surface-variant/30"> <p class="text-[11px] text-on-surface-variant/40 mt-1.5">Giới hạn token tối đa cho response</p> </div> </div> <div> <label class="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5"> <span class="material-symbols-outlined text-[14px]">edit_note</span>
Prompt tiếng Việt
</label> <textarea name="prompt_vi" rows="9" class="w-full px-3.5 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-y" placeholder="Để trống sẽ dùng prompt mặc định trong code">${promptVi}</textarea> <div class="flex justify-between mt-1.5"> <p class="text-[11px] text-on-surface-variant/40">Để trống = dùng prompt mặc định</p> <span class="text-[11px] text-on-surface-variant/40 font-mono" id="char-count-vi">${promptVi.length} ký tự</span> </div> </div> <div> <label class="flex items-center gap-2 text-xs font-semibold text-on-surface-variant/70 uppercase tracking-wider mb-1.5"> <span class="material-symbols-outlined text-[14px]">translate</span>
Prompt tiếng Anh <span class="text-on-surface-variant/40 font-normal">(tùy chọn)</span> </label> <textarea name="prompt_en" rows="6" class="w-full px-3.5 py-3 bg-surface-container-high border border-outline-variant/30 rounded-xl text-on-surface text-xs font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-y" placeholder="English version of the prompt">${promptEn}</textarea> <div class="flex justify-end mt-1.5"> <span class="text-[11px] text-on-surface-variant/40 font-mono" id="char-count-en">${promptEn.length} ký tự</span> </div> </div> <div class="flex gap-3 pt-2"> <button type="submit" id="submit-config" class="flex-1 btn-primary-metallic bg-primary text-white py-2.5 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"> <span class="material-symbols-outlined text-[18px]">save</span>
Lưu cấu hình
</button> <button type="button" id="reset-config" class="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium flex items-center gap-2"> <span class="material-symbols-outlined text-[18px]">restart_alt</span>
Reset
</button> </div> </form>`, app.type !== "survey" && app.type !== "tool" && renderTemplate`<div class="text-center py-12 space-y-3"> <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center"> <span class="material-symbols-outlined text-amber-400 text-[32px]">construction</span> </div> <p class="text-on-surface/80 font-semibold">Cấu hình đang được phát triển</p> <p class="text-sm text-on-surface-variant/60 max-w-xs mx-auto leading-relaxed">
Cấu hình cho loại "<span class="text-on-surface/70 font-medium">${typeLabels[app.type] ?? app.type}</span>" sẽ sớm được hỗ trợ trong bản cập nhật tiếp theo.
</p> </div>`, app.id, app.slug, new Date(app.created_at).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }), new Date(app.updated_at).toLocaleString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" }), defineScriptVars({ appId: app.id })) })}`;
}, "C:/dentalempireos/src/pages/admin/apps/[id].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/apps/[id].astro";
const $$url = "/admin/apps/[id]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$id,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
