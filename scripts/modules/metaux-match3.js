const GLOBAL_METAUX_CONFIG =
  typeof window !== 'undefined' && window.GAME_CONFIG ? window.GAME_CONFIG.metaux : null;

const DEFAULT_METAUX_CONFIG = {
  rows: 9,
  cols: 16,
  clearDelayMs: 220,
  refillDelayMs: 120,
  popEffect: {
    durationMs: 220,
    scale: 1.18,
    glowOpacity: 0.8
  },
  maxShuffleAttempts: 120,
  tileTypes: [
    { id: 'bronze', label: 'Bronze', color: '#C77E36' },
    { id: 'argent', label: 'Argent', color: '#ADBECA' },
    { id: 'or', label: 'Or', color: '#E6C838' },
    { id: 'platine', label: 'Platine', color: '#A6D3E3' },
    { id: 'diamant', label: 'Diamant', color: '#82D9FF' }
  ],
  timer: {
    initialSeconds: 6,
    maxSeconds: 6,
    matchRewardSeconds: 2,
    penaltyWindowSeconds: 30,
    penaltyAmountSeconds: 1,
    minMaxSeconds: 1,
    tickIntervalMs: 100
  }
};

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function toNonNegativeInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function toNumberWithinRange(value, fallback, { min = Number.NEGATIVE_INFINITY, max = Number.POSITIVE_INFINITY } = {}) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  if (parsed < min || parsed > max) {
    return fallback;
  }
  return parsed;
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

const METAUX_CONFIG = {
  ...DEFAULT_METAUX_CONFIG,
  ...(GLOBAL_METAUX_CONFIG && typeof GLOBAL_METAUX_CONFIG === 'object' ? GLOBAL_METAUX_CONFIG : {})
};

const METAUX_TILE_TYPES_SOURCE = Array.isArray(METAUX_CONFIG.tileTypes) && METAUX_CONFIG.tileTypes.length
  ? METAUX_CONFIG.tileTypes
      .map(type => ({
        id: typeof type.id === 'string' ? type.id : '',
        label: typeof type.label === 'string' ? type.label : type.id,
        color: typeof type.color === 'string' ? type.color : null
      }))
      .filter(type => type.id)
  : null;

const METAUX_TILE_TYPES =
  METAUX_TILE_TYPES_SOURCE && METAUX_TILE_TYPES_SOURCE.length
    ? METAUX_TILE_TYPES_SOURCE
    : DEFAULT_METAUX_CONFIG.tileTypes;

const METAUX_TYPE_MAP = new Map(METAUX_TILE_TYPES.map(type => [type.id, type]));

const METAUX_ROWS = toPositiveInteger(METAUX_CONFIG.rows, DEFAULT_METAUX_CONFIG.rows);
const METAUX_COLS = toPositiveInteger(METAUX_CONFIG.cols, DEFAULT_METAUX_CONFIG.cols);
const METAUX_CLEAR_DELAY = toPositiveInteger(
  METAUX_CONFIG.clearDelayMs,
  DEFAULT_METAUX_CONFIG.clearDelayMs
);
const METAUX_REFILL_DELAY = toNonNegativeInteger(
  METAUX_CONFIG.refillDelayMs,
  DEFAULT_METAUX_CONFIG.refillDelayMs
);
const METAUX_POP_EFFECT_SOURCE =
  METAUX_CONFIG.popEffect && typeof METAUX_CONFIG.popEffect === 'object' ? METAUX_CONFIG.popEffect : {};
const METAUX_MATCH_POP_EFFECT = {
  durationMs: toNonNegativeInteger(
    METAUX_POP_EFFECT_SOURCE.durationMs,
    DEFAULT_METAUX_CONFIG.popEffect.durationMs
  ),
  scale: toNumberWithinRange(
    METAUX_POP_EFFECT_SOURCE.scale,
    DEFAULT_METAUX_CONFIG.popEffect.scale,
    { min: 0.5, max: 3 }
  ),
  glowOpacity: toNumberWithinRange(
    METAUX_POP_EFFECT_SOURCE.glowOpacity,
    DEFAULT_METAUX_CONFIG.popEffect.glowOpacity,
    { min: 0, max: 1 }
  )
};
const METAUX_CLEAR_STEP_DELAY = Math.max(METAUX_CLEAR_DELAY, METAUX_MATCH_POP_EFFECT.durationMs);
const METAUX_MAX_SHUFFLE_ATTEMPTS = toPositiveInteger(
  METAUX_CONFIG.maxShuffleAttempts,
  DEFAULT_METAUX_CONFIG.maxShuffleAttempts
);

const METAUX_TIMER_SOURCE =
  METAUX_CONFIG.timer && typeof METAUX_CONFIG.timer === 'object' ? METAUX_CONFIG.timer : {};

