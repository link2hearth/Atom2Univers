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
      minCopies: defaultMinCopies,
      minUnique: defaultMinUnique,
      requireAllUnique: defaultRequireAllUnique
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
      minCopies: defaultMinCopies,
      minUnique: defaultMinUnique,
      requireAllUnique: defaultRequireAllUnique
    };
  }
  if (typeof raw !== 'object') {
    return null;
  }
  const click = readNumberProperty(raw, ['clickAdd', 'apc', 'perClick', 'manual', 'click']);
  const auto = readNumberProperty(raw, ['autoAdd', 'aps', 'perSecond', 'auto', 'automatic']);
  const clickAdd = Number.isFinite(click) ? click : 0;
  const autoAdd = Number.isFinite(auto) ? auto : 0;
  if (clickAdd === 0 && autoAdd === 0) {
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
  return { clickAdd, autoAdd, minCopies, minUnique, requireAllUnique };
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
  const setBonus = normalizeElementGroupAddConfig(
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
  if (!perCopy && !setBonus && !multiplier && !crit && !rarityMultiplierBonus) {
    return null;
  }
  return {
    perCopy,
    setBonus,
    multiplier,
    crit,
    rarityMultiplierBonus,
    labels: hasLabels ? labels : null
  };
}

const ELEMENT_GROUP_BONUS_CONFIG = (() => {
  const result = new Map();
  const rawConfig = CONFIG.elementBonuses ?? CONFIG.elementBonus ?? null;
  if (!rawConfig || typeof rawConfig !== 'object') {
    return result;
  }
  const rawGroups = rawConfig.groups
    ?? rawConfig.byRarity
    ?? rawConfig.rarity
    ?? rawConfig.groupsByRarity
    ?? rawConfig;
  if (!rawGroups || typeof rawGroups !== 'object') {
    return result;
  }
  Object.entries(rawGroups).forEach(([rarityId, rawValue]) => {
    if (!rarityId) return;
    const normalizedRarityId = String(rarityId).trim();
    if (!normalizedRarityId) return;
    const normalizedConfig = normalizeElementGroupBonus(rawValue);
    if (!normalizedConfig) return;
    result.set(normalizedRarityId, normalizedConfig);
  });
  return result;
})();

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
  'Bonus multiplicateur lié aux trophées (à venir)',
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
        'Production passive : +1 APS par niveau (paliers ×2/×4). Chaque 10 labos accordent +5 % d’APC global. Palier 200 : Réacteurs +20 %.',
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
        'Production passive : +10 APS par niveau (bonifiée par Électrons et Labos). Palier 150 : APC global ×2. Synergie : +1 % APS des Réacteurs par 50 Électrons.',
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
        'Production passive : +500 000 APS par niveau (boostée par Stations). Palier 150 : +25 % APC global.',
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
        'Production passive : +100 000 000 000 000 APS par niveau (paliers ×2/×4). Synergie : +50 % APS/APC à chaque renaissance.',
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

const FALLBACK_MILESTONES = [
  { amount: 100, text: 'Collectez 100 atomes pour débloquer la synthèse automatique.' },
  { amount: 1_000, text: 'Atteignez 1 000 atomes pour améliorer vos gants quantiques.' },
  { amount: 1_000_000, text: 'Atteignez 1 million d’atomes pour accéder aux surcadences.' },
  { amount: { type: 'layer1', value: 8 }, text: 'Accumulez 10^8 atomes pour préparer la prochaine ère.' }
];

const FALLBACK_TROPHIES = [
  {
    id: 'millionAtoms',
    name: 'Ruée vers le million',
    description: 'Accumulez un total d’un million d’atomes synthétisés.',
    condition: {
      type: 'lifetimeAtoms',
      amount: { type: 'number', value: 1_000_000 }
    },
    reward: {
      multiplier: { global: 1.1 },
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
      multiplier: { global: 1.05 },
      description: 'Active la triple frénésie et ajoute un bonus global ×1,05.'
    }
  }
];

function createInitialStats() {
  return {
    session: {
      atomsGained: LayeredNumber.zero(),
      manualClicks: 0,
      onlineTimeMs: 0,
      startedAt: Date.now(),
      frenzyTriggers: {
        perClick: 0,
        perSecond: 0,
        total: 0
      }
    },
    global: {
      manualClicks: 0,
      playTimeMs: 0,
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
  const chance = FRENZY_CONFIG.spawnChancePerSecond[type] ?? 0;
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
  if (saved.session) {
    stats.session.atomsGained = LayeredNumber.fromJSON(saved.session.atomsGained);
    stats.session.manualClicks = Number(saved.session.manualClicks) || 0;
    stats.session.onlineTimeMs = Number(saved.session.onlineTimeMs) || 0;
    stats.session.startedAt = typeof saved.session.startedAt === 'number'
      ? saved.session.startedAt
      : Date.now();
    stats.session.frenzyTriggers = normalizeFrenzyStats(saved.session.frenzyTriggers);
  }
  if (saved.global) {
    stats.global.manualClicks = Number(saved.global.manualClicks) || 0;
    stats.global.playTimeMs = Number(saved.global.playTimeMs) || 0;
    stats.global.frenzyTriggers = normalizeFrenzyStats(saved.global.frenzyTriggers);
  }
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
  elements: createInitialElementCollection(),
  lastSave: Date.now(),
  theme: DEFAULT_THEME,
  stats: createInitialStats(),
  production: createEmptyProductionBreakdown(),
  productionBase: createEmptyProductionBreakdown(),
  crit: createDefaultCritState(),
  baseCrit: createDefaultCritState(),
  lastCritical: null,
  trophies: []
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
  elements: createInitialElementCollection(),
  theme: DEFAULT_THEME,
  stats: createInitialStats(),
  production: createEmptyProductionBreakdown(),
  productionBase: createEmptyProductionBreakdown(),
  crit: createDefaultCritState(),
  baseCrit: createDefaultCritState(),
  lastCritical: null,
  trophies: new Set()
};

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
  const amount = toLayeredNumber(raw.amount ?? raw.value ?? 0, 0);
  return {
    type: 'lifetimeAtoms',
    amount
  };
}

function normalizeTrophyReward(raw) {
  if (!raw || typeof raw !== 'object') {
    return {
      multiplier: null,
      frenzyMaxStacks: null,
      description: null
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
  return {
    multiplier,
    frenzyMaxStacks,
    description
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
    applyCritModifiersFromEffect(critAccumulator, reward);
    if (reward?.crit) {
      applyCritModifiersFromEffect(critAccumulator, reward.crit);
    }
  });

  const critEffect = finalizeCritEffect(critAccumulator);

  return { clickMultiplier, autoMultiplier, maxStacks, critEffect };
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
  gachaAnimation: document.getElementById('gachaAnimation'),
  gachaAnimationStars: document.getElementById('gachaAnimationStars'),
  gachaWarp: document.getElementById('gachaWarp'),
  gachaContinueHint: document.getElementById('gachaContinueHint'),
  themeSelect: document.getElementById('themeSelect'),
  resetButton: document.getElementById('resetButton'),
  infoApsBreakdown: document.getElementById('infoApsBreakdown'),
  infoApcBreakdown: document.getElementById('infoApcBreakdown'),
  infoSessionAtoms: document.getElementById('infoSessionAtoms'),
  infoSessionClicks: document.getElementById('infoSessionClicks'),
  infoSessionDuration: document.getElementById('infoSessionDuration'),
  infoGlobalAtoms: document.getElementById('infoGlobalAtoms'),
  infoGlobalClicks: document.getElementById('infoGlobalClicks'),
  infoGlobalDuration: document.getElementById('infoGlobalDuration'),
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

const GACHA_ANIMATION_STAR_COUNT = 90;
const GACHA_ANIMATION_REVEAL_DELAY = 2600;
const GACHA_WARP_BASE_CLASS = 'gacha-warp--commun';
const GACHA_WARP_COLOR_TRANSITION_DELAY = 1500;
let gachaAnimationInProgress = false;
let gachaWarpColorTimeout = null;

function updateGachaUI() {
  const available = Math.max(0, Math.floor(Number(gameState.gachaTickets) || 0));
  if (elements.gachaTicketCounter) {
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

function populateGachaAnimationStars() {
  if (!elements.gachaAnimationStars) return;
  const container = elements.gachaAnimationStars;
  container.innerHTML = '';
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < GACHA_ANIMATION_STAR_COUNT; i += 1) {
    const star = document.createElement('span');
    star.className = 'gacha-star';
    const height = 80 + Math.random() * 120;
    const distance = 240 + Math.random() * 320;
    const angle = Math.random() * 360;
    const duration = 0.8 + Math.random() * 1.1;
    const delay = Math.random() * 0.6;
    const peakOpacity = 0.55 + Math.random() * 0.4;
    star.style.height = `${height}px`;
    star.style.setProperty('--star-distance', `${distance}px`);
    star.style.setProperty('--star-angle', `${angle}deg`);
    star.style.setProperty('--star-scale', (0.9 + Math.random() * 0.5).toFixed(2));
    star.style.setProperty('--star-peak-opacity', peakOpacity.toFixed(2));
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;
    fragment.appendChild(star);
  }
  container.appendChild(fragment);
}

function waitForGachaAnimationDismiss(layer) {
  return new Promise(resolve => {
    const handleClick = event => {
      event.preventDefault();
      cleanup();
    };
    const handleKeyDown = event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        cleanup();
      }
      if (event.key === 'Escape') {
        cleanup();
      }
    };
    const cleanup = () => {
      layer.removeEventListener('click', handleClick);
      layer.removeEventListener('keydown', handleKeyDown);
      resolve();
    };
    requestAnimationFrame(() => {
      try {
        layer.focus({ preventScroll: true });
      } catch (err) {
        layer.focus();
      }
    });
    layer.addEventListener('click', handleClick);
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
  const stars = elements.gachaAnimationStars;
  const warp = elements.gachaWarp;
  const rarityClassName = outcome.rarity?.id
    ? `gacha-warp--${outcome.rarity.id}`
    : '';

  layer.hidden = false;
  layer.setAttribute('aria-hidden', 'false');
  layer.classList.remove('show-result');
  layer.classList.add('is-active');
  if (warp) {
    if (gachaWarpColorTimeout) {
      clearTimeout(gachaWarpColorTimeout);
      gachaWarpColorTimeout = null;
    }
    const previousClasses = [warp.dataset.activeRarityClass, warp.dataset.baseRarityClass];
    previousClasses.forEach(cls => {
      if (cls) {
        warp.classList.remove(cls);
      }
    });
    delete warp.dataset.activeRarityClass;
    delete warp.dataset.baseRarityClass;
    if (GACHA_WARP_BASE_CLASS) {
      warp.classList.add(GACHA_WARP_BASE_CLASS);
      warp.dataset.baseRarityClass = GACHA_WARP_BASE_CLASS;
    }
    if (rarityClassName) {
      if (rarityClassName === GACHA_WARP_BASE_CLASS) {
        warp.dataset.activeRarityClass = GACHA_WARP_BASE_CLASS;
      } else {
        gachaWarpColorTimeout = setTimeout(() => {
          warp.classList.remove(GACHA_WARP_BASE_CLASS);
          delete warp.dataset.baseRarityClass;
          warp.classList.add(rarityClassName);
          warp.dataset.activeRarityClass = rarityClassName;
          gachaWarpColorTimeout = null;
        }, GACHA_WARP_COLOR_TRANSITION_DELAY);
      }
    }
  }
  if (elements.gachaResult) {
    elements.gachaResult.innerHTML = '';
    elements.gachaResult.style.removeProperty('--rarity-color');
  }

  populateGachaAnimationStars();

  await wait(GACHA_ANIMATION_REVEAL_DELAY);

  displayGachaResult(outcome);
  layer.classList.add('show-result');

  await waitForGachaAnimationDismiss(layer);

  layer.classList.remove('show-result');
  layer.classList.remove('is-active');
  layer.setAttribute('aria-hidden', 'true');
  layer.hidden = true;
  if (stars) {
    stars.innerHTML = '';
  }
  if (warp) {
    if (gachaWarpColorTimeout) {
      clearTimeout(gachaWarpColorTimeout);
      gachaWarpColorTimeout = null;
    }
    const previousClasses = [warp.dataset.activeRarityClass, warp.dataset.baseRarityClass];
    previousClasses.forEach(cls => {
      if (cls) {
        warp.classList.remove(cls);
      }
    });
    delete warp.dataset.activeRarityClass;
    delete warp.dataset.baseRarityClass;
  }
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

function computeTicketStarDelay() {
  const average = Math.max(1000, TICKET_STAR_CONFIG.averageSpawnIntervalMs);
  const jitter = 0.5 + Math.random();
  return average * jitter;
}

const ticketStarState = {
  element: null,
  active: false,
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  width: 0,
  height: 0,
  nextSpawnTime: performance.now() + computeTicketStarDelay()
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
    return;
  }
  const layer = elements.ticketLayer;
  const width = layer.clientWidth;
  const height = layer.clientHeight;
  if (width <= 0 || height <= 0) {
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
}

let toastElement = null;

const CLICK_WINDOW_MS = CONFIG.presentation?.clicks?.windowMs ?? 1000;
const MAX_CLICKS_PER_SECOND = CONFIG.presentation?.clicks?.maxClicksPerSecond ?? 20;
const clickHistory = [];
let targetClickStrength = 0;
let displayedClickStrength = 0;

const atomAnimationState = {
  drive: 0,
  velocity: 0,
  twist: 0,
  twistVelocity: 0,
  swirlPhase: Math.random() * Math.PI * 2,
  jitterPhase: Math.random() * Math.PI * 2,
  lastTime: null
};

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

function easeOutCubic(value) {
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  const inv = 1 - value;
  return 1 - inv * inv * inv;
}

function updateAtomSpring(now = performance.now(), drive = 0) {
  if (!elements.atomVisual) return;
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

  const clampedDrive = Math.max(0, Math.min(1, drive));
  const easedDrive = easeOutCubic(clampedDrive);
  const target = Math.min(1.35, easedDrive * 0.55 + clampedDrive * 0.9);

  const springK = 32;
  const springDamping = 12.5;
  const displacement = state.drive - target;
  const accel = (-springK * displacement) - (springDamping * state.velocity);

  state.velocity += accel * delta;
  state.drive += state.velocity * delta;

  if (!Number.isFinite(state.drive)) state.drive = 0;
  if (!Number.isFinite(state.velocity)) state.velocity = 0;

  if (state.drive < 0) {
    state.drive = 0;
    if (state.velocity < 0) {
      state.velocity = 0;
    }
  } else if (state.drive > 1.8) {
    state.drive = 1.8;
  }

  const energyFromVelocity = Math.min(0.95, Math.abs(state.velocity) * 0.22);
  const energy = Math.min(1.5, Math.max(target, state.drive + energyFromVelocity));

  state.swirlPhase += delta * (5 + 20 * Math.pow(energy, 0.9));
  state.jitterPhase += delta * (16 + 42 * Math.pow(energy, 1.1));

  if (!Number.isFinite(state.swirlPhase)) state.swirlPhase = 0;
  if (!Number.isFinite(state.jitterPhase)) state.jitterPhase = 0;
  if (state.swirlPhase > Math.PI * 1000) state.swirlPhase %= Math.PI * 2;
  if (state.jitterPhase > Math.PI * 1000) state.jitterPhase %= Math.PI * 2;

  const rotationTarget = state.velocity * 0.65;
  const twistK = 24;
  const twistDamping = 9.5;
  const twistDisplacement = state.twist - rotationTarget;
  const twistAccel = (-twistK * twistDisplacement) - (twistDamping * state.twistVelocity);
  state.twistVelocity += twistAccel * delta;
  state.twist += state.twistVelocity * delta;

  if (!Number.isFinite(state.twist)) state.twist = 0;
  if (!Number.isFinite(state.twistVelocity)) state.twistVelocity = 0;
  state.twist = Math.max(-1.3, Math.min(1.3, state.twist));

  const swirlRadius = 6 + Math.pow(energy, 1.3) * 32;
  const jitterX = Math.sin(state.jitterPhase * 1.7) * (4 + energy * 12);
  const jitterY = Math.cos(state.jitterPhase * 2.3) * (5 + energy * 16);
  const offsetX = Math.cos(state.swirlPhase) * swirlRadius + jitterX;
  const offsetY = Math.sin(state.swirlPhase * 1.35 + 0.4) * (swirlRadius * (0.7 + energy * 0.25)) + jitterY;

  const rotationFromTwist = state.twist * (18 + energy * 34);
  const rotationNoise = Math.sin(state.swirlPhase * 2.2) * (4 + energy * 12);
  const rotation = rotationFromTwist + rotationNoise;

  const velocitySquash = Math.max(-0.85, Math.min(0.85, state.velocity * 0.9));
  const jitterSquash = Math.sin(state.jitterPhase * 2.8) * energy * 0.25;
  let scaleY = 1 + velocitySquash * 0.7 + jitterSquash;
  let scaleX = 1 - velocitySquash * 0.5 - jitterSquash * 0.85;

  scaleX = Math.min(1.55, Math.max(0.55, scaleX));
  scaleY = Math.min(1.55, Math.max(0.55, scaleY));

  const visual = elements.atomVisual;
  visual.style.setProperty('--shake-x', `${offsetX.toFixed(2)}px`);
  visual.style.setProperty('--shake-y', `${offsetY.toFixed(2)}px`);
  visual.style.setProperty('--shake-rot', `${rotation.toFixed(2)}deg`);
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
  if (gameState.stats) {
    gameState.stats.session.manualClicks += 1;
    gameState.stats.global.manualClicks += 1;
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
  button.classList.add('is-pressed');
  if (critical) {
    soundEffects.crit.play();
    button.classList.add('is-critical');
    showCriticalIndicator(multiplier);
    clearTimeout(animateAtomPress.criticalTimeout);
    animateAtomPress.criticalTimeout = setTimeout(() => {
      button.classList.remove('is-critical');
    }, 280);
  }
  clearTimeout(animateAtomPress.timeout);
  animateAtomPress.timeout = setTimeout(() => {
    button.classList.remove('is-pressed');
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

  const addClickElementFlat = (value, { id, label }) => {
    if (value == null) return;
    const layeredValue = value instanceof LayeredNumber ? value.clone() : new LayeredNumber(value);
    if (layeredValue.isZero()) return;
    clickElementAddition = clickElementAddition.add(layeredValue);
    clickDetails.additions.push({
      id,
      label,
      value: layeredValue.clone(),
      source: 'elements'
    });
  };

  const addAutoElementFlat = (value, { id, label }) => {
    if (value == null) return;
    const layeredValue = value instanceof LayeredNumber ? value.clone() : new LayeredNumber(value);
    if (layeredValue.isZero()) return;
    autoElementAddition = autoElementAddition.add(layeredValue);
    autoDetails.additions.push({
      id,
      label,
      value: layeredValue.clone(),
      source: 'elements'
    });
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

    if (copyCount > 0 && groupConfig.perCopy) {
      const { clickAdd, autoAdd, minCopies = 0, minUnique = 0 } = groupConfig.perCopy;
      const meetsCopyRequirement = copyCount >= Math.max(1, minCopies);
      const meetsUniqueRequirement = uniqueCount >= Math.max(0, minUnique);
      if (meetsCopyRequirement && meetsUniqueRequirement && clickAdd) {
        addClickElementFlat(clickAdd * copyCount, {
          id: `elements:${rarityId}:copies`,
          label: copyLabel
        });
      }
      if (meetsCopyRequirement && meetsUniqueRequirement && autoAdd) {
        addAutoElementFlat(autoAdd * copyCount, {
          id: `elements:${rarityId}:copies`,
          label: copyLabel
        });
      }
    }

    if (uniqueCount > 0 && groupConfig.setBonus) {
      const {
        clickAdd,
        autoAdd,
        minCopies = 0,
        minUnique = 0,
        requireAllUnique = false
      } = groupConfig.setBonus;
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
      if (meetsCopyRequirement && meetsUniqueRequirement) {
        if (clickAdd) {
          addClickElementFlat(clickAdd, {
            id: `elements:${rarityId}:groupFlat`,
            label: setBonusLabel
          });
        }
        if (autoAdd) {
          addAutoElementFlat(autoAdd, {
            id: `elements:${rarityId}:groupFlat`,
            label: setBonusLabel
          });
        }
      }
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
      if (targets.has('perClick')) {
        clickRarityMultipliers.set(rarityId, finalMultiplier);
        updateRarityMultiplierDetail(clickDetails.multipliers, multiplierDetailId, multiplierLabelResolved, finalMultiplier);
      }
      if (targets.has('perSecond')) {
        autoRarityMultipliers.set(rarityId, finalMultiplier);
        updateRarityMultiplierDetail(autoDetails.multipliers, multiplierDetailId, multiplierLabelResolved, finalMultiplier);
      }
    }

    if (groupConfig.crit) {
      if (groupConfig.crit.perUnique) {
        applyRepeatedCritEffect(critAccumulator, groupConfig.crit.perUnique, uniqueCount);
      }
      if (groupConfig.crit.perDuplicate) {
        applyRepeatedCritEffect(critAccumulator, groupConfig.crit.perDuplicate, duplicateCount);
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
          if (targets.has('perClick')) {
            const current = Number(clickRarityMultipliers.get(rarityId)) || 1;
            const updated = Math.max(0, current + amount);
            clickRarityMultipliers.set(rarityId, updated);
            updateRarityMultiplierDetail(clickDetails.multipliers, multiplierDetailId, resolvedLabel, updated);
          }
          if (targets.has('perSecond')) {
            const current = Number(autoRarityMultipliers.get(rarityId)) || 1;
            const updated = Math.max(0, current + amount);
            autoRarityMultipliers.set(rarityId, updated);
            updateRarityMultiplierDetail(autoDetails.multipliers, multiplierDetailId, resolvedLabel, updated);
          }
        }
      }
    }
  });

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
        frenzyTriggers: {
          perClick: stats.global.frenzyTriggers?.perClick || 0,
          perSecond: stats.global.frenzyTriggers?.perSecond || 0,
          total: stats.global.frenzyTriggers?.total || 0
        }
      }
    },
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
    elements: createInitialElementCollection(),
    theme: DEFAULT_THEME,
    stats: createInitialStats(),
    production: createEmptyProductionBreakdown(),
    productionBase: createEmptyProductionBreakdown(),
    crit: createDefaultCritState(),
    baseCrit: createDefaultCritState(),
    lastCritical: null,
    trophies: new Set()
  });
  resetFrenzyState({ skipApply: true });
  resetTicketStarState({ reschedule: true });
  applyTheme(DEFAULT_THEME);
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
    gameState.stats = parseStats(data.stats);
    gameState.trophies = new Set(Array.isArray(data.trophies) ? data.trophies : []);
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
recalcProduction();
renderShop();
renderGoals();
updateUI();
initStarfield();
requestAnimationFrame(loop);
