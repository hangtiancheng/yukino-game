export const gameTheme = {
  boardBackground: 0x26221d,
  boardStroke: 0x17140f,
  cardBackground: 0xfffdf9,
  cellStroke: 0x17140f,
  ghostAlpha: 0.22,
  gridLine: 0x37322b,
  labelText: 0x6f6b62,
  panelStroke: 0xe4dfd1,
  cells: {
    I: 0x5fa8a0,
    J: 0x6f92d6,
    L: 0xe0a24a,
    O: 0xe8d467,
    S: 0x93b25f,
    T: 0xac84bd,
    Z: 0xcf6370,
  },
} as const;

export function cssColor(color: number): string {
  return `#${color.toString(16).padStart(6, "0")}`;
}
