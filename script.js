const heroSection = document.querySelector('.hero');
const sideDoodles = document.querySelectorAll('.outside-doodle');
const reelPin = document.getElementById('work-reel-pin');
const reelViewport = document.querySelector('.work-reel-viewport');
const reelTrack = document.querySelector('.work-reel-track');
const reelProgressFill = document.querySelector('.reel-progress-fill');
const reelCurrentNum = document.querySelector('.reel-current-num');
const cinemaCards = [...document.querySelectorAll('.cinema-card')];
const aboutSection = document.getElementById('about');
const visionBoard = document.querySelector('.vision-board');
const draggablePieces = document.querySelectorAll('[data-draggable]');
const nav = document.querySelector('.nav');
const mascot = document.querySelector('.nav-smile');
const mascotLinks = document.querySelectorAll('.nav-about, .nav-work, .nav-connect');
const connectTrigger = document.querySelector('.nav-connect');
const connectGroup = document.querySelector('.nav-connect-group');
const connectSocialLinks = document.querySelectorAll('.nav-connect-group .social-pill');
const rotatingWord = document.querySelector('.rotating-word');
const peekCharacter = document.querySelector('.peek-character');
const peekBubble = document.querySelector('.peek-bubble');

let reelScrollFrame = null;

const updateReelAndTheme = () => {
  reelScrollFrame = null;
  if (!reelPin || !reelTrack || !reelViewport) return;

  const pinRect = reelPin.getBoundingClientRect();
  const pinTop = pinRect.top + window.scrollY;
  const pinHeight = reelPin.offsetHeight;
  const maxScroll = pinHeight - window.innerHeight;

  if (maxScroll <= 0) return;

  const currentScroll = window.scrollY - pinTop;
  const rawProgress = Math.min(Math.max(currentScroll / maxScroll, 0), 1);

  // Cards smoothly translate across 0 -> 0.82 of scroll runway.
  // The final ~18% gives generous dwell time where Card 04 and the HUD bar remain completely stationary and visible on screen.
  const glideProgress = Math.min(rawProgress / 0.82, 1);
  const maxTranslate = Math.max(0, reelTrack.scrollWidth - reelViewport.clientWidth);
  reelTrack.style.transform = `translate3d(-${glideProgress * maxTranslate}px, 0, 0)`;

  if (reelProgressFill) {
    reelProgressFill.style.width = `${Math.round(glideProgress * 100)}%`;
  }

  // Active card indicator and numbering
  if (cinemaCards.length) {
    const cardStep = 1 / cinemaCards.length;
    const activeIdx = Math.min(
      Math.floor((glideProgress + 0.12) / cardStep),
      cinemaCards.length - 1
    );
    if (reelCurrentNum) {
      reelCurrentNum.textContent = `0${activeIdx + 1}`;
    }
    cinemaCards.forEach((card, idx) => {
      card.classList.toggle('is-active', idx === activeIdx);
    });
  }

  // Multi-stage background color transition (inspired by gravity-design.de):
  // 1. Above video section: default charcoal (#222222)
  // 2. Video, Results, Services & Landing sections active: warm sketchbook Light Paper theme (#f5eedf)
  // 3. About section active: warm espresso (#1c1815)
  const lightSections = ['videos', 'results', 'services', 'landing']
    .map((id) => document.getElementById(id))
    .filter(Boolean);
  const aboutRect = aboutSection ? aboutSection.getBoundingClientRect() : null;
  const vh = window.innerHeight;

  const isAboutActive = aboutRect ? aboutRect.top <= vh * 0.5 : false;
  const isLightActive = !isAboutActive && lightSections.some((section) => {
    const rect = section.getBoundingClientRect();
    // Hidden sections (e.g. Results with body.results-off) report a 0x0 rect at top 0
    if (!rect.height) return false;
    return rect.top <= vh * 0.72 && rect.bottom >= 0;
  });

  document.body.classList.toggle('theme-espresso', isAboutActive);
  document.body.classList.toggle('theme-paper', isLightActive);
};

