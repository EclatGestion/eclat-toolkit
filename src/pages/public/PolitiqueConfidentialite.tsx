import { PublicPageLayout } from "@/components/layout/PublicPageLayout";

export default function PolitiqueConfidentialite() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Politique de Confidentialité - Éclat Toolkit",
    "description": "Politique de confidentialité et protection des données personnelles conformément au RGPD",
    "url": "https://eclat-toolkit.lovable.app/confidentialite"
  };

  return (
    <PublicPageLayout
      title="Politique de Confidentialité | Éclat Toolkit"
      description="Protection de vos données personnelles conformément au RGPD"
      jsonLd={jsonLd}
    >
      <div className="prose prose-gray max-w-4xl">
        <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 9 décembre 2025</p>

        {/* Table des matières */}
        <nav className="bg-gray-50 rounded-xl p-6 mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Sommaire</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li><a href="#responsable" className="text-[#2D60FF] hover:underline">Responsable de traitement</a></li>
            <li><a href="#donnees" className="text-[#2D60FF] hover:underline">Données collectées</a></li>
            <li><a href="#finalites" className="text-[#2D60FF] hover:underline">Finalités du traitement</a></li>
            <li><a href="#base-legale" className="text-[#2D60FF] hover:underline">Base légale</a></li>
            <li><a href="#conservation" className="text-[#2D60FF] hover:underline">Durée de conservation</a></li>
            <li><a href="#droits" className="text-[#2D60FF] hover:underline">Vos droits</a></li>
            <li><a href="#cookies" className="text-[#2D60FF] hover:underline">Cookies</a></li>
            <li><a href="#securite" className="text-[#2D60FF] hover:underline">Sécurité</a></li>
            <li><a href="#transferts" className="text-[#2D60FF] hover:underline">Transferts de données</a></li>
            <li><a href="#contact" className="text-[#2D60FF] hover:underline">Contact</a></li>
          </ol>
        </nav>

        <section id="responsable" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Responsable de traitement</h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-2">
            <p><strong>Raison sociale :</strong> Éclat Gestion Privée</p>
            <p><strong>Adresse :</strong> [Adresse à compléter]</p>
            <p><strong>Email :</strong> <a href="mailto:dpo@eclat-gp.com" className="text-[#2D60FF] hover:underline">dpo@eclat-gp.com</a></p>
          </div>
        </section>

        <section id="donnees" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Données collectées</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Dans le cadre de l'utilisation d'Éclat Toolkit, nous collectons les catégories de données suivantes :
          </p>
          
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Données d'inscription</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Nom et prénom</li>
                <li>Adresse email</li>
                <li>Numéro de téléphone (optionnel)</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Données patrimoniales saisies</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Montant du patrimoine et des actifs</li>
                <li>Revenus et charges déclarés</li>
                <li>Objectifs financiers (FIRE, retraite, projets)</li>
                <li>Données utilisées dans les simulateurs</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Données de navigation</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-1">
                <li>Adresse IP</li>
                <li>Type de navigateur et d'appareil</li>
                <li>Pages visitées et actions effectuées</li>
                <li>Cookies analytiques (voir section 7)</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="finalites" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Finalités du traitement</h2>
          <p className="text-gray-600 leading-relaxed mb-4">Vos données sont traitées pour les finalités suivantes :</p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Fourniture du service :</strong> Exécution des simulateurs, génération des analyses IA, sauvegarde de vos données patrimoniales</li>
            <li><strong>Gestion de votre compte :</strong> Création, maintenance et sécurisation de votre compte utilisateur</li>
            <li><strong>Amélioration du service :</strong> Analyse d'usage pour améliorer nos outils et fonctionnalités</li>
            <li><strong>Communication :</strong> Envoi d'informations relatives à votre compte et, avec votre consentement, de communications marketing</li>
            <li><strong>Facturation :</strong> Gestion des abonnements Premium et Expert via Stripe</li>
          </ul>
        </section>

        <section id="base-legale" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Base légale du traitement</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Conformément à l'article 6 du RGPD, nos traitements reposent sur les bases légales suivantes :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Exécution du contrat (art. 6.1.b) :</strong> Fourniture des services Éclat Toolkit</li>
            <li><strong>Consentement (art. 6.1.a) :</strong> Communications marketing et cookies non essentiels</li>
            <li><strong>Intérêt légitime (art. 6.1.f) :</strong> Amélioration du service, sécurité, prévention de la fraude</li>
            <li><strong>Obligation légale (art. 6.1.c) :</strong> Conservation des données de facturation</li>
          </ul>
        </section>

        <section id="conservation" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Durée de conservation</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 rounded-xl">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">Type de données</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Durée de conservation</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-200">
                  <td className="p-4">Données de compte</td>
                  <td className="p-4">Durée de la relation + 3 ans après suppression</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Données patrimoniales</td>
                  <td className="p-4">Durée de la relation ou jusqu'à suppression par l'utilisateur</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Données de simulation</td>
                  <td className="p-4">Durée de la session ou sauvegarde utilisateur</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">Données de facturation</td>
                  <td className="p-4">10 ans (obligation légale)</td>
                </tr>
                <tr>
                  <td className="p-4">Cookies</td>
                  <td className="p-4">13 mois maximum</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="droits" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Vos droits</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</li>
            <li><strong>Droit de rectification :</strong> Corriger des données inexactes ou incomplètes</li>
            <li><strong>Droit à l'effacement :</strong> Supprimer vos données dans certaines conditions</li>
            <li><strong>Droit à la portabilité :</strong> Recevoir vos données dans un format structuré</li>
            <li><strong>Droit de limitation :</strong> Limiter le traitement de vos données</li>
            <li><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données</li>
            <li><strong>Retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
          </ul>
          <div className="bg-blue-50 rounded-xl p-6 mt-6">
            <p className="text-gray-700">
              <strong>Pour exercer vos droits :</strong> Envoyez un email à{" "}
              <a href="mailto:dpo@eclat-gp.com" className="text-[#2D60FF] hover:underline">dpo@eclat-gp.com</a>{" "}
              avec une copie de votre pièce d'identité. Nous répondrons dans un délai de 30 jours.
            </p>
          </div>
          <p className="text-gray-600 leading-relaxed mt-4">
            Vous avez également le droit d'introduire une réclamation auprès de la CNIL :{" "}
            <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#2D60FF] hover:underline">
              www.cnil.fr
            </a>
          </p>
        </section>

        <section id="cookies" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Éclat Toolkit utilise des cookies pour assurer le bon fonctionnement du service et améliorer votre expérience :
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-50 rounded-xl">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">Cookie</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Finalité</th>
                  <th className="text-left p-4 font-semibold text-gray-900">Durée</th>
                </tr>
              </thead>
              <tbody className="text-gray-600">
                <tr className="border-b border-gray-200">
                  <td className="p-4">sb-*-auth-token</td>
                  <td className="p-4">Authentification utilisateur (essentiel)</td>
                  <td className="p-4">Session</td>
                </tr>
                <tr className="border-b border-gray-200">
                  <td className="p-4">localStorage</td>
                  <td className="p-4">Préférences utilisateur, sauvegarde locale</td>
                  <td className="p-4">Persistant</td>
                </tr>
                <tr>
                  <td className="p-4">Cookies analytiques</td>
                  <td className="p-4">Statistiques d'utilisation (avec consentement)</td>
                  <td className="p-4">13 mois</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section id="securite" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Sécurité des données</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2">
            <li>Chiffrement des données en transit (HTTPS/TLS)</li>
            <li>Chiffrement des données au repos</li>
            <li>Authentification sécurisée avec hachage des mots de passe</li>
            <li>Contrôles d'accès stricts (Row Level Security)</li>
            <li>Sauvegardes régulières des données</li>
            <li>Surveillance et détection d'intrusions</li>
          </ul>
        </section>

        <section id="transferts" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Transferts de données hors UE</h2>
          <p className="text-gray-600 leading-relaxed">
            Certaines données peuvent être transférées vers des pays hors de l'Union Européenne, 
            notamment vers les États-Unis (hébergement Supabase). Ces transferts sont encadrés par :
          </p>
          <ul className="list-disc list-inside text-gray-600 space-y-2 mt-4">
            <li>Les Clauses Contractuelles Types (CCT) approuvées par la Commission Européenne</li>
            <li>Le respect des garanties appropriées conformément à l'article 46 du RGPD</li>
          </ul>
        </section>

        <section id="contact" className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact</h2>
          <div className="bg-gray-50 rounded-xl p-6 space-y-2">
            <p>Pour toute question relative à cette politique de confidentialité ou à vos données personnelles :</p>
            <p><strong>Email :</strong> <a href="mailto:dpo@eclat-gp.com" className="text-[#2D60FF] hover:underline">dpo@eclat-gp.com</a></p>
            <p><strong>Adresse :</strong> [Adresse à compléter]</p>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}
