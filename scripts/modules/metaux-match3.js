const GLOBAL_METAUX_CONFIG =
  typeof window !== 'undefined' && window.GAME_CONFIG ? window.GAME_CONFIG.metaux : null;

const DEFAULT_METAUX_CONFIG = {
  rows: 9,
  cols: 16,
  clearDelayMs: 200,
  maxShuffleAttempts: 120,
  tileTypes: [
    { id: 'bronze', label: 'Bronze', color: 'rgba(199, 126, 54, 0.72)' },
    { id: 'argent', label: 'Argent', color: 'rgba(173, 190, 202, 0.78)' },
    { id: 'or', label: 'Or', color: 'rgba(245, 204, 79, 0.82)' },
    { id: 'platine', label: 'Platine', color: 'rgba(166, 211, 227, 0.82)' },
    { id: 'diamant', label: 'Diamant', color: 'rgba(130, 217, 255, 0.88)' }
  ]
};

function toPositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
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
const METAUX_MAX_SHUFFLE_ATTEMPTS = toPositiveInteger(
  METAUX_CONFIG.maxShuffleAttempts,
  DEFAULT_METAUX_CONFIG.maxShuffleAttempts
);

class MetauxMatch3Game {
  constructor(options = {}) {
    this.boardElement = options.boardElement || null;
    this.lastComboElement = options.lastComboElement || null;
    this.bestComboElement = options.bestComboElement || null;
    this.totalTilesElement = options.totalTilesElement || null;
    this.reshufflesElement = options.reshufflesElement || null;
    this.movesElement = options.movesElement || null;
    this.messageElement = options.messageElement || null;
    this.optionStatusElement = options.optionStatusElement || null;
    this.board = Array.from({ length: METAUX_ROWS }, () => Array(METAUX_COLS).fill(null));
    this.tiles = Array.from({ length: METAUX_ROWS }, () => Array(METAUX_COLS).fill(null));
    this.initialized = false;
    this.processing = false;
    this.dragState = null;
    this.comboChain = 0;
    this.stats = {
      lastCombo: 0,
      bestCombo: 0,
      totalCleared: 0,
      reshuffles: 0,
      moves: 0
    };
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
    this.updateStats();
    this.updateMessage('Glissez pour échanger des lingots adjacents.');
    this.initialized = true;
  }

  onEnter() {
    if (!this.initialized) {
      this.initialize();
    } else if (this.boardElement) {
      this.updateMessage('Repérez un alignement et glissez pour fusionner les métaux.');
    }
  }

  onLeave() {
    this.clearDragState();
  }

  buildBoard() {
    if (!this.boardElement) {
      return;
    }
    this.boardElement.style.setProperty('--metaux-cols', METAUX_COLS);
    this.boardElement.style.gridTemplateColumns = `repeat(${METAUX_COLS}, minmax(0, 1fr))`;
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
    if (this.processing) {
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
    if (this.processing) {
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
      this.applyGravity();
      this.fillEmptySpaces();
      this.refreshBoard();
      const nextMatches = this.findMatches();
      if (nextMatches.length) {
        this.resolveCascade(nextMatches);
      } else {
        this.finishCascade();
      }
    }, METAUX_CLEAR_DELAY);
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
    if (this.optionStatusElement) {
      if (this.stats.lastCombo > 0) {
        this.optionStatusElement.textContent = `Dernier combo : ${this.stats.lastCombo.toLocaleString('fr-FR')}`;
      } else {
        this.optionStatusElement.textContent = '';
      }
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
    lastComboElement: elements.metauxLastComboValue,
    bestComboElement: elements.metauxBestComboValue,
    totalTilesElement: elements.metauxTotalTilesValue,
    reshufflesElement: elements.metauxReshufflesValue,
    movesElement: elements.metauxMovesValue,
    messageElement: elements.metauxMessage,
    optionStatusElement: elements.metauxOptionStatus
  });
  metauxGame.initialize();
}

function getMetauxGame() {
  return metauxGame;
}

window.initMetauxGame = initMetauxGame;
window.getMetauxGame = getMetauxGame;
