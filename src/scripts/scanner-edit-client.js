// Pure-JS client for scanner edit page. NO TypeScript syntax — to avoid build issues
// when Astro bundles this into the SSR worker.
//
// All data passed via data-* attributes on buttons/inputs.
// Server endpoints called via fetch.

const wrap = document.querySelector('[data-def-id]');
const defId = wrap ? wrap.getAttribute('data-def-id') : '';

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, function(c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// ── Section modal ──────────────────────────────────────
const sectionModal = document.getElementById('section-modal');
const sectionBackdrop = document.getElementById('section-modal-backdrop');
const sectionPanel = document.getElementById('section-modal-panel');
const sectionForm = document.getElementById('section-form');
const sectionFormId = document.getElementById('section-form-id');
const sectionFormTitle = document.getElementById('section-modal-title');
const sectionFormError = document.getElementById('section-form-error');

function openSectionModal(id) {
  if (!sectionForm || !sectionModal) return;
  sectionForm.reset();
  if (sectionFormError) sectionFormError.classList.add('hidden');
  if (id) {
    if (sectionFormTitle) sectionFormTitle.textContent = 'Sửa section';
    if (sectionFormId) sectionFormId.value = String(id);
    fetchSection(id);
  } else {
    if (sectionFormTitle) sectionFormTitle.textContent = 'Thêm section';
    if (sectionFormId) sectionFormId.value = '';
    showSectionModal();
  }
}

async function fetchSection(id) {
  try {
    const res = await fetch(`/api/admin/scanner-definitions/${defId}/sections/${id}`);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    setSectionForm(data);
    showSectionModal();
  } catch (err) {
    if (sectionFormError) {
      sectionFormError.textContent = err instanceof Error ? err.message : 'Load failed';
      sectionFormError.classList.remove('hidden');
    }
  }
}

function setSectionForm(data) {
  if (!sectionForm) return;
  const fields = ['title_vi', 'title_en', 'subtitle_vi', 'ref', 'icon'];
  fields.forEach(function(name) {
    const el = sectionForm.elements.namedItem(name);
    if (el) el.value = data[name] || '';
  });
}

function showSectionModal() {
  if (!sectionModal) return;
  sectionModal.classList.remove('hidden');
  requestAnimationFrame(function() {
    if (sectionBackdrop) sectionBackdrop.classList.replace('bg-black/0', 'bg-black/60');
    if (sectionPanel) {
      sectionPanel.classList.remove('scale-95', 'opacity-0');
      sectionPanel.classList.add('scale-100', 'opacity-100');
    }
  });
}

function closeSectionModal() {
  if (!sectionModal) return;
  if (sectionBackdrop) sectionBackdrop.classList.replace('bg-black/60', 'bg-black/0');
  if (sectionPanel) {
    sectionPanel.classList.remove('scale-100', 'opacity-100');
    sectionPanel.classList.add('scale-95', 'opacity-0');
  }
  setTimeout(function() { sectionModal.classList.add('hidden'); }, 300);
}

document.getElementById('btn-add-section')?.addEventListener('click', function() { openSectionModal(); });
document.getElementById('section-modal-close')?.addEventListener('click', closeSectionModal);
document.getElementById('section-modal-cancel')?.addEventListener('click', closeSectionModal);
sectionBackdrop?.addEventListener('click', closeSectionModal);

document.querySelectorAll('.btn-edit-section').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const id = parseInt(btn.getAttribute('data-section-id') || '0', 10);
    openSectionModal(id);
  });
});

