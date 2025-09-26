(() => {
  const ARCADE_TICKET_REWARD = 1;

  const defaultTicketFormatter = value => {
    const numeric = Math.max(0, Math.floor(Number(value) || 0));
    const unit = numeric === 1 ? 'ticket' : 'tickets';
    return `${numeric.toLocaleString('fr-FR')} ${unit}`;
  };

  class ParticulesGame {
    constructor(options = {}) {
      const {
        canvas,
        overlay,
        overlayButton,
        overlayMessage,
        levelLabel,
        livesLabel,
        scoreLabel,
        onTicketsEarned,
        formatTicketLabel
      } = options;

      this.canvas = canvas;
      this.overlay = overlay;
      this.overlayButton = overlayButton;
      this.overlayMessage = overlayMessage;
      this.levelLabel = levelLabel;
      this.livesLabel = livesLabel;
      this.scoreLabel = scoreLabel;
      this.onTicketsEarned = typeof onTicketsEarned === 'function' ? onTicketsEarned : null;
      this.formatTicketLabel = typeof formatTicketLabel === 'function' ? formatTicketLabel : defaultTicketFormatter;

      if (!this.canvas || !this.canvas.getContext) {
        this.enabled = false;
        return;
      }

      const context = this.canvas.getContext('2d');
      if (!context) {
        this.enabled = false;
        return;
      }

      this.enabled = true;
      this.ctx = context;
      this.level = 1;
      this.lives = 3;
      this.score = 0;
      this.ticketsEarned = 0;
      this.overlayAction = 'start';
      this.pointerActive = false;
      this.pendingResume = false;
      this.running = false;
      this.lastTimestamp = 0;
      this.animationFrameId = null;
      this.width = 0;
      this.height = 0;
      this.pixelRatio = 1;

      this.paddle = {
        widthRatio: 0.18,
        minWidthRatio: 0.1,
        heightRatio: 0.025,
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        xRatio: 0.5
      };

      this.ball = {
        radiusRatio: 0.015,
        baseSpeedRatio: 0.78,
        speedGrowthRatio: 0.08,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        radius: 0,
        stickToPaddle: true,
        inPlay: false
      };

      this.bricks = [];

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
      this.paddle.width = Math.max(this.paddle.minWidthRatio * this.width, this.paddle.widthRatio * this.width);
      this.paddle.height = Math.max(8, this.paddle.heightRatio * this.height);
      this.paddle.y = this.height - this.paddle.height * 3;
      this.paddle.x = Math.max(0, Math.min(this.width - this.paddle.width, this.paddle.xRatio * this.width - this.paddle.width / 2));
      this.ball.radius = Math.max(6, this.ball.radiusRatio * Math.min(this.width, this.height));
      if (this.ball.stickToPaddle) {
        this.updateBallFollowingPaddle();
      }
      this.updateHud();
      this.render();
    }

    setupLevel() {
      if (!this.enabled) return;
      const cols = Math.min(12, 6 + Math.floor((this.level - 1) / 2));
      const rows = Math.min(8, 3 + Math.floor((this.level - 1) / 3));
      const brickWidth = 0.8 / cols;
      const brickHeight = 0.25 / rows;
      const offsetX = (1 - brickWidth * cols) / 2;
      const offsetY = 0.12;
      this.bricks = [];
      for (let row = 0; row < rows; row += 1) {
        for (let col = 0; col < cols; col += 1) {
          const hue = (row * 36 + col * 14 + this.level * 24) % 360;
          this.bricks.push({
            relX: offsetX + col * brickWidth,
            relY: offsetY + row * brickHeight,
            relWidth: brickWidth * 0.92,
            relHeight: brickHeight * 0.9,
            hue,
            active: true
          });
        }
      }
      this.prepareServe();
      this.updateHud();
      this.render();
    }

    prepareServe() {
      this.ball.stickToPaddle = true;
      this.ball.inPlay = false;
      this.ball.vx = 0;
      this.ball.vy = 0;
      this.updateBallFollowingPaddle();
    }

    updateBallFollowingPaddle() {
      const paddleCenter = this.paddle.x + this.paddle.width / 2;
      this.ball.x = paddleCenter;
      this.ball.y = this.paddle.y - this.ball.radius * 1.6;
    }

    launchBall() {
      if (!this.enabled) return;
      this.ball.stickToPaddle = false;
      this.ball.inPlay = true;
      const angle = (-Math.PI / 2) * 0.7 + Math.random() * (Math.PI / 3);
      const speed = this.getBallSpeed();
      this.ball.vx = Math.cos(angle) * speed;
      this.ball.vy = Math.sin(angle) * speed;
      this.startAnimation();
    }

    getBallSpeed() {
      const base = (this.width + this.height) / (2 * Math.max(this.pixelRatio, 0.5));
      const ratio = this.ball.baseSpeedRatio + this.ball.speedGrowthRatio * (this.level - 1);
      const speedPerMillisecond = base * ratio * 0.0006;
      return Math.max(0.25, speedPerMillisecond);
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
      const now = typeof timestamp === 'number' ? timestamp : performance.now();
      const delta = Math.min(32, now - this.lastTimestamp);
      this.lastTimestamp = now;
      this.update(delta);
      this.render();
      this.animationFrameId = requestAnimationFrame(this.handleFrame);
    }

    update(delta) {
      if (!this.ball.inPlay) {
        if (this.ball.stickToPaddle) {
          this.updateBallFollowingPaddle();
        }
        return;
      }
      this.ball.x += this.ball.vx * delta;
      this.ball.y += this.ball.vy * delta;
      this.handleWallCollisions();
      this.handlePaddleCollision();
      this.handleBrickCollisions();
    }

    handleWallCollisions() {
      if (this.ball.x - this.ball.radius <= 0) {
        this.ball.x = this.ball.radius;
        this.ball.vx = Math.abs(this.ball.vx);
      } else if (this.ball.x + this.ball.radius >= this.width) {
        this.ball.x = this.width - this.ball.radius;
        this.ball.vx = -Math.abs(this.ball.vx);
      }
      if (this.ball.y - this.ball.radius <= 0) {
        this.ball.y = this.ball.radius;
        this.ball.vy = Math.abs(this.ball.vy);
      }
      if (this.ball.y - this.ball.radius > this.height) {
        this.handleLifeLost();
      }
    }

    handlePaddleCollision() {
      if (
        !this.ball.inPlay
        || this.ball.vy <= 0
        || this.ball.y + this.ball.radius < this.paddle.y
        || this.ball.y - this.ball.radius > this.paddle.y + this.paddle.height
        || this.ball.x + this.ball.radius < this.paddle.x
        || this.ball.x - this.ball.radius > this.paddle.x + this.paddle.width
      ) {
        return;
      }
      const relative = (this.ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
      const clamped = Math.max(-1, Math.min(1, relative));
      const angle = clamped * (Math.PI / 3);
      const speed = this.getBallSpeed();
      this.ball.vx = speed * Math.sin(angle);
      this.ball.vy = -Math.abs(speed * Math.cos(angle));
      this.ball.y = this.paddle.y - this.ball.radius - 1;
    }

    handleBrickCollisions() {
      if (!this.ball.inPlay) return;
      for (const brick of this.bricks) {
        if (!brick.active) continue;
        const x = brick.relX * this.width;
        const y = brick.relY * this.height;
        const w = brick.relWidth * this.width;
        const h = brick.relHeight * this.height;
        if (
          this.ball.x + this.ball.radius < x
          || this.ball.x - this.ball.radius > x + w
          || this.ball.y + this.ball.radius < y
          || this.ball.y - this.ball.radius > y + h
        ) {
          continue;
        }
        const overlapLeft = this.ball.x + this.ball.radius - x;
        const overlapRight = x + w - (this.ball.x - this.ball.radius);
        const overlapTop = this.ball.y + this.ball.radius - y;
        const overlapBottom = y + h - (this.ball.y - this.ball.radius);
        const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
        if (minOverlap === overlapLeft) {
          this.ball.x = x - this.ball.radius;
          this.ball.vx = -Math.abs(this.ball.vx);
        } else if (minOverlap === overlapRight) {
          this.ball.x = x + w + this.ball.radius;
          this.ball.vx = Math.abs(this.ball.vx);
        } else if (minOverlap === overlapTop) {
          this.ball.y = y - this.ball.radius;
          this.ball.vy = -Math.abs(this.ball.vy);
        } else {
          this.ball.y = y + h + this.ball.radius;
          this.ball.vy = Math.abs(this.ball.vy);
        }
        brick.active = false;
        this.score += 100;
        this.updateHud();
        const hasRemaining = this.bricks.some(entry => entry.active);
        if (!hasRemaining) {
          this.handleLevelCleared();
        }
        break;
      }
    }

    handleLevelCleared() {
      this.ball.inPlay = false;
      this.stopAnimation();
      const completedLevel = this.level;
      const reward = ARCADE_TICKET_REWARD;
      this.ticketsEarned += reward;
      if (this.onTicketsEarned) {
        this.onTicketsEarned(reward, { level: completedLevel, score: this.score });
      }
      this.level += 1;
      this.setupLevel();
      const rewardLabel = `+${this.formatTicketLabel(reward)}`;
      this.showOverlay({
        message: `Niveau ${completedLevel} terminé ! ${rewardLabel}.`,
        buttonLabel: 'Continuer',
        action: 'next'
      });
    }

    handleLifeLost() {
      if (!this.ball.inPlay) {
        return;
      }
      this.ball.inPlay = false;
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
      this.ball.inPlay = false;
      this.stopAnimation();
      this.prepareServe();
      const ticketSummary = this.formatTicketLabel(this.ticketsEarned);
      const message = this.ticketsEarned > 0
        ? `Partie terminée ! Tickets gagnés : ${ticketSummary}.`
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
      this.lives = 3;
      this.score = 0;
      this.ticketsEarned = 0;
      this.pendingResume = false;
      this.setupLevel();
      this.hideOverlay();
      this.launchBall();
    }

    resumeFromPause() {
      this.pendingResume = false;
      this.hideOverlay();
      this.launchBall();
    }

    startNextLevel() {
      this.hideOverlay();
      this.setupLevel();
      this.launchBall();
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
      const clampedRatio = Math.min(Math.max(ratio, 0), 1);
      const center = clampedRatio * this.width;
      const minX = 0;
      const maxX = Math.max(0, this.width - this.paddle.width);
      this.paddle.x = Math.min(Math.max(center - this.paddle.width / 2, minX), maxX);
      this.paddle.xRatio = (this.paddle.x + this.paddle.width / 2) / this.width;
      if (this.ball.stickToPaddle) {
        this.updateBallFollowingPaddle();
      }
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
      if (this.ball.inPlay && !this.isOverlayVisible()) {
        this.startAnimation();
      } else {
        this.render();
      }
    }

    onLeave() {
      if (!this.enabled) return;
      if (this.ball.inPlay && !this.isOverlayVisible()) {
        this.pendingResume = true;
        this.prepareServe();
      }
      this.stopAnimation();
    }

    render() {
      if (!this.enabled) return;
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      const background = ctx.createLinearGradient(0, 0, this.width, this.height);
      background.addColorStop(0, 'rgba(18, 24, 56, 0.6)');
      background.addColorStop(1, 'rgba(6, 10, 28, 0.92)');
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, this.width, this.height);

      const hasRoundRect = typeof ctx.roundRect === 'function';
      this.bricks.forEach(brick => {
        if (!brick.active) return;
        const x = brick.relX * this.width;
        const y = brick.relY * this.height;
        const w = brick.relWidth * this.width;
        const h = brick.relHeight * this.height;
        const gradient = ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, `hsla(${brick.hue}, 75%, 62%, 0.95)`);
        gradient.addColorStop(1, `hsla(${brick.hue + 12}, 65%, 48%, 0.9)`);
        ctx.fillStyle = gradient;
        const radius = Math.min(12, h * 0.4);
        if (hasRoundRect) {
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, radius);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = Math.max(1, h * 0.06);
          ctx.stroke();
        } else {
          ctx.fillRect(x, y, w, h);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
          ctx.lineWidth = Math.max(1, h * 0.06);
          ctx.strokeRect(x, y, w, h);
        }
      });

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

      const ballGradient = ctx.createRadialGradient(
        this.ball.x - this.ball.radius / 3,
        this.ball.y - this.ball.radius / 3,
        this.ball.radius * 0.2,
        this.ball.x,
        this.ball.y,
        this.ball.radius
      );
      ballGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      ballGradient.addColorStop(1, 'rgba(120, 200, 255, 0.9)');
      ctx.fillStyle = ballGradient;
      ctx.beginPath();
      ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.strokeStyle = 'rgba(150, 220, 255, 0.25)';
      ctx.lineWidth = Math.max(1, this.ball.radius * 0.25);
      ctx.beginPath();
      ctx.arc(this.ball.x, this.ball.y, this.ball.radius * 1.2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
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
