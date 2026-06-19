import React from "react";

export const Table = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <table className={`w-full border-collapse text-left text-sm ${className}`}>
    {children}
  </table>
);

export const TableHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <thead className={className}>{children}</thead>;

export const TableBody = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <tbody className={className}>{children}</tbody>;

export const TableRow = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <tr className={className}>{children}</tr>;

interface TableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
  className?: string;
  colSpan?: number;
}

export const TableCell = ({
  children,
  isHeader = false,
  className = "",
  colSpan,
}: TableCellProps) => {
  if (isHeader) {
    return (
      <th colSpan={colSpan} className={className}>
        {children}
      </th>
    );
  }
  return (
    <td colSpan={colSpan} className={className}>
      {children}
    </td>
  );
};