document.querySelectorAll('.btn-delete-section').forEach(function(btn) {
  btn.addEventListener('click', async function() {
    const id = btn.getAttribute('data-section-id');
    const name = btn.getAttribute('data-name');
    if (!id) return;
    if (!confirm('Xóa section "' + name + '"?\n\nToàn bộ câu hỏi sẽ bị xoá.')) return;
    try {
      const res = await fetch(`/api/admin/scanner-definitions/${defId}/sections/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Xóa thất bại');
      }
      window.showToast?.('Đã xóa section', 'success');
      setTimeout(function() { window.location.reload(); }, 400);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  });
});

if (sectionForm) {
  sectionForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (sectionFormError) sectionFormError.classList.add('hidden');
    const fd = new FormData(sectionForm);
    const id = sectionFormId ? sectionFormId.value : '';
    const body = {
      title_vi: String(fd.get('title_vi') || '').trim(),
      title_en: String(fd.get('title_en') || '').trim(),
      subtitle_vi: String(fd.get('subtitle_vi') || '').trim() || null,
      ref: String(fd.get('ref') || '').trim() || null,
      icon: String(fd.get('icon') || '').trim() || null,
    };
    const url = id
      ? `/api/admin/scanner-definitions/${defId}/sections/${id}`
      : `/api/admin/scanner-definitions/${defId}/sections`;
    const method = id ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lưu thất bại');
      window.showToast?.('Đã lưu section', 'success');
      setTimeout(function() { window.location.reload(); }, 500);
    } catch (err) {
      if (sectionFormError) {
        sectionFormError.textContent = err instanceof Error ? err.message : 'Lưu thất bại';
        sectionFormError.classList.remove('hidden');
      }
    }
  });
}

// ── Question modal ──────────────────────────────────────
const qModal = document.getElementById('question-modal');
const qBackdrop = document.getElementById('question-modal-backdrop');
const qPanel = document.getElementById('question-modal-panel');
const qForm = document.getElementById('question-form');
const qFormId = document.getElementById('question-form-id');
const qFormSectionId = document.getElementById('question-form-section-id');
const qFormTitle = document.getElementById('question-modal-title');
const qFormError = document.getElementById('question-form-error');

async function openQuestionModal(sectionId, questionId) {
  if (!qForm || !qModal) return;
  qForm.reset();
  if (qFormError) qFormError.classList.add('hidden');
  if (qFormSectionId) qFormSectionId.value = String(sectionId);
  if (questionId) {
    if (qFormTitle) qFormTitle.textContent = 'Sửa câu hỏi';
    if (qFormId) qFormId.value = String(questionId);
    try {
      const res = await fetch(`/api/admin/scanner-definitions/${defId}/sections/${sectionId}/questions/${questionId}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setQuestionForm(data);
      showQuestionModal();
    } catch (err) {
      if (qFormError) {
        qFormError.textContent = err instanceof Error ? err.message : 'Load failed';
        qFormError.classList.remove('hidden');
      }
      return;
    }
  } else {
    if (qFormTitle) qFormTitle.textContent = 'Thêm câu hỏi';
    if (qFormId) qFormId.value = '';
    showQuestionModal();
  }
}

function setQuestionForm(data) {
  if (!qForm) return;
  const fields = ['question_id', 'type', 'dimension', 'label_vi', 'label_en', 'placeholder_vi', 'placeholder_en'];
  fields.forEach(function(name) {
    const el = qForm.elements.namedItem(name);
    if (el) el.value = data[name] || '';
  });
  const optionsField = qForm.elements.namedItem('options_vi_text');
  if (optionsField && data.options_vi) {
    try {
      const opts = JSON.parse(data.options_vi);
      optionsField.value = Array.isArray(opts) ? opts.join('\n') : '';
    } catch (e) {}
  }
  if (data.scale_labels_vi) {
    for (let n = 1; n <= 5; n++) {
      const el = qForm ? qForm.elements.namedItem('scale_' + n) : null;
      if (el && data.scale_labels_vi[String(n)]) el.value = data.scale_labels_vi[String(n)];
    }
  } else {
    for (let n = 1; n <= 5; n++) {
      const el = qForm ? qForm.elements.namedItem('scale_' + n) : null;
      if (el) el.value = '';
    }
  }
  const requiredField = qForm.elements.namedItem('required');
  if (requiredField) requiredField.checked = data.required === 1;
  const anchorField = qForm.elements.namedItem('anchor');
  if (anchorField) anchorField.checked = data.anchor === 1;
  updateTypeFields();
  updatePreview();
}

// Tab switching VI/EN for question modal
document.querySelectorAll('.q-tab-btn').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const tab = btn.getAttribute('data-q-tab');
    document.querySelectorAll('.q-tab-btn').forEach(function(b) {
      const active = b === btn;
      b.classList.toggle('border-primary', active);
      b.classList.toggle('text-primary', active);
      b.classList.toggle('border-transparent', !active);
      b.classList.toggle('text-on-surface-variant', !active);
    });
    document.querySelectorAll('.q-tab-panel').forEach(function(p) {
      p.classList.toggle('hidden', p.getAttribute('data-q-tab-panel') !== tab);
    });
    updatePreview();
  });
});

// Show/hide fields based on question type
function updateTypeFields() {
  const qTypeSelect = qForm ? qForm.elements.namedItem('type') : null;
  if (!qTypeSelect) return;
  const type = qTypeSelect.value;
  const optionsField = document.getElementById('q-field-options');
  const scaleField = document.getElementById('q-field-scale');
  if (optionsField) optionsField.classList.toggle('hidden', type !== 'radio');
  if (scaleField) scaleField.classList.toggle('hidden', type !== 'select');
}

const qTypeSelectGlobal = qForm ? qForm.elements.namedItem('type') : null;
if (qTypeSelectGlobal) {
  qTypeSelectGlobal.addEventListener('change', updateTypeFields);
}

// Quick templates for scale labels
document.querySelectorAll('.q-scale-template').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const tmpl = btn.getAttribute('data-template');
    if (!tmpl) return;
    try {
      const labels = JSON.parse(tmpl);
      for (let n = 1; n <= 5; n++) {
        const el = qForm ? qForm.elements.namedItem('scale_' + n) : null;
        if (el) el.value = labels[String(n)] || '';
      }
    } catch (e) {}
    updatePreview();
  });
});

