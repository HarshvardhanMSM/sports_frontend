"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";
import { useAuthStore } from "@/store/auth.store";
import { ROUTE_PERMISSIONS } from "@/config/route-permissions";
import {
  // FiChevronDown,
  FiChevronsRight,
  FiHome,
  FiLayers,
  FiShoppingCart,
  FiTag,
  FiGrid,
  FiSliders,
  FiStar,
  FiPackage,
  FiRefreshCw,
  FiBell,
  // FiMapPin,
  FiFileText,
  FiClipboard,
  FiRotateCcw,
  FiTruck,
  // FiNavigation,
  FiUsers,
  FiDollarSign,
  FiMessageCircle,
  // FiHeart,
  // FiImage,
  // FiPercent,
  // FiGift,
  // FiMail,
  // FiSend,
  FiFile,
  FiHelpCircle,
  // FiVolume2,
  FiLock,
  FiMessageSquare,
  FiBarChart2,
  // FiTrendingUp,
  FiPieChart,
  FiActivity,
  FiUser,
  FiShield,
  FiList,
  FiSettings,
  // FiCreditCard,
  // FiTool,
  FiKey,
  // FiLink,
} from "react-icons/fi";

export const Sidebar = () => {
  const [open, setOpen] = useState(true);

  const permissions = useAuthStore((s) => s.permissions);
  const isPermissionsLoaded = useAuthStore((s) => s.isPermissionsLoaded);

  const hasAccess = (href: string) => {
    if (!isPermissionsLoaded) return true;
    const slug = ROUTE_PERMISSIONS[href];
    if (!slug) return true;
    return permissions.includes(slug);
  };

  return (
    <nav
      style={{
        width: open ? 250 : 75,
        transition: "width 0.25s ease-in-out",
      }}
      className="sticky top-0 h-screen shrink-0 border-r border-slate-200 bg-white flex flex-col justify-between overflow-hidden"
    >
      <div className="p-2 pb-0 shrink-0">
        <TitleSection open={open} />
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden p-2 pt-0  space-y-1">
          {/* ── DASHBOARD ─────────────────────────────── */}
          {hasAccess("/dashboard") && (
            <Option
              Icon={FiHome}
              title="Dashboard"
              href="/dashboard"
              open={open}
            />
          )}

          {/* ── CATALOG ───────────────────────────────── */}
         {(hasAccess("/categories")||hasAccess("/sub-categories")||hasAccess("/products")||hasAccess("/brands")||hasAccess("/collections")||hasAccess("/attributes")||hasAccess("/product-reviews")) && <SectionLabel label="CATALOG" open={open} />}
          {hasAccess("/categories") && (
            <Option
              Icon={FiLayers}
              title="Categories"
              href="/categories"
              open={open}
            />
          )}
          {hasAccess("/sub-categories") && (
            <Option
              Icon={FiList}
              title="Sub Categories"
              href="/sub-categories"
              open={open}
            />
          )}
          {hasAccess("/products") && (
            <Option
              Icon={FiShoppingCart}
              title="Products"
              href="/products"
              open={open}
            />
          )}
          {hasAccess("/brands") && (
            <Option Icon={FiTag} title="Brands" href="/brands" open={open} />
          )}
          {hasAccess("/collections") && (
            <Option
              Icon={FiGrid}
              title="Collections"
              href="/collections"
              open={open}
            />
          )}
          {hasAccess("/attributes") && (
            <Option
              Icon={FiSliders}
              title="Attributes"
              href="/attributes"
              open={open}
            />
          )}
          {hasAccess("/product-reviews") && (
            <Option
              Icon={FiStar}
              title="Product Reviews"
              href="/product-reviews"
              open={open}
            />
          )}

          {/* ── INVENTORY ─────────────────────────────── */}
        {(hasAccess("/inventory")||hasAccess("/stock-movements")||hasAccess("/inventory-alerts")||hasAccess("/inventory-reports")) && (
            <SectionLabel label="INVENTORY" open={open} />
          )}
          {hasAccess("/inventory") && (
            <Option
              Icon={FiPackage}
              title="Inventory Management"
              href="/inventory"
              open={open}
            />
          )}
          {hasAccess("/stock-movements") && (
            <Option
              Icon={FiRefreshCw}
              title="Stock Movements"
              href="/stock-movements"
              open={open}
            />
          )}
          {hasAccess("/inventory-alerts") && (
            <Option
              Icon={FiBell}
              title="Inventory Alerts"
              href="/inventory-alerts"
              open={open}
            />
          )}
          {hasAccess("/inventory-reports") && (
            <Option
              Icon={FiFileText}
              title="Inventory Reports"
              href="/inventory-reports"
              open={open}
            />
          )}

          {/* ── ORDERS ────────────────────────────────── */}
      {(hasAccess("/orders")||hasAccess("/returns")||hasAccess("/shipments") )&& (
            <SectionLabel label="ORDERS" open={open} />
          )}
          {hasAccess("/orders") && (
            <Option
              Icon={FiClipboard}
              title="Orders"
              href="/orders"
              open={open}
            />
          )}
          {hasAccess("/returns") && (
            <Option
              Icon={FiRotateCcw}
              title="Returns & Refunds"
              href="/returns"
              open={open}
            />
          )}
          {hasAccess("/shipments") && (
            <Option
              Icon={FiTruck}
              title="Shipments"
              href="/shipments"
              open={open}
            />
          )}
          {/* <Option
            Icon={FiNavigation}
            title="Order Tracking"
            href="/order-tracking"
            open={open}
          /> */}

          {/* ── CUSTOMERS ─────────────────────────────── */}
     {(hasAccess("/customers")||hasAccess("/customer-support")) && (
            <SectionLabel label="CUSTOMERS" open={open} />
          )}
          {hasAccess("/customers") && (
            <Option
              Icon={FiUsers}
              title="Customers"
              href="/customers"
              open={open}
            />
          )}
          {hasAccess("/customer-support") && (
            <Option
              Icon={FiMessageCircle}
              title="Customer Support"
              href="/customer-support"
              open={open}
            />
          )}
          {/* <Option
            Icon={FiHeart}
            title="Wishlist Analytics"
            href="/wishlist-analytics"
            open={open}
          /> */}

          {/* ── MARKETING ─────────────────────────────── */}
          {/* <SectionLabel label="MARKETING" open={open} />
          <Option Icon={FiImage} title="Banners" href="/banners" open={open} />
          <Option Icon={FiTag} title="Coupons" href="/coupons" open={open} />
          <Option
            Icon={FiGift}
            title="Promotions"
            href="/promotions"
            open={open}
          />
          <Option
            Icon={FiMail}
            title="Newsletter Subscribers"
            href="/newsletter"
            open={open}
          /> */}
        

          {/* ── CONTENT MANAGEMENT ────────────────────── */}
         {(hasAccess("/pages") || hasAccess("/faq") || hasAccess("/terms") || hasAccess("/privacy") || hasAccess("/contact-messages")) && (
            <SectionLabel label="CONTENT MANAGEMENT" open={open} />
          )}
          {hasAccess("/pages") && (
            <Option Icon={FiFile} title="Pages" href="/pages" open={open} />
          )}
          {hasAccess("/faq") && (
            <Option Icon={FiHelpCircle} title="FAQ" href="/faq" open={open} />
          )}
          {hasAccess("/terms") && (
            <Option
              Icon={FiFileText}
              title="Terms & Conditions"
              href="/terms"
              open={open}
            />
          )}
          {hasAccess("/privacy") && (
            <Option
              Icon={FiLock}
              title="Privacy Policy"
              href="/privacy"
              open={open}
            />
          )}
          {hasAccess("/contact-messages") && (
            <Option
              Icon={FiMessageSquare}
              title="Contact Messages"
              href="/contact-messages"
              open={open}
            />
          )}

          {/* ── FINANCE ──────────────────────────────── */}
          {/* <SectionLabel label="FINANCE" open={open} /> */}
      

          {/* ── ANALYTICS & REPORTS ───────────────────── */}
       {(hasAccess("/reports/sales") || hasAccess("/financial-reports") || hasAccess("/reports/products") || hasAccess("/reports/customers") || hasAccess("/analytics/returns")) && (
            <SectionLabel label="ANALYTICS & REPORTS" open={open} />
          )}
          {hasAccess("/reports/sales") && (
            <Option
              Icon={FiBarChart2}
              title="Sales Reports"
              href="/reports/sales"
              open={open}
            />
          )}
          {hasAccess("/financial-reports") && (
            <Option
              Icon={FiDollarSign}
              title="Financial Reports"
              href="/financial-reports"
              open={open}
            />
          )}
          {hasAccess("/reports/products") && (
            <Option
              Icon={FiPieChart}
              title="Product Performance"
              href="/reports/products"
              open={open}
            />
          )}
          {hasAccess("/reports/customers") && (
            <Option
              Icon={FiActivity}
              title="Customer Analytics"
              href="/reports/customers"
              open={open}
            />
          )}
          {hasAccess("/analytics/returns") && (
            <Option
              Icon={FiRotateCcw}
              title="Returns Analytics"
              href="/analytics/returns"
              open={open}
            />
          )}

          {/* ── USER MANAGEMENT ───────────────────────── */}
{(hasAccess("/admin-users") || hasAccess("/roles") || hasAccess("/permissions") || hasAccess("/audit-logs")) && (
            <SectionLabel label="USER MANAGEMENT" open={open} />
          ) }
          {hasAccess("/admin-users") && (
            <Option
              Icon={FiUser}
              title="Admin Users"
              href="/admin-users"
              open={open}
            />
          )}
          {hasAccess("/roles") && (
            <Option
              Icon={FiShield}
              title="Roles & Permissions"
              href="/roles"
              open={open}
            />
          )}
          {hasAccess("/permissions") && (
            <Option
              Icon={FiKey}
              title="Permissions"
              href="/permissions"
              open={open}
            />
          )}
          {hasAccess("/audit-logs") && (
            <Option
              Icon={FiList}
              title="Audit Logs"
              href="/audit-logs"
              open={open}
            />
          )}

          {/* ── SETTINGS ──────────────────────────────── */}
{(hasAccess("/settings/delivery-charges") || hasAccess("/settings/general")) && (
          <SectionLabel label="SETTINGS" open={open} />
        ) }
          {hasAccess("/settings/general") && (
            <Option
              Icon={FiSettings}
              title="General Settings"
              href="/settings/general"
              open={open}
            />
          )}
          {hasAccess("/settings/delivery-charges") && (
            <Option
              Icon={FiTruck}
              title="Delivery Charges"
              href="/settings/delivery-charges"
              open={open}
            />
          )}
        </div>
      

      <div className="relative pb-14 shrink-0 bg-white">
        <ToggleClose open={open} setOpen={setOpen} />
      </div>
    </nav>
  );
};

