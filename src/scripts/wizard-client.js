// Pure-JS client for the AI product creation wizard.
// NO TypeScript syntax — follows scanner-edit-client.js pattern.

(function() {
  'use strict';

  // ── State ──────────────────────────────────────────────
  var currentStep = 1;
  var totalSteps = 5;
  var selectedType = null;
  var generatedData = null;
  var allAnswers = {};

  // ── Helpers ────────────────────────────────────────────
  function slugify(text) {
    if (!text) return '';
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }

  function show(id) {
    var el = document.getElementById(id);
    if (el) el.classList.remove('hidden');
  }

  function _hide(id) {
    var el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  }

  function showEl(el) {
    if (el) el.classList.remove('hidden');
  }

  function hideEl(el) {
    if (el) el.classList.add('hidden');
  }

  function showToast(msg, type) {
    if (typeof window !== 'undefined' && (window).showToast) {
      (window).showToast(msg, type);
    } else {
      alert(msg);
    }
  }

  // ── Step Navigation ────────────────────────────────────
  function updateStepIndicator(step) {
    for (var i = 1; i <= totalSteps; i++) {
      var pill = document.querySelector('[data-step="' + i + '"]');
      var labelText = document.querySelector('[data-step-label-text="' + i + '"]');
      var line = document.querySelector('[data-line="' + (i - 1) + '"]');

      if (!pill) continue;

      if (i < step) {
        // Completed
        pill.className = 'flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold bg-primary/20 text-primary';
        pill.innerHTML = '<span class="material-symbols-outlined text-[14px]">check</span>';
        if (line) line.className = line.className.replace('bg-outline-variant/20', 'bg-primary/40');
      } else if (i === step) {
        // Active
        pill.className = 'flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold bg-primary text-white';
        pill.textContent = i;
        if (line) line.className = line.className.replace('bg-outline-variant/20', 'bg-primary/40');
      } else {
        // Pending
        pill.className = 'flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold bg-surface-container-high text-on-surface-variant';
        pill.textContent = i;
      }

      if (labelText) {
        labelText.className = i === step
          ? 'text-[11px] font-semibold text-primary transition-colors duration-200'
          : 'text-[11px] font-medium text-on-surface-variant/50 transition-colors duration-200';
      }
    }
  }

  function showStep(step) {
    for (var i = 1; i <= totalSteps; i++) {
      var panel = document.getElementById('step-panel-' + i);
      if (panel) {
        if (i === step) {
          panel.classList.remove('hidden');
        } else {
          panel.classList.add('hidden');
        }
      }
    }
    updateStepIndicator(step);
    currentStep = step;
  }

  // ── Slug preview ───────────────────────────────────────
  function updateSlugPreview() {
    var nameInput = document.getElementById('step2-name');
    var preview = document.getElementById('slug-preview');
    if (nameInput && preview) {
      preview.textContent = slugify(nameInput.value) || '—';
    }
  }

  // ── Type-specific fields ──────────────────────────────
  function showTypeFields(type) {
    var types = ['survey', 'ebook_ai', 'course_ai', 'tool', 'generator'];
    types.forEach(function(t) {
      var el = document.getElementById('cfg-' + t);
      if (el) {
        if (t === type) {
          el.classList.remove('hidden');
        } else {
          el.classList.add('hidden');
        }
      }
    });

    var subtitle = document.getElementById('step3-subtitle');
    if (subtitle) {
      var subtitles = {
        survey: 'Cấu hình khảo sát: số section, chủ đề, và scoring',
        ebook_ai: 'Cấu hình ebook: chủ đề, số chương, độ sâu',
        course_ai: 'Cấu hình khóa học: chủ đề, số bài, định dạng',
        tool: 'Cấu hình công cụ: mục đích, input, output',
        generator: 'Cấu hình generator: loại nội dung, tone, format'
      };
      subtitle.textContent = subtitles[type] || 'Tùy chỉnh chi tiết cho loại đã chọn';
    }
  }

  // ── Collect answers ────────────────────────────────────
  function collectAnswers() {
    var type = selectedType || document.querySelector('input[name="app_type"]:checked')?.value || '';

    // Step 2
    var name = document.getElementById('step2-name')?.value?.trim() || '';
    var description = document.getElementById('step2-desc')?.value?.trim() || '';
    var language = document.querySelector('input[name="language"]:checked')?.value || 'vi';
    var goals = document.getElementById('step2-goals')?.value?.trim() || '';
    var answers = {
      name: name,
      description: description,
      language: language,
      goals: goals,
    };

    // Step 3 type-specific
    if (type === 'survey') {
      answers.sections_count = document.querySelector('input[name="sections_count"]:checked')?.value || 'mini';
      answers.topics = document.getElementById('cfg-topics')?.value?.trim() || '';
      answers.needs_scoring = document.getElementById('cfg-needs-scoring')?.checked || false;

      var dims = [];
      var dimRows = document.querySelectorAll('.dim-row');
      dimRows.forEach(function(row, idx) {
        var nameInput = row.querySelector('input[name^="dim_name_"]');
        var formulaSelect = row.querySelector('select[name^="dim_formula_"]');
        if (nameInput?.value?.trim()) {
          dims.push({
            name: nameInput.value.trim(),
            formula: formulaSelect?.value || 'avg'
          });
        }
      });
      answers.dimensions = dims;
    } else if (type === 'ebook_ai') {
      answers.ebook_topic = document.querySelector('input[name="ebook_topic"]')?.value?.trim() || '';
      answers.ebook_chapters = parseInt(document.querySelector('input[name="ebook_chapters"]')?.value) || 5;
      answers.ebook_depth = document.querySelector('select[name="ebook_depth"]')?.value || 'Chi tiết';
      answers.ebook_audience = document.querySelector('textarea[name="ebook_audience"]')?.value?.trim() || '';
    } else if (type === 'course_ai') {
      answers.course_topic = document.querySelector('input[name="course_topic"]')?.value?.trim() || '';
      answers.course_lessons = parseInt(document.querySelector('input[name="course_lessons"]')?.value) || 5;
      answers.course_level = document.querySelector('select[name="course_level"]')?.value || 'Intermediate';
      var formats = [];
      document.querySelectorAll('input[name="course_formats"]:checked').forEach(function(cb) {
        formats.push(cb.value);
      });
      answers.course_formats = formats;
    } else if (type === 'tool') {
      answers.tool_purpose = document.querySelector('textarea[name="tool_purpose"]')?.value?.trim() || '';
      answers.tool_input = document.querySelector('textarea[name="tool_input"]')?.value?.trim() || '';
      answers.tool_output = document.querySelector('textarea[name="tool_output"]')?.value?.trim() || '';
      answers.tool_store_results = document.getElementById('cfg-tool-store')?.checked || false;
    } else if (type === 'generator') {
      answers.generator_content_type = document.querySelector('input[name="generator_content_type"]')?.value?.trim() || '';
      answers.generator_use_case = document.querySelector('textarea[name="generator_use_case"]')?.value?.trim() || '';
      answers.generator_tone = document.querySelector('select[name="generator_tone"]')?.value || 'Chuyên nghiệp';
      var genFormat = document.querySelector('select[name="generator_format"]')?.value || 'Markdown';
      answers.generator_formats = [genFormat];
    }

    allAnswers = answers;
    return { type: type, answers: answers };
  }

  // ── Build answers summary ──────────────────────────────
  function buildAnswersSummary(type, answers) {
    var lines = [];

    lines.push('<div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">');

    lines.push('<span class="text-on-surface-variant/50 font-medium">Tên:</span><span class="text-on-surface font-medium">' + escHtml(answers.name || '—') + '</span>');
    lines.push('<span class="text-on-surface-variant/50">Mô tả:</span><span class="text-on-surface/80">' + escHtml(answers.description || '—') + '</span>');
    lines.push('<span class="text-on-surface-variant/50">Ngôn ngữ:</span><span class="text-on-surface/80">' + (answers.language === 'vi' ? 'Tiếng Việt' : answers.language === 'en' ? 'English' : 'Cả hai') + '</span>');
    lines.push('<span class="text-on-surface-variant/50">Mục tiêu:</span><span class="text-on-surface/80">' + escHtml(answers.goals || '—') + '</span>');
    lines.push('<span class="text-on-surface-variant/50">Miễn phí:</span><span class="text-on-surface/80">' + (answers.is_free ? 'Có' : 'Không') + '</span>');
    lines.push('<span class="text-on-surface-variant/50">Loại:</span><span class="text-on-surface/80">' + type + '</span>');

    if (type === 'survey') {
      lines.push('<span class="text-on-surface-variant/50">Quy mô:</span><span class="text-on-surface/80">' + (answers.sections_count || 'mini') + '</span>');
      lines.push('<span class="text-on-surface-variant/50">Chủ đề:</span><span class="text-on-surface/80">' + escHtml(answers.topics || '—') + '</span>');
      lines.push('<span class="text-on-surface-variant/50">Scoring:</span><span class="text-on-surface/80">' + (answers.needs_scoring ? 'Có' : 'Không') + '</span>');
      if (answers.dimensions?.length) {
        lines.push('<span class="text-on-surface-variant/50">Lĩnh vực:</span><span class="text-on-surface/80">' + answers.dimensions.map(function(d) { return d.name + ' (' + d.formula + ')'; }).join(', ') + '</span>');
      }
    } else if (type === 'ebook_ai') {
      lines.push('<span class="text-on-surface-variant/50">Chủ đề:</span><span class="text-on-surface/80">' + escHtml(answers.ebook_topic || '—') + '</span>');
      lines.push('<span class="text-on-surface-variant/50">Số chương:</span><span class="text-on-surface/80">' + (answers.ebook_chapters || 5) + '</span>');
      lines.push('<span class="text-on-surface-variant/50">Độ sâu:</span><span class="text-on-surface/80">' + (answers.ebook_depth || 'Chi tiết') + '</span>');
    } else if (type === 'course_ai') {
      lines.push('<span class="text-on-surface-variant/50">Chủ đề:</span><span class="text-on-surface/80">' + escHtml(answers.course_topic || '—') + '</span>');
      lines.push('<span class="text-on-surface-variant/50">Số bài:</span><span class="text-on-surface/80">' + (answers.course_lessons || 5) + '</span>');
      lines.push('<span class="text-on-surface-variant/50">Trình độ:</span><span class="text-on-surface/80">' + (answers.course_level || 'Intermediate') + '</span>');
    } else if (type === 'tool') {
      lines.push('<span class="text-on-surface-variant/50">Mục đích:</span><span class="text-on-surface/80">' + escHtml(answers.tool_purpose || '—') + '</span>');
    } else if (type === 'generator') {
      lines.push('<span class="text-on-surface-variant/50">Loại nội dung:</span><span class="text-on-surface/80">' + escHtml(answers.generator_content_type || '—') + '</span>');
      lines.push('<span class="text-on-surface-variant/50">Giọng điệu:</span><span class="text-on-surface/80">' + (answers.generator_tone || 'Chuyên nghiệp') + '</span>');
    }

    lines.push('</div>');
    return lines.join('\n');
  }

  function escHtml(s) {
    if (!s) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ── Call AI generation ─────────────────────────────────
  async function callGenerate() {
    var data = collectAnswers();
    if (!data.type) {
      showToast('Vui lòng chọn loại ứng dụng', 'error');
      return;
    }
    if (!data.answers.name) {
      showToast('Vui lòng nhập tên ứng dụng', 'error');
      showStep(2);
      document.getElementById('step2-name')?.focus();
      return;
    }

    var loadingEl = document.getElementById('step4-loading');
    var errorEl = document.getElementById('step4-error');
    var genBtn = document.getElementById('generate-btn');
    var summaryEl = document.getElementById('answers-summary');

    // Show loading
    hideEl(errorEl);
    hideEl(summaryEl);
    if (loadingEl) {
      loadingEl.classList.remove('hidden');
      loadingEl.classList.add('flex');
    }
    if (genBtn) {
      genBtn.disabled = true;
      genBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Đang tạo...';
    }

    try {
      var modelOverrideEl = document.getElementById('generate-model');
      var modelOverride = modelOverrideEl ? (modelOverrideEl.value || null) : null;

      var resp = await fetch('/api/admin/wizard/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: data.type, answers: data.answers, model_id: modelOverride }),
      });

      var result = await resp.json();

      if (!resp.ok || result.error) {
        throw new Error(result.error || 'Generation failed');
      }

      generatedData = result.generated;
      populateStep5(generatedData);
      showStep(5);
      showToast('Tạo cấu hình thành công!', 'success');
    } catch (err) {
      if (loadingEl) {
        loadingEl.classList.add('hidden');
        loadingEl.classList.remove('flex');
      }
      showEl(errorEl);
      var errorMsgEl = document.getElementById('step4-error-msg');
      var errorDetailEl = document.getElementById('step4-error-detail');
      if (errorMsgEl) errorMsgEl.textContent = err.message || 'Lỗi không xác định';
      if (errorDetailEl) errorDetailEl.textContent = err.stack || '';
    } finally {
      if (genBtn) {
        genBtn.disabled = false;
        genBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">auto_awesome</span> Tạo cấu hình bằng AI';
      }
    }
  }

  // ── Populate Step 5 ───────────────────────────────────
  function populateStep5(data) {
    var nameEl = document.getElementById('final-name');
    var descEl = document.getElementById('final-desc');
    var isFreeEl = document.getElementById('final-is-free');
    var promptViEl = document.getElementById('final-prompt-vi');
    var promptEnEl = document.getElementById('final-prompt-en');
    var statusEl = document.getElementById('final-status');
    var promptLenEl = document.getElementById('prompt-vi-length');
    var promptWarnEl = document.getElementById('prompt-vi-warning');
    var scannerSummaryEl = document.getElementById('scanner-summary');
    var scannerSummaryTextEl = document.getElementById('scanner-summary-text');

    if (nameEl) nameEl.value = data.name || '';
    if (descEl) descEl.value = data.description || '';
    if (isFreeEl) isFreeEl.checked = data.is_free === 1;
    if (statusEl) statusEl.value = data.status || 'draft';

    var config = data.config_json || {};
    if (promptViEl) {
      promptViEl.value = config.prompt_vi || '';
      updatePromptLen();
    }
    if (promptEnEl) promptEnEl.value = config.prompt_en || '';

    // Scanner summary
    if (config.scanner_definition && selectedType === 'survey') {
      var scannerDef = config.scanner_definition;
      var totalQuestions = (scannerDef.sections || []).reduce(function(acc, s) {
        return acc + (s.questions || []).length;
      }, 0);
      if (scannerSummaryEl) showEl(scannerSummaryEl);
      if (scannerSummaryTextEl) {
        scannerSummaryTextEl.textContent =
          scannerDef.title_vi + ' — ' +
          (scannerDef.sections || []).length + ' sections, ' +
          totalQuestions + ' câu hỏi' +
          (scannerDef.scoring_rules?.dimensions?.length ? ', ' + scannerDef.scoring_rules.dimensions.length + ' lĩnh vực scoring' : '');
      }
    } else {
      if (scannerSummaryEl) hideEl(scannerSummaryEl);
    }
  }

  function updatePromptLen() {
    var el = document.getElementById('final-prompt-vi');
    var lenEl = document.getElementById('prompt-vi-length');
    var warnEl = document.getElementById('prompt-vi-warning');
    if (!el || !lenEl) return;
    var len = el.value.length;
    lenEl.textContent = len + ' chars';
    if (warnEl) {
      if (len > 0 && len < 50) {
        showEl(warnEl);
      } else {
        hideEl(warnEl);
      }
    }
  }

  // ── Save ───────────────────────────────────────────────
  async function saveApp() {
    var nameEl = document.getElementById('final-name');
    var descEl = document.getElementById('final-desc');
    var isFreeEl = document.getElementById('final-is-free');
    var promptViEl = document.getElementById('final-prompt-vi');
    var promptEnEl = document.getElementById('final-prompt-en');
    var statusEl = document.getElementById('final-status');
    var saveBtn = document.getElementById('save-btn');
    var errEl = document.getElementById('step5-error');
    var errMsgEl = document.getElementById('step5-error-msg');

    hideEl(errEl);

    if (!nameEl?.value?.trim()) {
      showEl(errEl);
      if (errMsgEl) errMsgEl.textContent = 'Tên ứng dụng không được để trống';
      return;
    }
    if (!promptViEl?.value?.trim()) {
      showEl(errEl);
      if (errMsgEl) errMsgEl.textContent = 'Prompt tiếng Việt không được để trống';
      return;
    }

    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.innerHTML = '<span class="material-symbols-outlined text-[18px] animate-spin">progress_activity</span> Đang lưu...';
    }

    var type = selectedType || document.querySelector('input[name="app_type"]:checked')?.value || '';
    var modelSelect = document.getElementById('final-model');
    var modelOverride = modelSelect?.value?.trim() || null;

    var configObj = {
      prompt_vi: promptViEl.value.trim(),
      prompt_en: promptEnEl?.value?.trim() || '',
      analysis_sections: generatedData?.config_json?.analysis_sections || [],
      model_override: modelOverride,
      max_tokens_override: generatedData?.config_json?.max_tokens_override || null,
    };

    var body = {
      type: type,
      name: nameEl.value.trim(),
      slug: slugify(nameEl.value.trim()),
      description: descEl?.value?.trim() || null,
      status: statusEl?.value || 'draft',
      is_free: isFreeEl?.checked ? 1 : 0,
      config_json: JSON.stringify(configObj),
      generated: generatedData,
    };

    try {
      var resp = await fetch('/api/admin/wizard/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      var result = await resp.json();

      if (!resp.ok || result.error) {
        throw new Error(result.error || 'Save failed');
      }

      showToast('Tạo ứng dụng thành công!', 'success');
      setTimeout(function() {
        window.location.href = '/admin/apps/' + result.id;
      }, 600);
    } catch (err) {
      showEl(errEl);
      if (errMsgEl) errMsgEl.textContent = err.message || 'Lỗi không xác định';
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.innerHTML = '<span class="material-symbols-outlined text-[18px]">save</span> Lưu & Hoàn thành';
      }
    }
  }

  // ── Event Binding ─────────────────────────────────────
  function init() {
    // Slug preview
    var nameInput = document.getElementById('step2-name');
    if (nameInput) {
      nameInput.addEventListener('input', updateSlugPreview);
      updateSlugPreview();
    }

    // Step 1 → 2
    var step1Next = document.getElementById('step1-next');
    if (step1Next) {
      step1Next.addEventListener('click', function() {
        var selected = document.querySelector('input[name="app_type"]:checked');
        if (!selected) {
          showToast('Vui lòng chọn loại ứng dụng', 'error');
          return;
        }
        selectedType = selected.value;
        showTypeFields(selectedType);
        showStep(2);
      });
    }

    // Step 2 → 3
    var step2Next = document.getElementById('step2-next');
    if (step2Next) {
      step2Next.addEventListener('click', function() {
        var nameEl = document.getElementById('step2-name');
        if (!nameEl?.value?.trim()) {
          showToast('Vui lòng nhập tên ứng dụng', 'error');
          nameEl?.focus();
          return;
        }
        showStep(3);
      });
    }

    // Step 2 ← 3
    var step2Back = document.getElementById('step2-back');
    if (step2Back) {
      step2Back.addEventListener('click', function() { showStep(1); });
    }

    // Step 3 → 4
    var step3Next = document.getElementById('step3-next');
    if (step3Next) {
      step3Next.addEventListener('click', function() {
        var data = collectAnswers();
        selectedType = data.type;

        // Update summary
        var summaryEl = document.getElementById('answers-summary');
        if (summaryEl) summaryEl.innerHTML = buildAnswersSummary(data.type, data.answers);

        // Clear previous error/loading
        hideEl(document.getElementById('step4-error'));
        var loadingEl = document.getElementById('step4-loading');
        if (loadingEl) { loadingEl.classList.add('hidden'); loadingEl.classList.remove('flex'); }

        showStep(4);
      });
    }

    // Step 3 ← 4
    var step3Back = document.getElementById('step3-back');
    if (step3Back) {
      step3Back.addEventListener('click', function() { showStep(2); });
    }

    // Step 4 back
    var step4Back = document.getElementById('step4-back');
    if (step4Back) {
      step4Back.addEventListener('click', function() { showStep(3); });
    }

    // Generate button
    var genBtn = document.getElementById('generate-btn');
    if (genBtn) {
      genBtn.addEventListener('click', callGenerate);
    }

    // Retry button
    var retryBtn = document.getElementById('retry-generate-btn');
    if (retryBtn) {
      retryBtn.addEventListener('click', callGenerate);
    }

    // Step 5 back
    var step5Back = document.getElementById('step5-back');
    if (step5Back) {
      step5Back.addEventListener('click', function() { showStep(4); });
    }

    // Save button
    var saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', saveApp);
    }

    // Prompt length tracker
    var promptViEl = document.getElementById('final-prompt-vi');
    if (promptViEl) {
      promptViEl.addEventListener('input', updatePromptLen);
    }

    // Add dimension row
    var addDimBtn = document.getElementById('add-dimension-btn');
    if (addDimBtn) {
      addDimBtn.addEventListener('click', function() {
        var list = document.getElementById('dimensions-list');
        if (!list) return;
        var idx = list.querySelectorAll('.dim-row').length;
        var row = document.createElement('div');
        row.className = 'dim-row flex items-center gap-2';
        row.innerHTML =
          '<input type="text" name="dim_name_' + idx + '" placeholder="Tên lĩnh vực" class="flex-1 px-3 py-2 bg-surface-container-high border border-outline-variant/30 rounded-lg text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 transition-all placeholder:text-on-surface-variant/30" />' +
          '<select name="dim_formula_' + idx + '" class="px-3 py-2 bg-surface-container-high border border-outline-variant/30 rounded-lg text-on-surface text-sm focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all">' +
          '  <option value="avg" selected>avg</option>' +
          '  <option value="sum">sum</option>' +
          '  <option value="count_if">count_if</option>' +
          '</select>' +
          '<button type="button" class="remove-dim btn-icon w-8 h-8 flex items-center justify-center rounded-lg text-on-surface-variant hover:text-red-400 hover:bg-red-500/10 transition-all">' +
          '  <span class="material-symbols-outlined text-[16px]">delete</span>' +
          '</button>';
        list.appendChild(row);
        row.querySelector('.remove-dim')?.addEventListener('click', function() {
          row.remove();
        });
        row.querySelector('input')?.focus();
      });
    }

    // Remove dimension buttons (delegated)
    document.addEventListener('click', function(e) {
      var target = e.target;
      if (target.closest('.remove-dim')) {
        var btn = target.closest('.remove-dim');
        var row = btn?.closest('.dim-row');
        if (row) row.remove();
      }
    });

    // Needs scoring toggle
    var scoringCheckbox = document.getElementById('cfg-needs-scoring');
    var dimsWrap = document.getElementById('cfg-dimensions-wrap');
    if (scoringCheckbox && dimsWrap) {
      scoringCheckbox.addEventListener('change', function() {
        if (scoringCheckbox.checked) {
          showEl(dimsWrap);
        } else {
          hideEl(dimsWrap);
        }
      });
    }

    // Type change in step 1 → re-show type fields
    document.querySelectorAll('input[name="app_type"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        selectedType = radio.value;
        showTypeFields(selectedType);
      });
    });

    // Keyboard: Enter on text inputs advances step
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && e.target.tagName === 'INPUT' && !e.shiftKey) {
        var target = e.target;
        if (target.id === 'step2-name' && currentStep === 2) {
          e.preventDefault();
          document.getElementById('step2-next')?.click();
        }
      }
    });
  }

  // Init on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
