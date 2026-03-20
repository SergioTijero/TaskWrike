const ACCOUNT_KEY_STORAGE = 'wrike_account_key';
const ACCOUNT_ID_STORAGE = 'wrike_account_id';
const USER_ID_STORAGE = 'wrike_user_id';

export const LEGACY_BOARD_STATE_KEY = 'wrike_board_state';
export const LEGACY_NOTES_KEY = 'wrike_kanban_notes';

export const buildWrikeAccountKey = (host: string, accountId: string, userId: string) => `${host}:${accountId}:${userId}`;

export const setWrikeAccountIdentity = (host: string, accountId: string, userId: string) => {
  const accountKey = buildWrikeAccountKey(host, accountId, userId);
  localStorage.setItem('wrike_host', host);
  localStorage.setItem(ACCOUNT_ID_STORAGE, accountId);
  localStorage.setItem(USER_ID_STORAGE, userId);
  localStorage.setItem(ACCOUNT_KEY_STORAGE, accountKey);
  return accountKey;
};

export const getWrikeAccountKey = () => localStorage.getItem(ACCOUNT_KEY_STORAGE);

export const getScopedBoardStateKey = (accountKey: string) => `wrike_board_state:${accountKey}`;

export const getScopedNotesKey = (accountKey: string) => `wrike_kanban_notes:${accountKey}`;

export const clearWrikeAuthIdentity = () => {
  localStorage.removeItem('wrike_access_token');
  localStorage.removeItem('wrike_refresh_token');
  localStorage.removeItem('wrike_host');
  localStorage.removeItem(ACCOUNT_ID_STORAGE);
  localStorage.removeItem(USER_ID_STORAGE);
  localStorage.removeItem(ACCOUNT_KEY_STORAGE);
};

export const persistWrikeAccountIdentity = async (accessToken: string, host: string) => {
  const response = await fetch(`https://${host}/api/v4/contacts?me=true`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error('No pude obtener la identidad de la cuenta de Wrike.');
  }

  const data = await response.json();
  const contact = data?.data?.[0];
  const userId = contact?.id;
  const accountId = contact?.profiles?.[0]?.accountId;

  if (!userId || !accountId) {
    throw new Error('Wrike no devolvio un usuario valido para esta sesion.');
  }

  return {
    host,
    accountId,
    userId,
    accountKey: setWrikeAccountIdentity(host, accountId, userId),
  };
};

export const ensureWrikeAccountIdentity = async () => {
  const existingKey = getWrikeAccountKey();
  if (existingKey) {
    return existingKey;
  }

  const accessToken = localStorage.getItem('wrike_access_token');
  const host = localStorage.getItem('wrike_host');

  if (!accessToken || !host) {
    return null;
  }

  const identity = await persistWrikeAccountIdentity(accessToken, host);
  return identity.accountKey;
};
