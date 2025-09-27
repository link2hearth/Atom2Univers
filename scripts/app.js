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

const ATOM_SCALE_TROPHY_DATA = Array.isArray(globalThis.ATOM_SCALE_TROPHY_DATA)
  ? globalThis.ATOM_SCALE_TROPHY_DATA
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

function createInitialStats() {
  const now = Date.now();
  return {
    session: {
      atomsGained: LayeredNumber.zero(),
      apcAtoms: LayeredNumber.zero(),
      apsAtoms: LayeredNumber.zero(),
      offlineAtoms: LayeredNumber.zero(),
      manualClicks: 0,
      onlineTimeMs: 0,
      startedAt: now,
      frenzyTriggers: {
        perClick: 0,
        perSecond: 0,
        total: 0
      }
    },
    global: {
      apcAtoms: LayeredNumber.zero(),
      apsAtoms: LayeredNumber.zero(),
      offlineAtoms: LayeredNumber.zero(),
      manualClicks: 0,
      playTimeMs: 0,
      startedAt: null,
      frenzyTriggers: {
        perClick: 0,
        perSecond: 0,
        total: 0
      }
    }
  };
}

function getLayeredStat(store, key) {
  if (!store || typeof store !== 'object') {
    return LayeredNumber.zero();
  }
  const current = store[key];
  if (current instanceof LayeredNumber) {
    return current;
  }
  if (current && typeof current === 'object') {
    try {
      const normalized = LayeredNumber.fromJSON(current);
      store[key] = normalized;
      return normalized;
    } catch (err) {
      // Ignore malformed values and fall through to zero
    }
  }
  if (current != null) {
    const numeric = Number(current);
    if (Number.isFinite(numeric) && numeric !== 0) {
      const normalized = new LayeredNumber(numeric);
      store[key] = normalized;
      return normalized;
    }
  }
  const zero = LayeredNumber.zero();
  store[key] = zero;
  return zero;
}

function incrementLayeredStat(store, key, amount) {
  if (!store || typeof store !== 'object') {
    return;
  }
  const current = getLayeredStat(store, key);
  store[key] = current.add(amount);
}

function normalizeFrenzyStats(raw) {
  if (!raw || typeof raw !== 'object') {
    return { perClick: 0, perSecond: 0, total: 0 };
  }
  const perClick = Number(raw.perClick ?? raw.click ?? 0);
  const perSecond = Number(raw.perSecond ?? raw.auto ?? raw.aps ?? 0);
  const totalRaw = raw.total != null ? Number(raw.total) : perClick + perSecond;
  return {
    perClick: Number.isFinite(perClick) && perClick > 0 ? Math.floor(perClick) : 0,
    perSecond: Number.isFinite(perSecond) && perSecond > 0 ? Math.floor(perSecond) : 0,
    total: Number.isFinite(totalRaw) && totalRaw > 0 ? Math.floor(totalRaw) : 0
  };
}

function createDefaultApsCritState() {
  return { effects: [] };
}

function normalizeApsCritEffect(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const multiplierAdd = Number(raw.multiplierAdd ?? raw.add ?? raw.multiplier ?? raw.value ?? 0);
  const remainingSeconds = Number(
    raw.remainingSeconds ?? raw.seconds ?? raw.time ?? raw.duration ?? raw.chrono ?? 0
  );
  if (!Number.isFinite(multiplierAdd) || !Number.isFinite(remainingSeconds)) {
    return null;
  }
  if (multiplierAdd <= 0 || remainingSeconds <= 0) {
    return null;
  }
  return {
    multiplierAdd: Math.max(0, multiplierAdd),
    remainingSeconds: Math.max(0, remainingSeconds)
  };
}

function normalizeApsCritState(raw) {
  const state = createDefaultApsCritState();
  if (!raw || typeof raw !== 'object') {
    return state;
  }
  if (Array.isArray(raw.effects)) {
    state.effects = raw.effects
      .map(entry => normalizeApsCritEffect(entry))
      .filter(effect => effect != null);
    if (state.effects.length) {
      return state;
    }
  }
  const chronoValue = Number(
    raw.chronoSeconds ?? raw.chrono ?? raw.time ?? raw.seconds ?? raw.chronoSecs ?? 0
  );
  const multiplierValue = Number(raw.multiplier ?? raw.multi ?? raw.factor ?? 0);
  if (Number.isFinite(chronoValue) && chronoValue > 0 && Number.isFinite(multiplierValue) && multiplierValue > 1) {
    state.effects = [{
      multiplierAdd: Math.max(0, multiplierValue - 1),
      remainingSeconds: Math.max(0, chronoValue)
    }];
  }
  return state;
}

function createEmptyProductionEntry() {
  const rarityMultipliers = new Map();
  RARITY_IDS.forEach(id => {
    rarityMultipliers.set(id, 1);
  });
  return {
    base: LayeredNumber.zero(),
    totalAddition: LayeredNumber.zero(),
    totalMultiplier: LayeredNumber.one(),
    additions: [],
    multipliers: [],
    total: LayeredNumber.zero(),
    sources: {
      flats: {
        baseFlat: LayeredNumber.zero(),
        shopFlat: LayeredNumber.zero(),
        elementFlat: LayeredNumber.zero(),
        fusionFlat: LayeredNumber.zero(),
        devkitFlat: LayeredNumber.zero()
      },
      multipliers: {
        shopBonus1: LayeredNumber.one(),
        shopBonus2: LayeredNumber.one(),
        trophyMultiplier: LayeredNumber.one(),
        familyMultiplier: LayeredNumber.one(),
        frenzy: LayeredNumber.one(),
        apsCrit: LayeredNumber.one(),
        rarityMultipliers
      }
    }
  };
}

function createEmptyProductionBreakdown() {
  return {
    perClick: createEmptyProductionEntry(),
    perSecond: createEmptyProductionEntry()
  };
}

function cloneRarityMultipliers(store) {
  if (store instanceof Map) {
    return new Map(store);
  }
  if (store && typeof store === 'object') {
    return { ...store };
  }
  return new Map();
}

function cloneProductionEntry(entry) {
  if (!entry) {
    return createEmptyProductionEntry();
  }
  const clone = {
    base: entry.base instanceof LayeredNumber ? entry.base.clone() : toLayeredValue(entry.base, 0),
    totalAddition: entry.totalAddition instanceof LayeredNumber
      ? entry.totalAddition.clone()
      : toLayeredValue(entry.totalAddition, 0),
    totalMultiplier: entry.totalMultiplier instanceof LayeredNumber
      ? entry.totalMultiplier.clone()
      : toMultiplierLayered(entry.totalMultiplier),
    additions: Array.isArray(entry.additions)
      ? entry.additions.map(add => ({
        ...add,
        value: add.value instanceof LayeredNumber ? add.value.clone() : toLayeredValue(add.value, 0)
      }))
      : [],
    multipliers: Array.isArray(entry.multipliers)
      ? entry.multipliers.map(mult => ({
        ...mult,
        value: mult.value instanceof LayeredNumber ? mult.value.clone() : toMultiplierLayered(mult.value)
      }))
      : [],
    total: entry.total instanceof LayeredNumber ? entry.total.clone() : toLayeredValue(entry.total, 0),
    sources: {
      flats: {
        baseFlat: entry.sources?.flats?.baseFlat instanceof LayeredNumber
          ? entry.sources.flats.baseFlat.clone()
          : toLayeredValue(entry.sources?.flats?.baseFlat, 0),
        shopFlat: entry.sources?.flats?.shopFlat instanceof LayeredNumber
          ? entry.sources.flats.shopFlat.clone()
          : toLayeredValue(entry.sources?.flats?.shopFlat, 0),
        elementFlat: entry.sources?.flats?.elementFlat instanceof LayeredNumber
          ? entry.sources.flats.elementFlat.clone()
          : toLayeredValue(entry.sources?.flats?.elementFlat, 0),
        fusionFlat: entry.sources?.flats?.fusionFlat instanceof LayeredNumber
          ? entry.sources.flats.fusionFlat.clone()
          : toLayeredValue(entry.sources?.flats?.fusionFlat, 0),
        devkitFlat: entry.sources?.flats?.devkitFlat instanceof LayeredNumber
          ? entry.sources.flats.devkitFlat.clone()
          : toLayeredValue(entry.sources?.flats?.devkitFlat, 0)
      },
      multipliers: {
        shopBonus1: entry.sources?.multipliers?.shopBonus1 instanceof LayeredNumber
          ? entry.sources.multipliers.shopBonus1.clone()
          : toMultiplierLayered(entry.sources?.multipliers?.shopBonus1 ?? 1),
        shopBonus2: entry.sources?.multipliers?.shopBonus2 instanceof LayeredNumber
          ? entry.sources.multipliers.shopBonus2.clone()
          : toMultiplierLayered(entry.sources?.multipliers?.shopBonus2 ?? 1),
        trophyMultiplier: entry.sources?.multipliers?.trophyMultiplier instanceof LayeredNumber
          ? entry.sources.multipliers.trophyMultiplier.clone()
          : toMultiplierLayered(entry.sources?.multipliers?.trophyMultiplier ?? 1),
        familyMultiplier: entry.sources?.multipliers?.familyMultiplier instanceof LayeredNumber
          ? entry.sources.multipliers.familyMultiplier.clone()
          : toMultiplierLayered(entry.sources?.multipliers?.familyMultiplier ?? 1),
        frenzy: entry.sources?.multipliers?.frenzy instanceof LayeredNumber
          ? entry.sources.multipliers.frenzy.clone()
          : LayeredNumber.one(),
        apsCrit: entry.sources?.multipliers?.apsCrit instanceof LayeredNumber
          ? entry.sources.multipliers.apsCrit.clone()
          : toMultiplierLayered(entry.sources?.multipliers?.apsCrit ?? 1),
        rarityMultipliers: cloneRarityMultipliers(entry.sources?.multipliers?.rarityMultipliers)
      }
    }
  };
  return clone;
}

const frenzyState = {
  perClick: {
    token: null,
    tokenExpire: 0,
    effectUntil: 0,
    currentMultiplier: 1,
    effects: [],
    currentStacks: 0
  },
  perSecond: {
    token: null,
    tokenExpire: 0,
    effectUntil: 0,
    currentMultiplier: 1,
    effects: [],
    currentStacks: 0
  },
  spawnAccumulator: 0
};

function getFrenzyMultiplier(type, now = performance.now()) {
  if (!FRENZY_TYPES.includes(type)) {
    return 1;
  }
  const entry = frenzyState[type];
  if (!entry) {
    return 1;
  }
  if (!Array.isArray(entry.effects) || entry.effects.length === 0) {
    return entry.effectUntil > now ? FRENZY_CONFIG.multiplier : 1;
  }
  const activeStacks = entry.effects.filter(expire => expire > now).length;
  if (activeStacks <= 0) {
    return 1;
  }
  return Math.pow(FRENZY_CONFIG.multiplier, activeStacks);
}

function getFrenzyStackCount(type, now = performance.now()) {
  if (!FRENZY_TYPES.includes(type)) return 0;
  const entry = frenzyState[type];
  if (!entry || !Array.isArray(entry.effects)) return entry && entry.effectUntil > now ? 1 : 0;
  return entry.effects.filter(expire => expire > now).length;
}

function pruneFrenzyEffects(entry, now = performance.now()) {
  if (!entry) return false;
  if (!Array.isArray(entry.effects)) {
    entry.effects = [];
  }
  const before = entry.effects.length;
  entry.effects = entry.effects.filter(expire => expire > now);
  entry.effectUntil = entry.effects.length ? Math.max(...entry.effects) : 0;
  entry.currentStacks = entry.effects.length;
  return before !== entry.effects.length;
}

function applyFrenzyEffects(now = performance.now()) {
  const basePerClick = gameState.basePerClick instanceof LayeredNumber
    ? gameState.basePerClick.clone()
    : BASE_PER_CLICK.clone();
  const basePerSecond = gameState.basePerSecond instanceof LayeredNumber
    ? gameState.basePerSecond.clone()
    : BASE_PER_SECOND.clone();

  const clickMultiplier = getFrenzyMultiplier('perClick', now);
  const autoMultiplier = getFrenzyMultiplier('perSecond', now);

  let perClickResult = basePerClick.multiplyNumber(clickMultiplier);
  let perSecondResult = basePerSecond.multiplyNumber(autoMultiplier);

  perClickResult = normalizeProductionUnit(perClickResult);
  perSecondResult = normalizeProductionUnit(perSecondResult);

  gameState.perClick = perClickResult.clone();
  gameState.perSecond = perSecondResult.clone();

  const baseProduction = gameState.productionBase || createEmptyProductionBreakdown();
  const clickEntry = cloneProductionEntry(baseProduction.perClick);
  const autoEntry = cloneProductionEntry(baseProduction.perSecond);

  const clickMultiplierLayered = toMultiplierLayered(clickMultiplier);
  const autoMultiplierLayered = toMultiplierLayered(autoMultiplier);

  if (clickEntry) {
    clickEntry.sources.multipliers.frenzy = clickMultiplierLayered.clone();
    if (!isLayeredOne(clickMultiplierLayered)) {
      clickEntry.multipliers.push({
        id: 'frenzy',
        label: 'Frénésie',
        value: clickMultiplierLayered.clone(),
        source: 'frenzy'
      });
    }
    clickEntry.totalMultiplier = clickEntry.totalMultiplier.multiply(clickMultiplierLayered);
    clickEntry.total = perClickResult.clone();
  }

  if (autoEntry) {
    autoEntry.sources.multipliers.frenzy = autoMultiplierLayered.clone();
    if (!isLayeredOne(autoMultiplierLayered)) {
      autoEntry.multipliers.push({
        id: 'frenzy',
        label: 'Frénésie',
        value: autoMultiplierLayered.clone(),
        source: 'frenzy'
      });
    }
    autoEntry.totalMultiplier = autoEntry.totalMultiplier.multiply(autoMultiplierLayered);
    autoEntry.total = perSecondResult.clone();
  }

  gameState.production = {
    perClick: clickEntry,
    perSecond: autoEntry
  };

  gameState.crit = cloneCritState(gameState.baseCrit);

  frenzyState.perClick.currentMultiplier = clickMultiplier;
  frenzyState.perSecond.currentMultiplier = autoMultiplier;
  frenzyState.perClick.currentStacks = getFrenzyStackCount('perClick', now);
  frenzyState.perSecond.currentStacks = getFrenzyStackCount('perSecond', now);
}

function clearFrenzyToken(type, immediate = false) {
  if (!FRENZY_TYPES.includes(type)) return;
  const entry = frenzyState[type];
  if (!entry || !entry.token) return;
  const token = entry.token;
  entry.token = null;
  entry.tokenExpire = 0;
  token.disabled = true;
  token.style.pointerEvents = 'none';
  token.classList.add('is-expiring');
  const remove = () => {
    if (token && token.isConnected) {
      token.remove();
    }
  };
  if (immediate) {
    remove();
  } else {
    setTimeout(remove, 180);
  }
}

function positionFrenzyToken(type, token) {
  if (!elements.frenzyLayer || !elements.atomButton) return false;
  const containerRect = elements.frenzyLayer.getBoundingClientRect();
  const atomRect = elements.atomButton.getBoundingClientRect();
  if (!containerRect.width || !containerRect.height || !atomRect.width || !atomRect.height) {
    return false;
  }

  const centerX = atomRect.left + atomRect.width / 2;
  const centerY = atomRect.top + atomRect.height / 2;
  const baseSize = Math.max(atomRect.width, atomRect.height);
  const minRadius = baseSize * 0.45;
  const maxRadius = baseSize * 1.25;
  const radiusRange = Math.max(maxRadius - minRadius, minRadius);
  const radius = minRadius + Math.random() * radiusRange;
  const angle = Math.random() * Math.PI * 2;

  let targetX = centerX + Math.cos(angle) * radius;
  let targetY = centerY + Math.sin(angle) * radius;

  const margin = Math.max(40, baseSize * 0.25);
  targetX = Math.min(containerRect.right - margin, Math.max(containerRect.left + margin, targetX));
  targetY = Math.min(containerRect.bottom - margin, Math.max(containerRect.top + margin, targetY));

  token.style.left = `${targetX - containerRect.left}px`;
  token.style.top = `${targetY - containerRect.top}px`;
  return true;
}

function spawnFrenzyToken(type, now = performance.now()) {
  const info = FRENZY_TYPE_INFO[type];
  if (!info) return;
  if (!elements.frenzyLayer || !elements.atomButton) return;
  if (FRENZY_CONFIG.displayDurationMs <= 0) return;

  const token = document.createElement('button');
  token.type = 'button';
  token.className = `frenzy-token frenzy-token--${type}`;
  token.dataset.frenzyType = type;
  const multiplierText = `×${FRENZY_CONFIG.multiplier}`;
  token.setAttribute('aria-label', `Activer la ${info.label} (${multiplierText})`);
  token.title = `Activer la ${info.label} (${multiplierText})`;

  const img = document.createElement('img');
  img.src = info.asset;
  img.alt = '';
  img.setAttribute('aria-hidden', 'true');
  token.appendChild(img);

  token.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
    collectFrenzy(type);
  });

  if (!positionFrenzyToken(type, token)) {
    return;
  }

  elements.frenzyLayer.appendChild(token);
  frenzyState[type].token = token;
  frenzyState[type].tokenExpire = now + FRENZY_CONFIG.displayDurationMs;
}

function attemptFrenzySpawn(type, now = performance.now()) {
  if (!FRENZY_TYPES.includes(type)) return;
  if (!isGamePageActive()) return;
  if (typeof document !== 'undefined' && document.hidden) return;
  if (!elements.frenzyLayer || !elements.atomButton) return;
  const entry = frenzyState[type];
  if (entry.token) return;
  const chance = getEffectiveFrenzySpawnChance(type);
  if (chance <= 0) return;
  if (Math.random() >= chance) return;
  spawnFrenzyToken(type, now);
}

function collectFrenzy(type, now = performance.now()) {
  const info = FRENZY_TYPE_INFO[type];
  if (!info) return;
  if (!FRENZY_TYPES.includes(type)) return;
  const entry = frenzyState[type];
  if (!entry) return;

  clearFrenzyToken(type);
  pruneFrenzyEffects(entry, now);
  if (!Array.isArray(entry.effects)) {
    entry.effects = [];
  }
  const duration = FRENZY_CONFIG.effectDurationMs;
  const expireAt = now + duration;
  const maxStacks = getTrophyFrenzyCap();
  if (entry.effects.length >= maxStacks && entry.effects.length > 0) {
    entry.effects.sort((a, b) => a - b);
    entry.effects[0] = expireAt;
  } else {
    entry.effects.push(expireAt);
  }
  entry.effectUntil = entry.effects.length ? Math.max(...entry.effects) : expireAt;
  entry.currentStacks = getFrenzyStackCount(type, now);

  applyFrenzyEffects(now);

  registerFrenzyTrigger(type);
  evaluateTrophies();
  updateUI();

  const rawSeconds = FRENZY_CONFIG.effectDurationMs / 1000;
  let durationText;
  if (rawSeconds >= 1) {
    if (Number.isInteger(rawSeconds)) {
      durationText = `${rawSeconds.toFixed(0)}s`;
    } else {
      const precision = rawSeconds < 10 ? 1 : 0;
      durationText = `${rawSeconds.toFixed(precision)}s`;
    }
  } else {
    durationText = `${rawSeconds.toFixed(1)}s`;
  }
  showToast(`${info.label} ${`×${FRENZY_CONFIG.multiplier}`} pendant ${durationText} !`);
}

function updateFrenzies(delta, now = performance.now()) {
  if (!Number.isFinite(delta) || delta < 0) {
    delta = 0;
  }

  frenzyState.spawnAccumulator += delta;
  const attempts = Math.floor(frenzyState.spawnAccumulator);
  if (attempts > 0) {
    for (let i = 0; i < attempts; i += 1) {
      FRENZY_TYPES.forEach(type => attemptFrenzySpawn(type, now));
    }
    frenzyState.spawnAccumulator -= attempts;
  }

  let needsUpdate = false;
  FRENZY_TYPES.forEach(type => {
    const entry = frenzyState[type];
    if (!entry) return;
    if (entry.token && now >= entry.tokenExpire) {
      clearFrenzyToken(type);
    }
    const removed = pruneFrenzyEffects(entry, now);
    if (removed) {
      needsUpdate = true;
    }
  });

  if (needsUpdate) {
    applyFrenzyEffects(now);
    updateUI();
  }
}

function resetFrenzyState(options = {}) {
  const { skipApply = false } = options;
  FRENZY_TYPES.forEach(type => {
    clearFrenzyToken(type, true);
    const entry = frenzyState[type];
    if (!entry) return;
    entry.effectUntil = 0;
    entry.currentMultiplier = 1;
    entry.effects = [];
    entry.currentStacks = 0;
  });
  frenzyState.spawnAccumulator = 0;
  if (!skipApply) {
    applyFrenzyEffects();
    updateUI();
  }
}

function parseStats(saved) {
  const stats = createInitialStats();
  if (!saved || typeof saved !== 'object') {
    return stats;
  }

  let legacySessionStart = null;
  if (saved.session && typeof saved.session.startedAt === 'number') {
    const candidate = Number(saved.session.startedAt);
    if (Number.isFinite(candidate) && candidate > 0) {
      legacySessionStart = candidate;
    }
  }

  if (saved.global) {
    stats.global.manualClicks = Number(saved.global.manualClicks) || 0;
    stats.global.playTimeMs = Number(saved.global.playTimeMs) || 0;
    stats.global.frenzyTriggers = normalizeFrenzyStats(saved.global.frenzyTriggers);
    stats.global.apcAtoms = LayeredNumber.fromJSON(saved.global.apcAtoms);
    stats.global.apsAtoms = LayeredNumber.fromJSON(saved.global.apsAtoms);
    stats.global.offlineAtoms = LayeredNumber.fromJSON(saved.global.offlineAtoms);
    const globalStart = typeof saved.global.startedAt === 'number'
      ? Number(saved.global.startedAt)
      : null;
    if (Number.isFinite(globalStart) && globalStart > 0) {
      stats.global.startedAt = globalStart;
    } else if (legacySessionStart != null) {
      stats.global.startedAt = legacySessionStart;
    }
  } else if (legacySessionStart != null) {
    stats.global.startedAt = legacySessionStart;
  }

  // Always start a fresh session when the game is (re)loaded.
  stats.session = {
    atomsGained: LayeredNumber.zero(),
    apcAtoms: LayeredNumber.zero(),
    apsAtoms: LayeredNumber.zero(),
    offlineAtoms: LayeredNumber.zero(),
    manualClicks: 0,
    onlineTimeMs: 0,
    startedAt: Date.now(),
    frenzyTriggers: { perClick: 0, perSecond: 0, total: 0 }
  };

  return stats;
}

// Game state management
const DEFAULT_STATE = {
  atoms: LayeredNumber.zero(),
  lifetime: LayeredNumber.zero(),
  perClick: BASE_PER_CLICK.clone(),
  perSecond: BASE_PER_SECOND.clone(),
  basePerClick: BASE_PER_CLICK.clone(),
  basePerSecond: BASE_PER_SECOND.clone(),
  gachaTickets: 0,
  bonusParticulesTickets: 0,
  upgrades: {},
  shopUnlocks: [],
  elements: createInitialElementCollection(),
  fusions: createInitialFusionState(),
  fusionBonuses: createInitialFusionBonuses(),
  pageUnlocks: createInitialPageUnlockState(),
  lastSave: Date.now(),
  theme: DEFAULT_THEME,
  stats: createInitialStats(),
  production: createEmptyProductionBreakdown(),
  productionBase: createEmptyProductionBreakdown(),
  crit: createDefaultCritState(),
  baseCrit: createDefaultCritState(),
  lastCritical: null,
  elementBonusSummary: {},
  trophies: [],
  offlineGainMultiplier: MYTHIQUE_OFFLINE_BASE,
  offlineTickets: {
    secondsPerTicket: OFFLINE_TICKET_CONFIG.secondsPerTicket,
    capSeconds: OFFLINE_TICKET_CONFIG.capSeconds,
    progressSeconds: 0
  },
  ticketStarAutoCollect: null,
  ticketStarAverageIntervalSeconds: DEFAULT_TICKET_STAR_INTERVAL_SECONDS,
  ticketStarUnlocked: false,
  frenzySpawnBonus: { perClick: 1, perSecond: 1 },
  musicTrackId: null,
  musicVolume: DEFAULT_MUSIC_VOLUME,
  musicEnabled: DEFAULT_MUSIC_ENABLED,
  bigBangButtonVisible: false,
  apsCrit: createDefaultApsCritState()
};

const gameState = {
  atoms: LayeredNumber.zero(),
  lifetime: LayeredNumber.zero(),
  perClick: BASE_PER_CLICK.clone(),
  perSecond: BASE_PER_SECOND.clone(),
  basePerClick: BASE_PER_CLICK.clone(),
  basePerSecond: BASE_PER_SECOND.clone(),
  gachaTickets: 0,
  bonusParticulesTickets: 0,
  upgrades: {},
  shopUnlocks: new Set(),
  elements: createInitialElementCollection(),
  fusions: createInitialFusionState(),
  fusionBonuses: createInitialFusionBonuses(),
  pageUnlocks: createInitialPageUnlockState(),
  theme: DEFAULT_THEME,
  stats: createInitialStats(),
  production: createEmptyProductionBreakdown(),
  productionBase: createEmptyProductionBreakdown(),
  crit: createDefaultCritState(),
  baseCrit: createDefaultCritState(),
  lastCritical: null,
  elementBonusSummary: {},
  trophies: new Set(),
  offlineGainMultiplier: MYTHIQUE_OFFLINE_BASE,
  offlineTickets: {
    secondsPerTicket: OFFLINE_TICKET_CONFIG.secondsPerTicket,
    capSeconds: OFFLINE_TICKET_CONFIG.capSeconds,
    progressSeconds: 0
  },
  ticketStarAutoCollect: null,
  ticketStarAverageIntervalSeconds: DEFAULT_TICKET_STAR_INTERVAL_SECONDS,
  ticketStarUnlocked: false,
  frenzySpawnBonus: { perClick: 1, perSecond: 1 },
  musicTrackId: null,
  musicVolume: DEFAULT_MUSIC_VOLUME,
  musicEnabled: DEFAULT_MUSIC_ENABLED,
  bigBangButtonVisible: false,
  apsCrit: createDefaultApsCritState()
};

applyFrenzySpawnChanceBonus(gameState.frenzySpawnBonus);

function ensureApsCritState() {
  if (!gameState.apsCrit || typeof gameState.apsCrit !== 'object') {
    gameState.apsCrit = createDefaultApsCritState();
    return gameState.apsCrit;
  }
  const state = gameState.apsCrit;
  if (!Array.isArray(state.effects)) {
    state.effects = [];
  }
  state.effects = state.effects
    .map(entry => normalizeApsCritEffect(entry))
    .filter(effect => effect != null);
  return state;
}

function getApsCritRemainingSeconds(state = ensureApsCritState()) {
  if (!state || !Array.isArray(state.effects) || !state.effects.length) {
    return 0;
  }
  return state.effects.reduce(
    (max, effect) => Math.max(max, Number(effect?.remainingSeconds) || 0),
    0
  );
}

function getApsCritMultiplier(state = ensureApsCritState()) {
  if (!state || !Array.isArray(state.effects) || !state.effects.length) {
    return 1;
  }
  const totalAdd = state.effects.reduce((sum, effect) => {
    const timeLeft = Number(effect?.remainingSeconds) || 0;
    if (timeLeft <= 0) {
      return sum;
    }
    const value = Number(effect?.multiplierAdd) || 0;
    if (value <= 0) {
      return sum;
    }
    return sum + value;
  }, 0);
  return totalAdd > 0 ? 1 + totalAdd : 1;
}

const DEVKIT_STATE = {
  isOpen: false,
  lastFocusedElement: null,
  cheats: {
    freeShop: false,
    freeGacha: false
  },
  bonuses: {
    autoFlat: LayeredNumber.zero()
  }
};

function isDevKitShopFree() {
  return DEVKIT_STATE.cheats.freeShop === true;
}

function isDevKitGachaFree() {
  return DEVKIT_STATE.cheats.freeGacha === true;
}

function getDevKitAutoFlatBonus() {
  return DEVKIT_STATE.bonuses.autoFlat instanceof LayeredNumber
    ? DEVKIT_STATE.bonuses.autoFlat
    : LayeredNumber.zero();
}

function setDevKitAutoFlatBonus(value) {
  DEVKIT_STATE.bonuses.autoFlat = value instanceof LayeredNumber
    ? value.clone()
    : new LayeredNumber(value || 0);
}

const UPGRADE_DEFS = Array.isArray(CONFIG.upgrades) ? CONFIG.upgrades : FALLBACK_UPGRADES;
const UPGRADE_NAME_MAP = new Map(UPGRADE_DEFS.map(def => [def.id, def.name || def.id]));
const UPGRADE_INDEX_MAP = new Map(UPGRADE_DEFS.map((def, index) => [def.id, index]));

const PRODUCTION_MULTIPLIER_SLOT_MAP = {
  perClick: new Map(),
  perSecond: new Map()
};

const PRODUCTION_MULTIPLIER_SLOT_FALLBACK = {
  perClick: 'shopBonus1',
  perSecond: 'shopBonus2'
};

const PRODUCTION_STEP_LABEL_OVERRIDES = {
  perClick: new Map([
    ['shopBonus1', 'Multiplicateurs APC'],
    ['shopBonus2', 'Amplifications APC']
  ]),
  perSecond: new Map([
    ['shopBonus1', 'Multiplicateurs APS'],
    ['shopBonus2', 'Amplifications APS']
  ])
};

const milestoneSource = Array.isArray(CONFIG.milestones) ? CONFIG.milestones : FALLBACK_MILESTONES;

const milestoneList = milestoneSource.map(entry => ({
  amount: toLayeredNumber(entry.amount, 0),
  text: entry.text
}));

function normalizeTrophyCondition(raw) {
  if (!raw || typeof raw !== 'object') {
    return { type: 'lifetimeAtoms', amount: toLayeredNumber(0, 0) };
  }
  const type = raw.type || raw.kind || (raw.frenzy ? 'frenzyTotal' : 'lifetimeAtoms');
  if (type === 'frenzyTotal' || type === 'frenzy') {
    const amount = Number(raw.amount ?? raw.value ?? 0);
    return {
      type: 'frenzyTotal',
      amount: Number.isFinite(amount) && amount > 0 ? Math.floor(amount) : 0
    };
  }
  if (
    type === 'collectionRarities'
    || type === 'rarityCollection'
    || type === 'collectionRarity'
    || type === 'rarityComplete'
  ) {
    const source = raw.rarities ?? raw.ids ?? raw.rarity ?? raw.id ?? [];
    const list = Array.isArray(source) ? source : [source];
    const rarities = Array.from(new Set(list
      .map(entry => (typeof entry === 'string' ? entry.trim() : ''))
      .filter(Boolean)));
    return {
      type: 'collectionRarities',
      rarities
    };
  }
  if (
    type === 'fusionSuccesses'
    || type === 'fusionSuccess'
    || type === 'fusionSet'
    || type === 'fusionGroup'
  ) {
    const source = raw.fusions ?? raw.ids ?? raw.id ?? raw.fusion ?? [];
    const list = Array.isArray(source) ? source : [source];
    const fusions = Array.from(new Set(list
      .map(entry => (typeof entry === 'string' ? entry.trim() : ''))
      .filter(Boolean)));
    return {
      type: 'fusionSuccesses',
      fusions
    };
  }
  const amount = toLayeredNumber(raw.amount ?? raw.value ?? 0, 0);
  return {
    type: 'lifetimeAtoms',
    amount
  };
}

function createTicketStarAutoCollectConfig(delaySeconds) {
  return { delaySeconds };
}

function normalizeTicketStarAutoCollectConfig(raw) {
  if (raw == null || raw === false) {
    return null;
  }
  if (raw === true) {
    return createTicketStarAutoCollectConfig(0);
  }
  const numericValue = coerceFiniteNumber(raw);
  if (numericValue != null) {
    return createTicketStarAutoCollectConfig(Math.max(0, numericValue));
  }
  if (typeof raw === 'object') {
    if (raw.enabled === false) {
      return null;
    }
    const value = raw.delaySeconds ?? raw.delay ?? raw.seconds ?? raw.value ?? raw.time;
    const delayValue = coerceFiniteNumber(value);
    const delaySeconds = Math.max(0, delayValue ?? 0);
    return createTicketStarAutoCollectConfig(delaySeconds);
  }
  return null;
}

