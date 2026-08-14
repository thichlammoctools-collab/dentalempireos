export const RESOURCE_CATEGORIES = [
  { value: 'sops', label: 'Quy trình SOP' },
  { value: 'checklists', label: 'Checklist' },
  { value: 'excel', label: 'Bảng tính Excel' },
  { value: 'marketing', label: 'Marketing' },
] as const;

export type ResourceCategory = typeof RESOURCE_CATEGORIES[number]['value'];
export type ResourceStatus = 'draft' | 'published' | 'archived';
export type ResourceAccessMode = 'free' | 'credits';

export const RESOURCE_ASSET_EXTENSIONS = ['pdf', 'xlsx', 'docx', 'pptx', 'mp4'] as const;
export type ResourceAssetExtension = typeof RESOURCE_ASSET_EXTENSIONS[number];

export const RESOURCE_ASSET_MIME_TYPES: Record<ResourceAssetExtension, string> = {
  pdf: 'application/pdf',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  mp4: 'video/mp4',
};

export function isResourceCategory(value: unknown): value is ResourceCategory {
  return typeof value === 'string' && RESOURCE_CATEGORIES.some((category) => category.value === value);
}

export function isResourceStatus(value: unknown): value is ResourceStatus {
  return value === 'draft' || value === 'published' || value === 'archived';
}

export function isResourceAccessMode(value: unknown): value is ResourceAccessMode {
  return value === 'free' || value === 'credits';
}

export function isResourceAssetExtension(value: unknown): value is ResourceAssetExtension {
  return typeof value === 'string' && RESOURCE_ASSET_EXTENSIONS.includes(value as ResourceAssetExtension);
}
