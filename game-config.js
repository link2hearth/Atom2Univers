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
   * Paramètres du système de frénésie.
   * - displayDurationMs : durée d'affichage des icônes (en millisecondes).
   * - effectDurationMs : durée du bonus une fois collecté.
   * - multiplier : multiplicateur appliqué à la production visée.
   * - spawnChancePerSecond : probabilités d'apparition par seconde (APC / APS).
   */
  frenzies: {
    displayDurationMs: 5000,
    effectDurationMs: 30000,
    multiplier: 2,
    spawnChancePerSecond: {
      perClick: 0.01,
      perSecond: 0.01
    }
  },

  /**
   * Ordre d'affichage des étapes de calcul des productions dans l'onglet Infos.
   * Chaque entrée correspond à un identifiant d'étape connu du jeu. La liste
   * peut être réorganisée ou complétée pour s'adapter à de futurs bonus.
   */
  infoPanels: {
    productionOrder: [
      'baseFlat',
      'shopFlat',
      'elementFlat',
      'shopBonus1',
      'shopBonus2',
      'frenzy',
      'rarityMultiplier:commun',
      'rarityMultiplier:essentiel',
      'rarityMultiplier:stellaire',
      'rarityMultiplier:singulier',
      'rarityMultiplier:mythique',
      'rarityMultiplier:irreel',
      'trophyMultiplier',
      'total'
    ]
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
  ],

  gacha: {
    cost: 100,
    rarities: [
      {
        id: 'commun',
        label: 'Commun cosmique',
        description: 'Les éléments omniprésents dans les nébuleuses et les atmosphères stellaires.',
        weight: 55,
        color: '#6bb8ff'
      },
      {
        id: 'essentiel',
        label: 'Essentiel planétaire',
        description: 'Les piliers des mondes rocheux et des océans extraterrestres.',
        weight: 20,
        color: '#74f5c6'
      },
      {
        id: 'stellaire',
        label: 'Forge stellaire',
        description: 'Alliages façonnés dans les coeurs d’étoiles actives.',
        weight: 12,
        color: '#c1f06a'
      },
      {
        id: 'singulier',
        label: 'Singularité minérale',
        description: 'Raretés cristallines difficiles à isoler.',
        weight: 7,
        color: '#ffb45a'
      },
      {
        id: 'mythique',
        label: 'Mythe quantique',
        description: 'Éléments aux propriétés quasi légendaires.',
        weight: 4,
        color: '#ff6cb1'
      },
      {
        id: 'irreel',
        label: 'Irréel',
        description: 'Créations synthétiques jamais rencontrées naturellement.',
        weight: 2,
        color: '#a579ff'
      }
    ]
  },

  elements: [
    {
      numero: 1,
      name: 'Hydrogène',
      famille: 'nonmetal',
      rarete: 'commun',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 2,
      name: 'Hélium',
      famille: 'noble-gas',
      rarete: 'commun',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 3,
      name: 'Lithium',
      famille: 'alkali-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 4,
      name: 'Béryllium',
      famille: 'alkaline-earth-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 5,
      name: 'Bore',
      famille: 'metalloid',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 6,
      name: 'Carbone',
      famille: 'nonmetal',
      rarete: 'commun',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 7,
      name: 'Azote',
      famille: 'nonmetal',
      rarete: 'commun',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 8,
      name: 'Oxygène',
      famille: 'nonmetal',
      rarete: 'commun',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 9,
      name: 'Fluor',
      famille: 'halogen',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 10,
      name: 'Néon',
      famille: 'noble-gas',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 11,
      name: 'Sodium',
      famille: 'alkali-metal',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 12,
      name: 'Magnésium',
      famille: 'alkaline-earth-metal',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 13,
      name: 'Aluminium',
      famille: 'post-transition-metal',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 14,
      name: 'Silicium',
      famille: 'metalloid',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 15,
      name: 'Phosphore',
      famille: 'nonmetal',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 16,
      name: 'Soufre',
      famille: 'nonmetal',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 17,
      name: 'Chlore',
      famille: 'halogen',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 18,
      name: 'Argon',
      famille: 'noble-gas',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 19,
      name: 'Potassium',
      famille: 'alkali-metal',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 20,
      name: 'Calcium',
      famille: 'alkaline-earth-metal',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 21,
      name: 'Scandium',
      famille: 'transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 22,
      name: 'Titane',
      famille: 'transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 23,
      name: 'Vanadium',
      famille: 'transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 24,
      name: 'Chrome',
      famille: 'transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 25,
      name: 'Manganèse',
      famille: 'transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 26,
      name: 'Fer',
      famille: 'transition-metal',
      rarete: 'essentiel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 27,
      name: 'Cobalt',
      famille: 'transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 28,
      name: 'Nickel',
      famille: 'transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 29,
      name: 'Cuivre',
      famille: 'transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 30,
      name: 'Zinc',
      famille: 'transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 31,
      name: 'Gallium',
      famille: 'post-transition-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 32,
      name: 'Germanium',
      famille: 'metalloid',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 33,
      name: 'Arsenic',
      famille: 'metalloid',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 34,
      name: 'Sélénium',
      famille: 'nonmetal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 35,
      name: 'Brome',
      famille: 'halogen',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 36,
      name: 'Krypton',
      famille: 'noble-gas',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 37,
      name: 'Rubidium',
      famille: 'alkali-metal',
      rarete: 'stellaire',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 38,
      name: 'Strontium',
      famille: 'alkaline-earth-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 39,
      name: 'Yttrium',
      famille: 'transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 40,
      name: 'Zirconium',
      famille: 'transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 41,
      name: 'Niobium',
      famille: 'transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 42,
      name: 'Molybdène',
      famille: 'transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 43,
      name: 'Technétium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 44,
      name: 'Ruthénium',
      famille: 'transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 45,
      name: 'Rhodium',
      famille: 'transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 46,
      name: 'Palladium',
      famille: 'transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 47,
      name: 'Argent',
      famille: 'transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 48,
      name: 'Cadmium',
      famille: 'transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 49,
      name: 'Indium',
      famille: 'post-transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 50,
      name: 'Étain',
      famille: 'post-transition-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 51,
      name: 'Antimoine',
      famille: 'metalloid',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 52,
      name: 'Tellure',
      famille: 'metalloid',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 53,
      name: 'Iode',
      famille: 'halogen',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 54,
      name: 'Xénon',
      famille: 'noble-gas',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 55,
      name: 'Césium',
      famille: 'alkali-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 56,
      name: 'Baryum',
      famille: 'alkaline-earth-metal',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 57,
      name: 'Lanthane',
      famille: 'lanthanide',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 58,
      name: 'Cérium',
      famille: 'lanthanide',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 59,
      name: 'Praséodyme',
      famille: 'lanthanide',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 60,
      name: 'Néodyme',
      famille: 'lanthanide',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 61,
      name: 'Prométhium',
      famille: 'lanthanide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 62,
      name: 'Samarium',
      famille: 'lanthanide',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 63,
      name: 'Europium',
      famille: 'lanthanide',
      rarete: 'singulier',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 64,
      name: 'Gadolinium',
      famille: 'lanthanide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 65,
      name: 'Terbium',
      famille: 'lanthanide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 66,
      name: 'Dysprosium',
      famille: 'lanthanide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 67,
      name: 'Holmium',
      famille: 'lanthanide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 68,
      name: 'Erbium',
      famille: 'lanthanide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 69,
      name: 'Thulium',
      famille: 'lanthanide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 70,
      name: 'Ytterbium',
      famille: 'lanthanide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 71,
      name: 'Lutécium',
      famille: 'lanthanide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 72,
      name: 'Hafnium',
      famille: 'transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 73,
      name: 'Tantale',
      famille: 'transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 74,
      name: 'Tungstène',
      famille: 'transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 75,
      name: 'Rhénium',
      famille: 'transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 76,
      name: 'Osmium',
      famille: 'transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 77,
      name: 'Iridium',
      famille: 'transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 78,
      name: 'Platine',
      famille: 'transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 79,
      name: 'Or',
      famille: 'transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 80,
      name: 'Mercure',
      famille: 'transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 81,
      name: 'Thallium',
      famille: 'post-transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 82,
      name: 'Plomb',
      famille: 'post-transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 83,
      name: 'Bismuth',
      famille: 'post-transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 84,
      name: 'Polonium',
      famille: 'post-transition-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 85,
      name: 'Astate',
      famille: 'halogen',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 86,
      name: 'Radon',
      famille: 'noble-gas',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 87,
      name: 'Francium',
      famille: 'alkali-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 88,
      name: 'Radium',
      famille: 'alkaline-earth-metal',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 89,
      name: 'Actinium',
      famille: 'actinide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 90,
      name: 'Thorium',
      famille: 'actinide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 91,
      name: 'Protactinium',
      famille: 'actinide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 92,
      name: 'Uranium',
      famille: 'actinide',
      rarete: 'mythique',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 93,
      name: 'Neptunium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 94,
      name: 'Plutonium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 95,
      name: 'Américium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 96,
      name: 'Curium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 97,
      name: 'Berkélium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 98,
      name: 'Californium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 99,
      name: 'Einsteinium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 100,
      name: 'Fermium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 101,
      name: 'Mendélévium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 102,
      name: 'Nobélium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 103,
      name: 'Lawrencium',
      famille: 'actinide',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 104,
      name: 'Rutherfordium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 105,
      name: 'Dubnium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 106,
      name: 'Seaborgium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 107,
      name: 'Bohrium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 108,
      name: 'Hassium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 109,
      name: 'Meitnérium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 110,
      name: 'Darmstadtium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 111,
      name: 'Roentgenium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 112,
      name: 'Copernicium',
      famille: 'transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 113,
      name: 'Nihonium',
      famille: 'post-transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 114,
      name: 'Flérovium',
      famille: 'post-transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 115,
      name: 'Moscovium',
      famille: 'post-transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 116,
      name: 'Livermorium',
      famille: 'post-transition-metal',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 117,
      name: 'Tennesse',
      famille: 'halogen',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    },
    {
      numero: 118,
      name: 'Oganesson',
      famille: 'noble-gas',
      rarete: 'irreel',
      bonus: 'ajoute +1 au APS flat'
    }
  ]
};

if (typeof globalThis !== 'undefined') {
  globalThis.GAME_CONFIG = GAME_CONFIG;
}
