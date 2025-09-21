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

// Game state management
const DEFAULT_STATE = {
  atoms: LayeredNumber.zero(),
  lifetime: LayeredNumber.zero(),
  perClick: BASE_PER_CLICK.clone(),
  perSecond: BASE_PER_SECOND.clone(),
  upgrades: {},
  lastSave: Date.now(),
  theme: DEFAULT_THEME
};

const gameState = {
  atoms: LayeredNumber.zero(),
  lifetime: LayeredNumber.zero(),
  perClick: BASE_PER_CLICK.clone(),
  perSecond: BASE_PER_SECOND.clone(),
  upgrades: {},
  theme: DEFAULT_THEME
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
  nextMilestone: document.getElementById('nextMilestone'),
  themeSelect: document.getElementById('themeSelect'),
  saveButton: document.getElementById('saveButton'),
  resetButton: document.getElementById('resetButton')
};

const shopRows = new Map();

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

if (elements.atomButton) {
  elements.atomButton.addEventListener('click', event => {
    event.stopPropagation();
    handleManualAtomClick();
  });
  elements.atomButton.addEventListener('dragstart', event => {
    event.preventDefault();
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
}

function computeUpgradeCost(def) {
  const level = gameState.upgrades[def.id] || 0;
  const costValue = def.baseCost * Math.pow(def.costScale, level);
  return new LayeredNumber(costValue);
}

function recalcProduction() {
  const clickBase = BASE_PER_CLICK.clone();
  const autoBase = BASE_PER_SECOND.clone();
  let clickAdd = 0;
  let autoAdd = 0;
  let clickMult = 1;
  let autoMult = 1;

  UPGRADE_DEFS.forEach(def => {
    const level = gameState.upgrades[def.id] || 0;
    if (!level) return;
    const effects = def.effect(level);
    if (effects.clickAdd) clickAdd += effects.clickAdd;
    if (effects.autoAdd) autoAdd += effects.autoAdd;
    if (effects.clickMult) clickMult *= effects.clickMult;
    if (effects.autoMult) autoMult *= effects.autoMult;
  });

  let perClick = clickBase.addNumber(clickAdd).multiplyNumber(clickMult);
  if (perClick.compare(LayeredNumber.zero()) < 0) perClick = LayeredNumber.zero();
  let perSecond = autoBase.addNumber(autoAdd).multiplyNumber(autoMult);
  gameState.perClick = perClick;
  gameState.perSecond = perSecond;
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
  updateShopAffordability();
  updateMilestone();
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

elements.saveButton.addEventListener('click', () => {
  saveGame();
  showToast('Sauvegarde manuelle effectuée');
});

elements.resetButton.addEventListener('click', () => {
  if (confirm('Réinitialiser la progression ? Cette action est irréversible.')) {
    resetGame();
    showToast('Progression réinitialisée');
  }
});

function serializeState() {
  return {
    atoms: gameState.atoms.toJSON(),
    lifetime: gameState.lifetime.toJSON(),
    perClick: gameState.perClick.toJSON(),
    perSecond: gameState.perSecond.toJSON(),
    upgrades: gameState.upgrades,
    theme: gameState.theme,
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
    theme: DEFAULT_THEME
  });
  applyTheme(DEFAULT_THEME);
  renderShop();
  updateUI();
  saveGame();
}

function loadGame() {
  try {
    const raw = localStorage.getItem('atom2univers');
    if (!raw) {
      gameState.theme = DEFAULT_THEME;
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

function loop(now) {
  const delta = Math.max(0, (now - lastUpdate) / 1000);
  lastUpdate = now;

  if (!gameState.perSecond.isZero()) {
    const gain = gameState.perSecond.multiplyNumber(delta);
    gainAtoms(gain);
  }

  updateClickVisuals(now);

  if (now - lastUIUpdate > 250) {
    updateUI();
    lastUIUpdate = now;
  }

  if (now - lastSaveTime > 30000) {
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
