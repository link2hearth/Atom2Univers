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

function readNumberProperty(source, candidates) {
  if (!source || typeof source !== 'object') {
    return undefined;
  }
  for (const key of candidates) {
    if (!(key in source)) continue;
    const rawValue = source[key];
    const numeric = typeof rawValue === 'number'
      ? rawValue
      : (typeof rawValue === 'string' ? Number(rawValue) : Number.NaN);
    if (Number.isFinite(numeric)) {
      return numeric;
    }
  }
  return undefined;
}

function readBooleanProperty(source, candidates) {
  if (!source || typeof source !== 'object') {
    return undefined;
  }
  for (const key of candidates) {
    if (!(key in source)) continue;
    const rawValue = source[key];
    if (typeof rawValue === 'boolean') {
      return rawValue;
    }
    if (typeof rawValue === 'number') {
      return rawValue !== 0;
    }
    if (typeof rawValue === 'string') {
      const normalized = rawValue.trim().toLowerCase();
      if (!normalized) continue;
      if (['true', '1', 'yes', 'on'].includes(normalized)) {
        return true;
      }
      if (['false', '0', 'no', 'off'].includes(normalized)) {
        return false;
      }
    }
  }
  return undefined;
}

function normalizeElementGroupAddConfig(raw, options = {}) {
  const {
    defaultMinCopies = 0,
    defaultMinUnique = 0,
    defaultRequireAllUnique = false
  } = options;
  if (raw == null) {
    return null;
  }
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw) || raw === 0) {
      return null;
    }
    return {
      clickAdd: raw,
      autoAdd: 0,
      uniqueClickAdd: 0,
      uniqueAutoAdd: 0,
      duplicateClickAdd: 0,
      duplicateAutoAdd: 0,
      rarityFlatMultipliers: null,
      minCopies: defaultMinCopies,
      minUnique: defaultMinUnique,
      requireAllUnique: defaultRequireAllUnique,
      label: null
    };
  }
  if (typeof raw === 'string') {
    const numeric = Number(raw);
    if (!Number.isFinite(numeric) || numeric === 0) {
      return null;
    }
    return {
      clickAdd: numeric,
      autoAdd: 0,
      uniqueClickAdd: 0,
      uniqueAutoAdd: 0,
      duplicateClickAdd: 0,
      duplicateAutoAdd: 0,
      rarityFlatMultipliers: null,
      minCopies: defaultMinCopies,
      minUnique: defaultMinUnique,
      requireAllUnique: defaultRequireAllUnique,
      label: null
    };
  }
  if (typeof raw !== 'object') {
    return null;
  }
  const click = readNumberProperty(raw, ['clickAdd', 'apc', 'perClick', 'manual', 'click']);
  const auto = readNumberProperty(raw, ['autoAdd', 'aps', 'perSecond', 'auto', 'automatic']);
  const uniqueClick = readNumberProperty(raw, [
    'uniqueClickAdd',
    'clickAddUnique',
    'perUniqueClick',
    'uniquePerClick',
    'uniqueApc'
  ]);
  const uniqueAuto = readNumberProperty(raw, [
    'uniqueAutoAdd',
    'autoAddUnique',
    'perUniqueAuto',
    'uniquePerSecond',
    'uniqueAps'
  ]);
  const duplicateClick = readNumberProperty(raw, [
    'duplicateClickAdd',
    'clickAddDuplicate',
    'perDuplicateClick',
    'duplicatePerClick',
    'duplicateApc'
  ]);
  const duplicateAuto = readNumberProperty(raw, [
    'duplicateAutoAdd',
    'autoAddDuplicate',
    'perDuplicateAuto',
    'duplicatePerSecond',
    'duplicateAps'
  ]);
  const clickAdd = Number.isFinite(click) ? click : 0;
  const autoAdd = Number.isFinite(auto) ? auto : 0;
  const uniqueClickAdd = Number.isFinite(uniqueClick) ? uniqueClick : 0;
  const uniqueAutoAdd = Number.isFinite(uniqueAuto) ? uniqueAuto : 0;
  const duplicateClickAdd = Number.isFinite(duplicateClick) ? duplicateClick : 0;
  const duplicateAutoAdd = Number.isFinite(duplicateAuto) ? duplicateAuto : 0;
  const rarityFlatMultipliers = normalizeRarityFlatMultipliers(
    raw.rarityFlatMultipliers
      ?? raw.targetRarityFlatMultipliers
      ?? raw.rarityFlatMultiplier
      ?? raw.targetRarityFlatMultiplier
      ?? raw.flatMultipliers
      ?? raw.applyToRarities
  );
  const hasFlatEffect = [
    clickAdd,
    autoAdd,
    uniqueClickAdd,
    uniqueAutoAdd,
    duplicateClickAdd,
    duplicateAutoAdd
  ].some(value => Number.isFinite(value) && value !== 0);
  const hasRarityFlatMultiplier = Array.isArray(rarityFlatMultipliers) && rarityFlatMultipliers.length > 0;
  if (!hasFlatEffect && !hasRarityFlatMultiplier) {
    return null;
  }
  const minCopiesCandidate = readNumberProperty(raw, [
    'minCopies',
    'minimumCopies',
    'requireCopies',
    'requiredCopies',
    'requiresCopies'
  ]);
  const minUniqueCandidate = readNumberProperty(raw, [
    'minUnique',
    'minimumUnique',
    'requireUnique',
    'requiredUnique',
    'requiresUnique',
    'minOwned',
    'minimumOwned',
    'requireOwned',
    'requiredOwned',
    'requiresOwned'
  ]);
  const requireAllUniqueCandidate = readBooleanProperty(raw, [
    'requireAllUnique',
    'requireAll',
    'requireFullSet',
    'requiresFullSet',
    'fullSet',
    'completeSet'
  ]);
  const minCopies = Number.isFinite(minCopiesCandidate) && minCopiesCandidate > 0
    ? Math.floor(minCopiesCandidate)
    : defaultMinCopies;
  const minUnique = Number.isFinite(minUniqueCandidate) && minUniqueCandidate > 0
    ? Math.floor(minUniqueCandidate)
    : defaultMinUnique;
  const requireAllUnique = requireAllUniqueCandidate != null
    ? requireAllUniqueCandidate
    : defaultRequireAllUnique;
  const label = typeof raw.label === 'string' && raw.label.trim() ? raw.label.trim() : null;
  return {
    clickAdd,
    autoAdd,
    uniqueClickAdd,
    uniqueAutoAdd,
    duplicateClickAdd,
    duplicateAutoAdd,
    rarityFlatMultipliers,
    minCopies,
    minUnique,
    requireAllUnique,
    label
  };
}

function normalizeElementGroupAddConfigList(raw, options = {}) {
  if (raw == null) {
    return null;
  }
  if (Array.isArray(raw)) {
    const normalized = raw
      .map(entry => normalizeElementGroupAddConfig(entry, options))
      .filter(entry => entry);
    return normalized.length ? normalized : null;
  }
  const single = normalizeElementGroupAddConfig(raw, options);
  return single ? [single] : null;
}

function normalizeRarityFlatMultipliers(raw) {
  if (raw == null) {
    return null;
  }

  const result = [];
  const registerEntry = (rarityId, config) => {
    if (!rarityId || typeof rarityId !== 'string') {
      return;
    }
    const normalizedId = rarityId.trim();
    if (!normalizedId) {
      return;
    }

    let perClickMultiplier;
    let perSecondMultiplier;

    if (typeof config === 'number') {
      if (Number.isFinite(config)) {
        perClickMultiplier = config;
      }
    } else if (typeof config === 'string') {
      const numeric = Number(config);
      if (Number.isFinite(numeric)) {
        perClickMultiplier = numeric;
      }
    } else if (config && typeof config === 'object') {
      const unifiedCandidate = readNumberProperty(config, ['multiplier', 'value', 'factor']);
      const clickCandidate = readNumberProperty(config, [
        'perClick',
        'click',
        'apc',
        'manual',
        'perClickMultiplier',
        'clickMultiplier',
        'clickFlatMultiplier'
      ]);
      const autoCandidate = readNumberProperty(config, [
        'perSecond',
        'auto',
        'aps',
        'automatic',
        'perSecondMultiplier',
        'autoMultiplier',
        'autoFlatMultiplier'
      ]);
      if (Number.isFinite(clickCandidate)) {
        perClickMultiplier = clickCandidate;
      }
      if (Number.isFinite(autoCandidate)) {
        perSecondMultiplier = autoCandidate;
      }
      if (!Number.isFinite(clickCandidate) && Number.isFinite(unifiedCandidate)) {
        perClickMultiplier = unifiedCandidate;
      }
      if (!Number.isFinite(autoCandidate) && Number.isFinite(unifiedCandidate)) {
        perSecondMultiplier = unifiedCandidate;
      }
    }

    const validClick = Number.isFinite(perClickMultiplier) && perClickMultiplier > 0 ? perClickMultiplier : 1;
    const validSecond = Number.isFinite(perSecondMultiplier) && perSecondMultiplier > 0 ? perSecondMultiplier : 1;
    if (validClick === 1 && validSecond === 1) {
      return;
    }
    result.push({
      rarityId: normalizedId,
      perClick: validClick,
      perSecond: validSecond
    });
  };

  if (Array.isArray(raw)) {
    raw.forEach(entry => {
      if (!entry) return;
      if (typeof entry === 'string') {
        registerEntry(entry, 2);
        return;
      }
      if (typeof entry !== 'object') {
        return;
      }
      const rarityId = entry.rarity ?? entry.rarityId ?? entry.target ?? entry.targetRarity;
      if (!rarityId) return;
      registerEntry(String(rarityId), entry);
    });
  } else if (typeof raw === 'object') {
    Object.entries(raw).forEach(([rarityId, config]) => {
      registerEntry(String(rarityId), config);
    });
  } else if (typeof raw === 'string') {
    registerEntry(raw, 2);
  } else if (typeof raw === 'number') {
    registerEntry('commun', raw);
  }

  return result.length ? result : null;
}

function normalizeElementGroupMultiplier(raw) {
  if (raw == null) {
    return null;
  }
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw) || raw <= 0) {
      return null;
    }
    const base = raw;
    return {
      base,
      every: 0,
      increment: 0,
      cap: base,
      targets: new Set(['perClick', 'perSecond']),
      label: null
    };
  }
  if (typeof raw !== 'object') {
    return null;
  }
  const baseCandidate = readNumberProperty(raw, ['base', 'start', 'initial', 'value']);
  const base = Number.isFinite(baseCandidate) && baseCandidate > 0 ? baseCandidate : 1;
  const everyCandidate = readNumberProperty(raw, ['every', 'each', 'per', 'step', 'threshold', 'interval']);
  const every = Number.isFinite(everyCandidate) && everyCandidate > 0
    ? Math.floor(everyCandidate)
    : 0;
  const incrementCandidate = readNumberProperty(raw, ['increment', 'gain', 'stepValue', 'bonus', 'amount', 'increase']);
  const increment = Number.isFinite(incrementCandidate) ? incrementCandidate : 0;
  const capCandidate = readNumberProperty(raw, ['cap', 'max', 'maximum', 'limit']);
  let cap = Number.isFinite(capCandidate) && capCandidate > 0 ? capCandidate : Number.POSITIVE_INFINITY;
  if (Number.isFinite(cap)) {
    cap = Math.max(cap, base);
  }
  const rawTargets = raw.targets ?? raw.appliesTo ?? raw.affects ?? raw.types ?? raw.scope;
  const targets = new Set();
  const registerTarget = target => {
    if (typeof target !== 'string') return;
    const normalized = target.trim().toLowerCase();
    if (!normalized) return;
    if (['perclick', 'click', 'manual', 'apc', 'manualclick'].includes(normalized)) {
      targets.add('perClick');
    }
    if (['persecond', 'auto', 'automatic', 'aps', 'persec'].includes(normalized)) {
      targets.add('perSecond');
    }
  };
  if (Array.isArray(rawTargets)) {
    rawTargets.forEach(registerTarget);
  } else if (typeof rawTargets === 'string') {
    registerTarget(rawTargets);
  }
  if (targets.size === 0) {
    targets.add('perClick');
    targets.add('perSecond');
  }
  const label = typeof raw.label === 'string' && raw.label.trim() ? raw.label.trim() : null;
  if (increment === 0 && every === 0 && base === 1) {
    return null;
  }
  return {
    base,
    every,
    increment,
    cap,
    targets,
    label
  };
}

function normalizeCritBonusEffect(raw) {
  if (raw == null) {
    return null;
  }
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw) || raw === 0) {
      return null;
    }
    return { chanceAdd: raw };
  }
  if (typeof raw === 'string') {
    const numeric = Number(raw);
    if (!Number.isFinite(numeric) || numeric === 0) {
      return null;
    }
    return { chanceAdd: numeric };
  }
  if (typeof raw !== 'object') {
    return null;
  }
  const effectSource = raw.effect && typeof raw.effect === 'object' ? raw.effect : raw;
  const effect = {};

  const chanceSet = readNumberProperty(effectSource, [
    'chanceSet',
    'chanceBase',
    'setChance',
    'critChanceSet',
    'critChance'
  ]);
  if (Number.isFinite(chanceSet)) {
    effect.chanceSet = Math.max(0, chanceSet);
  }

  const chanceAdd = readNumberProperty(effectSource, [
    'chanceAdd',
    'chanceBonus',
    'critChanceAdd',
    'bonusChance',
    'addChance'
  ]);
  if (Number.isFinite(chanceAdd) && chanceAdd !== 0) {
    effect.chanceAdd = chanceAdd;
  }

  const chanceMult = readNumberProperty(effectSource, [
    'chanceMult',
    'chanceMultiplier',
    'critChanceMult',
    'multChance'
  ]);
  if (Number.isFinite(chanceMult) && chanceMult > 0 && chanceMult !== 1) {
    effect.chanceMult = chanceMult;
  }

  const multiplierSet = readNumberProperty(effectSource, [
    'multiplierSet',
    'setMultiplier',
    'critMultiplierSet',
    'critMultiplier'
  ]);
  if (Number.isFinite(multiplierSet)) {
    effect.multiplierSet = Math.max(0, multiplierSet);
  }

  const multiplierAdd = readNumberProperty(effectSource, [
    'multiplierAdd',
    'damageAdd',
    'critMultiplierAdd',
    'bonusMultiplier',
    'bonusDamage'
  ]);
  if (Number.isFinite(multiplierAdd) && multiplierAdd !== 0) {
    effect.multiplierAdd = multiplierAdd;
  }

  const multiplierMult = readNumberProperty(effectSource, [
    'multiplierMult',
    'multiplierMultiplier',
    'critMultiplierMult',
    'damageMult'
  ]);
  if (Number.isFinite(multiplierMult) && multiplierMult > 0 && multiplierMult !== 1) {
    effect.multiplierMult = multiplierMult;
  }

  const maxMultiplierSet = readNumberProperty(effectSource, [
    'maxMultiplierSet',
    'capSet',
    'critMaxMultiplierSet',
    'maxMultiplier'
  ]);
  if (Number.isFinite(maxMultiplierSet)) {
    effect.maxMultiplierSet = Math.max(0, maxMultiplierSet);
  }

  const maxMultiplierAdd = readNumberProperty(effectSource, [
    'maxMultiplierAdd',
    'capAdd',
    'critMaxMultiplierAdd'
  ]);
  if (Number.isFinite(maxMultiplierAdd) && maxMultiplierAdd !== 0) {
    effect.maxMultiplierAdd = maxMultiplierAdd;
  }

  const maxMultiplierMult = readNumberProperty(effectSource, [
    'maxMultiplierMult',
    'capMult',
    'critMaxMultiplierMult'
  ]);
  if (Number.isFinite(maxMultiplierMult) && maxMultiplierMult > 0 && maxMultiplierMult !== 1) {
    effect.maxMultiplierMult = maxMultiplierMult;
  }

  return Object.keys(effect).length ? effect : null;
}

function normalizeElementGroupCritConfig(raw) {
  if (raw == null) {
    return null;
  }
  if (typeof raw === 'number' || typeof raw === 'string') {
    const effect = normalizeCritBonusEffect(raw);
    return effect ? { perUnique: effect, perDuplicate: null, labels: null } : null;
  }
  if (typeof raw !== 'object') {
    return null;
  }
  const perUnique = normalizeCritBonusEffect(
    raw.perUnique
      ?? raw.perUniqueCopy
      ?? raw.unique
      ?? raw.first
      ?? raw.perUniqueElement
      ?? raw.perNew
  );
  const perDuplicate = normalizeCritBonusEffect(
    raw.perDuplicate
      ?? raw.perCopyBeyondFirst
      ?? raw.duplicate
      ?? raw.extra
      ?? raw.dupe
      ?? raw.perAdditional
  );
  const labels = {};
  if (raw.labels && typeof raw.labels === 'object') {
    if (typeof raw.labels.perUnique === 'string' && raw.labels.perUnique.trim()) {
      labels.perUnique = raw.labels.perUnique.trim();
    }
    if (typeof raw.labels.perDuplicate === 'string' && raw.labels.perDuplicate.trim()) {
      labels.perDuplicate = raw.labels.perDuplicate.trim();
    }
  }
  const hasLabels = Object.keys(labels).length > 0;
  if (!perUnique && !perDuplicate) {
    return null;
  }
  return {
    perUnique,
    perDuplicate,
    labels: hasLabels ? labels : null
  };
}

