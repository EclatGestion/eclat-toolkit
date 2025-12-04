import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { blogPosts, getCategoryLabel, getCategoryColor } from "@/data/blogPosts";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// Category gradient backgrounds for cards
const categoryGradients: Record<string, string> = {
  fiscalite: "from-emerald-400 to-emerald-600",
  succession: "from-purple-400 to-purple-600",
  investissement: "from-blue-400 to-blue-600",
  retraite: "from-amber-400 to-amber-600"
};

// JSON-LD ItemList schema for SEO
const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Guides Fiscalité & Patrimoine",
  "description": "Articles et guides pratiques sur la fiscalité française, la succession et l'investissement.",
  "itemListElement": blogPosts.map((post, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Article",
      "name": post.title,
      "description": post.excerpt,
      "url": `https://eclat-toolkit.lovable.app/blog/${post.slug}`,
      "datePublished": post.date,
      "author": {
        "@type": "Person",
        "name": post.author
      }
    }
  }))
};

export default function BlogIndex() {
  const navigate = useNavigate();

  return (
    <PublicPageLayout
      title="Blog | Guides Fiscalité & Patrimoine | Éclat Toolkit"
      description="Découvrez nos guides pratiques sur l'optimisation fiscale, la succession et la gestion de patrimoine."
      jsonLd={jsonLdSchema}
    >
      {/* Grid of Blog Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {blogPosts.map((post) => (
          <motion.article
            key={post.id}
            variants={fadeUpVariant}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-shadow"
          >
            {/* Card Image/Gradient Header */}
            <div className={`h-40 bg-gradient-to-br ${categoryGradients[post.category]} relative`}>
              {/* Abstract Pattern */}
              <div className="absolute inset-0 opacity-20">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <circle cx="80" cy="20" r="30" fill="white" />
                  <circle cx="20" cy="80" r="20" fill="white" />
                  <circle cx="60" cy="60" r="15" fill="white" />
                </svg>
              </div>
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                  {getCategoryLabel(post.category)}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-[#2D60FF] transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              {/* Card Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  <span>{post.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{post.readTime} min</span>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 text-center bg-gray-50 rounded-3xl p-8 lg:p-12"
      >
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Passez à l'action
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Utilisez nos simulateurs gratuits pour calculer vos économies d'impôts et optimiser votre patrimoine.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(45,96,255,0.35)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/simulateur-impot")}
            className="bg-[#2D60FF] hover:bg-[#2550DD] text-white rounded-full px-8 py-3 font-semibold shadow-lg shadow-[#2D60FF]/25"
          >
            Simuler mes impôts
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/academie")}
            className="bg-white hover:bg-gray-50 text-gray-900 rounded-full px-8 py-3 font-semibold border border-gray-200"
          >
            Découvrir l'Académie
          </motion.button>
        </div>
      </motion.div>
    </PublicPageLayout>
  );
}