const METAUX_TIMER_CONFIG = {
  initialSeconds: toNumberWithinRange(
    METAUX_TIMER_SOURCE.initialSeconds,
    DEFAULT_METAUX_CONFIG.timer.initialSeconds,
    { min: 0.5, max: 600 }
  ),
  maxSeconds: toNumberWithinRange(
    METAUX_TIMER_SOURCE.maxSeconds,
    DEFAULT_METAUX_CONFIG.timer.maxSeconds,
    { min: 0.5, max: 600 }
  ),
  matchRewardSeconds: toNumberWithinRange(
    METAUX_TIMER_SOURCE.matchRewardSeconds,
    DEFAULT_METAUX_CONFIG.timer.matchRewardSeconds,
    { min: 0, max: 60 }
  ),
  penaltyWindowSeconds: toNumberWithinRange(
    METAUX_TIMER_SOURCE.penaltyWindowSeconds,
    DEFAULT_METAUX_CONFIG.timer.penaltyWindowSeconds,
    { min: 1, max: 600 }
  ),
  penaltyAmountSeconds: toNumberWithinRange(
    METAUX_TIMER_SOURCE.penaltyAmountSeconds,
    DEFAULT_METAUX_CONFIG.timer.penaltyAmountSeconds,
    { min: 0, max: 60 }
  ),
  minMaxSeconds: toNumberWithinRange(
    METAUX_TIMER_SOURCE.minMaxSeconds,
    DEFAULT_METAUX_CONFIG.timer.minMaxSeconds,
    { min: 0.5, max: 600 }
  ),
  tickIntervalMs: Math.max(
    16,
    toPositiveInteger(METAUX_TIMER_SOURCE.tickIntervalMs, DEFAULT_METAUX_CONFIG.timer.tickIntervalMs)
  )
};

if (METAUX_TIMER_CONFIG.maxSeconds < METAUX_TIMER_CONFIG.initialSeconds) {
  METAUX_TIMER_CONFIG.maxSeconds = METAUX_TIMER_CONFIG.initialSeconds;
}
METAUX_TIMER_CONFIG.minMaxSeconds = clamp(
  METAUX_TIMER_CONFIG.minMaxSeconds,
  0.5,
  METAUX_TIMER_CONFIG.maxSeconds
);

const METAUX_TIMER_REWARD_SECONDS = Math.max(0, METAUX_TIMER_CONFIG.matchRewardSeconds);
const METAUX_TIMER_PENALTY_WINDOW_MS = Math.max(
  0,
  METAUX_TIMER_CONFIG.penaltyWindowSeconds * 1000
);
const METAUX_TIMER_PENALTY_AMOUNT = Math.max(0, METAUX_TIMER_CONFIG.penaltyAmountSeconds);
const METAUX_TIMER_TICK_INTERVAL = METAUX_TIMER_CONFIG.tickIntervalMs;

class MetauxMatch3Game {
  constructor(options = {}) {
    this.boardElement = options.boardElement || null;
    this.timerValueElement = options.timerValueElement || null;
    this.timerFillElement = options.timerFillElement || null;
    this.timerMaxElement = options.timerMaxElement || null;
    this.endScreenElement = options.endScreenElement || null;
    this.endTimeElement = options.endTimeElement || null;
    this.endMatchesElement = options.endMatchesElement || null;
    this.endMatchListElement = options.endMatchListElement || null;
    this.lastComboElement = options.lastComboElement || null;
    this.bestComboElement = options.bestComboElement || null;
    this.totalTilesElement = options.totalTilesElement || null;
    this.reshufflesElement = options.reshufflesElement || null;
    this.movesElement = options.movesElement || null;
    this.messageElement = options.messageElement || null;
    this.onSessionEnd = typeof options.onSessionEnd === 'function' ? options.onSessionEnd : null;
    this.board = Array.from({ length: METAUX_ROWS }, () => Array(METAUX_COLS).fill(null));
    this.tiles = Array.from({ length: METAUX_ROWS }, () => Array(METAUX_COLS).fill(null));
    this.initialized = false;
    this.processing = false;
    this.dragState = null;
    this.comboChain = 0;
    this.gameOver = false;
    this.timerState = {
      current: METAUX_TIMER_CONFIG.initialSeconds,
      max: METAUX_TIMER_CONFIG.maxSeconds,
      running: false,
      intervalId: null,
      lastUpdate: null,
      totalElapsedMs: 0
    };
    this.lastMatchPerType = new Map();
    this.matchHistory = this.createEmptyMatchHistory();
    this.resetStats();
    this.boundPointerDown = this.onPointerDown.bind(this);
    this.boundPointerMove = this.onPointerMove.bind(this);
    this.boundPointerUp = this.onPointerUp.bind(this);
    this.boundPointerCancel = this.onPointerCancel.bind(this);
  }

  initialize() {
    if (this.initialized || !this.boardElement) {
      return;
    }
    this.buildBoard();
    this.populateBoard();
    this.refreshBoard();
    this.initialized = true;
    this.enterIdleState();
  }

  onEnter() {
    if (!this.initialized) {
      this.initialize();
      return;
    }
    if (this.boardElement && !this.gameOver) {
      this.startTimer();
      this.updateMessage('Repérez un alignement et glissez pour fusionner les métaux.');
    }
  }

  onLeave() {
    this.pauseTimer();
    this.clearDragState();
  }