function normalizeTrophyReward(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      multiplier: null,
      frenzyMaxStacks: null,
      description: null,
      trophyMultiplierAdd: 0,
      ticketStarAutoCollect: null
    };
  }
  let multiplier = null;
  if (raw.multiplier != null) {
    if (typeof raw.multiplier === 'number' || raw.multiplier instanceof LayeredNumber) {
      const value = toMultiplierLayered(raw.multiplier);
      multiplier = { perClick: value.clone(), perSecond: value.clone() };
    } else if (typeof raw.multiplier === 'object') {
      const globalRaw = raw.multiplier.global ?? raw.multiplier.all ?? raw.multiplier.total;
      const perClickRaw = raw.multiplier.perClick ?? raw.multiplier.click ?? null;
      const perSecondRaw = raw.multiplier.perSecond ?? raw.multiplier.auto ?? raw.multiplier.aps ?? null;
      const globalMult = globalRaw != null ? toMultiplierLayered(globalRaw) : null;
      const clickMult = perClickRaw != null ? toMultiplierLayered(perClickRaw) : null;
      const autoMult = perSecondRaw != null ? toMultiplierLayered(perSecondRaw) : null;
      multiplier = {
        perClick: clickMult ? clickMult.clone() : (globalMult ? globalMult.clone() : LayeredNumber.one()),
        perSecond: autoMult ? autoMult.clone() : (globalMult ? globalMult.clone() : LayeredNumber.one())
      };
      if (globalMult && !perClickRaw && !perSecondRaw) {
        multiplier.perClick = globalMult.clone();
        multiplier.perSecond = globalMult.clone();
      }
    }
  }
  const frenzyMaxStacksRaw = raw.frenzyMaxStacks ?? raw.frenzyStacks ?? raw.maxStacks;
  const frenzyMaxStacks = Number.isFinite(Number(frenzyMaxStacksRaw))
    ? Math.max(1, Math.floor(Number(frenzyMaxStacksRaw)))
    : null;
  const description = typeof raw.description === 'string' ? raw.description : null;
  const trophyBonusRaw =
    raw.trophyMultiplierAdd
    ?? raw.trophyMultiplierBonus
    ?? raw.trophyMultiplier
    ?? raw.trophyBonus
    ?? null;
  const trophyMultiplierAdd = Number.isFinite(Number(trophyBonusRaw))
    ? Math.max(0, Number(trophyBonusRaw))
    : 0;
  const autoCollectCandidate = raw.ticketStarAutoCollect
    ?? raw.autoCollectTicketStar
    ?? raw.ticketAutoCollect
    ?? raw.autoCollectTickets;
  const ticketStarAutoCollect = normalizeTicketStarAutoCollectConfig(autoCollectCandidate);
  return {
    multiplier,
    frenzyMaxStacks,
    description,
    trophyMultiplierAdd,
    ticketStarAutoCollect
  };
}

function normalizeTrophyDefinition(entry, index) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }
  const id = String(entry.id || entry.key || index).trim();
  if (!id) return null;
  const name = typeof entry.name === 'string' ? entry.name : id;
  const description = typeof entry.description === 'string' ? entry.description : '';
  const condition = normalizeTrophyCondition(entry.condition || entry.requirement || {});
  const reward = normalizeTrophyReward(entry.reward || entry.rewards || {});
  return {
    id,
    name,
    description,
    condition,
    reward,
    rewardText: reward.description || null,
    order: Number.isFinite(Number(entry.order)) ? Number(entry.order) : index
  };
}

const trophySource = Array.isArray(CONFIG.trophies) ? CONFIG.trophies : FALLBACK_TROPHIES;
const TROPHY_DEFS = trophySource
  .map((entry, index) => normalizeTrophyDefinition(entry, index))
  .filter(Boolean)
  .sort((a, b) => a.order - b.order);

const TROPHY_MAP = new Map(TROPHY_DEFS.map(def => [def.id, def]));
const BIG_BANG_TROPHY_ID = 'scaleObservableUniverse';
const ARCADE_TROPHY_ID = 'millionAtoms';
const INFO_TROPHY_ID = 'scaleSandGrain';
const LOCKABLE_PAGE_IDS = new Set(['gacha', 'tableau', 'fusion', 'info']);

function getPageUnlockState() {
  if (!gameState.pageUnlocks || typeof gameState.pageUnlocks !== 'object') {
    gameState.pageUnlocks = createInitialPageUnlockState();
  }
  return gameState.pageUnlocks;
}

function isPageUnlocked(pageId) {
  if (!LOCKABLE_PAGE_IDS.has(pageId)) {
    return true;
  }
  const unlocks = getPageUnlockState();
  return unlocks?.[pageId] === true;
}

function unlockPage(pageId, options = {}) {
  if (!LOCKABLE_PAGE_IDS.has(pageId)) {
    return false;
  }
  const unlocks = getPageUnlockState();
  if (unlocks[pageId] === true) {
    return false;
  }
  unlocks[pageId] = true;
  if (pageId === 'gacha') {
    resetTicketStarState({ reschedule: true });
    if (typeof ticketStarState === 'object' && ticketStarState) {
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      if (!Number.isFinite(ticketStarState.nextSpawnTime) || ticketStarState.nextSpawnTime === Number.POSITIVE_INFINITY) {
        ticketStarState.nextSpawnTime = now + computeTicketStarDelay();
      }
    }
  }
  if (!options.deferUI) {
    updatePageUnlockUI();
  }
  if (options.save !== false) {
    saveGame();
  }
  if (options.announce) {
    const message = typeof options.announce === 'string'
      ? options.announce
      : 'Nouvelle page débloquée !';
    showToast(message);
  }
  return true;
}

function evaluatePageUnlocks(options = {}) {
  const unlocks = getPageUnlockState();
  let changed = false;

  if (!unlocks.gacha) {
    const ticketCount = Math.max(0, Math.floor(Number(gameState.gachaTickets) || 0));
    if (ticketCount > 0) {
      changed = unlockPage('gacha', { save: false, deferUI: true }) || changed;
    } else {
      const hasElements = Object.values(gameState.elements || {}).some(entry => getElementLifetimeCount(entry) > 0);
      if (hasElements) {
        changed = unlockPage('gacha', { save: false, deferUI: true }) || changed;
      }
    }
  }

  if (!unlocks.tableau) {
    const hasDrawnElement = Object.values(gameState.elements || {}).some(entry => getElementLifetimeCount(entry) > 0);
    if (hasDrawnElement) {
      changed = unlockPage('tableau', { save: false, deferUI: true }) || changed;
    }
  }

  if (!unlocks.fusion) {
    if (isRarityCollectionComplete('commun') && isRarityCollectionComplete('essentiel')) {
      changed = unlockPage('fusion', { save: false, deferUI: true }) || changed;
    }
  }

  if (!unlocks.info) {
    if (getUnlockedTrophySet().has(INFO_TROPHY_ID)) {
      changed = unlockPage('info', { save: false, deferUI: true }) || changed;
    }
  }

  if (changed) {
    updatePageUnlockUI();
    if (options.save !== false) {
      saveGame();
    }
  } else if (!options.deferUI) {
    updatePageUnlockUI();
  }

  return changed;
}

const trophyCards = new Map();

function getUnlockedTrophySet() {
  if (gameState.trophies instanceof Set) {
    return gameState.trophies;
  }
  const list = Array.isArray(gameState.trophies) ? gameState.trophies : [];
  gameState.trophies = new Set(list);
  return gameState.trophies;
}

function getUnlockedTrophyIds() {
  return Array.from(getUnlockedTrophySet());
}

function getRarityCollectionTotals(rarityId) {
  if (!rarityId) {
    return { total: 0, owned: 0 };
  }
  const pool = gachaPools.get(rarityId);
  if (!Array.isArray(pool) || pool.length === 0) {
    return { total: Array.isArray(pool) ? pool.length : 0, owned: 0 };
  }
  let owned = 0;
  pool.forEach(elementId => {
    const entry = gameState.elements?.[elementId];
    if (hasElementLifetime(entry)) {
      owned += 1;
    }
  });
  return { total: pool.length, owned };
}

function isRarityCollectionComplete(rarityId) {
  const { total, owned } = getRarityCollectionTotals(rarityId);
  return total > 0 && owned >= total;
}

function getTotalFrenzyTriggers() {
  const stats = gameState.stats?.global;
  if (!stats) return 0;
  const total = Number(stats.frenzyTriggers?.total ?? 0);
  return Number.isFinite(total) ? total : 0;
}

function computeTrophyEffects() {
  const unlocked = getUnlockedTrophySet();
  let clickMultiplier = LayeredNumber.one();
  let autoMultiplier = LayeredNumber.one();
  let maxStacks = FRENZY_CONFIG.baseMaxStacks;
  const critAccumulator = createCritAccumulator();
  let trophyMultiplierBonus = 0;
  let ticketStarAutoCollect = null;

  unlocked.forEach(id => {
    const def = TROPHY_MAP.get(id);
    if (!def) return;
    const reward = def.reward;
    if (reward?.multiplier) {
      const clickMult = reward.multiplier.perClick instanceof LayeredNumber
        ? reward.multiplier.perClick
        : toMultiplierLayered(reward.multiplier.perClick ?? 1);
      const autoMult = reward.multiplier.perSecond instanceof LayeredNumber
        ? reward.multiplier.perSecond
        : toMultiplierLayered(reward.multiplier.perSecond ?? 1);
      if (!isLayeredOne(clickMult)) {
        clickMultiplier = clickMultiplier.multiply(clickMult);
      }
      if (!isLayeredOne(autoMult)) {
        autoMultiplier = autoMultiplier.multiply(autoMult);
      }
    }
    if (Number.isFinite(reward?.frenzyMaxStacks)) {
      maxStacks = Math.max(maxStacks, reward.frenzyMaxStacks);
    }
    let trophyBonus = reward?.trophyMultiplierAdd;
    if (trophyBonus instanceof LayeredNumber) {
      trophyBonus = trophyBonus.toNumber();
    } else if (trophyBonus != null) {
      trophyBonus = Number(trophyBonus);
    }
    if (Number.isFinite(trophyBonus) && trophyBonus > 0) {
      trophyMultiplierBonus += trophyBonus;
    }
    applyCritModifiersFromEffect(critAccumulator, reward);
    if (reward?.crit) {
      applyCritModifiersFromEffect(critAccumulator, reward.crit);
    }
    if (reward?.ticketStarAutoCollect) {
      const normalized = normalizeTicketStarAutoCollectConfig(reward.ticketStarAutoCollect);
      if (normalized) {
        if (!ticketStarAutoCollect || normalized.delaySeconds < ticketStarAutoCollect.delaySeconds) {
          ticketStarAutoCollect = normalized;
        }
      }
    }
  });

  if (trophyMultiplierBonus > 0) {
    const trophyMultiplierValue = toMultiplierLayered(1 + trophyMultiplierBonus);
    clickMultiplier = clickMultiplier.multiply(trophyMultiplierValue);
    autoMultiplier = autoMultiplier.multiply(trophyMultiplierValue);
  }

  const critEffect = finalizeCritEffect(critAccumulator);

  return { clickMultiplier, autoMultiplier, maxStacks, critEffect, ticketStarAutoCollect };
}

function getTrophyFrenzyCap() {
  let maxStacks = FRENZY_CONFIG.baseMaxStacks;
  getUnlockedTrophySet().forEach(id => {
    const def = TROPHY_MAP.get(id);
    if (!def?.reward) return;
    if (Number.isFinite(def.reward.frenzyMaxStacks)) {
      maxStacks = Math.max(maxStacks, def.reward.frenzyMaxStacks);
    }
  });
  return maxStacks;
}

function formatTrophyProgress(def) {
  const { condition } = def;
  if (condition.type === 'frenzyTotal') {
    const current = getTotalFrenzyTriggers();
    const target = condition.amount || 0;
    const clampedTarget = Math.max(1, target);
    const percent = Math.max(0, Math.min(1, current / clampedTarget));
    return {
      current,
      target,
      percent,
      displayCurrent: current.toLocaleString('fr-FR'),
      displayTarget: clampedTarget.toLocaleString('fr-FR')
    };
  }
  if (condition.type === 'collectionRarities') {
    const rarities = Array.isArray(condition.rarities) ? condition.rarities : [];
    let owned = 0;
    let total = 0;
    rarities.forEach(rarityId => {
      const totals = getRarityCollectionTotals(rarityId);
      owned += totals.owned;
      total += totals.total;
    });
    const percent = total > 0 ? Math.max(0, Math.min(1, owned / total)) : 0;
    return {
      current: owned,
      target: total,
      percent,
      displayCurrent: owned.toLocaleString('fr-FR'),
      displayTarget: total.toLocaleString('fr-FR')
    };
  }
  if (condition.type === 'fusionSuccesses') {
    const fusionIds = Array.isArray(condition.fusions) ? condition.fusions : [];
    const total = fusionIds.length;
    let completed = 0;
    fusionIds.forEach(fusionId => {
      if (getFusionSuccessCount(fusionId) > 0) {
        completed += 1;
      }
    });
    const percent = total > 0 ? Math.max(0, Math.min(1, completed / total)) : 0;
    return {
      current: completed,
      target: total,
      percent,
      displayCurrent: completed.toLocaleString('fr-FR'),
      displayTarget: total.toLocaleString('fr-FR')
    };
  }
  const current = gameState.lifetime;
  const target = condition.amount instanceof LayeredNumber
    ? condition.amount
    : toLayeredNumber(condition.amount, 0);
  let percent = 0;
  if (current instanceof LayeredNumber && target instanceof LayeredNumber) {
    if (current.compare(target) >= 0) {
      percent = 1;
    } else {
      const targetNumber = target.toNumber();
      const currentNumber = current.toNumber();
      if (Number.isFinite(targetNumber) && targetNumber > 0 && Number.isFinite(currentNumber)) {
        percent = Math.max(0, Math.min(1, currentNumber / targetNumber));
      }
    }
  }
  return {
    current,
    target,
    percent,
    displayCurrent: current.toString(),
    displayTarget: target.toString()
  };
}

function isTrophyConditionMet(def) {
  if (!def) return false;
  const { condition } = def;
  if (!condition) return false;
  if (condition.type === 'frenzyTotal') {
    return getTotalFrenzyTriggers() >= (condition.amount || 0);
  }
  if (condition.type === 'collectionRarities') {
    const rarities = Array.isArray(condition.rarities) ? condition.rarities : [];
    if (!rarities.length) {
      return false;
    }
    return rarities.every(rarityId => isRarityCollectionComplete(rarityId));
  }
  if (condition.type === 'fusionSuccesses') {
    const fusionIds = Array.isArray(condition.fusions) ? condition.fusions : [];
    if (!fusionIds.length) {
      return false;
    }
    return fusionIds.every(fusionId => getFusionSuccessCount(fusionId) > 0);
  }
  const target = condition.amount instanceof LayeredNumber
    ? condition.amount
    : toLayeredNumber(condition.amount, 0);
  return gameState.lifetime.compare(target) >= 0;
}

function unlockTrophy(def) {
  if (!def) return false;
  const unlocked = getUnlockedTrophySet();
  if (unlocked.has(def.id)) return false;
  unlocked.add(def.id);
  showToast(`Trophée débloqué : ${def.name} !`);
  recalcProduction();
  updateGoalsUI();
  updateBigBangVisibility();
  updateBrandPortalState({ animate: def.id === ARCADE_TROPHY_ID });
  evaluatePageUnlocks({ save: false });
  return true;
}

function evaluateTrophies() {
  let changed = false;
  TROPHY_DEFS.forEach(def => {
    if (!getUnlockedTrophySet().has(def.id) && isTrophyConditionMet(def)) {
      if (unlockTrophy(def)) {
        changed = true;
      }
    }
  });
  if (changed) {
    saveGame();
  }
}

const elements = {
  brandPortal: document.getElementById('brandPortal'),
  navButtons: document.querySelectorAll('.nav-button'),
  navGachaButton: document.querySelector('.nav-button[data-target="gacha"]'),
  navTableButton: document.querySelector('.nav-button[data-target="tableau"]'),
  navFusionButton: document.querySelector('.nav-button[data-target="fusion"]'),
  navInfoButton: document.querySelector('.nav-button[data-target="info"]'),
  navBigBangButton: document.getElementById('navBigBangButton'),
  pages: document.querySelectorAll('.page'),
  statusAtoms: document.getElementById('statusAtoms'),
  statusApc: document.getElementById('statusApc'),
  statusAps: document.getElementById('statusAps'),
  statusCrit: document.getElementById('statusCrit'),
  statusCritValue: document.getElementById('statusCritValue'),
  statusApsCrit: document.getElementById('statusApsCrit'),
  statusApsCritChrono: document.getElementById('statusApsCritChrono'),
  statusApsCritMultiplier: document.getElementById('statusApsCritMultiplier'),
  statusApcFrenzy: document.getElementById('statusApcFrenzy'),
  statusApsFrenzy: document.getElementById('statusApsFrenzy'),
  atomButton: document.getElementById('atomButton'),
  atomVisual: document.querySelector('.atom-visual'),
  frenzyLayer: document.getElementById('frenzyLayer'),
  ticketLayer: document.getElementById('ticketLayer'),
  starfield: document.querySelector('.starfield'),
  shopList: document.getElementById('shopList'),
  periodicTable: document.getElementById('periodicTable'),
  fusionList: document.getElementById('fusionList'),
  fusionLog: document.getElementById('fusionLog'),
  elementInfoPanel: document.getElementById('elementInfoPanel'),
  elementInfoPlaceholder: document.getElementById('elementInfoPlaceholder'),
  elementInfoContent: document.getElementById('elementInfoContent'),
  elementInfoNumber: document.getElementById('elementInfoNumber'),
  elementInfoSymbol: document.getElementById('elementInfoSymbol'),
  elementInfoName: document.getElementById('elementInfoName'),
  elementInfoCategory: document.getElementById('elementInfoCategory'),
  elementInfoOwnedCount: document.getElementById('elementInfoOwnedCount'),
  elementInfoCollection: document.getElementById('elementInfoCollection'),
  collectionProgress: document.getElementById('elementCollectionProgress'),
  nextMilestone: document.getElementById('nextMilestone'),
  goalsList: document.getElementById('goalsList'),
  goalsEmpty: document.getElementById('goalsEmpty'),
  gachaResult: document.getElementById('gachaResult'),
  gachaRarityList: document.getElementById('gachaRarityList'),
  gachaOwnedSummary: document.getElementById('gachaOwnedSummary'),
  gachaSunButton: document.getElementById('gachaSunButton'),
  gachaTicketCounter: document.getElementById('gachaTicketCounter'),
  gachaTicketModeButton: document.getElementById('gachaTicketModeButton'),
  gachaTicketModeLabel: document.getElementById('gachaTicketModeLabel'),
  gachaTicketValue: document.getElementById('gachaTicketValue'),
  gachaAnimation: document.getElementById('gachaAnimation'),
  gachaAnimationConfetti: document.getElementById('gachaAnimationConfetti'),
  gachaContinueHint: document.getElementById('gachaContinueHint'),
  arcadeReturnButton: document.getElementById('arcadeReturnButton'),
  arcadeTicketButton: document.getElementById('arcadeTicketButton'),
  arcadeTicketValue: document.getElementById('arcadeTicketValue'),
  arcadeBonusTicketDisplay: document.getElementById('arcadeBonusTicketDisplay'),
  arcadeBonusTicketValue: document.getElementById('arcadeBonusTicketValue'),
  arcadeCanvas: document.getElementById('arcadeGameCanvas'),
  arcadeParticleLayer: document.getElementById('arcadeParticleLayer'),
  arcadeOverlay: document.getElementById('arcadeOverlay'),
  arcadeOverlayMessage: document.getElementById('arcadeOverlayMessage'),
  arcadeOverlayButton: document.getElementById('arcadeOverlayButton'),
  arcadeLevelValue: document.getElementById('arcadeLevelValue'),
  arcadeLivesValue: document.getElementById('arcadeLivesValue'),
  arcadeScoreValue: document.getElementById('arcadeScoreValue'),
  arcadeComboMessage: document.getElementById('arcadeComboMessage'),
  metauxOpenButton: document.getElementById('metauxOpenButton'),
  metauxExitButton: document.getElementById('metauxExitButton'),
  metauxReturnButton: document.getElementById('metauxReturnButton'),
  metauxBoard: document.getElementById('metauxBoard'),
  metauxTimerValue: document.getElementById('metauxTimerValue'),
  metauxTimerFill: document.getElementById('metauxTimerFill'),
  metauxTimerMaxValue: document.getElementById('metauxTimerMaxValue'),
  metauxEndScreen: document.getElementById('metauxEndScreen'),
  metauxEndTimeValue: document.getElementById('metauxEndTimeValue'),
  metauxEndMatchesValue: document.getElementById('metauxEndMatchesValue'),
  metauxEndMatchList: document.getElementById('metauxEndMatchesList'),
  metauxReplayButton: document.getElementById('metauxReplayButton'),
  metauxLastComboValue: document.getElementById('metauxLastComboValue'),
  metauxBestComboValue: document.getElementById('metauxBestComboValue'),
  metauxTotalTilesValue: document.getElementById('metauxTotalTilesValue'),
  metauxReshufflesValue: document.getElementById('metauxReshufflesValue'),
  metauxMovesValue: document.getElementById('metauxMovesValue'),
  metauxMessage: document.getElementById('metauxMessage'),
  metauxReshuffleButton: document.getElementById('metauxReshuffleButton'),
  themeSelect: document.getElementById('themeSelect'),
  musicTrackSelect: document.getElementById('musicTrackSelect'),
  musicTrackStatus: document.getElementById('musicTrackStatus'),
  musicVolumeSlider: document.getElementById('musicVolumeSlider'),
  resetButton: document.getElementById('resetButton'),
  bigBangOptionCard: document.getElementById('bigBangOptionCard'),
  bigBangOptionToggle: document.getElementById('bigBangNavToggle'),
  infoApsBreakdown: document.getElementById('infoApsBreakdown'),
  infoApcBreakdown: document.getElementById('infoApcBreakdown'),
  infoSessionAtoms: document.getElementById('infoSessionAtoms'),
  infoSessionClicks: document.getElementById('infoSessionClicks'),
  infoSessionApcAtoms: document.getElementById('infoSessionApcAtoms'),
  infoSessionApsAtoms: document.getElementById('infoSessionApsAtoms'),
  infoSessionOfflineAtoms: document.getElementById('infoSessionOfflineAtoms'),
  infoSessionDuration: document.getElementById('infoSessionDuration'),
  infoGlobalAtoms: document.getElementById('infoGlobalAtoms'),
  infoGlobalClicks: document.getElementById('infoGlobalClicks'),
  infoGlobalApcAtoms: document.getElementById('infoGlobalApcAtoms'),
  infoGlobalApsAtoms: document.getElementById('infoGlobalApsAtoms'),
  infoGlobalOfflineAtoms: document.getElementById('infoGlobalOfflineAtoms'),
  infoGlobalDuration: document.getElementById('infoGlobalDuration'),
  infoBonusSubtitle: document.getElementById('infoBonusSubtitle'),
  infoElementBonuses: document.getElementById('infoElementBonuses'),
  infoShopBonuses: document.getElementById('infoShopBonuses'),
  critConfettiLayer: null,
  devkitOverlay: document.getElementById('devkitOverlay'),
  devkitPanel: document.getElementById('devkitPanel'),
  devkitClose: document.getElementById('devkitCloseButton'),
  devkitAtomsForm: document.getElementById('devkitAtomsForm'),
  devkitAtomsInput: document.getElementById('devkitAtomsInput'),
  devkitAutoForm: document.getElementById('devkitAutoForm'),
  devkitAutoInput: document.getElementById('devkitAutoInput'),
  devkitAutoStatus: document.getElementById('devkitAutoStatus'),
  devkitAutoReset: document.getElementById('devkitResetAuto'),
  devkitTicketsForm: document.getElementById('devkitTicketsForm'),
  devkitTicketsInput: document.getElementById('devkitTicketsInput'),
  devkitUnlockTrophies: document.getElementById('devkitUnlockTrophies'),
  devkitUnlockElements: document.getElementById('devkitUnlockElements'),
  devkitUnlockInfo: document.getElementById('devkitUnlockInfo'),
  devkitToggleShop: document.getElementById('devkitToggleShop'),
  devkitToggleGacha: document.getElementById('devkitToggleGacha')
};

function updatePageUnlockUI() {
  const unlocks = getPageUnlockState();
  const buttonConfig = [
    ['gacha', elements.navGachaButton],
    ['tableau', elements.navTableButton],
    ['fusion', elements.navFusionButton],
    ['info', elements.navInfoButton]
  ];

  buttonConfig.forEach(([pageId, button]) => {
    if (!button) {
      return;
    }
    const unlocked = unlocks?.[pageId] === true;
    button.hidden = !unlocked;
    button.setAttribute('aria-hidden', unlocked ? 'false' : 'true');
    button.disabled = !unlocked;
    button.setAttribute('aria-disabled', unlocked ? 'false' : 'true');
    if (!unlocked) {
      button.classList.remove('active');
    }
  });

  const activePage = document.body?.dataset?.activePage;
  if (activePage && !isPageUnlocked(activePage) && activePage !== 'game') {
    showPage('game');
  }
}

function isBigBangTrophyUnlocked() {
  return getUnlockedTrophySet().has(BIG_BANG_TROPHY_ID);
}

function updateBigBangVisibility() {
  const unlocked = isBigBangTrophyUnlocked();
  if (!unlocked && gameState.bigBangButtonVisible) {
    gameState.bigBangButtonVisible = false;
  }
  if (elements.bigBangOptionCard) {
    elements.bigBangOptionCard.hidden = !unlocked;
  }
  if (elements.bigBangOptionToggle) {
    elements.bigBangOptionToggle.disabled = !unlocked;
    elements.bigBangOptionToggle.checked = unlocked && gameState.bigBangButtonVisible === true;
  }
  const shouldShowButton = unlocked && gameState.bigBangButtonVisible === true;
  if (elements.navBigBangButton) {
    elements.navBigBangButton.toggleAttribute('hidden', !shouldShowButton);
    elements.navBigBangButton.setAttribute('aria-hidden', shouldShowButton ? 'false' : 'true');
  }
  if (!shouldShowButton && document.body && document.body.dataset.activePage === 'bigbang') {
    showPage('game');
  }
}

function isArcadeUnlocked() {
  return getUnlockedTrophySet().has(ARCADE_TROPHY_ID);
}

function triggerBrandPortalPulse() {
  if (!elements.brandPortal) {
    return;
  }
  elements.brandPortal.classList.add('brand--pulse');
  clearTimeout(triggerBrandPortalPulse.timeoutId);
  triggerBrandPortalPulse.timeoutId = setTimeout(() => {
    if (elements.brandPortal) {
      elements.brandPortal.classList.remove('brand--pulse');
    }
  }, 1600);
}

function updateArcadeTicketDisplay() {
  if (!elements.arcadeTicketValue) {
    return;
  }
  const available = Math.max(0, Math.floor(Number(gameState.gachaTickets) || 0));
  elements.arcadeTicketValue.textContent = formatTicketLabel(available);
  if (elements.arcadeTicketButton) {
    const label = formatTicketLabel(available);
    const gachaUnlocked = isPageUnlocked('gacha');
    elements.arcadeTicketButton.disabled = !gachaUnlocked;
    elements.arcadeTicketButton.setAttribute('aria-disabled', gachaUnlocked ? 'false' : 'true');
    if (gachaUnlocked) {
      elements.arcadeTicketButton.setAttribute('aria-label', `Ouvrir le portail Gacha (${label})`);
      elements.arcadeTicketButton.title = `Tickets disponibles : ${label}`;
    } else {
      elements.arcadeTicketButton.setAttribute('aria-label', 'Portail Gacha verrouillé');
      elements.arcadeTicketButton.title = 'Obtenez un ticket de tirage pour débloquer le portail Gacha';
    }
  }
  const bonusCount = Math.max(0, Math.floor(Number(gameState.bonusParticulesTickets) || 0));
  if (elements.arcadeBonusTicketValue) {
    elements.arcadeBonusTicketValue.textContent = bonusCount.toLocaleString('fr-FR');
  }
  if (elements.arcadeBonusTicketDisplay) {
    elements.arcadeBonusTicketDisplay.title = `Bonus Particules : ${formatBonusTicketLabel(bonusCount)}`;
    elements.arcadeBonusTicketDisplay.setAttribute('aria-label', `Bonus Particules : ${formatBonusTicketLabel(bonusCount)}`);
  }
}

function updateBrandPortalState(options = {}) {
  if (!elements.brandPortal) {
    return;
  }
  const unlocked = isArcadeUnlocked();
  elements.brandPortal.disabled = !unlocked;
  elements.brandPortal.setAttribute('aria-disabled', unlocked ? 'false' : 'true');
  elements.brandPortal.classList.toggle('brand--locked', !unlocked);
  elements.brandPortal.classList.toggle('brand--portal-ready', unlocked);
  if (!unlocked) {
    elements.brandPortal.classList.remove('brand--pulse');
    elements.brandPortal.dataset.portalReady = 'false';
    return;
  }
  elements.brandPortal.dataset.portalReady = 'true';
  updateArcadeTicketDisplay();
  if (options.animate) {
    triggerBrandPortalPulse();
  }
}

updateBigBangVisibility();

const soundEffects = (() => {
  const createSilentPool = () => ({ play: () => {} });
  if (typeof window === 'undefined' || typeof Audio === 'undefined') {
    return { pop: createSilentPool(), crit: createSilentPool() };
  }

  const updatePitchPreservation = (audio, shouldPreserve) => {
    const preserve = !!shouldPreserve;
    if ('preservesPitch' in audio) {
      audio.preservesPitch = preserve;
    }
    if ('mozPreservesPitch' in audio) {
      audio.mozPreservesPitch = preserve;
    }
    if ('webkitPreservesPitch' in audio) {
      audio.webkitPreservesPitch = preserve;
    }
  };

  const createSoundPool = (src, poolSize = 4) => {
    const size = Math.max(1, Math.floor(poolSize) || 1);
    const pool = Array.from({ length: size }, () => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audio.setAttribute('preload', 'auto');
      return audio;
    });
    let index = 0;
    return {
      play(playbackRate = 1) {
        const audio = pool[index];
        index = (index + 1) % pool.length;
        try {
          audio.currentTime = 0;
          if (audio.playbackRate !== playbackRate) {
            audio.playbackRate = playbackRate;
          }
          const shouldPreservePitch = Math.abs(playbackRate - 1) < 1e-3;
          updatePitchPreservation(audio, shouldPreservePitch);
          const playPromise = audio.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
          }
        } catch (error) {
          // Ignore playback issues (e.g. autoplay restrictions)
        }
      }
    };
  };

  const POP_SOUND_SRC = 'Assets/Sounds/pop.mp3';
  const CRIT_PLAYBACK_RATE = 1.35;

  const popPool = createSoundPool(POP_SOUND_SRC, 6);
  const critPool = createSoundPool(POP_SOUND_SRC, 3);

  const fallbackEffects = {
    pop: { play: () => popPool.play(1) },
    crit: { play: () => critPool.play(CRIT_PLAYBACK_RATE) }
  };

  if (typeof window !== 'undefined' && window.SoundDesignerBridge && typeof window.SoundDesignerBridge.createSoundEffects === 'function') {
    try {
      return window.SoundDesignerBridge.createSoundEffects(fallbackEffects);
    } catch (error) {
      // If the sound designer bridge fails we still fallback to audio pools.
    }
  }

  return fallbackEffects;
})();

