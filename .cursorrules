# Corgi Design Engineer Work Trial - Engineering & UX Rules

- Stack: React 19, TypeScript (strict), Tailwind CSS v4, Lucide Icons.
- Product Context: Corgi is a modern, full-stack AI insurance carrier for small businesses. Interfaces must eliminate insurance jargon, feel fast/instantaneous, and look crisp, trustworthy, and modern.
- Code Quality:
  - Always use strict TypeScript interfaces; never use `any`.
  - Use the `cn()` helper from `src/utils/formatters.ts` for conditional Tailwind classes.
  - Keep business data decoupled in `src/data/` so sample data from the brief can be swapped cleanly.
  - Build real micro-interactions: loading states, instant feedback toasts, smooth transitions, and functional simulated COI downloads.
- Design System Alignment:
  - When Corgi design tokens (colors, typography, radii) are provided, map them immediately into CSS variables / Tailwind `@theme` tokens in `src/index.css` before building screens.
  - Prioritize visual hierarchy: primary metrics (monthly/annual premium, coverage limits, policy status) must be immediately scannable by a busy small business owner.
