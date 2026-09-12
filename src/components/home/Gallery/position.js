export function positionGallery(trigger) {
  const gallery = trigger.querySelector('.province__gallery');

  if (!gallery) return;

  const rect = trigger.getBoundingClientRect();
  const galleryRect = gallery.getBoundingClientRect();

  const sideMargin = 8;
  const gap = 56;

  let x = rect.left + rect.width / 2 - galleryRect.width / 2;

  x = Math.max(
    sideMargin,
    Math.min(x, window.innerWidth - galleryRect.width - sideMargin)
  );

  let y = rect.top - galleryRect.height - gap;

  const maxY = window.innerHeight - galleryRect.height - sideMargin;

  y = Math.max(sideMargin, Math.min(y, maxY));

  gallery.style.setProperty('--gallery-x', `${x}px`);
  gallery.style.setProperty('--gallery-y', `${y}px`);
}