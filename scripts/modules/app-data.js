(function initAppData(global) {
  const DEFAULT_ATOM_SCALE_TROPHY_DATA = [
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
      flavor: 'l’équivalent d’un litre d’eau (~300 g)',
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

  const ATOM_SCALE_TROPHY_DATA = Array.isArray(global.ATOM_SCALE_TROPHY_DATA)
    ? global.ATOM_SCALE_TROPHY_DATA
    : DEFAULT_ATOM_SCALE_TROPHY_DATA;

  function formatAtomScaleBonusValue(value) {
    if (!Number.isFinite(value)) {
      return '0';
    }
    const roundedInteger = Math.round(value);
    if (Math.abs(value - roundedInteger) <= 1e-9) {
      return roundedInteger.toLocaleString('fr-FR');
    }
    return value.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function createFallbackAtomScaleTrophies() {
    const bonusPerTrophy = 2;
    return ATOM_SCALE_TROPHY_DATA.map((entry, index) => {
      const displayBonus = formatAtomScaleBonusValue(bonusPerTrophy);
      const displayTotal = formatAtomScaleBonusValue(1 + bonusPerTrophy);
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

  const FALLBACK_MILESTONES = [
    { amount: 100, text: 'Collectez 100 atomes pour débloquer la synthèse automatique.' },
    { amount: 1_000, text: 'Atteignez 1 000 atomes pour améliorer vos gants quantiques.' },
    { amount: 1_000_000, text: 'Atteignez 1 million d’atomes pour accéder aux surcadences.' },
    { amount: { type: 'layer0', mantissa: 1, exponent: 8 }, text: 'Accumulez 10^8 atomes pour préparer la prochaine ère.' }
  ];

  const FALLBACK_TROPHIES = [
    ...createFallbackAtomScaleTrophies(),
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
      order: 1000
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
        multiplier: { global: 1.05 },
        description: 'Active la triple frénésie et ajoute un bonus global ×1,05.'
      },
      order: 1020
    }
  ];

  const appData = global.APP_DATA && typeof global.APP_DATA === 'object' ? { ...global.APP_DATA } : {};
  appData.DEFAULT_ATOM_SCALE_TROPHY_DATA = DEFAULT_ATOM_SCALE_TROPHY_DATA;
  appData.ATOM_SCALE_TROPHY_DATA = ATOM_SCALE_TROPHY_DATA;
  appData.FALLBACK_MILESTONES = FALLBACK_MILESTONES;
  appData.FALLBACK_TROPHIES = FALLBACK_TROPHIES;
  global.APP_DATA = appData;
})(typeof globalThis !== 'undefined' ? globalThis : window);
