/**
 * Modern Portfolio Application
 * @author Sarvesvar M S
 * @version 2.1.0
 * Uses ES6+ modules and modern JavaScript features
 */

// Single source of truth for the motion preference.
const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isFinePointer = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches;

// ============================================
// tsParticles Configuration & Initialization
// ============================================
const particlesConfig = {
  fpsLimit: 60, // 60 is visually identical to 120 here and halves the animation work
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        area: 800
      }
    },
    color: {
      value: ["#a855f7", "#06b6d4", "#ec4899", "#8b5cf6"]
    },
    shape: {
      type: "circle"
    },
    opacity: {
      value: { min: 0.1, max: 0.5 },
      animation: {
        enable: true,
        speed: 1,
        sync: false
      }
    },
    size: {
      value: { min: 1, max: 5 },
      animation: {
        enable: true,
        speed: 2,
        sync: false
      }
    },
    links: {
      enable: true,
      distance: 150,
      color: "#a855f7",
      opacity: 0.2,
      width: 1
    },
    move: {
      enable: true,
      speed: 1.5,
      direction: "none",
      random: true,
      straight: false,
      outModes: {
        default: "bounce"
      },
      attract: {
        enable: true,
        rotateX: 600,
        rotateY: 1200
      }
    }
  },
  interactivity: {
    detectsOn: "window",
    events: {
      onHover: {
        enable: true,
        mode: "grab"
      },
      onClick: {
        enable: true,
        mode: "push"
      },
      resize: {
        enable: true
      }
    },
    modes: {
      grab: {
        distance: 140,
        links: {
          opacity: 0.5
        }
      },
      push: {
        quantity: 4
      }
    }
  },
  detectRetina: true,
  background: {
    color: "transparent"
  }
};

// Initialize tsParticles (skipped under reduced-motion to respect users + save CPU/battery)
async function initParticles() {
  const container = document.getElementById("tsparticles");

  if (prefersReducedMotion()) {
    // Calm static gradient keeps depth without the moving physics sim.
    if (container) {
      container.style.background =
        "radial-gradient(circle at 30% 20%, rgba(168,85,247,0.12), transparent 60%)";
    }
    return;
  }

  if (typeof tsParticles === "undefined") return;

  try {
    await tsParticles.load({
      id: "tsparticles",
      options: particlesConfig
    });
  } catch (error) {
    console.warn("Particles initialization failed:", error);
  }
}

// ============================================
// Scroll-based Animations (replaces AOS)
// ============================================
class ScrollAnimator {
  constructor() {
    this.animatedElements = document.querySelectorAll("[data-animate]");
    this.observer = null;
    this.init();
  }

  init() {
    if (prefersReducedMotion()) {
      // Show all elements immediately without animation
      this.animatedElements.forEach(el => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    // Set initial state for animated elements
    this.animatedElements.forEach(el => {
      el.style.opacity = "0";
      el.style.transform = this.getInitialTransform(el.dataset.animate);
      el.style.transition = `opacity ${el.dataset.duration || 600}ms ease-out, transform ${el.dataset.duration || 600}ms ease-out`;

      if (el.dataset.delay) {
        el.style.transitionDelay = `${el.dataset.delay}ms`;
      }
    });

    // Create intersection observer
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.animateIn(entry.target);
            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    // Observe all animated elements
    this.animatedElements.forEach(el => this.observer.observe(el));
  }

  getInitialTransform(animation) {
    const transforms = {
      "fade-up": "translateY(30px)",
      "fade-down": "translateY(-30px)",
      "fade-left": "translateX(30px)",
      "fade-right": "translateX(-30px)",
      "zoom-in": "scale(0.9)",
      "fade": "none"
    };
    return transforms[animation] || "none";
  }

  animateIn(element) {
    requestAnimationFrame(() => {
      element.style.opacity = "1";
      element.style.transform = "none";
    });
  }
}

// ============================================
// Smooth Scroll Navigation
// ============================================
class SmoothScroll {
  constructor() {
    this.highlightTimers = [];
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", (e) => {
        const targetId = anchor.getAttribute("href");
        if (targetId === "#") return;
        const target = document.querySelector(targetId);
        if (!target) return;

        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: prefersReducedMotion() ? "auto" : "smooth"
        });

        // Highlight video cards when navigating from quick nav
        if (target.classList.contains("card")) {
          // Cancel any pending highlight timers so rapid clicks can't strand a card
          this.highlightTimers.forEach(clearTimeout);
          this.highlightTimers = [];
          document.querySelectorAll(".card.highlight").forEach(card => {
            card.classList.remove("highlight");
          });

          this.highlightTimers.push(
            setTimeout(() => {
              target.classList.add("highlight");
              this.highlightTimers.push(
                setTimeout(() => target.classList.remove("highlight"), 2000)
              );
            }, 500)
          );
        }
      });
    });
  }
}

// ============================================
// Floating Navigation Controller (rAF-throttled, class-based hide)
// ============================================
class NavController {
  constructor() {
    this.nav = document.querySelector(".floating-nav");
    this.lastScroll = 0;
    this.ticking = false;
    this.init();
  }

  init() {
    if (!this.nav) return;

    window.addEventListener("scroll", () => {
      if (this.ticking) return;
      this.ticking = true;
      requestAnimationFrame(() => {
        this.handleScroll();
        this.ticking = false;
      });
    }, { passive: true });
  }

