'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Filter,
  Calendar,
  BarChart3,
  Users,
  MessageSquare,
  TrendingUp,
  X,
  Check,
  ChevronDown
} from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  value: string | number;
  count?: number;
}

interface FilterGroup {
  id: string;
  label: string;
  icon?: React.ReactNode;
  options: FilterOption[];
  multiSelect?: boolean;
}

interface DashboardFiltersProps {
  groups: FilterGroup[];
  activeFilters: Record<string, (string | number)[]>;
  onFilterChange: (groupId: string, values: (string | number)[]) => void;
  onClearAll: () => void;
  loading?: boolean;
}

export function DashboardFilters({
  groups,
  activeFilters,
  onFilterChange,
  onClearAll,
  loading = false
}: DashboardFiltersProps) {
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null);

  const handleFilterSelect = (groupId: string, optionId: string, multiSelect?: boolean) => {
    const currentValues = activeFilters[groupId] || [];
    let newValues: (string | number)[];

    if (multiSelect) {
      if (currentValues.includes(optionId)) {
        newValues = currentValues.filter(v => v !== optionId);
      } else {
        newValues = [...currentValues, optionId];
      }
    } else {
      newValues = currentValues.includes(optionId) ? [] : [optionId];
    }

    onFilterChange(groupId, newValues);
  };

  const handleClearGroup = (groupId: string) => {
    onFilterChange(groupId, []);
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).reduce((total, values) => total + values.length, 0);
  };

  const getSelectedOptionsForGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return [];

    return group.options.filter(option =>
      activeFilters[groupId]?.includes(option.value)
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 border-[#2C8082]/20">
      <CardHeader className="pb-3 bg-gray-900/50 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2 text-white">
            <Filter className="h-5 w-5 text-[#2C8082]" />
            Filtros
            {getActiveFilterCount() > 0 && (
              <Badge variant="secondary" className="text-xs">
                {getActiveFilterCount()} activos
              </Badge>
            )}
          </CardTitle>
          {getActiveFilterCount() > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearAll}
              className="text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar todos
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {groups.map((group) => {
            const selectedOptions = getSelectedOptionsForGroup(group.id);
            const hasSelection = selectedOptions.length > 0;

            return (
              <DropdownMenu
                key={group.id}
                open={openDropdown === group.id}
                onOpenChange={(open) => setOpenDropdown(open ? group.id : null)}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={hasSelection ? "default" : "outline"}
                    size="sm"
                    className="h-8 border-[#2C8082]/20 hover:border-[#2C8082]/40 transition-all duration-300"
                  >
                    <div className="flex items-center gap-2">
                      {group.icon}
                      <span>{group.label}</span>
                      {hasSelection && (
                        <Badge variant="secondary" className="text-xs px-1.5 py-0">
                          {selectedOptions.length}
                        </Badge>
                      )}
                    </div>
                    <ChevronDown className="h-3 w-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    {group.icon}
                    {group.label}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {group.options.map((option) => {
                    const isSelected = activeFilters[group.id]?.includes(option.value);
                    return (
                      <DropdownMenuItem
                        key={option.id}
                        onClick={() => handleFilterSelect(group.id, String(option.value), group.multiSelect)}
                        className="flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {isSelected && <Check className="h-4 w-4 text-[#2C8082]" />}
                          <span className={isSelected ? "font-medium" : ""}>
                            {option.label}
                          </span>
                        </div>
                        {option.count !== undefined && (
                          <Badge variant="outline" className="text-xs">
                            {option.count}
                          </Badge>
                        )}
                      </DropdownMenuItem>
                    );
                  })}
                  {hasSelection && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleClearGroup(group.id)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <X className="h-4 w-4 mr-2" />
                        Limpiar {group.label}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}
        </div>

        {/* Active filters display */}
        {getActiveFilterCount() > 0 && (
          <div className="mt-4 space-y-2">
            <Separator />
            <div className="text-sm text-muted-foreground">Filtros activos:</div>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => {
                const selectedOptions = getSelectedOptionsForGroup(group.id);
                return selectedOptions.map((option) => (
                  <Badge
                    key={`${group.id}-${option.value}`}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    <div className="flex items-center gap-1">
                      {group.icon}
                      <span>{option.label}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleFilterSelect(group.id, String(option.value), group.multiSelect)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ));
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}