const musicPlayer = (() => {
  const MUSIC_DIR = 'Assets/Music/';
  const SUPPORTED_EXTENSIONS = ['mp3', 'ogg', 'wav', 'webm', 'm4a'];
  const FALLBACK_TRACKS = [
    'Piste1.mp3',
    'Piste2.mp3',
    'Piste3.mp3',
    'Piste4.mp3',
    'Piste5.mp3',
    'Piste6.mp3'
  ];

  if (typeof window === 'undefined' || typeof Audio === 'undefined') {
    const resolved = Promise.resolve([]);
    let stubVolume = DEFAULT_MUSIC_VOLUME;
    return {
      init: options => {
        if (options && typeof options.volume === 'number') {
          stubVolume = clampMusicVolume(options.volume, stubVolume);
        }
        return resolved;
      },
      ready: () => resolved,
      getTracks: () => [],
      getCurrentTrack: () => null,
      getCurrentTrackId: () => null,
      getPlaybackState: () => 'unsupported',
      playTrackById: id => {
        const normalized = typeof id === 'string' ? id.trim().toLowerCase() : '';
        return !normalized || normalized === 'none';
      },
      stop: () => true,
      setVolume: value => {
        stubVolume = clampMusicVolume(value, stubVolume);
        return stubVolume;
      },
      getVolume: () => stubVolume,
      onChange: () => () => {},
      isAwaitingUserGesture: () => false
    };
  }

  let tracks = [];
  let audioElement = null;
  let currentIndex = -1;
  let readyPromise = null;
  let preferredTrackId = null;
  let awaitingUserGesture = true;
  let unlockListenersAttached = false;
  let volume = DEFAULT_MUSIC_VOLUME;
  const changeListeners = new Set();

  const formatDisplayName = fileName => {
    if (!fileName) {
      return '';
    }
    const segments = String(fileName).split('/').filter(Boolean);
    const lastSegment = segments.length ? segments[segments.length - 1] : String(fileName);
    const baseName = lastSegment
      .replace(/\.[^/.]+$/, '')
      .replace(/[_-]+/g, ' ')
      .trim();
    if (!baseName) {
      return lastSegment || fileName;
    }
    return baseName.replace(/\b\w/g, char => char.toUpperCase());
  };

  const sanitizeFileName = input => {
    if (!input || typeof input !== 'string') {
      return '';
    }
    let value = input.trim();
    if (!value) {
      return '';
    }
    try {
      value = decodeURIComponent(value);
    } catch (error) {
      // Ignore decoding issues and keep the original value.
    }
    value = value.replace(/^[./]+/, '');
    value = value.replace(/^Assets\/?Music\//i, '');
    value = value.replace(/^assets\/?music\//i, '');
    value = value.split(/[?#]/)[0];
    value = value.replace(/\\/g, '/');
    const parts = value
      .split('/')
      .map(part => part.trim())
      .filter(part => part && part !== '..');
    return parts.join('/');
  };

  const isSupportedFile = fileName => {
    const cleanName = sanitizeFileName(fileName);
    const segments = cleanName.split('.');
    if (segments.length <= 1) {
      return false;
    }
    const extension = segments.pop().toLowerCase();
    return SUPPORTED_EXTENSIONS.includes(extension);
  };

  const createTrack = (fileName, { placeholder = false } = {}) => {
    const cleanName = sanitizeFileName(fileName);
    if (!cleanName || !isSupportedFile(cleanName)) {
      return null;
    }
    const encodedPath = cleanName
      .split('/')
      .map(segment => encodeURIComponent(segment))
      .join('/');
    return {
      id: cleanName,
      filename: cleanName,
      src: `${MUSIC_DIR}${encodedPath}`,
      displayName: formatDisplayName(cleanName),
      placeholder
    };
  };

  const normalizeCandidate = entry => {
    if (!entry) {
      return '';
    }
    if (typeof entry === 'string') {
      return sanitizeFileName(entry);
    }
    if (typeof entry === 'object') {
      const candidate = entry.path
        ?? entry.src
        ?? entry.url
        ?? entry.file
        ?? entry.filename
        ?? entry.name;
      return typeof candidate === 'string' ? sanitizeFileName(candidate) : '';
    }
    return '';
  };

  const findIndexForId = id => {
    if (!id) {
      return -1;
    }
    const trimmed = typeof id === 'string' ? id.trim().toLowerCase() : '';
    const sanitized = sanitizeFileName(id).toLowerCase();
    const candidates = new Set([trimmed, sanitized]);
    const addBaseVariant = value => {
      if (value && value.includes('.')) {
        candidates.add(value.replace(/\.[^/.]+$/, ''));
      }
    };
    addBaseVariant(trimmed);
    addBaseVariant(sanitized);
    return tracks.findIndex(track => {
      const name = track.id?.toLowerCase?.() ?? '';
      const file = track.filename?.toLowerCase?.() ?? '';
      const src = track.src?.toLowerCase?.() ?? '';
      const base = track.filename?.split('/')?.pop()?.toLowerCase?.() ?? '';
      const display = track.displayName?.toLowerCase?.() ?? '';
      return (
        candidates.has(name)
        || candidates.has(file)
        || candidates.has(src)
        || candidates.has(base)
        || candidates.has(display)
      );
    });
  };

  const getPlaybackState = () => {
    if (!audioElement) {
      return 'idle';
    }
    if (audioElement.error) {
      return 'error';
    }
    if (audioElement.paused) {
      return audioElement.currentTime > 0 ? 'paused' : 'idle';
    }
    return 'playing';
  };

  const emitChange = type => {
    const payload = {
      type,
      tracks: tracks.map(track => ({ ...track })),
      currentTrack: tracks[currentIndex] ? { ...tracks[currentIndex] } : null,
      state: getPlaybackState(),
      awaitingUserGesture
    };
    changeListeners.forEach(listener => {
      try {
        listener(payload);
      } catch (error) {
        console.error('Music listener error', error);
      }
    });
  };

  const applyVolumeToAudio = () => {
    if (audioElement) {
      audioElement.volume = volume;
    }
  };

  const setVolumeValue = (value, { silent = false } = {}) => {
    const normalized = clampMusicVolume(value, volume);
    if (normalized === volume) {
      return volume;
    }
    volume = normalized;
    applyVolumeToAudio();
    if (!silent) {
      emitChange('volume');
    }
    return volume;
  };

  const getVolumeValue = () => volume;

  const getAudioElement = () => {
    if (!audioElement) {
      audioElement = new Audio();
      audioElement.loop = true;
      audioElement.preload = 'auto';
      audioElement.setAttribute('preload', 'auto');
      audioElement.volume = volume;
      audioElement.addEventListener('playing', () => {
        awaitingUserGesture = false;
        emitChange('state');
      });
      audioElement.addEventListener('pause', () => {
        emitChange('state');
      });
      audioElement.addEventListener('error', () => {
        emitChange('error');
      });
    }
    return audioElement;
  };

  const tryPlay = () => {
    const audio = getAudioElement();
    if (!audio.src) {
      return;
    }
    audio.volume = volume;
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }
  };

  const stop = ({ keepPreference = false, silent = false } = {}) => {
    let hadSource = false;
    if (audioElement) {
      try {
        audioElement.pause();
      } catch (error) {
        // Ignore pause issues.
      }
      try {
        if (audioElement.currentTime) {
          audioElement.currentTime = 0;
        }
      } catch (error) {
        // Ignore reset issues.
      }
      if (audioElement.src) {
        hadSource = true;
      }
      audioElement.removeAttribute('src');
      audioElement.src = '';
    }
    const wasPlaying = hadSource || currentIndex !== -1;
    currentIndex = -1;
    if (!keepPreference) {
      preferredTrackId = null;
    }
    if (!silent) {
      emitChange('stop');
    } else {
      emitChange('track');
    }
    return wasPlaying;
  };

  const playIndex = index => {
    if (!tracks.length) {
      currentIndex = -1;
      emitChange('track');
      return false;
    }
    const wrappedIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    const track = tracks[wrappedIndex];
    const audio = getAudioElement();
    if (audio.src !== track.src) {
      audio.src = track.src;
    }
    audio.currentTime = 0;
    audio.volume = volume;
    currentIndex = wrappedIndex;
    preferredTrackId = track.id;
    emitChange('track');
    tryPlay();
    return true;
  };

  const setupUnlockListeners = () => {
    if (unlockListenersAttached || typeof document === 'undefined') {
      return;
    }
    unlockListenersAttached = true;
    awaitingUserGesture = true;
    const unlock = () => {
      awaitingUserGesture = false;
      tryPlay();
    };
    document.addEventListener('pointerdown', unlock, { once: true, capture: false });
    document.addEventListener('keydown', unlock, { once: true, capture: false });
  };

  const loadJsonList = async fileName => {
    try {
      const response = await fetch(`${MUSIC_DIR}${fileName}`, { cache: 'no-store' });
      if (!response.ok) {
        return [];
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        return data;
      }
      if (data && Array.isArray(data.files)) {
        return data.files;
      }
      if (data && Array.isArray(data.tracks)) {
        return data.tracks;
      }
      return [];
    } catch (error) {
      return [];
    }
  };

  const loadDirectoryListing = async () => {
    try {
      const response = await fetch(MUSIC_DIR, { cache: 'no-store' });
      if (!response.ok) {
        return [];
      }
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await response.json();
        if (Array.isArray(data)) {
          return data;
        }
        if (data && Array.isArray(data.files)) {
          return data.files;
        }
        if (data && Array.isArray(data.tracks)) {
          return data.tracks;
        }
        return [];
      }
      const text = await response.text();
      const matches = Array.from(
        text.matchAll(/href="([^"?#]+\.(?:mp3|ogg|wav|webm|m4a))"/gi)
      );
      return matches.map(match => match[1]).filter(Boolean);
    } catch (error) {
      return [];
    }
  };

  const sortTrackList = list => {
    return list
      .slice()
      .sort((a, b) => {
        const nameA = (a?.displayName || a?.filename || '').toString();
        const nameB = (b?.displayName || b?.filename || '').toString();
        return nameA.localeCompare(nameB, undefined, { sensitivity: 'base' });
      });
  };

  const verifyTrackAvailability = async list => {
    const results = await Promise.all(
      list.map(async track => {
        if (!track || !track.placeholder) {
          return track;
        }
        if (typeof window !== 'undefined' && window.location?.protocol === 'file:') {
          return { ...track, placeholder: false };
        }
        try {
          const response = await fetch(track.src, { method: 'HEAD', cache: 'no-store' });
          if (response.ok) {
            return { ...track, placeholder: false };
          }
          if (response.status === 405) {
            const rangeResponse = await fetch(track.src, {
              method: 'GET',
              headers: { Range: 'bytes=0-0' },
              cache: 'no-store'
            });
            if (rangeResponse.ok) {
              return { ...track, placeholder: false };
            }
          }
        } catch (error) {
          try {
            const fallbackResponse = await fetch(track.src, {
              method: 'GET',
              headers: { Range: 'bytes=0-0' },
              cache: 'no-store'
            });
            if (fallbackResponse.ok) {
              return { ...track, placeholder: false };
            }
          } catch (innerError) {
            // Ignore network failures and keep placeholder flag.
          }
        }
        return track;
      })
    );
    return results;
  };

  const discoverTracks = async () => {
    const discovered = new Set();
    const pushCandidate = candidate => {
      const normalized = normalizeCandidate(candidate);
      if (!normalized || !isSupportedFile(normalized)) {
        return;
      }
      discovered.add(normalized);
    };

    for (const manifest of ['tracks.json', 'manifest.json', 'playlist.json', 'music.json', 'list.json']) {
      const entries = await loadJsonList(manifest);
      entries.forEach(pushCandidate);
      if (discovered.size > 0) {
        break;
      }
    }

    if (discovered.size === 0) {
      const listing = await loadDirectoryListing();
      listing.forEach(pushCandidate);
    }

    if (discovered.size > 0) {
      return Array.from(discovered)
        .map(name => createTrack(name))
        .filter(Boolean);
    }

    return FALLBACK_TRACKS.map(name => createTrack(name, { placeholder: true })).filter(Boolean);
  };

  const init = (options = {}) => {
    if (readyPromise) {
      if (typeof options.volume === 'number') {
        setVolumeValue(options.volume);
      }
      if (typeof options.preferredTrackId === 'string') {
        const trimmed = options.preferredTrackId.trim();
        if (!trimmed || ['none', 'off', 'stop'].includes(trimmed.toLowerCase())) {
          preferredTrackId = null;
          stop({ keepPreference: false });
        } else {
          preferredTrackId = sanitizeFileName(trimmed) || null;
          if (preferredTrackId && options.autoplay !== false) {
            const preferredIndex = findIndexForId(preferredTrackId);
            if (preferredIndex >= 0) {
              playIndex(preferredIndex);
            }
          } else if (options.autoplay === false) {
            stop({ keepPreference: Boolean(preferredTrackId) });
          }
        }
      } else if (options.autoplay === false) {
        stop({ keepPreference: Boolean(preferredTrackId) });
      }
      return readyPromise;
    }

    if (typeof options.volume === 'number') {
      setVolumeValue(options.volume, { silent: true });
    }

    if (typeof options.preferredTrackId === 'string') {
      const rawPreference = options.preferredTrackId.trim();
      if (!rawPreference || ['none', 'off', 'stop'].includes(rawPreference.toLowerCase())) {
        preferredTrackId = null;
      } else {
        preferredTrackId = sanitizeFileName(rawPreference);
        if (preferredTrackId && !preferredTrackId.trim()) {
          preferredTrackId = null;
        }
      }
    } else {
      preferredTrackId = null;
    }

    const autoplay = options?.autoplay !== false;

    setupUnlockListeners();

    readyPromise = discoverTracks()
      .then(async foundTracks => {
        const verified = await verifyTrackAvailability(foundTracks);
        tracks = sortTrackList(verified);
        emitChange('tracks');
        if (!tracks.length) {
          currentIndex = -1;
          emitChange('track');
          if (!autoplay) {
            stop({ keepPreference: Boolean(preferredTrackId) });
          }
          return tracks;
        }
        if (!autoplay) {
          stop({ keepPreference: Boolean(preferredTrackId) });
          return tracks;
        }
        const preferredIndex = preferredTrackId ? findIndexForId(preferredTrackId) : -1;
        const indexToPlay = preferredIndex >= 0
          ? preferredIndex
          : Math.floor(Math.random() * tracks.length);
        playIndex(indexToPlay);
        return tracks;
      })
      .catch(error => {
        console.error('Erreur de découverte des pistes musicales', error);
        const fallbackList = FALLBACK_TRACKS.map(name => createTrack(name, { placeholder: true })).filter(Boolean);
        return verifyTrackAvailability(fallbackList).then(verifiedFallback => {
          tracks = sortTrackList(verifiedFallback);
          emitChange('tracks');
          if (!tracks.length) {
            currentIndex = -1;
            emitChange('track');
            return tracks;
          }
          if (!autoplay) {
            stop({ keepPreference: Boolean(preferredTrackId) });
            return tracks;
          }
          const preferredIndex = preferredTrackId ? findIndexForId(preferredTrackId) : -1;
          playIndex(preferredIndex >= 0 ? preferredIndex : Math.floor(Math.random() * tracks.length));
          return tracks;
        });
      });

    return readyPromise;
  };

  const ready = () => {
    if (readyPromise) {
      return readyPromise;
    }
    return init();
  };

  const getTracks = () => tracks.map(track => ({ ...track }));

  const getCurrentTrack = () => {
    if (currentIndex < 0 || currentIndex >= tracks.length) {
      return null;
    }
    return { ...tracks[currentIndex] };
  };

  const getCurrentTrackId = () => {
    const current = getCurrentTrack();
    return current ? current.id : null;
  };

  const playTrackById = id => {
    const raw = typeof id === 'string' ? id.trim() : '';
    const normalized = raw.toLowerCase();
    if (!raw || normalized === 'none' || normalized === 'off' || normalized === 'stop') {
      stop({ keepPreference: false });
      return true;
    }
    const sanitized = sanitizeFileName(raw);
    if (!sanitized) {
      stop({ keepPreference: false });
      return true;
    }
    preferredTrackId = sanitized;
    if (!tracks.length) {
      emitChange('track');
      return false;
    }
    const index = findIndexForId(sanitized);
    if (index === -1) {
      emitChange('track');
      return false;
    }
    return playIndex(index);
  };

  const onChange = listener => {
    if (typeof listener !== 'function') {
      return () => {};
    }
    changeListeners.add(listener);
    return () => {
      changeListeners.delete(listener);
    };
  };

  return {
    init,
    ready,
    getTracks,
    getCurrentTrack,
    getCurrentTrackId,
    getPlaybackState,
    playTrackById,
    stop,
    setVolume: (value, options) => setVolumeValue(value, options || {}),
    getVolume: () => getVolumeValue(),
    onChange,
    isAwaitingUserGesture: () => awaitingUserGesture
  };
})();

function updateMusicSelectOptions() {
  const select = elements.musicTrackSelect;
  if (!select) {
    return;
  }
  const tracks = musicPlayer.getTracks();
  const current = musicPlayer.getCurrentTrack();
  const previousValue = select.value;
  select.innerHTML = '';
  if (!tracks.length) {
    const option = document.createElement('option');
    option.value = '';
    option.textContent = 'Aucune piste disponible';
    select.appendChild(option);
    select.disabled = true;
    return;
  }
  const noneOption = document.createElement('option');
  noneOption.value = '';
  noneOption.textContent = 'Rien (aucune musique)';
  select.appendChild(noneOption);
  tracks.forEach(track => {
    const option = document.createElement('option');
    option.value = track.id;
    option.textContent = track.placeholder
      ? `${track.displayName} (fichier manquant)`
      : track.displayName;
    option.dataset.placeholder = track.placeholder ? 'true' : 'false';
    select.appendChild(option);
  });
  let valueToSelect = current?.id || '';
  if (!valueToSelect && previousValue) {
    if (previousValue === '' || previousValue === 'none') {
      valueToSelect = '';
    } else if (tracks.some(track => track.id === previousValue)) {
      valueToSelect = previousValue;
    }
  }
  if (!valueToSelect
    && gameState.musicTrackId
    && gameState.musicEnabled !== false
    && tracks.some(track => track.id === gameState.musicTrackId)) {
    valueToSelect = gameState.musicTrackId;
  }
  select.value = valueToSelect;
  select.disabled = false;
}

function updateMusicStatus() {
  const status = elements.musicTrackStatus;
  if (!status) {
    return;
  }
  const tracks = musicPlayer.getTracks();
  if (!tracks.length) {
    status.textContent = 'Ajoutez vos fichiers audio dans Assets/Music pour activer la musique.';
    return;
  }
  const current = musicPlayer.getCurrentTrack();
  if (!current) {
    if (gameState.musicEnabled === false) {
      status.textContent = 'Musique désactivée.';
    } else {
      status.textContent = 'Sélectionnez une piste pour lancer la musique.';
    }
    return;
  }
  const playbackState = musicPlayer.getPlaybackState();
  let message = `Lecture en boucle : ${current.displayName}`;
  if (current.placeholder) {
    message += ' (fichier manquant)';
  }
  if (playbackState === 'unsupported') {
    message += '. Lecture audio indisponible sur cet appareil.';
  } else if (playbackState === 'error') {
    message += '. Impossible de lire le fichier audio.';
  } else if (musicPlayer.isAwaitingUserGesture()) {
    message += '. La musique démarre après votre première interaction.';
  } else if (playbackState === 'paused' || playbackState === 'idle') {
    message += '. Lecture en pause.';
  }
  status.textContent = message;
}

function updateMusicVolumeControl() {
  const slider = elements.musicVolumeSlider;
  if (!slider) {
    return;
  }
  const volume = typeof musicPlayer.getVolume === 'function'
    ? musicPlayer.getVolume()
    : DEFAULT_MUSIC_VOLUME;
  const clamped = Math.round(Math.min(100, Math.max(0, volume * 100)));
  slider.value = String(clamped);
  slider.setAttribute('aria-valuenow', String(clamped));
  slider.setAttribute('aria-valuetext', `${clamped}%`);
  slider.title = `Volume musique : ${clamped}%`;
  const playbackState = musicPlayer.getPlaybackState();
  slider.disabled = playbackState === 'unsupported';
}

function refreshMusicControls() {
  updateMusicSelectOptions();
  updateMusicStatus();
  updateMusicVolumeControl();
}

musicPlayer.onChange(event => {
  if (event?.currentTrack && event.currentTrack.id) {
    gameState.musicTrackId = event.currentTrack.id;
    gameState.musicEnabled = true;
  } else if (event?.type === 'stop') {
    gameState.musicTrackId = null;
    gameState.musicEnabled = false;
  } else if (Array.isArray(event?.tracks) && event.tracks.length === 0) {
    gameState.musicTrackId = null;
    gameState.musicEnabled = DEFAULT_MUSIC_ENABLED;
  }

  if (event?.type === 'volume') {
    gameState.musicVolume = musicPlayer.getVolume();
  }

  if (event?.type === 'tracks'
    || event?.type === 'track'
    || event?.type === 'state'
    || event?.type === 'error'
    || event?.type === 'volume'
    || event?.type === 'stop') {
    refreshMusicControls();
  }
});

const DEVKIT_AUTO_LABEL = 'DevKit (APS +)';

function parseDevKitLayeredInput(raw) {
  if (raw instanceof LayeredNumber) {
    return raw.clone();
  }
  if (raw == null) {
    return null;
  }
  const normalized = String(raw)
    .trim()
    .replace(/,/g, '.')
    .replace(/\s+/g, '');
  if (!normalized) {
    return null;
  }
  const powMatch = normalized.match(/^10\^([+-]?\d+)$/);
  if (powMatch) {
    const exponent = Number(powMatch[1]);
    if (Number.isFinite(exponent)) {
      return LayeredNumber.fromLayer0(1, exponent);
    }
  }
  const sciMatch = normalized.match(/^([+-]?\d+(?:\.\d+)?)e([+-]?\d+)$/i);
  if (sciMatch) {
    const mantissa = Number(sciMatch[1]);
    const exponent = Number(sciMatch[2]);
    if (Number.isFinite(mantissa) && Number.isFinite(exponent)) {
      return LayeredNumber.fromLayer0(mantissa, exponent);
    }
  }
  const numeric = Number(normalized);
  if (Number.isFinite(numeric)) {
    return new LayeredNumber(numeric);
  }
  return null;
}

function parseDevKitInteger(raw) {
  if (raw == null) {
    return null;
  }
  const normalized = String(raw)
    .trim()
    .replace(/\s+/g, '');
  if (!normalized) {
    return null;
  }
  const numeric = Number(normalized);
  if (!Number.isFinite(numeric)) {
    return null;
  }
  return Math.floor(numeric);
}

function updateDevKitUI() {
  if (elements.devkitAutoStatus) {
    const bonus = getDevKitAutoFlatBonus();
    const text = bonus instanceof LayeredNumber && !bonus.isZero()
      ? bonus.toString()
      : '0';
    elements.devkitAutoStatus.textContent = text;
  }
  if (elements.devkitToggleShop) {
    const active = isDevKitShopFree();
    elements.devkitToggleShop.dataset.active = active ? 'true' : 'false';
    elements.devkitToggleShop.setAttribute('aria-pressed', active ? 'true' : 'false');
    elements.devkitToggleShop.textContent = `Magasin gratuit : ${active ? 'activé' : 'désactivé'}`;
  }
  if (elements.devkitToggleGacha) {
    const active = isDevKitGachaFree();
    elements.devkitToggleGacha.dataset.active = active ? 'true' : 'false';
    elements.devkitToggleGacha.setAttribute('aria-pressed', active ? 'true' : 'false');
    elements.devkitToggleGacha.textContent = `Tirages gratuits : ${active ? 'activés' : 'désactivés'}`;
  }
  if (elements.devkitUnlockInfo) {
    const unlocked = isPageUnlocked('info');
    elements.devkitUnlockInfo.disabled = unlocked;
    elements.devkitUnlockInfo.setAttribute('aria-disabled', unlocked ? 'true' : 'false');
    elements.devkitUnlockInfo.textContent = unlocked
      ? 'Page Infos débloquée'
      : 'Débloquer la page Infos';
  }
}

function focusDevKitDefault() {
  const target = elements.devkitAtomsInput || elements.devkitPanel;
  if (!target) return;
  requestAnimationFrame(() => {
    try {
      target.focus({ preventScroll: true });
    } catch (error) {
      target.focus();
    }
  });
}

function openDevKit() {
  if (DEVKIT_STATE.isOpen || !elements.devkitOverlay) {
    return;
  }
  DEVKIT_STATE.isOpen = true;
  DEVKIT_STATE.lastFocusedElement = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;
  elements.devkitOverlay.hidden = false;
  elements.devkitOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('devkit-open');
  updateDevKitUI();
  focusDevKitDefault();
}

function closeDevKit() {
  if (!DEVKIT_STATE.isOpen || !elements.devkitOverlay) {
    return;
  }
  DEVKIT_STATE.isOpen = false;
  elements.devkitOverlay.hidden = true;
  elements.devkitOverlay.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('devkit-open');
  if (DEVKIT_STATE.lastFocusedElement && typeof DEVKIT_STATE.lastFocusedElement.focus === 'function') {
    DEVKIT_STATE.lastFocusedElement.focus();
  }
  DEVKIT_STATE.lastFocusedElement = null;
}

function toggleDevKit() {
  if (DEVKIT_STATE.isOpen) {
    closeDevKit();
  } else {
    openDevKit();
  }
}

function handleDevKitAtomsSubmission(value) {
  const amount = parseDevKitLayeredInput(value);
  if (!(amount instanceof LayeredNumber) || amount.isZero() || amount.sign <= 0) {
    showToast('Valeur d’atome invalide.');
    return;
  }
  gainAtoms(amount);
  updateUI();
  saveGame();
  updateDevKitUI();
  showToast(`DevKit : +${amount.toString()} atomes`);
}

function handleDevKitAutoSubmission(value) {
  const amount = parseDevKitLayeredInput(value);
  if (!(amount instanceof LayeredNumber) || amount.isZero() || amount.sign <= 0) {
    showToast('Bonus APS invalide.');
    return;
  }
  const nextBonus = getDevKitAutoFlatBonus().add(amount);
  setDevKitAutoFlatBonus(nextBonus);
  recalcProduction();
  updateUI();
  saveGame();
  updateDevKitUI();
  showToast(`DevKit : APS +${amount.toString()}`);
}

function resetDevKitAutoBonus() {
  if (getDevKitAutoFlatBonus().isZero()) {
    showToast('Aucun bonus APS à réinitialiser.');
    return;
  }
  setDevKitAutoFlatBonus(LayeredNumber.zero());
  recalcProduction();
  updateUI();
  saveGame();
  updateDevKitUI();
  showToast('DevKit : bonus APS remis à zéro');
}

function handleDevKitTicketSubmission(value) {
  const numeric = parseDevKitInteger(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    showToast('Nombre de tickets invalide.');
    return;
  }
  const gained = gainGachaTickets(numeric);
  updateUI();
  saveGame();
  showToast(gained === 1
    ? 'DevKit : 1 ticket de tirage ajouté'
    : `DevKit : ${gained} tickets de tirage ajoutés`);
}

function devkitUnlockAllTrophies() {
  const unlockedSet = getUnlockedTrophySet();
  let newlyUnlocked = 0;
  TROPHY_DEFS.forEach(def => {
    if (!unlockedSet.has(def.id)) {
      unlockedSet.add(def.id);
      newlyUnlocked += 1;
    }
  });
  if (newlyUnlocked > 0) {
    recalcProduction();
    updateUI();
    updateGoalsUI();
    evaluatePageUnlocks({ save: false });
    saveGame();
    showToast(`DevKit : ${newlyUnlocked} succès débloqués !`);
  } else {
    showToast('Tous les succès sont déjà débloqués.');
  }
}

function devkitUnlockAllElements() {
  let newlyOwned = 0;
  const baseCollection = createInitialElementCollection();
  periodicElements.forEach(def => {
    if (!def || !def.id) return;
    let entry = gameState.elements?.[def.id];
    if (!entry) {
      const baseEntry = baseCollection?.[def.id];
      entry = baseEntry
        ? {
            ...baseEntry,
            effects: Array.isArray(baseEntry.effects) ? [...baseEntry.effects] : [],
            bonuses: Array.isArray(baseEntry.bonuses) ? [...baseEntry.bonuses] : [],
            lifetime: getElementLifetimeCount(baseEntry)
          }
        : {
            id: def.id,
            gachaId: def.gachaId ?? def.id,
            rarity: elementRarityIndex.get(def.id) || null,
            effects: [],
            bonuses: [],
            lifetime: 0
          };
      entry.count = 1;
      entry.lifetime = Math.max(getElementLifetimeCount(entry), entry.count, 1);
      entry.owned = entry.lifetime > 0;
      gameState.elements[def.id] = entry;
      newlyOwned += 1;
      return;
    }
    const previouslyOwned = hasElementLifetime(entry);
    if (!previouslyOwned) {
      newlyOwned += 1;
    }
    const sanitizedCount = Math.max(1, getElementCurrentCount(entry));
    entry.count = sanitizedCount;
    const lifetimeCount = Math.max(getElementLifetimeCount(entry), sanitizedCount, 1);
    entry.lifetime = lifetimeCount;
    entry.owned = lifetimeCount > 0;
    if (!entry.rarity) {
      entry.rarity = elementRarityIndex.get(def.id) || entry.rarity || null;
    }
  });
  recalcProduction();
  updateUI();
  evaluateTrophies();
  evaluatePageUnlocks({ save: false });
  saveGame();
  updateDevKitUI();
  showToast(newlyOwned > 0
    ? `DevKit : ${newlyOwned} éléments ajoutés à la collection !`
    : 'La collection était déjà complète.');
}

function toggleDevKitCheat(key) {
  if (!(key in DEVKIT_STATE.cheats)) {
    return;
  }
  DEVKIT_STATE.cheats[key] = !DEVKIT_STATE.cheats[key];
  updateDevKitUI();
  if (key === 'freeShop') {
    updateShopAffordability();
    showToast(DEVKIT_STATE.cheats[key]
      ? 'DevKit : magasin gratuit activé'
      : 'DevKit : magasin gratuit désactivé');
  } else if (key === 'freeGacha') {
    updateGachaUI();
    showToast(DEVKIT_STATE.cheats[key]
      ? 'DevKit : tirages gratuits activés'
      : 'DevKit : tirages gratuits désactivés');
  }
}

const SHOP_PURCHASE_AMOUNTS = [1, 10, 100];
const shopRows = new Map();
let lastVisibleShopBonusIds = new Set();
const periodicCells = new Map();
let selectedElementId = null;
let gamePageVisibleSince = null;

function getShopUnlockSet() {
  let unlocks;
  if (gameState.shopUnlocks instanceof Set) {
    unlocks = new Set(gameState.shopUnlocks);
  } else {
    let stored = [];
    if (Array.isArray(gameState.shopUnlocks)) {
      stored = gameState.shopUnlocks;
    } else if (gameState.shopUnlocks && typeof gameState.shopUnlocks === 'object') {
      stored = Object.keys(gameState.shopUnlocks);
    }
    unlocks = new Set(stored);
  }

  if (!UPGRADE_DEFS.length) {
    unlocks.clear();
    gameState.shopUnlocks = unlocks;
    return unlocks;
  }

  const highestPurchasedIndex = UPGRADE_DEFS.reduce((highest, def, index) => {
    return getUpgradeLevel(gameState.upgrades, def.id) > 0 && index > highest ? index : highest;
  }, -1);

  const sequentialLimit = Math.min(
    UPGRADE_DEFS.length - 1,
    Math.max(0, highestPurchasedIndex + 1)
  );

  if (sequentialLimit >= 0) {
    for (let i = 0; i <= sequentialLimit; i += 1) {
      unlocks.add(UPGRADE_DEFS[i].id);
    }
    unlocks.forEach(id => {
      const index = UPGRADE_INDEX_MAP.get(id);
      if (index == null || index > sequentialLimit) {
        unlocks.delete(id);
      }
    });
  } else {
    unlocks.clear();
  }

  gameState.shopUnlocks = unlocks;
  return unlocks;
}

function formatAtomicMass(value) {
  if (value == null) return '';
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return '—';
    const text = value.toString();
    if (!text.includes('.')) {
      return text;
    }
    const [integer, fraction] = text.split('.');
    return `${integer},${fraction}`;
  }
  return String(value);
}

function formatMultiplier(value) {
  if (value instanceof LayeredNumber) {
    if (value.sign <= 0) {
      return '×—';
    }
    if (value.layer === 0 && Math.abs(value.exponent) < 6) {
      const numeric = value.toNumber();
      const options = { maximumFractionDigits: 2 };
      if (Math.abs(numeric) < 10) {
        options.minimumFractionDigits = 2;
      }
      return `×${numeric.toLocaleString('fr-FR', options)}`;
    }
    return `×${value.toString()}`;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return '×—';
  }
  if (Math.abs(numeric) < 1e6) {
    const options = { maximumFractionDigits: 2 };
    if (Math.abs(numeric) < 10) {
      options.minimumFractionDigits = 2;
    }
    return `×${numeric.toLocaleString('fr-FR', options)}`;
  }
  const layered = new LayeredNumber(numeric);
  if (layered.sign <= 0) {
    return '×—';
  }
  return `×${layered.toString()}`;
}

function formatDuration(ms) {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '0s';
  }
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);
  const parts = [];
  if (days > 0) {
    parts.push(`${days}j`);
  }
  if (hours > 0 || days > 0) {
    const hourStr = hours.toString().padStart(days > 0 ? 2 : 1, '0');
    parts.push(`${hourStr}h`);
  }
  const minuteStr = minutes.toString().padStart(hours > 0 || days > 0 ? 2 : 1, '0');
  parts.push(`${minuteStr}m`);
  parts.push(`${seconds.toString().padStart(2, '0')}s`);
  return parts.join(' ');
}

