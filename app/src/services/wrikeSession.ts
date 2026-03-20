import { invoke } from '@tauri-apps/api/core';
import { clearWrikeAuthIdentity } from './accountStorage';

export const clearWrikeSessionCookies = async (host?: string | null) => {
  try {
    await invoke('clear_wrike_session_cookies', {
      host: host || null,
    });
  } catch {
    // Ignore if the runtime does not expose the native command.
  }
};

export const logoutWrikeSession = async () => {
  const currentHost = localStorage.getItem('wrike_host');

  await clearWrikeSessionCookies(currentHost);
  clearWrikeAuthIdentity();

  window.dispatchEvent(new Event('storage'));
  window.dispatchEvent(new Event('auth-change'));
  window.location.hash = '#/login';
  window.location.reload();
};
