const heroArt = document.querySelector('.hero-art');
const heroSection = document.querySelector('.hero');
const sideDoodles = document.querySelectorAll('.outside-doodle');
const workSection = document.querySelector('.work-section');
const workDoodles = document.querySelectorAll('.work-side-doodle');
const workCategories = [...document.querySelectorAll('.work-category')];
const categoryChits = [...document.querySelectorAll('.category-chit')];
const categoryChitStack = document.querySelector('.category-chit-stack');
const visionBoard = document.querySelector('.vision-board');
const draggablePieces = document.querySelectorAll('[data-draggable]');
const nav = document.querySelector('.nav');
const mascot = document.querySelector('.nav-smile');
const easterEggHint = document.querySelector('.easter-egg-hint');
const mascotLinks = document.querySelectorAll('.nav-about, .nav-work, .nav-connect');
const connectTrigger = document.querySelector('.nav-connect');
const connectGroup = document.querySelector('.nav-connect-group');
const connectSocialLinks = document.querySelectorAll('.nav-connect-group .social-pill');
const rotatingWord = document.querySelector('.rotating-word');
const peekCharacter = document.querySelector('.peek-character');
const peekBubble = document.querySelector('.peek-bubble');

if (mascot && easterEggHint) {
  const dismissEasterEggHint = () => {
    easterEggHint.classList.add('is-dismissed');
    try {
      window.localStorage.setItem('portfolio-easter-hint-dismissed', 'true');
    } catch {
      // The hint still stays dismissed for the current visit.
    }
  };

  try {
    if (window.localStorage.getItem('portfolio-easter-hint-dismissed') === 'true') {
      easterEggHint.classList.add('is-dismissed');
    }
  } catch {
    // Storage may be unavailable when the portfolio is opened as a local file.
  }

  mascot.addEventListener('pointerenter', dismissEasterEggHint, { once: true });
}

let activeCategoryIndex = 0;
let categoryScrollFrame = null;

const swapCategoryChit = (nextIndex) => {
  if (nextIndex === activeCategoryIndex || !categoryChits[nextIndex]) return;

  const direction = nextIndex > activeCategoryIndex ? 1 : -1;
  const outgoing = categoryChits[activeCategoryIndex];
  const incoming = categoryChits[nextIndex];

  outgoing.style.setProperty('--swap-out-x', `${direction * -105}px`);
  outgoing.style.setProperty('--swap-out-turn', `${direction * -10}deg`);
  incoming.style.setProperty('--swap-in-x', `${direction * 58}px`);
  incoming.style.setProperty('--swap-in-turn', `${direction * 7}deg`);
  outgoing.classList.remove('is-active');
  outgoing.classList.add('is-exiting');
  incoming.classList.add('is-active', 'is-entering');

  requestAnimationFrame(() => {
    requestAnimationFrame(() => incoming.classList.remove('is-entering'));
  });

  window.setTimeout(() => outgoing.classList.remove('is-exiting'), 480);
  activeCategoryIndex = nextIndex;
};

const updateCategoryChit = () => {
  categoryScrollFrame = null;
  if (!workCategories.length || !categoryChits.length) return;

  const focusLine = window.innerHeight * 0.52;
  let closestIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  workCategories.forEach((category, index) => {
    const bounds = category.getBoundingClientRect();
    const distance = Math.abs(bounds.top + bounds.height / 2 - focusLine);
    if (distance < closestDistance) {
      closestDistance = distance;
      closestIndex = index;
    }
  });

  swapCategoryChit(closestIndex);
  workCategories.forEach((category, index) => {
    category.classList.toggle('is-current', index === closestIndex);
  });

  if (categoryChitStack) {
    const activeBounds = workCategories[closestIndex].getBoundingClientRect();
    const moveDistance = Math.max(window.innerHeight * 0.3, 210);
    const rawProgress = Math.min(Math.max(-activeBounds.top / moveDistance, 0), 1);
    const easedProgress = 1 - Math.pow(1 - rawProgress, 3);
    const isDesktop = window.innerWidth > 800;
    const cornerX = isDesktop
      ? -(window.innerWidth / 2 - Math.min(235, window.innerWidth * 0.19))
      : 0;
    const cornerY = isDesktop ? -window.innerHeight * 0.085 : 0;

    categoryChitStack.style.setProperty('--chit-stage-x', `${cornerX * easedProgress}px`);
    categoryChitStack.style.setProperty('--chit-stage-y', `${cornerY * easedProgress}px`);
    categoryChitStack.style.setProperty('--chit-stage-scale', String(1 - easedProgress * 0.48));
    categoryChitStack.classList.toggle('is-condensed', isDesktop && easedProgress > 0.72);
  }
};

