/* ========================================================
   CONF.JS — CONFIGURAÇÕES GLOBAIS DO SITE (COMPLETO)
   ======================================================== */

(() => {

    /* ===============================
       HELPERS SEGUROS
       =============================== */
    const $ = (id) => document.getElementById(id);

    /* ===============================
       TEMA GLOBAL
       =============================== */
    let currentTheme = localStorage.getItem('theme') || 'light';

    function applyTheme(theme) {
        currentTheme = theme;

        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);

        // Atualiza TODOS os ícones de tema do site
        document.querySelectorAll('[data-theme-icon]').forEach(icon => {
            icon.classList.remove('ph-moon', 'ph-sun');
            icon.classList.add(theme === 'dark' ? 'ph-sun' : 'ph-moon');
        });
    }

    function initTheme() {
        applyTheme(currentTheme);

        const btn = $('theme-toggle');
        if (btn) {
            btn.addEventListener('click', () => {
                applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
            });
        }
    }

    /* ===============================
       CONFIG APP GLOBAL
       =============================== */
    const configApp = {

        data: JSON.parse(localStorage.getItem('study_analytics')) || {
            days: {},
            settings: {
                fontSize: 'standard',
                reduceMotion: false,
                zenMode: false,
                soundEnabled: true
            }
        },

        session: {
            currentDateKey: new Date().toLocaleDateString('pt-BR'),
            timer: null
        },

        /* ========== INIT ========== */
        init() {
            this.ensureToday();
            this.trackLogin();
            this.startTimer();
            this.applySettingsUI();
            this.setupListeners();
            this.renderAnalytics();
        },

        /* ========== CORE ========== */
        ensureToday() {
            if (!this.data.days[this.session.currentDateKey]) {
                this.data.days[this.session.currentDateKey] = {
                    date: this.session.currentDateKey,
                    totalSeconds: 0,
                    logins: []
                };
            }
        },

        trackLogin() {
            if (!sessionStorage.getItem('session_logged')) {
                const time = new Date().toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                this.data.days[this.session.currentDateKey].logins.push(time);
                sessionStorage.setItem('session_logged', 'true');
                this.saveData();
            }
        },

        startTimer() {
            this.session.timer = setInterval(() => {
                if (document.hidden) return;

                const today = new Date().toLocaleDateString('pt-BR');
                if (today !== this.session.currentDateKey) {
                    this.session.currentDateKey = today;
                    this.ensureToday();
                }

                this.data.days[this.session.currentDateKey].totalSeconds++;

                if (this.data.days[this.session.currentDateKey].totalSeconds % 5 === 0) {
                    this.saveData();
                    this.renderAnalytics();
                }
            }, 1000);
        },

        /* ========== RENDER ========== */
        renderAnalytics() {
            const feed = $('analytics-feed');
            if (!feed) return;

            feed.innerHTML = '';

            const days = Object.values(this.data.days).sort((a, b) =>
                b.date.split('/').reverse().join('')
                    .localeCompare(a.date.split('/').reverse().join(''))
            );

            let totalSeconds = 0;
            let totalVisits = 0;

            if (!days.length) {
                feed.innerHTML =
                    '<p style="text-align:center;opacity:.6">Nenhum dado ainda.</p>';
                return;
            }

            days.forEach(day => {
                totalSeconds += day.totalSeconds;
                totalVisits += day.logins.length;

                const [d, m, y] = day.date.split('/');
                const weekday = new Date(y, m - 1, d)
                    .toLocaleDateString('pt-BR', { weekday: 'long' });

                const card = document.createElement('div');
                card.className = 'day-analytics-card';
                card.innerHTML = `
                    <div class="day-info">
                        <div>
                            <div class="day-date">${d}/${m}</div>
                            <div class="day-weekday">${weekday}</div>
                        </div>
                        <div class="day-stats-row">
                            <div class="day-metric">
                                <i class="ph ph-clock"></i>
                                <span>${this.formatTime(day.totalSeconds)}</span>
                            </div>
                            <div class="day-metric">
                                <i class="ph ph-sign-in"></i>
                                <span>${day.logins.length}x</span>
                            </div>
                        </div>
                    </div>
                `;
                feed.appendChild(card);
            });

            $('total-time-global') &&
                ($('total-time-global').textContent = this.formatTime(totalSeconds, true));

            $('total-visits-global') &&
                ($('total-visits-global').textContent = totalVisits);
        },

        /* ========== UTIL ========== */
        formatTime(seconds, verbose = false) {
            const h = Math.floor(seconds / 3600);
            const m = Math.floor((seconds % 3600) / 60);
            return verbose ? `${h}h ${m}m` : (h ? `${h}h ${m}m` : `${m}m`);
        },

        saveData() {
            localStorage.setItem('study_analytics', JSON.stringify(this.data));
        },

        /* ========== SETTINGS ========== */
        setupListeners() {
            $('font-size-select')?.addEventListener('change', e => {
                this.data.settings.fontSize = e.target.value;
                this.applySettingsUI();
                this.saveData();
                this.showToast('Fonte alterada');
            });

            $('reduce-motion-toggle')?.addEventListener('change', e => {
                this.data.settings.reduceMotion = e.target.checked;
                this.saveData();
                this.showToast('Animações atualizadas');
            });

            $('zen-mode-toggle')?.addEventListener('change', e => {
                this.data.settings.zenMode = e.target.checked;
                this.applySettingsUI();
                this.saveData();
                this.showToast('Zen Mode atualizado');
            });

            $('sound-toggle')?.addEventListener('change', e => {
                this.data.settings.soundEnabled = e.target.checked;
                this.saveData();
            });
        },

        applySettingsUI() {
            const s = this.data.settings;

            document.body.classList.remove(
                'font-small',
                'font-standard',
                'font-large'
            );
            document.body.classList.add(`font-${s.fontSize}`);
            document.body.classList.toggle('zen-mode', s.zenMode);

            $('font-size-select') && ($('font-size-select').value = s.fontSize);
            $('reduce-motion-toggle') && ($('reduce-motion-toggle').checked = s.reduceMotion);
            $('zen-mode-toggle') && ($('zen-mode-toggle').checked = s.zenMode);
            $('sound-toggle') && ($('sound-toggle').checked = s.soundEnabled);
        },

        /* ========== AÇÕES PÚBLICAS ========== */
        exportarDados() {
            const data = "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(this.data));
            const a = document.createElement('a');
            a.href = data;
            a.download = 'backup_estudos.json';
            a.click();
            this.showToast('Backup exportado');
        },

        resetarStats() {
            if (confirm('Isso apagará TODO o histórico. Continuar?')) {
                this.data.days = {};
                this.session.currentDateKey =
                    new Date().toLocaleDateString('pt-BR');
                this.ensureToday();
                this.saveData();
                this.renderAnalytics();
                this.showToast('Dados resetados');
            }
        },

        limparHistorico() {
            if (confirm('Limpar histórico visual?')) {
                this.data.days = {};
                this.saveData();
                this.renderAnalytics();
                this.showToast('Histórico limpo');
            }
        },

        showToast(msg) {
            const container = $('toast-container');
            if (!container) return;

            const toast = document.createElement('div');
            toast.className = 'toast';
            toast.innerHTML = `<i class="ph ph-check-circle"></i> ${msg}`;
            container.appendChild(toast);

            setTimeout(() => toast.remove(), 3000);
        }
    };

    /* ===============================
       INIT GLOBAL
       =============================== */
    document.addEventListener('DOMContentLoaded', () => {
        initTheme();
        configApp.init();
    });

    // Disponível globalmente para botões HTML
    window.configApp = configApp;

})();