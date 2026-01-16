import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CartDrawer from "./CartDrawer";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Shop", path: "/shop" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 h-16 bg-background/95 backdrop-blur-sm transition-all duration-350 ${isScrolled ? "header-scrolled" : ""}`}>
        <div className="container h-full flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 -ml-2 text-foreground" aria-label="Open menu">
            <Menu className="w-5 h-5" />
          </button>
          <Link to="/" className="font-display text-xl font-semibold tracking-tight text-foreground absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            Eluro
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`link-subtle text-sm font-medium transition-colors duration-300 ${location.pathname === link.path ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {link.name}
              </Link>
            ))}
          </nav>
          <CartDrawer />
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/20 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 30, stiffness: 300 }} className="fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-background z-50 md:hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-12">
                  <span className="font-display text-xl font-semibold">Eluro</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2" aria-label="Close menu">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <Link key={link.path} to={link.path} className="text-2xl font-display font-medium text-foreground">
                      {link.name}
                    </Link>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
