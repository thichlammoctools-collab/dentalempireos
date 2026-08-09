# Kế hoạch chuyển toàn bộ commerce sang Credits

## Mục tiêu và quyết định đã chốt

Thay hoàn toàn `product → order → access → product_entitlement` bằng mô hình Credits chung cho từng tài khoản `user`.

- **Ví:** một currency Credits chung, user-owned, số nguyên, không hết hạn và không cho số dư âm.
- **Nạp:** admin tạo gói nạp cố định (giá VND, Credits, Credits bonus); đơn hàng snapshot giá và số Credits tại lúc checkout.
- **Chào mừng:** chỉ user đăng ký sau go-live nhận 50 Credits, exactly-once.
- **Admin:** mọi admin được tăng/giảm Credits với lý do bắt buộc và audit immutable.
- **Scanner:** giá Credit riêng cho mỗi scanner; một Scan đầy đủ gồm submit, điểm số, 1 AI analysis, 1 AI plan và PDF; xem lại miễn phí.
- **Books/Blog:** mỗi loại là một quyền toàn bộ nội dung Premium riêng; 1 Credit = 1 ngày; gia hạn nối sau hạn hiện tại.
- **Courses:** giá Credit riêng theo khóa, mở vĩnh viễn theo user.
- **Resources:** 1 Credit mở quyền tải vĩnh viễn cho một tài liệu; tải lại miễn phí.
- **AI:** admin cấu hình tỷ lệ token/Credit theo từng tool/model; trừ Credits nguyên, làm tròn lên theo từng request; reserve trước, settle theo token provider trả về.
- **Consultation:** chỉ một dịch vụ “tư vấn tác giả”; admin cấu hình phút/Credit; user gửi yêu cầu theo block 30 phút, admin tạo lịch và reserve Credits, sau buổi settle theo thời lượng thực tế; hủy/từ chối/quá hạn tự release toàn bộ reservation.
- **Challenges:** chỉ tự xác minh theo Scanner và khóa học; cấp thưởng idempotent.
- **Legacy:** không cần migration/bảo toàn dữ liệu commerce/access/entitlement cũ. Thay hoàn toàn catalog Product/Entitlement và trang gói cũ.

## Kiến trúc đích

Tách ba concern rõ ràng:

1. **Credit commerce:** gói nạp, checkout PayOS/manual transfer, order payment và grant Credits.
2. **Credit accounting:** ví + ledger bất biến + reservation/consumption; không dùng `access.credits/scans_used`.
3. **Quyền nội dung:** grants trực tiếp theo user (book/blog expiry, course/resource permanent, scanner result ownership). Không suy quyền từ catalog hiện tại tại thời điểm đọc.

### Invariants bắt buộc

- Ledger không cập nhật/xóa amount; sửa sai dùng reversal/adjustment entry mới.
- Mỗi đơn paid grant Credits một lần qua unique source/idempotency key.
- Mỗi hành động có phí consume một lần qua unique business-action key.
- Không số dư khả dụng âm: reserve/debit là conditional atomic update hoặc D1 batch transaction có predicate balance.
- Reservation có trạng thái terminal rõ ràng: `reserved`, `settled`, `released`, `expired`.
- Bảng giá và số Credit thực tế được snapshot vào consumption/order; sửa admin pricing không sửa lịch sử.
- Idempotency key bắt buộc cho Scanner submit, AI request, checkout fulfillment và challenge reward.
- Authorization khác accounting: unlock kiểm tra grant; affordability kiểm tra wallet; anti-abuse quota độc lập.

## Schema và migration

### 1. Reset legacy commerce (được user phê duyệt)

Tạo migration cutover có guard rõ ràng cho môi trường triển khai để xóa/disable dữ liệu và catalog legacy:

- Xóa records cũ từ `upgrade`, `access`, `order`, `payos_webhook_log`, `product_entitlement`, `product_scanner` nếu còn historical schema/table.
- Xóa/retire catalog `product` và các API/UI dùng product package.
- Không xóa `user`, nội dung books/blog/courses/resources, scanner definitions, scanner results/history trừ khi có yêu cầu riêng.
- Không tái sử dụng migration `0075_cleanup_legacy_order_data.sql`; tạo migration mới có schema mục tiêu rõ ràng và chạy thử trên database snapshot/local trước remote.