// Real-time preview
for (let n = 1; n <= 5; n++) {
  const el = qForm ? qForm.elements.namedItem('scale_' + n) : null;
  if (el) el.addEventListener('input', updatePreview);
}

function updatePreview() {
  const previewEl = document.getElementById('q-preview');
  if (!previewEl || !qForm) return;
  const lang = document.querySelector('.q-tab-btn.border-primary')?.getAttribute('data-q-tab') || 'vi';
  const fd = new FormData(qForm);
  const type = String(fd.get('type') || 'select') || 'select';
  const label = String(fd.get('label_' + lang) || fd.get('label_vi') || '').trim();
  const placeholder = String(fd.get('placeholder_' + lang) || fd.get('placeholder_vi') || '').trim();
  const required = fd.get('required') === '1';
  const anchor = fd.get('anchor') === '1';

  let inputHtml = '';
  if (type === 'textarea') {
    inputHtml = '<textarea class="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface" placeholder="' + escapeHtml(placeholder) + '"' + (required ? ' required' : '') + '></textarea>';
  } else if (type === 'select') {
    const labels = {
      '1': String(fd.get('scale_1') || '').trim(),
      '2': String(fd.get('scale_2') || '').trim(),
      '3': String(fd.get('scale_3') || '').trim(),
      '4': String(fd.get('scale_4') || '').trim(),
      '5': String(fd.get('scale_5') || '').trim(),
    };
    if (!labels['1'] && !labels['2'] && !labels['3'] && !labels['4'] && !labels['5']) {
      labels = { '1': 'Chưa có', '2': 'Đang bắt đầu', '3': 'Đã có', '4': 'Ổn định', '5': 'Đầu tàu' };
    }
    const pills = [1, 2, 3, 4, 5].map(function(n) {
      return '<label class="scale-option flex-1 min-w-[80px] cursor-pointer">' +
        '<input type="radio" disabled class="hidden" />' +
        '<span class="scale-pill flex flex-col items-center p-2 bg-surface-container border border-outline-variant rounded-lg">' +
        '<span class="scale-num font-bold text-on-surface">' + n + '</span>' +
        '<span class="scale-text text-[10px] text-on-surface-variant text-center">' + escapeHtml(labels[String(n)] || '') + '</span>' +
        '</span></label>';
    }).join('');
    inputHtml = '<div class="flex gap-2 flex-wrap">' + pills + '</div>';
  } else if (type === 'radio') {
    const optsRaw = String(fd.get('options_vi_text') || '');
    const opts = optsRaw.split('\n').map(function(s) { return s.trim(); }).filter(Boolean);
    if (opts.length === 0) {
      inputHtml = '<p class="text-xs text-on-surface-variant italic">Chưa có options (cần thêm cho radio)</p>';
    } else {
      inputHtml = '<div class="flex flex-col gap-2">' + opts.map(function(o) {
        return '<label class="flex items-start gap-2 p-2 bg-surface-container border border-outline-variant rounded-lg">' +
          '<input type="radio" disabled class="mt-0.5" />' +
          '<span class="text-sm text-on-surface">' + escapeHtml(o) + '</span></label>';
      }).join('') + '</div>';
    }
  } else if (type === 'yesno') {
    inputHtml = '<div class="flex gap-2">' +
      '<label class="flex-1 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-center text-on-surface cursor-pointer">Có</label>' +
      '<label class="flex-1 px-4 py-2 bg-surface-container border border-outline-variant rounded-lg text-center text-on-surface cursor-pointer">Chưa</label>' +
      '</div>';
  }

  previewEl.innerHTML =
    '<div class="bg-surface-container/40 rounded-xl p-4 border border-outline-variant/15">' +
      (anchor ? '<span class="inline-block text-[10px] font-bold text-amber-400 mb-1 uppercase tracking-wider">⭐ Anchor</span>' : '') +
      '<p class="text-sm font-medium text-on-surface mb-2">' + (label || '<span class="italic text-on-surface-variant">Câu hỏi...</span>') +
      (required ? ' <span class="text-red-400">*</span>' : '') + '</p>' +
      inputHtml +
      '<p class="text-xs text-on-surface-variant/70 mt-3">Type: ' + type + ' · ID: ' + escapeHtml(String(fd.get('question_id') || '—')) + '</p>' +
    '</div>';
}

if (qForm) {
  ['input', 'change'].forEach(function(evt) {
    qForm.addEventListener(evt, updatePreview);
  });
}

// Auto-generate question_id from label
const qLabelVi = qForm ? qForm.elements.namedItem('label_vi') : null;
const qQuestionIdInput = qForm ? qForm.elements.namedItem('question_id') : null;
if (qLabelVi && qQuestionIdInput) {
  let userTypedId = false;
  qQuestionIdInput.addEventListener('input', function() { userTypedId = true; });
  qLabelVi.addEventListener('input', function() {
    if (userTypedId) return;
    const slug = qLabelVi.value
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd').replace(/Đ/g, 'D')
      .replace(/[^a-z0-9\s_]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 40);
    qQuestionIdInput.value = slug;
    qQuestionIdInput.classList.add('ring-2', 'ring-primary/30');
    setTimeout(function() {
      qQuestionIdInput.classList.remove('ring-2', 'ring-primary/30');
    }, 500);
  });
}

