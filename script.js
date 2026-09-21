/* Personaliza los nombres y el mensaje aquí. No necesitas modificar la animación. */
const CONFIG = {
  destinataria: 'Mi Niña Hermosa',
  remitente: 'Tu Amor',
  introduccion: 'Porque sé que te encantan y te\nmereces todo el mundo...',
  mensaje: '¡Flores Amarillas para el\nAmor de mi vida! 🌻',
  automatico: false,
  tiempoAbierta: 4300,
  tiempoCerrada: 1800,
};

const envelope = document.querySelector('#envelope');
const letter = document.querySelector('#letter');
const hint = document.querySelector('#hint');
const autoplayButton = document.querySelector('#autoplay');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
document.querySelector('#recipient').textContent = CONFIG.destinataria;
document.querySelector('#sender').textContent = CONFIG.remitente;
for (const [id, text] of [['intro', CONFIG.introduccion], ['message', CONFIG.mensaje]]) {
  const element = document.getElementById(id);
  element.textContent = text;
  element.style.whiteSpace = 'pre-line';
}

let opened = false;
let busy = false;
let automatic = CONFIG.automatico && !reducedMotion.matches;
let nextCycle;
const wait = ms => new Promise(resolve => setTimeout(resolve, reducedMotion.matches ? 0 : ms));

function updateControls() {
  autoplayButton.setAttribute('aria-pressed', String(automatic));
  autoplayButton.setAttribute('aria-label', automatic ? 'Pausar animación automática' : 'Activar animación automática');
  document.querySelector('#play-icon').textContent = automatic ? 'Ⅱ' : '▷';
  document.querySelector('#play-label').textContent = automatic ? 'Pausar' : 'Animar';
}

function schedule() {
  clearTimeout(nextCycle);
  if (!automatic || document.hidden || busy) return;
  nextCycle = setTimeout(() => animate(!opened), opened ? CONFIG.tiempoAbierta : CONFIG.tiempoCerrada);
}

async function animate(open) {
  if (busy) return;
  clearTimeout(nextCycle);
  busy = true;
  document.querySelector('#replay').disabled = true;
  envelope.setAttribute('aria-busy', 'true');
  if (open) {
    envelope.classList.add('turned');
    await wait(850);
    envelope.classList.add('unsealed');
    await wait(520);
    envelope.classList.add('open');
    await wait(1000);
  } else {
    envelope.classList.remove('open');
    await wait(1000);
    envelope.classList.remove('unsealed');
    await wait(650);
    envelope.classList.remove('turned');
    await wait(850);
  }
  opened = open;
  busy = false;
  document.querySelector('#replay').disabled = false;
  envelope.removeAttribute('aria-busy');
  envelope.setAttribute('aria-expanded', String(open));
  envelope.setAttribute('aria-label', open ? 'Cerrar la carta' : 'Abrir la carta');
  letter.setAttribute('aria-hidden', String(!open));
  if (open) envelope.setAttribute('aria-describedby', 'intro message');
  else envelope.removeAttribute('aria-describedby');
  hint.textContent = open ? 'Toca el sobre para cerrarlo' : 'Toca el sobre para abrirlo';
  schedule();
}

function toggleEnvelope() {
  if (busy) return;
  automatic = false;
  clearTimeout(nextCycle);
  updateControls();
  if (opened) song.pause();
  else playMusic(true);
  animate(!opened);
}
envelope.addEventListener('click', toggleEnvelope);
envelope.addEventListener('keydown', event => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleEnvelope();
  }
});
autoplayButton.addEventListener('click', () => {
  automatic = !automatic;
  if (automatic) playMusic();
  updateControls();
  schedule();
});
document.querySelector('#replay').addEventListener('click', async () => {
  if (busy) return;
  automatic = false;
  clearTimeout(nextCycle);
  updateControls();
  playMusic(true);
  if (opened) await animate(false);
  await animate(true);
});
document.addEventListener('visibilitychange', schedule);
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    automatic = false;
    updateControls();
    schedule();
  }
});
updateControls();
schedule();

// Audio local: play() se llama directamente desde el clic para conservar
// la activación del usuario, incluso mientras se anima la apertura.
const song = document.querySelector('#song');
const musicToggle = document.querySelector('#music-toggle');
const musicStatus = document.querySelector('#music-status');
song.volume = 0.7;

function updateMusic() {
  const playing = !song.paused && !song.ended;
  musicToggle.setAttribute('aria-pressed', String(playing));
  musicToggle.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
  document.querySelector('#music-label').textContent = playing ? 'Pausar música' : 'Música';
}

function playMusic(restart = false) {
  musicStatus.textContent = '';
  if (restart || song.ended) song.currentTime = 0;
  song.play().catch(error => {
    if (error.name === 'AbortError') return;
    musicStatus.textContent = error.name === 'NotAllowedError'
      ? 'Toca Música para escuchar la canción.'
      : 'No se pudo cargar la música. Toca Música para reintentar.';
    updateMusic();
  });
}

song.addEventListener('play', updateMusic);
song.addEventListener('pause', updateMusic);
song.addEventListener('ended', updateMusic);
song.addEventListener('playing', () => { musicStatus.textContent = ''; });
musicToggle.addEventListener('click', () => {
  if (song.paused) {
    if (song.error) song.load();
    playMusic();
  } else song.pause();
});
