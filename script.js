class LayeredNumber {
  constructor(input = 0) {
    this.sign = 0;
    this.layer = 0;
    this.mantissa = 0;
    this.exponent = 0;
    this.value = 0;

    if (input instanceof LayeredNumber) {
      this.sign = input.sign;
      this.layer = input.layer;
      this.mantissa = input.mantissa;
      this.exponent = input.exponent;
      this.value = input.value;
      return;
    }

    if (typeof input === 'number') {
      this.fromNumber(input);
      return;
    }

    if (input && typeof input === 'object') {
      this.sign = input.sign ?? 0;
      this.layer = input.layer ?? 0;
      this.mantissa = input.mantissa ?? 0;
      this.exponent = input.exponent ?? 0;
      this.value = input.value ?? 0;
      this.normalize();
    }
  }

  static zero() {
    return new LayeredNumber(0);
  }

  static one() {
    return new LayeredNumber(1);
  }

  static fromJSON(obj) {
    if (!obj) return LayeredNumber.zero();
    return new LayeredNumber(obj);
  }

  fromNumber(num) {
    if (!isFinite(num) || num === 0) {
      this.sign = 0;
      this.layer = 0;
      this.mantissa = 0;
      this.exponent = 0;
      this.value = 0;
      return this;
    }
    this.sign = num >= 0 ? 1 : -1;
    const abs = Math.abs(num);
    if (abs < 1e-12) {
      this.sign = 0;
      this.layer = 0;
      this.mantissa = 0;
      this.exponent = 0;
      this.value = 0;
      return this;
    }
    this.layer = 0;
    this.exponent = 0;
    this.mantissa = abs;
    this.normalize();
    return this;
  }

  static fromLayer0(mantissa, exponent = 0, sign = 1) {
    const inst = new LayeredNumber();
    if (mantissa === 0) {
      inst.sign = 0;
      inst.layer = 0;
      inst.mantissa = 0;
      inst.exponent = 0;
      inst.value = 0;
      return inst;
    }
    inst.sign = sign >= 0 ? 1 : -1;
    inst.layer = 0;
    inst.mantissa = Math.abs(mantissa);
    inst.exponent = exponent;
    return inst.normalize();
  }

  static fromLayer1(value, sign = 1) {
    const inst = new LayeredNumber();
    if (value <= -Infinity) {
      return LayeredNumber.zero();
    }
    inst.sign = sign >= 0 ? 1 : -1;
    inst.layer = 1;
    inst.value = value;
    return inst.normalize();
  }

  clone() {
    return new LayeredNumber(this);
  }

  normalize() {
    if (this.sign === 0 || this.mantissa === 0 || !isFinite(this.mantissa)) {
      if (this.layer === 0) {
        if (this.mantissa === 0 || !isFinite(this.mantissa)) {
          this.sign = 0;
          this.mantissa = 0;
          this.exponent = 0;
        }
      }
    }

    if (this.sign === 0) {
      this.layer = 0;
      this.mantissa = 0;
      this.exponent = 0;
      this.value = 0;
      return this;
    }

    if (this.layer === 0) {
      if (this.mantissa === 0) {
        this.sign = 0;
        this.exponent = 0;
        return this;
      }
      let mant = this.mantissa;
      let exp = this.exponent;
      const sign = this.sign >= 0 ? 1 : -1;
      if (!isFinite(mant)) {
        this.layer = 1;
        this.value = Math.log10(Math.abs(mant)) + exp;
        this.mantissa = 0;
        this.exponent = 0;
        this.sign = sign;
        return this;
      }
      while (mant >= 10) {
        mant /= 10;
        exp += 1;
      }
      while (mant < 1 && mant > 0) {
        mant *= 10;
        exp -= 1;
      }
      this.mantissa = mant;
      this.exponent = exp;
      this.sign = sign;
      if (exp >= LayeredNumber.LAYER1_THRESHOLD) {
        const log10 = Math.log10(this.mantissa) + this.exponent;
        this.layer = 1;
        this.value = log10;
        this.mantissa = 0;
        this.exponent = 0;
      }
    } else if (this.layer === 1) {
      if (!isFinite(this.value)) {
        this.value = Number.POSITIVE_INFINITY;
      }
      if (this.value < LayeredNumber.LAYER1_DOWN) {
        const log10 = this.value;
        const exp = Math.floor(log10);
        const mant = Math.pow(10, log10 - exp);
        this.layer = 0;
        this.mantissa = mant;
        this.exponent = exp;
        this.value = 0;
        this.normalize();
      }
    }
    return this;
  }

  toLayer(targetLayer) {
    if (targetLayer === this.layer) {
      return this.clone();
    }
    if (targetLayer < 0) targetLayer = 0;
    let result = this.clone();
    while (result.layer < targetLayer) {
      if (result.layer === 0) {
        const log10 = Math.log10(result.mantissa) + result.exponent;
        result.layer = 1;
        result.value = log10;
        result.mantissa = 0;
        result.exponent = 0;
      } else {
        // Higher layers not implemented, approximate by staying in current layer
        break;
      }
    }
    while (result.layer > targetLayer) {
      if (result.layer === 1) {
        const log10 = result.value;
        const exp = Math.floor(log10);
        const mant = Math.pow(10, log10 - exp);
        result.layer = 0;
        result.mantissa = mant;
        result.exponent = exp;
        result.value = 0;
        result.normalize();
      } else {
        break;
      }
    }
    return result;
  }

  isZero() {
    return this.sign === 0;
  }

  compare(other) {
    const b = LayeredNumber.cast(other);
    if (this.sign === 0 && b.sign === 0) return 0;
    if (this.sign >= 0 && b.sign < 0) return 1;
    if (this.sign < 0 && b.sign >= 0) return -1;
    if (this.sign === 0) return -b.sign;
    if (b.sign === 0) return this.sign;

    const sign = this.sign;
    if (this.layer !== b.layer) {
      return (this.layer > b.layer ? 1 : -1) * sign;
    }
    if (this.layer === 0) {
      if (this.exponent !== b.exponent) {
        return (this.exponent > b.exponent ? 1 : -1) * sign;
      }
      if (this.mantissa !== b.mantissa) {
        return (this.mantissa > b.mantissa ? 1 : -1) * sign;
      }
      return 0;
    }
    if (this.value !== b.value) {
      return (this.value > b.value ? 1 : -1) * sign;
    }
    return 0;
  }

  add(other) {
    const b = LayeredNumber.cast(other);
    if (this.sign === 0) return b.clone();
    if (b.sign === 0) return this.clone();

    if (this.sign !== b.sign) {
      if (this.sign < 0) {
        return b.subtract(this.negate());
      }
      return this.subtract(b.negate());
    }

    if (this.layer === b.layer) {
      if (this.layer === 0) {
        if (this.exponent === b.exponent) {
          return LayeredNumber.fromLayer0(this.mantissa + b.mantissa, this.exponent, this.sign).normalize();
        }
        if (this.exponent > b.exponent) {
          const diff = this.exponent - b.exponent;
          if (diff > LayeredNumber.LOG_DIFF_LIMIT) return this.clone();
          const mantissa = this.mantissa + b.mantissa / Math.pow(10, diff);
          return LayeredNumber.fromLayer0(mantissa, this.exponent, this.sign).normalize();
        }
        const diff = b.exponent - this.exponent;
        if (diff > LayeredNumber.LOG_DIFF_LIMIT) return b.clone();
        const mantissa = b.mantissa + this.mantissa / Math.pow(10, diff);
        return LayeredNumber.fromLayer0(mantissa, b.exponent, this.sign).normalize();
      }

      const max = Math.max(this.value, b.value);
      const min = Math.min(this.value, b.value);
      if (max - min > LayeredNumber.LOG_DIFF_LIMIT) {
        return LayeredNumber.fromLayer1(max, this.sign);
      }
      const resultValue = max + Math.log10(1 + Math.pow(10, min - max));
      return LayeredNumber.fromLayer1(resultValue, this.sign).normalize();
    }

    if (this.layer > b.layer) {
      const lifted = b.toLayer(this.layer);
      return this.add(lifted);
    }
    const lifted = this.toLayer(b.layer);
    return lifted.add(b);
  }

  subtract(other) {
    const b = LayeredNumber.cast(other);
    if (b.sign === 0) return this.clone();
    if (this.sign === 0) return b.negate();

    if (this.sign !== b.sign) {
      return this.add(b.negate());
    }

    const cmp = this.compare(b);
    if (cmp === 0) return LayeredNumber.zero();
    if (cmp < 0) {
      return b.subtract(this).negate();
    }

    if (this.layer === b.layer) {
      if (this.layer === 0) {
        if (this.exponent === b.exponent) {
          const mantissa = this.mantissa - b.mantissa;
          if (mantissa <= LayeredNumber.EPSILON) return LayeredNumber.zero();
          return LayeredNumber.fromLayer0(mantissa, this.exponent, this.sign).normalize();
        }
        if (this.exponent > b.exponent) {
          const diff = this.exponent - b.exponent;
          if (diff > LayeredNumber.LOG_DIFF_LIMIT) return this.clone();
          const mantissa = this.mantissa - b.mantissa / Math.pow(10, diff);
          if (mantissa <= LayeredNumber.EPSILON) return LayeredNumber.zero();
          return LayeredNumber.fromLayer0(mantissa, this.exponent, this.sign).normalize();
        }
      } else {
        const max = this.value;
        const min = b.value;
        if (max - min > LayeredNumber.LOG_DIFF_LIMIT) {
          return this.clone();
        }
        const diffPow = Math.pow(10, min - max);
        const inner = 1 - diffPow;
        if (inner <= LayeredNumber.EPSILON) {
          return LayeredNumber.zero();
        }
        const resultValue = max + Math.log10(inner);
        return LayeredNumber.fromLayer1(resultValue, this.sign).normalize();
      }
    }

    const higher = this.layer > b.layer ? this : this.toLayer(b.layer);
    const lower = this.layer > b.layer ? b.toLayer(this.layer) : b;
    return higher.subtract(lower);
  }

  multiply(other) {
    const b = LayeredNumber.cast(other);
    if (this.sign === 0 || b.sign === 0) return LayeredNumber.zero();

    const sign = this.sign * b.sign;
    if (this.layer === 0 && b.layer === 0) {
      const mantissa = this.mantissa * b.mantissa;
      const exponent = this.exponent + b.exponent;
      return LayeredNumber.fromLayer0(mantissa, exponent, sign).normalize();
    }
    const highLayer = Math.max(this.layer, b.layer);
    const aLift = this.toLayer(highLayer);
    const bLift = b.toLayer(highLayer);
    if (highLayer === 1) {
      const value = aLift.value + bLift.value;
      return LayeredNumber.fromLayer1(value, sign).normalize();
    }
    // fallback
    const resultValue = Math.log10(this.toNumber()) + Math.log10(b.toNumber());
    return LayeredNumber.fromLayer1(resultValue, sign).normalize();
  }

  multiplyNumber(num) {
    if (typeof num !== 'number') return this.multiply(num);
    if (num === 0) return LayeredNumber.zero();
    if (this.sign === 0) return LayeredNumber.zero();
    if (this.layer === 0) {
      const mantissa = this.mantissa * Math.abs(num);
      const sign = num >= 0 ? this.sign : -this.sign;
      return LayeredNumber.fromLayer0(mantissa, this.exponent, sign).normalize();
    }
    const add = Math.log10(Math.abs(num));
    const sign = num >= 0 ? this.sign : -this.sign;
    return LayeredNumber.fromLayer1(this.value + add, sign).normalize();
  }

  divide(other) {
    const b = LayeredNumber.cast(other);
    if (b.isZero()) return LayeredNumber.zero();
    if (this.isZero()) return LayeredNumber.zero();
    const sign = this.sign * b.sign;
    if (this.layer === 0 && b.layer === 0) {
      const mantissa = this.mantissa / b.mantissa;
      const exponent = this.exponent - b.exponent;
      return LayeredNumber.fromLayer0(mantissa, exponent, sign).normalize();
    }
    const highLayer = Math.max(this.layer, b.layer);
    const aLift = this.toLayer(highLayer);
    const bLift = b.toLayer(highLayer);
    if (highLayer === 1) {
      const value = aLift.value - bLift.value;
      return LayeredNumber.fromLayer1(value, sign).normalize();
    }
    const resultValue = Math.log10(this.toNumber()) - Math.log10(b.toNumber());
    return LayeredNumber.fromLayer1(resultValue, sign).normalize();
  }

  pow(power) {
    if (typeof power !== 'number') return this.pow(power.toNumber());
    if (power === 0) return LayeredNumber.one();
    if (this.isZero()) return LayeredNumber.zero();
    if (this.layer === 0) {
      const mantissa = Math.pow(this.mantissa, power);
      const exponent = this.exponent * power;
      return LayeredNumber.fromLayer0(mantissa, exponent, this.sign >= 0 ? 1 : -1).normalize();
    }
    return LayeredNumber.fromLayer1(this.value * power, this.sign >= 0 ? 1 : -1).normalize();
  }

  negate() {
    const result = this.clone();
    result.sign *= -1;
    return result;
  }

  toNumber() {
    if (this.sign === 0) return 0;
    if (this.layer === 0) {
      return this.sign * this.mantissa * Math.pow(10, this.exponent);
    }
    const approx = this.value;
    if (approx > 308) {
      return this.sign * Number.POSITIVE_INFINITY;
    }
    return this.sign * Math.pow(10, approx);
  }

  toString() {
    if (this.sign === 0) return '0';
    if (this.layer === 0) {
      const value = this.mantissa * Math.pow(10, this.exponent);
      if (Math.abs(this.exponent) < 6) {
        return (this.sign * value).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
      }
      const mant = (this.sign * this.mantissa).toFixed(2);
      return `${mant}e${this.exponent}`;
    }
    return `10^${LayeredNumber.formatExponent(this.value)}`;
  }

  format() {
    return this.toString();
  }

  toJSON() {
    return {
      sign: this.sign,
      layer: this.layer,
      mantissa: this.mantissa,
      exponent: this.exponent,
      value: this.value
    };
  }

  static cast(value) {
    if (value instanceof LayeredNumber) return value;
    if (typeof value === 'number') return new LayeredNumber(value);
    return new LayeredNumber(value);
  }

  static formatExponent(value) {
    if (!isFinite(value)) return '∞';
    const abs = Math.abs(value);
    if (abs < 1e4) {
      if (abs >= 100) return value.toFixed(0);
      if (abs >= 10) return value.toFixed(1);
      return value.toFixed(2);
    }
    return value.toExponential(2).replace('+', '').replace('e0', '');
  }
}

