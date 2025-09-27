(() => {
  const ARCADE_TICKET_REWARD = 1;
  const GRID_COLS = 14;
  const GRID_ROWS = 6;
  const MAX_LIVES = 3;
  const BRICK_TYPES = Object.freeze({
    SIMPLE: 'simple',
    RESISTANT: 'resistant',
    BONUS: 'bonus',
    GRAVITON: 'graviton'
  });
  const POWER_UP_IDS = Object.freeze({
    EXTEND: 'extend',
    MULTIBALL: 'multiball',
    LASER: 'laser',
    SPEED: 'speed',
    FLOOR: 'floor'
  });
  const COMBO_REQUIRED_COLORS = ['red', 'green', 'blue'];
  const BRICK_SCORE_VALUE = {
    [BRICK_TYPES.SIMPLE]: 120,
    [BRICK_TYPES.RESISTANT]: 200,
    [BRICK_TYPES.BONUS]: 160,
    [BRICK_TYPES.GRAVITON]: 420
  };
  const GRAVITON_LIFETIME_MS = 10000;
  const POWER_UP_FALL_SPEED_RATIO = 0.00042;
  const LASER_SPEED_RATIO = -0.0026;
  const LASER_INTERVAL_MS = 420;
  const PADDLE_STRETCH_DURATION_MS = 620;
  const PADDLE_BOUNCE_DURATION_MS = 260;

  const createCubicBezierEasing = (p1x, p1y, p2x, p2y) => {
    const cx = 3 * p1x;
    const bx = 3 * (p2x - p1x) - cx;
    const ax = 1 - cx - bx;
    const cy = 3 * p1y;
    const by = 3 * (p2y - p1y) - cy;
    const ay = 1 - cy - by;
    const sampleCurveX = t => ((ax * t + bx) * t + cx) * t;
    const sampleCurveY = t => ((ay * t + by) * t + cy) * t;
    const sampleDerivativeX = t => (3 * ax * t + 2 * bx) * t + cx;
    const solveCurveX = x => {
      let t2 = x;
      for (let i = 0; i < 8; i += 1) {
        const x2 = sampleCurveX(t2) - x;
        if (Math.abs(x2) < 1e-6) {
          return t2;
        }
        const d2 = sampleDerivativeX(t2);
        if (Math.abs(d2) < 1e-6) {
          break;
        }
        t2 -= x2 / d2;
      }
      let t0 = 0;
      let t1 = 1;
      t2 = x;
      for (let i = 0; i < 8; i += 1) {
        const x2 = sampleCurveX(t2);
        if (Math.abs(x2 - x) < 1e-6) {
          return t2;
        }
        if (x > x2) {
          t0 = t2;
        } else {
          t1 = t2;
        }
        t2 = (t0 + t1) / 2;
      }
      return t2;
    };
    return progress => {
      if (progress <= 0) return 0;
      if (progress >= 1) return 1;
      const parameter = solveCurveX(progress);
      return sampleCurveY(parameter);
    };
  };

  const PADDLE_STRETCH_EASING = createCubicBezierEasing(0.34, 1.56, 0.64, 1);

  const defaultTicketFormatter = value => {
    const numeric = Math.max(0, Math.floor(Number(value) || 0));
    const unit = numeric === 1 ? 'ticket' : 'tickets';
    return `${numeric.toLocaleString('fr-FR')} ${unit}`;
  };

  const defaultBonusTicketFormatter = value => {
    const numeric = Math.max(0, Math.floor(Number(value) || 0));
    const unit = numeric === 1 ? 'ticket Bonus Particules' : 'tickets Bonus Particules';
    return `${numeric.toLocaleString('fr-FR')} ${unit}`;
  };

  const randomChoice = list => (Array.isArray(list) && list.length > 0
    ? list[Math.floor(Math.random() * list.length)]
    : null);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const SIMPLE_PARTICLES = [
    {
      id: 'quarkRed',
      family: 'quark',
      quarkColor: 'red',
      colors: ['#ff4d6a', '#ff859b'],
      symbol: 'qᵣ',
      symbolColor: '#fff'
    },
    {
      id: 'quarkGreen',
      family: 'quark',
      quarkColor: 'green',
      colors: ['#45c77b', '#7ae0a4'],
      symbol: 'qᵍ',
      symbolColor: '#08291a'
    },
    {
      id: 'quarkBlue',
      family: 'quark',
      quarkColor: 'blue',
      colors: ['#4f7bff', '#87a7ff'],
      symbol: 'qᵇ',
      symbolColor: '#0c163a'
    },
    {
      id: 'electron',
      family: 'lepton',
      colors: ['#dadfea', '#f5f6fb'],
      symbol: 'e⁻',
      symbolColor: '#1c2136'
    },
    {
      id: 'muon',
      family: 'lepton',
      colors: ['#cbbdfd', '#e6deff'],
      symbol: 'μ',
      symbolColor: '#2c1446'
    },
    {
      id: 'neutrino',
      family: 'lepton',
      colors: ['#bfc5cc', '#e0e4e8'],
      symbol: 'ν',
      symbolColor: '#222733'
    }
  ];

  const RESISTANT_PARTICLES = [
    {
      id: 'photon',
      family: 'boson',
      colors: ['#ffd447', '#ffb347'],
      symbol: 'γ',
      symbolColor: '#3e2500',
      minHits: 2,
      maxHits: 2
    },
    {
      id: 'gluon',
      family: 'boson',
      colors: ['#14151c', '#2c2e36'],
      symbol: 'g',
      symbolColor: '#9fa5ff',
      minHits: 3,
      maxHits: 3
    },
    {
      id: 'wz',
      family: 'boson',
      colors: ['#a874ff', '#7c4dff'],
      symbol: 'w/z',
      symbolColor: '#f6f1ff',
      symbolScale: 0.85,
      minHits: 2,
      maxHits: 3
    },
    {
      id: 'higgs',
      family: 'boson',
      colors: ['#ffe680', '#f7c948'],
      symbol: 'H⁰',
      symbolColor: '#4d3100',
      minHits: 3,
      maxHits: 3
    }
  ];

  const BONUS_PARTICLES = [
    {
      id: 'positron',
      family: 'lepton',
      colors: ['#f6f6ff', '#dcdcf9'],
      symbol: 'e⁺',
      symbolColor: '#312a5c'
    },
    {
      id: 'tau',
      family: 'lepton',
      colors: ['#b89bff', '#d9c9ff'],
      symbol: 'τ',
      symbolColor: '#1f0b45'
    },
    {
      id: 'sterileNeutrino',
      family: 'lepton',
      colors: ['#c3c7d4', '#eff1f6'],
      symbol: 'νₛ',
      symbolColor: '#1f2535'
    }
  ];

  const GRAVITON_PARTICLE = {
    id: 'graviton',
    family: 'graviton',
    colors: ['#ff6ec7', '#7afcff', '#ffe45e', '#9d4edd'],
    symbol: 'G*',
    symbolColor: '#ffffff'
  };

  const POWER_UP_LABELS = {
    [POWER_UP_IDS.EXTEND]: 'Barre allongée',
    [POWER_UP_IDS.MULTIBALL]: 'Multiballe',
    [POWER_UP_IDS.LASER]: 'Tir laser',
    [POWER_UP_IDS.SPEED]: 'Accélération',
    [POWER_UP_IDS.FLOOR]: 'Bouclier inférieur'
  };

  const DEFAULT_POWER_UP_VISUAL = {
    symbol: 'P',
    gradient: ['#ffffff', '#a6d8ff'],
    textColor: '#041022',
    glow: 'rgba(140, 210, 255, 0.45)',
    border: 'rgba(255, 255, 255, 0.5)',
    widthMultiplier: 1.45
  };

  const POWER_UP_VISUALS = {
    [POWER_UP_IDS.EXTEND]: {
      symbol: 'L',
      gradient: ['#66f4ff', '#2c9cff'],
      textColor: '#041222',
      glow: 'rgba(110, 220, 255, 0.55)',
      border: 'rgba(255, 255, 255, 0.65)',
      widthMultiplier: 1.5
    },
    [POWER_UP_IDS.MULTIBALL]: {
      symbol: 'M',
      gradient: ['#ffe066', '#ff7b6b'],
      textColor: '#241104',
      glow: 'rgba(255, 160, 110, 0.55)',
      border: 'rgba(255, 255, 255, 0.6)',
      widthMultiplier: 1.6
    },
    [POWER_UP_IDS.LASER]: {
      symbol: 'T',
      gradient: ['#ff96c7', '#ff4d9a'],
      textColor: '#36001a',
      glow: 'rgba(255, 120, 190, 0.55)',
      border: 'rgba(255, 255, 255, 0.55)',
      widthMultiplier: 1.45
    },
    [POWER_UP_IDS.SPEED]: {
      symbol: 'S',
      gradient: ['#9d7bff', '#4f3bff'],
      textColor: '#1a083a',
      glow: 'rgba(160, 140, 255, 0.52)',
      border: 'rgba(255, 255, 255, 0.55)',
      widthMultiplier: 1.45
    },
    [POWER_UP_IDS.FLOOR]: {
      symbol: 'F',
      gradient: ['#6ef7a6', '#1ec37a'],
      textColor: '#052615',
      glow: 'rgba(90, 240, 180, 0.55)',
      border: 'rgba(255, 255, 255, 0.55)',
      widthMultiplier: 1.55
    }
  };

  const POWER_UP_PULSE_INTENSITY = {
    [POWER_UP_IDS.MULTIBALL]: 1.06,
    [POWER_UP_IDS.EXTEND]: 1.04,
    [POWER_UP_IDS.FLOOR]: 1.05
  };

  const POWER_UP_EFFECTS = {
    [POWER_UP_IDS.EXTEND]: { duration: 12000 },
    [POWER_UP_IDS.LASER]: { duration: 9000 },
    [POWER_UP_IDS.SPEED]: { duration: 8000 },
    [POWER_UP_IDS.FLOOR]: { duration: 10000 }
  };

  const COMBO_POWER_UPS = [
    POWER_UP_IDS.LASER,
    POWER_UP_IDS.EXTEND,
    POWER_UP_IDS.MULTIBALL
  ];

  class ParticulesGame {
    constructor(options = {}) {
      const {
        canvas,
        overlay,
        overlayButton,
        overlayMessage,
        particleLayer,
        levelLabel,
        livesLabel,
        scoreLabel,
        comboLabel,
        onTicketsEarned,
        onSpecialTicket,
        formatTicketLabel,
        formatBonusTicketLabel
      } = options;

      this.canvas = canvas;
      this.overlay = overlay;
      this.overlayButton = overlayButton;
      this.overlayMessage = overlayMessage;
      const hasHTMLElement = typeof HTMLElement !== 'undefined';
      this.particleLayer = hasHTMLElement && particleLayer instanceof HTMLElement ? particleLayer : null;
      this.comboLabel = comboLabel;
      this.stage = hasHTMLElement && canvas instanceof HTMLElement
        ? canvas.closest('.arcade-stage')
        : null;
      [levelLabel, livesLabel, scoreLabel].forEach(label => {
        const container = typeof label?.closest === 'function'
          ? label.closest('.arcade-hud__item')
          : null;
        if (container) {
          container.hidden = true;
          container.setAttribute('aria-hidden', 'true');
        }
      });
      this.levelLabel = null;
      this.livesLabel = null;
      this.scoreLabel = null;
      this.onTicketsEarned = typeof onTicketsEarned === 'function' ? onTicketsEarned : null;
      this.onSpecialTicket = typeof onSpecialTicket === 'function' ? onSpecialTicket : null;
      this.formatTicketLabel = typeof formatTicketLabel === 'function' ? formatTicketLabel : defaultTicketFormatter;
      this.formatBonusTicketLabel = typeof formatBonusTicketLabel === 'function'
        ? formatBonusTicketLabel
        : defaultBonusTicketFormatter;

      if (!this.canvas || !this.canvas.getContext) {
        this.enabled = false;
        return;
      }

      const context = this.canvas.getContext('2d');
      if (!context) {
        this.enabled = false;
        return;
      }

      this.ctx = context;
      this.enabled = true;
      this.gridCols = GRID_COLS;
      this.gridRows = GRID_ROWS;
      this.maxLives = MAX_LIVES;
      this.level = 1;
      this.lives = this.maxLives;
      this.score = 0;
      this.ticketsEarned = 0;
      this.specialTicketsEarned = 0;
      this.pendingLevelAdvance = false;
      this.pointerActive = false;
      this.pendingResume = false;
      this.running = false;
      this.lastTimestamp = 0;
      this.animationFrameId = null;
      this.width = 0;
      this.height = 0;
      this.pixelRatio = 1;
      this.effects = new Map();
      this.bricks = [];
      this.powerUps = [];
      this.lasers = [];
      this.balls = [];
      this.ballIdCounter = 0;
      this.quarkComboColors = new Set();
      this.comboMessage = '';
      this.comboMessageExpiry = 0;
      this.ballSpeedMultiplier = 1;
      this.gravitonLifetimeMs = GRAVITON_LIFETIME_MS;
      this.paddleStretchAnimation = null;
      this.paddleBounceAnimation = null;
      this.comboChainCount = 0;
      this.lastBrickDestroyedAt = 0;
      this.stagePulseTimeout = null;

      this.paddle = {
        baseWidthRatio: 0.18,
        currentWidthRatio: 0.18,
        minWidthRatio: 0.12,
        heightRatio: 0.025,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xRatio: 0.5
      };

      this.ballSettings = {
        radiusRatio: 0.015,
        baseSpeedRatio: 1.9,
        speedGrowthRatio: 0.15
      };

      this.handleFrame = this.handleFrame.bind(this);
      this.handlePointerDown = this.handlePointerDown.bind(this);
      this.handlePointerMove = this.handlePointerMove.bind(this);
      this.handlePointerUp = this.handlePointerUp.bind(this);
      this.handleOverlayButtonClick = this.handleOverlayButtonClick.bind(this);
      this.handleResize = this.handleResize.bind(this);

      this.canvas.addEventListener('pointerdown', this.handlePointerDown);
      this.canvas.addEventListener('pointermove', this.handlePointerMove);
      this.canvas.addEventListener('pointerup', this.handlePointerUp);
      this.canvas.addEventListener('pointerleave', this.handlePointerUp);
      this.canvas.addEventListener('pointercancel', this.handlePointerUp);

      if (this.overlayButton) {
        this.overlayButton.addEventListener('click', this.handleOverlayButtonClick);
      }

      if (typeof window !== 'undefined') {
        window.addEventListener('resize', this.handleResize);
      }

      this.handleResize();
      this.setupLevel();
      this.showOverlay({
        message:
          (this.overlayMessage?.textContent || '').trim()
          || 'Touchez ou cliquez la raquette pour guider la particule et détruire les briques quantiques.',
        buttonLabel: 'Commencer',
        action: 'start'
      });
    }

    dispose() {
      if (!this.enabled) return;
      this.stopAnimation();
      this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
      this.canvas.removeEventListener('pointermove', this.handlePointerMove);
      this.canvas.removeEventListener('pointerup', this.handlePointerUp);
      this.canvas.removeEventListener('pointerleave', this.handlePointerUp);
      this.canvas.removeEventListener('pointercancel', this.handlePointerUp);
      if (this.overlayButton) {
        this.overlayButton.removeEventListener('click', this.handleOverlayButtonClick);
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.handleResize);
      }
      if (this.stagePulseTimeout) {
        clearTimeout(this.stagePulseTimeout);
        this.stagePulseTimeout = null;
      }
      this.paddleBounceAnimation = null;
      if (this.stage && typeof this.stage.classList?.remove === 'function') {
        this.stage.classList.remove('arcade-stage--pulse');
      }
      this.clearImpactParticles();
      this.enabled = false;
    }

    handleResize() {
      if (!this.enabled) return;
      const rect = this.canvas.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
      const targetWidth = Math.round(width * dpr);
      const targetHeight = Math.round(height * dpr);
      if (this.canvas.width !== targetWidth || this.canvas.height !== targetHeight) {
        this.canvas.width = targetWidth;
        this.canvas.height = targetHeight;
      }
      this.width = targetWidth;
      this.height = targetHeight;
      this.pixelRatio = dpr;
      this.updatePaddleSize();
      this.updateBallRadius();
      this.balls.forEach(ball => {
        ball.radius = this.ballRadius;
        if (ball.attachedToPaddle) {
          this.updateBallFollowingPaddle(ball);
        }
      });
      this.updateHud();
      this.render();
    }

    updatePaddleSize() {
      const ratio = Math.max(this.paddle.minWidthRatio, this.paddle.currentWidthRatio);
      this.paddle.width = Math.max(40, ratio * this.width);
      this.paddle.height = Math.max(10, this.paddle.heightRatio * this.height);
      this.paddle.y = this.height - this.paddle.height * 3;
      this.paddle.x = clamp(this.paddle.xRatio * this.width - this.paddle.width / 2, 0, Math.max(0, this.width - this.paddle.width));
    }

    triggerPaddleStretchAnimation(previousWidth, newWidth) {
      const nextWidth = Number.isFinite(newWidth) ? newWidth : 0;
      const priorWidth = Number.isFinite(previousWidth) ? previousWidth : 0;
      if (nextWidth <= 0 || priorWidth <= 0 || Math.abs(nextWidth - priorWidth) < 0.5) {
        return;
      }
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const fromScale = clamp(priorWidth / nextWidth, 0, 1.6);
      this.paddleStretchAnimation = {
        start: now,
        duration: PADDLE_STRETCH_DURATION_MS,
        from: fromScale,
        to: 1
      };
      if (nextWidth > priorWidth) {
        const growthRatio = clamp((nextWidth - priorWidth) / Math.max(priorWidth, 1), 0.2, 1.6);
        this.triggerPaddleBounce(0.8 + growthRatio * 0.6);
      }
      this.startAnimation();
    }

    getPaddleStretchScale(renderTimestamp) {
      const state = this.paddleStretchAnimation;
      if (!state) {
        return 1;
      }
      const duration = state.duration > 0 ? state.duration : PADDLE_STRETCH_DURATION_MS;
      const elapsed = Number.isFinite(renderTimestamp) ? renderTimestamp - state.start : 0;
      if (!Number.isFinite(elapsed)) {
        return 1;
      }
      if (elapsed <= 0) {
        return state.from;
      }
      if (elapsed >= duration) {
        this.paddleStretchAnimation = null;
        return state.to;
      }
      const progress = clamp(elapsed / duration, 0, 1);
      const eased = PADDLE_STRETCH_EASING(progress);
      return state.from + (state.to - state.from) * eased;
    }

    triggerPaddleBounce(intensity = 1) {
      const paddleHeight = this.paddle?.height || 0;
      if (paddleHeight <= 0) {
        return;
      }
      const normalizedIntensity = clamp(intensity, 0.1, 2.2);
      const amplitude = clamp(paddleHeight * 0.28 * normalizedIntensity, 0, paddleHeight * 0.7);
      if (amplitude <= 0) {
        return;
      }
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const current = this.paddleBounceAnimation;
      const nextAmplitude = Math.max(amplitude, current?.amplitude || 0);
      this.paddleBounceAnimation = {
        start: now,
        duration: PADDLE_BOUNCE_DURATION_MS,
        amplitude: nextAmplitude
      };
      this.startAnimation();
    }

    getPaddleBounceOffset(renderTimestamp) {
      const state = this.paddleBounceAnimation;
      if (!state) {
        return 0;
      }
      const duration = state.duration > 0 ? state.duration : PADDLE_BOUNCE_DURATION_MS;
      const elapsed = Number.isFinite(renderTimestamp) ? renderTimestamp - state.start : 0;
      if (!Number.isFinite(elapsed) || elapsed < 0) {
        return 0;
      }
      if (elapsed >= duration) {
        this.paddleBounceAnimation = null;
        return 0;
      }
      const progress = clamp(elapsed / duration, 0, 1);
      const wave = Math.sin(progress * Math.PI);
      return state.amplitude * wave;
    }

    updateBallRadius() {
      this.ballRadius = Math.max(6, this.ballSettings.radiusRatio * Math.min(this.width, this.height));
    }

    setupLevel() {
      if (!this.enabled) return;
      this.pendingLevelAdvance = false;
      this.effects.clear();
      this.powerUps = [];
      this.lasers = [];
      this.balls = [];
      this.clearImpactParticles();
      this.quarkComboColors.clear();
      this.comboMessage = '';
      this.comboMessageExpiry = 0;
      this.ballSpeedMultiplier = 1;
      this.paddleBounceAnimation = null;
      this.lives = this.maxLives;
      this.bricks = this.generateBricks();
      this.resetComboChain();
      this.prepareServe();
      this.updateHud();
      this.render();
    }

    resetComboChain() {
      this.comboChainCount = 0;
      this.lastBrickDestroyedAt = 0;
    }

    clearImpactParticles() {
      if (!this.particleLayer) return;
      while (this.particleLayer.firstChild) {
        this.particleLayer.removeChild(this.particleLayer.firstChild);
      }
    }

    generateBricks() {
      const geometry = this.getGridGeometry();
      const pattern = this.pickLevelPattern();
      const generators = {
        organic: () => this.generateOrganicLayout(geometry),
        singleGap: () => this.generateSingleGapLayout(geometry),
        multiGap: () => this.generateMultiGapLayout(geometry),
        singleBrick: () => this.generateSingleBrickLayout(geometry),
        singleLine: () => this.generateSingleLineLayout(geometry),
        bottomUniform: () => this.generateBottomUniformLayout(geometry),
        uniformLines: () => this.generateUniformLinesLayout(geometry),
        checkerboard: () => this.generateCheckerboardLayout(geometry),
        diagonals: () => this.generateDiagonalLayout(geometry)
      };
      const generator = generators[pattern] || generators.organic;
      const bricks = generator();
      this.ensureBonusDistribution(bricks, pattern);
      return this.maybeAddGraviton(bricks);
    }

    getGridGeometry() {
      const paddingX = 0.08;
      const paddingY = 0.04;
      const usableWidth = 1 - paddingX * 2;
      const usableHeight = 0.46;
      const brickWidth = usableWidth / this.gridCols;
      const brickHeight = usableHeight / this.gridRows;
      const innerWidthRatio = 0.92;
      const innerHeightRatio = 0.68;
      const horizontalOffset = (1 - innerWidthRatio) / 2;
      const verticalOffset = (1 - innerHeightRatio) / 2;
      return {
        paddingX,
        paddingY,
        brickWidth,
        brickHeight,
        innerWidthRatio,
        innerHeightRatio,
        horizontalOffset,
        verticalOffset
      };
    }

    getCellPosition(row, col, geometry) {
      const {
        paddingX,
        paddingY,
        brickWidth,
        brickHeight,
        innerWidthRatio,
        innerHeightRatio,
        horizontalOffset,
        verticalOffset
      } = geometry;
      return {
        row,
        col,
        relX: paddingX + col * brickWidth + brickWidth * horizontalOffset,
        relY: paddingY + row * brickHeight + brickHeight * verticalOffset,
        relWidth: brickWidth * innerWidthRatio,
        relHeight: brickHeight * innerHeightRatio
      };
    }

    placeBrick(bricks, row, col, geometry, type = null, particle = null) {
      const brickType = type || this.pickBrickType();
      const brickParticle = particle || this.pickParticle(brickType);
      bricks.push(this.createBrick({
        ...this.getCellPosition(row, col, geometry),
        type: brickType,
        particle: brickParticle
      }));
    }

    ensureBonusDistribution(bricks, pattern) {
      if (!Array.isArray(bricks) || bricks.length === 0) {
        return bricks;
      }
      const eligible = bricks.filter(brick => brick.type !== BRICK_TYPES.GRAVITON);
      if (eligible.length === 0) {
        return bricks;
      }
      const existingBonus = eligible.filter(brick => brick.type === BRICK_TYPES.BONUS).length;
      const patternBoost = ['singleLine', 'uniformLines', 'diagonals'].includes(pattern) ? 0.32 : 0.22;
      const desiredRatio = clamp(patternBoost + (this.level - 1) * 0.01, 0.18, 0.42);
      const desiredCount = Math.max(1, Math.round(eligible.length * desiredRatio));
      if (existingBonus >= desiredCount) {
        return bricks;
      }
      const candidates = eligible
        .filter(brick => brick.type !== BRICK_TYPES.BONUS)
        .sort(() => Math.random() - 0.5);
      const upgradesNeeded = Math.min(desiredCount - existingBonus, candidates.length);
      for (let index = 0; index < upgradesNeeded; index += 1) {
        const target = candidates[index];
        if (!target) continue;
        const bonusBrick = this.createBrick({
          row: target.row,
          col: target.col,
          relX: target.relX,
          relY: target.relY,
          relWidth: target.relWidth,
          relHeight: target.relHeight,
          type: BRICK_TYPES.BONUS,
          particle: this.pickParticle(BRICK_TYPES.BONUS)
        });
        Object.assign(target, bonusBrick);
      }
      return bricks;
    }

    pickLevelPattern() {
      const weights = [
        { id: 'organic', weight: 0.25 },
        { id: 'singleGap', weight: 0.10 },
        { id: 'multiGap', weight: 0.10 },
        { id: 'singleBrick', weight: 0.01 },
        { id: 'singleLine', weight: 0.10 },
        { id: 'bottomUniform', weight: 0.10 },
        { id: 'uniformLines', weight: 0.10 },
        { id: 'checkerboard', weight: 0.12 },
        { id: 'diagonals', weight: 0.12 }
      ];
      const total = weights.reduce((sum, entry) => sum + entry.weight, 0);
      const roll = Math.random() * total;
      let cumulative = 0;
      for (const entry of weights) {
        cumulative += entry.weight;
        if (roll <= cumulative) {
          return entry.id;
        }
      }
      return 'organic';
    }

    generateOrganicLayout(geometry) {
      const bricks = [];
      const baseFill = clamp(0.55 + (this.level - 1) * 0.02, 0.55, 0.82);
      for (let row = 0; row < this.gridRows; row += 1) {
        let rowHasBrick = false;
        const candidates = [];
        for (let col = 0; col < this.gridCols; col += 1) {
          const position = this.getCellPosition(row, col, geometry);
          const variability = (Math.random() - 0.5) * 0.12;
          const depthBias = clamp((row / Math.max(1, this.gridRows - 1)) * 0.18, 0, 0.18);
          const fillProbability = clamp(baseFill + depthBias + variability, 0.35, 0.92);
          if (Math.random() > fillProbability) {
            candidates.push(position);
            continue;
          }
          const type = this.pickBrickType();
          const particle = this.pickParticle(type);
          bricks.push(this.createBrick({ ...position, type, particle }));
          rowHasBrick = true;
        }
        if (!rowHasBrick && candidates.length > 0) {
          const forced = randomChoice(candidates);
          const type = this.pickBrickType();
          const particle = this.pickParticle(type);
          bricks.push(this.createBrick({ ...forced, type, particle }));
        }
      }
      return bricks;
    }

    generateSingleGapLayout(geometry) {
      const bricks = [];
      const removeRow = Math.random() < 0.5;
      const gapIndex = removeRow
        ? Math.floor(Math.random() * this.gridRows)
        : Math.floor(Math.random() * this.gridCols);
      for (let row = 0; row < this.gridRows; row += 1) {
        for (let col = 0; col < this.gridCols; col += 1) {
          if ((removeRow && row === gapIndex) || (!removeRow && col === gapIndex)) {
            continue;
          }
          this.placeBrick(bricks, row, col, geometry);
        }
      }
      return bricks;
    }

    generateMultiGapLayout(geometry) {
      const bricks = [];
      let removeRows = Math.random() < 0.75;
      let removeCols = Math.random() < 0.65;
      if (!removeRows && !removeCols) {
        removeRows = true;
      }
      const emptyRows = new Set();
      const emptyCols = new Set();
      if (removeRows) {
        const emptyRowCount = Math.max(2, Math.floor(Math.random() * Math.min(3, Math.max(2, this.gridRows - 1))) + 1);
        while (emptyRows.size < emptyRowCount) {
          emptyRows.add(Math.floor(Math.random() * this.gridRows));
        }
      }
      if (removeCols) {
        const emptyColCount = Math.max(2, Math.floor(Math.random() * Math.min(4, Math.max(2, this.gridCols - 1))) + 1);
        while (emptyCols.size < emptyColCount) {
          emptyCols.add(Math.floor(Math.random() * this.gridCols));
        }
      }
      for (let row = 0; row < this.gridRows; row += 1) {
        if (emptyRows.has(row)) continue;
        for (let col = 0; col < this.gridCols; col += 1) {
          if (emptyCols.has(col)) continue;
          this.placeBrick(bricks, row, col, geometry);
        }
      }
      if (bricks.length === 0) {
        this.placeBrick(bricks, 0, 0, geometry);
      }
      return bricks;
    }

    generateSingleBrickLayout(geometry) {
      const bricks = [];
      const row = Math.floor(Math.random() * this.gridRows);
      const col = Math.floor(Math.random() * this.gridCols);
      const particle = RESISTANT_PARTICLES.find(p => (p.minHits || 1) >= 3) || RESISTANT_PARTICLES[0];
      bricks.push(this.createBrick({
        ...this.getCellPosition(row, col, geometry),
        type: BRICK_TYPES.RESISTANT,
        particle
      }));
      return bricks;
    }

    generateSingleLineLayout(geometry) {
      const bricks = [];
      const horizontal = Math.random() < 0.5;
      if (horizontal) {
        const targetRow = Math.floor(Math.random() * this.gridRows);
        for (let col = 0; col < this.gridCols; col += 1) {
          this.placeBrick(bricks, targetRow, col, geometry, BRICK_TYPES.BONUS);
        }
      } else {
        const targetCol = Math.floor(Math.random() * this.gridCols);
        for (let row = 0; row < this.gridRows; row += 1) {
          this.placeBrick(bricks, row, targetCol, geometry, BRICK_TYPES.BONUS);
        }
      }
      return bricks;
    }

    generateBottomUniformLayout(geometry) {
      const bricks = this.generateOrganicLayout(geometry);
      const bottomRow = this.gridRows - 1;
      const type = this.pickBrickType();
      const particle = this.pickParticle(type);
      for (let col = 0; col < this.gridCols; col += 1) {
        const existingIndex = bricks.findIndex(brick => brick.row === bottomRow && brick.col === col);
        const brick = this.createBrick({
          ...this.getCellPosition(bottomRow, col, geometry),
          type,
          particle
        });
        if (existingIndex >= 0) {
          bricks[existingIndex] = brick;
        } else {
          bricks.push(brick);
        }
      }
      return bricks;
    }

    generateUniformLinesLayout(geometry) {
      const bricks = [];
      const type = BRICK_TYPES.BONUS;
      const uniformRows = Math.random() < 0.5 ? this.pickUniformRows() : [];
      const uniformCols = uniformRows.length > 0 ? [] : this.pickUniformCols();
      if (uniformRows.length === this.gridRows) {
        for (let row = 0; row < this.gridRows; row += 1) {
          for (let col = 0; col < this.gridCols; col += 1) {
            this.placeBrick(bricks, row, col, geometry, type);
          }
        }
        return bricks;
      }
      const fallbackType = this.pickBrickType();
      for (let row = 0; row < this.gridRows; row += 1) {
        for (let col = 0; col < this.gridCols; col += 1) {
          const isUniform = uniformRows.includes(row) || uniformCols.includes(col);
          if (isUniform) {
            this.placeBrick(bricks, row, col, geometry, type);
          } else if (Math.random() < 0.7) {
            this.placeBrick(bricks, row, col, geometry, fallbackType);
          }
        }
      }
      if (bricks.length === 0) {
        for (let col = 0; col < this.gridCols; col += 1) {
          this.placeBrick(bricks, 0, col, geometry, type);
        }
      }
      return bricks;
    }

    pickUniformRows() {
      if (Math.random() < 0.25) {
        return Array.from({ length: this.gridRows }, (_, index) => index);
      }
      const rowCount = Math.max(2, Math.floor(Math.random() * Math.max(2, this.gridRows - 1)) + 1);
      const rows = new Set();
      while (rows.size < rowCount) {
        rows.add(Math.floor(Math.random() * this.gridRows));
      }
      return [...rows];
    }

    pickUniformCols() {
      const colCount = Math.max(2, Math.floor(Math.random() * Math.max(2, this.gridCols - 1)) + 1);
      const cols = new Set();
      while (cols.size < colCount) {
        cols.add(Math.floor(Math.random() * this.gridCols));
      }
      return [...cols];
    }

    generateCheckerboardLayout(geometry) {
      const bricks = [];
      const type = this.pickBrickType();
      const particle = this.pickParticle(type);
      for (let row = 0; row < this.gridRows; row += 1) {
        for (let col = 0; col < this.gridCols; col += 1) {
          if ((row + col) % 2 === 0) {
            this.placeBrick(bricks, row, col, geometry, type, particle);
          } else if (Math.random() < 0.45) {
            this.placeBrick(bricks, row, col, geometry);
          }
        }
      }
      return bricks;
    }

    generateDiagonalLayout(geometry) {
      const bricks = [];
      const mainType = BRICK_TYPES.BONUS;
      for (let row = 0; row < this.gridRows; row += 1) {
        for (let col = 0; col < this.gridCols; col += 1) {
          const onMain = row === col;
          const onSecondary = row + col === this.gridCols - 1;
          if (onMain || onSecondary) {
            this.placeBrick(bricks, row, col, geometry, mainType);
          } else if (Math.random() < 0.4) {
            this.placeBrick(bricks, row, col, geometry);
          }
        }
      }
      return bricks;
    }

    maybeAddGraviton(bricks) {
      if (bricks.length <= 1) {
        return bricks;
      }
      const gravitonChance = clamp(0.05 + (this.level - 1) * 0.015, 0.05, 0.18);
      if (Math.random() >= gravitonChance) {
        return bricks;
      }
      const candidates = bricks.filter(brick => brick.row >= Math.floor(this.gridRows / 2));
      if (candidates.length === 0) {
        return bricks;
      }
      const target = randomChoice(candidates);
      if (!target) {
        return bricks;
      }
      const graviton = this.createBrick({
        row: target.row,
        col: target.col,
        relX: target.relX,
        relY: target.relY,
        relWidth: target.relWidth,
        relHeight: target.relHeight,
        type: BRICK_TYPES.GRAVITON,
        particle: GRAVITON_PARTICLE
      });
      graviton.hidden = true;
      const index = bricks.findIndex(brick => brick === target);
      if (index >= 0) {
        bricks[index] = graviton;
      }
      return bricks;
    }

    pickBrickType() {
      const levelFactor = clamp((this.level - 1) * 0.015, 0, 0.2);
      const weights = [
        { type: BRICK_TYPES.SIMPLE, weight: 0.6 - levelFactor * 0.25 },
        { type: BRICK_TYPES.RESISTANT, weight: 0.26 + levelFactor * 0.55 },
        { type: BRICK_TYPES.BONUS, weight: 0.14 + levelFactor * 0.2 }
      ];
      const total = weights.reduce((sum, entry) => sum + entry.weight, 0);
      const roll = Math.random() * total;
      let cumulative = 0;
      for (const entry of weights) {
        cumulative += entry.weight;
        if (roll <= cumulative) {
          return entry.type;
        }
      }
      return BRICK_TYPES.SIMPLE;
    }

    pickParticle(type) {
      if (type === BRICK_TYPES.RESISTANT) {
        return randomChoice(RESISTANT_PARTICLES);
      }
      if (type === BRICK_TYPES.BONUS) {
        return randomChoice(BONUS_PARTICLES);
      }
      if (type === BRICK_TYPES.GRAVITON) {
        return GRAVITON_PARTICLE;
      }
      return randomChoice(SIMPLE_PARTICLES);
    }

    createBrick({ row, col, relX, relY, relWidth, relHeight, type, particle }) {
      const maxHits = (() => {
        if (type === BRICK_TYPES.RESISTANT) {
          const minHits = Math.max(2, Math.floor(particle?.minHits || 2));
          const max = Math.max(minHits, Math.floor(particle?.maxHits || minHits));
          return Math.floor(Math.random() * (max - minHits + 1)) + minHits;
        }
        return 1;
      })();
      return {
        id: `${type}-${row}-${col}-${Math.random().toString(36).slice(2, 7)}`,
        type,
        particle,
        row,
        col,
        relX,
        relY,
        relWidth,
        relHeight,
        maxHits,
        hitsRemaining: maxHits,
        active: true,
        hidden: type === BRICK_TYPES.GRAVITON,
        revealedAt: 0,
        dissipated: false
      };
    }

    prepareServe() {
      this.resetComboChain();
      this.balls = [this.createBall({ attachToPaddle: true })];
    }

    createBall({ attachToPaddle = false, angle = null } = {}) {
      const radius = this.ballRadius || this.ballSettings.radiusRatio * Math.min(this.width, this.height);
      const paddleCenter = this.paddle.x + this.paddle.width / 2;
      const ball = {
        id: `ball-${this.ballIdCounter += 1}`,
        x: paddleCenter,
        y: this.paddle.y - radius * 1.6,
        vx: 0,
        vy: 0,
        radius,
        electricSeed: Math.random() * Math.PI * 2,
        attachedToPaddle: attachToPaddle,
        inPlay: !attachToPaddle,
        trail: [],
        lastGhostTime: 0
      };
      if (!attachToPaddle) {
        const launchAngle = typeof angle === 'number'
          ? angle
          : (-Math.PI / 2) * 0.75 + Math.random() * (Math.PI / 3);
        const speed = this.getBallSpeed();
        ball.vx = Math.cos(launchAngle) * speed;
        ball.vy = Math.sin(launchAngle) * speed;
      }
      return ball;
    }

    getBallSpeed() {
      const base = (this.width + this.height) / (2 * Math.max(this.pixelRatio, 0.5));
      const levelMultiplier = Math.pow(
        1 + this.ballSettings.speedGrowthRatio,
        Math.max(0, this.level - 1)
      );
      const ratio = this.ballSettings.baseSpeedRatio * levelMultiplier;
      const speedPerMillisecond = base * ratio * 0.0006 * this.ballSpeedMultiplier;
      return Math.max(0.25, speedPerMillisecond);
    }

    launchBallFromPaddle(ball) {
      if (!ball) return;
      const angle = (-Math.PI / 2) * 0.75 + Math.random() * (Math.PI / 3);
      const speed = this.getBallSpeed();
      ball.vx = Math.cos(angle) * speed;
      ball.vy = Math.sin(angle) * speed;
      ball.attachedToPaddle = false;
      ball.inPlay = true;
    }

    releaseHeldBalls() {
      let launched = false;
      this.balls.forEach(ball => {
        if (ball.attachedToPaddle) {
          this.updateBallFollowingPaddle(ball);
          this.launchBallFromPaddle(ball);
          launched = true;
        }
      });
      if (launched) {
        this.startAnimation();
      }
      return launched;
    }

    updateBallFollowingPaddle(ball) {
      const paddleCenter = this.paddle.x + this.paddle.width / 2;
      ball.x = paddleCenter;
      ball.y = this.paddle.y - ball.radius * 1.6;
      ball.vx = 0;
      ball.vy = 0;
      ball.inPlay = false;
      ball.attachedToPaddle = true;
      this.resetBallTrail(ball);
    }

    startAnimation() {
      if (this.running) return;
      this.running = true;
      this.lastTimestamp = typeof performance !== 'undefined' ? performance.now() : Date.now();
      this.animationFrameId = requestAnimationFrame(this.handleFrame);
    }

    stopAnimation() {
      if (!this.running) return;
      this.running = false;
      if (this.animationFrameId != null) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    handleFrame(timestamp) {
      if (!this.running) return;
      const now = typeof timestamp === 'number' ? timestamp : (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const delta = Math.min(32, now - this.lastTimestamp);
      this.lastTimestamp = now;
      this.update(delta, now);
      this.render(now);
      this.animationFrameId = requestAnimationFrame(this.handleFrame);
    }

    update(delta, now) {
      this.updateEffects(now);
      this.updateGravitons(now);
      this.updatePowerUps(delta);
      this.updateLasers(delta);
      this.updateBalls(delta, now);
      this.refreshComboMessage(now);
    }

    updateBalls(delta, now) {
      if (this.balls.length === 0) {
        return;
      }
      let lostBall = false;
      for (let i = this.balls.length - 1; i >= 0; i -= 1) {
        const ball = this.balls[i];
        if (!ball.inPlay) {
          if (ball.attachedToPaddle) {
            this.updateBallFollowingPaddle(ball);
          }
          continue;
        }
        ball.x += ball.vx * delta;
        ball.y += ball.vy * delta;
        this.handleWallCollisions(ball);
        if (!ball.inPlay) {
          lostBall = true;
          this.balls.splice(i, 1);
          continue;
        }
        this.handlePaddleCollision(ball);
        this.handleBrickCollisions(ball);
        this.addBallTrailPoint(ball, now);
        this.pruneBallTrail(ball, now);
      }
      if (lostBall && this.balls.length === 0) {
        this.handleLifeLost();
      }
    }

    addBallTrailPoint(ball, timestamp) {
      if (!ball || !ball.inPlay) return;
      const now = Number.isFinite(timestamp) && timestamp > 0
        ? timestamp
        : (typeof performance !== 'undefined' ? performance.now() : Date.now());
      if (!Array.isArray(ball.trail)) {
        ball.trail = [];
      }
      const lastEntry = ball.trail[ball.trail.length - 1];
      const minDistance = Math.max(2, ball.radius * 0.35);
      if (lastEntry) {
        const dx = lastEntry.x - ball.x;
        const dy = lastEntry.y - ball.y;
        const distanceSquared = dx * dx + dy * dy;
        if (distanceSquared < minDistance * minDistance && now - lastEntry.time < 18) {
          return;
        }
      }
      ball.trail.push({
        x: ball.x,
        y: ball.y,
        time: now
      });
      const maxPoints = 12;
      while (ball.trail.length > maxPoints) {
        ball.trail.shift();
      }
      const ghostInterval = 68;
      if (
        this.particleLayer
        && !ball.attachedToPaddle
        && (typeof ball.lastGhostTime !== 'number' || now - ball.lastGhostTime >= ghostInterval)
      ) {
        this.spawnBallGhost(ball);
        ball.lastGhostTime = now;
      }
    }

    pruneBallTrail(ball, timestamp) {
      if (!ball || !Array.isArray(ball.trail) || ball.trail.length === 0) return;
      const now = Number.isFinite(timestamp) && timestamp > 0
        ? timestamp
        : (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const maxLifetime = 260;
      while (ball.trail.length > 0 && now - ball.trail[0].time > maxLifetime) {
        ball.trail.shift();
      }
      if (!ball.inPlay && ball.trail.length > 0) {
        ball.trail.length = 0;
      }
    }

    resetBallTrail(ball) {
      if (!ball) return;
      if (Array.isArray(ball.trail)) {
        ball.trail.length = 0;
      }
      ball.lastGhostTime = 0;
    }

    spawnBallGhost(ball) {
      if (!this.particleLayer || !this.canvas || !ball) {
        return;
      }
      const rect = this.canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      const doc = this.particleLayer.ownerDocument || (typeof document !== 'undefined' ? document : null);
      if (!doc) {
        return;
      }
      const pixelRatio = this.pixelRatio || 1;
      const radius = ball.radius / pixelRatio;
      const ghost = doc.createElement('div');
      if (!ghost) {
        return;
      }
      ghost.className = 'arcade-ball-ghost';
      const left = ball.x / pixelRatio - radius;
      const top = ball.y / pixelRatio - radius;
      ghost.style.left = `${left.toFixed(2)}px`;
      ghost.style.top = `${top.toFixed(2)}px`;
      const size = radius * 2;
      ghost.style.width = `${size.toFixed(2)}px`;
      ghost.style.height = `${size.toFixed(2)}px`;
      const blur = Math.max(6, radius * 1.4);
      ghost.style.setProperty('--arcade-ball-ghost-blur', `${blur.toFixed(2)}px`);
      const removeGhost = () => {
        ghost.removeEventListener('animationend', removeGhost);
        if (ghost.parentNode === this.particleLayer) {
          this.particleLayer.removeChild(ghost);
        }
      };
      ghost.addEventListener('animationend', removeGhost);
      this.particleLayer.appendChild(ghost);
      setTimeout(removeGhost, 360);
    }

    updateEffects(now) {
      for (const [effectId, effect] of this.effects.entries()) {
        if (effect.expiresAt && now >= effect.expiresAt) {
          this.endEffect(effectId);
          this.effects.delete(effectId);
        }
      }
    }

    updateGravitons(now) {
      this.bricks.forEach(brick => {
        if (!brick.active || brick.type !== BRICK_TYPES.GRAVITON) {
          return;
        }
        if (brick.hidden) {
          const blocked = this.bricks.some(other => (
            other !== brick
            && other.active
            && other.col === brick.col
            && other.row < brick.row
          ));
          if (!blocked) {
            brick.hidden = false;
            brick.revealedAt = now;
            this.setComboMessage('Graviton détecté !', 2600);
          }
          return;
        }
        if (!brick.revealedAt) {
          brick.revealedAt = now;
        }
        if (!brick.dissipated && brick.revealedAt && now - brick.revealedAt >= this.gravitonLifetimeMs) {
          brick.active = false;
          brick.dissipated = true;
          this.setComboMessage('Le graviton s’est dissipé…', 2800);
        }
      });
    }

    updatePowerUps(delta) {
      if (this.powerUps.length === 0) return;
      const speed = Math.max(0.2, this.height * POWER_UP_FALL_SPEED_RATIO);
      for (let i = this.powerUps.length - 1; i >= 0; i -= 1) {
        const powerUp = this.powerUps[i];
        powerUp.y += speed * delta;
        if (powerUp.y > this.height + powerUp.size) {
          this.powerUps.splice(i, 1);
          continue;
        }
        if (this.checkPowerUpCatch(powerUp)) {
          this.powerUps.splice(i, 1);
        }
      }
    }

    updateLasers(delta) {
      const effect = this.effects.get(POWER_UP_IDS.LASER);
      if (effect) {
        effect.cooldown = (effect.cooldown || 0) + delta;
        if (effect.cooldown >= (effect.interval || LASER_INTERVAL_MS)) {
          effect.cooldown -= effect.interval || LASER_INTERVAL_MS;
          this.fireLasers();
        }
      }
      const velocity = this.height * LASER_SPEED_RATIO;
      for (let i = this.lasers.length - 1; i >= 0; i -= 1) {
        const laser = this.lasers[i];
        laser.y += velocity * delta;
        if (laser.y + laser.height < 0) {
          this.lasers.splice(i, 1);
          continue;
        }
        if (this.checkLaserCollisions(laser)) {
          this.lasers.splice(i, 1);
        }
      }
    }

    refreshComboMessage(now) {
      if (this.comboMessage && this.comboMessageExpiry && now >= this.comboMessageExpiry) {
        this.comboMessage = '';
        this.comboMessageExpiry = 0;
        if (this.comboLabel) {
          this.comboLabel.textContent = '';
        }
      }
    }

    handleWallCollisions(ball) {
      if (ball.x - ball.radius <= 0) {
        ball.x = ball.radius;
        ball.vx = Math.abs(ball.vx);
      } else if (ball.x + ball.radius >= this.width) {
        ball.x = this.width - ball.radius;
        ball.vx = -Math.abs(ball.vx);
      }
      if (ball.y - ball.radius <= 0) {
        ball.y = ball.radius;
        ball.vy = Math.abs(ball.vy);
      }
      const floorShieldActive = this.effects.has(POWER_UP_IDS.FLOOR);
      if (floorShieldActive && ball.y + ball.radius >= this.height) {
        ball.y = this.height - ball.radius;
        const reboundSpeed = Math.max(Math.abs(ball.vy), this.getBallSpeed());
        ball.vy = -Math.abs(reboundSpeed);
      } else if (ball.y - ball.radius > this.height) {
        ball.inPlay = false;
      }
    }

    handlePaddleCollision(ball) {
      if (
        !ball.inPlay
        || ball.vy <= 0
        || ball.y - ball.radius > this.paddle.y + this.paddle.height
        || ball.y + ball.radius < this.paddle.y
        || ball.x + ball.radius < this.paddle.x
        || ball.x - ball.radius > this.paddle.x + this.paddle.width
      ) {
        return;
      }
      const relative = (ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
      const clamped = clamp(relative, -1, 1);
      const angle = clamped * (Math.PI / 3);
      const speed = this.getBallSpeed();
      ball.vx = speed * Math.sin(angle);
      ball.vy = -Math.abs(speed * Math.cos(angle));
      ball.y = this.paddle.y - ball.radius - 1;
      const impactIntensity = 0.6 + Math.abs(clamped) * 0.4;
      this.triggerPaddleBounce(impactIntensity);
    }

    handleBrickCollisions(ball) {
      if (!ball.inPlay) return;
      for (const brick of this.bricks) {
        if (!brick.active || (brick.hidden && brick.type === BRICK_TYPES.GRAVITON)) continue;
        const x = brick.relX * this.width;
        const y = brick.relY * this.height;
        const w = brick.relWidth * this.width;
        const h = brick.relHeight * this.height;
        if (
          ball.x + ball.radius < x
          || ball.x - ball.radius > x + w
          || ball.y + ball.radius < y
          || ball.y - ball.radius > y + h
        ) {
          continue;
        }
        const overlapLeft = ball.x + ball.radius - x;
        const overlapRight = x + w - (ball.x - ball.radius);
        const overlapTop = ball.y + ball.radius - y;
        const overlapBottom = y + h - (ball.y - ball.radius);
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        if (minOverlap === overlapLeft) {
          ball.x = x - ball.radius;
          ball.vx = -Math.abs(ball.vx);
        } else if (minOverlap === overlapRight) {
          ball.x = x + w + ball.radius;
          ball.vx = Math.abs(ball.vx);
        } else if (minOverlap === overlapTop) {
          ball.y = y - ball.radius;
          ball.vy = -Math.abs(ball.vy);
        } else {
          ball.y = y + h + ball.radius;
          ball.vy = Math.abs(ball.vy);
        }
        this.hitBrick(brick);
        break;
      }
    }

    hitBrick(brick) {
      brick.hitsRemaining = Math.max(0, brick.hitsRemaining - 1);
      if (brick.hitsRemaining <= 0) {
        brick.active = false;
        this.handleBrickDestroyed(brick);
      } else if (brick.type === BRICK_TYPES.RESISTANT) {
        brick.relHeight *= 0.98;
      }
    }

    handleBrickDestroyed(brick) {
      const scoreGain = BRICK_SCORE_VALUE[brick.type] || 100;
      this.score += scoreGain;
      this.updateHud();
      this.spawnBrickImpactParticles(brick);
      if (brick.type === BRICK_TYPES.BONUS) {
        this.spawnPowerUp(brick);
      }
      if (brick.type === BRICK_TYPES.GRAVITON) {
        this.captureGraviton();
      }
      if (brick.particle?.family === 'quark' && brick.particle?.quarkColor) {
        this.registerQuarkCombo(brick.particle.quarkColor);
      }
      this.registerComboChain(brick);
      const hasRemaining = this.bricks.some(entry => entry.active);
      if (!hasRemaining) {
        this.handleLevelCleared();
      }
    }

    spawnBrickImpactParticles(brick) {
      if (!this.particleLayer || !brick || !this.canvas) {
        return;
      }
      const rect = this.canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }
      const doc = this.particleLayer.ownerDocument || (typeof document !== 'undefined' ? document : null);
      if (!doc) {
        return;
      }
      const brickLeft = brick.relX * rect.width;
      const brickTop = brick.relY * rect.height;
      const brickWidth = brick.relWidth * rect.width;
      const brickHeight = brick.relHeight * rect.height;
      const brickCenterX = brickLeft + brickWidth / 2;
      const brickCenterY = brickTop + brickHeight / 2;
      const rawCount = Math.round(18 + Math.random() * 10);
      const baseCount = Math.max(7, Math.round(rawCount * 0.5));
      const maxHorizontalScatter = Math.min(rect.width * 0.2, 180);

      for (let index = 0; index < baseCount; index += 1) {
        const particle = doc.createElement('div');
        if (!particle) {
          break;
        }
        particle.className = 'arcade-particle';
        const size = 3.6 + Math.random() * 2.6;
        const spawnX = brickCenterX + (Math.random() - 0.5) * brickWidth * 0.6;
        const spawnY = brickCenterY + (Math.random() - 0.5) * brickHeight * 0.5;
        particle.style.left = `${(spawnX - size / 2).toFixed(2)}px`;
        particle.style.top = `${(spawnY - size / 2).toFixed(2)}px`;
        particle.style.width = `${size.toFixed(2)}px`;
        particle.style.height = `${size.toFixed(2)}px`;
        particle.style.borderRadius = Math.random() < 0.45 ? '50%' : '1px';
        const hue = Math.floor(Math.random() * 360);
        const hueOffset = (hue + 40 + Math.random() * 60) % 360;
        const angle = Math.floor(Math.random() * 180);
        particle.style.background = `linear-gradient(${angle}deg, hsla(${hue}, 98%, 66%, 0.95), hsla(${hueOffset}, 82%, 58%, 0.6))`;
        const burstRadius = 32 + Math.random() * 72;
        const burstAngle = Math.random() * Math.PI * 2;
        const burstX = clamp(Math.cos(burstAngle) * burstRadius, -maxHorizontalScatter, maxHorizontalScatter);
        const burstY = -Math.abs(Math.sin(burstAngle)) * (burstRadius * 0.82 + Math.random() * 34) - (16 + Math.random() * 28);
        particle.style.setProperty('--arcade-particle-burst-x', `${burstX.toFixed(2)}px`);
        particle.style.setProperty('--arcade-particle-burst-y', `${burstY.toFixed(2)}px`);
        const scaleStart = 0.6 + Math.random() * 0.4;
        const peakScale = scaleStart + 0.3 + Math.random() * 0.25;
        const scaleEnd = 0.35 + Math.random() * 0.25;
        particle.style.setProperty('--arcade-particle-scale-start', scaleStart.toFixed(2));
        particle.style.setProperty('--arcade-particle-scale-peak', peakScale.toFixed(2));
        particle.style.setProperty('--arcade-particle-scale-end', scaleEnd.toFixed(2));
        particle.style.setProperty('--arcade-particle-rotation', `${((Math.random() - 0.5) * 220).toFixed(1)}deg`);
        const duration = 1500;
        particle.style.setProperty('--arcade-particle-duration', `${duration}ms`);
        particle.style.animationDelay = `${Math.random() * 130}ms`;
        const removeParticle = () => {
          particle.removeEventListener('animationend', removeParticle);
          if (particle.parentNode === this.particleLayer) {
            this.particleLayer.removeChild(particle);
          }
        };
        particle.addEventListener('animationend', removeParticle);
        this.particleLayer.appendChild(particle);
        setTimeout(removeParticle, duration + 200);
      }
    }

    spawnPowerUp(brick) {
      const powerUpTypes = [
        POWER_UP_IDS.EXTEND,
        POWER_UP_IDS.MULTIBALL,
        POWER_UP_IDS.LASER,
        POWER_UP_IDS.SPEED,
        POWER_UP_IDS.FLOOR
      ];
      const type = randomChoice(powerUpTypes);
      if (!type) return;
      const visuals = POWER_UP_VISUALS[type] || DEFAULT_POWER_UP_VISUAL;
      const powerUp = {
        id: `pu-${Math.random().toString(36).slice(2, 7)}`,
        type,
        x: brick.relX * this.width + (brick.relWidth * this.width) / 2,
        y: brick.relY * this.height + (brick.relHeight * this.height) / 2,
        size: Math.max(14, this.ballRadius * 1.6),
        symbol: visuals.symbol || DEFAULT_POWER_UP_VISUAL.symbol,
        widthMultiplier: visuals.widthMultiplier || DEFAULT_POWER_UP_VISUAL.widthMultiplier
      };
      this.powerUps.push(powerUp);
      this.setComboMessage(`Bonus: ${POWER_UP_LABELS[type]}`, 2400);
    }

    checkPowerUpCatch(powerUp) {
      const visuals = POWER_UP_VISUALS[powerUp.type] || DEFAULT_POWER_UP_VISUAL;
      const widthMultiplier = typeof powerUp.widthMultiplier === 'number'
        ? powerUp.widthMultiplier
        : visuals.widthMultiplier || DEFAULT_POWER_UP_VISUAL.widthMultiplier;
      const halfWidth = (powerUp.size * widthMultiplier) / 2;
      const halfHeight = powerUp.size / 2;
      const withinX = powerUp.x + halfWidth >= this.paddle.x && powerUp.x - halfWidth <= this.paddle.x + this.paddle.width;
      const withinY = powerUp.y + halfHeight >= this.paddle.y && powerUp.y - halfHeight <= this.paddle.y + this.paddle.height;
      if (withinX && withinY) {
        this.activatePowerUp(powerUp.type);
        return true;
      }
      return false;
    }

    fireLasers() {
      const leftX = this.paddle.x + this.paddle.width * 0.25;
      const rightX = this.paddle.x + this.paddle.width * 0.75;
      const originY = this.paddle.y;
      const width = Math.max(4, this.ballRadius * 0.4);
      const height = Math.max(14, this.ballRadius * 1.6);
      this.lasers.push({ x: leftX, y: originY, width, height });
      this.lasers.push({ x: rightX, y: originY, width, height });
    }

    checkLaserCollisions(laser) {
      for (const brick of this.bricks) {
        if (!brick.active || (brick.hidden && brick.type === BRICK_TYPES.GRAVITON)) continue;
        const x = brick.relX * this.width;
        const y = brick.relY * this.height;
        const w = brick.relWidth * this.width;
        const h = brick.relHeight * this.height;
        if (
          laser.x + laser.width < x
          || laser.x > x + w
          || laser.y > y + h
          || laser.y + laser.height < y
        ) {
          continue;
        }
        this.hitBrick(brick);
        return true;
      }
      return false;
    }

    captureGraviton() {
      this.setComboMessage('Graviton capturé ! Ticket spécial +1', 3600);
      this.specialTicketsEarned += 1;
      if (this.onSpecialTicket) {
        this.onSpecialTicket(1);
      }
    }

    registerQuarkCombo(color) {
      this.quarkComboColors.add(color);
      if (COMBO_REQUIRED_COLORS.every(required => this.quarkComboColors.has(required))) {
        this.quarkComboColors.clear();
        const reward = randomChoice(COMBO_POWER_UPS);
        if (reward) {
          this.activatePowerUp(reward);
          this.setComboMessage(`Combo quark ! ${POWER_UP_LABELS[reward]}`, 3200);
        }
      }
    }

    registerComboChain(brick) {
      if (!brick) return;
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const threshold = 520;
      if (now - this.lastBrickDestroyedAt <= threshold) {
        this.comboChainCount += 1;
      } else {
        this.comboChainCount = 1;
      }
      this.lastBrickDestroyedAt = now;
      if (this.comboChainCount >= 3) {
        this.triggerComboShockwave(brick, this.comboChainCount);
      }
    }

    triggerComboShockwave(brick, chainCount = 3) {
      if (!this.particleLayer) return;
      const doc = this.particleLayer.ownerDocument || (typeof document !== 'undefined' ? document : null);
      if (!doc) return;
      const shockwave = doc.createElement('div');
      if (!shockwave) return;
      shockwave.className = 'arcade-shockwave';
      const centerX = ((brick.relX + brick.relWidth / 2) * 100).toFixed(2);
      const centerY = ((brick.relY + brick.relHeight / 2) * 100).toFixed(2);
      const originalScale = 1.25 + Math.min(chainCount, 6) * 0.08;
      const scale = 1 + (originalScale - 1) * 0.5;
      const opacity = Math.min(0.78 + chainCount * 0.03, 0.92) * 0.5;
      shockwave.style.setProperty('--shockwave-x', `${centerX}%`);
      shockwave.style.setProperty('--shockwave-y', `${centerY}%`);
      shockwave.style.setProperty('--shockwave-scale', scale.toFixed(2));
      shockwave.style.setProperty('--shockwave-opacity', opacity.toFixed(2));
      this.particleLayer.appendChild(shockwave);
      const removeShockwave = () => {
        shockwave.removeEventListener('animationend', removeShockwave);
        if (shockwave.parentNode === this.particleLayer) {
          this.particleLayer.removeChild(shockwave);
        }
      };
      shockwave.addEventListener('animationend', removeShockwave);
      setTimeout(removeShockwave, 640);
      const originalIntensity = 1.02 + Math.min(chainCount, 5) * 0.005;
      const intensity = 1 + (originalIntensity - 1) * 0.5;
      this.triggerScreenPulse(intensity);
    }

    triggerScreenPulse(intensity = 1.03) {
      if (!this.stage || typeof this.stage.classList?.add !== 'function') return;
      const scale = Math.max(1, intensity);
      this.stage.style.setProperty('--arcade-pulse-scale', scale.toFixed(3));
      this.stage.classList.remove('arcade-stage--pulse');
      if (typeof this.stage.offsetWidth === 'number') {
        void this.stage.offsetWidth;
      }
      this.stage.classList.add('arcade-stage--pulse');
      if (this.stagePulseTimeout) {
        clearTimeout(this.stagePulseTimeout);
      }
      this.stagePulseTimeout = setTimeout(() => {
        if (this.stage) {
          this.stage.classList.remove('arcade-stage--pulse');
        }
      }, 420);
    }

    maybePulseForPowerUp(type) {
      const intensity = POWER_UP_PULSE_INTENSITY[type];
      if (intensity && intensity > 1) {
        this.triggerScreenPulse(intensity);
      }
    }

    activatePowerUp(type) {
      if (type === POWER_UP_IDS.MULTIBALL) {
        this.maybePulseForPowerUp(type);
        this.spawnAdditionalBalls();
        return;
      }
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      const existing = this.effects.get(type);
      const effectConfig = POWER_UP_EFFECTS[type];
      const duration = effectConfig?.duration || 8000;
      if (existing) {
        existing.expiresAt = now + duration;
        existing.interval = effectConfig?.interval || existing.interval;
      } else {
        const newEffect = {
          expiresAt: now + duration,
          interval: effectConfig?.interval || LASER_INTERVAL_MS,
          cooldown: 0
        };
        this.effects.set(type, newEffect);
        this.startEffect(type, newEffect);
      }
      this.maybePulseForPowerUp(type);
    }

    startEffect(type, effect) {
      switch (type) {
        case POWER_UP_IDS.EXTEND:
          {
            const previousWidth = this.paddle.width;
            this.paddle.currentWidthRatio = Math.min(0.32, this.paddle.baseWidthRatio * 1.6);
            this.updatePaddleSize();
            this.triggerPaddleStretchAnimation(previousWidth, this.paddle.width);
          }
          break;
        case POWER_UP_IDS.LASER:
          effect.cooldown = 0;
          break;
        case POWER_UP_IDS.SPEED:
          this.ballSpeedMultiplier = 1.35;
          break;
        case POWER_UP_IDS.FLOOR:
          break;
        default:
          break;
      }
    }

    endEffect(type) {
      switch (type) {
        case POWER_UP_IDS.EXTEND:
          this.paddle.currentWidthRatio = this.paddle.baseWidthRatio;
          this.updatePaddleSize();
          break;
        case POWER_UP_IDS.SPEED:
          this.ballSpeedMultiplier = 1;
          break;
        default:
          break;
      }
    }

    spawnAdditionalBalls() {
      if (this.balls.length === 0) {
        this.prepareServe();
        this.releaseHeldBalls();
        return;
      }
      const existing = this.balls.filter(ball => ball.inPlay);
      if (existing.length === 0) {
        this.releaseHeldBalls();
        return;
      }
      existing.slice(0, 2).forEach(ball => {
        const clone = this.createBall({ attachToPaddle: false });
        clone.x = ball.x;
        clone.y = ball.y;
        const angle = Math.atan2(ball.vy, ball.vx) + (Math.random() - 0.5) * 0.6;
        const speed = this.getBallSpeed();
        clone.vx = Math.cos(angle) * speed;
        clone.vy = Math.sin(angle) * speed;
        clone.inPlay = true;
        this.balls.push(clone);
      });
      this.startAnimation();
    }

    handleLevelCleared() {
      this.stopAnimation();
      this.balls = [];
      this.powerUps = [];
      this.lasers = [];
      const completedLevel = this.level;
      const reward = this.lives === this.maxLives ? ARCADE_TICKET_REWARD : 0;
      if (reward > 0) {
        this.ticketsEarned += reward;
        if (this.onTicketsEarned) {
          this.onTicketsEarned(reward, { level: completedLevel, score: this.score });
        }
      }
      const rewardLabel = reward > 0 ? ` ${this.formatTicketLabel(reward)} obtenu !` : ' Aucun ticket cette fois.';
      this.pendingLevelAdvance = true;
      this.showOverlay({
        message: `Niveau ${completedLevel} terminé !${rewardLabel}`,
        buttonLabel: 'Continuer',
        action: 'next'
      });
    }

    handleLifeLost() {
      this.stopAnimation();
      this.lives = Math.max(0, this.lives - 1);
      this.updateHud();
      if (this.lives > 0) {
        this.prepareServe();
        this.showOverlay({
          message: 'Particule perdue ! Touchez la raquette pour continuer.',
          buttonLabel: 'Reprendre',
          action: 'resume'
        });
      } else {
        this.gameOver();
      }
    }

    gameOver() {
      this.stopAnimation();
      this.prepareServe();
      const ticketSummary = this.formatTicketLabel(this.ticketsEarned);
      const bonusSummary = this.specialTicketsEarned > 0
        ? ` · ${this.formatBonusTicketLabel(this.specialTicketsEarned)}`
        : '';
      const message = this.ticketsEarned > 0 || this.specialTicketsEarned > 0
        ? `Partie terminée ! Tickets gagnés : ${ticketSummary}${bonusSummary}.`
        : 'Partie terminée ! Aucun ticket gagné cette fois-ci.';
      this.showOverlay({
        message,
        buttonLabel: 'Rejouer',
        action: 'restart'
      });
    }

    showOverlay(options = {}) {
      if (!this.overlay) return;
      const {
        message = '',
        buttonLabel = 'Continuer',
        action = 'start'
      } = options;
      this.overlay.hidden = false;
      this.overlay.setAttribute('aria-hidden', 'false');
      if (this.overlayMessage) {
        this.overlayMessage.textContent = message;
      }
      if (this.overlayButton) {
        this.overlayButton.textContent = buttonLabel;
      }
      this.overlayAction = action;
    }

    hideOverlay() {
      if (!this.overlay) return;
      this.overlay.hidden = true;
      this.overlay.setAttribute('aria-hidden', 'true');
    }

    isOverlayVisible() {
      return !this.overlay?.hidden;
    }

    startNewGame() {
      this.level = 1;
      this.score = 0;
      this.ticketsEarned = 0;
      this.specialTicketsEarned = 0;
      this.pendingLevelAdvance = false;
      this.setupLevel();
      this.hideOverlay();
      this.releaseHeldBalls();
    }

    resumeFromPause() {
      this.pendingResume = false;
      this.hideOverlay();
      if (!this.releaseHeldBalls()) {
        this.startAnimation();
      }
    }

    startNextLevel() {
      if (this.pendingLevelAdvance) {
        this.level += 1;
      }
      this.pendingLevelAdvance = false;
      this.setupLevel();
      this.hideOverlay();
      this.releaseHeldBalls();
    }

    handlePointerDown(event) {
      if (!this.enabled || this.isOverlayVisible()) return;
      this.pointerActive = true;
      if (this.canvas.setPointerCapture) {
        try {
          this.canvas.setPointerCapture(event.pointerId);
        } catch (error) {
          // ignore pointer capture errors
        }
      }
      this.updatePaddleFromPointer(event);
      this.releaseHeldBalls();
      event.preventDefault();
    }

    handlePointerMove(event) {
      if (!this.enabled || !this.pointerActive) return;
      this.updatePaddleFromPointer(event);
      event.preventDefault();
    }

    handlePointerUp(event) {
      if (!this.enabled) return;
      if (this.canvas.releasePointerCapture) {
        try {
          this.canvas.releasePointerCapture(event.pointerId);
        } catch (error) {
          // ignore pointer capture errors
        }
      }
      this.pointerActive = false;
    }

    updatePaddleFromPointer(event) {
      const rect = this.canvas.getBoundingClientRect();
      if (rect.width === 0) return;
      const ratio = (event.clientX - rect.left) / rect.width;
      const clampedRatio = clamp(ratio, 0, 1);
      const center = clampedRatio * this.width;
      const minX = 0;
      const maxX = Math.max(0, this.width - this.paddle.width);
      this.paddle.x = clamp(center - this.paddle.width / 2, minX, maxX);
      this.paddle.xRatio = (this.paddle.x + this.paddle.width / 2) / this.width;
      this.balls.forEach(ball => {
        if (ball.attachedToPaddle) {
          this.updateBallFollowingPaddle(ball);
        }
      });
    }

    handleOverlayButtonClick() {
      if (!this.enabled) return;
      if (this.overlayAction === 'start') {
        this.startNewGame();
      } else if (this.overlayAction === 'resume') {
        this.resumeFromPause();
      } else if (this.overlayAction === 'next') {
        this.startNextLevel();
      } else if (this.overlayAction === 'restart') {
        this.startNewGame();
      }
    }

    onEnter() {
      if (!this.enabled) return;
      this.handleResize();
      if (this.pendingResume && !this.isOverlayVisible()) {
        this.showOverlay({
          message: 'Partie en pause. Touchez la raquette pour continuer.',
          buttonLabel: 'Reprendre',
          action: 'resume'
        });
        this.pendingResume = false;
      }
      if (this.balls.some(ball => ball.inPlay) && !this.isOverlayVisible()) {
        this.startAnimation();
      } else {
        this.render();
      }
    }

    onLeave() {
      if (!this.enabled) return;
      if (this.balls.some(ball => ball.inPlay) && !this.isOverlayVisible()) {
        this.pendingResume = true;
        this.prepareServe();
      }
      this.stopAnimation();
    }

    setComboMessage(message, duration = 2500) {
      this.comboMessage = message;
      const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
      this.comboMessageExpiry = now + duration;
      if (this.comboLabel) {
        this.comboLabel.textContent = message;
      }
    }

    render(now = 0) {
      if (!this.enabled) return;
      const ctx = this.ctx;
      const renderTimestamp = Number.isFinite(now) && now > 0
        ? now
        : (typeof performance !== 'undefined' ? performance.now() : Date.now());
      const time = typeof renderTimestamp === 'number' ? renderTimestamp / 1000 : 0;
      const floorShieldActive = this.effects.has(POWER_UP_IDS.FLOOR);
      this.balls.forEach(ball => this.pruneBallTrail(ball, renderTimestamp));
      ctx.clearRect(0, 0, this.width, this.height);
      const background = ctx.createLinearGradient(0, 0, this.width, this.height);
      background.addColorStop(0, 'rgba(12, 16, 38, 0.85)');
      background.addColorStop(1, 'rgba(4, 6, 18, 0.95)');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, this.width, this.height);

      const hasRoundRect = typeof ctx.roundRect === 'function';
      this.bricks.forEach(brick => {
        if (!brick.active || (brick.hidden && brick.type === BRICK_TYPES.GRAVITON)) return;
        const x = brick.relX * this.width;
        const y = brick.relY * this.height;
        const w = brick.relWidth * this.width;
        const h = brick.relHeight * this.height;
        if (brick.type === BRICK_TYPES.GRAVITON) {
          const gradient = ctx.createLinearGradient(x, y, x + w, y + h);
          brick.particle.colors.forEach((color, index) => {
            gradient.addColorStop(index / (brick.particle.colors.length - 1 || 1), color);
          });
          ctx.fillStyle = gradient;
        } else {
          const colors = brick.particle?.colors || ['#6c8cff', '#3b4da6'];
          const gradient = ctx.createLinearGradient(x, y, x, y + h);
          gradient.addColorStop(0, colors[0]);
          gradient.addColorStop(1, colors[1] || colors[0]);
          ctx.fillStyle = gradient;
        }
        const radius = Math.min(16, h * 0.4);
        if (hasRoundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, radius);
          ctx.fill();
        } else {
          ctx.fillRect(x, y, w, h);
        }
        if (brick.particle?.symbol) {
          ctx.fillStyle = brick.particle.symbolColor || '#ffffff';
          const symbolScale = typeof brick.particle.symbolScale === 'number'
            ? brick.particle.symbolScale
            : 1;
          const baseFontSize = Math.max(12, h * 0.55);
          ctx.font = `${Math.max(12, baseFontSize * symbolScale)}px 'Orbitron', 'Inter', sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(brick.particle.symbol, x + w / 2, y + h / 2 + h * 0.04);
        }
        if (brick.type === BRICK_TYPES.RESISTANT && brick.maxHits > 1 && brick.hitsRemaining > 0) {
          const ratio = brick.hitsRemaining / brick.maxHits;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
          ctx.fillRect(x, y + h - h * ratio, w, h * ratio * 0.12);
        }
      });

      this.powerUps.forEach(powerUp => {
        const visuals = POWER_UP_VISUALS[powerUp.type] || DEFAULT_POWER_UP_VISUAL;
        const widthMultiplier = typeof powerUp.widthMultiplier === 'number'
          ? powerUp.widthMultiplier
          : visuals.widthMultiplier || DEFAULT_POWER_UP_VISUAL.widthMultiplier;
        const height = powerUp.size;
        const width = height * widthMultiplier;
        const left = powerUp.x - width / 2;
        const top = powerUp.y - height / 2;
        const radius = Math.min(18, height * 0.45);
        const colors = visuals.gradient || DEFAULT_POWER_UP_VISUAL.gradient;
        const gradient = ctx.createLinearGradient(left, top, left, top + height);
        gradient.addColorStop(0, colors[0]);
        gradient.addColorStop(1, colors[1] || colors[0]);
        ctx.save();
        ctx.shadowColor = visuals.glow || DEFAULT_POWER_UP_VISUAL.glow;
        ctx.shadowBlur = height * 0.55;
        ctx.fillStyle = gradient;
        if (hasRoundRect) {
          ctx.beginPath();
          ctx.roundRect(left, top, width, height, radius);
          ctx.fill();
        } else {
          ctx.fillRect(left, top, width, height);
        }
        if (visuals.border) {
          ctx.lineWidth = Math.max(1.2, height * 0.12);
          ctx.strokeStyle = visuals.border;
          if (hasRoundRect) {
            ctx.stroke();
          } else {
            ctx.strokeRect(left, top, width, height);
          }
        }
        ctx.shadowBlur = 0;
        ctx.shadowColor = 'transparent';
        ctx.fillStyle = visuals.textColor || DEFAULT_POWER_UP_VISUAL.textColor;
        ctx.font = `${Math.max(14, height * 0.6)}px 'Orbitron', 'Inter', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const symbol = powerUp.symbol || visuals.symbol || DEFAULT_POWER_UP_VISUAL.symbol;
        ctx.fillText(symbol, powerUp.x, powerUp.y + height * 0.04);
        ctx.restore();
      });

      this.lasers.forEach(laser => {
        const gradient = ctx.createLinearGradient(laser.x, laser.y, laser.x, laser.y - laser.height);
        gradient.addColorStop(0, 'rgba(180, 240, 255, 0.9)');
        gradient.addColorStop(1, 'rgba(120, 200, 255, 0.2)');
        ctx.fillStyle = gradient;
        ctx.fillRect(laser.x - laser.width / 2, laser.y - laser.height, laser.width, laser.height);
      });

      const floorHeight = Math.max(12, this.height * 0.06);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      if (floorShieldActive) {
        const pulse = 0.55 + 0.25 * Math.sin(time * 6.2);
        const shieldGradient = ctx.createLinearGradient(
          0,
          this.height - floorHeight * 1.8,
          0,
          this.height
        );
        shieldGradient.addColorStop(0, 'rgba(40, 120, 255, 0)');
        shieldGradient.addColorStop(0.45, `rgba(90, 180, 255, ${0.22 + pulse * 0.28})`);
        shieldGradient.addColorStop(1, `rgba(180, 240, 255, ${0.48 + pulse * 0.35})`);
        ctx.fillStyle = shieldGradient;
        ctx.fillRect(0, this.height - floorHeight * 1.8, this.width, floorHeight * 1.8);
        ctx.strokeStyle = `rgba(200, 240, 255, ${0.55 + pulse * 0.4})`;
        ctx.lineWidth = Math.max(2, floorHeight * 0.22);
        ctx.beginPath();
        ctx.moveTo(0, this.height - floorHeight * 0.42);
        ctx.lineTo(this.width, this.height - floorHeight * 0.42);
        ctx.stroke();
      } else {
        const ember = 0.4 + 0.2 * Math.sin(time * 3.4);
        const floorGradient = ctx.createLinearGradient(0, this.height - floorHeight, 0, this.height);
        floorGradient.addColorStop(0, 'rgba(180, 30, 40, 0)');
        floorGradient.addColorStop(1, `rgba(255, 60, 60, ${0.35 + ember * 0.25})`);
        ctx.fillStyle = floorGradient;
        ctx.fillRect(0, this.height - floorHeight, this.width, floorHeight);
        ctx.strokeStyle = `rgba(220, 40, 50, ${0.45 + ember * 0.25})`;
        ctx.lineWidth = Math.max(1.5, floorHeight * 0.18);
        ctx.beginPath();
        ctx.moveTo(0, this.height - floorHeight * 0.18);
        ctx.lineTo(this.width, this.height - floorHeight * 0.18);
        ctx.stroke();
      }
      ctx.restore();

      const paddleCenterX = this.paddle.x + this.paddle.width / 2;
      const paddleScaleX = this.getPaddleStretchScale(renderTimestamp);
      const paddleBounceOffset = this.getPaddleBounceOffset(renderTimestamp);
      ctx.save();
      ctx.translate(paddleCenterX, 0);
      ctx.scale(paddleScaleX, 1);
      ctx.translate(-paddleCenterX, 0);
      if (paddleBounceOffset !== 0) {
        ctx.translate(0, paddleBounceOffset);
      }
      const paddleGradient = ctx.createLinearGradient(
        this.paddle.x,
        this.paddle.y,
        this.paddle.x,
        this.paddle.y + this.paddle.height
      );
      paddleGradient.addColorStop(0, 'rgba(120, 220, 255, 0.95)');
      paddleGradient.addColorStop(1, 'rgba(86, 140, 255, 0.85)');
      ctx.fillStyle = paddleGradient;
      const paddleRadius = Math.min(18, this.paddle.height * 1.2);
      if (hasRoundRect) {
        ctx.beginPath();
        ctx.roundRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height, paddleRadius);
        ctx.fill();
      } else {
        ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);
      }
      ctx.restore();

      const speedTrailActive = this.effects.has(POWER_UP_IDS.SPEED);
      const trailFillColor = speedTrailActive ? '#ffe5cc' : '#ffffff';
      const trailGlowColor = speedTrailActive
        ? { r: 255, g: 120, b: 40 }
        : { r: 150, g: 220, b: 255 };
      const trailBlurBoost = speedTrailActive ? 1.35 : 1;
      const trailRadiusBoost = speedTrailActive ? 1.25 : 1;

      this.balls.forEach(ball => {
        const electricSeed = typeof ball.electricSeed === 'number' ? ball.electricSeed : 0;
        const pulse = 0.55 + 0.35 * Math.sin(time * 7.1 + electricSeed);
        const trail = Array.isArray(ball.trail) ? ball.trail : [];
        if (trail.length > 0) {
          ctx.save();
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = trailFillColor;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          trail.forEach(point => {
            if (!point || typeof point.time !== 'number') return;
            const age = renderTimestamp - point.time;
            if (age < 0) return;
            const lifeRatio = clamp(1 - age / 260, 0, 1);
            if (lifeRatio <= 0) return;
            const alphaBase = speedTrailActive ? 0.12 : 0.08;
            const alphaRange = speedTrailActive ? 0.28 : 0.2;
            const alpha = alphaBase + lifeRatio * alphaRange;
            ctx.globalAlpha = alpha;
            const blur = ball.radius * (1.1 + (1 - lifeRatio) * 0.9 * trailBlurBoost);
            ctx.shadowBlur = blur;
            const glowAlpha = Math.min(1, 0.25 + lifeRatio * (speedTrailActive ? 0.45 : 0.35));
            ctx.shadowColor = `rgba(${trailGlowColor.r}, ${trailGlowColor.g}, ${trailGlowColor.b}, ${glowAlpha})`;
            const radius = ball.radius * (0.85 + lifeRatio * 0.35 * trailRadiusBoost);
            ctx.beginPath();
            ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
            ctx.fill();
          });
          ctx.restore();
        }
        const gradient = ctx.createRadialGradient(
          ball.x - ball.radius / 3,
          ball.y - ball.radius / 3,
          ball.radius * 0.2,
          ball.x,
          ball.y,
          ball.radius
        );
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        gradient.addColorStop(1, 'rgba(120, 200, 255, 0.9)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const auraOuterRadius = ball.radius * (1.6 + 0.28 * Math.sin(time * 3.4 + electricSeed * 1.7));
        const auraGradient = ctx.createRadialGradient(
          ball.x,
          ball.y,
          ball.radius * 0.45,
          ball.x,
          ball.y,
          auraOuterRadius
        );
        auraGradient.addColorStop(0, `rgba(150, 220, 255, ${0.18 + pulse * 0.2})`);
        auraGradient.addColorStop(0.8, `rgba(90, 180, 255, ${0.08 + pulse * 0.18})`);
        auraGradient.addColorStop(1, 'rgba(30, 120, 255, 0)');
        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, auraOuterRadius, 0, Math.PI * 2);
        ctx.fill();

        const arcCount = 4;
        const arcLineWidth = Math.max(0.8, ball.radius * 0.18);
        ctx.lineWidth = arcLineWidth;
        ctx.lineCap = 'round';
        for (let i = 0; i < arcCount; i += 1) {
          const segmentSeed = electricSeed + i * 2.318;
          const baseAngle = segmentSeed + time * 4.2 + Math.sin(time * 2.1 + segmentSeed) * 0.4;
          const innerRadius = ball.radius * (0.92 + 0.12 * Math.sin(time * 5.3 + segmentSeed * 1.4));
          const outerRadius = ball.radius * (1.45 + 0.3 * Math.sin(time * 3.8 + segmentSeed * 2.2));
          ctx.beginPath();
          ctx.moveTo(
            ball.x + Math.cos(baseAngle) * innerRadius,
            ball.y + Math.sin(baseAngle) * innerRadius
          );
          const jaggedSteps = 3;
          for (let step = 1; step <= jaggedSteps; step += 1) {
            const progress = step / jaggedSteps;
            const noise = Math.sin((time + step) * 6.4 + segmentSeed * (step + 1)) * 0.35;
            const angle = baseAngle + noise * 0.55;
            const radius = innerRadius + (outerRadius - innerRadius) * progress + noise * ball.radius * 0.22;
            ctx.lineTo(ball.x + Math.cos(angle) * radius, ball.y + Math.sin(angle) * radius);
          }
          ctx.strokeStyle = `rgba(170, 240, 255, ${0.18 + pulse * 0.28})`;
          ctx.stroke();
        }

        const ringRadius = ball.radius * (1.18 + 0.08 * Math.sin(time * 4.6 + electricSeed));
        ctx.strokeStyle = `rgba(150, 220, 255, ${0.2 + pulse * 0.3})`;
        ctx.lineWidth = Math.max(1, ball.radius * 0.24);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });
    }

    updateHud() {
      if (this.levelLabel) {
        this.levelLabel.textContent = `${this.level}`;
      }
      if (this.livesLabel) {
        this.livesLabel.textContent = `${this.lives}`;
      }
      if (this.scoreLabel) {
        this.scoreLabel.textContent = `${this.score}`;
      }
    }
  }

  window.ParticulesGame = ParticulesGame;
})();
