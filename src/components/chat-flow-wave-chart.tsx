'use client';

import React from 'react';
import { Activity, MessageSquare, Clock } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ChatFlowData {
  hour: string;
  chats: number;
  messages: number;
}

interface ChatFlowWaveChartProps {
  data: ChatFlowData[];
  title?: string;
  description?: string;
  className?: string;
}

const chartConfig = {
  chats: {
    label: "Chats",
    color: "hsl(175, 60%, 42%)", // #2C8082
  },
  messages: {
    label: "Mensajes",
    color: "hsl(210, 100%, 50%)", // Azul complementario
  },
};

export function ChatFlowWaveChart({
  data,
  title = "Flujo de Chat por Hora",
  description = "Actividad de conversaciones y mensajes durante el día",
  className
}: ChatFlowWaveChartProps) {
  // Formatear hora para mostrar solo HH:MM
  const formatHour = (hour: string) => {
    const [h, m] = hour.split(':');
    return `${h}:${m}`;
  };

  // Formateador para el tooltip
  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color?: string }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/90 border border-[#2C8082]/30 p-3 rounded-lg shadow-lg">
          <p className="text-white font-medium mb-2">{`Hora: ${formatHour(label || '')}`}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={`border-2 border-[#2C8082]/30 hover:border-[#2C8082]/50 transition-all duration-300 ${className}`}>
      <CardHeader className="bg-gray-900/50 border-b border-gray-800 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 text-white">
              <MessageSquare className="h-5 w-5 text-[#2C8082]" />
              {title}
            </CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              {description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm">
              <div className="w-3 h-3 rounded-full bg-[#2C8082]"></div>
              <span className="text-gray-400">Chats</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-400">Mensajes</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {/* Debug message */}
        <div className="mb-4 p-2 bg-red-600 rounded text-center text-sm text-white">
          DEPURACIÓN: ¿Puedes ver este recuadro rojo? (ChatFlowWaveChart)
        </div>

        {/* Versión simplificada para prueba */}
        <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
          <h3 className="font-bold mb-2">Gráfica Simplificada</h3>
          <p>Si ves esto, el componente está renderizando</p>
          <p>Hay {data.length} puntos de datos</p>
        </div>

        {/* Versión ultra simplificada para depuración */}
        <div className="w-full h-64 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
          <div className="text-white text-center">
            <h4 className="text-2xl font-bold mb-2">GRÁFICA SIMPLIFICADA</h4>
            <p className="text-lg">Chats: {data.reduce((sum, d) => sum + d.chats, 0)}</p>
            <p className="text-lg">Mensajes: {data.reduce((sum, d) => sum + d.messages, 0)}</p>
            <p className="text-sm mt-2">Esta versión simplificada debería ser visible</p>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-800">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-[#2C8082]">
              <Activity className="h-4 w-4" />
              <span className="text-2xl font-bold">
                {data.reduce((sum, d) => sum + d.chats, 0)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Total Chats</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-500">
              <MessageSquare className="h-4 w-4" />
              <span className="text-2xl font-bold">
                {data.reduce((sum, d) => sum + d.messages, 0)}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Total Mensajes</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-2xl font-bold">
                {data.length > 0 ? Math.round(data.reduce((sum, d) => sum + d.chats, 0) / data.length) : 0}
              </span>
            </div>
            <p className="text-sm text-gray-400 mt-1">Promedio/Hora</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Datos de ejemplo para testing
export const sampleChatFlowData: ChatFlowData[] = [
  { hour: "00:00", chats: 12, messages: 45 },
  { hour: "01:00", chats: 8, messages: 32 },
  { hour: "02:00", chats: 5, messages: 18 },
  { hour: "03:00", chats: 3, messages: 12 },
  { hour: "04:00", chats: 2, messages: 8 },
  { hour: "05:00", chats: 4, messages: 15 },
  { hour: "06:00", chats: 15, messages: 52 },
  { hour: "07:00", chats: 28, messages: 89 },
  { hour: "08:00", chats: 45, messages: 156 },
  { hour: "09:00", chats: 38, messages: 134 },
  { hour: "10:00", chats: 52, messages: 178 },
  { hour: "11:00", chats: 48, messages: 167 },
  { hour: "12:00", chats: 42, messages: 145 },
  { hour: "13:00", chats: 35, messages: 123 },
  { hour: "14:00", chats: 40, messages: 138 },
  { hour: "15:00", chats: 44, messages: 152 },
  { hour: "16:00", chats: 38, messages: 132 },
  { hour: "17:00", chats: 42, messages: 146 },
  { hour: "18:00", chats: 36, messages: 125 },
  { hour: "19:00", chats: 32, messages: 112 },
  { hour: "20:00", chats: 28, messages: 98 },
  { hour: "21:00", chats: 22, messages: 78 },
  { hour: "22:00", chats: 18, messages: 64 },
  { hour: "23:00", chats: 15, messages: 52 },
];