if (reelPin && reelTrack) {
  const requestReelUpdate = () => {
    if (reelScrollFrame) return;
    reelScrollFrame = requestAnimationFrame(updateReelAndTheme);
  };

  window.addEventListener('scroll', requestReelUpdate, { passive: true });
  window.addEventListener('resize', requestReelUpdate);
  updateReelAndTheme();

  reelViewport?.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      window.scrollBy({ top: window.innerHeight * 0.45, behavior: 'smooth' });
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      window.scrollBy({ top: -window.innerHeight * 0.45, behavior: 'smooth' });
    }
  });
}

// Creative Campaign Lightbox Modal (Full-Scale Big Image Viewer)
const creativeModal = document.getElementById('creative-modal');
const creativeModalClose = creativeModal?.querySelector('.creative-modal-close');
const creativeModalOverlay = creativeModal?.querySelector('.creative-modal-overlay');
const creativeModalImg = creativeModal?.querySelector('.creative-modal-img');
const creativeModalBadge = creativeModal?.querySelector('.creative-modal-badge');
const creativeModalIdx = document.getElementById('creative-modal-idx');
const creativeModalTitle = creativeModal?.querySelector('.creative-modal-title');
const creativeModalDesc = creativeModal?.querySelector('.creative-modal-desc');
const creativeNavPrev = creativeModal?.querySelector('.creative-nav-prev');
const creativeNavNext = creativeModal?.querySelector('.creative-nav-next');

let currentCreativeIndex = 0;

const updateCreativeModalContent = (index) => {
  if (!cinemaCards.length || !cinemaCards[index]) return;
  currentCreativeIndex = index;
  const card = cinemaCards[index];
  const { title, badge, desc, img } = card.dataset;

  if (creativeModalImg) {
    creativeModalImg.style.opacity = '0';
    creativeModalImg.style.transform = 'scale(0.96)';
    setTimeout(() => {
      creativeModalImg.src = img || '';
      creativeModalImg.alt = title || '';
      creativeModalImg.style.opacity = '1';
      creativeModalImg.style.transform = 'scale(1)';
    }, 110);
  }

  if (creativeModalIdx) creativeModalIdx.textContent = `0${index + 1}`;
  if (creativeModalBadge) creativeModalBadge.textContent = badge || 'Campaign';
  if (creativeModalTitle) creativeModalTitle.textContent = title || '';
  if (creativeModalDesc) creativeModalDesc.textContent = desc || '';
};

const lockModalScroll = () => {
  document.documentElement.classList.add('modal-open');
  document.body.classList.add('modal-open');
};

const unlockModalScroll = () => {
  const isCreativeOpen = creativeModal?.classList.contains('is-open');
  const isVpOpen = document.getElementById('vp-modal')?.classList.contains('is-open');
  if (!isCreativeOpen && !isVpOpen) {
    document.documentElement.classList.remove('modal-open');
    document.body.classList.remove('modal-open');
  }
};

const openCreativeModal = (cardOrIndex) => {
  if (!creativeModal) return;
  let index = 0;
  if (typeof cardOrIndex === 'number') {
    index = cardOrIndex;
  } else if (cardOrIndex && cardOrIndex.dataset && cardOrIndex.dataset.index !== undefined) {
    index = parseInt(cardOrIndex.dataset.index, 10) || 0;
  }
  updateCreativeModalContent(index);

  lockModalScroll();
  creativeModal.inert = false;
  creativeModal.classList.add('is-open');
  creativeModal.setAttribute('aria-hidden', 'false');
  creativeModalClose?.focus();
};

const closeCreativeModal = () => {
  if (!creativeModal) return;
  creativeModal.classList.remove('is-open');
  creativeModal.setAttribute('aria-hidden', 'true');
  creativeModal.inert = true;
  unlockModalScroll();
};

const showNextCreative = () => {
  if (!cinemaCards.length) return;
  const nextIdx = (currentCreativeIndex + 1) % cinemaCards.length;
  updateCreativeModalContent(nextIdx);
};

const showPrevCreative = () => {
  if (!cinemaCards.length) return;
  const prevIdx = (currentCreativeIndex - 1 + cinemaCards.length) % cinemaCards.length;
  updateCreativeModalContent(prevIdx);
};

cinemaCards.forEach((card, idx) => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', (e) => {
    e.stopPropagation();
    openCreativeModal(idx);
  });
});

creativeNavNext?.addEventListener('click', (e) => {
  e.stopPropagation();
  showNextCreative();
});

creativeNavPrev?.addEventListener('click', (e) => {
  e.stopPropagation();
  showPrevCreative();
});

