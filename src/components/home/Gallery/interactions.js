import { positionGallery } from './position';

export function initGalleryInteractions({ supportsHover }) {
  const provinces = document.querySelectorAll('.province');

  if (supportsHover) {
    provinces.forEach((el) => {
      el.addEventListener('focus', () => positionGallery(el));
      el.addEventListener('mouseenter', () => positionGallery(el));
    });
  } else {
    provinces.forEach((el) => {
      el.addEventListener(
        'touchend',
        (e) => {
          if (el.classList.contains('province--gallery-open')) return;

          e.preventDefault();

          provinces.forEach((p) => {
            if (p !== el) p.classList.remove('province--gallery-open');
          });

          positionGallery(el);

          el.classList.add('province--gallery-open');
        },
        { passive: false }
      );
    });

    document.addEventListener('touchstart', (e) => {
      provinces.forEach((el) => {
        if (
          el.classList.contains('province--gallery-open') &&
          !el.contains(e.target)
        ) {
          el.classList.remove('province--gallery-open');
        }
      });
    });
  }

  window.addEventListener('resize', () => {
    provinces.forEach((el) => {
      if (
        el.matches(':hover, :focus-within') ||
        el.classList.contains('province--gallery-open')
      ) {
        positionGallery(el);
      }
    });
  });
}