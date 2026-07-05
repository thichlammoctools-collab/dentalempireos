globalThis.process ??= {};
globalThis.process.env ??= {};
import { c as createComponent } from "./astro-component_DBIynOy6.mjs";
import { r as renderTemplate, b as defineScriptVars, f as renderHead } from "./sequence_CNN-ZGRA.mjs";
import { env } from "cloudflare:workers";
import { b as getAppBySlug, p as parseAppConfig } from "./app-db_BINE4Y41.mjs";
var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$slug = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$slug;
  const slugParam = Astro2.params.slug;
  const slug = slugParam ?? "";
  const app = await getAppBySlug(env.DB, slug);
  if (!app) return new Response("Không tìm thấy ứng dụng", { status: 404 });
  if (app.status !== "active") return new Response("Ứng dụng chưa kích hoạt", { status: 404 });
  const config = parseAppConfig(app.config_json);
  const promptVi = config.prompt_vi ?? "";
  return renderTemplate(_a || (_a = __template(['<html lang="vi" data-astro-cid-7dcrsdz3> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">', '</head> <body data-astro-cid-7dcrsdz3> <!-- Header --> <div class="app-header" data-astro-cid-7dcrsdz3> <div class="header-inner" data-astro-cid-7dcrsdz3> <div class="header-icon" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:22px;color:#818cf8" data-astro-cid-7dcrsdz3>smart_toy</span> </div> <div class="header-text" data-astro-cid-7dcrsdz3> <div class="header-title" data-astro-cid-7dcrsdz3>', "</div> ", ' </div> </div> </div> <!-- Chat area --> <div id="chat-view" class="chat-area" data-astro-cid-7dcrsdz3> <!-- Welcome message --> <div class="msg-wrap" id="welcome-msg" data-astro-cid-7dcrsdz3> <div class="msg-avatar ai-avatar" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:16px;color:#818cf8" data-astro-cid-7dcrsdz3>smart_toy</span> </div> <div class="msg-bubble ai-bubble" data-astro-cid-7dcrsdz3>\nXin chào! Tôi sẽ giúp bạn xây dựng <strong data-astro-cid-7dcrsdz3>SOP (Quy trình vận hành chuẩn)</strong> cho phòng khám nha khoa.<br data-astro-cid-7dcrsdz3><br data-astro-cid-7dcrsdz3>\nChúng ta sẽ đi qua từng bước một cách từ từ. Bạn sẵn sàng chưa?<br data-astro-cid-7dcrsdz3><br data-astro-cid-7dcrsdz3> <strong data-astro-cid-7dcrsdz3>Câu hỏi đầu tiên:</strong> Phòng khám của bạn hiện có bao nhiêu nha sĩ và nhân viên?\n</div> </div> </div> <!-- SOP Result --> <div id="sop-view" class="sop-panel" data-astro-cid-7dcrsdz3> <div class="sop-toolbar" data-astro-cid-7dcrsdz3> <h2 data-astro-cid-7dcrsdz3>Kết quả SOP</h2> <button class="sop-btn print" id="print-sop-btn" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:16px" data-astro-cid-7dcrsdz3>print</span>\nIn / Xuất PDF\n</button> <button class="sop-btn new" id="new-chat-btn" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:16px" data-astro-cid-7dcrsdz3>add</span>\nTạo SOP mới\n</button> </div> <div id="sop-content" class="sop-content" data-astro-cid-7dcrsdz3></div> </div> <!-- Print-only template (hidden, cloned for printing) --> <div id="sop-print-root" data-astro-cid-7dcrsdz3></div> <!-- Input area --> <div class="input-area" data-astro-cid-7dcrsdz3> <div class="input-inner" data-astro-cid-7dcrsdz3> <div class="input-row" data-astro-cid-7dcrsdz3> <textarea id="user-input" rows="1" placeholder="Nhập câu trả lời..." autocomplete="off" data-astro-cid-7dcrsdz3></textarea> <button class="send-btn" id="send-btn" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:18px" data-astro-cid-7dcrsdz3>arrow_upward</span> </button> </div> <div class="input-hint" data-astro-cid-7dcrsdz3> <span data-astro-cid-7dcrsdz3>Enter gửi · Shift+Enter xuống dòng</span> <button class="reset-link" id="reset-btn" data-astro-cid-7dcrsdz3>Bắt đầu lại</button> </div> </div> </div> <script>(function(){', `
    const chatView = document.getElementById('chat-view');
    const sopView = document.getElementById('sop-view');
    const sopContent = document.getElementById('sop-content');
    const sopPrintRoot = document.getElementById('sop-print-root');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const resetBtn = document.getElementById('reset-btn');
    const newChatBtn = document.getElementById('new-chat-btn');
    const printSopBtn = document.getElementById('print-sop-btn');

    let conversationHistory = [];
    let isLoading = false;
    let fullSopText = '';

    function escapeHtml(text) {
      const d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
    }

    function renderMarkdown(text) {
      return escapeHtml(text)
        .replace(/\\*\\*(.*?)\\*\\*/g, '<strong>$1</strong>')
        .replace(/\\*(.*?)\\*/g, '<em>$1</em>')
        .replace(/\`(.*?)\`/g, '<code>$1</code>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^\\d+\\. (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\\/li>)/s, '<ol>$1</ol>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\\/li>)/s, '<ul>$1</ul>')
        .replace(/\\n\\n/g, '</p><p>')
        .replace(/\\n/g, '<br>');
    }

    function addMsg(role, html, options) {
      const wrap = document.createElement('div');
      wrap.className = 'msg-wrap' + (role === 'user' ? ' user' : '');
      if (role === 'ai') {
        let optsHtml = '';
        if (options && options.length) {
          optsHtml = '<div class="sug-wrap" style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;">' +
            options.map(o => \`<button class="sug-opt" data-val="\${escapeAttr(o)}">\${escapeHtml(o)}</button>\`).join('') +
            '</div>';
        }
        // Text goes into .msg-text, options go outside so streaming doesn't wipe them
        wrap.innerHTML = \`
          <div class="msg-avatar ai-avatar">
            <span class="material-symbols-outlined" style="font-size:16px;color:#818cf8">smart_toy</span>
          </div>
          <div class="msg-bubble ai-bubble">
            <div class="msg-text">\${html}</div>\${optsHtml}
          </div>\`;

        wrap.querySelectorAll('.sug-opt').forEach(btn => {
          btn.addEventListener('click', () => {
            userInput.value = btn.dataset.val;
            autoResize(userInput);
            sendMessage();
          });
        });
      } else {
        wrap.innerHTML = \`
          <div class="msg-avatar user-avatar">
            <span class="material-symbols-outlined" style="font-size:16px;color:#c7d2fe">person</span>
          </div>
          <div class="msg-bubble user-bubble"><div class="msg-text">\${html}</div></div>\`;
      }
      chatView.appendChild(wrap);
      chatView.scrollTop = chatView.scrollHeight;
      return wrap;
    }

    function escapeAttr(s) {
      return String(s).replace(/"/g, '&quot;');
    }

    function addTyping() {
      const wrap = document.createElement('div');
      wrap.className = 'typing-wrap';
      wrap.id = 'typing';
      wrap.innerHTML = \`
        <div class="msg-avatar ai-avatar">
          <span class="material-symbols-outlined" style="font-size:16px;color:#818cf8">smart_toy</span>
        </div>
        <div class="typing-bubble">
          <div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        </div>\`;
      chatView.appendChild(wrap);
      chatView.scrollTop = chatView.scrollHeight;
    }

    function removeTyping() {
      document.getElementById('typing')?.remove();
    }

    async function streamText(msgWrap, text, speed = 15) {
      return new Promise((resolve) => {
        const textEl = msgWrap.querySelector('.msg-text');
        if (!textEl) { resolve(); return; }
        let i = 0;
        textEl.innerHTML = '';
        function type() {
          if (i < text.length) {
            const partial = text.substring(0, i + 1);
            textEl.innerHTML = renderMarkdown(partial);
            chatView.scrollTop = chatView.scrollHeight;
            i++;
            setTimeout(type, speed);
          } else {
            resolve();
          }
        }
        type();
      });
    }

    async function sendMessage() {
      const text = userInput.value.trim();
      if (!text || isLoading) return;

      userInput.value = '';
      autoResize(userInput);
      addMsg('user', escapeHtml(text), []);
      conversationHistory.push({ role: 'user', content: text });
      setLoading(true);

      addTyping();

      try {
        const resp = await fetch(\`/api/app/\${appId}/chat\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationHistory,
            prompt_vi: promptVi,
            app_name: appName,
          }),
        });

        removeTyping();

        if (!resp.ok) {
          const data = await resp.json();
          addMsg('ai', \`<span style="color:#f87171">Lỗi: \${data.error || 'Không thể kết nối AI.'}</span>\`, []);
          conversationHistory.pop();
        } else {
          const data = await resp.json();
          const reply = data.reply || '';

          // Extract options from [data]...[/data] blocks
          let options = [];
          let cleanReply = reply;
          const dataStart = reply.indexOf('[data]');
          const dataEnd = reply.indexOf('[/data]');
          if (dataStart !== -1 && dataEnd !== -1 && dataEnd > dataStart) {
            const jsonStr = reply.slice(dataStart + 6, dataEnd).trim();
            try {
              const parsed = JSON.parse(jsonStr);
              options = Array.isArray(parsed.options) ? parsed.options : [];
            } catch {}
            cleanReply = reply.slice(0, dataStart).trim();
          }

          // Stream the reply
          const msgWrap = addMsg('ai', '', options);
          await streamText(msgWrap, cleanReply);

          conversationHistory.push({ role: 'assistant', content: reply });

          if (data.sop_complete && data.full_sop_text) {
            fullSopText = data.full_sop_text;
            showSopResult(data.full_sop_text);
          }
        }
      } catch (err) {
        removeTyping();
        addMsg('ai', '<span style="color:#f87171">Lỗi kết nối. Vui lòng thử lại.</span>', []);
        conversationHistory.pop();
      } finally {
        setLoading(false);
        userInput.focus();
      }
    }

    // ─── Print Button ───
    printSopBtn.addEventListener('click', () => window.print());

    // ─── Markdown to HTML parser ───
    function parseMarkdownToHtml(text) {
      // Strip SOP markers
      text = text
        .replace(/^---SOP---\\s*$/gm, '')
        .replace(/^---END-SOP---\\s*$/gm, '');

      const lines = text.split('\\n');
      const blocks = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];

        // Skip separator lines
        if (/^---+$/.test(line.trim())) { i++; continue; }

        // H1 – section title
        if (/^# (.+)/.test(line)) {
          blocks.push({ type: 'h1', text: line.replace(/^# /, '') });
          i++; continue;
        }

        // H2 – subsection
        if (/^## (.+)/.test(line)) {
          blocks.push({ type: 'h2', text: line.replace(/^## /, '') });
          i++; continue;
        }

        // H3
        if (/^### (.+)/.test(line)) {
          blocks.push({ type: 'h3', text: line.replace(/^### /, '') });
          i++; continue;
        }

        // Numbered list (e.g. "1. Do something")
        if (/^\\d+\\.\\s/.test(line)) {
          const items = [];
          while (i < lines.length && /^\\d+\\.\\s/.test(lines[i])) {
            items.push(lines[i].replace(/^\\d+\\.\\s/, ''));
            i++;
          }
          blocks.push({ type: 'ol', items });
          continue;
        }

        // Bullet list
        if (/^[-*]\\s/.test(line)) {
          const items = [];
          while (i < lines.length && /^[-*]\\s/.test(lines[i])) {
            items.push(lines[i].replace(/^[-*]\\s/, ''));
            i++;
          }
          blocks.push({ type: 'ul', items });
          continue;
        }

        // Table
        if (/^\\|/.test(line) && i + 1 < lines.length && /^\\|[-| ]/.test(lines[i + 1])) {
          const headerCells = lines[i].split('|').filter(c => c.trim());
          i++; // skip separator
          const rows = [];
          while (i < lines.length && /^\\|/.test(lines[i])) {
            const cells = lines[i].split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1 && c.trim());
            if (cells.length) rows.push(cells);
            i++;
          }
          blocks.push({ type: 'table', headers: headerCells, rows });
          continue;
        }

        // Empty line → skip
        if (!line.trim()) { i++; continue; }

        // Paragraph
        let para = '';
        while (i < lines.length && lines[i].trim() && !/^#+\\s/.test(lines[i]) && !/^\\d+\\.\\s/.test(lines[i]) && !/^[-*]\\s/.test(lines[i]) && !/^\\|/.test(lines[i])) {
          para += (para ? ' ' : '') + lines[i].trim();
          i++;
        }
        if (para) blocks.push({ type: 'p', text: para });
      }

      // Convert blocks to HTML
      function esc(s) {
        return String(s)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }

      function inline(s) {
        return esc(s)
          .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
          .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
          .replace(/\`(.+?)\`/g, '<code>$1</code>');
      }

      return blocks.map(b => {
        if (b.type === 'h1') return \`<h1>\${inline(b.text)}</h1>\`;
        if (b.type === 'h2') return \`<h2>\${inline(b.text)}</h2>\`;
        if (b.type === 'h3') return \`<h3>\${inline(b.text)}</h3>\`;
        if (b.type === 'ol') return \`<ol>\${b.items.map(it => \`<li>\${inline(it)}</li>\`).join('')}</ol>\`;
        if (b.type === 'ul') return \`<ul>\${b.items.map(it => \`<li>\${inline(it)}</li>\`).join('')}</ul>\`;
        if (b.type === 'table') {
          const ths = b.headers.map(h => \`<th>\${inline(h.trim())}</th>\`).join('');
          const rows = b.rows.map(r => \`<tr>\${r.map(c => \`<td>\${inline(c.trim())}</td>\`).join('')}</tr>\`).join('');
          return \`<table><thead><tr>\${ths}</tr></thead><tbody>\${rows}</tbody></table>\`;
        }
        if (b.type === 'p') return \`<p>\${inline(b.text)}</p>\`;
        return '';
      }).join('\\n');
    }

    // ─── Extract TOC from blocks ───
    function extractToc(blocks) {
      const tocBlocks = blocks.filter(b => b.type === 'h2');
      return tocBlocks.map((b, i) => ({
        num: i + 1,
        text: b.text,
      }));
    }

    // ─── Parse markdown text back to blocks ───
    function parseMarkdownToBlocks(text) {
      text = text
        .replace(/^---SOP---\\s*$/gm, '')
        .replace(/^---END-SOP---\\s*$/gm, '');

      const lines = text.split('\\n');
      const blocks = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];
        if (/^---+$/.test(line.trim())) { i++; continue; }
        if (/^# (.+)/.test(line)) { blocks.push({ type: 'h1', text: line.replace(/^# /, '') }); i++; continue; }
        if (/^## (.+)/.test(line)) { blocks.push({ type: 'h2', text: line.replace(/^## /, '') }); i++; continue; }
        if (/^### (.+)/.test(line)) { blocks.push({ type: 'h3', text: line.replace(/^### /, '') }); i++; continue; }
        if (/^\\d+\\.\\s/.test(line)) {
          const items = [];
          while (i < lines.length && /^\\d+\\.\\s/.test(lines[i])) { items.push(lines[i].replace(/^\\d+\\.\\s/, '')); i++; }
          blocks.push({ type: 'ol', items }); continue;
        }
        if (/^[-*]\\s/.test(line)) {
          const items = [];
          while (i < lines.length && /^[-*]\\s/.test(lines[i])) { items.push(lines[i].replace(/^[-*]\\s/, '')); i++; }
          blocks.push({ type: 'ul', items }); continue;
        }
        if (/^\\|/.test(line) && i + 1 < lines.length && /^\\|[-| ]/.test(lines[i + 1])) {
          const headerCells = lines[i].split('|').filter(c => c.trim());
          i++;
          const rows = [];
          while (i < lines.length && /^\\|/.test(lines[i])) {
            const cells = lines[i].split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1 && c.trim());
            if (cells.length) rows.push(cells);
            i++;
          }
          blocks.push({ type: 'table', headers: headerCells, rows }); continue;
        }
        if (!line.trim()) { i++; continue; }
        let para = '';
        while (i < lines.length && lines[i].trim() && !/^#+\\s/.test(lines[i]) && !/^\\d+\\.\\s/.test(lines[i]) && !/^[-*]\\s/.test(lines[i]) && !/^\\|/.test(lines[i])) {
          para += (para ? ' ' : '') + lines[i].trim();
          i++;
        }
        if (para) blocks.push({ type: 'p', text: para });
      }
      return blocks;
    }

    // ─── Extract title (first H1) from markdown ───
    function extractTitle(md) {
      const m = md.match(/^#\\s+(.+)$/m);
      return m ? m[1].trim() : 'Quy trình vận hành chuẩn (SOP)';
    }

    // ─── Build print document ───
    function buildPrintDocument(markdownText) {
      const title = extractTitle(markdownText);
      const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
      const blocks = parseMarkdownToBlocks(markdownText);
      const toc = extractToc(blocks);

      function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      function inline(s) {
        return esc(s)
          .replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>')
          .replace(/\\*(.+?)\\*/g, '<em>$1</em>')
          .replace(/\`(.+?)\`/g, '<code>$1</code>');
      }

      function renderBlocks(bs, targetClass) {
        return bs.map(b => {
          if (b.type === 'h1') return \`<h1>\${inline(b.text)}</h1>\`;
          if (b.type === 'h2') return \`<h2>\${inline(b.text)}</h2>\`;
          if (b.type === 'h3') return \`<h3>\${inline(b.text)}</h3>\`;
          if (b.type === 'ol') return \`<ol>\${b.items.map(it => \`<li>\${inline(it)}</li>\`).join('')}</ol>\`;
          if (b.type === 'ul') return \`<ul>\${b.items.map(it => \`<li>\${inline(it)}</li>\`).join('')}</ul>\`;
          if (b.type === 'table') {
            const ths = b.headers.map(h => \`<th>\${inline(h.trim())}</th>\`).join('');
            const rows = b.rows.map(r => \`<tr>\${r.map(c => \`<td>\${inline(c.trim())}</td>\`).join('')}</tr>\`).join('');
            return \`<table><thead><tr>\${ths}</tr></thead><tbody>\${rows}</tbody></table>\`;
          }
          if (b.type === 'p') return \`<p>\${inline(b.text)}</p>\`;
          return '';
        }).join('\\n');
      }

      // Cover page + body as one continuous page (for print)
      // TOC rendered as visible list after cover info
      const tocHtml = toc.length > 0
        ? \`<div class="sop-toc">
            <div class="sop-toc-title">MỤC LỤC</div>
            <ul class="sop-toc-list">
              \${toc.map(t => \`
                <li>
                  <span class="sop-toc-num">\${t.num}</span>
                  <span class="sop-toc-text">\${inline(t.text)}</span>
                  <span class="sop-toc-dots"></span>
                  <span class="sop-toc-page">1</span>
                </li>\`).join('')}
            </ul>
          </div>\`
        : '';

      return \`
<div class="sop-page">
  <div class="sop-print-header">
    <div class="sop-print-logo">
      <div class="sop-print-logo-icon">DE</div>
      <div>
        <div class="sop-print-logo-text">Dental Empire OS</div>
        <div class="sop-print-logo-sub">Quản lý Phòng khám Nha khoa</div>
      </div>
    </div>
    <div class="sop-print-doc-info">
      <strong>\${inline(title)}</strong><br>
      Ngày ban hành: \${today}<br>
      Mã tài liệu: SOP-\${new Date().getFullYear()}-001
    </div>
  </div>

  <div class="sop-cover">
    <div class="sop-cover-badge">Phòng khám Nha khoa</div>
    <div class="sop-cover-title">\${inline(title)}</div>
    <div class="sop-cover-subtitle">Quy trình vận hành chuẩn (SOP)</div>
    <div class="sop-cover-divider"></div>
    <div class="sop-cover-meta">
      <table>
        <tr><td>Ngày ban hành</td><td>\${today}</td></tr>
        <tr><td>Phiên bản</td><td>1.0</td></tr>
        <tr><td>Người phê duyệt</td><td>_______________</td></tr>
        <tr><td>Người soạn thảo</td><td>_______________</td></tr>
        <tr><td>Đơn vị</td><td>Phòng khám Nha khoa</td></tr>
      </table>
    </div>
    <div class="sop-cover-signatures">
      <div class="sop-cover-sig-box">
        <div class="sop-cover-sig-box-title">Người soạn thảo</div>
        <div class="sop-cover-sig-line"></div>
        <div class="sop-cover-sig-box-name" style="margin-top:6px;font-size:8pt;color:#64748b">Họ và tên</div>
      </div>
      <div class="sop-cover-sig-box">
        <div class="sop-cover-sig-box-title">Người kiểm tra</div>
        <div class="sop-cover-sig-line"></div>
        <div class="sop-cover-sig-box-name" style="margin-top:6px;font-size:8pt;color:#64748b">Họ và tên</div>
      </div>
      <div class="sop-cover-sig-box">
        <div class="sop-cover-sig-box-title">Người phê duyệt</div>
        <div class="sop-cover-sig-line"></div>
        <div class="sop-cover-sig-box-name" style="margin-top:6px;font-size:8pt;color:#64748b">Họ và tên</div>
      </div>
    </div>
  </div>

  \${tocHtml}

  <div class="sop-print-body">
    \${renderBlocks(blocks, 'sop-print-body')}
  </div>

  <div class="sop-print-footer">
    <div class="sop-print-footer-left">Dental Empire OS · \${today}</div>
    <div class="sop-print-footer-center">\${inline(title)}</div>
    <div class="sop-print-footer-right">Trang <span class="sop-page-num"></span></div>
  </div>
</div>\`;
    }

    // ─── Show SOP result ───
    function showSopResult(markdownText) {
      // Hide chat, show SOP
      chatView.style.display = 'none';
      sopView.classList.add('visible');

      // Render on-screen preview (simplified)
      const html = parseMarkdownToHtml(markdownText);
      const title = extractTitle(markdownText);
      sopContent.innerHTML = \`
        <h1>\${title}</h1>
        \${html}
        <div class="sop-footer">Tạo bởi Dental Empire OS · \${new Date().toLocaleDateString('vi-VN')}</div>
      \`;

      // Build print template
      sopPrintRoot.innerHTML = buildPrintDocument(markdownText);
    }

    function resetChat() {
      if (!confirm('Bắt đầu lại SOP? Mọi thông tin sẽ bị xóa.')) return;
      conversationHistory = [];
      fullSopText = '';
      sopView.classList.remove('visible');
      sopContent.innerHTML = '';
      sopPrintRoot.innerHTML = '';
      chatView.style.display = '';
      chatView.innerHTML = \`
        <div class="msg-wrap">
          <div class="msg-avatar ai-avatar">
            <span class="material-symbols-outlined" style="font-size:16px;color:#818cf8">smart_toy</span>
          </div>
          <div class="msg-bubble ai-bubble">
            Xin chào! Tôi sẽ giúp bạn xây dựng <strong>SOP (Quy trình vận hành chuẩn)</strong> cho phòng khám nha khoa.<br><br>
            Chúng ta sẽ đi qua từng bước một cách từ từ. Bạn sẵn sàng chưa?<br><br>
            <strong>Câu hỏi đầu tiên:</strong> Phòng khám của bạn hiện có bao nhiêu nha sĩ và nhân viên?
          </div>
        </div>\`;
      userInput.focus();
    }

    function autoResize(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }

    function setLoading(state) {
      isLoading = state;
      sendBtn.disabled = state;
      userInput.disabled = state;
      userInput.placeholder = state ? 'Đang suy nghĩ...' : 'Nhập câu trả lời...';
    }

    // Events
    userInput.addEventListener('input', () => autoResize(userInput));
    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    sendBtn.addEventListener('click', sendMessage);
    resetBtn.addEventListener('click', resetChat);
    newChatBtn.addEventListener('click', resetChat);

    userInput.focus();
  })();<\/script> </body> </html>`], ['<html lang="vi" data-astro-cid-7dcrsdz3> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>', '</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700&display=swap" rel="stylesheet"><link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap" rel="stylesheet">', '</head> <body data-astro-cid-7dcrsdz3> <!-- Header --> <div class="app-header" data-astro-cid-7dcrsdz3> <div class="header-inner" data-astro-cid-7dcrsdz3> <div class="header-icon" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:22px;color:#818cf8" data-astro-cid-7dcrsdz3>smart_toy</span> </div> <div class="header-text" data-astro-cid-7dcrsdz3> <div class="header-title" data-astro-cid-7dcrsdz3>', "</div> ", ' </div> </div> </div> <!-- Chat area --> <div id="chat-view" class="chat-area" data-astro-cid-7dcrsdz3> <!-- Welcome message --> <div class="msg-wrap" id="welcome-msg" data-astro-cid-7dcrsdz3> <div class="msg-avatar ai-avatar" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:16px;color:#818cf8" data-astro-cid-7dcrsdz3>smart_toy</span> </div> <div class="msg-bubble ai-bubble" data-astro-cid-7dcrsdz3>\nXin chào! Tôi sẽ giúp bạn xây dựng <strong data-astro-cid-7dcrsdz3>SOP (Quy trình vận hành chuẩn)</strong> cho phòng khám nha khoa.<br data-astro-cid-7dcrsdz3><br data-astro-cid-7dcrsdz3>\nChúng ta sẽ đi qua từng bước một cách từ từ. Bạn sẵn sàng chưa?<br data-astro-cid-7dcrsdz3><br data-astro-cid-7dcrsdz3> <strong data-astro-cid-7dcrsdz3>Câu hỏi đầu tiên:</strong> Phòng khám của bạn hiện có bao nhiêu nha sĩ và nhân viên?\n</div> </div> </div> <!-- SOP Result --> <div id="sop-view" class="sop-panel" data-astro-cid-7dcrsdz3> <div class="sop-toolbar" data-astro-cid-7dcrsdz3> <h2 data-astro-cid-7dcrsdz3>Kết quả SOP</h2> <button class="sop-btn print" id="print-sop-btn" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:16px" data-astro-cid-7dcrsdz3>print</span>\nIn / Xuất PDF\n</button> <button class="sop-btn new" id="new-chat-btn" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:16px" data-astro-cid-7dcrsdz3>add</span>\nTạo SOP mới\n</button> </div> <div id="sop-content" class="sop-content" data-astro-cid-7dcrsdz3></div> </div> <!-- Print-only template (hidden, cloned for printing) --> <div id="sop-print-root" data-astro-cid-7dcrsdz3></div> <!-- Input area --> <div class="input-area" data-astro-cid-7dcrsdz3> <div class="input-inner" data-astro-cid-7dcrsdz3> <div class="input-row" data-astro-cid-7dcrsdz3> <textarea id="user-input" rows="1" placeholder="Nhập câu trả lời..." autocomplete="off" data-astro-cid-7dcrsdz3></textarea> <button class="send-btn" id="send-btn" data-astro-cid-7dcrsdz3> <span class="material-symbols-outlined" style="font-size:18px" data-astro-cid-7dcrsdz3>arrow_upward</span> </button> </div> <div class="input-hint" data-astro-cid-7dcrsdz3> <span data-astro-cid-7dcrsdz3>Enter gửi · Shift+Enter xuống dòng</span> <button class="reset-link" id="reset-btn" data-astro-cid-7dcrsdz3>Bắt đầu lại</button> </div> </div> </div> <script>(function(){', `
    const chatView = document.getElementById('chat-view');
    const sopView = document.getElementById('sop-view');
    const sopContent = document.getElementById('sop-content');
    const sopPrintRoot = document.getElementById('sop-print-root');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const resetBtn = document.getElementById('reset-btn');
    const newChatBtn = document.getElementById('new-chat-btn');
    const printSopBtn = document.getElementById('print-sop-btn');

    let conversationHistory = [];
    let isLoading = false;
    let fullSopText = '';

    function escapeHtml(text) {
      const d = document.createElement('div');
      d.textContent = text;
      return d.innerHTML;
    }

    function renderMarkdown(text) {
      return escapeHtml(text)
        .replace(/\\\\*\\\\*(.*?)\\\\*\\\\*/g, '<strong>$1</strong>')
        .replace(/\\\\*(.*?)\\\\*/g, '<em>$1</em>')
        .replace(/\\\`(.*?)\\\`/g, '<code>$1</code>')
        .replace(/^### (.+)$/gm, '<h3>$1</h3>')
        .replace(/^## (.+)$/gm, '<h2>$1</h2>')
        .replace(/^# (.+)$/gm, '<h1>$1</h1>')
        .replace(/^\\\\d+\\\\. (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\\\\/li>)/s, '<ol>$1</ol>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        .replace(/(<li>.*<\\\\/li>)/s, '<ul>$1</ul>')
        .replace(/\\\\n\\\\n/g, '</p><p>')
        .replace(/\\\\n/g, '<br>');
    }

    function addMsg(role, html, options) {
      const wrap = document.createElement('div');
      wrap.className = 'msg-wrap' + (role === 'user' ? ' user' : '');
      if (role === 'ai') {
        let optsHtml = '';
        if (options && options.length) {
          optsHtml = '<div class="sug-wrap" style="margin-top:10px;display:flex;flex-wrap:wrap;gap:6px;">' +
            options.map(o => \\\`<button class="sug-opt" data-val="\\\${escapeAttr(o)}">\\\${escapeHtml(o)}</button>\\\`).join('') +
            '</div>';
        }
        // Text goes into .msg-text, options go outside so streaming doesn't wipe them
        wrap.innerHTML = \\\`
          <div class="msg-avatar ai-avatar">
            <span class="material-symbols-outlined" style="font-size:16px;color:#818cf8">smart_toy</span>
          </div>
          <div class="msg-bubble ai-bubble">
            <div class="msg-text">\\\${html}</div>\\\${optsHtml}
          </div>\\\`;

        wrap.querySelectorAll('.sug-opt').forEach(btn => {
          btn.addEventListener('click', () => {
            userInput.value = btn.dataset.val;
            autoResize(userInput);
            sendMessage();
          });
        });
      } else {
        wrap.innerHTML = \\\`
          <div class="msg-avatar user-avatar">
            <span class="material-symbols-outlined" style="font-size:16px;color:#c7d2fe">person</span>
          </div>
          <div class="msg-bubble user-bubble"><div class="msg-text">\\\${html}</div></div>\\\`;
      }
      chatView.appendChild(wrap);
      chatView.scrollTop = chatView.scrollHeight;
      return wrap;
    }

    function escapeAttr(s) {
      return String(s).replace(/"/g, '&quot;');
    }

    function addTyping() {
      const wrap = document.createElement('div');
      wrap.className = 'typing-wrap';
      wrap.id = 'typing';
      wrap.innerHTML = \\\`
        <div class="msg-avatar ai-avatar">
          <span class="material-symbols-outlined" style="font-size:16px;color:#818cf8">smart_toy</span>
        </div>
        <div class="typing-bubble">
          <div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>
        </div>\\\`;
      chatView.appendChild(wrap);
      chatView.scrollTop = chatView.scrollHeight;
    }

    function removeTyping() {
      document.getElementById('typing')?.remove();
    }

    async function streamText(msgWrap, text, speed = 15) {
      return new Promise((resolve) => {
        const textEl = msgWrap.querySelector('.msg-text');
        if (!textEl) { resolve(); return; }
        let i = 0;
        textEl.innerHTML = '';
        function type() {
          if (i < text.length) {
            const partial = text.substring(0, i + 1);
            textEl.innerHTML = renderMarkdown(partial);
            chatView.scrollTop = chatView.scrollHeight;
            i++;
            setTimeout(type, speed);
          } else {
            resolve();
          }
        }
        type();
      });
    }

    async function sendMessage() {
      const text = userInput.value.trim();
      if (!text || isLoading) return;

      userInput.value = '';
      autoResize(userInput);
      addMsg('user', escapeHtml(text), []);
      conversationHistory.push({ role: 'user', content: text });
      setLoading(true);

      addTyping();

      try {
        const resp = await fetch(\\\`/api/app/\\\${appId}/chat\\\`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: conversationHistory,
            prompt_vi: promptVi,
            app_name: appName,
          }),
        });

        removeTyping();

        if (!resp.ok) {
          const data = await resp.json();
          addMsg('ai', \\\`<span style="color:#f87171">Lỗi: \\\${data.error || 'Không thể kết nối AI.'}</span>\\\`, []);
          conversationHistory.pop();
        } else {
          const data = await resp.json();
          const reply = data.reply || '';

          // Extract options from [data]...[/data] blocks
          let options = [];
          let cleanReply = reply;
          const dataStart = reply.indexOf('[data]');
          const dataEnd = reply.indexOf('[/data]');
          if (dataStart !== -1 && dataEnd !== -1 && dataEnd > dataStart) {
            const jsonStr = reply.slice(dataStart + 6, dataEnd).trim();
            try {
              const parsed = JSON.parse(jsonStr);
              options = Array.isArray(parsed.options) ? parsed.options : [];
            } catch {}
            cleanReply = reply.slice(0, dataStart).trim();
          }

          // Stream the reply
          const msgWrap = addMsg('ai', '', options);
          await streamText(msgWrap, cleanReply);

          conversationHistory.push({ role: 'assistant', content: reply });

          if (data.sop_complete && data.full_sop_text) {
            fullSopText = data.full_sop_text;
            showSopResult(data.full_sop_text);
          }
        }
      } catch (err) {
        removeTyping();
        addMsg('ai', '<span style="color:#f87171">Lỗi kết nối. Vui lòng thử lại.</span>', []);
        conversationHistory.pop();
      } finally {
        setLoading(false);
        userInput.focus();
      }
    }

    // ─── Print Button ───
    printSopBtn.addEventListener('click', () => window.print());

    // ─── Markdown to HTML parser ───
    function parseMarkdownToHtml(text) {
      // Strip SOP markers
      text = text
        .replace(/^---SOP---\\\\s*$/gm, '')
        .replace(/^---END-SOP---\\\\s*$/gm, '');

      const lines = text.split('\\\\n');
      const blocks = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];

        // Skip separator lines
        if (/^---+$/.test(line.trim())) { i++; continue; }

        // H1 – section title
        if (/^# (.+)/.test(line)) {
          blocks.push({ type: 'h1', text: line.replace(/^# /, '') });
          i++; continue;
        }

        // H2 – subsection
        if (/^## (.+)/.test(line)) {
          blocks.push({ type: 'h2', text: line.replace(/^## /, '') });
          i++; continue;
        }

        // H3
        if (/^### (.+)/.test(line)) {
          blocks.push({ type: 'h3', text: line.replace(/^### /, '') });
          i++; continue;
        }

        // Numbered list (e.g. "1. Do something")
        if (/^\\\\d+\\\\.\\\\s/.test(line)) {
          const items = [];
          while (i < lines.length && /^\\\\d+\\\\.\\\\s/.test(lines[i])) {
            items.push(lines[i].replace(/^\\\\d+\\\\.\\\\s/, ''));
            i++;
          }
          blocks.push({ type: 'ol', items });
          continue;
        }

        // Bullet list
        if (/^[-*]\\\\s/.test(line)) {
          const items = [];
          while (i < lines.length && /^[-*]\\\\s/.test(lines[i])) {
            items.push(lines[i].replace(/^[-*]\\\\s/, ''));
            i++;
          }
          blocks.push({ type: 'ul', items });
          continue;
        }

        // Table
        if (/^\\\\|/.test(line) && i + 1 < lines.length && /^\\\\|[-| ]/.test(lines[i + 1])) {
          const headerCells = lines[i].split('|').filter(c => c.trim());
          i++; // skip separator
          const rows = [];
          while (i < lines.length && /^\\\\|/.test(lines[i])) {
            const cells = lines[i].split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1 && c.trim());
            if (cells.length) rows.push(cells);
            i++;
          }
          blocks.push({ type: 'table', headers: headerCells, rows });
          continue;
        }

        // Empty line → skip
        if (!line.trim()) { i++; continue; }

        // Paragraph
        let para = '';
        while (i < lines.length && lines[i].trim() && !/^#+\\\\s/.test(lines[i]) && !/^\\\\d+\\\\.\\\\s/.test(lines[i]) && !/^[-*]\\\\s/.test(lines[i]) && !/^\\\\|/.test(lines[i])) {
          para += (para ? ' ' : '') + lines[i].trim();
          i++;
        }
        if (para) blocks.push({ type: 'p', text: para });
      }

      // Convert blocks to HTML
      function esc(s) {
        return String(s)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;');
      }

      function inline(s) {
        return esc(s)
          .replace(/\\\\*\\\\*(.+?)\\\\*\\\\*/g, '<strong>$1</strong>')
          .replace(/\\\\*(.+?)\\\\*/g, '<em>$1</em>')
          .replace(/\\\`(.+?)\\\`/g, '<code>$1</code>');
      }

      return blocks.map(b => {
        if (b.type === 'h1') return \\\`<h1>\\\${inline(b.text)}</h1>\\\`;
        if (b.type === 'h2') return \\\`<h2>\\\${inline(b.text)}</h2>\\\`;
        if (b.type === 'h3') return \\\`<h3>\\\${inline(b.text)}</h3>\\\`;
        if (b.type === 'ol') return \\\`<ol>\\\${b.items.map(it => \\\`<li>\\\${inline(it)}</li>\\\`).join('')}</ol>\\\`;
        if (b.type === 'ul') return \\\`<ul>\\\${b.items.map(it => \\\`<li>\\\${inline(it)}</li>\\\`).join('')}</ul>\\\`;
        if (b.type === 'table') {
          const ths = b.headers.map(h => \\\`<th>\\\${inline(h.trim())}</th>\\\`).join('');
          const rows = b.rows.map(r => \\\`<tr>\\\${r.map(c => \\\`<td>\\\${inline(c.trim())}</td>\\\`).join('')}</tr>\\\`).join('');
          return \\\`<table><thead><tr>\\\${ths}</tr></thead><tbody>\\\${rows}</tbody></table>\\\`;
        }
        if (b.type === 'p') return \\\`<p>\\\${inline(b.text)}</p>\\\`;
        return '';
      }).join('\\\\n');
    }

    // ─── Extract TOC from blocks ───
    function extractToc(blocks) {
      const tocBlocks = blocks.filter(b => b.type === 'h2');
      return tocBlocks.map((b, i) => ({
        num: i + 1,
        text: b.text,
      }));
    }

    // ─── Parse markdown text back to blocks ───
    function parseMarkdownToBlocks(text) {
      text = text
        .replace(/^---SOP---\\\\s*$/gm, '')
        .replace(/^---END-SOP---\\\\s*$/gm, '');

      const lines = text.split('\\\\n');
      const blocks = [];
      let i = 0;

      while (i < lines.length) {
        const line = lines[i];
        if (/^---+$/.test(line.trim())) { i++; continue; }
        if (/^# (.+)/.test(line)) { blocks.push({ type: 'h1', text: line.replace(/^# /, '') }); i++; continue; }
        if (/^## (.+)/.test(line)) { blocks.push({ type: 'h2', text: line.replace(/^## /, '') }); i++; continue; }
        if (/^### (.+)/.test(line)) { blocks.push({ type: 'h3', text: line.replace(/^### /, '') }); i++; continue; }
        if (/^\\\\d+\\\\.\\\\s/.test(line)) {
          const items = [];
          while (i < lines.length && /^\\\\d+\\\\.\\\\s/.test(lines[i])) { items.push(lines[i].replace(/^\\\\d+\\\\.\\\\s/, '')); i++; }
          blocks.push({ type: 'ol', items }); continue;
        }
        if (/^[-*]\\\\s/.test(line)) {
          const items = [];
          while (i < lines.length && /^[-*]\\\\s/.test(lines[i])) { items.push(lines[i].replace(/^[-*]\\\\s/, '')); i++; }
          blocks.push({ type: 'ul', items }); continue;
        }
        if (/^\\\\|/.test(line) && i + 1 < lines.length && /^\\\\|[-| ]/.test(lines[i + 1])) {
          const headerCells = lines[i].split('|').filter(c => c.trim());
          i++;
          const rows = [];
          while (i < lines.length && /^\\\\|/.test(lines[i])) {
            const cells = lines[i].split('|').filter((c, idx, arr) => idx > 0 && idx < arr.length - 1 && c.trim());
            if (cells.length) rows.push(cells);
            i++;
          }
          blocks.push({ type: 'table', headers: headerCells, rows }); continue;
        }
        if (!line.trim()) { i++; continue; }
        let para = '';
        while (i < lines.length && lines[i].trim() && !/^#+\\\\s/.test(lines[i]) && !/^\\\\d+\\\\.\\\\s/.test(lines[i]) && !/^[-*]\\\\s/.test(lines[i]) && !/^\\\\|/.test(lines[i])) {
          para += (para ? ' ' : '') + lines[i].trim();
          i++;
        }
        if (para) blocks.push({ type: 'p', text: para });
      }
      return blocks;
    }

    // ─── Extract title (first H1) from markdown ───
    function extractTitle(md) {
      const m = md.match(/^#\\\\s+(.+)$/m);
      return m ? m[1].trim() : 'Quy trình vận hành chuẩn (SOP)';
    }

    // ─── Build print document ───
    function buildPrintDocument(markdownText) {
      const title = extractTitle(markdownText);
      const today = new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' });
      const blocks = parseMarkdownToBlocks(markdownText);
      const toc = extractToc(blocks);

      function esc(s) {
        return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      }
      function inline(s) {
        return esc(s)
          .replace(/\\\\*\\\\*(.+?)\\\\*\\\\*/g, '<strong>$1</strong>')
          .replace(/\\\\*(.+?)\\\\*/g, '<em>$1</em>')
          .replace(/\\\`(.+?)\\\`/g, '<code>$1</code>');
      }

      function renderBlocks(bs, targetClass) {
        return bs.map(b => {
          if (b.type === 'h1') return \\\`<h1>\\\${inline(b.text)}</h1>\\\`;
          if (b.type === 'h2') return \\\`<h2>\\\${inline(b.text)}</h2>\\\`;
          if (b.type === 'h3') return \\\`<h3>\\\${inline(b.text)}</h3>\\\`;
          if (b.type === 'ol') return \\\`<ol>\\\${b.items.map(it => \\\`<li>\\\${inline(it)}</li>\\\`).join('')}</ol>\\\`;
          if (b.type === 'ul') return \\\`<ul>\\\${b.items.map(it => \\\`<li>\\\${inline(it)}</li>\\\`).join('')}</ul>\\\`;
          if (b.type === 'table') {
            const ths = b.headers.map(h => \\\`<th>\\\${inline(h.trim())}</th>\\\`).join('');
            const rows = b.rows.map(r => \\\`<tr>\\\${r.map(c => \\\`<td>\\\${inline(c.trim())}</td>\\\`).join('')}</tr>\\\`).join('');
            return \\\`<table><thead><tr>\\\${ths}</tr></thead><tbody>\\\${rows}</tbody></table>\\\`;
          }
          if (b.type === 'p') return \\\`<p>\\\${inline(b.text)}</p>\\\`;
          return '';
        }).join('\\\\n');
      }

      // Cover page + body as one continuous page (for print)
      // TOC rendered as visible list after cover info
      const tocHtml = toc.length > 0
        ? \\\`<div class="sop-toc">
            <div class="sop-toc-title">MỤC LỤC</div>
            <ul class="sop-toc-list">
              \\\${toc.map(t => \\\`
                <li>
                  <span class="sop-toc-num">\\\${t.num}</span>
                  <span class="sop-toc-text">\\\${inline(t.text)}</span>
                  <span class="sop-toc-dots"></span>
                  <span class="sop-toc-page">1</span>
                </li>\\\`).join('')}
            </ul>
          </div>\\\`
        : '';

      return \\\`
<div class="sop-page">
  <div class="sop-print-header">
    <div class="sop-print-logo">
      <div class="sop-print-logo-icon">DE</div>
      <div>
        <div class="sop-print-logo-text">Dental Empire OS</div>
        <div class="sop-print-logo-sub">Quản lý Phòng khám Nha khoa</div>
      </div>
    </div>
    <div class="sop-print-doc-info">
      <strong>\\\${inline(title)}</strong><br>
      Ngày ban hành: \\\${today}<br>
      Mã tài liệu: SOP-\\\${new Date().getFullYear()}-001
    </div>
  </div>

  <div class="sop-cover">
    <div class="sop-cover-badge">Phòng khám Nha khoa</div>
    <div class="sop-cover-title">\\\${inline(title)}</div>
    <div class="sop-cover-subtitle">Quy trình vận hành chuẩn (SOP)</div>
    <div class="sop-cover-divider"></div>
    <div class="sop-cover-meta">
      <table>
        <tr><td>Ngày ban hành</td><td>\\\${today}</td></tr>
        <tr><td>Phiên bản</td><td>1.0</td></tr>
        <tr><td>Người phê duyệt</td><td>_______________</td></tr>
        <tr><td>Người soạn thảo</td><td>_______________</td></tr>
        <tr><td>Đơn vị</td><td>Phòng khám Nha khoa</td></tr>
      </table>
    </div>
    <div class="sop-cover-signatures">
      <div class="sop-cover-sig-box">
        <div class="sop-cover-sig-box-title">Người soạn thảo</div>
        <div class="sop-cover-sig-line"></div>
        <div class="sop-cover-sig-box-name" style="margin-top:6px;font-size:8pt;color:#64748b">Họ và tên</div>
      </div>
      <div class="sop-cover-sig-box">
        <div class="sop-cover-sig-box-title">Người kiểm tra</div>
        <div class="sop-cover-sig-line"></div>
        <div class="sop-cover-sig-box-name" style="margin-top:6px;font-size:8pt;color:#64748b">Họ và tên</div>
      </div>
      <div class="sop-cover-sig-box">
        <div class="sop-cover-sig-box-title">Người phê duyệt</div>
        <div class="sop-cover-sig-line"></div>
        <div class="sop-cover-sig-box-name" style="margin-top:6px;font-size:8pt;color:#64748b">Họ và tên</div>
      </div>
    </div>
  </div>

  \\\${tocHtml}

  <div class="sop-print-body">
    \\\${renderBlocks(blocks, 'sop-print-body')}
  </div>

  <div class="sop-print-footer">
    <div class="sop-print-footer-left">Dental Empire OS · \\\${today}</div>
    <div class="sop-print-footer-center">\\\${inline(title)}</div>
    <div class="sop-print-footer-right">Trang <span class="sop-page-num"></span></div>
  </div>
</div>\\\`;
    }

    // ─── Show SOP result ───
    function showSopResult(markdownText) {
      // Hide chat, show SOP
      chatView.style.display = 'none';
      sopView.classList.add('visible');

      // Render on-screen preview (simplified)
      const html = parseMarkdownToHtml(markdownText);
      const title = extractTitle(markdownText);
      sopContent.innerHTML = \\\`
        <h1>\\\${title}</h1>
        \\\${html}
        <div class="sop-footer">Tạo bởi Dental Empire OS · \\\${new Date().toLocaleDateString('vi-VN')}</div>
      \\\`;

      // Build print template
      sopPrintRoot.innerHTML = buildPrintDocument(markdownText);
    }

    function resetChat() {
      if (!confirm('Bắt đầu lại SOP? Mọi thông tin sẽ bị xóa.')) return;
      conversationHistory = [];
      fullSopText = '';
      sopView.classList.remove('visible');
      sopContent.innerHTML = '';
      sopPrintRoot.innerHTML = '';
      chatView.style.display = '';
      chatView.innerHTML = \\\`
        <div class="msg-wrap">
          <div class="msg-avatar ai-avatar">
            <span class="material-symbols-outlined" style="font-size:16px;color:#818cf8">smart_toy</span>
          </div>
          <div class="msg-bubble ai-bubble">
            Xin chào! Tôi sẽ giúp bạn xây dựng <strong>SOP (Quy trình vận hành chuẩn)</strong> cho phòng khám nha khoa.<br><br>
            Chúng ta sẽ đi qua từng bước một cách từ từ. Bạn sẵn sàng chưa?<br><br>
            <strong>Câu hỏi đầu tiên:</strong> Phòng khám của bạn hiện có bao nhiêu nha sĩ và nhân viên?
          </div>
        </div>\\\`;
      userInput.focus();
    }

    function autoResize(el) {
      el.style.height = 'auto';
      el.style.height = Math.min(el.scrollHeight, 120) + 'px';
    }

    function setLoading(state) {
      isLoading = state;
      sendBtn.disabled = state;
      userInput.disabled = state;
      userInput.placeholder = state ? 'Đang suy nghĩ...' : 'Nhập câu trả lời...';
    }

    // Events
    userInput.addEventListener('input', () => autoResize(userInput));
    userInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    sendBtn.addEventListener('click', sendMessage);
    resetBtn.addEventListener('click', resetChat);
    newChatBtn.addEventListener('click', resetChat);

    userInput.focus();
  })();<\/script> </body> </html>`])), app.name, renderHead(), app.name, app.description && renderTemplate`<div class="header-desc" data-astro-cid-7dcrsdz3>${app.description}</div>`, defineScriptVars({
    appId: app.id,
    appName: app.name,
    promptVi
  }));
}, "C:/dentalempireos/src/pages/app/[slug].astro", void 0);
const $$file = "C:/dentalempireos/src/pages/app/[slug].astro";
const $$url = "/app/[slug]";
const _page = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: $$slug,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: "Module" }));
const page = () => _page;
export {
  page
};
