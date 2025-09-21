/**
 * Configuration centrale du jeu Atom → Univers.
 * Toutes les valeurs ajustables (équilibrage, affichage, grands nombres, etc.)
 * sont rassemblées ici pour faciliter les modifications futures.
 */
const BUILDING_DOUBLE_THRESHOLDS = [10, 25, 50, 100, 150, 200];
const BUILDING_QUAD_THRESHOLDS = [300, 400, 500];

function computeBuildingTierMultiplier(level = 0) {
  let multiplier = 1;
  BUILDING_DOUBLE_THRESHOLDS.forEach(threshold => {
    if (level >= threshold) {
      multiplier *= 2;
    }
  });
  BUILDING_QUAD_THRESHOLDS.forEach(threshold => {
    if (level >= threshold) {
      multiplier *= 4;
    }
  });
  return multiplier;
}

function getBuildingLevel(context, id) {
  if (!context || typeof context !== 'object') {
    return 0;
  }
  const value = Number(context[id] ?? 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function getTotalBuildings(context) {
  if (!context || typeof context !== 'object') {
    return 0;
  }
  return Object.values(context).reduce((acc, value) => {
    const numeric = Number(value);
    return acc + (Number.isFinite(numeric) && numeric > 0 ? numeric : 0);
  }, 0);
}

function createShopBuildingDefinitions() {
  return [
    {
      id: 'freeElectrons',
      name: 'Électrons libres',
      description: 'Libérez des électrons pour une production de base stable.',
      effectSummary:
        'Production passive : minimum +1 APS par niveau (paliers ×2/×4). À 100 exemplaires : chaque électron ajoute +1 APC (valeur arrondie).',
      category: 'auto',
      baseCost: 15,
      costScale: 1.15,
      effect: (level = 0) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const baseAutoAdd = 0.1 * level * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(1, Math.round(baseAutoAdd)) : 0;
        const rawClickAdd = level >= 100 ? 0.01 * level : 0;
        const clickAdd = rawClickAdd > 0 ? Math.max(1, Math.round(rawClickAdd)) : 0;
        const result = { autoAdd };
        if (clickAdd > 0) {
          result.clickAdd = clickAdd;
        }
        return result;
      }
    },
    {
      id: 'physicsLab',
      name: 'Laboratoire de Physique',
      description: 'Des équipes de chercheurs boostent votre production atomique.',
      effectSummary:
        'Production passive : +1 APS par niveau (paliers ×2/×4). Chaque 10 labos accordent +5 % d’APC global. Palier 200 : Réacteurs +20 %.',
      category: 'auto',
      baseCost: 100,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const acceleratorLevel = getBuildingLevel(context, 'particleAccelerator');
        let productionMultiplier = tierMultiplier;
        if (acceleratorLevel >= 200) {
          productionMultiplier *= 1.2;
        }
        const autoAdd = level * 1 * productionMultiplier;
        const clickBonus = Math.pow(1.05, Math.floor(level / 10));
        return {
          autoAdd,
          clickMult: clickBonus
        };
      }
    },
    {
      id: 'nuclearReactor',
      name: 'Réacteur nucléaire',
      description: 'Des réacteurs contrôlés libèrent une énergie colossale.',
      effectSummary:
        'Production passive : +10 APS par niveau (bonifiée par Électrons et Labos). Palier 150 : APC global ×2. Synergie : +1 % APS des Réacteurs par 50 Électrons.',
      category: 'auto',
      baseCost: 1000,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const electronLevel = getBuildingLevel(context, 'freeElectrons');
        const labLevel = getBuildingLevel(context, 'physicsLab');
        let productionMultiplier = tierMultiplier;
        if (electronLevel > 0) {
          productionMultiplier *= 1 + 0.01 * Math.floor(electronLevel / 50);
        }
        if (labLevel >= 200) {
          productionMultiplier *= 1.2;
        }
        const autoAdd = 10 * level * productionMultiplier;
        const clickMult = level >= 150 ? 2 : 1;
        return clickMult > 1
          ? { autoAdd, clickMult }
          : { autoAdd };
      }
    },
    {
      id: 'particleAccelerator',
      name: 'Accélérateur de particules',
      description: 'Boostez vos particules pour décupler l’APC.',
      effectSummary:
        'Production passive : +50 APS par niveau (bonus si ≥100 Supercalculateurs). Chaque niveau octroie +2 % d’APC. Palier 200 : +20 % production des Labos.',
      category: 'hybrid',
      baseCost: 12_000,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const supercomputerLevel = getBuildingLevel(context, 'supercomputer');
        let productionMultiplier = tierMultiplier;
        if (supercomputerLevel >= 100) {
          productionMultiplier *= 1.5;
        }
        const autoAdd = 50 * level * productionMultiplier;
        const clickMult = Math.pow(1.02, level);
        return { autoAdd, clickMult };
      }
    },
    {
      id: 'supercomputer',
      name: 'Supercalculateurs',
      description: 'Des centres de calcul quantique optimisent vos gains.',
      effectSummary:
        'Production passive : +500 APS par niveau (doublée par Stations ≥300). Chaque 25 unités offrent +1 % APS global.',
      category: 'auto',
      baseCost: 200_000,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const stationLevel = getBuildingLevel(context, 'spaceStation');
        let productionMultiplier = tierMultiplier;
        if (stationLevel >= 300) {
          productionMultiplier *= 2;
        }
        const autoAdd = 500 * level * productionMultiplier;
        const autoMult = Math.pow(1.01, Math.floor(level / 25));
        return autoMult > 1
          ? { autoAdd, autoMult }
          : { autoAdd };
      }
    },
    {
      id: 'interstellarProbe',
      name: 'Sonde interstellaire',
      description: 'Explorez la galaxie pour récolter toujours plus.',
      effectSummary:
        'Production passive : +5 000 APS par niveau (boostée par Réacteurs). À 150 exemplaires : chaque sonde ajoute +1 APC.',
      category: 'hybrid',
      baseCost: 5e6,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const reactorLevel = getBuildingLevel(context, 'nuclearReactor');
        let productionMultiplier = tierMultiplier;
        if (reactorLevel > 0) {
          productionMultiplier *= 1 + 0.001 * reactorLevel;
        }
        const autoAdd = 5000 * level * productionMultiplier;
        const clickAdd = level >= 150 ? level : 0;
        const result = { autoAdd };
        if (clickAdd > 0) {
          result.clickAdd = clickAdd;
        }
        return result;
      }
    },
    {
      id: 'spaceStation',
      name: 'Station spatiale',
      description: 'Des bases orbitales coordonnent votre expansion.',
      effectSummary:
        'Production passive : +50 000 APS par niveau (paliers ×2/×4). Chaque Station accorde +5 % d’APC. Palier 300 : Supercalculateurs +100 %.',
      category: 'hybrid',
      baseCost: 1e8,
      costScale: 1.15,
      effect: (level = 0) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const autoAdd = 50_000 * level * tierMultiplier;
        const clickMult = Math.pow(1.05, level);
        return { autoAdd, clickMult };
      }
    },
    {
      id: 'starForge',
      name: 'Forgeron d’étoiles',
      description: 'Façonnez des étoiles et dopez votre APC.',
      effectSummary:
        'Production passive : +500 000 APS par niveau (boostée par Stations). Palier 150 : +25 % APC global.',
      category: 'hybrid',
      baseCost: 5e10,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const stationLevel = getBuildingLevel(context, 'spaceStation');
        let productionMultiplier = tierMultiplier;
        if (stationLevel > 0) {
          productionMultiplier *= 1 + 0.02 * stationLevel;
        }
        const autoAdd = 500_000 * level * productionMultiplier;
        const clickMult = level >= 150 ? 1.25 : 1;
        return clickMult > 1
          ? { autoAdd, clickMult }
          : { autoAdd };
      }
    },
    {
      id: 'artificialGalaxy',
      name: 'Galaxie artificielle',
      description: 'Ingénierie galactique pour une expansion sans fin.',
      effectSummary:
        'Production passive : +5 000 000 APS par niveau (doublée par Bibliothèque ≥300). Chaque niveau augmente l’APS de 10 %. Palier 100 : +50 % APC global.',
      category: 'auto',
      baseCost: 1e13,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const libraryLevel = getBuildingLevel(context, 'omniverseLibrary');
        let productionMultiplier = tierMultiplier;
        if (libraryLevel >= 300) {
          productionMultiplier *= 2;
        }
        const autoAdd = 5e6 * level * productionMultiplier;
        const autoMult = Math.pow(1.1, level);
        const clickMult = level >= 100 ? 1.5 : 1;
        const result = { autoAdd };
        if (autoMult > 1) {
          result.autoMult = autoMult;
        }
        if (clickMult > 1) {
          result.clickMult = clickMult;
        }
        return result;
      }
    },
    {
      id: 'multiverseSimulator',
      name: 'Simulateur de Multivers',
      description: 'Simulez l’infini pour optimiser chaque seconde.',
      effectSummary:
        'Production passive : +500 000 000 APS par niveau (paliers ×2/×4). Synergie : +0,5 % APS global par bâtiment possédé. Palier 200 : coûts des bâtiments −5 %.',
      category: 'auto',
      baseCost: 1e16,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const autoAdd = 5e8 * level * tierMultiplier;
        const totalBuildings = getTotalBuildings(context);
        const autoMult = totalBuildings > 0 ? Math.pow(1.005, totalBuildings) : 1;
        return autoMult > 1
          ? { autoAdd, autoMult }
          : { autoAdd };
      }
    },
    {
      id: 'realityWeaver',
      name: 'Tisseur de Réalité',
      description: 'Tissez les lois physiques à votre avantage.',
      effectSummary:
        'Production passive : +10 000 000 000 APS par niveau (paliers ×2/×4). Bonus clic arrondi : +0,1 × bâtiments × niveau. Palier 300 : production totale ×2.',
      category: 'hybrid',
      baseCost: 1e20,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const totalBuildings = getTotalBuildings(context);
        const autoAdd = 1e10 * level * tierMultiplier;
        const rawClickAdd = totalBuildings > 0 ? 0.1 * totalBuildings * level : 0;
        const clickAdd = rawClickAdd > 0 ? Math.max(1, Math.round(rawClickAdd)) : 0;
        const globalMult = level >= 300 ? 2 : 1;
        const result = { autoAdd };
        if (clickAdd > 0) {
          result.clickAdd = clickAdd;
        }
        if (globalMult > 1) {
          result.autoMult = globalMult;
          result.clickMult = globalMult;
        }
        return result;
      }
    },
    {
      id: 'cosmicArchitect',
      name: 'Architecte Cosmique',
      description: 'Réécrivez les plans du cosmos pour réduire les coûts.',
      effectSummary:
        'Production passive : +1 000 000 000 000 APS par niveau (paliers ×2/×4). Réduction de 1 % du coût futur par Architecte. Palier 150 : +20 % APC global.',
      category: 'hybrid',
      baseCost: 1e25,
      costScale: 1.15,
      effect: (level = 0) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const autoAdd = 1e12 * level * tierMultiplier;
        const clickMult = level >= 150 ? 1.2 : 1;
        return clickMult > 1
          ? { autoAdd, clickMult }
          : { autoAdd };
      }
    },
    {
      id: 'parallelUniverse',
      name: 'Univers parallèle',
      description: 'Expérimentez des réalités alternatives à haut rendement.',
      effectSummary:
        'Production passive : +100 000 000 000 000 APS par niveau (paliers ×2/×4). Synergie : +50 % APS/APC à chaque renaissance.',
      category: 'auto',
      baseCost: 1e30,
      costScale: 1.15,
      effect: (level = 0) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const autoAdd = 1e14 * level * tierMultiplier;
        return { autoAdd };
      }
    },
    {
      id: 'omniverseLibrary',
      name: 'Bibliothèque de l’Omnivers',
      description: 'Compilez le savoir infini pour booster toute production.',
      effectSummary:
        'Production passive : +10 000 000 000 000 000 APS par niveau (paliers ×2/×4). +2 % boost global par Univers parallèle. Palier 300 : Galaxies artificielles ×2.',
      category: 'hybrid',
      baseCost: 1e36,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const autoAdd = 1e16 * level * tierMultiplier;
        const parallelLevel = getBuildingLevel(context, 'parallelUniverse');
        const globalBoost = parallelLevel > 0 ? Math.pow(1.02, parallelLevel) : 1;
        if (globalBoost > 1) {
          return {
            autoAdd,
            autoMult: globalBoost,
            clickMult: globalBoost
          };
        }
        return { autoAdd };
      }
    },
    {
      id: 'quantumOverseer',
      name: 'Grand Ordonnateur Quantique',
      description: 'Ordonnez le multivers et atteignez la singularité.',
      effectSummary:
        'Production passive : +1 000 000 000 000 000 000 APS par niveau (paliers ×2/×4). Palier 100 : double définitivement tous les gains.',
      category: 'hybrid',
      baseCost: 1e42,
      costScale: 1.15,
      effect: (level = 0) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const autoAdd = 1e18 * level * tierMultiplier;
        const globalMult = level >= 100 ? 2 : 1;
        return globalMult > 1
          ? { autoAdd, autoMult: globalMult, clickMult: globalMult }
          : { autoAdd };
      }
    }
  ];
}

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
    baseMaxStacks: 1,
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
  upgrades: createShopBuildingDefinitions(),

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

  /**
   * Liste des trophées et succès spéciaux.
   * Chaque entrée définit :
   * - id : identifiant unique.
   * - name / description : textes affichés dans la page Objectifs.
   * - condition : type de condition et valeur cible.
   * - reward : effets associés (multiplicateurs, améliorations de frénésie, etc.).
   */
  trophies: [
    {
      id: 'millionAtoms',
      name: 'Ruée vers le million',
      description: 'Accumulez un total d’un million d’atomes synthétisés.',
      condition: {
        type: 'lifetimeAtoms',
        amount: { type: 'number', value: 1_000_000 }
      },
      reward: {
        multiplier: {
          global: 1.1
        },
        description: 'Boost global ×1,10 sur la production manuelle et automatique.'
      }
    },
    {
      id: 'frenzyCollector',
      name: 'Convergence frénétique',
      description: 'Déclenchez 100 frénésies (APC et APS cumulés).',
      condition: {
        type: 'frenzyTotal',
        amount: 100
      },
      reward: {
        frenzyMaxStacks: 2,
        description: 'Débloque la frénésie multiple : deux frénésies peuvent se cumuler.'
      }
    },
    {
      id: 'frenzyMaster',
      name: 'Tempête tri-phasée',
      description: 'Déclenchez 1 000 frénésies cumulées.',
      condition: {
        type: 'frenzyTotal',
        amount: 1_000
      },
      reward: {
        frenzyMaxStacks: 3,
        multiplier: {
          global: 1.05
        },
        description: 'Active la triple frénésie et ajoute un bonus global ×1,05.'
      }
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
