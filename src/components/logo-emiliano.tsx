'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface LogoEmilianoProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function LogoEmiliano({
  className = '',
  width = 48,
  height = 48
}: LogoEmilianoProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Determinar el tema actual
  const currentTheme = theme === 'system' ? systemTheme : theme;
  const isDark = currentTheme === 'dark';

  if (!mounted) {
    // Mostrar un placeholder mientras se carga
    return (
      <div
        className={`animate-pulse rounded-lg ${className}`}
        style={{ width, height }}
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src="/images/logo-emiliano.png"
        alt="Emilianos la Taqueria"
        width={width}
        height={height}
        className="transition-all duration-300 dark:invert brightness-0 contrast-100 hover:scale-110"
        priority
      />
    </div>
  );
}