function showQuestionModal() {
  if (!qModal) return;
  qModal.classList.remove('hidden');
  requestAnimationFrame(function() {
    if (qBackdrop) qBackdrop.classList.replace('bg-black/0', 'bg-black/60');
    if (qPanel) {
      qPanel.classList.remove('scale-95', 'opacity-0');
      qPanel.classList.add('scale-100', 'opacity-100');
    }
  });
}

function closeQuestionModal() {
  if (!qModal) return;
  if (qBackdrop) qBackdrop.classList.replace('bg-black/60', 'bg-black/0');
  if (qPanel) {
    qPanel.classList.remove('scale-100', 'opacity-100');
    qPanel.classList.add('scale-95', 'opacity-0');
  }
  setTimeout(function() { qModal.classList.add('hidden'); }, 300);
}

document.getElementById('question-modal-close')?.addEventListener('click', closeQuestionModal);
document.getElementById('question-modal-cancel')?.addEventListener('click', closeQuestionModal);
qBackdrop?.addEventListener('click', closeQuestionModal);

document.querySelectorAll('.btn-add-question').forEach(function(btn) {
  btn.addEventListener('click', function() {
    const sectionId = parseInt(btn.getAttribute('data-section-id') || '0', 10);
    openQuestionModal(sectionId);
  });
});

document.querySelectorAll('.btn-edit-question').forEach(function(btn) {
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const questionId = parseInt(btn.getAttribute('data-question-id') || '0', 10);
    const sectionId = parseInt(btn.getAttribute('data-section-id') || '0', 10);
    openQuestionModal(sectionId, questionId);
  });
});

