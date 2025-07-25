"use client";
import { ThemeToggleButton } from "@/components/common/ThemeToggleButton";
import NotificationDropdown from "@/components/header/NotificationDropdown";
import UserDropdown from "@/components/header/UserDropdown";
import Link from "next/link";
import React from "react";

const AppHeader: React.FC = () => {
  return (
    <header className="sticky top-0 flex w-full bg-white border-b border-gray-200 z-[9999] dark:border-gray-800 dark:bg-gray-900">
      <div className="flex items-center justify-between w-full px-6 py-4">
        {/* Logo/Brand */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg mr-3">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11H16V16H8V11H9.2V10C9.2,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.4,8.7 10.4,10V11H13.6V10C13.6,8.7 12.8,8.2 12,8.2Z"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            AI Auditor 
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {/* <!-- Dark Mode Toggler --> */}
          <ThemeToggleButton />
          {/* <!-- Notification Menu --> */}
          <NotificationDropdown />
          {/* <!-- User Area --> */}
          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
