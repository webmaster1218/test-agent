'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { getAgentTheme } from '@/lib/config/themes';

// Credenciales quemadas
const CREDENTIALS = {
  username: 'admin',
  password: 'FB1218$'
};

export default function LoginSaludPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const theme = getAgentTheme('salud');

  // Verificar si ya está autenticado
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('salud_authenticated');
    if (isAuthenticated === 'true') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay para mejor UX
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validar credenciales
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      // Guardar autenticación en sessionStorage
      sessionStorage.setItem('salud_authenticated', 'true');
      sessionStorage.setItem('salud_auth_time', new Date().toISOString());

      // Redirigir al dashboard de salud
      router.push('/dashboard');
    } else {
      setError('Credenciales incorrectas. Por favor, intenta nuevamente.');
    }

    setIsLoading(false);
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full opacity-20"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${theme.primary}33 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, ${theme.primary}22 0%, transparent 50%)`
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
        {/* Botón de regreso */}
        <div className="absolute top-6 left-6">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="border-white/20 text-white hover:bg-white/10 hover:border-white/40"
            style={{
              color: 'white !important',
              backgroundColor: 'transparent',
              borderColor: 'rgba(255, 255, 255, 0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.setProperty('color', 'white', 'important');
              e.currentTarget.style.backgroundColor = 'rgba(66, 41, 255, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(66, 41, 255, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.setProperty('color', 'white', 'important');
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
        </div>

        {/* Logo y título */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center justify-center mb-2">
            <img
              src="/images/logo-vivefelizsindolor.png"
              alt="Logo Vive Feliz Sin Dolor"
              width={140}
              height={140}
              className="rounded-full"
              style={{
                objectFit: 'cover',
                filter: 'brightness(0) invert(1)',
                backgroundColor: 'transparent'
              }}
              onError={(e) => {
                console.error('Error cargando logo:', e);
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-1">FÁBRICA DE WINNERS</h2>
          <p className="text-white/70">Vive Feliz Sin Dolor</p>
        </div>

        {/* Formulario de login */}
        <Card className="w-full max-w-md border-white/10 bg-black/40 backdrop-blur-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl text-white flex items-center justify-center gap-2">
              <Shield className="h-5 w-5" style={{ color: theme.primary }} />
              Acceso Seguro
            </CardTitle>
            <CardDescription className="text-white/60">
              Ingresa tus credenciales para acceder a la parte administrativa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Campo de usuario */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white/80">
                  Usuario
                </label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresa tu usuario"
                  required
                  className="border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-blue-400/60 focus:ring-blue-400/20"
                  disabled={isLoading}
                />
              </div>

              {/* Campo de contraseña */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white/80">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Ingresa tu contraseña"
                    required
                    className="border-white/20 bg-white/5 text-white placeholder-white/40 focus:border-blue-400/60 focus:ring-blue-400/20 pr-10"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Alerta de error */}
              {error && (
                <Alert className="border-red-500/20 bg-red-500/10 text-red-200">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Botón de login */}
              <Button
                type="submit"
                className="w-full font-medium transition-all duration-200 hover:scale-[1.02] hover:opacity-90 text-white"
                style={{
                  backgroundColor: theme.primary,
                  border: `1px solid ${theme.primary}`,
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Autenticando...
                  </div>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Ingresar al Dashboard
                  </>
                )}
              </Button>
            </form>

            {/* Información adicional */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-xs text-white/50 mb-3">
                  Acceso autorizado únicamente para personal de Salud
                </p>
                <div className="flex justify-center gap-4">
                  <Link href="/login/comida">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-white/40 hover:text-white text-xs border-0 bg-transparent"
                      style={{
                        color: 'rgba(255, 255, 255, 0.6) !important',
                        backgroundColor: 'transparent !important',
                        border: 'none'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.setProperty('color', 'white', 'important');
                        e.currentTarget.style.backgroundColor = 'rgba(255, 107, 53, 0.1)';
                        e.currentTarget.style.border = 'none';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.setProperty('color', 'rgba(255, 255, 255, 0.6)', 'important');
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.border = 'none';
                      }}
                    >
                      Ir a Login de Emiliano la Taquería →
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

            </div>
    </div>
  );
}