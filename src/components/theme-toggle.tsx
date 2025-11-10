"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { getAgentTheme } from "@/lib/config/themes"

interface ThemeToggleProps {
  agentId?: string;
  className?: string;
}

export function ThemeToggle({ agentId = 'salud', className }: ThemeToggleProps) {
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const agentTheme = getAgentTheme(agentId)

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={`h-8 w-8 transition-all duration-300 ${className || ''}`}
      style={{
        hoverBackgroundColor: `${agentTheme.primary}10`,
        hoverColor: agentTheme.primary
      }}
      suppressHydrationWarning
      title="Cambiar tema"
    >
      <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1rem] w-[1rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}