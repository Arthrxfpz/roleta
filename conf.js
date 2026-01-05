/* ========================================================
   CONF.JS — UNIVERSAL (CORE LOGIC + ADVANCED UI)
   ======================================================== */

(() => {

    /* ===============================
       HELPERS & SELETORES
       =============================== */
    const $ = (id) => document.getElementById(id);

    /* ===============================
       SISTEMA DE TEMAS & ESTILOS GLOBAIS
       =============================== */
    let currentTheme = localStorage.getItem('theme') || 'light';

    // Injeta CSS Dinâmico (Funciona em qualquer site que puxar este script)
    function injectGlobalStyles() {
        if ($('app-global-styles')) return;

        const style = document.createElement('style');
        style.id = 'app-global-styles';
        style.innerHTML = `
            /* --- VARIÁVEIS DE TEMA --- */
            :root {
                --app-bg: #f4f6f8;
                --app-surface: #ffffff;
                --app-text: #2d3436;
                --app-text-muted: #636e72;
                --app-primary: #0984e3;
                --app-primary-hover: #74b9ff;
                --app-danger: #d63031;
                --app-border: #dfe6e9;
                --app-shadow: 0 8px 30px rgba(0,0,0,0.08);
                --app-overlay: rgba(0, 0, 0, 0.4);
            }

            body.dark-mode {
                --app-bg: #121212;
                --app-surface:black;
                --app-text: #e0e0e0;
                --app-text-muted: #a0a0a0;
                --app-primary: #74b9ff;
                --app-primary-hover: #0984e3;
                --app-danger: #ff7675;
                --app-border: #333333;
                --app-shadow: 0 10px 40px rgba(0,0,0,0.5);
                --app-overlay: rgba(0, 0, 0, 0.8);
            }

            /* --- REDUCE MOTION GLOBAL --- */
            body.reduce-motion *,
            body.reduce-motion *::before,
            body.reduce-motion *::after {
                animation: none !important;
                transition: none !important;
                scroll-behavior: auto !important;
            }

            /* --- SCROLL E LAYOUT --- */
            #analytics-feed {
                max-height: 750px;
                overflow-y: auto;
                padding-right: 5px;
            }
            #analytics-feed::-webkit-scrollbar { width: 6px; }
            #analytics-feed::-webkit-scrollbar-thumb { background-color: var(--app-border); border-radius: 10px; }
            #analytics-feed::-webkit-scrollbar-track { background: transparent; }

            /* --- MODAL & JANELA (Base) --- */
            .app-overlay {
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: var(--app-overlay); z-index: 9999;
                display: flex; justify-content: center; align-items: center;
                opacity: 0; pointer-events: none; transition: opacity 0.2s ease;
                backdrop-filter: blur(3px);
            }
            .app-overlay.active { opacity: 1; pointer-events: all; }

            .app-modal {
                background: var(--app-surface); color: var(--app-text);
                width: 90%; max-width: 420px;
                border-radius: 16px; padding: 24px;
                box-shadow: var(--app-shadow);
                transform: scale(0.95) translateY(10px);
                transition: transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 1px solid var(--app-border);
            }
            .app-overlay.active .app-modal { transform: scale(1) translateY(0); }

            /* --- JANELA (Popup) --- */
            .janela-title { font-size: 1.3rem; font-weight: 700; margin-bottom: 10px; }
            .janela-text { font-size: 1rem; color: var(--app-text-muted); margin-bottom: 24px; line-height: 1.5; }
            .janela-actions { display: flex; gap: 10px; justify-content: flex-end; }
            
            .btn-app {
                padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer;
                font-weight: 600; font-size: 0.95rem; transition: filter 0.2s;
            }
            .btn-app:hover { filter: brightness(0.9); }
            .btn-cancel { background: transparent; color: var(--app-text); border: 1px solid var(--app-border); }
            .btn-confirm { background: var(--app-primary); color: #fff; }
            .btn-danger { background: var(--app-danger); color: #fff; }

            /* --- MODAL DE DETALHES --- */
            .details-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--app-border); padding-bottom: 15px; }
            .details-header h3 { margin: 0; font-size: 1.1rem; }
            .close-icon { cursor: pointer; font-size: 1.5rem; line-height: 1; padding: 5px; opacity: 0.7; transition: 0.2s; }
            .close-icon:hover { opacity: 1; color: var(--app-danger); }

            .logins-grid { 
                display: grid; grid-template-columns: repeat(auto-fill, minmax(70px, 1fr)); 
                gap: 8px; max-height: 300px; overflow-y: auto; padding: 4px;
            }
            .login-chip {
                background: var(--app-bg); color: var(--app-text);
                border: 1px solid var(--app-border);
                padding: 8px 4px; border-radius: 8px; text-align: center;
                font-size: 0.85rem; font-family: monospace; font-weight: 600;
            }
            .login-chip:hover { border-color: var(--app-primary); color: var(--app-primary); background: var(--app-surface); }
            
            .logins-grid::-webkit-scrollbar { width: 6px; }
            .logins-grid::-webkit-scrollbar-thumb { background-color: var(--app-border); border-radius: 10px; }
            
            /* --- Toast --- */
            .toast {
                background: var(--app-surface); color: var(--app-text); border: 1px solid var(--app-border);
                padding: 12px 20px; border-radius: 50px; 
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                display: flex; align-items: center; gap: 8px; font-weight: 500;
                animation: slideUp 0.3s ease forwards; margin-top: 10px;
            }
            @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        `;
        document.head.appendChild(style);
    }

    function applyTheme(theme) {
        currentTheme = theme;
        document.body.classList.toggle('dark-mode', theme === 'dark');
        localStorage.setItem('theme', theme);
        
        document.querySelectorAll('[data-theme-icon]').forEach(icon => {
            icon.classList.remove('ph-moon', 'ph-sun');
            icon.classList.add(theme === 'dark' ? 'ph-sun' : 'ph-moon');
        });
    }

    function initTheme() {
        applyTheme(currentTheme);
        const btn = $('theme-toggle');
        if (btn) {
            btn.onclick = () => applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
        }
    }

    /* ===============================
       APP CORE
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
            injectGlobalStyles();     // CSS Universal
            this.buildUIComponents(); // HTML Modais
            
            this.ensureToday();       // Lógica Core
            this.trackLogin();        // Lógica Core
            this.startTimer();        // Lógica Core
            
            this.applySettingsUI();   // UI
            this.setupListeners();    // UI Listeners
            this.renderAnalytics();   // Render
        },

        /* ========== UI BUILDER (HTML INJETADO) ========== */
        buildUIComponents() {
            if ($('app-ui-layer')) return;

            const layer = document.createElement('div');
            layer.id = 'app-ui-layer';
            layer.innerHTML = `
                <div id="details-modal-overlay" class="app-overlay">
                    <div class="app-modal">
                        <div class="details-header">
                            <h3 id="dm-title">Detalhes</h3>
                            <span class="close-icon" id="dm-close">&times;</span>
                        </div>
                        <div id="dm-list" class="logins-grid"></div>
                    </div>
                </div>

                <div id="janela-overlay" class="app-overlay" style="z-index:10000;">
                    <div class="app-modal" style="max-width:350px;">
                        <div id="janela-title" class="janela-title">Título</div>
                        <div id="janela-msg" class="janela-text">Mensagem...</div>
                        <div id="janela-actions" class="janela-actions"></div>
                    </div>
                </div>
                
                <div id="toast-container" style="position: fixed; bottom: 20px; right: 20px; z-index: 10001; display: flex; flex-direction: column; align-items: flex-end;"></div>
            `;
            document.body.appendChild(layer);

            // Eventos Modais
            $('dm-close').onclick = () => $('details-modal-overlay').classList.remove('active');
            $('details-modal-overlay').onclick = (e) => {
                if(e.target === $('details-modal-overlay')) $('details-modal-overlay').classList.remove('active');
            };
        },

        /* ========== SISTEMA DE "JANELA" ========== */
        janela(msg, title = "Aviso") {
            return new Promise((resolve) => {
                this._showJanelaInternal(title, msg, [
                    { text: 'OK', class: 'btn-confirm', action: () => resolve(true) }
                ]);
            });
        },

        janelaConfirm(msg, title = "Confirmação", danger = false) {
            return new Promise((resolve) => {
                this._showJanelaInternal(title, msg, [
                    { text: 'Cancelar', class: 'btn-cancel', action: () => resolve(false) },
                    { text: 'Confirmar', class: danger ? 'btn-danger' : 'btn-confirm', action: () => resolve(true) }
                ]);
            });
        },

        _showJanelaInternal(title, msg, buttons) {
            const overlay = $('janela-overlay');
            const titleEl = $('janela-title');
            const msgEl = $('janela-msg');
            const actionsEl = $('janela-actions');

            titleEl.textContent = title;
            msgEl.textContent = msg;
            actionsEl.innerHTML = '';

            buttons.forEach(btn => {
                const b = document.createElement('button');
                b.className = `btn-app ${btn.class}`;
                b.textContent = btn.text;
                b.onclick = () => {
                    overlay.classList.remove('active');
                    if (btn.action) btn.action();
                };
                actionsEl.appendChild(b);
            });

            overlay.classList.add('active');
        },
                /* ========== ABERTURA DE DETALHES ========== */
        openDetails(dayData) {
            const [d, m, y] = dayData.date.split('/');
            const week = new Date(y, m - 1, d).toLocaleDateString('pt-BR', { weekday: 'long' });
            
            $('dm-title').innerHTML = `${d}/${m}/${y} <br><small style="opacity:0.6; font-weight:400; font-size:0.8em; text-transform: capitalize;">${week}</small>`;
            
            const list = $('dm-list');
            list.innerHTML = '';

            if (dayData.logins && dayData.logins.length) {
                dayData.logins.forEach(time => {
                    const chip = document.createElement('div');
                    chip.className = 'login-chip';
                    chip.textContent = time;
                    list.appendChild(chip);
                });
            } else {
                list.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:20px; opacity:0.6">Sem registros de horário.</div>';
            }

            $('details-modal-overlay').classList.add('active');
        },

/* ========== CORE LOGIC (CORRIGIDA GLOBAL) ========== */

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
    const key = `session_logged_${this.session.currentDateKey}`;

    if (!sessionStorage.getItem(key)) {
        const time = new Date().toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });

        this.data.days[this.session.currentDateKey].logins.push(time);
        sessionStorage.setItem(key, 'true');
        this.saveData();
    }
},

