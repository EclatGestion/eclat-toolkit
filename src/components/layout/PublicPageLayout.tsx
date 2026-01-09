import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
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
}

export function PublicPageLayout({ 
  children, 
  title, 
  description, 
  jsonLd,
  canonical,
  image 
}: PublicPageLayoutProps) {
  const navigate = useNavigate();

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
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <img src={eclatLogo} alt="Éclat logo" className="w-8 h-8" />
            <span className="text-xl font-bold text-gray-900">Éclat Toolkit</span>
          </button>
          <div className="flex items-center gap-3">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="ghost" 
                onClick={() => navigate("/auth")}
                className="text-gray-600 hover:text-gray-900 font-medium"
              >
                Se connecter
              </Button>
            </motion.div>
            <motion.div whileHover={{ y: -2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" }} whileTap={{ scale: 0.98 }}>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
              >
                S'inscrire
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
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
      <footer className="border-t border-gray-100 py-8 px-6 bg-gray-50">
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