document.querySelectorAll('.btn-delete-question').forEach(function(btn) {
  btn.addEventListener('click', async function(e) {
    e.stopPropagation();
    const id = btn.getAttribute('data-question-id');
    const label = btn.getAttribute('data-label');
    if (!id) return;
    if (!confirm('Xóa câu hỏi "' + label + '"?')) return;
    try {
      const res = await fetch(`/api/admin/scanner-definitions/${defId}/sections/0/questions/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Xóa thất bại');
      }
      window.showToast?.('Đã xóa câu hỏi', 'success');
      setTimeout(function() { window.location.reload(); }, 400);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Xóa thất bại');
    }
  });
});

if (qForm) {
  qForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (qFormError) qFormError.classList.add('hidden');
    const fd = new FormData(qForm);
    const sectionId = qFormSectionId ? qFormSectionId.value : '';
    const questionId = qFormId ? qFormId.value : '';

    const optionsText = String(fd.get('options_vi_text') || '').trim();
    const optionsVi = optionsText
      ? optionsText.split('\n').map(function(s) { return s.trim(); }).filter(Boolean)
      : null;

    const scale_1 = String(fd.get('scale_1') || '').trim();
    const scale_2 = String(fd.get('scale_2') || '').trim();
    const scale_3 = String(fd.get('scale_3') || '').trim();
    const scale_4 = String(fd.get('scale_4') || '').trim();
    const scale_5 = String(fd.get('scale_5') || '').trim();
    const hasScale = [scale_1, scale_2, scale_3, scale_4, scale_5].some(function(s) { return s.length > 0; });
    const scaleLabelsVi = hasScale
      ? { 1: scale_1, 2: scale_2, 3: scale_3, 4: scale_4, 5: scale_5 }
      : null;

    const qid = String(fd.get('question_id') || '').trim();
    if (!qid || !/^[a-z0-9_]+$/.test(qid)) {
      if (qFormError) {
        qFormError.textContent = 'question_id phải là chữ thường, số, gạch dưới (vd: hr_q1)';
        qFormError.classList.remove('hidden');
      }
      return;
    }

    const body = {
      question_id: qid,
      type: String(fd.get('type') || 'select'),
      dimension: String(fd.get('dimension') || '').trim() || null,
      label_vi: String(fd.get('label_vi') || '').trim(),
      label_en: String(fd.get('label_en') || '').trim(),
      placeholder_vi: String(fd.get('placeholder_vi') || '').trim() || null,
      placeholder_en: String(fd.get('placeholder_en') || '').trim() || null,
      options_vi: optionsVi,
      scale_labels_vi: scaleLabelsVi,
      required: fd.get('required') === '1' ? 1 : 0,
      anchor: fd.get('anchor') === '1' ? 1 : 0,
    };

    const url = questionId
      ? `/api/admin/scanner-definitions/${defId}/sections/${sectionId}/questions/${questionId}`
      : `/api/admin/scanner-definitions/${defId}/sections/${sectionId}/questions`;
    const method = questionId ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lưu thất bại');
      window.showToast?.('Đã lưu câu hỏi', 'success');
      setTimeout(function() { window.location.reload(); }, 500);
    } catch (err) {
      if (qFormError) {
        qFormError.textContent = err instanceof Error ? err.message : 'Lưu thất bại';
        qFormError.classList.remove('hidden');
      }
    }
  });
}

// ── Info form ───────────────────────────────────────────
const infoForm = document.getElementById('form-info');
const infoError = document.getElementById('info-error');
if (infoForm) {
  infoForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (infoError) infoError.classList.add('hidden');
    const fd = new FormData(infoForm);
    const chapterRefsStr = String(fd.get('chapter_refs') || '').trim();
    const chapterRefs = chapterRefsStr
      ? chapterRefsStr.split(',').map(function(s) { return s.trim(); }).filter(Boolean)
      : [];

    const body = {
      title_vi: String(fd.get('title_vi') || '').trim(),
      title_en: String(fd.get('title_en') || '').trim(),
      slug: String(fd.get('slug') || '').trim(),
      status: String(fd.get('status') || 'draft'),
      survey_type: String(fd.get('survey_type') || 'full'),
      is_free: fd.get('is_free') === '1' ? 1 : 0,
      description_vi: String(fd.get('description_vi') || '').trim() || null,
      description_en: String(fd.get('description_en') || '').trim() || null,
      chapter_refs: chapterRefs,
    };
    try {
      const res = await fetch(`/api/admin/scanner-definitions/${defId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lưu thất bại');
      window.showToast?.('Đã lưu thông tin', 'success');
      setTimeout(function() { window.location.reload(); }, 600);
    } catch (err) {
      if (infoError) {
        infoError.textContent = err instanceof Error ? err.message : 'Lưu thất bại';
        infoError.classList.remove('hidden');
      }
    }
  });
}

// ════════════════════════════════════════════════════════════
// SCORING RULES EDITOR (Visual UI)
// ════════════════════════════════════════════════════════════

const allQuestions = JSON.parse(wrap?.getAttribute('data-all-questions') || '[]');
const scoringInit = JSON.parse(wrap?.getAttribute('data-scoring-init') || '{"dimensions":[],"total_formula":"average","thresholds":{"excellent":75,"good":55,"needs_work":35,"critical":0}}');

let dimensions = (scoringInit.dimensions || []).map(function(d) {
  return {
    id: d.id || 'dim_' + Math.random().toString(36).slice(2, 7),
    name_vi: d.name_vi || '',
    name_en: d.name_en || '',
    formula: d.formula || 'avg',
    question_ids: d.question_ids || [],
    weight: d.weight != null ? d.weight : 1,
  };
});

let totalFormula = scoringInit.total_formula || 'average';
let thresholds = Object.assign({ excellent: 75, good: 55, needs_work: 35, critical: 0 }, scoringInit.thresholds || {});

// ── Render dimension cards ──────────────────────────────

function renderDimensions() {
  const list = document.getElementById('dimensions-list');
  const empty = document.getElementById('dimensions-empty');
  if (!list) return;

  if (dimensions.length === 0) {
    list.innerHTML = '';
    if (empty) empty.classList.remove('hidden');
    return;
  }
  if (empty) empty.classList.add('hidden');

  list.innerHTML = dimensions.map(function(dim) {
    var selectedQs = allQuestions.filter(function(q) { return dim.question_ids.indexOf(q.id) !== -1; });
    var availableQs = allQuestions.filter(function(q) { return dim.question_ids.indexOf(q.id) === -1; });
    var formulaOptions = [
      { value: 'avg', label: 'avg — tr.bình (1-5 → 0-100)' },
      { value: 'sum', label: 'sum — tổng số' },
      { value: 'count_if', label: 'count_if — đếm câu "Có"' },
    ];
    var qBadges = selectedQs.map(function(q) {
      return '<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/15 text-primary border border-primary/20">' +
        escapeHtml(q.id) +
        '<button type="button" class="dim-q-remove hover:text-red-400 leading-none" data-qid="' + escapeHtml(q.id) + '" data-dim="' + escapeHtml(dim.id) + '">×</button></span>';
    }).join('');

    return '<div class="dim-card bg-surface-container/40 rounded-xl p-4 border border-outline-variant/15" data-dim-id="' + escapeHtml(dim.id) + '">' +
      '<div class="flex items-start gap-3 mb-3">' +
        '<div class="flex-1 flex flex-col gap-2">' +
          '<div class="grid grid-cols-1 sm:grid-cols-2 gap-2">' +
            '<div>' +
              '<label class="text-[10px] font-semibold text-on-surface-variant/70 block mb-1">Tên chiều (VI) *</label>' +
              '<input type="text" class="dim-name-vi w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary" value="' + escapeHtml(dim.name_vi) + '" data-dim="' + escapeHtml(dim.id) + '" placeholder="VD: Nhân sự, Tài chính..." />' +
            '</div>' +
            '<div>' +
              '<label class="text-[10px] font-semibold text-on-surface-variant/70 block mb-1">Tên (EN)</label>' +
              '<input type="text" class="dim-name-en w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary" value="' + escapeHtml(dim.name_en) + '" data-dim="' + escapeHtml(dim.id) + '" placeholder="e.g., HR, Finance..." />' +
            '</div>' +
          '</div>' +
          '<div class="grid grid-cols-1 sm:grid-cols-3 gap-2">' +
            '<div>' +
              '<label class="text-[10px] font-semibold text-on-surface-variant/70 block mb-1">Công thức</label>' +
              '<select class="dim-formula w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary" data-dim="' + escapeHtml(dim.id) + '">' +
                formulaOptions.map(function(o) {
                  return '<option value="' + o.value + '"' + (dim.formula === o.value ? ' selected' : '') + '>' + o.label + '</option>';
                }).join('') +
              '</select>' +
            '</div>' +
            '<div>' +
              '<label class="text-[10px] font-semibold text-on-surface-variant/70 block mb-1">Trọng số (weight)</label>' +
              '<input type="number" class="dim-weight w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-on-surface font-mono focus:outline-none focus:border-primary" value="' + dim.weight + '" min="0" max="10" step="0.5" data-dim="' + escapeHtml(dim.id) + '" />' +
            '</div>' +
            '<div class="flex items-end">' +
              '<button type="button" class="btn-delete-dim w-full px-3 py-2 rounded-lg text-sm font-semibold text-red-400/70 hover:text-red-400 hover:bg-red-500/10 border border-red-500/20 transition-all flex items-center justify-center gap-1" data-dim="' + escapeHtml(dim.id) + '">' +
                '<span class="material-symbols-outlined text-[16px]">delete</span> Xóa' +
              '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div>' +
        '<div class="flex items-center justify-between mb-2">' +
          '<label class="text-[10px] font-semibold text-on-surface-variant/70">Câu hỏi đã gán (' + selectedQs.length + ')</label>' +
          '<span class="text-[10px] text-on-surface-variant/40">Chỉ select/yesno tính điểm</span>' +
        '</div>' +
        (selectedQs.length > 0
          ? '<div class="flex flex-wrap gap-1.5 mb-2">' + qBadges + '</div>'
          : '<p class="text-[11px] text-on-surface-variant/40 italic mb-2">Chưa gán câu hỏi nào.</p>') +
        '<div class="flex gap-2">' +
          '<select class="dim-q-picker flex-1 bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary" data-dim="' + escapeHtml(dim.id) + '">' +
            '<option value="">+ Thêm câu hỏi...</option>' +
            availableQs.map(function(q) {
              return '<option value="' + escapeHtml(q.id) + '">[' + escapeHtml(q.section.slice(0, 18)) + '] ' + escapeHtml(q.id) + '</option>';
            }).join('') +
          '</select>' +
          '<button type="button" class="btn-add-dim-q px-3 py-2 rounded-lg bg-primary/20 text-primary text-xs font-semibold hover:bg-primary/30 transition-all" data-dim="' + escapeHtml(dim.id) + '"' + (availableQs.length === 0 ? ' disabled' : '') + '>Thêm</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  bindDimensionEvents();
  updateScoringPreview();
}

function bindDimensionEvents() {
  document.querySelectorAll('.dim-name-vi').forEach(function(inp) {
    inp.addEventListener('input', function() {
      var id = inp.getAttribute('data-dim');
      var d = dimensions.find(function(x) { return x.id === id; });
      if (d) d.name_vi = inp.value;
      updateScoringPreview();
    });
  });
  document.querySelectorAll('.dim-name-en').forEach(function(inp) {
    inp.addEventListener('input', function() {
      var id = inp.getAttribute('data-dim');
      var d = dimensions.find(function(x) { return x.id === id; });
      if (d) d.name_en = inp.value;
    });
  });
  document.querySelectorAll('.dim-formula').forEach(function(sel) {
    sel.addEventListener('change', function() {
      var id = sel.getAttribute('data-dim');
      var d = dimensions.find(function(x) { return x.id === id; });
      if (d) d.formula = sel.value;
      updateScoringPreview();
    });
  });
  document.querySelectorAll('.dim-weight').forEach(function(inp) {
    inp.addEventListener('input', function() {
      var id = inp.getAttribute('data-dim');
      var d = dimensions.find(function(x) { return x.id === id; });
      if (d) d.weight = parseFloat(inp.value) || 0;
      updateScoringPreview();
    });
  });
  document.querySelectorAll('.btn-delete-dim').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = btn.getAttribute('data-dim');
      if (!confirm('Xóa dimension này?')) return;
      dimensions = dimensions.filter(function(d) { return d.id !== id; });
      renderDimensions();
    });
  });
  document.querySelectorAll('.btn-add-dim-q').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = btn.getAttribute('data-dim');
      var picker = document.querySelector('.dim-q-picker[data-dim="' + id + '"]');
      if (!picker || !picker.value) return;
      var qid = picker.value;
      var d = dimensions.find(function(x) { return x.id === id; });
      if (d && d.question_ids.indexOf(qid) === -1) {
        d.question_ids.push(qid);
        renderDimensions();
      }
    });
  });
  document.querySelectorAll('.dim-q-remove').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var qid = btn.getAttribute('data-qid');
      var id = btn.getAttribute('data-dim');
      var d = dimensions.find(function(x) { return x.id === id; });
      if (d) {
        d.question_ids = d.question_ids.filter(function(q) { return q !== qid; });
        renderDimensions();
      }
    });
  });
}

