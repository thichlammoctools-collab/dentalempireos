# Workers AI Theo Giai Đoạn Cho Chat RAG

## Bối Cảnh Và Quyết Định

- Phạm vi đợt đầu: chỉ `Chat Assistant` RAG công khai (`/api/website-chat`) và embedding cho kho tri thức website. AI Mentor, scanner, app AI và Wizard giữ nguyên ngoài phạm vi.
- Hạ tầng hiện có đã chạy Astro SSR trên Cloudflare Workers, D1, KV, R2 và Vectorize; `wrangler.jsonc` chưa khai báo Workers AI binding. Chat hiện gọi Cloudflare AI OpenAI-compatible qua `getAiGatewayConfig()`, trong khi admin có các màn hình AI Settings và AI Usage.
- Dùng Workers AI binding `env.AI`, đi qua AI Gateway khi đã cấu hình gateway, thay vì dùng API token từ ứng dụng. Binding là cơ chế Cloudflare khuyến nghị và không yêu cầu lưu khóa Workers AI trong D1.
- Tạo policy cấu hình trong admin thay vì hard-code giai đoạn:
  - `free_only` (mặc định triển khai): chỉ dùng quota miễn phí Workers AI.
  - `free_then_paid`: khi quota nội bộ miễn phí chạm ngưỡng, dùng model Workers AI Paid fallback nếu còn ngân sách.
  - `paid_only`: chỉ dùng model Workers AI Paid đã chọn, vẫn chịu các budget cap.
- Model preset ban đầu: `@cf/qwen/qwen3-30b-a3b-fp8` cho chat và `@cf/baai/bge-m3` cho embedding. Admin có thể chọn model Workers AI khác trong danh mục giới hạn. Benchmark tiếng Việt/RAG bắt buộc trước khi bật công khai.
- Chat công khai cần rate limit theo IP và session; khi policy không cho gọi LLM, vẫn trả tối đa 5 nguồn từ keyword search, không phát sinh inference.
- Khi dùng paid fallback, áp trần USD/ngày cho `chat`, `embedding` và toàn hệ thống. Việc chạm bất kỳ trần nào tắt paid inference tương ứng đến 00:00 UTC.
- Không thay Vectorize index hiện tại tại chỗ. Tạo index mới cho Workers AI embedding, index lại và chỉ đổi binding sau kiểm thử. Index cũ được giữ để rollback.

## Tham Chiếu Docs Cloudflare

- Workers AI khả dụng ở Workers Free và Paid; free allocation là `10,000 Neurons/ngày`, reset `00:00 UTC`. Trên Workers Paid, phần vượt quota có giá `$0.011 / 1,000 Neurons`. Không nên xem giới hạn nội bộ là số liệu billing tuyệt đối; nó là guardrail dựa trên usage API/ước lượng đã ghi nhận.
  - https://developers.cloudflare.com/workers-ai/platform/pricing/
- Khai báo binding: `"ai": { "binding": "AI" }`, gọi bằng `env.AI.run(model, input, options)`.
  - https://developers.cloudflare.com/workers-ai/configuration/bindings/
- Binding có thể tích hợp AI Gateway bằng tùy chọn `gateway: { id, skipCache, cacheTtl }` để có analytics/cache/rate limiting của Gateway.
  - https://developers.cloudflare.com/ai-gateway/usage/providers/workersai/
- Hạn mức Cloudflare hiện hành: text generation 300 RPM và text embeddings 3,000 RPM; guardrail ứng dụng vẫn phải thấp hơn và chủ động chặn abuse.
  - https://developers.cloudflare.com/workers-ai/platform/limits/
- Workers AI không dùng Customer Content để train/cải thiện model hay dịch vụ nếu không có consent rõ ràng. Nội dung chat/session vẫn được ứng dụng lưu trong D1 nên cần áp dụng retention hiện có/phù hợp.
  - https://developers.cloudflare.com/workers-ai/platform/data-usage/

## Luồng Hoạt Động Đích

