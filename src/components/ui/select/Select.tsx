"use client";

import React, { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiCheck } from "react-icons/fi";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  Icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
  size?: "sm" | "md";
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = "Select...",
  className = "w-full",
  Icon,
  disabled = false,
  size = "sm",
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  const sizeClasses = size === "md"
    ? "px-3.5 py-2.5 text-sm font-medium"
    : "px-3 py-2 text-xs font-semibold";

  return (
    <div
      ref={containerRef}
      className={`relative text-left select-none ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full rounded-lg border border-slate-200 bg-white outline-none hover:bg-slate-50 transition-all cursor-pointer text-left focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 ${sizeClasses} ${
          disabled ? "opacity-50 cursor-not-allowed bg-slate-50 text-slate-400 hover:bg-slate-50" : ""
        }`}
      >
        <div className="flex items-center truncate">
          {Icon && <Icon className="mr-1.5 size-3.5 text-slate-400 shrink-0" />}
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <FiChevronDown
          className={`ml-2 size-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? "rotate-180 text-indigo-600" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-full min-w-[150px] z-50 rounded-xl border border-slate-200 bg-white p-1 shadow-xl max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-100 origin-top">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-indigo-50/75 text-indigo-700 font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && (
                  <FiCheck className="ml-2 size-3.5 text-indigo-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

