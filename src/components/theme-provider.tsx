"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
  storageKey?: string;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Evitar flash de tema con mejor transición
  if (!mounted) {
    return (
      <div style={{ visibility: 'hidden', position: 'absolute', top: 0, left: 0, right: 0 }}>
        {children}
      </div>
    )
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange={false}
      storageKey="marcos-chat-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  )
}