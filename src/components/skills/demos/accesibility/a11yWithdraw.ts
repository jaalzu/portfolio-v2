import { safeAnimate, springs } from "../../../../lib/motion-tokens";
import { translations } from "../../../../data/translations";

const CHECK_ICON = `
  <svg
    viewBox="0 0 256 256"
    width="16"
    height="16"
    aria-hidden="true"
  >
    <rect width="256" height="256" fill="none"/>
    <polyline
      points="40 144 96 200 224 72"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="16"
    />
  </svg>
`;

type Lang = "es" | "en";

type Field = {
  input: string;
  error: string;
  validate: (value: string) => boolean;
  get fullError(): string;
};

function getLang(): Lang {
  return document.documentElement.getAttribute("data-lang") === "en"
    ? "en"
    : "es";
}

function getTranslations() {
  return translations[getLang()].skillsPage.a11yDemo;
}

function createFields(): Field[] {
  return [
    {
      input: "#wd-wallet",
      error: "#wd-wallet-error",

      validate: (value: string) => {
        return value.trim().length >= 6;
      },

      get fullError() {
        return getTranslations().errors.wallet;
      },
    },

    {
      input: "#wd-amount",
      error: "#wd-amount-error",

      validate: (value: string) => {
        const number = Number(
          value.trim().replace(",", ".")
        );

        return !Number.isNaN(number) && number > 0;
      },

      get fullError() {
        return getTranslations().errors.amount;
      },
    },
  ];
}

function initStage(stage: HTMLElement) {
  if (stage.dataset.bound === "1") return;

  stage.dataset.bound = "1";

  const card = stage.closest<HTMLElement>("[data-toggle-card]");
  const form = stage.querySelector<HTMLFormElement>(".wd-form");
  const toast = stage.querySelector<HTMLElement>(".wd-toast");

  if (!form) return;

  const fields = createFields();

  let toastTimer: ReturnType<typeof setTimeout> | null = null;

  const isAfter = () => {
    return card?.dataset.mode === "after";
  };

  const hideToast = () => {
    if (!toast || !toast.classList.contains("is-visible")) return;

    safeAnimate(
      toast,
      {
        opacity: 0,
        y: -8,
        scale: 0.98,
      },
      {
        type: "tween",
        duration: 0.18,
        ease: "easeIn",
      }
    )?.finished?.then(() => {
      toast.classList.remove("is-visible");
    });
  };

  const showToast = (
    message: string,
    variant: "error" | "success" = "error"
  ) => {
    if (!toast) return;

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    const icon = toast.querySelector<HTMLElement>(".wd-toast__icon");
    const text = toast.querySelector<HTMLElement>(".wd-toast__text");

    if (icon) {
      icon.innerHTML =
        variant === "success"
          ? CHECK_ICON
          : "";
    }

    if (text) {
      text.textContent = message;
    }

    toast.classList.toggle(
      "wd-toast--success",
      variant === "success"
    );

    toast.classList.add("is-visible");

    safeAnimate(
      toast,
      {
        opacity: [0, 1],
        y: [-8, 0],
        scale: [0.98, 1],
      },
      springs.reveal
    );

    toastTimer = setTimeout(hideToast, 2600);
  };

  const setFieldError = (
    field: Field,
    hasError: boolean
  ) => {
    const input =
      stage.querySelector<HTMLInputElement>(field.input);

    const error =
      stage.querySelector<HTMLElement>(field.error);

    if (!input || !error) return;

    if (!hasError) {
      input.classList.remove("is-invalid");
      error.textContent = "";
      error.classList.remove("is-visible");

      input.removeAttribute("aria-invalid");
      input.removeAttribute("aria-describedby");

      return;
    }

    if (!isAfter()) return;

    input.classList.add("is-invalid");

    error.textContent = field.fullError;
    error.classList.add("is-visible");

    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", error.id);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let allValid = true;

    fields.forEach((field) => {
      const input =
        stage.querySelector<HTMLInputElement>(field.input);

      const valid = input
        ? field.validate(input.value)
        : false;

      if (!valid) {
        allValid = false;
      }

      setFieldError(field, !valid);
    });

    if (!allValid) {
      if (isAfter()) {
        const invalidInput =
          stage.querySelector<HTMLInputElement>(
            ".wd-field__input.is-invalid"
          );

        invalidInput?.focus({
          preventScroll: true,
        });
      } else {
        showToast(
          getTranslations().toasts.invalid,
          "error"
        );
      }

      return;
    }

    showToast(
      getTranslations().toasts.success,
      "success"
    );

    form.reset();
  });

  fields.forEach((field) => {
    const input =
      stage.querySelector<HTMLInputElement>(field.input);

    input?.addEventListener("input", () => {
      if (field.validate(input.value)) {
        setFieldError(field, false);
      }
    });
  });

  card?.addEventListener(
    "toggle-card:mode-change",
    () => {
      fields.forEach((field) => {
        setFieldError(field, false);
      });

      hideToast();
    }
  );

  const onLangChange = () => {
    fields.forEach((field) => {
      const error =
        stage.querySelector<HTMLElement>(field.error);

      if (error?.classList.contains("is-visible")) {
        error.textContent = field.fullError;
      }
    });

    const visibleToast =
      stage.querySelector<HTMLElement>(
        ".wd-toast.is-visible .wd-toast__text"
      );

    if (
      visibleToast &&
      toast?.classList.contains("is-visible")
    ) {
      const isSuccess =
        toast.classList.contains("wd-toast--success");

      visibleToast.textContent = isSuccess
        ? getTranslations().toasts.success
        : getTranslations().toasts.invalid;
    }
  };

  document.addEventListener(
    "langchange",
    onLangChange
  );
}

export function initA11yWithdraw() {
  document
    .querySelectorAll<HTMLElement>(".a11y-demo__stage")
    .forEach(initStage);
}

initA11yWithdraw();

document.addEventListener(
  "astro:page-load",
  initA11yWithdraw
);

document.addEventListener(
  "astro:after-swap",
  initA11yWithdraw
);