function normalizeRarityMultiplierBonus(raw) {
  if (raw == null) {
    return null;
  }
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw) || raw === 0) {
      return null;
    }
    return {
      amount: raw,
      uniqueThreshold: 0,
      copyThreshold: 0,
      targets: new Set(['perClick', 'perSecond']),
      label: null
    };
  }
  if (typeof raw !== 'object') {
    return null;
  }
  const amountCandidate = readNumberProperty(raw, ['amount', 'value', 'add', 'increase', 'bonus']);
  const amount = Number.isFinite(amountCandidate) ? amountCandidate : 0;
  if (amount === 0) {
    return null;
  }
  const uniqueThresholdCandidate = readNumberProperty(raw, [
    'uniqueThreshold',
    'minUnique',
    'minimumUnique',
    'requiredUnique',
    'requiresUnique',
    'unique',
    'threshold',
    'count'
  ]);
  const copyThresholdCandidate = readNumberProperty(raw, [
    'copyThreshold',
    'minCopies',
    'minimumCopies',
    'requiredCopies',
    'requiresCopies',
    'copies'
  ]);
  const uniqueThreshold = Number.isFinite(uniqueThresholdCandidate) && uniqueThresholdCandidate > 0
    ? Math.floor(uniqueThresholdCandidate)
    : 0;
  const copyThreshold = Number.isFinite(copyThresholdCandidate) && copyThresholdCandidate > 0
    ? Math.floor(copyThresholdCandidate)
    : 0;
  const rawTargets = raw.targets ?? raw.appliesTo ?? raw.scope ?? raw.types;
  const targets = new Set();
  const registerTarget = target => {
    if (typeof target !== 'string') return;
    const normalized = target.trim().toLowerCase();
    if (!normalized) return;
    if (['perclick', 'click', 'manual', 'apc', 'manualclick'].includes(normalized)) {
      targets.add('perClick');
    }
    if (['persecond', 'auto', 'automatic', 'aps', 'persec'].includes(normalized)) {
      targets.add('perSecond');
    }
  };
  if (Array.isArray(rawTargets)) {
    rawTargets.forEach(registerTarget);
  } else if (typeof rawTargets === 'string') {
    registerTarget(rawTargets);
  }
  if (targets.size === 0) {
    targets.add('perClick');
    targets.add('perSecond');
  }
  const label = typeof raw.label === 'string' && raw.label.trim() ? raw.label.trim() : null;
  return {
    amount,
    uniqueThreshold,
    copyThreshold,
    targets,
    label
  };
}

function normalizeElementGroupBonus(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const perCopy = normalizeElementGroupAddConfig(
    raw.perCopy ?? raw.perElement ?? raw.perCopyBonus ?? raw.perElementBonus ?? raw.perCollect,
    { defaultMinCopies: 1 }
  );
  const setBonuses = normalizeElementGroupAddConfigList(
    raw.setBonus ?? raw.groupBonus ?? raw.set ?? raw.group ?? raw.setReward ?? raw.bonusDeGroupe,
    { defaultRequireAllUnique: true }
  );
  const multiplier = normalizeElementGroupMultiplier(
    raw.multiplier ?? raw.groupMultiplier ?? raw.multiplicateur ?? raw.multiplierConfig
  );
  const crit = normalizeElementGroupCritConfig(
    raw.crit ?? raw.critBonus ?? raw.critBonuses ?? raw.critics ?? raw.critical
  );
  const rarityMultiplierBonus = normalizeRarityMultiplierBonus(
    raw.rarityMultiplierBonus
      ?? raw.rarityBonus
      ?? raw.multiplierBonus
      ?? raw.rarityMultiplierBoost
      ?? raw.rarityBoost
  );
  const labels = {};
  if (raw.labels && typeof raw.labels === 'object') {
    if (typeof raw.labels.perCopy === 'string' && raw.labels.perCopy.trim()) {
      labels.perCopy = raw.labels.perCopy.trim();
    }
    if (typeof raw.labels.setBonus === 'string' && raw.labels.setBonus.trim()) {
      labels.setBonus = raw.labels.setBonus.trim();
    }
    if (typeof raw.labels.multiplier === 'string' && raw.labels.multiplier.trim()) {
      labels.multiplier = raw.labels.multiplier.trim();
    }
    if (typeof raw.labels.rarityMultiplier === 'string' && raw.labels.rarityMultiplier.trim()) {
      labels.rarityMultiplier = raw.labels.rarityMultiplier.trim();
    }
  }
  const hasLabels = Object.keys(labels).length > 0;
  if (!perCopy && (!setBonuses || setBonuses.length === 0) && !multiplier && !crit && !rarityMultiplierBonus) {
    return null;
  }
  return {
    perCopy,
    setBonus: setBonuses ? setBonuses[0] : null,
    setBonuses,
    multiplier,
    crit,
    rarityMultiplierBonus,
    labels: hasLabels ? labels : null
  };
}

const RAW_ELEMENT_GROUP_BONUS_GROUPS = (() => {
  const rawConfig = CONFIG.elementBonuses ?? CONFIG.elementBonus ?? null;
  if (!rawConfig || typeof rawConfig !== 'object') {
    return {};
  }
  const rawGroups = rawConfig.groups
    ?? rawConfig.byRarity
    ?? rawConfig.rarity
    ?? rawConfig.groupsByRarity
    ?? rawConfig;
  if (!rawGroups || typeof rawGroups !== 'object') {
    return {};
  }
  return rawGroups;
})();

const ELEMENT_GROUP_BONUS_CONFIG = (() => {
  const result = new Map();
  Object.entries(RAW_ELEMENT_GROUP_BONUS_GROUPS).forEach(([rarityId, rawValue]) => {
    if (!rarityId) return;
    const normalizedRarityId = String(rarityId).trim();
    if (!normalizedRarityId) return;
    const normalizedConfig = normalizeElementGroupBonus(rawValue);
    if (!normalizedConfig) return;
    result.set(normalizedRarityId, normalizedConfig);
  });
  return result;
})();

const MYTHIQUE_RARITY_ID = 'mythique';
const RAW_MYTHIQUE_GROUP_CONFIG = (() => {
  const raw = RAW_ELEMENT_GROUP_BONUS_GROUPS[MYTHIQUE_RARITY_ID];
  return raw && typeof raw === 'object' ? raw : null;
})();

if (!ELEMENT_GROUP_BONUS_CONFIG.has(MYTHIQUE_RARITY_ID)) {
  const fallback = {};
  if (RAW_MYTHIQUE_GROUP_CONFIG?.labels && typeof RAW_MYTHIQUE_GROUP_CONFIG.labels === 'object') {
    fallback.labels = {};
    Object.entries(RAW_MYTHIQUE_GROUP_CONFIG.labels).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim()) {
        fallback.labels[key] = value.trim();
      }
    });
  }
  ELEMENT_GROUP_BONUS_CONFIG.set(MYTHIQUE_RARITY_ID, fallback);
} else if (RAW_MYTHIQUE_GROUP_CONFIG?.labels && typeof RAW_MYTHIQUE_GROUP_CONFIG.labels === 'object') {
  const entry = ELEMENT_GROUP_BONUS_CONFIG.get(MYTHIQUE_RARITY_ID);
  if (entry) {
    entry.labels = { ...(entry.labels || {}) };
    Object.entries(RAW_MYTHIQUE_GROUP_CONFIG.labels).forEach(([key, value]) => {
      if (typeof value === 'string' && value.trim()) {
        entry.labels[key] = value.trim();
      }
    });
  }
}

function pickDefined(...candidates) {
  for (const candidate of candidates) {
    if (candidate !== undefined && candidate !== null) {
      return candidate;
    }
  }
  return undefined;
}

function clampNumber(value, fallback, { min = -Infinity, max = Infinity } = {}) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  let result = numeric;
  if (Number.isFinite(min) && result < min) {
    result = min;
  }
  if (Number.isFinite(max) && result > max) {
    result = max;
  }
  return result;
}

const MYTHIQUE_BONUS_DEFAULTS = {
  ticket: {
    uniqueReductionSeconds: 1,
    minIntervalSeconds: 5
  },
  offline: {
    baseMultiplier: 0.01,
    perDuplicate: 0.01,
    cap: 1
  },
  overflow: {
    flatBonus: 50
  },
  frenzy: {
    multiplier: 1.5
  }
};

function normalizeMythiqueBonusConfig(rawConfig) {
  const config = {
    ticket: { ...MYTHIQUE_BONUS_DEFAULTS.ticket },
    offline: { ...MYTHIQUE_BONUS_DEFAULTS.offline },
    overflow: { ...MYTHIQUE_BONUS_DEFAULTS.overflow },
    frenzy: { ...MYTHIQUE_BONUS_DEFAULTS.frenzy }
  };
  if (!rawConfig || typeof rawConfig !== 'object') {
    return config;
  }

  const ticketCandidate = pickDefined(
    rawConfig.ticketBonus,
    rawConfig.ticket,
    rawConfig.specialBonuses?.ticketBonus,
    rawConfig.specialBonuses?.ticket,
    rawConfig.specials?.ticketBonus,
    rawConfig.specials?.ticket,
    rawConfig.bonusConfig?.ticketBonus,
    rawConfig.bonusConfig?.ticket
  );
  if (ticketCandidate !== undefined) {
    if (ticketCandidate && typeof ticketCandidate === 'object') {
      const reduction = clampNumber(
        ticketCandidate.uniqueReductionSeconds
          ?? ticketCandidate.reductionPerUnique
          ?? ticketCandidate.perUnique
          ?? ticketCandidate.reduction,
        config.ticket.uniqueReductionSeconds,
        { min: 0 }
      );
      const minInterval = clampNumber(
        ticketCandidate.minIntervalSeconds
          ?? ticketCandidate.minSeconds
          ?? ticketCandidate.minimum
          ?? ticketCandidate.minimumSeconds,
        config.ticket.minIntervalSeconds,
        { min: 1 }
      );
      config.ticket.uniqueReductionSeconds = reduction;
      config.ticket.minIntervalSeconds = minInterval;
    } else {
      const minInterval = clampNumber(ticketCandidate, config.ticket.minIntervalSeconds, { min: 1 });
      config.ticket.minIntervalSeconds = minInterval;
    }
  }

  const offlineCandidate = pickDefined(
    rawConfig.offlineBonus,
    rawConfig.offline,
    rawConfig.specialBonuses?.offlineBonus,
    rawConfig.specialBonuses?.offline,
    rawConfig.specials?.offlineBonus,
    rawConfig.specials?.offline,
    rawConfig.bonusConfig?.offlineBonus,
    rawConfig.bonusConfig?.offline
  );
  if (offlineCandidate !== undefined && offlineCandidate !== null) {
    if (typeof offlineCandidate === 'object') {
      const baseMultiplier = clampNumber(
        offlineCandidate.baseMultiplier
          ?? offlineCandidate.base
          ?? offlineCandidate.minimum
          ?? offlineCandidate.min,
        config.offline.baseMultiplier,
        { min: 0 }
      );
      const perDuplicate = clampNumber(
        offlineCandidate.perDuplicate
          ?? offlineCandidate.increment
          ?? offlineCandidate.step
          ?? offlineCandidate.perCopy,
        config.offline.perDuplicate,
        { min: 0 }
      );
      const cap = clampNumber(
        offlineCandidate.cap
          ?? offlineCandidate.maximum
          ?? offlineCandidate.max,
        config.offline.cap,
        { min: baseMultiplier }
      );
      config.offline.baseMultiplier = Math.min(baseMultiplier, cap);
      config.offline.perDuplicate = perDuplicate;
      config.offline.cap = Math.max(cap, config.offline.baseMultiplier);
    } else {
      const perDuplicate = clampNumber(offlineCandidate, config.offline.perDuplicate, { min: 0 });
      config.offline.perDuplicate = perDuplicate;
    }
  }

  const overflowCandidate = pickDefined(
    rawConfig.duplicateOverflow,
    rawConfig.overflow,
    rawConfig.specialBonuses?.duplicateOverflow,
    rawConfig.specialBonuses?.overflow,
    rawConfig.specials?.duplicateOverflow,
    rawConfig.specials?.overflow,
    rawConfig.bonusConfig?.duplicateOverflow,
    rawConfig.bonusConfig?.overflow
  );
  if (overflowCandidate !== undefined && overflowCandidate !== null) {
    if (typeof overflowCandidate === 'object') {
      const flatBonus = clampNumber(
        overflowCandidate.flatBonus
          ?? overflowCandidate.flat
          ?? overflowCandidate.amount,
        config.overflow.flatBonus,
        { min: 0 }
      );
      config.overflow.flatBonus = flatBonus;
    } else {
      const flatBonus = clampNumber(overflowCandidate, config.overflow.flatBonus, { min: 0 });
      config.overflow.flatBonus = flatBonus;
    }
  }

  const frenzyCandidate = pickDefined(
    rawConfig.frenzyBonus,
    rawConfig.frenzy,
    rawConfig.specialBonuses?.frenzyBonus,
    rawConfig.specialBonuses?.frenzy,
    rawConfig.specials?.frenzyBonus,
    rawConfig.specials?.frenzy,
    rawConfig.bonusConfig?.frenzyBonus,
    rawConfig.bonusConfig?.frenzy
  );
  if (frenzyCandidate !== undefined && frenzyCandidate !== null) {
    if (typeof frenzyCandidate === 'object') {
      const multiplier = clampNumber(
        frenzyCandidate.multiplier
          ?? frenzyCandidate.value
          ?? frenzyCandidate.amount,
        config.frenzy.multiplier,
        { min: 1 }
      );
      config.frenzy.multiplier = multiplier;
    } else {
      const multiplier = clampNumber(frenzyCandidate, config.frenzy.multiplier, { min: 1 });
      config.frenzy.multiplier = multiplier;
    }
  }

  return config;
}

const MYTHIQUE_SPECIAL_BONUS_CONFIG = normalizeMythiqueBonusConfig(RAW_MYTHIQUE_GROUP_CONFIG);

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
      count: 0,
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

const DEFAULT_GACHA_TICKET_COST = 1;

