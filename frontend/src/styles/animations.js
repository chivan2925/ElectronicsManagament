const premiumEase = [0.22, 1, 0.36, 1];

export const motionViewport = {
  once: true,
  margin: "-80px",
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.36,
      ease: premiumEase,
    },
  },
};

export const fadeUp = {
  hidden: {
    opacity: 0,
    y: 18,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: premiumEase,
    },
  },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

export const hoverLift = {
  y: -4,
  transition: {
    duration: 0.2,
    ease: premiumEase,
  },
};

export const hoverGlow = {
  y: -5,
  borderColor: "rgba(147, 197, 253, 0.62)",
  boxShadow: "0 0 34px rgba(0, 91, 255, 0.22), 0 24px 70px rgba(0, 0, 0, 0.34)",
  transition: {
    duration: 0.24,
    ease: premiumEase,
  },
};

export const imageZoom = {
  scale: 1.045,
  transition: {
    duration: 0.34,
    ease: premiumEase,
  },
};

export const tapSoft = {
  scale: 0.98,
  transition: {
    duration: 0.12,
    ease: premiumEase,
  },
};