  buildBoard() {
    if (!this.boardElement) {
      return;
    }
    this.boardElement.style.setProperty('--metaux-cols', METAUX_COLS);
    this.boardElement.style.setProperty('--metaux-rows', METAUX_ROWS);
    this.boardElement.style.gridTemplateColumns = `repeat(${METAUX_COLS}, minmax(0, 1fr))`;
    this.boardElement.style.setProperty('--metaux-pop-duration', `${METAUX_MATCH_POP_EFFECT.durationMs}ms`);
    this.boardElement.style.setProperty('--metaux-pop-scale', String(METAUX_MATCH_POP_EFFECT.scale));
    this.boardElement.style.setProperty(
      '--metaux-pop-glow-opacity',
      String(METAUX_MATCH_POP_EFFECT.glowOpacity)
    );
    this.boardElement.dataset.rows = String(METAUX_ROWS);
    this.boardElement.dataset.cols = String(METAUX_COLS);
    const fragment = document.createDocumentFragment();
    for (let row = 0; row < METAUX_ROWS; row += 1) {
      for (let col = 0; col < METAUX_COLS; col += 1) {
        const tile = document.createElement('div');
        tile.className = 'metaux-tile is-empty';
        tile.dataset.row = String(row);
        tile.dataset.col = String(col);
        tile.setAttribute('role', 'button');
        tile.setAttribute('tabindex', '-1');
        tile.addEventListener('pointerdown', this.boundPointerDown);
        tile.addEventListener('pointermove', this.boundPointerMove);
        tile.addEventListener('pointerup', this.boundPointerUp);
        tile.addEventListener('pointercancel', this.boundPointerCancel);
        tile.addEventListener('contextmenu', event => {
          event.preventDefault();
        });
        tile.addEventListener('dragstart', event => {
          event.preventDefault();
        });
        const label = document.createElement('span');
        tile.appendChild(label);
        tile._label = label;
        this.tiles[row][col] = tile;
        fragment.appendChild(tile);
      }
    }
    this.boardElement.innerHTML = '';
    this.boardElement.appendChild(fragment);
  }

  populateBoard() {
    let attempts = 0;
    do {
      attempts += 1;
      this.fillRandomBoard();
    } while ((this.hasExistingMatches() || !this.hasAvailableMoves()) && attempts < METAUX_MAX_SHUFFLE_ATTEMPTS);
    if (attempts >= METAUX_MAX_SHUFFLE_ATTEMPTS) {
      this.fillRandomBoard();
    }
  }

  fillRandomBoard() {
    for (let row = 0; row < METAUX_ROWS; row += 1) {
      for (let col = 0; col < METAUX_COLS; col += 1) {
        this.board[row][col] = this.generateTileFor(row, col);
      }
    }
  }

  generateTileFor(row, col) {
    let choice = null;
    let safety = 0;
    while (!choice && safety < 24) {
      safety += 1;
      const candidate = METAUX_TILE_TYPES[Math.floor(Math.random() * METAUX_TILE_TYPES.length)].id;
      if (this.createsImmediateMatch(row, col, candidate)) {
        continue;
      }
      choice = candidate;
    }
    return choice || METAUX_TILE_TYPES[0].id;
  }

  createsImmediateMatch(row, col, type) {
    if (!type) {
      return false;
    }
    const left1 = col > 0 ? this.board[row][col - 1] : null;
    const left2 = col > 1 ? this.board[row][col - 2] : null;
    if (left1 === type && left2 === type) {
      return true;
    }
    const up1 = row > 0 ? this.board[row - 1][col] : null;
    const up2 = row > 1 ? this.board[row - 2][col] : null;
    if (up1 === type && up2 === type) {
      return true;
    }
    return false;
  }

  refreshBoard() {
    for (let row = 0; row < METAUX_ROWS; row += 1) {
      for (let col = 0; col < METAUX_COLS; col += 1) {
        this.updateTileElement(row, col, this.board[row][col]);
      }
    }
  }

  updateTileElement(row, col, type) {
    const tile = this.tiles[row][col];
    if (!tile) {
      return;
    }
    tile.classList.remove('is-selected', 'is-target', 'is-clearing', 'is-empty');
    tile.dataset.type = type || '';
    const labelElement = tile._label || tile.firstElementChild;
    if (!type) {
      tile.classList.add('is-empty');
      tile.style.removeProperty('--tile-color');
      if (labelElement) {
        labelElement.textContent = '';
      }
      tile.setAttribute('aria-label', 'Case vide');
      return;
    }
    const label = this.getTypeLabel(type);
    const color = this.getTypeColor(type);
    if (labelElement) {
      labelElement.textContent = label;
    }
    if (color) {
      tile.style.setProperty('--tile-color', color);
    } else {
      tile.style.removeProperty('--tile-color');
    }
    tile.setAttribute('aria-label', label);
  }

  getTypeLabel(type) {
    const found = METAUX_TYPE_MAP.get(type);
    return found && found.label ? found.label : type;
  }

  getTypeColor(type) {
    const found = METAUX_TYPE_MAP.get(type);
    return found && found.color ? found.color : null;
  }

  onPointerDown(event) {
    if (this.processing || this.gameOver) {
      return;
    }
    const tile = event.currentTarget;
    const row = Number(tile.dataset.row);
    const col = Number(tile.dataset.col);
    if (!Number.isInteger(row) || !Number.isInteger(col)) {
      return;
    }
    const type = this.board[row][col];
    if (!type) {
      return;
    }
    event.preventDefault();
    const rect = this.boardElement ? this.boardElement.getBoundingClientRect() : { width: 0 };
    const threshold = Math.max(rect.width / METAUX_COLS / 2, 10);
    this.clearDragState();
    this.dragState = {
      row,
      col,
      tile,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      threshold,
      target: null
    };
    if (tile.setPointerCapture) {
      tile.setPointerCapture(event.pointerId);
    }
    tile.classList.add('is-selected');
  }