const DEFAULT_GACHA_RARITIES = [
  {
    id: 'commun',
    label: 'Commun cosmique',
    description: 'Les briques fondamentales présentes dans la majorité des nébuleuses.',
    weight: 55,
    color: '#4f7ec2'
  },
  {
    id: 'essentiel',
    label: 'Essentiel planétaire',
    description: 'Éléments abondants dans les mondes rocheux et les atmosphères habitables.',
    weight: 20,
    color: '#4ba88c'
  },
  {
    id: 'stellaire',
    label: 'Forge stellaire',
    description: 'Alliages façonnés au coeur des étoiles et disséminés par les supernovæ.',
    weight: 12,
    color: '#8caf58'
  },
  {
    id: 'singulier',
    label: 'Singularité minérale',
    description: 'Cristaux recherchés, rarement concentrés au même endroit.',
    weight: 7,
    color: '#d08a54'
  },
  {
    id: 'mythique',
    label: 'Mythe quantique',
    description: 'Éléments légendaires aux propriétés extrêmes et insaisissables.',
    weight: 4,
    color: '#c46a9a'
  },
  {
    id: 'irreel',
    label: 'Irréel',
    description: 'Synthèses artificielles nées uniquement dans des accélérateurs.',
    weight: 2,
    color: '#7d6fc9'
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

const GACHA_TICKET_COST = Math.max(
  1,
  Math.floor(
    Number(
      rawGachaConfig.ticketCost
        ?? rawGachaConfig.cost
        ?? DEFAULT_GACHA_TICKET_COST
    ) || DEFAULT_GACHA_TICKET_COST
  )
);

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

const RARITY_IDS = GACHA_RARITIES.map(entry => entry.id);
const RARITY_LABEL_MAP = new Map(GACHA_RARITIES.map(entry => [entry.id, entry.label || entry.id]));
const INFO_BONUS_RARITIES = RARITY_IDS.length > 0
  ? [...RARITY_IDS]
  : ['commun', 'essentiel', 'stellaire', 'singulier', 'mythique', 'irreel'];
const INFO_BONUS_SUBTITLE = INFO_BONUS_RARITIES.length
  ? INFO_BONUS_RARITIES.map(id => RARITY_LABEL_MAP.get(id) || id).join(' · ')
  : 'Raretés indisponibles';

const rawTicketStarConfig = CONFIG.ticketStar && typeof CONFIG.ticketStar === 'object'
  ? CONFIG.ticketStar
  : {};

const TICKET_STAR_CONFIG = {
  averageSpawnIntervalMs: (() => {
    const raw = Number(
      rawTicketStarConfig.averageSpawnIntervalSeconds
        ?? rawTicketStarConfig.averageIntervalSeconds
        ?? 60
    );
    const seconds = Number.isFinite(raw) && raw > 0 ? raw : 60;
    return seconds * 1000;
  })(),
  speed: (() => {
    const raw = Number(
      rawTicketStarConfig.speedPixelsPerSecond
        ?? rawTicketStarConfig.speed
        ?? 90
    );
    return Number.isFinite(raw) && raw > 0 ? raw : 90;
  })(),
  size: (() => {
    const raw = Number(rawTicketStarConfig.size ?? rawTicketStarConfig.spriteSize ?? 72);
    return Number.isFinite(raw) && raw > 0 ? raw : 72;
  })(),
  rewardTickets: (() => {
    const raw = Number(rawTicketStarConfig.rewardTickets ?? rawTicketStarConfig.tickets ?? 1);
    return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 1;
  })()
};

const DEFAULT_TICKET_STAR_INTERVAL_SECONDS = TICKET_STAR_CONFIG.averageSpawnIntervalMs / 1000;
const MYTHIQUE_OFFLINE_BASE = MYTHIQUE_SPECIAL_BONUS_CONFIG.offline.baseMultiplier;
const MYTHIQUE_OFFLINE_PER_DUPLICATE = MYTHIQUE_SPECIAL_BONUS_CONFIG.offline.perDuplicate;
const MYTHIQUE_OFFLINE_CAP = MYTHIQUE_SPECIAL_BONUS_CONFIG.offline.cap;
const MYTHIQUE_DUPLICATE_OVERFLOW_FLAT_BONUS = MYTHIQUE_SPECIAL_BONUS_CONFIG.overflow.flatBonus;
const MYTHIQUE_TICKET_MIN_INTERVAL_SECONDS = MYTHIQUE_SPECIAL_BONUS_CONFIG.ticket.minIntervalSeconds;
const MYTHIQUE_TICKET_UNIQUE_REDUCTION_SECONDS = MYTHIQUE_SPECIAL_BONUS_CONFIG.ticket.uniqueReductionSeconds;
const MYTHIQUE_FRENZY_SPAWN_BONUS_MULTIPLIER = MYTHIQUE_SPECIAL_BONUS_CONFIG.frenzy.multiplier;
const MYTHIQUE_DUPLICATES_FOR_OFFLINE_CAP = (() => {
  if (
    MYTHIQUE_OFFLINE_PER_DUPLICATE > 0
    && MYTHIQUE_OFFLINE_CAP > MYTHIQUE_OFFLINE_BASE
  ) {
    return Math.ceil((MYTHIQUE_OFFLINE_CAP - MYTHIQUE_OFFLINE_BASE) / MYTHIQUE_OFFLINE_PER_DUPLICATE);
  }
  return Number.POSITIVE_INFINITY;
})();

const PRODUCTION_STEP_DEFINITIONS = new Map();

function defineProductionStep(id, type, label, extra = {}) {
  if (!id || PRODUCTION_STEP_DEFINITIONS.has(id)) {
    return;
  }
  PRODUCTION_STEP_DEFINITIONS.set(id, { id, type, label, ...extra });
}

defineProductionStep('baseFlat', 'base', 'Base flat', { source: 'baseFlat' });
defineProductionStep('shopFlat', 'flat', 'Bonus flat magasin', { source: 'shopFlat' });
defineProductionStep('elementFlat', 'flat', 'Bonus flat éléments', { source: 'elementFlat' });
defineProductionStep('shopBonus1', 'multiplier', 'Bonus shop 1', { source: 'shopBonus1' });
defineProductionStep('shopBonus2', 'multiplier', 'Bonus shop 2', { source: 'shopBonus2' });
defineProductionStep('frenzy', 'multiplier', 'Frénésie', { source: 'frenzy' });
defineProductionStep(
  'trophyMultiplier',
  'multiplier',
  'Multiplicateur trophées',
  { source: 'trophyMultiplier' }
);
defineProductionStep('total', 'total', '= Total');

RARITY_IDS.forEach(rarityId => {
  const rarityLabel = RARITY_LABEL_MAP.get(rarityId) || rarityId;
  defineProductionStep(
    `rarityMultiplier:${rarityId}`,
    'multiplier',
    `Multiplicateur éléments ${rarityLabel}`,
    { source: 'rarityMultiplier', rarityId }
  );
});

const DEFAULT_PRODUCTION_STEP_IDS = [
  'baseFlat',
  'shopFlat',
  'elementFlat',
  'shopBonus1',
  'shopBonus2',
  'frenzy',
  ...RARITY_IDS.map(id => `rarityMultiplier:${id}`),
  'trophyMultiplier',
  'total'
];

function resolveProductionStepOrder(configOrder) {
  const seen = new Set();
  const resolved = [];

  const pushStep = (id, labelOverride = null) => {
    if (!id) return;
    let normalizedId = id;
    if (id === 'shopMultiplier') {
      normalizedId = 'shopBonus1';
    } else if (id === 'shopMultiplier2' || id === 'shopMultiplierSecondary') {
      normalizedId = 'shopBonus2';
    }
    if (seen.has(normalizedId)) return;
    const base = PRODUCTION_STEP_DEFINITIONS.get(normalizedId);
    if (!base) return;
    const entry = { ...base };
    if (labelOverride && typeof labelOverride === 'string') {
      entry.label = labelOverride;
    }
    resolved.push(entry);
    seen.add(normalizedId);
  };

  if (Array.isArray(configOrder)) {
    configOrder.forEach(item => {
      if (!item) return;
      if (typeof item === 'string') {
        pushStep(item.trim());
        return;
      }
      if (typeof item === 'object') {
        const type = item.type ?? item.kind;
        if ((type === 'rarity' || type === 'rarityMultiplier') && item.rarity) {
          const rarityId = String(item.rarity).trim();
          const label = typeof item.label === 'string' ? item.label.trim() : null;
          pushStep(`rarityMultiplier:${rarityId}`, label);
          return;
        }
        const rawId = item.id ?? item.key ?? item.step;
        if (!rawId) return;
        const id = String(rawId).trim();
        const label = typeof item.label === 'string' ? item.label.trim() : null;
        pushStep(id, label);
      }
    });
  }

  DEFAULT_PRODUCTION_STEP_IDS.forEach(id => {
    if (!seen.has(id)) {
      pushStep(id);
    }
  });

  return resolved;
}

const PRODUCTION_STEP_ORDER = resolveProductionStepOrder(CONFIG.infoPanels?.productionOrder);

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

function getRarityPoolSize(rarityId) {
  const pool = gachaPools.get(rarityId);
  return Array.isArray(pool) ? pool.length : 0;
}

LayeredNumber.LAYER1_THRESHOLD = CONFIG.numbers?.layer1Threshold ?? 1e6;
LayeredNumber.LAYER1_DOWN = CONFIG.numbers?.layer1Downshift ?? 5;
LayeredNumber.LOG_DIFF_LIMIT = CONFIG.numbers?.logDifferenceLimit ?? 15;
LayeredNumber.EPSILON = CONFIG.numbers?.epsilon ?? 1e-12;

const BASE_PER_CLICK = toLayeredNumber(CONFIG.progression?.basePerClick, 1);
const BASE_PER_SECOND = toLayeredNumber(CONFIG.progression?.basePerSecond, 0);
const DEFAULT_THEME = CONFIG.progression?.defaultTheme ?? 'dark';
const DEFAULT_MUSIC_VOLUME = 0.5;
const DEFAULT_MUSIC_ENABLED = true;

function clampMusicVolume(value, fallback = DEFAULT_MUSIC_VOLUME) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return fallback;
  }
  if (numeric <= 0) {
    return 0;
  }
  if (numeric >= 1) {
    return 1;
  }
  return numeric;
}
const OFFLINE_GAIN_CAP = CONFIG.progression?.offlineCapSeconds ?? 60 * 60 * 12;

function clampCritChance(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return 0;
  }
  if (numeric >= 1) {
    return 1;
  }
  return numeric;
}

function normalizeCritConfig(raw) {
  const defaults = {
    baseChance: 0.05,
    baseMultiplier: 2,
    maxMultiplier: 100
  };
  if (!raw || typeof raw !== 'object') {
    return { ...defaults };
  }
  const parseNumber = (value, fallback) => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  };
  const baseChance = clampCritChance(parseNumber(raw.baseChance ?? raw.chance ?? raw.defaultChance, defaults.baseChance));
  const baseMultiplierRaw = parseNumber(
    raw.baseMultiplier ?? raw.multiplier ?? raw.defaultMultiplier,
    defaults.baseMultiplier
  );
  const baseMultiplier = baseMultiplierRaw > 0 ? baseMultiplierRaw : defaults.baseMultiplier;
  const maxMultiplierRaw = parseNumber(raw.maxMultiplier ?? raw.cap ?? raw.maximum, defaults.maxMultiplier);
  const maxMultiplier = Math.max(1, maxMultiplierRaw);
  return {
    baseChance,
    baseMultiplier,
    maxMultiplier: Math.max(baseMultiplier, maxMultiplier)
  };
}

const CRIT_DEFAULTS = normalizeCritConfig(CONFIG.progression?.crit);

function createDefaultCritState() {
  const multiplier = Math.max(1, Math.min(CRIT_DEFAULTS.baseMultiplier, CRIT_DEFAULTS.maxMultiplier));
  return {
    chance: clampCritChance(CRIT_DEFAULTS.baseChance),
    multiplier,
    rawMultiplier: Math.max(1, CRIT_DEFAULTS.baseMultiplier),
    maxMultiplier: Math.max(1, CRIT_DEFAULTS.maxMultiplier)
  };
}

function cloneCritState(state) {
  if (!state || typeof state !== 'object') {
    return createDefaultCritState();
  }
  const baseChance = Number(state.chance ?? state.baseChance);
  const chance = clampCritChance(Number.isFinite(baseChance) ? baseChance : CRIT_DEFAULTS.baseChance);
  const rawMultiplierValue = Number(state.rawMultiplier ?? state.multiplier);
  const rawMultiplier = Number.isFinite(rawMultiplierValue) && rawMultiplierValue > 0
    ? rawMultiplierValue
    : CRIT_DEFAULTS.baseMultiplier;
  const maxMultiplierValue = Number(state.maxMultiplier);
  const maxMultiplier = Number.isFinite(maxMultiplierValue) && maxMultiplierValue > 0
    ? maxMultiplierValue
    : CRIT_DEFAULTS.maxMultiplier;
  const effectiveMultiplier = Math.max(1, Math.min(Number(state.multiplier ?? rawMultiplier) || rawMultiplier, maxMultiplier));
  return {
    chance,
    multiplier: effectiveMultiplier,
    rawMultiplier: Math.max(1, rawMultiplier),
    maxMultiplier: Math.max(1, maxMultiplier)
  };
}

function createCritAccumulator() {
  return {
    chanceAdd: 0,
    chanceMult: 1,
    chanceSet: null,
    multiplierAdd: 0,
    multiplierMult: 1,
    multiplierSet: null,
    maxMultiplierAdd: 0,
    maxMultiplierMult: 1,
    maxMultiplierSet: null
  };
}

function applyCritModifiersFromEffect(accumulator, effect) {
  if (!accumulator || !effect || typeof effect !== 'object') {
    return;
  }
  const readNumber = value => {
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : null;
  };
  const nested = effect.crit && typeof effect.crit === 'object' ? effect.crit : null;

  const chanceSetDirect = readNumber(effect.critChanceSet ?? effect.critChance ?? nested?.chanceSet ?? nested?.chance);
  if (chanceSetDirect != null) {
    accumulator.chanceSet = Math.max(0, chanceSetDirect);
  }
  const chanceAdd = readNumber(effect.critChanceAdd ?? nested?.chanceAdd);
  if (chanceAdd != null) {
    accumulator.chanceAdd += chanceAdd;
  }
  const chanceMult = readNumber(effect.critChanceMult ?? nested?.chanceMult);
  if (chanceMult != null) {
    accumulator.chanceMult *= Math.max(0, chanceMult);
  }

  const multiplierSet = readNumber(effect.critMultiplierSet ?? effect.critMultiplier ?? nested?.multiplierSet ?? nested?.multiplier);
  if (multiplierSet != null) {
    accumulator.multiplierSet = Math.max(0, multiplierSet);
  }
  const multiplierAdd = readNumber(effect.critMultiplierAdd ?? nested?.multiplierAdd);
  if (multiplierAdd != null) {
    accumulator.multiplierAdd += multiplierAdd;
  }
  const multiplierMult = readNumber(effect.critMultiplierMult ?? nested?.multiplierMult);
  if (multiplierMult != null) {
    accumulator.multiplierMult *= Math.max(0, multiplierMult);
  }

  const maxMultiplierSet = readNumber(
    effect.critMaxMultiplierSet ?? effect.critMaxMultiplier ?? nested?.maxMultiplierSet ?? nested?.maxMultiplier ?? nested?.cap
  );
  if (maxMultiplierSet != null) {
    accumulator.maxMultiplierSet = Math.max(0, maxMultiplierSet);
  }
  const maxMultiplierAdd = readNumber(effect.critMaxMultiplierAdd ?? nested?.maxMultiplierAdd ?? nested?.capAdd);
  if (maxMultiplierAdd != null) {
    accumulator.maxMultiplierAdd += maxMultiplierAdd;
  }
  const maxMultiplierMult = readNumber(effect.critMaxMultiplierMult ?? nested?.maxMultiplierMult ?? nested?.capMult);
  if (maxMultiplierMult != null) {
    accumulator.maxMultiplierMult *= Math.max(0, maxMultiplierMult);
  }
}

function applyRepeatedCritEffect(accumulator, effectConfig, repetitions) {
  if (!accumulator || !effectConfig) {
    return;
  }
  const times = Math.max(0, Math.floor(Number(repetitions) || 0));
  if (times <= 0) {
    return;
  }
  const effect = {};
  if (effectConfig.chanceSet != null) {
    effect.critChanceSet = Math.max(0, effectConfig.chanceSet);
  }
  if (effectConfig.chanceAdd) {
    effect.critChanceAdd = effectConfig.chanceAdd * times;
  }
  if (effectConfig.chanceMult != null) {
    const base = effectConfig.chanceMult;
    if (base > 0 && base !== 1) {
      effect.critChanceMult = Math.pow(base, times);
    }
  }
  if (effectConfig.multiplierSet != null) {
    effect.critMultiplierSet = Math.max(0, effectConfig.multiplierSet);
  }
  if (effectConfig.multiplierAdd) {
    effect.critMultiplierAdd = effectConfig.multiplierAdd * times;
  }
  if (effectConfig.multiplierMult != null) {
    const base = effectConfig.multiplierMult;
    if (base > 0 && base !== 1) {
      effect.critMultiplierMult = Math.pow(base, times);
    }
  }
  if (effectConfig.maxMultiplierSet != null) {
    effect.critMaxMultiplierSet = Math.max(0, effectConfig.maxMultiplierSet);
  }
  if (effectConfig.maxMultiplierAdd) {
    effect.critMaxMultiplierAdd = effectConfig.maxMultiplierAdd * times;
  }
  if (effectConfig.maxMultiplierMult != null) {
    const base = effectConfig.maxMultiplierMult;
    if (base > 0 && base !== 1) {
      effect.critMaxMultiplierMult = Math.pow(base, times);
    }
  }
  applyCritModifiersFromEffect(accumulator, effect);
}

function finalizeCritEffect(accumulator) {
  if (!accumulator) {
    return null;
  }
  const effect = {};
  if (accumulator.chanceSet != null) {
    effect.critChanceSet = accumulator.chanceSet;
  }
  if (accumulator.chanceAdd !== 0) {
    effect.critChanceAdd = accumulator.chanceAdd;
  }
  if (accumulator.chanceMult !== 1) {
    effect.critChanceMult = accumulator.chanceMult;
  }
  if (accumulator.multiplierSet != null) {
    effect.critMultiplierSet = accumulator.multiplierSet;
  }
  if (accumulator.multiplierAdd !== 0) {
    effect.critMultiplierAdd = accumulator.multiplierAdd;
  }
  if (accumulator.multiplierMult !== 1) {
    effect.critMultiplierMult = accumulator.multiplierMult;
  }
  if (accumulator.maxMultiplierSet != null) {
    effect.critMaxMultiplierSet = accumulator.maxMultiplierSet;
  }
  if (accumulator.maxMultiplierAdd !== 0) {
    effect.critMaxMultiplierAdd = accumulator.maxMultiplierAdd;
  }
  if (accumulator.maxMultiplierMult !== 1) {
    effect.critMaxMultiplierMult = accumulator.maxMultiplierMult;
  }
  return Object.keys(effect).length ? effect : null;
}

