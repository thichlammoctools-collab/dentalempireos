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

  function renderAction(container, planId, action, readOnly) {
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

    var meta = document.createElement('div');
    meta.className = 'action-plan-checklist__meta';
    var hasMeta = false;
    function addTag(value, modifier) {
      var tag = document.createElement('span');
      tag.className = 'action-plan-checklist__tag' + (modifier ? ' action-plan-checklist__tag--' + modifier : '');
      tag.textContent = value;
      meta.appendChild(tag);
      hasMeta = true;
    }
    if (action.category) addTag(action.category, 'category');
    if (action.priority) {
      var priorityLabel = action.priority === 'high' ? 'Ưu tiên cao' : action.priority === 'low' ? 'Ưu tiên thấp' : 'Ưu tiên vừa';
      addTag(priorityLabel, 'priority-' + action.priority);
    }
    if (action.target_days !== null && action.target_days !== undefined) addTag('Mục tiêu ' + action.target_days + ' ngày', 'target');
    if (hasMeta) content.appendChild(meta);

    var label = document.createElement('label');
    label.className = 'action-plan-checklist__status-label';
    label.textContent = 'Trạng thái';
    var select = document.createElement('select');
    select.className = 'action-plan-checklist__status';
    select.dataset.status = action.status;
    select.setAttribute('aria-label', 'Cập nhật trạng thái: ' + action.title);
    var permittedStatuses = [action.status].concat(action.next_statuses || []);
    permittedStatuses.filter(function (status, index, all) {
      return Object.prototype.hasOwnProperty.call(labels, status) && all.indexOf(status) === index;
    }).forEach(function (status) {
      var option = document.createElement('option');
      option.value = status;
      option.textContent = labels[status];
      option.selected = status === action.status;
      select.appendChild(option);
    });
    if (readOnly) {
      select.disabled = true;
      select.setAttribute('aria-describedby', 'action-plan-read-only-' + planId);
    }
    label.appendChild(select);

    if (!readOnly) select.addEventListener('change', function () {
      var originalStatus = action.status;
      var nextStatus = select.value;
      var expectedUpdatedAt = item.dataset.updatedAt;
      select.dataset.status = nextStatus;
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
          if (result.response.status === 409 && result.body.error === 'invalid_status_transition') {
            setMessage(container, 'Trạng thái vừa chọn không còn hợp lệ từ trạng thái hiện tại. Đang tải lại các chuyển đổi hợp lệ.');
            loadPlan(container, planId);
            return;
          }
          if (result.response.status === 409 && result.body.error === 'action_version_conflict') {
            setMessage(container, 'Việc này vừa được cập nhật ở nơi khác. Đang tải lại trạng thái mới nhất.');
            loadPlan(container, planId);
            return;
          }
          if (result.response.status === 403 && result.body.error === 'action_plan_read_only') {
            setMessage(container, 'Kế hoạch legacy này chỉ xem khi dữ liệu nguồn còn được lưu.');
            loadPlan(container, planId);
            return;
          }
          throw new Error(result.body.error || 'Không thể lưu thay đổi.');
        }
        setMessage(container, 'Đã cập nhật trạng thái việc cần làm. Đang tải các chuyển đổi hợp lệ.');
        loadPlan(container, planId);
      }).catch(function (error) {
        select.value = originalStatus;
        select.dataset.status = originalStatus;
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

  function loadPlan(container, planId) {
    var actionsNode = container.querySelector('[data-plan-actions]');
    var footer = container.querySelector('[data-plan-footer]');
    var detailLink = container.querySelector('[data-plan-detail]');
    var comparisonLink = container.querySelector('[data-plan-comparison]');
    var readOnly = container.dataset.readOnly === 'true';
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
        readOnly = readOnly || plan.retention_visibility === 'legacy_source_bound';
        if (readOnly) {
          setMessage(container, 'Kế hoạch legacy này chỉ xem khi dữ liệu nguồn còn được lưu. Không thể cập nhật trạng thái việc hoặc tạo lần quét lại.');
        }
        if (data.actions.length === 0) {
          if (!readOnly) {
            setMessage(container, plan.generation_state === 'pending'
              ? 'Kế hoạch đang được chuẩn bị. Hãy quay lại sau ít phút.'
              : 'Kế hoạch chưa có việc cần làm để hiển thị.');
          }
        } else {
          if (!readOnly) setMessage(container, plan.summary || 'Cập nhật tiến độ từng việc để theo dõi quá trình thực hiện.');
          data.actions.forEach(function (action) {
            actionsNode.appendChild(renderAction(container, planId, action, readOnly));
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
