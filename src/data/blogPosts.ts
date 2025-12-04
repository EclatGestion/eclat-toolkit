export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: "fiscalite" | "succession" | "investissement" | "retraite" | "bourse" | "alternatif";
  readTime: number;
  author: string;
  authorRole: string;
  relatedTool: string;
  metaTitle: string;
  metaDescription: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "per-guide-2025",
    slug: "per-plan-epargne-retraite-guide-2025",
    title: "Comprendre et Optimiser le PER en 2025",
    excerpt: "Le Plan d'Épargne Retraite (PER) est devenu l'outil incontournable pour réduire ses impôts tout en préparant sa retraite. Découvrez comment maximiser vos avantages fiscaux.",
    date: "2025-01-15",
    category: "retraite",
    readTime: 12,
    author: "Thomas Durand",
    authorRole: "Expert Fiscalité",
    relatedTool: "simulateur-ir",
    metaTitle: "Guide PER 2025 : Comment Réduire vos Impôts jusqu'à 45% | Éclat Toolkit",
    metaDescription: "Découvrez comment le Plan d'Épargne Retraite (PER) peut réduire votre impôt sur le revenu de plusieurs milliers d'euros. Guide complet avec calculs et exemples.",
    content: `
      <h2>Qu'est-ce que le Plan d'Épargne Retraite (PER) ?</h2>
      <p>Le Plan d'Épargne Retraite, créé par la loi PACTE de 2019, est un produit d'épargne à long terme qui permet de se constituer un capital pour la retraite tout en bénéficiant d'avantages fiscaux significatifs. Il remplace les anciens dispositifs (PERP, Madelin, PERCO) et offre une flexibilité accrue.</p>
      
      <p>Le PER existe sous trois formes :</p>
      <ul>
        <li><strong>PER individuel</strong> : accessible à tous, sans condition de statut professionnel</li>
        <li><strong>PER d'entreprise collectif</strong> : proposé par l'employeur, ouvert à tous les salariés</li>
        <li><strong>PER d'entreprise obligatoire</strong> : réservé à certaines catégories de salariés</li>
      </ul>

      <h2>L'avantage fiscal majeur : la déduction des versements</h2>
      <p>L'atout principal du PER réside dans la <strong>déductibilité des versements de votre revenu imposable</strong>. Concrètement, chaque euro versé sur votre PER réduit la base sur laquelle vous êtes imposé.</p>
      
      <p>Prenons un exemple concret :</p>
      <blockquote>
        <p>Marie gagne 60 000 € net imposable par an. Elle est dans la tranche marginale d'imposition (TMI) à 30%. Si elle verse 5 000 € sur son PER, son revenu imposable passe à 55 000 €. Économie d'impôt immédiate : <strong>5 000 € × 30% = 1 500 €</strong>.</p>
      </blockquote>

      <p>Plus votre TMI est élevée, plus l'économie est importante :</p>
      <ul>
        <li>TMI 11% → économie de 550 € pour 5 000 € versés</li>
        <li>TMI 30% → économie de 1 500 € pour 5 000 € versés</li>
        <li>TMI 41% → économie de 2 050 € pour 5 000 € versés</li>
        <li>TMI 45% → économie de 2 250 € pour 5 000 € versés</li>
      </ul>

      <h2>Les plafonds de déduction en 2025</h2>
      <p>Attention, les versements déductibles sont plafonnés. Pour les salariés, le plafond annuel est le plus élevé entre :</p>
      <ul>
        <li>10% des revenus professionnels de N-1, dans la limite de 8 fois le PASS (Plafond Annuel de la Sécurité Sociale)</li>
        <li>10% du PASS, soit environ <strong>4 637 €</strong> en 2025</li>
      </ul>
      
      <p>Le plafond maximum est donc d'environ <strong>37 094 €</strong> pour 2025 (10% de 8 PASS).</p>

      <h3>Le report des plafonds non utilisés</h3>
      <p>Si vous n'avez pas utilisé tout votre plafond les années précédentes, bonne nouvelle : vous pouvez reporter le solde non utilisé sur les <strong>3 années suivantes</strong>. Cette possibilité est particulièrement intéressante pour rattraper des années où vous n'avez pas épargné.</p>
      
      <p>Vous pouvez consulter votre plafond disponible sur votre dernier avis d'imposition, rubrique "Plafond Épargne Retraite".</p>

      <h2>La sortie du PER : capital ou rente ?</h2>
      <p>Contrairement aux anciens produits retraite, le PER offre une grande souplesse à la sortie :</p>
      
      <h3>Sortie en capital</h3>
      <p>À la retraite, vous pouvez récupérer votre épargne en une seule fois ou en plusieurs fois. La fiscalité dépend alors de l'origine des sommes :</p>
      <ul>
        <li><strong>Versements volontaires déduits</strong> : le capital est soumis au barème de l'IR, les plus-values au PFU (30%) ou barème</li>
        <li><strong>Versements non déduits</strong> : seules les plus-values sont imposées</li>
      </ul>

      <h3>Sortie en rente viagère</h3>
      <p>Vous percevez un revenu régulier jusqu'à votre décès. La rente est partiellement imposable selon votre âge au moment de la liquidation (40% à 70% de la rente imposable selon l'âge).</p>

      <h2>Les cas de déblocage anticipé</h2>
      <p>Le PER est normalement bloqué jusqu'à la retraite, mais certaines situations permettent un déblocage anticipé :</p>
      <ul>
        <li><strong>Acquisition de la résidence principale</strong> (uniquement pour les versements volontaires)</li>
        <li>Décès du conjoint ou partenaire de PACS</li>
        <li>Invalidité du titulaire, ses enfants, son conjoint</li>
        <li>Surendettement</li>
        <li>Expiration des droits au chômage</li>
        <li>Cessation d'activité non salariée suite à liquidation judiciaire</li>
      </ul>

      <h2>Stratégie d'optimisation : quand verser ?</h2>
      <p>Pour maximiser l'avantage fiscal, il est judicieux de :</p>
      <ol>
        <li><strong>Verser en fin d'année</strong> : vous connaissez vos revenus annuels et pouvez ajuster le versement</li>
        <li><strong>Cibler les années à fort revenu</strong> : une année avec un bonus exceptionnel est idéale pour un versement important</li>
        <li><strong>Utiliser les plafonds reportés</strong> : pensez à vérifier vos plafonds disponibles des 3 dernières années</li>
      </ol>

      <h2>PER et optimisation globale du patrimoine</h2>
      <p>Le PER s'intègre dans une stratégie patrimoniale globale. Il est souvent judicieux de le combiner avec :</p>
      <ul>
        <li><strong>L'assurance-vie</strong> pour la diversification et la transmission</li>
        <li><strong>L'investissement immobilier</strong> pour d'autres avantages fiscaux (Pinel, LMNP)</li>
        <li><strong>Le Girardin Industriel</strong> pour une réduction d'impôt immédiate (contribuables à fort TMI)</li>
      </ul>

      <h2>Conclusion : le PER est-il fait pour vous ?</h2>
      <p>Le PER est particulièrement adapté si :</p>
      <ul>
        <li>Votre TMI actuel est supérieur ou égal à 30%</li>
        <li>Vous anticipez une TMI plus faible à la retraite</li>
        <li>Vous n'avez pas besoin de liquidité immédiate</li>
        <li>Vous souhaitez préparer votre retraite tout en réduisant vos impôts</li>
      </ul>
      
      <p>Pour savoir exactement combien vous pouvez économiser avec un PER, utilisez notre simulateur d'impôt qui calcule automatiquement l'impact sur votre fiscalité.</p>
    `
  },
  {
    id: "succession-guide",
    slug: "droits-succession-guide-complet",
    title: "Droits de Succession : Le Guide Complet pour Protéger vos Proches",
    excerpt: "Comprendre les droits de succession est essentiel pour protéger votre patrimoine et vos héritiers. Découvrez les abattements, barèmes et stratégies d'optimisation.",
    date: "2025-01-10",
    category: "succession",
    readTime: 15,
    author: "Sophie Martin",
    authorRole: "Conseillère Patrimoniale",
    relatedTool: "droits-succession",
    metaTitle: "Guide Droits de Succession 2025 : Abattements, Barèmes et Optimisation | Éclat Toolkit",
    metaDescription: "Tout savoir sur les droits de succession en France : abattements par héritier, barèmes d'imposition, stratégies avec l'assurance-vie. Guide complet et actualisé.",
    content: `
      <h2>Comprendre les droits de succession en France</h2>
      <p>Les droits de succession sont des impôts prélevés par l'État sur la transmission du patrimoine d'une personne décédée à ses héritiers. Leur calcul peut sembler complexe, mais une bonne compréhension permet d'anticiper et d'optimiser la transmission de son patrimoine.</p>

      <h2>Les abattements : première ligne de défense</h2>
      <p>Avant de calculer les droits, chaque héritier bénéficie d'un <strong>abattement</strong> qui réduit la base taxable. Ces abattements varient selon le lien de parenté :</p>

      <h3>Abattements en ligne directe (enfants, parents)</h3>
      <ul>
        <li><strong>100 000 €</strong> par enfant (renouvelable tous les 15 ans pour les donations)</li>
        <li><strong>100 000 €</strong> par parent (en cas de succession vers les ascendants)</li>
      </ul>

      <h3>Abattements entre conjoints et partenaires PACS</h3>
      <p>Le conjoint survivant ou le partenaire de PACS est <strong>totalement exonéré</strong> de droits de succession depuis 2007. C'est un avantage considérable qui ne s'applique pas aux concubins.</p>

      <h3>Autres abattements</h3>
      <ul>
        <li><strong>15 932 €</strong> entre frères et sœurs</li>
        <li><strong>7 967 €</strong> entre neveux et nièces</li>
        <li><strong>1 594 €</strong> pour les autres héritiers</li>
        <li><strong>159 325 €</strong> pour les personnes handicapées (cumulable avec les autres)</li>
      </ul>

      <h2>Le barème progressif des droits de succession</h2>
      <p>Une fois l'abattement déduit, la part nette taxable est soumise à un barème progressif qui varie selon le lien de parenté.</p>

      <h3>Barème en ligne directe (parents-enfants)</h3>
      <table>
        <thead>
          <tr><th>Part taxable</th><th>Taux</th></tr>
        </thead>
        <tbody>
          <tr><td>Jusqu'à 8 072 €</td><td>5%</td></tr>
          <tr><td>De 8 072 € à 12 109 €</td><td>10%</td></tr>
          <tr><td>De 12 109 € à 15 932 €</td><td>15%</td></tr>
          <tr><td>De 15 932 € à 552 324 €</td><td>20%</td></tr>
          <tr><td>De 552 324 € à 902 838 €</td><td>30%</td></tr>
          <tr><td>De 902 838 € à 1 805 677 €</td><td>40%</td></tr>
          <tr><td>Au-delà de 1 805 677 €</td><td>45%</td></tr>
        </tbody>
      </table>

      <h3>Barème entre frères et sœurs</h3>
      <ul>
        <li>Jusqu'à 24 430 € : <strong>35%</strong></li>
        <li>Au-delà : <strong>45%</strong></li>
      </ul>

      <h3>Autres héritiers</h3>
      <ul>
        <li>Parents jusqu'au 4e degré : <strong>55%</strong></li>
        <li>Au-delà ou non-parents : <strong>60%</strong></li>
      </ul>

      <h2>Exemple concret de calcul</h2>
      <blockquote>
        <p>Jean décède en laissant un patrimoine de 400 000 € à son unique enfant Pierre.</p>
        <p><strong>Part taxable</strong> : 400 000 € - 100 000 € (abattement) = 300 000 €</p>
        <p><strong>Calcul des droits :</strong></p>
        <ul>
          <li>8 072 € × 5% = 404 €</li>
          <li>4 037 € × 10% = 404 €</li>
          <li>3 823 € × 15% = 573 €</li>
          <li>283 068 € × 20% = 56 614 €</li>
        </ul>
        <p><strong>Total des droits</strong> : 57 995 € (soit environ 14,5% de la succession)</p>
      </blockquote>

      <h2>L'assurance-vie : un outil puissant de transmission</h2>
      <p>L'assurance-vie bénéficie d'un régime fiscal très favorable en matière de succession, à condition de bien l'utiliser.</p>

      <h3>Versements avant 70 ans</h3>
      <p>Les capitaux versés avant les 70 ans de l'assuré bénéficient d'un abattement de <strong>152 500 € par bénéficiaire</strong>. Au-delà, les sommes sont taxées à :</p>
      <ul>
        <li>20% jusqu'à 700 000 €</li>
        <li>31,25% au-delà</li>
      </ul>

      <h3>Versements après 70 ans</h3>
      <p>Les primes versées après 70 ans bénéficient d'un abattement global de <strong>30 500 €</strong> (tous bénéficiaires confondus). Les plus-values restent totalement exonérées.</p>

      <h3>Stratégie optimale</h3>
      <p>Pour maximiser l'avantage, il est conseillé de :</p>
      <ol>
        <li>Alimenter son assurance-vie <strong>avant 70 ans</strong> pour profiter de l'abattement de 152 500 € par bénéficiaire</li>
        <li>Désigner <strong>plusieurs bénéficiaires</strong> pour multiplier les abattements</li>
        <li>Après 70 ans, privilégier les <strong>contrats à plus-values</strong> (intérêts exonérés)</li>
      </ol>

      <h2>La donation-partage : anticiper de son vivant</h2>
      <p>La donation-partage permet de transmettre une partie de son patrimoine de son vivant, en bénéficiant des mêmes abattements que la succession, mais <strong>renouvelables tous les 15 ans</strong>.</p>

      <h3>Exemple de stratégie</h3>
      <blockquote>
        <p>Un couple avec 2 enfants peut transmettre <strong>400 000 € en franchise de droits</strong> tous les 15 ans (100 000 € × 2 parents × 2 enfants).</p>
        <p>Sur 30 ans, cela représente <strong>800 000 €</strong> transmis sans aucun droit de succession.</p>
      </blockquote>

      <h2>Le démembrement de propriété</h2>
      <p>Le démembrement consiste à séparer l'usufruit (droit d'usage) et la nue-propriété d'un bien. En donnant la nue-propriété à ses enfants tout en conservant l'usufruit, on réduit la valeur taxable de la donation.</p>

      <p>La valeur de la nue-propriété dépend de l'âge du donateur :</p>
      <ul>
        <li>Moins de 51 ans : nue-propriété = 50% de la valeur</li>
        <li>51 à 60 ans : nue-propriété = 60%</li>
        <li>61 à 70 ans : nue-propriété = 70%</li>
        <li>71 à 80 ans : nue-propriété = 80%</li>
        <li>Plus de 80 ans : nue-propriété = 90%</li>
      </ul>

      <h2>Éviter les erreurs courantes</h2>
      <ul>
        <li><strong>Ne pas anticiper</strong> : attendre le décès pour agir limite les options</li>
        <li><strong>Oublier la clause bénéficiaire</strong> de l'assurance-vie : sans clause ou avec une clause mal rédigée, l'avantage fiscal peut être perdu</li>
        <li><strong>Négliger le démembrement</strong> : c'est souvent l'outil le plus efficace pour les patrimoines immobiliers</li>
        <li><strong>Ignorer l'équilibre entre héritiers</strong> : une transmission inégale peut créer des conflits familiaux</li>
      </ul>

      <h2>Conclusion</h2>
      <p>La transmission de patrimoine est un sujet complexe qui mérite une planification anticipée. Les outils sont nombreux (assurance-vie, donation-partage, démembrement) et peuvent être combinés pour optimiser la fiscalité tout en protégeant vos proches.</p>
      
      <p>Pour estimer précisément les droits de succession sur votre patrimoine et identifier les stratégies d'optimisation adaptées, utilisez notre calculateur dédié.</p>
    `
  },
  {
    id: "girardin-guide",
    slug: "girardin-industriel-defiscalisation-guide",
    title: "Girardin Industriel : Défiscaliser à 110% Légalement",
    excerpt: "Le Girardin Industriel permet d'obtenir une réduction d'impôt supérieure à votre investissement. Découvrez ce mécanisme puissant et ses risques.",
    date: "2025-01-05",
    category: "fiscalite",
    readTime: 10,
    author: "Thomas Durand",
    authorRole: "Expert Fiscalité",
    relatedTool: "simulateur-ir",
    metaTitle: "Girardin Industriel 2025 : Réduction d'Impôt de 110% à 120% | Guide Complet",
    metaDescription: "Découvrez le Girardin Industriel : investissez 10 000€, récupérez jusqu'à 12 000€ de réduction d'impôt. Fonctionnement, risques et conditions expliqués.",
    content: `
      <h2>Le Girardin Industriel : qu'est-ce que c'est ?</h2>
      <p>Le Girardin Industriel est un dispositif de défiscalisation créé pour favoriser le développement économique des départements et territoires d'outre-mer (DOM-TOM). Il permet aux contribuables métropolitains de financer des équipements industriels utilisés par des entreprises ultramarines, en échange d'une <strong>réduction d'impôt supérieure à leur investissement</strong>.</p>

      <p>C'est le seul dispositif fiscal français qui offre un <strong>rendement positif immédiat</strong> : vous investissez 10 000 € et vous récupérez entre 11 000 € et 12 000 € de réduction d'impôt.</p>

      <h2>Comment fonctionne le mécanisme "One-Shot" ?</h2>
      <p>Le terme "One-Shot" désigne le caractère <strong>unique et immédiat</strong> de l'avantage fiscal :</p>

      <ol>
        <li><strong>Année N</strong> : Vous investissez une somme (ex: 10 000 €) via une société de portage agréée</li>
        <li><strong>Année N+1</strong> : Vous déclarez l'investissement et obtenez une réduction d'impôt de 110% à 120% du montant investi</li>
        <li><strong>Fin</strong> : L'opération est terminée, vous n'avez rien à gérer</li>
      </ol>

      <h3>Exemple concret</h3>
      <blockquote>
        <p>Marc, TMI à 41%, doit payer 15 000 € d'impôt sur le revenu.</p>
        <p>Il investit <strong>10 000 €</strong> en Girardin Industriel avec un rendement de 15%.</p>
        <p>Réduction d'impôt obtenue : 10 000 € × 115% = <strong>11 500 €</strong></p>
        <p><strong>Gain net</strong> : 11 500 € - 10 000 € = <strong>1 500 €</strong></p>
      </blockquote>

      <h2>Le rendement : de 10% à 20%</h2>
      <p>Le "rendement" du Girardin correspond à la différence entre la réduction d'impôt obtenue et la somme investie. Il varie selon :</p>

      <ul>
        <li><strong>La qualité du monteur</strong> : les opérateurs historiques offrent des rendements plus stables</li>
        <li><strong>Le type d'opération</strong> : plein droit (plus risqué, meilleur rendement) vs agrément fiscal (moins risqué)</li>
        <li><strong>La période de l'année</strong> : les rendements sont généralement meilleurs en début d'année fiscale</li>
      </ul>

      <p>En pratique, les rendements oscillent entre <strong>10% et 20%</strong>, avec une moyenne autour de 12-15%.</p>

      <h2>Les plafonds à connaître</h2>
      
      <h3>Le plafond des niches fiscales</h3>
      <p>Le Girardin entre dans le calcul du <strong>plafonnement global des niches fiscales</strong>. Pour les investissements outre-mer, ce plafond est de <strong>18 000 €</strong> de réduction d'impôt annuelle (contre 10 000 € pour les autres niches).</p>

      <h3>Le plafond de 40 909 € (Girardin avec agrément)</h3>
      <p>Pour les opérations nécessitant un agrément fiscal préalable, l'investissement est plafonné à un montant permettant une réduction maximale de 40 909 € × 115% = environ 47 000 €.</p>

      <h3>Calcul du maximum investissable</h3>
      <p>En pratique, avec un plafond de 18 000 € de réduction et un rendement de 15% :</p>
      <blockquote>
        <p>Investissement maximum ≈ 18 000 € ÷ 1,15 = <strong>15 650 €</strong></p>
        <p>Réduction obtenue : 15 650 € × 1,15 = <strong>18 000 €</strong></p>
        <p>Gain net maximum : <strong>2 350 €</strong></p>
      </blockquote>

      <h2>Les risques du Girardin</h2>
      <p>Le Girardin n'est pas un investissement sans risque. Voici les principaux dangers :</p>

      <h3>1. Le risque de requalification fiscale</h3>
      <p>Si l'administration fiscale considère que les conditions du dispositif ne sont pas respectées (exploitation non effective, revente anticipée du matériel...), elle peut <strong>reprendre la réduction d'impôt</strong> avec pénalités et intérêts de retard.</p>

      <h3>2. La défaillance du monteur</h3>
      <p>Certains opérateurs peu scrupuleux ont disparu avec les fonds des investisseurs. Il est crucial de choisir un <strong>monteur historique et reconnu</strong>, idéalement membre de la FIP (Fédération des Investisseurs Professionnels).</p>

      <h3>3. L'absence de garantie de bonne fin</h3>
      <p>Les opérations "de plein droit" n'ont pas d'agrément préalable de l'administration, ce qui augmente le risque de requalification.</p>

      <h2>Comment sécuriser son investissement ?</h2>

      <h3>Choisir un monteur de qualité</h3>
      <ul>
        <li>Ancienneté sur le marché (minimum 10 ans)</li>
        <li>Volume d'opérations significatif</li>
        <li>Transparence sur les taux de sinistralité</li>
        <li>Garantie de bonne fin ou assurance</li>
      </ul>

      <h3>Privilégier les opérations avec agrément</h3>
      <p>Les opérations ayant reçu un <strong>agrément fiscal préalable</strong> de Bercy sont plus sécurisées car l'administration a validé le montage en amont.</p>

      <h3>Diversifier</h3>
      <p>Ne mettez pas tous vos œufs dans le même panier : diversifiez entre plusieurs monteurs et plusieurs types d'opérations.</p>

      <h2>Profil idéal pour le Girardin</h2>
      <p>Le Girardin Industriel est particulièrement adapté si :</p>

      <ul>
        <li>Votre <strong>TMI est de 30% ou plus</strong> (sinon, le risque n'est pas justifié par le gain)</li>
        <li>Votre <strong>impôt sur le revenu est supérieur à 2 500 €</strong> par an</li>
        <li>Vous avez une <strong>tolérance au risque</strong> modérée à élevée</li>
        <li>Vous cherchez une <strong>réduction immédiate</strong>, pas un investissement à long terme</li>
      </ul>

      <h2>Girardin vs autres dispositifs</h2>

      <table>
        <thead>
          <tr><th>Critère</th><th>Girardin</th><th>PER</th><th>Pinel</th></tr>
        </thead>
        <tbody>
          <tr><td>Type d'avantage</td><td>Réduction immédiate</td><td>Déduction du revenu</td><td>Réduction étalée</td></tr>
          <tr><td>Rendement</td><td>10-20%</td><td>= TMI</td><td>10.5-21%</td></tr>
          <tr><td>Durée engagement</td><td>Aucune</td><td>Jusqu'à retraite</td><td>6-12 ans</td></tr>
          <tr><td>Risque</td><td>Modéré</td><td>Faible</td><td>Modéré</td></tr>
          <tr><td>Plafond</td><td>18 000 €</td><td>~37 000 €</td><td>10 000 €</td></tr>
        </tbody>
      </table>

      <h2>Conclusion : une arme fiscale puissante mais à manier avec précaution</h2>
      <p>Le Girardin Industriel reste l'un des rares dispositifs offrant un rendement immédiat et positif. Cependant, il nécessite une <strong>sélection rigoureuse du monteur</strong> et une bonne compréhension des risques.</p>

      <p>Pour les contribuables fortement imposés cherchant à réduire leur note fiscale de manière significative et immédiate, c'est un outil incontournable, à condition de l'utiliser avec discernement.</p>

      <p>Pour calculer précisément l'impact d'un investissement Girardin sur votre impôt, utilisez notre simulateur qui intègre les plafonds des niches fiscales et votre TMI.</p>
    `
  },
  // Nouveaux articles SEO
  {
    id: "etf-guide-2025",
    slug: "guide-etf-trackers-investir-2025",
    title: "Guide ETF 2025 : Investir Passivement et Surperformer les Gérants",
    excerpt: "Les ETF (trackers) permettent d'investir dans les plus grandes entreprises mondiales avec des frais minimaux. Découvrez pourquoi la gestion passive bat 90% des gérants actifs.",
    date: "2025-01-20",
    category: "bourse",
    readTime: 14,
    author: "Pierre Lefebvre",
    authorRole: "Analyste Marchés",
    relatedTool: "simulateur-interets-composes",
    metaTitle: "Guide ETF 2025 : Comment Investir en Trackers et Battre les Gérants | Éclat Toolkit",
    metaDescription: "Découvrez comment les ETF (trackers) permettent d'investir avec des frais < 0.3%/an et surperformer 90% des gérants actifs. Guide complet MSCI World, S&P 500, PEA.",
    content: `
      <h2>Qu'est-ce qu'un ETF (Exchange Traded Fund) ?</h2>
      <p>Un ETF, aussi appelé <strong>tracker</strong>, est un fonds d'investissement coté en bourse qui réplique la performance d'un indice. Au lieu de choisir des actions une par une, vous achetez un "panier" qui contient toutes les actions de l'indice en question.</p>
      
      <p>Par exemple, un <strong>ETF MSCI World</strong> vous expose instantanément aux 1600 plus grandes entreprises de 23 pays développés : Apple, Microsoft, Amazon, LVMH, Toyota... en un seul achat.</p>

      <h2>Pourquoi les ETF révolutionnent l'investissement ?</h2>
      <p>Les études académiques le prouvent année après année : <strong>plus de 90% des gérants de fonds actifs sous-performent leur indice de référence</strong> sur 15 ans. Et ceux qui surperforment une année ne sont généralement pas les mêmes l'année suivante.</p>
      
      <p>Les raisons de cet échec :</p>
      <ul>
        <li><strong>Les frais</strong> : un fonds actif prélève 1.5% à 2.5% par an, contre 0.1% à 0.3% pour un ETF</li>
        <li><strong>Les erreurs de timing</strong> : les gérants tentent de "battre le marché" et se trompent</li>
        <li><strong>Les biais comportementaux</strong> : surconfiance, aversion aux pertes, effet de mode</li>
      </ul>

      <h3>L'effet dévastateur des frais sur 30 ans</h3>
      <p>Investissement de 10 000€ initial + 200€/mois pendant 30 ans à 7% brut :</p>
      <ul>
        <li>Avec 0.2% de frais (ETF) : <strong>284 000€</strong></li>
        <li>Avec 2% de frais (fonds actif) : <strong>217 000€</strong></li>
      </ul>
      <p>Différence : <strong>67 000€</strong> partis en frais !</p>

      <h2>Les principaux indices à connaître</h2>
      
      <h3>MSCI World - Le monde développé</h3>
      <p>L'indice phare pour les investisseurs passifs. 1600 entreprises de 23 pays développés. Répartition : ~70% États-Unis, ~6% Japon, ~4% Royaume-Uni, ~3% France...</p>
      <p><strong>ETF recommandés</strong> : iShares MSCI World (IWDA), Amundi MSCI World (CW8 - éligible PEA)</p>

      <h3>S&P 500 - Les 500 plus grandes entreprises américaines</h3>
      <p>L'indice le plus suivi au monde. Performance historique exceptionnelle (~10%/an sur 50 ans). Mais concentration sur les États-Unis uniquement.</p>
      <p><strong>ETF recommandés</strong> : Amundi S&P 500 (500 - éligible PEA), Vanguard S&P 500 (VUSA)</p>

      <h2>Stratégie DCA : la méthode infaillible</h2>
      <p>Le <strong>Dollar Cost Averaging (DCA)</strong> consiste à investir une somme fixe à intervalles réguliers (chaque mois par exemple), quelle que soit l'évolution des marchés.</p>
      
      <p>Avantages :</p>
      <ul>
        <li>Vous achetez plus de parts quand les cours sont bas</li>
        <li>Vous lissez votre prix d'achat moyen</li>
        <li>Vous éliminez le stress du "bon moment pour investir"</li>
      </ul>

      <h2>PEA ou Compte-Titres : quelle enveloppe choisir ?</h2>
      
      <h3>Le PEA (Plan d'Épargne en Actions)</h3>
      <ul>
        <li><strong>Avantage fiscal majeur</strong> : exonération d'impôt sur les plus-values après 5 ans</li>
        <li><strong>Plafond</strong> : 150 000€ de versements</li>
      </ul>

      <h3>Le Compte-Titres Ordinaire (CTO)</h3>
      <ul>
        <li><strong>Aucune contrainte géographique</strong> : accès à tous les ETF mondiaux</li>
        <li><strong>Fiscalité</strong> : Flat Tax de 30% sur les plus-values</li>
      </ul>

      <p><strong>Stratégie recommandée</strong> : Remplissez d'abord votre PEA avec des ETF éligibles, puis basculez sur le CTO.</p>

      <h2>Conclusion</h2>
      <p>La recette gagnante pour 90% des investisseurs particuliers : ouvrez un PEA, investissez chaque mois sur un ETF MSCI World, et n'y touchez pas pendant 10-15 ans.</p>
      
      <p>Pour simuler la croissance de votre portefeuille ETF, utilisez notre calculateur d'intérêts composés.</p>
    `
  },
  {
    id: "crowdfunding-immo-guide",
    slug: "crowdfunding-immobilier-rendements-guide",
    title: "Crowdfunding Immobilier : Rendements de 8-12% en 12-24 Mois",
    excerpt: "Le financement participatif immobilier offre des rendements attractifs sur des durées courtes. Découvrez comment investir intelligemment et limiter les risques.",
    date: "2025-01-18",
    category: "investissement",
    readTime: 11,
    author: "Sophie Martin",
    authorRole: "Conseillère Patrimoniale",
    relatedTool: "simulateur-immobilier",
    metaTitle: "Crowdfunding Immobilier 2025 : 10% de Rendement en 18 Mois | Guide Complet",
    metaDescription: "Investissez en crowdfunding immobilier dès 1000€. Rendements de 8% à 12% brut sur 12-24 mois. Guide complet : fonctionnement, risques, meilleures plateformes.",
    content: `
      <h2>Qu'est-ce que le crowdfunding immobilier ?</h2>
      <p>Le crowdfunding immobilier permet à des particuliers de prêter de l'argent à des promoteurs ou marchands de biens pour financer leurs opérations immobilières.</p>
      
      <p>Concrètement, vous devenez <strong>"la banque du promoteur"</strong>. En échange de votre prêt, vous recevez des intérêts fixes (8% à 12% par an) versés à l'échéance du projet.</p>

      <h2>Comment fonctionne une opération ?</h2>
      <ol>
        <li><strong>Sélection du projet</strong> : une plateforme analyse un projet immobilier</li>
        <li><strong>Collecte</strong> : les investisseurs financent le projet (tickets de 1000€ minimum)</li>
        <li><strong>Réalisation</strong> : le promoteur réalise son opération</li>
        <li><strong>Remboursement</strong> : à la vente des lots, le promoteur rembourse capital + intérêts</li>
      </ol>

      <h3>Exemple concret</h3>
      <p>Projet : Rénovation d'un immeuble à Bordeaux</p>
      <ul>
        <li>Investissement : 5 000€</li>
        <li>Taux : 10% annuel</li>
        <li>Durée : 18 mois</li>
        <li>Intérêts perçus : 750€</li>
        <li>Capital récupéré : 5 750€</li>
      </ul>

      <h2>Les avantages</h2>
      <ul>
        <li><strong>Rendements élevés</strong> : 8% à 12% brut</li>
        <li><strong>Horizon court</strong> : 12 à 24 mois</li>
        <li><strong>Ticket accessible</strong> : dès 1000€</li>
        <li><strong>Pas de gestion</strong> : vous prêtez et attendez</li>
      </ul>

      <h2>Les risques à connaître</h2>
      
      <h3>1. Risque de défaut</h3>
      <p>Si le promoteur fait faillite, vous pouvez perdre votre investissement. Le taux de défaut moyen est de 2-4%.</p>

      <h3>2. Risque de retard</h3>
      <p>Les projets prennent souvent du retard. Un projet de 18 mois peut durer 24-30 mois.</p>

      <h2>Comment bien investir ?</h2>
      <ul>
        <li><strong>Diversifiez massivement</strong> : répartissez sur 20-30 projets minimum</li>
        <li><strong>Choisissez les bonnes plateformes</strong> : Anaxago, Homunity, ClubFunding</li>
        <li><strong>Analysez les garanties</strong> : hypothèque, caution personnelle</li>
      </ul>

      <h2>Fiscalité</h2>
      <p>Les intérêts sont soumis au <strong>PFU de 30%</strong> (12.8% IR + 17.2% PS).</p>

      <h2>Conclusion</h2>
      <p>Le crowdfunding immobilier est excellent pour dynamiser une partie de son épargne sur du court terme. Limitez-le à 10-15% de votre patrimoine financier.</p>
      
      <p>Pour calculer votre capacité d'investissement immobilier, utilisez notre simulateur dédié.</p>
    `
  },
  {
    id: "fip-fcpi-guide",
    slug: "fip-fcpi-reduction-impots-pme-innovation",
    title: "FIP FCPI : Réduire ses Impôts de 25% en Investissant dans les PME",
    excerpt: "Les FIP et FCPI offrent une réduction d'impôt immédiate de 25% du montant investi. Découvrez comment optimiser ce dispositif.",
    date: "2025-01-16",
    category: "fiscalite",
    readTime: 12,
    author: "Thomas Durand",
    authorRole: "Expert Fiscalité",
    relatedTool: "simulateur-ir",
    metaTitle: "FIP FCPI 2025 : Réduction d'Impôt de 25% | Guide Complet PME Innovation",
    metaDescription: "Investissez dans les PME et l'innovation avec les FIP/FCPI. Réduction d'impôt de 25% + exonération des plus-values. Plafonds, risques et stratégie.",
    content: `
      <h2>Qu'est-ce qu'un FIP et un FCPI ?</h2>
      <p>Les <strong>FIP (Fonds d'Investissement de Proximité)</strong> et <strong>FCPI (Fonds Communs de Placement dans l'Innovation)</strong> sont des fonds de capital-investissement qui financent des PME françaises.</p>
      
      <ul>
        <li><strong>FIP</strong> : investit dans des PME régionales</li>
        <li><strong>FCPI</strong> : investit dans des entreprises innovantes</li>
      </ul>

      <h2>L'avantage fiscal : 25% de réduction d'impôt</h2>
      <p>La réduction d'impôt est de <strong>25% du montant investi</strong>.</p>

      <h3>Plafonds d'investissement</h3>
      <ul>
        <li><strong>Célibataire</strong> : 12 000€ max → réduction max de 3 000€</li>
        <li><strong>Couple</strong> : 24 000€ max → réduction max de 6 000€</li>
      </ul>

      <p>Les plafonds FIP et FCPI sont <strong>cumulables</strong>.</p>

      <h3>Cas particuliers : Corse et Outre-mer</h3>
      <p>Les FIP Corse et Outre-mer bénéficient d'un taux majoré de <strong>30%</strong>.</p>

      <h2>L'exonération des plus-values</h2>
      <p>Les plus-values à la sortie sont <strong>exonérées d'impôt sur le revenu</strong>. Seuls les prélèvements sociaux (17.2%) restent dus.</p>

      <h2>Les risques des FIP/FCPI</h2>
      <ul>
        <li><strong>Risque de perte en capital</strong> : beaucoup de fonds rendent moins que le capital investi</li>
        <li><strong>Illiquidité totale</strong> : argent bloqué 5 à 10 ans</li>
        <li><strong>Performance historique médiocre</strong> : souvent 0% à -20% après frais</li>
      </ul>

      <h2>Stratégie optimale</h2>
      <ol>
        <li><strong>Investissez uniquement si TMI ≥ 30%</strong></li>
        <li><strong>Considérez l'avantage fiscal comme le gain principal</strong></li>
        <li><strong>Limitez à 5-10% du patrimoine</strong></li>
      </ol>

      <h2>Conclusion</h2>
      <p>Les FIP/FCPI sont des outils de défiscalisation à manier avec précaution. Réservez-les aux TMI élevés (41-45%).</p>
      
      <p>Pour calculer l'impact sur votre impôt, utilisez notre simulateur d'impôt sur le revenu.</p>
    `
  },
  {
    id: "gfi-foret-guide",
    slug: "investir-foret-gfi-groupement-forestier",
    title: "Investir dans la Forêt : Le Guide Complet des GFI en 2025",
    excerpt: "Les Groupements Forestiers offrent une fiscalité successorale imbattable avec 75% d'abattement. Découvrez comment transmettre votre patrimoine via la forêt.",
    date: "2025-01-14",
    category: "alternatif",
    readTime: 13,
    author: "Sophie Martin",
    authorRole: "Conseillère Patrimoniale",
    relatedTool: "droits-succession",
    metaTitle: "GFI Groupement Forestier 2025 : 75% d'Abattement Succession | Guide Complet",
    metaDescription: "Investissez dans la forêt avec les GFI. Abattement de 75% sur les droits de succession + réduction d'impôt IR de 25%. Guide complet.",
    content: `
      <h2>Qu'est-ce qu'un GFI ?</h2>
      <p>Un <strong>GFI (Groupement Forestier d'Investissement)</strong> est une société civile qui détient et gère des forêts. En achetant des parts, vous devenez indirectement propriétaire de parcelles forestières.</p>

      <h2>L'avantage fiscal n°1 : la transmission successorale</h2>
      
      <h3>Abattement de 75% sur les droits de succession</h3>
      <p>Les parts de GFI bénéficient d'un abattement de <strong>75% sur leur valeur</strong> pour le calcul des droits de succession.</p>

      <p>Exemple : Transmission de parts de GFI de 200 000€</p>
      <ul>
        <li>Base taxable : 200 000€ × 25% = <strong>50 000€</strong></li>
        <li>Au lieu de 200 000€ en actifs classiques</li>
      </ul>

      <h2>L'avantage fiscal n°2 : la réduction d'impôt IR</h2>
      <p>L'acquisition de parts ouvre droit à une réduction de <strong>18% à 25%</strong> du montant investi.</p>

      <h3>Plafonds</h3>
      <ul>
        <li>Célibataire : 50 000€ max → réduction max 12 500€</li>
        <li>Couple : 100 000€ max → réduction max 25 000€</li>
      </ul>

      <h2>L'avantage fiscal n°3 : l'IFI</h2>
      <p>Les parts de GFI sont <strong>exonérées d'IFI à 75%</strong>.</p>

      <h2>Le rendement</h2>
      <p>Rendement total estimé : <strong>1.5% à 3% par an</strong>. L'intérêt est principalement fiscal.</p>

      <h2>Profil d'investisseur idéal</h2>
      <ul>
        <li>Préparation de la succession</li>
        <li>Réduction d'IFI</li>
        <li>Diversification écologique</li>
      </ul>

      <h2>Les risques</h2>
      <ul>
        <li><strong>Liquidité limitée</strong> : revente peut prendre plusieurs mois</li>
        <li><strong>Risques climatiques</strong> : tempêtes, incendies</li>
        <li><strong>Rendement faible</strong> hors avantages fiscaux</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Les GFI sont un outil de transmission patrimoniale exceptionnel grâce à l'abattement de 75%. Intégrez-les dans une stratégie successorale globale.</p>
      
      <p>Pour calculer l'impact sur vos droits de succession, utilisez notre simulateur dédié.</p>
    `
  },
  {
    id: "crypto-guide-2025",
    slug: "cryptomonnaies-bitcoin-guide-debutant-2025",
    title: "Cryptomonnaies : Le Guide du Débutant Français en 2025",
    excerpt: "Bitcoin, Ethereum, blockchain... Comprendre et investir dans les cryptomonnaies en France. Fiscalité, sécurité et stratégie pour débutants.",
    date: "2025-01-12",
    category: "alternatif",
    readTime: 15,
    author: "Pierre Lefebvre",
    authorRole: "Analyste Marchés",
    relatedTool: "simulateur-interets-composes",
    metaTitle: "Guide Crypto 2025 : Investir en Bitcoin et Ethereum en France | Fiscalité & Stratégie",
    metaDescription: "Découvrez comment investir en cryptomonnaies en France. Bitcoin, Ethereum : fonctionnement, fiscalité (30% PFU), sécurité et stratégie. Guide complet débutant.",
    content: `
      <h2>Qu'est-ce qu'une cryptomonnaie ?</h2>
      <p>Une <strong>cryptomonnaie</strong> est une monnaie numérique décentralisée qui fonctionne sur une <strong>blockchain</strong>. Contrairement aux monnaies traditionnelles, aucune banque centrale ne la contrôle.</p>

      <h3>Les principales cryptomonnaies</h3>
      <ul>
        <li><strong>Bitcoin (BTC)</strong> : la première, souvent appelée "l'or numérique". Offre limitée à 21 millions.</li>
        <li><strong>Ethereum (ETH)</strong> : plateforme pour smart contracts et applications décentralisées.</li>
      </ul>

      <h2>Pourquoi investir en crypto ?</h2>
      
      <h3>Les arguments "pour"</h3>
      <ul>
        <li>Performance historique exceptionnelle</li>
        <li>Décentralisation</li>
        <li>Adoption croissante par les institutionnels</li>
        <li>Liquidité 24/7</li>
      </ul>

      <h3>Les arguments "contre"</h3>
      <ul>
        <li>Volatilité extrême (chutes de 50-80% possibles)</li>
        <li>Risque réglementaire</li>
        <li>Risque de perte totale (piratage, perte de clés)</li>
      </ul>

      <h2>Comment acheter des cryptomonnaies en France ?</h2>
      
      <h3>Plateformes recommandées (PSAN)</h3>
      <ul>
        <li><strong>Coinhouse</strong> : française, service client FR</li>
        <li><strong>Bitpanda</strong> : européenne, interface simple</li>
        <li><strong>Kraken</strong> : réputée pour sa sécurité</li>
      </ul>

      <h2>Sécuriser ses cryptomonnaies</h2>
      <p><strong>Règle d'or</strong> : "Not your keys, not your coins"</p>

      <p>Solutions recommandées :</p>
      <ul>
        <li><strong>Ledger</strong> (français) : Nano S Plus (~79€)</li>
        <li><strong>Trezor</strong> : Model One (~69€)</li>
      </ul>

      <h2>La fiscalité en France</h2>
      <p>Les plus-values sont imposées au <strong>PFU de 30%</strong> lors de la conversion en euros.</p>

      <p>Les échanges crypto-crypto ne sont <strong>pas imposables</strong>.</p>

      <h2>Stratégie d'investissement</h2>
      <ul>
        <li><strong>N'investissez que 1% à 5%</strong> de votre patrimoine</li>
        <li><strong>DCA</strong> : investissez régulièrement</li>
        <li><strong>HODL</strong> : conservez sur le long terme</li>
        <li><strong>Diversifiez</strong> : 60-70% Bitcoin, 20-30% Ethereum</li>
      </ul>

      <h2>L'asymétrie du risque</h2>
      <p>Si vous investissez 2% de votre patrimoine :</p>
      <ul>
        <li>Scénario catastrophe (-100%) : vous perdez 2%</li>
        <li>Scénario favorable (×5) : vous gagnez 8%</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Les cryptomonnaies sont une classe d'actifs à haut risque / haut potentiel. Une allocation de 1% à 5% permet de profiter du potentiel tout en limitant l'impact d'une chute.</p>
      
      <p>Pour simuler la croissance potentielle, utilisez notre calculateur d'intérêts composés.</p>
    `
  }
];

export const getCategoryLabel = (category: BlogPost["category"]): string => {
  const labels: Record<BlogPost["category"], string> = {
    fiscalite: "Fiscalité",
    succession: "Succession",
    investissement: "Investissement",
    retraite: "Retraite",
    bourse: "Bourse",
    alternatif: "Alternatif"
  };
  return labels[category];
};

export const getCategoryColor = (category: BlogPost["category"]): string => {
  const colors: Record<BlogPost["category"], string> = {
    fiscalite: "bg-emerald-100 text-emerald-700",
    succession: "bg-purple-100 text-purple-700",
    investissement: "bg-blue-100 text-blue-700",
    retraite: "bg-amber-100 text-amber-700",
    bourse: "bg-indigo-100 text-indigo-700",
    alternatif: "bg-teal-100 text-teal-700"
  };
  return colors[category];
};

export const getPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find(post => post.slug === slug);
};