function resolveCritState(accumulator) {
  const acc = accumulator || createCritAccumulator();
  const baseChance = acc.chanceSet != null ? acc.chanceSet : CRIT_DEFAULTS.baseChance;
  const chance = clampCritChance((baseChance + acc.chanceAdd) * (acc.chanceMult != null ? acc.chanceMult : 1));

  const baseMultiplier = acc.multiplierSet != null ? acc.multiplierSet : CRIT_DEFAULTS.baseMultiplier;
  let rawMultiplier = baseMultiplier + acc.multiplierAdd;
  rawMultiplier = Math.max(0, rawMultiplier);
  rawMultiplier *= acc.multiplierMult != null ? acc.multiplierMult : 1;
  rawMultiplier = Math.max(1, rawMultiplier);

  const baseMaxMultiplier = acc.maxMultiplierSet != null ? acc.maxMultiplierSet : CRIT_DEFAULTS.maxMultiplier;
  let maxMultiplier = baseMaxMultiplier + acc.maxMultiplierAdd;
  maxMultiplier = Math.max(0, maxMultiplier);
  maxMultiplier *= acc.maxMultiplierMult != null ? acc.maxMultiplierMult : 1;
  maxMultiplier = Math.max(1, maxMultiplier);

  const effectiveMultiplier = Math.max(1, Math.min(rawMultiplier, maxMultiplier));
  return {
    chance,
    multiplier: effectiveMultiplier,
    rawMultiplier,
    maxMultiplier
  };
}

const FRENZY_DEFAULTS = {
  displayDurationMs: 5000,
  effectDurationMs: 30000,
  multiplier: 2,
  baseMaxStacks: 1,
  spawnChancePerSecond: {
    perClick: 0.01,
    perSecond: 0.01
  }
};

function normalizeFrenzySpawnChance(raw) {
  const clamp = value => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) {
      return 0;
    }
    if (numeric > 1) {
      return 1;
    }
    return numeric;
  };
  const defaults = FRENZY_DEFAULTS.spawnChancePerSecond;
  if (typeof raw === 'number') {
    const value = clamp(raw);
    return { perClick: value, perSecond: value };
  }
  if (raw && typeof raw === 'object') {
    const perClickRaw = raw.perClick ?? raw.click ?? raw.apc;
    const perSecondRaw = raw.perSecond ?? raw.auto ?? raw.aps;
    return {
      perClick: perClickRaw != null ? clamp(perClickRaw) : defaults.perClick,
      perSecond: perSecondRaw != null ? clamp(perSecondRaw) : defaults.perSecond
    };
  }
  return { ...defaults };
}

const FRENZY_CONFIG = {
  displayDurationMs: Math.max(0, Number(CONFIG.frenzies?.displayDurationMs ?? FRENZY_DEFAULTS.displayDurationMs) || 0),
  effectDurationMs: Math.max(0, Number(CONFIG.frenzies?.effectDurationMs ?? FRENZY_DEFAULTS.effectDurationMs) || 0),
  multiplier: Math.max(1, Number(CONFIG.frenzies?.multiplier ?? FRENZY_DEFAULTS.multiplier) || FRENZY_DEFAULTS.multiplier),
  baseMaxStacks: Math.max(1, Number(CONFIG.frenzies?.baseMaxStacks ?? FRENZY_DEFAULTS.baseMaxStacks) || FRENZY_DEFAULTS.baseMaxStacks),
  spawnChancePerSecond: normalizeFrenzySpawnChance(CONFIG.frenzies?.spawnChancePerSecond)
};

const FRENZY_TYPE_INFO = {
  perClick: {
    id: 'perClick',
    label: 'Frénésie APC',
    shortLabel: 'APC',
    asset: 'Assets/Image/frenesieAPC.png'
  },
  perSecond: {
    id: 'perSecond',
    label: 'Frénésie APS',
    shortLabel: 'APS',
    asset: 'Assets/Image/frenesieAPS.png'
  }
};

const FRENZY_TYPES = ['perClick', 'perSecond'];

const frenzySpawnChanceBonus = { perClick: 1, perSecond: 1 };

function applyFrenzySpawnChanceBonus(bonus) {
  const perClick = Number(bonus?.perClick);
  const perSecond = Number(bonus?.perSecond);
  frenzySpawnChanceBonus.perClick = Number.isFinite(perClick) && perClick > 0 ? perClick : 1;
  frenzySpawnChanceBonus.perSecond = Number.isFinite(perSecond) && perSecond > 0 ? perSecond : 1;
}

function getEffectiveFrenzySpawnChance(type) {
  const base = FRENZY_CONFIG.spawnChancePerSecond[type] ?? 0;
  if (!Number.isFinite(base) || base <= 0) {
    return 0;
  }
  const modifier = type === 'perClick'
    ? frenzySpawnChanceBonus.perClick
    : (type === 'perSecond' ? frenzySpawnChanceBonus.perSecond : 1);
  const total = base * modifier;
  if (!Number.isFinite(total) || total <= 0) {
    return 0;
  }
  return Math.min(1, total);
}

const FALLBACK_UPGRADES = (function createFallbackUpgrades() {
  if (typeof createShopBuildingDefinitions === 'function') {
    return createShopBuildingDefinitions();
  }

  const DOUBLE_THRESHOLDS = [10, 25, 50, 100, 150, 200];
  const QUAD_THRESHOLDS = [300, 400, 500];

  const computeMultiplier = level => {
    let multiplier = 1;
    DOUBLE_THRESHOLDS.forEach(threshold => {
      if (level >= threshold) {
        multiplier *= 2;
      }
    });
    QUAD_THRESHOLDS.forEach(threshold => {
      if (level >= threshold) {
        multiplier *= 4;
      }
    });
    return multiplier;
  };

  const getLevel = (context, id) => {
    if (!context || typeof context !== 'object') {
      return 0;
    }
    const value = Number(context[id] ?? 0);
    return Number.isFinite(value) && value > 0 ? value : 0;
  };

  const getTotal = context => {
    if (!context || typeof context !== 'object') {
      return 0;
    }
    return Object.values(context).reduce((acc, value) => {
      const numeric = Number(value);
      return acc + (Number.isFinite(numeric) && numeric > 0 ? numeric : 0);
    }, 0);
  };

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
        const tierMultiplier = computeMultiplier(level);
        const rawAutoAdd = level * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(level, Math.round(rawAutoAdd)) : 0;
        const clickAdd = level >= 100 ? level : 0;
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
        'Production passive : +1 APS par niveau (paliers ×2/×4). Chaque 10 labos accordent +5 % d’APC global. Accélérateur ≥200 : Labos +20 % APS.',
      category: 'auto',
      baseCost: 100,
      costScale: 1.15,
      effect: (level = 0, context = {}) => {
        const tierMultiplier = computeMultiplier(level);
        const acceleratorLevel = getLevel(context, 'particleAccelerator');
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
        const tierMultiplier = computeMultiplier(level);
        const electronLevel = getLevel(context, 'freeElectrons');
        const labLevel = getLevel(context, 'physicsLab');
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
        const tierMultiplier = computeMultiplier(level);
        const supercomputerLevel = getLevel(context, 'supercomputer');
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
        const tierMultiplier = computeMultiplier(level);
        const stationLevel = getLevel(context, 'spaceStation');
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
        const tierMultiplier = computeMultiplier(level);
        const reactorLevel = getLevel(context, 'nuclearReactor');
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
        const tierMultiplier = computeMultiplier(level);
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
        const tierMultiplier = computeMultiplier(level);
        const stationLevel = getLevel(context, 'spaceStation');
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
        const tierMultiplier = computeMultiplier(level);
        const libraryLevel = getLevel(context, 'omniverseLibrary');
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
        const tierMultiplier = computeMultiplier(level);
        const baseAmount = 5e8 * level;
        const rawAutoAdd = baseAmount * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
        const totalBuildings = getTotal(context);
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
        const tierMultiplier = computeMultiplier(level);
        const totalBuildings = getTotal(context);
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
        const tierMultiplier = computeMultiplier(level);
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
        const tierMultiplier = computeMultiplier(level);
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
        const tierMultiplier = computeMultiplier(level);
        const baseAmount = 1e16 * level;
        const rawAutoAdd = baseAmount * tierMultiplier;
        const autoAdd = level > 0 ? Math.max(baseAmount, Math.round(rawAutoAdd)) : 0;
        const parallelLevel = getLevel(context, 'parallelUniverse');
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
        const tierMultiplier = computeMultiplier(level);
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
})();

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
        devkitFlat: LayeredNumber.zero()
      },
      multipliers: {
        shopBonus1: LayeredNumber.one(),
        shopBonus2: LayeredNumber.one(),
        trophyMultiplier: LayeredNumber.one(),
        frenzy: LayeredNumber.one(),
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
        frenzy: entry.sources?.multipliers?.frenzy instanceof LayeredNumber
          ? entry.sources.multipliers.frenzy.clone()
          : LayeredNumber.one(),
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
  upgrades: {},
  shopUnlocks: [],
  elements: createInitialElementCollection(),
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
  ticketStarAutoCollect: null,
  ticketStarAverageIntervalSeconds: DEFAULT_TICKET_STAR_INTERVAL_SECONDS,
  frenzySpawnBonus: { perClick: 1, perSecond: 1 },
  musicTrackId: null,
  musicVolume: DEFAULT_MUSIC_VOLUME,
  musicEnabled: DEFAULT_MUSIC_ENABLED
};

const gameState = {
  atoms: LayeredNumber.zero(),
  lifetime: LayeredNumber.zero(),
  perClick: BASE_PER_CLICK.clone(),
  perSecond: BASE_PER_SECOND.clone(),
  basePerClick: BASE_PER_CLICK.clone(),
  basePerSecond: BASE_PER_SECOND.clone(),
  gachaTickets: 0,
  upgrades: {},
  shopUnlocks: new Set(),
  elements: createInitialElementCollection(),
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
  ticketStarAutoCollect: null,
  ticketStarAverageIntervalSeconds: DEFAULT_TICKET_STAR_INTERVAL_SECONDS,
  frenzySpawnBonus: { perClick: 1, perSecond: 1 },
  musicTrackId: null,
  musicVolume: DEFAULT_MUSIC_VOLUME,
  musicEnabled: DEFAULT_MUSIC_ENABLED
};

applyFrenzySpawnChanceBonus(gameState.frenzySpawnBonus);

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
  const amount = toLayeredNumber(raw.amount ?? raw.value ?? 0, 0);
  return {
    type: 'lifetimeAtoms',
    amount
  };
}

