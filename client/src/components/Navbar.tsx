import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { path: "/visualizations", label: "VISUALIZATIONS", clickable: true },
    {
      path: "/neighborhood-breakdown",
      label: "NEIGHBORHOODS",
      clickable: false,
    },
    { path: "/about", label: "ABOUT", clickable: false },
    { path: "/contact", label: "CONTACT", clickable: false },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <div className="w-full px-9">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/BY2.png"
                alt="Imagine Nashville Logo"
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 justify-end flex-1">
            {navLinks.map((link) =>
              link.clickable ? (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm tracking-wider font-bold transition-colors duration-200 ${
                    isActivePath(link.path)
                      ? "text-[#00A7E1]"
                      : "text-black hover:text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              ) : (
                <span
                  key={link.path}
                  className="text-sm tracking-wider font-bold text-gray-400 cursor-not-allowed"
                >
                  {link.label}
                </span>
              )
            )}
            <Button
              variant="default"
              className="ml-4 bg-black hover:bg-gray-800 text-white tracking-wider font-bold"
              onClick={() =>
                window.open("https://imaginenashville.org/", "_blank")
              }
            >
              LEARN MORE
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center justify-end flex-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900 focus:outline-none transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden fixed top-16 left-0 right-0 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-2 pointer-events-none"
        } bg-white border-t border-gray-100 shadow-lg`}
      >
        <div className="px-4 py-3 space-y-2">
          {navLinks.map((link) =>
            link.clickable ? (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-3 text-base tracking-wider font-bold rounded-lg transition-colors duration-200 ${
                  isActivePath(link.path)
                    ? "text-[#00A7E1] bg-blue-50"
                    : "text-black hover:text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <span
                key={link.path}
                className="block px-3 py-3 text-base tracking-wider font-bold text-gray-400 cursor-not-allowed rounded-lg"
              >
                {link.label}
              </span>
            )
          )}
          <div className="px-3 py-3">
            <Button
              variant="default"
              className="w-full bg-black hover:bg-gray-800 text-white tracking-wider font-bold py-3 rounded-lg"
              onClick={() => {
                window.open("https://imaginenashville.org/", "_blank");
                setIsOpen(false);
              }}
            >
              LEARN MORE
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
