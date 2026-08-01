export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'theme';
const THEME_CHANGE_EVENT = 'deos-theme-change';

function readStoredPreference(): ThemePreference {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  } catch {
    return 'system';
  }
}

export function getSystemTheme(): ResolvedTheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getThemePreference(): ThemePreference {
  return readStoredPreference();
}

export function resolveTheme(preference = readStoredPreference()): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference;
}

export function applyTheme(theme: ResolvedTheme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;

  const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (themeColor) themeColor.content = theme === 'dark' ? '#121317' : '#f8f9fc';

  document.dispatchEvent(new CustomEvent(THEME_CHANGE_EVENT, {
    detail: { theme, preference: readStoredPreference() },
  }));
}

export function setThemePreference(preference: ThemePreference): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // The resolved theme still applies when storage is unavailable.
  }
  applyTheme(resolveTheme(preference));
}

export function toggleTheme(): ResolvedTheme {
  const nextTheme: ResolvedTheme = resolveTheme() === 'dark' ? 'light' : 'dark';
  setThemePreference(nextTheme);
  return nextTheme;
}

export function onThemeChange(listener: (theme: ResolvedTheme) => void): () => void {
  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<{ theme: ResolvedTheme }>;
    listener(customEvent.detail.theme);
  };
  document.addEventListener(THEME_CHANGE_EVENT, handler);
  return () => document.removeEventListener(THEME_CHANGE_EVENT, handler);
}

export function initializeTheme(): ResolvedTheme {
  const preference = readStoredPreference();
  const theme = resolveTheme(preference);
  applyTheme(theme);

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const handleSystemThemeChange = () => {
    if (readStoredPreference() === 'system') applyTheme(getSystemTheme());
  };
  mediaQuery.addEventListener?.('change', handleSystemThemeChange);

  return theme;
}

export function updateThemeToggle(
  button: HTMLElement | null,
  knob: HTMLElement | null = null,
  icon: HTMLElement | null = null,
  label: HTMLElement | null = null,
): void {
  const isDark = resolveTheme() === 'dark';
  button?.setAttribute('aria-checked', String(isDark));
  button?.setAttribute('aria-label', isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối');
  if (knob) knob.style.transform = isDark ? 'translateX(16px)' : 'translateX(0)';
  if (icon) icon.textContent = isDark ? 'dark_mode' : 'light_mode';
  if (label) label.textContent = isDark ? 'Chế độ tối' : 'Chế độ sáng';
}