const CONFIG = typeof window !== 'undefined' && window.GAME_CONFIG ? window.GAME_CONFIG : {};

const periodicElements = Array.isArray(globalThis.PERIODIC_ELEMENTS)
  ? globalThis.PERIODIC_ELEMENTS.map(def => ({
      ...def,
      position: def.position || { row: def.period ?? 0, column: def.group ?? 0 }
    }))
  : [];

const TOTAL_ELEMENT_COUNT = periodicElements.length;

const periodicElementIndex = new Map(
  periodicElements.map(def => [def.id, def])
);

const configElements = Array.isArray(CONFIG.elements) ? CONFIG.elements : [];

const elementConfigByAtomicNumber = new Map();
configElements.forEach(entry => {
  if (!entry || typeof entry !== 'object') return;
  const atomicNumber = Number(entry.numero ?? entry.number ?? entry.atomicNumber);
  if (!Number.isFinite(atomicNumber)) return;
  elementConfigByAtomicNumber.set(atomicNumber, entry);
});

function resolveElementRarity(definition) {
  if (!definition) return null;
  const atomicNumber = Number(definition.atomicNumber);
  const configEntry = Number.isFinite(atomicNumber)
    ? elementConfigByAtomicNumber.get(atomicNumber)
    : null;
  if (configEntry) {
    if (configEntry.rarete) return configEntry.rarete;
    if (configEntry.rarity) return configEntry.rarity;
  }
  if (definition.tags && definition.tags.rarity) {
    return definition.tags.rarity;
  }
  return null;
}