// ── Threshold bar ──────────────────────────────────────

function updateThresholdBar() {
  var exc = parseInt(document.querySelector('input[name="threshold_excellent"]')?.value || '75', 10);
  var good = parseInt(document.querySelector('input[name="threshold_good"]')?.value || '55', 10);
  var needs = parseInt(document.querySelector('input[name="threshold_needs_work"]')?.value || '35', 10);
  var crit = parseInt(document.querySelector('input[name="threshold_critical"]')?.value || '0', 10);
  var c = document.getElementById('bar-critical');
  var n = document.getElementById('bar-needs-work');
  var g = document.getElementById('bar-good');
  var ex = document.getElementById('bar-excellent');
  if (c) c.style.width = Math.max(0, crit) + '%';
  if (n) n.style.width = Math.max(0, needs - crit) + '%';
  if (g) g.style.width = Math.max(0, good - needs) + '%';
  if (ex) ex.style.width = Math.max(0, 100 - good) + '%';
}

// ── Preview ─────────────────────────────────────────────

function getScoreColor(score) {
  if (score >= 75) return 'bg-emerald-500/70';
  if (score >= 55) return 'bg-blue-500/70';
  if (score >= 35) return 'bg-amber-500/70';
  return 'bg-red-500/70';
}

function updateScoringPreview() {
  var container = document.getElementById('scoring-preview');
  var content = document.getElementById('scoring-preview-content');
  if (!container || !content) return;
  if (dimensions.length === 0) { container.classList.add('hidden'); return; }
  container.classList.remove('hidden');

  var tf = document.querySelector('input[name="total_formula"]:checked')?.value || 'average';
  var scores = {};
  dimensions.forEach(function(d, i) {
    scores[d.id] = Math.min(100, Math.round(30 + (i * 15) + (d.question_ids.length * 5)));
  });
  var dimScores = dimensions.map(function(d) { return scores[d.id] || 0; });
  var total;
  if (tf === 'weighted_average') {
    var tw = 0, ts = 0;
    dimensions.forEach(function(d) {
      var w = d.weight || 1;
      tw += w;
      ts += (scores[d.id] || 0) * w;
    });
    total = tw > 0 ? Math.round(ts / tw) : 0;
  } else {
    total = dimScores.length > 0 ? Math.round(dimScores.reduce(function(s, v) { return s + v; }, 0) / dimScores.length) : 0;
  }

  var html = '';
  dimensions.forEach(function(d) {
    var score = scores[d.id] || 0;
    html += '<div class="flex-1 min-w-[120px]">' +
      '<p class="text-[10px] text-on-surface-variant/60 truncate mb-1">' + escapeHtml(d.name_vi || d.id) + '</p>' +
      '<div class="flex items-center gap-1.5">' +
        '<div class="flex-1 h-2 rounded-full bg-surface-container overflow-hidden">' +
          '<div class="h-full rounded-full ' + getScoreColor(score) + '" style="width:' + score + '%"></div>' +
        '</div>' +
        '<span class="text-xs font-bold font-mono">' + score + '</span>' +
      '</div>' +
    '</div>';
  });
  html += '<div class="w-full col-span-full border-t border-outline-variant/20 pt-2 mt-1">' +
    '<div class="flex items-center gap-2">' +
      '<span class="text-[10px] font-semibold text-primary">TỔNG</span>' +
      '<div class="flex-1 h-3 rounded-full bg-surface-container overflow-hidden">' +
        '<div class="h-full rounded-full ' + getScoreColor(total) + '" style="width:' + total + '%"></div>' +
      '</div>' +
      '<span class="text-sm font-bold font-mono">' + total + '</span>' +
    '</div>' +
  '</div>';
  content.innerHTML = html;
}

