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
      description: 'Canalisez des électrons pour amplifier chaque clic quantique.',
      effectSummary:
        'Production manuelle : +1 APC par niveau. Tous les 25 niveaux : +5 % APC. Les paliers ×2/×4 convertissent leur énergie en +2 % APC supplémentaires.',
      category: 'manual',
      baseCost: 15,
      costScale: 1.15,
      effect: (level = 0) => {
        const clickAdd = level > 0 ? level : 0;
        const streakBonus = Math.pow(1.05, Math.floor(level / 25));
        const doubleThresholds = BUILDING_DOUBLE_THRESHOLDS.filter(threshold => level >= threshold).length;
        const quadThresholds = BUILDING_QUAD_THRESHOLDS.filter(threshold => level >= threshold).length;
        const tierStacks = doubleThresholds + quadThresholds * 2;
        const tierBonus = tierStacks > 0 ? 1 + tierStacks * 0.02 : 1;
        const clickMult = streakBonus * tierBonus;
        const result = { clickAdd };
        if (clickMult > 1 && clickAdd > 0) {
          result.clickMult = clickMult;
        }
        return result;
      }
    },
    {
      id: 'physicsLab',
      name: 'Laboratoire de Physique',
      description: 'Des équipes de chercheurs boostent votre production atomique.',
      effectSummary:
        'Production passive : +1 APS par niveau (paliers ×2/×4). Chaque 10 labos accordent +5 % d’APC global. Accélérateur ≥200 : Labos +20 % APS.',
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
        const rawAutoAdd = level * productionMultiplier;
        const autoAdd = level > 0 ? Math.max(level, Math.round(rawAutoAdd)) : 0;
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
        'Production passive : +10 APS par niveau (+1 % par 50 Électrons, +20 % si Labos ≥200). Palier 150 : APC global ×2.',
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
        const baseAmount = 10 * level;
        const rawAutoAdd = baseAmount * productionMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 50 * level;
        const rawAutoAdd = baseAmount * productionMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 500 * level;
        const rawAutoAdd = baseAmount * productionMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 5000 * level;
        const rawAutoAdd = baseAmount * productionMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 50_000 * level;
        const rawAutoAdd = baseAmount * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
        const clickMult = Math.pow(1.05, level);
        return { autoAdd, clickMult };
      }
    },
    {
      id: 'starForge',
      name: 'Forgeron d’étoiles',
      description: 'Façonnez des étoiles et dopez votre APC.',
      effectSummary:
        'Production passive : +500 000 APS par niveau (+2 % APS par Station). Palier 150 : +25 % APC global.',
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
        const baseAmount = 500_000 * level;
        const rawAutoAdd = baseAmount * productionMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 5e6 * level;
        const rawAutoAdd = baseAmount * productionMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 5e8 * level;
        const rawAutoAdd = baseAmount * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 1e10 * level;
        const rawAutoAdd = baseAmount * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 1e12 * level;
        const rawAutoAdd = baseAmount * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        'Production passive : +100 000 000 000 000 APS par niveau (paliers ×2/×4).',
      category: 'auto',
      baseCost: 1e30,
      costScale: 1.15,
      effect: (level = 0) => {
        const tierMultiplier = computeBuildingTierMultiplier(level);
        const baseAmount = 1e14 * level;
        const rawAutoAdd = baseAmount * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 1e16 * level;
        const rawAutoAdd = baseAmount * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
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
        const baseAmount = 1e18 * level;
        const rawAutoAdd = baseAmount * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
        const globalMult = level >= 100 ? 2 : 1;
        return globalMult > 1
          ? { autoAdd, autoMult: globalMult, clickMult: globalMult }
          : { autoAdd };
      }
    }
  ];
}

