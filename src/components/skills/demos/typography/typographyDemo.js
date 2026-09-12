function initTypoDemoPrices() {
  document.querySelectorAll(".typo-demo__stage").forEach((stage) => {
    if (stage.dataset.priceBound === "1") return;
    stage.dataset.priceBound = "1";

    const nums = stage.querySelectorAll(".demo-num");
    const deltas = stage.querySelectorAll(".demo-delta");

    const prevVals = Array.from(nums).map((el) =>
      parseFloat((el.getAttribute("data-base") || "0").replace(",", ""))
    );

    let tick = 0;

    setInterval(() => {
      tick++;

      nums.forEach((el, i) => {
        const base = parseFloat(el.getAttribute("data-base") || "1000");
        const isBTC = base > 10000;

        const jitter = isBTC
          ? Math.random() * 600 - 300 + Math.sin(tick / 3) * 120
          : Math.random() * 80 - 40;

        const val = Math.max(
          0,
          base + jitter + Math.sin(tick / 5 + i) * (isBTC ? 80 : 20)
        );

        const formatted =
          "$" +
          val.toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          });

        const prev = prevVals[i];
        const deltaEl = deltas[i];

        el.textContent = formatted;

        if (val > prev) {
          el.classList.remove("down");
          el.classList.add("up");
          if (deltaEl) {
            deltaEl.textContent = "▲";
            deltaEl.className = "demo-delta up";
          }
        } else if (val < prev) {
          el.classList.remove("up");
          el.classList.add("down");
          if (deltaEl) {
            deltaEl.textContent = "▼";
            deltaEl.className = "demo-delta down";
          }
        }

        prevVals[i] = val;
      });
    }, 750);
  });
}

initTypoDemoPrices();
document.addEventListener("astro:page-load", initTypoDemoPrices);
document.addEventListener("astro:after-swap", initTypoDemoPrices);