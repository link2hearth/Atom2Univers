/**
 * Configuration centrale du jeu Atom → Univers.
 * Toutes les valeurs ajustables (équilibrage, affichage, grands nombres, etc.)
 * sont rassemblées ici pour faciliter les modifications futures.
 */
const GAME_CONFIG = {
  /**
   * Paramètres du système de grands nombres et des layers.
   * - layer1Threshold : passage automatique au layer 1 lorsque l'exposant dépasse ce seuil.
   * - layer1Downshift : retour au layer 0 quand la valeur redescend sous ce niveau.
   * - logDifferenceLimit : limite de différence logarithmique utilisée pour comparer deux valeurs.
   * - epsilon : tolérance minimale avant de considérer une valeur comme nulle.
   */
  numbers: {
    layer1Threshold: 1e6,
    layer1Downshift: 5,
    logDifferenceLimit: 15,
    epsilon: 1e-12
  },

  /**
   * Valeurs de base de la progression.
   * - basePerClick : quantité d'atomes gagnés par clic avant bonus (Layer 0 par défaut).
   * - basePerSecond : production passive initiale (0 si aucune production automatique).
   * - offlineCapSeconds : durée maximale (en secondes) prise en compte pour les gains hors-ligne.
   * - defaultTheme : thème visuel utilisé lors d'une nouvelle partie ou après réinitialisation.
   */
  progression: {
    basePerClick: { type: 'number', value: 1 },
    basePerSecond: { type: 'number', value: 0 },
    offlineCapSeconds: 60 * 60 * 12,
    defaultTheme: 'dark'
  },

  /**
   * Paramètres liés aux interactions et retours visuels.
   * - windowMs : fenêtre temporelle (ms) utilisée pour lisser l'intensité du bouton.
   * - maxClicksPerSecond : nombre de clics par seconde considéré comme 100% de puissance.
   * - starCount : nombre d'étoiles utilisées dans l'arrière-plan animé.
   */
  presentation: {
    clicks: {
      windowMs: 1000,
      maxClicksPerSecond: 20
    },
    starfield: {
      starCount: 60
    }
  },

  /**
   * Définitions complètes des améliorations de la boutique.
   * Chaque entrée décrit :
   * - baseCost : coût initial de l'amélioration.
   * - costScale : multiplicateur appliqué à chaque niveau.
   * - effect : fonction retournant les bonus conférés pour un niveau donné.
   */
  upgrades: [
    {
      id: 'clickCore',
      name: 'Stabilisateur de noyau',
      description: '+1 atome par clic.',
      category: 'click',
      baseCost: 10,
      costScale: 1.65,
      effect: level => ({ clickAdd: level })
    },
    {
      id: 'quantumGloves',
      name: 'Gants quantiques',
      description: 'Augmente les atomes par clic de 75% par niveau.',
      category: 'click',
      baseCost: 120,
      costScale: 1.9,
      effect: level => ({ clickMult: Math.pow(1.75, level) })
    },
    {
      id: 'autoSynth',
      name: 'Synthèse automatique',
      description: 'Produit 0,5 atome par seconde et par niveau.',
      category: 'auto',
      baseCost: 100,
      costScale: 1.8,
      effect: level => ({ autoAdd: 0.5 * level })
    },
    {
      id: 'reactorArray',
      name: 'Réseau de réacteurs',
      description: 'Multiplicateur d’APS de +35% par niveau.',
      category: 'auto',
      baseCost: 600,
      costScale: 2.1,
      effect: level => ({ autoMult: Math.pow(1.35, level) })
    },
    {
      id: 'overclock',
      name: 'Surcadence du collecteur',
      description: 'Augmente APC et APS de 25% par niveau.',
      category: 'hybrid',
      baseCost: 1500,
      costScale: 2.35,
      effect: level => ({
        clickMult: Math.pow(1.25, level),
        autoMult: Math.pow(1.25, level)
      })
    }
  ],

  /**
   * Liste des jalons de progression.
   * Le champ "amount" accepte des nombres classiques ou une description de layer
   * (ex. { type: 'layer1', value: 8 } représente 10^8).
   */
  milestones: [
    {
      amount: { type: 'number', value: 100 },
      text: 'Collectez 100 atomes pour débloquer la synthèse automatique.'
    },
    {
      amount: { type: 'number', value: 1_000 },
      text: 'Atteignez 1 000 atomes pour améliorer vos gants quantiques.'
    },
    {
      amount: { type: 'number', value: 1_000_000 },
      text: 'Atteignez 1 million d’atomes pour accéder aux surcadences.'
    },
    {
      amount: { type: 'layer1', value: 8 },
      text: 'Accumulez 10^8 atomes pour préparer la prochaine ère.'
    }
  ]
};
