// Names for the generated levels (24-67): "<adjective> <noun>", like "Neon Grid" or "Crimson Paradox".
// Both lists have at least 44 entries and every level takes a different adjective AND a different noun, so no two
// titles share a word. The pairing is a seeded shuffle, so the names are the same every time the script runs.
import { makeRng } from "../puzzleGenerator";

export const ADJECTIVES = [
  "Neon", "Quantum", "Crimson", "Velvet", "Hollow", "Static", "Cobalt", "Phantom", "Molten", "Lunar",
  "Solar", "Binary", "Fractal", "Electric", "Obsidian", "Amber", "Cipher", "Gilded", "Midnight", "Rogue",
  "Sonic", "Turbo", "Atomic", "Cosmic", "Glitch", "Indigo", "Jade", "Kinetic", "Lucid", "Mythic",
  "Nova", "Opal", "Prism", "Radiant", "Savage", "Tidal", "Ultra", "Vivid", "Wild", "Xenon",
  "Zesty", "Arctic", "Blazing", "Cyber", "Digital", "Echo", "Feral", "Gamma",
];

export const NOUNS = [
  "Grid", "Shift", "Paradox", "Maze", "Gambit", "Cascade", "Labyrinth", "Mosaic", "Vortex", "Circuit",
  "Matrix", "Relay", "Pulse", "Riddle", "Tangle", "Theorem", "Lattice", "Mirage", "Nexus", "Orbit",
  "Pivot", "Reactor", "Tempest", "Uplink", "Vector", "Warp", "Zenith", "Anthem", "Bastion", "Cortex",
  "Delta", "Engine", "Fusion", "Gateway", "Horizon", "Inferno", "Jigsaw", "Kernel", "Ledger", "Monolith",
  "Nebula", "Oracle", "Prototype", "Quasar", "Rift", "Signal", "Tapestry", "Underpass",
];

function shuffled<T>(items: readonly T[], seed: string): T[] {
  const rng = makeRng(seed);
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = rng.int(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** `count` distinct titles, in a fixed order. */
export function levelNames(count: number): string[] {
  if (count > ADJECTIVES.length || count > NOUNS.length) throw new Error("not enough words for that many levels");
  const adjectives = shuffled(ADJECTIVES, "proof-puzzle-adjectives");
  const nouns = shuffled(NOUNS, "proof-puzzle-nouns");
  return Array.from({ length: count }, (_, i) => `${adjectives[i]} ${nouns[i]}`);
}
