const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('#site-nav');

function setMenu(open) {
  nav.classList.toggle('is-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
}

menuButton.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
nav.addEventListener('click', () => setMenu(false));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && nav.classList.contains('is-open')) {
    setMenu(false);
    menuButton.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!event.target.closest('.navbar-wrapper')) setMenu(false);
});

function installDotCursor() {
  const mouseAvailable = matchMedia('(any-hover: hover) and (any-pointer: fine) and (forced-colors: none)');
  const canInvert = CSS.supports('backdrop-filter', 'invert(1)') ||
    CSS.supports('-webkit-backdrop-filter', 'invert(1)');
  if (!canInvert || !window.PointerEvent) return;

  const dot = document.createElement('div');
  dot.className = 'cursor-block';
  dot.hidden = true;
  dot.setAttribute('aria-hidden', 'true');
  document.body.append(dot);

  function hide() {
    if (dot.hidden) return;
    dot.hidden = true;
    document.documentElement.classList.remove('has-dot-cursor');
  }

  function follow(event) {
    if (!mouseAvailable.matches || event.pointerType !== 'mouse' || event.target instanceof HTMLIFrameElement) {
      hide();
      return;
    }
    dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
    if (dot.hidden) {
      dot.hidden = false;
      document.documentElement.classList.add('has-dot-cursor');
    }
  }

  document.addEventListener('pointermove', follow, { passive: true });
  document.addEventListener('pointerover', follow, { passive: true });
  document.addEventListener('pointerdown', follow, { passive: true });
  document.addEventListener('pointerout', (event) => {
    if (!event.relatedTarget || event.relatedTarget instanceof HTMLIFrameElement) hide();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Tab') hide();
  });
  window.addEventListener('blur', hide);
  window.addEventListener('pagehide', hide);
  mouseAvailable.addEventListener('change', hide);
}

installDotCursor();

const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.title-container');

if (hero && !motion.matches) {
  import('./canvas.js').then(() => hero.classList.add('is-animated')).catch(() => {
    // The still image is visible on devices without WebGL.
  });
}

const aboutAnimation = document.querySelector('.about-animation');
if (aboutAnimation) {
  let inView = false;

  function updatePlayback() {
    if (!inView || motion.matches) {
      aboutAnimation.pause();
      return;
    }
    // Native controls remain available if autoplay requires a gesture.
    aboutAnimation.play().catch(() => {});
  }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    updatePlayback();
  });
  observer.observe(aboutAnimation);
  motion.addEventListener('change', updatePlayback);
}

const scene = document.querySelector('.spline-scene canvas');
if (scene && !motion.matches) {
  let app;
  let loading;
  let visible = false;
  async function loadScene() {
    const { Application } = await import('https://cdn.jsdelivr.net/npm/@splinetool/runtime@1.10.52/build/runtime.js');
    app = new Application(scene);
    await app.load('/media/contact.splinecode');
    if (!visible) app.stop();
  }
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !loading) loading = loadScene().catch(() => { scene.hidden = true; });
    else if (app) visible ? app.play() : app.stop();
  });
  observer.observe(scene);
}

if (['noaverage.agency', 'www.noaverage.agency'].includes(location.hostname)) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-MB2QSXM';
  document.head.append(tag);
}
