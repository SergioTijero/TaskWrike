export const isTauriDesktopRuntime = () => window.location.hostname === 'tauri.localhost';

export const getWrikeRedirectUri = () => {
  if (isTauriDesktopRuntime()) {
    return `${window.location.origin}/oauth/callback`;
  }

  return import.meta.env.VITE_WRIKE_REDIRECT_URI || `${window.location.origin}/oauth/callback`;
};