if (workCategories.length && categoryChits.length) {
  const requestCategoryUpdate = () => {
    if (categoryScrollFrame) return;
    categoryScrollFrame = requestAnimationFrame(updateCategoryChit);
  };

  window.addEventListener('scroll', requestCategoryUpdate, { passive: true });
  window.addEventListener('resize', () => {
    requestCategoryUpdate();
  });
  updateCategoryChit();
}

if (
  peekCharacter &&
  peekBubble &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
  const peekMessages = [
    'relax, I’m supervising.',
    'scrolling like it’s cardio.',
    'approved. barely.',
    'caught staring? bold.',
    'this stays between us.',
  ];
  let peekTimer = 0;
  let peekHideTimer = 0;
  let lastPeekMessageIndex = -1;

  const schedulePeek = (firstAppearance = false) => {
    window.clearTimeout(peekTimer);
    const minimum = firstAppearance ? 12000 : 35000;
    const maximum = firstAppearance ? 21000 : 65000;
    const delay = minimum + Math.random() * (maximum - minimum);
    peekTimer = window.setTimeout(showPeek, delay);
  };

  const hidePeek = (nextDelay = true) => {
    window.clearTimeout(peekHideTimer);
    peekCharacter.classList.remove('is-visible', 'is-caught');
    peekCharacter.setAttribute('aria-hidden', 'true');
    peekCharacter.setAttribute('tabindex', '-1');

    window.setTimeout(() => {
      peekBubble.textContent = '';
      if (nextDelay) schedulePeek();
    }, 820);
  };

  const showPeek = () => {
    if (
      document.hidden ||
      window.innerWidth <= 700 ||
      document.body.classList.contains('game-is-open')
    ) {
      schedulePeek();
      return;
    }

    const leftPosition = 8 + Math.random() * 9;
    peekCharacter.classList.remove('is-caught');
    peekCharacter.style.setProperty('--peek-left', `${leftPosition}vw`);
    peekCharacter.setAttribute('aria-hidden', 'false');
    peekCharacter.setAttribute('tabindex', '0');

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => peekCharacter.classList.add('is-visible'));
    });

    peekHideTimer = window.setTimeout(() => hidePeek(), 6200);
  };

  peekCharacter.addEventListener('click', () => {
    if (!peekCharacter.classList.contains('is-visible')) return;
    window.clearTimeout(peekHideTimer);
    let messageIndex = Math.floor(Math.random() * peekMessages.length);
    if (peekMessages.length > 1 && messageIndex === lastPeekMessageIndex) {
      messageIndex = (messageIndex + 1) % peekMessages.length;
    }
    lastPeekMessageIndex = messageIndex;
    peekBubble.textContent = peekMessages[messageIndex];
    peekCharacter.classList.add('is-caught');
    peekHideTimer = window.setTimeout(() => hidePeek(), 1900);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.clearTimeout(peekTimer);
      if (peekCharacter.classList.contains('is-visible')) hidePeek(false);
    } else {
      schedulePeek(true);
    }
  });

  schedulePeek(true);
}

if (rotatingWord && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const words = ['playful.', 'human.', 'memorable.', 'meaningful.', 'expressive.'];
  let wordIndex = 0;

  window.setInterval(() => {
    rotatingWord.classList.add('is-leaving');

    window.setTimeout(() => {
      wordIndex = (wordIndex + 1) % words.length;
      rotatingWord.innerHTML = `<em>${words[wordIndex]}</em>`;
      rotatingWord.classList.remove('is-leaving');
      rotatingWord.classList.add('is-entering');

      requestAnimationFrame(() => {
        requestAnimationFrame(() => rotatingWord.classList.remove('is-entering'));
      });
    }, 220);
  }, 2400);
}

let activeBoardPiece = null;
let boardPieceStart = null;
let boardLayer = 20;

const boardDragEnabled = () =>
  window.matchMedia('(pointer: fine)').matches && window.innerWidth > 980;