### 2. Tạo credit accounting

Tạo migrations và typed DB module (`src/lib/credit-db.ts`) cho:

- `credit_account`: `user_id` unique, `available_credits`, `reserved_credits`, timestamps. Balance là projection tối ưu truy vấn.
- `credit_ledger_entry`: immutable; `id`, `account_id`, `kind` (`welcome_grant`, `purchase_grant`, `challenge_grant`, `admin_adjustment`, `reservation`, `settlement`, `release`, `refund`, `reversal`), signed/typed amount, `source_type`, `source_id`, `idempotency_key`, `actor_user_id`, `reason`, JSON metadata, timestamp; unique idempotency key per account.
- `credit_reservation`: `account_id`, feature/reference, reserved Credits, status, source/request key, expiry/release metadata; unique business action reference.
- `credit_consumption`: settled action record, price snapshot, token/minute/quantity snapshot, `reservation_id`, domain reference; unique `(feature_type, business_object_id, charge_type)`.
- `credit_package`: sellable gói nạp, `name`, `price`, `credit_amount`, `bonus_credits`, `is_active`, ordering, timestamps.
- `credit_order`: checkout/payment snapshot tied to credit package; status lifecycle, PayOS/manual identifiers, total Credits to grant, price snapshot, idempotency/payment fulfillment fields.
- `credit_pricing_rule`: active rule/version per feature: scanner ID, content category, course ID, resource ID, AI tool/model, consultation; amount/rate and effective timestamps.
- User grants: generic `user_content_grant` (`user_id`, `content_type`, `content_id`, `granted_at`, `expires_at`, `credit_consumption_id`) for book/blog/course/resource; unique/upsert semantics by user/content.
- `consultation_booking`: user, requested/reserved block count, scheduled datetime/admin metadata, status, reservation, settled consumption, actual blocks/minutes and notes.
- `credit_challenge`: definition (event type scanner/course, target ID/wildcard, reward, active, one-time rule).
- `credit_challenge_reward`: user/challenge/event reference/ledger entry, unique to prevent duplicate reward.

Add indexes for balance history, user grants, pricing lookup, active packages, order lookup, idempotency, feature consumption and admin audit.

### 3. Replace legacy type definitions and callers

- Remove `Product`, `Access`, `ProductEntitlement` usage for commerce and old scanner credits from `src/lib/payos-db.ts`, `src/lib/entitlement-db.ts`, `src/lib/entitlement-check.ts`.
- Deprecate/remove `access.credits`, `access.scans_used`, `selected_scanner_id`, `upgrade`, `product.credits`, `duration_days`, `reference_id`, `app_id` along with their API contracts.
- Preserve and reuse scanner history/result identities, but add references to `credit_consumption` for traceability.

## Backend implementation sequence

### 4. Credit account operations

Implement focused server-side primitives in `credit-db.ts`:

- `ensureCreditAccount(userId)`.
- `getCreditBalance(userId)` and paginated ledger history.
- `grantCredits` with idempotency, source metadata and actor/reason audit.
- `reserveCredits` using atomic available-balance predicate; move available → reserved.
- `settleReservation` using idempotency; decrease reserved and append consumption/settlement ledger.
- `releaseReservation` using idempotency; move reserved → available and append release ledger.
- `adjustCredits` for admin with non-negative available-balance constraint.
- A reconciliation query/assertion that account projection equals ledger sum and no terminal reservation remains reserved.

All public and admin route handlers must call these methods; no direct balance mutation in route code.

### 5. Replace payment fulfillment with credit packages

Refactor existing PayOS/manual flows:

- Replace product checkout input with active `credit_package_id`.
- Server reads package and snapshots VND price and total Credits (`credit_amount + bonus_credits`) into `credit_order`.
- Keep pending checkout reuse and payment identifiers, but bind them to the credit order.
- Webhook, return reconciliation and manual admin confirmation use a compare-and-set claim (`pending → processing`) before grant.
- Winner calls `grantCredits` with source `credit_order:{id}` and deterministic idempotency key, then marks paid/fulfilled.
- Retries/replays return the original order/grant without a second balance change.
- Replace `check-access` behavior with payment order status/check API.