const elementRarityIndex = new Map();
periodicElements.forEach(def => {
  const rarity = resolveElementRarity(def);
  if (rarity) {
    elementRarityIndex.set(def.id, rarity);
  }
});

const configuredRarityIds = new Set(elementRarityIndex.values());

const CATEGORY_LABELS = {
  'alkali-metal': 'métal alcalin',
  'alkaline-earth-metal': 'métal alcalino-terreux',
  'transition-metal': 'métal de transition',
  'post-transition-metal': 'métal pauvre',
  metalloid: 'métalloïde',
  nonmetal: 'non-métal',
  halogen: 'halogène',
  'noble-gas': 'gaz noble',
  lanthanide: 'lanthanide',
  actinide: 'actinide'
};

function createInitialElementCollection() {
  const collection = {};
  periodicElements.forEach(def => {
    const gachaId = def.gachaId ?? def.id;
    const atomicNumber = Number(def.atomicNumber);
    const configEntry = Number.isFinite(atomicNumber)
      ? elementConfigByAtomicNumber.get(atomicNumber)
      : null;
    const rarity = elementRarityIndex.get(def.id) || null;
    const effects = Array.isArray(configEntry?.effects)
      ? [...configEntry.effects]
      : [];
    const bonuses = [];
    const bonusValue = configEntry?.bonus;
    if (Array.isArray(bonusValue)) {
      bonusValue.forEach(item => {
        if (typeof item === 'string' && item.trim()) {
          bonuses.push(item.trim());
        }
      });
    } else if (typeof bonusValue === 'string' && bonusValue.trim()) {
      bonuses.push(bonusValue.trim());
    }
    collection[def.id] = {
      id: def.id,
      gachaId,
      owned: false,
      rarity,
      effects,
      bonuses
    };
  });
  return collection;
}

function toLayeredNumber(value, fallback = 0) {
  if (value instanceof LayeredNumber) return value.clone();
  if (value == null) return new LayeredNumber(fallback);
  if (typeof value === 'number') return new LayeredNumber(value);
  if (typeof value === 'object') {
    if (value.type === 'number') return new LayeredNumber(value.value ?? fallback);
    if (value.type === 'layer0') {
      const mantissa = value.mantissa ?? value.value ?? fallback;
      const exponent = value.exponent ?? 0;
      const sign = value.sign ?? 1;
      return LayeredNumber.fromLayer0(mantissa, exponent, sign);
    }
    if (value.type === 'layer1') {
      const val = value.value ?? fallback;
      const sign = value.sign ?? 1;
      return LayeredNumber.fromLayer1(val, sign);
    }
    if (value.type === 'json' && value.value) {
      return LayeredNumber.fromJSON(value.value);
    }
    if ('layer' in value || 'mantissa' in value || 'exponent' in value || 'value' in value || 'sign' in value) {
      return LayeredNumber.fromJSON(value);
    }
  }
  return new LayeredNumber(fallback);
}

const DEFAULT_GACHA_COST = 100;

const DEFAULT_GACHA_RARITIES = [
  {
    id: 'commun',
    label: 'Commun cosmique',
    description: 'Les briques fondamentales présentes dans la majorité des nébuleuses.',
    weight: 55,
    color: '#6bb8ff'
  },
  {
    id: 'essentiel',
    label: 'Essentiel planétaire',
    description: 'Éléments abondants dans les mondes rocheux et les atmosphères habitables.',
    weight: 20,
    color: '#74f5c6'
  },
  {
    id: 'stellaire',
    label: 'Forge stellaire',
    description: 'Alliages façonnés au coeur des étoiles et disséminés par les supernovæ.',
    weight: 12,
    color: '#c1f06a'
  },
  {
    id: 'singulier',
    label: 'Singularité minérale',
    description: 'Cristaux recherchés, rarement concentrés au même endroit.',
    weight: 7,
    color: '#ffb45a'
  },
  {
    id: 'mythique',
    label: 'Mythe quantique',
    description: 'Éléments légendaires aux propriétés extrêmes et insaisissables.',
    weight: 4,
    color: '#ff6cb1'
  },
  {
    id: 'irreel',
    label: 'Irréel',
    description: 'Synthèses artificielles nées uniquement dans des accélérateurs.',
    weight: 2,
    color: '#a579ff'
  }
];

