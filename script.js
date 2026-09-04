/**
 * Yusuf Zaidany Arraihan - Modern Portfolio Interactions
 * Standards: Zero emojis, Zero em dashes, Vanilla JS, Accessible markup
 */

(function () {
  "use strict";

  // --------------------------------------------------------------------------
  // 1. Theme Management (Default: Dark Tech Theme)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById("theme-toggle");
  const htmlRoot = document.documentElement;

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem("site-theme");
    if (savedTheme) {
      return savedTheme;
    }
    // Default to dark theme for the modern tech aesthetic
    return "dark";
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute("data-theme", theme);
    localStorage.setItem("site-theme", theme);
  }

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      const currentTheme = htmlRoot.getAttribute("data-theme") || "dark";
      const targetTheme = currentTheme === "dark" ? "light" : "dark";
      applyTheme(targetTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Real-Time UTC Dispatch Clock
  // --------------------------------------------------------------------------
  const clockEl = document.getElementById("live-clock");

  function updateClock() {
    if (!clockEl) return;
    const now = new Date();
    const utcHours = String(now.getUTCHours()).padStart(2, "0");
    const utcMinutes = String(now.getUTCMinutes()).padStart(2, "0");
    const utcSeconds = String(now.getUTCSeconds()).padStart(2, "0");
    clockEl.textContent = "UTC " + utcHours + ":" + utcMinutes + ":" + utcSeconds;
  }

  updateClock();
  setInterval(updateClock, 1000);

  // --------------------------------------------------------------------------
  // 3. Project Filter Tabs
  // --------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(function (card) {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });

  // --------------------------------------------------------------------------
  // 4. Toast Notification System
  // --------------------------------------------------------------------------
  const toastContainer = document.getElementById("toast-container");

  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(function () {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(12px)";
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 200);
    }, 2800);
  }

  // --------------------------------------------------------------------------
  // 5. Copy Email to Clipboard
  // --------------------------------------------------------------------------
  const copyEmailBtn = document.getElementById("copy-email-btn");
  const emailAddress = "yusufzarraihan@gmail.com";

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", function () {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailAddress).then(function () {
          handleCopySuccess();
        }).catch(function () {
          fallbackCopyText(emailAddress);
        });
      } else {
        fallbackCopyText(emailAddress);
      }
    });
  }

  function handleCopySuccess() {
    if (!copyEmailBtn) return;
    copyEmailBtn.classList.add("copied");
    showToast("Copied to clipboard: " + emailAddress);
    setTimeout(function () {
      copyEmailBtn.classList.remove("copied");
    }, 2000);
  }

  function fallbackCopyText(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
      handleCopySuccess();
    } catch (err) {
      showToast("Please copy: " + text);
    }
    document.body.removeChild(textArea);
  }

  // --------------------------------------------------------------------------
  // 6. Accessible Modals (CV & Compendium)
  // --------------------------------------------------------------------------
  function setupModal(triggerSelector, modalId, closeBtnId) {
    const triggers = document.querySelectorAll(triggerSelector);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeBtnId);

    if (!modal) return;

    function openModal() {
      modal.classList.add("is-active");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove("is-active");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        openModal();
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeModal);
    }

    modal.addEventListener("click", function (e) {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-active")) {
        closeModal();
      }
    });
  }

  // Initialize CV modal
  setupModal("#cv-download-btn", "cv-modal", "modal-close-btn");

  // Initialize Compendium modal
  setupModal(".compendium-btn", "compendium-modal", "compendium-close-btn");

  // --------------------------------------------------------------------------
  // 7. Navigation Scroll Spy
  // --------------------------------------------------------------------------
  const navLinks = document.querySelectorAll(".nav-link");
  const trackedSections = document.querySelectorAll("section[id]");

  function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 120;

    trackedSections.forEach(function (section) {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(function (link) {
          if (link.getAttribute("href") === "#" + sectionId) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", updateActiveNavLink, { passive: true });
  updateActiveNavLink();
})();
