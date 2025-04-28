import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Home } from "lucide-react";
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
    { path: "/visualizations", label: "VISUALIZATIONS" },
    { path: "/neighborhood-breakdown", label: "NEIGHBORHOODS" },
    { path: "/about", label: "ABOUT" },
    { path: "/contact", label: "CONTACT" },
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
              <Home className="h-7 w-7 text-gray-900" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 justify-end flex-1">
            {navLinks.map((link) => (
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
            ))}
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
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 focus:outline-none"
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
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden bg-white border-t border-gray-100`}
      >
        <div className="px-4 py-2 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`block px-3 py-2 text-base tracking-wider font-bold ${
                isActivePath(link.path)
                  ? "text-[#00A7E1]"
                  : "text-black hover:text-gray-600"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="px-3 py-2">
            <Button
              variant="default"
              className="w-full bg-black hover:bg-gray-800 text-white tracking-wider font-bold"
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
