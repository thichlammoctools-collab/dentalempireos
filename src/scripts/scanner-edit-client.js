// Pure-JS client for scanner edit page. NO TypeScript syntax — to avoid build issues
// when Astro bundles this into the SSR worker.
//
// All data passed via data-* attributes on buttons/inputs.
// Server endpoints called via fetch.

const wrap = document.querySelector('[data-def-id]');
const defId = wrap ? wrap.getAttribute('data-def-id') : '';

// ── Tab navigation (pure CSS via anchor links, no JS needed) ──

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
  const fields = ['question_id', 'type', 'dimension', 'label_vi', 'label_en', 'placeholder_vi'];
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
  const scaleField = qForm.elements.namedItem('scale_labels_vi_text');
  if (scaleField && data.scale_labels_vi) {
    scaleField.value = data.scale_labels_vi;
  }
  const requiredField = qForm.elements.namedItem('required');
  if (requiredField) requiredField.checked = data.required === 1;
  const anchorField = qForm.elements.namedItem('anchor');
  if (anchorField) anchorField.checked = data.anchor === 1;
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

    const scaleLabelsText = String(fd.get('scale_labels_vi_text') || '').trim();
    let scaleLabelsVi = null;
    if (scaleLabelsText) {
      try { scaleLabelsVi = JSON.parse(scaleLabelsText); }
      catch (err) {
        if (qFormError) {
          qFormError.textContent = 'Scale labels JSON không hợp lệ';
          qFormError.classList.remove('hidden');
        }
        return;
      }
    }

    const body = {
      question_id: String(fd.get('question_id') || '').trim(),
      type: String(fd.get('type') || 'select'),
      dimension: String(fd.get('dimension') || '').trim() || null,
      label_vi: String(fd.get('label_vi') || '').trim(),
      label_en: String(fd.get('label_en') || '').trim(),
      placeholder_vi: String(fd.get('placeholder_vi') || '').trim() || null,
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

// ── Info form (basic info save) ─────────────────────────
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

// ── AI form ────────────────────────────────────────────
const aiForm = document.getElementById('form-ai');
const aiError = document.getElementById('ai-error');
if (aiForm) {
  aiForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (aiError) aiError.classList.add('hidden');
    const fd = new FormData(aiForm);
    let aiConfig = null;
    const raw = String(fd.get('ai_config') || '').trim();
    if (raw) {
      try { aiConfig = JSON.parse(raw); }
      catch (err) {
        if (aiError) {
          aiError.textContent = 'JSON không hợp lệ';
          aiError.classList.remove('hidden');
        }
        return;
      }
    }
    try {
      const res = await fetch(`/api/admin/scanner-definitions/${defId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ai_config: aiConfig }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lưu thất bại');
      window.showToast?.('Đã lưu AI Config', 'success');
    } catch (err) {
      if (aiError) {
        aiError.textContent = err instanceof Error ? err.message : 'Lưu thất bại';
        aiError.classList.remove('hidden');
      }
    }
  });
}

// ── Scoring form ───────────────────────────────────────
const scoringForm = document.getElementById('form-scoring');
const scoringError = document.getElementById('scoring-error');
if (scoringForm) {
  scoringForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    if (scoringError) scoringError.classList.add('hidden');
    const fd = new FormData(scoringForm);
    let scoringRules = null;
    const raw = String(fd.get('scoring_rules') || '').trim();
    if (raw) {
      try { scoringRules = JSON.parse(raw); }
      catch (err) {
        if (scoringError) {
          scoringError.textContent = 'JSON không hợp lệ';
          scoringError.classList.remove('hidden');
        }
        return;
      }
    }
    try {
      const res = await fetch(`/api/admin/scanner-definitions/${defId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scoring_rules: scoringRules }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lưu thất bại');
      window.showToast?.('Đã lưu Scoring Rules', 'success');
    } catch (err) {
      if (scoringError) {
        scoringError.textContent = err instanceof Error ? err.message : 'Lưu thất bại';
        scoringError.classList.remove('hidden');
      }
    }
  });
}