export type Rarity =
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Chroma'
  | 'Mystic'
  | 'Clicked'
  | 'Godly';

export interface BlookItem {
  id: string;
  name: string;
  rarity: Rarity;
  chance: number; // Exact percentage
  chanceLabel: string; // e.g., "17%", "15%", "7%", "3.57%", "0.4%", "0.03%"
  sellPrice: number;
  packId: string;
  imageUrl?: string;
}

export interface PackInfo {
  id: string;
  name: string;
  price: number;
  bgColor: string;
  borderColor: string;
  revealBgColor: string;
  coverImageUrl?: string;
  blooks: BlookItem[];
}

export const RARITY_COLORS: Record<Rarity, string> = {
  Uncommon: '#4bc22e', // Lime green
  Rare: '#0a5cf5',     // Vibrant blue
  Epic: '#be0000',     // Crimson red
  Legendary: '#ff910f',// Gold-Orange
  Chroma: '#00ccff',   // Cyan
  Mystic: '#9900ff',   // Purple
  Clicked: '#ff7a00',  // Electric Orange
  Godly: '#facc15',    // Radiant Yellow
};

export const RARITY_RANK: Record<Rarity, number> = {
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
  Chroma: 5,
  Mystic: 6,
  Clicked: 7,
  Godly: 8,
};

export const CIRCUS_BLOOKS: BlookItem[] = [
  {
    id: 'tightrope-walker',
    name: 'Tightrope Walker',
    rarity: 'Uncommon',
    chance: 17,
    chanceLabel: '17%',
    sellPrice: 5,
    packId: 'circus',
  },
  {
    id: 'jester',
    name: 'Jester',
    rarity: 'Uncommon',
    chance: 17,
    chanceLabel: '17%',
    sellPrice: 5,
    packId: 'circus',
  },
  {
    id: 'magician',
    name: 'Magician',
    rarity: 'Uncommon',
    chance: 17,
    chanceLabel: '17%',
    sellPrice: 5,
    packId: 'circus',
  },
  {
    id: 'top-hat',
    name: 'Top Hat',
    rarity: 'Uncommon',
    chance: 17,
    chanceLabel: '17%',
    sellPrice: 5,
    packId: 'circus',
  },
  {
    id: 'popcorn',
    name: 'Popcorn',
    rarity: 'Uncommon',
    chance: 17,
    chanceLabel: '17%',
    sellPrice: 5,
    packId: 'circus',
  },
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    rarity: 'Rare',
    chance: 8,
    chanceLabel: '8%',
    sellPrice: 20,
    packId: 'circus',
  },
  {
    id: 'unicycler',
    name: 'Unicycler',
    rarity: 'Rare',
    chance: 8,
    chanceLabel: '8%',
    sellPrice: 20,
    packId: 'circus',
  },
  {
    id: 'canon-ball',
    name: 'Canon Ball',
    rarity: 'Rare',
    chance: 8,
    chanceLabel: '8%',
    sellPrice: 20,
    packId: 'circus',
  },
  {
    id: 'magic-wand',
    name: 'Magic Wand',
    rarity: 'Epic',
    chance: 3,
    chanceLabel: '3%',
    sellPrice: 75,
    packId: 'circus',
  },
  {
    id: 'tent',
    name: 'Tent',
    rarity: 'Epic',
    chance: 3,
    chanceLabel: '3%',
    sellPrice: 75,
    packId: 'circus',
  },
  {
    id: 'circus-ball',
    name: 'Circus Ball',
    rarity: 'Legendary',
    chance: 0.3,
    chanceLabel: '0.3%',
    sellPrice: 200,
    packId: 'circus',
  },
  {
    id: 'circus-elephant',
    name: 'Circus Elephant',
    rarity: 'Chroma',
    chance: 0.05,
    chanceLabel: '0.05%',
    sellPrice: 300,
    packId: 'circus',
  },
  {
    id: 'ring-lion',
    name: 'Ring Lion',
    rarity: 'Chroma',
    chance: 0.03,
    chanceLabel: '0.03%',
    sellPrice: 350,
    packId: 'circus',
  },
  {
    id: 'fire-guy',
    name: 'Fire Guy',
    rarity: 'Chroma',
    chance: 0.03,
    chanceLabel: '0.03%',
    sellPrice: 350,
    packId: 'circus',
  },
  {
    id: 'the-golden-ticket',
    name: 'The Golden Ticket',
    rarity: 'Mystic',
    chance: 0.002,
    chanceLabel: '0.002%',
    sellPrice: 1000,
    packId: 'circus',
  },
];