function updateElementInfoPanel(definition) {
  const panel = elements.elementInfoPanel;
  const placeholder = elements.elementInfoPlaceholder;
  const content = elements.elementInfoContent;
  if (!panel) return;

  if (!definition) {
    if (panel.dataset.category) {
      delete panel.dataset.category;
    }
    if (content) {
      content.hidden = true;
    }
    if (placeholder) {
      placeholder.hidden = false;
    }
    return;
  }

  if (definition.category) {
    panel.dataset.category = definition.category;
  } else if (panel.dataset.category) {
    delete panel.dataset.category;
  }

  if (placeholder) {
    placeholder.hidden = true;
  }
  if (content) {
    content.hidden = false;
  }

  if (elements.elementInfoNumber) {
    elements.elementInfoNumber.textContent =
      definition.atomicNumber != null ? definition.atomicNumber : '—';
  }
  if (elements.elementInfoSymbol) {
    elements.elementInfoSymbol.textContent = definition.symbol ?? '';
  }
  if (elements.elementInfoName) {
    elements.elementInfoName.textContent = definition.name ?? '';
  }
  if (elements.elementInfoCategory) {
    const label = definition.category
      ? CATEGORY_LABELS[definition.category] || definition.category
      : '—';
    elements.elementInfoCategory.textContent = label;
  }
  const entry = gameState.elements?.[definition.id];
  const count = getElementCurrentCount(entry);
  const lifetimeCount = getElementLifetimeCount(entry);
  if (elements.elementInfoOwnedCount) {
    const displayCount = count.toLocaleString('fr-FR');
    const lifetimeDisplay = lifetimeCount.toLocaleString('fr-FR');
    elements.elementInfoOwnedCount.textContent = displayCount;
    elements.elementInfoOwnedCount.setAttribute(
      'aria-label',
      `Copies actives\u00a0: ${displayCount}. Collectées au total\u00a0: ${lifetimeDisplay}`
    );
    const titleCountLabel = `${displayCount} copie${count > 1 ? 's' : ''} active${count > 1 ? 's' : ''}`;
    const titleLifetimeLabel = `${lifetimeDisplay} collectée${lifetimeCount > 1 ? 's' : ''} au total`;
    elements.elementInfoOwnedCount.setAttribute('title', `${titleCountLabel}\n${titleLifetimeLabel}`);
  }
  if (elements.elementInfoCollection) {
    const rarityId = entry?.rarity || elementRarityIndex.get(definition.id);
    const rarityDef = rarityId ? GACHA_RARITY_MAP.get(rarityId) : null;
    const rarityLabel = rarityDef?.label || rarityId || '—';
    const hasRarityLabel = Boolean(rarityLabel && rarityLabel !== '—');
    const bonusDetails = [];
    const seenDetailTexts = new Set();
    const addDetail = detail => {
      const normalized = normalizeCollectionDetailText(detail);
      if (!normalized) {
        return;
      }
      if (seenDetailTexts.has(normalized)) {
        return;
      }
      seenDetailTexts.add(normalized);
      bonusDetails.push(detail.trim());
    };
    if (rarityId) {
      const summaryStore = gameState.elementBonusSummary || {};
      const summary = summaryStore[rarityId];
      if (summary) {
        if (!COMPACT_COLLECTION_RARITIES.has(rarityId)) {
          const activeLabels = Array.isArray(summary.activeLabels) ? summary.activeLabels : [];
          activeLabels.forEach(raw => {
            if (raw == null) {
              return;
            }
            if (typeof raw === 'string') {
              const trimmed = raw.trim();
              if (!trimmed) {
                return;
              }
              const labelText = stripBonusLabelPrefix(trimmed, rarityLabel);
              const detail = labelText && labelText.trim() ? labelText.trim() : trimmed;
              addDetail(detail);
              return;
            }
            if (typeof raw === 'object') {
              const rawLabel = typeof raw.label === 'string' ? raw.label : '';
              const labelText = stripBonusLabelPrefix(rawLabel, rarityLabel) || rawLabel?.trim();
              const types = Array.isArray(raw.types) ? raw.types : [];
              const suppressEffects = types.some(type => (
                type === 'perCopy'
                || type === 'setBonus'
                || type === 'multiplier'
                || type === 'rarityMultiplier'
                || type === 'overflow'
              ));
              const descriptionParts = [];
              const seenDescriptions = new Set();
              const pushDescription = text => {
                const normalized = normalizeCollectionDetailText(text);
                if (!normalized || seenDescriptions.has(normalized)) {
                  return;
                }
                seenDescriptions.add(normalized);
                descriptionParts.push(text.trim());
              };
              if (typeof raw.description === 'string' && raw.description.trim()) {
                pushDescription(raw.description.trim());
              } else {
                if (!suppressEffects && Array.isArray(raw.effects)) {
                  raw.effects.forEach(effect => {
                    if (typeof effect === 'string' && effect.trim()) {
                      pushDescription(effect.trim());
                    }
                  });
                }
                if (Array.isArray(raw.notes)) {
                  raw.notes.forEach(note => {
                    if (typeof note === 'string' && note.trim()) {
                      pushDescription(note.trim());
                    }
                  });
                }
              }
              if (labelText && labelText.trim()) {
                const trimmedLabel = labelText.trim();
                if (descriptionParts.length) {
                  addDetail(`${trimmedLabel} : ${descriptionParts.join(' · ')}`);
                } else {
                  addDetail(trimmedLabel);
                }
              } else if (descriptionParts.length) {
                addDetail(descriptionParts.join(' · '));
              }
              return;
            }
          });
        }

        if (!bonusDetails.length) {
          const fallbackParts = [];
          const clickFlat = formatElementFlatBonus(summary.clickFlatTotal);
          if (clickFlat) {
            fallbackParts.push(`APC +${clickFlat}`);
          }
          const autoFlat = formatElementFlatBonus(summary.autoFlatTotal);
          if (autoFlat) {
            fallbackParts.push(`APS +${autoFlat}`);
          }
          const clickMult = formatElementMultiplierDisplay(summary.multiplierPerClick);
          if (clickMult) {
            fallbackParts.push(`APC ${clickMult}`);
          }
          const autoMult = formatElementMultiplierDisplay(summary.multiplierPerSecond);
          if (autoMult) {
            fallbackParts.push(`APS ${autoMult}`);
          }
          const critChance = formatElementCritChanceBonus(summary.critChanceAdd);
          if (critChance) {
            fallbackParts.push(`Chance critique +${critChance}`);
          }
          const critMult = formatElementCritMultiplierBonus(summary.critMultiplierAdd);
          if (critMult) {
            fallbackParts.push(`Dégâts critiques +${critMult}×`);
          }
          const ticketInterval = formatElementTicketInterval(summary.ticketIntervalSeconds);
          if (ticketInterval) {
            fallbackParts.push(ticketInterval);
          }
          const offlineMult = formatElementMultiplierDisplay(summary.offlineMultiplier);
          if (offlineMult && offlineMult !== '×1') {
            fallbackParts.push(`Gains hors-ligne ${offlineMult}`);
          }
          const frenzyMult = formatElementMultiplierDisplay(summary.frenzyChanceMultiplier);
          if (frenzyMult && frenzyMult !== '×1') {
            fallbackParts.push(`Chance de frénésie ${frenzyMult}`);
          }
          const overflowDuplicates = Number(summary.overflowDuplicates);
          if (Number.isFinite(overflowDuplicates) && overflowDuplicates > 0) {
            const overflowText = formatElementFlatBonus(overflowDuplicates);
            if (overflowText) {
              fallbackParts.push(`Bonus excédentaires +${overflowText}`);
            }
          }
          if (fallbackParts.length) {
            addDetail(fallbackParts.join(' · '));
          }
        }
      }
      const overview = getCollectionBonusOverview(rarityId);
      overview.forEach(addDetail);
    }

    if (!bonusDetails.length) {
      const overview = getCollectionBonusOverview(rarityId);
      if (overview.length) {
        bonusDetails.push(...overview);
      }
    }

    if (!bonusDetails.length && rarityDef?.description) {
      addDetail(rarityDef.description);
    }

    if (bonusDetails.length) {
      elements.elementInfoCollection.textContent = hasRarityLabel
        ? `${rarityLabel} · ${bonusDetails.join(' · ')}`
        : bonusDetails.join(' · ');
    } else {
      elements.elementInfoCollection.textContent = rarityLabel;
    }
  }
}

function selectPeriodicElement(id, { focus = false } = {}) {
  if (!id || !periodicElementIndex.has(id)) {
    selectedElementId = null;
    periodicCells.forEach(cell => {
      cell.classList.remove('is-selected');
      cell.setAttribute('aria-pressed', 'false');
    });
    updateElementInfoPanel(null);
    return;
  }

  selectedElementId = id;
  periodicCells.forEach((cell, elementId) => {
    const isSelected = elementId === id;
    cell.classList.toggle('is-selected', isSelected);
    cell.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
  });

  const definition = periodicElementIndex.get(id);
  updateElementInfoPanel(definition);

  if (focus) {
    const target = periodicCells.get(id);
    if (target) {
      target.focus();
    }
  }
}

function renderPeriodicTable() {
  if (!elements.periodicTable) return;
  const infoPanel = elements.elementInfoPanel;
  if (infoPanel) {
    infoPanel.remove();
  }

  elements.periodicTable.innerHTML = '';
  periodicCells.clear();

  if (infoPanel) {
    elements.periodicTable.appendChild(infoPanel);
  }

  if (!periodicElements.length) {
    const placeholder = document.createElement('p');
    placeholder.className = 'periodic-placeholder';
    placeholder.textContent = 'Le tableau périodique sera bientôt disponible.';
    elements.periodicTable.appendChild(placeholder);
    if (elements.collectionProgress) {
      elements.collectionProgress.textContent = 'Collection en préparation';
    }
    selectPeriodicElement(null);
    return;
  }

  const fragment = document.createDocumentFragment();
  periodicElements.forEach(def => {
    const cell = document.createElement('button');
    cell.type = 'button';
    cell.className = 'periodic-element';
    cell.dataset.elementId = def.id;
    cell.dataset.category = def.category ?? 'unknown';
    if (def.atomicNumber != null) {
      cell.dataset.atomicNumber = String(def.atomicNumber);
    }
    if (def.period != null) {
      cell.dataset.period = String(def.period);
    }
    if (def.group != null) {
      cell.dataset.group = String(def.group);
    }
    if (def.gachaId) {
      cell.dataset.gachaId = def.gachaId;
    }
    const rarityId = elementRarityIndex.get(def.id);
    if (rarityId) {
      cell.dataset.rarity = rarityId;
      const rarityDef = GACHA_RARITY_MAP.get(rarityId);
      if (rarityDef?.color) {
        cell.dataset.rarityColor = rarityDef.color;
      } else {
        delete cell.dataset.rarityColor;
      }
    } else {
      delete cell.dataset.rarityColor;
      cell.style.removeProperty('--rarity-color');
    }
    const { row, column } = def.position || {};
    if (column) {
      cell.style.gridColumn = String(column);
    }
    if (row) {
      cell.style.gridRow = String(row);
    }
    const massText = formatAtomicMass(def.atomicMass);
    const labelParts = [
      `${def.name} (${def.symbol})`,
      `numéro atomique ${def.atomicNumber}`
    ];
    if (massText) {
      labelParts.push(`masse atomique ${massText}`);
    }
    if (def.category) {
      const categoryLabel = CATEGORY_LABELS[def.category] || def.category;
      labelParts.push(`famille ${categoryLabel}`);
    }
    cell.setAttribute('aria-label', labelParts.join(', '));

    cell.innerHTML = `
      <span class="periodic-element__symbol">${def.symbol}</span>
      <span class="periodic-element__number">${def.atomicNumber}</span>
    `;
    cell.setAttribute('aria-pressed', 'false');
    cell.addEventListener('click', () => selectPeriodicElement(def.id));
    cell.addEventListener('focus', () => selectPeriodicElement(def.id));

    const state = gameState.elements[def.id];
    const isOwned = hasElementLifetime(state);
    applyPeriodicCellCollectionColor(cell, isOwned);
    if (isOwned) {
      cell.classList.add('is-owned');
    }

    periodicCells.set(def.id, cell);
    fragment.appendChild(cell);
  });

  elements.periodicTable.appendChild(fragment);
  if (selectedElementId && periodicCells.has(selectedElementId)) {
    selectPeriodicElement(selectedElementId);
  } else if (periodicElements.length) {
    selectPeriodicElement(periodicElements[0].id);
  } else {
    selectPeriodicElement(null);
  }
  updateCollectionDisplay();
}

function updateCollectionDisplay() {
  const elementEntries = Object.values(gameState.elements || {});
  const ownedCount = elementEntries.reduce((total, entry) => {
    return total + (hasElementLifetime(entry) ? 1 : 0);
  }, 0);
  const total = TOTAL_ELEMENT_COUNT || elementEntries.length;

  if (elements.collectionProgress) {
    if (total > 0) {
      elements.collectionProgress.textContent = `Collection\u00a0: ${ownedCount} / ${total} éléments`;
    } else {
      elements.collectionProgress.textContent = 'Collection en préparation';
    }
  }

  if (elements.gachaOwnedSummary) {
    if (total > 0) {
      const ratio = (ownedCount / total) * 100;
      const formatted = ratio >= 99.95
        ? '100'
        : ratio >= 10
          ? ratio.toFixed(1).replace('.', ',')
          : ratio.toFixed(2).replace('.', ',');
      elements.gachaOwnedSummary.textContent = `Collection\u00a0: ${ownedCount} / ${total} éléments (${formatted}\u00a0%)`;
    } else {
      elements.gachaOwnedSummary.textContent = 'Collection en préparation';
    }
  }

  periodicCells.forEach((cell, id) => {
    const entry = gameState.elements?.[id];
    const isOwned = hasElementLifetime(entry);
    cell.classList.toggle('is-owned', isOwned);
    applyPeriodicCellCollectionColor(cell, isOwned);
  });

  if (selectedElementId && periodicElementIndex.has(selectedElementId)) {
    updateElementInfoPanel(periodicElementIndex.get(selectedElementId));
  }

  updateGachaRarityProgress();
}

function toLayeredValue(value, fallback = 0) {
  if (value instanceof LayeredNumber) return value;
  if (value == null) return new LayeredNumber(fallback);
  return new LayeredNumber(value);
}

function normalizeProductionUnit(value, options = {}) {
  const minimum = Math.max(1, Number(options.minimum) || 1);
  const layered = value instanceof LayeredNumber ? value.clone() : new LayeredNumber(value);
  if (layered.isZero() || layered.sign <= 0) {
    return LayeredNumber.zero();
  }
  if (layered.layer > 0) {
    return layered;
  }
  if (layered.exponent < 0) {
    return new LayeredNumber(minimum);
  }
  if (layered.exponent <= 14) {
    const numeric = layered.mantissa * Math.pow(10, layered.exponent);
    const rounded = Math.max(minimum, Math.round(numeric));
    return new LayeredNumber(rounded);
  }
  return layered;
}

function toMultiplierLayered(value) {
  if (value instanceof LayeredNumber) {
    return value.clone();
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return LayeredNumber.one();
  }
  return new LayeredNumber(numeric);
}

function isLayeredOne(value) {
  if (value instanceof LayeredNumber) {
    return value.compare(LayeredNumber.one()) === 0;
  }
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return false;
  }
  return Math.abs(numeric - 1) <= LayeredNumber.EPSILON;
}

function getFlatSourceValue(entry, key) {
  if (!entry || !entry.sources || !entry.sources.flats) {
    return LayeredNumber.zero();
  }
  const raw = entry.sources.flats[key];
  if (raw instanceof LayeredNumber) {
    return raw;
  }
  if (raw == null) {
    return LayeredNumber.zero();
  }
  return new LayeredNumber(raw);
}

function getMultiplierSourceValue(entry, step) {
  if (!entry || !entry.sources || !entry.sources.multipliers) {
    return LayeredNumber.one();
  }
  const multipliers = entry.sources.multipliers;
  if (step.source === 'rarityMultiplier') {
    const store = multipliers.rarityMultipliers;
    if (!store) return LayeredNumber.one();
    if (store instanceof Map) {
      const raw = store.get(step.rarityId);
      const numeric = Number(raw);
      return Number.isFinite(numeric) && numeric > 0
        ? new LayeredNumber(numeric)
        : LayeredNumber.one();
    }
    if (typeof store === 'object' && store !== null) {
      const raw = store[step.rarityId];
      const numeric = Number(raw);
      return Number.isFinite(numeric) && numeric > 0
        ? new LayeredNumber(numeric)
        : LayeredNumber.one();
    }
    return LayeredNumber.one();
  }
  const raw = multipliers[step.source];
  if (raw instanceof LayeredNumber) {
    return raw;
  }
  if (raw == null) {
    return LayeredNumber.one();
  }
  return toMultiplierLayered(raw);
}

function formatFlatValue(value) {
  const layered = value instanceof LayeredNumber ? value : toLayeredValue(value, 0);
  const normalized = normalizeProductionUnit(layered);
  return normalized.isZero() ? '+0' : `+${normalized.toString()}`;
}

function formatProductionStepValue(step, entry) {
  if (!step) return '—';
  switch (step.type) {
    case 'base': {
      const baseValue = entry && entry.base != null
        ? normalizeProductionUnit(entry.base)
        : LayeredNumber.zero();
      return baseValue.toString();
    }
    case 'flat': {
      const flatValue = getFlatSourceValue(entry, step.source);
      return formatFlatValue(flatValue);
    }
    case 'multiplier': {
      const multiplier = getMultiplierSourceValue(entry, step);
      return formatMultiplier(multiplier);
    }
    case 'total': {
      const totalValue = entry && entry.total != null
        ? normalizeProductionUnit(entry.total)
        : LayeredNumber.zero();
      return totalValue.toString();
    }
    default:
      return '—';
  }
}

function getProductionStepLabel(step, context) {
  if (!step) return '';
  if (!context) {
    return step.label;
  }
  const overrides = PRODUCTION_STEP_LABEL_OVERRIDES[context];
  if (overrides && overrides.has(step.id)) {
    return overrides.get(step.id);
  }
  return step.label;
}

function renderProductionBreakdown(container, entry, context = null) {
  if (!container) return;
  container.innerHTML = '';
  PRODUCTION_STEP_ORDER.forEach(step => {
    const row = document.createElement('li');
    row.className = `production-breakdown__row production-breakdown__row--${step.type}`;
    row.dataset.step = step.id;

    const label = document.createElement('span');
    label.className = 'production-breakdown__label';
    label.textContent = getProductionStepLabel(step, context);

    const value = document.createElement('span');
    value.className = 'production-breakdown__value';
    value.textContent = formatProductionStepValue(step, entry);

    row.append(label, value);
    container.appendChild(row);
  });
}

let toastElement = null;
let apsCritPulseTimeoutId = null;

const APS_CRIT_TIMER_EPSILON = 1e-3;

function hasActiveApsCritEffect(state = ensureApsCritState()) {
  if (!state || !Array.isArray(state.effects) || !state.effects.length) {
    return false;
  }
  return state.effects.some(effect => {
    if (!effect) {
      return false;
    }
    const remaining = Number(effect.remainingSeconds) || 0;
    const value = Number(effect.multiplierAdd) || 0;
    return remaining > APS_CRIT_TIMER_EPSILON && value > 0;
  });
}

function updateApsCritTimer(deltaSeconds) {
  if (!Number.isFinite(deltaSeconds) || deltaSeconds <= 0) {
    return;
  }
  const state = ensureApsCritState();
  if (!state.effects.length) {
    return;
  }
  const previousMultiplier = getApsCritMultiplier(state);
  state.effects = state.effects
    .map(effect => {
      if (!effect) {
        return null;
      }
      const remaining = Number(effect.remainingSeconds) || 0;
      if (remaining <= 0) {
        return null;
      }
      const next = remaining - deltaSeconds;
      if (next <= APS_CRIT_TIMER_EPSILON) {
        return null;
      }
      return {
        multiplierAdd: Number(effect.multiplierAdd) || 0,
        remainingSeconds: next
      };
    })
    .filter(effect => effect != null);
  if (!state.effects.length) {
    if (previousMultiplier !== 1) {
      recalcProduction();
    }
    updateUI();
    return;
  }
  const currentMultiplier = getApsCritMultiplier(state);
  if (currentMultiplier !== previousMultiplier) {
    recalcProduction();
    updateUI();
  }
}

const CLICK_WINDOW_MS = CONFIG.presentation?.clicks?.windowMs ?? 1000;
const MAX_CLICKS_PER_SECOND = CONFIG.presentation?.clicks?.maxClicksPerSecond ?? 20;
const clickHistory = [];
let targetClickStrength = 0;
let displayedClickStrength = 0;

const atomAnimationState = {
  intensity: 0,
  posX: 0,
  posY: 0,
  velX: 0,
  velY: 0,
  tilt: 0,
  tiltVelocity: 0,
  squash: 0,
  squashVelocity: 0,
  spinPhase: Math.random() * Math.PI * 2,
  noisePhase: Math.random() * Math.PI * 2,
  noiseOffset: Math.random() * Math.PI * 2,
  impulseTimer: 0,
  lastInputIntensity: 0,
  lastTime: null
};

const ATOM_REBOUND_AMPLITUDE_SCALE = 0.5;

function getAtomVisualElement() {
  const current = elements.atomVisual;
  if (current?.isConnected) {
    return current;
  }

  let resolved = null;
  if (elements.atomButton?.isConnected) {
    resolved = elements.atomButton.querySelector('.atom-visual');
  }
  if (!resolved) {
    resolved = document.querySelector('.atom-visual');
  }

  if (resolved) {
    elements.atomVisual = resolved;
  }

  return resolved;
}

function isGamePageActive() {
  return document.body.dataset.activePage === 'game';
}

function updateClickHistory(now = performance.now()) {
  while (clickHistory.length && now - clickHistory[0] > CLICK_WINDOW_MS) {
    clickHistory.shift();
  }
  const count = clickHistory.length;
  if (count === 0) {
    targetClickStrength = 0;
    return;
  }

  let rawRate = 0;
  if (count === 1) {
    const timeSince = now - clickHistory[0];
    const safeSpan = Math.max(780, Math.min(CLICK_WINDOW_MS, timeSince));
    rawRate = 1000 / safeSpan;
  } else {
    const span = Math.max(140, Math.min(CLICK_WINDOW_MS, clickHistory[count - 1] - clickHistory[0]));
    rawRate = (count - 1) / (span / 1000);
    const windowAverage = count / (CLICK_WINDOW_MS / 1000);
    if (windowAverage > rawRate) {
      rawRate = windowAverage;
    }
  }

  rawRate = Math.min(rawRate, MAX_CLICKS_PER_SECOND * 1.6);
  const normalized = Math.max(0, Math.min(1, rawRate / MAX_CLICKS_PER_SECOND));
  const curved = 1 - Math.exp(-normalized * 3.8);
  targetClickStrength = Math.min(1, curved * 1.08);
}

const glowStops = [
  { stop: 0, color: [248, 226, 158] },
  { stop: 0.35, color: [255, 202, 112] },
  { stop: 0.65, color: [255, 130, 54] },
  { stop: 1, color: [255, 46, 18] }
];

function interpolateGlowColor(strength) {
  const clamped = Math.max(0, Math.min(1, strength));
  for (let i = 0; i < glowStops.length - 1; i += 1) {
    const current = glowStops[i];
    const next = glowStops[i + 1];
    if (clamped <= next.stop) {
      const range = next.stop - current.stop;
      const t = range === 0 ? 0 : (clamped - current.stop) / range;
      const r = Math.round(current.color[0] + (next.color[0] - current.color[0]) * t);
      const g = Math.round(current.color[1] + (next.color[1] - current.color[1]) * t);
      const b = Math.round(current.color[2] + (next.color[2] - current.color[2]) * t);
      return `${r}, ${g}, ${b}`;
    }
  }
  const last = glowStops[glowStops.length - 1];
  return `${last.color[0]}, ${last.color[1]}, ${last.color[2]}`;
}

function applyClickStrength(strength) {
  if (!elements.atomButton) return;
  const clamped = Math.max(0, Math.min(1, strength));
  const heat = Math.pow(clamped, 0.35);
  const button = elements.atomButton;
  button.style.setProperty('--glow-strength', heat.toFixed(3));
  button.style.setProperty('--glow-color', interpolateGlowColor(heat));
  if (clamped > 0.01) {
    button.classList.add('is-active');
  } else {
    button.classList.remove('is-active');
  }
}

function injectAtomImpulse(now = performance.now()) {
  if (!getAtomVisualElement()) return;
  const state = atomAnimationState;
  if (state.lastTime == null) {
    state.lastTime = now;
  }

  const drive = Math.max(targetClickStrength, displayedClickStrength, 0);
  const baseIntensity = Math.max(state.intensity, drive);
  const energy = Math.pow(Math.max(0, baseIntensity), 0.6);
  const impulseAngle = Math.random() * Math.PI * 2;
  const impulseStrength = 180 + energy * 520;

  state.velX += Math.cos(impulseAngle) * impulseStrength;
  state.velY += Math.sin(impulseAngle) * impulseStrength;

  const recenter = 20 + energy * 60;
  state.velX += -state.posX * recenter;
  state.velY += -state.posY * recenter * 1.05;

  const wobbleKick = (Math.random() - 0.5) * (220 + energy * 320);
  state.tiltVelocity += wobbleKick;
  state.squashVelocity += (Math.random() - 0.35) * (160 + energy * 220);

  state.spinPhase += (Math.random() - 0.5) * (0.45 + energy * 1.2);
  state.noiseOffset = Math.random() * Math.PI * 2;

  state.intensity = Math.min(1, baseIntensity + 0.25 + drive * 0.4);
  state.impulseTimer = Math.min(state.impulseTimer, 0.06);
}

function updateAtomSpring(now = performance.now(), drive = 0) {
  const visual = getAtomVisualElement();
  if (!visual) return;
  const state = atomAnimationState;
  if (state.lastTime == null) {
    state.lastTime = now;
  }

  let delta = (now - state.lastTime) / 1000;
  if (!Number.isFinite(delta) || delta < 0) {
    delta = 0;
  }
  delta = Math.min(delta, 0.05);
  state.lastTime = now;

  const input = Math.max(0, Math.min(1, drive));
  state.intensity += (input - state.intensity) * Math.min(1, delta * 9);
  const intensity = state.intensity;
  const energy = Math.pow(intensity, 0.65);

  const rangeX = 6 + energy * 34 + intensity * 6;
  const rangeY = 7 + energy * 40 + intensity * 8;
  const centerPull = 10 + energy * 24;
  const damping = 4.8 + energy * 16;
  const maxSpeed = 120 + energy * 420;

  state.velX -= (state.posX / Math.max(rangeX, 1)) * centerPull * delta;
  state.velY -= (state.posY / Math.max(rangeY, 1)) * centerPull * delta;

  state.velX -= state.velX * damping * delta;
  state.velY -= state.velY * damping * delta;

  state.noisePhase += delta * (1.2 + energy * 6.4);
  const noiseX =
    Math.sin(state.noisePhase * 1.35 + state.noiseOffset) * (0.34 + energy * 0.9) +
    Math.cos(state.noisePhase * 2.35 + state.noiseOffset * 1.7) * (0.22 + energy * 0.55);
  const noiseY =
    Math.cos(state.noisePhase * 1.55 + state.noiseOffset * 0.4) * (0.32 + energy * 0.82) +
    Math.sin(state.noisePhase * 2.1 + state.noiseOffset) * (0.2 + energy * 0.5);
  const noiseStrength = 12 + energy * 210 + intensity * 30;
  state.velX += noiseX * noiseStrength * delta;
  state.velY += noiseY * noiseStrength * delta;

  state.impulseTimer -= delta;
  const impulseDelay = Math.max(0.085, 0.42 - energy * 0.32 - intensity * 0.1);
  if (state.impulseTimer <= 0) {
    const burstAngle = Math.random() * Math.PI * 2;
    const burstStrength = 16 + energy * 240 + intensity * 120;
    state.velX += Math.cos(burstAngle) * burstStrength;
    state.velY += Math.sin(burstAngle) * burstStrength;
    state.impulseTimer = impulseDelay;
  }

  const gain = Math.max(0, input - state.lastInputIntensity);
  if (gain > 0.001) {
    const gainAngle = Math.random() * Math.PI * 2;
    const gainStrength = 38 + gain * 480 + intensity * 140;
    state.velX += Math.cos(gainAngle) * gainStrength;
    state.velY += Math.sin(gainAngle) * gainStrength;
  }
  state.lastInputIntensity = input;

  state.posX += state.velX * delta;
  state.posY += state.velY * delta;

  const restitution = 0.46 + energy * 0.42;
  if (state.posX > rangeX) {
    state.posX = rangeX;
    state.velX = -Math.abs(state.velX) * restitution;
  } else if (state.posX < -rangeX) {
    state.posX = -rangeX;
    state.velX = Math.abs(state.velX) * restitution;
  }
  if (state.posY > rangeY) {
    state.posY = rangeY;
    state.velY = -Math.abs(state.velY) * restitution;
  } else if (state.posY < -rangeY) {
    state.posY = -rangeY;
    state.velY = Math.abs(state.velY) * restitution;
  }

  const speed = Math.hypot(state.velX, state.velY);
  if (speed > maxSpeed) {
    const scale = maxSpeed / speed;
    state.velX *= scale;
    state.velY *= scale;
  }

  state.spinPhase += delta * (2.4 + energy * 14.5);
  if (!Number.isFinite(state.spinPhase)) state.spinPhase = 0;
  if (!Number.isFinite(state.noisePhase)) state.noisePhase = 0;
  if (state.spinPhase > Math.PI * 1000) state.spinPhase %= Math.PI * 2;
  if (state.noisePhase > Math.PI * 1000) state.noisePhase %= Math.PI * 2;

  const spin = Math.sin(state.spinPhase) * (4 + energy * 28);

  const tiltTarget =
    (state.posX / Math.max(rangeX, 1)) * (10 + energy * 18) +
    (state.velX / Math.max(maxSpeed, 1)) * (34 + energy * 30);
  const tiltSpring = 24 + energy * 32;
  const tiltDamping = 7 + energy * 14;
  state.tiltVelocity += (tiltTarget - state.tilt) * tiltSpring * delta;
  state.tiltVelocity -= state.tiltVelocity * tiltDamping * delta;
  state.tilt += state.tiltVelocity * delta;

  const verticalMomentum = state.velY / Math.max(maxSpeed, 1);
  const squashTarget = Math.max(-1, Math.min(1, -verticalMomentum * (1.6 + energy * 1.25)));
  const squashSpring = 22 + energy * 28;
  const squashDamping = 9 + energy * 12;
  state.squashVelocity += (squashTarget - state.squash) * squashSpring * delta;
  state.squashVelocity -= state.squashVelocity * squashDamping * delta;
  state.squash += state.squashVelocity * delta;

  if (!Number.isFinite(state.posX)) state.posX = 0;
  if (!Number.isFinite(state.posY)) state.posY = 0;
  if (!Number.isFinite(state.velX)) state.velX = 0;
  if (!Number.isFinite(state.velY)) state.velY = 0;
  if (!Number.isFinite(state.tilt)) state.tilt = 0;
  if (!Number.isFinite(state.tiltVelocity)) state.tiltVelocity = 0;
  if (!Number.isFinite(state.squash)) state.squash = 0;
  if (!Number.isFinite(state.squashVelocity)) state.squashVelocity = 0;

  if (Math.abs(state.posX) < 0.0005) state.posX = 0;
  if (Math.abs(state.posY) < 0.0005) state.posY = 0;
  if (Math.abs(state.velX) < 0.0005) state.velX = 0;
  if (Math.abs(state.velY) < 0.0005) state.velY = 0;
  if (Math.abs(state.tilt) < 0.0005) state.tilt = 0;
  if (Math.abs(state.squash) < 0.0005) state.squash = 0;

  const offsetX = state.posX * ATOM_REBOUND_AMPLITUDE_SCALE;
  const offsetY = state.posY * ATOM_REBOUND_AMPLITUDE_SCALE;
  visual.style.setProperty('--shake-x', `${offsetX.toFixed(2)}px`);
  visual.style.setProperty('--shake-y', `${offsetY.toFixed(2)}px`);
  visual.style.setProperty(
    '--shake-rot',
    `${((state.tilt + spin) * ATOM_REBOUND_AMPLITUDE_SCALE).toFixed(2)}deg`
  );
  visual.style.setProperty('--shake-scale-x', '1');
  visual.style.setProperty('--shake-scale-y', '1');
}

function updateClickVisuals(now = performance.now()) {
  updateClickHistory(now);
  displayedClickStrength += (targetClickStrength - displayedClickStrength) * 0.28;
  if (Math.abs(targetClickStrength - displayedClickStrength) < 0.0003) {
    displayedClickStrength = targetClickStrength;
  }
  applyClickStrength(displayedClickStrength);
  updateAtomSpring(now, displayedClickStrength);
}

function registerManualClick() {
  const now = performance.now();
  clickHistory.push(now);
  updateClickVisuals(now);
  injectAtomImpulse(now);
  if (gameState.stats) {
    const session = gameState.stats.session;
    const global = gameState.stats.global;
    if (session) {
      if (!Number.isFinite(session.startedAt)) {
        session.startedAt = Date.now();
      }
      session.manualClicks += 1;
    }
    if (global) {
      if (!Number.isFinite(global.startedAt)) {
        global.startedAt = Date.now();
      }
      global.manualClicks += 1;
    }
  }
}

function registerFrenzyTrigger(type) {
  if (!gameState.stats) return;
  const key = type === 'perClick' ? 'perClick' : 'perSecond';

  const applyToStore = store => {
    if (!store) return;
    if (!store.frenzyTriggers) {
      store.frenzyTriggers = { perClick: 0, perSecond: 0, total: 0 };
    }
    store.frenzyTriggers[key] = (store.frenzyTriggers[key] || 0) + 1;
    store.frenzyTriggers.total = (store.frenzyTriggers.total || 0) + 1;
  };

  applyToStore(gameState.stats.session);
  applyToStore(gameState.stats.global);
}

function animateAtomPress(options = {}) {
  if (!elements.atomButton) return;
  const { critical = false, multiplier = 1 } = options;
  const button = elements.atomButton;
  if (critical) {
    soundEffects.crit.play();
    button.classList.add('is-critical');
    showCriticalIndicator(multiplier);
    clearTimeout(animateAtomPress.criticalTimeout);
    animateAtomPress.criticalTimeout = setTimeout(() => {
      button.classList.remove('is-critical');
    }, 280);
  }
}

const STAR_COUNT = CONFIG.presentation?.starfield?.starCount ?? 60;

function initStarfield() {
  if (!elements.starfield) return;
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < STAR_COUNT; i += 1) {
    const star = document.createElement('span');
    star.className = 'starfield__star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.setProperty('--star-scale', (0.6 + Math.random() * 1.7).toFixed(2));
    const duration = 4 + Math.random() * 6;
    star.style.animationDuration = `${duration.toFixed(2)}s`;
    star.style.animationDelay = `-${(Math.random() * duration).toFixed(2)}s`;
    star.style.setProperty('--star-opacity', (0.26 + Math.random() * 0.54).toFixed(2));
    fragment.appendChild(star);
  }
  elements.starfield.appendChild(fragment);
}

const CRIT_CONFETTI_COLORS = [
  '#ff8ba7', '#ffd166', '#6fffe9', '#a5b4ff', '#ff9ff3',
  '#70d6ff', '#fcd5ce', '#caffbf', '#bdb2ff', '#ffe066'
];

