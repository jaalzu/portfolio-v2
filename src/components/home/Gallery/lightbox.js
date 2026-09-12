import { safeAnimate, springs } from '../../../lib/motion-tokens';

function getLang() {
  return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'es';
}

function createArrowButton(direction, supportsHover) {
  const button = document.createElement('button');

  button.type = 'button';
  button.className = 'lightbox-arrow';

  const lang = getLang();
  button.setAttribute(
    'aria-label',
    lang === 'en'
      ? direction === 'prev' ? 'Previous image' : 'Next image'
      : direction === 'prev' ? 'Imagen anterior' : 'Imagen siguiente'
  );

  button.style.cssText = `
    position: absolute;
    top: 50%;
    ${direction === 'prev' ? 'left: -46px;' : 'right: -46px;'}
    transform: translateY(-50%);
    width: 44px;
    height: 44px;
    padding: var(--space-2);
    border: none;
    border-radius: var(--radius-full);
    background: transparent;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  `;

  if (!supportsHover) {
    button.style.display = 'none';
  }

  const icon = document.createElement('img');

  icon.src = '/skills/arrow.svg';
  icon.alt = '';
  icon.setAttribute('aria-hidden', 'true');

  icon.style.cssText = `
    width: 100%;
    height: 100%;
    display: block;
    filter: invert(1);
    ${direction === 'prev' ? 'transform: rotate(180deg);' : ''}
  `;

  button.appendChild(icon);

  return button;
}

function killAnimations(el) {
  try {
    el.getAnimations?.().forEach((a) => a.cancel());
  } catch (err) {
    // noop
  }
}