export const ATHLETES_BLOOKS: BlookItem[] = [
  {
    id: 'athlete-football',
    name: 'Football Player',
    rarity: 'Uncommon',
    chance: 15,
    chanceLabel: '15%',
    sellPrice: 5,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__8__1fd2ddf0.png',
  },
  {
    id: 'athlete-baseball',
    name: 'Baseball Player',
    rarity: 'Uncommon',
    chance: 15,
    chanceLabel: '15%',
    sellPrice: 5,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__9__503c7292.png',
  },
  {
    id: 'athlete-racer',
    name: 'Race Car Driver',
    rarity: 'Uncommon',
    chance: 15,
    chanceLabel: '15%',
    sellPrice: 5,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__10__a82bd15a.png',
  },
  {
    id: 'athlete-referee',
    name: 'Referee',
    rarity: 'Uncommon',
    chance: 15,
    chanceLabel: '15%',
    sellPrice: 5,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__11__98e22493.png',
  },
  {
    id: 'athlete-basketball',
    name: 'Basketball Player',
    rarity: 'Uncommon',
    chance: 15,
    chanceLabel: '15%',
    sellPrice: 5,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__12__145c93f6.png',
  },
  {
    id: 'athlete-runner',
    name: 'Track Runner',
    rarity: 'Rare',
    chance: 7,
    chanceLabel: '7%',
    sellPrice: 20,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__13__9bca1b6b.png',
  },
  {
    id: 'athlete-martial-artist',
    name: 'Martial Artist',
    rarity: 'Rare',
    chance: 7,
    chanceLabel: '7%',
    sellPrice: 20,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__14__24143c42.png',
  },
  {
    id: 'athlete-fencer',
    name: 'Fencer',
    rarity: 'Rare',
    chance: 7,
    chanceLabel: '7%',
    sellPrice: 20,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__15__d4d9b8c1.png',
  },
  {
    id: 'athlete-golfer',
    name: 'Golfer',
    rarity: 'Epic',
    chance: 3.57,
    chanceLabel: '3.57%',
    sellPrice: 75,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__16__518d3dbc.png',
  },
  {
    id: 'athlete-soccer',
    name: 'Soccer Player',
    rarity: 'Legendary',
    chance: 0.4,
    chanceLabel: '0.4%',
    sellPrice: 200,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__17__e8d8a365.png',
  },
  {
    id: 'athlete-cyborg',
    name: 'Cyborg Coach',
    rarity: 'Chroma',
    chance: 0.03,
    chanceLabel: '0.03%',
    sellPrice: 350,
    packId: 'athletes',
    imageUrl: 'assets/aistudio/download__18__e086e375.png',
  },
];

