// Utilidades de autenticación para proteger los dashboards

export interface AuthCredentials {
  username: string;
  password: string;
}

// Credenciales quemadas (las mismas para ambos dashboards)
export const ADMIN_CREDENTIALS: AuthCredentials = {
  username: 'admin',
  password: 'FB1218$'
};

// Claves de sessionStorage para cada dashboard
export const SESSION_KEYS = {
  salud: {
    authenticated: 'salud_authenticated',
    authTime: 'salud_auth_time'
  },
  comida: {
    authenticated: 'comida_authenticated',
    authTime: 'comida_auth_time'
  }
} as const;

export type DashboardType = 'salud' | 'comida';

/**
 * Verifica si el usuario está autenticado para un dashboard específico
 */
export function isAuthenticated(dashboardType: DashboardType): boolean {
  if (typeof window === 'undefined') return false;

  const isAuthenticated = sessionStorage.getItem(SESSION_KEYS[dashboardType].authenticated);
  return isAuthenticated === 'true';
}

/**
 * Verifica si la sesión ha expirado (opcional - 24 horas por defecto)
 */
export function isSessionExpired(dashboardType: DashboardType, maxHours: number = 24): boolean {
  if (typeof window === 'undefined') return true;

  const authTime = sessionStorage.getItem(SESSION_KEYS[dashboardType].authTime);
  if (!authTime) return true;

  const authDate = new Date(authTime);
  const now = new Date();
  const diffHours = (now.getTime() - authDate.getTime()) / (1000 * 60 * 60);

  return diffHours > maxHours;
}

/**
 * Cierra la sesión de un dashboard específico
 */
export function logout(dashboardType: DashboardType): void {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem(SESSION_KEYS[dashboardType].authenticated);
  sessionStorage.removeItem(SESSION_KEYS[dashboardType].authTime);
}

/**
 * Inicia sesión en un dashboard específico
 */
export function login(dashboardType: DashboardType): void {
  if (typeof window === 'undefined') return;

  sessionStorage.setItem(SESSION_KEYS[dashboardType].authenticated, 'true');
  sessionStorage.setItem(SESSION_KEYS[dashboardType].authTime, new Date().toISOString());
}

/**
 * Valida credenciales
 */
export function validateCredentials(username: string, password: string): boolean {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
}

/**
 * Obtiene la URL de login para un dashboard específico
 */
export function getLoginUrl(dashboardType: DashboardType): string {
  return `/login/${dashboardType}`;
}

/**
 * Obtiene la URL del dashboard para un dashboard específico
 */
export function getDashboardUrl(dashboardType: DashboardType): string {
  return dashboardType === 'salud' ? '/dashboard' : `/dashboard/${dashboardType}`;
}

/**
 * Hook para redirección de autenticación (client-side)
 */
export function useAuthRedirect(dashboardType: DashboardType) {
  if (typeof window !== 'undefined' && !isAuthenticated(dashboardType)) {
    window.location.href = getLoginUrl(dashboardType);
    return false;
  }
  return true;
}