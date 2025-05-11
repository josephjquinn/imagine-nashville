import { Navbar } from "../Navbar";
import { Outlet } from "react-router-dom";
import { MobileNotification } from "../MobileNotification";

const SITE_VERSION = "1.1";

export function Layout() {
  return (
    <div className="relative h-screen flex flex-col">
      {/* Fixed Navbar */}
      <header className="absolute top-0 w-full z-20">
        <Navbar />
      </header>

      {/* Main Scrollable Content */}
      <main className="flex-1 overflow-auto pt-16 pb-20">
        <Outlet />
      </main>

      {/* Mobile Notification */}
      <MobileNotification />

      {/* Fixed Footer */}
      <footer className="absolute bottom-0 w-full bg-white border-t border-gray-200 z-20">
        <div className="max-w-7xl mx-auto py-2 sm:py-6 px-2 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center gap-2 text-gray-500 text-xs sm:text-sm">
            <p>
              © {new Date().getFullYear()} Imagine Nashville. All rights
              reserved.
            </p>
            <span className="text-gray-400">•</span>
            <p>v{SITE_VERSION}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