// ── JSON toggle ─────────────────────────────────────────

var isScoringJsonMode = false;
document.getElementById('btn-scoring-json-toggle')?.addEventListener('click', function() {
  isScoringJsonMode = !isScoringJsonMode;
  var jsonPanel = document.getElementById('scoring-panel-json');
  var structPanel = document.getElementById('scoring-panel-structured');
  var label = document.getElementById('scoring-json-toggle-label');
  if (jsonPanel) jsonPanel.classList.toggle('hidden', !isScoringJsonMode);
  if (structPanel) structPanel.classList.toggle('hidden', isScoringJsonMode);
  if (label) label.textContent = isScoringJsonMode ? 'Form' : 'JSON thô';
  if (isScoringJsonMode) {
    var ta = document.getElementById('scoring-rules-json-ta');
    if (ta) ta.value = JSON.stringify(buildScoringRulesFromState(), null, 2);
  }
});

// ── State → Rules object ────────────────────────────────

function buildScoringRulesFromState() {
  var tExc = parseInt(document.querySelector('input[name="threshold_excellent"]')?.value || '75', 10);
  var tGood = parseInt(document.querySelector('input[name="threshold_good"]')?.value || '55', 10);
  var tNeeds = parseInt(document.querySelector('input[name="threshold_needs_work"]')?.value || '35', 10);
  var tCrit = parseInt(document.querySelector('input[name="threshold_critical"]')?.value || '0', 10);
  var tf = document.querySelector('input[name="total_formula"]:checked')?.value || 'average';
  return {
    dimensions: dimensions.map(function(d) {
      return {
        id: d.id,
        name_vi: d.name_vi,
        name_en: d.name_en || undefined,
        formula: d.formula,
        question_ids: d.question_ids,
        weight: d.weight !== 1 ? d.weight : undefined,
      };
    }),
    total_formula: tf,
    thresholds: { excellent: tExc, good: tGood, needs_work: tNeeds, critical: tCrit },
  };
}

