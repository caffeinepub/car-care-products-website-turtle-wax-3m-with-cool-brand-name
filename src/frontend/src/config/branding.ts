// Centralized branding configuration
// Single source of truth for app name and branding

export const BRANDING = {
  appName: import.meta.env.VITE_APP_NAME || 'Urban Wax Studio',
  appSlug: import.meta.env.VITE_APP_SLUG || 'urban-wax-studio',
  tagline: 'Premium Car Care Products',
} as const;

