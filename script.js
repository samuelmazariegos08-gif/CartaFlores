/* Personaliza los nombres y el mensaje aquí. No necesitas modificar la animación. */
const CONFIG = {
  destinataria: 'Mi Niña Hermosa',
  remitente: 'Tu Amor',
  introduccion: 'Porque sé que te encantan y te\nmereces todo el mundo...',
  mensaje: '¡Flores Amarillas para el\nAmor de mi vida! 🌻',
  automatico: true,
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
  automatic = false;
  clearTimeout(nextCycle);
  updateControls();
  if (!busy) animate(!opened);
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
  updateControls();
  schedule();
});
document.querySelector('#replay').addEventListener('click', async () => {
  if (busy) return;
  automatic = false;
  clearTimeout(nextCycle);
  updateControls();
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

// YouTube se carga únicamente cuando la persona abre el reproductor.
// Eliminar el iframe al cerrar detiene también cualquier reproducción.
const musicToggle = document.querySelector('#music-toggle');
const musicPanel = document.querySelector('#music-panel');
const musicContainer = document.querySelector('#music-player');
musicToggle.addEventListener('click', () => {
  const show = musicPanel.hidden;
  musicPanel.hidden = !show;
  document.querySelector('.scene').classList.toggle('music-visible', show);
  musicToggle.setAttribute('aria-expanded', String(show));
  document.querySelector('#music-label').textContent = show ? 'Cerrar música' : 'Escuchar canción';
  if (show) {
    const player = document.createElement('iframe');
    player.src = 'https://www.youtube-nocookie.com/embed/dOvQXBobwwM?playsinline=1&rel=0';
    player.title = 'Floricienta — Flores amarillas';
    player.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    player.allowFullscreen = true;
    player.referrerPolicy = 'strict-origin-when-cross-origin';
    musicContainer.replaceChildren(player);
    musicPanel.scrollIntoView({ behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'nearest' });
  } else {
    musicContainer.replaceChildren();
    musicToggle.focus({ preventScroll: true });
  }
});