const setPiecePosition = (piece, x, y) => {
  if (!visionBoard) return;

  const inset = 12;
  const minX = -piece.offsetLeft + inset;
  const maxX = visionBoard.clientWidth - piece.offsetLeft - piece.offsetWidth - inset;
  const minY = -piece.offsetTop + inset;
  const maxY = visionBoard.clientHeight - piece.offsetTop - piece.offsetHeight - inset;
  const nextX = Math.min(Math.max(x, minX), maxX);
  const nextY = Math.min(Math.max(y, minY), maxY);

  piece.style.setProperty('--drag-x', `${nextX}px`);
  piece.style.setProperty('--drag-y', `${nextY}px`);
  piece.dataset.dragX = nextX;
  piece.dataset.dragY = nextY;
};

draggablePieces.forEach((piece) => {
  piece.addEventListener('pointerdown', (event) => {
    if (!boardDragEnabled() || event.button !== 0) return;

    activeBoardPiece = piece;
    boardPieceStart = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: Number(piece.dataset.dragX || 0),
      y: Number(piece.dataset.dragY || 0),
    };
    boardLayer += 1;
    piece.style.zIndex = boardLayer;
    piece.classList.add('is-dragging');
    piece.setPointerCapture(event.pointerId);
    event.preventDefault();
  });

  piece.addEventListener('pointermove', (event) => {
    if (activeBoardPiece !== piece || !boardPieceStart) return;

    setPiecePosition(
      piece,
      boardPieceStart.x + event.clientX - boardPieceStart.pointerX,
      boardPieceStart.y + event.clientY - boardPieceStart.pointerY,
    );
  });

  const finishBoardDrag = (event) => {
    if (activeBoardPiece !== piece) return;
    piece.classList.remove('is-dragging');
    if (piece.hasPointerCapture(event.pointerId)) {
      piece.releasePointerCapture(event.pointerId);
    }
    activeBoardPiece = null;
    boardPieceStart = null;
  };

  piece.addEventListener('pointerup', finishBoardDrag);
  piece.addEventListener('pointercancel', finishBoardDrag);

  piece.addEventListener('dblclick', () => setPiecePosition(piece, 0, 0));

  piece.addEventListener('keydown', (event) => {
    if (!boardDragEnabled()) return;

    const moves = {
      ArrowLeft: [-10, 0],
      ArrowRight: [10, 0],
      ArrowUp: [0, -10],
      ArrowDown: [0, 10],
    };
    const move = moves[event.key];
    if (!move) return;

    setPiecePosition(
      piece,
      Number(piece.dataset.dragX || 0) + move[0],
      Number(piece.dataset.dragY || 0) + move[1],
    );
    event.preventDefault();
  });
});

if (nav && mascot && mascotLinks.length) {
  const states = ['mascot-at-about', 'mascot-at-work', 'mascot-at-connect'];

  const moveMascotTo = (link) => {
    const navBox = nav.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    const mascotHomeCenter = navBox.left + mascot.offsetLeft + mascot.offsetWidth / 2;
    const distance = linkBox.left + linkBox.width / 2 - mascotHomeCenter;
    const state = link.classList.contains('nav-about')
      ? 'mascot-at-about'
      : link.classList.contains('nav-work')
        ? 'mascot-at-work'
        : 'mascot-at-connect';

    mascot.style.setProperty('--mascot-x', `${distance}px`);
    nav.classList.remove(...states);
    nav.classList.add('mascot-active', state);
  };

  const returnMascotHome = () => nav.classList.remove('mascot-active', ...states);

  mascotLinks.forEach((link) => {
    link.addEventListener('pointerenter', () => moveMascotTo(link));
    link.addEventListener('focus', () => moveMascotTo(link));
  });

  nav.addEventListener('pointerleave', returnMascotHome);
  nav.addEventListener('focusout', (event) => {
    if (!nav.contains(event.relatedTarget)) returnMascotHome();
  });
  window.addEventListener('resize', returnMascotHome);
}

if (connectTrigger && connectGroup) {
  const setConnectOpen = (open) => {
    connectGroup.classList.toggle('is-open', open);
    connectTrigger.setAttribute('aria-expanded', String(open));
  };

  connectTrigger.addEventListener('click', (event) => {
    event.preventDefault();
    connectGroup.classList.remove('is-dismissed');
    setConnectOpen(!connectGroup.classList.contains('is-open'));
  });

  connectSocialLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setConnectOpen(false);
      connectGroup.classList.add('is-dismissed');
      link.blur();
    });
  });

  connectGroup.addEventListener('pointerleave', () => {
    connectGroup.classList.remove('is-dismissed');
  });

  document.addEventListener('pointerdown', (event) => {
    if (!connectGroup.contains(event.target)) setConnectOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setConnectOpen(false);
  });
}