function sanitizeGachaRarities(rawRarities) {
  const base = Array.isArray(rawRarities) && rawRarities.length
    ? rawRarities
    : DEFAULT_GACHA_RARITIES;
  const seen = new Set();
  const sanitized = [];
  base.forEach(entry => {
    if (!entry || typeof entry !== 'object') return;
    const rawId = entry.id ?? entry.rarity ?? entry.key;
    if (!rawId) return;
    const id = String(rawId).trim();
    if (!id || seen.has(id)) return;
    const weightValue = Number(entry.weight ?? entry.rate ?? entry.dropRate ?? entry.chance ?? 0);
    sanitized.push({
      id,
      label: entry.label ? String(entry.label) : id,
      description: entry.description ? String(entry.description) : '',
      weight: Number.isFinite(weightValue) ? weightValue : 0,
      color: entry.color ? String(entry.color) : null
    });
    seen.add(id);
  });
  if (!sanitized.length) {
    return DEFAULT_GACHA_RARITIES.map(entry => ({ ...entry }));
  }
  return sanitized;
}

const rawGachaConfig = CONFIG.gacha && typeof CONFIG.gacha === 'object'
  ? CONFIG.gacha
  : {};

const GACHA_COST = toLayeredNumber(rawGachaConfig.cost ?? DEFAULT_GACHA_COST, DEFAULT_GACHA_COST);

const GACHA_RARITIES = sanitizeGachaRarities(rawGachaConfig.rarities).map(entry => ({
  ...entry,
  weight: Math.max(0, Number(entry.weight) || 0)
}));

const GACHA_RARITY_MAP = new Map();
GACHA_RARITIES.forEach(entry => {
  GACHA_RARITY_MAP.set(entry.id, entry);
  configuredRarityIds.delete(entry.id);
});

configuredRarityIds.forEach(id => {
  const fallback = { id, label: id, description: '', weight: 0, color: null };
  GACHA_RARITIES.push(fallback);
  GACHA_RARITY_MAP.set(id, fallback);
});

const GACHA_TOTAL_WEIGHT = GACHA_RARITIES.reduce((total, entry) => total + (entry.weight || 0), 0);

const gachaPools = new Map();
const gachaRarityRows = new Map();

function rebuildGachaPools() {
  gachaPools.clear();
  GACHA_RARITIES.forEach(entry => {
    gachaPools.set(entry.id, []);
  });
  periodicElements.forEach(def => {
    const rarity = elementRarityIndex.get(def.id);
    if (!rarity) return;
    if (!gachaPools.has(rarity)) {
      gachaPools.set(rarity, []);
    }
    gachaPools.get(rarity).push(def.id);
  });
}

rebuildGachaPools();

LayeredNumber.LAYER1_THRESHOLD = CONFIG.numbers?.layer1Threshold ?? 1e6;
LayeredNumber.LAYER1_DOWN = CONFIG.numbers?.layer1Downshift ?? 5;
LayeredNumber.LOG_DIFF_LIMIT = CONFIG.numbers?.logDifferenceLimit ?? 15;
LayeredNumber.EPSILON = CONFIG.numbers?.epsilon ?? 1e-12;

const BASE_PER_CLICK = toLayeredNumber(CONFIG.progression?.basePerClick, 1);
const BASE_PER_SECOND = toLayeredNumber(CONFIG.progression?.basePerSecond, 0);
const DEFAULT_THEME = CONFIG.progression?.defaultTheme ?? 'dark';
const OFFLINE_GAIN_CAP = CONFIG.progression?.offlineCapSeconds ?? 60 * 60 * 12;

const FALLBACK_UPGRADES = [
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
];

const FALLBACK_MILESTONES = [
  { amount: 100, text: 'Collectez 100 atomes pour débloquer la synthèse automatique.' },
  { amount: 1_000, text: 'Atteignez 1 000 atomes pour améliorer vos gants quantiques.' },
  { amount: 1_000_000, text: 'Atteignez 1 million d’atomes pour accéder aux surcadences.' },
  { amount: { type: 'layer1', value: 8 }, text: 'Accumulez 10^8 atomes pour préparer la prochaine ère.' }
];

function createInitialStats() {
  return {
    session: {
      atomsGained: LayeredNumber.zero(),
      manualClicks: 0,
      onlineTimeMs: 0,
      startedAt: Date.now()
    },
    global: {
      manualClicks: 0,
      playTimeMs: 0
    }
  };
}

function createEmptyProductionEntry() {
  return {
    base: LayeredNumber.zero(),
    totalAddition: LayeredNumber.zero(),
    totalMultiplier: 1,
    additions: [],
    multipliers: [],
    total: LayeredNumber.zero()
  };
}

function createEmptyProductionBreakdown() {
  return {
    perClick: createEmptyProductionEntry(),
    perSecond: createEmptyProductionEntry()
  };
}

function parseStats(saved) {
  const stats = createInitialStats();
  if (!saved || typeof saved !== 'object') {
    return stats;
  }
  if (saved.session) {
    stats.session.atomsGained = LayeredNumber.fromJSON(saved.session.atomsGained);
    stats.session.manualClicks = Number(saved.session.manualClicks) || 0;
    stats.session.onlineTimeMs = Number(saved.session.onlineTimeMs) || 0;
    stats.session.startedAt = typeof saved.session.startedAt === 'number'
      ? saved.session.startedAt
      : Date.now();
  }
  if (saved.global) {
    stats.global.manualClicks = Number(saved.global.manualClicks) || 0;
    stats.global.playTimeMs = Number(saved.global.playTimeMs) || 0;
  }
  return stats;
}

// Game state management
const DEFAULT_STATE = {
  atoms: LayeredNumber.zero(),
  lifetime: LayeredNumber.zero(),
  perClick: BASE_PER_CLICK.clone(),
  perSecond: BASE_PER_SECOND.clone(),
  upgrades: {},
  elements: createInitialElementCollection(),
  lastSave: Date.now(),
  theme: DEFAULT_THEME,
  stats: createInitialStats(),
  production: createEmptyProductionBreakdown()
};

const gameState = {
  atoms: LayeredNumber.zero(),
  lifetime: LayeredNumber.zero(),
  perClick: BASE_PER_CLICK.clone(),
  perSecond: BASE_PER_SECOND.clone(),
  upgrades: {},
  elements: createInitialElementCollection(),
  theme: DEFAULT_THEME,
  stats: createInitialStats(),
  production: createEmptyProductionBreakdown()
};

const UPGRADE_DEFS = Array.isArray(CONFIG.upgrades) ? CONFIG.upgrades : FALLBACK_UPGRADES;

const milestoneSource = Array.isArray(CONFIG.milestones) ? CONFIG.milestones : FALLBACK_MILESTONES;

const milestoneList = milestoneSource.map(entry => ({
  amount: toLayeredNumber(entry.amount, 0),
  text: entry.text
}));