function normalizeTicketStarAutoCollectConfig(raw) {
  if (raw == null) {
    return null;
  }
  if (raw === false) {
    return null;
  }
  if (raw === true) {
    return { delaySeconds: 0 };
  }
  if (typeof raw === 'number') {
    if (!Number.isFinite(raw)) {
      return null;
    }
    return { delaySeconds: Math.max(0, raw) };
  }
  if (typeof raw === 'string') {
    const numeric = Number(raw);
    if (!Number.isFinite(numeric)) {
      return null;
    }
    return { delaySeconds: Math.max(0, numeric) };
  }
  if (typeof raw === 'object') {
    if (raw.enabled === false) {
      return null;
    }
    const value = raw.delaySeconds ?? raw.delay ?? raw.seconds ?? raw.value ?? raw.time;
    const numeric = Number(value);
    const delaySeconds = Number.isFinite(numeric) && numeric >= 0 ? numeric : 0;
    return { delaySeconds };
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
    if (entry?.owned || (Number(entry?.count) || 0) > 0) {
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
  navButtons: document.querySelectorAll('.nav-button'),
  pages: document.querySelectorAll('.page'),
  statusAtoms: document.getElementById('statusAtoms'),
  statusApc: document.getElementById('statusApc'),
  statusAps: document.getElementById('statusAps'),
  statusCrit: document.getElementById('statusCrit'),
  statusCritValue: document.getElementById('statusCritValue'),
  statusApcFrenzy: document.getElementById('statusApcFrenzy'),
  statusApsFrenzy: document.getElementById('statusApsFrenzy'),
  atomButton: document.getElementById('atomButton'),
  atomVisual: document.querySelector('.atom-visual'),
  frenzyLayer: document.getElementById('frenzyLayer'),
  ticketLayer: document.getElementById('ticketLayer'),
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
  gachaTicketValue: document.getElementById('gachaTicketValue'),
  gachaAnimation: document.getElementById('gachaAnimation'),
  gachaAnimationConfetti: document.getElementById('gachaAnimationConfetti'),
  gachaContinueHint: document.getElementById('gachaContinueHint'),
  themeSelect: document.getElementById('themeSelect'),
  musicTrackSelect: document.getElementById('musicTrackSelect'),
  musicTrackStatus: document.getElementById('musicTrackStatus'),
  musicVolumeSlider: document.getElementById('musicVolumeSlider'),
  resetButton: document.getElementById('resetButton'),
  infoApsBreakdown: document.getElementById('infoApsBreakdown'),
  infoApcBreakdown: document.getElementById('infoApcBreakdown'),
  infoSessionAtoms: document.getElementById('infoSessionAtoms'),
  infoSessionClicks: document.getElementById('infoSessionClicks'),
  infoSessionDuration: document.getElementById('infoSessionDuration'),
  infoGlobalAtoms: document.getElementById('infoGlobalAtoms'),
  infoGlobalClicks: document.getElementById('infoGlobalClicks'),
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
  devkitToggleShop: document.getElementById('devkitToggleShop'),
  devkitToggleGacha: document.getElementById('devkitToggleGacha')
};

const soundEffects = (() => {
  const createSilentPool = () => ({ play: () => {} });
  if (typeof window === 'undefined' || typeof Audio === 'undefined') {
    return { pop: createSilentPool(), crit: createSilentPool() };
  }

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
      play() {
        const audio = pool[index];
        index = (index + 1) % pool.length;
        try {
          audio.currentTime = 0;
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

  return {
    pop: createSoundPool('Assets/Sounds/pop.mp3', 6),
    crit: createSoundPool('Assets/Sounds/crit.mp3', 3)
  };
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
            bonuses: Array.isArray(baseEntry.bonuses) ? [...baseEntry.bonuses] : []
          }
        : {
            id: def.id,
            gachaId: def.gachaId ?? def.id,
            rarity: elementRarityIndex.get(def.id) || null,
            effects: [],
            bonuses: []
          };
      entry.owned = true;
      entry.count = 1;
      gameState.elements[def.id] = entry;
      newlyOwned += 1;
      return;
    }
    const previouslyOwned = Boolean(entry.owned) || (Number(entry.count) || 0) > 0;
    if (!previouslyOwned) {
      newlyOwned += 1;
    }
    entry.count = Math.max(1, Math.floor(Number(entry.count) || 0));
    entry.owned = true;
    if (!entry.rarity) {
      entry.rarity = elementRarityIndex.get(def.id) || entry.rarity || null;
    }
  });
  recalcProduction();
  updateUI();
  evaluateTrophies();
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
const periodicCells = new Map();
let selectedElementId = null;
let gamePageVisibleSince = null;

function getShopUnlockSet() {
  if (gameState.shopUnlocks instanceof Set) {
    const unlocks = gameState.shopUnlocks;
    UPGRADE_DEFS.forEach(def => {
      if (getUpgradeLevel(gameState.upgrades, def.id) > 0) {
        unlocks.add(def.id);
      }
    });
    return unlocks;
  }
  let stored = [];
  if (Array.isArray(gameState.shopUnlocks)) {
    stored = gameState.shopUnlocks;
  } else if (gameState.shopUnlocks && typeof gameState.shopUnlocks === 'object') {
    stored = Object.keys(gameState.shopUnlocks);
  }
  const unlocks = new Set(stored);
  UPGRADE_DEFS.forEach(def => {
    if (getUpgradeLevel(gameState.upgrades, def.id) > 0) {
      unlocks.add(def.id);
    }
  });
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
  const rawCount = Number(entry?.count);
  const count = Number.isFinite(rawCount) && rawCount > 0
    ? Math.floor(rawCount)
    : 0;
  const isOwned = Boolean(entry?.owned) || count > 0;
  if (elements.elementInfoOwnedCount) {
    elements.elementInfoOwnedCount.textContent = count.toString();
  }
  if (elements.elementInfoCollection) {
    const rarityId = entry?.rarity || elementRarityIndex.get(definition.id);
    const rarityDef = rarityId ? GACHA_RARITY_MAP.get(rarityId) : null;
    const status = isOwned ? 'Possédé' : 'Non possédé';
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
      const rarityDef = GACHA_RARITY_MAP.get(rarityId);
      if (rarityDef?.color) {
        cell.style.setProperty('--rarity-color', rarityDef.color);
      } else {
        cell.style.removeProperty('--rarity-color');
      }
    } else {
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
  const ownedCount = elementEntries.reduce((total, entry) => {
    const isOwned = Boolean(entry?.owned) || (Number(entry?.count) || 0) > 0;
    return total + (isOwned ? 1 : 0);
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
    const isOwned = Boolean(entry?.owned) || (Number(entry?.count) || 0) > 0;
    cell.classList.toggle('is-owned', isOwned);
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
    if (entry.owned || (Number(entry.count) || 0) > 0) {
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

function formatTicketLabel(count) {
  const numeric = Math.max(0, Math.floor(Number(count) || 0));
  const formatted = numeric.toLocaleString('fr-FR');
  const unit = numeric === 1 ? 'ticket' : 'tickets';
  return `${formatted} ${unit}`;
}

const GACHA_ANIMATION_CONFETTI_COUNT = 110;
const GACHA_ANIMATION_COLOR_SHIFT_DELAY = 1500;
const GACHA_ANIMATION_REVEAL_DELAY = 3000;
const GACHA_CONFETTI_BASE_RARITY_ID = 'commun';
const DEFAULT_GACHA_CONFETTI_COLOR = '#4f7ec2';
const GACHA_CONFETTI_SHAPES = [
  { className: 'crit-confetti--circle', widthFactor: 1, heightFactor: 1 },
  { className: 'crit-confetti--oval', widthFactor: 1.4, heightFactor: 1 },
  { className: 'crit-confetti--heart', widthFactor: 1.1, heightFactor: 1.1 },
  { className: 'crit-confetti--star', widthFactor: 1.2, heightFactor: 1.2 },
  { className: 'crit-confetti--square', widthFactor: 1, heightFactor: 1 },
  { className: 'crit-confetti--triangle', widthFactor: 1.15, heightFactor: 1.3 },
  { className: 'crit-confetti--rectangle', widthFactor: 1.8, heightFactor: 0.7 },
  { className: 'crit-confetti--hexagon', widthFactor: 1.1, heightFactor: 1 }
];
let gachaAnimationInProgress = false;

function updateGachaUI() {
  const available = Math.max(0, Math.floor(Number(gameState.gachaTickets) || 0));
  if (elements.gachaTicketValue) {
    elements.gachaTicketValue.textContent = formatTicketLabel(available);
  } else if (elements.gachaTicketCounter) {
    elements.gachaTicketCounter.textContent = formatTicketLabel(available);
  }
  if (elements.gachaSunButton) {
    const gachaFree = isDevKitGachaFree();
    const affordable = gachaFree || available >= GACHA_TICKET_COST;
    const busy = gachaAnimationInProgress;
    const costLabel = gachaFree ? 'Gratuit' : formatTicketLabel(GACHA_TICKET_COST);
    const label = busy
      ? 'Tirage cosmique en cours'
      : gachaFree
        ? 'Déclencher un tirage cosmique (gratuit)'
        : affordable
          ? 'Déclencher un tirage cosmique'
          : 'Tickets insuffisants';
    elements.gachaSunButton.classList.toggle('is-locked', !affordable || busy);
    elements.gachaSunButton.setAttribute('aria-disabled', !affordable || busy ? 'true' : 'false');
    elements.gachaSunButton.setAttribute('aria-label', label);
    elements.gachaSunButton.title = `${label} (${costLabel})`;
    if (busy) {
      elements.gachaSunButton.disabled = true;
    } else if (elements.gachaSunButton.disabled) {
      elements.gachaSunButton.disabled = false;
    }
  }
}

function performGachaRoll() {
  const available = Math.max(0, Math.floor(Number(gameState.gachaTickets) || 0));
  const gachaFree = isDevKitGachaFree();
  if (!gachaFree && available < GACHA_TICKET_COST) {
    showToast('Pas assez de tickets de tirage.');
    return null;
  }

  const rarity = pickGachaRarity();
  if (!rarity) {
    showToast('Aucun élément disponible dans les chambres de synthèse.');
    return null;
  }

  const elementDef = pickRandomElementFromRarity(rarity.id);
  if (!elementDef) {
    showToast('Flux instable, impossible de matérialiser un élément.');
    return null;
  }

  if (!gachaFree) {
    gameState.gachaTickets = available - GACHA_TICKET_COST;
  }

  let entry = gameState.elements[elementDef.id];
  if (!entry) {
    entry = {
      id: elementDef.id,
      gachaId: elementDef.gachaId ?? elementDef.id,
      owned: false,
      count: 0,
      rarity: rarity.id,
      effects: [],
      bonuses: []
    };
    gameState.elements[elementDef.id] = entry;
  }

  const previousCount = Number(entry.count) || 0;
  entry.count = previousCount + 1;

  if (!entry.rarity) {
    entry.rarity = rarity.id;
  }
  if (!entry.owned && entry.count > 0) {
    entry.owned = true;
  }

  const isNew = previousCount === 0;

  recalcProduction();
  updateUI();
  saveGame();
  evaluateTrophies();

  return { rarity, elementDef, isNew };
}

function displayGachaResult(outcome) {
  if (!outcome) return;
  setGachaResult(outcome.rarity, outcome.elementDef, outcome.isNew);
}

function getGachaToastMessage(outcome) {
  if (!outcome) return '';
  return outcome.isNew
    ? `Nouvel élément obtenu : ${outcome.elementDef.name} !`
    : `${outcome.elementDef.name} rejoint à nouveau votre collection.`;
}

function wait(duration) {
  return new Promise(resolve => {
    setTimeout(resolve, Math.max(0, Number(duration) || 0));
  });
}

const gachaConfettiState = {
  container: null,
  nodes: [],
  baseColor: null,
  targetColor: null,
  colorShiftTimeoutId: null
};

function normalizeHexColor(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  const match = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(trimmed);
  if (!match) return null;
  let hex = match[1];
  if (hex.length === 3) {
    hex = hex.split('').map(part => part + part).join('');
  }
  return `#${hex.toLowerCase()}`;
}

function parseHexColorToRgb(input) {
  const normalized = normalizeHexColor(input);
  if (!normalized) return null;
  const value = normalized.slice(1);
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
    return null;
  }
  return { r, g, b };
}

function mixRgb(color, target, amount) {
  const mixAmount = Math.max(0, Math.min(1, Number(amount) || 0));
  const mixChannel = (base, goal) => {
    const value = base + (goal - base) * mixAmount;
    return Math.max(0, Math.min(255, Math.round(value)));
  };
  return {
    r: mixChannel(color.r, target.r),
    g: mixChannel(color.g, target.g),
    b: mixChannel(color.b, target.b)
  };
}

function lightenRgb(color, amount) {
  return mixRgb(color, { r: 255, g: 255, b: 255 }, amount);
}

function darkenRgb(color, amount) {
  return mixRgb(color, { r: 0, g: 0, b: 0 }, amount);
}

function rgbToCss(color) {
  return `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function rgbaToCss(color, alpha) {
  const clampedAlpha = Math.max(0, Math.min(1, Number(alpha) || 0));
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${clampedAlpha})`;
}

function applyGachaConfettiColor(confetti, color) {
  if (!confetti) return;
  const rgb = parseHexColorToRgb(color) || parseHexColorToRgb(DEFAULT_GACHA_CONFETTI_COLOR);
  if (!rgb) return;
  const highlight = lightenRgb(rgb, 0.35);
  const shadow = darkenRgb(rgb, 0.32);
  const glow = lightenRgb(rgb, 0.22);
  const halo = lightenRgb(rgb, 0.5);
  const storedAngle = Number.parseFloat(confetti.dataset.gradientAngle);
  const gradientAngle = Number.isFinite(storedAngle) ? storedAngle : Math.random() * 360;
  confetti.dataset.gradientAngle = gradientAngle.toFixed(2);
  confetti.style.background = `linear-gradient(${gradientAngle.toFixed(2)}deg, ${rgbToCss(highlight)}, ${rgbToCss(shadow)})`;
  confetti.style.boxShadow = `0 0 18px ${rgbaToCss(glow, 0.45)}, 0 0 40px ${rgbaToCss(halo, 0.22)}`;
}

function resolveGachaConfettiColor(input, fallback = DEFAULT_GACHA_CONFETTI_COLOR) {
  return normalizeHexColor(input) || normalizeHexColor(fallback) || DEFAULT_GACHA_CONFETTI_COLOR;
}

function createGachaConfettiNode(baseColor) {
  const confetti = document.createElement('span');
  const baseSize = 26 + Math.random() * 26;
  const shape = pickRandom(GACHA_CONFETTI_SHAPES);
  const width = baseSize * shape.widthFactor;
  const height = baseSize * shape.heightFactor;
  confetti.className = `gacha-confetti ${shape.className}`;
  confetti.style.width = `${width.toFixed(2)}px`;
  confetti.style.height = `${height.toFixed(2)}px`;

  const direction = Math.random() < 0.5 ? -1 : 1;
  const travelDistance = 260 + Math.random() * 260;
  const endX = travelDistance * direction;
  const endY = (Math.random() - 0.5) * 280;
  const midX = endX * (0.36 + Math.random() * 0.22);
  const midY = endY * 0.5 + (Math.random() - 0.5) * 80;

  const rotationStart = Math.random() * 360;
  const spin = direction * (160 + Math.random() * 220);
  const rotationMid = rotationStart + spin * 0.38;
  const rotationEnd = rotationStart + spin;
  const scale = 0.85 + Math.random() * 0.45;
  const duration = 1.6 + Math.random() * 1.2;
  const delay = Math.random() * 1.8;

  confetti.style.setProperty('--confetti-mid-x', `${midX.toFixed(2)}px`);
  confetti.style.setProperty('--confetti-mid-y', `${midY.toFixed(2)}px`);
  confetti.style.setProperty('--confetti-end-x', `${endX.toFixed(2)}px`);
  confetti.style.setProperty('--confetti-end-y', `${endY.toFixed(2)}px`);
  confetti.style.setProperty('--confetti-scale', scale.toFixed(2));
  confetti.style.setProperty('--confetti-start-rotation', `${rotationStart.toFixed(2)}deg`);
  confetti.style.setProperty('--confetti-mid-rotation', `${rotationMid.toFixed(2)}deg`);
  confetti.style.setProperty('--confetti-end-rotation', `${rotationEnd.toFixed(2)}deg`);
  confetti.style.setProperty('--confetti-delay', `${delay.toFixed(2)}s`);
  confetti.style.setProperty('--confetti-duration', `${duration.toFixed(2)}s`);
  confetti.style.animationDuration = `${duration.toFixed(2)}s`;
  confetti.style.animationDelay = `${delay.toFixed(2)}s`;

  confetti.dataset.gradientAngle = (Math.random() * 360).toFixed(2);
  applyGachaConfettiColor(confetti, baseColor);

  return confetti;
}

function stopGachaConfettiAnimation() {
  if (gachaConfettiState.colorShiftTimeoutId != null) {
    clearTimeout(gachaConfettiState.colorShiftTimeoutId);
    gachaConfettiState.colorShiftTimeoutId = null;
  }
  if (gachaConfettiState.container) {
    gachaConfettiState.container.innerHTML = '';
  }
  gachaConfettiState.container = null;
  gachaConfettiState.nodes = [];
  gachaConfettiState.baseColor = null;
  gachaConfettiState.targetColor = null;
}

function startGachaConfettiAnimation(outcome) {
  if (!elements.gachaAnimationConfetti) {
    stopGachaConfettiAnimation();
    return;
  }
  stopGachaConfettiAnimation();

  const container = elements.gachaAnimationConfetti;
  const baseRarityColor = resolveGachaConfettiColor(
    GACHA_RARITY_MAP.get(GACHA_CONFETTI_BASE_RARITY_ID)?.color,
    DEFAULT_GACHA_CONFETTI_COLOR
  );
  const baseColor = baseRarityColor || DEFAULT_GACHA_CONFETTI_COLOR;
  const targetColor = resolveGachaConfettiColor(outcome?.rarity?.color, baseColor);

  const fragment = document.createDocumentFragment();
  const nodes = [];
  for (let i = 0; i < GACHA_ANIMATION_CONFETTI_COUNT; i += 1) {
    const confetti = createGachaConfettiNode(baseColor);
    fragment.appendChild(confetti);
    nodes.push(confetti);
  }
  container.appendChild(fragment);

  gachaConfettiState.container = container;
  gachaConfettiState.nodes = nodes;
  gachaConfettiState.baseColor = baseColor;
  gachaConfettiState.targetColor = targetColor;

  if (targetColor !== baseColor) {
    gachaConfettiState.colorShiftTimeoutId = window.setTimeout(() => {
      gachaConfettiState.colorShiftTimeoutId = null;
      if (!gachaConfettiState.nodes.length) {
        return;
      }
      gachaConfettiState.nodes.forEach(node => applyGachaConfettiColor(node, targetColor));
    }, GACHA_ANIMATION_COLOR_SHIFT_DELAY);
  }
}

function waitForGachaAnimationDismiss(layer, options = {}) {
  const { ignoreClicksUntil = 0 } = options;
  return new Promise(resolve => {
    let inputGuardTime = Number(ignoreClicksUntil) || 0;
    const cleanup = () => {
      layer.removeEventListener('pointerdown', handlePointerDown);
      layer.removeEventListener('click', handleClick, true);
      layer.removeEventListener('keydown', handleKeyDown);
      resolve();
    };
    const handlePointerDown = event => {
      const timeStamp = typeof event.timeStamp === 'number' ? event.timeStamp : 0;
      if (inputGuardTime && timeStamp <= inputGuardTime) {
        inputGuardTime = 0;
        return;
      }
      if ('isPrimary' in event && event.isPrimary === false) return;
      if (typeof event.button === 'number' && event.button > 0) return;
      event.preventDefault();
      event.stopPropagation();
      cleanup();
    };
    const handleClick = event => {
      const timeStamp = typeof event.timeStamp === 'number' ? event.timeStamp : 0;
      if (inputGuardTime && timeStamp <= inputGuardTime) {
        inputGuardTime = 0;
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      cleanup();
    };
    const handleKeyDown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        cleanup();
      } else if (event.key === 'Escape') {
        cleanup();
      }
    };
    requestAnimationFrame(() => {
      try {
        layer.focus({ preventScroll: true });
      } catch (err) {
        layer.focus();
      }
    });
    layer.addEventListener('pointerdown', handlePointerDown);
    layer.addEventListener('click', handleClick, true);
    layer.addEventListener('keydown', handleKeyDown);
  });
}

function waitForGachaReveal(layer, delay) {
  const revealDelay = Math.max(0, Number(delay) || 0);
  return new Promise(resolve => {
    let resolved = false;
    let timeoutId = window.setTimeout(() => finish(false, 0), revealDelay);
    const cleanup = () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      layer.removeEventListener('pointerup', handlePointerUp);
      layer.removeEventListener('click', handleClick, true);
      layer.removeEventListener('keydown', handleKeyDown);
    };
    const finish = (skipped, guardTime) => {
      if (resolved) return;
      resolved = true;
      cleanup();
      resolve({ skipped, guardTime });
    };
    const resolveWithGuardTime = event => {
      const timeStamp = typeof event.timeStamp === 'number' ? event.timeStamp + 16 : 0;
      finish(true, timeStamp);
    };
    const handlePointerUp = event => {
      if (resolved) return;
      if ('isPrimary' in event && event.isPrimary === false) return;
      if (typeof event.button === 'number' && event.button > 0) return;
      event.preventDefault();
      event.stopPropagation();
      resolveWithGuardTime(event);
    };
    const handleClick = event => {
      if (resolved) return;
      event.preventDefault();
      event.stopPropagation();
      resolveWithGuardTime(event);
    };
    const handleKeyDown = event => {
      if (resolved) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        finish(true, 0);
      } else if (event.key === 'Escape') {
        finish(true, 0);
      }
    };
    layer.addEventListener('pointerup', handlePointerUp);
    layer.addEventListener('click', handleClick, true);
    layer.addEventListener('keydown', handleKeyDown);
  });
}

async function playGachaAnimation(outcome) {
  if (!outcome) return;
  if (!elements.gachaAnimation) {
    displayGachaResult(outcome);
    return;
  }

  const layer = elements.gachaAnimation;

  layer.hidden = false;
  layer.setAttribute('aria-hidden', 'false');
  layer.classList.remove('show-result');
  layer.classList.add('is-active');
  if (elements.gachaResult) {
    elements.gachaResult.innerHTML = '';
    elements.gachaResult.style.removeProperty('--rarity-color');
  }

  startGachaConfettiAnimation(outcome);

  let guardTime = 0;
  try {
    const revealResult = await waitForGachaReveal(layer, GACHA_ANIMATION_REVEAL_DELAY);

    displayGachaResult(outcome);
    layer.classList.add('show-result');

    guardTime = revealResult && typeof revealResult.guardTime === 'number'
      ? revealResult.guardTime
      : 0;

    await waitForGachaAnimationDismiss(layer, { ignoreClicksUntil: guardTime });
  } finally {
    stopGachaConfettiAnimation();
  }

  layer.classList.remove('show-result');
  layer.classList.remove('is-active');
  layer.setAttribute('aria-hidden', 'true');
  layer.hidden = true;
  if (elements.gachaResult) {
    elements.gachaResult.innerHTML = '';
    elements.gachaResult.style.removeProperty('--rarity-color');
  }
}

function handleGachaRoll() {
  const outcome = performGachaRoll();
  if (!outcome) return;
  displayGachaResult(outcome);
  const message = getGachaToastMessage(outcome);
  if (message) {
    showToast(message);
  }
}

async function handleGachaSunClick() {
  if (gachaAnimationInProgress) return;
  const outcome = performGachaRoll();
  if (!outcome) {
    return;
  }

  gachaAnimationInProgress = true;
  updateGachaUI();

  try {
    await playGachaAnimation(outcome);
    const message = getGachaToastMessage(outcome);
    if (message) {
      showToast(message);
    }
  } finally {
    gachaAnimationInProgress = false;
    if (elements.gachaSunButton) {
      elements.gachaSunButton.disabled = false;
    }
    updateGachaUI();
  }
}

function gainGachaTickets(amount = 1) {
  const gain = Math.max(1, Math.floor(Number(amount) || 0));
  const current = Math.max(0, Math.floor(Number(gameState.gachaTickets) || 0));
  gameState.gachaTickets = current + gain;
  updateGachaUI();
  return gain;
}

let ticketStarAverageIntervalMsOverride = TICKET_STAR_CONFIG.averageSpawnIntervalMs;

function getTicketStarAverageIntervalMs() {
  const value = Number.isFinite(ticketStarAverageIntervalMsOverride) && ticketStarAverageIntervalMsOverride > 0
    ? ticketStarAverageIntervalMsOverride
    : TICKET_STAR_CONFIG.averageSpawnIntervalMs;
  return Math.max(1000, value);
}

function setTicketStarAverageIntervalSeconds(seconds) {
  const baseSeconds = DEFAULT_TICKET_STAR_INTERVAL_SECONDS;
  const numericSeconds = Number(seconds);
  const resolvedSeconds = Number.isFinite(numericSeconds) && numericSeconds > 0
    ? numericSeconds
    : baseSeconds;
  const normalizedMs = Math.max(1000, resolvedSeconds * 1000);
  if (Math.abs(ticketStarAverageIntervalMsOverride - normalizedMs) < 1) {
    gameState.ticketStarAverageIntervalSeconds = normalizedMs / 1000;
    return false;
  }
  ticketStarAverageIntervalMsOverride = normalizedMs;
  gameState.ticketStarAverageIntervalSeconds = normalizedMs / 1000;
  return true;
}

function computeTicketStarDelay() {
  const average = getTicketStarAverageIntervalMs();
  const jitter = 0.5 + Math.random();
  return average * jitter;
}

function getTicketStarAutoCollectDelayMs() {
  const config = gameState.ticketStarAutoCollect;
  if (!config) {
    return null;
  }
  const rawDelay = config.delaySeconds ?? config.delay ?? config.seconds ?? config.value;
  const delaySeconds = Number(rawDelay);
  if (!Number.isFinite(delaySeconds) || delaySeconds < 0) {
    return 0;
  }
  return delaySeconds * 1000;
}

function shouldAutoCollectTicketStar(now = performance.now()) {
  const delayMs = getTicketStarAutoCollectDelayMs();
  if (delayMs == null) {
    return false;
  }
  if (!ticketStarState.active) {
    return false;
  }
  if (!isGamePageActive()) {
    return false;
  }
  if (typeof document !== 'undefined' && document.hidden) {
    return false;
  }
  if (gamePageVisibleSince == null || now - gamePageVisibleSince < delayMs) {
    return false;
  }
  const spawnTime = Number(ticketStarState.spawnTime) || 0;
  if (spawnTime <= 0 || now - spawnTime < delayMs) {
    return false;
  }
  return true;
}

const ticketStarState = {
  element: null,
  active: false,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  width: 0,
  height: 0,
  nextSpawnTime: performance.now() + computeTicketStarDelay(),
  spawnTime: 0
};

function resetTicketStarState(options = {}) {
  if (ticketStarState.element && ticketStarState.element.parentNode) {
    ticketStarState.element.remove();
  }
  ticketStarState.element = null;
  ticketStarState.active = false;
  ticketStarState.position.x = 0;
  ticketStarState.position.y = 0;
  ticketStarState.velocity.x = 0;
  ticketStarState.velocity.y = 0;
  ticketStarState.width = 0;
  ticketStarState.height = 0;
  ticketStarState.spawnTime = 0;
  const now = performance.now();
  if (options.reschedule) {
    ticketStarState.nextSpawnTime = now + computeTicketStarDelay();
  } else if (!Number.isFinite(ticketStarState.nextSpawnTime) || ticketStarState.nextSpawnTime <= now) {
    ticketStarState.nextSpawnTime = now + computeTicketStarDelay();
  }
}

function collectTicketStar(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  if (!ticketStarState.active) {
    return;
  }
  const gained = gainGachaTickets(TICKET_STAR_CONFIG.rewardTickets);
  showToast(gained === 1 ? 'Ticket de tirage obtenu !' : `+${gained} tickets de tirage !`);
  if (ticketStarState.element && ticketStarState.element.parentNode) {
    ticketStarState.element.remove();
  }
  ticketStarState.element = null;
  ticketStarState.active = false;
  ticketStarState.spawnTime = 0;
  ticketStarState.width = 0;
  ticketStarState.height = 0;
  ticketStarState.velocity.x = 0;
  ticketStarState.velocity.y = 0;
  ticketStarState.position.x = 0;
  ticketStarState.position.y = 0;
  ticketStarState.nextSpawnTime = performance.now() + computeTicketStarDelay();
  saveGame();
}

function spawnTicketStar(now = performance.now()) {
  if (!elements.ticketLayer) {
    ticketStarState.nextSpawnTime = now + computeTicketStarDelay();
    return;
  }
  const layer = elements.ticketLayer;
  const layerWidth = layer.clientWidth;
  const layerHeight = layer.clientHeight;
  if (layerWidth <= 0 || layerHeight <= 0) {
    ticketStarState.nextSpawnTime = now + 2000;
    return;
  }

  if (ticketStarState.element && ticketStarState.element.parentNode) {
    ticketStarState.element.remove();
  }

  const star = document.createElement('button');
  star.type = 'button';
  star.className = 'ticket-star';
  star.setAttribute('aria-label', 'Collecter un ticket de tirage');
  star.style.setProperty('--ticket-star-size', `${TICKET_STAR_CONFIG.size}px`);
  star.innerHTML = '<img src="Assets/Image/star.png" alt="Étoile bonus" draggable="false" />';
  star.addEventListener('click', collectTicketStar);
  star.addEventListener('dragstart', event => event.preventDefault());

  layer.appendChild(star);

  const starWidth = star.offsetWidth || TICKET_STAR_CONFIG.size;
  const starHeight = star.offsetHeight || TICKET_STAR_CONFIG.size;
  const maxX = Math.max(0, layerWidth - starWidth);
  const maxY = Math.max(0, layerHeight - starHeight);
  const startX = Math.random() * maxX;
  const startY = Math.random() * maxY;

  ticketStarState.element = star;
  ticketStarState.active = true;
  ticketStarState.position.x = startX;
  ticketStarState.position.y = startY;
  ticketStarState.width = starWidth;
  ticketStarState.height = starHeight;
  const angle = Math.random() * Math.PI * 2;
  const speed = TICKET_STAR_CONFIG.speed;
  ticketStarState.velocity.x = Math.cos(angle) * speed;
  ticketStarState.velocity.y = Math.sin(angle) * speed;
  ticketStarState.nextSpawnTime = Number.POSITIVE_INFINITY;
  ticketStarState.spawnTime = now;

  star.style.transform = `translate(${startX}px, ${startY}px)`;
}

function updateTicketStar(deltaSeconds, now = performance.now()) {
  if (!elements.ticketLayer) {
    return;
  }
  if (!ticketStarState.active) {
    if (now >= ticketStarState.nextSpawnTime) {
      spawnTicketStar(now);
    }
    return;
  }
  const star = ticketStarState.element;
  if (!star) {
    ticketStarState.active = false;
    ticketStarState.nextSpawnTime = now + computeTicketStarDelay();
    ticketStarState.spawnTime = 0;
    return;
  }
  const layer = elements.ticketLayer;
  const width = layer.clientWidth;
  const height = layer.clientHeight;
  if (width <= 0 || height <= 0) {
    return;
  }
  if (shouldAutoCollectTicketStar(now)) {
    collectTicketStar();
    return;
  }
  const starWidth = star.offsetWidth || ticketStarState.width || TICKET_STAR_CONFIG.size;
  const starHeight = star.offsetHeight || ticketStarState.height || TICKET_STAR_CONFIG.size;
  const maxX = Math.max(0, width - starWidth);
  const maxY = Math.max(0, height - starHeight);
  let nextX = ticketStarState.position.x + ticketStarState.velocity.x * deltaSeconds;
  let nextY = ticketStarState.position.y + ticketStarState.velocity.y * deltaSeconds;

  if (nextX <= 0) {
    nextX = 0;
    ticketStarState.velocity.x = Math.abs(ticketStarState.velocity.x);
  } else if (nextX >= maxX) {
    nextX = maxX;
    ticketStarState.velocity.x = -Math.abs(ticketStarState.velocity.x);
  }

  if (nextY <= 0) {
    nextY = 0;
    ticketStarState.velocity.y = Math.abs(ticketStarState.velocity.y);
  } else if (nextY >= maxY) {
    nextY = maxY;
    ticketStarState.velocity.y = -Math.abs(ticketStarState.velocity.y);
  }

  ticketStarState.position.x = nextX;
  ticketStarState.position.y = nextY;
  ticketStarState.width = starWidth;
  ticketStarState.height = starHeight;
  star.style.transform = `translate(${nextX}px, ${nextY}px)`;
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

function formatElementFlatBonus(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric === 0) {
    return null;
  }
  try {
    return new LayeredNumber(numeric).toString();
  } catch (err) {
    return numeric.toLocaleString('fr-FR');
  }
}

function formatElementMultiplierBonus(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric <= 1) {
    return null;
  }
  const delta = Math.abs(numeric - 1);
  if (delta < 1e-6) {
    return null;
  }
  const options = numeric >= 100
    ? { maximumFractionDigits: 0 }
    : numeric >= 10
      ? { maximumFractionDigits: 1 }
      : { maximumFractionDigits: 2 };
  return numeric.toLocaleString('fr-FR', options);
}

function formatElementCritChanceBonus(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || Math.abs(numeric) < 1e-6) {
    return null;
  }
  const percent = numeric * 100;
  const abs = Math.abs(percent);
  const options = abs >= 100
    ? { maximumFractionDigits: 0 }
    : abs >= 10
      ? { maximumFractionDigits: 1 }
      : { maximumFractionDigits: 2 };
  return percent.toLocaleString('fr-FR', options) + ' %';
}

function formatElementCritMultiplierBonus(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric) || Math.abs(numeric) < 1e-6) {
    return null;
  }
  const abs = Math.abs(numeric);
  const options = abs >= 10
    ? { maximumFractionDigits: 0 }
    : abs >= 1
      ? { maximumFractionDigits: 1 }
      : { maximumFractionDigits: 2 };
  return numeric.toLocaleString('fr-FR', options);
}

