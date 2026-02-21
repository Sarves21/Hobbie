/**
 * Modern Portfolio Application
 * @author Sarvesvar M S
 * @version 2.0.0
 * Uses ES6+ modules and modern JavaScript features
 */

// ============================================
// tsParticles Configuration & Initialization
// ============================================
const particlesConfig = {
  fpsLimit: 120,
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

// Initialize tsParticles
async function initParticles() {
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
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    if (prefersReducedMotion) {
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
    this.init();
  }

  init() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        const target = document.querySelector(targetId);
        
        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
          });

          // Highlight video cards when navigating from quick nav
          if (target.classList.contains("card")) {
            // Remove any existing highlights
            document.querySelectorAll(".card.highlight").forEach(card => {
              card.classList.remove("highlight");
            });
            
            // Add highlight after scroll completes
            setTimeout(() => {
              target.classList.add("highlight");
              // Remove highlight after animation
              setTimeout(() => {
                target.classList.remove("highlight");
              }, 2000);
            }, 500);
          }
        }
      });
    });
  }
}

// ============================================
// Floating Navigation Controller
// ============================================
class NavController {
  constructor() {
    this.nav = document.querySelector(".floating-nav");
    this.lastScroll = 0;
    this.init();
  }

  init() {
    if (!this.nav) return;

    window.addEventListener("scroll", () => this.handleScroll(), { passive: true });
  }

  handleScroll() {
    const currentScroll = window.scrollY;
    
    // Add scrolled class for background effect
    if (currentScroll > 100) {
      this.nav.classList.add("scrolled");
    } else {
      this.nav.classList.remove("scrolled");
    }

    // Optional: Hide/show on scroll direction
    if (currentScroll > this.lastScroll && currentScroll > 400) {
      this.nav.style.transform = "translateX(-50%) translateY(-100%)";
    } else {
      this.nav.style.transform = "translateX(-50%) translateY(0)";
    }

    this.lastScroll = currentScroll;
  }
}

// ============================================
// Card Hover Effects
// ============================================
class CardEffects {
  constructor() {
    this.cards = document.querySelectorAll(".card");
    this.init();
  }

  init() {
    this.cards.forEach(card => {
      card.addEventListener("mousemove", (e) => this.handleMouseMove(e, card));
      card.addEventListener("mouseleave", (e) => this.handleMouseLeave(e, card));
    });
  }

  handleMouseMove(e, card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty("--mouse-x", `${x}px`);
    card.style.setProperty("--mouse-y", `${y}px`);
  }

  handleMouseLeave(e, card) {
    card.style.setProperty("--mouse-x", "50%");
    card.style.setProperty("--mouse-y", "50%");
  }
}

// ============================================
// Application Initialization
// ============================================
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize particles
  await initParticles();
  
  // Initialize scroll animations
  new ScrollAnimator();
  
  // Initialize smooth scroll
  new SmoothScroll();
  
  // Initialize navigation controller
  new NavController();
  
  // Initialize card effects
  new CardEffects();
  
  // Log initialization
  console.log("%c✨ Portfolio loaded successfully!", "color: #a855f7; font-weight: bold;");
});

// ============================================
// Service Worker Registration (PWA Ready)
// ============================================
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // Service worker not available - that's okay
    });
  });
}
