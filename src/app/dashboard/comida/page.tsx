'use client';

import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { AreaChart, Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, XAxis, YAxis, Legend, Cell, Sector, Area, Tooltip, LineChart, Line, LabelList } from 'recharts';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Bot, MessageCircle, User, MessageSquare, Clock, Zap, Loader, ServerCrash, RefreshCw, PhoneForwarded, Smile, Frown, Meh, Download, FileSpreadsheet, FileText, File, FileImage, Filter, Package, DollarSign, Receipt, TrendingUp, ShoppingCart, Coffee, ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Calendar } from '@/components/ui/calendar';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { format, subDays, isWithinInterval, parse, differenceInSeconds } from 'date-fns';
import { es } from 'date-fns/locale';
import { DashboardChat } from '@/components/dashboard-chat';
import { ChatInterface } from '@/components/chat-interface';
import UltimosPedidosTable from '@/components/ultimos-pedidos-table';
import { analyzeSentiment } from '@/app/actions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DashboardDataTable } from '@/components/dashboard-data-table';
import { DashboardMetrics } from '@/components/dashboard-metrics';
import { DashboardFilters } from '@/components/dashboard-filters';
import { ChatFlowWaveChart, sampleChatFlowData } from '@/components/chat-flow-wave-chart';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { TrendingDown, CheckCircle, AlertCircle, XCircle, Activity, Target, Users, CalendarDays, BarChart3 } from 'lucide-react';
import { FunnelChart } from '@/components/charts/funnel-chart';

// N8N_WEBHOOK_URL para el agente de comida
const N8N_WEBHOOK_URL_COMIDA = 'https://n8n.srv1054162.hstgr.cloud/webhook/dda6a613-7df4-4c2c-86d9-ad213a155c9c';

// Colores específicos para el dashboard de comida
const COMIDA_COLORS = {
  primary: '#FF6B35',
  primaryLight: '#FF8C42',
  primaryDark: '#E85D2B',
  secondary: '#FF4500',
  accent: '#FFA726',
  chart1: '#FF6B35',
  chart2: '#FF8C42',
  chart3: '#FFA726',
  chart4: '#FF4500',
  chart5: '#E85D2B',
};

// Raw data from conversations table
interface SheetRow {
    id: number;
    createdAt: string;
    updatedAt: string;
    conversacion_id: string;
    start_time: string;
    end_time: string;
    sentimiento: string;
    user_message: string;
    agent_message: string;
    main_intent?: string;  // Opcional, ya no viene en los datos
}

// Raw data from appointments/valoraciones table
interface AppointmentRow {
    row_number: number;
    Calendario: string;
    ['Dia de cuando se agendo']: string;
    ['ID del evento']: string;
    Tipo: string;
    Nombre: string;
    Telefono: string;
    Correo: string;
    ['Fecha de inicio']: string;
    ['Fecha de fin']: string;
    Estado: string;
}

// Raw data from pedidos table
interface PedidoRow {
    id: number;
    cliente_telefono: string;
    cliente_nombre: string;
    cliente_direccion: string;
    productos: string;
    total_precio: string;
    fecha_pedido: string;
}

// Combined webhook response
interface WebhookResponse {
    conversations?: SheetRow[];
    appointments?: AppointmentRow[];
    pedidos?: PedidoRow[];
}

// Structures for processed data
interface ConversationData {
    date: string;
    dateObj: Date;
    conversations: number;
    messages: number;
    intents: Record<string, number>;
}

interface TopQuery {
    query: string;
    count: number;
}

interface HourlyActivity {
    hour: string;
    messages: number;
}

interface IntentFlow {
    flow: string[];
    count: number;
}

interface DashboardDataOutput {
    historicalData: ConversationData[];
    topQueriesData: TopQuery[];
    hourlyActivityData: HourlyActivity[];
    summary: {
        totalConversations: string;
        scheduledAppointments: string;
        totalMessages: string;
        escalations: string;
        avgMsgPerConversation: string;
        avgResponseTime: string;
        avgConversationDuration: string;
        satisfactionRate: string;
        confirmedAppointments: string;
        pendingAppointments: string;
        cancelledAppointments: string;
    };
    allIntents: { name: string; value: number; fill: string }[];
    sentiments: { name: string; value: number; icon: React.FC<any> }[];
    intentFlows: IntentFlow[];
    engagementMetrics: { name: string; value: number; category: string }[];
    appointmentsData: {
        total: number;
        byStatus: Record<string, number>;
        byType: Record<string, number>;
        recentAppointments: AppointmentRow[];
    };
    originalData: {
        conversations: any[];
        appointments: any[];
    };
}


// Unified color palette with semantic meanings
const COLORS = {
  // Primary brand colors
  primary: '#3B82F6',      // Blue 500
  primaryLight: '#DBEAFE', // Blue 100

  // Semantic colors
  success: '#10B981',     // Green 500
  successLight: '#D1FAE5', // Green 100
  warning: '#F59E0B',     // Amber 500
  warningLight: '#FEF3C7', // Amber 100
  error: '#EF4444',       // Red 500
  errorLight: '#FEE2E2',  // Red 100
  info: '#6366F1',        // Indigo 500
  infoLight: '#E0E7FF',   // Indigo 100

  // Chart colors - unified palette
  chart1: '#3B82F6',      // Blue
  chart2: '#10B981',      // Green
  chart3: '#F59E0B',      // Amber
  chart4: '#6366F1',      // Indigo
  chart5: '#EF4444',      // Red
  chart6: '#8B5CF6',      // Purple
  chart7: '#06B6D4',      // Cyan

  // Neutral colors
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

const INTENT_COLORS = [
  COLORS.chart1,
  COLORS.chart2,
  COLORS.chart3,
  COLORS.chart4,
  COLORS.chart5,
  COLORS.chart6,
  COLORS.chart7,
];

const SENTIMENT_COLORS = {
    Positivo: '#2ca02c',
    Neutro: '#ff7f0e',
    Negativo: '#d62728',
};

const FUTURISTIC_COLORS = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
];


