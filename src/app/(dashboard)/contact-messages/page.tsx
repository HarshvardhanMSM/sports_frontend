"use client";

import React, { useState } from "react";
import {
  FiMessageSquare,
  FiMail,
  FiCheckCircle,
  FiArchive,
  FiSearch,
  FiEye,
  FiTrash2,
} from "react-icons/fi";
import Pagination from "@/components/ui/pagination/Pagination";

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "Unread" | "Replied" | "Archived";
}

const messages: Message[] = [
  { id: "msg-1", name: "James Wilson", email: "james@email.com", subject: "Question about shoe sizing", message: "Hi, I usually wear US 9.5 but your size chart shows half sizes only in some models. Which size should I order?", date: "2026-06-15 09:23", status: "Unread" },
  { id: "msg-2", name: "Sarah Chen", email: "sarah@email.com", subject: "Wholesale inquiry", message: "Hello, I run a small sports store and would be interested in wholesale pricing for bulk orders.", date: "2026-06-14 14:45", status: "Replied" },
  { id: "msg-3", name: "Marco Rossi", email: "marco@email.com", subject: "Damaged item received", message: "I received my order yesterday but the box was damaged and one of the shoes has a scuff on it.", date: "2026-06-14 11:20", status: "Unread" },
  { id: "msg-4", name: "Emily Davis", email: "emily@email.com", subject: "When will X shoe restock?", message: "Are the Nike Air Zoom Pegasus 40 in size US 11 going to be restocked soon? I've been waiting.", date: "2026-06-13 16:00", status: "Replied" },
  { id: "msg-5", name: "Tom Johnson", email: "tom.j@email.com", subject: "Refund status update", message: "I submitted a refund request 8 days ago (ref: RET-0231) but haven't heard back yet.", date: "2026-06-13 10:30", status: "Unread" },
  { id: "msg-6", name: "Aisha Patel", email: "aisha@email.com", subject: "Can I change my order?", message: "I just placed an order 10 minutes ago but ordered the wrong size. Can I change it before it ships?", date: "2026-06-12 18:15", status: "Replied" },
  { id: "msg-7", name: "Carlos Mendez", email: "carlos@email.com", subject: "Partnership opportunity", message: "Our sports academy would like to discuss a partnership or sponsorship deal for our team kits.", date: "2026-06-12 09:00", status: "Unread" },
  { id: "msg-8", name: "Rachel Kim", email: "r.kim@email.com", subject: "Missing item in order", message: "I received my order but one of the items (Puma gym bag) was missing from the package.", date: "2026-06-11 15:45", status: "Replied" },
  { id: "msg-9", name: "David Brown", email: "d.brown@email.com", subject: "Request for product catalogue", message: "Do you have a PDF catalogue of your products that I can download or could you email it to me?", date: "2026-06-10 11:00", status: "Archived" },
  { id: "msg-10", name: "Lisa Zhang", email: "l.zhang@email.com", subject: "Coupon code not applying", message: "I'm trying to use coupon SUMMER40 but the system says it's not valid. My order total is $65.", date: "2026-06-09 14:20", status: "Unread" },
];

function statusBadge(status: Message["status"]) {
  if (status === "Unread") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700";
  if (status === "Replied") return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700";
  return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600";
}

const PAGE_SIZE = 5;

export default function ContactMessagesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [page, setPage] = useState(1);

  const filtered = messages.filter((m) => {
    const matchSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || m.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(start, start + PAGE_SIZE);

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Contact Messages</h1>
          <p className="text-sm text-slate-500">Review and respond to customer inquiries submitted through the contact form.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            <FiMessageSquare className="size-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total</p>
            <p className="text-2xl font-bold text-slate-800">156</p>
            <p className="text-xs text-slate-500 mt-0.5">All messages</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-rose-50">
            <FiMail className="size-6 text-rose-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unread</p>
            <p className="text-2xl font-bold text-slate-800">23</p>
            <p className="text-xs text-slate-500 mt-0.5">Needs attention</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
            <FiCheckCircle className="size-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Replied</p>
            <p className="text-2xl font-bold text-slate-800">112</p>
            <p className="text-xs text-slate-500 mt-0.5">Successfully handled</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">
            <FiArchive className="size-6 text-slate-500" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Archived</p>
            <p className="text-2xl font-bold text-slate-800">21</p>
            <p className="text-xs text-slate-500 mt-0.5">Filed away</p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <input
            type="text"
            placeholder="Search by name, email or subject..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 outline-none transition-all focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="All">All Statuses</option>
          <option value="Unread">Unread</option>
          <option value="Replied">Replied</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">From</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Subject</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Message Preview</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.map((msg) => (
              <tr key={msg.id} className="hover:bg-slate-50/70 transition-colors">
                <td className="px-4 py-4">
                  <p className="text-sm font-semibold text-slate-800">{msg.name}</p>
                  <p className="text-xs text-slate-500">{msg.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700 max-w-[180px]">
                  <span title={msg.subject}>
                    {msg.subject.length > 45 ? msg.subject.slice(0, 45) + "…" : msg.subject}
                  </span>
                </td>
                <td className="px-4 py-4 text-xs text-slate-500 max-w-xs">
                  <span title={msg.message}>
                    {msg.message.length > 70 ? msg.message.slice(0, 70) + "…" : msg.message}
                  </span>
                </td>
                <td className="px-4 py-4 text-xs text-slate-500 whitespace-nowrap">{msg.date}</td>
                <td className="px-4 py-4">
                  <span className={statusBadge(msg.status)}>{msg.status}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-1">
                    <button title="View" className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <FiEye className="size-4" />
                    </button>
                    <button title="Reply" className="rounded-lg p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors">
                      <FiMessageSquare className="size-4" />
                    </button>
                    <button title="Archive" className="rounded-lg p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors">
                      <FiArchive className="size-4" />
                    </button>
                    <button title="Delete" className="rounded-lg p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                      <FiTrash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate-400">No messages found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={currentPage} totalPages={totalPages} total={filtered.length} limit={PAGE_SIZE} onPageChange={setPage} />
    </div>
  );
}
