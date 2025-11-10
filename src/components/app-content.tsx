'use client';

import * as React from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import ResponsiveSidebar from '@/components/responsive-sidebar';

// Componente de item de navegación premium
const NavItem = ({ href, icon: Icon, title, isActive, agentColors }: {
    href: string;
    icon: any;
    title: string;
    isActive: boolean;
    agentColors: { primary: string; secondary: string; dark: string };
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
            className="relative group w-full h-12 rounded-xl transition-all duration-300 overflow-hidden flex items-center px-4 hover:bg-gradient-to-r hover:from-black/5 hover:to-transparent"
            style={getDynamicStyles()}
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
            ></div>

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
                        <span className="text-sm font-semibold transition-all duration-300"
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

export default function AppContent({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <ResponsiveSidebar>
                {children}
            </ResponsiveSidebar>
        </ThemeProvider>
    );
}