1. Client gọi `POST /api/website-chat` với message và `session_id` hiện có hoặc mới.
2. API xác thực kích thước input, kiểm tra rate-limit IP/phút và anonymous session/ngày bằng KV với TTL đến mốc UTC phù hợp; trả `429` có `Retry-After` nếu vượt.
3. Tìm RAG vẫn chạy trước bằng hybrid search: Vectorize index mới khi active, kết hợp keyword search D1.
4. `resolveAiExecutionPolicy()` đọc một row policy D1, tổng usage ngày UTC và model/profile cho feature `website_chat`.
5. Resolver chọn một trong: free Workers AI model, paid Workers AI fallback model, hoặc `sources_only`. Với paid model, kiểm tra trần feature và trần global trước khi gọi.
6. `workers-ai-client` chuẩn hóa messages, gọi `env.AI.run(model, { messages, max_tokens, stream? }, { gateway })`; response không stream được chuẩn hóa thành text. Dùng `waitUntil()` cho logging không critical nếu cần để không kéo dài response.
7. Ghi audit usage cho mọi inference, bao gồm feature `website_chat`, policy/execution tier, model, latency, input/output tokens và neurons/cost trả về từ provider nếu API cung cấp. Nếu Cloudflare không trả field cost/neurons, lưu estimate dựa trên bảng rate model versioned; UI phải gắn nhãn `ước tính`.
8. Nếu free limit, paid budget, Cloudflare quota, hoặc model lỗi không retryable chặn LLM, API trả SSE metadata `mode: sources_only`, một assistant message tiêu chuẩn và tối đa 5 source metadata từ keyword search. Không tự động dùng provider ngoài.
9. Frontend nhận metadata mode, hiển thị thông báo hết lượt và danh sách nguồn an toàn; giữ format SSE/UX hiện tại. Không hiển thị lỗi nội bộ/token/cost cho người dùng.

## Kế Hoạch Triển Khai

1. **Khai báo binding và kiểu môi trường.**
   - Cập nhật `wrangler.jsonc` với `ai.binding = "AI"`; giữ `VECTORIZE` hiện hành cho đến thời điểm cutover.
   - Cập nhật `src/env.d.ts`: `AI: Ai`, `VECTORIZE: VectorizeIndex`, và chỉ bổ sung type khi type package hiện tại thiếu thực thể tương ứng.
   - Tại Cloudflare Dashboard, tạo Workers AI binding `AI` nếu deployment dùng Pages Functions/dashboard binding thay vì Wrangler; xác minh binding xuất hiện trên Worker production.
   - Không thêm `CF_API_TOKEN` hoặc account token vào client/D1 cho Workers AI binding. `CF_AI_GATEWAY_TOKEN` hiện có không còn là dependency để Chat RAG Workers AI chạy.

2. **Thiết kế migration cho model catalog, policy và usage.**
   - Thêm migration tuần tự sau `0057` (ví dụ `0058_workers_ai_policy.sql`) để tạo một row `ai_execution_policy` gồm:
     - `id = 1`, `website_chat_enabled`, `phase` (`free_only|free_then_paid|paid_only`), `gateway_enabled`, `gateway_id`.
     - `free_chat_model`, `paid_chat_model`, `embedding_model`, `max_chat_output_tokens`.
     - `free_daily_neuron_reserve` (mặc định thấp hơn `10,000`, ví dụ `8,000`, để tránh vượt quota do concurrent request/telemetry delayed).
     - `global_paid_budget_usd_daily`, `website_chat_paid_budget_usd_daily`, `embedding_paid_budget_usd_daily` (NULL/0 nghĩa là paid mode không hợp lệ hoặc disabled theo validation rõ ràng).
     - `active_vector_index` (`legacy|workers_ai`) và timestamps.
   - Thêm `ai_model_catalog` với allowlist Workers AI model, task (`chat|embedding`), pricing input/output per million token, neuron rate, output cap và `is_active`. Seed Qwen 30B và BGE-M3; không dùng form free-text cho model ID.
   - Mở rộng `ai_usage_log` hoặc tạo `workers_ai_usage_log` chuyên biệt, không phá logs cũ. Bắt buộc: `feature`, `execution_tier` (`free|paid|sources_only`), `provider_id='workers-ai'`, `model_id`, `request_id`, `session_id`, `ip_hash`, `input_tokens`, `output_tokens`, `neurons`, `cost_usd`, `cost_is_estimated`, `success`, `failure_code`, `latency_ms`, `created_at`.
   - Thêm index cho `created_at`, `(feature, created_at)`, `(execution_tier, created_at)` và unique request id khi provider trả về một ID chống ghi trùng.
   - Migrate/keep `ai_settings` và `ai_provider` để các feature ngoài phạm vi không bị ảnh hưởng. Không đưa `api_key` vào UI response; migration chỉ thêm bảng/column additive.

