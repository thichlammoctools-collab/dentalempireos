globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, b as defineScriptVars, a as addAttribute, m as maybeRenderHead } from "./sequence_CNN-ZGRA.mjs";
import { r as renderComponent } from "./worker-entry_CcpFbi8U.mjs";
import { $ as $$AdminLayout } from "./AdminLayout_B2U16bVN.mjs";
import { env } from "cloudflare:workers";
import { b as listProducts } from "./payos-db_0fnCQ6tl.mjs";
import { l as listActiveApps } from "./app-db_BINE4Y41.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const db = env.DB;
  const products = await listProducts(db);
  let activeApps = [];
  try {
    activeApps = await listActiveApps(db);
  } catch {
  }
  const activeCount = products.filter((p) => p.is_active === 1).length;
  const typeLabels = {
    course_unlock: "Mở khóa khóa học",
    document_unlock: "Mở khóa tài liệu",
    booking: "Booking tư vấn",
    event_ticket: "Vé sự kiện",
    survey_unlock: "Mở khóa khảo sát AI"
  };
  const appMap = Object.fromEntries(activeApps.map((a) => [a.id, `${a.name} (${a.type})`]));
  function nanoid() {
    return crypto.randomUUID().replace(/-/g, "").slice(0, 16);
  }
  const newId = nanoid();
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Sản Phẩm | Admin" }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template(["  ", '<div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4"> <div> <h2 class="text-3xl font-bold text-white mb-1">Quản lý Sản Phẩm</h2> <p class="text-on-surface-variant"> ', " sản phẩm · ", ' đang bán\n</p> </div> <button id="btn-new-product" class="bg-primary-container text-white px-6 py-3 rounded-xl font-bold cyan-glow hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 self-start md:self-auto"> <span class="material-symbols-outlined text-[20px]">add</span> <span class="text-sm">Tạo sản phẩm mới</span> </button> </div>  <div id="new-product-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4"> <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div> <div class="relative glass-card rounded-2xl p-6 w-full max-w-lg"> <div class="flex items-center justify-between mb-6"> <h3 class="text-xl font-bold text-white" id="modal-title">Tạo sản phẩm mới</h3> <button id="modal-close" type="button" class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"> <span class="material-symbols-outlined text-[20px]">close</span> </button> </div> <form id="product-form" class="flex flex-col gap-4"> <input type="hidden" name="id" id="form-id"', '> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Tên sản phẩm <span class="text-red-400">*</span></label> <input type="text" name="name" required class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="VD: Khóa học Premium"> </div> <div class="grid grid-cols-2 gap-4"> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Loại <span class="text-red-400">*</span></label> <select name="type" required class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white focus:ring-1 focus:ring-primary focus:outline-none"> <option value="course_unlock">Mở khóa khóa học</option> <option value="document_unlock">Mở khóa tài liệu</option> <option value="booking">Booking tư vấn</option> <option value="event_ticket">Vé sự kiện</option> <option value="survey_unlock">Mở khóa khảo sát AI</option> </select> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Giá (VND) <span class="text-red-400">*</span></label> <input type="number" name="price" required min="0" step="1000" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="500000"> </div> </div> <div id="app-id-field" class="hidden"> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Ứng dụng liên kết</label> <select name="app_id" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white focus:ring-1 focus:ring-primary focus:outline-none"> <option value="">— Không liên kết —</option> ', ' </select> <p class="text-xs text-white/40 mt-1">Chỉ áp dụng cho loại "Mở khóa khảo sát AI"</p> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Mô tả</label> <textarea name="description" rows="2" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none text-sm" placeholder="Mô tả ngắn về sản phẩm"></textarea> </div> <div class="grid grid-cols-2 gap-4"> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Thời hạn (ngày)</label> <input type="number" name="duration_days" min="0" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Để trống = vĩnh viễn"> <p class="text-xs text-white/40 mt-1">Để trống nếu quyền truy cập vĩnh viễn</p> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Reference ID</label> <input type="text" name="reference_id" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="ID nội dung liên kết"> <p class="text-xs text-white/40 mt-1">ID của course/resource liên kết</p> </div> </div> <div class="flex items-center gap-3"> <input type="checkbox" name="is_active" id="is_active" checked class="w-4 h-4 rounded border-outline-variant bg-surface-container-high text-primary focus:ring-primary"> <label for="is_active" class="text-sm text-on-surface-variant">Đang bán</label> </div> <p id="form-error" class="hidden text-sm text-rose-400"></p> <button type="submit" id="form-submit" class="w-full px-4 py-3 btn-primary-metallic font-bold rounded-xl text-sm active:scale-95 transition-all">\nTạo sản phẩm\n</button> </form> </div> </div>  <div class="mt-8 glass-card rounded-2xl border border-outline-variant/20 overflow-hidden"> <div class="overflow-x-auto"> <table class="w-full text-sm"> <thead> <tr class="border-b border-outline-variant/20 text-on-surface-variant"> <th class="text-left px-4 py-3 font-semibold">Tên</th> <th class="text-left px-4 py-3 font-semibold">Loại</th> <th class="text-left px-4 py-3 font-semibold">App</th> <th class="text-right px-4 py-3 font-semibold">Giá</th> <th class="text-center px-4 py-3 font-semibold">Thời hạn</th> <th class="text-center px-4 py-3 font-semibold">Trạng thái</th> <th class="text-right px-4 py-3 font-semibold">Thao tác</th> </tr> </thead> <tbody> ', " </tbody> </table> </div> </div> <script>(function(){", `
    const modal = document.getElementById('new-product-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close');
    const newBtn = document.getElementById('btn-new-product');
    const form = document.getElementById('product-form');
    const errorEl = document.getElementById('form-error');
    const submitBtn = document.getElementById('form-submit');
    const modalTitle = document.getElementById('modal-title');
    const appIdField = document.getElementById('app-id-field');
    const typeSelect = form?.querySelector('[name="type"]');
    const appIdSelect = form?.querySelector('[name="app_id"]');

    let editingId = null;

    function toggleAppIdField() {
      if (typeSelect && appIdField) {
        const showFor = ['survey_unlock'];
        appIdField.classList.toggle('hidden', !showFor.includes(typeSelect.value));
      }
    }
    typeSelect?.addEventListener('change', toggleAppIdField);

    function openModal() { modal?.classList.remove('hidden'); toggleAppIdField(); }
    function closeModal() {
      modal?.classList.add('hidden');
      form?.reset();
      editingId = null;
      modalTitle.textContent = 'Tạo sản phẩm mới';
      submitBtn.textContent = 'Tạo sản phẩm';
      errorEl?.classList.add('hidden');
      appIdField?.classList.add('hidden');
    }

    newBtn?.addEventListener('click', openModal);
    backdrop?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);

    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const b = btn;
        editingId = b.dataset.id;
        const nameInput = form?.querySelector('[name="name"]');
        const typeInput = form?.querySelector('[name="type"]');
        const priceInput = form?.querySelector('[name="price"]');
        const descInput = form?.querySelector('[name="description"]');
        const durInput = form?.querySelector('[name="duration_days"]');
        const refInput = form?.querySelector('[name="reference_id"]');
        const activeInput = document.getElementById('is_active');

        if (nameInput) nameInput.value = b.dataset.name || '';
        if (typeInput) typeInput.value = b.dataset.type || '';
        if (priceInput) priceInput.value = b.dataset.price || '';
        if (descInput) descInput.value = b.dataset.description || '';
        if (durInput) durInput.value = b.dataset.duration_days || '';
        if (refInput) refInput.value = b.dataset.reference_id || '';
        if (activeInput) activeInput.checked = b.dataset.is_active === '1';
        if (appIdSelect) appIdSelect.value = b.dataset.app_id || '';

        toggleAppIdField();
        modalTitle.textContent = 'Sửa sản phẩm';
        submitBtn.textContent = 'Cập nhật';
        openModal();
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        if (!confirm(\`Xác nhận xóa "\${name}"?\`)) return;

        const resp = await fetch(\`/api/admin/products/\${id}\`, { method: 'DELETE' });
        if (resp.ok) {
          window.location.reload();
        } else {
          alert('Lỗi xóa sản phẩm');
        }
      });
    });

    // Form submit (create or update)
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl?.classList.add('hidden');

      const data = new FormData(form);
      const body = {
        name: data.get('name'),
        type: data.get('type'),
        price: parseInt(String(data.get('price')), 10),
        description: data.get('description') || null,
        duration_days: data.get('duration_days') ? parseInt(String(data.get('duration_days')), 10) : null,
        reference_id: data.get('reference_id') || null,
        app_id: data.get('app_id') || null,
        is_active: data.get('is_active') === 'on' ? 1 : 0,
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang lưu...';

      try {
        const url = editingId ? \`/api/admin/products/\${editingId}\` : '/api/admin/products';
        const method = editingId ? 'PUT' : 'POST';
        const resp = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const result = await resp.json();
        if (!resp.ok) {
          errorEl.textContent = result.error || 'Lỗi lưu sản phẩm';
          errorEl?.classList.remove('hidden');
          submitBtn.disabled = false;
          submitBtn.textContent = editingId ? 'Cập nhật' : 'Tạo sản phẩm';
          return;
        }

        window.location.reload();
      } catch {
        errorEl.textContent = 'Lỗi kết nối';
        errorEl?.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = editingId ? 'Cập nhật' : 'Tạo sản phẩm';
      }
    });
  })();<\/script> `], ["  ", '<div class="flex flex-col md:flex-row md:justify-between md:items-end gap-4"> <div> <h2 class="text-3xl font-bold text-white mb-1">Quản lý Sản Phẩm</h2> <p class="text-on-surface-variant"> ', " sản phẩm · ", ' đang bán\n</p> </div> <button id="btn-new-product" class="bg-primary-container text-white px-6 py-3 rounded-xl font-bold cyan-glow hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 self-start md:self-auto"> <span class="material-symbols-outlined text-[20px]">add</span> <span class="text-sm">Tạo sản phẩm mới</span> </button> </div>  <div id="new-product-modal" class="hidden fixed inset-0 z-50 flex items-center justify-center p-4"> <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" id="modal-backdrop"></div> <div class="relative glass-card rounded-2xl p-6 w-full max-w-lg"> <div class="flex items-center justify-between mb-6"> <h3 class="text-xl font-bold text-white" id="modal-title">Tạo sản phẩm mới</h3> <button id="modal-close" type="button" class="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-high transition-colors"> <span class="material-symbols-outlined text-[20px]">close</span> </button> </div> <form id="product-form" class="flex flex-col gap-4"> <input type="hidden" name="id" id="form-id"', '> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Tên sản phẩm <span class="text-red-400">*</span></label> <input type="text" name="name" required class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="VD: Khóa học Premium"> </div> <div class="grid grid-cols-2 gap-4"> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Loại <span class="text-red-400">*</span></label> <select name="type" required class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white focus:ring-1 focus:ring-primary focus:outline-none"> <option value="course_unlock">Mở khóa khóa học</option> <option value="document_unlock">Mở khóa tài liệu</option> <option value="booking">Booking tư vấn</option> <option value="event_ticket">Vé sự kiện</option> <option value="survey_unlock">Mở khóa khảo sát AI</option> </select> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Giá (VND) <span class="text-red-400">*</span></label> <input type="number" name="price" required min="0" step="1000" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="500000"> </div> </div> <div id="app-id-field" class="hidden"> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Ứng dụng liên kết</label> <select name="app_id" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white focus:ring-1 focus:ring-primary focus:outline-none"> <option value="">— Không liên kết —</option> ', ' </select> <p class="text-xs text-white/40 mt-1">Chỉ áp dụng cho loại "Mở khóa khảo sát AI"</p> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Mô tả</label> <textarea name="description" rows="2" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none text-sm" placeholder="Mô tả ngắn về sản phẩm"></textarea> </div> <div class="grid grid-cols-2 gap-4"> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Thời hạn (ngày)</label> <input type="number" name="duration_days" min="0" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="Để trống = vĩnh viễn"> <p class="text-xs text-white/40 mt-1">Để trống nếu quyền truy cập vĩnh viễn</p> </div> <div> <label class="block text-sm font-semibold text-on-surface-variant mb-2">Reference ID</label> <input type="text" name="reference_id" class="w-full px-4 py-3 bg-surface-container-high border border-outline-variant rounded-xl text-white placeholder:text-white/30 focus:ring-1 focus:ring-primary focus:outline-none" placeholder="ID nội dung liên kết"> <p class="text-xs text-white/40 mt-1">ID của course/resource liên kết</p> </div> </div> <div class="flex items-center gap-3"> <input type="checkbox" name="is_active" id="is_active" checked class="w-4 h-4 rounded border-outline-variant bg-surface-container-high text-primary focus:ring-primary"> <label for="is_active" class="text-sm text-on-surface-variant">Đang bán</label> </div> <p id="form-error" class="hidden text-sm text-rose-400"></p> <button type="submit" id="form-submit" class="w-full px-4 py-3 btn-primary-metallic font-bold rounded-xl text-sm active:scale-95 transition-all">\nTạo sản phẩm\n</button> </form> </div> </div>  <div class="mt-8 glass-card rounded-2xl border border-outline-variant/20 overflow-hidden"> <div class="overflow-x-auto"> <table class="w-full text-sm"> <thead> <tr class="border-b border-outline-variant/20 text-on-surface-variant"> <th class="text-left px-4 py-3 font-semibold">Tên</th> <th class="text-left px-4 py-3 font-semibold">Loại</th> <th class="text-left px-4 py-3 font-semibold">App</th> <th class="text-right px-4 py-3 font-semibold">Giá</th> <th class="text-center px-4 py-3 font-semibold">Thời hạn</th> <th class="text-center px-4 py-3 font-semibold">Trạng thái</th> <th class="text-right px-4 py-3 font-semibold">Thao tác</th> </tr> </thead> <tbody> ', " </tbody> </table> </div> </div> <script>(function(){", `
    const modal = document.getElementById('new-product-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('modal-close');
    const newBtn = document.getElementById('btn-new-product');
    const form = document.getElementById('product-form');
    const errorEl = document.getElementById('form-error');
    const submitBtn = document.getElementById('form-submit');
    const modalTitle = document.getElementById('modal-title');
    const appIdField = document.getElementById('app-id-field');
    const typeSelect = form?.querySelector('[name="type"]');
    const appIdSelect = form?.querySelector('[name="app_id"]');

    let editingId = null;

    function toggleAppIdField() {
      if (typeSelect && appIdField) {
        const showFor = ['survey_unlock'];
        appIdField.classList.toggle('hidden', !showFor.includes(typeSelect.value));
      }
    }
    typeSelect?.addEventListener('change', toggleAppIdField);

    function openModal() { modal?.classList.remove('hidden'); toggleAppIdField(); }
    function closeModal() {
      modal?.classList.add('hidden');
      form?.reset();
      editingId = null;
      modalTitle.textContent = 'Tạo sản phẩm mới';
      submitBtn.textContent = 'Tạo sản phẩm';
      errorEl?.classList.add('hidden');
      appIdField?.classList.add('hidden');
    }

    newBtn?.addEventListener('click', openModal);
    backdrop?.addEventListener('click', closeModal);
    closeBtn?.addEventListener('click', closeModal);

    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const b = btn;
        editingId = b.dataset.id;
        const nameInput = form?.querySelector('[name="name"]');
        const typeInput = form?.querySelector('[name="type"]');
        const priceInput = form?.querySelector('[name="price"]');
        const descInput = form?.querySelector('[name="description"]');
        const durInput = form?.querySelector('[name="duration_days"]');
        const refInput = form?.querySelector('[name="reference_id"]');
        const activeInput = document.getElementById('is_active');

        if (nameInput) nameInput.value = b.dataset.name || '';
        if (typeInput) typeInput.value = b.dataset.type || '';
        if (priceInput) priceInput.value = b.dataset.price || '';
        if (descInput) descInput.value = b.dataset.description || '';
        if (durInput) durInput.value = b.dataset.duration_days || '';
        if (refInput) refInput.value = b.dataset.reference_id || '';
        if (activeInput) activeInput.checked = b.dataset.is_active === '1';
        if (appIdSelect) appIdSelect.value = b.dataset.app_id || '';

        toggleAppIdField();
        modalTitle.textContent = 'Sửa sản phẩm';
        submitBtn.textContent = 'Cập nhật';
        openModal();
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const id = btn.dataset.id;
        const name = btn.dataset.name;
        if (!confirm(\\\`Xác nhận xóa "\\\${name}"?\\\`)) return;

        const resp = await fetch(\\\`/api/admin/products/\\\${id}\\\`, { method: 'DELETE' });
        if (resp.ok) {
          window.location.reload();
        } else {
          alert('Lỗi xóa sản phẩm');
        }
      });
    });

    // Form submit (create or update)
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorEl?.classList.add('hidden');

      const data = new FormData(form);
      const body = {
        name: data.get('name'),
        type: data.get('type'),
        price: parseInt(String(data.get('price')), 10),
        description: data.get('description') || null,
        duration_days: data.get('duration_days') ? parseInt(String(data.get('duration_days')), 10) : null,
        reference_id: data.get('reference_id') || null,
        app_id: data.get('app_id') || null,
        is_active: data.get('is_active') === 'on' ? 1 : 0,
      };

      submitBtn.disabled = true;
      submitBtn.textContent = 'Đang lưu...';

      try {
        const url = editingId ? \\\`/api/admin/products/\\\${editingId}\\\` : '/api/admin/products';
        const method = editingId ? 'PUT' : 'POST';
        const resp = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        const result = await resp.json();
        if (!resp.ok) {
          errorEl.textContent = result.error || 'Lỗi lưu sản phẩm';
          errorEl?.classList.remove('hidden');
          submitBtn.disabled = false;
          submitBtn.textContent = editingId ? 'Cập nhật' : 'Tạo sản phẩm';
          return;
        }

        window.location.reload();
      } catch {
        errorEl.textContent = 'Lỗi kết nối';
        errorEl?.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = editingId ? 'Cập nhật' : 'Tạo sản phẩm';
      }
    });
  })();<\/script> `])), maybeRenderHead(), products.length, activeCount, addAttribute(newId, "value"), activeApps.map((app) => renderTemplate`<option${addAttribute(app.id, "value")}>${app.name} (${app.type})</option>`), products.length === 0 ? renderTemplate`<tr> <td colspan="7" class="px-4 py-8 text-center text-on-surface-variant">
Chưa có sản phẩm nào. Nhấn "Tạo sản phẩm mới" để bắt đầu.
</td> </tr>` : products.map((p) => renderTemplate`<tr class="border-b border-outline-variant/10 hover:bg-white/5 transition-colors"${addAttribute(p.id, "data-id")}> <td class="px-4 py-3 text-white font-medium">${p.name}</td> <td class="px-4 py-3 text-on-surface-variant">${typeLabels[p.type] ?? p.type}</td> <td class="px-4 py-3 text-on-surface-variant text-xs"> ${p.app_id ? appMap[p.app_id] ?? p.app_id : renderTemplate`<span class="text-white/30">—</span>`} </td> <td class="px-4 py-3 text-right text-white">${p.price.toLocaleString("vi-VN")}₫</td> <td class="px-4 py-3 text-center text-on-surface-variant"> ${p.duration_days ? `${p.duration_days} ngày` : "∞"} </td> <td class="px-4 py-3 text-center"> <span${addAttribute(`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${p.is_active ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-white/50"}`, "class")}> ${p.is_active ? "Đang bán" : "Tạm dừng"} </span> </td> <td class="px-4 py-3 text-right"> <button class="edit-btn text-primary hover:underline text-xs font-semibold"${addAttribute(p.id, "data-id")}${addAttribute(p.name, "data-name")}${addAttribute(p.type, "data-type")}${addAttribute(p.price, "data-price")}${addAttribute(p.description ?? "", "data-description")}${addAttribute(p.duration_days ?? "", "data-duration_days")}${addAttribute(p.reference_id ?? "", "data-reference_id")}${addAttribute(p.app_id ?? "", "data-app_id")}${addAttribute(p.is_active, "data-is_active")}>
Sửa
</button> <button class="delete-btn text-rose-400 hover:underline text-xs font-semibold ml-2"${addAttribute(p.id, "data-id")}${addAttribute(p.name, "data-name")}>
Xóa
</button> </td> </tr>`), defineScriptVars({ typeLabels })) })}`;
}, "C:/dentalempireos/src/pages/admin/products/index.astro", void 0);
const $$file = "C:/dentalempireos/src/pages/admin/products/index.astro";
const $$url = "/admin/products";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
