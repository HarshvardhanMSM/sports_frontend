"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FiSearch,
  FiBell,
  FiMessageSquare,
  FiChevronDown,
  FiMenu,
  FiSettings,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { IconType } from "react-icons";
import Image from "next/image";
import { useLogout } from "@/hooks/useAuth";

interface HeaderProps {
  onMenuClick?: () => void;
}

/** Close a dropdown when the user clicks outside of it. */
function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [ref, onClose]);
}

export const Header = ({ onMenuClick }: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useClickOutside(notifRef, () => setShowNotifications(false));
  useClickOutside(profileRef, () => setShowProfileMenu(false));

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
      {/* Left — search */}
      <div className="flex items-center gap-4 flex-1 max-w-md">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-md hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <FiMenu className="size-5" />
        </button>

        <div className="relative w-full hidden md:block">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <FiSearch
              className={`size-4 transition-colors ${
                searchFocused ? "text-indigo-600" : "text-slate-400"
              }`}
            />
          </div>
          <input
            type="text"
            placeholder="Search transactions, products, users..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full h-9 rounded-full border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          />
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-4">
        {/* Messages */}
        <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors hover:scale-105 active:scale-95">
          <FiMessageSquare className="size-5" />
          <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-indigo-500 ring-2 ring-white" />
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors hover:scale-105 active:scale-95"
          >
            <FiBell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-red-500 ring-2 ring-white animate-pulse" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 z-50 w-80 rounded-xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
                <span className="font-semibold text-sm text-slate-800">
                  Notifications
                </span>
                <button className="text-xs text-indigo-600 hover:underline">
                  Mark all as read
                </button>
              </div>
              <div className="space-y-3">
                <NotificationItem
                  title="New order received"
                  time="2 mins ago"
                  desc="Order #240546 from John Doe is pending review."
                />
                <NotificationItem
                  title="Stock alert: Low inventory"
                  time="1 hour ago"
                  desc="Runner Shoes size 10 is down to 2 items."
                />
                <NotificationItem
                  title="New review posted"
                  time="3 hours ago"
                  desc="A customer left a 5-star review on Nike Pegasus 40."
                />
              </div>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-slate-200" />

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu((v) => !v)}
            className="flex items-center gap-3 rounded-full p-1 text-left hover:bg-slate-50 transition-colors"
          >
            <div className="relative">
              <div className="size-8 overflow-hidden rounded-full ring-2 ring-indigo-100">
                <Image
                  src="/avatar.png"
                  alt="Avatar"
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-green-500" />
            </div>
            <div className="hidden lg:block">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                TomIsLoading
              </span>
              <span className="block text-[10px] text-slate-400 font-medium">
                Administrator
              </span>
            </div>
            <FiChevronDown className="hidden lg:block size-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 z-50 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="block text-xs font-semibold text-slate-800">
                  TomIsLoading
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">
                  tom@sportswear.com
                </span>
              </div>
              <div className="py-1">
                <ProfileMenuItem Icon={FiUser} label="Profile" />
                <ProfileMenuItem Icon={FiSettings} label="Settings" />
              </div>
              <div className="border-t border-slate-100 pt-1.5 mt-1">
                <ProfileMenuItem
                  Icon={FiLogOut}
                  label={isLoggingOut ? "Logging out..." : "Log out"}
                  danger
                  onClick={() => logout()}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

// ---------------------------------------------------------------------------

const NotificationItem = ({
  title,
  time,
  desc,
}: {
  title: string;
  time: string;
  desc: string;
}) => (
  <div className="group cursor-pointer rounded-lg p-2 transition-colors hover:bg-slate-50">
    <div className="flex justify-between items-start mb-0.5">
      <span className="font-medium text-xs text-slate-800 group-hover:text-indigo-600 transition-colors">
        {title}
      </span>
      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap ml-2">
        {time}
      </span>
    </div>
    <p className="text-[11px] leading-normal text-slate-500">{desc}</p>
  </div>
);

const ProfileMenuItem = ({
  Icon,
  label,
  danger,
  onClick,
}: {
  Icon: IconType;
  label: string;
  danger?: boolean;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
      danger
        ? "text-red-600 hover:bg-red-50"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
    }`}
  >
    <Icon className="size-4" />
    <span>{label}</span>
  </button>
);