function openLightbox(img, supportsHover) {
  const gallery = img.closest('.province__gallery');
  if (!gallery) return;

  const startRect = img.getBoundingClientRect();

  const allPhotos = gallery.querySelectorAll('.province__photo');

  const photoSrcs = Array.from(allPhotos).map((el) => el.getAttribute('src'));

  const photoCaptions = Array.from(allPhotos).map(
    (el) => el.getAttribute('data-caption') || el.getAttribute('alt') || ''
  );

  const currentIndex = photoSrcs.indexOf(img.getAttribute('src'));
  if (currentIndex === -1) return;

  const province = img.closest('.province');

  if (province) {
    province.classList.add('province--gallery-open');
  }

  // ... overlay, card, etc. (sin cambios) ...

  // ============================================================
  // OVERLAY
  // ============================================================

  const overlay = document.createElement('div');

  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    height: 100vh;
    height: 100dvh;
    background: oklch(0 0 0 / 0.55);
    backdrop-filter: blur(3px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--space-6);
    z-index: 9999999;
    cursor: default;
    opacity: 0;
    pointer-events: auto;
  `;

  // ============================================================
  // CARD
  // ============================================================

  const card = document.createElement('div');

  card.style.cssText = `
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding: var(--space-3) var(--space-3) var(--space-6);
    border-radius: var(--radius-base);
    box-shadow: var(--shadow-md);
    max-width: min(85vw, 420px);
    width: 100%;
    will-change: transform;
    transform-origin: center center;
  `;

  // ============================================================
  // BIG IMAGE
  // ============================================================

  const bigImg = document.createElement('img');

  bigImg.src = photoSrcs[currentIndex];
  bigImg.alt = img.alt || (getLang() === 'en' ? 'Enlarged image' : 'Imagen ampliada');

  bigImg.style.cssText = `
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: cover;
    border-radius: var(--radius-inner);
    display: block;
    cursor: default;
  `;

  card.appendChild(bigImg);

  // ============================================================
  // CAPTION
  // ============================================================

  const captionEl = document.createElement('div');

  captionEl.style.cssText = `
    margin-top: var(--space-4);
    font-family: "Newsreader", serif;
    font-style: italic;
    font-weight: 400;
    font-size: var(--text-lg);
    line-height: var(--leading-normal);
    color: #2a2a2a;
    text-align: center;
  `;

  captionEl.textContent = photoCaptions[currentIndex];

  card.appendChild(captionEl);

  // ============================================================
  // CLOSE BUTTON
  // ============================================================

  const closeBtn = document.createElement('button');

  closeBtn.type = 'button';
  closeBtn.innerHTML = '✕';
  closeBtn.setAttribute('aria-label', getLang() === 'en' ? 'Close' : 'Cerrar');

  closeBtn.style.cssText = `
    position: absolute;
    top: -12px;
    right: -12px;
    background: var(--color-red);
    border: none;
    border-radius: var(--radius-full);
    width: 32px;
    height: 32px;
    font-size: 17px;
    color: var(--color-text-heading);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    z-index: 10;
    pointer-events: auto;
  `;

  card.appendChild(closeBtn);

  // ============================================================
  // ARROWS
  // ============================================================

  const prevBtn = createArrowButton('prev', supportsHover);
  const nextBtn = createArrowButton('next', supportsHover);

  card.appendChild(prevBtn);
  card.appendChild(nextBtn);

  // ============================================================
  // MOUNT
  // ============================================================

  overlay.appendChild(card);
  document.body.appendChild(overlay);

  // Frena la propagación de touchstart hacia document (fix de mobile
  // de la vuelta anterior — sigue siendo necesario para que tocar el
  // botón de cerrar en touch no dispare el listener global de
  // interactions.js).
  overlay.addEventListener(
    'touchstart',
    (e) => {
      e.stopPropagation();
    },
    { capture: true, passive: true }
  );

  // ============================================================
  // FLIP: del polaroid al centro
  // ============================================================

  const endRect = card.getBoundingClientRect();

  const scale = startRect.width / endRect.width;
  const deltaX =
    startRect.left + startRect.width / 2 - (endRect.left + endRect.width / 2);
  const deltaY =
    startRect.top + startRect.height / 2 - (endRect.top + endRect.height / 2);

  const startTransform = `translate(${deltaX}px, ${deltaY}px) scale(${scale})`;
  const endTransform = 'translate(0px, 0px) scale(1)';

  card.style.transform = startTransform;

  // ============================================================
  // STATE
  // ============================================================

  let currentIdx = currentIndex;
  let isClosing = false;

  let touchStartX = 0;
  let touchEndX = 0;

  const SWIPE_THRESHOLD = 50;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].clientX;

    const deltaX = touchEndX - touchStartX;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX < 0) {
      updateImage(currentIdx + 1);
    } else {
      updateImage(currentIdx - 1);
    }
  };

  card.addEventListener('touchstart', handleTouchStart, { passive: true });
  card.addEventListener('touchend', handleTouchEnd, { passive: true });

  // ============================================================
  // ARROW VISIBILITY
  // ============================================================

  const updateArrows = () => {
    prevBtn.style.visibility = currentIdx > 0 ? 'visible' : 'hidden';
    nextBtn.style.visibility =
      currentIdx < photoSrcs.length - 1 ? 'visible' : 'hidden';
  };

  // ============================================================
  // UPDATE IMAGE
  // ============================================================

  const updateImage = (newIndex) => {
    if (newIndex < 0 || newIndex >= photoSrcs.length) return;

    currentIdx = newIndex;

    safeAnimate(bigImg, { opacity: 0 }, { duration: 0.15, easing: 'ease-out' })
      .then(() => {
        bigImg.style.opacity = '0';
        bigImg.src = photoSrcs[currentIdx];
        bigImg.alt = allPhotos[currentIdx].getAttribute('alt') || (getLang() === 'en' ? 'Enlarged image' : 'Imagen ampliada');
        captionEl.textContent = photoCaptions[currentIdx];

        updateArrows();

        return safeAnimate(bigImg, { opacity: 1 }, { duration: 0.15, easing: 'ease-in' });
      })
      .then(() => {
        bigImg.style.opacity = '1';
      })
      .catch((err) => {
        console.error('[lightbox] updateImage error', err);
        bigImg.style.opacity = '1';
      });
  };

  // ============================================================
  // ARROW EVENTS
  // ============================================================

  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateImage(currentIdx - 1);
  });

  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    updateImage(currentIdx + 1);
  });

  updateArrows();

  // ============================================================
  // CLOSE MODAL (FLIP inverso: del centro de vuelta al polaroid)
  // ============================================================

  const closeModal = () => {
    if (isClosing) return;
    isClosing = true;

    document.removeEventListener('keydown', keyHandler);

    killAnimations(card);
    killAnimations(overlay);

    card.style.transform = endTransform;

    const targetEl = allPhotos[currentIdx] || img;
    const targetRect = targetEl.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    const closeScale = targetRect.width / cardRect.width;
    const closeDeltaX =
      targetRect.left + targetRect.width / 2 - (cardRect.left + cardRect.width / 2);
    const closeDeltaY =
      targetRect.top + targetRect.height / 2 - (cardRect.top + cardRect.height / 2);

    const closeTransform = `translate(${closeDeltaX}px, ${closeDeltaY}px) scale(${closeScale})`;

    let finished = false;

       const finishClose = () => {
      if (finished) return;
      finished = true;

      overlay.remove();

      // En desktop NO sacamos la clase acá. El usuario recién cerró
      // desde el botón X, que suele estar lejos del polaroid real —
      // si soltáramos la galería ahora, el CSS :hover miraría dónde
      // está el mouse en este instante (casi seguro afuera) y la
      // cerraría de una. En cambio, la dejamos abierta y la sacamos
      // recién cuando el mouse realmente abandona la zona de
      // .province, o si el usuario clickea en otro lado.
      if (supportsHover && province) {
        let released = false;

        const release = () => {
          if (released) return;
          released = true;

          province.classList.remove('province--gallery-open');
          province.removeEventListener('mouseleave', release);
          document.removeEventListener('click', handleOutsideClick);
        };

        const handleOutsideClick = (e) => {
          if (!province.contains(e.target)) release();
        };

        province.addEventListener('mouseleave', release, { once: true });
        document.addEventListener('click', handleOutsideClick);
      }
    };

    const fallbackTimer = setTimeout(finishClose, 350);

    Promise.all([
      safeAnimate(card, { transform: closeTransform }, { duration: 0.22, easing: 'ease-in' }),
      safeAnimate(overlay, { opacity: 0 }, { duration: 0.2, easing: 'ease-in' }),
    ])
      .catch((err) => {
        console.error('[lightbox] close animation error', err);
      })
      .then(() => {
        clearTimeout(fallbackTimer);
        finishClose();
      });
  };

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  overlay.addEventListener(
    'touchstart',
    (e) => {
      if (e.target === overlay) closeModal();
    },
    { passive: true }
  );

  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeModal();
  });

  card.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  const keyHandler = (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'ArrowLeft') updateImage(currentIdx - 1);
    if (e.key === 'ArrowRight') updateImage(currentIdx + 1);
  };

  document.addEventListener('keydown', keyHandler);

  // ============================================================
  // ENTRY ANIMATION
  // ============================================================

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      safeAnimate(overlay, { opacity: 1 }, { duration: 0.18, easing: 'ease-out' })
        .then(() => {
          overlay.style.opacity = '1';
        })
        .catch((err) => {
          console.error('[lightbox] overlay entry animation error', err);
          overlay.style.opacity = '1';
        });

      safeAnimate(card, { transform: endTransform }, { ...springs.swap, duration: 0.32 })
        .then(() => {
          card.style.transform = endTransform;
        })
        .catch((err) => {
          console.error('[lightbox] card entry animation error', err);
          card.style.transform = endTransform;
        });
    });
  });
}

export function initLightboxes({ supportsHover }) {
  document.querySelectorAll('.province__photo').forEach((img) => {
    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img, supportsHover);
    });
  });
}