const elements = {
  navButtons: document.querySelectorAll('.nav-button'),
  pages: document.querySelectorAll('.page'),
  statusAtoms: document.getElementById('statusAtoms'),
  statusApc: document.getElementById('statusApc'),
  statusAps: document.getElementById('statusAps'),
  atomButton: document.getElementById('atomButton'),
  starfield: document.querySelector('.starfield'),
  shopList: document.getElementById('shopList'),
  periodicTable: document.getElementById('periodicTable'),
  elementInfoPanel: document.getElementById('elementInfoPanel'),
  elementInfoPlaceholder: document.getElementById('elementInfoPlaceholder'),
  elementInfoContent: document.getElementById('elementInfoContent'),
  elementInfoNumber: document.getElementById('elementInfoNumber'),
  elementInfoSymbol: document.getElementById('elementInfoSymbol'),
  elementInfoName: document.getElementById('elementInfoName'),
  elementInfoCategory: document.getElementById('elementInfoCategory'),
  elementInfoMass: document.getElementById('elementInfoMass'),
  elementInfoPeriod: document.getElementById('elementInfoPeriod'),
  elementInfoGroup: document.getElementById('elementInfoGroup'),
  elementInfoCollection: document.getElementById('elementInfoCollection'),
  collectionProgress: document.getElementById('elementCollectionProgress'),
  nextMilestone: document.getElementById('nextMilestone'),
  gachaRollButton: document.getElementById('gachaRollButton'),
  gachaResult: document.getElementById('gachaResult'),
  gachaCostValue: document.getElementById('gachaCostValue'),
  gachaWallet: document.getElementById('gachaWallet'),
  gachaRarityList: document.getElementById('gachaRarityList'),
  gachaOwnedSummary: document.getElementById('gachaOwnedSummary'),
  themeSelect: document.getElementById('themeSelect'),
  resetButton: document.getElementById('resetButton'),
  infoApsTotal: document.getElementById('infoApsTotal'),
  infoApsBase: document.getElementById('infoApsBase'),
  infoApsAdditionTotal: document.getElementById('infoApsAdditionTotal'),
  infoApsMultiplierTotal: document.getElementById('infoApsMultiplierTotal'),
  infoApsAdditions: document.getElementById('infoApsAdditions'),
  infoApsMultipliers: document.getElementById('infoApsMultipliers'),
  infoApcTotal: document.getElementById('infoApcTotal'),
  infoApcBase: document.getElementById('infoApcBase'),
  infoApcAdditionTotal: document.getElementById('infoApcAdditionTotal'),
  infoApcMultiplierTotal: document.getElementById('infoApcMultiplierTotal'),
  infoApcAdditions: document.getElementById('infoApcAdditions'),
  infoApcMultipliers: document.getElementById('infoApcMultipliers'),
  infoSessionAtoms: document.getElementById('infoSessionAtoms'),
  infoSessionClicks: document.getElementById('infoSessionClicks'),
  infoSessionDuration: document.getElementById('infoSessionDuration'),
  infoGlobalAtoms: document.getElementById('infoGlobalAtoms'),
  infoGlobalClicks: document.getElementById('infoGlobalClicks'),
  infoGlobalDuration: document.getElementById('infoGlobalDuration')
};

const shopRows = new Map();
const periodicCells = new Map();
let selectedElementId = null;

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
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return '×—';
  }
  const abs = Math.abs(numeric);
  const options = { maximumFractionDigits: 2 };
  if (abs < 10) {
    options.minimumFractionDigits = 2;
  }
  return `×${numeric.toLocaleString('fr-FR', options)}`;
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
  if (elements.elementInfoMass) {
    const massText = formatAtomicMass(definition.atomicMass);
    elements.elementInfoMass.textContent = massText || '—';
  }
  if (elements.elementInfoPeriod) {
    elements.elementInfoPeriod.textContent =
      definition.period != null ? definition.period : '—';
  }
  if (elements.elementInfoGroup) {
    elements.elementInfoGroup.textContent =
      definition.group != null ? definition.group : '—';
  }
  if (elements.elementInfoCollection) {
    const entry = gameState.elements?.[definition.id];
    const rarityId = entry?.rarity || elementRarityIndex.get(definition.id);
    const rarityDef = rarityId ? GACHA_RARITY_MAP.get(rarityId) : null;
    const status = entry?.owned ? 'Possédé' : 'Non possédé';
    elements.elementInfoCollection.textContent = rarityDef
      ? `${rarityDef.label || rarityDef.id} · ${status}`
      : status;
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
    if (state?.owned) {
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
  const ownedCount = elementEntries.reduce((total, entry) => total + (entry.owned ? 1 : 0), 0);
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
    cell.classList.toggle('is-owned', Boolean(entry?.owned));
  });

  if (selectedElementId && periodicElementIndex.has(selectedElementId)) {
    updateElementInfoPanel(periodicElementIndex.get(selectedElementId));
  }

  updateGachaRarityProgress();
}

function renderGachaRarityList() {
  if (!elements.gachaRarityList) return;
  elements.gachaRarityList.innerHTML = '';
  gachaRarityRows.clear();
  const totalWeight = GACHA_TOTAL_WEIGHT;
  GACHA_RARITIES.forEach(def => {
    const item = document.createElement('li');
    item.className = 'gacha-rarity';
    item.dataset.rarityId = def.id;
    if (def.color) {
      item.style.setProperty('--rarity-color', def.color);
    }

    const header = document.createElement('div');
    header.className = 'gacha-rarity__header';

    const label = document.createElement('span');
    label.className = 'gacha-rarity__label';
    label.textContent = def.label || def.id;

    const chance = document.createElement('span');
    chance.className = 'gacha-rarity__chance';
    if (def.weight > 0 && totalWeight > 0) {
      const ratio = (def.weight / totalWeight) * 100;
      const digits = ratio >= 10 ? 1 : 2;
      chance.textContent = `${ratio.toFixed(digits).replace('.', ',')}\u00a0%`;
    } else {
      chance.textContent = '—';
    }

    header.append(label, chance);
    item.appendChild(header);

    if (def.description) {
      const description = document.createElement('p');
      description.className = 'gacha-rarity__description';
      description.textContent = def.description;
      item.appendChild(description);
    }

    const progress = document.createElement('div');
    progress.className = 'gacha-rarity__progress';
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '0');
    progress.setAttribute('aria-valuenow', '0');

    const bar = document.createElement('div');
    bar.className = 'gacha-rarity__bar';
    progress.appendChild(bar);

    const summary = document.createElement('p');
    summary.className = 'gacha-rarity__summary';
    summary.textContent = 'Aucun élément';

    item.append(progress, summary);
    elements.gachaRarityList.appendChild(item);
    gachaRarityRows.set(def.id, { item, progress, bar, summary });
  });

  updateGachaRarityProgress();
}

function updateGachaRarityProgress() {
  if (!gachaRarityRows.size) return;
  const totals = new Map();
  gachaPools.forEach((ids, rarity) => {
    totals.set(rarity, { total: ids.length, owned: 0 });
  });

  const entries = Object.values(gameState.elements || {});
  entries.forEach(entry => {
    if (!entry) return;
    const rarityId = entry.rarity || elementRarityIndex.get(entry.id);
    if (!rarityId || !totals.has(rarityId)) return;
    const bucket = totals.get(rarityId);
    if (entry.owned) {
      bucket.owned += 1;
    }
  });

  gachaRarityRows.forEach((row, rarityId) => {
    const data = totals.get(rarityId) || { total: 0, owned: 0 };
    const total = data.total;
    const owned = data.owned;
    row.progress.setAttribute('aria-valuemax', String(total));
    row.progress.setAttribute('aria-valuenow', String(owned));
    const percent = total > 0 ? (owned / total) * 100 : 0;
    row.bar.style.width = `${percent}%`;
    row.summary.textContent = total > 0
      ? `${owned} / ${total} éléments`
      : 'Aucun élément';
  });
}