### 6. Welcome Credits and admin adjustments

- Hook successful Better Auth user creation to `ensureCreditAccount` + a 50-Credit `welcome_grant` keyed by `welcome:{userId}`.
- Add admin APIs to get user wallet/history and submit positive/negative adjustment with mandatory reason.
- Enforce no negative available balance and audit actor/admin ID.
- Remove old “grant product manually” functionality.

### 7. Scanner paid run

Refactor `POST /api/scanner/submit`:

- Keep free-scanner/free quota policy separately.
- For paid scanner, load active pricing rule for scanner ID and require authenticated user.
- Require/derive an idempotency key; reserve the scanner’s fixed Credit cost before creating result.
- Create scanner response/history and a one-to-one `credit_consumption` in the same D1 business operation/recoverable state machine.
- Set the response as a paid full-run entitlement: it includes one AI analysis, one AI plan and PDF.
- AI analysis/plan endpoints validate response ownership and full-run entitlement; they do not charge scanner Credits again.
- Add recovery for a reservation whose response generation failed: release automatically and return consistent result on retry.
- Trigger eligible Scanner challenge evaluation after completion; grant reward exactly once.

### 8. AI metering

Build a unified AI execution/billing wrapper used by AI app run/chat, AI Mentor and any paid scanner AI action if separately priced in future:

- Load pricing rule by AI tool + selected provider/model.
- Determine maximum charge from server-enforced token caps; reserve `ceil(maxTokens / tokensPerCredit)` before provider call.
- Capture authoritative provider usage tokens when available; persist raw/input/output/total usage in `ai_usage_log` plus consumption reference.
- Settle `ceil(actualTotalTokens / tokensPerCredit)`; release unused reservation.
- On provider failure before a persisted useful result, release reservation. If browser stream disconnects but server completes/saves result, settle it once.
- Keep `ai_quota_counter` as anti-abuse/rate limit only, not a balance source.
- Reject client-controlled model/token cost fields; all pricing and caps server-owned.

### 9. Content redemption and gates

Implement credit redemption APIs and grants:

- **Books:** endpoint accepts requested days, `Credits = days`; reserve/settle, upsert `user_content_grant(book, '*')`; extend from `max(now, currentExpiry)`.
- **Blog:** same, distinct `user_content_grant(blog, '*')`.
- **Courses:** price rule per course; settle then create permanent `user_content_grant(course, courseId)`; idempotently return existing unlock without charging twice.
- **Resources:** price rule is 1 Credit; first protected download obtains permanent `user_content_grant(resource, resourceId)` after consume. Later downloads validate grant and cost zero.
- Rewrite `canAccessBook`, `canAccessBlogPost`, `canAccessCourse`, `canAccessResource` to use the new user grants rather than product entitlement/access.
- Replace payment package CTA with pricing/balance/redemption CTA and a link to top-up Credits when insufficient.
- Route all premium resources through protected R2/media download handler; migrate/remove external direct URLs for monetized assets so per-first-download charging is enforceable.

### 10. Consultation workflow

Replace service product/consultation lead coupling with authenticated consultation bookings:

- Public/user UI explains “tư vấn từ tác giả” and selected number of 30-minute blocks.
- Resolve rule `consultation_minutes_per_credit`; compute reserve Credits using configured conversion and block count.
- Create `consultation_booking` + reservation; user can view pending/scheduled status.
- Admin creates/schedules booking, can decline/cancel; decline/cancel/expiry releases all reserved Credits idempotently.
- After completion, admin enters actual 30-minute blocks; settle required Credits, release the difference; enforce actual settlement cannot exceed reserved amount without a new explicit reservation/adjustment flow.
- Tie booking context to relevant scanner result IDs (optional selection) for author review; preserve service notes/audit.
- Do not implement calendar availability/external calendar integration in phase 1.

### 11. Challenges