creativeModalClose?.addEventListener('click', closeCreativeModal);
creativeModalOverlay?.addEventListener('click', closeCreativeModal);

// ──────────────────────────────────────────────────────────────
// GLOBAL AUDIO MANAGER
// Only ONE of the three inline videos can play audio at a time.
// Registering a video adds it to the pool; calling .requestAudio()
// mutes all others and unmutes the caller.
// ──────────────────────────────────────────────────────────────
const audioManager = (() => {
  const pool = []; // { videoEl, muteBtn, onMutedChange }

  const muteAll = () => {
    pool.forEach(({ videoEl, muteBtn, onMutedChange }) => {
      videoEl.muted = true;
      if (onMutedChange) onMutedChange(true);
    });
  };

  return {
    register(videoEl, muteBtn, onMutedChange) {
      pool.push({ videoEl, muteBtn, onMutedChange });
    },
    requestAudio(videoEl) {
      // Mute everyone else
      pool.forEach((entry) => {
        if (entry.videoEl !== videoEl) {
          entry.videoEl.muted = true;
          if (entry.onMutedChange) entry.onMutedChange(true);
        }
      });
    },
    muteAll,
  };
})();

// ──────────────────────────────────────────────────────────────
// Video 1 — Intro / NEON RAIN inline player
// ──────────────────────────────────────────────────────────────
const liveVideo = document.getElementById('neon-rain-video');
const liveMuteBtn = document.getElementById('neon-rain-mute-btn');
const liveScreen = document.getElementById('neon-rain-screen');

if (liveVideo && liveMuteBtn && liveScreen) {
  liveVideo.muted = true;

  const updateV1UI = (isMuted) => {
    if (isMuted) {
      liveMuteBtn.classList.add('is-muted');
      liveMuteBtn.setAttribute('aria-label', 'Unmute video audio');
      const text = liveMuteBtn.querySelector('.mute-btn-label');
      if (text) text.textContent = 'Unmute';
      liveScreen.classList.remove('is-sound-on');
    } else {
      liveMuteBtn.classList.remove('is-muted');
      liveMuteBtn.setAttribute('aria-label', 'Mute video audio');
      const text = liveMuteBtn.querySelector('.mute-btn-label');
      if (text) text.textContent = 'Mute';
      liveScreen.classList.add('is-sound-on');
    }
  };

  audioManager.register(liveVideo, liveMuteBtn, updateV1UI);

  const toggleV1Sound = (e) => {
    if (e) e.stopPropagation();
    if (liveVideo.muted) {
      // Going to unmute — mute all others first
      audioManager.requestAudio(liveVideo);
      liveVideo.muted = false;
      liveVideo.play().catch(() => {});
    } else {
      liveVideo.muted = true;
    }
    updateV1UI(liveVideo.muted);
  };

  liveMuteBtn.addEventListener('click', toggleV1Sound);

  liveScreen.addEventListener('click', (e) => {
    e.stopPropagation();
    if (liveVideo.paused) liveVideo.play().catch(() => {});
    toggleV1Sound();
  });
}

// ──────────────────────────────────────────────────────────────
// Video 2 — VELOCITY inline card player
// ──────────────────────────────────────────────────────────────
const velocityVideo  = document.getElementById('velocity-video');
const velocityMuteBtn = document.getElementById('velocity-mute-btn');

if (velocityVideo && velocityMuteBtn) {
  velocityVideo.muted = true;

  const updateV2MuteUI = (isMuted) => {
    if (isMuted) {
      velocityMuteBtn.classList.add('is-muted');
      velocityMuteBtn.setAttribute('aria-label', 'Unmute SaaS video');
      const label = velocityMuteBtn.querySelector('.mute-btn-label');
      if (label) label.textContent = 'Unmute';
    } else {
      velocityMuteBtn.classList.remove('is-muted');
      velocityMuteBtn.setAttribute('aria-label', 'Mute SaaS video');
      const label = velocityMuteBtn.querySelector('.mute-btn-label');
      if (label) label.textContent = 'Mute';
    }
  };

  audioManager.register(velocityVideo, velocityMuteBtn, updateV2MuteUI);

  const toggleV2Sound = (e) => {
    if (e) e.stopPropagation();
    if (velocityVideo.muted) {
      audioManager.requestAudio(velocityVideo);
      velocityVideo.muted = false;
      velocityVideo.play().catch(() => {});
    } else {
      velocityVideo.muted = true;
    }
    updateV2MuteUI(velocityVideo.muted);
  };

  velocityMuteBtn.addEventListener('click', toggleV2Sound);
}

