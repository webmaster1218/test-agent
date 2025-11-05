'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
  User,
  DollarSign,
  MapPin,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronDown
} from 'lucide-react';

interface Pedido {
  id: string;
  nombre: string;
  telefono: string;
  direccion: string;
  valor: number;
  fecha?: string; // Opcional para futuras fechas reales
}

type FilterType = 'todos' | 'nombre' | 'valor-alto' | 'valor-bajo' | 'rango-personalizado';
type SortType = 'fecha-desc' | 'fecha-asc' | 'valor-desc' | 'valor-asc' | 'nombre-asc' | 'nombre-desc';

interface UltimosPedidosTableProps {
  pedidos?: Pedido[];
  className?: string;
}

// Datos de ejemplo
const defaultPedidos: Pedido[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    telefono: '300-123-4567',
    direccion: 'Calle 45 #23-45',
    valor: 45000
  },
  {
    id: '2',
    nombre: 'María González',
    telefono: '310-987-6543',
    direccion: 'Avenida 67 #89-12',
    valor: 32000
  },
  {
    id: '3',
    nombre: 'Carlos Rodríguez',
    telefono: '305-456-7890',
    direccion: 'Carrera 23 #45-67',
    valor: 28000
  },
  {
    id: '4',
    nombre: 'Ana Martínez',
    telefono: '312-234-5678',
    direccion: 'Transversal 78 #34-56',
    valor: 51000
  },
  {
    id: '5',
    nombre: 'Luis Sánchez',
    telefono: '318-876-5432',
    direccion: 'Diagonal 12 #78-90',
    valor: 39000
  },
  {
    id: '6',
    nombre: 'Sofía Ramírez',
    telefono: '314-345-6789',
    direccion: 'Calle 89 #12-34',
    valor: 42000
  },
  {
    id: '7',
    nombre: 'Diego López',
    telefono: '311-567-8901',
    direccion: 'Avenida 34 #56-78',
    valor: 36000
  },
  {
    id: '8',
    nombre: 'Laura Torres',
    telefono: '317-234-1234',
    direccion: 'Carrera 56 #78-90',
    valor: 48000
  }
];

