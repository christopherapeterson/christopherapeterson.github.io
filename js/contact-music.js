(() => {
  const section = document.querySelector('.section-cta-2');
  const container = section.querySelector('.contact-music');
  const sourceLink = container.querySelector('a');
  // Two consecutive deliveries of the title line in Tiësto's original recording.
  const hookStart = 35520;
  const hookEnd = 43450;
  const maxVolume = 48;
  let player;
  let ready = false;
  let visible = 0;
  let playing = false;
  let attempted = false;
  let pausedByVisitor = false;
  let stopping = false;
  let volume = 0;
  let lastSeek = -Infinity;
  let animation = 0;
  let lastFrame = 0;

  function stop() {
    player.setVolume(0);
    volume = 0;
    attempted = false;
    if (playing) {
      stopping = true;
      player.pause();
    }
  }

  function fade(now) {
    animation = 0;
    const target = visible * maxVolume;
    const step = Math.min(now - lastFrame, 80) * .06;
    lastFrame = now;
    volume += Math.sign(target - volume) * Math.min(step, Math.abs(target - volume));
    player.setVolume(Math.round(volume));
    if (Math.abs(target - volume) > .01) animation = requestAnimationFrame(fade);
    else if (target === 0) stop();
  }

  function update() {
    if (!ready) return;
    if (document.hidden) {
      cancelAnimationFrame(animation);
      animation = 0;
      stop();
      return;
    }
    if (visible > 0 && !playing && !attempted && !pausedByVisitor) {
      attempted = true;
      player.seekTo(hookStart);
      player.play();
    }
    if (playing && !animation) {
      lastFrame = performance.now();
      animation = requestAnimationFrame(fade);
    } else if (!visible && !playing) {
      attempted = false;
    }
  }

  function connect() {
    const iframe = document.createElement('iframe');
    iframe.title = 'Tiësto · The Business on SoundCloud';
    iframe.allow = 'autoplay; encrypted-media';
    const url = new URL('https://w.soundcloud.com/player/');
    url.search = new URLSearchParams({
      url: 'https://api.soundcloud.com/tracks/893127532',
      visual: 'false',
      color: '#967b53',
      show_artwork: 'false',
      show_comments: 'false',
      show_playcount: 'false',
      show_user: 'false',
      sharing: 'false',
      buying: 'false'
    });
    iframe.src = url.href;
    container.append(iframe);
    player = SC.Widget(iframe);
    const events = SC.Widget.Events;

    player.bind(events.READY, () => {
      ready = true;
      sourceLink.hidden = true;
      player.setVolume(0);
      player.seekTo(hookStart);
      update();
    });
    player.bind(events.PLAY, () => {
      playing = true;
      attempted = true;
      pausedByVisitor = false;
      update();
    });
    player.bind(events.PAUSE, () => {
      playing = false;
      cancelAnimationFrame(animation);
      animation = 0;
      if (!stopping && attempted && visible && !document.hidden) pausedByVisitor = true;
      stopping = false;
      volume = 0;
      player.setVolume(0);
      if (!pausedByVisitor) update();
    });
    player.bind(events.PLAY_PROGRESS, ({ currentPosition }) => {
      if (currentPosition >= hookStart - 120 && currentPosition < hookEnd) return;
      const now = performance.now();
      if (now - lastSeek > 300) {
        lastSeek = now;
        player.seekTo(hookStart);
      }
    });
    player.bind(events.ERROR, () => {
      ready = false;
      cancelAnimationFrame(animation);
      iframe.remove();
      sourceLink.hidden = false;
    });
  }

  const loader = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    loader.disconnect();
    const script = document.createElement('script');
    script.src = 'https://w.soundcloud.com/player/api.js';
    script.onload = connect;
    document.head.append(script);
  }, { rootMargin: '850px' });
  loader.observe(section);

  const observer = new IntersectionObserver(([entry]) => {
    const height = Math.min(entry.boundingClientRect.height, document.documentElement.clientHeight);
    visible = Math.min(1, entry.intersectionRect.height / Math.max(1, height * .85));
    update();
  }, { threshold: Array.from({ length: 41 }, (_, n) => n / 40) });
  observer.observe(section);
  document.addEventListener('visibilitychange', update);
})();
