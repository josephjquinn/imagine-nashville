import { Navbar } from "../Navbar";
import { Outlet } from "react-router-dom";

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

      {/* Fixed Footer */}
      <footer className="absolute bottom-0 w-full bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-20">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} Imagine Nashville. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
