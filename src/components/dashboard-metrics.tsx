'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { getAgentTheme } from '@/lib/config/themes';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Download,
  RefreshCw
} from 'lucide-react';

interface Metric {
  label: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
  color?: 'success' | 'warning' | 'error' | 'info';
  description?: string;
}

interface MetricGroup {
  title: string;
  description?: string;
  metrics: Metric[];
  badge?: {
    text: string;
    variant: 'default' | 'secondary' | 'destructive' | 'outline';
  };
}

interface DashboardMetricsProps {
  groups: MetricGroup[];
  loading?: boolean;
  refreshable?: boolean;
  onRefresh?: () => void;
  exportable?: boolean;
  onExport?: () => void;
}

const getBadgeVariant = (color?: 'success' | 'warning' | 'error' | 'info') => {
  switch (color) {
    case 'success': return 'default';
    case 'warning': return 'secondary';
    case 'error': return 'destructive';
    default: return 'outline';
  }
};

export function DashboardMetrics({
  groups,
  loading = false,
  refreshable = true,
  onRefresh,
  exportable = true,
  onExport
}: DashboardMetricsProps) {
  const pathname = usePathname();
  const isComidaRoute = pathname.includes('/comida');
  const agentType = isComidaRoute ? 'comida' : 'salud';
  const agentTheme = getAgentTheme(agentType);
  if (loading) {
    return (
      <div className="grid gap-4">
        {groups.map((group, groupIndex) => (
          <div key={groupIndex} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(group.metrics.length || 4)].map((_, i) => (
              <Card key={i} className="p-4">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </Card>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header actions */}
      <div className="flex justify-end items-center space-x-2">
        {refreshable && onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        )}
        {exportable && onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Exportar métricas
          </Button>
        )}
      </div>

      {/* Metric groups - estilo simple como el dashboard principal */}
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="space-y-4">
          {/* Group title */}
          <div>
            <h3 className="text-sm font-medium">{group.title}</h3>
            {group.description && (
              <p className="text-xs text-muted-foreground">{group.description}</p>
            )}
          </div>

          {/* Metrics grid - estilo simple como el dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {group.metrics.map((metric, metricIndex) => (
              <Card key={metricIndex} className="p-4">
                <div className="flex items-center space-x-2">
                  <div className="p-2 rounded-md bg-primary/10">
                    {metric.icon ? (
                      <div className="h-4 w-4 text-primary">{metric.icon}</div>
                    ) : (
                      <Activity className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.label}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xl font-bold">{metric.value}</p>
                      {metric.change !== undefined && (
                        <Badge
                          variant={getBadgeVariant(metric.color)}
                          className="text-xs px-1 py-0"
                        >
                          <div className="flex items-center gap-0.5">
                            {metric.changeType === 'increase' ? (
                              <TrendingUp className="h-2 w-2" />
                            ) : (
                              <TrendingDown className="h-2 w-2" />
                            )}
                            {Math.abs(metric.change)}%
                          </div>
                        </Badge>
                      )}
                    </div>
                    {metric.description && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {metric.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}