function pickGachaRarity() {
  const available = GACHA_RARITIES.filter(def => {
    const pool = gachaPools.get(def.id);
    return Array.isArray(pool) && pool.length > 0;
  });
  if (!available.length) {
    return null;
  }
  const totalWeight = available.reduce((sum, def) => sum + (def.weight || 0), 0);
  if (totalWeight <= 0) {
    const index = Math.floor(Math.random() * available.length);
    return available[index];
  }
  let roll = Math.random() * totalWeight;
  for (const def of available) {
    const weight = Math.max(0, def.weight || 0);
    if (weight <= 0) {
      continue;
    }
    if (roll < weight) {
      return def;
    }
    roll -= weight;
  }
  return available[available.length - 1];
}

function pickRandomElementFromRarity(rarityId) {
  const pool = gachaPools.get(rarityId);
  if (!pool || !pool.length) {
    return null;
  }
  const index = Math.floor(Math.random() * pool.length);
  const elementId = pool[index];
  return periodicElementIndex.get(elementId) || null;
}

function setGachaResult(rarityDef, elementDef, isNew) {
  if (!elements.gachaResult) return;
  if (!rarityDef || !elementDef) {
    elements.gachaResult.textContent = 'Synthèse indisponible pour le moment.';
    elements.gachaResult.style.removeProperty('--rarity-color');
    return;
  }
  const rarityLabel = rarityDef.label || rarityDef.id;
  const statusText = isNew ? 'NOUVEAU !' : 'Déjà possédé';
  const parts = [
    `<span class="gacha-result__rarity">${rarityLabel}</span>`,
    `<span class="gacha-result__name">${elementDef.name} (${elementDef.symbol})</span>`,
    `<span class="gacha-result__status">${statusText}</span>`
  ];
  elements.gachaResult.innerHTML = parts.join(' ');
  if (rarityDef.color) {
    elements.gachaResult.style.setProperty('--rarity-color', rarityDef.color);
  } else {
    elements.gachaResult.style.removeProperty('--rarity-color');
  }
}

function updateGachaUI() {
  if (elements.gachaCostValue) {
    elements.gachaCostValue.textContent = GACHA_COST.toString();
  }
  if (elements.gachaWallet) {
    elements.gachaWallet.textContent = `Réserve actuelle : ${gameState.atoms.toString()} atomes`;
  }
  if (elements.gachaRollButton) {
    const affordable = gameState.atoms.compare(GACHA_COST) >= 0;
    elements.gachaRollButton.disabled = !affordable;
    const label = affordable ? 'Lancer une synthèse' : 'Atomes insuffisants';
    elements.gachaRollButton.setAttribute('aria-label', `${label} (${GACHA_COST.toString()} atomes)`);
    elements.gachaRollButton.title = `${label} (${GACHA_COST.toString()} atomes)`;
    elements.gachaRollButton.setAttribute('aria-disabled', affordable ? 'false' : 'true');
  }
}

function handleGachaRoll() {
  if (gameState.atoms.compare(GACHA_COST) < 0) {
    showToast('Pas assez d’atomes pour lancer la synthèse.');
    return;
  }

  const rarity = pickGachaRarity();
  if (!rarity) {
    showToast('Aucun élément disponible dans les chambres de synthèse.');
    return;
  }

  const elementDef = pickRandomElementFromRarity(rarity.id);
  if (!elementDef) {
    showToast('Flux instable, impossible de matérialiser un élément.');
    return;
  }

  gameState.atoms = gameState.atoms.subtract(GACHA_COST);

  let entry = gameState.elements[elementDef.id];
  let isNew = false;
  if (!entry) {
    entry = {
      id: elementDef.id,
      gachaId: elementDef.gachaId ?? elementDef.id,
      owned: true,
      rarity: rarity.id,
      effects: [],
      bonuses: []
    };
    gameState.elements[elementDef.id] = entry;
    isNew = true;
  } else {
    if (!entry.rarity) {
      entry.rarity = rarity.id;
    }
    if (!entry.owned) {
      entry.owned = true;
      isNew = true;
    }
  }

  updateUI();
  setGachaResult(rarity, elementDef, isNew);
  showToast(isNew
    ? `Nouvel élément obtenu : ${elementDef.name} !`
    : `${elementDef.name} rejoint à nouveau votre collection.`);
  saveGame();
}

function renderBonusList(container, entries, type) {
  if (!container) return;
  container.innerHTML = '';
  if (!entries || !entries.length) {
    const empty = document.createElement('li');
    empty.className = 'info-bonus__empty';
    empty.textContent = 'Aucun bonus actif';
    container.appendChild(empty);
    return;
  }

  entries.forEach(entry => {
    const item = document.createElement('li');
    item.className = 'info-bonus__entry';

    const label = document.createElement('span');
    label.className = 'info-bonus__label';
    const labelParts = [entry.label];
    if (entry.level != null) {
      labelParts.push(`(Niveau ${entry.level})`);
    }
    label.textContent = labelParts.join(' ');

    const value = document.createElement('span');
    value.className = 'info-bonus__value';
    if (type === 'multiplier') {
      value.textContent = formatMultiplier(entry.value);
    } else {
      const additionValue = entry.value instanceof LayeredNumber
        ? entry.value
        : new LayeredNumber(entry.value ?? 0);
      value.textContent = additionValue.isZero()
        ? '+0'
        : `+${additionValue.toString()}`;
    }

    item.append(label, value);
    container.appendChild(item);
  });
}

function updateProductionInfo(breakdown, targets) {
  if (!breakdown || !targets) return;

  if (targets.total) {
    const totalValue = breakdown.total instanceof LayeredNumber
      ? breakdown.total
      : new LayeredNumber(breakdown.total ?? 0);
    targets.total.textContent = totalValue.toString();
  }
  if (targets.base) {
    const baseValue = breakdown.base instanceof LayeredNumber
      ? breakdown.base
      : new LayeredNumber(breakdown.base ?? 0);
    targets.base.textContent = baseValue.toString();
  }
  if (targets.additionTotal) {
    const addition = breakdown.totalAddition instanceof LayeredNumber
      ? breakdown.totalAddition
      : new LayeredNumber(breakdown.totalAddition ?? 0);
    targets.additionTotal.textContent = addition.isZero()
      ? '+0'
      : `+${addition.toString()}`;
  }
  if (targets.multiplierTotal) {
    const multiplier = Number.isFinite(breakdown.totalMultiplier)
      ? breakdown.totalMultiplier
      : 1;
    targets.multiplierTotal.textContent = formatMultiplier(multiplier);
  }
  if (targets.additionsList) {
    renderBonusList(targets.additionsList, breakdown.additions, 'addition');
  }
  if (targets.multipliersList) {
    renderBonusList(targets.multipliersList, breakdown.multipliers, 'multiplier');
  }
}

