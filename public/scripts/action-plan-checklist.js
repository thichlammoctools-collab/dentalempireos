// Owner action-plan checklist with optimistic status changes.
(function () {
  if (window.__actionPlanChecklistLoaded) return;
  window.__actionPlanChecklistLoaded = true;

  var labels = {
    not_started: 'Chưa bắt đầu',
    in_progress: 'Đang thực hiện',
    completed: 'Hoàn thành',
    skipped: 'Bỏ qua',
  };

  function text(node, value) {
    if (node) node.textContent = value;
  }

  function summaryText(summary) {
    return summary.completed + '/' + summary.total + ' hoàn thành';
  }

  function renderAction(container, planId, action) {
    var item = document.createElement('article');
    item.className = 'action-plan-checklist__action';
    item.dataset.actionId = action.id;
    item.dataset.updatedAt = action.updated_at;

    var content = document.createElement('div');
    var title = document.createElement('h3');
    title.className = 'action-plan-checklist__action-title';
    title.textContent = action.title;
    content.appendChild(title);

    if (action.description) {
      var description = document.createElement('p');
      description.className = 'action-plan-checklist__action-description';
      description.textContent = action.description;
      content.appendChild(description);
    }

    var meta = document.createElement('p');
    meta.className = 'action-plan-checklist__meta';
    var details = [];
    if (action.category) details.push(action.category);
    if (action.priority) details.push('Ưu tiên ' + (action.priority === 'high' ? 'cao' : action.priority === 'low' ? 'thấp' : 'vừa'));
    if (action.target_days !== null && action.target_days !== undefined) details.push('Mục tiêu ' + action.target_days + ' ngày');
    meta.textContent = details.join(' · ');
    if (details.length) content.appendChild(meta);

    var label = document.createElement('label');
    label.className = 'action-plan-checklist__status-label';
    label.textContent = 'Trạng thái';
    var select = document.createElement('select');
    select.className = 'action-plan-checklist__status';
    select.setAttribute('aria-label', 'Cập nhật trạng thái: ' + action.title);
    Object.keys(labels).forEach(function (status) {
      var option = document.createElement('option');
      option.value = status;
      option.textContent = labels[status];
      option.selected = status === action.status;
      select.appendChild(option);
    });
    label.appendChild(select);

    select.addEventListener('change', function () {
      var originalStatus = action.status;
      var nextStatus = select.value;
      var expectedUpdatedAt = item.dataset.updatedAt;
      select.disabled = true;
      setMessage(container, 'Đang lưu thay đổi…');

      fetch('/api/scanner/action-plans/' + encodeURIComponent(planId) + '/actions/' + encodeURIComponent(action.id), {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, expected_updated_at: expectedUpdatedAt }),
      }).then(async function (response) {
        var body = await response.json().catch(function () { return {}; });
        return { response: response, body: body };
      }).then(function (result) {
        if (!result.response.ok || !result.body.action) {
          if (result.response.status === 409) {
            setMessage(container, 'Việc này vừa được cập nhật ở nơi khác. Đang tải lại trạng thái mới nhất.');
            loadPlan(container, planId);
            return;
          }
          throw new Error(result.body.error || 'Không thể lưu thay đổi.');
        }
        action = result.body.action;
        item.dataset.updatedAt = action.updated_at;
        select.value = action.status;
        setMessage(container, 'Đã cập nhật trạng thái việc cần làm.');
        loadSummary(container, planId);
      }).catch(function (error) {
        select.value = originalStatus;
        setMessage(container, error instanceof Error ? error.message : 'Không thể lưu thay đổi.');
      }).finally(function () {
        select.disabled = false;
      });
    });

    item.appendChild(content);
    item.appendChild(label);
    return item;
  }

  function setMessage(container, value) {
    text(container.querySelector('[data-plan-message]'), value);
  }

  function loadSummary(container, planId) {
    fetch('/api/scanner/action-plans/' + encodeURIComponent(planId), { credentials: 'include' })
      .then(function (response) { return response.ok ? response.json() : Promise.reject(new Error('Không thể tải tiến độ.')); })
      .then(function (data) {
        text(container.querySelector('[data-progress-summary]'), summaryText(data.progressSummary));
      })
      .catch(function () { /* retain previous summary */ });
  }

  function loadPlan(container, planId) {
    var actionsNode = container.querySelector('[data-plan-actions]');
    var footer = container.querySelector('[data-plan-footer]');
    var detailLink = container.querySelector('[data-plan-detail]');
    var comparisonLink = container.querySelector('[data-plan-comparison]');
    if (!actionsNode) return;

    actionsNode.replaceChildren();
    setMessage(container, 'Đang tải các việc cần làm của bạn.');
    fetch('/api/scanner/action-plans/' + encodeURIComponent(planId), { credentials: 'include' })
      .then(function (response) {
        if (response.status === 404) throw new Error('Kế hoạch này không còn khả dụng.');
        if (!response.ok) throw new Error('Không thể tải kế hoạch hành động.');
        return response.json();
      })
      .then(function (data) {
        text(container.querySelector('[data-progress-summary]'), summaryText(data.progressSummary));
        var plan = data.plan;
        if (data.actions.length === 0) {
          setMessage(container, plan.generation_state === 'pending'
            ? 'Kế hoạch đang được chuẩn bị. Hãy quay lại sau ít phút.'
            : 'Kế hoạch chưa có việc cần làm để hiển thị.');
        } else {
          setMessage(container, plan.summary || 'Cập nhật tiến độ từng việc để theo dõi quá trình thực hiện.');
          data.actions.forEach(function (action) {
            actionsNode.appendChild(renderAction(container, planId, action));
          });
        }
        if (footer && detailLink) {
          detailLink.href = '/account/action-plans/' + encodeURIComponent(planId);
          footer.hidden = false;
        }
        if (comparisonLink && data.snapshots.some(function (snapshot) { return snapshot.snapshot_kind === 'rescan'; })) {
          comparisonLink.href = '/account/action-plans/' + encodeURIComponent(planId) + '/comparison';
          comparisonLink.hidden = false;
        }
      })
      .catch(function (error) {
        setMessage(container, error instanceof Error ? error.message : 'Không thể tải kế hoạch hành động.');
      });
  }

  document.querySelectorAll('[data-action-plan-checklist]').forEach(function (container) {
    var planId = container.dataset.planId;
    if (planId) loadPlan(container, planId);
  });
})();
