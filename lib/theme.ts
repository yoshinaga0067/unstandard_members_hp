// "LIFE IS COLORFUL" accent palette. Use as small accents (heading bars, tags,
// frames) on a white base — never as full-block fills.
export const RAINBOW = [
  "#ed1c24", // red
  "#ea5c52", // coral
  "#8cc63f", // green
  "#91c2e1", // blue
  "#e6b8c4", // pink
  "#c6d876", // lime
  "#a4d2de", // cyan
] as const;

export function rainbowAt(i: number): string {
  return RAINBOW[i % RAINBOW.length];
}