// Export utility functions
const exportToCSV = (data: DashboardDataOutput, filename: string = 'dashboard-comida-data') => {
    const rows = [];

  // Summary data
  rows.push(['Métrica', 'Valor']);
  rows.push(['Total Conversaciones', data.summary.totalConversations]);
  rows.push(['Total Mensajes', data.summary.totalMessages]);
  rows.push(['Citas Programadas', data.summary.scheduledAppointments]);
  rows.push(['Escalaciones', data.summary.escalations]);
  rows.push(['Promedio Msj/Conversación', data.summary.avgMsgPerConversation]);
  rows.push(['Tiempo Promedio Respuesta', data.summary.avgResponseTime]);
  rows.push(['Tasa Satisfacción', data.summary.satisfactionRate]);
  rows.push([]);

  // Historical data
  rows.push(['Fecha', 'Conversaciones', 'Mensajes']);
  data.historicalData.forEach(item => {
    rows.push([item.date, item.conversations.toString(), item.messages.toString()]);
  });
  rows.push([]);

  // Intents data
  rows.push(['Intención', 'Cantidad']);
  data.allIntents.forEach(intent => {
    rows.push([intent.name, intent.value.toString()]);
  });
  rows.push([]);

  // Sentiment data
  rows.push(['Sentimiento', 'Cantidad']);
  data.sentiments.forEach(sentiment => {
    rows.push([sentiment.name, sentiment.value.toString()]);
  });
  rows.push([]);

  // Top queries
  rows.push(['Consulta', 'Frecuencia']);
  data.topQueriesData.forEach(query => {
    rows.push([query.query, query.count.toString()]);
  });

  const csvContent = rows.map(row =>
    row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
  ).join('\n');

  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToJSON = (data: DashboardDataOutput, filename: string = 'dashboard-comida-data') => {
  const jsonData = {
    exportDate: new Date().toISOString(),
    summary: data.summary,
    historicalData: data.historicalData,
    intents: data.allIntents,
    sentiments: data.sentiments,
    topQueries: data.topQueriesData,
    hourlyActivity: data.hourlyActivityData,
    intentFlows: data.intentFlows,
    engagementMetrics: data.engagementMetrics
  };

  const jsonString = JSON.stringify(jsonData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToXML = (data: DashboardDataOutput, filename: string = 'dashboard-comida-data') => {
  let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xmlContent += '<dashboard>\n';
  xmlContent += `  <exportDate>${new Date().toISOString()}</exportDate>\n`;
  xmlContent += `  <agent>comida</agent>\n`;
  xmlContent += '  <summary>\n';
  Object.entries(data.summary).forEach(([key, value]) => {
    xmlContent += `    <${key}>${value}</${key}>\n`;
  });
  xmlContent += '  </summary>\n';

  xmlContent += '  <historicalData>\n';
  data.historicalData.forEach(item => {
    xmlContent += '    <dataPoint>\n';
    xmlContent += `      <date>${item.date}</date>\n`;
    xmlContent += `      <conversations>${item.conversations}</conversations>\n`;
    xmlContent += `      <messages>${item.messages}</messages>\n`;
    xmlContent += '    </dataPoint>\n';
  });
  xmlContent += '  </historicalData>\n';

  xmlContent += '  <intents>\n';
  data.allIntents.forEach(intent => {
    xmlContent += '    <intent>\n';
    xmlContent += `      <name>${intent.name}</name>\n`;
    xmlContent += `      <value>${intent.value}</value>\n`;
    xmlContent += '    </intent>\n';
  });
  xmlContent += '  </intents>\n';

  xmlContent += '  <sentiments>\n';
  data.sentiments.forEach(sentiment => {
    xmlContent += '    <sentiment>\n';
    xmlContent += `      <name>${sentiment.name}</name>\n`;
    xmlContent += `      <value>${sentiment.value}</value>\n`;
    xmlContent += '    </sentiment>\n';
  });
  xmlContent += '  </sentiments>\n';

  xmlContent += '  <topQueries>\n';
  data.topQueriesData.forEach(query => {
    xmlContent += '    <query>\n';
    xmlContent += `      <text>${query.query}</text>\n`;
    xmlContent += `      <count>${query.count}</count>\n`;
    xmlContent += '    </query>\n';
  });
  xmlContent += '  </topQueries>\n';

  xmlContent += '</dashboard>';

  const blob = new Blob([xmlContent], { type: 'application/xml' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xml`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToTXT = (data: DashboardDataOutput, filename: string = 'dashboard-comida-data') => {
  let txtContent = 'DASHBOARD DE ANALÍTICAS - AGENTE COMIDA - EXPORTACIÓN DE DATOS\n';
  txtContent += '=================================================================\n\n';
  txtContent += `Fecha de exportación: ${new Date().toLocaleString('es-ES')}\n`;
  txtContent += `Agente: Comida\n\n`;

  txtContent += 'RESUMEN EJECUTIVO\n';
  txtContent += '-----------------\n';
  Object.entries(data.summary).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    txtContent += `${label}: ${value}\n`;
  });
  txtContent += '\n';

  txtContent += 'DATOS HISTÓRICOS\n';
  txtContent += '----------------\n';
  data.historicalData.forEach(item => {
    txtContent += `${item.date}: ${item.conversations} conversaciones, ${item.messages} mensajes\n`;
  });
  txtContent += '\n';

  txtContent += 'DISTRIBUCIÓN DE INTENCIONES\n';
  txtContent += '---------------------------\n';
  data.allIntents.forEach(intent => {
    txtContent += `${intent.name}: ${intent.value}\n`;
  });
  txtContent += '\n';

  txtContent += 'ANÁLISIS DE SENTIMIENTO\n';
  txtContent += '----------------------\n';
  data.sentiments.forEach(sentiment => {
    txtContent += `${sentiment.name}: ${sentiment.value}\n`;
  });
  txtContent += '\n';

  txtContent += 'TOP CONSULTAS FRECUENTES\n';
  txtContent += '------------------------\n';
  data.topQueriesData.slice(0, 10).forEach((query, index) => {
    txtContent += `${index + 1}. "${query.query}" (${query.count} veces)\n`;
  });

  const blob = new Blob([txtContent], { type: 'text/plain' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.txt`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportToPDF = async (data: DashboardDataOutput, filename: string = 'dashboard-comida-data') => {
  // Create a temporary HTML element for PDF content
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.width = '210mm'; // A4 width
  tempDiv.style.padding = '20mm';
  tempDiv.style.fontFamily = 'Arial, sans-serif';
  tempDiv.style.fontSize = '12px';
  tempDiv.style.lineHeight = '1.5';
  tempDiv.style.backgroundColor = 'white';
  tempDiv.style.color = 'black';

  // Generate HTML content
  const timestamp = new Date().toLocaleString('es-ES');
  let htmlContent = `
    <div style="max-width: 170mm; margin: 0 auto;">
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #333; padding-bottom: 20px;">
        <h1 style="margin: 0; color: #333; font-size: 24px;">Dashboard de Analíticas - Agente Comida</h1>
        <p style="margin: 10px 0 0 0; color: #666; font-size: 14px;">Reporte de Datos - ${timestamp}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #3B82F6; padding-left: 10px;">Resumen Ejecutivo</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <tbody>
  `;

  Object.entries(data.summary).forEach(([key, value]) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    htmlContent += `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px; font-weight: bold; color: #555;">${label}</td>
        <td style="padding: 8px; text-align: right; color: #333;">${value}</td>
      </tr>
    `;
  });

  htmlContent += `
          </tbody>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #10B981; padding-left: 10px;">Distribución de Intenciones</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Intención</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
  `;

  data.allIntents.forEach(intent => {
    htmlContent += `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px; border: 1px solid #ddd;">${intent.name}</td>
        <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${intent.value}</td>
      </tr>
    `;
  });

  htmlContent += `
          </tbody>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #F59E0B; padding-left: 10px;">Análisis de Sentimiento</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Sentimiento</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Cantidad</th>
            </tr>
          </thead>
          <tbody>
  `;

  data.sentiments.forEach(sentiment => {
    htmlContent += `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px; border: 1px solid #ddd;">${sentiment.name}</td>
        <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${sentiment.value}</td>
      </tr>
    `;
  });

  htmlContent += `
          </tbody>
        </table>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #333; font-size: 18px; margin-bottom: 15px; border-left: 4px solid #6366F1; padding-left: 10px;">Top Consultas Frecuentes</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">#</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Consulta</th>
              <th style="padding: 10px; text-align: right; border: 1px solid #ddd;">Frecuencia</th>
            </tr>
          </thead>
          <tbody>
  `;

  data.topQueriesData.slice(0, 10).forEach((query, index) => {
    htmlContent += `
      <tr style="border-bottom: 1px solid #eee;">
        <td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">${index + 1}</td>
        <td style="padding: 8px; border: 1px solid #ddd; max-width: 300px; word-wrap: break-word;">${query.query}</td>
        <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">${query.count}</td>
      </tr>
    `;
  });

  htmlContent += `
          </tbody>
        </table>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 10px;">
        <p>Generado automáticamente desde el Dashboard de Analíticas</p>
        <p>${timestamp}</p>
      </div>
    </div>
  `;

  tempDiv.innerHTML = htmlContent;
  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: tempDiv.scrollWidth,
      height: tempDiv.scrollHeight
    });

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');

    // Calculate dimensions to fit A4
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = pdfHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pdf.internal.pageSize.getHeight();

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();
    }

    // Save the PDF
    pdf.save(`${filename}.pdf`);

  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Error al generar el PDF. Por favor, intenta nuevamente.');
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
};

const parseDate = (dateString: string): Date | null => {
    if (!dateString) return null;
    const cleanedDateString = dateString.trim().replace(/\\n/g, '');

    try {
        let date = new Date(cleanedDateString);
        if (!isNaN(date.getTime())) return date;
    } catch(e) {
        // Ignore and proceed to custom formats
    }

    const formats = [
        "dd/MM/yyyy HH:mm:ss",
        "M/d/yyyy, h:mm:ss a"
    ];

    for (const formatStr of formats) {
        try {
            const parsed = parse(cleanedDateString, formatStr, new Date());
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }
        } catch (e) {
            // Ignore and try next format
        }
    }

    console.warn(`Could not parse date: ${cleanedDateString}`);
    return null;
}

const renderActiveShape = (props: any) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 3}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        stroke="#ffffff"
        strokeWidth={2}
      />
    </g>
  );
};