const CRIT_CONFETTI_SHAPES = [
  { className: 'crit-confetti--circle', widthFactor: 1, heightFactor: 1 },
  { className: 'crit-confetti--oval', widthFactor: 1.4, heightFactor: 1 },
  { className: 'crit-confetti--heart', widthFactor: 1.1, heightFactor: 1.1 },
  { className: 'crit-confetti--star', widthFactor: 1.2, heightFactor: 1.2 },
  { className: 'crit-confetti--square', widthFactor: 1, heightFactor: 1 },
  { className: 'crit-confetti--triangle', widthFactor: 1.15, heightFactor: 1.3 },
  { className: 'crit-confetti--rectangle', widthFactor: 1.8, heightFactor: 0.7 },
  { className: 'crit-confetti--hexagon', widthFactor: 1.1, heightFactor: 1 }
];

function ensureCritConfettiLayer() {
  if (elements.critConfettiLayer && elements.critConfettiLayer.isConnected) {
    return elements.critConfettiLayer;
  }
  const layer = document.createElement('div');
  layer.className = 'crit-confetti-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);
  elements.critConfettiLayer = layer;
  return layer;
}

function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function createCritConfettiNode() {
  const confetti = document.createElement('span');
  const baseSize = (12 + Math.random() * 18) * 0.3;
  const shape = pickRandom(CRIT_CONFETTI_SHAPES);
  const width = baseSize * shape.widthFactor;
  const height = baseSize * shape.heightFactor;
  confetti.className = `crit-confetti ${shape.className}`;
  confetti.style.width = `${width.toFixed(2)}px`;
  confetti.style.height = `${height.toFixed(2)}px`;

  const startX = Math.random() * 100;
  const startY = Math.random() * 100;
  confetti.style.left = `${startX.toFixed(2)}%`;
  confetti.style.top = `${startY.toFixed(2)}%`;

  const driftX = (Math.random() - 0.5) * 200;
  const driftY = 80 + Math.random() * 140;
  const endX = driftX + (Math.random() - 0.5) * 120;
  const endY = driftY + 60 + Math.random() * 90;

  const rotationStart = Math.random() * 360;
  const rotationEnd = rotationStart + (Math.random() * 220 - 110);
  const spin = 50 + Math.random() * 160;
  const scale = 0.85 + Math.random() * 0.55;
  const duration = 2.8 + Math.random() * 0.5;
  const delay = Math.random() * 0.25;

  confetti.style.setProperty('--confetti-drift-x', `${driftX.toFixed(2)}px`);
  confetti.style.setProperty('--confetti-drift-y', `${driftY.toFixed(2)}px`);
  confetti.style.setProperty('--confetti-end-x', `${endX.toFixed(2)}px`);
  confetti.style.setProperty('--confetti-end-y', `${endY.toFixed(2)}px`);
  confetti.style.setProperty('--confetti-rotation', `${rotationStart.toFixed(2)}deg`);
  confetti.style.setProperty('--confetti-end-rotation', `${rotationEnd.toFixed(2)}deg`);
  confetti.style.setProperty('--confetti-spin', `${spin.toFixed(2)}deg`);
  confetti.style.setProperty('--confetti-scale', scale.toFixed(3));
  confetti.style.setProperty('--confetti-duration', `${duration.toFixed(2)}s`);
  confetti.style.setProperty('--confetti-delay', `${delay.toFixed(2)}s`);

  const colorA = pickRandom(CRIT_CONFETTI_COLORS);
  let colorB = pickRandom(CRIT_CONFETTI_COLORS);
  if (colorA === colorB) {
    colorB = pickRandom(CRIT_CONFETTI_COLORS);
  }
  const gradientAngle = Math.floor(Math.random() * 360);
  confetti.style.background = `linear-gradient(${gradientAngle}deg, ${colorA}, ${colorB})`;

  confetti.style.setProperty('--confetti-lifetime', (duration + delay).toFixed(2));

  return confetti;
}

const critBannerState = {
  fadeTimeoutId: null,
  hideTimeoutId: null
};

function clearCritBannerTimers() {
  if (critBannerState.fadeTimeoutId != null) {
    clearTimeout(critBannerState.fadeTimeoutId);
    critBannerState.fadeTimeoutId = null;
  }
  if (critBannerState.hideTimeoutId != null) {
    clearTimeout(critBannerState.hideTimeoutId);
    critBannerState.hideTimeoutId = null;
  }
}

function hideCritBanner(immediate = false) {
  const display = elements.statusCrit;
  const valueElement = elements.statusCritValue;
  if (!display || !valueElement) return;
  clearCritBannerTimers();
  if (immediate) {
    display.hidden = true;
    display.classList.remove('is-active', 'is-fading');
    valueElement.classList.remove('status-crit-value--smash');
    display.removeAttribute('aria-label');
    display.removeAttribute('title');
    return;
  }
  display.classList.add('is-fading');
  critBannerState.hideTimeoutId = setTimeout(() => {
    display.hidden = true;
    display.classList.remove('is-active', 'is-fading');
    valueElement.classList.remove('status-crit-value--smash');
    display.removeAttribute('aria-label');
    display.removeAttribute('title');
    critBannerState.hideTimeoutId = null;
  }, 360);
}

function showCritBanner(input) {
  const display = elements.statusCrit;
  const valueElement = elements.statusCritValue;
  if (!display || !valueElement) return;

  const options = input instanceof LayeredNumber || typeof input === 'number'
    ? { bonusAmount: input }
    : (input ?? {});

  const layeredBonus = options.bonusAmount != null
    ? toLayeredNumber(options.bonusAmount, 0)
    : LayeredNumber.zero();
  const layeredBase = options.baseAmount != null
    ? toLayeredNumber(options.baseAmount, 0)
    : null;

  let layeredTotal;
  if (options.totalAmount != null) {
    layeredTotal = toLayeredNumber(options.totalAmount, 0);
  } else if (layeredBase) {
    layeredTotal = layeredBase.add(layeredBonus);
  } else {
    layeredTotal = layeredBonus.clone();
  }

  if (!layeredTotal || layeredTotal.sign <= 0) {
    hideCritBanner(true);
    return;
  }

  const totalText = `+${layeredTotal.toString()}`;

  const multiplierValue = Number(options.multiplier ?? options.multiplierValue);
  const hasMultiplier = Number.isFinite(multiplierValue) && multiplierValue > 1;
  const multiplierText = hasMultiplier
    ? `${multiplierValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}×`
    : '';

  valueElement.textContent = hasMultiplier
    ? `${multiplierText} = ${totalText}`
    : totalText;

  display.hidden = false;
  display.classList.remove('is-fading');
  display.classList.add('is-active');

  valueElement.classList.remove('status-crit-value--smash');
  void valueElement.offsetWidth; // force reflow to restart the impact animation
  valueElement.classList.add('status-crit-value--smash');

  const ariaText = hasMultiplier
    ? `Coup critique ${multiplierText} = ${totalText} atomes`
    : `Coup critique : ${totalText} atomes`;
  display.setAttribute('aria-label', ariaText);

  const details = [];
  if (layeredBase && layeredBase.sign > 0) {
    details.push(`base ${layeredBase.toString()}`);
  }
  if (layeredBonus && layeredBonus.sign > 0 && (!layeredBase || layeredBonus.compare(layeredTotal) !== 0)) {
    details.push(`bonus +${layeredBonus.toString()}`);
  }
  const detailText = details.length ? ` — ${details.join(' · ')}` : '';
  display.title = hasMultiplier
    ? `Bonus critique ${multiplierText} = ${totalText}${detailText}`
    : `Bonus critique ${totalText}${detailText}`;

  clearCritBannerTimers();
  critBannerState.fadeTimeoutId = setTimeout(() => {
    display.classList.add('is-fading');
    critBannerState.fadeTimeoutId = null;
    critBannerState.hideTimeoutId = setTimeout(() => {
      display.hidden = true;
      display.classList.remove('is-active', 'is-fading');
      valueElement.classList.remove('status-crit-value--smash');
      display.removeAttribute('aria-label');
      display.removeAttribute('title');
      critBannerState.hideTimeoutId = null;
    }, 360);
  }, 3000);
}

function showCriticalIndicator(multiplier) {
  const layer = ensureCritConfettiLayer();
  if (!layer) return;
  const safeMultiplier = Math.max(1, Number(multiplier) || 1);
  const baseCount = 26;
  const extraCount = Math.min(42, Math.round((safeMultiplier - 1) * 8));
  const totalConfetti = baseCount + extraCount;
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < totalConfetti; i += 1) {
    const confetti = createCritConfettiNode();
    fragment.appendChild(confetti);
    const lifetime = Number(confetti.style.getPropertyValue('--confetti-lifetime')) || 3;
    setTimeout(() => {
      if (confetti.isConnected) {
        confetti.remove();
      }
    }, (lifetime + 0.3) * 1000);
  }

  layer.appendChild(fragment);
}

function applyCriticalHit(baseAmount) {
  const amount = baseAmount instanceof LayeredNumber
    ? baseAmount.clone()
    : new LayeredNumber(baseAmount ?? 0);
  const critState = cloneCritState(gameState.crit);
  const chance = Number(critState.chance) || 0;
  const effectiveMultiplier = Math.max(1, Math.min(critState.multiplier || 1, critState.maxMultiplier || critState.multiplier || 1));
  if (chance <= 0 || effectiveMultiplier <= 1) {
    return { amount, isCritical: false, multiplier: 1 };
  }
  if (Math.random() >= chance) {
    return { amount, isCritical: false, multiplier: 1 };
  }
  const critAmount = amount.multiplyNumber(effectiveMultiplier);
  return { amount: critAmount, isCritical: true, multiplier: effectiveMultiplier };
}

function handleManualAtomClick() {
  const baseAmount = gameState.perClick instanceof LayeredNumber
    ? gameState.perClick
    : toLayeredNumber(gameState.perClick ?? 0, 0);
  const critResult = applyCriticalHit(baseAmount);
  gainAtoms(critResult.amount, 'apc');
  registerManualClick();
  soundEffects.pop.play();
  if (critResult.isCritical) {
    gameState.lastCritical = {
      at: Date.now(),
      multiplier: critResult.multiplier
    };
    const critBonus = critResult.amount.subtract(baseAmount);
    showCritBanner({
      bonusAmount: critBonus,
      totalAmount: critResult.amount,
      baseAmount,
      multiplier: critResult.multiplier
    });
  }
  animateAtomPress({ critical: critResult.isCritical, multiplier: critResult.multiplier });
}

function shouldTriggerGlobalClick(event) {
  if (!isGamePageActive()) return false;
  if (event.target.closest('.app-header')) return false;
  if (event.target.closest('.status-bar')) return false;
  return true;
}

function showPage(pageId) {
  if (!isPageUnlocked(pageId)) {
    if (pageId !== 'game') {
      showPage('game');
    }
    return;
  }
  const now = performance.now();
  elements.pages.forEach(page => {
    const isActive = page.id === pageId;
    page.classList.toggle('active', isActive);
    page.toggleAttribute('hidden', !isActive);
  });
  elements.navButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.target === pageId);
  });
  document.body.dataset.activePage = pageId;
  document.body.classList.toggle('view-game', pageId === 'game');
  document.body.classList.toggle('view-arcade', pageId === 'arcade');
  document.body.classList.toggle('view-metaux', pageId === 'metaux');
  if (pageId === 'metaux') {
    initMetauxGame();
  }
  if (particulesGame) {
    if (pageId === 'arcade') {
      particulesGame.onEnter();
    } else {
      particulesGame.onLeave();
    }
  }
  if (metauxGame) {
    if (pageId === 'metaux') {
      metauxGame.onEnter();
    } else {
      metauxGame.onLeave();
    }
  }
  if (pageId === 'game' && (typeof document === 'undefined' || !document.hidden)) {
    gamePageVisibleSince = now;
  } else {
    gamePageVisibleSince = null;
  }
  if (pageId === 'gacha') {
    const weightsUpdated = refreshGachaRarities(new Date());
    if (weightsUpdated) {
      rebuildGachaPools();
      renderGachaRarityList();
    }
  }
}

document.addEventListener('visibilitychange', () => {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.hidden) {
    gamePageVisibleSince = null;
    if (particulesGame && document.body?.dataset.activePage === 'arcade') {
      particulesGame.onLeave();
    }
  } else if (isGamePageActive()) {
    gamePageVisibleSince = performance.now();
    if (particulesGame && document.body?.dataset.activePage === 'arcade') {
      particulesGame.onEnter();
    }
  } else if (particulesGame && document.body?.dataset.activePage === 'arcade') {
    particulesGame.onEnter();
  }
});

const initiallyActivePage = document.querySelector('.page.active') || elements.pages[0];
if (initiallyActivePage) {
  showPage(initiallyActivePage.id);
} else {
  document.body.classList.remove('view-game');
}

if (elements.devkitOverlay) {
  elements.devkitOverlay.addEventListener('click', event => {
    if (event.target === elements.devkitOverlay) {
      closeDevKit();
    }
  });
}

if (elements.devkitPanel) {
  elements.devkitPanel.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeDevKit();
    }
  });
}

if (elements.devkitClose) {
  elements.devkitClose.addEventListener('click', event => {
    event.preventDefault();
    closeDevKit();
  });
}

if (elements.devkitAtomsForm) {
  elements.devkitAtomsForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = elements.devkitAtomsInput ? elements.devkitAtomsInput.value : '';
    handleDevKitAtomsSubmission(value);
    if (elements.devkitAtomsInput) {
      elements.devkitAtomsInput.value = '';
    }
  });
}

if (elements.devkitAutoForm) {
  elements.devkitAutoForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = elements.devkitAutoInput ? elements.devkitAutoInput.value : '';
    handleDevKitAutoSubmission(value);
    if (elements.devkitAutoInput) {
      elements.devkitAutoInput.value = '';
    }
  });
}

if (elements.devkitAutoReset) {
  elements.devkitAutoReset.addEventListener('click', event => {
    event.preventDefault();
    resetDevKitAutoBonus();
  });
}

if (elements.devkitTicketsForm) {
  elements.devkitTicketsForm.addEventListener('submit', event => {
    event.preventDefault();
    const value = elements.devkitTicketsInput ? elements.devkitTicketsInput.value : '';
    handleDevKitTicketSubmission(value);
    if (elements.devkitTicketsInput) {
      elements.devkitTicketsInput.value = '';
    }
  });
}

if (elements.devkitUnlockTrophies) {
  elements.devkitUnlockTrophies.addEventListener('click', event => {
    event.preventDefault();
    devkitUnlockAllTrophies();
  });
}

if (elements.devkitUnlockElements) {
  elements.devkitUnlockElements.addEventListener('click', event => {
    event.preventDefault();
    devkitUnlockAllElements();
  });
}

if (elements.devkitUnlockInfo) {
  elements.devkitUnlockInfo.addEventListener('click', event => {
    event.preventDefault();
    const unlocked = unlockPage('info', {
      save: true,
      announce: 'DevKit : page Infos débloquée !'
    });
    if (!unlocked) {
      showToast('Page Infos déjà débloquée.');
    }
    updateDevKitUI();
  });
}

if (elements.devkitToggleShop) {
  elements.devkitToggleShop.addEventListener('click', event => {
    event.preventDefault();
    toggleDevKitCheat('freeShop');
  });
}

if (elements.devkitToggleGacha) {
  elements.devkitToggleGacha.addEventListener('click', event => {
    event.preventDefault();
    toggleDevKitCheat('freeGacha');
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'F9') {
    event.preventDefault();
    toggleDevKit();
  } else if (event.key === 'Escape' && DEVKIT_STATE.isOpen) {
    event.preventDefault();
    closeDevKit();
  }
});

updateDevKitUI();

initParticulesGame();

function handleMetauxSessionEnd(summary) {
  if (!summary || typeof summary !== 'object') {
    return;
  }
  const elapsedMs = Number(summary.elapsedMs ?? summary.time ?? 0);
  const matches = Number(summary.matches ?? summary.matchCount ?? 0);
  const secondsEarned = Number.isFinite(elapsedMs) && elapsedMs > 0
    ? Math.max(0, Math.round(elapsedMs / 1000))
    : 0;
  const matchesEarned = Number.isFinite(matches) && matches > 0
    ? Math.max(0, Math.floor(matches))
    : 0;
  if (secondsEarned <= 0 && matchesEarned <= 0) {
    return;
  }
  const apsCrit = ensureApsCritState();
  const hadEffects = apsCrit.effects.length > 0;
  const previousMultiplier = getApsCritMultiplier(apsCrit);
  const currentRemaining = getApsCritRemainingSeconds(apsCrit);
  let chronoAdded = 0;
  let effectAdded = false;
  if (!hadEffects) {
    if (secondsEarned > 0 && matchesEarned > 0) {
      apsCrit.effects.push({
        multiplierAdd: matchesEarned,
        remainingSeconds: secondsEarned
      });
      chronoAdded = secondsEarned;
      effectAdded = true;
    }
  } else if (matchesEarned > 0 && currentRemaining > 0) {
    apsCrit.effects.push({
      multiplierAdd: matchesEarned,
      remainingSeconds: currentRemaining
    });
    effectAdded = true;
  }
  if (!effectAdded) {
    return;
  }
  apsCrit.effects = apsCrit.effects.filter(effect => {
    const remaining = Number(effect?.remainingSeconds) || 0;
    const value = Number(effect?.multiplierAdd) || 0;
    return remaining > 0 && value > 0;
  });
  if (!apsCrit.effects.length) {
    return;
  }
  const newMultiplier = getApsCritMultiplier(apsCrit);
  if (newMultiplier !== previousMultiplier) {
    recalcProduction();
  }
  updateUI();
  pulseApsCritPanel();
  const messageParts = [];
  if (chronoAdded > 0) {
    messageParts.push(`Chrono +${chronoAdded.toLocaleString('fr-FR')} s`);
  }
  if (matchesEarned > 0) {
    messageParts.push(`Multi +${matchesEarned.toLocaleString('fr-FR')}`);
  }
  if (messageParts.length) {
    showToast(`Métaux : ${messageParts.join(' · ')}`);
  }
  saveGame();
}

window.handleMetauxSessionEnd = handleMetauxSessionEnd;

elements.navButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    if (!isPageUnlocked(target)) {
      return;
    }
    showPage(target);
  });
});

if (elements.metauxOpenButton) {
  elements.metauxOpenButton.addEventListener('click', () => {
    showPage('metaux');
  });
}

if (elements.metauxExitButton) {
  elements.metauxExitButton.addEventListener('click', () => {
    showPage('game');
  });
}

if (elements.metauxReturnButton) {
  elements.metauxReturnButton.addEventListener('click', () => {
    showPage('options');
  });
}

if (elements.metauxReshuffleButton) {
  elements.metauxReshuffleButton.addEventListener('click', () => {
    initMetauxGame();
    if (metauxGame) {
      if (metauxGame.processing) {
        metauxGame.updateMessage('Patientez, la réaction en chaîne est en cours.');
        return;
      }
      metauxGame.forceReshuffle(true);
    }
  });
}

if (elements.metauxReplayButton) {
  elements.metauxReplayButton.addEventListener('click', () => {
    initMetauxGame();
    if (metauxGame) {
      metauxGame.restart();
    }
  });
}

if (elements.brandPortal) {
  elements.brandPortal.addEventListener('click', () => {
    if (!isArcadeUnlocked()) {
      return;
    }
    elements.brandPortal.classList.remove('brand--pulse');
    showPage('arcade');
  });
}

if (elements.arcadeReturnButton) {
  elements.arcadeReturnButton.addEventListener('click', () => {
    showPage('game');
    if (isArcadeUnlocked() && elements.brandPortal?.dataset.portalReady === 'true') {
      triggerBrandPortalPulse();
    }
  });
}

if (elements.arcadeTicketButton) {
  elements.arcadeTicketButton.addEventListener('click', () => {
    if (!isPageUnlocked('gacha')) {
      return;
    }
    showPage('gacha');
  });
}

renderPeriodicTable();
renderGachaRarityList();
renderFusionList();

if (elements.atomButton) {
  elements.atomButton.addEventListener('click', event => {
    event.stopPropagation();
    handleManualAtomClick();
  });
  elements.atomButton.addEventListener('dragstart', event => {
    event.preventDefault();
  });
}

if (elements.gachaSunButton) {
  elements.gachaSunButton.addEventListener('click', event => {
    event.preventDefault();
    handleGachaSunClick().catch(error => {
      console.error('Erreur lors du tirage cosmique', error);
    });
  });
}

if (elements.gachaTicketModeButton) {
  elements.gachaTicketModeButton.addEventListener('click', event => {
    event.preventDefault();
    if (gachaAnimationInProgress) return;
    toggleGachaRollMode();
  });
}

document.addEventListener('click', event => {
  if (!shouldTriggerGlobalClick(event)) return;
  handleManualAtomClick();
});

document.addEventListener('selectstart', event => {
  if (isGamePageActive()) {
    event.preventDefault();
  }
});

function gainAtoms(amount, source = 'generic') {
  gameState.atoms = gameState.atoms.add(amount);
  gameState.lifetime = gameState.lifetime.add(amount);
  if (gameState.stats) {
    const session = gameState.stats.session;
    const global = gameState.stats.global;
    if (session?.atomsGained) {
      session.atomsGained = session.atomsGained.add(amount);
    }
    if (source === 'apc') {
      incrementLayeredStat(session, 'apcAtoms', amount);
      incrementLayeredStat(global, 'apcAtoms', amount);
    } else if (source === 'offline') {
      incrementLayeredStat(session, 'apsAtoms', amount);
      incrementLayeredStat(session, 'offlineAtoms', amount);
      incrementLayeredStat(global, 'apsAtoms', amount);
      incrementLayeredStat(global, 'offlineAtoms', amount);
    } else if (source === 'aps') {
      incrementLayeredStat(session, 'apsAtoms', amount);
      incrementLayeredStat(global, 'apsAtoms', amount);
    }
  }
  evaluateTrophies();
}