// ──────────────────────────────────────────────────────────────
// Video 3 — SOLARIS inline card player
// ──────────────────────────────────────────────────────────────
const solarisVideo  = document.getElementById('solaris-video');
const solarisMuteBtn = document.getElementById('solaris-mute-btn');

if (solarisVideo && solarisMuteBtn) {
  solarisVideo.muted = true;

  const updateV3MuteUI = (isMuted) => {
    if (isMuted) {
      solarisMuteBtn.classList.add('is-muted');
      solarisMuteBtn.setAttribute('aria-label', 'Unmute OREO AI video');
      const label = solarisMuteBtn.querySelector('.mute-btn-label');
      if (label) label.textContent = 'Unmute';
    } else {
      solarisMuteBtn.classList.remove('is-muted');
      solarisMuteBtn.setAttribute('aria-label', 'Mute OREO AI video');
      const label = solarisMuteBtn.querySelector('.mute-btn-label');
      if (label) label.textContent = 'Mute';
    }
  };

  audioManager.register(solarisVideo, solarisMuteBtn, updateV3MuteUI);

  const toggleV3Sound = (e) => {
    if (e) e.stopPropagation();
    if (solarisVideo.muted) {
      audioManager.requestAudio(solarisVideo);
      solarisVideo.muted = false;
      solarisVideo.play().catch(() => {});
    } else {
      solarisVideo.muted = true;
    }
    updateV3MuteUI(solarisVideo.muted);
  };

  solarisMuteBtn.addEventListener('click', toggleV3Sound);
}

// ──────────────────────────────────────────────────────────────
// Inline videos only play while they are on screen, so nothing
// streams on first load. Reduced-motion visitors get the poster
// frame and can still start a video themselves.
// ──────────────────────────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const inlineVideos = [liveVideo, velocityVideo, solarisVideo].filter(Boolean);
const visibleVideos = new Set();

const playIfVisible = (video) => {
  if (prefersReducedMotion || !visibleVideos.has(video)) return;
  video.play().catch(() => {});
};

if ('IntersectionObserver' in window) {
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) {
        visibleVideos.add(target);
        playIfVisible(target);
      } else {
        visibleVideos.delete(target);
        target.pause();
      }
    });
  }, { threshold: 0.25 });
  inlineVideos.forEach((video) => videoObserver.observe(video));
} else {
  inlineVideos.forEach((video) => {
    visibleVideos.add(video);
    playIfVisible(video);
  });
}

// ──────────────────────────────────────────────────────────────
// Clean Video Player Modal (.vp-modal) — for Card 2 & 3 click
// ──────────────────────────────────────────────────────────────
const vpModal      = document.getElementById('vp-modal');
const vpOverlay    = document.getElementById('vp-overlay');
const vpCloseBtn   = document.getElementById('vp-close-btn');
const vpVideo      = document.getElementById('vp-video');
const vpTapArea    = document.getElementById('vp-tap-area');
const vpPlayPause  = document.getElementById('vp-play-pause');
const vpSeek       = document.getElementById('vp-seek');
const vpSeekFilled = document.getElementById('vp-seek-filled');
const vpMuteBtn    = document.getElementById('vp-mute-btn');
const vpVol        = document.getElementById('vp-vol');
const vpVolFilled  = document.getElementById('vp-vol-filled');
const vpTitleLabel = document.getElementById('vp-title-label');
const vpCurrent    = vpModal?.querySelector('.vp-current');
const vpDuration   = vpModal?.querySelector('.vp-duration');
const vpIconPlay   = vpPlayPause?.querySelector('.vp-icon-play');
const vpIconPause  = vpPlayPause?.querySelector('.vp-icon-pause');
const vpVolOn      = vpMuteBtn?.querySelector('.vp-vol-on');
const vpVolOff     = vpMuteBtn?.querySelector('.vp-vol-off');