export const FRUIT_BLOOKS: BlookItem[] = [
  {
    id: 'fruit-apple',
    name: 'Apple',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'fruit',
  },
  {
    id: 'fruit-pear',
    name: 'Pear',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'fruit',
  },
  {
    id: 'fruit-grapes',
    name: 'Grape',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'fruit',
  },
  {
    id: 'fruit-strawberry',
    name: 'Strawberry',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'fruit',
  },
  {
    id: 'fruit-kiwi',
    name: 'Kiwi Slice',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'fruit',
  },
  {
    id: 'fruit-peach',
    name: 'Peach',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'fruit',
  },
  {
    id: 'fruit-tanghulu',
    name: 'Glazed Tanghulu',
    rarity: 'Epic',
    chance: 4.5,
    chanceLabel: '4.5%',
    sellPrice: 75,
    packId: 'fruit',
  },
  {
    id: 'fruit-pineapple',
    name: 'Golden Pineapple',
    rarity: 'Legendary',
    chance: 0.35,
    chanceLabel: '0.35%',
    sellPrice: 200,
    packId: 'fruit',
  },
  {
    id: 'fruit-starfruit',
    name: 'Starfruit',
    rarity: 'Chroma',
    chance: 0.075,
    chanceLabel: '0.075%',
    sellPrice: 350,
    packId: 'fruit',
  },
  {
    id: 'fruit-dragonfruit',
    name: 'Celestial Dragonfruit',
    rarity: 'Mystic',
    chance: 0.0699,
    chanceLabel: '0.0699%',
    sellPrice: 1000,
    packId: 'fruit',
  },
  {
    id: 'fruit-blood-orange',
    name: 'Orange',
    rarity: 'Clicked',
    chance: 0.005,
    chanceLabel: '0.005%',
    sellPrice: 2500,
    packId: 'fruit',
  },
  {
    id: 'fruit-sun-ambrosia',
    name: 'Divine Sun Ambrosia',
    rarity: 'Godly',
    chance: 0.001,
    chanceLabel: '0.001%',
    sellPrice: 5000,
    packId: 'fruit',
  },
];

export const CHESS_BLOOKS: BlookItem[] = [
  {
    id: 'chess-pawn-white',
    name: 'White Pawn',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'chess',
  },
  {
    id: 'chess-pawn-black',
    name: 'Obsidian Pawn',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'chess',
  },
  {
    id: 'chess-clock',
    name: 'Chess Clock',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'chess',
  },
  {
    id: 'chess-board-tile',
    name: 'Checkered Square',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'chess',
  },
  {
    id: 'chess-rook',
    name: 'Castle Rook',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'chess',
  },
  {
    id: 'chess-bishop',
    name: 'Diagonal Bishop',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'chess',
  },
  {
    id: 'chess-knight',
    name: 'Royal Knight',
    rarity: 'Epic',
    chance: 4.5,
    chanceLabel: '4.5%',
    sellPrice: 75,
    packId: 'chess',
  },
  {
    id: 'chess-queen',
    name: 'Sovereign Queen',
    rarity: 'Legendary',
    chance: 0.35,
    chanceLabel: '0.35%',
    sellPrice: 200,
    packId: 'chess',
  },
  {
    id: 'chess-king',
    name: 'Prismatic King',
    rarity: 'Chroma',
    chance: 0.075,
    chanceLabel: '0.075%',
    sellPrice: 350,
    packId: 'chess',
  },
  {
    id: 'chess-en-passant',
    name: 'Phantom En Passant',
    rarity: 'Mystic',
    chance: 0.0699,
    chanceLabel: '0.0699%',
    sellPrice: 1000,
    packId: 'chess',
  },
  {
    id: 'chess-checkmate',
    name: 'Clicked Checkmate',
    rarity: 'Clicked',
    chance: 0.005,
    chanceLabel: '0.005%',
    sellPrice: 2500,
    packId: 'chess',
  },
  {
    id: 'chess-grandmaster',
    name: 'Grandmaster Crown',
    rarity: 'Godly',
    chance: 0.001,
    chanceLabel: '0.001%',
    sellPrice: 5000,
    packId: 'chess',
  },
];

export const ALL_BLOOKS: BlookItem[] = [
  ...CIRCUS_BLOOKS,
  ...ATHLETES_BLOOKS,
  ...FRUIT_BLOOKS,
  ...CHESS_BLOOKS,
];

export const CIRCUS_PACK: PackInfo = {
  id: 'circus',
  name: 'Circus Pack',
  price: 20,
  bgColor: '#ff4242',
  borderColor: '#b91c1c',
  revealBgColor: '#fca5a5',
  coverImageUrl: 'assets/aistudio/Pack_Designs__4_-removebg-preview_40ec04e2.png',
  blooks: CIRCUS_BLOOKS,
};