3. **Tạo AI execution layer chuyên cho Workers AI.**
   - Thêm `src/lib/workers-ai-client.ts` chứa type-safe wrapper cho chat và embedding binding; wrapper nhận `Env`, config đã resolve, messages và telemetry context.
   - Chuẩn hóa output chat từ `env.AI.run`: đọc `response`, `choices[0].message.content` hoặc shape được model trả về; báo lỗi typed khi output trống/không đúng shape.
   - Phân biệt provider errors: quota/budget/rate limit (`429`), invalid model/input (`4xx`), provider overload (`5xx`/timeout). Retry tối đa một lần chỉ với transient error nếu request còn trong Worker budget; không retry lỗi quota hoặc validation.
   - Khi `gateway_enabled`, truyền `gateway: { id, skipCache: true }` cho chat vì history/session cá nhân hóa làm cache không an toàn; embedding có thể bật deterministic caching nếu vận hành xác nhận cache policy. Giữ `skipCache` là thuộc tính policy có thể đổi, không hard-code cache TTL dài.
   - Thay `getAiGatewayConfig()` riêng cho website chat/embedding bằng `resolveWorkersAiPlan()`; giữ module cũ cho feature khác. Tránh mở rộng `ai-client.ts` đa provider thêm nhánh binding nếu wrapper Workers AI làm logic rõ ràng hơn.

4. **Cài quota, budget, rate limit và sources-only fallback.**
   - Thêm `src/lib/ai-policy.ts`/`ai-budget.ts` để atomically-or-conservatively resolve plan từ D1 usage snapshot. Vì D1 read-then-write không bảo đảm quota strict khi concurrent, reserve quota/budget trước inference bằng KV counter per UTC day (key gồm global/feature/tier), TTL đến `00:05 UTC` kế tiếp; reconcile D1 log sau response.
   - KV keys không chứa raw IP: dùng hash HMAC/salted digest stable của `CF-Connecting-IP`; key IP/phút, key session/ngày. Session ID server-generated đã tồn tại qua `website_chat_session`; chỉ rate-limit anonymous với session quota theo quyết định.
   - Admin cấu hình: request/IP/phút, request/session/ngày, message max chars, output max tokens, free neuron reserve, paid global cap, paid chat cap, paid embedding cap. Validate số nguyên/decimal range server-side.
   - Dự toán reserve trước call bằng max input context/output cap và catalog pricing; sau call điều chỉnh bằng actual usage khi có. Nếu không có actual neuron/cost, log estimate with flag. Không quảng bá số D1 này là billing Cloudflare authoritative.
   - Điều chỉnh `src/lib/ai-usage-log.ts` feature union để thêm `website_chat`; dùng query parameter binding thay vì SQL interpolation ở các query mới.
   - Tại `/api/website-chat`, kiểm tra rate limit trước D1/session side effects; chọn `sources_only` sau search. SSE metadata thêm `mode`, `retry_at`/`reason` thân thiện và `sources`; event `done` thống nhất.
   - Thông báo sources-only tiếng Việt rõ ràng, không nói về chi phí nội bộ: “Trợ lý AI đã dùng hết lượt phục vụ hôm nay. Đây là các nội dung liên quan để bạn tham khảo.”

