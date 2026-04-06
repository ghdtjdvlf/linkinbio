"use client";

import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export default function Toggle({ checked, onChange, label, disabled }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3">
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <div
          className={cn(
            "h-6 w-11 rounded-full transition-colors",
            checked ? "bg-indigo-600" : "bg-gray-200",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
        <div
          className={cn(
            "absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow transition-transform",
            checked && "translate-x-5"
          )}
        />
      </div>
      {label && <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
}
