document.addEventListener('DOMContentLoaded', () => {
    const notifBtn = document.getElementById('notif-btn');
    const notifDropdown = document.getElementById('notif-dropdown');
    const notifList = document.getElementById('notif-list');
    const notifCounter = document.getElementById('notif-counter');

    if (!notifBtn || !notifDropdown || !notifList || !notifCounter) return;

    // 🔁 CONTROLE GLOBAL
    const NOTIF_VERSION = 1; // ← MUDE ISSO quando quiser que apareça de novo
    const LAST_SEEN = Number(sessionStorage.getItem('notifVersion')) || 0;

    // ===== NOTIFICAÇÕES =====
    const notifications = [
    {
        titulo: "Feliz ano novo, aproveite o ano de 2026 muitas felicidades a todos!",
        tempo: "03/01/2026",
        icone: "ph-beer-bottle",
        link: "index.html"
    }
];
    function renderNotifications() {
        notifList.innerHTML = '';

        // Se já viu essa versão, não mostra nada
        if (LAST_SEEN >= NOTIF_VERSION) {
            notifCounter.style.display = 'none';
            notifList.innerHTML =
                '<div class="notif-empty">Nenhuma notificação nova</div>';
            return;
        }

        notifCounter.innerText = notifications.length;
        notifCounter.style.display = 'flex';

        notifications.forEach(item => {
            const el = document.createElement(item.link !== 'none' ? 'a' : 'div');
            if (item.link !== 'none') el.href = item.link;

            el.className = 'notif-item';
            el.innerHTML = `
                <i class="ph ${item.icone}"></i>
                <div class="notif-text">
                    <b>${item.titulo}</b>
                    <small>${item.tempo}</small>
                </div>
            `;

            el.addEventListener('click', () => {
                sessionStorage.setItem('notifVersion', NOTIF_VERSION);
                renderNotifications();
            });

            notifList.appendChild(el);
        });
    }

    notifBtn.addEventListener('click', e => {
        e.stopPropagation();
        notifDropdown.classList.toggle('active');
    });

    window.addEventListener('click', () => {
        notifDropdown.classList.remove('active');
    });

    notifDropdown.addEventListener('click', e => e.stopPropagation());

    renderNotifications();
});