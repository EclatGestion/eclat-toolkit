import { PublicPageLayout } from "@/components/layout/PublicPageLayout";

export default function CGU() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Conditions Générales d'Utilisation - Éclat Toolkit",
    "description": "Conditions générales d'utilisation de l'application Éclat Toolkit",
    "url": "https://eclat-toolkit.lovable.app/cgu"
  };

  return (
    <PublicPageLayout
      title="Conditions Générales d'Utilisation | Éclat Toolkit"
      description="CGU du service Éclat Toolkit"
      jsonLd={jsonLd}
    >
      <div className="prose prose-gray max-w-4xl">
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 9 décembre 2025</p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Objet</h2>
          <p className="text-gray-600 leading-relaxed">
            Les présentes Conditions Générales d'Utilisation (ci-après « CGU ») ont pour objet de 
            définir les modalités et conditions d'utilisation de l'application Éclat Toolkit 
            (ci-après « le Service »), éditée par Éclat Gestion Privée (ci-après « l'Éditeur »).
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            L'inscription et l'utilisation du Service impliquent l'acceptation sans réserve des 
            présentes CGU par l'utilisateur.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Définitions</h2>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Service :</strong> L'application Éclat Toolkit et l'ensemble de ses fonctionnalités</li>
            <li><strong>Utilisateur :</strong> Toute personne physique ayant créé un compte sur le Service</li>
            <li><strong>Compte :</strong> Espace personnel créé par l'Utilisateur pour accéder au Service</li>
            <li><strong>Abonnement :</strong> Souscription payante donnant accès aux fonctionnalités Premium ou Expert</li>
            <li><strong>Simulateurs :</strong> Outils de calcul et de projection financière proposés par le Service</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Inscription et compte utilisateur</h2>
          <p className="text-gray-600 leading-relaxed">
            Pour utiliser le Service, l'Utilisateur doit créer un compte en fournissant une adresse 
            email valide et un mot de passe. L'Utilisateur s'engage à :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
            <li>Fournir des informations exactes et à jour</li>
            <li>Préserver la confidentialité de ses identifiants de connexion</li>
            <li>Ne pas créer de compte pour un tiers sans son autorisation</li>
            <li>Informer immédiatement l'Éditeur de toute utilisation non autorisée de son compte</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            L'Utilisateur est seul responsable de l'utilisation faite de son compte.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Description du Service</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Éclat Toolkit propose une suite d'outils de gestion patrimoniale organisés en trois niveaux d'accès :
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Gratuit (0€)</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Calculateur d'inflation</li>
                <li>Capacité d'épargne mensuelle</li>
                <li>Simulateur IR (version simplifiée)</li>
              </ul>
            </div>
            
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="font-semibold text-gray-900 mb-2">Premium (5,99€/mois ou 49,99€/an)</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Simulateur IR complet avec optimisation</li>
                <li>Simulateur immobilier</li>
                <li>Calculateur d'intérêts composés</li>
                <li>Simulateur Assurance-Vie</li>
                <li>Optimisation PER</li>
              </ul>
            </div>
            
            <div className="bg-violet-50 rounded-xl p-6 border border-violet-200">
              <h3 className="font-semibold text-gray-900 mb-2">Expert (14,99€/mois ou 149,99€/an)</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Bilan Patrimonial avec recommandations IA</li>
                <li>Calculateur Droits de Succession</li>
                <li>Comparateur LMNP vs Location Nue</li>
                <li>Conseiller IA personnalisé</li>
                <li>Export PDF professionnel</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Tarification et paiement</h2>
          <p className="text-gray-600 leading-relaxed">
            Les abonnements Premium et Expert sont facturés au tarif en vigueur au moment de la souscription.
            Le paiement s'effectue via la plateforme sécurisée Stripe. L'Utilisateur peut choisir entre 
            une facturation mensuelle ou annuelle.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Les prix sont indiqués en euros TTC. L'Éditeur se réserve le droit de modifier ses tarifs 
            à tout moment, les modifications n'étant applicables qu'aux nouveaux abonnements ou aux 
            renouvellements suivant la notification.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Droit de rétractation</h2>
          <p className="text-gray-600 leading-relaxed">
            Conformément à l'article L221-18 du Code de la consommation, l'Utilisateur dispose d'un 
            délai de 14 jours à compter de la souscription pour exercer son droit de rétractation 
            sans motif ni pénalité.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            Pour exercer ce droit, l'Utilisateur doit adresser une demande claire à l'adresse 
            <a href="mailto:contact@eclat-gp.com" className="text-[#2D60FF] hover:underline mx-1">contact@eclat-gp.com</a>
            avant l'expiration du délai. Le remboursement intervient dans les 14 jours suivant la 
            réception de la demande.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            <strong>Exception :</strong> Si l'Utilisateur a commencé à utiliser le Service Premium/Expert 
            avant l'expiration du délai de rétractation, il reconnaît expressément renoncer à son 
            droit de rétractation.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Durée et résiliation</h2>
          <p className="text-gray-600 leading-relaxed">
            Les abonnements sont conclus pour une durée indéterminée avec une période de facturation 
            mensuelle ou annuelle selon le choix de l'Utilisateur.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            L'Utilisateur peut résilier son abonnement à tout moment depuis son espace personnel ou 
            via le portail client Stripe. La résiliation prend effet à la fin de la période de 
            facturation en cours.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            L'Éditeur se réserve le droit de suspendre ou supprimer un compte en cas de violation 
            des présentes CGU, sans préavis ni indemnité.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Responsabilités de l'Utilisateur</h2>
          <p className="text-gray-600 leading-relaxed">L'Utilisateur s'engage à :</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
            <li>Utiliser le Service conformément à sa destination et aux présentes CGU</li>
            <li>Ne pas utiliser le Service à des fins illégales ou frauduleuses</li>
            <li>Ne pas tenter de contourner les mesures de sécurité du Service</li>
            <li>Ne pas partager son accès Premium/Expert avec des tiers</li>
            <li>Fournir des données exactes dans les simulateurs</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation de responsabilité</h2>
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-4">
            <p className="text-gray-700 font-medium">
              ⚠️ Les outils et simulateurs d'Éclat Toolkit sont fournis à titre informatif et 
              pédagogique. Ils ne constituent pas un conseil en investissement, en fiscalité ou 
              en gestion de patrimoine au sens de la réglementation en vigueur.
            </p>
          </div>
          <p className="text-gray-600 leading-relaxed">
            L'Éditeur ne saurait être tenu responsable :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
            <li>Des décisions financières prises par l'Utilisateur sur la base des simulations</li>
            <li>Des erreurs de saisie effectuées par l'Utilisateur</li>
            <li>Des évolutions réglementaires ou fiscales postérieures aux calculs</li>
            <li>Des interruptions temporaires du Service pour maintenance</li>
            <li>Des dommages indirects résultant de l'utilisation du Service</li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            <strong>Nous recommandons de consulter un conseiller en gestion de patrimoine (CGP) 
            ou un expert-comptable avant toute décision financière importante.</strong>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Propriété intellectuelle</h2>
          <p className="text-gray-600 leading-relaxed">
            L'ensemble des éléments du Service (textes, graphiques, logiciels, base de données, 
            algorithmes, interface) est protégé par les droits de propriété intellectuelle et 
            appartient exclusivement à l'Éditeur.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            L'Utilisateur dispose d'un droit d'usage personnel et non exclusif du Service, limité 
            à la durée de son abonnement. Toute reproduction, représentation ou extraction non 
            autorisée est interdite.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Protection des données personnelles</h2>
          <p className="text-gray-600 leading-relaxed">
            Le traitement des données personnelles de l'Utilisateur est régi par notre{" "}
            <a href="/confidentialite" className="text-[#2D60FF] hover:underline">
              Politique de Confidentialité
            </a>, qui fait partie intégrante des présentes CGU.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modification des CGU</h2>
          <p className="text-gray-600 leading-relaxed">
            L'Éditeur se réserve le droit de modifier les présentes CGU à tout moment. Les 
            modifications seront notifiées aux Utilisateurs par email et/ou notification dans 
            l'application. La poursuite de l'utilisation du Service après notification vaut 
            acceptation des nouvelles CGU.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Droit applicable et juridiction</h2>
          <p className="text-gray-600 leading-relaxed">
            Les présentes CGU sont régies par le droit français. En cas de litige, les parties 
            s'engagent à rechercher une solution amiable avant toute action judiciaire.
          </p>
          <p className="text-gray-600 leading-relaxed mt-4">
            À défaut d'accord amiable, les tribunaux français seront seuls compétents pour 
            connaître du litige. Conformément à l'article L616-1 du Code de la consommation, 
            l'Utilisateur peut recourir gratuitement à un médiateur de la consommation.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact</h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-2">
            <p>Pour toute question relative aux présentes CGU :</p>
            <p><strong>Email :</strong> <a href="mailto:contact@eclat-gp.com" className="text-[#2D60FF] hover:underline">contact@eclat-gp.com</a></p>
            <p><strong>Adresse :</strong> [Adresse à compléter]</p>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}
