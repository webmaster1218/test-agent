'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Shield, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthRedirect, logout, getLoginUrl, DashboardType } from '@/lib/auth';

interface AuthGuardProps {
  dashboardType: DashboardType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ dashboardType, children, fallback }: AuthGuardProps) {
  const [isClient, setIsClient] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    // Verificar autenticación
    const checkAuth = () => {
      const authenticated = typeof window !== 'undefined' &&
        sessionStorage.getItem(`${dashboardType}_authenticated`) === 'true';

      setIsAuthenticated(authenticated);
      setAuthChecked(true);

      // Si no está autenticado, redirigir al login
      if (!authenticated) {
        setTimeout(() => {
          router.push(getLoginUrl(dashboardType));
        }, 1000);
      }
    };

    checkAuth();
  }, [dashboardType, router]);

  // Mostrar spinner mientras se verifica autenticación
  if (!isClient || !authChecked) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-white/60">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar mensaje de acceso denegado
  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-red-500/20 bg-red-500/5 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-500" />
            </div>
            <CardTitle className="text-xl text-red-400">Acceso Restringido</CardTitle>
            <CardDescription className="text-red-300">
              Necesitas estar autenticado para acceder a este dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-white/60 text-sm mb-6">
              Serás redirigido a la página de login en unos segundos...
            </p>
            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.push(getLoginUrl(dashboardType))}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                <Shield className="h-4 w-4 mr-2" />
                Ir al Login
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Volver al Inicio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si está autenticado, mostrar el contenido
  return <>{children}</>;
}