export const ATHLETES_PACK: PackInfo = {
  id: 'athletes',
  name: 'Athletes Pack',
  price: 20,
  bgColor: '#4ade80',
  borderColor: '#16a34a',
  revealBgColor: '#86efac',
  coverImageUrl: 'assets/aistudio/Pack_Designs__2_-removebg-preview_c4530e10.png',
  blooks: ATHLETES_BLOOKS,
};

export const FRUIT_PACK: PackInfo = {
  id: 'fruit',
  name: 'Fruit Pack',
  price: 20,
  bgColor: '#fb923c',
  borderColor: '#c2410c',
  revealBgColor: '#fed7aa',
  coverImageUrl: 'assets/aistudio/Pack_Designs__5_-removebg-preview__1__16e42f7f.png',
  blooks: FRUIT_BLOOKS,
};

export const CHESS_PACK: PackInfo = {
  id: 'chess',
  name: 'Chess Pack',
  price: 20,
  bgColor: '#334155',
  borderColor: '#0f172a',
  revealBgColor: '#cbd5e1',
  coverImageUrl: 'assets/aistudio/Pack_Designs__7_-removebg-preview_b259eceb.png',
  blooks: CHESS_BLOOKS,
};

export const MARKET_PACKS: PackInfo[] = [CIRCUS_PACK, ATHLETES_PACK, FRUIT_PACK, CHESS_PACK];

