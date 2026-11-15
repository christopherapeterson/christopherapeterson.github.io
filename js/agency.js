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

const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.title-container');

if (hero && !motion.matches) {
  import('./canvas.js').then(() => hero.classList.add('is-animated')).catch(() => {
    // The still image is visible on devices without WebGL.
  });
}

const showreel = document.querySelector('.background-video video');
if (showreel) {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !motion.matches) showreel.play().catch(() => {});
    else showreel.pause();
  });
  observer.observe(showreel);
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
