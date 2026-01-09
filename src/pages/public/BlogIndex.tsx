import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, User, ArrowRight, BookOpen } from "lucide-react";
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

// Category gradient backgrounds for cards (fallback if no image)
const categoryGradients: Record<string, string> = {
  fiscalite: "from-emerald-400 to-emerald-600",
  succession: "from-purple-400 to-purple-600",
  investissement: "from-blue-400 to-blue-600",
  retraite: "from-amber-400 to-amber-600",
  epargne: "from-teal-400 to-teal-600"
};

// JSON-LD ItemList schema for SEO
const jsonLdSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Guides Patrimoine & Fiscalité - Éclat Toolkit",
  "description": "Articles et guides pratiques sur l'optimisation fiscale, la succession et l'investissement en France.",
  "itemListElement": blogPosts.map((post, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "item": {
      "@type": "Article",
      "name": post.title,
      "description": post.excerpt,
      "url": `https://app.eclat-toolkit.fr/blog/${post.slug}`,
      "datePublished": post.date,
      "image": `https://app.eclat-toolkit.fr${post.image}`,
      "author": {
        "@type": "Person",
        "name": post.author
      }
    }
  }))
};

export default function BlogIndex() {
  const navigate = useNavigate();

  // Sort posts by date, most recent first
  const sortedPosts = [...blogPosts].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const featuredPost = sortedPosts[0];
  const otherPosts = sortedPosts.slice(1);

  return (
    <PublicPageLayout
      title="Blog Patrimoine & Fiscalité - Guides Pratiques"
      description="Guides complets sur l'optimisation fiscale, la succession et l'investissement en France. PER, Girardin, Assurance-Vie et plus."
      jsonLd={jsonLdSchema}
      canonical="/blog"
      hidePageHeader={true}
    >
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-4">
          <BookOpen className="w-4 h-4" />
          <span>Ressources & Guides</span>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          Blog Patrimoine & Fiscalité
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Guides pratiques et analyses pour optimiser votre fiscalité, préparer votre succession et faire fructifier votre patrimoine.
        </p>
      </motion.div>

      {/* Featured Article */}
      {featuredPost && (
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onClick={() => navigate(`/blog/${featuredPost.slug}`)}
          className="mb-12 cursor-pointer group"
        >
          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300">
            <div className="grid lg:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative h-64 lg:h-auto overflow-hidden">
                {featuredPost.image ? (
                  <img 
                    src={featuredPost.image} 
                    alt={featuredPost.imageAlt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${categoryGradients[featuredPost.category]}`} />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:hidden" />
              </div>
              
              {/* Content */}
              <div className="p-8 lg:p-10 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(featuredPost.category)}`}>
                    {getCategoryLabel(featuredPost.category)}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(featuredPost.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </span>
                </div>
                
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-[#2D60FF] transition-colors">
                  {featuredPost.title}
                </h2>
                
                <p className="text-gray-600 mb-6 line-clamp-3 text-lg leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span>{featuredPost.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{featuredPost.readTime} min de lecture</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#2D60FF] font-medium group-hover:gap-3 transition-all">
                    <span className="hidden sm:inline">Lire l'article</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.article>
      )}

      {/* Section Title */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex items-center gap-4 mb-8"
      >
        <h2 className="text-xl font-bold text-gray-900">Tous les articles</h2>
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-sm text-gray-500">{otherPosts.length} articles</span>
      </motion.div>

      {/* Grid of Blog Cards */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {otherPosts.map((post) => (
          <motion.article
            key={post.id}
            variants={fadeUpVariant}
            transition={{ duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => navigate(`/blog/${post.slug}`)}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            {/* Card Image Header */}
            <div className="h-44 relative overflow-hidden">
              {post.image ? (
                <img 
                  src={post.image} 
                  alt={post.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br ${categoryGradients[post.category]}`}>
                  <div className="absolute inset-0 opacity-20">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <circle cx="80" cy="20" r="30" fill="white" />
                      <circle cx="20" cy="80" r="20" fill="white" />
                      <circle cx="60" cy="60" r="15" fill="white" />
                    </svg>
                  </div>
                </div>
              )}
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${getCategoryColor(post.category)}`}>
                  {getCategoryLabel(post.category)}
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              <time className="text-xs text-gray-400 mb-2 block">
                {new Date(post.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
              
              <h2 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[#2D60FF] transition-colors">
                {post.title}
              </h2>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                {post.excerpt}
              </p>
              
              {/* Card Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="w-3 h-3 text-gray-400" />
                  </div>
                  <span className="font-medium">{post.author.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-400">
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
        className="mt-16 text-center bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-3xl p-8 lg:p-12 border border-gray-100"
      >
        <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
          Passez à l'action
        </h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">
          Utilisez nos simulateurs gratuits pour calculer vos économies d'impôts et optimiser votre patrimoine dès aujourd'hui.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(45,96,255,0.35)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/simulateur-impot")}
            className="bg-[#2D60FF] hover:bg-[#2550DD] text-white rounded-full px-8 py-3.5 font-semibold shadow-lg shadow-[#2D60FF]/25 flex items-center justify-center gap-2"
          >
            Simuler mes impôts
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/academie")}
            className="bg-white hover:bg-gray-50 text-gray-900 rounded-full px-8 py-3.5 font-semibold border border-gray-200 shadow-sm"
          >
            Découvrir l'Académie
          </motion.button>
        </div>
      </motion.div>
    </PublicPageLayout>
  );
}
