// Measure one word (including its trailing space) so SEO and Marketing Analytics
// travel at the same reading speed and wrap at exactly the same visual position.
for (const heading of document.querySelectorAll('.service-link .service-heading')) {
  const name = document.createElement('span');
  name.className = 'service-name';
  name.textContent = heading.textContent.trim();

  const ticker = document.createElement('span');
  ticker.className = 'service-ticker';
  ticker.setAttribute('aria-hidden', 'true');
  const word = document.createElement('span');
  word.textContent = name.textContent;
  ticker.append(word);
  heading.replaceChildren(name, ticker);

  function fitTicker() {
    const pitch = word.getBoundingClientRect().width;
    if (!pitch) return;

    // One extra word fills the trailing edge throughout the loop.
    const copies = Math.ceil(heading.clientWidth / pitch) + 1;
    while (ticker.childElementCount < copies) ticker.append(word.cloneNode(true));
    while (ticker.childElementCount > copies) ticker.lastElementChild.remove();

    const pixelsPerSecond = parseFloat(getComputedStyle(heading).fontSize) * 2.5;
    ticker.style.setProperty('--word-offset', `-${pitch}px`);
    ticker.style.setProperty('--word-time', `${pitch / pixelsPerSecond}s`);
  }

  fitTicker();
  const sizes = new ResizeObserver(fitTicker);
  sizes.observe(heading);
  sizes.observe(word, { box: 'border-box' });
}