export function rollBlookFromPack(pack: PackInfo, luckMultiplier: number = 1): BlookItem {
  const items = pack.blooks;
  const weights = items.map((item) => {
    if (luckMultiplier > 1 && item.rarity !== 'Uncommon') {
      return item.chance * luckMultiplier;
    }
    return item.chance;
  });

  const totalWeight = weights.reduce((acc, w) => acc + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  return items[0];
}

export interface BazaarIngredient {
  blookId: string;
  count: number;
}

export interface BazaarRecipe {
  id: string;
  targetBlookId: string;
  ingredients: BazaarIngredient[];
}

export const BAZAAR_RECIPES: BazaarRecipe[] = [
  // --- CIRCUS PACK MIXED BAZAAR OFFERS ---
  {
    id: 'craft-cotton-candy',
    targetBlookId: 'cotton-candy',
    ingredients: [
      { blookId: 'tightrope-walker', count: 4 },
      { blookId: 'fruit-strawberry', count: 2 },
      { blookId: 'athlete-basketball', count: 2 },
    ],
  },
  {
    id: 'craft-unicycler',
    targetBlookId: 'unicycler',
    ingredients: [
      { blookId: 'jester', count: 3 },
      { blookId: 'chess-clock', count: 2 },
      { blookId: 'athlete-racer', count: 2 },
    ],
  },
  {
    id: 'craft-canon-ball',
    targetBlookId: 'canon-ball',
    ingredients: [
      { blookId: 'top-hat', count: 3 },
      { blookId: 'athlete-football', count: 2 },
      { blookId: 'fruit-apple', count: 2 },
    ],
  },
  {
    id: 'craft-magic-wand',
    targetBlookId: 'magic-wand',
    ingredients: [
      { blookId: 'cotton-candy', count: 2 },
      { blookId: 'chess-bishop', count: 2 },
      { blookId: 'fruit-kiwi', count: 2 },
    ],
  },
  {
    id: 'craft-tent',
    targetBlookId: 'tent',
    ingredients: [
      { blookId: 'canon-ball', count: 2 },
      { blookId: 'chess-rook', count: 2 },
      { blookId: 'athlete-fencer', count: 2 },
    ],
  },
  {
    id: 'craft-circus-ball',
    targetBlookId: 'circus-ball',
    ingredients: [
      { blookId: 'magic-wand', count: 2 },
      { blookId: 'athlete-golfer', count: 1 },
      { blookId: 'fruit-tanghulu', count: 1 },
    ],
  },
  {
    id: 'craft-circus-elephant',
    targetBlookId: 'circus-elephant',
    ingredients: [
      { blookId: 'circus-ball', count: 1 },
      { blookId: 'chess-queen', count: 1 },
      { blookId: 'fruit-peach', count: 2 },
    ],
  },
  {
    id: 'craft-ring-lion',
    targetBlookId: 'ring-lion',
    ingredients: [
      { blookId: 'circus-ball', count: 1 },
      { blookId: 'athlete-soccer', count: 1 },
      { blookId: 'chess-knight', count: 2 },
    ],
  },
  {
    id: 'craft-fire-guy',
    targetBlookId: 'fire-guy',
    ingredients: [
      { blookId: 'fruit-pineapple', count: 1 },
      { blookId: 'magic-wand', count: 2 },
      { blookId: 'athlete-martial-artist', count: 2 },
    ],
  },
  {
    id: 'craft-the-golden-ticket',
    targetBlookId: 'the-golden-ticket',
    ingredients: [
      { blookId: 'circus-elephant', count: 1 },
      { blookId: 'fruit-starfruit', count: 1 },
      { blookId: 'chess-king', count: 1 },
      { blookId: 'athlete-cyborg', count: 1 },
    ],
  },
  // --- ATHLETES PACK MIXED BAZAAR OFFERS ---
  {
    id: 'craft-athlete-runner',
    targetBlookId: 'athlete-runner',
    ingredients: [
      { blookId: 'athlete-football', count: 3 },
      { blookId: 'fruit-pear', count: 2 },
      { blookId: 'chess-pawn-white', count: 2 },
    ],
  },
  {
    id: 'craft-athlete-martial-artist',
    targetBlookId: 'athlete-martial-artist',
    ingredients: [
      { blookId: 'athlete-racer', count: 3 },
      { blookId: 'chess-pawn-black', count: 2 },
      { blookId: 'popcorn', count: 2 },
    ],
  },
  {
    id: 'craft-athlete-fencer',
    targetBlookId: 'athlete-fencer',
    ingredients: [
      { blookId: 'athlete-baseball', count: 3 },
      { blookId: 'chess-board-tile', count: 2 },
      { blookId: 'fruit-grapes', count: 2 },
    ],
  },
  {
    id: 'craft-athlete-golfer',
    targetBlookId: 'athlete-golfer',
    ingredients: [
      { blookId: 'athlete-runner', count: 2 },
      { blookId: 'fruit-peach', count: 2 },
      { blookId: 'unicycler', count: 2 },
    ],
  },
  {
    id: 'craft-athlete-soccer',
    targetBlookId: 'athlete-soccer',
    ingredients: [
      { blookId: 'athlete-golfer', count: 2 },
      { blookId: 'chess-knight', count: 1 },
      { blookId: 'fruit-tanghulu', count: 2 },
    ],
  },
  {
    id: 'craft-athlete-cyborg',
    targetBlookId: 'athlete-cyborg',
    ingredients: [
      { blookId: 'athlete-soccer', count: 1 },
      { blookId: 'chess-queen', count: 1 },
      { blookId: 'circus-ball', count: 1 },
      { blookId: 'fruit-kiwi', count: 2 },
    ],
  },
  // --- FRUIT PACK MIXED BAZAAR OFFERS ---
  {
    id: 'craft-fruit-kiwi',
    targetBlookId: 'fruit-kiwi',
    ingredients: [
      { blookId: 'fruit-apple', count: 3 },
      { blookId: 'athlete-referee', count: 2 },
      { blookId: 'magician', count: 2 },
    ],
  },
  {
    id: 'craft-fruit-peach',
    targetBlookId: 'fruit-peach',
    ingredients: [
      { blookId: 'fruit-strawberry', count: 3 },
      { blookId: 'chess-pawn-white', count: 2 },
      { blookId: 'jester', count: 2 },
    ],
  },
  {
    id: 'craft-fruit-tanghulu',
    targetBlookId: 'fruit-tanghulu',
    ingredients: [
      { blookId: 'fruit-kiwi', count: 2 },
      { blookId: 'cotton-candy', count: 2 },
      { blookId: 'athlete-runner', count: 2 },
    ],
  },
  {
    id: 'craft-fruit-pineapple',
    targetBlookId: 'fruit-pineapple',
    ingredients: [
      { blookId: 'fruit-tanghulu', count: 2 },
      { blookId: 'tent', count: 1 },
      { blookId: 'chess-rook', count: 2 },
    ],
  },
  {
    id: 'craft-fruit-starfruit',
    targetBlookId: 'fruit-starfruit',
    ingredients: [
      { blookId: 'fruit-pineapple', count: 1 },
      { blookId: 'athlete-soccer', count: 1 },
      { blookId: 'magic-wand', count: 2 },
    ],
  },
  {
    id: 'craft-fruit-dragonfruit',
    targetBlookId: 'fruit-dragonfruit',
    ingredients: [
      { blookId: 'fruit-starfruit', count: 1 },
      { blookId: 'chess-king', count: 1 },
      { blookId: 'circus-elephant', count: 1 },
    ],
  },
  {
    id: 'craft-fruit-blood-orange',
    targetBlookId: 'fruit-blood-orange',
    ingredients: [
      { blookId: 'fruit-dragonfruit', count: 1 },
      { blookId: 'the-golden-ticket', count: 1 },
      { blookId: 'athlete-cyborg', count: 1 },
    ],
  },
  {
    id: 'craft-fruit-sun-ambrosia',
    targetBlookId: 'fruit-sun-ambrosia',
    ingredients: [
      { blookId: 'fruit-blood-orange', count: 1 },
      { blookId: 'chess-en-passant', count: 1 },
      { blookId: 'fruit-pineapple', count: 1 },
      { blookId: 'circus-ball', count: 1 },
    ],
  },
  // --- CHESS PACK MIXED BAZAAR OFFERS ---
  {
    id: 'craft-chess-rook',
    targetBlookId: 'chess-rook',
    ingredients: [
      { blookId: 'chess-board-tile', count: 3 },
      { blookId: 'top-hat', count: 2 },
      { blookId: 'fruit-apple', count: 2 },
    ],
  },
  {
    id: 'craft-chess-bishop',
    targetBlookId: 'chess-bishop',
    ingredients: [
      { blookId: 'chess-pawn-black', count: 3 },
      { blookId: 'magician', count: 2 },
      { blookId: 'fruit-grapes', count: 2 },
    ],
  },
  {
    id: 'craft-chess-knight',
    targetBlookId: 'chess-knight',
    ingredients: [
      { blookId: 'chess-rook', count: 2 },
      { blookId: 'athlete-martial-artist', count: 2 },
      { blookId: 'canon-ball', count: 2 },
    ],
  },
  {
    id: 'craft-chess-queen',
    targetBlookId: 'chess-queen',
    ingredients: [
      { blookId: 'chess-knight', count: 2 },
      { blookId: 'fruit-tanghulu', count: 1 },
      { blookId: 'tent', count: 2 },
    ],
  },
  {
    id: 'craft-chess-king',
    targetBlookId: 'chess-king',
    ingredients: [
      { blookId: 'chess-queen', count: 1 },
      { blookId: 'circus-ball', count: 1 },
      { blookId: 'athlete-golfer', count: 1 },
      { blookId: 'fruit-kiwi', count: 2 },
    ],
  },
  {
    id: 'craft-chess-en-passant',
    targetBlookId: 'chess-en-passant',
    ingredients: [
      { blookId: 'chess-king', count: 1 },
      { blookId: 'fruit-starfruit', count: 1 },
      { blookId: 'fire-guy', count: 1 },
    ],
  },
  {
    id: 'craft-chess-checkmate',
    targetBlookId: 'chess-checkmate',
    ingredients: [
      { blookId: 'chess-en-passant', count: 1 },
      { blookId: 'ring-lion', count: 1 },
      { blookId: 'fruit-dragonfruit', count: 1 },
    ],
  },
  {
    id: 'craft-chess-grandmaster',
    targetBlookId: 'chess-grandmaster',
    ingredients: [
      { blookId: 'chess-checkmate', count: 1 },
      { blookId: 'fruit-blood-orange', count: 1 },
      { blookId: 'the-golden-ticket', count: 1 },
      { blookId: 'athlete-cyborg', count: 1 },
    ],
  },
];