export default function UltimosPedidosTable({ pedidos = defaultPedidos, className }: UltimosPedidosTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('todos');
  const [sortType, setSortType] = useState<SortType>('fecha-desc');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const itemsPerPage = 4;

  // Filtrar y buscar pedidos
  const filteredPedidos = useMemo(() => {
    let filtered = [...pedidos];

    // Aplicar filtro por valor
    switch (activeFilter) {
      case 'valor-alto':
        filtered = filtered.filter(p => p.valor > 40000);
        break;
      case 'valor-bajo':
        filtered = filtered.filter(p => p.valor <= 40000);
        break;
      case 'rango-personalizado':
        const min = precioMin ? parseInt(precioMin) : 0;
        const max = precioMax ? parseInt(precioMax) : Infinity;
        filtered = filtered.filter(p => p.valor >= min && p.valor <= max);
        break;
      case 'nombre':
      case 'todos':
      default:
        // No aplicar filtro de valor
        break;
    }

    // Aplicar búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(pedido =>
        pedido.nombre.toLowerCase().includes(term) ||
        pedido.telefono.includes(term) ||
        pedido.direccion.toLowerCase().includes(term) ||
        pedido.valor.toString().includes(term)
      );
    }

    // Aplicar ordenamiento
    switch (sortType) {
      case 'fecha-desc':
        filtered = filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'fecha-asc':
        filtered = filtered.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
      case 'valor-desc':
        filtered = filtered.sort((a, b) => b.valor - a.valor);
        break;
      case 'valor-asc':
        filtered = filtered.sort((a, b) => a.valor - b.valor);
        break;
      case 'nombre-asc':
        filtered = filtered.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        filtered = filtered.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    return filtered;
  }, [pedidos, activeFilter, searchTerm, sortType, precioMin, precioMax]);

  const totalPages = Math.ceil(filteredPedidos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPedidos = filteredPedidos.slice(startIndex, endIndex);

  // Resetear página cuando cambia el filtro o búsqueda
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, activeFilter, sortType, precioMin, precioMax]);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatValor = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(valor);
  };

  return (
    <div className={`w-full h-full flex flex-col ${className}`}>
      <div className="flex flex-col space-y-2 mb-2 flex-shrink-0">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Últimos Pedidos</h3>
          <div className="text-xs text-muted-foreground">
            {filteredPedidos.length} de {pedidos.length} pedidos
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, teléfono, dirección o valor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-10 h-8 text-xs"
          />
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm('')}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Botones de control */}
        <div className="space-y-2">
          {/* Fila de botones principales */}
          <div className="flex flex-wrap gap-2">
            {/* Filtro por valor */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={activeFilter !== 'todos' ? 'default' : 'outline'}
                  size="sm"
                  className="h-6 text-xs px-2"
                >
                  <Filter className="h-3 w-3 mr-1" />
                  {activeFilter === 'todos' ? 'Filtrar' :
                   activeFilter === 'valor-alto' ? 'Altos ($40k+)' :
                   activeFilter === 'valor-bajo' ? 'Bajos (≤$40k)' :
                   activeFilter === 'rango-personalizado' ? 'Rango personal' : 'Filtrar'}
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-44">
                <DropdownMenuLabel className="text-xs">Filtrar por valor</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setActiveFilter('todos')}
                  className={activeFilter === 'todos' ? 'bg-accent' : ''}
                >
                  <DollarSign className="h-3 w-3 mr-2" />
                  Todos los pedidos
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveFilter('valor-alto')}
                  className={activeFilter === 'valor-alto' ? 'bg-accent' : ''}
                >
                  <ArrowUp className="h-3 w-3 mr-2 text-green-600" />
                  Altos ($40k+)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveFilter('valor-bajo')}
                  className={activeFilter === 'valor-bajo' ? 'bg-accent' : ''}
                >
                  <ArrowDown className="h-3 w-3 mr-2 text-red-600" />
                  Bajos (≤$40k)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveFilter('rango-personalizado')}
                  className={activeFilter === 'rango-personalizado' ? 'bg-accent' : ''}
                >
                  <DollarSign className="h-3 w-3 mr-2" />
                  Rango personalizado
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Ordenamiento */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-xs px-2"
                >
                  <ArrowUpDown className="h-3 w-3 mr-1" />
                  Ordenar
                  <ChevronDown className="h-3 w-3 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                <DropdownMenuLabel className="text-xs">Ordenar por</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSortType('fecha-desc')}
                  className={sortType === 'fecha-desc' ? 'bg-accent' : ''}
                >
                  <ArrowDown className="h-3 w-3 mr-2" />
                  Más recientes
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortType('fecha-asc')}
                  className={sortType === 'fecha-asc' ? 'bg-accent' : ''}
                >
                  <ArrowUp className="h-3 w-3 mr-2" />
                  Más antiguos
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSortType('valor-desc')}
                  className={sortType === 'valor-desc' ? 'bg-accent' : ''}
                >
                  <ArrowDown className="h-3 w-3 mr-2 text-green-600" />
                  Mayor valor
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortType('valor-asc')}
                  className={sortType === 'valor-asc' ? 'bg-accent' : ''}
                >
                  <ArrowUp className="h-3 w-3 mr-2 text-red-600" />
                  Menor valor
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSortType('nombre-asc')}
                  className={sortType === 'nombre-asc' ? 'bg-accent' : ''}
                >
                  <User className="h-3 w-3 mr-2" />
                  Nombre A-Z
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortType('nombre-desc')}
                  className={sortType === 'nombre-desc' ? 'bg-accent' : ''}
                >
                  <User className="h-3 w-3 mr-2" />
                  Nombre Z-A
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Rango de precios personalizado */}
          {activeFilter === 'rango-personalizado' && (
            <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
              <DollarSign className="h-3 w-3 text-muted-foreground" />
              <div className="flex items-center gap-1 flex-1">
                <Input
                  type="number"
                  placeholder="Mínimo"
                  value={precioMin}
                  onChange={(e) => setPrecioMin(e.target.value)}
                  className="h-7 w-20 text-xs"
                  min="0"
                />
                <span className="text-xs text-muted-foreground">a</span>
                <Input
                  type="number"
                  placeholder="Máximo"
                  value={precioMax}
                  onChange={(e) => setPrecioMax(e.target.value)}
                  className="h-7 w-20 text-xs"
                  min="0"
                />
              </div>
              {(precioMin || precioMax) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setPrecioMin('');
                    setPrecioMax('');
                  }}
                  className="h-5 w-5 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <Table className="text-xs h-full">
        <TableHeader className="sticky top-0 bg-background z-10">
          <TableRow className="h-10">
            <TableHead className="w-[25%] py-2 text-sm">Nombre</TableHead>
            <TableHead className="w-[20%] py-2 text-sm">Teléfono</TableHead>
            <TableHead className="w-[35%] py-2 text-sm">Dirección</TableHead>
            <TableHead className="w-[20%] py-2 text-sm text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentPedidos.map((pedido) => (
            <TableRow key={pedido.id} className="hover:bg-muted/50 h-10">
              <TableCell className="font-medium py-3 text-sm">
                {pedido.nombre}
              </TableCell>
              <TableCell className="text-muted-foreground py-3 text-sm">
                {pedido.telefono}
              </TableCell>
              <TableCell className="text-muted-foreground py-3 text-sm truncate">
                {pedido.direccion}
              </TableCell>
              <TableCell className="font-medium text-right py-3 text-sm">
                {formatValor(pedido.valor)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </div>

      {/* Paginación y estado */}
      <div className="flex items-center justify-between mt-1 flex-shrink-0">
        <div className="text-xs text-muted-foreground flex items-center gap-1 flex-wrap">
          {searchTerm || activeFilter !== 'todos' || sortType !== 'fecha-desc' || (activeFilter === 'rango-personalizado' && (precioMin || precioMax)) ? (
            <span>
              {filteredPedidos.length} pedidos
              {searchTerm && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  "{searchTerm.slice(0, 8)}..."
                </Badge>
              )}
              {activeFilter !== 'todos' && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {activeFilter === 'valor-alto' ? 'Altos' :
                   activeFilter === 'valor-bajo' ? 'Bajos' :
                   activeFilter === 'rango-personalizado' ?
                   (precioMin && precioMax ? `$${precioMin}-${precioMax}` :
                    precioMin ? `≥$${precioMin}` : `≤$${precioMax}`) : ''}
                </Badge>
              )}
              {sortType !== 'fecha-desc' && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {sortType === 'fecha-asc' ? 'Antiguos' :
                   sortType === 'valor-desc' ? 'Mayor valor' :
                   sortType === 'valor-asc' ? 'Menor valor' :
                   sortType === 'nombre-asc' ? 'A-Z' : 'Z-A'}
                </Badge>
              )}
            </span>
          ) : (
            <span>
              {startIndex + 1}-{Math.min(endIndex, filteredPedidos.length)} de {filteredPedidos.length}
            </span>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="h-6 px-1"
            >
              <ChevronLeft className="h-3 w-3" />
            </Button>
            <span className="text-xs text-muted-foreground px-1">
              {currentPage}/{totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="h-6 px-1"
            >
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}