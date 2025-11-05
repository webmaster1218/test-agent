'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
import { getAgentTheme } from '@/lib/config/themes';

export default function LoginPage() {
  const saludTheme = getAgentTheme('salud');
  const comidaTheme = getAgentTheme('comida');

  return (
    <div className="min-h-screen bg-black overflow-hidden relative">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div
          className="w-full h-full opacity-20"
          style={{
            background: `radial-gradient(circle at 20% 50%, ${saludTheme.primary}33 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, ${comidaTheme.primary}22 0%, transparent 50%)`
          }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center px-4">
        {/* Botón de regreso */}
        <div className="absolute top-6 left-6">
          <Link href="/">
            <Button
              variant="outline"
              size="sm"
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
          </Link>
        </div>

        {/* Logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">FÁBRICA DE WINNERS</h1>
          <p className="text-white/70 text-lg">Selecciona el dashboard al que deseas acceder</p>
        </div>

        {/* Opciones de dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          {/* Opción Salud */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl hover:border-white/20 transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center">
              <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                   style={{ backgroundColor: 'transparent' }}>
                <img
                  src="/images/logo-vivefelizsindolor.png"
                  alt="Logo Vive Feliz Sin Dolor"
                  width={123}
                  height={123}
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
              <CardTitle className="text-xl text-white mb-2">Vive Feliz Sin Dolor</CardTitle>
              <CardDescription className="text-white/60">
                Analítica y métricas del agente de salud y bienestar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login/salud">
                <Button
                  className="w-full font-medium transition-all duration-200 hover:scale-[1.02] hover:opacity-90 text-white"
                  style={{
                    backgroundColor: saludTheme.primary,
                    border: `1px solid ${saludTheme.primary}`,
                  }}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Acceder a Salud
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Opción Comida */}
          <Card className="border-white/10 bg-black/40 backdrop-blur-xl hover:border-white/20 transition-all duration-300 hover:scale-105 group">
            <CardHeader className="text-center">
              <div className="mx-auto w-40 h-40 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                   style={{ backgroundColor: 'transparent' }}>
                <img
                  src="/images/logo-emiliano.png"
                  alt="Logo Emilianos la Taquería"
                  width={123}
                  height={123}
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
              <CardTitle className="text-xl text-white mb-2">Emilianos la Taquería</CardTitle>
              <CardDescription className="text-white/60">
                Analítica y métricas del agente de comida y restaurante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/login/comida">
                <Button
                  className="w-full font-medium transition-all duration-200 hover:scale-[1.02] hover:opacity-90 text-white"
                  style={{
                    backgroundColor: comidaTheme.primary,
                    border: `1px solid ${comidaTheme.primary}`,
                  }}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Acceder a Comida
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Información de seguridad */}
        <div className="mt-12 text-center max-w-md">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <p className="text-xs text-white/50 mb-2">
              <Shield className="h-3 w-3 inline mr-1" />
              Acceso seguro con credenciales de administrador
            </p>
            <p className="text-xs text-white/30">
              Usuario: <span className="font-mono">admin</span> |
              Contraseña: <span className="font-mono">FB1218$</span>
            </p>
          </div>
        </div>

            </div>
    </div>
  );
}