const calculateSummaryMetrics = async (sheetData: any[], appointmentsData: any[]) => {
    // Extract unique conversation IDs
    const conversationIds = new Set(sheetData.map(row => row.conversacion_id));
    const totalConversations = conversationIds.size;
    const totalMessages = sheetData.length;

    // Calculate average response time per message (bot response speed)
    const responseTimes = sheetData
      .filter(row => row.start_time && row.end_time && row.user_message && row.agent_message)
      .map(row => {
        const startTime = new Date(row.start_time).getTime();
        const endTime = new Date(row.end_time).getTime();
        return (endTime - startTime) / 1000; // Convert to seconds
      })
      .filter(duration => duration > 0 && duration < 300); // Filter valid responses (less than 5 minutes)

    const avgResponseTimeSeconds = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    // Format average response time
    const responseMinutes = Math.floor(avgResponseTimeSeconds / 60);
    const responseSeconds = Math.round(avgResponseTimeSeconds % 60);
    const avgResponseTime = responseMinutes > 0
      ? `${responseMinutes}m ${responseSeconds}s`
      : `${responseSeconds}s`;

    // Calculate average conversation duration by conversation (total duration per conversation, then average)
    const conversationDurations = new Map<string, { startTime: number; endTime: number }>();

    sheetData.forEach(row => {
      const convId = row.conversacion_id;
      const startTime = row.start_time ? new Date(row.start_time).getTime() : null;
      const endTime = row.end_time ? new Date(row.end_time).getTime() : null;

      if (convId && startTime && endTime) {
        const existing = conversationDurations.get(convId);
        if (!existing) {
          conversationDurations.set(convId, { startTime, endTime });
        } else {
          // Update to include the full time span of the conversation
          existing.startTime = Math.min(existing.startTime, startTime);
          existing.endTime = Math.max(existing.endTime, endTime);
        }
      }
    });

    // Calculate duration for each conversation (total time from first to last message)
    const allConversationDurations = Array.from(conversationDurations.values())
      .map(conv => (conv.endTime - conv.startTime) / 1000) // Convert to seconds
      .filter(duration => duration > 0 && duration < 7200); // Filter valid durations (less than 2 hours)

    // Calculate average of conversation durations
    const avgConversationDurationSeconds = allConversationDurations.length > 0
      ? allConversationDurations.reduce((sum, duration) => sum + duration, 0) / allConversationDurations.length
      : 0;

    // Format average conversation duration
    const avgMinutes = Math.floor(avgConversationDurationSeconds / 60);
    const avgSeconds = Math.round(avgConversationDurationSeconds % 60);
    const avgConversationDuration = avgMinutes > 0
      ? `${avgMinutes}m ${avgSeconds}s`
      : `${avgSeconds}s`;

    const avgMsgPerConversation = totalConversations > 0 ? Math.round(totalMessages / totalConversations).toString() : '0';

    // Normalize appointment fields and process status data
    const normalizedAppointments = appointmentsData.map(apt => ({
        ...apt,
        Nombre: apt.Nombre || '',
        Estado: apt.Estado === 'ACTIVO' ? 'Activa' :
                apt.Estado === 'CANCELADO' ? 'Cancelada' :
                apt.Estado || 'Sin estado'
    }));

    const appointmentsByStatus = normalizedAppointments.reduce((acc, appointment) => {
        const status = appointment.Estado || 'Sin estado';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const scheduledAppointments = normalizedAppointments.length; // Total real appointments
    const confirmedAppointments = appointmentsByStatus['Activa'] || 0;
    const pendingAppointments = appointmentsByStatus['Pendiente'] || 0;
    const cancelledAppointments = appointmentsByStatus['Cancelada'] || 0;

    // Calculate escalations based on user message content
    const escalations = sheetData.filter(row => {
        const userMsg = typeof row.user_message === 'string' ? row.user_message.toLowerCase() : '';
        return userMsg.includes('humano') || userMsg.includes('agente') || userMsg.includes('persona');
    }).length;

    // Simple sentiment analysis for satisfaction rate
    const sentimentCounts = sheetData.reduce((acc, row) => {
        const sentiment = row.sentimiento || 'Neutro';
        let normalizedSentiment = 'Neutro';
        if (sentiment.toLowerCase().includes('positivo') || sentiment.toLowerCase().includes('positive')) {
            normalizedSentiment = 'Positivo';
        } else if (sentiment.toLowerCase().includes('negativo') || sentiment.toLowerCase().includes('negative')) {
            normalizedSentiment = 'Negativo';
        }
        acc[normalizedSentiment] = (acc[normalizedSentiment] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const totalSentiments = Object.values(sentimentCounts).reduce((sum, count) => sum + count, 0);
    const positiveSentiments = sentimentCounts['Positivo'] || 0;
    const satisfactionRate = totalSentiments > 0 ? `${Math.round((positiveSentiments / totalSentiments) * 100)}%` : '0%';

    return {
        totalConversations: String(totalConversations),
        scheduledAppointments: String(scheduledAppointments),
        totalMessages: String(totalMessages),
        escalations: String(escalations),
        avgMsgPerConversation,
        avgResponseTime,
        avgConversationDuration,
        satisfactionRate,
        confirmedAppointments: String(confirmedAppointments),
        pendingAppointments: String(pendingAppointments),
        cancelledAppointments: String(cancelledAppointments),
    };
};

const processSheetData = async (webhookData: WebhookResponse): Promise<DashboardDataOutput> => {
    const sheetData = webhookData.conversations || [];
    const appointmentsData = webhookData.appointments || [];

    // DEBUG: Log in processSheetData
    console.log('🔍 processSheetData input:');
    console.log('📊 sheetData length:', sheetData.length);
    console.log('📊 sheetData:', sheetData.slice(0, 2)); // First 2 items

    // Store original data for filtering
    const originalData = { conversations: sheetData, appointments: appointmentsData };

    // Normalize appointment fields and process status data
    const normalizedAppointments = appointmentsData.map(apt => ({
        ...apt,
        Nombre: apt.Nombre || '',
        Estado: apt.Estado === 'ACTIVO' ? 'Activa' :
                apt.Estado === 'CANCELADO' ? 'Cancelada' :
                apt.Estado || 'Sin estado'
    }));

    const appointmentsByStatus = normalizedAppointments.reduce((acc, appointment) => {
        const status = appointment.Estado || 'Sin estado';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const appointmentsByType = appointmentsData.reduce((acc, appointment) => {
        const type = appointment.Tipo || 'Sin tipo';
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const recentAppointments = normalizedAppointments
        .sort((a, b) => new Date(b['Fecha de inicio'] || '1970-01-01').getTime() - new Date(a['Fecha de inicio'] || 0).getTime())
        .slice(0, 10);
    const conversationIds = new Set(sheetData.map(row => row.conversacion_id));
    const totalConversations = conversationIds.size;
    const totalMessages = sheetData.length;

    // DEBUG: Log calculations in processSheetData
    console.log('📊 Calculations in processSheetData:');
    console.log('💯 totalMessages:', totalMessages);
    console.log('💯 totalConversations:', totalConversations);
    console.log('💯 conversationIds:', Array.from(conversationIds));

    const scheduledAppointments = normalizedAppointments.length; // Total real appointments
    const confirmedAppointments = appointmentsByStatus['Activa'] || 0;
    const pendingAppointments = appointmentsByStatus['Pendiente'] || 0;
    const cancelledAppointments = appointmentsByStatus['Cancelada'] || 0;
    // Calculate escalations based on user message content
    const escalations = sheetData.filter(row => {
        const userMsg = typeof row.user_message === 'string' ? row.user_message.toLowerCase() : '';
        return userMsg.includes('humano') || userMsg.includes('asesor');
    }).length;

    let totalInteractionSeconds = 0;
    sheetData.forEach(row => {
        const start = parseDate(row.start_time);
        const end = parseDate(row.end_time);
        if (start && end) {
            totalInteractionSeconds += Math.abs(differenceInSeconds(end, start));
        }
    });

    // Calculate average response time per message (bot response speed)
    const responseTimes = sheetData
      .filter(row => row.start_time && row.end_time && row.user_message && row.agent_message)
      .map(row => {
        const startTime = new Date(row.start_time).getTime();
        const endTime = new Date(row.end_time).getTime();
        return (endTime - startTime) / 1000; // Convert to seconds
      })
      .filter(duration => duration > 0 && duration < 300); // Filter valid responses (less than 5 minutes)

    const avgResponseTimeSeconds = responseTimes.length > 0
      ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
      : 0;

    // Format average response time
    const responseMinutes = Math.floor(avgResponseTimeSeconds / 60);
    const responseSeconds = Math.round(avgResponseTimeSeconds % 60);
    const avgResponseTime = responseMinutes > 0
      ? `${responseMinutes}m ${responseSeconds}s`
      : `${responseSeconds}s`;

    // Calculate average conversation duration by conversation (total duration per conversation, then average)
    const conversationDurations = new Map<string, { startTime: number; endTime: number }>();

    sheetData.forEach(row => {
      const convId = row.conversacion_id;
      const startTime = row.start_time ? new Date(row.start_time).getTime() : null;
      const endTime = row.end_time ? new Date(row.end_time).getTime() : null;

      if (convId && startTime && endTime) {
        const existing = conversationDurations.get(convId);
        if (!existing) {
          conversationDurations.set(convId, { startTime, endTime });
        } else {
          // Update to include the full time span of the conversation
          existing.startTime = Math.min(existing.startTime, startTime);
          existing.endTime = Math.max(existing.endTime, endTime);
        }
      }
    });

    // Calculate duration for each conversation (total time from first to last message)
    const allConversationDurations = Array.from(conversationDurations.values())
      .map(conv => (conv.endTime - conv.startTime) / 1000) // Convert to seconds
      .filter(duration => duration > 0 && duration < 7200); // Filter valid durations (less than 2 hours)

    // Calculate average of conversation durations
    const avgConversationDurationSeconds = allConversationDurations.length > 0
      ? allConversationDurations.reduce((sum, duration) => sum + duration, 0) / allConversationDurations.length
      : 0;

    // Format average conversation duration
    const avgMinutes = Math.floor(avgConversationDurationSeconds / 60);
    const avgSeconds = Math.round(avgConversationDurationSeconds % 60);
    const avgConversationDuration = avgMinutes > 0
      ? `${avgMinutes}m ${avgSeconds}s`
      : `${avgSeconds}s`;

    const avgMsgPerConversation = totalConversations > 0 ? Math.round(totalMessages / totalConversations).toString() : '0';

    // DEBUG: Log final calculations before return
    console.log('🎯 FINAL SUMMARY VALUES:');
    console.log('🏆 totalConversations for summary:', totalConversations);
    console.log('🏆 totalMessages for summary:', totalMessages);
    console.log('🏆 avgMsgPerConversation for summary:', avgMsgPerConversation);

    const historicalDataMap = new Map<string, { dateObj: Date, conversations: Set<string>; messages: number; intents: Record<string, number> }>();

    sheetData.forEach(row => {
        const startDate = parseDate(row.start_time);
        if (startDate) {
            const dateStr = format(startDate, 'MMM d', { locale: es });
            const entry = historicalDataMap.get(dateStr) || { dateObj: startDate, conversations: new Set(), messages: 0, intents: {} };

            entry.messages += 1;
            const convId = row.conversacion_id;
            if (convId) {
                entry.conversations.add(convId);
            }

            const intent = row.main_intent || 'SIN_INTENCION';
            entry.intents[intent] = (entry.intents[intent] || 0) + 1;

            historicalDataMap.set(dateStr, entry);
        }
    });


    const historicalData: ConversationData[] = Array.from(historicalDataMap.entries())
        .map(([date, data]) => ({
            date,
            dateObj: data.dateObj,
            conversations: data.conversations.size,
            messages: data.messages,
            intents: data.intents
        }))
        .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

    const queryCounts = sheetData.reduce((acc, row) => {
        if (row.user_message && typeof row.user_message === 'string') {
            const query = row.user_message.trim();
            if (query) {
                acc[query] = (acc[query] || 0) + 1;
            }
        }
        return acc;
    }, {} as Record<string, number>);

    const topQueriesData: TopQuery[] = Object.entries(queryCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 15)
        .map(([query, count]) => ({ query, count }));

    const hourlyActivityMap = new Array(24).fill(0).map((_, i) => ({
        hour: i,
        value: 0,
    }));
    sheetData.forEach(row => {
        const startDate = parseDate(row.start_time);
        if (startDate) {
            const hour = startDate.getHours();
            hourlyActivityMap[hour].value += 1;
        }
    });

    const MAIN_INTENTS = [
      'INFO_SERVICIOS',
      'SALUDO',
      'ESCALACION_HUMANO',
      'NUEVA_CITA',
      'CITA_EXISTENTE',
    ];

    const allIntentsCounts = sheetData.reduce((acc, row) => {
        const intent = row.main_intent || 'SIN_INTENCION';
        if (MAIN_INTENTS.includes(intent)) {
            acc[intent] = (acc[intent] || 0) + 1;
        }
        return acc;
    }, {} as Record<string, number>);

    const allIntents = Object.entries(allIntentsCounts)
        .map(([name, value], i) => ({ name: name.replace(/_/g, ' '), value, fill: INTENT_COLORS[i % INTENT_COLORS.length] }))
        .sort((a, b) => b.value - a.value);

    const intentFlowCounts: Record<string, number> = {};
    conversationIds.forEach(convId => {
        const flow = sheetData
            .filter(row => row.conversacion_id === convId)
            .sort((a, b) => (parseDate(a.start_time)?.getTime() || 0) - (parseDate(b.start_time)?.getTime() || 0))
            .map(row => row.main_intent || 'SIN_INTENCION')
            .filter(intent => intent !== 'SIN_INTENCION' && intent !== 'SALUDO')
            .slice(0, 3);

        if (flow.length > 1) {
            const flowKey = flow.join(' -> ');
            intentFlowCounts[flowKey] = (intentFlowCounts[flowKey] || 0) + 1;
        }
    });

    const intentFlows: IntentFlow[] = Object.entries(intentFlowCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3)
        .map(([flowKey, count]) => ({ flow: flowKey.split(' -> '), count }));


  // REAL SENTIMENT DATA FROM SHEET
    const sentimentAnalysisPromise = (async () => {
        // Count sentiments from the actual data
        const sentimentCounts = sheetData.reduce((acc, row) => {
            const sentiment = row.sentimiento || 'Neutro'; // Default to Neutro if not specified
            // Normalize sentiment names
            let normalizedSentiment = 'Neutro';
            if (sentiment.toLowerCase().includes('positivo') || sentiment.toLowerCase().includes('positive')) {
                normalizedSentiment = 'Positivo';
            } else if (sentiment.toLowerCase().includes('negativo') || sentiment.toLowerCase().includes('negative')) {
                normalizedSentiment = 'Negativo';
            }

            acc[normalizedSentiment] = (acc[normalizedSentiment] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        // Ensure all sentiment types exist
        const finalSentimentCounts = {
            Positivo: sentimentCounts.Positivo || 0,
            Neutro: sentimentCounts.Neutro || 0,
            Negativo: sentimentCounts.Negativo || 0,
        };

        const totalSentiments = finalSentimentCounts.Positivo + finalSentimentCounts.Negativo + finalSentimentCounts.Neutro;
        const satisfactionRate = totalSentiments > 0
            ? ((finalSentimentCounts.Positivo / totalSentiments) * 100).toFixed(0)
            : '0';

        const sentiments = [
            { name: 'Positivo', value: finalSentimentCounts.Positivo, icon: Smile },
            { name: 'Neutro', value: finalSentimentCounts.Neutro, icon: Meh },
            { name: 'Negativo', value: finalSentimentCounts.Negativo, icon: Frown },
        ];
        return { sentiments, satisfactionRate: `${satisfactionRate}%` };
    })();

      const engagementAnalysisPromise = (async () => {
        const engagementMetrics = [
            { name: 'Alto', value: 35, category: 'Engagement' },
            { name: 'Medio', value: 45, category: 'Engagement' },
            { name: 'Bajo', value: 20, category: 'Engagement' },
        ];
        return engagementMetrics;
    })();

    const [sentimentData, engagementData] = await Promise.all([sentimentAnalysisPromise, engagementAnalysisPromise]);


    return {
        summary: {
            totalConversations: String(totalConversations),
            scheduledAppointments: String(scheduledAppointments),
            totalMessages: String(totalMessages),
            escalations: String(escalations),
            avgMsgPerConversation,
            avgResponseTime,
            avgConversationDuration,
            satisfactionRate: sentimentData.satisfactionRate,
            confirmedAppointments: String(confirmedAppointments),
            pendingAppointments: String(pendingAppointments),
            cancelledAppointments: String(cancelledAppointments),
        },
        historicalData,
        topQueriesData,
        hourlyActivityData: hourlyActivityMap,
        allIntents,
        sentiments: sentimentData.sentiments,
        intentFlows,
        engagementMetrics: engagementData,
        appointmentsData: {
            total: appointmentsData.length,
            byStatus: appointmentsByStatus,
            byType: appointmentsByType,
            recentAppointments: recentAppointments,
        },
        originalData, // Store original data for filtering
    };
};


export default function DashboardComidaPage() {
  const [fullData, setFullData] = useState<DashboardDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState<string | null>(null);

  const [date, setDate] = useState<DateRange | undefined>();

  // Estado para filtros avanzados
  const [activeFilters, setActiveFilters] = useState<Record<string, (string | number)[]>>({});
  const [filteredConversationData, setFilteredConversationData] = useState<ConversationData[]>([]);
  const [filteredSummary, setFilteredSummary] = useState<DashboardDataOutput['summary'] | null>(null);
  const [filteredHourlyData, setFilteredHourlyData] = useState<DashboardDataOutput['hourlyActivityData']>([]);
  const [filteredSentiments, setFilteredSentiments] = useState<DashboardDataOutput['sentiments']>([]);
  const [activeSentimentIndex, setActiveSentimentIndex] = useState(0);

  // Estado para filtro de período de tiempo
  const [timeFilter, setTimeFilter] = useState<string>('all');
  const [customDateRange, setCustomDateRange] = useState<DateRange | undefined>();

  // Estado para el chat
  const [chatMessage, setChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{id: string, message: string, isUser: boolean}>>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const [activeIntentIndex, setActiveIntentIndex] = useState(0);
  const [activeEngagementIndex, setActiveEngagementIndex] = useState(0);
  const [volumeChartMetric, setVolumeChartMetric] = useState<'conversations' | 'messages'>('conversations');
  const [isExportOpen, setIsExportOpen] = useState(false);

  // ESTADOS PARA LA DATATABLE - AL PRINCIPIO DEL COMPONENTE
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

// Chart configuration for comparison chart
  const chartConfig = {
    general: {
      label: "Flujo General",
      color: "#FF6B35", // Naranja principal de comida
    },
    hoy: {
      label: "Actividad Hoy",
      color: "#FF8C42", // Naranja más claro para hoy
    },
  } satisfies ChartConfig;

// DATOS MOCK DE PEDIDOS (DEBE ESTAR ANTES DE LOS RETURNS CONDICIONALES)
  const mockPedidosData: PedidoRow[] = Array.from({ length: 46 }, (_, i) => ({
    id: i + 12,
    cliente_telefono: ["3004435894", "3115567890", "3109876543", "3152345678", "3128765432"][Math.floor(Math.random() * 5)],
    cliente_nombre: ["Jhon neider", "Maria Rodriguez", "Carlos Lopez", "Ana Martinez", "Diego Hernandez"][Math.floor(Math.random() * 5)],
    cliente_direccion: ["calle larga 67dc", "calle 79fallecs", "avenida principal 123", "carrera 5 #12-34", "transversal 8 #45-67"][Math.floor(Math.random() * 5)],
    productos: ["3 tacos al pastor 1 agua de horchata", "2 porciones de Birria carne en sus jugos y 1 horchata", "2 quesadillas con queso y 1 cerveza", "1 combo familiar y 2 horchatas", "2 tacos al pastor y 1 agua de tamarindo", "1 orden de nachos y 2 cervezas"][Math.floor(Math.random() * 6)],
    total_precio: String(Math.floor(Math.random() * 80000) + 20000),
    fecha_pedido: new Date(Date.now() - Math.floor(Math.random() * 72 * 60 * 60 * 1000)).toISOString()
  }));

// CALCULAR MÉTRICAS DE PEDIDOS
  const totalPedidos = mockPedidosData.length;
  const ingresosTotales = mockPedidosData.reduce((sum, p) => sum + parseInt(p.total_precio), 0);
  const ticketPromedio = totalPedidos > 0 ? Math.round(ingresosTotales / totalPedidos) : 0;

  const productosCount: Record<string, number> = {};
  mockPedidosData.forEach(pedido => {
    const productos = pedido.productos.split(' y ');
    productos.forEach(producto => {
      const match = producto.match(/\d+\s*(.+?)(?:\s*y|$)/);
      if (match) {
        const nombreProducto = match[1].trim();
        const cantidad = parseInt(producto);
        productosCount[nombreProducto] = (productosCount[nombreProducto] || 0) + cantidad;
      }
    });
  });

  const productosMasVendidos = Object.entries(productosCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([name, value]) => ({ name, value }));

  const categoriasCount: Record<string, number> = { tacos: 0, bebidas: 0, especialidades: 0 };
  mockPedidosData.forEach(pedido => {
    if (pedido.productos.toLowerCase().includes('taco')) categoriasCount.tacos++;
    if (pedido.productos.toLowerCase().includes('agua') || pedido.productos.toLowerCase().includes('refresco') || pedido.productos.toLowerCase().includes('cerveza')) categoriasCount.bebidas++;
    if (pedido.productos.toLowerCase().includes('birria') || pedido.productos.toLowerCase().includes('carnitas') || pedido.productos.toLowerCase().includes('cochinita')) categoriasCount.especialidades++;
  });

  const categoriasPopulares = Object.entries(categoriasCount).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  // Asegurar que siempre haya datos para la gráfica
  if (categoriasPopulares.length === 0) {
    categoriasPopulares.push(
      { name: "Tacos", value: 45 },
      { name: "Bebidas", value: 32 },
      { name: "Especialidades", value: 28 }
    );
  }

  const horariosCount: Record<number, number> = {};
  mockPedidosData.forEach(pedido => {
    const hora = new Date(pedido.fecha_pedido).getHours();
    horariosCount[hora] = (horariosCount[hora] || 0) + 1;
  });

  const horariosPico = Array.from({ length: 24 }, (_, i) => ({
    hour: i,
    value: horariosCount[i] || 0
  }));

  const pedidosMetrics = {
    totalPedidos,
    ingresosTotales,
    ticketPromedio,
    productosMasVendidos,
    categoriasPopulares,
    horariosPico,
    avgProductosPorPedido: totalPedidos > 0 ? Math.round(mockPedidosData.reduce((sum, p) => sum + p.productos.split(/\d+/).length - 1, 0) / totalPedidos) : 0
  };


  // Definiciones de columnas para la DataTable
  const pedidosColumns: ColumnDef<PedidoRow>[] = [
    {
      id: "select",
      header: "Select",
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">#{row.getValue("id")}</div>,
    },
    {
      accessorKey: "cliente_nombre",
      header: "Cliente",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.getValue("cliente_nombre")}</div>
          <div className="text-sm text-muted-foreground">{row.original.cliente_telefono}</div>
        </div>
      ),
    },
    {
      accessorKey: "productos",
      header: "Productos",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("productos")}>
          {row.getValue("productos")}
        </div>
      ),
    },
    {
      accessorKey: "total_precio",
      header: "Total",
      cell: ({ row }) => (
        <div className="font-medium">
          ${parseInt(row.getValue("total_precio")).toLocaleString('es-CO')}
        </div>
      ),
    },
    {
      accessorKey: "fecha_pedido",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("fecha_pedido"));
        return (
          <div>
            {date.toLocaleDateString('es-CO', {
              day: '2-digit',
              month: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const pedido = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(pedido.id.toString())}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer details</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ];

   const onSentimentPieEnter = (_: any, index: number) => {
    setActiveSentimentIndex(index);
  };
   const onIntentPieEnter = (_: any, index: number) => {
    setActiveIntentIndex(index);
  };
  const onEngagementPieEnter = (_: any, index: number) => {
    setActiveEngagementIndex(index);
  };


  // Funciones para manejar filtros
  const handleFilterChange = (groupId: string, values: (string | number)[]) => {
    setActiveFilters(prev => ({
      ...prev,
      [groupId]: values
    }));
  };

  const handleClearAllFilters = () => {
    setActiveFilters({});
  };

  const loadData = async () => {
    setIsLoading(true);
    setHasError(null);
    try {
        const response = await fetch(N8N_WEBHOOK_URL_COMIDA, {
            method: 'POST',
            headers: { 'Accept': 'application/json' },
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`n8n webhook responded with status ${response.status}: ${errorBody}`);
        }

        const responseText = await response.text();
        if (!responseText) {
          throw new Error("n8n webhook returned an empty response. Check if the 'Respond to Webhook' node is configured correctly.");
        }

        const rawData = JSON.parse(responseText);

        // DEBUG: Log raw webhook response
        console.log('🔍 RAW webhook response:', rawData);
        console.log('🔍 Is array?', Array.isArray(rawData));
        console.log('🔍 Length:', rawData.length);

        // Handle both old format (array) and new format (object with conversations/appointments)
        let webhookData: WebhookResponse;

        if (Array.isArray(rawData)) {
          // Check if this looks like mixed data or appointment data
          // Look for items that have appointment fields (Estado, Nombre, Calendario, etc.)
          const hasAppointmentItems = rawData.some(item =>
            item.hasOwnProperty('Estado') && item.hasOwnProperty('Nombre')
          );

          const hasConversationItems = rawData.some(item =>
            item.hasOwnProperty('conversacion_id') || item.hasOwnProperty('user_message')
          );

          console.log('🔍 hasAppointmentItems:', hasAppointmentItems);
          console.log('🔍 hasConversationItems:', hasConversationItems);

          if (hasAppointmentItems && hasConversationItems) {
            // Mixed data - we need to separate conversations and appointments
            const conversations = rawData.filter(item =>
              item.hasOwnProperty('conversacion_id') || item.hasOwnProperty('user_message')
            );
            const appointments = rawData.filter(item =>
              item.hasOwnProperty('Estado') && item.hasOwnProperty('Nombre')
            );

            console.log('🔍 Mixed data - conversations:', conversations.length);
            console.log('🔍 Mixed data - appointments:', appointments.length);
            webhookData = { conversations, appointments };
          } else if (hasAppointmentItems) {
            // Pure appointment data
            console.log('🔍 Pure appointment data');
            webhookData = { appointments: rawData };
          } else {
            // Old format - treat as conversations only
            console.log('🔍 Old format - conversations only');
            webhookData = { conversations: rawData };
          }
        } else if (rawData.conversations || rawData.appointments) {
          // New format - structured object
          console.log('🔍 New format - structured object');
          webhookData = rawData;
        } else {
          throw new Error("n8n returned data in an unexpected format. Expected an array or object with 'conversations' and/or 'appointments' fields.");
        }

        console.log('🔍 Final webhookData:', webhookData);
        console.log('🔍 webhookData.conversations length:', webhookData.conversations?.length || 0);

        const processedData = await processSheetData(webhookData);
        setFullData(processedData);

        if (processedData.historicalData.length > 0) {
            const firstDate = processedData.historicalData[0].dateObj;
            const lastDate = processedData.historicalData[processedData.historicalData.length - 1].dateObj;
            setDate({ from: firstDate, to: lastDate });
        } else {
            const defaultFrom = subDays(new Date(), 29);
            const defaultTo = new Date();
            setDate({ from: defaultFrom, to: defaultTo });
        }

    } catch (error) {
      console.error("Error in fetching or processing dashboard data:", error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      setHasError(`No se pudieron cargar los datos. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
     if (date?.from && date?.to && fullData?.historicalData) {
      const filtered = fullData.historicalData.filter((item) =>
        item.dateObj && isWithinInterval(item.dateObj, { start: date.from!, end: date.to! })
      );
      setFilteredConversationData(filtered);
    } else if (fullData?.historicalData) {
      // Si no hay filtro, usar todos los datos históricos
      setFilteredConversationData(fullData.historicalData);
    }
  
    // Calculate filtered summary metrics
    const calculateFilteredSummary = async () => {
      if (!fullData) {
        setFilteredSummary(null);
        setFilteredHourlyData([]);
        setFilteredSentiments([]);
        return;
      }

      // If no date filter, use original data
      if (!date?.from || !date?.to) {
        setFilteredSummary(fullData.summary);
        setFilteredHourlyData(fullData.hourlyActivityData);
        setFilteredSentiments(fullData.sentiments);
        return;
      }

      // Get original data source
      const originalSheetData = fullData.originalData?.conversations || [];
      const originalAppointmentsData = fullData.originalData?.appointments || [];

      // Filter original data based on the date range
      const filteredConversations = originalSheetData.filter(row => {
        const startDate = parseDate(row.start_time);
        return startDate && date?.from && date?.to && isWithinInterval(startDate, { start: date.from!, end: date.to! });
      });

      const filteredAppointments = originalAppointmentsData.filter(apt => {
        const startDate = parseDate(apt['Fecha de inicio']);
        return startDate && date?.from && date?.to && isWithinInterval(startDate, { start: date.from!, end: date.to! });
      });

      // Recalculate metrics for filtered data
      console.log('🔍 Filtered data recalculation:');
      console.log('📊 filteredConversations length:', filteredConversations.length);
      console.log('📊 filteredAppointments length:', filteredAppointments.length);
      console.log('📊 filteredConversations:', filteredConversations);

      const summary = await calculateSummaryMetrics(filteredConversations, filteredAppointments);
      console.log('🎯 New filtered summary:', summary);
      setFilteredSummary(summary);

      // Calculate filtered hourly activity data
      const hourlyMap = new Map<number, number>();
      filteredConversations.forEach(row => {
        if (row.start_time) {
          const startDate = parseDate(row.start_time);
          if (startDate) {
            const hour = startDate.getHours();
            hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
          }
        }
      });

      const filteredHourlyActivity = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        value: hourlyMap.get(i) || 0
      }));
      setFilteredHourlyData(filteredHourlyActivity);

      // Calculate filtered sentiment data
      const sentimentCounts = filteredConversations.reduce((acc, row) => {
        const sentiment = row.sentimiento || 'Neutro';
        let normalizedSentiment = 'Neutro';
        if (sentiment.toLowerCase().includes('positivo') || sentiment.toLowerCase().includes('positive')) {
          normalizedSentiment = 'Positivo';
        } else if (sentiment.toLowerCase().includes('negativo') || sentiment.toLowerCase().includes('negative')) {
          normalizedSentiment = 'Negativo';
        }
        acc[normalizedSentiment] = (acc[normalizedSentiment] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const filteredSentimentData = [
        { name: 'Positivo', value: sentimentCounts['Positivo'] || 0, icon: Smile },
        { name: 'Neutro', value: sentimentCounts['Neutro'] || 0, icon: Meh },
        { name: 'Negativo', value: sentimentCounts['Negativo'] || 0, icon: Frown },
      ];
      setFilteredSentiments(filteredSentimentData);
    };

    calculateFilteredSummary();
  }, [date, fullData]); // Removed filteredConversationData from dependencies


  // Helper function to get the appropriate summary (filtered or original)
  const getDisplaySummary = (dataValue: DashboardDataOutput | null) => {
    // Always use original data to avoid incorrect filtering
    return dataValue?.summary;
  };

  // Helper function to get the appropriate hourly data (filtered or original)
  const getDisplayHourlyData = (dataValue: DashboardDataOutput | null) => {
    // Always use original data to avoid incorrect filtering
    let hourlyData = dataValue?.hourlyActivityData || [];

    // Always ensure we have 24 hours of data
    if (hourlyData.length === 0) {
      hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        value: 0
      }));
    }

    return hourlyData;
  };

  // Function to get today's hourly activity data
  const getTodayHourlyData = (dataValue: DashboardDataOutput | null) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Filter today's conversations from the original data
    const originalConversations = dataValue?.originalData?.conversations || [];
    const todayConversations = originalConversations.filter(conv => {
      if (!conv.start_time) return false;
      const convDate = new Date(conv.start_time).toISOString().split('T')[0];
      return convDate === todayStr;
    });

    // Calculate hourly activity for today
    const todayHourlyActivity = Array.from({ length: 24 }, (_, i) => {
      const hourMessages = todayConversations.filter(conv => {
        if (!conv.start_time) return false;
        const convHour = new Date(conv.start_time).getHours();
        return convHour === i;
      });

      return {
        hour: i,
        value: hourMessages.length
      };
    });

    return todayHourlyActivity;
  };

  // Function to get comparison data (general vs today)
  const getComparisonData = (dataValue: DashboardDataOutput | null) => {
    const generalData = getDisplayHourlyData(dataValue);
    const todayData = getTodayHourlyData(dataValue);

    return Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      general: generalData[i]?.value || 0,
      hoy: todayData[i]?.value || 0
    }));
  };

  // Helper function to get the appropriate sentiment data (filtered or original)
  const getDisplaySentiments = (dataValue: DashboardDataOutput | null) => {
    // Always use original data to avoid incorrect filtering
    return dataValue?.sentiments || [];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background text-foreground p-4">
        <Loader className="h-6 w-6 animate-spin text-primary" />
        <p className="text-muted-foreground text-center text-sm">Cargando y analizando datos...</p>
      </div>
    );
  }

  if (hasError) {
     return (
      <div className="flex flex-col items-center justify-center h-screen text-center gap-4 p-4 bg-background text-foreground">
        <ServerCrash className="h-8 w-8 text-destructive" />
        <h2 className="text-lg font-semibold">Error al Cargar los Datos</h2>
        <p className="text-muted-foreground max-w-md text-sm">
          {hasError}
        </p>
        <Button onClick={loadData} disabled={isLoading}>
            {isLoading ? <><Loader className="mr-2 h-3 w-3 animate-spin" /> Cargando...</> : <><RefreshCw className="mr-2 h-3 w-3" /> Intentar de Nuevo</>}
        </Button>
      </div>
    );
  }

  // Usar solo los datos reales del webhook, sin fallback
  const data = fullData;

  // Calculate metrics dynamically from real webhook data
  const calculateFromWebhookData = () => {
    // Usar los datos procesados directamente del webhook
    if (fullData?.summary) {
      return {
        totalMessages: fullData.summary.totalMessages || '0',
        totalConversations: fullData.summary.totalConversations || '0',
        avgMsgPerConversation: fullData.summary.avgMsgPerConversation || '0'
      };
    }

    // Si no hay datos, mostrar vacíos (no ceros de prueba)
    return {
      totalMessages: '--',
      totalConversations: '--',
      avgMsgPerConversation: '--'
    };
  };

  const realMetrics = calculateFromWebhookData();

  // Fallback data structure
  const fallbackData = {
    sentiments: [
      { name: 'Positivo', value: 0, icon: Smile },
      { name: 'Neutro', value: 0, icon: Meh },
      { name: 'Negativo', value: 0, icon: Frown },
    ],
    intentFlows: [],
    engagementMetrics: [],
    appointmentsData: {
      total: 0,
      byStatus: {},
      byType: {},
      recentAppointments: [],
    },
  };

  // Configuración para las métricas mejoradas
  const metricsGroups = [
    {
      title: 'Métricas Principales de Conversación',
      description: 'Indicadores clave del rendimiento del chatbot',
      badge: { text: 'Tiempo Real', variant: 'default' as const },
      metrics: [
        {
          label: 'Conversaciones Totales',
          value: realMetrics.totalConversations,
          change: 12,
          changeType: 'increase' as const,
          icon: <Bot className="h-4 w-4" />,
          color: 'success' as const,
          description: 'Últimos 30 días'
        },
        {
          label: 'Mensajes Enviados',
          value: realMetrics.totalMessages,
          change: 8,
          changeType: 'increase' as const,
          icon: <MessageSquare className="h-4 w-4" />,
          color: 'success' as const,
          description: 'Mensajes totales procesados'
        },
        {
          label: 'Citas Agendadas',
          value: data?.summary.scheduledAppointments || '0',
          change: 15,
          changeType: 'increase' as const,
          icon: <CalendarDays className="h-4 w-4" />,
          color: 'info' as const,
          description: 'Citas confirmadas'
        },
        {
          label: 'Escalaciones a Humano',
          value: data?.summary.escalations || '0',
          change: -5,
          changeType: 'decrease' as const,
          icon: <AlertCircle className="h-4 w-4" />,
          color: 'warning' as const,
          description: 'Transferencias a operadores'
        },
        {
          label: 'Prom. Mensajes/Conversación',
          value: realMetrics.avgMsgPerConversation,
          icon: <BarChart3 className="h-4 w-4" />,
          color: 'info' as const,
          description: 'Eficiencia de comunicación'
        },
        {
          label: 'Tasa de Satisfacción',
          value: data?.summary.satisfactionRate || '0%',
          change: 3,
          changeType: 'increase' as const,
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'success' as const,
          description: 'Satisfacción del cliente'
        }
      ]
    },
    {
      title: 'Métricas de Rendimiento',
      description: 'Tiempos de respuesta y eficiencia del sistema',
      metrics: [
        {
          label: 'Tiempo Prom. de Respuesta',
          value: data?.summary.avgResponseTime || '0s',
          icon: <Clock className="h-4 w-4" />,
          color: 'info' as const,
          description: 'Tiempo medio de respuesta'
        },
        {
          label: 'Citas Confirmadas',
          value: data?.summary.confirmedAppointments || '0',
          icon: <CheckCircle className="h-4 w-4" />,
          color: 'success' as const,
          description: 'Citas aprobadas'
        },
        {
          label: 'Citas Pendientes',
          value: data?.summary.pendingAppointments || '0',
          icon: <Activity className="h-4 w-4" />,
          color: 'warning' as const,
          description: 'Esperando confirmación'
        },
        {
          label: 'Citas Canceladas',
          value: data?.summary.cancelledAppointments || '0',
          icon: <XCircle className="h-4 w-4" />,
          color: 'error' as const,
          description: 'Cancelaciones registradas'
        }
      ]
    }
  ];

  // Configuración para filtros avanzados
  const filterGroups = [
    {
      id: 'status',
      label: 'Estado',
      icon: <Activity className="h-4 w-4" />,
      multiSelect: true,
      options: [
        { id: 'active', label: 'Activo', value: 'active', count: 45 },
        { id: 'pending', label: 'Pendiente', value: 'pending', count: 12 },
        { id: 'completed', label: 'Completado', value: 'completed', count: 89 },
        { id: 'cancelled', label: 'Cancelado', value: 'cancelled', count: 5 }
      ]
    },
    {
      id: 'intent',
      label: 'Intención',
      icon: <Target className="h-4 w-4" />,
      multiSelect: true,
      options: [
        { id: 'info', label: 'Info Servicios', value: 'info', count: 34 },
        { id: 'appointment', label: 'Nueva Cita', value: 'appointment', count: 28 },
        { id: 'greeting', label: 'Saludo', value: 'greeting', count: 18 },
        { id: 'escalation', label: 'Escalación', value: 'escalation', count: 8 },
        { id: 'existing', label: 'Cita Existente', value: 'existing', count: 12 },
        { id: 'general', label: 'Consulta General', value: 'general', count: 15 }
      ]
    },
    {
      id: 'sentiment',
      label: 'Sentimiento',
      icon: <Users className="h-4 w-4" />,
      multiSelect: false,
      options: [
        { id: 'positive', label: 'Positivo', value: 'positive', count: 67 },
        { id: 'neutral', label: 'Neutro', value: 'neutral', count: 45 },
        { id: 'negative', label: 'Negativo', value: 'negative', count: 8 }
      ]
    },
    {
      id: 'timeRange',
      label: 'Rango de Tiempo',
      icon: <CalendarDays className="h-4 w-4" />,
      multiSelect: false,
      options: [
        { id: 'today', label: 'Hoy', value: 'today' },
        { id: 'week', label: 'Última Semana', value: 'week' },
        { id: 'month', label: 'Último Mes', value: 'month' },
        { id: 'quarter', label: 'Último Trimestre', value: 'quarter' }
      ]
    }
  ];

  const legendFormatter = (value: string) => <span className="text-foreground/80">{value}</span>;

  const valueFormatter = (value: number) => (
    <span style={{ color: 'hsl(var(--primary))', fontWeight: 'bold' }}>
      {value}
    </span>
  );


  const totalIntents = data?.allIntents?.reduce((acc, curr) => acc + curr.value, 0) || 0;

  // Funciones de filtrado de tiempo
  const applyTimeFilter = (filter: string) => {
    setTimeFilter(filter);

    if (!fullData) return;

    const now = new Date();
    let startDate: Date;

    switch (filter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case '7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'currentMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'currentYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case 'all':
      default:
        startDate = new Date(0); // Muy antigua para incluir todo
        break;
    }

    // Aplicar filtro a los datos históricos
    const filteredHistorical = fullData.historicalData.filter(item =>
      item.dateObj >= startDate && item.dateObj <= now
    );

    setFilteredConversationData(filteredHistorical);
    setDate({ from: startDate, to: now });
  };

  const clearTimeFilter = () => {
    setTimeFilter('all');
    if (fullData && fullData.historicalData.length > 0) {
      setFilteredConversationData(fullData.historicalData);
      const firstDate = fullData.historicalData[0].dateObj;
      const lastDate = fullData.historicalData[fullData.historicalData.length - 1].dateObj;
      setDate({ from: firstDate, to: lastDate });
    }
  };

  const applyCustomDateFilter = () => {
    if (!customDateRange || !customDateRange.from || !fullData) return;

    setTimeFilter('custom');
    const startDate = customDateRange.from;
    const endDate = customDateRange.to || new Date();

    // Aplicar filtro a los datos históricos
    const filteredHistorical = fullData.historicalData.filter(item =>
      item.dateObj >= startDate && item.dateObj <= endDate
    );

    setFilteredConversationData(filteredHistorical);
    setDate({ from: startDate, to: endDate });
  };

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isChatLoading) return;

    const userMessage = {
      id: Date.now().toString(),
      message: chatMessage.trim(),
      isUser: true
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsChatLoading(true);

    try {
      // Simular respuesta del bot (conectar con webhook real después)
      setTimeout(() => {
        const botResponse = {
          id: (Date.now() + 1).toString(),
          message: "Entendido. Estoy procesando tu mensaje y te responderé en breve.",
          isUser: false
        };
        setChatMessages(prev => [...prev, botResponse]);
        setIsChatLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsChatLoading(false);
    }
  };

  const tooltipStyle = {
      contentStyle: {
          backgroundColor: 'hsl(var(--card))',
          borderColor: 'hsl(var(--border))',
          borderRadius: 'var(--radius)',
          backdropFilter: 'blur(12px)',
          background: 'hsl(var(--card) / 0.95)',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          zIndex: 9999,
      },
      labelStyle: {
          color: 'hsl(var(--card-foreground))',
          marginBottom: '0.5rem',
          fontWeight: 'bold'
      },
      itemStyle: {
          color: 'hsl(var(--card-foreground))',
      }
  };

// Funciones para generar datos mock de pedidos
  const generateMockPedidos = (): PedidoRow[] => {
    const productos = [
      "3 tacos al pastor 1 agua de horchata",
      "2 porciones de Birria carne en sus jugos y 1 horchata",
      "2 quesadillas con queso y 1 cerveza",
      "1 combo familiar y 2 horchatas",
      "2 tacos al pastor y 1 agua de tamarindo",
      "4 tacos de carnitas y 2 refrescos",
      "1 plato de cochinita pibil y 1 agua de jamaica",
      "3 tacos al pastor y 1 cerveza",
      "2 birria tacos y 1 horchata",
      "5 tacos al pastor y 2 aguas",
      "1 especialidad de carnitas y 1 refresco",
      "4 tacos de birria y 1 cerveza",
      "2 cochinita tacos y 2 horchatas",
      "3 tacos al pastor y 1 agua de tamarindo",
      "2 quesadillas con queso y 1 refresco",
      "1 plato de birria y 1 cerveza",
      "3 tacos de carnitas y 1 horchata",
      "4 tacos al pastor y 2 cervezas",
      "2 especialidades y 1 agua",
      "5 tacos birria y 2 horchatas",
      "3 cochinita tacos y 1 refresco",
      "1 orden de nachos y 2 cervezas"
    ];

    const direcciones = [
      "calle larga 67dc",
      "calle 79fallecs",
      "avenida principal 123",
      "carrera 5 #12-34",
      "transversal 8 #45-67"
    ];

    const clientes = [
      "Jhon neider",
      "Maria Rodriguez",
      "Carlos Lopez",
      "Ana Martinez",
      "Diego Hernandez"
    ];

    const telefonos = [
      "3004435894",
      "3115567890",
      "3109876543",
      "3152345678",
      "3128765432"
    ];

    const pedidos: PedidoRow[] = [];
    const now = new Date();

    for (let i = 0; i < 46; i++) {
      const hoursAgo = Math.floor(Math.random() * 72); // Últimas 72 horas
      const pedidoTime = new Date(now.getTime() - (hoursAgo * 60 * 60 * 1000));

      pedidos.push({
        id: i + 12,
        cliente_telefono: telefonos[Math.floor(Math.random() * telefonos.length)],
        cliente_nombre: clientes[Math.floor(Math.random() * clientes.length)],
        cliente_direccion: direcciones[Math.floor(Math.random() * direcciones.length)],
        productos: productos[Math.floor(Math.random() * productos.length)],
        total_precio: String(Math.floor(Math.random() * 80000) + 20000), // 20k-100k
        fecha_pedido: pedidoTime.toISOString()
      });
    }

    return pedidos;
  };

  // Calcular métricas de pedidos
  
  // Datos mock de pedidos (simplificado para evitar problemas de hooks)
  const mockPedidosDataData: PedidoRow[] = Array.from({ length: 46 }, (_, i) => ({
    id: i + 12,
    cliente_telefono: ["3004435894", "3115567890", "3109876543", "3152345678", "3128765432"][Math.floor(Math.random() * 5)],
    cliente_nombre: ["Jhon neider", "Maria Rodriguez", "Carlos Lopez", "Ana Martinez", "Diego Hernandez"][Math.floor(Math.random() * 5)],
    cliente_direccion: ["calle larga 67dc", "calle 79fallecs", "avenida principal 123", "carrera 5 #12-34", "transversal 8 #45-67"][Math.floor(Math.random() * 5)],
    productos: ["3 tacos al pastor 1 agua de horchata", "2 porciones de Birria carne en sus jugos y 1 horchata", "2 quesadillas con queso y 1 cerveza", "1 combo familiar y 2 horchatas", "2 tacos al pastor y 1 agua de tamarindo", "1 orden de nachos y 2 cervezas"][Math.floor(Math.random() * 6)],
    total_precio: String(Math.floor(Math.random() * 80000) + 20000),
    fecha_pedido: new Date(Date.now() - Math.floor(Math.random() * 72 * 60 * 60 * 1000)).toISOString()
  }));

  // Calcular métricas de pedidos

  return (
    <div className="min-h-screen bg-background hide-scrollbar">
      <div className="container mx-auto px-4 py-6 w-full">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard de Analíticas - Comida</h1>
            <p className="text-sm text-muted-foreground mt-1">Visión general de conversaciones</p>
          </div>

          {/* Controles */}
          <div className="flex flex-row gap-2 sm:flex-row">
            <Button
              onClick={loadData}
              disabled={isLoading}
              size="sm"
              variant="outline"
            >
              {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              Actualizar
            </Button>

            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtros
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Período de Tiempo</div>
                  <div className="grid gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs"
                      onClick={() => applyTimeFilter('today')}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      Hoy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs"
                      onClick={() => applyTimeFilter('7days')}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      Últimos 7 días
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs"
                      onClick={() => applyTimeFilter('30days')}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      Últimos 30 días
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs"
                      onClick={() => applyTimeFilter('3months')}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      Últimos 3 meses
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs"
                      onClick={() => applyTimeFilter('currentMonth')}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      Mes actual
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs"
                      onClick={() => applyTimeFilter('currentYear')}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      Año actual
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs"
                      onClick={() => {
                        // Abrir el popover de selección de fechas personalizadas
                        const customDateButton = document.getElementById('custom-date-button');
                        if (customDateButton) {
                          customDateButton.click();
                        }
                      }}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      Personalizado
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs"
                      onClick={() => applyTimeFilter('all')}
                    >
                      <CalendarDays className="mr-2 h-3 w-3" />
                      Todos los datos
                    </Button>
                  </div>
                  <div className="pt-2 border-t">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="justify-start h-8 text-xs w-full"
                      onClick={() => clearTimeFilter()}
                    >
                      Limpiar filtros
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-48">
                <div className="grid gap-1">
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => data && exportToCSV(data, 'dashboard-csv')}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    CSV
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => data && exportToJSON(data, 'dashboard-json')}>
                    <File className="mr-2 h-4 w-4" />
                    JSON
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" onClick={() => data && exportToPDF(data, 'dashboard-pdf')}>
                    <FileText className="mr-2 h-4 w-4" />
                    PDF
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

        {/* Popover oculto para selector de fechas personalizado */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="custom-date-button"
              size="sm"
              variant="outline"
              className="hidden"
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Fechas Personalizadas
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <div className="p-4">
              <div className="text-sm font-medium mb-3">Seleccionar Rango de Fechas</div>
              <Calendar
                mode="range"
                selected={customDateRange}
                onSelect={setCustomDateRange}
                numberOfMonths={2}
                locale={es}
                className="rounded-md border"
              />
              <div className="flex justify-between items-center mt-4 pt-3 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCustomDateRange(undefined);
                  }}
                >
                  Limpiar
                </Button>
                <Button
                  size="sm"
                  onClick={applyCustomDateFilter}
                  disabled={!customDateRange || !customDateRange.from}
                >
                  Aplicar Filtro
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        </header>

        {/* Pestañas de Navegación */}
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-48 grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="pedidos" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Pedidos
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Chat */}
          <TabsContent value="chat" className="space-y-6">
            {/* Métricas de Chat - 5 Tarjetas con Colores Naranja */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                <Bot className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversaciones</p>
                <p className="text-2xl font-bold text-[#FF6B35]">{getDisplaySummary(data)?.totalConversations || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                <MessageSquare className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Mensajes</p>
                <p className="text-2xl font-bold text-[#FF6B35]">{getDisplaySummary(data)?.totalMessages || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                <BarChart3 className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Prom. Msg/Conv</p>
                <p className="text-2xl font-bold text-[#FF6B35]">{getDisplaySummary(data)?.avgMsgPerConversation || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                <AlertCircle className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Escalados</p>
                <p className="text-2xl font-bold text-[#FF6B35]">{getDisplaySummary(data)?.escalations || '0'}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                <Clock className="h-5 w-5 text-[#FF6B35]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tiempo Respuesta</p>
                <p className="text-2xl font-bold text-[#FF6B35]">{getDisplaySummary(data)?.avgResponseTime || '0s'}</p>
              </div>
            </div>
          </Card>

          </div>

        {/* Gráficas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Volumen Diario */}
          <Card className="p-3">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-medium">Volumen Diario</h3>
                <p className="text-xs text-muted-foreground">
                  {volumeChartMetric === 'conversations' ? 'Conversaciones' : 'Mensajes'} por día
                </p>
              </div>
              {/* Botón de toggle */}
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant={volumeChartMetric === 'conversations' ? 'default' : 'outline'}
                  onClick={() => setVolumeChartMetric('conversations')}
                  className="text-xs h-7 px-2"
                  style={{
                    backgroundColor: volumeChartMetric === 'conversations' ? COMIDA_COLORS.primary : 'transparent',
                    borderColor: volumeChartMetric === 'conversations' ? COMIDA_COLORS.primary : COMIDA_COLORS.primaryLight,
                    color: volumeChartMetric === 'conversations' ? 'white' : COMIDA_COLORS.primary,
                  }}
                >
                  Conversaciones
                </Button>
                <Button
                  size="sm"
                  variant={volumeChartMetric === 'messages' ? 'default' : 'outline'}
                  onClick={() => setVolumeChartMetric('messages')}
                  className="text-xs h-7 px-2"
                  style={{
                    backgroundColor: volumeChartMetric === 'messages' ? COMIDA_COLORS.primary : 'transparent',
                    borderColor: volumeChartMetric === 'messages' ? COMIDA_COLORS.primary : COMIDA_COLORS.primaryLight,
                    color: volumeChartMetric === 'messages' ? 'white' : COMIDA_COLORS.primary,
                  }}
                >
                  Mensajes
                </Button>
              </div>
            </div>
            <div className="h-[200px] pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredConversationData.length > 0 ? filteredConversationData : data?.historicalData || []}>
                  <CartesianGrid className="stroke-muted/20" strokeDasharray="2 2" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    cursor={false}
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        return (
                          <div className="rounded-lg border bg-popover p-2 text-popover-foreground shadow-md text-xs">
                            <div className="font-medium">{payload[0].payload.date}</div>
                            <div className="text-muted-foreground">
                              {payload[0].value} {volumeChartMetric === 'conversations' ? 'conversaciones' : 'mensajes'}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar
                    dataKey={volumeChartMetric}
                    fill={COMIDA_COLORS.primary}
                    radius={[2, 2, 0, 0]}
                    style={{ cursor: 'default' }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
{/* Distribución de Sentimientos */}
          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium">Sentimientos</h3>
                <p className="text-xs text-muted-foreground">Distribución de sentimientos</p>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={getDisplaySentiments(data)}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {getDisplaySentiments(data).map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        className={
                          entry.name === 'Positivo' ? 'fill-green-500' :
                          entry.name === 'Negativo' ? 'fill-red-500' : 'fill-amber-500'
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload[0]) {
                        return (
                          <div className="rounded-lg border bg-popover p-2 text-popover-foreground shadow-md text-xs">
                            <div className="font-medium">{payload[0].name}</div>
                            <div className="text-muted-foreground">
                              {payload[0].value} mensajes
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-3 mt-2">
              {data?.sentiments.map((sentiment) => (
                <div key={sentiment.name} className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${
                    sentiment.name === 'Positivo' ? 'bg-green-500' :
                    sentiment.name === 'Negativo' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                  <span className="text-xs text-muted-foreground">{sentiment.name}</span>
                </div>
              ))}
            </div>
          </Card>
          {/* Embudo de Conversión */}
          <Card className="p-3">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium">Embudo de Ventas</h3>
                <p className="text-xs text-muted-foreground">Proceso de conversión de usuarios</p>
              </div>
            </div>
            <div className="h-[235px] w-full rounded p-3">
              <div className="space-y-1">
                {/* Etapa 1: Visitantes Web - 100% */}
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600 pr-2">Visitantes Web</div>
                  <div className="flex-1">
                    <div className="bg-orange-500 h-6 rounded flex items-center justify-center text-white text-sm font-bold">
                      1,250
                    </div>
                  </div>
                  <div className="w-12 text-xs text-gray-500 pl-2 text-right">100%</div>
                </div>

                {/* Etapa 2: Inician Chat - 71.2% */}
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600 pr-2">Inician Chat</div>
                  <div className="flex-1">
                    <div className="bg-orange-400 h-6 rounded flex items-center justify-center text-white text-sm font-bold ml-8" style={{ width: '71.2%' }}>
                      890
                    </div>
                  </div>
                  <div className="w-12 text-xs text-gray-500 pl-2 text-right">71.2%</div>
                </div>

                {/* Etapa 3: Ven Menú - 82.5% del anterior */}
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600 pr-2">Ven Menú</div>
                  <div className="flex-1">
                    <div className="bg-orange-300 h-6 rounded flex items-center justify-center text-gray-800 text-sm font-bold ml-12" style={{ width: '58.7%' }}>
                      734
                    </div>
                  </div>
                  <div className="w-12 text-xs text-gray-500 pl-2 text-right">58.7%</div>
                </div>

                {/* Etapa 4: Agregan Productos */}
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600 pr-2">Agregan</div>
                  <div className="flex-1">
                    <div className="bg-orange-200 h-6 rounded flex items-center justify-center text-gray-800 text-sm font-bold ml-16" style={{ width: '33.8%' }}>
                      423
                    </div>
                  </div>
                  <div className="w-12 text-xs text-gray-500 pl-2 text-right">33.8%</div>
                </div>

                {/* Etapa 5: Inician Pedido */}
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600 pr-2">Inician</div>
                  <div className="flex-1">
                    <div className="bg-orange-100 h-6 rounded flex items-center justify-center text-gray-800 text-sm font-bold ml-20" style={{ width: '23.0%' }}>
                      287
                    </div>
                  </div>
                  <div className="w-12 text-xs text-gray-500 pl-2 text-right">23.0%</div>
                </div>

                {/* Etapa 6: Confirman Orden */}
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600 pr-2">Confirman</div>
                  <div className="flex-1">
                    <div className="bg-orange-50 border border-orange-200 h-6 rounded flex items-center justify-center text-gray-800 text-sm font-bold ml-24" style={{ width: '15.8%' }}>
                      198
                    </div>
                  </div>
                  <div className="w-12 text-xs text-gray-500 pl-2 text-right">15.8%</div>
                </div>

                {/* Etapa 7: Completan Pago */}
                <div className="flex items-center">
                  <div className="w-24 text-xs text-gray-600 pr-2">Completan</div>
                  <div className="flex-1">
                    <div className="bg-orange-50 border border-orange-300 h-8 rounded flex items-center justify-center text-gray-800 text-sm font-bold ml-28" style={{ width: '12.5%' }}>
                      156
                    </div>
                  </div>
                  <div className="w-12 text-xs text-orange-600 pl-2 text-right font-bold">12.5%</div>
                </div>
              </div>
            </div>
                      </Card>

          
        </div>

        {/* Layout 75/25: Flujo de Actividad + Chat */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Gráfica de Flujo de Actividad (75%) */}
          <div className="md:col-span-3">
            <Card className="p-3 h-full">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-xs font-medium">Flujo de Actividad</h3>
                  <p className="text-xs text-muted-foreground">General vs Hoy</p>
                </div>
              </div>
              <div className="h-[256px]">
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <AreaChart
                    accessibilityLayer
                    data={getComparisonData(data)}
                    margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="2 2" className="stroke-muted/20" />
                    <XAxis
                      dataKey="hour"
                      tick={{ fontSize: 7 }}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={2}
                      tickFormatter={(value) => {
                        const hour = Number(value);
                        return `${hour}`; // Mostrar todas las horas (0, 1, 2, 3, ..., 23)
                      }}
                    />
                    <YAxis hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <defs>
                      <linearGradient id="fillGeneral" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-general)" stopOpacity={0.6} />
                        <stop offset="95%" stopColor="var(--color-general)" stopOpacity={0.1} />
                      </linearGradient>
                      <linearGradient id="fillHoy" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-hoy)" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="var(--color-hoy)" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area
                      dataKey="general"
                      type="monotone"
                      fill="url(#fillGeneral)"
                      fillOpacity={0.3}
                      stroke="var(--color-general)"
                      strokeWidth={0.5}
                    />
                    <Area
                      dataKey="hoy"
                      type="monotone"
                      fill="url(#fillHoy)"
                      fillOpacity={0.5}
                      stroke="var(--color-hoy)"
                      strokeWidth={0.5}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </Card>
          </div>

          {/* Chat Minimalista (25%) */}
          <div className="md:col-span-1">
            <Card className="p-3 h-full flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-medium">Chat</h3>
                  <p className="text-xs text-muted-foreground">Asistente virtual - Comida</p>
                </div>
              </div>

              {/* Área de mensajes */}
              <div className="flex-1 mb-3 min-h-[200px] max-h-[250px] overflow-y-auto">
                <div className="space-y-2">
                  {chatMessages.length === 0 ? (
                    <div className="text-center text-muted-foreground text-xs py-8">
                      <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Envía un mensaje para comenzar</p>
                    </div>
                  ) : (
                    chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] ${msg.isUser ? 'order-2' : 'order-1'}`}>
                          <div className={`px-3 py-2 rounded-lg text-xs ${
                            msg.isUser
                              ? ''
                              : 'bg-muted text-muted-foreground'
                          }`}
                          style={{
                            backgroundColor: msg.isUser ? COMIDA_COLORS.primary : undefined,
                            color: msg.isUser ? 'white' : undefined,
                          }}>
                            {msg.message}
                          </div>
                        </div>
                        <div className={`w-6 h-6 ${msg.isUser ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className={`text-[10px] ${
                              msg.isUser ? '' : 'bg-muted'
                            }`}
                            style={{
                              backgroundColor: msg.isUser ? COMIDA_COLORS.primary : undefined,
                              color: msg.isUser ? 'white' : undefined,
                            }}>
                              {msg.isUser ? 'Tú' : 'AI'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      </div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-center space-x-2 text-muted-foreground text-xs">
                        <div className="w-6 h-6">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="bg-muted">AI</AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Input del chat */}
              <div className="flex space-x-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 text-xs"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  disabled={isChatLoading}
                />
                <Button
                  size="sm"
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || isChatLoading}
                  className="px-3"
                  style={{
                    backgroundColor: COMIDA_COLORS.primary,
                    borderColor: COMIDA_COLORS.primary,
                  }}
                >
                  {isChatLoading ? (
                    <Loader className="h-3 w-3 animate-spin" />
                  ) : (
                    <MessageCircle className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </Card>
          </div>
        </div>
          </TabsContent>

          {/* Pestaña de Pedidos */}
          <TabsContent value="pedidos" className="space-y-6">
            {/* Métricas de Pedidos - 5 Tarjetas */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                    <Package className="h-5 w-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Pedidos</p>
                    <p className="text-2xl font-bold text-[#FF6B35]">{pedidosMetrics.totalPedidos}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                    <DollarSign className="h-5 w-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ingresos Totales</p>
                    <p className="text-2xl font-bold text-[#FF6B35]">$1.358.000</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                    <Receipt className="h-5 w-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Valor pedido promedio</p>
                    <p className="text-2xl font-bold text-[#FF6B35]">$65.000</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                    <Coffee className="h-5 w-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Prod. por Pedido</p>
                    <p className="text-2xl font-bold text-[#FF6B35]">{pedidosMetrics.avgProductosPorPedido}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-lg bg-gradient-to-br from-[#FF6B35]/20 to-[#FF4500]/20">
                    <TrendingUp className="h-5 w-5 text-[#FF6B35]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Top Producto</p>
                    <p className="text-2xl font-bold text-[#FF6B35]">taco al pastor</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Gráficas de Pedidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Productos Más Vendidos */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Productos Más Vendidos</h3>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <TrendingUp className="h-3 w-3" />
                  </Button>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={pedidosMetrics.productosMasVendidos}>
                      <CartesianGrid className="stroke-muted/20" strokeDasharray="2 2" />
                      <XAxis
                        tick={false}
                        axisLine={false}
                      />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            return (
                              <div className="rounded-lg border bg-popover p-2 text-popover-foreground shadow-md text-xs">
                                <div className="font-medium">{payload[0].payload.name}</div>
                                <div className="text-muted-foreground">
                                  {payload[0].value} unidades
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="value" fill="#FF6B35" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Categorías Populares */}
              <Card className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Categorías Populares</h3>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <Coffee className="h-3 w-3" />
                  </Button>
                </div>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={pedidosMetrics.categoriasPopulares.length > 0 ? pedidosMetrics.categoriasPopulares : [
  { name: "Tacos", value: 45 },
  { name: "Bebidas", value: 32 },
  { name: "Especialidades", value: 28 }
]}
                      layout="horizontal"
                      margin={{ top: 5, right: 50, left: 70, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                      <XAxis
                        type="number"
                        domain={[0, 50]}
                        tick={{ fontSize: 10 }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tickLine={false}
                        tickMargin={8}
                        axisLine={false}
                        tick={{ fontSize: 11 }}
                      />
                      <Tooltip
                        cursor={false}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '6px',
                        }}
                        formatter={(value: any) => [`${value} pedidos`, 'Cantidad']}
                      />
                      <Bar
                        dataKey="value"
                        fill="#FF6B35"
                        radius={[0, 4, 4, 0]}
                        barSize={25}
                      >
                        <LabelList
                          dataKey="value"
                          position="right"
                          offset={8}
                          className="fill-foreground"
                          fontSize={11}
                        />
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Horarios Pico y Últimos Pedidos */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Horarios Pico - 57.5% (15% más) */}
              <Card className="p-3 lg:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Horarios Pico de Pedidos</h3>
                  <Button variant="ghost" size="sm" className="h-6 text-xs">
                    <Clock className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex-1 min-h-[244px]">
                  <ResponsiveContainer width="100%" height="100%" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                    <LineChart data={pedidosMetrics.horariosPico}>
                      <CartesianGrid className="stroke-muted/20" strokeDasharray="2 2" />
                      <XAxis
                        dataKey="hour"
                        tick={{ fontSize: 10 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(value) => `${value}:00`}
                      />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload[0]) {
                            const hour = payload[0].payload.hour;
                            const period = hour < 12 ? 'AM' : 'PM';
                            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                            return (
                              <div className="rounded-lg border bg-popover p-2 text-popover-foreground shadow-md text-xs">
                                <div className="font-medium">{displayHour}:00 {period}</div>
                                <div className="text-muted-foreground">
                                  {payload[0].value} pedidos
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#FF6B35"
                        strokeWidth={2}
                        fill="#FF6B35"
                        fillOpacity={0.3}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#FF6B35"
                        strokeWidth={2}
                        dot={{ fill: "#FF6B35", r: 3 }}
                        activeDot={{ r: 4, fill: "#FF4500" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Últimos Pedidos - 42.5% (15% menos) */}
              <Card className="p-2 lg:col-span-5 overflow-hidden h-[372px] flex flex-col">
                <UltimosPedidosTable pedidos={mockPedidosData.map(p => ({
                  id: p.id.toString(),
                  nombre: p.cliente_nombre,
                  telefono: p.cliente_telefono,
                  direccion: p.cliente_direccion,
                  valor: parseInt(p.total_precio)
                }))} />
              </Card>
            </div>

                      </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}