  handleScroll() {
    const currentScroll = window.scrollY;

    this.nav.classList.toggle("scrolled", currentScroll > 100);

    // Don't hide-on-scroll under reduced motion.
    if (!prefersReducedMotion()) {
      const hide = currentScroll > this.lastScroll && currentScroll > 400;
      this.nav.classList.toggle("nav-hidden", hide);
    }

    this.lastScroll = currentScroll;
  }
}

// ============================================
// Active Section Highlighting (scroll-spy)
// ============================================
class ScrollSpy {
  constructor() {
    this.links = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    this.map = new Map();
    this.links.forEach(a => {
      const sec = document.querySelector(a.getAttribute("href"));
      if (sec) this.map.set(sec, a);
    });
    if (this.map.size) this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.links.forEach(l => l.classList.remove("active"));
          this.map.get(entry.target)?.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

    this.map.forEach((_, sec) => observer.observe(sec));
  }
}

// ============================================
// Scroll Progress Bar
// ============================================
class ScrollProgress {
  constructor() {
    this.bar = document.querySelector(".scroll-progress");
    this.ticking = false;
    if (this.bar) this.init();
  }

  init() {
    window.addEventListener("scroll", () => this.onScroll(), { passive: true });
    this.update();
  }

  onScroll() {
    if (this.ticking) return;
    this.ticking = true;
    requestAnimationFrame(() => {
      this.update();
      this.ticking = false;
    });
  }

  update() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const progress = max > 0 ? doc.scrollTop / max : 0;
    this.bar.style.transform = `scaleX(${progress})`;
  }
}

// ============================================
// Animated count-up for numeric stats
// ============================================
class CountUp {
  constructor() {
    this.els = document.querySelectorAll("[data-count]");
    if (this.els.length && !prefersReducedMotion()) this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.run(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    this.els.forEach(el => observer.observe(el));
  }

  run(el) {
    const end = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || "";
    const duration = 1200;
    let startTime = null;

    const tick = (now) => {
      if (startTime === null) startTime = now;
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(eased * end) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }
}

// ============================================
// Card Hover Spotlight (feeds --mouse-x/--mouse-y consumed by styles.css)
// ============================================
class CardEffects {
  constructor() {
    this.cards = document.querySelectorAll(".card");
    this.init();
  }

  init() {
    // No hover spotlight on touch devices or for reduced-motion users (CSS hides it too).
    if (!isFinePointer() || prefersReducedMotion()) return;
    this.cards.forEach(card => {
      card.addEventListener("mousemove", (e) => this.handleMouseMove(e, card));
      card.addEventListener("mouseleave", () => this.handleMouseLeave(card));
    });
  }

  handleMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }

  handleMouseLeave(card) {
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
  }
}

// ============================================
// Magnetic buttons / social icons (desktop only)
// ============================================
class Magnetic {
  constructor() {
    this.targets = document.querySelectorAll(".btn-primary, .btn-secondary, .social-link");
    if (this.targets.length && isFinePointer() && !prefersReducedMotion()) this.init();
  }

  init() {
    const strength = 0.35;
    this.targets.forEach(el => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }
}

// ============================================
// Video Lightbox (one player at a time -> no overlap; opens big & centered)
// ============================================
class VideoModal {
  constructor() {
    this.modal = document.getElementById("video-modal");
    if (!this.modal) return;
    this.frame = this.modal.querySelector(".video-modal__frame");
    this.closeBtn = this.modal.querySelector(".video-modal__close");
    this.lastFocused = null;
    this.init();
  }

  init() {
    document.querySelectorAll(".video-facade").forEach(el => {
      const open = () => this.open(el);
      el.addEventListener("click", open);
      el.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      });
    });

    this.closeBtn.addEventListener("click", () => this.close());
    // Click on the dark backdrop (but not the player) closes it
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("open")) this.close();
    });
  }

  open(el) {
    const src = el.dataset.src;
    if (!src) return;
    this.lastFocused = el;

    // Replace any previous iframe -> only one video can ever play.
    const iframe = document.createElement("iframe");
    iframe.src = src;
    iframe.title = (el.getAttribute("aria-label") || "Video").replace(/^Play video: /, "");
    iframe.allow = "autoplay; encrypted-media; fullscreen";
    iframe.referrerPolicy = "strict-origin-when-cross-origin";
    iframe.allowFullscreen = true;
    this.frame.replaceChildren(iframe);

    this.modal.classList.add("open");
    this.modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    this.closeBtn.focus();
  }

  close() {
    this.modal.classList.remove("open");
    this.modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    // Removing the iframe stops playback so no audio lingers.
    this.frame.replaceChildren();
    this.lastFocused?.focus();
  }
}

// ============================================
// Application Initialization
// ============================================
document.addEventListener("DOMContentLoaded", async () => {
  new ScrollAnimator();
  new SmoothScroll();
  new NavController();
  new ScrollSpy();
  new ScrollProgress();
  new CountUp();
  new CardEffects();
  new Magnetic();
  new VideoModal();

  await initParticles();

  console.log("%c✨ Portfolio loaded successfully!", "color: #a855f7; font-weight: bold;");
});

// ============================================
// Service Worker Registration (relative path so it works under GitHub Pages subpaths)
// ============================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {
      // Service worker unavailable (e.g. opened via file://) - that's okay.
    });
  });
}
