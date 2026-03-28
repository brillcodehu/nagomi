"use client";

import { FILTER_OPTIONS, type ScheduleFilters as Filters } from "@/hooks/useSchedule";

interface ScheduleFiltersProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

export default function ScheduleFilters({
  filters,
  onFilterChange,
}: ScheduleFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {FILTER_OPTIONS.map((opt) => {
        const isActive = filters.classType === opt.value;
        return (
          <button
            key={opt.label}
            onClick={() =>
              onFilterChange({ ...filters, classType: opt.value })
            }
            className={`px-4 py-2 rounded-full text-[11px] tracking-[0.12em] uppercase font-medium transition-all duration-300 cursor-pointer ${
              isActive
                ? "bg-foreground text-background"
                : "border border-foreground/10 text-foreground/50 hover:border-foreground/25 hover:text-foreground/70"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
