import { PublicPageLayout } from "@/components/layout/PublicPageLayout";

export default function MentionsLegales() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Mentions Légales - Éclat Toolkit",
    "description": "Informations légales et éditeur de l'application Éclat Toolkit",
    "url": "https://app.eclat-toolkit.fr/mentions-legales"
  };

  return (
    <PublicPageLayout
      title="Mentions Légales"
      description="Informations légales conformément à la loi LCEN. Éditeur, hébergement, propriété intellectuelle et responsabilités."
      jsonLd={jsonLd}
      canonical="/mentions-legales"
    >
      <div className="prose prose-gray max-w-4xl">
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 9 décembre 2025</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-2">
            <p><strong>Raison sociale :</strong> Éclat Gestion Privée</p>
            <p><strong>Forme juridique :</strong> [À compléter - SAS / SARL / etc.]</p>
            <p><strong>Capital social :</strong> [À compléter] €</p>
            <p><strong>Siège social :</strong> [Adresse à compléter]</p>
            <p><strong>SIRET :</strong> [À compléter]</p>
            <p><strong>RCS :</strong> [À compléter]</p>
            <p><strong>N° TVA intracommunautaire :</strong> [À compléter]</p>
            <p><strong>Directeur de la publication :</strong> [Nom à compléter]</p>
            <p><strong>Contact :</strong> <a href="mailto:contact@eclat-gp.com" className="text-[#2D60FF] hover:underline">contact@eclat-gp.com</a></p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hébergement</h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-2">
            <p><strong>Hébergeur :</strong> Supabase Inc.</p>
            <p><strong>Adresse :</strong> 970 Toa Payoh North, #07-04/05, Singapore 318992</p>
            <p><strong>Site web :</strong> <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-[#2D60FF] hover:underline">https://supabase.com</a></p>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
          <p className="text-gray-600 leading-relaxed">
            L'ensemble du contenu de ce site (textes, images, graphismes, logo, icônes, logiciels, etc.) 
            est la propriété exclusive d'Éclat Gestion Privée, à l'exception des marques, logos ou 
            contenus appartenant à d'autres sociétés partenaires ou auteurs.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Toute reproduction, distribution, modification, adaptation, retransmission ou publication, 
            même partielle, de ces différents éléments est strictement interdite sans l'accord écrit 
            préalable d'Éclat Gestion Privée.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Limitations de responsabilité</h2>
          <p className="text-gray-600 leading-relaxed">
            Les informations et outils disponibles sur Éclat Toolkit sont fournis à titre informatif 
            et pédagogique. Ils ne constituent pas un conseil en investissement, en fiscalité ou en 
            gestion de patrimoine au sens de la réglementation en vigueur.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Éclat Gestion Privée ne saurait être tenue responsable des décisions prises par les 
            utilisateurs sur la base des simulations et informations fournies. Nous recommandons 
            de consulter un professionnel qualifié avant toute décision financière importante.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Éclat Gestion Privée s'efforce d'assurer l'exactitude des informations diffusées sur 
            le site, mais ne peut garantir l'absence d'erreurs ou d'omissions. Les taux, barèmes 
            et réglementations fiscales sont susceptibles d'évoluer.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Crédits</h2>
          <p className="text-gray-600 leading-relaxed">
            <strong>Conception et développement :</strong> Éclat Gestion Privée
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            <strong>Icônes :</strong> Lucide Icons (licence MIT)
          </p>
          <p className="text-gray-600 leading-relaxed mt-2">
            <strong>Polices :</strong> Inter, Poppins (Google Fonts)
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Droit applicable</h2>
          <p className="text-gray-600 leading-relaxed">
            Les présentes mentions légales sont régies par le droit français. En cas de litige, 
            les tribunaux français seront seuls compétents.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}
