'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  Calendar,
  Target,
  Activity,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  BarChart3,
  PieChart,
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

const getIcon = (iconName?: string) => {
  switch (iconName) {
    case 'users': return <Users className="h-4 w-4" />;
    case 'message': return <MessageSquare className="h-4 w-4" />;
    case 'calendar': return <Calendar className="h-4 w-4" />;
    case 'target': return <Target className="h-4 w-4" />;
    case 'activity': return <Activity className="h-4 w-4" />;
    case 'clock': return <Clock className="h-4 w-4" />;
    case 'check': return <CheckCircle className="h-4 w-4" />;
    case 'alert': return <AlertCircle className="h-4 w-4" />;
    case 'cancel': return <XCircle className="h-4 w-4" />;
    case 'bar': return <BarChart3 className="h-4 w-4" />;
    case 'pie': return <PieChart className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
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
  if (loading) {
    return (
      <div className="grid gap-6">
        {groups.map((group, groupIndex) => (
          <Card key={groupIndex} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
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

      {/* Metric groups */}
      {groups.map((group, groupIndex) => (
        <Card key={groupIndex} className="overflow-hidden border-2 border-[#2C8082]/20 hover:border-[#2C8082]/40 hover:shadow-lg hover:shadow-[#2C8082]/20 transition-all duration-300">
          <CardHeader className="bg-gray-900/50 border-b border-gray-800 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2 text-white">
                  {group.title}
                  {group.badge && (
                    <Badge variant={group.badge.variant} className="text-xs">
                      {group.badge.text}
                    </Badge>
                  )}
                </CardTitle>
                {group.description && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {group.description}
                  </p>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {group.metrics.map((metric, metricIndex) => (
                <div key={metricIndex} className="space-y-3">
                  {/* Metric header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {metric.icon && (
                        <div className="p-1.5 rounded-lg bg-[#2C8082]/10 text-[#2C8082]">
                          {metric.icon}
                        </div>
                      )}
                      <span className="text-sm font-medium text-muted-foreground">
                        {metric.label}
                      </span>
                    </div>
                    {metric.change !== undefined && (
                      <Badge
                        variant={getBadgeVariant(metric.color)}
                        className="text-xs"
                      >
                        <div className="flex items-center gap-1">
                          {metric.changeType === 'increase' ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {Math.abs(metric.change)}%
                        </div>
                      </Badge>
                    )}
                  </div>

                  {/* Metric value */}
                  <div className="text-2xl font-bold bg-gradient-to-r from-[#2C8082] to-[#1f5a5c] bg-clip-text text-transparent">
                    {metric.value}
                  </div>

                  {/* Metric description */}
                  {metric.description && (
                    <p className="text-xs text-muted-foreground">
                      {metric.description}
                    </p>
                  )}

                  {/* Progress bar for percentage metrics */}
                  {typeof metric.value === 'string' && metric.value.includes('%') && (
                    <div className="space-y-1">
                      <Progress
                        value={parseInt(metric.value)}
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Separator for groups */}
            {groupIndex < groups.length - 1 && (
              <Separator className="mt-6 bg-gray-700" />
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}