if (heroArt && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroArt.addEventListener('pointermove', (event) => {
    const bounds = heroArt.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroArt.style.transform = `rotate(${x * 0.55}deg) translate(${x * 3}px, ${y * 3}px)`;
  });

  heroArt.addEventListener('pointerleave', () => {
    heroArt.style.transform = 'rotate(0deg) translate(0, 0)';
  });
}

if (heroSection && sideDoodles.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroSection.addEventListener('pointermove', (event) => {
    const bounds = heroSection.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    sideDoodles.forEach((doodle) => {
      const depth = Number(doodle.dataset.depth) || 10;
      const depthY = Number(doodle.dataset.depthY) || depth;
      doodle.style.setProperty('--drift-x', `${x * depth}px`);
      doodle.style.setProperty('--drift-y', `${y * depthY}px`);
      doodle.style.setProperty('--drift-r', `${x * depth * 0.08}deg`);
    });
  });

  heroSection.addEventListener('pointerleave', () => {
    sideDoodles.forEach((doodle) => {
      doodle.style.setProperty('--drift-x', '0px');
      doodle.style.setProperty('--drift-y', '0px');
      doodle.style.setProperty('--drift-r', '0deg');
    });
  });
}

if (workSection && workDoodles.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  workSection.addEventListener('pointermove', (event) => {
    const bounds = workSection.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    const visibleY = Math.min(Math.max((event.clientY - bounds.top) / window.innerHeight, 0), 1);
    const y = (visibleY - 0.5) * 2;

    workDoodles.forEach((doodle) => {
      const depth = Number(doodle.dataset.depth) || 12;
      doodle.style.setProperty('--work-drift-x', `${x * depth}px`);
      doodle.style.setProperty('--work-drift-y', `${y * Math.abs(depth) * 0.65}px`);
    });
  });

  workSection.addEventListener('pointerleave', () => {
    workDoodles.forEach((doodle) => {
      doodle.style.setProperty('--work-drift-x', '0px');
      doodle.style.setProperty('--work-drift-y', '0px');
    });
  });
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('pointerdown', (event) => {
    if (
      document.body.classList.contains('game-is-open') ||
      !event.isPrimary ||
      event.button > 0 ||
      event.target.closest('[data-draggable]')
    ) return;

    const mark = document.createElement('span');
    mark.className = 'click-mark';
    mark.style.left = `${event.clientX}px`;
    mark.style.top = `${event.clientY}px`;
    mark.style.setProperty('--click-tilt', `${Math.round(Math.random() * 6 - 3)}deg`);
    mark.setAttribute('aria-hidden', 'true');
    mark.innerHTML = `
      <svg viewBox="205 155 140 88">
        <path pathLength="1" d="M294.49 213.15c2-5.53 5.62-12.61 12.38-14.92 3.08-1.05 4.82-.44 7.88-1.28 4.2-1.15 9.8-4.74 14.85-16.2" />
        <path pathLength="1" d="M280.4 210.21c-2.21-5.45-4.24-13.14-.76-19.37 1.59-2.84 3.29-3.54 5.01-6.21 2.36-3.66 4.13-10.07.23-21.98" />
        <path pathLength="1" d="M270.44 214.65c-5.61-1.77-12.83-5.11-15.41-11.77-1.18-3.03-.63-4.79-1.59-7.82-1.32-4.15-5.13-9.6-16.78-14.19" />
        <path pathLength="1" d="M265.12 226.12c-5.18 2.78-12.61 5.63-19.18 2.84-3-1.27-3.88-2.89-6.71-4.31-3.9-1.95-10.46-3.02-21.87 2.14" />
      </svg>`;

    document.body.appendChild(mark);
    mark.addEventListener('animationend', (animationEvent) => {
      if (animationEvent.animationName === 'click-mark-lift') mark.remove();
    });
  });
}