5. **Di chuyển embedding và Vectorize an toàn.**
   - Trước khi tạo index, xác minh dimension chính xác của output `@cf/baai/bge-m3` từ model response trong environment thực tế/Cloudflare docs và ghi lại vào operational config. Không suy đoán dimension.
   - Tạo Vectorize index mới (ví dụ `dental-content-workers-ai`) với dimension/metric đúng của BGE-M3. Bổ sung binding mới, ví dụ `VECTORIZE_WORKERS_AI`, trong `wrangler.jsonc` và `Env`; giữ `VECTORIZE` cũ.
   - Sửa wrapper embedding để gọi `env.AI.run('@cf/baai/bge-m3', { text: [...] })`, normalize đúng vector output, validate exact dimension trước `upsert`.
   - Sửa `sync-website-content-vectors.ts` để nhận index target có allowlist (`legacy|workers_ai`), batch embed nếu API/model hỗ trợ, checkpoint `vector_synced_workers_ai`/`vector_id_workers_ai` riêng. Không reset `vector_synced` cũ.
   - Sửa `rag-website-search.ts` để selection `active_vector_index` quyết định binding/query. Trong migration/indexing, keyword search không bị gián đoạn. Nếu index mới lỗi, fallback keyword only và log lỗi mà không truy vấn vector cũ với vector dimension khác.
   - Admin action “Xây dựng lại kho tri thức” thành quy trình hiển thị rõ target, progress, số error, resume được. Chỉ admin mới có quyền qua middleware `/api/admin/*` hiện có.
   - Sau parity test, set `active_vector_index='workers_ai'`; giữ legacy index/binding một kỳ rollback đã quy định, sau đó xóa theo runbook riêng.

6. **Thay đổi màn hình Admin AI Settings và Usage.**
   - Refactor `src/pages/admin/ai-settings.astro` theo policy thực tế; hiện trang còn UI CRUD provider trong khi `api/admin/ai-providers.ts` đã deprecated và luôn từ chối POST. Loại bỏ/hide phần CRUD chết hoặc đánh dấu read-only để không tạo trải nghiệm hỏng.
   - Thêm section “Workers AI vận hành”:
     - Switch Chat RAG, phase selector, free chat model, embedding model, paid fallback model (chỉ selectable khi phase cho phép), AI Gateway id/switch, output cap.
     - Rate limits IP/session và free reserve; budget global/chat/embedding chỉ enabled/required trong paid phase.
     - Current UTC-day status: requests, estimated/actual neurons, free reserve còn lại, paid spend global/chat/embedding, current execution tier, active Vectorize index, time reset UTC.
     - Nút test model chat (không gửi dữ liệu user), test embedding dimension, rebuild/resume new index, cutover/rollback index có confirm dialog.
   - Cập nhật `src/pages/api/admin/ai-settings.ts`: chỉ admin (middleware đã chặn, nhưng route vẫn kiểm tra authenticated user) được đọc/ghi policy; validate model từ catalog và phase/budget compatibility; trả về policy không có secrets.
   - Mở rộng `admin/ai-usage.astro` và API để group/filter `website_chat`, execution tier, model, source-only count, quota/budget blocks, actual versus estimated spend. Không dùng usage dashboard cũ như nguồn billing duy nhất.

7. **Cập nhật Chat API/frontend giữ backward compatibility SSE.**
   - Chỉnh `src/pages/api/website-chat.ts` để vẫn tạo/lưu session và source attribution. Replace chat completion/follow-up generation behavior theo execution plan; follow-up suggestions phải dùng budget/plan riêng hoặc bị skip mặc định trong free phase để tránh double inference mỗi câu hỏi.
   - Khuyến nghị giai đoạn đầu: tắt `generateFollowupSuggestions()` hoặc thay bằng 3 suggestions có template dựa trên source/title, vì implementation hiện gọi một LLM lần thứ hai không được budget/usage tracking.
   - Cập nhật client chat hiển thị `sources_only` assistant card và source links; không cố parse markdown rỗng, không gọi lại tự động. Render `429` với thông báo/rate-limit countdown phù hợp.
   - Sửa nhãn `Dental Empire OS · Claude` tại `src/pages/ai-chat.astro` thành nhãn trung lập theo policy, ví dụ `Dental Empire AI`, để không tuyên bố provider sai.

