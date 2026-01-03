   // --- 1. LÓGICA DE TEMPO REAL (Simulada) ---

function formatDateBR(date) {
  const d = new Date(date);

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} às ${hour}:${minute}`;
}

function timeAgo(date) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);

  if (seconds < 10) return 'agora mesmo';
  if (seconds < 60) return `há ${seconds} segundos`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `há ${minutes} minuto${minutes !== 1 ? 's' : ''}`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours} hora${hours !== 1 ? 's' : ''}`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `há ${days} dia${days !== 1 ? 's' : ''}`;

  const months = Math.floor(days / 30);
  if (months < 12) return `há ${months} mês${months !== 1 ? 'es' : ''}`;

  const years = Math.floor(months / 12);
  return `há ${years} ano${years !== 1 ? 's' : ''}`;
}

function updateTimes() {
  document.querySelectorAll('.time-ago').forEach(el => {
    const date = el.getAttribute('data-time');

    const fixedDate = formatDateBR(date);
    const relativeTime = timeAgo(date);

    el.querySelector('.time-text').textContent =
      `${fixedDate} • ${relativeTime}`;
  });
}

updateTimes();
setInterval(updateTimes, 1000);


// --- 2. DARK MODE (Com salvamento automático) ---
const themeBtn = document.getElementById('theme-toggle');
const themeIcon = themeBtn.querySelector('i');

// Função para aplicar o tema visualmente
function setDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
        themeIcon.classList.replace('ph-moon', 'ph-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        themeIcon.classList.replace('ph-sun', 'ph-moon');
        localStorage.setItem('theme', 'light');
    }
}

// Verifica se já existe uma preferência salva ao abrir o site
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    setDarkMode(true);
}

// Evento de clique no botão de tema
themeBtn.addEventListener('click', () => {
    const isCurrentlyDark = document.body.classList.contains('dark-mode');
    setDarkMode(!isCurrentlyDark); // Inverte o estado atual
});

// --- 3. MENU MOBILE ---
// --- 3. MENU MOBILE ---
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const hamburgerIcon = hamburger.querySelector('i');

// Função centralizada para abrir/fechar e travar o scroll
function toggleMenu(isOpen) {
    if (isOpen) {
        navMenu.classList.add('active');
        hamburgerIcon.classList.replace('ph-list', 'ph-x');
        document.body.style.overflow = 'hidden'; // TRAVA O ARRASTE/SCROLL
    } else {
        navMenu.classList.remove('active');
        hamburgerIcon.classList.replace('ph-x', 'ph-list');
        document.body.style.overflow = 'auto';   // LIBERA O ARRASTE/SCROLL
    }
}

// Alternar menu ao clicar no botão
hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navMenu.classList.contains('active');
    toggleMenu(!isOpen);
});

// Fechar ao tocar fora
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        toggleMenu(false);
    }
});

// Lógica de Swipe para fechar
let touchStartX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].screenX;
    const swipeDistance = touchEndX - touchStartX;

    // Se o menu estiver ativo e o usuário deslizar para a esquerda (<-)
    if (navMenu.classList.contains('active') && swipeDistance < -50) {
        toggleMenu(false);
    }
}, { passive: true });



// --- 4. POP UP (MODAL) ---
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

function openModal(title, content) {
    modalTitle.innerText = title;
    modalBody.innerText = content;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto';
}

modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});
  // Registra o Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log("PWA Ativo!"))
      .catch((err) => console.log("Erro no PWA:", err));
  }
  
  // Lógica de Notificações
