/* ============================================================
   script.js — Romantic Page Interactions
   ============================================================ */

/* ──────────────────────────────────────────
   1. FLOATING HEARTS GENERATOR
   Spawns animated hearts at random positions
   ────────────────────────────────────────── */
(function initHearts() {
  const container = document.getElementById('heartsContainer');
  const heartChars = ['💕', '💗', '💓', '💖', '🌸', '✿', '❀', '💞'];
  const TOTAL = 22; // total hearts alive at once

  function createHeart() {
    const el = document.createElement('span');
    el.classList.add('heart');

    // Random heart / flower emoji
    el.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];

    // Random horizontal position
    el.style.left = Math.random() * 100 + 'vw';

    // Random size (subtle variation)
    const size = 0.8 + Math.random() * 1.2;
    el.style.fontSize = size + 'rem';

    // Random duration (7s – 18s)
    const duration = 7 + Math.random() * 11;
    el.style.animationDuration = duration + 's';

    // Random delay so they stagger (0 – 12s)
    el.style.animationDelay = Math.random() * 12 + 's';

    container.appendChild(el);

    // Remove after 2 full cycles to keep DOM light
    setTimeout(() => el.remove(), (duration + 12) * 1000);
  }

  // Initial burst
  for (let i = 0; i < TOTAL; i++) createHeart();

  // Keep replenishing
  setInterval(createHeart, 1800);
})();


/* ──────────────────────────────────────────
   2. INTERSECTION OBSERVER — re-trigger fade
   Makes elements fade in as they scroll into view
   ────────────────────────────────────────── */
(function initScrollFade() {
  const targets = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Force re-play animation by resetting
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
})();


/* ──────────────────────────────────────────
   3. MUSIC PLAYER
   Controls the <audio> element with play/pause,
   progress bar update, and seek on click.
   ────────────────────────────────────────── */
(function initPlayer() {
  const audio       = document.getElementById('audio');
  const playPauseBtn = document.getElementById('playPauseBtn');
  const playIcon    = document.getElementById('playIcon');
  const progressBar = document.getElementById('progressBar');
  const progressWrap = document.getElementById('progressWrap');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl  = document.getElementById('duration');

  // ── Format seconds → "m:ss"
  function fmt(sec) {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ── Play / Pause toggle
  playPauseBtn.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().catch(() => {
        // Autoplay blocked — user interaction required (already clicking, so this is a fallback)
        console.warn('Audio play was blocked.');
      });
    } else {
      audio.pause();
    }
  });

  // ── Update icon on state change
  audio.addEventListener('play',  () => { playIcon.textContent = '⏸'; });
  audio.addEventListener('pause', () => { playIcon.textContent = '▶'; });
  audio.addEventListener('ended', () => { playIcon.textContent = '▶'; progressBar.style.width = '0%'; });

  // ── Update progress bar + time display every 250ms
  audio.addEventListener('timeupdate', () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    progressBar.style.width = pct + '%';
    currentTimeEl.textContent = fmt(audio.currentTime);
  });

  // ── Set total duration once metadata loaded
  audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = fmt(audio.duration);
  });

  // ── Seek on progress bar click
  progressWrap.addEventListener('click', (e) => {
    const rect = progressWrap.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * audio.duration;
  });
})();


/* ──────────────────────────────────────────
   4. POLAROID CLICK — subtle heart burst
   Clicking a photo spawns a burst of hearts from it
   ────────────────────────────────────────── */
(function initPolaroidBurst() {
  document.querySelectorAll('.polaroid').forEach(card => {
    card.addEventListener('click', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      for (let i = 0; i < 8; i++) {
        const spark = document.createElement('span');
        spark.textContent = ['💕','💗','✿','🌸'][i % 4];
        spark.style.cssText = `
          position: fixed;
          left: ${cx}px;
          top: ${cy}px;
          font-size: ${0.8 + Math.random()}rem;
          pointer-events: none;
          z-index: 9999;
          transition: transform 0.8s ease, opacity 0.8s ease;
          opacity: 1;
          transform: translate(0,0);
        `;
        document.body.appendChild(spark);

        // Animate outward
        requestAnimationFrame(() => {
          const angle = (i / 8) * 360;
          const dist  = 60 + Math.random() * 60;
          const dx = Math.cos((angle * Math.PI) / 180) * dist;
          const dy = Math.sin((angle * Math.PI) / 180) * dist;
          spark.style.transform = `translate(${dx}px, ${dy}px)`;
          spark.style.opacity   = '0';
        });

        setTimeout(() => spark.remove(), 900);
      }
    });
  });
})();