function formatElementMultiplierDisplay(value) {
  const formatted = formatElementMultiplierBonus(value);
  return formatted ? `×${formatted}` : null;
}

function formatElementTicketInterval(seconds) {
  const numeric = Number(seconds);
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }
  const duration = formatDuration(numeric * 1000);
  if (!duration) {
    return null;
  }
  return `Toutes les ${duration}`;
}

function stripBonusLabelPrefix(label, rarityLabel) {
  if (!label) return null;
  const trimmed = String(label).trim();
  if (!rarityLabel) {
    return trimmed;
  }
  const prefix = `${rarityLabel} · `;
  if (trimmed.startsWith(prefix)) {
    return trimmed.slice(prefix.length);
  }
  return trimmed;
}

function renderElementBonuses() {
  const container = elements.infoElementBonuses;
  if (!container) return;
  if (elements.infoBonusSubtitle) {
    elements.infoBonusSubtitle.textContent = INFO_BONUS_SUBTITLE;
  }
  container.innerHTML = '';

  const summaryStore = gameState.elementBonusSummary || {};
  const entries = INFO_BONUS_RARITIES.map(rarityId => {
    const existing = summaryStore[rarityId];
    if (existing) {
      return existing;
    }
    const label = RARITY_LABEL_MAP.get(rarityId) || rarityId;
    return {
      rarityId,
      label,
      copies: 0,
      uniques: 0,
      duplicates: 0,
      totalUnique: getRarityPoolSize(rarityId),
      isComplete: false,
      clickFlatTotal: 0,
      autoFlatTotal: 0,
      multiplierPerClick: 1,
      multiplierPerSecond: 1,
      critChanceAdd: 0,
      critMultiplierAdd: 0,
      activeLabels: [],
      ticketIntervalSeconds: null,
      offlineMultiplier: 1,
      overflowDuplicates: 0,
      frenzyChanceMultiplier: 1
    };
  });

  entries.forEach(summary => {
    const card = document.createElement('article');
    card.className = 'element-bonus-card';
    card.setAttribute('role', 'listitem');
    card.dataset.rarityId = summary.rarityId;
    if (summary.isComplete) {
      card.classList.add('element-bonus-card--complete');
    }

    const meta = document.createElement('div');
    meta.className = 'element-bonus-card__meta';

    const header = document.createElement('header');
    header.className = 'element-bonus-card__header';

    const title = document.createElement('h4');
    title.textContent = summary.label;
    header.appendChild(title);

    const status = document.createElement('span');
    status.className = 'element-bonus-card__status';
    status.textContent = summary.isComplete ? 'Complet' : 'En cours';
    header.appendChild(status);

    meta.appendChild(header);

    const counts = document.createElement('dl');
    counts.className = 'element-bonus-counts';

    const addCountRow = (labelText, valueText, options = {}) => {
      if (!labelText || valueText == null) return;
      const row = document.createElement('div');
      row.className = 'element-bonus-count';
      if (options.highlight) {
        row.classList.add('element-bonus-count--highlight');
      }
      const labelEl = document.createElement('dt');
      labelEl.className = 'element-bonus-count__label';
      labelEl.textContent = labelText;
      const valueEl = document.createElement('dd');
      valueEl.className = 'element-bonus-count__value';
      valueEl.textContent = valueText;
      row.append(labelEl, valueEl);
      counts.appendChild(row);
    };

    const copiesCount = Number(summary.copies || 0);
    const uniqueCount = Number(summary.uniques || 0);
    const totalUnique = Number(summary.totalUnique || 0);
    const duplicatesCount = Number(
      summary.duplicates != null
        ? summary.duplicates
        : Math.max(0, copiesCount - uniqueCount)
    );

    const uniqueDisplay = totalUnique > 0
      ? `${uniqueCount.toLocaleString('fr-FR')} / ${totalUnique.toLocaleString('fr-FR')}`
      : uniqueCount.toLocaleString('fr-FR');

    addCountRow('Éléments uniques', uniqueDisplay);
    addCountRow('Copies totales', copiesCount.toLocaleString('fr-FR'));
    addCountRow('Doublons', duplicatesCount.toLocaleString('fr-FR'), {
      highlight: duplicatesCount > 0
    });

    if (counts.children.length) {
      meta.appendChild(counts);
    }

    if (totalUnique > 0) {
      const progress = document.createElement('div');
      progress.className = 'element-bonus-progress';

      const percentValue = Math.min(1, Math.max(0, uniqueCount / totalUnique));
      const percent = percentValue * 100;
      const percentOptions = percent >= 100
        ? { maximumFractionDigits: 0 }
        : percent >= 10
          ? { maximumFractionDigits: 1 }
          : { maximumFractionDigits: 2 };
      const percentLabel = percent.toLocaleString('fr-FR', percentOptions);

      const label = document.createElement('span');
      label.className = 'element-bonus-progress__label';
      label.textContent = `Progression de collection : ${percentLabel} %`;
      progress.appendChild(label);

      const track = document.createElement('div');
      track.className = 'element-bonus-progress__track';
      track.setAttribute('role', 'progressbar');
      track.setAttribute('aria-valuemin', '0');
      track.setAttribute('aria-valuemax', totalUnique.toString());
      track.setAttribute('aria-valuenow', uniqueCount.toString());
      track.setAttribute('aria-valuetext', `${uniqueCount.toLocaleString('fr-FR')} sur ${totalUnique.toLocaleString('fr-FR')}`);
      track.setAttribute('aria-label', `Progression ${summary.label}`);

      const fill = document.createElement('div');
      fill.className = 'element-bonus-progress__fill';
      fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
      track.appendChild(fill);

      progress.appendChild(track);
      meta.appendChild(progress);
    }

    card.appendChild(meta);

    const details = document.createElement('div');
    details.className = 'element-bonus-card__details';

    const productionEntries = [];
    const appendProduction = (labelText, valueText) => {
      if (!valueText) return;
      productionEntries.push({ label: labelText, value: valueText });
    };

    appendProduction('APC +', formatElementFlatBonus(summary.clickFlatTotal));
    appendProduction('APS +', formatElementFlatBonus(summary.autoFlatTotal));
    appendProduction('APC ×', formatElementMultiplierBonus(summary.multiplierPerClick));
    appendProduction('APS ×', formatElementMultiplierBonus(summary.multiplierPerSecond));

    const critParts = [];
    const critChanceText = formatElementCritChanceBonus(summary.critChanceAdd);
    if (critChanceText) {
      critParts.push(`+${critChanceText}`);
    }
    const critMultiplierText = formatElementCritMultiplierBonus(summary.critMultiplierAdd);
    if (critMultiplierText) {
      critParts.push(`+${critMultiplierText}×`);
    }
    if (critParts.length) {
      appendProduction('Critiques', critParts.join(' · '));
    }

    if (productionEntries.length) {
      const section = document.createElement('section');
      section.className = 'element-bonus-section';

      const sectionTitle = document.createElement('h5');
      sectionTitle.className = 'element-bonus-section__title';
      sectionTitle.textContent = 'Bonus de production';
      section.appendChild(sectionTitle);

      const list = document.createElement('ul');
      list.className = 'element-bonus-effects';

      productionEntries.forEach(entry => {
        const item = document.createElement('li');
        item.className = 'element-bonus-effects__item';

        const labelEl = document.createElement('span');
        labelEl.className = 'element-bonus-effects__label';
        labelEl.textContent = entry.label;

        const valueEl = document.createElement('span');
        valueEl.className = 'element-bonus-effects__value';
        valueEl.textContent = entry.value;

        item.append(labelEl, valueEl);
        list.appendChild(item);
      });

      section.appendChild(list);
      details.appendChild(section);
    }

    const rawLabels = Array.isArray(summary.activeLabels) ? summary.activeLabels : [];
    const highlightLabels = rawLabels
      .map(raw => {
        if (raw == null) {
          return null;
        }
        if (typeof raw === 'string') {
          const labelText = stripBonusLabelPrefix(raw, summary.label);
          if (!labelText || !labelText.trim()) {
            return null;
          }
          return { label: labelText.trim(), description: null };
        }
        if (typeof raw === 'object') {
          const rawLabel = typeof raw.label === 'string' ? raw.label : '';
          const labelText = stripBonusLabelPrefix(rawLabel, summary.label);
          if (!labelText || !labelText.trim()) {
            return null;
          }
          let description = null;
          if (typeof raw.description === 'string' && raw.description.trim()) {
            description = raw.description.trim();
          } else {
            const parts = [];
            if (Array.isArray(raw.effects)) {
              raw.effects.forEach(effect => {
                if (typeof effect === 'string' && effect.trim()) {
                  parts.push(effect.trim());
                }
              });
            }
            if (Array.isArray(raw.notes)) {
              raw.notes.forEach(note => {
                if (typeof note === 'string' && note.trim()) {
                  parts.push(note.trim());
                }
              });
            }
            if (parts.length) {
              description = parts.join(' · ');
            }
          }
          return { label: labelText.trim(), description };
        }
        return null;
      })
      .filter(entry => entry && entry.label);

    if (highlightLabels.length) {
      const section = document.createElement('section');
      section.className = 'element-bonus-section';

      const title = document.createElement('h5');
      title.className = 'element-bonus-section__title';
      title.textContent = 'Boosts actifs';
      section.appendChild(title);

      const tags = document.createElement('div');
      tags.className = 'element-bonus-tags';

      highlightLabels.forEach(entry => {
        const tag = document.createElement('span');
        tag.className = 'element-bonus-tag';
        tag.textContent = entry.label;
        if (entry.description) {
          tag.dataset.tooltip = entry.description;
          tag.setAttribute('tabindex', '0');
          tag.setAttribute('aria-label', `${entry.label} : ${entry.description}`);
        }
        tags.appendChild(tag);
      });

      section.appendChild(tags);
      details.appendChild(section);
    }

    const specialEntries = [];

    const ticketIntervalText = formatElementTicketInterval(summary.ticketIntervalSeconds);
    if (ticketIntervalText) {
      specialEntries.push({ label: 'Tickets quantiques', value: ticketIntervalText });
    }

    const offlineText = formatElementMultiplierDisplay(summary.offlineMultiplier);
    if (offlineText) {
      specialEntries.push({ label: 'Collecte hors ligne', value: offlineText });
    }

    const frenzyText = formatElementMultiplierDisplay(summary.frenzyChanceMultiplier);
    if (frenzyText) {
      specialEntries.push({ label: 'Chance de frénésie', value: frenzyText });
    }

    const overflowCount = Number(summary.overflowDuplicates || 0);
    if (overflowCount > 0) {
      specialEntries.push({
        label: 'Surcharge fractale',
        value: `${overflowCount.toLocaleString('fr-FR')} doublons`
      });
    }

    if (specialEntries.length) {
      const section = document.createElement('section');
      section.className = 'element-bonus-section';

      const title = document.createElement('h5');
      title.className = 'element-bonus-section__title';
      title.textContent = 'Effets spéciaux';
      section.appendChild(title);

      const list = document.createElement('ul');
      list.className = 'element-bonus-specials';

      specialEntries.forEach(entry => {
        const item = document.createElement('li');
        item.className = 'element-bonus-specials__item';

        const labelEl = document.createElement('span');
        labelEl.className = 'element-bonus-specials__label';
        labelEl.textContent = entry.label;

        const valueEl = document.createElement('span');
        valueEl.className = 'element-bonus-specials__value';
        valueEl.textContent = entry.value;

        item.append(labelEl, valueEl);
        list.appendChild(item);
      });

      section.appendChild(list);
      details.appendChild(section);
    }

    if (!details.children.length) {
      const empty = document.createElement('p');
      empty.className = 'element-bonus-empty';
      empty.textContent = 'Bonus inactifs';
      details.appendChild(empty);
    }

    card.appendChild(details);
    container.appendChild(card);
  });
}

