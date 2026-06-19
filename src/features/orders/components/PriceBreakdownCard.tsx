"use client";

import React from "react";

interface PriceBreakdownCardProps {
  subtotal: string;
  discountAmount: string;
  shippingAmount: string;
  deliveryCharge: string;
  codCharge: string;
  handlingCharge: string;
  taxAmount: string;
  totalAmount: string;
}

function Row({ label, value, bold = false, negative = false }: { label: string; value: number; bold?: boolean; negative?: boolean }) {
  return (
    <div className="flex justify-between py-1.5">
      <span className={`text-sm ${bold ? "font-bold text-slate-800" : "text-slate-600"}`}>{label}</span>
      <span className={`text-sm ${bold ? "font-bold text-slate-900" : "text-slate-700"} ${negative ? "text-rose-600" : ""}`}>
        {negative ? "-" : ""}${Math.abs(Number(value)).toFixed(2)}
      </span>
    </div>
  );
}

export default function PriceBreakdownCard({
  subtotal,
  discountAmount,
  shippingAmount,
  deliveryCharge,
  codCharge,
  handlingCharge,
  taxAmount,
  totalAmount,
}: PriceBreakdownCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Price Breakdown</h2>
      </div>
      <div className="p-6">
        <Row label="Subtotal" value={Number(subtotal)} />
        {Number(discountAmount) > 0 && <Row label="Discount" value={Number(discountAmount)} negative />}
        {Number(shippingAmount) > 0 && <Row label="Shipping" value={Number(shippingAmount)} />}
        {Number(deliveryCharge) > 0 && <Row label="Delivery Charge" value={Number(deliveryCharge)} />}
        {Number(codCharge) > 0 && <Row label="COD Charge" value={Number(codCharge)} />}
        {Number(handlingCharge) > 0 && <Row label="Handling Charge" value={Number(handlingCharge)} />}
        {Number(taxAmount) > 0 && <Row label="Tax" value={Number(taxAmount)} />}
        <div className="border-t border-slate-200 my-2" />
        <Row label="Grand Total" value={Number(totalAmount)} bold />
      </div>
    </div>
  );
}
