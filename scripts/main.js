// Tiny site state and playful flow
(function () {
  const stage1 = document.getElementById('stage1');
  const stage2 = document.getElementById('stage2');
  const stage3 = document.getElementById('stage3');
  const answerForm = document.getElementById('answer-form');
  const answerInput = document.getElementById('answer-input');
  const goodWordsEl = document.getElementById('good-words');
  const chosenWordEl = document.getElementById('chosen-word');
  const yesBtn = document.getElementById('yes-btn');
  const noBtn = document.getElementById('no-btn');
  const toast = document.getElementById('toast');
  const loader = document.getElementById('loader');
  const mainPhoto = document.getElementById('main-photo');
  const thumbs = document.querySelectorAll('.thumb');
  const knowMoreBtn = document.getElementById('know-more-btn');
  const backToCelebrationBtn = document.getElementById('back-to-celebration');
  const name = 'Abijith';

  // Accept and reject lists (lowercase)
  const ACCEPT = ['date','girlfriend','love','bae'];
  const REJECT = ['friend','best friend','bestfriend','bro','sis','sister','brother','buddy','pals','pal','bestie','fr'];

  const playfulNoMsgs = [
    "Cha, how cruel you're 😭",
    'Maa? Really!? 🥺',
    'Are you even fr!? 😤',
    'Ouch. Heart just went 404 💔',
    'Try again, I believe in us ✨',
    'Plot twist — the button is allergic to “No” 😶‍🌫️',
    "Nope nope — you're failing again miserably 😵",
    "ATP you're just kiddin', right!? 🤨",
    'Maa really!? Type the magic word! ✍️',
  ];

  const playfulRejectMsgs = [
    'Are you even fr!? Try something sweeter 💖',
    'Close — but was hoping for something more romantic ✨',
  ];

  function showToast(msg, time = 1600) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), time);
  }

  function setStage(n) {
    [stage1, stage2, stage3].forEach((el, i) => {
      if (!el) return;
      el.classList.toggle('active', i === n - 1);
    });
  }

  // Fill chips for good words on stage 2
  function renderGoodWords() {
    goodWordsEl.innerHTML = '';
    ACCEPT.forEach(w => {
      const chip = document.createElement('span');
      chip.className = 'chip';
      chip.textContent = w;
      goodWordsEl.appendChild(chip);
    });
  }

  // Form submit logic
  answerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const raw = (answerInput.value || '').toLowerCase().trim();
    if (!raw) {
      showToast('A word for the blank, pretty please ✨');
      return;
    }

  // Soft-checks: if contains any accept word as substring, accept (but avoid false positives)
  const isAccept = ACCEPT.some(w => raw === w || raw.includes(w));
  const isReject = REJECT.some(w => raw === w || raw.includes(w));

    if (isAccept && !isReject) {
      chosenWordEl.textContent = raw;
      renderGoodWords();
      setStage(2);
      spark(8);
    } else {
      // Context-aware tease: if specifically best friend
      if (raw.includes('best friend') || raw.includes('bestfriend')) {
        showToast('Best friend? That promotion is pending… 😉');
      } else if (raw === 'friend' || raw.includes('friend')) {
        // Friend-specific: nudge toward something sweeter
        showToast('Are you even fr!? Try something sweeter 💖');
      } else {
        const msg = playfulRejectMsgs[Math.floor(Math.random() * playfulRejectMsgs.length)];
        showToast(msg);
      }
      nudgeInput();
      sparkleAtInput();
    }
  });

  // Stage 2 buttons
  yesBtn?.addEventListener('click', () => {
    // Silly confirmation
    showToast("See, I definitely knew you're gonna click this 😌");
    // Show loader briefly
    toggleLoader(true);
    setTimeout(() => {
      toggleLoader(false);
      setStage(3);
      partyBurst();
    }, 1200);
  });

  let noClicks = 0;
  noBtn?.addEventListener('click', () => {
    const msg = playfulNoMsgs[Math.floor(Math.random() * playfulNoMsgs.length)];
    showToast(msg);
    bounceNo();
    spark(6);

    // Shrink No, grow Yes proportionally, but keep buttons usable
    noClicks = Math.min(noClicks + 1, 6);
    const noScale = Math.max(0.4, 1 - noClicks * 0.1); // down to 0.4x
    const yesScale = Math.min(1.6, 1 + noClicks * 0.12); // up to 1.6x
    noBtn.style.transform = `scale(${noScale})`;
    noBtn.style.opacity = String(Math.max(0.5, 1 - noClicks * 0.08));
    yesBtn.style.transform = `scale(${yesScale})`;
    yesBtn.style.filter = 'drop-shadow(0 6px 18px rgba(255,105,180,0.45))';
  });

  // Gallery thumbs
  thumbs.forEach(t => t.addEventListener('click', () => {
    if (t instanceof HTMLImageElement) {
      mainPhoto.src = t.src;
      spark(4);
    }
  }));

  // Cursor sparkle effect
  const canvas = document.getElementById('fx-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let lastTime = 0;

  function onResize() {
    canvas.width = window.innerWidth * devicePixelRatio;
    canvas.height = window.innerHeight * devicePixelRatio;
  }
  window.addEventListener('resize', onResize);
  onResize();

  function addParticle(x, y, color) {
    particles.push({
      x: x * devicePixelRatio,
      y: y * devicePixelRatio,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6 - 0.4,
      life: 60 + Math.random() * 30,
      size: 2 + Math.random() * 2,
      color
    });
  }

  function mouseSparkle(e) {
    const colors = ['#ff85c2', '#ffd1e8', '#7ef3bc', '#c8ffe6', '#a1c4fd'];
    for (let i = 0; i < 6; i++) addParticle(e.clientX, e.clientY, colors[i % colors.length]);
  }
  window.addEventListener('mousemove', mouseSparkle);

  function tick(ts) {
    const dt = Math.min(32, ts - lastTime);
    lastTime = ts;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles = particles.filter(p => (p.life -= dt * 0.06) > 0);
    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life / 60));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * devicePixelRatio, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  // Utility sparks
  function spark(n = 5) {
    const w = window.innerWidth, h = window.innerHeight;
    for (let i = 0; i < n; i++) addParticle(w * 0.5, h * 0.4, '#ffd1e8');
  }

  function sparkleAtInput() {
    const r = answerInput.getBoundingClientRect();
    const x = r.left + r.width / 2; const y = r.top + r.height / 2;
    for (let i = 0; i < 10; i++) addParticle(x, y, '#ff85c2');
  }

  function nudgeInput() {
    answerInput.animate([
      { transform: 'translateX(0)' },
      { transform: 'translateX(-6px)' },
      { transform: 'translateX(6px)' },
      { transform: 'translateX(0)' },
    ], { duration: 220, easing: 'ease-in-out' });
  }

  // Light confetti burst for success
  function confettiBurst() {
    const colors = ['#ff85c2', '#ffd1e8', '#7ef3bc', '#c8ffe6', '#a1c4fd', '#fcb69f'];
    const centerX = window.innerWidth / 2, centerY = window.innerHeight / 2;
    for (let i = 0; i < 140; i++) {
      const angle = (Math.PI * 2 * i) / 60 + Math.random();
      const speed = 1 + Math.random() * 1.8;
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push({
        x: centerX * devicePixelRatio,
        y: centerY * devicePixelRatio,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 90 + Math.random() * 60,
        size: 2 + Math.random() * 2,
        color,
      });
    }
    showToast('Confetti unlocked! 🎊');
  }

  // Party burst: a wrapper celebration behind the card (mix of confetti + glow)
  function partyBurst() {
    confettiBurst();
    // A second delayed confetti ring for extra punch
    setTimeout(() => confettiBurst(), 350);
    document.body.animate([
      { filter: 'saturate(1)' },
      { filter: 'saturate(1.3)' },
      { filter: 'saturate(1)' }
    ], { duration: 900, easing: 'ease-in-out' });
  }

  function bounceNo() {
    noBtn.animate([
      { transform: 'translateY(0)' },
      { transform: 'translateY(-8px)' },
      { transform: 'translateY(0)' },
    ], { duration: 260, easing: 'ease-out' });
  }

  // Accessibility niceties
  answerInput.setAttribute('aria-label', 'Your word for the blank');

  // Typewriter effect for the main title
  const titleEl = document.querySelector('#stage1 .title');
  if (titleEl) {
    const full = titleEl.textContent;
    let i = 0;
    titleEl.classList.add('typewriter');
    titleEl.textContent = '';
    const typer = () => {
      // Type until the blank start, then reveal remainder faster
      titleEl.textContent = full.slice(0, i++);
      if (i <= full.length) requestAnimationFrame(typer);
      else titleEl.classList.remove('typewriter');
    };
    requestAnimationFrame(typer);
  }

  // Default sizing for Yes/No to be more obvious
  if (yesBtn && noBtn) {
    yesBtn.style.fontSize = '1.05rem';
    noBtn.style.fontSize = '1.05rem';
    yesBtn.style.padding = '16px 26px';
    noBtn.style.padding = '16px 26px';
  }

  // Know more navigation
  knowMoreBtn?.addEventListener('click', () => {
    setStage(4);
    spark(6);
  });
  backToCelebrationBtn?.addEventListener('click', () => {
    setStage(3);
    spark(6);
  });

  function toggleLoader(show) {
    if (!loader) return;
    loader.classList.toggle('hidden', !show);
    loader.setAttribute('aria-hidden', show ? 'false' : 'true');
  }
})();
