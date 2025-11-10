export const authUtils = {
  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('token', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('token');
  },

  getUserId: (): string | null => {
    return localStorage.getItem('userId');
  },

  setUserId: (userId: string): void => {
    localStorage.setItem('userId', userId);
  },

  getUsername: (): string | null => {
    return localStorage.getItem('username');
  },

  setUsername: (username: string): void => {
    localStorage.setItem('username', username);
  },

  getLastEmail: (): string | null => {
    return localStorage.getItem('lastEmail');
  },

  setLastEmail: (email: string): void => {
    localStorage.setItem('lastEmail', email);
  },

  getPreviousAccounts: (): string[] => {
    const accounts = localStorage.getItem('prevAccounts');
    return accounts ? JSON.parse(accounts) : [];
  },

  setPreviousAccounts: (accounts: string[]): void => {
    localStorage.setItem('prevAccounts', JSON.stringify(accounts));
  },

  getProfileImageUrl: (): string | null => {
    return localStorage.getItem('profileImageUrl');
  },

  setProfileImageUrl: (url: string): void => {
    localStorage.setItem('profileImageUrl', url);
  },

  clearAll: (): void => {
    localStorage.clear();
  },

  isAuthenticated: (): boolean => {
    return !!authUtils.getToken();
  },
};