  onPointerMove(event) {
    if (!this.dragState || this.processing) {
      return;
    }
    const dx = event.clientX - this.dragState.startX;
    const dy = event.clientY - this.dragState.startY;
    if (Math.abs(dx) < this.dragState.threshold && Math.abs(dy) < this.dragState.threshold) {
      this.setHoverTarget(null);
      return;
    }
    let targetRow = this.dragState.row;
    let targetCol = this.dragState.col;
    if (Math.abs(dx) > Math.abs(dy)) {
      targetCol += dx > 0 ? 1 : -1;
    } else {
      targetRow += dy > 0 ? 1 : -1;
    }
    if (!this.isValidPosition(targetRow, targetCol) || !this.board[targetRow][targetCol]) {
      this.setHoverTarget(null);
      return;
    }
    if (!this.dragState.target || this.dragState.target.row !== targetRow || this.dragState.target.col !== targetCol) {
      const tile = this.tiles[targetRow][targetCol];
      this.setHoverTarget({ row: targetRow, col: targetCol, tile });
    }
  }

  onPointerUp(event) {
    if (!this.dragState) {
      return;
    }
    event.preventDefault();
    const origin = { row: this.dragState.row, col: this.dragState.col };
    const target = this.dragState.target ? { row: this.dragState.target.row, col: this.dragState.target.col } : null;
    const pointerId = this.dragState.pointerId;
    const originTile = this.dragState.tile;
    this.clearDragState();
    if (originTile && originTile.releasePointerCapture && pointerId != null) {
      originTile.releasePointerCapture(pointerId);
    }
    if (target) {
      this.attemptSwap(origin, target);
    } else {
      this.updateMessage('Sélectionnez un lingot adjacent pour forger un match.');
    }
  }

  onPointerCancel() {
    if (!this.dragState) {
      return;
    }
    const pointerId = this.dragState.pointerId;
    const originTile = this.dragState.tile;
    this.clearDragState();
    if (originTile && originTile.releasePointerCapture && pointerId != null) {
      originTile.releasePointerCapture(pointerId);
    }
  }

  setHoverTarget(target) {
    if (this.dragState?.target?.tile && (!target || this.dragState.target.tile !== target.tile)) {
      this.dragState.target.tile.classList.remove('is-target');
    }
    if (target && target.tile) {
      target.tile.classList.add('is-target');
      this.dragState.target = target;
    } else if (this.dragState) {
      this.dragState.target = null;
    }
  }

  clearDragState() {
    if (this.dragState?.tile) {
      this.dragState.tile.classList.remove('is-selected');
    }
    if (this.dragState?.target?.tile) {
      this.dragState.target.tile.classList.remove('is-target');
    }
    this.dragState = null;
  }

  attemptSwap(origin, target) {
    if (this.processing || this.gameOver) {
      return;
    }
    if (!this.isAdjacent(origin, target)) {
      this.updateMessage('Déplacez-vous seulement vers une case voisine.');
      return;
    }
    this.processing = true;
    this.swapTiles(origin, target);
    this.updateTileElement(origin.row, origin.col, this.board[origin.row][origin.col]);
    this.updateTileElement(target.row, target.col, this.board[target.row][target.col]);
    const matches = this.findMatches();
    if (!matches.length) {
      this.swapTiles(origin, target);
      this.updateTileElement(origin.row, origin.col, this.board[origin.row][origin.col]);
      this.updateTileElement(target.row, target.col, this.board[target.row][target.col]);
      this.processing = false;
      this.updateMessage('Aucun alignement créé, échange annulé.');
      return;
    }
    this.stats.moves += 1;
    this.startCascade(matches);
  }

  startCascade(initialMatches) {
    this.comboChain = 0;
    this.resolveCascade(initialMatches);
  }

  resolveCascade(matches) {
    if (!matches.length) {
      this.finishCascade();
      return;
    }
    const matchGroups = this.extractMatchGroups(matches);
    this.applyMatchRewards(matchGroups);
    this.comboChain += 1;
    this.stats.totalCleared += matches.length;
    matches.forEach(position => {
      const tile = this.tiles[position.row][position.col];
      if (tile) {
        tile.classList.add('is-clearing');
      }
    });
    window.setTimeout(() => {
      matches.forEach(position => {
        this.board[position.row][position.col] = null;
        this.updateTileElement(position.row, position.col, null);
      });
      window.setTimeout(() => {
        this.applyGravity();
        this.fillEmptySpaces();
        this.refreshBoard();
        const nextMatches = this.findMatches();
        if (nextMatches.length) {
          this.resolveCascade(nextMatches);
        } else {
          this.finishCascade();
        }
      }, METAUX_REFILL_DELAY);
    }, METAUX_CLEAR_STEP_DELAY);
  }