const ATOM_SCALE_TROPHY_PRESETS = [
  {
    id: 'scaleHumanCell',
    name: 'Échelle : cellule humaine',
    targetText: '10^14',
    flavor: 'l’équivalent d’une cellule humaine « moyenne »',
    amount: { type: 'layer0', mantissa: 1, exponent: 14 }
  },
  {
    id: 'scaleSandGrain',
    name: 'Échelle : grain de sable',
    targetText: '10^19',
    flavor: 'la masse d’un grain de sable (~1 mm)',
    amount: { type: 'layer0', mantissa: 1, exponent: 19 }
  },
  {
    id: 'scaleAnt',
    name: 'Échelle : fourmi',
    targetText: '10^20',
    flavor: 'comparable à une fourmi (~5 mg)',
    amount: { type: 'layer0', mantissa: 1, exponent: 20 }
  },
  {
    id: 'scaleWaterDrop',
    name: 'Échelle : goutte d’eau',
    targetText: '5 × 10^21',
    flavor: 'la quantité d’atomes contenue dans une goutte d’eau de 0,05 mL',
    amount: { type: 'layer0', mantissa: 5, exponent: 21 }
  },
  {
    id: 'scalePaperclip',
    name: 'Échelle : trombone',
    targetText: '10^22',
    flavor: 'l’équivalent d’un trombone en fer (~1 g)',
    amount: { type: 'layer0', mantissa: 1, exponent: 22 }
  },
  {
    id: 'scaleCoin',
    name: 'Échelle : pièce',
    targetText: '10^23',
    flavor: 'la masse atomique d’une pièce de monnaie (~7,5 g)',
    amount: { type: 'layer0', mantissa: 1, exponent: 23 }
  },
  {
    id: 'scaleApple',
    name: 'Échelle : pomme',
    targetText: '10^25',
    flavor: 'la masse atomique d’une pomme (~100 g)',
    amount: { type: 'layer0', mantissa: 1, exponent: 25 }
  },
  {
    id: 'scaleSmartphone',
    name: 'Échelle : smartphone',
    targetText: '3 × 10^25',
    flavor: 'autant qu’un smartphone moderne (~180 g)',
    amount: { type: 'layer0', mantissa: 3, exponent: 25 }
  },
  {
    id: 'scaleWaterLitre',
    name: 'Échelle : litre d’eau',
    targetText: '10^26',
    flavor: 'l’équivalent d’un litre d’eau',
    amount: { type: 'layer0', mantissa: 1, exponent: 26 }
  },
  {
    id: 'scaleHuman',
    name: 'Échelle : être humain',
    targetText: '7 × 10^27',
    flavor: 'comparable à un humain de 70 kg',
    amount: { type: 'layer0', mantissa: 7, exponent: 27 }
  },
  {
    id: 'scalePiano',
    name: 'Échelle : piano',
    targetText: '10^29',
    flavor: 'équivaut à un piano (~450 kg)',
    amount: { type: 'layer0', mantissa: 1, exponent: 29 }
  },
  {
    id: 'scaleCar',
    name: 'Échelle : voiture compacte',
    targetText: '10^30',
    flavor: 'autant qu’une voiture compacte (~1,3 t)',
    amount: { type: 'layer0', mantissa: 1, exponent: 30 }
  },
  {
    id: 'scaleElephant',
    name: 'Échelle : éléphant',
    targetText: '3 × 10^31',
    flavor: 'équivaut à un éléphant (~6 t)',
    amount: { type: 'layer0', mantissa: 3, exponent: 31 }
  },
  {
    id: 'scaleBoeing747',
    name: 'Échelle : Boeing 747',
    targetText: '10^33',
    flavor: 'autant qu’un Boeing 747',
    amount: { type: 'layer0', mantissa: 1, exponent: 33 }
  },
  {
    id: 'scalePyramid',
    name: 'Échelle : pyramide de Khéops',
    targetText: '2 × 10^35',
    flavor: 'la masse d’atomes de la grande pyramide de Khéops',
    amount: { type: 'layer0', mantissa: 2, exponent: 35 }
  },
  {
    id: 'scaleAtmosphere',
    name: 'Échelle : atmosphère terrestre',
    targetText: '2 × 10^44',
    flavor: 'équivaut à l’atmosphère terrestre complète',
    amount: { type: 'layer0', mantissa: 2, exponent: 44 }
  },
  {
    id: 'scaleOceans',
    name: 'Échelle : océans terrestres',
    targetText: '10^47',
    flavor: 'autant que tous les océans de la Terre',
    amount: { type: 'layer0', mantissa: 1, exponent: 47 }
  },
  {
    id: 'scaleEarth',
    name: 'Échelle : Terre',
    targetText: '10^50',
    flavor: 'égale la masse atomique de la planète Terre',
    amount: { type: 'layer0', mantissa: 1, exponent: 50 }
  },
  {
    id: 'scaleSun',
    name: 'Échelle : Soleil',
    targetText: '10^57',
    flavor: 'équivaut au Soleil',
    amount: { type: 'layer0', mantissa: 1, exponent: 57 }
  },
  {
    id: 'scaleMilkyWay',
    name: 'Échelle : Voie lactée',
    targetText: '10^69',
    flavor: 'comparable à la Voie lactée entière',
    amount: { type: 'layer0', mantissa: 1, exponent: 69 }
  },
  {
    id: 'scaleLocalGroup',
    name: 'Échelle : Groupe local',
    targetText: '10^71',
    flavor: 'autant que le Groupe local de galaxies',
    amount: { type: 'layer0', mantissa: 1, exponent: 71 }
  },
  {
    id: 'scaleVirgoCluster',
    name: 'Échelle : superamas de la Vierge',
    targetText: '10^74',
    flavor: 'équivaut au superamas de la Vierge',
    amount: { type: 'layer0', mantissa: 1, exponent: 74 }
  },
  {
    id: 'scaleObservableUniverse',
    name: 'Échelle : univers observable',
    targetText: '10^80',
    flavor: 'atteignez le total estimé d’atomes de l’univers observable',
    amount: { type: 'layer0', mantissa: 1, exponent: 80 }
  }
];