if (
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
  window.matchMedia('(pointer: fine)').matches
) {
  const trailCanvas = document.createElement('canvas');
  const trailContext = trailCanvas.getContext('2d');
  const trailPoints = [];
  let trailFrame = 0;
  let lastTrailPoint = null;

  trailCanvas.className = 'cursor-trail-canvas';
  trailCanvas.setAttribute('aria-hidden', 'true');
  document.body.appendChild(trailCanvas);

  const resizeTrailCanvas = () => {
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    trailCanvas.width = Math.round(window.innerWidth * pixelRatio);
    trailCanvas.height = Math.round(window.innerHeight * pixelRatio);
    trailContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  };

  const renderTrail = () => {
    trailContext.clearRect(0, 0, window.innerWidth, window.innerHeight);

    trailPoints.forEach((point) => { point.life -= 0.035; });
    while (trailPoints.length && trailPoints[0].life <= 0) trailPoints.shift();

    for (let index = 1; index < trailPoints.length - 1; index += 1) {
      const previous = trailPoints[index - 1];
      const current = trailPoints[index];
      const next = trailPoints[index + 1];
      const endX = (current.x + next.x) / 2;
      const endY = (current.y + next.y) / 2;

      trailContext.beginPath();
      trailContext.moveTo(previous.x, previous.y);
      trailContext.quadraticCurveTo(current.x, current.y, endX, endY);
      trailContext.strokeStyle = `rgba(255, 107, 53, ${Math.max(0, current.life) * 0.72})`;
      trailContext.lineWidth = 0.8 + Math.max(0, current.life) * 2.1;
      trailContext.lineCap = 'round';
      trailContext.lineJoin = 'round';
      trailContext.stroke();
    }

    if (trailPoints.length) {
      trailFrame = window.requestAnimationFrame(renderTrail);
    } else {
      trailFrame = 0;
      lastTrailPoint = null;
    }
  };

  document.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch' || document.body.classList.contains('game-is-open')) return;

    const nextPoint = { x: event.clientX, y: event.clientY };

    if (lastTrailPoint) {
      const deltaX = nextPoint.x - lastTrailPoint.x;
      const deltaY = nextPoint.y - lastTrailPoint.y;
      const distance = Math.hypot(deltaX, deltaY);
      const steps = Math.min(10, Math.max(1, Math.ceil(distance / 7)));

      for (let step = 1; step <= steps; step += 1) {
        trailPoints.push({
          x: lastTrailPoint.x + deltaX * (step / steps),
          y: lastTrailPoint.y + deltaY * (step / steps),
          life: 1,
        });
      }
    } else {
      trailPoints.push({ ...nextPoint, life: 1 });
    }

    lastTrailPoint = nextPoint;
    if (trailPoints.length > 54) trailPoints.splice(0, trailPoints.length - 54);
    if (!trailFrame) trailFrame = window.requestAnimationFrame(renderTrail);
  });

  window.addEventListener('resize', resizeTrailCanvas);
  window.addEventListener('blur', () => {
    trailPoints.length = 0;
    lastTrailPoint = null;
  });
  resizeTrailCanvas();
}

const dragonGame = document.querySelector('.dragon-game');
const dragonGameStage = document.querySelector('.dragon-game-stage');
const dragonGameItemsLayer = document.querySelector('.dragon-game-items');
const dragonGameDragon = document.querySelector('.dragon-game-dragon');
const dragonGameScore = document.querySelector('.dragon-game-score');
const dragonGameTime = document.querySelector('.dragon-game-time');
const dragonGameFinalScore = document.querySelector('.dragon-game-final-score');
const dragonGameMessage = document.querySelector('.dragon-game-message');
const dragonGameStart = document.querySelector('.dragon-game-start');
const dragonGameReplay = document.querySelector('.dragon-game-replay');
const dragonGameDone = document.querySelector('.dragon-game-done');
const dragonGameClose = document.querySelector('.dragon-game-close');

