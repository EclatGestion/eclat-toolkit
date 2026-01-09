import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import DOMPurify from "dompurify";
import { ArrowLeft, Clock, User, Calculator, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PublicPageLayout } from "@/components/layout/PublicPageLayout";
import { getPostBySlug, getCategoryLabel, getCategoryColor } from "@/data/blogPosts";

// Tool CTA configurations
const toolCTAs: Record<string, { title: string; description: string; buttonText: string; route: string }> = {
  "simulateur-ir": {
    title: "Calculez votre économie d'impôt",
    description: "Utilisez notre simulateur pour voir l'impact du PER et du Girardin sur votre fiscalité.",
    buttonText: "Lancer le simulateur",
    route: "/simulateur-impot"
  },
  "droits-succession": {
    title: "Estimez les droits de succession",
    description: "Calculez les droits à payer par vos héritiers et découvrez les stratégies d'optimisation.",
    buttonText: "Calculer maintenant",
    route: "/tools/droits-succession"
  }
};

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const post = slug ? getPostBySlug(slug) : undefined;

  // Update document title and meta
  useEffect(() => {
    if (post) {
      document.title = post.metaTitle;
      
      // Update meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', post.metaDescription);
    }
  }, [post]);

  if (!post) {
    return (
      <PublicPageLayout title="Article non trouvé | Éclat Toolkit">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article non trouvé</h1>
          <p className="text-gray-600 mb-6">L'article que vous recherchez n'existe pas.</p>
          <Button onClick={() => navigate("/blog")}>
            Retour au blog
          </Button>
        </div>
      </PublicPageLayout>
    );
  }

  const ctaConfig = toolCTAs[post.relatedTool];

  // JSON-LD Article schema
  const jsonLdSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.excerpt,
    "image": `https://app.eclat-toolkit.fr${post.image}`,
    "datePublished": post.date,
    "author": {
      "@type": "Person",
      "name": post.author,
      "jobTitle": post.authorRole
    },
    "publisher": {
      "@type": "Organization",
      "name": "Éclat Toolkit",
      "logo": {
        "@type": "ImageObject",
        "url": "https://app.eclat-toolkit.fr/favicon.ico"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://app.eclat-toolkit.fr/blog/${post.slug}`
    }
  };

  return (
    <PublicPageLayout
      title={post.metaTitle}
      description={post.metaDescription}
      jsonLd={jsonLdSchema}
      canonical={`/blog/${post.slug}`}
      hidePageHeader={true}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <article className="flex-1 max-w-3xl">
          {/* Back Link */}
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate("/blog")}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux articles</span>
          </motion.button>

          {/* Article Header */}
          <motion.header
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${getCategoryColor(post.category)}`}>
              {getCategoryLabel(post.category)}
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{post.author}</span>
                <span className="text-gray-300">•</span>
                <span>{post.authorRole}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{post.readTime} min de lecture</span>
              </div>
              <time dateTime={post.date} className="text-gray-400">
                {new Date(post.date).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
            </div>
            
            {/* Hero Image */}
            {post.image && (
              <img 
                src={post.image}
                alt={post.imageAlt}
                className="w-full h-64 object-cover rounded-2xl"
              />
            )}
          </motion.header>

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="article-content"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />

          {/* Mobile CTA */}
          {ctaConfig && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:hidden mt-12 bg-gradient-to-br from-[#2D60FF] to-[#1E40AF] rounded-2xl p-6 text-white"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calculator className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold">{ctaConfig.title}</h3>
              </div>
              <p className="text-blue-100 text-sm mb-4">{ctaConfig.description}</p>
              <Button
                onClick={() => navigate(ctaConfig.route)}
                className="w-full bg-white text-[#2D60FF] hover:bg-gray-100 rounded-full"
              >
                {ctaConfig.buttonText}
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}
        </article>

        {/* Sidebar CTA (Desktop) */}
        {ctaConfig && (
          <aside className="hidden lg:block w-80">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="sticky top-24 bg-gradient-to-br from-[#2D60FF] to-[#1E40AF] rounded-2xl p-6 text-white shadow-xl shadow-[#2D60FF]/20"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <Calculator className="w-6 h-6" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2">{ctaConfig.title}</h3>
              <p className="text-blue-100 text-sm mb-6">{ctaConfig.description}</p>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => navigate(ctaConfig.route)}
                  className="w-full bg-white text-[#2D60FF] hover:bg-gray-100 rounded-full font-semibold"
                >
                  {ctaConfig.buttonText}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>

              {/* Additional Links */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-xs text-blue-200 mb-3">Découvrez aussi</p>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/academie")}
                    className="w-full text-left text-sm text-white/80 hover:text-white transition-colors"
                  >
                    → Académie Financière
                  </button>
                  <button
                    onClick={() => navigate("/auth")}
                    className="w-full text-left text-sm text-white/80 hover:text-white transition-colors"
                  >
                    → Créer un compte gratuit
                  </button>
                </div>
              </div>
            </motion.div>
          </aside>
        )}
      </div>
    </PublicPageLayout>
  );
}
