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

  getUserRole: (): string | null => {
    return localStorage.getItem('userRole');
  },

  setUserRole: (role: string): void => {
    localStorage.setItem('userRole', role);
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

/**
 * Normaliza un rol a formato estándar
 * Maneja múltiples formatos de la BD: "%Admin%", "admin", "!Entrenador!", "entrenador", "Usuario"
 * @param role Rol original (puede ser null o undefined)
 * @returns Rol normalizado: "admin" | "entrenador" | "usuario"
 */
export const normalizeRole = (role: string | null | undefined): 'admin' | 'entrenador' | 'usuario' => {
  if (!role) return 'usuario';
  
  const normalized = role.toLowerCase().trim().replace(/[%!]/g, '');
  
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('entrenador')) return 'entrenador';
  
  return 'usuario';
};

/**
 * Obtiene el rol normalizado del usuario
 * @returns Rol normalizado: "admin" | "entrenador" | "usuario"
 */
export const getNormalizedUserRole = (): 'admin' | 'entrenador' | 'usuario' => {
  const role = authUtils.getUserRole();
  return normalizeRole(role);
};

/**
 * Verifica si el usuario es admin
 * @returns true si el rol es admin
 */
export const isAdmin = (): boolean => {
  return getNormalizedUserRole() === 'admin';
};

/**
 * Verifica si el usuario es entrenador
 * @returns true si el rol es entrenador o admin
 */
export const isTrainer = (): boolean => {
  const role = getNormalizedUserRole();
  return role === 'entrenador' || role === 'admin';
};

/**
 * Obtiene display text del rol con emoji
 * @param role Rol original
 * @returns String formateado con emoji: "👑 Admin", "💪 Entrenador", "Usuario"
 */
export const getRoleDisplayText = (role: string | null | undefined): string => {
  const normalized = normalizeRole(role);
  
  switch (normalized) {
    case 'admin':
      return '👑 Admin';
    case 'entrenador':
      return '💪 Entrenador';
    default:
      return 'Usuario';
  }
};

/**
 * Obtiene el color del rol para la UI
 * @param role Rol original
 * @returns Color en formato hex
 */
export const getRoleColor = (role: string | null | undefined): string => {
  const normalized = normalizeRole(role);
  
  switch (normalized) {
    case 'admin':
      return '#FFD700';  // Oro para admin
    case 'entrenador':
      return '#667eea';  // Azul para entrenador
    default:
      return '#666';     // Gris para usuario
  }
};