function formatShopFlatBonus(value) {
  if (value == null) return null;
  const layered = value instanceof LayeredNumber ? value : toLayeredValue(value, 0);
  if (layered.isZero() || layered.sign <= 0) {
    return null;
  }
  const normalized = normalizeProductionUnit(layered);
  if (normalized.isZero() || normalized.sign <= 0) {
    return null;
  }
  return normalized.toString();
}

function formatShopMultiplierBonus(value) {
  if (value == null) return null;
  const layered = value instanceof LayeredNumber ? value : toMultiplierLayered(value);
  return isLayeredOne(layered) ? null : formatMultiplier(layered);
}

function collectShopBonusSummaries() {
  const productionBase = gameState.productionBase || createEmptyProductionBreakdown();
  const clickEntry = productionBase.perClick || createEmptyProductionEntry();
  const autoEntry = productionBase.perSecond || createEmptyProductionEntry();

  const summaries = new Map();
  UPGRADE_DEFS.forEach(def => {
    summaries.set(def.id, {
      id: def.id,
      name: def.name || def.id,
      effectSummary: def.effectSummary || def.description || '',
      level: getUpgradeLevel(gameState.upgrades, def.id),
      clickAdd: LayeredNumber.zero(),
      autoAdd: LayeredNumber.zero(),
      clickMult: LayeredNumber.one(),
      autoMult: LayeredNumber.one()
    });
  });

  const accumulateAddition = (list, key) => {
    if (!Array.isArray(list)) return;
    list.forEach(entry => {
      if (!entry || entry.source !== 'shop') return;
      const summary = summaries.get(entry.id);
      if (!summary) return;
      const value = entry.value instanceof LayeredNumber
        ? entry.value
        : toLayeredValue(entry.value, 0);
      if (value.isZero() || value.sign <= 0) return;
      summary[key] = summary[key].add(value);
    });
  };

  const accumulateMultiplier = (list, key) => {
    if (!Array.isArray(list)) return;
    list.forEach(entry => {
      if (!entry || entry.source !== 'shop') return;
      const summary = summaries.get(entry.id);
      if (!summary) return;
      const value = entry.value instanceof LayeredNumber
        ? entry.value
        : toMultiplierLayered(entry.value);
      summary[key] = summary[key].multiply(value);
    });
  };

  accumulateAddition(clickEntry.additions, 'clickAdd');
  accumulateAddition(autoEntry.additions, 'autoAdd');
  accumulateMultiplier(clickEntry.multipliers, 'clickMult');
  accumulateMultiplier(autoEntry.multipliers, 'autoMult');

  return UPGRADE_DEFS.map(def => summaries.get(def.id)).filter(Boolean);
}

function renderShopBonuses() {
  const container = elements.infoShopBonuses;
  if (!container) return;
  container.innerHTML = '';

  const summaries = collectShopBonusSummaries();
  if (!summaries.length) {
    const empty = document.createElement('p');
    empty.className = 'element-bonus-empty shop-bonus-empty';
    empty.textContent = 'Aucune amélioration disponible.';
    container.appendChild(empty);
    return;
  }

  summaries.forEach(summary => {
    const card = document.createElement('article');
    card.className = 'element-bonus-card shop-bonus-card';
    card.setAttribute('role', 'listitem');
    card.dataset.upgradeId = summary.id;
    if (!summary.level) {
      card.classList.add('shop-bonus-card--inactive');
    }

    const header = document.createElement('header');
    header.className = 'element-bonus-card__header shop-bonus-card__header';

    const title = document.createElement('h4');
    title.textContent = summary.name;
    header.appendChild(title);

    const status = document.createElement('span');
    status.className = 'element-bonus-card__status shop-bonus-card__status';
    if (summary.level > 0) {
      status.textContent = `Niveau ${summary.level.toLocaleString('fr-FR')}`;
    } else {
      status.textContent = 'Non acheté';
    }
    header.appendChild(status);

    card.appendChild(header);

    if (summary.effectSummary) {
      const desc = document.createElement('p');
      desc.className = 'shop-bonus-card__summary';
      desc.textContent = summary.effectSummary;
      card.appendChild(desc);
    }

    if (summary.level > 0) {
      const effects = document.createElement('ul');
      effects.className = 'element-bonus-effects shop-bonus-effects';
      let hasEffect = false;

      const appendEffect = (labelText, valueText) => {
        if (!valueText) return;
        const item = document.createElement('li');
        item.className = 'element-bonus-effects__item';
        const labelEl = document.createElement('span');
        labelEl.className = 'element-bonus-effects__label';
        labelEl.textContent = labelText;
        const valueEl = document.createElement('span');
        valueEl.className = 'element-bonus-effects__value';
        valueEl.textContent = valueText;
        item.append(labelEl, valueEl);
        effects.appendChild(item);
        hasEffect = true;
      };

      appendEffect('APC +', formatShopFlatBonus(summary.clickAdd));
      appendEffect('APS +', formatShopFlatBonus(summary.autoAdd));
      appendEffect('APC ×', formatShopMultiplierBonus(summary.clickMult));
      appendEffect('APS ×', formatShopMultiplierBonus(summary.autoMult));

      if (hasEffect) {
        card.appendChild(effects);
      } else {
        const empty = document.createElement('p');
        empty.className = 'element-bonus-empty shop-bonus-empty';
        empty.textContent = 'Bonus en attente de seuil.';
        card.appendChild(empty);
      }
    } else {
      const locked = document.createElement('p');
      locked.className = 'element-bonus-empty shop-bonus-empty';
      locked.textContent = 'Achetez cette amélioration pour activer ses effets.';
      card.appendChild(locked);
    }

    container.appendChild(card);
  });
}

function computeRarityMultiplierProduct(store) {
  if (!store) return LayeredNumber.one();
  if (store instanceof Map) {
    let product = LayeredNumber.one();
    store.forEach(raw => {
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric > 0) {
        product = product.multiplyNumber(numeric);
      }
    });
    return product;
  }
  if (typeof store === 'object' && store !== null) {
    return Object.values(store).reduce((product, raw) => {
      const numeric = Number(raw);
      if (Number.isFinite(numeric) && numeric > 0) {
        return product.multiplyNumber(numeric);
      }
      return product;
    }, LayeredNumber.one());
  }
  return LayeredNumber.one();
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
    renderProductionBreakdown(elements.infoApsBreakdown, production.perSecond, 'perSecond');
    renderProductionBreakdown(elements.infoApcBreakdown, production.perClick, 'perClick');
  } else {
    renderProductionBreakdown(elements.infoApsBreakdown, null, 'perSecond');
    renderProductionBreakdown(elements.infoApcBreakdown, null, 'perClick');
  }

  updateSessionStats();
  updateGlobalStats();
  renderElementBonuses();
  renderShopBonuses();
}

let toastElement = null;

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

  const offsetX = state.posX;
  const offsetY = state.posY;
  const squash = Math.max(-0.75, Math.min(0.75, state.squash));
  const scaleY = Math.max(0.75, Math.min(1.25, 1 + squash * 0.28 + intensity * 0.02));
  const scaleX = Math.max(0.75, Math.min(1.25, 1 - squash * 0.18 - intensity * 0.015));

  visual.style.setProperty('--shake-x', `${offsetX.toFixed(2)}px`);
  visual.style.setProperty('--shake-y', `${offsetY.toFixed(2)}px`);
  visual.style.setProperty('--shake-rot', `${(state.tilt + spin).toFixed(2)}deg`);
  visual.style.setProperty('--shake-scale-x', scaleX.toFixed(4));
  visual.style.setProperty('--shake-scale-y', scaleY.toFixed(4));
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
    ? `×${multiplierValue.toLocaleString('fr-FR', { maximumFractionDigits: 2 })}`
    : '';

  valueElement.textContent = hasMultiplier
    ? `${totalText} ${multiplierText}`
    : totalText;

  display.hidden = false;
  display.classList.remove('is-fading');
  display.classList.add('is-active');

  valueElement.classList.remove('status-crit-value--smash');
  void valueElement.offsetWidth; // force reflow to restart the impact animation
  valueElement.classList.add('status-crit-value--smash');

  const ariaText = hasMultiplier
    ? `Coup critique ${multiplierText} : ${totalText} atomes`
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
    ? `Bonus critique ${totalText} (${multiplierText})${detailText}`
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
  gainAtoms(critResult.amount, true);
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
  if (pageId === 'game' && (typeof document === 'undefined' || !document.hidden)) {
    gamePageVisibleSince = now;
  } else {
    gamePageVisibleSince = null;
  }
}