function getUpgradeLevel(state, id) {
  if (!state || typeof state !== 'object') {
    return 0;
  }
  const value = Number(state[id] ?? 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
}

function resolveUpgradeMaxLevel(definition) {
  const raw = definition?.maxLevel ?? definition?.maxPurchase;
  const numeric = Number(raw);
  if (Number.isFinite(numeric) && numeric > 0) {
    return Math.max(1, Math.floor(numeric));
  }
  return DEFAULT_UPGRADE_MAX_LEVEL;
}

function getRemainingUpgradeCapacity(definition) {
  const maxLevel = resolveUpgradeMaxLevel(definition);
  if (!Number.isFinite(maxLevel)) {
    return Infinity;
  }
  const currentLevel = getUpgradeLevel(gameState.upgrades, definition.id);
  const remaining = Math.floor(maxLevel - currentLevel);
  return Math.max(0, remaining);
}

function computeGlobalCostModifier(defId) {
  let modifier = 1;
  const architectLevel = getUpgradeLevel(gameState.upgrades, 'cosmicArchitect');
  if (architectLevel > 0) {
    modifier *= Math.pow(0.99, architectLevel);
  }
  const simulatorLevel = getUpgradeLevel(gameState.upgrades, 'multiverseSimulator');
  if (simulatorLevel >= 200) {
    modifier *= 0.95;
  }
  if (!Number.isFinite(modifier) || modifier <= 0) {
    modifier = 0.05;
  }
  return Math.max(0.05, modifier);
}

function computeUpgradeCost(def, quantity = 1) {
  if (isDevKitShopFree()) {
    return LayeredNumber.zero();
  }
  const level = getUpgradeLevel(gameState.upgrades, def.id);
  const baseScale = def.costScale ?? 1;
  const modifier = computeGlobalCostModifier(def.id);
  const baseCost = def.baseCost;
  const buyAmount = Math.max(1, Math.floor(Number(quantity) || 0));

  if (buyAmount === 1 || !Number.isFinite(baseScale) || baseScale === 1) {
    const singleCost = baseCost * Math.pow(baseScale, level) * modifier;
    return new LayeredNumber(singleCost * buyAmount);
  }

  const startScale = Math.pow(baseScale, level);
  const scalePow = Math.pow(baseScale, buyAmount);
  const sumFactor = (scalePow - 1) / (baseScale - 1);
  const totalCost = baseCost * startScale * sumFactor * modifier;
  return new LayeredNumber(totalCost);
}

function formatShopCost(cost) {
  const value = cost instanceof LayeredNumber ? cost : new LayeredNumber(cost);
  return `${value.toString()} atomes`;
}

function recalcProduction() {
  const clickBase = normalizeProductionUnit(BASE_PER_CLICK);
  const autoBase = normalizeProductionUnit(BASE_PER_SECOND);

  const clickDetails = createEmptyProductionEntry();
  const autoDetails = createEmptyProductionEntry();

  clickDetails.base = clickBase.clone();
  autoDetails.base = autoBase.clone();
  clickDetails.sources.flats.baseFlat = clickBase.clone();
  autoDetails.sources.flats.baseFlat = autoBase.clone();

  let clickShopAddition = LayeredNumber.zero();
  let autoShopAddition = LayeredNumber.zero();
  let clickElementAddition = LayeredNumber.zero();
  let autoElementAddition = LayeredNumber.zero();
  let clickFusionAddition = LayeredNumber.zero();
  let autoFusionAddition = LayeredNumber.zero();
  const critAccumulator = createCritAccumulator();

  const clickMultiplierSlots = {
    shopBonus1: LayeredNumber.one(),
    shopBonus2: LayeredNumber.one()
  };
  const autoMultiplierSlots = {
    shopBonus1: LayeredNumber.one(),
    shopBonus2: LayeredNumber.one()
  };

  const clickSlotMap = PRODUCTION_MULTIPLIER_SLOT_MAP.perClick;
  const autoSlotMap = PRODUCTION_MULTIPLIER_SLOT_MAP.perSecond;

  const clickRarityMultipliers = clickDetails.sources.multipliers.rarityMultipliers;
  const autoRarityMultipliers = autoDetails.sources.multipliers.rarityMultipliers;

  const elementCountsByRarity = new Map();
  const elementCountsByFamily = new Map();
  const elementGroupSummaries = new Map();
  const familySummaries = new Map();
  const mythiqueBonuses = {
    ticketIntervalSeconds: DEFAULT_TICKET_STAR_INTERVAL_SECONDS,
    offlineMultiplier: MYTHIQUE_OFFLINE_BASE,
    frenzyChanceMultiplier: 1
  };
  const formatMultiplierTooltip = value => {
    const display = formatElementMultiplierDisplay(value);
    if (display) {
      return display;
    }
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || Math.abs(numeric - 1) < 1e-9) {
      return null;
    }
    const abs = Math.abs(numeric);
    const options = abs >= 100
      ? { maximumFractionDigits: 0 }
      : abs >= 10
        ? { maximumFractionDigits: 1 }
        : { maximumFractionDigits: 2 };
    return `×${numeric.toLocaleString('fr-FR', options)}`;
  };
  const getRarityCounter = rarityId => {
    if (!rarityId) return null;
    let counter = elementCountsByRarity.get(rarityId);
    if (!counter) {
      counter = { copies: 0, unique: 0, active: 0 };
      elementCountsByRarity.set(rarityId, counter);
    }
    return counter;
  };

  const elementEntries = Object.values(gameState.elements || {});
  elementEntries.forEach(entry => {
    if (!entry) return;
    const rarityId = entry.rarity || elementRarityIndex.get(entry.id);
    if (!rarityId) return;
    const normalizedCount = getElementLifetimeCount(entry);
    if (normalizedCount <= 0) return;
    const counter = getRarityCounter(rarityId);
    if (!counter) return;
    const activeCount = Math.max(0, getElementCurrentCount(entry));
    counter.copies += normalizedCount;
    counter.unique += 1;
    counter.active += activeCount;

    const definition = periodicElementIndex.get(entry.id);
    const familyId = definition?.category;
    if (familyId) {
      let familyCounter = elementCountsByFamily.get(familyId);
      if (!familyCounter) {
        familyCounter = { copies: 0, unique: 0, active: 0 };
        elementCountsByFamily.set(familyId, familyCounter);
      }
      familyCounter.copies += normalizedCount;
      familyCounter.unique += 1;
      familyCounter.active += activeCount;
    }
  });

  const singularityCounts = elementCountsByRarity.get('singulier') || { copies: 0, unique: 0, active: 0 };
  const singularityPoolSize = getRarityPoolSize('singulier');
  const isSingularityComplete = singularityPoolSize > 0 && singularityCounts.unique >= singularityPoolSize;
  const stellaireSingularityBoost = isSingularityComplete ? 2 : 1;
  const STELLAIRE_SINGULARITY_BONUS_LABEL = 'Forge stellaire · singularité amplifiée';

  const flatBonusMultipliers = {
    perClick: new Map(),
    perSecond: new Map()
  };
  const activeFlatMultiplierEntries = new Set();
  const familyMultipliers = {
    perClick: LayeredNumber.one(),
    perSecond: LayeredNumber.one()
  };

  const registerFlatMultiplierDefaults = rarityId => {
    if (!rarityId) return;
    if (!flatBonusMultipliers.perClick.has(rarityId)) {
      flatBonusMultipliers.perClick.set(rarityId, 1);
    }
    if (!flatBonusMultipliers.perSecond.has(rarityId)) {
      flatBonusMultipliers.perSecond.set(rarityId, 1);
    }
  };

  const applyFlatMultiplierTargets = (targets, sourceRarityId) => {
    if (!Array.isArray(targets)) return;
    const boostMultiplier = sourceRarityId === 'stellaire' && stellaireSingularityBoost !== 1
      ? stellaireSingularityBoost
      : 1;
    targets.forEach(target => {
      if (!target || typeof target !== 'object') return;
      const targetRarity = typeof target.rarityId === 'string' ? target.rarityId.trim() : '';
      if (!targetRarity) return;
      registerFlatMultiplierDefaults(targetRarity);
      const rawPerClick = Number(target.perClick);
      if (Number.isFinite(rawPerClick) && rawPerClick > 0 && rawPerClick !== 1) {
        const perClickValue = boostMultiplier !== 1 ? rawPerClick * boostMultiplier : rawPerClick;
        const current = flatBonusMultipliers.perClick.get(targetRarity) ?? 1;
        flatBonusMultipliers.perClick.set(targetRarity, current * perClickValue);
      }
      const rawPerSecond = Number(target.perSecond);
      if (Number.isFinite(rawPerSecond) && rawPerSecond > 0 && rawPerSecond !== 1) {
        const perSecondValue = boostMultiplier !== 1 ? rawPerSecond * boostMultiplier : rawPerSecond;
        const current = flatBonusMultipliers.perSecond.get(targetRarity) ?? 1;
        flatBonusMultipliers.perSecond.set(targetRarity, current * perSecondValue);
      }
    });
  };

  const evaluateFlatMultiplierEntry = (rarityId, entry, key, counts, poolSize) => {
    if (!entry || !Array.isArray(entry.rarityFlatMultipliers) || entry.rarityFlatMultipliers.length === 0) {
      return;
    }
    const copyCount = Number(counts?.copyCount ?? counts?.copies ?? 0);
    const uniqueCount = Number(counts?.uniqueCount ?? counts?.unique ?? 0);
    const { minCopies = 0, minUnique = 0, requireAllUnique = false } = entry;
    let isActive = false;
    if (key === 'perCopy') {
      const requiredCopies = Math.max(1, minCopies);
      const requiredUnique = Math.max(0, minUnique);
      isActive = copyCount >= requiredCopies && uniqueCount >= requiredUnique;
    } else {
      const requiredCopies = Math.max(0, minCopies);
      let requiredUnique = Math.max(0, minUnique);
      if (requireAllUnique) {
        if (poolSize > 0) {
          requiredUnique = Math.max(requiredUnique, poolSize);
        } else if (requiredUnique === 0) {
          requiredUnique = uniqueCount;
        }
      }
      const meetsCopyRequirement = copyCount >= requiredCopies;
      const meetsUniqueRequirement = requiredUnique > 0
        ? uniqueCount >= requiredUnique
        : uniqueCount > 0;
      isActive = meetsCopyRequirement && meetsUniqueRequirement;
    }
    if (!isActive) {
      return;
    }
    applyFlatMultiplierTargets(entry.rarityFlatMultipliers, rarityId);
    activeFlatMultiplierEntries.add(`${rarityId}:${key}`);
  };

  ELEMENT_GROUP_BONUS_CONFIG.forEach((groupConfig, rarityId) => {
    registerFlatMultiplierDefaults(rarityId);
    const counts = elementCountsByRarity.get(rarityId) || { copies: 0, unique: 0, active: 0 };
    const poolSize = getRarityPoolSize(rarityId);
    if (groupConfig?.perCopy) {
      evaluateFlatMultiplierEntry(rarityId, groupConfig.perCopy, 'perCopy', counts, poolSize);
    }
    const setBonuses = Array.isArray(groupConfig?.setBonuses)
      ? groupConfig.setBonuses
      : (groupConfig?.setBonus ? [groupConfig.setBonus] : []);
    setBonuses.forEach((setBonusEntry, index) => {
      if (!setBonusEntry) return;
      evaluateFlatMultiplierEntry(rarityId, setBonusEntry, `setBonus:${index}`, counts, poolSize);
    });
  });

  const getFlatBonusMultiplier = (type, rarityId) => {
    if (!rarityId) return 1;
    const store = type === 'perSecond' ? flatBonusMultipliers.perSecond : flatBonusMultipliers.perClick;
    if (!store) return 1;
    const value = store.get(rarityId);
    return Number.isFinite(value) && value > 0 ? value : 1;
  };

  const addClickElementFlat = (value, { id, label, rarityId, source = 'elements' }) => {
    if (value == null) return 0;
    const layeredValue = value instanceof LayeredNumber ? value.clone() : new LayeredNumber(value);
    if (layeredValue.isZero()) return 0;
    const multiplier = getFlatBonusMultiplier('perClick', rarityId);
    let finalValue = multiplier !== 1 ? layeredValue.multiplyNumber(multiplier) : layeredValue;
    if (stellaireSingularityBoost !== 1 && rarityId === 'stellaire') {
      finalValue = finalValue.multiplyNumber(stellaireSingularityBoost);
    }
    clickElementAddition = clickElementAddition.add(finalValue);
    clickDetails.additions.push({
      id,
      label,
      value: finalValue.clone(),
      source
    });
    return finalValue.toNumber();
  };

  const addAutoElementFlat = (value, { id, label, rarityId, source = 'elements' }) => {
    if (value == null) return 0;
    const layeredValue = value instanceof LayeredNumber ? value.clone() : new LayeredNumber(value);
    if (layeredValue.isZero()) return 0;
    const multiplier = getFlatBonusMultiplier('perSecond', rarityId);
    let finalValue = multiplier !== 1 ? layeredValue.multiplyNumber(multiplier) : layeredValue;
    if (stellaireSingularityBoost !== 1 && rarityId === 'stellaire') {
      finalValue = finalValue.multiplyNumber(stellaireSingularityBoost);
    }
    autoElementAddition = autoElementAddition.add(finalValue);
    autoDetails.additions.push({
      id,
      label,
      value: finalValue.clone(),
      source
    });
    return finalValue.toNumber();
  };

  const applyFamilyMultiplier = (type, multiplierValue, { id, label }) => {
    if (multiplierValue == null) {
      return 1;
    }
    const layeredValue = multiplierValue instanceof LayeredNumber
      ? multiplierValue.clone()
      : toMultiplierLayered(multiplierValue);
    if (!(layeredValue instanceof LayeredNumber)) {
      return 1;
    }
    if (isLayeredOne(layeredValue)) {
      return 1;
    }
    if (type === 'perClick') {
      familyMultipliers.perClick = familyMultipliers.perClick.multiply(layeredValue);
      clickDetails.multipliers.push({ id, label, value: layeredValue.clone(), source: 'family' });
    } else {
      familyMultipliers.perSecond = familyMultipliers.perSecond.multiply(layeredValue);
      autoDetails.multipliers.push({ id, label, value: layeredValue.clone(), source: 'family' });
    }
    return layeredValue.toNumber();
  };

  const updateRarityMultiplierDetail = (details, detailId, label, value) => {
    if (!details) return;
    const layeredValue = value instanceof LayeredNumber ? value.clone() : new LayeredNumber(value);
    const isNeutral = isLayeredOne(layeredValue);
    const index = details.findIndex(entry => entry.id === detailId);
    if (isNeutral) {
      if (index >= 0) {
        details.splice(index, 1);
      }
      return;
    }
    if (index >= 0) {
      details[index].value = layeredValue.clone();
      if (label) {
        details[index].label = label;
      }
    } else {
      details.push({
        id: detailId,
        label: label || detailId,
        value: layeredValue.clone(),
        source: 'elements'
      });
    }
  };

  ELEMENT_GROUP_BONUS_CONFIG.forEach((groupConfig, rarityId) => {
    const { copies: copyCount = 0, unique: uniqueCount = 0, active: activeCount = 0 } =
      elementCountsByRarity.get(rarityId) || {};
    const rarityLabel = RARITY_LABEL_MAP.get(rarityId) || rarityId;
    const copyLabel = groupConfig.labels?.perCopy || `${rarityLabel} · copies`;
    const setBonusLabel = groupConfig.labels?.setBonus || `${rarityLabel} · bonus de groupe`;
    const multiplierDetailId = `elements:${rarityId}:multiplier`;
    const multiplierLabel = groupConfig.labels?.multiplier || rarityLabel;
    const rarityMultiplierLabel = groupConfig.rarityMultiplierBonus?.label
      || groupConfig.labels?.rarityMultiplier
      || multiplierLabel;
    const duplicateCount = Math.max(0, copyCount - uniqueCount);
    const totalUnique = getRarityPoolSize(rarityId);
    const stellaireBoostActive = stellaireSingularityBoost !== 1 && rarityId === 'stellaire';
    const activeLabelDetails = new Map();
    const normalizeLabelKey = label => {
      if (typeof label !== 'string') return '';
      return label.trim();
    };
    const ensureActiveLabel = (label, type = null) => {
      const key = normalizeLabelKey(label);
      if (!key) return null;
      if (!activeLabelDetails.has(key)) {
        activeLabelDetails.set(key, {
          label: key,
          effects: [],
          notes: [],
          types: new Set()
        });
      }
      const entry = activeLabelDetails.get(key);
      if (type) {
        entry.types.add(type);
      }
      return entry;
    };
    const addLabelEffect = (label, effectText, type = null) => {
      if (!effectText) return;
      const entry = ensureActiveLabel(label, type);
      if (!entry) return;
      if (!entry.effects.includes(effectText)) {
        entry.effects.push(effectText);
      }
    };
    const addLabelNote = (label, noteText, type = null) => {
      if (!noteText) return;
      const entry = ensureActiveLabel(label, type);
      if (!entry) return;
      if (!entry.notes.includes(noteText)) {
        entry.notes.push(noteText);
      }
    };
    const markLabelActive = (label, type = null) => {
      ensureActiveLabel(label, type);
    };
    const describeRarityFlatMultipliers = entries => {
      if (!Array.isArray(entries) || entries.length === 0) {
        return [];
      }
      const notes = [];
      entries.forEach(target => {
        if (!target || typeof target !== 'object') return;
        const targetRarityId = typeof target.rarityId === 'string' ? target.rarityId.trim() : '';
        if (!targetRarityId) return;
        const targetLabel = RARITY_LABEL_MAP.get(targetRarityId) || targetRarityId;
        const parts = [];
        const rawPerClick = Number(target.perClick);
        if (Number.isFinite(rawPerClick) && rawPerClick > 0 && rawPerClick !== 1) {
          const effective = stellaireBoostActive
            ? rawPerClick * stellaireSingularityBoost
            : rawPerClick;
          const formatted = formatMultiplierTooltip(effective);
          if (formatted) {
            parts.push(`APC ${formatted}`);
          }
        }
        const rawPerSecond = Number(target.perSecond);
        if (Number.isFinite(rawPerSecond) && rawPerSecond > 0 && rawPerSecond !== 1) {
          const effective = stellaireBoostActive
            ? rawPerSecond * stellaireSingularityBoost
            : rawPerSecond;
          const formatted = formatMultiplierTooltip(effective);
          if (formatted) {
            parts.push(`APS ${formatted}`);
          }
        }
        if (parts.length) {
          notes.push(`Amplifie ${targetLabel} : ${parts.join(' · ')}`);
        }
      });
      return notes;
    };
    let clickMultiplierValue = 1;
    let autoMultiplierValue = 1;
    const summary = {
      type: 'rarity',
      rarityId,
      label: rarityLabel,
      copies: copyCount,
      uniques: uniqueCount,
      duplicates: duplicateCount,
      totalUnique,
      activeCopies: Math.max(0, Number(activeCount) || 0),
      isComplete: totalUnique > 0 && uniqueCount >= totalUnique,
      clickFlatTotal: 0,
      autoFlatTotal: 0,
      multiplierPerClick: 1,
      multiplierPerSecond: 1,
      critChanceAdd: 0,
      critMultiplierAdd: 0,
      activeLabels: []
    };

    if (copyCount > 0 && groupConfig.perCopy) {
      const {
        clickAdd = 0,
        autoAdd = 0,
        uniqueClickAdd = 0,
        uniqueAutoAdd = 0,
        duplicateClickAdd = 0,
        duplicateAutoAdd = 0,
        minCopies = 0,
        minUnique = 0
      } = groupConfig.perCopy;
      const meetsCopyRequirement = copyCount >= Math.max(1, minCopies);
      const meetsUniqueRequirement = uniqueCount >= Math.max(0, minUnique);
      if (meetsCopyRequirement && meetsUniqueRequirement) {
        let hasEffect = false;
        if (clickAdd) {
          const totalClickAdd = clickAdd * copyCount;
          const applied = addClickElementFlat(totalClickAdd, {
            id: `elements:${rarityId}:copies`,
            label: copyLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.clickFlatTotal += applied;
            hasEffect = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(copyLabel, `APC +${formatted}`, 'perCopy');
            }
          }
        }
        if (autoAdd) {
          const totalAutoAdd = autoAdd * copyCount;
          const applied = addAutoElementFlat(totalAutoAdd, {
            id: `elements:${rarityId}:copies`,
            label: copyLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.autoFlatTotal += applied;
            hasEffect = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(copyLabel, `APS +${formatted}`, 'perCopy');
            }
          }
        }
        if (uniqueClickAdd && uniqueCount > 0) {
          const totalUniqueClick = uniqueClickAdd * uniqueCount;
          const applied = addClickElementFlat(totalUniqueClick, {
            id: `elements:${rarityId}:unique`,
            label: copyLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.clickFlatTotal += applied;
            hasEffect = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(copyLabel, `APC +${formatted}`, 'perCopy');
            }
          }
        }
        if (uniqueAutoAdd && uniqueCount > 0) {
          const totalUniqueAuto = uniqueAutoAdd * uniqueCount;
          const applied = addAutoElementFlat(totalUniqueAuto, {
            id: `elements:${rarityId}:unique`,
            label: copyLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.autoFlatTotal += applied;
            hasEffect = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(copyLabel, `APS +${formatted}`, 'perCopy');
            }
          }
        }
        if (duplicateClickAdd && duplicateCount > 0) {
          const totalDuplicateClick = duplicateClickAdd * duplicateCount;
          const applied = addClickElementFlat(totalDuplicateClick, {
            id: `elements:${rarityId}:duplicates`,
            label: copyLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.clickFlatTotal += applied;
            hasEffect = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(copyLabel, `APC +${formatted}`, 'perCopy');
            }
          }
        }
        if (duplicateAutoAdd && duplicateCount > 0) {
          const totalDuplicateAuto = duplicateAutoAdd * duplicateCount;
          const applied = addAutoElementFlat(totalDuplicateAuto, {
            id: `elements:${rarityId}:duplicates`,
            label: copyLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.autoFlatTotal += applied;
            hasEffect = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(copyLabel, `APS +${formatted}`, 'perCopy');
            }
          }
        }
        if (activeFlatMultiplierEntries.has(`${rarityId}:perCopy`)) {
          hasEffect = true;
          if (groupConfig.perCopy?.rarityFlatMultipliers) {
            describeRarityFlatMultipliers(groupConfig.perCopy.rarityFlatMultipliers).forEach(note => {
              addLabelNote(copyLabel, note, 'perCopy');
            });
          }
        }
        if (hasEffect) {
          markLabelActive(copyLabel, 'perCopy');
        }
      }
    }

    const setBonuses = Array.isArray(groupConfig.setBonuses)
      ? groupConfig.setBonuses
      : (groupConfig.setBonus ? [groupConfig.setBonus] : []);
    if (uniqueCount > 0 && setBonuses.length) {
      setBonuses.forEach((setBonusEntry, index) => {
        if (!setBonusEntry) return;
        const {
          clickAdd = 0,
          autoAdd = 0,
          uniqueClickAdd = 0,
          uniqueAutoAdd = 0,
          duplicateClickAdd = 0,
          duplicateAutoAdd = 0,
          minCopies = 0,
          minUnique = 0,
          requireAllUnique = false,
          label: entryLabel
        } = setBonusEntry;
        const requiredCopies = Math.max(0, minCopies);
        let requiredUnique = Math.max(0, minUnique);
        if (requireAllUnique) {
          const poolSize = getRarityPoolSize(rarityId);
          if (poolSize > 0) {
            requiredUnique = Math.max(requiredUnique, poolSize);
          } else if (requiredUnique === 0) {
            requiredUnique = uniqueCount;
          }
        }
        const meetsCopyRequirement = copyCount >= requiredCopies;
        const meetsUniqueRequirement = requiredUnique > 0
          ? uniqueCount >= requiredUnique
          : uniqueCount > 0;
        if (!meetsCopyRequirement || !meetsUniqueRequirement) {
          return;
        }
        const resolvedLabel = entryLabel || setBonusLabel;
        let setBonusTriggered = false;
        if (clickAdd) {
          const applied = addClickElementFlat(clickAdd, {
            id: `elements:${rarityId}:groupFlat:${index}`,
            label: resolvedLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.clickFlatTotal += applied;
            setBonusTriggered = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(resolvedLabel, `APC +${formatted}`, 'setBonus');
            }
          }
        }
        if (autoAdd) {
          const applied = addAutoElementFlat(autoAdd, {
            id: `elements:${rarityId}:groupFlat:${index}`,
            label: resolvedLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.autoFlatTotal += applied;
            setBonusTriggered = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(resolvedLabel, `APS +${formatted}`, 'setBonus');
            }
          }
        }
        if (uniqueClickAdd && uniqueCount > 0) {
          const totalUniqueClick = uniqueClickAdd * uniqueCount;
          const applied = addClickElementFlat(totalUniqueClick, {
            id: `elements:${rarityId}:groupUnique:${index}`,
            label: resolvedLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.clickFlatTotal += applied;
            setBonusTriggered = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(resolvedLabel, `APC +${formatted}`, 'setBonus');
            }
          }
        }
        if (uniqueAutoAdd && uniqueCount > 0) {
          const totalUniqueAuto = uniqueAutoAdd * uniqueCount;
          const applied = addAutoElementFlat(totalUniqueAuto, {
            id: `elements:${rarityId}:groupUnique:${index}`,
            label: resolvedLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.autoFlatTotal += applied;
            setBonusTriggered = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(resolvedLabel, `APS +${formatted}`, 'setBonus');
            }
          }
        }
        if (duplicateClickAdd && duplicateCount > 0) {
          const totalDuplicateClick = duplicateClickAdd * duplicateCount;
          const applied = addClickElementFlat(totalDuplicateClick, {
            id: `elements:${rarityId}:groupDuplicate:${index}`,
            label: resolvedLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.clickFlatTotal += applied;
            setBonusTriggered = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(resolvedLabel, `APC +${formatted}`, 'setBonus');
            }
          }
        }
        if (duplicateAutoAdd && duplicateCount > 0) {
          const totalDuplicateAuto = duplicateAutoAdd * duplicateCount;
          const applied = addAutoElementFlat(totalDuplicateAuto, {
            id: `elements:${rarityId}:groupDuplicate:${index}`,
            label: resolvedLabel,
            rarityId
          });
          if (Number.isFinite(applied) && applied !== 0) {
            summary.autoFlatTotal += applied;
            setBonusTriggered = true;
            const formatted = formatElementFlatBonus(applied);
            if (formatted) {
              addLabelEffect(resolvedLabel, `APS +${formatted}`, 'setBonus');
            }
          }
        }
        if (activeFlatMultiplierEntries.has(`${rarityId}:setBonus:${index}`)) {
          setBonusTriggered = true;
          if (Array.isArray(setBonusEntry.rarityFlatMultipliers)) {
            describeRarityFlatMultipliers(setBonusEntry.rarityFlatMultipliers).forEach(note => {
              addLabelNote(resolvedLabel, note, 'setBonus');
            });
          }
        }
        if (setBonusTriggered) {
          markLabelActive(resolvedLabel, 'setBonus');
        }
      });
    }

    if (groupConfig.multiplier) {
      const { base, every, increment, cap, targets, label: multiplierLabelOverride } = groupConfig.multiplier;
      let finalMultiplier = Number.isFinite(base) && base > 0 ? base : 1;
      if (copyCount > 0 && every > 0 && increment !== 0) {
        const steps = Math.floor(copyCount / every);
        if (steps > 0) {
          finalMultiplier += steps * increment;
        }
      }
      if (Number.isFinite(cap)) {
        finalMultiplier = Math.min(finalMultiplier, cap);
      }
      if (!Number.isFinite(finalMultiplier) || finalMultiplier <= 0) {
        finalMultiplier = 1;
      }
      const multiplierLabelResolved = multiplierLabelOverride || multiplierLabel;
      const appliedMultiplier = stellaireBoostActive
        ? finalMultiplier * stellaireSingularityBoost
        : finalMultiplier;
      let multiplierApplied = false;
      if (targets.has('perClick')) {
        clickRarityMultipliers.set(rarityId, appliedMultiplier);
        updateRarityMultiplierDetail(clickDetails.multipliers, multiplierDetailId, multiplierLabelResolved, appliedMultiplier);
        clickMultiplierValue = appliedMultiplier;
        multiplierApplied = multiplierApplied || Math.abs(appliedMultiplier - 1) > 1e-9;
      }
      if (targets.has('perSecond')) {
        autoRarityMultipliers.set(rarityId, appliedMultiplier);
        updateRarityMultiplierDetail(autoDetails.multipliers, multiplierDetailId, multiplierLabelResolved, appliedMultiplier);
        autoMultiplierValue = appliedMultiplier;
        multiplierApplied = multiplierApplied || Math.abs(appliedMultiplier - 1) > 1e-9;
      }
      if (multiplierApplied) {
        markLabelActive(multiplierLabelResolved, 'multiplier');
        const multiplierText = formatMultiplierTooltip(appliedMultiplier);
        if (multiplierText) {
          if (targets.has('perClick')) {
            addLabelEffect(multiplierLabelResolved, `APC ${multiplierText}`, 'multiplier');
          }
          if (targets.has('perSecond')) {
            addLabelEffect(multiplierLabelResolved, `APS ${multiplierText}`, 'multiplier');
          }
        }
      }
    }

    if (groupConfig.crit) {
      let critApplied = false;
      if (groupConfig.crit.perUnique) {
        applyRepeatedCritEffect(critAccumulator, groupConfig.crit.perUnique, uniqueCount);
        const chanceAdd = Number(groupConfig.crit.perUnique.chanceAdd) || 0;
        const multiplierAdd = Number(groupConfig.crit.perUnique.multiplierAdd) || 0;
        if (chanceAdd !== 0 && uniqueCount > 0) {
          summary.critChanceAdd += chanceAdd * uniqueCount;
          critApplied = true;
        }
        if (multiplierAdd !== 0 && uniqueCount > 0) {
          summary.critMultiplierAdd += multiplierAdd * uniqueCount;
          critApplied = true;
        }
      }
      if (groupConfig.crit.perDuplicate) {
        applyRepeatedCritEffect(critAccumulator, groupConfig.crit.perDuplicate, duplicateCount);
        const chanceAdd = Number(groupConfig.crit.perDuplicate.chanceAdd) || 0;
        const multiplierAdd = Number(groupConfig.crit.perDuplicate.multiplierAdd) || 0;
        if (chanceAdd !== 0 && duplicateCount > 0) {
          summary.critChanceAdd += chanceAdd * duplicateCount;
          critApplied = true;
        }
        if (multiplierAdd !== 0 && duplicateCount > 0) {
          summary.critMultiplierAdd += multiplierAdd * duplicateCount;
          critApplied = true;
        }
      }
      if (critApplied) {
        const critLabel = 'Critique';
        markLabelActive(critLabel, 'crit');
        const chanceText = formatElementCritChanceBonus(summary.critChanceAdd);
        if (chanceText) {
          addLabelEffect(critLabel, `Chance +${chanceText}`, 'crit');
        }
        const critMultiplierText = formatElementCritMultiplierBonus(summary.critMultiplierAdd);
        if (critMultiplierText) {
          addLabelEffect(critLabel, `Multiplicateur +${critMultiplierText}×`, 'crit');
        }
      }
    }

    if (groupConfig.rarityMultiplierBonus) {
      const {
        amount = 0,
        uniqueThreshold = 0,
        copyThreshold = 0,
        targets,
        label: bonusLabel
      } = groupConfig.rarityMultiplierBonus;
      if (amount !== 0) {
        const meetsUnique = uniqueThreshold > 0 ? uniqueCount >= uniqueThreshold : true;
        const meetsCopies = copyThreshold > 0 ? copyCount >= copyThreshold : true;
        if (meetsUnique && meetsCopies) {
          const resolvedLabel = bonusLabel || rarityMultiplierLabel;
          let labelApplied = false;
          if (targets.has('perClick')) {
            const current = Number(clickRarityMultipliers.get(rarityId)) || clickMultiplierValue || 1;
            const updated = Math.max(0, current + amount);
            clickRarityMultipliers.set(rarityId, updated);
            updateRarityMultiplierDetail(clickDetails.multipliers, multiplierDetailId, resolvedLabel, updated);
            clickMultiplierValue = updated;
            const display = formatMultiplierTooltip(updated);
            if (display) {
              addLabelEffect(resolvedLabel, `Multiplicateur de rareté APC ${display}`, 'rarityMultiplier');
              labelApplied = true;
            }
          }
          if (targets.has('perSecond')) {
            const current = Number(autoRarityMultipliers.get(rarityId)) || autoMultiplierValue || 1;
            const updated = Math.max(0, current + amount);
            autoRarityMultipliers.set(rarityId, updated);
            updateRarityMultiplierDetail(autoDetails.multipliers, multiplierDetailId, resolvedLabel, updated);
            autoMultiplierValue = updated;
            const display = formatMultiplierTooltip(updated);
            if (display) {
              addLabelEffect(resolvedLabel, `Multiplicateur de rareté APS ${display}`, 'rarityMultiplier');
              labelApplied = true;
            }
          }
          if (labelApplied) {
            markLabelActive(resolvedLabel, 'rarityMultiplier');
          }
        }
      }
    }

    if (rarityId === MYTHIQUE_RARITY_ID) {
      const labels = groupConfig?.labels || {};
      const resolveLabel = (key, fallback) => {
        const raw = typeof labels[key] === 'string' ? labels[key].trim() : '';
        return raw || fallback;
      };
      const ticketLabel = resolveLabel('ticketBonus', `${rarityLabel} · accélération quantique`);
      const offlineLabel = resolveLabel('offlineBonus', `${rarityLabel} · collecte hors ligne`);
      const overflowLabel = resolveLabel('duplicateOverflow', `${rarityLabel} · surcharge fractale`);
      const baseTicketSeconds = DEFAULT_TICKET_STAR_INTERVAL_SECONDS;
      const ticketSeconds = Math.max(
        MYTHIQUE_TICKET_MIN_INTERVAL_SECONDS,
        baseTicketSeconds - uniqueCount * MYTHIQUE_TICKET_UNIQUE_REDUCTION_SECONDS
      );
      mythiqueBonuses.ticketIntervalSeconds = ticketSeconds;
      summary.ticketIntervalSeconds = ticketSeconds;
      if (baseTicketSeconds - ticketSeconds > 1e-9) {
        markLabelActive(ticketLabel, 'ticket');
        const ticketText = formatElementTicketInterval(summary.ticketIntervalSeconds);
        if (ticketText) {
          addLabelEffect(ticketLabel, ticketText, 'ticket');
        }
      }

      const duplicates = duplicateCount;
      const multiplierDuplicates = Math.min(duplicates, MYTHIQUE_DUPLICATES_FOR_OFFLINE_CAP);
      const offlineMultiplier = Math.min(
        MYTHIQUE_OFFLINE_CAP,
        MYTHIQUE_OFFLINE_BASE + multiplierDuplicates * MYTHIQUE_OFFLINE_PER_DUPLICATE
      );
      mythiqueBonuses.offlineMultiplier = offlineMultiplier;
      summary.offlineMultiplier = offlineMultiplier;
      if (offlineMultiplier > MYTHIQUE_OFFLINE_BASE + 1e-9) {
        markLabelActive(offlineLabel, 'offline');
        const offlineText = formatMultiplierTooltip(offlineMultiplier);
        if (offlineText) {
          addLabelEffect(offlineLabel, `Collecte hors ligne ${offlineText}`, 'offline');
        }
      }

      const overflowDuplicates = Math.max(0, duplicates - MYTHIQUE_DUPLICATES_FOR_OFFLINE_CAP);
      summary.overflowDuplicates = overflowDuplicates;
      if (overflowDuplicates > 0) {
        const clickLabel = overflowLabel;
        const autoLabel = overflowLabel;
        const overflowClick = addClickElementFlat(
          MYTHIQUE_DUPLICATE_OVERFLOW_FLAT_BONUS * overflowDuplicates,
          {
            id: `elements:${rarityId}:overflow:click`,
            label: clickLabel,
            rarityId
          }
        );
        if (Number.isFinite(overflowClick) && overflowClick !== 0) {
          summary.clickFlatTotal += overflowClick;
          const formatted = formatElementFlatBonus(overflowClick);
          if (formatted) {
            addLabelEffect(overflowLabel, `APC +${formatted}`, 'overflow');
          }
        }
        const overflowAuto = addAutoElementFlat(
          MYTHIQUE_DUPLICATE_OVERFLOW_FLAT_BONUS * overflowDuplicates,
          {
            id: `elements:${rarityId}:overflow:auto`,
            label: autoLabel,
            rarityId
          }
        );
        if (Number.isFinite(overflowAuto) && overflowAuto !== 0) {
          summary.autoFlatTotal += overflowAuto;
          const formatted = formatElementFlatBonus(overflowAuto);
          if (formatted) {
            addLabelEffect(overflowLabel, `APS +${formatted}`, 'overflow');
          }
        }
        if (
          (Number.isFinite(overflowClick) && overflowClick !== 0)
          || (Number.isFinite(overflowAuto) && overflowAuto !== 0)
        ) {
          markLabelActive(overflowLabel, 'overflow');
        }
      } else {
        summary.overflowDuplicates = 0;
      }

      const frenzyMultiplier = summary.isComplete
        ? MYTHIQUE_FRENZY_SPAWN_BONUS_MULTIPLIER
        : 1;
      mythiqueBonuses.frenzyChanceMultiplier = frenzyMultiplier;
      summary.frenzyChanceMultiplier = frenzyMultiplier;
      if (frenzyMultiplier !== 1) {
        const frenzyLabel = resolveLabel('setBonus', `${rarityLabel} · convergence totale`);
        markLabelActive(frenzyLabel, 'frenzy');
        const frenzyText = formatMultiplierTooltip(frenzyMultiplier);
        if (frenzyText) {
          addLabelEffect(frenzyLabel, `Chance de frénésie ${frenzyText}`, 'frenzy');
        }
      }
    }

    if (
      stellaireBoostActive
      && (
        copyCount > 0
        || Math.abs((clickMultiplierValue ?? 1) - 1) > 1e-9
        || Math.abs((autoMultiplierValue ?? 1) - 1) > 1e-9
      )
    ) {
      markLabelActive(STELLAIRE_SINGULARITY_BONUS_LABEL, 'synergy');
      const singularityText = formatMultiplierTooltip(stellaireSingularityBoost);
      if (singularityText) {
        addLabelNote(STELLAIRE_SINGULARITY_BONUS_LABEL, `Singularité amplifiée : effets ${singularityText}`, 'synergy');
      }
    }

    summary.multiplierPerClick = clickMultiplierValue;
    summary.multiplierPerSecond = autoMultiplierValue;
    summary.isComplete = totalUnique > 0 && uniqueCount >= totalUnique;
    const labelEntries = [];
    activeLabelDetails.forEach(entry => {
      if (!entry || !entry.label) return;
      const effects = Array.isArray(entry.effects)
        ? entry.effects.filter(text => typeof text === 'string' && text.trim().length > 0)
        : [];
      const notes = Array.isArray(entry.notes)
        ? entry.notes.filter(text => typeof text === 'string' && text.trim().length > 0)
        : [];
      const descriptionParts = [];
      if (effects.length) {
        descriptionParts.push(effects.join(' · '));
      }
      notes.forEach(note => descriptionParts.push(note));
      const labelEntry = { label: entry.label };
      if (effects.length) {
        labelEntry.effects = effects;
      }
      if (notes.length) {
        labelEntry.notes = notes;
      }
      if (entry.types instanceof Set && entry.types.size) {
        labelEntry.types = Array.from(entry.types);
      } else if (Array.isArray(entry.types) && entry.types.length) {
        labelEntry.types = [...entry.types];
      }
      if (descriptionParts.length) {
        labelEntry.description = descriptionParts.join(' · ');
      }
      labelEntries.push(labelEntry);
    });
    summary.activeLabels = labelEntries;
    elementGroupSummaries.set(rarityId, summary);
  });

  if (ELEMENT_FAMILY_CONFIG.size > 0) {
    ELEMENT_FAMILY_CONFIG.forEach((familyConfig, familyId) => {
      const counts = elementCountsByFamily.get(familyId) || { copies: 0, unique: 0, active: 0 };
      const copyCount = Math.max(0, Number(counts.copies) || 0);
      const uniqueCount = Math.max(0, Number(counts.unique) || 0);
      const activeCount = Math.max(0, Number(counts.active) || 0);
      const duplicateCount = Math.max(0, copyCount - uniqueCount);
      const totalUnique = getFamilyPoolSize(familyId);
      const label = normalizeLabel(familyConfig.label) || CATEGORY_LABELS[familyId] || familyId;
      const summary = {
        type: 'family',
        familyId,
        label,
        copies: copyCount,
        uniques: uniqueCount,
        duplicates: duplicateCount,
        totalUnique,
        activeCopies: activeCount,
        isComplete: totalUnique > 0 && uniqueCount >= totalUnique,
        clickFlatTotal: 0,
        autoFlatTotal: 0,
        multiplierPerClick: 1,
        multiplierPerSecond: 1,
        critChanceAdd: 0,
        critMultiplierAdd: 0,
        activeLabels: [],
        ticketIntervalSeconds: null,
        offlineMultiplier: 1,
        frenzyChanceMultiplier: 1,
        overflowDuplicates: 0
      };

      const activeLabelDetails = new Map();
      const normalizeLabelKey = value => {
        if (typeof value !== 'string') return '';
        return value.trim();
      };
      const ensureActiveLabel = (labelText, type = null) => {
        const key = normalizeLabelKey(labelText);
        if (!key) return null;
        if (!activeLabelDetails.has(key)) {
          activeLabelDetails.set(key, {
            label: key,
            effects: [],
            notes: [],
            types: new Set()
          });
        }
        const entry = activeLabelDetails.get(key);
        if (type) {
          entry.types.add(type);
        }
        return entry;
      };
      const addLabelEffect = (labelText, effectText, type = null) => {
        if (!effectText) return;
        const entry = ensureActiveLabel(labelText, type);
        if (!entry) return;
        if (!entry.effects.includes(effectText)) {
          entry.effects.push(effectText);
        }
      };
      const addLabelNote = (labelText, noteText, type = null) => {
        if (!noteText) return;
        const entry = ensureActiveLabel(labelText, type);
        if (!entry) return;
        if (!entry.notes.includes(noteText)) {
          entry.notes.push(noteText);
        }
      };
      const markLabelActive = (labelText, type = null) => {
        ensureActiveLabel(labelText, type);
      };

      if (summary.isComplete) {
        const bonuses = Array.isArray(familyConfig.bonuses) ? familyConfig.bonuses : [];
        bonuses.forEach((bonus, index) => {
          if (!bonus || typeof bonus !== 'object') {
            return;
          }
          const effectLabel = normalizeLabel(bonus.label) || label;
          const effectIdBase = typeof bonus.id === 'string' && bonus.id.trim()
            ? bonus.id.trim()
            : `${familyId}:bonus:${index + 1}`;
          const effects = bonus.effects && typeof bonus.effects === 'object' ? bonus.effects : {};
          let bonusApplied = false;

          if (typeof bonus.description === 'string' && bonus.description.trim()) {
            addLabelNote(effectLabel, bonus.description.trim(), 'description');
          }
          if (Array.isArray(bonus.notes)) {
            bonus.notes.forEach(note => {
              if (typeof note === 'string' && note.trim()) {
                addLabelNote(effectLabel, note.trim(), 'note');
              }
            });
          }

          if (effects.clickAdd != null) {
            const applied = addClickElementFlat(effects.clickAdd, {
              id: `family:${effectIdBase}:clickAdd`,
              label: effectLabel,
              rarityId: null,
              source: 'family'
            });
            if (Number.isFinite(applied) && applied !== 0) {
              summary.clickFlatTotal += applied;
              bonusApplied = true;
              const formatted = formatElementFlatBonus(applied);
              if (formatted) {
                addLabelEffect(effectLabel, `APC +${formatted}`, 'flat');
              }
            }
          }

          if (effects.autoAdd != null) {
            const applied = addAutoElementFlat(effects.autoAdd, {
              id: `family:${effectIdBase}:autoAdd`,
              label: effectLabel,
              rarityId: null,
              source: 'family'
            });
            if (Number.isFinite(applied) && applied !== 0) {
              summary.autoFlatTotal += applied;
              bonusApplied = true;
              const formatted = formatElementFlatBonus(applied);
              if (formatted) {
                addLabelEffect(effectLabel, `APS +${formatted}`, 'flat');
              }
            }
          }

          if (effects.clickMult != null) {
            const applied = applyFamilyMultiplier('perClick', effects.clickMult, {
              id: `family:${effectIdBase}:clickMult`,
              label: effectLabel
            });
            if (Number.isFinite(applied) && Math.abs(applied - 1) > 1e-9) {
              summary.multiplierPerClick *= applied;
              bonusApplied = true;
              const formatted = formatMultiplierTooltip(applied);
              if (formatted) {
                addLabelEffect(effectLabel, `APC ${formatted}`, 'multiplier');
              }
            }
          }

          if (effects.autoMult != null) {
            const applied = applyFamilyMultiplier('perSecond', effects.autoMult, {
              id: `family:${effectIdBase}:autoMult`,
              label: effectLabel
            });
            if (Number.isFinite(applied) && Math.abs(applied - 1) > 1e-9) {
              summary.multiplierPerSecond *= applied;
              bonusApplied = true;
              const formatted = formatMultiplierTooltip(applied);
              if (formatted) {
                addLabelEffect(effectLabel, `APS ${formatted}`, 'multiplier');
              }
            }
          }

          const nestedCrit = effects.crit && typeof effects.crit === 'object' ? effects.crit : null;
          const resolveCritValue = (primary, nestedKeys = []) => {
            if (primary != null) {
              const numeric = Number(primary);
              return Number.isFinite(numeric) ? numeric : null;
            }
            if (!nestedCrit) {
              return null;
            }
            for (const key of nestedKeys) {
              if (!(key in nestedCrit)) continue;
              const value = Number(nestedCrit[key]);
              if (Number.isFinite(value)) {
                return value;
              }
            }
            return null;
          };

          const critChanceAdd = resolveCritValue(effects.critChanceAdd, ['chanceAdd', 'add', 'bonus']);
          if (critChanceAdd != null && critChanceAdd !== 0) {
            summary.critChanceAdd += critChanceAdd;
            bonusApplied = true;
            const formatted = formatElementCritChanceBonus(critChanceAdd);
            if (formatted) {
              addLabelEffect(effectLabel, `Chance +${formatted}`, 'crit');
            }
          }
          const critMultiplierAdd = resolveCritValue(effects.critMultiplierAdd, ['multiplierAdd', 'powerAdd']);
          if (critMultiplierAdd != null && critMultiplierAdd !== 0) {
            summary.critMultiplierAdd += critMultiplierAdd;
            bonusApplied = true;
            const formatted = formatElementCritMultiplierBonus(critMultiplierAdd);
            if (formatted) {
              addLabelEffect(effectLabel, `Multiplicateur +${formatted}×`, 'crit');
            }
          }

          const critChanceMult = resolveCritValue(effects.critChanceMult, ['chanceMult', 'multiplier']);
          if (critChanceMult != null && Math.abs(critChanceMult - 1) > 1e-9) {
            bonusApplied = true;
            const formatted = formatMultiplierTooltip(critChanceMult);
            if (formatted) {
              addLabelEffect(effectLabel, `Chance ${formatted}`, 'crit');
            }
          }
          const critMultiplierMult = resolveCritValue(effects.critMultiplierMult, ['multiplierMult', 'powerMult']);
          if (critMultiplierMult != null && Math.abs(critMultiplierMult - 1) > 1e-9) {
            bonusApplied = true;
            const formatted = formatMultiplierTooltip(critMultiplierMult);
            if (formatted) {
              addLabelEffect(effectLabel, `Multiplicateur ${formatted}`, 'crit');
            }
          }
          const critChanceSet = resolveCritValue(effects.critChanceSet, ['chanceSet', 'set']);
          if (critChanceSet != null && critChanceSet > 0) {
            bonusApplied = true;
            const formatted = formatElementCritChanceBonus(critChanceSet);
            if (formatted) {
              addLabelNote(effectLabel, `Chance fixée à ${formatted}`, 'crit');
            }
          }
          const critMultiplierSet = resolveCritValue(effects.critMultiplierSet, ['multiplierSet', 'powerSet']);
          if (critMultiplierSet != null && critMultiplierSet > 0) {
            bonusApplied = true;
            const formatted = formatElementCritMultiplierBonus(critMultiplierSet);
            if (formatted) {
              addLabelNote(effectLabel, `Multiplicateur fixé à ${formatted}×`, 'crit');
            }
          }
          const critMaxMultiplierAdd = resolveCritValue(effects.critMaxMultiplierAdd, ['maxMultiplierAdd', 'capAdd']);
          if (critMaxMultiplierAdd != null && critMaxMultiplierAdd !== 0) {
            bonusApplied = true;
            const formatted = formatElementCritMultiplierBonus(critMaxMultiplierAdd);
            if (formatted) {
              addLabelNote(effectLabel, `Plafond critique +${formatted}×`, 'crit');
            }
          }
          const critMaxMultiplierMult = resolveCritValue(effects.critMaxMultiplierMult, ['maxMultiplierMult', 'capMult']);
          if (critMaxMultiplierMult != null && Math.abs(critMaxMultiplierMult - 1) > 1e-9) {
            bonusApplied = true;
            const formatted = formatMultiplierTooltip(critMaxMultiplierMult);
            if (formatted) {
              addLabelNote(effectLabel, `Plafond critique ${formatted}`, 'crit');
            }
          }
          const critMaxMultiplierSet = resolveCritValue(effects.critMaxMultiplierSet, ['maxMultiplierSet', 'capSet']);
          if (critMaxMultiplierSet != null && critMaxMultiplierSet > 0) {
            bonusApplied = true;
            const formatted = formatElementCritMultiplierBonus(critMaxMultiplierSet);
            if (formatted) {
              addLabelNote(effectLabel, `Plafond critique fixé à ${formatted}×`, 'crit');
            }
          }

          const hasCritEffect = (
            effects.critChanceAdd != null
            || effects.critChanceMult != null
            || effects.critChanceSet != null
            || effects.critMultiplierAdd != null
            || effects.critMultiplierMult != null
            || effects.critMultiplierSet != null
            || effects.critMaxMultiplierAdd != null
            || effects.critMaxMultiplierMult != null
            || effects.critMaxMultiplierSet != null
            || (nestedCrit && Object.keys(nestedCrit).length > 0)
          );
          if (hasCritEffect) {
            applyCritModifiersFromEffect(critAccumulator, effects);
          }

          if (bonusApplied) {
            markLabelActive(effectLabel);
          }
        });
      }

      const labelEntries = [];
      activeLabelDetails.forEach(entry => {
        if (!entry || !entry.label) return;
        const effects = Array.isArray(entry.effects)
          ? entry.effects.filter(text => typeof text === 'string' && text.trim().length > 0)
          : [];
        const notes = Array.isArray(entry.notes)
          ? entry.notes.filter(text => typeof text === 'string' && text.trim().length > 0)
          : [];
        const descriptionParts = [];
        if (effects.length) {
          descriptionParts.push(effects.join(' · '));
        }
        notes.forEach(note => descriptionParts.push(note));
        const labelEntry = { label: entry.label };
        if (effects.length) {
          labelEntry.effects = effects;
        }
        if (notes.length) {
          labelEntry.notes = notes;
        }
        if (entry.types instanceof Set && entry.types.size) {
          labelEntry.types = Array.from(entry.types);
        } else if (Array.isArray(entry.types) && entry.types.length) {
          labelEntry.types = [...entry.types];
        }
        if (descriptionParts.length) {
          labelEntry.description = descriptionParts.join(' · ');
        }
        labelEntries.push(labelEntry);
      });
      summary.activeLabels = labelEntries;
      familySummaries.set(familyId, summary);
    });
  }

  const intervalChanged = setTicketStarAverageIntervalSeconds(mythiqueBonuses.ticketIntervalSeconds);
  if (intervalChanged && !ticketStarState.active) {
    resetTicketStarState({ reschedule: true });
  }
  gameState.offlineGainMultiplier = mythiqueBonuses.offlineMultiplier;
  const frenzyBonus = {
    perClick: mythiqueBonuses.frenzyChanceMultiplier,
    perSecond: mythiqueBonuses.frenzyChanceMultiplier
  };
  gameState.frenzySpawnBonus = frenzyBonus;
  applyFrenzySpawnChanceBonus(frenzyBonus);

  const elementBonusSummary = {};
  elementGroupSummaries.forEach((value, key) => {
    elementBonusSummary[key] = value;
  });
  if (familySummaries.size > 0) {
    const familySummaryStore = {};
    familySummaries.forEach((value, key) => {
      familySummaryStore[key] = value;
    });
    if (Object.keys(familySummaryStore).length > 0) {
      elementBonusSummary.families = familySummaryStore;
    }
  }
  gameState.elementBonusSummary = elementBonusSummary;

  const trophyEffects = computeTrophyEffects();
  const clickTrophyMultiplier = trophyEffects.clickMultiplier instanceof LayeredNumber
    ? trophyEffects.clickMultiplier.clone()
    : toMultiplierLayered(trophyEffects.clickMultiplier ?? 1);
  const autoTrophyMultiplier = trophyEffects.autoMultiplier instanceof LayeredNumber
    ? trophyEffects.autoMultiplier.clone()
    : toMultiplierLayered(trophyEffects.autoMultiplier ?? 1);
  if (trophyEffects.critEffect) {
    applyCritModifiersFromEffect(critAccumulator, trophyEffects.critEffect);
  }
  const autoCollectConfig = normalizeTicketStarAutoCollectConfig(trophyEffects.ticketStarAutoCollect);
  gameState.ticketStarAutoCollect = autoCollectConfig
    ? { delaySeconds: Math.max(0, Number(autoCollectConfig.delaySeconds) || 0) }
    : null;

  UPGRADE_DEFS.forEach(def => {
    const level = getUpgradeLevel(gameState.upgrades, def.id);
    if (!level) return;
    const effects = def.effect(level, gameState.upgrades);

    if (effects.clickAdd != null) {
      const value = normalizeProductionUnit(effects.clickAdd);
      if (!value.isZero()) {
        clickShopAddition = clickShopAddition.add(value);
        clickDetails.additions.push({ id: def.id, label: def.name, level, value: value.clone(), source: 'shop' });
      }
    }

    if (effects.autoAdd != null) {
      const value = normalizeProductionUnit(effects.autoAdd);
      if (!value.isZero()) {
        autoShopAddition = autoShopAddition.add(value);
        autoDetails.additions.push({ id: def.id, label: def.name, level, value: value.clone(), source: 'shop' });
      }
    }

    if (effects.clickMult != null) {
      const multiplierValue = toMultiplierLayered(effects.clickMult);
      const targetSlot = clickSlotMap.get(def.id) || PRODUCTION_MULTIPLIER_SLOT_FALLBACK.perClick;
      if (targetSlot && clickMultiplierSlots[targetSlot]) {
        clickMultiplierSlots[targetSlot] = clickMultiplierSlots[targetSlot].multiply(multiplierValue);
      }
      if (!isLayeredOne(multiplierValue)) {
        clickDetails.multipliers.push({
          id: def.id,
          label: def.name,
          level,
          value: multiplierValue.clone(),
          source: 'shop'
        });
      }
    }

    if (effects.autoMult != null) {
      const multiplierValue = toMultiplierLayered(effects.autoMult);
      const targetSlot = autoSlotMap.get(def.id) || PRODUCTION_MULTIPLIER_SLOT_FALLBACK.perSecond;
      if (targetSlot && autoMultiplierSlots[targetSlot]) {
        autoMultiplierSlots[targetSlot] = autoMultiplierSlots[targetSlot].multiply(multiplierValue);
      }
      if (!isLayeredOne(multiplierValue)) {
        autoDetails.multipliers.push({
          id: def.id,
          label: def.name,
          level,
          value: multiplierValue.clone(),
          source: 'shop'
        });
      }
    }
    applyCritModifiersFromEffect(critAccumulator, effects);
  });

  if (FUSION_DEFS.length) {
    const fusionBonusState = getFusionBonusState();
    const fusionLabel = 'Fusions moléculaires';
    const apcBonus = Number(fusionBonusState.apcFlat);
    if (Number.isFinite(apcBonus) && apcBonus !== 0) {
      const value = new LayeredNumber(apcBonus);
      if (!value.isZero()) {
        clickFusionAddition = clickFusionAddition.add(value);
        clickDetails.additions.push({
          id: 'fusion:perClick',
          label: fusionLabel,
          value: value.clone(),
          source: 'fusion'
        });
      }
    }
    const apsBonus = Number(fusionBonusState.apsFlat);
    if (Number.isFinite(apsBonus) && apsBonus !== 0) {
      const value = new LayeredNumber(apsBonus);
      if (!value.isZero()) {
        autoFusionAddition = autoFusionAddition.add(value);
        autoDetails.additions.push({
          id: 'fusion:perSecond',
          label: fusionLabel,
          value: value.clone(),
          source: 'fusion'
        });
      }
    }
  }

  clickDetails.sources.flats.shopFlat = clickShopAddition.clone();
  autoDetails.sources.flats.shopFlat = autoShopAddition.clone();
  clickDetails.sources.flats.elementFlat = clickElementAddition.clone();
  autoDetails.sources.flats.elementFlat = autoElementAddition.clone();
  clickDetails.sources.flats.fusionFlat = clickFusionAddition.clone();
  autoDetails.sources.flats.fusionFlat = autoFusionAddition.clone();
  const devkitAutoFlat = getDevKitAutoFlatBonus();
  if (devkitAutoFlat instanceof LayeredNumber && !devkitAutoFlat.isZero()) {
    autoDetails.sources.flats.devkitFlat = devkitAutoFlat.clone();
    autoDetails.additions.push({
      id: 'devkit-auto-flat',
      label: DEVKIT_AUTO_LABEL,
      value: devkitAutoFlat.clone(),
      source: 'devkit'
    });
  } else {
    autoDetails.sources.flats.devkitFlat = LayeredNumber.zero();
  }

  clickDetails.sources.multipliers.shopBonus1 = clickMultiplierSlots.shopBonus1.clone();
  clickDetails.sources.multipliers.shopBonus2 = clickMultiplierSlots.shopBonus2.clone();
  autoDetails.sources.multipliers.shopBonus1 = autoMultiplierSlots.shopBonus1.clone();
  autoDetails.sources.multipliers.shopBonus2 = autoMultiplierSlots.shopBonus2.clone();
  clickDetails.sources.multipliers.trophyMultiplier = clickTrophyMultiplier.clone();
  autoDetails.sources.multipliers.trophyMultiplier = autoTrophyMultiplier.clone();
  clickDetails.sources.multipliers.familyMultiplier = familyMultipliers.perClick.clone();
  autoDetails.sources.multipliers.familyMultiplier = familyMultipliers.perSecond.clone();

  const clickShopBonus1 = clickDetails.sources.multipliers.shopBonus1;
  const clickShopBonus2 = clickDetails.sources.multipliers.shopBonus2;
  const autoShopBonus1 = autoDetails.sources.multipliers.shopBonus1;
  const autoShopBonus2 = autoDetails.sources.multipliers.shopBonus2;
  const clickFamilyMultiplier = clickDetails.sources.multipliers.familyMultiplier;
  const autoFamilyMultiplier = autoDetails.sources.multipliers.familyMultiplier;

  const clickRarityProduct = computeRarityMultiplierProduct(clickRarityMultipliers);
  const autoRarityProduct = computeRarityMultiplierProduct(autoRarityMultipliers);

  const clickTotalAddition = clickShopAddition
    .add(clickElementAddition)
    .add(clickFusionAddition);
  let autoTotalAddition = autoShopAddition
    .add(autoElementAddition)
    .add(autoFusionAddition);
  if (devkitAutoFlat instanceof LayeredNumber && !devkitAutoFlat.isZero()) {
    autoTotalAddition = autoTotalAddition.add(devkitAutoFlat);
  }

  clickDetails.totalAddition = clickTotalAddition.clone();
  autoDetails.totalAddition = autoTotalAddition.clone();

  const clickTotalMultiplier = LayeredNumber.one()
    .multiply(clickShopBonus1)
    .multiply(clickShopBonus2)
    .multiply(clickFamilyMultiplier)
    .multiply(clickRarityProduct)
    .multiply(clickTrophyMultiplier);
  let autoTotalMultiplier = LayeredNumber.one()
    .multiply(autoShopBonus1)
    .multiply(autoShopBonus2)
    .multiply(autoFamilyMultiplier)
    .multiply(autoRarityProduct)
    .multiply(autoTrophyMultiplier);

  const apsCritMultiplierValue = getApsCritMultiplier();
  const apsCritMultiplier = toMultiplierLayered(apsCritMultiplierValue);
  const hasApsCritMultiplier = !isLayeredOne(apsCritMultiplier);
  if (hasApsCritMultiplier) {
    autoTotalMultiplier = autoTotalMultiplier.multiply(apsCritMultiplier);
  }

  clickDetails.totalMultiplier = clickTotalMultiplier.clone();
  autoDetails.totalMultiplier = autoTotalMultiplier.clone();

  const clickFlatBase = clickDetails.sources.flats.baseFlat
    .add(clickDetails.sources.flats.shopFlat)
    .add(clickDetails.sources.flats.elementFlat)
    .add(clickDetails.sources.flats.fusionFlat || LayeredNumber.zero());
  const autoFlatBase = autoDetails.sources.flats.baseFlat
    .add(autoDetails.sources.flats.shopFlat)
    .add(autoDetails.sources.flats.elementFlat)
    .add(autoDetails.sources.flats.fusionFlat || LayeredNumber.zero())
    .add(autoDetails.sources.flats.devkitFlat || LayeredNumber.zero());

  let perClick = clickFlatBase.clone();
  perClick = perClick.multiply(clickShopBonus1);
  perClick = perClick.multiply(clickShopBonus2);
  perClick = perClick.multiply(clickFamilyMultiplier);
  perClick = perClick.multiply(clickRarityProduct);
  perClick = perClick.multiply(clickTrophyMultiplier);
  if (perClick.compare(LayeredNumber.zero()) < 0) {
    perClick = LayeredNumber.zero();
  }
  let perSecond = autoFlatBase.clone();
  perSecond = perSecond.multiply(autoShopBonus1);
  perSecond = perSecond.multiply(autoShopBonus2);
  perSecond = perSecond.multiply(autoFamilyMultiplier);
  perSecond = perSecond.multiply(autoRarityProduct);
  perSecond = perSecond.multiply(autoTrophyMultiplier);
  if (hasApsCritMultiplier) {
    perSecond = perSecond.multiply(apsCritMultiplier);
    autoDetails.multipliers.push({
      id: 'apsCrit',
      label: 'Critique APS',
      value: apsCritMultiplier.clone(),
      source: 'metaux'
    });
  }
  autoDetails.sources.multipliers.apsCrit = hasApsCritMultiplier
    ? apsCritMultiplier.clone()
    : LayeredNumber.one();

  perClick = normalizeProductionUnit(perClick);
  perSecond = normalizeProductionUnit(perSecond);

  clickDetails.total = perClick.clone();
  autoDetails.total = perSecond.clone();
  gameState.basePerClick = perClick.clone();
  gameState.basePerSecond = perSecond.clone();
  gameState.productionBase = { perClick: clickDetails, perSecond: autoDetails };

  const baseCritState = resolveCritState(critAccumulator);
  gameState.baseCrit = baseCritState;
  gameState.crit = cloneCritState(baseCritState);

  applyFrenzyEffects();
}