globalThis.ATOM_SCALE_TROPHY_DATA = ATOM_SCALE_TROPHY_PRESETS;

function formatAtomScaleBonus(value) {
  if (!Number.isFinite(value)) {
    return '0';
  }
  const roundedInteger = Math.round(value);
  if (Math.abs(value - roundedInteger) <= 1e-9) {
    return roundedInteger.toLocaleString('fr-FR');
  }
  return value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function createAtomScaleTrophies() {
  const bonusPerTrophy = 2;
  return ATOM_SCALE_TROPHY_PRESETS.map((entry, index) => {
    const displayBonus = formatAtomScaleBonus(bonusPerTrophy);
    const displayTotal = formatAtomScaleBonus(1 + bonusPerTrophy);
    return {
      id: entry.id,
      name: entry.name,
      description: `Atteignez ${entry.targetText} atomes cumulés, ${entry.flavor}.`,
      condition: {
        type: 'lifetimeAtoms',
        amount: entry.amount
      },
      reward: {
        trophyMultiplierAdd: bonusPerTrophy,
        description: `Ajoute +${displayBonus} au Boost global sur la production manuelle et automatique (×${displayTotal} pour ce palier).`
      },
      order: index
    };
  });
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
   * - offlineTickets : configuration des gains de tickets hors-ligne (intervalle et plafond).
   * - defaultTheme : thème visuel utilisé lors d'une nouvelle partie ou après réinitialisation.
   * - crit : paramètres initiaux des coups critiques (chance, multiplicateur et plafond).
   */
  progression: {
    basePerClick: { type: 'number', value: 1 },
    basePerSecond: { type: 'number', value: 0 },
    offlineCapSeconds: 60 * 60 * 12,
    offlineTickets: {
      secondsPerTicket: 60 * 15,
      capSeconds: 60 * 60 * 24
    },
    defaultTheme: 'dark',
    crit: {
      baseChance: 0.05,
      baseMultiplier: 2,
      maxMultiplier: 100
    }
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
   * Liste des trophées et succès spéciaux.
   * Chaque entrée définit :
   * - id : identifiant unique.
   * - name / description : textes affichés dans la page Objectifs.
   * - condition : type de condition et valeur cible.
   * - reward : effets associés (multiplicateurs, améliorations de frénésie, etc.).
   */
  trophies: [
    ...createAtomScaleTrophies(),
    {
      id: 'millionAtoms',
      name: 'Ruée vers le million',
      description: 'Accumulez un total d’un million d’atomes synthétisés.',
      condition: {
        type: 'lifetimeAtoms',
        amount: { type: 'number', value: 1_000_000 }
      },
      reward: {
        trophyMultiplierAdd: 0.5,
        description: 'Ajoute +0,5 au Boost global sur la production manuelle et automatique (×1,50 une fois ce succès débloqué).'
      },
      order: -1
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
      },
      order: 1010
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
      },
      order: 1020
    },
    {
      id: 'ticketHarvester',
      name: 'Collecteur d’étoiles',
      description: 'Complétez les collections Commun cosmique et Essentiel planétaire.',
      condition: {
        type: 'collectionRarities',
        rarities: ['commun', 'essentiel']
      },
      reward: {
        ticketStarAutoCollect: {
          delaySeconds: 3
        },
        description: 'Sur l’écran principal, les étoiles à tickets se récoltent seules après 3 secondes.'
      },
      order: 1030
    }
  ],

  gacha: {
    ticketCost: 1, // Nombre de tickets requis par tirage
    rarities: [
      {
        id: 'commun',
        label: 'Commun cosmique',
        description: 'Les éléments omniprésents dans les nébuleuses et les atmosphères stellaires.',
        weight: 35,
        color: '#1abc9c'
      },
      {
        id: 'essentiel',
        label: 'Essentiel planétaire',
        description: 'Les piliers des mondes rocheux et des océans extraterrestres.',
        weight: 25,
        color: '#3498db'
      },
      {
        id: 'stellaire',
        label: 'Forge stellaire',
        description: 'Alliages façonnés dans les coeurs d’étoiles actives.',
        weight: 20,
        color: '#9b59b6'
      },
      {
        id: 'singulier',
        label: 'Singularité minérale',
        description: 'Raretés cristallines difficiles à isoler.',
        weight: 8,
        color: '#cd6155'
      },
      {
        id: 'mythique',
        label: 'Mythe quantique',
        description: 'Éléments aux propriétés quasi légendaires.',
        weight: 7,
        color: '#FFBF66'
      },
      {
        id: 'irreel',
        label: 'Irréel',
        description: 'Créations synthétiques jamais rencontrées naturellement.',
        weight: 5,
        color: '#7f8c8d'
      }
    ]
  },

  /**
   * Apparition de l'étoile à tickets sur la page principale.
   * - averageSpawnIntervalSeconds : intervalle moyen entre deux apparitions.
   * - speedPixelsPerSecond : vitesse de déplacement de l'icône.
   * - size : taille (en pixels) du sprite.
   * - rewardTickets : nombre de tickets octroyés par clic.
   */
  ticketStar: {
    averageSpawnIntervalSeconds: 60,
    speedPixelsPerSecond: 90,
    size: 72,
    rewardTickets: 1
  },

  /**
   * Bonus appliqués en fonction de la rareté des éléments de la collection.
   * Chaque groupe permet de configurer :
   * - perCopy : bonus plats ajoutés pour chaque copie possédée. Options :
   *   - clickAdd / autoAdd : valeurs ajoutées à l'APC / APS.
   *   - minCopies / minUnique : quantités minimales avant d'activer le bonus.
   * - setBonus : bonus uniques débloqués une fois le groupe complété. Options :
   *   - requireAllUnique (par défaut true) : exige d'avoir tous les éléments de la rareté.
   *   - minCopies / minUnique : seuils supplémentaires pour déclencher le bonus.
   * - multiplier : multiplicateur progressif basé sur le nombre de copies.
   * - Les raretés spéciales (ex. : « mythique ») peuvent définir des bonus
   *   supplémentaires via les clés suivantes :
   *   - ticketBonus : réduction de l'intervalle de l'étoile à tickets.
   *   - offlineBonus : multiplicateur de gains hors-ligne par duplicata.
   *   - duplicateOverflow : gain plat supplémentaire après le plafond.
   *   - frenzyBonus : multiplicateur des chances de frénésie.
   */
  elementBonuses: {
    groups: {
      commun: {
        perCopy: {
          clickAdd: 1
        },
        setBonus: {
          clickAdd: 500,
          requireAllUnique: true
        },
        multiplier: {
          every: 50,
          increment: 1,
          cap: 100,
          targets: ['perClick', 'perSecond']
        }
      },
      essentiel: {
        perCopy: {
          uniqueClickAdd: 10,
          duplicateClickAdd: 10,
          label: 'Essentiel planétaire · récoltes essentielles'
        },
        setBonus: [
          {
            clickAdd: 1000,
            requireAllUnique: true,
            label: 'Essentiel planétaire · collection complète'
          }
        ],
        multiplier: {
          every: 30,
          increment: 1,
          cap: 100,
          targets: ['perClick', 'perSecond'],
          label: 'Essentiel planétaire · synergie orbitale'
        }
      },
      stellaire: {
        perCopy: {
          uniqueClickAdd: 50,
          duplicateClickAdd: 25,
          label: 'Forge stellaire · fragments activés'
        },
        multiplier: {
          every: 20,
          increment: 1,
          cap: 100,
          targets: ['perClick', 'perSecond'],
          label: 'Forge stellaire · intensité stellaire'
        },
        setBonus: {
          requireAllUnique: true,
          label: 'Forge stellaire · forge parfaite',
          rarityFlatMultipliers: {
            commun: { perClick: 2 }
          }
        },
        labels: {
          perCopy: 'Forge stellaire · fragments',
          setBonus: 'Forge stellaire · forge parfaite',
          multiplier: 'Forge stellaire · intensité stellaire'
        }
      },
      singulier: {
        perCopy: {
          uniqueClickAdd: 25,
          uniqueAutoAdd: 25,
          duplicateClickAdd: 20,
          duplicateAutoAdd: 20,
          label: 'Singularité minérale · résonance cristalline'
        },
        multiplier: {
          every: 10,
          increment: 1,
          cap: 100,
          targets: ['perClick', 'perSecond'],
          label: 'Singularité minérale · densité extrême'
        },
        labels: {
          perCopy: 'Singularité minérale · résonance cristalline',
          multiplier: 'Singularité minérale · densité extrême'
        }
      },
      mythique: {
        labels: {
          setBonus: 'Mythe quantique · convergence ultime',
          ticketBonus: 'Mythe quantique · étoile compressée',
          offlineBonus: 'Mythe quantique · collecte persistante',
          duplicateOverflow: 'Mythe quantique · surcharge fractale'
        },
        ticketBonus: {
          uniqueReductionSeconds: 1,
          minIntervalSeconds: 5
        },
        offlineBonus: {
          baseMultiplier: 0.01,
          perDuplicate: 0.01,
          cap: 1
        },
        duplicateOverflow: {
          flatBonus: 50
        },
        frenzyBonus: {
          multiplier: 1.5
        }
      },
      irreel: {
        crit: {
          perUnique: {
            chanceAdd: 0.01
          },
          perDuplicate: {
            multiplierAdd: 0.01
          }
        },
        multiplier: {
          every: 5,
          increment: 1,
          cap: 100,
          targets: ['perClick', 'perSecond'],
          label: 'Irréel · catalyseur dimensionnel'
        }
      }
    }
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