document.addEventListener('visibilitychange', () => {
  if (typeof document === 'undefined') {
    return;
  }
  if (document.hidden) {
    gamePageVisibleSince = null;
  } else if (isGamePageActive()) {
    gamePageVisibleSince = performance.now();
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

if (elements.gachaSunButton) {
  elements.gachaSunButton.addEventListener('click', event => {
    event.preventDefault();
    handleGachaSunClick().catch(error => {
      console.error('Erreur lors du tirage cosmique', error);
    });
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
  evaluateTrophies();
}

function getUpgradeLevel(state, id) {
  if (!state || typeof state !== 'object') {
    return 0;
  }
  const value = Number(state[id] ?? 0);
  return Number.isFinite(value) && value > 0 ? value : 0;
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
  const elementGroupSummaries = new Map();
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
      counter = { copies: 0, unique: 0 };
      elementCountsByRarity.set(rarityId, counter);
    }
    return counter;
  };

  const elementEntries = Object.values(gameState.elements || {});
  elementEntries.forEach(entry => {
    if (!entry) return;
    const rarityId = entry.rarity || elementRarityIndex.get(entry.id);
    if (!rarityId) return;
    const rawCount = Number(entry.count);
    const normalizedCount = Number.isFinite(rawCount) && rawCount > 0
      ? Math.floor(rawCount)
      : (entry.owned ? 1 : 0);
    if (normalizedCount <= 0) return;
    const counter = getRarityCounter(rarityId);
    if (!counter) return;
    counter.copies += normalizedCount;
    counter.unique += 1;
  });

  const singularityCounts = elementCountsByRarity.get('singulier') || { copies: 0, unique: 0 };
  const singularityPoolSize = getRarityPoolSize('singulier');
  const isSingularityComplete = singularityPoolSize > 0 && singularityCounts.unique >= singularityPoolSize;
  const stellaireSingularityBoost = isSingularityComplete ? 2 : 1;
  const STELLAIRE_SINGULARITY_BONUS_LABEL = 'Forge stellaire · singularité amplifiée';

  const flatBonusMultipliers = {
    perClick: new Map(),
    perSecond: new Map()
  };
  const activeFlatMultiplierEntries = new Set();

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
    const counts = elementCountsByRarity.get(rarityId) || { copies: 0, unique: 0 };
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

  const addClickElementFlat = (value, { id, label, rarityId }) => {
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
      source: 'elements'
    });
    return finalValue.toNumber();
  };

  const addAutoElementFlat = (value, { id, label, rarityId }) => {
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
      source: 'elements'
    });
    return finalValue.toNumber();
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
    const { copies: copyCount = 0, unique: uniqueCount = 0 } = elementCountsByRarity.get(rarityId) || {};
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
    const ensureActiveLabel = label => {
      const key = normalizeLabelKey(label);
      if (!key) return null;
      if (!activeLabelDetails.has(key)) {
        activeLabelDetails.set(key, {
          label: key,
          effects: [],
          notes: []
        });
      }
      return activeLabelDetails.get(key);
    };
    const addLabelEffect = (label, effectText) => {
      if (!effectText) return;
      const entry = ensureActiveLabel(label);
      if (!entry) return;
      if (!entry.effects.includes(effectText)) {
        entry.effects.push(effectText);
      }
    };
    const addLabelNote = (label, noteText) => {
      if (!noteText) return;
      const entry = ensureActiveLabel(label);
      if (!entry) return;
      if (!entry.notes.includes(noteText)) {
        entry.notes.push(noteText);
      }
    };
    const markLabelActive = label => {
      ensureActiveLabel(label);
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
      rarityId,
      label: rarityLabel,
      copies: copyCount,
      uniques: uniqueCount,
      duplicates: duplicateCount,
      totalUnique,
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
              addLabelEffect(copyLabel, `APC +${formatted}`);
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
              addLabelEffect(copyLabel, `APS +${formatted}`);
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
              addLabelEffect(copyLabel, `APC +${formatted}`);
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
              addLabelEffect(copyLabel, `APS +${formatted}`);
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
              addLabelEffect(copyLabel, `APC +${formatted}`);
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
              addLabelEffect(copyLabel, `APS +${formatted}`);
            }
          }
        }
        if (activeFlatMultiplierEntries.has(`${rarityId}:perCopy`)) {
          hasEffect = true;
          if (groupConfig.perCopy?.rarityFlatMultipliers) {
            describeRarityFlatMultipliers(groupConfig.perCopy.rarityFlatMultipliers).forEach(note => {
              addLabelNote(copyLabel, note);
            });
          }
        }
        if (hasEffect) {
          markLabelActive(copyLabel);
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
              addLabelEffect(resolvedLabel, `APC +${formatted}`);
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
              addLabelEffect(resolvedLabel, `APS +${formatted}`);
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
              addLabelEffect(resolvedLabel, `APC +${formatted}`);
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
              addLabelEffect(resolvedLabel, `APS +${formatted}`);
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
              addLabelEffect(resolvedLabel, `APC +${formatted}`);
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
              addLabelEffect(resolvedLabel, `APS +${formatted}`);
            }
          }
        }
        if (activeFlatMultiplierEntries.has(`${rarityId}:setBonus:${index}`)) {
          setBonusTriggered = true;
          if (Array.isArray(setBonusEntry.rarityFlatMultipliers)) {
            describeRarityFlatMultipliers(setBonusEntry.rarityFlatMultipliers).forEach(note => {
              addLabelNote(resolvedLabel, note);
            });
          }
        }
        if (setBonusTriggered) {
          markLabelActive(resolvedLabel);
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
        markLabelActive(multiplierLabelResolved);
        const multiplierText = formatMultiplierTooltip(appliedMultiplier);
        if (multiplierText) {
          if (targets.has('perClick')) {
            addLabelEffect(multiplierLabelResolved, `APC ${multiplierText}`);
          }
          if (targets.has('perSecond')) {
            addLabelEffect(multiplierLabelResolved, `APS ${multiplierText}`);
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
        markLabelActive(critLabel);
        const chanceText = formatElementCritChanceBonus(summary.critChanceAdd);
        if (chanceText) {
          addLabelEffect(critLabel, `Chance +${chanceText}`);
        }
        const critMultiplierText = formatElementCritMultiplierBonus(summary.critMultiplierAdd);
        if (critMultiplierText) {
          addLabelEffect(critLabel, `Multiplicateur +${critMultiplierText}×`);
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
              addLabelEffect(resolvedLabel, `Multiplicateur de rareté APC ${display}`);
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
              addLabelEffect(resolvedLabel, `Multiplicateur de rareté APS ${display}`);
              labelApplied = true;
            }
          }
          if (labelApplied) {
            markLabelActive(resolvedLabel);
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
        markLabelActive(ticketLabel);
        const ticketText = formatElementTicketInterval(summary.ticketIntervalSeconds);
        if (ticketText) {
          addLabelEffect(ticketLabel, ticketText);
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
        markLabelActive(offlineLabel);
        const offlineText = formatMultiplierTooltip(offlineMultiplier);
        if (offlineText) {
          addLabelEffect(offlineLabel, `Collecte hors ligne ${offlineText}`);
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
            addLabelEffect(overflowLabel, `APC +${formatted}`);
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
            addLabelEffect(overflowLabel, `APS +${formatted}`);
          }
        }
        if (
          (Number.isFinite(overflowClick) && overflowClick !== 0)
          || (Number.isFinite(overflowAuto) && overflowAuto !== 0)
        ) {
          markLabelActive(overflowLabel);
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
        markLabelActive(frenzyLabel);
        const frenzyText = formatMultiplierTooltip(frenzyMultiplier);
        if (frenzyText) {
          addLabelEffect(frenzyLabel, `Chance de frénésie ${frenzyText}`);
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
      markLabelActive(STELLAIRE_SINGULARITY_BONUS_LABEL);
      const singularityText = formatMultiplierTooltip(stellaireSingularityBoost);
      if (singularityText) {
        addLabelNote(STELLAIRE_SINGULARITY_BONUS_LABEL, `Singularité amplifiée : effets ${singularityText}`);
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
      if (descriptionParts.length) {
        labelEntry.description = descriptionParts.join(' · ');
      }
      labelEntries.push(labelEntry);
    });
    summary.activeLabels = labelEntries;
    elementGroupSummaries.set(rarityId, summary);
  });

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

  clickDetails.sources.flats.shopFlat = clickShopAddition.clone();
  autoDetails.sources.flats.shopFlat = autoShopAddition.clone();
  clickDetails.sources.flats.elementFlat = clickElementAddition.clone();
  autoDetails.sources.flats.elementFlat = autoElementAddition.clone();
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

  const clickShopBonus1 = clickDetails.sources.multipliers.shopBonus1;
  const clickShopBonus2 = clickDetails.sources.multipliers.shopBonus2;
  const autoShopBonus1 = autoDetails.sources.multipliers.shopBonus1;
  const autoShopBonus2 = autoDetails.sources.multipliers.shopBonus2;

  const clickRarityProduct = computeRarityMultiplierProduct(clickRarityMultipliers);
  const autoRarityProduct = computeRarityMultiplierProduct(autoRarityMultipliers);

  const clickTotalAddition = clickShopAddition.add(clickElementAddition);
  let autoTotalAddition = autoShopAddition.add(autoElementAddition);
  if (devkitAutoFlat instanceof LayeredNumber && !devkitAutoFlat.isZero()) {
    autoTotalAddition = autoTotalAddition.add(devkitAutoFlat);
  }

  clickDetails.totalAddition = clickTotalAddition.clone();
  autoDetails.totalAddition = autoTotalAddition.clone();

  const clickTotalMultiplier = LayeredNumber.one()
    .multiply(clickShopBonus1)
    .multiply(clickShopBonus2)
    .multiply(clickRarityProduct)
    .multiply(clickTrophyMultiplier);
  const autoTotalMultiplier = LayeredNumber.one()
    .multiply(autoShopBonus1)
    .multiply(autoShopBonus2)
    .multiply(autoRarityProduct)
    .multiply(autoTrophyMultiplier);

  clickDetails.totalMultiplier = clickTotalMultiplier.clone();
  autoDetails.totalMultiplier = autoTotalMultiplier.clone();

  const clickFlatBase = clickDetails.sources.flats.baseFlat
    .add(clickDetails.sources.flats.shopFlat)
    .add(clickDetails.sources.flats.elementFlat);
  const autoFlatBase = autoDetails.sources.flats.baseFlat
    .add(autoDetails.sources.flats.shopFlat)
    .add(autoDetails.sources.flats.elementFlat)
    .add(autoDetails.sources.flats.devkitFlat || LayeredNumber.zero());

  let perClick = clickFlatBase.clone();
  perClick = perClick.multiply(clickShopBonus1);
  perClick = perClick.multiply(clickShopBonus2);
  perClick = perClick.multiply(clickRarityProduct);
  perClick = perClick.multiply(clickTrophyMultiplier);
  if (perClick.compare(LayeredNumber.zero()) < 0) {
    perClick = LayeredNumber.zero();
  }
  let perSecond = autoFlatBase.clone();
  perSecond = perSecond.multiply(autoShopBonus1);
  perSecond = perSecond.multiply(autoShopBonus2);
  perSecond = perSecond.multiply(autoRarityProduct);
  perSecond = perSecond.multiply(autoTrophyMultiplier);

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
    buttonMap.set(quantity, { button, price: priceLabel });
  });

  item.append(header, desc, actions);

  return { root: item, level, description: desc, buttons: buttonMap };
}

function getShopUnlockThreshold(def) {
  if (!def) {
    return LayeredNumber.zero();
  }
  if (def.unlockCost instanceof LayeredNumber) {
    return def.unlockCost.clone();
  }
  if (def.unlockCost != null) {
    return toLayeredNumber(def.unlockCost, def.baseCost ?? 0);
  }
  if (def.baseCost instanceof LayeredNumber) {
    return def.baseCost.clone();
  }
  const base = Number(def.baseCost);
  if (Number.isFinite(base)) {
    return new LayeredNumber(base);
  }
  return LayeredNumber.zero();
}

function updateShopVisibility() {
  if (!shopRows.size) return;
  const shopFree = isDevKitShopFree();
  const unlocks = getShopUnlockSet();

  UPGRADE_DEFS.forEach((def, index) => {
    const row = shopRows.get(def.id);
    if (!row) return;

    if (shopFree) {
      row.root.hidden = false;
      row.root.classList.remove('shop-item--locked');
      unlocks.add(def.id);
      return;
    }

    const unlockCost = getShopUnlockThreshold(def);
    const level = getUpgradeLevel(gameState.upgrades, def.id);
    const isUnlocked = unlocks.has(def.id) || level > 0;

    let shouldReveal = false;
    if (index === 0 || isUnlocked) {
      shouldReveal = true;
    } else {
      const thresholdCost = unlockCost instanceof LayeredNumber
        ? unlockCost.clone()
        : toLayeredNumber(unlockCost, def.baseCost ?? 0);
      shouldReveal = gameState.atoms.compare(thresholdCost) >= 0;
    }

    if (!shouldReveal) {
      row.root.hidden = true;
      row.root.classList.add('shop-item--locked');
      return;
    }

    row.root.hidden = false;
    row.root.classList.remove('shop-item--locked');
    if (!isUnlocked) {
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
    row.level.textContent = `Niveau ${level}`;
    let anyAffordable = false;
    const actionLabel = level > 0 ? 'Améliorer' : 'Acheter';
    const shopFree = isDevKitShopFree();

    SHOP_PURCHASE_AMOUNTS.forEach(quantity => {
      const entry = row.buttons.get(quantity);
      if (!entry) return;
      const cost = computeUpgradeCost(def, quantity);
      const affordable = shopFree || gameState.atoms.compare(cost) >= 0;
      entry.price.textContent = shopFree ? 'Gratuit' : formatShopCost(cost);
      entry.button.disabled = !affordable;
      entry.button.classList.toggle('is-ready', affordable);
      if (affordable) {
        anyAffordable = true;
      }
      const ariaLabel = affordable
        ? shopFree
          ? `${actionLabel} ${def.name} ×${quantity} (gratuit)`
          : `${actionLabel} ${def.name} ×${quantity} (coût ${cost.toString()} atomes)`
        : `${actionLabel} ${def.name} ×${quantity} (atomes insuffisants)`;
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

  const header = document.createElement('header');
  header.className = 'goal-card__header';

  const title = document.createElement('h3');
  title.textContent = def.name;
  title.className = 'goal-card__title';

  const status = document.createElement('span');
  status.className = 'goal-card__status';
  status.textContent = '0%';

  header.append(title, status);

  const description = document.createElement('p');
  description.className = 'goal-card__description';
  description.textContent = def.description || '';

  const progress = document.createElement('div');
  progress.className = 'goal-card__progress';

  const bar = document.createElement('div');
  bar.className = 'goal-card__progress-bar';

  const barFill = document.createElement('span');
  barFill.className = 'goal-card__progress-fill';
  barFill.style.width = '0%';
  bar.appendChild(barFill);

  const progressValue = document.createElement('span');
  progressValue.className = 'goal-card__progress-value';
  progressValue.textContent = '0 / 0';

  progress.append(bar, progressValue);

  card.append(header, description, progress);

  if (def.rewardText) {
    const reward = document.createElement('p');
    reward.className = 'goal-card__reward';
    reward.textContent = def.rewardText;
    card.appendChild(reward);
  }

  return { root: card, status, progressValue, barFill };
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
  if (elements.goalsEmpty) {
    elements.goalsEmpty.hidden = true;
  }
  updateGoalsUI();
}

function attemptPurchase(def, quantity = 1) {
  const buyAmount = Math.max(1, Math.floor(Number(quantity) || 0));
  const cost = computeUpgradeCost(def, buyAmount);
  const shopFree = isDevKitShopFree();
  if (!shopFree && gameState.atoms.compare(cost) < 0) {
    showToast('Pas assez d’atomes.');
    return;
  }
  if (!shopFree) {
    gameState.atoms = gameState.atoms.subtract(cost);
  }
  gameState.upgrades[def.id] = (gameState.upgrades[def.id] || 0) + buyAmount;
  recalcProduction();
  updateUI();
  showToast(shopFree
    ? `DevKit : "${def.name}" ×${buyAmount} débloqué gratuitement !`
    : `Amélioration "${def.name}" x${buyAmount} achetée !`);
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
  TROPHY_DEFS.forEach(def => {
    const card = trophyCards.get(def.id);
    if (!card) return;
    const isUnlocked = unlocked.has(def.id);
    const progress = formatTrophyProgress(def);
    const percent = isUnlocked ? 1 : Math.max(0, Math.min(1, progress.percent || 0));
    card.barFill.style.width = `${(percent * 100).toFixed(0)}%`;
    card.progressValue.textContent = isUnlocked
      ? `✓ ${progress.displayTarget}`
      : `${progress.displayCurrent} / ${progress.displayTarget}`;
    card.status.textContent = isUnlocked ? 'Débloqué' : `${(percent * 100).toFixed(0)}%`;
    card.root.classList.toggle('goal-card--completed', isUnlocked);
  });
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
  updateFrenzyIndicators();
  updateGachaUI();
  updateCollectionDisplay();
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

function serializeState() {
  const stats = gameState.stats || createInitialStats();
  return {
    atoms: gameState.atoms.toJSON(),
    lifetime: gameState.lifetime.toJSON(),
    perClick: gameState.perClick.toJSON(),
    perSecond: gameState.perSecond.toJSON(),
    gachaTickets: Number.isFinite(Number(gameState.gachaTickets))
      ? Math.max(0, Math.floor(Number(gameState.gachaTickets)))
      : 0,
    upgrades: gameState.upgrades,
    shopUnlocks: Array.from(getShopUnlockSet()),
    elements: gameState.elements,
    theme: gameState.theme,
    stats: {
      session: {
        atomsGained: stats.session.atomsGained.toJSON(),
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
    upgrades: {},
    shopUnlocks: new Set(),
    elements: createInitialElementCollection(),
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
    ticketStarAutoCollect: null,
    ticketStarAverageIntervalSeconds: DEFAULT_TICKET_STAR_INTERVAL_SECONDS,
    frenzySpawnBonus: { perClick: 1, perSecond: 1 },
    musicTrackId: null,
    musicVolume: DEFAULT_MUSIC_VOLUME,
    musicEnabled: DEFAULT_MUSIC_ENABLED
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
    gameState.upgrades = data.upgrades || {};
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
    const storedOffline = Number(data.offlineGainMultiplier);
    if (Number.isFinite(storedOffline) && storedOffline > 0) {
      gameState.offlineGainMultiplier = Math.min(MYTHIQUE_OFFLINE_CAP, storedOffline);
    } else {
      gameState.offlineGainMultiplier = MYTHIQUE_OFFLINE_BASE;
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
          : (saved?.owned ? 1 : 0);
        baseCollection[id] = {
          id,
          gachaId: reference.gachaId,
          owned: Boolean(saved?.owned) || normalizedCount > 0,
          count: normalizedCount,
          rarity: reference.rarity ?? (typeof saved?.rarity === 'string' ? saved.rarity : null),
          effects: Array.isArray(saved?.effects) ? [...saved.effects] : [],
          bonuses: Array.isArray(saved?.bonuses) ? [...saved.bonuses] : []
        };
      });
    }
    gameState.elements = baseCollection;
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
    getShopUnlockSet();
    applyTheme(gameState.theme);
    recalcProduction();
    renderShop();
    updateUI();
    if (data.lastSave) {
      const diff = (Date.now() - data.lastSave) / 1000;
      const capped = Math.min(diff, OFFLINE_GAIN_CAP);
      if (capped > 0) {
        const multiplier = Number.isFinite(Number(gameState.offlineGainMultiplier))
          && Number(gameState.offlineGainMultiplier) > 0
          ? Math.min(MYTHIQUE_OFFLINE_CAP, Number(gameState.offlineGainMultiplier))
          : MYTHIQUE_OFFLINE_BASE;
        if (multiplier > 0) {
          const offlineGain = gameState.perSecond.multiplyNumber(capped * multiplier);
          gainAtoms(offlineGain);
          showToast(`Progression hors ligne : +${offlineGain.toString()} atomes`);
        }
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