  finishCascade() {
    this.stats.lastCombo = this.comboChain;
    if (this.comboChain > this.stats.bestCombo) {
      this.stats.bestCombo = this.comboChain;
    }
    this.updateStats();
    if (this.comboChain > 1) {
      this.updateMessage(`Combo x${this.comboChain} ! Réaction en chaîne réussie.`);
    } else if (this.comboChain === 1) {
      this.updateMessage('Alignement complet ! De nouveaux lingots tombent.');
    }
    this.comboChain = 0;
    this.processing = false;
    if (this.gameOver) {
      return;
    }
    if (!this.hasAvailableMoves()) {
      this.forceReshuffle(false);
    }
  }

  applyGravity() {
    for (let col = 0; col < METAUX_COLS; col += 1) {
      let writeRow = METAUX_ROWS - 1;
      for (let row = METAUX_ROWS - 1; row >= 0; row -= 1) {
        const value = this.board[row][col];
        if (value) {
          this.board[writeRow][col] = value;
          if (writeRow !== row) {
            this.board[row][col] = null;
          }
          writeRow -= 1;
        }
      }
      for (let fillRow = writeRow; fillRow >= 0; fillRow -= 1) {
        this.board[fillRow][col] = null;
      }
    }
  }

  fillEmptySpaces() {
    for (let col = 0; col < METAUX_COLS; col += 1) {
      for (let row = 0; row < METAUX_ROWS; row += 1) {
        if (!this.board[row][col]) {
          this.board[row][col] = this.generateTileFor(row, col);
        }
      }
    }
  }

  findMatches() {
    const matches = [];
    const seen = new Set();
    const mark = (row, col) => {
      const key = `${row},${col}`;
      if (!seen.has(key)) {
        seen.add(key);
        matches.push({ row, col });
      }
    };
    // Horizontal
    for (let row = 0; row < METAUX_ROWS; row += 1) {
      let streakType = null;
      let streakLength = 0;
      for (let col = 0; col <= METAUX_COLS; col += 1) {
        const current = col < METAUX_COLS ? this.board[row][col] : null;
        if (current && current === streakType) {
          streakLength += 1;
        } else {
          if (streakType && streakLength >= 3) {
            for (let offset = 1; offset <= streakLength; offset += 1) {
              mark(row, col - offset);
            }
          }
          streakType = current;
          streakLength = current ? 1 : 0;
        }
      }
    }
    // Vertical
    for (let col = 0; col < METAUX_COLS; col += 1) {
      let streakType = null;
      let streakLength = 0;
      for (let row = 0; row <= METAUX_ROWS; row += 1) {
        const current = row < METAUX_ROWS ? this.board[row][col] : null;
        if (current && current === streakType) {
          streakLength += 1;
        } else {
          if (streakType && streakLength >= 3) {
            for (let offset = 1; offset <= streakLength; offset += 1) {
              mark(row - offset, col);
            }
          }
          streakType = current;
          streakLength = current ? 1 : 0;
        }
      }
    }
    return matches;
  }

  hasExistingMatches() {
    return this.findMatches().length > 0;
  }

  hasAvailableMoves() {
    for (let row = 0; row < METAUX_ROWS; row += 1) {
      for (let col = 0; col < METAUX_COLS; col += 1) {
        const current = this.board[row][col];
        if (!current) {
          continue;
        }
        const right = { row, col: col + 1 };
        const down = { row: row + 1, col };
        if (this.isValidPosition(right.row, right.col) && this.wouldCreateMatch({ row, col }, right)) {
          return true;
        }
        if (this.isValidPosition(down.row, down.col) && this.wouldCreateMatch({ row, col }, down)) {
          return true;
        }
      }
    }
    return false;
  }

  wouldCreateMatch(origin, target) {
    if (!this.isValidPosition(origin.row, origin.col) || !this.isValidPosition(target.row, target.col)) {
      return false;
    }
    this.swapTiles(origin, target);
    const result = this.hasMatchAt(origin.row, origin.col) || this.hasMatchAt(target.row, target.col);
    this.swapTiles(origin, target);
    return result;
  }

  hasMatchAt(row, col) {
    const type = this.board[row][col];
    if (!type) {
      return false;
    }
    const horizontal = 1 + this.countDirection(row, col, 0, -1, type) + this.countDirection(row, col, 0, 1, type);
    if (horizontal >= 3) {
      return true;
    }
    const vertical = 1 + this.countDirection(row, col, -1, 0, type) + this.countDirection(row, col, 1, 0, type);
    return vertical >= 3;
  }

  countDirection(row, col, deltaRow, deltaCol, type) {
    let count = 0;
    let currentRow = row + deltaRow;
    let currentCol = col + deltaCol;
    while (this.isValidPosition(currentRow, currentCol) && this.board[currentRow][currentCol] === type) {
      count += 1;
      currentRow += deltaRow;
      currentCol += deltaCol;
    }
    return count;
  }

  swapTiles(a, b) {
    const temp = this.board[a.row][a.col];
    this.board[a.row][a.col] = this.board[b.row][b.col];
    this.board[b.row][b.col] = temp;
  }

  isAdjacent(a, b) {
    const rowDelta = Math.abs(a.row - b.row);
    const colDelta = Math.abs(a.col - b.col);
    return (rowDelta === 1 && colDelta === 0) || (rowDelta === 0 && colDelta === 1);
  }

  isValidPosition(row, col) {
    return row >= 0 && row < METAUX_ROWS && col >= 0 && col < METAUX_COLS;
  }