LayeredNumber.prototype.addNumber = function (num) {
  return this.add(new LayeredNumber(num));
};

function buildShopItem(def) {
  const item = document.createElement('article');
  item.className = 'shop-item';
  item.dataset.upgradeId = def.id;
  item.setAttribute('role', 'listitem');

  const header = document.createElement('header');
  header.className = 'shop-item__header';

  const title = document.createElement('h3');
  title.textContent = def.name;

  const level = document.createElement('span');
  level.className = 'shop-item__level';

  header.append(title, level);

  const desc = document.createElement('p');
  desc.className = 'shop-item__description';
  desc.textContent = def.effectSummary || def.description || '';

  const actions = document.createElement('div');
  actions.className = 'shop-item__actions';
  const buttonMap = new Map();

  SHOP_PURCHASE_AMOUNTS.forEach(quantity => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'shop-item__action';

    const quantityLabel = document.createElement('span');
    quantityLabel.className = 'shop-item__action-quantity';
    quantityLabel.textContent = `x${quantity}`;

    const priceLabel = document.createElement('span');
    priceLabel.className = 'shop-item__action-price';
    priceLabel.textContent = '—';

    button.append(quantityLabel, priceLabel);
    button.addEventListener('click', () => {
      attemptPurchase(def, quantity);
    });

    actions.appendChild(button);
    buttonMap.set(quantity, {
      button,
      price: priceLabel,
      quantityLabel,
      baseQuantity: quantity
    });
  });

  item.append(header, desc, actions);

  return { root: item, level, description: desc, buttons: buttonMap };
}

function updateShopVisibility() {
  if (!shopRows.size) return;
  const unlocks = getShopUnlockSet();

  let visibleLimit = -1;
  unlocks.forEach(id => {
    const unlockIndex = UPGRADE_INDEX_MAP.get(id);
    if (unlockIndex != null && unlockIndex > visibleLimit) {
      visibleLimit = unlockIndex;
    }
  });
  if (visibleLimit < 0 && UPGRADE_DEFS.length > 0) {
    visibleLimit = 0;
  }

  UPGRADE_DEFS.forEach((def, index) => {
    const row = shopRows.get(def.id);
    if (!row) return;

    const shouldReveal = index <= visibleLimit;
    row.root.hidden = !shouldReveal;
    row.root.classList.toggle('shop-item--locked', !shouldReveal);
    if (shouldReveal) {
      unlocks.add(def.id);
    }
  });
}

function updateShopAffordability() {
  if (!shopRows.size) return;
  UPGRADE_DEFS.forEach(def => {
    const row = shopRows.get(def.id);
    if (!row) return;
    const level = getUpgradeLevel(gameState.upgrades, def.id);
    const maxLevel = resolveUpgradeMaxLevel(def);
    const remainingLevels = getRemainingUpgradeCapacity(def);
    const hasFiniteCap = Number.isFinite(maxLevel);
    const capReached = Number.isFinite(remainingLevels) && remainingLevels <= 0;
    if (hasFiniteCap) {
      const baseLabel = `Niveau ${level} / ${maxLevel}`;
      row.level.textContent = capReached ? `${baseLabel} (max)` : baseLabel;
    } else {
      row.level.textContent = `Niveau ${level}`;
    }
    let anyAffordable = false;
    const actionLabel = level > 0 ? 'Améliorer' : 'Acheter';
    const shopFree = isDevKitShopFree();

    SHOP_PURCHASE_AMOUNTS.forEach(quantity => {
      const entry = row.buttons.get(quantity);
      if (!entry) return;
      const baseQuantity = entry.baseQuantity ?? quantity;

      if (capReached) {
        entry.quantityLabel.textContent = `x${baseQuantity}`;
        entry.price.textContent = 'Limite atteinte';
        entry.button.disabled = true;
        entry.button.classList.remove('is-ready');
        const ariaLabel = `${def.name} a atteint son niveau maximum`;
        entry.button.setAttribute('aria-label', ariaLabel);
        entry.button.title = ariaLabel;
        return;
      }

      const effectiveQuantity = Number.isFinite(remainingLevels)
        ? Math.min(baseQuantity, remainingLevels)
        : baseQuantity;
      const limited = Number.isFinite(remainingLevels) && effectiveQuantity !== baseQuantity;

      entry.quantityLabel.textContent = `x${limited ? effectiveQuantity : baseQuantity}`;

      const cost = computeUpgradeCost(def, effectiveQuantity);
      const affordable = shopFree || gameState.atoms.compare(cost) >= 0;
      let priceText;
      if (shopFree) {
        priceText = 'Gratuit';
      } else if (limited) {
        priceText = `Limité à x${effectiveQuantity} — ${formatShopCost(cost)}`;
      } else {
        priceText = formatShopCost(cost);
      }
      entry.price.textContent = priceText;
      const enabled = affordable && effectiveQuantity > 0;
      entry.button.disabled = !enabled;
      entry.button.classList.toggle('is-ready', enabled);
      if (enabled) {
        anyAffordable = true;
      }
      const displayQuantity = limited ? effectiveQuantity : baseQuantity;
      const limitNote = limited ? ' (limité aux niveaux restants)' : '';
      const ariaLabel = enabled
        ? shopFree
          ? `${actionLabel} ${def.name} ×${displayQuantity}${limitNote} (gratuit)`
          : `${actionLabel} ${def.name} ×${displayQuantity}${limitNote} (coût ${cost.toString()} atomes)`
        : `${actionLabel} ${def.name} ×${displayQuantity}${limitNote} (atomes insuffisants)`;
      entry.button.setAttribute('aria-label', ariaLabel);
      entry.button.title = ariaLabel;
    });

    row.root.classList.toggle('shop-item--ready', anyAffordable);
  });
  updateShopVisibility();
}

function renderShop() {
  if (!elements.shopList) return;
  shopRows.clear();
  elements.shopList.innerHTML = '';
  const fragment = document.createDocumentFragment();
  UPGRADE_DEFS.forEach(def => {
    const row = buildShopItem(def);
    fragment.appendChild(row.root);
    shopRows.set(def.id, row);
  });
  elements.shopList.appendChild(fragment);
  updateShopAffordability();
}

function buildGoalCard(def) {
  const card = document.createElement('article');
  card.className = 'goal-card';
  card.dataset.trophyId = def.id;
  card.setAttribute('role', 'listitem');
  card.classList.add('goal-card--locked');
  card.hidden = true;
  card.setAttribute('aria-hidden', 'true');

  const header = document.createElement('header');
  header.className = 'goal-card__header';

  const title = document.createElement('h3');
  title.textContent = def.name;
  title.className = 'goal-card__title';

  header.append(title);

  const description = document.createElement('p');
  description.className = 'goal-card__description';
  description.textContent = def.description || '';

  card.append(header, description);

  if (def.rewardText) {
    const reward = document.createElement('p');
    reward.className = 'goal-card__reward';
    reward.textContent = def.rewardText;
    card.appendChild(reward);
  }

  return { root: card };
}

function renderGoals() {
  if (!elements.goalsList) return;
  trophyCards.clear();
  elements.goalsList.innerHTML = '';
  if (!TROPHY_DEFS.length) {
    if (elements.goalsEmpty) {
      elements.goalsEmpty.hidden = false;
    }
    return;
  }
  const fragment = document.createDocumentFragment();
  TROPHY_DEFS.forEach(def => {
    const card = buildGoalCard(def);
    trophyCards.set(def.id, card);
    fragment.appendChild(card.root);
  });
  elements.goalsList.appendChild(fragment);
  updateGoalsUI();
}

function attemptPurchase(def, quantity = 1) {
  const buyAmount = Math.max(1, Math.floor(Number(quantity) || 0));
  const remainingLevels = getRemainingUpgradeCapacity(def);
  const cappedOut = Number.isFinite(remainingLevels) && remainingLevels <= 0;
  if (cappedOut) {
    showToast('Niveau maximum atteint.');
    return;
  }
  const finalAmount = Number.isFinite(remainingLevels)
    ? Math.min(buyAmount, remainingLevels)
    : buyAmount;
  if (!Number.isFinite(finalAmount) || finalAmount <= 0) {
    showToast('Niveau maximum atteint.');
    return;
  }
  const cost = computeUpgradeCost(def, finalAmount);
  const shopFree = isDevKitShopFree();
  if (!shopFree && gameState.atoms.compare(cost) < 0) {
    showToast('Pas assez d’atomes.');
    return;
  }
  if (!shopFree) {
    gameState.atoms = gameState.atoms.subtract(cost);
  }
  const currentLevel = Number(gameState.upgrades[def.id]);
  const normalizedLevel = Number.isFinite(currentLevel) && currentLevel > 0
    ? Math.floor(currentLevel)
    : 0;
  gameState.upgrades[def.id] = normalizedLevel + finalAmount;
  recalcProduction();
  updateUI();
  const limitSuffix = finalAmount < buyAmount ? ' (limite atteinte)' : '';
  showToast(shopFree
    ? `DevKit : "${def.name}" ×${finalAmount} débloqué gratuitement !${limitSuffix}`
    : `Amélioration "${def.name}" x${finalAmount} achetée !${limitSuffix}`);
}

function updateMilestone() {
  if (!elements.nextMilestone) return;
  for (const milestone of milestoneList) {
    if (gameState.lifetime.compare(milestone.amount) < 0) {
      elements.nextMilestone.textContent = milestone.text;
      return;
    }
  }
  elements.nextMilestone.textContent = 'Continuez à explorer des ordres de grandeur toujours plus vastes !';
}

function updateGoalsUI() {
  if (!elements.goalsList || !trophyCards.size) return;
  const unlocked = getUnlockedTrophySet();
  let visibleCount = 0;
  TROPHY_DEFS.forEach(def => {
    const card = trophyCards.get(def.id);
    if (!card) return;
    const isUnlocked = unlocked.has(def.id);
    card.root.classList.toggle('goal-card--completed', isUnlocked);
    card.root.classList.toggle('goal-card--locked', !isUnlocked);
    card.root.hidden = !isUnlocked;
    card.root.setAttribute('aria-hidden', String(!isUnlocked));
    if (isUnlocked) {
      visibleCount += 1;
    }
  });
  if (elements.goalsEmpty) {
    elements.goalsEmpty.hidden = visibleCount > 0;
  }
}

function updateFrenzyIndicatorFor(type, targetElement, now) {
  if (!targetElement) return;
  const entry = frenzyState[type];
  if (!entry) {
    targetElement.hidden = true;
    targetElement.textContent = '';
    delete targetElement.dataset.stacks;
    return;
  }
  pruneFrenzyEffects(entry, now);
  const stacks = getFrenzyStackCount(type, now);
  const effectUntil = Number(entry.effectUntil) || 0;
  if (stacks <= 0 || effectUntil <= now) {
    targetElement.hidden = true;
    targetElement.textContent = '';
    delete targetElement.dataset.stacks;
    return;
  }
  const remaining = Math.max(0, effectUntil - now);
  const seconds = remaining / 1000;
  const precision = seconds < 10 ? 1 : 0;
  const multiplier = Math.pow(FRENZY_CONFIG.multiplier, stacks);
  const multiplierText = multiplier.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
  const timeText = seconds.toLocaleString('fr-FR', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision
  });
  targetElement.textContent = `⚡ ×${multiplierText} · ${timeText}s`;
  targetElement.hidden = false;
  targetElement.dataset.stacks = stacks;
}

function updateFrenzyIndicators(now = performance.now()) {
  updateFrenzyIndicatorFor('perSecond', elements.statusApsFrenzy, now);
  updateFrenzyIndicatorFor('perClick', elements.statusApcFrenzy, now);
}

function formatApsCritChrono(seconds) {
  const totalSeconds = Math.max(0, Math.ceil(Number(seconds) || 0));
  if (totalSeconds >= 3600) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const parts = [`${hours.toLocaleString('fr-FR')} h`];
    if (minutes > 0) {
      parts.push(`${minutes.toLocaleString('fr-FR')} min`);
    }
    if (secs > 0) {
      parts.push(`${secs.toLocaleString('fr-FR')} s`);
    }
    return parts.join(' ');
  }
  if (totalSeconds >= 60) {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const parts = [`${minutes.toLocaleString('fr-FR')} min`];
    if (secs > 0) {
      parts.push(`${secs.toLocaleString('fr-FR')} s`);
    }
    return parts.join(' ');
  }
  return `${totalSeconds.toLocaleString('fr-FR')} s`;
}

function updateApsCritDisplay() {
  const panel = elements.statusApsCrit;
  if (!panel) {
    return;
  }
  const state = ensureApsCritState();
  const isActive = hasActiveApsCritEffect(state);
  const remainingSeconds = isActive ? getApsCritRemainingSeconds(state) : 0;
  panel.hidden = !isActive;
  panel.classList.toggle('is-active', isActive);
  panel.setAttribute('aria-hidden', String(!isActive));
  const container = panel.closest('.status-item--crit-aps');
  if (container) {
    container.hidden = !isActive;
    container.setAttribute('aria-hidden', String(!isActive));
  }
  const chronoText = isActive ? formatApsCritChrono(remainingSeconds) : '';
  if (elements.statusApsCritChrono) {
    elements.statusApsCritChrono.textContent = chronoText;
  }
  const multiplierValue = isActive ? getApsCritMultiplier(state) : 1;
  const multiplierText = `×${multiplierValue.toLocaleString('fr-FR')}`;
  if (elements.statusApsCritMultiplier) {
    elements.statusApsCritMultiplier.textContent = multiplierText;
  }
  panel.setAttribute(
    'aria-label',
    isActive
      ? `Compteur critique APS actif : ${multiplierText} pendant ${chronoText}.`
      : `Compteur critique APS inactif.`
  );
}

function pulseApsCritPanel() {
  const panel = elements.statusApsCrit;
  if (!panel || panel.hidden) {
    return;
  }
  panel.classList.remove('is-pulsing');
  void panel.offsetWidth;
  panel.classList.add('is-pulsing');
  if (apsCritPulseTimeoutId != null) {
    clearTimeout(apsCritPulseTimeoutId);
  }
  apsCritPulseTimeoutId = setTimeout(() => {
    panel.classList.remove('is-pulsing');
    apsCritPulseTimeoutId = null;
  }, 620);
  [
    elements.statusApsCritChrono,
    elements.statusApsCritMultiplier
  ].forEach(valueElement => {
    if (!valueElement) {
      return;
    }
    valueElement.classList.remove('status-aps-crit-value--pulse');
    void valueElement.offsetWidth;
    valueElement.classList.add('status-aps-crit-value--pulse');
  });
}

