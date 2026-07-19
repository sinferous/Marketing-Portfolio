const heroArt = document.querySelector('.hero-art');
const heroSection = document.querySelector('.hero');
const sideDoodles = document.querySelectorAll('.outside-doodle');
const visionBoard = document.querySelector('.vision-board');
const draggablePieces = document.querySelectorAll('[data-draggable]');
const nav = document.querySelector('.nav');
const mascot = document.querySelector('.nav-smile');
const mascotLinks = document.querySelectorAll('.nav-about, .nav-work, .nav-connect');
const rotatingWord = document.querySelector('.rotating-word');

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

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('pointerdown', (event) => {
    if (!event.isPrimary || event.button > 0 || event.target.closest('[data-draggable]')) return;

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
    if (event.pointerType === 'touch') return;

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