  forceReshuffle(manual = true) {
    if (this.gameOver) {
      this.updateMessage('Partie terminée : relancez la forge pour recommencer.');
      return;
    }
    if (!this.initialized) {
      this.initialize();
    }
    const pool = [];
    for (let row = 0; row < METAUX_ROWS; row += 1) {
      for (let col = 0; col < METAUX_COLS; col += 1) {
        pool.push(this.board[row][col]);
      }
    }
    let attempts = 0;
    let success = false;
    while (attempts < METAUX_MAX_SHUFFLE_ATTEMPTS && !success) {
      attempts += 1;
      shuffleArray(pool);
      this.assignFromArray(pool);
      if (!this.hasExistingMatches() && this.hasAvailableMoves()) {
        success = true;
      }
    }
    if (!success) {
      this.populateBoard();
    }
    this.refreshBoard();
    this.stats.reshuffles += 1;
    this.updateStats();
    this.updateMessage(manual ? 'Grille re-mélangée.' : 'Aucun coup possible, réorganisation automatique.');
  }

  assignFromArray(values) {
    let index = 0;
    for (let row = 0; row < METAUX_ROWS; row += 1) {
      for (let col = 0; col < METAUX_COLS; col += 1) {
        this.board[row][col] = values[index % values.length] || METAUX_TILE_TYPES[0].id;
        index += 1;
      }
    }
  }

  resetStats() {
    this.stats = {
      lastCombo: 0,
      bestCombo: 0,
      totalCleared: 0,
      reshuffles: 0,
      moves: 0
    };
  }

  createEmptyMatchHistory() {
    const perType = new Map();
    METAUX_TILE_TYPES.forEach(type => {
      perType.set(type.id, 0);
    });
    return {
      totalMatches: 0,
      perType
    };
  }

  enterIdleState(options = {}) {
    const message = Object.prototype.hasOwnProperty.call(options, 'message')
      ? options.message
      : 'Utilisez un crédit Bonus Particules pour lancer une nouvelle partie.';
    this.pauseTimer();
    this.clearDragState();
    this.processing = false;
    this.comboChain = 0;
    this.gameOver = true;
    this.timerState.totalElapsedMs = 0;
    this.timerState.current = 0;
    this.timerState.lastUpdate = null;
    this.timerState.running = false;
    this.matchHistory = this.createEmptyMatchHistory();
    this.lastMatchPerType = new Map(METAUX_TILE_TYPES.map(type => [type.id, this.getNow()]));
    this.resetStats();
    this.updateStats();
    this.updateTimerUI();
    this.showEndScreen();
    if (message) {
      this.updateMessage(message);
    }
  }

  prepareNewSession() {
    this.resetStats();
    this.matchHistory = this.createEmptyMatchHistory();
    this.comboChain = 0;
    this.processing = false;
    this.gameOver = false;
    const now = this.getNow();
    this.lastMatchPerType = new Map(METAUX_TILE_TYPES.map(type => [type.id, now]));
    this.resetTimerState();
    this.hideEndScreen();
    this.startTimer();
    this.updateStats();
  }

  resetTimerState() {
    this.stopTimer();
    this.timerState.max = METAUX_TIMER_CONFIG.maxSeconds;
    this.timerState.current = METAUX_TIMER_CONFIG.initialSeconds;
    this.timerState.totalElapsedMs = 0;
    this.timerState.lastUpdate = null;
    this.updateTimerUI();
  }

  startTimer() {
    if (this.gameOver || this.timerState.running) {
      return;
    }
    if (this.timerState.intervalId != null) {
      window.clearInterval(this.timerState.intervalId);
      this.timerState.intervalId = null;
    }
    this.timerState.running = true;
    this.timerState.lastUpdate = this.getNow();
    this.timerState.intervalId = window.setInterval(() => {
      this.tickTimer();
    }, METAUX_TIMER_TICK_INTERVAL);
  }

  pauseTimer() {
    this.stopTimer();
  }

  stopTimer() {
    if (this.timerState.intervalId != null) {
      window.clearInterval(this.timerState.intervalId);
      this.timerState.intervalId = null;
    }
    this.timerState.running = false;
    this.timerState.lastUpdate = null;
  }

  tickTimer() {
    if (!this.timerState.running || this.gameOver) {
      return;
    }
    const now = this.getNow();
    const lastUpdate = this.timerState.lastUpdate ?? now;
    const deltaMs = Math.max(0, now - lastUpdate);
    this.timerState.lastUpdate = now;
    if (deltaMs <= 0) {
      this.evaluateColorPenalties(now);
      return;
    }
    this.timerState.totalElapsedMs += deltaMs;
    const deltaSeconds = deltaMs / 1000;
    this.timerState.current = Math.max(0, this.timerState.current - deltaSeconds);
    this.updateTimerUI();
    this.evaluateColorPenalties(now);
    if (this.timerState.current <= 0) {
      this.handleTimerExpired();
    }
  }

  handleTimerExpired() {
    if (this.gameOver) {
      return;
    }
    this.timerState.current = 0;
    this.updateTimerUI();
    this.stopTimer();
    this.gameOver = true;
    this.clearDragState();
    this.updateMessage('Temps écoulé ! Forge interrompue.');
    this.showEndScreen();
    this.notifySessionEnd();
  }

  addTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0 || this.gameOver) {
      return;
    }
    const nextValue = Math.min(this.timerState.max, this.timerState.current + seconds);
    this.timerState.current = nextValue;
    this.updateTimerUI();
  }

  reduceTimerMax() {
    if (METAUX_TIMER_PENALTY_AMOUNT <= 0) {
      return false;
    }
    const newMax = Math.max(METAUX_TIMER_CONFIG.minMaxSeconds, this.timerState.max - METAUX_TIMER_PENALTY_AMOUNT);
    if (newMax === this.timerState.max) {
      return false;
    }
    this.timerState.max = newMax;
    if (this.timerState.current > this.timerState.max) {
      this.timerState.current = this.timerState.max;
    }
    this.updateTimerUI();
    return true;
  }

  evaluateColorPenalties(now) {
    if (!METAUX_TIMER_PENALTY_WINDOW_MS || this.gameOver) {
      return;
    }
    METAUX_TILE_TYPES.forEach(type => {
      const lastMatch = this.lastMatchPerType.get(type.id) ?? now;
      if (now - lastMatch >= METAUX_TIMER_PENALTY_WINDOW_MS) {
        const reduced = this.reduceTimerMax();
        this.lastMatchPerType.set(type.id, now);
        if (reduced) {
          this.updateMessage(`Le chrono se contracte : ${this.getTypeLabel(type.id)} tarde à apparaître.`);
        }
      }
    });
  }

  extractMatchGroups(matches) {
    if (!matches || !matches.length) {
      return [];
    }
    const matchMap = new Map();
    matches.forEach(position => {
      const type = this.board[position.row]?.[position.col] || null;
      if (!type) {
        return;
      }
      matchMap.set(`${position.row},${position.col}`, {
        row: position.row,
        col: position.col,
        type
      });
    });
    const groups = [];
    const visited = new Set();
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1]
    ];
    for (const [key, info] of matchMap.entries()) {
      if (visited.has(key)) {
        continue;
      }
      const group = { type: info.type };
      const stack = [info];
      visited.add(key);
      while (stack.length) {
        const current = stack.pop();
        for (const [dRow, dCol] of directions) {
          const nextRow = current.row + dRow;
          const nextCol = current.col + dCol;
          const neighborKey = `${nextRow},${nextCol}`;
          if (visited.has(neighborKey)) {
            continue;
          }
          const neighbor = matchMap.get(neighborKey);
          if (neighbor && neighbor.type === group.type) {
            visited.add(neighborKey);
            stack.push(neighbor);
          }
        }
      }
      groups.push(group);
    }
    return groups;
  }

  applyMatchRewards(groups) {
    if (!groups || !groups.length) {
      return;
    }
    const now = this.getNow();
    groups.forEach(group => {
      this.recordMatch(group.type, now);
    });
    if (METAUX_TIMER_REWARD_SECONDS > 0) {
      this.addTime(METAUX_TIMER_REWARD_SECONDS * groups.length);
    }
  }

  recordMatch(type, timestamp) {
    if (!type) {
      return;
    }
    if (!this.matchHistory || !(this.matchHistory.perType instanceof Map)) {
      this.matchHistory = this.createEmptyMatchHistory();
    }
    const previous = this.matchHistory.perType.get(type) || 0;
    this.matchHistory.perType.set(type, previous + 1);
    this.matchHistory.totalMatches += 1;
    if (Number.isFinite(timestamp)) {
      this.lastMatchPerType.set(type, timestamp);
    }
  }

  populateEndScreen() {
    if (this.endTimeElement) {
      this.endTimeElement.textContent = this.formatDuration(this.timerState.totalElapsedMs);
    }
    if (this.endMatchesElement) {
      this.endMatchesElement.textContent = this.matchHistory.totalMatches.toLocaleString('fr-FR');
    }
    if (this.endMatchListElement) {
      this.endMatchListElement.innerHTML = '';
      METAUX_TILE_TYPES.forEach(type => {
        const item = document.createElement('li');
        item.className = 'metaux-end-screen__color-row';
        const label = document.createElement('span');
        label.className = 'metaux-end-screen__color-label';
        label.textContent = this.getTypeLabel(type.id);
        if (type.color) {
          label.style.setProperty('--match-color', type.color);
        } else {
          label.style.removeProperty('--match-color');
        }
        const value = document.createElement('span');
        value.className = 'metaux-end-screen__color-value';
        const count = this.matchHistory.perType.get(type.id) || 0;
        value.textContent = count.toLocaleString('fr-FR');
        item.appendChild(label);
        item.appendChild(value);
        this.endMatchListElement.appendChild(item);
      });
    }
  }

  notifySessionEnd() {
    if (typeof this.onSessionEnd !== 'function') {
      return;
    }
    const safeTotalMs = Number.isFinite(this.timerState.totalElapsedMs)
      ? Math.max(0, this.timerState.totalElapsedMs)
      : 0;
    const totalMatches = Number.isFinite(this.matchHistory.totalMatches)
      ? Math.max(0, this.matchHistory.totalMatches)
      : 0;
    const perType = {};
    if (this.matchHistory?.perType instanceof Map) {
      this.matchHistory.perType.forEach((value, key) => {
        perType[key] = Number.isFinite(value) ? Math.max(0, value) : 0;
      });
    }
    const summary = {
      elapsedMs: safeTotalMs,
      matches: totalMatches,
      perType,
      stats: {
        bestCombo: this.stats?.bestCombo || 0,
        totalCleared: this.stats?.totalCleared || 0,
        moves: this.stats?.moves || 0
      }
    };
    try {
      this.onSessionEnd(summary);
    } catch (error) {
      console.error('Erreur lors du rappel de fin de session Métaux', error);
    }
  }

  showEndScreen() {
    this.populateEndScreen();
    if (this.endScreenElement) {
      this.endScreenElement.hidden = false;
    }
  }

  hideEndScreen() {
    if (this.endScreenElement) {
      this.endScreenElement.hidden = true;
    }
  }

  updateTimerUI() {
    if (this.timerValueElement) {
      this.timerValueElement.textContent = this.formatSeconds(this.timerState.current, { decimals: 1 });
    }
    if (this.timerMaxElement) {
      this.timerMaxElement.textContent = `Max ${this.formatSeconds(this.timerState.max, { decimals: 0 })}`;
    }
    if (this.timerFillElement) {
      const ratio = this.timerState.max > 0 ? this.timerState.current / this.timerState.max : 0;
      const clampedRatio = clamp(ratio, 0, 1);
      this.timerFillElement.style.transform = `scaleX(${clampedRatio})`;
      this.timerFillElement.style.width = `${clampedRatio * 100}%`;
    }
  }

  formatSeconds(value, { decimals = 1 } = {}) {
    const safeValue = Math.max(0, Number(value) || 0);
    const options = {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    };
    return `${safeValue.toLocaleString('fr-FR', options)} s`;
  }

  formatDuration(durationMs) {
    if (!Number.isFinite(durationMs) || durationMs <= 0) {
      return '0 s';
    }
    const totalSeconds = durationMs / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds - minutes * 60;
    if (minutes > 0) {
      const secondsText = seconds.toLocaleString('fr-FR', {
        minimumFractionDigits: seconds % 1 === 0 ? 0 : 1,
        maximumFractionDigits: 1
      });
      return `${minutes.toLocaleString('fr-FR')} min ${secondsText} s`;
    }
    return `${totalSeconds.toLocaleString('fr-FR', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    })} s`;
  }

  restart() {
    if (!this.initialized) {
      this.initialize();
      return;
    }
    this.pauseTimer();
    this.clearDragState();
    this.populateBoard();
    this.refreshBoard();
    this.prepareNewSession();
    this.updateMessage('Nouvelle session : enchaînez les alliages !');
  }

  isSessionRunning() {
    return this.initialized && !this.gameOver;
  }

  getNow() {
    return typeof performance !== 'undefined' && typeof performance.now === 'function'
      ? performance.now()
      : Date.now();
  }

  updateStats() {
    if (this.lastComboElement) {
      this.lastComboElement.textContent = this.stats.lastCombo.toLocaleString('fr-FR');
    }
    if (this.bestComboElement) {
      this.bestComboElement.textContent = this.stats.bestCombo.toLocaleString('fr-FR');
    }
    if (this.totalTilesElement) {
      this.totalTilesElement.textContent = this.stats.totalCleared.toLocaleString('fr-FR');
    }
    if (this.reshufflesElement) {
      this.reshufflesElement.textContent = this.stats.reshuffles.toLocaleString('fr-FR');
    }
    if (this.movesElement) {
      this.movesElement.textContent = this.stats.moves.toLocaleString('fr-FR');
    }
  }

  updateMessage(message) {
    if (this.messageElement) {
      this.messageElement.textContent = message || '';
    }
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

window.MetauxMatch3Game = MetauxMatch3Game;

let metauxGame = null;

function initMetauxGame() {
  if (metauxGame || typeof MetauxMatch3Game !== 'function') {
    return;
  }
  if (!elements || !elements.metauxBoard) {
    return;
  }
  metauxGame = new MetauxMatch3Game({
    boardElement: elements.metauxBoard,
    timerValueElement: elements.metauxTimerValue,
    timerFillElement: elements.metauxTimerFill,
    timerMaxElement: elements.metauxTimerMaxValue,
    endScreenElement: elements.metauxEndScreen,
    endTimeElement: elements.metauxEndTimeValue,
    endMatchesElement: elements.metauxEndMatchesValue,
    endMatchListElement: elements.metauxEndMatchList,
    lastComboElement: elements.metauxLastComboValue,
    bestComboElement: elements.metauxBestComboValue,
    totalTilesElement: elements.metauxTotalTilesValue,
    reshufflesElement: elements.metauxReshufflesValue,
    movesElement: elements.metauxMovesValue,
    messageElement: elements.metauxMessage,
    onSessionEnd:
      typeof window !== 'undefined' && typeof window.handleMetauxSessionEnd === 'function'
        ? window.handleMetauxSessionEnd
        : null
  });
  metauxGame.initialize();
  if (typeof window !== 'undefined' && typeof window.updateMetauxCreditsUI === 'function') {
    window.updateMetauxCreditsUI();
  }
}

function getMetauxGame() {
  return metauxGame;
}

window.initMetauxGame = initMetauxGame;
window.getMetauxGame = getMetauxGame;
