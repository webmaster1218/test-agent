'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Cell, LabelList } from 'recharts';
import { TrendingDown, TrendingUp } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface FunnelData {
  name: string;
  value: number;
  percentage?: number;
  change?: number;
}

interface FunnelChartProps {
  data: FunnelData[];
  title?: string;
  description?: string;
  className?: string;
  color?: string;
  useGradientColors?: boolean;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
        <p className="font-medium text-foreground">{data.name}</p>
        <p className="text-sm text-muted-foreground">
          {data.value.toLocaleString()} usuarios
        </p>
        {data.percentage && (
          <p className="text-sm text-muted-foreground">
            {data.percentage}% del total
          </p>
        )}
        {data.change !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {data.change >= 0 ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={`text-xs ${data.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {data.change >= 0 ? '+' : ''}{data.change}%
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const CustomLabel = (props: any) => {
  const { x, y, width, value, percentage } = props;

  return (
    <g>
      <text
        x={x + width + 10}
        y={y + 14}
        fill="hsl(var(--foreground))"
        fontSize={12}
        textAnchor="start"
        className="font-medium"
      >
        {value.toLocaleString()}
      </text>
      {percentage && (
        <text
          x={x + width + 10}
          y={y + 28}
          fill="hsl(var(--muted-foreground))"
          fontSize={10}
          textAnchor="start"
        >
          ({percentage}%)
        </text>
      )}
    </g>
  );
};

export function FunnelChart({
  data,
  title = "Embudo de Conversión",
  description = "Progreso de usuarios a través del proceso",
  className = "",
  color = "hsl(var(--primary))",
  useGradientColors = true
}: FunnelChartProps) {
  // Ordenar datos de mayor a menor para efecto embudo
  const sortedData = [...data].sort((a, b) => b.value - a.value);

  // Calcular porcentajes
  const totalValue = sortedData[0]?.value || 0;
  const dataWithPercentage = sortedData.map((item, index) => ({
    ...item,
    percentage: Math.round((item.value / totalValue) * 100),
    change: index > 0 ? Math.round(((item.value - sortedData[index - 1].value) / sortedData[index - 1].value) * 100) : 0
  }));

  // Colores para el embudo (de más a menos intenso)
  const funnelColors = [
    "#FF6B35", // Naranja principal
    "#FF8C42", // Naranja medio
    "#FFB366", // Naranja claro
    "#FFD4CC", // Naranja muy claro
    "#FFE8DF", // Naranja extremadamente claro
    "#FFF5F0", // Naranja casi blanco
    "#FFFAF7", // Naranja blanco
  ];

  return (
    <Card className={`border-border ${className}`}>
      <CardHeader className="pb-3">
        <div>
          <CardTitle className="text-sm font-medium leading-none">
            {title}
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={dataWithPercentage}
              layout="horizontal"
              margin={{ top: 20, right: 80, left: 100, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted/20"
                horizontal={true}
                vertical={false}
              />
              <XAxis
                type="number"
                hide
                domain={[0, 'dataMax']}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[0, 4, 4, 0]}
                label={<CustomLabel />}
              >
                {dataWithPercentage.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={useGradientColors ? funnelColors[index % funnelColors.length] : color}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Estadísticas adicionales */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {dataWithPercentage[0]?.value.toLocaleString() || 0}
            </p>
            <p className="text-xs text-muted-foreground">Iniciales</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {Math.round(
                ((dataWithPercentage[dataWithPercentage.length - 1]?.value || 0) /
                (dataWithPercentage[0]?.value || 1)) * 100
              )}%
            </p>
            <p className="text-xs text-muted-foreground">Conversión</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-foreground">
              {dataWithPercentage[dataWithPercentage.length - 1]?.value.toLocaleString() || 0}
            </p>
            <p className="text-xs text-muted-foreground">Finales</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}