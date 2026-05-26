import { useState } from 'react';
import { PenTool, ShieldAlert, ShoppingCart, Terminal, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  onAdminToggle: () => void;
  isAdminActive: boolean;
  orderCount: number;
}

export default function Header({ onAdminToggle, isAdminActive, orderCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#08080a]/60 backdrop-blur-2xl">
      <div id="header-container" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Title */}
        <div id="header-brand" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20 border border-white/15">
            <PenTool className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold tracking-wider text-white">N1 TWINPEN</span>
          </div>
        </div>

        {/* Navigation - Anchor items */}
        <nav id="header-nav" className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
          <a href="#features" className="transition-colors hover:text-blue-400">المميزات</a>
          <a href="#dual-use" className="transition-colors hover:text-blue-400">الاستخدام المزدوج</a>
          <a href="#gallery" className="transition-colors hover:text-blue-400 font-medium">معرض الصور</a>

          <a href="#order" className="rounded-full bg-blue-500/10 px-4 py-1.5 text-xs text-blue-400 border border-white/10 hover:bg-blue-600 hover:text-white transition-all">
            اطلب الآن
          </a>
        </nav>

        {/* Actions (Admin panel toggle and Cart visual reference) */}
        <div id="header-actions" className="flex items-center gap-4">
          {/* Admin panel access removed from here, moved to the bottom footer */}
        </div>
      </div>
    </header>
  );
}
