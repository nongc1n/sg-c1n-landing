import "./style.css";
import "./toastify.css";
import Pristine from "pristinejs";
import Toastify from "toastify-js";

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

  const onEscape = (e) => {
    if (e.key === "Escape") {
      stateHandler(true);
    }
  };

  const stateHandler = (openState) => {
    if (openState) {
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

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const valid = pristine.validate();

    if (valid && !loading) {
      loading = true;

      /**
       * Disable form
       */
      e.target.childNodes[1].setAttribute("disabled", true);
      e.submitter.lastChild.textContent = "Sending...";
      this.classList.add("loading");

      /**
       * This setTimeout should be replaced by slack API
       */
      setTimeout(() => {
        /**
         * In case of error
         * getMessage('error', 'Unable to send the message. Please try again later.')
         * className: 'error'
         */
        Toastify({
          node: getMessage("success", "Message sent"),
          className: "success",
          duration: 3000,
        }).showToast();

        /**
         * Enable the form after error or success
         */
        e.target.childNodes[1].removeAttribute("disabled");
        e.submitter.lastChild.textContent = "Send";
        this.classList.remove("loading");
        this.reset(); // reset form

        loading = false;
      }, 1500);
    }
  });
});