// ── Init ───────────────────────────────────────────────

document.querySelectorAll('input[name="total_formula"]').forEach(function(r) {
  if (r.value === totalFormula) r.checked = true;
  r.addEventListener('change', function() { totalFormula = r.value; updateScoringPreview(); });
});

var thExc = document.querySelector('input[name="threshold_excellent"]');
var thGood = document.querySelector('input[name="threshold_good"]');
var thNeeds = document.querySelector('input[name="threshold_needs_work"]');
var thCrit = document.querySelector('input[name="threshold_critical"]');
if (thExc) thExc.value = thresholds.excellent;
if (thGood) thGood.value = thresholds.good;
if (thNeeds) thNeeds.value = thresholds.needs_work;
if (thCrit) thCrit.value = thresholds.critical;
[thExc, thGood, thNeeds, thCrit].forEach(function(inp) {
  if (inp) inp.addEventListener('input', function() { updateThresholdBar(); updateScoringPreview(); });
});

document.getElementById('btn-add-dimension')?.addEventListener('click', function() {
  var newId = 'dim_' + Math.random().toString(36).slice(2, 7);
  dimensions.push({ id: newId, name_vi: '', name_en: '', formula: 'avg', question_ids: [], weight: 1 });
  renderDimensions();
  setTimeout(function() {
    var inp = document.querySelector('.dim-name-vi[data-dim="' + newId + '"]');
    if (inp) inp.focus();
  }, 50);
});

renderDimensions();
updateThresholdBar();

// ── Scoring form submit ─────────────────────────────────

const scoringForm = document.getElementById('form-scoring');
const scoringError = document.getElementById('scoring-error');
const scoringSubmitBtn = document.getElementById('btn-scoring-submit');
if (scoringForm) {
  scoringForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (scoringError) scoringError.classList.add('hidden');
    if (scoringSubmitBtn) {
      scoringSubmitBtn.disabled = true;
      scoringSubmitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Đang lưu...';
    }

    var rules;
    if (isScoringJsonMode) {
      var raw = String(document.getElementById('scoring-rules-json-ta')?.value || '').trim();
      if (raw) {
        try { rules = JSON.parse(raw); }
        catch (err) {
          if (scoringError) {
            scoringError.textContent = 'JSON không hợp lệ: ' + (err.message || '');
            scoringError.classList.remove('hidden');
          }
          if (scoringSubmitBtn) {
            scoringSubmitBtn.disabled = false;
            scoringSubmitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu Scoring Rules';
          }
          return;
        }
      }
    } else {
      rules = buildScoringRulesFromState();
    }

    if (!rules.dimensions || rules.dimensions.length === 0) {
      if (scoringError) {
        scoringError.textContent = 'Cần ít nhất 1 dimension.';
        scoringError.classList.remove('hidden');
      }
      if (scoringSubmitBtn) {
        scoringSubmitBtn.disabled = false;
        scoringSubmitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu Scoring Rules';
      }
      return;
    }

    try {
      var res = await fetch(`/api/admin/scanner-definitions/${defId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scoring_rules: rules }),
      });
      var data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lưu thất bại');
      window.showToast?.('Đã lưu Scoring Rules', 'success');
    } catch (err) {
      if (scoringError) {
        scoringError.textContent = err instanceof Error ? err.message : 'Lưu thất bại';
        scoringError.classList.remove('hidden');
      }
    } finally {
      if (scoringSubmitBtn) {
        scoringSubmitBtn.disabled = false;
        scoringSubmitBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu Scoring Rules';
      }
    }
  });
}
