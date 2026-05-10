"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Navbar scroll effect
    const navbar = document.getElementById("navbar");
    const handleScroll = () => {
      if (window.scrollY > 50) navbar?.classList.add("scrolled");
      else navbar?.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();

    // Reveal animations - run after a frame to ensure DOM is painted
    const rafId = requestAnimationFrame(() => {
      const revealElements = document.querySelectorAll(".reveal:not(.active)");

      const revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("active");
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
      );

      revealElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("active");
        } else {
          revealObserver.observe(el);
        }
      });

      // Cleanup observer on unmount
      const cleanup = () => revealObserver.disconnect();
      window.__revealCleanup = cleanup;
    });

    // Handle bfcache (browser back/forward cache)
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        // Page restored from bfcache — activate all reveals
        document.querySelectorAll(".reveal:not(.active)").forEach((el) => {
          el.classList.add("active");
        });
      }
    };
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pageshow", handlePageShow);
      if (window.__revealCleanup) window.__revealCleanup();
    };
  }, [pathname]);

  return null;
}

// Extend Window for cleanup reference
declare global {
  interface Window {
    __revealCleanup?: () => void;
  }
}
