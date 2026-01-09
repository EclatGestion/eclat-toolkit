import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SEO } from "@/components/seo/SEO";
import eclatLogo from "@/assets/eclat-logo.png";

interface PublicPageLayoutProps {
  children: ReactNode;
  title: string;
  description?: string;
  jsonLd?: object | object[];
  canonical?: string;
  image?: string;
  hidePageHeader?: boolean;
}

const navLinks = [
  { label: "Accueil", path: "/" },
  { label: "Tarifs", path: "/pricing" },
  { label: "Blog", path: "/blog" },
  { label: "Académie", path: "/academie" },
];

export function PublicPageLayout({ 
  children, 
  title, 
  description, 
  jsonLd,
  canonical,
  image,
  hidePageHeader = false
}: PublicPageLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEO 
        title={title} 
        description={description || ""} 
        jsonLd={jsonLd}
        canonical={canonical}
        image={image}
      />
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={eclatLogo} alt="Éclat logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900 hidden sm:block">Éclat Toolkit</span>
          </button>

          {/* Navigation centrale */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? "bg-gray-100 text-gray-900"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="text-gray-600 hover:text-gray-900 font-medium text-sm px-3"
              >
                Se connecter
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4 sm:px-6 text-sm"
              >
                S'inscrire
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Navigation mobile */}
        <nav className="md:hidden flex items-center justify-center gap-1 pb-2 px-4 overflow-x-auto">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                isActive(link.path)
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 pt-28 md:pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          {!hidePageHeader && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-8"
            >
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {title.split("|")[0].trim()}
              </h1>
              {description && (
                <p className="text-lg text-gray-600">{description}</p>
              )}
            </motion.div>
          )}

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {children}
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src={eclatLogo} alt="Éclat logo" className="w-6 h-6" />
              <span className="text-sm text-gray-600">© 2025 Éclat Toolkit</span>
            </div>
            <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-500">
              <button onClick={() => navigate("/")} className="hover:text-gray-900 transition-colors">
                Accueil
              </button>
              <button onClick={() => navigate("/pricing")} className="hover:text-gray-900 transition-colors">
                Tarifs
              </button>
              <button onClick={() => navigate("/blog")} className="hover:text-gray-900 transition-colors">
                Blog
              </button>
              <button onClick={() => navigate("/mentions-legales")} className="hover:text-gray-900 transition-colors">
                Mentions Légales
              </button>
              <button onClick={() => navigate("/confidentialite")} className="hover:text-gray-900 transition-colors">
                Confidentialité
              </button>
              <button onClick={() => navigate("/cgu")} className="hover:text-gray-900 transition-colors">
                CGU
              </button>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
