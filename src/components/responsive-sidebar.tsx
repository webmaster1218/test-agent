'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import {
  LayoutDashboard,
  MessageSquare,
  Settings,
  Sparkles,
  ChevronRight,
  LogOut,
  Utensils,
  ChefHat,
  Cookie,
  Cog,
  Menu,
  X
} from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { logout, DashboardType } from '@/lib/auth';
import { Button } from '@/components/ui/button';

// Componente de item de navegación premium responsive
const NavItem = ({
  href,
  icon: Icon,
  title,
  isActive,
  agentColors,
  onClick
}: {
  href: string;
  icon: any;
  title: string;
  isActive: boolean;
  agentColors: { primary: string; secondary: string; dark: string };
  onClick?: () => void;
}) => {
  const getDynamicStyles = () => {
    if (isActive) {
      return {
        background: `linear-gradient(to right, ${agentColors.primary}20, ${agentColors.primary}10)`,
        borderLeft: `4px solid ${agentColors.primary}`,
        boxShadow: `0 10px 25px -5px ${agentColors.primary}15`,
      };
    } else {
      return {
        background: 'transparent',
      };
    }
  };

  const getIconStyles = () => {
    if (isActive) {
      return {
        background: `linear-gradient(to bottom right, ${agentColors.primary}, ${agentColors.secondary})`,
        boxShadow: `0 10px 25px -5px ${agentColors.primary}30`,
      };
    } else {
      return {
        backgroundColor: `${agentColors.primary}10`,
      };
    }
  };

  return (
    <Link
      href={href}
      title={title}
      className={cn(
        "relative group w-full h-12 rounded-xl transition-all duration-300 overflow-hidden flex items-center px-4 hover:bg-gradient-to-r hover:from-black/5 hover:to-transparent",
        onClick && "cursor-pointer"
      )}
      style={getDynamicStyles()}
      onClick={onClick}
    >
      {/* Efecto de fondo animado */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
        style={{
          background: `linear-gradient(to right, transparent, ${agentColors.primary}10, transparent)`,
          transform: 'translateX(-100%)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(-100%)';
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg transition-all duration-300 group-hover:scale-110"
            style={{
              ...getIconStyles(),
              color: isActive ? 'white' : agentColors.primary,
            }}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-sm font-semibold transition-all duration-300"
              style={{
                color: isActive ? agentColors.primary : 'inherit',
              }}
            >
              {title}
            </span>
            {/* Indicador de estado */}
            {isActive && (
              <span style={{ color: `${agentColors.primary}B3`, fontSize: '8px' }} className="font-medium uppercase tracking-wider">
                Activo
              </span>
            )}
          </div>
        </div>

        {/* Flecha indicadora */}
        <ChevronRight
          className="h-4 w-4 transition-all duration-300"
          style={{
            color: isActive ? agentColors.primary : '#9CA3AF',
            opacity: isActive ? 1 : 0,
            transform: isActive ? 'translateX(0)' : 'translateX(8px)',
          }}
        />
      </div>
    </Link>
  );
};

export default function ResponsiveSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);

    // Añadir estilos CSS para animación
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(-100%); }
        to { transform: translateX(0); }
      }
      .slide-in {
        animation: slideIn 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(style);

    // Inicializar el tema desde localStorage si existe
    const savedTheme = localStorage.getItem('marcos-chat-theme');
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }

    return () => {
      document.head.removeChild(style);
    };
  }, [setTheme]);

  const handleThemeToggle = () => {
    if (!mounted) return;

    const actualTheme = theme ||
                      (document.documentElement.classList.contains('dark') ? 'dark' : 'light') ||
                      'light';

    const newTheme = actualTheme === "light" ? "dark" : "light";

    setTheme(newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Determinar si estamos en rutas de comida o salud
  const isComidaRoute = pathname.includes('/comida');
  const agentType = isComidaRoute ? 'comida' : 'salud';

  // Helper para obtener el color según el agente
  const getAgentColor = (property: 'primary' | 'secondary' | 'dark' = 'primary') => {
    if (isComidaRoute) {
      switch(property) {
        case 'primary': return '#FF6B35';
        case 'secondary': return '#FF4500';
        case 'dark': return '#E85D2B';
        default: return '#FF6B35';
      }
    } else {
      switch(property) {
        case 'primary': return '#2C8082';
        case 'secondary': return '#1f5a5c';
        case 'dark': return '#236667';
        default: return '#2C8082';
      }
    }
  };

  const menuItems = [
    {
      href: isComidaRoute ? '/dashboard/comida' : '/dashboard',
      icon: isComidaRoute ? Utensils : LayoutDashboard,
      title: 'Dashboard'
    },
    {
      href: isComidaRoute ? '/chat/comida' : '/chat',
      icon: MessageSquare,
      title: 'Chat'
    },
    {
      href: isComidaRoute ? '/settings/comida' : '/settings/salud',
      icon: Cog,
      title: 'Ajustes'
    },
  ];

  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    const dashboardType: DashboardType = isComidaRoute ? 'comida' : 'salud';
    logout(dashboardType);
    window.location.href = '/';
  };

  // Sidebar Desktop
  const DesktopSidebar = () => (
    <div
      className="w-64 border-r bg-background/50 backdrop-blur-sm sticky top-0 h-screen hidden md:block"
      style={{ borderColor: `${getAgentColor()}20` }}
    >
      <div className="flex flex-col h-full">
        {/* Header del sidebar */}
        <div className="relative h-36 flex flex-col items-center justify-center p-4">
          {/* Fondo con gradiente */}
          <div
            className="absolute inset-0 rounded-t-xl"
            style={{
              background: `linear-gradient(to bottom, ${getAgentColor()}10, transparent, transparent)`
            }}
          />

          {/* Logo con efectos */}
          <div className="relative group">
            <div
              className="absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(to right, ${getAgentColor()}20, ${getAgentColor('secondary')}20)`
              }}
            />
            <Image
              src={isComidaRoute ? "/images/logo-emiliano.png" : "/images/logo-vivefelizsindolor-azul.png"}
              alt={isComidaRoute ? "Logo Emilianos la Taquería" : "Logo Vive Feliz Sin Dolor"}
              width={144}
              height={144}
              className={`relative group-hover:scale-110 transition-transform duration-300 ${
                isComidaRoute ? "dark:invert" : ""
              }`}
              style={{
                objectFit: 'contain',
                transform: 'scale(1.2285)'
              }}
              onError={(e) => {
                console.error('Error cargando logo:', e);
              }}
            />
          </div>

          {/* Decoración */}
          <div
            className="absolute bottom-0 left-4 right-4 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${getAgentColor()}30, transparent)`
            }}
          />
        </div>

        {/* Navegación principal */}
        <div className="flex-1 px-3 py-4 space-y-2">
          {menuItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              title={item.title}
              isActive={pathname === item.href}
              agentColors={{ primary: getAgentColor(), secondary: getAgentColor('secondary'), dark: getAgentColor('dark') }}
            />
          ))}
        </div>

        {/* Footer del sidebar */}
        <div
          className="relative p-4 border-t"
          style={{ borderColor: `${getAgentColor()}20` }}
        >
          <div
            className="absolute inset-0 rounded-b-xl"
            style={{
              background: `linear-gradient(to top, ${getAgentColor()}05, transparent, transparent)`
            }}
          />

          <div className="relative z-10 space-y-3">
            {/* Botón de tema */}
            <button
              onClick={handleThemeToggle}
              className={cn(
                "relative group flex items-center justify-between w-full h-12 px-4 rounded-xl",
                "transition-all duration-300 border cursor-pointer",
                "border-gray-200 dark:border-black",
                "bg-white dark:bg-black"
              )}
              title="Cambiar tema"
              type="button"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg group-hover:scale-110 transition-all duration-300",
                  isComidaRoute
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50"
                    : "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50"
                )}>
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-semibold transition-colors duration-300",
                    isComidaRoute
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-teal-600 dark:text-teal-400"
                  )}>
                    Tema
                  </span>
                  <span className="text-[8px] text-muted-foreground">
                    {mounted ? (
                      (theme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light')) === "light"
                      ? "Claro"
                      : "Oscuro"
                    ) : "Cargando..."}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center w-8 h-8">
                {mounted ? (
                  <div className="relative">
                    {(theme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light')) === "light" ? (
                      <svg className={cn(
                        "h-4 w-4",
                        isComidaRoute
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-teal-600 dark:text-teal-400"
                      )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ) : (
                      <svg className={cn(
                        "h-4 w-4",
                        isComidaRoute
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-teal-600 dark:text-teal-400"
                      )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                      </svg>
                    )}
                  </div>
                ) : (
                  <div className={cn(
                    "h-4 w-4 rounded-full animate-pulse",
                    isComidaRoute
                      ? "bg-orange-200 dark:bg-orange-800"
                      : "bg-teal-200 dark:bg-teal-800"
                  )}></div>
                )}
              </div>
            </button>

            {/* Botón de salir */}
            <button
              onClick={handleLogout}
              className={cn(
                "relative group flex items-center justify-between w-full h-12 px-4 rounded-xl",
                "transition-all duration-300 border cursor-pointer",
                "border-gray-200 dark:border-black",
                "bg-white dark:bg-black"
              )}
              title="Salir del dashboard"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg group-hover:scale-110 transition-all duration-300",
                  isComidaRoute
                    ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:bg-orange-200 dark:group-hover:bg-orange-900/50"
                    : "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 group-hover:bg-teal-200 dark:group-hover:bg-teal-900/50"
                )}>
                  <LogOut className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-semibold transition-colors duration-300",
                    isComidaRoute
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-teal-600 dark:text-teal-400"
                  )}>
                    Salir
                  </span>
                  <span className="text-[8px] text-muted-foreground">
                    Volver al inicio
                  </span>
                </div>
              </div>
              <ChevronRight
                className={cn(
                  "h-4 w-4 transition-all duration-300 opacity-60 group-hover:opacity-100",
                  isComidaRoute
                    ? "text-orange-600 dark:text-orange-400"
                    : "text-teal-600 dark:text-teal-400"
                )}
              />
            </button>

            {/* Info de versión */}
            <div className="mt-3 text-center">
              <p className="text-[9px] text-muted-foreground font-medium">
                v1.0.0 Premium
              </p>
              <div className="flex items-center justify-center mt-1">
                <div
                  className="w-1 h-1 rounded-full mx-0.5"
                  style={{ backgroundColor: `${getAgentColor()}99` }}
                />
                <div
                  className="w-1 h-1 rounded-full mx-0.5"
                  style={{ backgroundColor: `${getAgentColor()}66` }}
                />
                <div
                  className="w-1 h-1 rounded-full mx-0.5"
                  style={{ backgroundColor: `${getAgentColor()}33` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Sidebar Mobile
  const MobileSidebar = () => {
    if (!mounted) return null;

    return (
      <>
        {/* Botón hamburguesa */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-50 p-2"
            style={{
              backgroundColor: `${getAgentColor()}10`,
              border: `1px solid ${getAgentColor()}20`
            }}
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu
              className="h-5 w-5"
              style={{ color: getAgentColor() }}
            />
          </Button>
        </div>

        {/* Overlay de fondo */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Drawer lateral */}
        {isMobileMenuOpen && (
          <div
            className="fixed left-0 top-0 h-screen w-80 max-w-[80vw] bg-background z-50 md:hidden shadow-2xl slide-in"
            style={{
              borderRight: `4px solid ${getAgentColor()}`
            }}
          >
            <div className="flex flex-col h-full">
              {/* Header del mobile sidebar */}
              <div className="relative h-32 flex flex-col items-center justify-center p-4 border-b" style={{ borderColor: `${getAgentColor()}20` }}>
                {/* Logo */}
                <div className="relative">
                  <Image
                    src={isComidaRoute ? "/images/logo-emiliano.png" : "/images/logo-vivefelizsindolor-azul.png"}
                    alt={isComidaRoute ? "Logo Emilianos la Taquería" : "Logo Vive Feliz Sin Dolor"}
                    width={120}
                    height={120}
                    className={cn(
                      "transition-transform duration-300",
                      isComidaRoute ? "dark:invert" : ""
                    )}
                    style={{
                      objectFit: 'contain',
                      transform: 'scale(1.02)'
                    }}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Navegación principal */}
              <div className="flex-1 px-3 py-4 space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                    isActive={pathname === item.href}
                    agentColors={{ primary: getAgentColor(), secondary: getAgentColor('secondary'), dark: getAgentColor('dark') }}
                    onClick={handleNavClick}
                  />
                ))}
              </div>

              {/* Footer del mobile sidebar */}
              <div className="p-4 border-t space-y-3" style={{ borderColor: `${getAgentColor()}20` }}>
                {/* Botón de tema móvil */}
                <button
                  onClick={handleThemeToggle}
                  className="w-full h-12 px-4 rounded-xl flex items-center justify-between border bg-background"
                  style={{ borderColor: `${getAgentColor()}20` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${getAgentColor()}10` }}>
                      <Sparkles className="h-4 w-4" style={{ color: getAgentColor() }} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold" style={{ color: getAgentColor() }}>
                        Tema
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {mounted ? (
                          (theme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light')) === "light"
                          ? "Claro"
                          : "Oscuro"
                        ) : "Cargando..."}
                      </span>
                    </div>
                  </div>
                  {mounted ? (
                    <div className="w-6 h-6">
                      {(theme || (document.documentElement.classList.contains('dark') ? 'dark' : 'light')) === "light" ? (
                        <svg className="h-4 w-4" style={{ color: getAgentColor() }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" style={{ color: getAgentColor() }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                      )}
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded-full animate-pulse" style={{ backgroundColor: `${getAgentColor()}33` }}></div>
                  )}
                </button>

                {/* Botón de salir móvil */}
                <button
                  onClick={handleLogout}
                  className="w-full h-12 px-4 rounded-xl flex items-center justify-between border bg-background"
                  style={{ borderColor: `${getAgentColor()}20` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg" style={{ backgroundColor: `${getAgentColor()}10` }}>
                      <LogOut className="h-4 w-4" style={{ color: getAgentColor() }} />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-sm font-semibold" style={{ color: getAgentColor() }}>
                        Salir
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Volver al inicio
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4" style={{ color: getAgentColor() }} />
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar Desktop */}
      <DesktopSidebar />

      {/* Mobile Menu Button & Sidebar */}
      <MobileSidebar />

      {/* Contenido principal */}
      <main className="flex-1 bg-background relative overflow-hidden">
        {/* Espacio para el botón de menú móvil */}
        <div className="h-16 md:hidden" />

        {/* Efecto de fondo sutil */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to bottom right, ${getAgentColor()}05, transparent, ${getAgentColor('secondary')}05)`
          }}
        />
        <div className="relative z-10 h-full">
          {children}
        </div>
      </main>
    </div>
  );
}