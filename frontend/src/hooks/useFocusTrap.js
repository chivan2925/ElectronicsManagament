import { useEffect } from "react";

const focusableSelector = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

function isFocusable(element) {
  if (!element || element.getAttribute("aria-hidden") === "true") {
    return false;
  }

  if (element.closest("[inert]")) {
    return false;
  }

  return true;
}

function getFocusableElements(container) {
  return Array.from(container.querySelectorAll(focusableSelector)).filter(isFocusable);
}

function useFocusTrap(containerRef, active, { initialFocusRef, onEscape, restoreFocus = true } = {}) {
  useEffect(() => {
    if (!active || typeof document === "undefined") {
      return undefined;
    }

    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const previouslyFocusedElement = document.activeElement;
    const focusTarget = initialFocusRef?.current || getFocusableElements(container)[0] || container;
    let animationFrameId = window.requestAnimationFrame(() => {
      focusTarget?.focus?.({ preventScroll: true });
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onEscape?.(event);
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const focusableElements = getFocusableElements(container);

      if (!focusableElements.length) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey && activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus({ preventScroll: true });
        return;
      }

      if (!event.shiftKey && activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus({ preventScroll: true });
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }

      document.removeEventListener("keydown", handleKeyDown);

      if (
        restoreFocus &&
        previouslyFocusedElement &&
        typeof previouslyFocusedElement.focus === "function" &&
        document.contains(previouslyFocusedElement)
      ) {
        previouslyFocusedElement.focus({ preventScroll: true });
      }
    };
  }, [active, containerRef, initialFocusRef, onEscape, restoreFocus]);
}

export default useFocusTrap;
