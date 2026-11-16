class UI {
    constructor(canvas, levels) {
        this.canvas = canvas;
        this.levels = levels;
        this.levelIndex = 0;
        this.game = null;

        // экраны
        this.screenSplash = document.getElementById('screen-splash');
        this.screenLevels = document.getElementById('screen-levels');
        this.screenGame = document.getElementById('screen-game');

        // обёртки для масштабирования
        this.appWrap = document.querySelector('.app-wrap');
        this.appScaler = document.getElementById('game-scaler');
        this.app = document.getElementById('game-app');

        // заставка
        this.btnStartGame = document.getElementById('btn-start-game');
        this.splashOverlay = document.getElementById('splash-image-overlay');

        // экран выбора
        this.levelsListEl = document.getElementById('levels-list');
        this.btnLevelsBack = document.getElementById('btn-levels-back');

        // игровая панель
        this.btnGo = document.getElementById('btn-go');
        this.btnRestart = document.getElementById('btn-restart');
        this.btnLevels = document.getElementById('btn-levels');
        this.arrowsLeftEl = document.getElementById('arrows-left');
        this.cupsCollectedEl = document.getElementById('cups-collected');
        this.cupsTotalEl = document.getElementById('cups-total');
        this.arrowBtns = Array.from(document.querySelectorAll('.arrow-btn'));

        // модалка победы
        this.winModal = document.getElementById('win-modal');
        this.winTitle = document.getElementById('win-title');
        this.winText = document.getElementById('win-text');
        this.btnNext = document.getElementById('btn-next-level');
        this.btnCancelWin = document.getElementById('btn-cancel-win');

        // модалка проигрыша
        this.loseModal = document.getElementById('lose-modal');
        this.loseTitle = document.getElementById('lose-title');
        this.loseText = document.getElementById('lose-text');
        this.btnRestartLose = document.getElementById('btn-restart-lose');
        this.btnCancelLose = document.getElementById('btn-cancel-lose');

        this._buildLevelsList();
        this._bind();

        this.showSplash();
        this._startSplashTimer();

        // первичный расчёт масштаба (может быть 0, если экран скрыт — это ок)
        requestAnimationFrame(() => this._updateScale());
    }

    // ─────────── масштабирование композиции ───────────
    _updateScale() {
        if (!this.app || !this.appWrap || !this.appScaler) return;

        const compW = this.app.scrollWidth;
        const compH = this.app.scrollHeight;

        if (compW === 0 || compH === 0) return;

        const wrapW = this.appWrap.clientWidth - 40;
        const wrapH = this.appWrap.clientHeight - 40;

        if (wrapW <= 0 || wrapH <= 0) return;

        const scale = Math.min(1, wrapW / compW, wrapH / compH);

        this.app.style.transform = `scale(${scale})`;
        this.app.style.transformOrigin = 'top left';

        this.appScaler.style.width = (compW * scale) + 'px';
        this.appScaler.style.height = (compH * scale) + 'px';
    }

    // ─────────── экраны ───────────
    _hideAllScreens() {
        this.screenSplash.classList.add('hidden');
        this.screenLevels.classList.add('hidden');
        this.screenGame.classList.add('hidden');
    }

    showSplash() {
        if (this.game) this.game.stop();
        this.hideWinModal();
        this.hideLoseModal();
        this._hideAllScreens();
        this.screenSplash.classList.remove('hidden');
    }

    _startSplashTimer() {
        if (!this.splashOverlay) return;
        setTimeout(() => {
            this.splashOverlay.classList.add('fade-out');
            setTimeout(() => {
                this.splashOverlay.classList.add('hidden');
            }, 400);
        }, 2000);
    }

    showLevels() {
        if (this.game) this.game.stop();
        this.hideWinModal();
        this.hideLoseModal();
        this._hideAllScreens();
        this.screenLevels.classList.remove('hidden');
    }

    showGame(idx) {
        this._hideAllScreens();
        this.screenGame.classList.remove('hidden');
        this.loadLevel(idx);
        requestAnimationFrame(() => this._updateScale());
    }

    // ─────────── список уровней ───────────
    _buildLevelsList() {
        this.levelsListEl.innerHTML = '';
        this.levels.forEach((lvl, i) => {
            const btn = document.createElement('button');
            btn.className = 'level-btn';
            btn.textContent = i + 1;
            btn.title = lvl.name;
            btn.addEventListener('click', () => this.showGame(i));
            this.levelsListEl.appendChild(btn);
        });
    }

    // ─────────── игра ───────────
    loadLevel(idx) {
        if (this.game) this.game.stop();
        this.hideWinModal();
        this.hideLoseModal();
        this.levelIndex = idx;
        const level = new Level(this.levels[idx]);
        this.game = new Game(this.canvas, level);
        this.game.onChange(g => this.refresh(g));
        this.game.onWin(g => this.showWinModal(g));
        this.game.onLose(g => this.showLoseModal(g));
        this.refresh(this.game);
    }

    refresh(game) {
        this.arrowsLeftEl.textContent = game.arrowsLeft;
        this.cupsCollectedEl.textContent = game.cupsCollected;
        this.cupsTotalEl.textContent = game.cupsTotal;
        this.btnGo.disabled = game.running || game.won || game.lost;

        for (const b of this.arrowBtns) {
            b.classList.toggle('active', b.dataset.dir === game.selectedDir);
        }
    }

    // ─────────── модалка победы ───────────
    showWinModal(game) {
        const hasNext = this.levelIndex + 1 < this.levels.length;
        const levelName = this.levels[this.levelIndex].name;

        this.winTitle.textContent = `Уровень пройден!`;
        this.winText.textContent = hasNext
            ? `${levelName} — все кубки собраны. Хотите перейти к следующему уровню?`
            : `${levelName} — все кубки собраны. Это последний уровень.`;

        this.btnNext.style.display = hasNext ? '' : 'none';
        this.winModal.classList.remove('hidden');
    }

    hideWinModal() {
        this.winModal.classList.add('hidden');
    }

    // ─────────── модалка проигрыша ───────────
    showLoseModal(game) {
        const reasons = {
            pit: 'Корова упала в яму!',
            negativeCow: 'Корова столкнулась со злой коровой!',
        };
        this.loseTitle.textContent = 'Корова попала в беду!';
        this.loseText.textContent = reasons[game.loseReason] || 'Попробуйте ещё раз.';
        this.loseModal.classList.remove('hidden');
    }

    hideLoseModal() {
        this.loseModal.classList.add('hidden');
    }

    // ─────────── обработчики ───────────
    _bind() {
        // заставка
        this.btnStartGame.addEventListener('click', () => this.showLevels());

        // экран выбора
        this.btnLevelsBack.addEventListener('click', () => this.showSplash());

        // панель игры
        this.btnGo.addEventListener('click', () => this.game.start());
        this.btnRestart.addEventListener('click', () => this.loadLevel(this.levelIndex));
        this.btnLevels.addEventListener('click', () => this.showLevels());

        for (const btn of this.arrowBtns) {
            btn.addEventListener('click', () => {
                if (!this.game || this.game.running || this.game.won || this.game.lost) return;
                this.game.setSelectedDir(btn.dataset.dir);
            });
        }

        this.canvas.addEventListener('click', (e) => {
            if (!this.game || this.game.running || this.game.won || this.game.lost) return;
            const rect = this.canvas.getBoundingClientRect();
            const cellW = rect.width / CONFIG.COLS;
            const cellH = rect.height / CONFIG.ROWS;
            const x = Math.floor((e.clientX - rect.left) / cellW);
            const y = Math.floor((e.clientY - rect.top) / cellH);
            this.game.handleCellClick(x, y);
        });

        // модалка победы
        this.btnNext.addEventListener('click', () => {
            const next = this.levelIndex + 1;
            if (next < this.levels.length) this.loadLevel(next);
            else this.showLevels();
        });

        this.btnCancelWin.addEventListener('click', () => this.hideWinModal());

        // модалка проигрыша
        this.btnRestartLose.addEventListener('click', () => {
            this.hideLoseModal();
            this.loadLevel(this.levelIndex);
        });

        this.btnCancelLose.addEventListener('click', () => this.hideLoseModal());

        // пересчёт масштаба при ресайзе
        window.addEventListener('resize', () => this._updateScale());
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    new UI(canvas, LEVELS);
});