function updateUI() {
  updatePageUnlockUI();
  updateBigBangVisibility();
  updateBrandPortalState();
  if (elements.statusAtoms) {
    elements.statusAtoms.textContent = gameState.atoms.toString();
  }
  if (elements.statusApc) {
    elements.statusApc.textContent = gameState.perClick.toString();
  }
  if (elements.statusAps) {
    elements.statusAps.textContent = gameState.perSecond.toString();
  }
  updateApsCritDisplay();
  updateFrenzyIndicators();
  updateGachaUI();
  updateCollectionDisplay();
  updateFusionUI();
  updateShopAffordability();
  updateMilestone();
  updateGoalsUI();
  updateInfoPanels();
}

function showToast(message) {
  if (!toastElement) {
    toastElement = document.createElement('div');
    toastElement.className = 'toast';
    document.body.appendChild(toastElement);
  }
  toastElement.textContent = message;
  toastElement.classList.add('visible');
  clearTimeout(showToast.timeout);
  showToast.timeout = setTimeout(() => {
    toastElement.classList.remove('visible');
  }, 2200);
}

function applyTheme(theme) {
  document.body.classList.remove('theme-dark', 'theme-light', 'theme-neon');
  switch (theme) {
    case 'light':
      document.body.classList.add('theme-light');
      break;
    case 'neon':
      document.body.classList.add('theme-neon');
      break;
    default:
      document.body.classList.add('theme-dark');
      break;
  }
  elements.themeSelect.value = theme;
  gameState.theme = theme;
}

elements.themeSelect.addEventListener('change', event => {
  applyTheme(event.target.value);
  showToast('Thème mis à jour');
});

if (elements.musicTrackSelect) {
  elements.musicTrackSelect.addEventListener('change', event => {
    const selectedId = event.target.value;
    if (!selectedId) {
      musicPlayer.stop();
      showToast('Musique coupée');
      return;
    }
    const success = musicPlayer.playTrackById(selectedId);
    if (!success) {
      showToast('Piste introuvable');
      updateMusicStatus();
      return;
    }
    const currentTrack = musicPlayer.getCurrentTrack();
    if (currentTrack) {
      if (currentTrack.placeholder) {
        showToast('Le fichier de cette piste est manquant.');
      } else {
        showToast(`Lecture : ${currentTrack.displayName}`);
      }
    }
    updateMusicStatus();
  });
}

if (elements.musicVolumeSlider) {
  const applyVolumeFromSlider = (rawValue, { announce = false } = {}) => {
    const numeric = Number(rawValue);
    const percent = Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0;
    const normalized = clampMusicVolume(percent / 100, musicPlayer.getVolume());
    musicPlayer.setVolume(normalized);
    gameState.musicVolume = normalized;
    if (announce) {
      showToast(`Volume musique : ${Math.round(normalized * 100)} %`);
    }
  };
  elements.musicVolumeSlider.addEventListener('input', event => {
    applyVolumeFromSlider(event.target.value);
  });
  elements.musicVolumeSlider.addEventListener('change', event => {
    applyVolumeFromSlider(event.target.value, { announce: true });
  });
}

elements.resetButton.addEventListener('click', () => {
  const confirmationWord = 'RESET';
  const promptMessage = `Réinitialisation complète du jeu. Tapez "${confirmationWord}" pour confirmer.\nCette action est irréversible.`;
  const response = prompt(promptMessage);
  if (response == null) {
    showToast('Réinitialisation annulée');
    return;
  }
  if (response.trim().toUpperCase() !== confirmationWord) {
    showToast('Mot de confirmation incorrect');
    return;
  }
  resetGame();
  showToast('Progression réinitialisée');
});

if (elements.bigBangOptionToggle) {
  elements.bigBangOptionToggle.addEventListener('change', event => {
    const enabled = event.target.checked;
    if (!isBigBangTrophyUnlocked()) {
      event.target.checked = false;
      gameState.bigBangButtonVisible = false;
      updateBigBangVisibility();
      return;
    }
    gameState.bigBangButtonVisible = enabled;
    updateBigBangVisibility();
    saveGame();
    showToast(enabled ? 'Bouton Big Bang affiché' : 'Bouton Big Bang masqué');
  });
}

function serializeState() {
  const stats = gameState.stats || createInitialStats();
  const sessionApc = getLayeredStat(stats.session, 'apcAtoms');
  const sessionAps = getLayeredStat(stats.session, 'apsAtoms');
  const sessionOffline = getLayeredStat(stats.session, 'offlineAtoms');
  const globalApc = getLayeredStat(stats.global, 'apcAtoms');
  const globalAps = getLayeredStat(stats.global, 'apsAtoms');
  const globalOffline = getLayeredStat(stats.global, 'offlineAtoms');
  return {
    atoms: gameState.atoms.toJSON(),
    lifetime: gameState.lifetime.toJSON(),
    perClick: gameState.perClick.toJSON(),
    perSecond: gameState.perSecond.toJSON(),
    gachaTickets: Number.isFinite(Number(gameState.gachaTickets))
      ? Math.max(0, Math.floor(Number(gameState.gachaTickets)))
      : 0,
    bonusParticulesTickets: Number.isFinite(Number(gameState.bonusParticulesTickets))
      ? Math.max(0, Math.floor(Number(gameState.bonusParticulesTickets)))
      : 0,
    ticketStarUnlocked: gameState.ticketStarUnlocked === true,
    upgrades: gameState.upgrades,
    shopUnlocks: Array.from(getShopUnlockSet()),
    elements: gameState.elements,
    fusions: (() => {
      const base = createInitialFusionState();
      const source = gameState.fusions && typeof gameState.fusions === 'object'
        ? gameState.fusions
        : {};
      const result = {};
      FUSION_DEFS.forEach(def => {
        const entry = source[def.id] || base[def.id] || { attempts: 0, successes: 0 };
        const attempts = Number(entry.attempts);
        const successes = Number(entry.successes);
        result[def.id] = {
          attempts: Number.isFinite(attempts) && attempts > 0 ? Math.floor(attempts) : 0,
          successes: Number.isFinite(successes) && successes > 0 ? Math.floor(successes) : 0
        };
      });
      return result;
    })(),
    pageUnlocks: (() => {
      const unlocks = getPageUnlockState();
      return {
        gacha: unlocks?.gacha === true,
        tableau: unlocks?.tableau === true,
        fusion: unlocks?.fusion === true,
        info: unlocks?.info === true
      };
    })(),
    fusionBonuses: (() => {
      const bonuses = getFusionBonusState();
      return {
        apcFlat: Number.isFinite(Number(bonuses.apcFlat)) ? Number(bonuses.apcFlat) : 0,
        apsFlat: Number.isFinite(Number(bonuses.apsFlat)) ? Number(bonuses.apsFlat) : 0
      };
    })(),
    theme: gameState.theme,
    stats: {
      session: {
        atomsGained: stats.session.atomsGained.toJSON(),
        apcAtoms: sessionApc.toJSON(),
        apsAtoms: sessionAps.toJSON(),
        offlineAtoms: sessionOffline.toJSON(),
        manualClicks: stats.session.manualClicks,
        onlineTimeMs: stats.session.onlineTimeMs,
        startedAt: stats.session.startedAt,
        frenzyTriggers: {
          perClick: stats.session.frenzyTriggers?.perClick || 0,
          perSecond: stats.session.frenzyTriggers?.perSecond || 0,
          total: stats.session.frenzyTriggers?.total || 0
        }
      },
      global: {
        apcAtoms: globalApc.toJSON(),
        apsAtoms: globalAps.toJSON(),
        offlineAtoms: globalOffline.toJSON(),
        manualClicks: stats.global.manualClicks,
        playTimeMs: stats.global.playTimeMs,
        startedAt: stats.global.startedAt,
        frenzyTriggers: {
          perClick: stats.global.frenzyTriggers?.perClick || 0,
          perSecond: stats.global.frenzyTriggers?.perSecond || 0,
          total: stats.global.frenzyTriggers?.total || 0
        }
      }
    },
    offlineGainMultiplier: Number.isFinite(Number(gameState.offlineGainMultiplier))
      ? Math.max(0, Number(gameState.offlineGainMultiplier))
      : MYTHIQUE_OFFLINE_BASE,
    offlineTickets: (() => {
      const raw = gameState.offlineTickets || {};
      const secondsPerTicket = Number.isFinite(Number(raw.secondsPerTicket))
        && Number(raw.secondsPerTicket) > 0
        ? Number(raw.secondsPerTicket)
        : OFFLINE_TICKET_CONFIG.secondsPerTicket;
      const capSeconds = Number.isFinite(Number(raw.capSeconds))
        && Number(raw.capSeconds) > 0
        ? Math.max(Number(raw.capSeconds), secondsPerTicket)
        : Math.max(OFFLINE_TICKET_CONFIG.capSeconds, secondsPerTicket);
      const progressSeconds = Number.isFinite(Number(raw.progressSeconds))
        && Number(raw.progressSeconds) > 0
        ? Math.max(0, Math.min(Number(raw.progressSeconds), capSeconds))
        : 0;
      return {
        secondsPerTicket,
        capSeconds,
        progressSeconds
      };
    })(),
    ticketStarAutoCollect: gameState.ticketStarAutoCollect
      ? {
          delaySeconds: Math.max(
            0,
            Number.isFinite(Number(gameState.ticketStarAutoCollect.delaySeconds))
              ? Number(gameState.ticketStarAutoCollect.delaySeconds)
              : 0
          )
        }
      : null,
    ticketStarIntervalSeconds: Number.isFinite(Number(gameState.ticketStarAverageIntervalSeconds))
      && Number(gameState.ticketStarAverageIntervalSeconds) > 0
      ? Number(gameState.ticketStarAverageIntervalSeconds)
      : DEFAULT_TICKET_STAR_INTERVAL_SECONDS,
    frenzySpawnBonus: {
      perClick: Number.isFinite(Number(gameState.frenzySpawnBonus?.perClick))
        && Number(gameState.frenzySpawnBonus.perClick) > 0
        ? Number(gameState.frenzySpawnBonus.perClick)
        : 1,
      perSecond: Number.isFinite(Number(gameState.frenzySpawnBonus?.perSecond))
        && Number(gameState.frenzySpawnBonus.perSecond) > 0
        ? Number(gameState.frenzySpawnBonus.perSecond)
        : 1
    },
    apsCrit: (() => {
      const state = ensureApsCritState();
      const effects = Array.isArray(state.effects)
        ? state.effects
            .map(effect => ({
              remainingSeconds: Math.max(0, Number(effect?.remainingSeconds) || 0),
              multiplierAdd: Math.max(0, Number(effect?.multiplierAdd) || 0)
            }))
            .filter(effect => effect.remainingSeconds > 0 && effect.multiplierAdd > 0)
        : [];
      return { effects };
    })(),
    music: {
      selectedTrack: musicPlayer.getCurrentTrackId() ?? gameState.musicTrackId ?? null,
      enabled: gameState.musicEnabled !== false,
      volume: clampMusicVolume(
        typeof musicPlayer.getVolume === 'function'
          ? musicPlayer.getVolume()
          : gameState.musicVolume,
        DEFAULT_MUSIC_VOLUME
      )
    },
    musicTrackId: musicPlayer.getCurrentTrackId() ?? gameState.musicTrackId ?? null,
    musicVolume: clampMusicVolume(
      typeof musicPlayer.getVolume === 'function'
        ? musicPlayer.getVolume()
        : gameState.musicVolume,
      DEFAULT_MUSIC_VOLUME
    ),
    musicEnabled: gameState.musicEnabled !== false,
    bigBangButtonVisible: gameState.bigBangButtonVisible === true,
    trophies: getUnlockedTrophyIds(),
    lastSave: Date.now()
  };
}

function saveGame() {
  try {
    const payload = serializeState();
    localStorage.setItem('atom2univers', JSON.stringify(payload));
  } catch (err) {
    console.error('Erreur de sauvegarde', err);
  }
}

function resetGame() {
  Object.assign(gameState, {
    atoms: LayeredNumber.zero(),
    lifetime: LayeredNumber.zero(),
    perClick: BASE_PER_CLICK.clone(),
    perSecond: BASE_PER_SECOND.clone(),
    basePerClick: BASE_PER_CLICK.clone(),
    basePerSecond: BASE_PER_SECOND.clone(),
    gachaTickets: 0,
    bonusParticulesTickets: 0,
    upgrades: {},
    shopUnlocks: new Set(),
    elements: createInitialElementCollection(),
    fusions: createInitialFusionState(),
    fusionBonuses: createInitialFusionBonuses(),
    pageUnlocks: createInitialPageUnlockState(),
    theme: DEFAULT_THEME,
    stats: createInitialStats(),
    production: createEmptyProductionBreakdown(),
    productionBase: createEmptyProductionBreakdown(),
    crit: createDefaultCritState(),
    baseCrit: createDefaultCritState(),
    lastCritical: null,
    elementBonusSummary: {},
    trophies: new Set(),
    offlineGainMultiplier: MYTHIQUE_OFFLINE_BASE,
    offlineTickets: {
      secondsPerTicket: OFFLINE_TICKET_CONFIG.secondsPerTicket,
      capSeconds: OFFLINE_TICKET_CONFIG.capSeconds,
      progressSeconds: 0
    },
    ticketStarAutoCollect: null,
    ticketStarAverageIntervalSeconds: DEFAULT_TICKET_STAR_INTERVAL_SECONDS,
    ticketStarUnlocked: false,
    frenzySpawnBonus: { perClick: 1, perSecond: 1 },
    musicTrackId: null,
    musicVolume: DEFAULT_MUSIC_VOLUME,
    musicEnabled: DEFAULT_MUSIC_ENABLED,
    bigBangButtonVisible: false,
    apsCrit: createDefaultApsCritState()
  });
  applyFrenzySpawnChanceBonus(gameState.frenzySpawnBonus);
  setTicketStarAverageIntervalSeconds(gameState.ticketStarAverageIntervalSeconds);
  resetFrenzyState({ skipApply: true });
  resetTicketStarState({ reschedule: true });
  applyTheme(DEFAULT_THEME);
  musicPlayer.stop();
  musicPlayer.setVolume(DEFAULT_MUSIC_VOLUME, { silent: true });
  recalcProduction();
  renderShop();
  updateUI();
  setFusionLog('Sélectionnez une recette pour tenter votre première fusion.');
  saveGame();
}

function loadGame() {
  try {
    resetFrenzyState({ skipApply: true });
    resetTicketStarState({ reschedule: true });
    gameState.baseCrit = createDefaultCritState();
    gameState.crit = createDefaultCritState();
    gameState.lastCritical = null;
    const raw = localStorage.getItem('atom2univers');
    if (!raw) {
      gameState.theme = DEFAULT_THEME;
      gameState.stats = createInitialStats();
      gameState.shopUnlocks = new Set();
      applyTheme(DEFAULT_THEME);
      recalcProduction();
      renderShop();
      updateUI();
      return;
    }
    const data = JSON.parse(raw);
    gameState.atoms = LayeredNumber.fromJSON(data.atoms);
    gameState.lifetime = LayeredNumber.fromJSON(data.lifetime);
    gameState.perClick = LayeredNumber.fromJSON(data.perClick);
    gameState.perSecond = LayeredNumber.fromJSON(data.perSecond);
    const tickets = Number(data.gachaTickets);
    gameState.gachaTickets = Number.isFinite(tickets) && tickets > 0 ? Math.floor(tickets) : 0;
    const bonusTickets = Number(data.bonusParticulesTickets ?? data.bonusTickets);
    gameState.bonusParticulesTickets = Number.isFinite(bonusTickets) && bonusTickets > 0
      ? Math.floor(bonusTickets)
      : 0;
    const storedTicketStarUnlock = data.ticketStarUnlocked ?? data.ticketStarUnlock;
    if (storedTicketStarUnlock != null) {
      gameState.ticketStarUnlocked = storedTicketStarUnlock === true
        || storedTicketStarUnlock === 'true'
        || storedTicketStarUnlock === 1
        || storedTicketStarUnlock === '1';
    } else {
      gameState.ticketStarUnlocked = gameState.gachaTickets > 0;
    }
    const storedUpgrades = data.upgrades;
    if (storedUpgrades && typeof storedUpgrades === 'object') {
      const normalizedUpgrades = {};
      Object.entries(storedUpgrades).forEach(([id, value]) => {
        const numeric = Number(value);
        if (!Number.isFinite(numeric)) {
          return;
        }
        const sanitized = Math.max(0, Math.floor(numeric));
        if (sanitized > 0) {
          normalizedUpgrades[id] = sanitized;
        }
      });
      gameState.upgrades = normalizedUpgrades;
    } else {
      gameState.upgrades = {};
    }
    const storedShopUnlocks = data.shopUnlocks;
    if (Array.isArray(storedShopUnlocks)) {
      gameState.shopUnlocks = new Set(storedShopUnlocks);
    } else if (storedShopUnlocks && typeof storedShopUnlocks === 'object') {
      gameState.shopUnlocks = new Set(Object.keys(storedShopUnlocks));
    } else {
      gameState.shopUnlocks = new Set();
    }
    gameState.stats = parseStats(data.stats);
    gameState.trophies = new Set(Array.isArray(data.trophies) ? data.trophies : []);
    const storedPageUnlocks = data.pageUnlocks;
    if (storedPageUnlocks && typeof storedPageUnlocks === 'object') {
      const baseUnlocks = createInitialPageUnlockState();
      Object.keys(baseUnlocks).forEach(key => {
        const rawValue = storedPageUnlocks[key];
        baseUnlocks[key] = rawValue === true || rawValue === 'true' || rawValue === 1;
      });
      gameState.pageUnlocks = baseUnlocks;
    } else {
      gameState.pageUnlocks = createInitialPageUnlockState();
    }
    const storedBigBangPreference =
      data.bigBangButtonVisible ?? data.showBigBangButton ?? data.bigBangVisible ?? null;
    const wantsBigBang =
      storedBigBangPreference === true
      || storedBigBangPreference === 'true'
      || storedBigBangPreference === 1
      || storedBigBangPreference === '1';
    const hasBigBangUnlock = gameState.trophies.has(BIG_BANG_TROPHY_ID);
    gameState.bigBangButtonVisible = wantsBigBang && hasBigBangUnlock;
    const storedOffline = Number(data.offlineGainMultiplier);
    if (Number.isFinite(storedOffline) && storedOffline > 0) {
      gameState.offlineGainMultiplier = Math.min(MYTHIQUE_OFFLINE_CAP, storedOffline);
    } else {
      gameState.offlineGainMultiplier = MYTHIQUE_OFFLINE_BASE;
    }
    const storedOfflineTickets = data.offlineTickets;
    if (storedOfflineTickets && typeof storedOfflineTickets === 'object') {
      const secondsPerTicket = Number(storedOfflineTickets.secondsPerTicket);
      const normalizedSecondsPerTicket = Number.isFinite(secondsPerTicket) && secondsPerTicket > 0
        ? secondsPerTicket
        : OFFLINE_TICKET_CONFIG.secondsPerTicket;
      const capSeconds = Number(storedOfflineTickets.capSeconds);
      const normalizedCapSeconds = Number.isFinite(capSeconds) && capSeconds > 0
        ? Math.max(capSeconds, normalizedSecondsPerTicket)
        : Math.max(OFFLINE_TICKET_CONFIG.capSeconds, normalizedSecondsPerTicket);
      const progressSeconds = Number(storedOfflineTickets.progressSeconds);
      const normalizedProgressSeconds = Number.isFinite(progressSeconds) && progressSeconds > 0
        ? Math.max(0, Math.min(progressSeconds, normalizedCapSeconds))
        : 0;
      gameState.offlineTickets = {
        secondsPerTicket: normalizedSecondsPerTicket,
        capSeconds: normalizedCapSeconds,
        progressSeconds: normalizedProgressSeconds
      };
    } else if (typeof storedOfflineTickets === 'number' && storedOfflineTickets > 0) {
      const interval = Number(storedOfflineTickets);
      const normalizedSecondsPerTicket = Number.isFinite(interval) && interval > 0
        ? interval
        : OFFLINE_TICKET_CONFIG.secondsPerTicket;
      const normalizedCapSeconds = Math.max(
        OFFLINE_TICKET_CONFIG.capSeconds,
        normalizedSecondsPerTicket
      );
      gameState.offlineTickets = {
        secondsPerTicket: normalizedSecondsPerTicket,
        capSeconds: normalizedCapSeconds,
        progressSeconds: 0
      };
    } else {
      gameState.offlineTickets = {
        secondsPerTicket: OFFLINE_TICKET_CONFIG.secondsPerTicket,
        capSeconds: OFFLINE_TICKET_CONFIG.capSeconds,
        progressSeconds: 0
      };
    }
    const storedInterval = Number(data.ticketStarIntervalSeconds);
    if (Number.isFinite(storedInterval) && storedInterval > 0) {
      gameState.ticketStarAverageIntervalSeconds = storedInterval;
    } else {
      gameState.ticketStarAverageIntervalSeconds = DEFAULT_TICKET_STAR_INTERVAL_SECONDS;
    }
    const storedAutoCollect = data.ticketStarAutoCollect;
    if (storedAutoCollect && typeof storedAutoCollect === 'object') {
      const rawDelay = storedAutoCollect.delaySeconds
        ?? storedAutoCollect.delay
        ?? storedAutoCollect.seconds
        ?? storedAutoCollect.value;
      const delaySeconds = Number(rawDelay);
      gameState.ticketStarAutoCollect = Number.isFinite(delaySeconds) && delaySeconds >= 0
        ? { delaySeconds }
        : null;
    } else if (storedAutoCollect === true) {
      gameState.ticketStarAutoCollect = { delaySeconds: 0 };
    } else if (typeof storedAutoCollect === 'number' && Number.isFinite(storedAutoCollect) && storedAutoCollect >= 0) {
      gameState.ticketStarAutoCollect = { delaySeconds: storedAutoCollect };
    } else {
      gameState.ticketStarAutoCollect = null;
    }
    const storedFrenzyBonus = data.frenzySpawnBonus;
    if (storedFrenzyBonus && typeof storedFrenzyBonus === 'object') {
      const perClick = Number(storedFrenzyBonus.perClick);
      const perSecond = Number(storedFrenzyBonus.perSecond);
      gameState.frenzySpawnBonus = {
        perClick: Number.isFinite(perClick) && perClick > 0 ? perClick : 1,
        perSecond: Number.isFinite(perSecond) && perSecond > 0 ? perSecond : 1
      };
    } else {
      gameState.frenzySpawnBonus = { perClick: 1, perSecond: 1 };
    }
    applyFrenzySpawnChanceBonus(gameState.frenzySpawnBonus);
    gameState.apsCrit = normalizeApsCritState(data.apsCrit);
    const intervalChanged = setTicketStarAverageIntervalSeconds(gameState.ticketStarAverageIntervalSeconds);
    if (intervalChanged) {
      resetTicketStarState({ reschedule: true });
    }
    const baseCollection = createInitialElementCollection();
    if (data.elements && typeof data.elements === 'object') {
      Object.entries(data.elements).forEach(([id, saved]) => {
        if (!baseCollection[id]) return;
        const reference = baseCollection[id];
        const savedCount = Number(saved?.count);
        const normalizedCount = Number.isFinite(savedCount) && savedCount > 0
          ? Math.floor(savedCount)
          : 0;
        const savedLifetime = Number(saved?.lifetime);
        let normalizedLifetime = Number.isFinite(savedLifetime) && savedLifetime > 0
          ? Math.floor(savedLifetime)
          : 0;
        if (normalizedLifetime === 0 && (saved?.owned || normalizedCount > 0)) {
          normalizedLifetime = Math.max(normalizedCount, 1);
        }
        if (normalizedLifetime < normalizedCount) {
          normalizedLifetime = normalizedCount;
        }
        baseCollection[id] = {
          id,
          gachaId: reference.gachaId,
          owned: normalizedLifetime > 0,
          count: normalizedCount,
          lifetime: normalizedLifetime,
          rarity: reference.rarity ?? (typeof saved?.rarity === 'string' ? saved.rarity : null),
          effects: Array.isArray(saved?.effects) ? [...saved.effects] : [],
          bonuses: Array.isArray(saved?.bonuses) ? [...saved.bonuses] : []
        };
      });
    }
    gameState.elements = baseCollection;
    const fusionState = createInitialFusionState();
    if (data.fusions && typeof data.fusions === 'object') {
      Object.keys(fusionState).forEach(id => {
        const stored = data.fusions[id];
        if (!stored || typeof stored !== 'object') {
          fusionState[id] = { attempts: 0, successes: 0 };
          return;
        }
        const attemptsRaw = Number(
          stored.attempts
            ?? stored.tries
            ?? stored.tentatives
            ?? stored.total
            ?? 0
        );
        const successesRaw = Number(
          stored.successes
            ?? stored.success
            ?? stored.victories
            ?? stored.wins
            ?? 0
        );
        fusionState[id] = {
          attempts: Number.isFinite(attemptsRaw) && attemptsRaw > 0 ? Math.floor(attemptsRaw) : 0,
          successes: Number.isFinite(successesRaw) && successesRaw > 0 ? Math.floor(successesRaw) : 0
        };
      });
    }
    gameState.fusions = fusionState;
    const fusionBonuses = createInitialFusionBonuses();
    const storedFusionBonuses = data.fusionBonuses;
    if (storedFusionBonuses && typeof storedFusionBonuses === 'object') {
      const apc = Number(
        storedFusionBonuses.apcFlat
          ?? storedFusionBonuses.apc
          ?? storedFusionBonuses.perClick
          ?? storedFusionBonuses.click
          ?? 0
      );
      const aps = Number(
        storedFusionBonuses.apsFlat
          ?? storedFusionBonuses.aps
          ?? storedFusionBonuses.perSecond
          ?? storedFusionBonuses.auto
          ?? 0
      );
      fusionBonuses.apcFlat = Number.isFinite(apc) ? apc : 0;
      fusionBonuses.apsFlat = Number.isFinite(aps) ? aps : 0;
    }
    gameState.fusionBonuses = fusionBonuses;
    gameState.theme = data.theme || DEFAULT_THEME;
    const parseStoredVolume = raw => {
      const numeric = Number(raw);
      if (!Number.isFinite(numeric)) {
        return null;
      }
      if (numeric > 1) {
        return clampMusicVolume(numeric / 100, DEFAULT_MUSIC_VOLUME);
      }
      return clampMusicVolume(numeric, DEFAULT_MUSIC_VOLUME);
    };

    const storedMusic = data.music;
    if (storedMusic && typeof storedMusic === 'object') {
      const selected = storedMusic.selectedTrack
        ?? storedMusic.track
        ?? storedMusic.id
        ?? storedMusic.filename;
      gameState.musicTrackId = typeof selected === 'string' && selected ? selected : null;
      const storedVolume = parseStoredVolume(storedMusic.volume);
      if (storedVolume != null) {
        gameState.musicVolume = storedVolume;
      } else if (typeof data.musicVolume === 'number') {
        const fallbackVolume = parseStoredVolume(data.musicVolume);
        gameState.musicVolume = fallbackVolume != null ? fallbackVolume : DEFAULT_MUSIC_VOLUME;
      } else {
        gameState.musicVolume = DEFAULT_MUSIC_VOLUME;
      }
      if (typeof storedMusic.enabled === 'boolean') {
        gameState.musicEnabled = storedMusic.enabled;
      } else if (typeof data.musicEnabled === 'boolean') {
        gameState.musicEnabled = data.musicEnabled;
      } else if (gameState.musicTrackId) {
        gameState.musicEnabled = true;
      } else {
        gameState.musicEnabled = DEFAULT_MUSIC_ENABLED;
      }
    } else {
      if (typeof data.musicTrackId === 'string' && data.musicTrackId) {
        gameState.musicTrackId = data.musicTrackId;
      } else if (typeof data.musicTrack === 'string' && data.musicTrack) {
        gameState.musicTrackId = data.musicTrack;
      } else {
        gameState.musicTrackId = null;
      }
      if (typeof data.musicEnabled === 'boolean') {
        gameState.musicEnabled = data.musicEnabled;
      } else if (gameState.musicTrackId) {
        gameState.musicEnabled = true;
      } else {
        gameState.musicEnabled = DEFAULT_MUSIC_ENABLED;
      }
      const fallbackVolume = parseStoredVolume(data.musicVolume);
      gameState.musicVolume = fallbackVolume != null ? fallbackVolume : DEFAULT_MUSIC_VOLUME;
    }
    if (gameState.musicEnabled === false) {
      gameState.musicTrackId = null;
    }
    evaluatePageUnlocks({ save: false, deferUI: true });
    getShopUnlockSet();
    applyTheme(gameState.theme);
    recalcProduction();
    renderShop();
    updateBigBangVisibility();
    updateUI();
    if (data.lastSave) {
      const diff = Math.max(0, (Date.now() - data.lastSave) / 1000);
      const capped = Math.min(diff, OFFLINE_GAIN_CAP);
      if (capped > 0) {
        const multiplier = Number.isFinite(Number(gameState.offlineGainMultiplier))
          && Number(gameState.offlineGainMultiplier) > 0
          ? Math.min(MYTHIQUE_OFFLINE_CAP, Number(gameState.offlineGainMultiplier))
          : MYTHIQUE_OFFLINE_BASE;
        if (multiplier > 0) {
          const offlineGain = gameState.perSecond.multiplyNumber(capped * multiplier);
          gainAtoms(offlineGain, 'offline');
          showToast(`Progression hors ligne : +${offlineGain.toString()} atomes`);
        }
      }
      if (diff > 0) {
        const offlineTickets = gameState.offlineTickets || {
          secondsPerTicket: OFFLINE_TICKET_CONFIG.secondsPerTicket,
          capSeconds: OFFLINE_TICKET_CONFIG.capSeconds,
          progressSeconds: 0
        };
        const secondsPerTicket = Number.isFinite(Number(offlineTickets.secondsPerTicket))
          && Number(offlineTickets.secondsPerTicket) > 0
          ? Number(offlineTickets.secondsPerTicket)
          : OFFLINE_TICKET_CONFIG.secondsPerTicket;
        const capSeconds = Number.isFinite(Number(offlineTickets.capSeconds))
          && Number(offlineTickets.capSeconds) > 0
          ? Math.max(Number(offlineTickets.capSeconds), secondsPerTicket)
          : Math.max(OFFLINE_TICKET_CONFIG.capSeconds, secondsPerTicket);
        let progressSeconds = Number.isFinite(Number(offlineTickets.progressSeconds))
          && Number(offlineTickets.progressSeconds) > 0
          ? Math.max(0, Math.min(Number(offlineTickets.progressSeconds), capSeconds))
          : 0;
        const effectiveSeconds = Math.min(diff, capSeconds);
        progressSeconds = Math.min(progressSeconds + effectiveSeconds, capSeconds);
        const ticketsEarned = secondsPerTicket > 0
          ? Math.floor(progressSeconds / secondsPerTicket)
          : 0;
        if (ticketsEarned > 0) {
          const currentTickets = Number.isFinite(Number(gameState.gachaTickets))
            ? Math.max(0, Math.floor(Number(gameState.gachaTickets)))
            : 0;
          gameState.gachaTickets = currentTickets + ticketsEarned;
          evaluatePageUnlocks({ save: false, deferUI: true });
          const unit = ticketsEarned === 1 ? 'ticket' : 'tickets';
          showToast(`Tickets hors ligne : +${ticketsEarned} ${unit}`);
          progressSeconds -= ticketsEarned * secondsPerTicket;
          progressSeconds = Math.max(0, Math.min(progressSeconds, capSeconds));
        }
        gameState.offlineTickets = {
          secondsPerTicket,
          capSeconds,
          progressSeconds
        };
      }
    }
  } catch (err) {
    console.error('Erreur de chargement', err);
    resetGame();
  }
}

let lastUpdate = performance.now();
let lastSaveTime = performance.now();
let lastUIUpdate = performance.now();

function updatePlaytime(deltaSeconds) {
  if (!gameState.stats) return;
  const deltaMs = deltaSeconds * 1000;
  if (!Number.isFinite(deltaMs) || deltaMs <= 0) return;
  gameState.stats.session.onlineTimeMs += deltaMs;
  gameState.stats.global.playTimeMs += deltaMs;
}

function loop(now) {
  const delta = Math.max(0, (now - lastUpdate) / 1000);
  lastUpdate = now;

  if (!gameState.perSecond.isZero()) {
    const gain = gameState.perSecond.multiplyNumber(delta);
    gainAtoms(gain, 'aps');
  }

  updateApsCritTimer(delta);

  updateClickVisuals(now);
  updatePlaytime(delta);
  updateFrenzies(delta, now);
  updateTicketStar(delta, now);

  if (now - lastUIUpdate > 250) {
    updateUI();
    lastUIUpdate = now;
  }

  if (now - lastSaveTime > 5000) {
    saveGame();
    lastSaveTime = now;
  }

  requestAnimationFrame(loop);
}

window.addEventListener('beforeunload', saveGame);

loadGame();
musicPlayer.init({
  preferredTrackId: gameState.musicTrackId,
  autoplay: gameState.musicEnabled !== false,
  volume: gameState.musicVolume
});
musicPlayer.ready().then(() => {
  refreshMusicControls();
});
recalcProduction();
evaluateTrophies();
renderShop();
renderGoals();
updateUI();
initStarfield();
requestAnimationFrame(loop);
