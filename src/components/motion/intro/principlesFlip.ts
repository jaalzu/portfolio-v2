export function initPrincipleFlip(root: ParentNode = document) {
  root
    .querySelectorAll<HTMLButtonElement>(".principles__card")
    .forEach((card) => {
      card.addEventListener("click", () => {
        const flipped = card.classList.toggle("is-flipped");
        card.setAttribute("aria-pressed", String(flipped));
      });
    });
}