- Admin CRUD for Scanner/course challenge definitions, reward Credits, active state and target scope.
- Emit/evaluate domain events for completed paid/free Scanner runs and completed course/lesson conditions available in existing progress model.
- Write unique challenge reward row before/with ledger grant keyed by challenge+user+event, ensuring retries do not reward twice.
- Add account history labels for challenge rewards.

## UI replacement

### 12. Member-facing UI

- Global header/account: show Credit balance and link to wallet/top-up.
- New wallet page: available/reserved balance, top-up packages, payment history, ledger/usage history and pending consultation reservations.
- Replace `PaymentButton.astro` product access semantics with a credit-package checkout component and content redemption controls.
- Scanner listing/detail/result: price in Credits per scanner, balance/insufficient state, full-run inclusions and result status.
- Book/blog: time-duration picker, total Credit quote, current expiry and extend CTA.
- Course detail: one-time Credit price/unlocked state.
- Resources: first-download 1-Credit confirmation; owned state/download-again button; remove old package cards.
- AI pages: show token/Credit pricing, reservation/usage state and insufficient-credit top-up CTA.
- Replace `/account/subscriptions` product cards with wallet/credit history or redirect to wallet.
- Remove “nâng cấp gói”, product package and entitlement terminology from all public UI.
- Replace `/dich-vu` with the single author-consultation page and booking/request flow.

### 13. Admin UI

- Replace `/admin/products` with credit package management (price/amount/bonus/active) and separate pricing-rule management by feature/content/model.
- Admin scanner details: fixed Credits per full run.
- Admin course/resource/book/blog controls: corresponding redemption pricing/rules.
- AI admin: token-per-credit and hard token caps per tool/model, usage/settlement visibility.
- Admin users: wallet balance, immutable ledger, manual increase/decrease with mandatory reason; no legacy product grant.
- Admin payment/orders: top-up orders with package and credit grant status, idempotency/payment audit.
- Admin consultation: queue, schedule, reservation status, actual blocks and settlement/release.
- Admin challenges: Scanner/course rule editor and reward history.
- Remove product entitlement, legacy service presets, scanner mapping, package upgrade and access management screens/routes/nav entries.

## Testing and validation

### Automated tests to add

- Credit DB unit/integration tests: grant exactly-once, reservation/debit/release, no negative balance, adjustment audit, ledger/projection reconciliation.
- Payment tests: PayOS webhook replay, return + webhook race, manual confirm concurrent retries, package snapshot after admin edits.
- Scanner tests: last-credit concurrency, duplicate idempotency request, failed response release, full-run reports/PDF no second charge.
- AI tests: max reserve, actual token settlement rounded up, provider failure release, retry/stream completion exactly-once.
- Content tests: book/blog extension preserves time, permanent course/resource unlock does not double charge, protected resource re-download is free.
- Consultation tests: reserve, cancel/decline release, actual-block settlement, release difference, cannot overspend.
- Challenge tests: Scanner/course event rewarded once despite retry.
- Authorization tests: old product entitlement/access does not unlock post-cutover; only new user grants do.

### Migration and rollout checks

- Run migrations against a local production-like snapshot; verify schema and FK integrity.
- Verify all legacy product/entitlement UI/API routes are removed or return deprecation-safe errors.
- Fresh sign-up receives exactly 50 Credits; existing account does not receive backfill.
- Confirm `npm run build`, targeted route/API tests and end-to-end checkout/manual payment flows.
- Reconcile credit account projections against ledger after every test scenario.
- Add monitoring/logs for failed reservations, stuck consultation reservations, payment fulfillment conflicts and AI settlement mismatch.

## Risks and explicit non-goals

- Do not rely on existing `access.credits/scans_used`; it has TOCTOU/double-spend risks and no immutable audit trail.
- Do not charge each resource HTTP request: charge first unlock only and serve subsequent downloads through authorization.
- Do not charge AI from client estimates; provider usage plus server caps is authoritative.
- No team/clinic shared wallet, credit transfer, credit expiry, external calendar scheduling, file-evidence challenges, multi-admin approval workflow or backward compatibility for legacy purchases in this scope.
- Preserve separate free quota/rate limiting for abuse prevention even when a member has Credits.