function updateSessionStats() {
  const session = gameState.stats?.session;
  if (!session) return;

  if (elements.infoSessionAtoms) {
    const atoms = session.atomsGained instanceof LayeredNumber
      ? session.atomsGained
      : LayeredNumber.fromJSON(session.atomsGained);
    elements.infoSessionAtoms.textContent = atoms.toString();
  }
  if (elements.infoSessionClicks) {
    elements.infoSessionClicks.textContent = Number(session.manualClicks || 0).toLocaleString('fr-FR');
  }
  if (elements.infoSessionDuration) {
    elements.infoSessionDuration.textContent = formatDuration(session.onlineTimeMs);
  }
}

function updateGlobalStats() {
  const global = gameState.stats?.global;
  if (!global) return;

  if (elements.infoGlobalAtoms) {
    elements.infoGlobalAtoms.textContent = gameState.lifetime.toString();
  }
  if (elements.infoGlobalClicks) {
    elements.infoGlobalClicks.textContent = Number(global.manualClicks || 0).toLocaleString('fr-FR');
  }
  if (elements.infoGlobalDuration) {
    elements.infoGlobalDuration.textContent = formatDuration(global.playTimeMs);
  }
}

function updateInfoPanels() {
  const production = gameState.production;
  if (production) {
    updateProductionInfo(production.perSecond, {
      total: elements.infoApsTotal,
      base: elements.infoApsBase,
      additionTotal: elements.infoApsAdditionTotal,
      multiplierTotal: elements.infoApsMultiplierTotal,
      additionsList: elements.infoApsAdditions,
      multipliersList: elements.infoApsMultipliers
    });
    updateProductionInfo(production.perClick, {
      total: elements.infoApcTotal,
      base: elements.infoApcBase,
      additionTotal: elements.infoApcAdditionTotal,
      multiplierTotal: elements.infoApcMultiplierTotal,
      additionsList: elements.infoApcAdditions,
      multipliersList: elements.infoApcMultipliers
    });
  }

  updateSessionStats();
  updateGlobalStats();
}

let toastElement = null;

const CLICK_WINDOW_MS = CONFIG.presentation?.clicks?.windowMs ?? 1000;
const MAX_CLICKS_PER_SECOND = CONFIG.presentation?.clicks?.maxClicksPerSecond ?? 20;
const clickHistory = [];
let targetClickStrength = 0;
let displayedClickStrength = 0;

function isGamePageActive() {
  return document.body.dataset.activePage === 'game';
}

function updateClickHistory(now = performance.now()) {
  while (clickHistory.length && now - clickHistory[0] > CLICK_WINDOW_MS) {
    clickHistory.shift();
  }
  const effective = Math.min(MAX_CLICKS_PER_SECOND, clickHistory.length);
  targetClickStrength = effective / MAX_CLICKS_PER_SECOND;
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
  const tremor = Math.pow(clamped, 0.45);
  const button = elements.atomButton;
  button.style.setProperty('--glow-strength', heat.toFixed(3));
  button.style.setProperty('--shake-distance', `${(tremor * 24).toFixed(3)}px`);
  button.style.setProperty('--shake-rotation', `${(tremor * 4.6).toFixed(3)}deg`);
  button.style.setProperty('--glow-color', interpolateGlowColor(heat));
  if (clamped > 0.01) {
    button.classList.add('is-active');
  } else {
    button.classList.remove('is-active');
  }
}

function updateClickVisuals(now = performance.now()) {
  updateClickHistory(now);
  displayedClickStrength += (targetClickStrength - displayedClickStrength) * 0.18;
  if (Math.abs(targetClickStrength - displayedClickStrength) < 0.0005) {
    displayedClickStrength = targetClickStrength;
  }
  applyClickStrength(displayedClickStrength);
}

function registerManualClick() {
  const now = performance.now();
  clickHistory.push(now);
  updateClickVisuals(now);
  if (gameState.stats) {
    gameState.stats.session.manualClicks += 1;
    gameState.stats.global.manualClicks += 1;
  }
}

function animateAtomPress() {
  if (!elements.atomButton) return;
  elements.atomButton.classList.add('is-pressed');
  clearTimeout(animateAtomPress.timeout);
  animateAtomPress.timeout = setTimeout(() => {
    elements.atomButton.classList.remove('is-pressed');
  }, 110);
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

function handleManualAtomClick() {
  gainAtoms(gameState.perClick, true);
  registerManualClick();
  animateAtomPress();
}

function shouldTriggerGlobalClick(event) {
  if (!isGamePageActive()) return false;
  if (event.target.closest('.app-header')) return false;
  if (event.target.closest('.status-bar')) return false;
  return true;
}

function showPage(pageId) {
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
}

const initiallyActivePage = document.querySelector('.page.active') || elements.pages[0];
if (initiallyActivePage) {
  showPage(initiallyActivePage.id);
} else {
  document.body.classList.remove('view-game');
}

elements.navButtons.forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.target));
});

renderPeriodicTable();
renderGachaRarityList();

if (elements.atomButton) {
  elements.atomButton.addEventListener('click', event => {
    event.stopPropagation();
    handleManualAtomClick();
  });
  elements.atomButton.addEventListener('dragstart', event => {
    event.preventDefault();
  });
}

