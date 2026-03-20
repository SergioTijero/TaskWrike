export const getWrikeRedirectUri = () => {
  return `${window.location.origin}/`;
};

export const getWrikeAuthorizeUrl = (clientId: string) => {
  return `https://login.wrike.com/oauth2/authorize/v4?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(getWrikeRedirectUri())}`;
};
