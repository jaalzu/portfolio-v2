// Para CSS: marca [data-inview] con el atributo data-in-view cuando está visible
export function initInView() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.toggleAttribute("data-in-view", entry.isIntersecting);
      });
    },
    { rootMargin: "100px 0px" },
  );

  document
    .querySelectorAll("[data-inview]")
    .forEach((el) => observer.observe(el));
}

// Para JS: llama a cb(true/false) cuando el elemento entra o sale
export function onInView(el: Element, cb: (inView: boolean) => void) {
  const io = new IntersectionObserver(([entry]) => cb(entry.isIntersecting), {
    rootMargin: "100px 0px",
  });
  io.observe(el);
  return () => io.disconnect();
}
