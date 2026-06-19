"use client";

import React from "react";

interface DropdownItemProps {
  onItemClick: () => void;
  className?: string;
  children: React.ReactNode;
  tag?: "button" | "a" | "div";
}

export const DropdownItem = ({
  onItemClick,
  className = "",
  children,
  tag = "button",
}: DropdownItemProps) => {
  const Component = tag;
  return (
    <Component
      onClick={onItemClick}
      className={`block w-full px-3 py-2 text-xs font-medium transition-colors ${className}`}
    >
      {children}
    </Component>
  );
};