if (elements.gachaRollButton) {
  elements.gachaRollButton.addEventListener('click', () => {
    handleGachaRoll();
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

function gainAtoms(amount, fromClick = false) {
  gameState.atoms = gameState.atoms.add(amount);
  gameState.lifetime = gameState.lifetime.add(amount);
  if (gameState.stats) {
    const session = gameState.stats.session;
    if (session?.atomsGained) {
      session.atomsGained = session.atomsGained.add(amount);
    }
  }
}

function computeUpgradeCost(def) {
  const level = gameState.upgrades[def.id] || 0;
  const costValue = def.baseCost * Math.pow(def.costScale, level);
  return new LayeredNumber(costValue);
}

function recalcProduction() {
  const clickBase = BASE_PER_CLICK.clone();
  const autoBase = BASE_PER_SECOND.clone();

  let clickAddition = LayeredNumber.zero();
  let autoAddition = LayeredNumber.zero();
  let clickMultiplier = 1;
  let autoMultiplier = 1;

  const clickDetails = {
    base: clickBase.clone(),
    totalAddition: LayeredNumber.zero(),
    totalMultiplier: 1,
    additions: [],
    multipliers: [],
    total: LayeredNumber.zero()
  };

  const autoDetails = {
    base: autoBase.clone(),
    totalAddition: LayeredNumber.zero(),
    totalMultiplier: 1,
    additions: [],
    multipliers: [],
    total: LayeredNumber.zero()
  };

  UPGRADE_DEFS.forEach(def => {
    const level = gameState.upgrades[def.id] || 0;
    if (!level) return;
    const effects = def.effect(level);

    if (effects.clickAdd != null) {
      const value = new LayeredNumber(effects.clickAdd);
      if (!value.isZero()) {
        clickAddition = clickAddition.add(value);
        clickDetails.additions.push({ id: def.id, label: def.name, level, value });
      }
    }

    if (effects.autoAdd != null) {
      const value = new LayeredNumber(effects.autoAdd);
      if (!value.isZero()) {
        autoAddition = autoAddition.add(value);
        autoDetails.additions.push({ id: def.id, label: def.name, level, value });
      }
    }

    if (effects.clickMult != null) {
      const raw = Number(effects.clickMult);
      const multiplier = Number.isFinite(raw) && raw > 0 ? raw : 1;
      clickMultiplier *= multiplier;
      if (multiplier !== 1) {
        clickDetails.multipliers.push({ id: def.id, label: def.name, level, value: multiplier });
      }
    }

    if (effects.autoMult != null) {
      const raw = Number(effects.autoMult);
      const multiplier = Number.isFinite(raw) && raw > 0 ? raw : 1;
      autoMultiplier *= multiplier;
      if (multiplier !== 1) {
        autoDetails.multipliers.push({ id: def.id, label: def.name, level, value: multiplier });
      }
    }
  });

  clickDetails.totalAddition = clickAddition;
  autoDetails.totalAddition = autoAddition;
  clickDetails.totalMultiplier = clickMultiplier;
  autoDetails.totalMultiplier = autoMultiplier;

  let perClick = clickBase.add(clickAddition).multiplyNumber(clickMultiplier);
  if (perClick.compare(LayeredNumber.zero()) < 0) {
    perClick = LayeredNumber.zero();
  }
  let perSecond = autoBase.add(autoAddition).multiplyNumber(autoMultiplier);

  clickDetails.total = perClick;
  autoDetails.total = perSecond;

  gameState.perClick = perClick;
  gameState.perSecond = perSecond;
  gameState.production = { perClick: clickDetails, perSecond: autoDetails };
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
  desc.textContent = def.description;

  const cost = document.createElement('div');
  cost.className = 'shop-item__cost';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'shop-item__action';
  button.addEventListener('click', () => {
    attemptPurchase(def);
  });

  item.append(header, desc, cost, button);

  return { root: item, level, cost, button };
}

function updateShopAffordability() {
  if (!shopRows.size) return;
  UPGRADE_DEFS.forEach(def => {
    const row = shopRows.get(def.id);
    if (!row) return;
    const level = gameState.upgrades[def.id] || 0;
    const cost = computeUpgradeCost(def);
    const affordable = gameState.atoms.compare(cost) >= 0;
    const actionLabel = level > 0 ? 'Améliorer' : 'Acheter';

    row.level.textContent = `Niveau ${level}`;
    row.cost.textContent = `Coût : ${cost.toString()}`;
    row.button.textContent = actionLabel;
    row.button.disabled = !affordable;
    row.button.classList.toggle('is-ready', affordable);
    row.root.classList.toggle('shop-item--ready', affordable);
    const ariaLabel = affordable
      ? `${actionLabel} ${def.name}`
      : `${actionLabel} ${def.name} (atomes insuffisants)`;
    row.button.setAttribute('aria-label', ariaLabel);
    row.button.title = ariaLabel;
  });
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

function attemptPurchase(def) {
  const cost = computeUpgradeCost(def);
  if (gameState.atoms.compare(cost) < 0) {
    showToast('Pas assez d’atomes.');
    return;
  }
  gameState.atoms = gameState.atoms.subtract(cost);
  gameState.upgrades[def.id] = (gameState.upgrades[def.id] || 0) + 1;
  recalcProduction();
  updateUI();
  showToast(`Amélioration "${def.name}" achetée !`);
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

function updateUI() {
  if (elements.statusAtoms) {
    elements.statusAtoms.textContent = gameState.atoms.toString();
  }
  if (elements.statusApc) {
    elements.statusApc.textContent = gameState.perClick.toString();
  }
  if (elements.statusAps) {
    elements.statusAps.textContent = gameState.perSecond.toString();
  }
  updateGachaUI();
  updateCollectionDisplay();
  updateShopAffordability();
  updateMilestone();
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

function serializeState() {
  const stats = gameState.stats || createInitialStats();
  return {
    atoms: gameState.atoms.toJSON(),
    lifetime: gameState.lifetime.toJSON(),
    perClick: gameState.perClick.toJSON(),
    perSecond: gameState.perSecond.toJSON(),
    upgrades: gameState.upgrades,
    elements: gameState.elements,
    theme: gameState.theme,
    stats: {
      session: {
        atomsGained: stats.session.atomsGained.toJSON(),
        manualClicks: stats.session.manualClicks,
        onlineTimeMs: stats.session.onlineTimeMs,
        startedAt: stats.session.startedAt
      },
      global: {
        manualClicks: stats.global.manualClicks,
        playTimeMs: stats.global.playTimeMs
      }
    },
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
    upgrades: {},
    elements: createInitialElementCollection(),
    theme: DEFAULT_THEME,
    stats: createInitialStats(),
    production: createEmptyProductionBreakdown()
  });
  applyTheme(DEFAULT_THEME);
  recalcProduction();
  renderShop();
  updateUI();
  saveGame();
}

function loadGame() {
  try {
    const raw = localStorage.getItem('atom2univers');
    if (!raw) {
      gameState.theme = DEFAULT_THEME;
      gameState.stats = createInitialStats();
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
    gameState.upgrades = data.upgrades || {};
    gameState.stats = parseStats(data.stats);
    const baseCollection = createInitialElementCollection();
    if (data.elements && typeof data.elements === 'object') {
      Object.entries(data.elements).forEach(([id, saved]) => {
        if (!baseCollection[id]) return;
        const reference = baseCollection[id];
        baseCollection[id] = {
          id,
          gachaId: reference.gachaId,
          owned: Boolean(saved?.owned),
          rarity: reference.rarity ?? (typeof saved?.rarity === 'string' ? saved.rarity : null),
          effects: Array.isArray(saved?.effects) ? [...saved.effects] : [],
          bonuses: Array.isArray(saved?.bonuses) ? [...saved.bonuses] : []
        };
      });
    }
    gameState.elements = baseCollection;
    gameState.theme = data.theme || DEFAULT_THEME;
    applyTheme(gameState.theme);
    recalcProduction();
    renderShop();
    updateUI();
    if (data.lastSave) {
      const diff = (Date.now() - data.lastSave) / 1000;
      const capped = Math.min(diff, OFFLINE_GAIN_CAP);
      if (capped > 0) {
        const offlineGain = gameState.perSecond.multiplyNumber(capped);
        gainAtoms(offlineGain);
        showToast(`Progression hors ligne : +${offlineGain.toString()} atomes`);
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
    gainAtoms(gain);
  }

  updateClickVisuals(now);
  updatePlaytime(delta);

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
recalcProduction();
renderShop();
updateUI();
initStarfield();
requestAnimationFrame(loop);
