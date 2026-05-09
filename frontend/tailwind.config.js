import { tokens } from "./src/styles/tokens.js";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: tokens.typography.fontFamily.sans,
      },
      colors: {
        primary: tokens.colors.primary,
        "primary-hover": tokens.colors.primaryHover,
        navy: tokens.colors.surfaceDark,
        "store-bg": tokens.colors.backgroundDark,
        "store-surface": tokens.colors.surfaceDark,
        "store-border": tokens.colors.borderDark,
        "store-text": tokens.colors.textPrimary,
        "store-muted": tokens.colors.textMuted,
        ink: tokens.colors.adminInk,
        canvas: tokens.colors.backgroundLight,
        panel: tokens.colors.surfaceLight,
        muted: tokens.colors.adminMuted,
        border: tokens.colors.borderLight,
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        danger: tokens.colors.danger,
      },
      borderRadius: {
        "token-sm": tokens.radius.sm,
        "token-md": tokens.radius.md,
        "token-lg": tokens.radius.lg,
        "token-xl": tokens.radius.xl,
      },
      boxShadow: {
        "admin-card": tokens.shadows.adminCard,
        "store-card": tokens.shadows.storeCard,
        "store-card-hover": tokens.shadows.storeCardHover,
        "neon-blue": tokens.shadows.neonBlue,
        "neon-blue-strong": tokens.shadows.neonBlueStrong,
      },
      transitionDuration: {
        premium: tokens.transitions.duration.premium,
      },
      transitionTimingFunction: {
        premium: tokens.transitions.easing.premium,
      },
      zIndex: {
        ...tokens.zIndex,
      },
    },
  },
  plugins: [],
}
