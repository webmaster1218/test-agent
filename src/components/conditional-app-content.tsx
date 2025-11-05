'use client';

import { usePathname } from 'next/navigation';
import AppContent from '@/components/app-content';

export default function ConditionalAppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Solo mostrar el menú de navegación en las páginas del dashboard (incluyendo las de comida)
  const isDashboardPage = pathname === '/dashboard' || pathname === '/chat' || pathname === '/settings' ||
                         pathname === '/dashboard/comida' || pathname === '/chat/comida' || pathname === '/settings/comida';

  if (isDashboardPage) {
    return <AppContent>{children}</AppContent>;
  }

  return <>{children}</>;
}