// ---------------------------------------------------------------------------
// SectionLabel — both label and divider always in DOM, toggled via CSS opacity
// ---------------------------------------------------------------------------
interface SectionLabelProps {
  label: string;
  open: boolean;
}

const SectionLabel = React.memo(({ label, open }: SectionLabelProps) => (
  <div className="relative overflow-hidden" style={{ height: 32 }}>
    {/* Label — visible when open */}
    <span
      className="absolute bottom-0 left-0 pl-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 select-none whitespace-nowrap"
      style={{
        opacity: open ? 1 : 0,
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      {label}
    </span>
    {/* Divider — visible when collapsed */}
    <span
      className="absolute top-1/2 left-1 right-1 border-t border-slate-200"
      style={{
        opacity: open ? 0 : 1,
        transition: "opacity 0.2s ease-in-out",
      }}
    />
  </div>
));
SectionLabel.displayName = "SectionLabel";

// ---------------------------------------------------------------------------
// Option — icon is always fixed; text fades via CSS opacity only
// ---------------------------------------------------------------------------
interface OptionProps {
  Icon: IconType;
  title: string;
  href: string;
  open: boolean;
  notifs?: number;
}

const Option = React.memo(
  ({ Icon, title, href, open, notifs }: OptionProps) => {
    const pathname = usePathname();
    const selected = pathname === href || pathname.startsWith(href + "/");

    return (
      <Link href={href} className="block" title={!open ? title : undefined}>
        <div
          className={`relative flex h-10 w-full items-center rounded-lg cursor-pointer transition-colors duration-150 ${
            selected
              ? "bg-indigo-50 text-indigo-700 shadow-sm border-l-2 border-indigo-600 rounded-l-none"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          }`}
        >
          {/* Icon: fixed 40×40, never resizes */}
          <div className="grid h-10 w-10 shrink-0 place-content-center text-lg">
            <Icon className={selected ? "text-indigo-700" : "text-slate-500"} />
          </div>

          {/* Text: always mounted, fades with CSS — no JS animation overhead */}
          <span
            className="text-xs font-semibold tracking-wide whitespace-nowrap overflow-hidden"
            style={{
              opacity: open ? 1 : 0,
              transition: "opacity 0.2s ease-in-out",
            }}
          >
            {title}
          </span>

          {notifs != null && (
            <span
              className="absolute right-2 top-1/2 -translate-y-1/2 size-4 rounded bg-indigo-600 text-[10px] text-white flex items-center justify-center font-bold"
              style={{
                opacity: open ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
              }}
            >
              {notifs}
            </span>
          )}
        </div>
      </Link>
    );
  },
);
Option.displayName = "Option";

// ---------------------------------------------------------------------------
// TitleSection
// ---------------------------------------------------------------------------
interface TitleSectionProps {
  open: boolean;
}

const TitleSection = ({ open }: TitleSectionProps) => (
  <div className="mb-3 border-b border-slate-200 pb-2">
    <div className="flex cursor-pointer items-center justify-center rounded-lg p-1 transition-colors duration-150 hover:bg-slate-50">
      <Link href="/dashboard" className="flex items-center gap-2 overflow-hidden">
        <Logo />
        
      </Link>

   
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Logo
// ---------------------------------------------------------------------------
const Logo = () => (
  <div className="grid size-12 shrink-0 place-content-center rounded-md">
    <img
          src="/assets/logos/Final file_Logo + wordmark.png"
          alt="MSM Logo"
          className=""
        />
  </div>
);

// ---------------------------------------------------------------------------
// ToggleClose
// ---------------------------------------------------------------------------
interface ToggleCloseProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const ToggleClose = ({ open, setOpen }: ToggleCloseProps) => (
  <button
    onClick={() => setOpen((pv) => !pv)}
    className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors duration-150 hover:bg-slate-100"
    title={!open ? "Expand" : undefined}
  >
    <div className="flex items-center p-2">
      <div className="grid h-10 w-10 shrink-0 place-content-center text-lg">
        <FiChevronsRight
          style={{ transition: "transform 0.25s ease-in-out" }}
          className={open ? "rotate-180" : ""}
        />
      </div>
      <span
        className="text-xs font-medium whitespace-nowrap overflow-hidden"
        style={{
          opacity: open ? 1 : 0,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
        Hide
      </span>
    </div>
  </button>
);
