"use client";

import { Category } from "@/lib/types";
import { categoryLabels } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const categories: Category[] = ["all", "kopi-susu", "rock-coffee", "non-kopi", "snack"];

interface CategoryFilterProps {
  selected: Category;
  onChange: (cat: Category) => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={cn(
            "shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
            selected === cat
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-background text-muted-foreground border-border hover:border-primary hover:text-primary"
          )}
        >
          {categoryLabels[cat]}
        </button>
      ))}
    </div>
  );
}