if (
  mascot &&
  dragonGame &&
  dragonGameStage &&
  dragonGameItemsLayer &&
  dragonGameDragon
) {
  const snackTypes = [
    { src: 'doodles/file-05.svg', points: 10, label: 'ramen' },
    { src: 'doodles/file-04.svg', points: 5, label: 'juice' },
  ];
  const gameDuration = 30;
  const gameItems = [];
  let secretTapCount = 0;
  let secretTapTimer = 0;
  let gameFrame = 0;
  let gameRunning = false;
  let gameScoreValue = 0;
  let gameLastTime = 0;
  let gameEndsAt = 0;
  let gameSpawnClock = 0;
  let dragonPosition = 50;
  let dragonTarget = 50;
  let gameStageWidth = 0;
  let gameStageHeight = 0;
  let dragonWidth = 150;

  const updateGameMeasurements = () => {
    gameStageWidth = dragonGameStage.clientWidth;
    gameStageHeight = dragonGameStage.clientHeight;
    dragonWidth = dragonGameDragon.offsetWidth || 150;
  };

  const clearGameItems = () => {
    gameItems.splice(0).forEach((item) => item.element.remove());
    dragonGameItemsLayer.querySelectorAll('.dragon-score-pop').forEach((pop) => pop.remove());
  };

  const updateGameScore = (nextScore) => {
    gameScoreValue = nextScore;
    if (dragonGameScore) dragonGameScore.textContent = String(gameScoreValue);
  };

  const stopGameLoop = () => {
    gameRunning = false;
    if (gameFrame) window.cancelAnimationFrame(gameFrame);
    gameFrame = 0;
  };

  const closeGame = () => {
    stopGameLoop();
    clearGameItems();
    dragonGame.classList.remove('is-active');
    dragonGame.setAttribute('aria-hidden', 'true');
    dragonGame.removeAttribute('data-state');
    document.body.classList.remove('game-is-open');
    mascot.focus({ preventScroll: true });
  };

  const openGame = () => {
    stopGameLoop();
    clearGameItems();
    updateGameScore(0);
    if (dragonGameTime) dragonGameTime.textContent = String(gameDuration);
    dragonPosition = 50;
    dragonTarget = 50;
    dragonGameDragon.style.left = '50%';
    dragonGame.setAttribute('data-state', 'intro');
    dragonGame.setAttribute('aria-hidden', 'false');
    dragonGame.classList.add('is-active');
    document.body.classList.add('game-is-open');
    window.requestAnimationFrame(() => {
      updateGameMeasurements();
      dragonGameStart?.focus({ preventScroll: true });
    });
  };

  const showScorePop = (x, y, points) => {
    const pop = document.createElement('span');
    pop.className = 'dragon-score-pop';
    pop.textContent = `+${points}`;
    pop.style.left = `${x}px`;
    pop.style.top = `${y}px`;
    dragonGameItemsLayer.appendChild(pop);
    pop.addEventListener('animationend', () => pop.remove(), { once: true });
  };

  const feedDragon = (item) => {
    updateGameScore(gameScoreValue + item.points);
    showScorePop(item.x + item.size / 2, gameStageHeight - 135, item.points);
    item.element.style.setProperty('--caught-x', `${item.x}px`);
    item.element.style.setProperty('--caught-y', `${gameStageHeight - 100}px`);
    item.element.style.setProperty('--caught-turn', `${item.rotation + 16}deg`);
    item.element.classList.add('is-caught');
    window.setTimeout(() => item.element.remove(), 250);

    dragonGameDragon.classList.remove('is-fed');
    void dragonGameDragon.offsetWidth;
    dragonGameDragon.classList.add('is-fed');
  };

  const spawnSnack = () => {
    if (!gameStageWidth) updateGameMeasurements();
    const snack = snackTypes[Math.floor(Math.random() * snackTypes.length)];
    const size = 54 + Math.random() * 34;
    const element = document.createElement('img');
    const x = 18 + Math.random() * Math.max(1, gameStageWidth - size - 36);
    const rotation = Math.random() * 18 - 9;

    element.className = 'dragon-game-item';
    element.src = snack.src;
    element.alt = '';
    element.setAttribute('aria-hidden', 'true');
    element.style.setProperty('--item-size', `${size}px`);
    dragonGameItemsLayer.appendChild(element);

    gameItems.push({
      element,
      x,
      y: -size - 8,
      size,
      speed: 120 + Math.random() * 78,
      rotation,
      spin: Math.random() * 28 - 14,
      points: snack.points,
      label: snack.label,
    });
  };

  const finishGame = () => {
    stopGameLoop();
    clearGameItems();
    if (dragonGameFinalScore) dragonGameFinalScore.textContent = String(gameScoreValue);

    if (dragonGameMessage) {
      dragonGameMessage.textContent = gameScoreValue >= 110
        ? 'Dragon fed. Creativity restored!'
        : gameScoreValue >= 55
          ? 'A very happy little dragon.'
          : 'Still snacky. Still adorable.';
    }

    dragonGame.setAttribute('data-state', 'finished');
    dragonGameReplay?.focus({ preventScroll: true });
  };

  const runGameFrame = (now) => {
    if (!gameRunning) return;
    const delta = Math.min((now - gameLastTime) / 1000, 0.034);
    const remaining = Math.max(0, Math.ceil((gameEndsAt - now) / 1000));
    gameLastTime = now;
    gameSpawnClock += delta;

    if (dragonGameTime && dragonGameTime.textContent !== String(remaining)) {
      dragonGameTime.textContent = String(remaining);
    }
    if (remaining <= 0) {
      finishGame();
      return;
    }

    dragonPosition += (dragonTarget - dragonPosition) * Math.min(1, delta * 11);
    dragonGameDragon.style.left = `${dragonPosition}%`;

    if (gameSpawnClock >= 0.62) {
      gameSpawnClock = 0;
      spawnSnack();
    }

    const dragonCenter = gameStageWidth * dragonPosition / 100;
    const catchTop = gameStageHeight - Math.min(128, gameStageHeight * 0.24);

    for (let index = gameItems.length - 1; index >= 0; index -= 1) {
      const item = gameItems[index];
      item.y += item.speed * delta;
      item.rotation += item.spin * delta;
      item.element.style.transform = `translate3d(${item.x}px, ${item.y}px, 0) rotate(${item.rotation}deg)`;

      const itemCenter = item.x + item.size / 2;
      const withinMouth = Math.abs(itemCenter - dragonCenter) < dragonWidth * 0.34;
      const atDragon = item.y + item.size >= catchTop && item.y < gameStageHeight - 32;

      if (withinMouth && atDragon) {
        gameItems.splice(index, 1);
        feedDragon(item);
      } else if (item.y > gameStageHeight + item.size) {
        gameItems.splice(index, 1);
        item.element.remove();
      }
    }

    gameFrame = window.requestAnimationFrame(runGameFrame);
  };

  const startGame = () => {
    stopGameLoop();
    clearGameItems();
    updateGameMeasurements();
    updateGameScore(0);
    dragonPosition = 50;
    dragonTarget = 50;
    dragonGameDragon.style.left = '50%';
    gameSpawnClock = .34;
    gameLastTime = performance.now();
    gameEndsAt = gameLastTime + gameDuration * 1000;
    gameRunning = true;
    dragonGame.setAttribute('data-state', 'playing');
    if (dragonGameTime) dragonGameTime.textContent = String(gameDuration);
    dragonGameStage.focus({ preventScroll: true });
    gameFrame = window.requestAnimationFrame(runGameFrame);
  };

  const moveDragonFromPointer = (event) => {
    if (!gameRunning) return;
    const bounds = dragonGameStage.getBoundingClientRect();
    const edgePadding = Math.min(10, 50 * dragonWidth / Math.max(1, bounds.width));
    const position = (event.clientX - bounds.left) / bounds.width * 100;
    dragonTarget = Math.max(edgePadding, Math.min(100 - edgePadding, position));
  };

  mascot.addEventListener('click', (event) => {
    if (dragonGame.classList.contains('is-active')) {
      event.preventDefault();
      return;
    }

    secretTapCount += 1;
    window.clearTimeout(secretTapTimer);
    mascot.classList.remove('is-secret-warming');
    void mascot.offsetWidth;
    mascot.classList.add('is-secret-warming');

    if (secretTapCount >= 5) {
      event.preventDefault();
      secretTapCount = 0;
      mascot.classList.remove('is-secret-warming');
      openGame();
      return;
    }

    secretTapTimer = window.setTimeout(() => {
      secretTapCount = 0;
      mascot.classList.remove('is-secret-warming');
    }, 6000);
  });

  dragonGameStage.addEventListener('pointermove', moveDragonFromPointer);
  dragonGameStage.addEventListener('pointerdown', moveDragonFromPointer);
  dragonGameStart?.addEventListener('click', startGame);
  dragonGameReplay?.addEventListener('click', startGame);
  dragonGameDone?.addEventListener('click', closeGame);
  dragonGameClose?.addEventListener('click', closeGame);

  document.addEventListener('keydown', (event) => {
    if (!dragonGame.classList.contains('is-active')) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      closeGame();
      return;
    }
    if (!gameRunning || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    dragonTarget += event.key === 'ArrowLeft' ? -7 : 7;
    dragonTarget = Math.max(8, Math.min(92, dragonTarget));
  });

  window.addEventListener('resize', updateGameMeasurements);
}
