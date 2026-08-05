import {
  ENTITLEMENT_CONTENT_TYPES,
  type EntitlementContentType,
  type ProductEntitlementInput,
} from './entitlement-db';

export const PRODUCT_ENTITLEMENT_PRESETS = {
  book_full: [{ content_type: 'book', content_id: '*' }],
  ai_tools_all: [{ content_type: 'ai_app', content_id: '*' }],
  scanners_all: [{ content_type: 'scanner', content_id: '*' }],
  courses_all: [{ content_type: 'course', content_id: '*' }],
  blog_premium: [{ content_type: 'blog', content_id: '*' }],
  resources_premium: [{ content_type: 'resource', content_id: '*' }],
  consulting_guided: [{ content_type: 'service', content_id: 'consulting_guided' }],
  consulting_full: [{ content_type: 'service', content_id: 'consulting_full' }],
  implementation_full: [{ content_type: 'service', content_id: 'implementation_full' }],
  team_training: [{ content_type: 'service', content_id: 'team_training' }],
  clinic_audit: [{ content_type: 'service', content_id: 'clinic_audit' }],
  self_serve: [
    { content_type: 'book', content_id: '*' },
    { content_type: 'service', content_id: 'self_serve' },
  ],
  guided_3m: [
    { content_type: 'book', content_id: '*' },
    { content_type: 'ai_app', content_id: '*' },
    { content_type: 'scanner', content_id: '*' },
    { content_type: 'course', content_id: '*' },
    { content_type: 'blog', content_id: '*' },
    { content_type: 'resource', content_id: '*' },
    { content_type: 'service', content_id: 'guided_3m' },
  ],
  guided_6m: [
    { content_type: 'book', content_id: '*' },
    { content_type: 'ai_app', content_id: '*' },
    { content_type: 'scanner', content_id: '*' },
    { content_type: 'course', content_id: '*' },
    { content_type: 'blog', content_id: '*' },
    { content_type: 'resource', content_id: '*' },
    { content_type: 'service', content_id: 'guided_6m' },
  ],
  full_implementation: [
    { content_type: 'book', content_id: '*' },
    { content_type: 'ai_app', content_id: '*' },
    { content_type: 'scanner', content_id: '*' },
    { content_type: 'course', content_id: '*' },
    { content_type: 'blog', content_id: '*' },
    { content_type: 'resource', content_id: '*' },
    { content_type: 'service', content_id: 'full_implementation' },
  ],
} as const satisfies Record<string, readonly ProductEntitlementInput[]>;

export const PRODUCT_ENTITLEMENT_PRESET_LABELS = {
  book_full: 'Mở khóa các chương trả phí',
  ai_tools_all: 'Tất cả công cụ AI',
  scanners_all: 'Tất cả scanner',
  courses_all: 'Tất cả khóa học',
  blog_premium: 'Blog premium',
  resources_premium: 'Tài liệu premium',
  consulting_guided: 'Tư vấn đồng hành',
  consulting_full: 'Tư vấn chuyên sâu',
  implementation_full: 'Triển khai toàn diện',
  team_training: 'Đào tạo đội ngũ',
  clinic_audit: 'Audit phòng khám',
  self_serve: 'Gói tự triển khai',
  guided_3m: 'Gói đồng hành 3 tháng',
  guided_6m: 'Gói đồng hành 6 tháng',
  full_implementation: 'Gói triển khai toàn diện',
} as const satisfies Record<keyof typeof PRODUCT_ENTITLEMENT_PRESETS, string>;

export const CUSTOM_ENTITLEMENT_PRESET = 'custom';

type MappedEntitlementPreset = keyof typeof PRODUCT_ENTITLEMENT_PRESETS;
export type EntitlementPreset = MappedEntitlementPreset | typeof CUSTOM_ENTITLEMENT_PRESET;

export const ENTITLEMENT_PRESET_VALUES: readonly EntitlementPreset[] = [
  ...(Object.keys(PRODUCT_ENTITLEMENT_PRESETS) as MappedEntitlementPreset[]),
  CUSTOM_ENTITLEMENT_PRESET,
];

const entitlementContentTypes = new Set<string>(ENTITLEMENT_CONTENT_TYPES);
const entitlementPresetValues = new Set<string>(ENTITLEMENT_PRESET_VALUES);

export function isEntitlementPreset(value: unknown): value is EntitlementPreset {
  return typeof value === 'string' && entitlementPresetValues.has(value);
}

export function isServiceEntitlementPreset(value: EntitlementPreset): boolean {
  return value !== CUSTOM_ENTITLEMENT_PRESET
    && PRODUCT_ENTITLEMENT_PRESETS[value].some(
      (entitlement) => entitlement.content_type === 'service',
    );
}

export function parseEntitlements(value: unknown): ProductEntitlementInput[] | null {
  if (!Array.isArray(value)) return null;

  const entitlements = new Map<string, ProductEntitlementInput>();
  for (const entitlement of value) {
    if (!entitlement || typeof entitlement !== 'object') return null;

    const { content_type, content_id } = entitlement as Record<string, unknown>;
    if (
      typeof content_type !== 'string' ||
      !entitlementContentTypes.has(content_type) ||
      typeof content_id !== 'string' ||
      !content_id.trim()
    ) {
      return null;
    }

    const input = {
      content_type: content_type as EntitlementContentType,
      content_id: content_id.trim(),
    };
    entitlements.set(`${input.content_type}:${input.content_id}`, input);
  }

  return [...entitlements.values()];
}

export function resolveEntitlements(
  preset: EntitlementPreset | undefined,
  customEntitlements: ProductEntitlementInput[] | undefined,
): ProductEntitlementInput[] | null | undefined {
  if (!preset) return customEntitlements;
  if (preset === CUSTOM_ENTITLEMENT_PRESET) return customEntitlements ?? [];
  const presetEntitlements = PRODUCT_ENTITLEMENT_PRESETS[preset];
  if (customEntitlements !== undefined) {
    if (
      customEntitlements.length !== presetEntitlements.length ||
      customEntitlements.some((entitlement) => !presetEntitlements.some(
        (presetEntitlement) => presetEntitlement.content_type === entitlement.content_type
          && presetEntitlement.content_id === entitlement.content_id,
      ))
    ) {
      return null;
    }
  }
  return presetEntitlements.map((entitlement) => ({ ...entitlement }));
}

/** Kept for callers that still validate this field; product type has no semantics. */
export function getDefaultProductEntitlements(
  _type?: string,
  _referenceId?: string | null,
  _appId?: string | null,
): ProductEntitlementInput[] {
  return [];
}

export function hasSameEntitlements(
  left: readonly ProductEntitlementInput[],
  right: readonly ProductEntitlementInput[],
): boolean {
  if (left.length !== right.length) return false;
  const keys = new Set(left.map((entitlement) => `${entitlement.content_type}:${entitlement.content_id}`));
  return right.every((entitlement) => keys.has(`${entitlement.content_type}:${entitlement.content_id}`));
}