8. **Operational rollout và rollback.**
   - Deploy migration + bindings + policy mặc định `website_chat_enabled=0`, `phase=free_only`, free reserve thấp hơn 10K, paid budgets unset/zero; tạo index mới trước public activation.
   - Dùng test model từ admin, chạy full re-embed vào index mới, benchmark với bộ prompt tiếng Việt đại diện cho sách/blog/resources: factual retrieval, câu hỏi follow-up ngắn, out-of-context, prompt injection, nội dung y tế, Unicode/dấu tiếng Việt.
   - So sánh groundedness/source relevance, latency p50/p95, answer length, error rate và neuron estimate with legacy baseline; dùng danh sách câu hỏi/expected sources versioned trong test fixture.
   - Activate index mới, sau đó bật Chat RAG free-only cho phần nhỏ traffic hoặc internal users. Theo dõi dashboard Workers AI/AI Gateway cùng usage D1 trong ít nhất một chu kỳ reset UTC trước khi mở rộng.
   - Paid phase chỉ có thể bật khi admin nhập model paid fallback và cả global/feature daily caps hợp lệ; không có “unlimited” fallback mặc định.
   - Rollback: tắt `website_chat_enabled` hoặc set `sources_only`; chuyển `active_vector_index` về `legacy` trước khi legacy binding/index bị xóa. Không rollback schema destructive.

## Validation

- Chạy `npm run astro -- check` và `npm run build` sau code changes.
- Test unit cho policy resolver: mỗi phase, reserve exhausted, feature/global cap reached, malformed configs, UTC reset boundary, actual vs estimate reconciliation.
- Test wrapper mock `env.AI`: valid chat/embedding outputs, invalid output, quota 429, transient 5xx one-retry, dimension mismatch.
- Test API integration:
  - anonymous/public chat within limit returns cited answer and logs `website_chat/free`;
  - IP/session rate limit returns 429 + `Retry-After`;
  - free-only exhausted returns sources-only with no `env.AI.run`;
  - free-then-paid selects paid model only when both budgets allow;
  - paid cap exhausted returns sources-only;
  - unauthenticated calls to all admin policy/index endpoints fail; non-admin fails through middleware;
  - secrets never appear in admin response/UI.
- Test reindex: new index receives only vectors with expected BGE-M3 dimension, resume does not duplicate, query returns expected source IDs after cutover, keyword fallback works with new index unavailable.
- Browser/Playwright smoke test desktop/mobile: normal SSE chat, source-only card, 429 state, admin phase/budget validation, index progress/resume/cutover.

## Rủi Ro Và Giảm Thiểu

- Cloudflare dashboard usage là nguồn charge authoritative; D1 usage/cost chỉ là control-plane estimate nếu inference response thiếu neurons/cost. Hiển thị nhãn rõ và theo dõi cả hai.
- Concurrent public requests có thể vượt reserve nếu chỉ check D1. KV reservation trước inference giảm race; reserve đặt thấp hơn quota thực và paid budget có safety margin.
- BGE-M3 dimension không được giả định. Tạo index mới sau verification, không upsert vector mới vào index cũ.
- `website-chat` hiện tự stream lại text sau khi chờ non-stream response, không phải true token streaming. Giữ hành vi trong đợt đầu để giảm scope; có thể chuyển true Workers AI streaming sau khi policy/logging ổn định.
- Prompt context lớn làm tăng input tokens. Giới hạn chunk/context length và output cap trong policy; Qwen context 32K là upper bound, không phải target request size.
- Follow-up generator là inference ẩn chưa được tracking. Tắt/template hóa ở phase free-only hoặc chạy qua cùng resolver/quota trước khi tái bật.

## Ngoài Phạm Vi

- Migrate AI Mentor, scanner analysis/plan, AI apps, Wizard sang Workers AI.
- Provider ngoài (OpenAI/Anthropic) cho paid fallback.
- Fine-tuning, Agents SDK, function calling, image/audio generation.
- Xóa legacy AI Gateway/legacy Vectorize ngay trong đợt đầu.