const fmtTime = (s) => {
  if (!isFinite(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = String(Math.floor(s % 60)).padStart(2, '0');
  return `${m}:${sec}`;
};

const vpSyncPlayPauseUI = () => {
  if (!vpVideo) return;
  const paused = vpVideo.paused;
  if (vpIconPlay)  vpIconPlay.style.display  = paused ? '' : 'none';
  if (vpIconPause) vpIconPause.style.display = paused ? 'none' : '';
  if (vpPlayPause) vpPlayPause.setAttribute('aria-label', paused ? 'Play' : 'Pause');
};

const vpSyncVolumeUI = () => {
  if (!vpVideo) return;
  const m = vpVideo.muted || vpVideo.volume === 0;
  if (vpVolOn)  vpVolOn.style.display  = m ? 'none' : '';
  if (vpVolOff) vpVolOff.style.display = m ? '' : 'none';
  if (vpMuteBtn) vpMuteBtn.setAttribute('aria-label', m ? 'Unmute' : 'Mute');
  if (vpVolFilled) vpVolFilled.style.width = `${(m ? 0 : vpVideo.volume) * 100}%`;
  if (vpVol) vpVol.value = m ? 0 : vpVideo.volume;
};

const openVpModal = (src, title) => {
  if (!vpModal || !vpVideo) return;
  // Mute all inline cards while modal is open
  audioManager.muteAll();

  if (vpTitleLabel) vpTitleLabel.textContent = title || '';
  vpVideo.src = src;
  vpVideo.muted = false;
  vpVideo.volume = 1;
  vpVideo.load();
  vpVideo.play().catch(() => {});

  vpSyncPlayPauseUI();
  vpSyncVolumeUI();
  if (vpSeekFilled) vpSeekFilled.style.width = '0%';
  if (vpSeek) vpSeek.value = 0;

  lockModalScroll();
  vpModal.inert = false;
  vpModal.classList.add('is-open');
  vpModal.setAttribute('aria-hidden', 'false');
  vpCloseBtn?.focus();
};

const closeVpModal = () => {
  if (!vpModal || !vpVideo) return;
  vpVideo.pause();
  vpVideo.src = '';
  vpModal.classList.remove('is-open');
  vpModal.setAttribute('aria-hidden', 'true');
  vpModal.inert = true;
  unlockModalScroll();
  // Inline loops that are still on screen carry on silently
  inlineVideos.forEach(playIfVisible);
};

if (vpVideo) {
  vpVideo.addEventListener('timeupdate', () => {
    if (!vpVideo.duration) return;
    const pct = (vpVideo.currentTime / vpVideo.duration) * 100;
    if (vpSeek) vpSeek.value = pct;
    if (vpSeekFilled) vpSeekFilled.style.width = `${pct}%`;
    if (vpCurrent) vpCurrent.textContent = fmtTime(vpVideo.currentTime);
  });

  vpVideo.addEventListener('loadedmetadata', () => {
    if (vpDuration) vpDuration.textContent = fmtTime(vpVideo.duration);
  });

  vpVideo.addEventListener('play',  vpSyncPlayPauseUI);
  vpVideo.addEventListener('pause', vpSyncPlayPauseUI);
}

vpTapArea?.addEventListener('click', () => {
  if (!vpVideo) return;
  vpVideo.paused ? vpVideo.play().catch(() => {}) : vpVideo.pause();
});

vpPlayPause?.addEventListener('click', () => {
  if (!vpVideo) return;
  vpVideo.paused ? vpVideo.play().catch(() => {}) : vpVideo.pause();
});

vpSeek?.addEventListener('input', () => {
  if (!vpVideo || !vpVideo.duration) return;
  vpVideo.currentTime = (Number(vpSeek.value) / 100) * vpVideo.duration;
  if (vpSeekFilled) vpSeekFilled.style.width = `${vpSeek.value}%`;
});

vpMuteBtn?.addEventListener('click', () => {
  if (!vpVideo) return;
  vpVideo.muted = !vpVideo.muted;
  vpSyncVolumeUI();
});

vpVol?.addEventListener('input', () => {
  if (!vpVideo) return;
  vpVideo.volume = Number(vpVol.value);
  vpVideo.muted = Number(vpVol.value) === 0;
  vpSyncVolumeUI();
});

vpCloseBtn?.addEventListener('click', closeVpModal);
vpOverlay?.addEventListener('click', closeVpModal);

// Keyboard: Esc closes the modal, space toggles play
document.addEventListener('keydown', (e) => {
  if (!vpModal?.classList.contains('is-open')) return;
  if (e.key === 'Escape') closeVpModal();
  if (e.key === ' ' || e.key === 'Spacebar') {
    e.preventDefault();
    vpVideo?.paused ? vpVideo.play().catch(() => {}) : vpVideo?.pause();
  }
});

// Wire Video Cards:
// - Video 1 (Intro Video): stays inline, never opens modal
// - Video 2 & 3: clicking card or open button opens clean vp-modal
document.querySelectorAll('.video-card').forEach((card) => {
  card.addEventListener('click', (e) => {
    // If user clicked the inline mute button, do not open the modal
    if (e.target.closest('.video-inline-mute-btn')) return;

    // Intro Video plays inline on the page and never opens in a modal
    if (card.classList.contains('video-card-featured') || card.querySelector('#neon-rain-video')) return;

    // Card with custom video source opens clean player modal
    const videoSrc = card.dataset.videoSrc;
    if (videoSrc) openVpModal(videoSrc, card.dataset.videoTitle || 'Video Player');
  });
});

// Prevent background window scroll leakage while modal is open
[creativeModal, vpModal].forEach((modal) => {
  if (!modal) return;
  modal.addEventListener('wheel', (e) => {
    const shell = modal.querySelector('.creative-modal-shell');
    if (shell && shell.contains(e.target)) {
      const { scrollTop, scrollHeight, clientHeight } = shell;
      const isScrollable = scrollHeight > clientHeight;
      if (isScrollable) {
        const isAtTop = scrollTop <= 0 && e.deltaY < 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight && e.deltaY > 0;
        if (isAtTop || isAtBottom) {
          e.preventDefault();
        }
        return;
      }
    }
    e.preventDefault();
  }, { passive: false });

  modal.addEventListener('touchmove', (e) => {
    const shell = modal.querySelector('.creative-modal-shell');
    if (!shell || !shell.contains(e.target)) {
      e.preventDefault();
    }
  }, { passive: false });
});

document.addEventListener('keydown', (e) => {
  if (creativeModal?.classList.contains('is-open')) {
    if (e.key === 'ArrowRight') {
      showNextCreative();
      return;
    }
    if (e.key === 'ArrowLeft') {
      showPrevCreative();
      return;
    }
  }
  if (e.key === 'Escape') closeCreativeModal();
});

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
  const words = ['alive.', 'consistent.', 'on-brand.', 'followed.', 'unmissable.'];
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
    const slot = mascot.closest('.nav-smile-slot') || mascot;
    const mascotHomeCenter = navBox.left + slot.offsetLeft + slot.offsetWidth / 2;
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

// ──────────────────────────────────────────────────────────────
// Prospect tracking: a link like ?ref=brandname is carried into
// WhatsApp messages, the booking link and Clarity, and CTA clicks
// are sent to Clarity as events (cta_booking, cta_whatsapp, cta_email).
// ──────────────────────────────────────────────────────────────
const sendClarity = (...args) => {
  if (typeof window.clarity === 'function') window.clarity(...args);
};

const prospectRef = (() => {
  try {
    const raw = new URLSearchParams(window.location.search).get('ref') || '';
    return raw.replace(/[^\w.-]/g, '').slice(0, 40);
  } catch {
    return '';
  }
})();

if (prospectRef) {
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach((link) => {
    const url = new URL(link.href);
    const text = url.searchParams.get('text') || 'Hi Varun!';
    url.search = `?text=${encodeURIComponent(`${text} (via ref: ${prospectRef})`)}`;
    link.href = url.toString();
  });

  document.querySelectorAll('a[data-cta="booking"]').forEach((link) => {
    // Skip until the {{BOOKING_URL}} placeholder is replaced with a real link
    if (!/^https?:/.test(link.getAttribute('href') || '')) return;
    const url = new URL(link.href);
    url.searchParams.set('ref', prospectRef);
    url.searchParams.set('utm_content', prospectRef);
    link.href = url.toString();
  });

  sendClarity('set', 'ref', prospectRef);
}

document.addEventListener('click', (event) => {
  const link = event.target.closest('a[data-cta]');
  if (link) sendClarity('event', `cta_${link.dataset.cta}`);
});
