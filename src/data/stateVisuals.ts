export type StateVisual = {
  title: string;
  symbol: string;
  colors: readonly [string, string];
};

const palettes = {
  ocean: ["#087E8B", "#9BD8D0"],
  sunrise: ["#B55331", "#EDC27B"],
  forest: ["#276749", "#A8C98F"],
  royal: ["#6C3D76", "#D9A6B8"],
  mountain: ["#315A78", "#B8D8E8"],
  gold: ["#8A6426", "#E5C778"],
} as const;

export const STATE_VISUALS: Record<string, StateVisual> = {
  AN: { title: "Cellular Jail & Island Shores", symbol: "🏝️", colors: palettes.ocean },
  AP: { title: "Tirupati Temple", symbol: "🛕", colors: palettes.sunrise },
  AR: { title: "Tawang Monastery", symbol: "🏔️", colors: palettes.mountain },
  AS: { title: "Assam Tea Gardens", symbol: "🍃", colors: palettes.forest },
  BR: { title: "Mahabodhi Temple", symbol: "🛕", colors: palettes.gold },
  CH: { title: "Rock Garden", symbol: "🪨", colors: palettes.forest },
  CT: { title: "Chitrakote Falls", symbol: "💧", colors: palettes.ocean },
  DH: { title: "Daman Coast & Tribal Heritage", symbol: "🌊", colors: palettes.ocean },
  DL: { title: "India Gate", symbol: "🏛️", colors: palettes.sunrise },
  GA: { title: "Goan Beaches & Basilica", symbol: "🏖️", colors: palettes.ocean },
  GJ: { title: "Statue of Unity", symbol: "🗿", colors: palettes.gold },
  HR: { title: "Kurukshetra Heritage", symbol: "🛕", colors: palettes.sunrise },
  HP: { title: "Himalayan Valleys", symbol: "🏔️", colors: palettes.mountain },
  JK: { title: "Dal Lake", symbol: "🛶", colors: palettes.mountain },
  JH: { title: "Dassam Falls", symbol: "💧", colors: palettes.forest },
  KA: { title: "Hampi", symbol: "🛕", colors: palettes.sunrise },
  KL: { title: "Kerala Backwaters", symbol: "🛶", colors: palettes.forest },
  LA: { title: "Pangong Lake", symbol: "🏔️", colors: palettes.mountain },
  LD: { title: "Coral Islands", symbol: "🏝️", colors: palettes.ocean },
  MP: { title: "Sanchi Stupa", symbol: "🛕", colors: palettes.gold },
  MH: { title: "Gateway of India", symbol: "🏛️", colors: palettes.sunrise },
  MN: { title: "Loktak Lake", symbol: "🪷", colors: palettes.ocean },
  ML: { title: "Living Root Bridges", symbol: "🌉", colors: palettes.forest },
  MZ: { title: "Bamboo Hills", symbol: "🎋", colors: palettes.forest },
  NL: { title: "Hornbill Heritage", symbol: "🪶", colors: palettes.royal },
  OR: { title: "Konark Sun Temple", symbol: "🛕", colors: palettes.gold },
  PY: { title: "French Quarter", symbol: "🏘️", colors: palettes.ocean },
  PB: { title: "Golden Temple", symbol: "🛕", colors: palettes.gold },
  RJ: { title: "Hawa Mahal", symbol: "🏰", colors: palettes.sunrise },
  SK: { title: "Kanchenjunga", symbol: "🏔️", colors: palettes.mountain },
  TN: { title: "Meenakshi Temple", symbol: "🛕", colors: palettes.royal },
  TG: { title: "Charminar", symbol: "🕌", colors: palettes.royal },
  TR: { title: "Ujjayanta Palace", symbol: "🏰", colors: palettes.forest },
  UP: { title: "Taj Mahal", symbol: "🕌", colors: palettes.royal },
  UT: { title: "Kedarnath & Himalayan Peaks", symbol: "🏔️", colors: palettes.mountain },
  WB: { title: "Victoria Memorial", symbol: "🏛️", colors: palettes.gold },
};
