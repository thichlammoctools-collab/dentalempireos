// Scanner form client — loaded from /scripts/scanner-form-client.js
// Data is read from data-* attributes on #survey-form

(function () {
  var wrap = document.getElementById('survey-form');
  if (!wrap) return;

  var surveyData = JSON.parse(wrap.dataset.survey || '{}');
  var rawProfile = wrap.dataset.clinic;
  var clinicProfile = rawProfile ? JSON.parse(rawProfile) : null;
  var defaultScaleVi = JSON.parse(wrap.dataset.scaleVi || '{}');
  var defaultScaleEn = JSON.parse(wrap.dataset.scaleEn || '{}');
  var STORAGE_KEY = 'dentalempire-scanner-draft-' + surveyData.id;

  var partsContainer = document.getElementById('parts-container');
  var stepperFill = document.getElementById('stepper-fill');
  var stepLabels = document.getElementById('step-labels');
  var cardIntro = document.getElementById('card-intro');
  var cardSubmit = document.getElementById('card-submit');
  var btnStart = document.getElementById('btn-start');
  var btnSubmit = document.getElementById('btn-submit');
  var btnBackSubmit = document.getElementById('btn-back-submit');
  var submitError = document.getElementById('submit-error');

  var currentLang = 'vi';
  var currentStep = -1;
  var answers = { lang: 'vi', survey_id: surveyData.id };
  var partEls = [];

  function t(vi, en) {
    return currentLang === 'vi' ? (vi || en || '') : (en || vi || '');
  }

  function getTrans(key, fallbackVi, fallbackEn) {
    return currentLang === 'vi'
      ? ((surveyData.translations_vi && surveyData.translations_vi[key]) || fallbackVi)
      : ((surveyData.translations_en && surveyData.translations_en[key]) || fallbackEn);
  }

  function escapeHtml(s) {
    if (!s) return '';
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c;
    });
  }

  function buildIntroFields() {
    var container = document.getElementById('intro-fields');
    if (!container) return;
    container.innerHTML = '';
    var lead = surveyData.lead_fields || {};
    var order = ['owner_name', 'clinic_name', 'clinic_address', 'email', 'years_in_operation', 'staff_count'];

    order.forEach(function (fieldName) {
      var cfg = lead[fieldName];
      if (!cfg) return;
      var label = t(cfg.label_vi, cfg.label_en);
      var placeholder = t(cfg.placeholder_vi, cfg.placeholder_en);
      var type = cfg.type || (fieldName === 'email' ? 'email' : (fieldName.indexOf('_operation') !== -1 || fieldName.indexOf('_count') !== -1) ? 'number' : 'text');
      var required = cfg.required || false;

      var div = document.createElement('div');
      div.className = 'form-row';
      div.innerHTML = '<div class="form-col"><label class="form-label">' + escapeHtml(label) + (required ? ' <span class="req">*</span>' : '') + '</label><input type="' + type + '" name="' + fieldName + '" class="form-input" ' + (required ? 'required' : '') + ' placeholder="' + escapeHtml(placeholder) + '" ' + (type === 'number' ? 'min="0" max="500"' : '') + ' /></div>';
      container.appendChild(div);
    });

    if (clinicProfile) {
      var saveDiv = document.createElement('div');
      saveDiv.className = 'form-row';
      saveDiv.innerHTML = '<div class="form-col" style="grid-column:1/-1"><label class="save-profile-row"><input type="checkbox" id="save-profile-check" checked style="accent-color:var(--primary);width:16px;height:16px;" /><span class="form-label" style="margin:0;font-weight:400;color:var(--on-surface-variant);cursor:pointer;">' + (currentLang === 'vi' ? 'Lưu thông tin này cho lần sau' : 'Save this info for next time') + '</span></label></div>';
      container.appendChild(saveDiv);
    }
  }

  function saveDraft() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ lang: currentLang, step: currentStep, answers: answers })); } catch (e) {}
  }

  function loadDraft() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      var data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return false;
      Object.keys(data.answers || {}).forEach(function (k) { answers[k] = data.answers[k]; });
      currentLang = (data.lang === 'en' ? 'en' : 'vi');
      currentStep = typeof data.step === 'number' ? data.step : -1;
      return true;
    } catch (e) { return false; }
  }

  function clearDraft() {
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }

  function buildParts() {
    if (!partsContainer) return;
    partsContainer.innerHTML = '';
    partEls.length = 0;

    surveyData.sections.forEach(function (section, sIdx) {
      var card = document.createElement('div');
      card.className = 'card part-card hidden';
      card.dataset['step'] = String(sIdx);
      card.dataset['sectionId'] = String(section.id);

      var refHtml = section.ref ? '<div class="part-ref">' + escapeHtml(section.ref) + '</div>' : '';
      card.innerHTML = '<div class="part-header">' + refHtml + '<h2 class="part-title">' + escapeHtml(t(section.title_vi, section.title_en)) + '</h2><p class="part-subtitle">' + escapeHtml(t(section.subtitle_vi, section.subtitle_en)) + '</p></div>';

      section.questions.forEach(function (q) {
        var block = document.createElement('div');
        block.className = 'question' + (q.anchor ? ' anchor' : '');
        var anchorBadge = q.anchor ? '<span class="anchor-badge">' + (currentLang === 'vi' ? '⭐ Câu neo' : '⭐ Anchor') + '</span>' : '';

        var inputHtml = '';
        if (q.type === 'textarea') {
          inputHtml = '<textarea class="form-textarea" name="' + escapeHtml(q.question_id) + '" placeholder="' + escapeHtml(t(q.placeholder_vi, q.placeholder_en)) + '" ' + (q.required ? 'required' : '') + '></textarea>';
        } else if (q.type === 'select') {
          var labels = q.scale_labels_vi || defaultScaleVi;
          var enLabels = q.scale_labels_en || defaultScaleEn;
          var pills = [1,2,3,4,5].map(function (n) {
            var labelText = currentLang === 'en' ? (enLabels[String(n)] || labels[String(n)] || '') : (labels[String(n)] || enLabels[String(n)] || '');
            return '<label class="scale-option"><input type="radio" name="' + escapeHtml(q.question_id) + '" value="' + n + '" ' + (q.required ? 'required' : '') + ' /><span class="scale-pill"><span class="scale-num">' + n + '</span><span class="scale-text">' + escapeHtml(labelText) + '</span></span></label>';
          }).join('');
          inputHtml = '<div class="scale-group">' + pills + '</div>';
        } else if (q.type === 'radio') {
          var opts = q.options_vi || [];
          var enOpts = q.options_en || [];
          var options = opts.map(function (opt, i) {
            var enOpt = enOpts[i] || opt;
            var display = currentLang === 'en' ? enOpt : opt;
            return '<label class="radio-option"><input type="radio" name="' + escapeHtml(q.question_id) + '" value="' + escapeHtml(opt) + '" ' + (q.required ? 'required' : '') + ' /><span class="radio-label">' + escapeHtml(display) + '</span></label>';
          }).join('');
          inputHtml = '<div class="radio-group">' + options + '</div>';
        } else if (q.type === 'yesno') {
          inputHtml = '<div class="radio-group"><label class="radio-option"><input type="radio" name="' + escapeHtml(q.question_id) + '" value="1" ' + (q.required ? 'required' : '') + ' /><span class="radio-label">' + (currentLang === 'vi' ? 'Có' : 'Yes') + '</span></label><label class="radio-option"><input type="radio" name="' + escapeHtml(q.question_id) + '" value="0" ' + (q.required ? 'required' : '') + ' /><span class="radio-label">' + (currentLang === 'vi' ? 'Chưa' : 'No') + '</span></label></div>';
        }

        block.innerHTML = anchorBadge + '<label class="q-label">' + escapeHtml(t(q.label_vi, q.label_en)) + '</label>' + inputHtml;
        card.appendChild(block);
      });

      var isLastSection = (sIdx === surveyData.sections.length - 1);
      var nextLabel = isLastSection
        ? (currentLang === 'vi' ? 'Gửi kết quả' : 'Submit')
        : (currentLang === 'vi' ? 'Tiếp tục' : 'Next');
      var nextClass = isLastSection ? 'btn btn-primary btn-submit-inline' : 'btn btn-primary';
      var nextArrow = isLastSection ? '' : ' →';
      var nav = document.createElement('div');
      nav.className = 'nav-buttons';
      nav.innerHTML = '<button type="button" class="btn btn-ghost" data-action="prev">← ' + (currentLang === 'vi' ? 'Quay lại' : 'Back') + '</button><button type="button" class="' + nextClass + '" data-action="next">' + nextLabel + nextArrow + '</button>';
      nav.querySelector('[data-action="prev"]').addEventListener('click', function () { goTo(currentStep - 1); });
      nav.querySelector('[data-action="next"]').addEventListener('click', function () {
        if (isLastSection) { submit(); } else { goTo(currentStep + 1); }
      });
      card.addEventListener('change', function (e) { saveFromEvent(e); saveDraft(); });
      card.addEventListener('input', function (e) { saveFromEvent(e); saveDraft(); });

      partsContainer.appendChild(card);
      partEls.push(card);
    });
    applyAnswersToDom();
  }

  function saveFromEvent(e) {
    var target = e.target;
    if (!target.name) return;
    answers[target.name] = target.value;
  }

  function applyAnswersToDom() {
    document.querySelectorAll('input, textarea').forEach(function (el) {
      var input = el;
      if (!input.name) return;
      var val = answers[input.name];
      if (val == null || val === '') return;
      if (input.type === 'radio') {
        if (input.value === String(val)) input.checked = true;
      } else {
        input.value = String(val);
      }
    });
  }

  function buildStepLabels() {
    if (!stepLabels) return;
    var labels = surveyData.sections.map(function (section, idx) {
      var title = t(section.title_vi, section.title_en);
      var num = title.match(/^\s*(?:PHẦN|PART)\s*(\d+)/i);
      var n = num ? num[1] : String(idx + 1);
      return '<span data-step-idx="' + idx + '">' + n + '</span>';
    });
    labels.push('<span data-step-idx="' + surveyData.sections.length + '">' + (currentLang === 'vi' ? 'Gửi' : 'Submit') + '</span>');
    stepLabels.innerHTML = labels.join('');
  }

  function goTo(step) {
    if (step < -1 || step > surveyData.sections.length) return;

    if (currentStep === -1 && step >= 0) {
      var lead = surveyData.lead_fields || {};
      var fields = Object.keys(lead);
      for (var i = 0; i < fields.length; i++) {
        var fieldName = fields[i];
        var cfg = lead[fieldName];
        if (cfg && cfg.required) {
          var el = document.querySelector('[name="' + fieldName + '"]');
          if (!el || !el.value || !el.value.trim()) {
            alert(currentLang === 'vi' ? 'Vui lòng điền đầy đủ thông tin bắt buộc.' : 'Please fill all required fields.');
            return;
          }
        }
      }
      ['owner_name', 'clinic_name', 'clinic_address', 'email', 'years_in_operation', 'staff_count'].forEach(function (k) {
        var el = document.querySelector('[name="' + k + '"]');
        if (el) answers[k] = el.value || null;
      });
    }

    currentStep = step;
    if (cardIntro) cardIntro.classList.toggle('hidden', step !== -1);
    if (cardSubmit) cardSubmit.classList.toggle('hidden', step !== surveyData.sections.length);
    partEls.forEach(function (el, i) { el.classList.toggle('hidden', i !== step); });

    var total = surveyData.sections.length + 1;
    var progress = step < 0 ? 0 : step >= surveyData.sections.length ? 100 : Math.round((step / surveyData.sections.length) * 100);
    if (stepperFill) stepperFill.style.width = progress + '%';

    if (stepLabels) {
      stepLabels.querySelectorAll('span').forEach(function (s) {
        var idx = parseInt(s.dataset['stepIdx'] || '-1', 10);
        s.classList.toggle('active', idx === step);
      });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
    saveDraft();
    updateStickyNav();
  }

  function updateStickyNav() {
    var stickyNav = document.getElementById('sticky-nav');
    var stickyBack = document.getElementById('sticky-btn-back');
    var stickyNext = document.getElementById('sticky-btn-next');
    var stickyStep = document.getElementById('sticky-step-label');
    var stickyFill = document.getElementById('sticky-progress-fill');
    if (!stickyNav) return;

    var isIntro = currentStep === -1;
    var isSubmit = currentStep === surveyData.sections.length;

    // Hide on intro and submit pages
    stickyNav.classList.toggle('hidden', isIntro || isSubmit);

    // Back button
    if (stickyBack) {
      stickyBack.classList.toggle('hidden', isIntro);
    }

    // Step label and progress
    if (stickyStep) {
      if (isSubmit) {
        stickyStep.textContent = currentLang === 'vi' ? 'Gửi' : 'Submit';
      } else if (!isIntro) {
        stickyStep.textContent = (currentStep + 1) + '/' + surveyData.sections.length;
      }
    }
    if (stickyFill) {
      var pct = currentStep < 0 ? 0 : currentStep >= surveyData.sections.length ? 100 : Math.round((currentStep / surveyData.sections.length) * 100);
      stickyFill.style.width = pct + '%';
    }

    // Next button text
    if (stickyNext) {
      if (isSubmit || currentStep === surveyData.sections.length - 1) {
        stickyNext.textContent = currentLang === 'vi' ? 'Gửi kết quả' : 'Submit';
      } else {
        stickyNext.textContent = (currentLang === 'vi' ? 'Tiếp tục' : 'Next') + ' →';
      }
    }

    // Force reflow to ensure sticky nav renders above keyboard on mobile
    stickyNav.style.transform = 'translateY(0)';
    requestAnimationFrame(function () {
      stickyNav.style.transform = '';
    });
  }

  // Re-show sticky nav when keyboard opens/closes on mobile
  window.addEventListener('resize', function () {
    var stickyNav = document.getElementById('sticky-nav');
    if (!stickyNav) return;
    var isIntro = currentStep === -1;
    var isSubmit = currentStep === surveyData.sections.length;
    if (!isIntro && !isSubmit) {
      stickyNav.classList.remove('hidden');
    }
  });

  function submit() {
    if (!submitError) return;
    submitError.classList.add('hidden');
    if (btnSubmit) btnSubmit.disabled = true;
    var original = btnSubmit ? btnSubmit.innerHTML : '';
    if (btnSubmit) btnSubmit.innerHTML = '<span>' + getTrans('submitting', 'Đang xử lý...', 'Processing...') + '</span>';

    document.querySelectorAll('input, textarea').forEach(function (el) {
      var input = el;
      if (input.name && (input.type === 'text' || input.type === 'email' || input.type === 'number' || input.tagName === 'TEXTAREA')) {
        if (input.value) answers[input.name] = input.value;
      }
    });
    answers.lang = currentLang;

    var saveChecked = true;
    var saveCheckEl = document.getElementById('save-profile-check');
    if (saveCheckEl) saveChecked = saveCheckEl.checked;

    fetch('/api/scanner/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(Object.assign({}, answers, { save_profile: saveChecked })),
    })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      if (!data.id && data.requiresAuth) {
        window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        return;
      }
      if (!data.id) throw new Error(data.error || 'Submit failed');
      clearDraft();
      window.location.href = data.redirect || '/scanner/result/' + data.id;
    })
    .catch(function (err) {
      if (submitError) {
        submitError.textContent = err.message || 'Submit failed';
        submitError.classList.remove('hidden');
      }
      if (btnSubmit) {
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = original;
      }
    });
  }

  function setLang(lang) {
    currentLang = lang;
    answers.lang = lang;
    document.querySelectorAll('.lang-btn').forEach(function (b) {
      b.classList.toggle('active', b.dataset['lang'] === lang);
    });
    buildIntroFields();
    buildParts();
    buildStepLabels();
    goTo(currentStep);
  }

  // Init
  var hasDraft = loadDraft();
  buildIntroFields();
  buildParts();
  buildStepLabels();

  document.querySelectorAll('.lang-btn').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.dataset['lang']); saveDraft(); });
  });
  if (btnStart) btnStart.addEventListener('click', function () { goTo(0); });
  if (btnSubmit) btnSubmit.addEventListener('click', function () { submit(); });
  if (btnBackSubmit) btnBackSubmit.addEventListener('click', function () { goTo(surveyData.sections.length - 1); });

  // Sticky nav buttons
  var stickyBack = document.getElementById('sticky-btn-back');
  var stickyNext = document.getElementById('sticky-btn-next');
  if (stickyBack) stickyBack.addEventListener('click', function () { goTo(currentStep - 1); });
  if (stickyNext) stickyNext.addEventListener('click', function () {
    if (currentStep === surveyData.sections.length - 1) {
      submit();
    } else {
      goTo(currentStep + 1);
    }
  });

  document.querySelectorAll('.intro-card input[name]').forEach(function (el) {
    var input = el;
    var v = answers[input.name];
    if (v != null && v !== '') {
      input.value = String(v);
    } else if (clinicProfile && input.name) {
      var val = clinicProfile[input.name];
      if (val) input.value = String(val);
    }
  });

  if (hasDraft && typeof currentStep === 'number' && currentStep >= 0 && currentStep < surveyData.sections.length) {
    goTo(currentStep);
    var banner = document.createElement('div');
    banner.id = 'restore-banner';
    banner.innerHTML = '<div style="background:rgba(59,130,246,0.15);border:1px solid rgba(59,130,246,0.3);border-radius:0.5rem;padding:0.75rem 1rem;margin-bottom:1rem;display:flex;justify-content:space-between;align-items:center;gap:0.5rem;flex-wrap:wrap;"><span style="color:var(--on-surface);font-size:0.85rem;">' + (currentLang === 'vi' ? 'Bạn có bản nháp chưa hoàn thành.' : 'You have an unfinished draft.') + '</span><button type="button" id="clear-draft-btn" style="background:transparent;border:1px solid var(--outline-variant);color:var(--on-surface-variant);border-radius:0.375rem;padding:0.3rem 0.75rem;font-size:0.8rem;cursor:pointer;white-space:nowrap;">' + (currentLang === 'vi' ? 'Xoá & bắt đầu lại' : 'Clear & start over') + '</button></div>';
    wrap.insertBefore(banner, wrap.children[1]);
    var clearBtn = document.getElementById('clear-draft-btn');
    if (clearBtn) clearBtn.addEventListener('click', function () { clearDraft(); window.location.reload(); });
  } else {
    currentStep = -1;
    goTo(-1);
  }
})();
