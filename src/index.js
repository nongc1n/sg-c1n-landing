import "./style.css";
import "./toastify.css";
import "./stars.css";
import Pristine from "pristinejs";
import Toastify from "toastify-js";
import * as debounce from "lodash.debounce";
import { ResizeObserver } from "resize-observer";

const cloudFunctionsEndpoint =
  "https://us-central1-singaporewebsite-45f50.cloudfunctions.net";
const siteRecaptchaKey = "6LcXETMeAAAAAENAN5bU8vrwUf9hvWzh8-o5mkv0";

/**
 * ICONS
 */
const checkCircle = `
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
`;

const xCircle = `
 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
`;

/**
 * Polyfill scrollIntoView
 * Load only for browsers that does not support
 * scrollIntoView
 */
const isSmoothScrollSupported =
  "scrollBehavior" in document.documentElement.style;

if (!isSmoothScrollSupported) {
  (async () => {
    const smoothscroll = await import("smoothscroll-polyfill");
    smoothscroll.polyfill();
  })();
}

document.addEventListener("DOMContentLoaded", function () {
  /**
   * Remove preload to enable transition after page loaded
   */
  setTimeout(() => {
    document.body.className = "";
  });

  /**
   * Button menu handling
   */
  const btnMenu = document.getElementById("btn-menu");
  const mobileMenu = document.getElementById("mobile-menu");

  const callback = debounce((e) => {
    if (btnMenu.classList.contains("active") && e[0].contentRect.width > 1279) {
      stateHandler(true);
    }
  }, 250);

  const ro = new ResizeObserver(callback);
  ro.observe(document.body);

  const onEscape = (e) => {
    if (e.key === "Escape") {
      stateHandler(true);
    }
  };

  const stateHandler = (closeState) => {
    if (closeState) {
      document.removeEventListener("keydown", onEscape);
      btnMenu.classList.remove("active");
      mobileMenu.classList.remove("open");
      document.body.style.overflow = "";
    } else {
      document.addEventListener("keydown", onEscape);
      btnMenu.classList.add("active");
      mobileMenu.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  };

  btnMenu.addEventListener("click", function () {
    stateHandler(this.classList.contains("active"));
  });

  /**
   * Menu
   */
  const desktopLinks = document.getElementById("desktop-menu");
  const mobileLinks = document.getElementById("mobile-menu");

  const linkHandler = (e) => {
    if (e.target && e.target.matches("a")) {
      e.preventDefault();

      if (mobileLinks.classList.contains("open")) {
        stateHandler(mobileLinks.classList.contains("open"));
      }

      document
        .getElementById(e.target.getAttribute("href").replace("#", ""))
        .scrollIntoView({
          behavior: "smooth",
        });
    }
  };

  desktopLinks.addEventListener("click", linkHandler);
  mobileLinks.addEventListener("click", linkHandler);

  function getMessage(type, message) {
    const el = document.createElement("div");
    el.classList.add("content");

    if (type === "success") {
      el.innerHTML = checkCircle;
      el.append(message);
    } else {
      el.innerHTML = xCircle;
      el.append(message);
    }
    return el;
  }

  /**
   * Form
   */
  const contactForm = document.getElementById("contact-form");
  const pristine = new Pristine(contactForm);
  let loading = false;

  function disableForm(e) {
    const len = e.target.elements.length;

    for (let i = 0; i < len; i++) {
      e.target.elements[i].setAttribute("disabled", true);
    }

    e.submitter.lastChild.textContent = "Sending...";
    e.submitter.setAttribute("disabled", true);
  }

  function enableForm(e) {
    const len = e.target.elements.length;

    for (let i = 0; i < len; i++) {
      e.target.elements[i].removeAttribute("disabled");
    }

    e.submitter.lastChild.textContent = "Send";
    e.submitter.removeAttribute("disabled");
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const valid = pristine.validate();

    if (valid && !loading) {
      loading = true;

      const formData = new FormData(this);

      const name = formData.get("name");
      const email = formData.get("email");
      const message = formData.get("message");

      this.classList.add("loading");
      disableForm(e);

      grecaptcha.ready(() => {
        grecaptcha
          .execute(siteRecaptchaKey, { action: "submit" })
          .then(async (token) => {
            const response = await fetch(
              `${cloudFunctionsEndpoint}/submitRequest`,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                  verificationToken: token,
                  data: {
                    name,
                    email,
                    message,
                  },
                }),
              }
            );

            if (response.ok) {
              this.reset();

              Toastify({
                node: getMessage("success", "Message sent!"),
                className: "success",
                duration: 5000,
              }).showToast();
            } else {
              Toastify({
                node: getMessage(
                  "error",
                  "Unable to send the message. Please try again later."
                ),
                className: "error",
                duration: 5000,
              }).showToast();
            }

            enableForm(e);
            this.classList.remove("loading");
            loading = false;
          });
      });
    }
  });
});
