// Centralized branding configuration
// Single source of truth for app name and branding

export const BRANDING = {
  appName: import.meta.env.VITE_APP_NAME || 'TorqueShine Supply',
  appSlug: import.meta.env.VITE_APP_SLUG || 'torqueshine-supply',
  tagline: 'Premium Car Care Products',
} as const;