startTimer() {
    // Proteção: não cria timer duplicado
    if (this.session.timer) return;

    this.session.timer = setInterval(() => {
        if (document.hidden) return;

        const today = new Date().toLocaleDateString('pt-BR');

        if (today !== this.session.currentDateKey) {
            this.session.currentDateKey = today;
            this.ensureToday();

            // força novo login no novo dia
            this.trackLogin();
        }

        this.data.days[this.session.currentDateKey].totalSeconds++;

        if (this.data.days[this.session.currentDateKey].totalSeconds % 5 === 0) {
            this.saveData();
            this.renderAnalytics();
        }
    }, 1000);
},
        /* ========== RENDER ANALYTICS (COM INTERAÇÃO) ========== */
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
                feed.innerHTML = '<p style="text-align:center;opacity:.6">Nenhum dado ainda.</p>';
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
                card.style.cursor = 'pointer'; 
                
                card.innerHTML = `
                    <div class="day-info">
                        <div>
                            <div class="day-date">${d}/${m}/${y}</div>
                            <div class="day-weekday" style="text-transform: capitalize;">${weekday}</div>
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

                // Evento para abrir modal de detalhes
                card.addEventListener('click', () => this.openDetails(day));

                feed.appendChild(card);
            });

            // Atualiza os contadores globais na interface
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
                this.applySettingsUI();
                this.saveData();
                this.showToast(e.target.checked ? 'Animações desativadas' : 'Animações ativadas');
            });

            $('zen-mode-toggle')?.addEventListener('change', e => {
                this.data.settings.zenMode = e.target.checked;
                this.applySettingsUI();
                this.saveData();
                this.showToast(e.target.checked ? 'Modo Zen ativado' : 'Modo Zen desativado');
            });

            $('sound-toggle')?.addEventListener('change', e => {
                this.data.settings.soundEnabled = e.target.checked;
                this.saveData();
            });
        },

        applySettingsUI() {
            const s = this.data.settings;

            document.body.classList.remove('font-small', 'font-standard', 'font-large');
            document.body.classList.add(`font-${s.fontSize}`);
            document.body.classList.toggle('zen-mode', s.zenMode);
            
            // Aplica no BODY para CSS Global pegar
            document.body.classList.toggle('reduce-motion', s.reduceMotion);

            $('font-size-select') && ($('font-size-select').value = s.fontSize);
            $('reduce-motion-toggle') && ($('reduce-motion-toggle').checked = s.reduceMotion);
            $('zen-mode-toggle') && ($('zen-mode-toggle').checked = s.zenMode);
            $('sound-toggle') && ($('sound-toggle').checked = s.soundEnabled);
        },

 /* ========== AÇÕES PÚBLICAS (COM JANELA CUSTOMIZADA) ========== */
        exportarDados() {
            const data = "data:text/json;charset=utf-8," +
                encodeURIComponent(JSON.stringify(this.data));
            const a = document.createElement('a');
            a.href = data;
            a.download = 'backup_estudos.json';
            a.click();
            this.showToast('Backup exportado');
        },

        async resetarStats() {
            const confirmou = await this.janelaConfirm('Isso apagará TODO o histórico. Continuar?', 'Resetar Tudo', true);
            
            if (confirmou) {
                this.data.days = {};
                this.session.currentDateKey = new Date().toLocaleDateString('pt-BR');
                this.ensureToday();
                this.saveData();
                this.renderAnalytics();
                this.showToast('Dados resetados');
            }
        },

        async limparHistorico() {
            const confirmou = await this.janelaConfirm('Isso limpa a visualização, mas mantém seus dados salvos.', 'Limpar Tela', false);
            
            if (confirmou) {
                this.data.days = {};
                this.saveData();
                this.renderAnalytics();
                this.showToast('Histórico visual limpo');
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

    // Disponível globalmente
    window.configApp = configApp;

})();