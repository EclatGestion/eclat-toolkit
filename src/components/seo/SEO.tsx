import { Helmet } from "react-helmet-async";

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  image?: string;
  jsonLd?: object | object[];
  noIndex?: boolean;
  type?: "website" | "article";
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const BASE_URL = "https://app.eclat-toolkit.fr";
const DEFAULT_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = "Éclat Toolkit";
const DEFAULT_AUTHOR = "Éclat Gestion Privée";

export function SEO({
  title,
  description,
  canonical,
  image,
  jsonLd,
  noIndex = false,
  type = "website",
  keywords,
  author,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const fullCanonical = canonical ? `${BASE_URL}${canonical}` : undefined;
  const ogImage = image ? (image.startsWith("http") ? image : `${BASE_URL}${image}`) : DEFAULT_IMAGE;

  // Truncate description to 160 characters
  const truncatedDescription = description.length > 160 
    ? `${description.substring(0, 157)}...` 
    : description;

  // Truncate title to 60 characters for SEO
  const truncatedTitle = fullTitle.length > 60 
    ? `${fullTitle.substring(0, 57)}...` 
    : fullTitle;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{truncatedTitle}</title>
      <meta name="description" content={truncatedDescription} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      {!noIndex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      {fullCanonical && <link rel="canonical" href={fullCanonical} />}
      
      {/* Additional SEO Meta Tags */}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author || DEFAULT_AUTHOR} />
      <meta name="publisher" content={SITE_NAME} />
      <meta name="language" content="fr" />
      <meta name="geo.region" content="FR" />
      <meta name="geo.placename" content="France" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={truncatedTitle} />
      <meta property="og:description" content={truncatedDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={truncatedTitle} />
      {fullCanonical && <meta property="og:url" content={fullCanonical} />}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="fr_FR" />
      
      {/* Article-specific Open Graph */}
      {type === "article" && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === "article" && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === "article" && (
        <meta property="article:author" content={author || DEFAULT_AUTHOR} />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={truncatedTitle} />
      <meta name="twitter:description" content={truncatedDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={truncatedTitle} />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(Array.isArray(jsonLd) ? jsonLd : jsonLd)}
        </script>
      )}
    </Helmet>
  );
}
