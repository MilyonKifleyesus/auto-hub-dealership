import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Car, Phone } from "lucide-react";

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigation = [
    { name: "HOME", href: "/" },
    { name: "INVENTORY", href: "/inventory" },
    { name: "SERVICES", href: "/services" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-matte-black/95 backdrop-blur-lg border-b border-gray-800 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Enhanced Logo with High Visibility */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div
              className={`relative w-12 h-12 rounded-sm flex items-center justify-center transition-all duration-300 transform group-hover:scale-110 ${
                isScrolled
                  ? "bg-gradient-to-br from-[rgb(215,255,0)] to-[rgb(215,255,0)] shadow-lg shadow-[rgb(215,255,0)]/30"
                  : "bg-gradient-to-br from-[rgb(215,255,0)] to-[rgb(215,255,0)] shadow-2xl shadow-[rgb(215,255,0)]/50 border-2 border-[rgb(215,255,0)]/50"
              }`}
            >
              {/* Emergency Icon with Enhanced Visibility */}
              <div className="relative">
                <Car className="w-7 h-7 text-black drop-shadow-lg" />
                {/* Pulsing glow effect for emergency visibility */}
                <div className="absolute inset-0 bg-[rgb(215,255,0)] rounded-sm opacity-30 animate-pulse"></div>
              </div>
              {/* Additional glow ring for maximum visibility */}
              <div className="absolute inset-0 rounded-sm border-2 border-[rgb(215,255,0)]/40 animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <span
                className={`text-xl font-black tracking-wider transition-all duration-300 ${
                  isScrolled
                    ? "text-white drop-shadow-sm"
                    : "text-white drop-shadow-2xl"
                }`}
              >
                MIKEY G AUTO
              </span>
              <div className="text-xs text-[rgb(215,255,0)] font-bold tracking-widest">
                EMERGENCY SERVICE
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-bold tracking-wider transition-all duration-300 hover:text-[rgb(215,255,0)] ${
                  location.pathname === item.href
                    ? "text-[rgb(215,255,0)] border-b-2 border-[rgb(215,255,0)]"
                    : isScrolled
                    ? "text-white hover:text-[rgb(215,255,0)]"
                    : "text-white drop-shadow-lg hover:text-[rgb(215,255,0)]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Enhanced Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Enhanced Emergency Contact Button */}
            <a
              href="tel:+14169166475"
              className={`group relative px-6 py-3 rounded-sm font-bold tracking-wider text-sm transition-all duration-300 transform hover:scale-105 ${
                isScrolled
                  ? "bg-gradient-to-r from-neon-green-500 to-neon-green-600 text-black shadow-lg shadow-neon-green-500/30 hover:shadow-neon-green-500/50"
                  : "bg-gradient-to-r from-neon-green-500 to-neon-green-600 text-black shadow-2xl shadow-neon-green-500/50 border-2 border-neon-green-400/50 hover:shadow-neon-green-500/70"
              }`}
              style={{
                background: isScrolled
                  ? "linear-gradient(135deg, rgb(215, 255, 0) 0%, rgb(195, 230, 0) 100%)"
                  : "linear-gradient(135deg, rgb(215, 255, 0) 0%, rgb(195, 230, 0) 100%)",
                boxShadow: isScrolled
                  ? "0 4px 20px rgba(215, 255, 0, 0.3), 0 0 0 1px rgba(215, 255, 0, 0.2)"
                  : "0 8px 32px rgba(215, 255, 0, 0.5), 0 0 0 2px rgba(215, 255, 0, 0.3), 0 0 20px rgba(215, 255, 0, 0.2)",
              }}
            >
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 drop-shadow-sm" />
                <span className="drop-shadow-sm">EMERGENCY</span>
              </div>
              {/* Pulsing effect for emergency urgency */}
              <div className="absolute inset-0 rounded-sm bg-neon-green-300 opacity-0 group-hover:opacity-30 animate-pulse"></div>
            </a>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-3 rounded-sm transition-all duration-300 ${
                isScrolled
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border border-white/20"
              }`}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-matte-black/98 backdrop-blur-lg border-t border-gray-800 shadow-2xl">
          <div className="px-4 py-6 space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-3 px-4 rounded-sm text-lg font-bold tracking-wider transition-all duration-300 ${
                  location.pathname === item.href
                    ? "text-[rgb(215,255,0)] bg-[rgb(215,255,0)]/10 border-l-4 border-[rgb(215,255,0)]"
                    : "text-white hover:text-[rgb(215,255,0)] hover:bg-white/5"
                }`}
              >
                {item.name}
              </Link>
            ))}

            {/* Mobile Action Buttons */}
            <div className="pt-4 space-y-3 border-t border-gray-800">
              <a
                href="tel:+14169166475"
                className="flex items-center justify-center space-x-3 w-full py-4 rounded-sm font-bold tracking-wider text-black transition-all duration-300"
                style={{
                  background:
                    "linear-gradient(135deg, rgb(215, 255, 0) 0%, rgb(195, 230, 0) 100%)",
                  boxShadow: "0 4px 20px rgba(215, 255, 0, 0.3)",
                }}
              >
                <Phone className="w-5 h-5" />
                <span>EMERGENCY CALL</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
