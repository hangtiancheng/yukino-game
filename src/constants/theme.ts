// Single source of truth for game colors, shared by the DOM renderer
// (via cssColor() inline styles) and the Pixi renderer (via these numeric
// values). The warm "paper stack" palette pairs an ivory page with a dark
// warm well; piece colors are muted so the clay UI accent stays the loudest
// orange on screen.
export const tetrisTheme = {
  boardBackground: 0x26221d, // warm charcoal well
  boardStroke: 0x17140f,
  cardBackground: 0xfffdf9,
  cellStroke: 0x17140f,
  ghostAlpha: 0.22,
  gridLine: 0x37322b,
  labelText: 0x6f6b62, // ink-soft
  panelStroke: 0xe4dfd1, // hairline
  cells: {
    I: 0x5fa8a0, // sea teal
    J: 0x6f92d6, // slate blue
    L: 0xe0a24a, // amber
    O: 0xe8d467, // pale gold
    S: 0x93b25f, // olive
    T: 0xac84bd, // mauve
    Z: 0xcf6370, // rose brick
  },
} as const;

export function cssColor(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}
