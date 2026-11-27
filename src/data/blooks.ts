export type Rarity =
  | 'Uncommon'
  | 'Rare'
  | 'Epic'
  | 'Legendary'
  | 'Chroma'
  | 'Mystic'
  | 'Clicked'
  | 'Godly'
  | 'Secret';

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
  Secret: '#000000',   // Abyssal Black
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
  Secret: 9,
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

export const DEEP_SEA_BLOOKS: BlookItem[] = [
  {
    id: 'deep-clownfish',
    name: 'Clownfish',
    rarity: 'Uncommon',
    chance: 16.2299,
    chanceLabel: '16.2299%',
    sellPrice: 5,
    packId: 'deep-sea',
  },
  {
    id: 'deep-crab',
    name: 'Hermit Crab',
    rarity: 'Uncommon',
    chance: 16.2299,
    chanceLabel: '16.2299%',
    sellPrice: 5,
    packId: 'deep-sea',
  },
  {
    id: 'deep-seahorse',
    name: 'Seahorse',
    rarity: 'Uncommon',
    chance: 16.2299,
    chanceLabel: '16.2299%',
    sellPrice: 5,
    packId: 'deep-sea',
  },
  {
    id: 'deep-starfish',
    name: 'Sea Star',
    rarity: 'Uncommon',
    chance: 16.2299,
    chanceLabel: '16.2299%',
    sellPrice: 5,
    packId: 'deep-sea',
  },
  {
    id: 'deep-octopus',
    name: 'Octopus',
    rarity: 'Rare',
    chance: 10,
    chanceLabel: '10%',
    sellPrice: 20,
    packId: 'deep-sea',
  },
  {
    id: 'deep-pufferfish',
    name: 'Pufferfish',
    rarity: 'Rare',
    chance: 10,
    chanceLabel: '10%',
    sellPrice: 20,
    packId: 'deep-sea',
  },
  {
    id: 'deep-jellyfish',
    name: 'Moon Jellyfish',
    rarity: 'Rare',
    chance: 10,
    chanceLabel: '10%',
    sellPrice: 20,
    packId: 'deep-sea',
  },
  {
    id: 'deep-anglerfish',
    name: 'Abyssal Anglerfish',
    rarity: 'Epic',
    chance: 4,
    chanceLabel: '4%',
    sellPrice: 75,
    packId: 'deep-sea',
  },
  {
    id: 'deep-shark',
    name: 'Great White Shark',
    rarity: 'Legendary',
    chance: 1,
    chanceLabel: '1%',
    sellPrice: 200,
    packId: 'deep-sea',
  },
  {
    id: 'deep-orca',
    name: 'Prismatic Orca',
    rarity: 'Chroma',
    chance: 0.03,
    chanceLabel: '0.03%',
    sellPrice: 350,
    packId: 'deep-sea',
  },
  {
    id: 'deep-narwhal',
    name: 'Crystal Narwhal',
    rarity: 'Chroma',
    chance: 0.03,
    chanceLabel: '0.03%',
    sellPrice: 350,
    packId: 'deep-sea',
  },
  {
    id: 'deep-manta',
    name: 'Bioluminescent Manta',
    rarity: 'Chroma',
    chance: 0.02,
    chanceLabel: '0.02%',
    sellPrice: 400,
    packId: 'deep-sea',
  },
  {
    id: 'deep-kraken',
    name: 'Abyssal Kraken',
    rarity: 'Mystic',
    chance: 0.0004,
    chanceLabel: '0.0004%',
    sellPrice: 1200,
    packId: 'deep-sea',
  },
  {
    id: 'deep-leviathan',
    name: 'Void Leviathan',
    rarity: 'Secret',
    chance: 0.0001,
    chanceLabel: '0.0001%',
    sellPrice: 7500,
    packId: 'deep-sea',
  },
];

export const DRINKS_BLOOKS: BlookItem[] = [
  {
    id: 'drink-water',
    name: 'Spring Water',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'drinks',
  },
  {
    id: 'drink-lemonade',
    name: 'Lemonade',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'drinks',
  },
  {
    id: 'drink-orange-juice',
    name: 'Orange Juice',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'drinks',
  },
  {
    id: 'drink-milkshake',
    name: 'Milkshake',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'drinks',
  },
  {
    id: 'drink-boba',
    name: 'Boba Tea',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'drinks',
  },
  {
    id: 'drink-iced-coffee',
    name: 'Iced Coffee',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'drinks',
  },
  {
    id: 'drink-root-beer',
    name: 'Root Beer Float',
    rarity: 'Epic',
    chance: 4,
    chanceLabel: '4%',
    sellPrice: 75,
    packId: 'drinks',
  },
  {
    id: 'drink-matcha',
    name: 'Matcha Latte',
    rarity: 'Legendary',
    chance: 0.9,
    chanceLabel: '0.9%',
    sellPrice: 200,
    packId: 'drinks',
  },
  {
    id: 'drink-slushie',
    name: 'Neon Slushie',
    rarity: 'Chroma',
    chance: 0.04,
    chanceLabel: '0.04%',
    sellPrice: 350,
    packId: 'drinks',
  },
  {
    id: 'drink-galaxy-soda',
    name: 'Galaxy Soda',
    rarity: 'Chroma',
    chance: 0.03,
    chanceLabel: '0.03%',
    sellPrice: 400,
    packId: 'drinks',
  },
  {
    id: 'drink-elixir',
    name: 'Mystic Elixir',
    rarity: 'Mystic',
    chance: 0.029,
    chanceLabel: '0.029%',
    sellPrice: 1000,
    packId: 'drinks',
  },
  {
    id: 'drink-golden-nectar',
    name: 'Mango Smoothie',
    rarity: 'Godly',
    chance: 0.001,
    chanceLabel: '0.001%',
    sellPrice: 5000,
    packId: 'drinks',
  },
];

export const BALL_BLOOKS: BlookItem[] = [
  {
    id: 'ball-tennis',
    name: 'Tennis Ball',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'ball',
  },
  {
    id: 'ball-basketball',
    name: 'Basketball',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'ball',
  },
  {
    id: 'ball-baseball',
    name: 'Baseball',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'ball',
  },
  {
    id: 'ball-beach',
    name: 'Beach Ball',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'ball',
  },
  {
    id: 'ball-soccer',
    name: 'Soccer Ball',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'ball',
  },
  {
    id: 'ball-volleyball',
    name: 'Volleyball',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'ball',
  },
  {
    id: 'ball-bowling',
    name: 'Bowling Ball',
    rarity: 'Epic',
    chance: 4,
    chanceLabel: '4%',
    sellPrice: 75,
    packId: 'ball',
  },
  {
    id: 'ball-eight',
    name: '8-Ball',
    rarity: 'Legendary',
    chance: 0.9,
    chanceLabel: '0.9%',
    sellPrice: 200,
    packId: 'ball',
  },
  {
    id: 'ball-disco',
    name: 'Disco Ball',
    rarity: 'Chroma',
    chance: 0.04,
    chanceLabel: '0.04%',
    sellPrice: 350,
    packId: 'ball',
  },
  {
    id: 'ball-crystal',
    name: 'Crystal Orb',
    rarity: 'Chroma',
    chance: 0.03,
    chanceLabel: '0.03%',
    sellPrice: 400,
    packId: 'ball',
  },
  {
    id: 'ball-plasma',
    name: 'Plasma Sphere',
    rarity: 'Mystic',
    chance: 0.025,
    chanceLabel: '0.025%',
    sellPrice: 1000,
    packId: 'ball',
  },
  {
    id: 'ball-super',
    name: 'Super Bouncer',
    rarity: 'Secret',
    chance: 0.005,
    chanceLabel: '0.005%',
    sellPrice: 7500,
    packId: 'ball',
  },
];

export const DESSERT_BLOOKS: BlookItem[] = [
  {
    id: 'dessert-donut',
    name: 'Glazed Donut',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'dessert',
  },
  {
    id: 'dessert-cupcake',
    name: 'Frosted Cupcake',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'dessert',
  },
  {
    id: 'dessert-cookie',
    name: 'Choc Chip Cookie',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'dessert',
  },
  {
    id: 'dessert-ice-cream',
    name: 'Ice Cream Cone',
    rarity: 'Uncommon',
    chance: 19.5,
    chanceLabel: '19.5%',
    sellPrice: 5,
    packId: 'dessert',
  },
  {
    id: 'dessert-macaron',
    name: 'Berry Macaron',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'dessert',
  },
  {
    id: 'dessert-cheesecake',
    name: 'Berry Cheesecake',
    rarity: 'Rare',
    chance: 8.5,
    chanceLabel: '8.5%',
    sellPrice: 20,
    packId: 'dessert',
  },
  {
    id: 'dessert-cinnamon-roll',
    name: 'Cinnamon Roll',
    rarity: 'Epic',
    chance: 4,
    chanceLabel: '4%',
    sellPrice: 75,
    packId: 'dessert',
  },
  {
    id: 'dessert-lava-cake',
    name: 'Molten Lava Cake',
    rarity: 'Legendary',
    chance: 0.9,
    chanceLabel: '0.9%',
    sellPrice: 200,
    packId: 'dessert',
  },
  {
    id: 'dessert-aurora-parfait',
    name: 'Aurora Parfait',
    rarity: 'Chroma',
    chance: 0.04,
    chanceLabel: '0.04%',
    sellPrice: 350,
    packId: 'dessert',
  },
  {
    id: 'dessert-crystal-candy',
    name: 'Crystal Rock Candy',
    rarity: 'Chroma',
    chance: 0.03,
    chanceLabel: '0.03%',
    sellPrice: 400,
    packId: 'dessert',
  },
  {
    id: 'dessert-mystic-souffle',
    name: 'Mystic Souffle',
    rarity: 'Mystic',
    chance: 0.025,
    chanceLabel: '0.025%',
    sellPrice: 1000,
    packId: 'dessert',
  },
  {
    id: 'dessert-nebula-cake',
    name: 'Celestial Cake',
    rarity: 'Secret',
    chance: 0.005,
    chanceLabel: '0.005%',
    sellPrice: 7500,
    packId: 'dessert',
  },
];

export const ALL_BLOOKS: BlookItem[] = [
  ...CIRCUS_BLOOKS,
  ...ATHLETES_BLOOKS,
  ...FRUIT_BLOOKS,
  ...CHESS_BLOOKS,
  ...DEEP_SEA_BLOOKS,
  ...DRINKS_BLOOKS,
  ...BALL_BLOOKS,
  ...DESSERT_BLOOKS,
];

export const BLOOK_BY_ID = new Map<string, BlookItem>(
  ALL_BLOOKS.map((b) => [b.id, b])
);

export interface InventoryWorthSummary {
  blooksWorth: number;
  uniqueBlooksCount: number;
  totalBlooksCount: number;
  mostValuableBlookId: string;
  mostValuableBlookUnitValue: number;
}

export function calculateInventoryWorth(
  inventory: Record<string, number> | undefined | null
): InventoryWorthSummary {
  let blooksWorth = 0;
  let uniqueBlooksCount = 0;
  let totalBlooksCount = 0;
  let mostValuableBlookId = '';
  let mostValuableBlookUnitValue = 0;

  for (const [blookId, rawCount] of Object.entries(inventory || {})) {
    const count = Math.floor(Number(rawCount) || 0);
    if (count <= 0) continue;
    const blook = BLOOK_BY_ID.get(blookId);
    const unitValue = blook ? Math.max(0, Math.floor(blook.sellPrice || 0)) : 0;
    uniqueBlooksCount += 1;
    totalBlooksCount += count;
    blooksWorth += unitValue * count;
    if (
      unitValue > mostValuableBlookUnitValue ||
      (unitValue === mostValuableBlookUnitValue && !mostValuableBlookId && blook)
    ) {
      mostValuableBlookId = blookId;
      mostValuableBlookUnitValue = unitValue;
    }
  }

  return {
    blooksWorth,
    uniqueBlooksCount,
    totalBlooksCount,
    mostValuableBlookId,
    mostValuableBlookUnitValue,
  };
}

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

export const DEEP_SEA_PACK: PackInfo = {
  id: 'deep-sea',
  name: 'Deep Sea Pack',
  price: 20,
  bgColor: '#0284c7',
  borderColor: '#0c4a6e',
  revealBgColor: '#7dd3fc',
  blooks: DEEP_SEA_BLOOKS,
};

export const DRINKS_PACK: PackInfo = {
  id: 'drinks',
  name: 'Drinks Pack',
  price: 20,
  bgColor: '#ec4899',
  borderColor: '#9d174d',
  revealBgColor: '#fbcfe8',
  blooks: DRINKS_BLOOKS,
};

export const BALL_PACK: PackInfo = {
  id: 'ball',
  name: 'Ball Pack',
  price: 20,
  bgColor: '#eab308',
  borderColor: '#854d0e',
  revealBgColor: '#fef08a',
  blooks: BALL_BLOOKS,
};

export const DESSERT_PACK: PackInfo = {
  id: 'dessert',
  name: 'Dessert Pack',
  price: 20,
  bgColor: '#a855f7',
  borderColor: '#6b21a8',
  revealBgColor: '#e9d5ff',
  blooks: DESSERT_BLOOKS,
};

export const MARKET_PACKS: PackInfo[] = [
  CIRCUS_PACK,
  ATHLETES_PACK,
  FRUIT_PACK,
  CHESS_PACK,
  DEEP_SEA_PACK,
  DRINKS_PACK,
  BALL_PACK,
  DESSERT_PACK,
];

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
  // --- DEEP SEA PACK MIXED BAZAAR OFFERS ---
  {
    id: 'craft-deep-octopus',
    targetBlookId: 'deep-octopus',
    ingredients: [
      { blookId: 'deep-clownfish', count: 3 },
      { blookId: 'fruit-pear', count: 2 },
      { blookId: 'chess-pawn-white', count: 2 },
    ],
  },
  {
    id: 'craft-deep-pufferfish',
    targetBlookId: 'deep-pufferfish',
    ingredients: [
      { blookId: 'deep-crab', count: 3 },
      { blookId: 'popcorn', count: 2 },
      { blookId: 'athlete-football', count: 2 },
    ],
  },
  {
    id: 'craft-deep-jellyfish',
    targetBlookId: 'deep-jellyfish',
    ingredients: [
      { blookId: 'deep-seahorse', count: 3 },
      { blookId: 'fruit-kiwi', count: 1 },
      { blookId: 'chess-clock', count: 2 },
    ],
  },
  {
    id: 'craft-deep-anglerfish',
    targetBlookId: 'deep-anglerfish',
    ingredients: [
      { blookId: 'deep-jellyfish', count: 2 },
      { blookId: 'magic-wand', count: 1 },
      { blookId: 'chess-bishop', count: 1 },
    ],
  },
  {
    id: 'craft-deep-shark',
    targetBlookId: 'deep-shark',
    ingredients: [
      { blookId: 'deep-anglerfish', count: 2 },
      { blookId: 'athlete-golfer', count: 1 },
      { blookId: 'fruit-tanghulu', count: 1 },
    ],
  },
  {
    id: 'craft-deep-orca',
    targetBlookId: 'deep-orca',
    ingredients: [
      { blookId: 'deep-shark', count: 1 },
      { blookId: 'chess-queen', count: 1 },
      { blookId: 'circus-ball', count: 1 },
    ],
  },
  {
    id: 'craft-deep-narwhal',
    targetBlookId: 'deep-narwhal',
    ingredients: [
      { blookId: 'deep-shark', count: 1 },
      { blookId: 'fruit-pineapple', count: 1 },
      { blookId: 'athlete-soccer', count: 1 },
    ],
  },
  {
    id: 'craft-deep-manta',
    targetBlookId: 'deep-manta',
    ingredients: [
      { blookId: 'deep-orca', count: 1 },
      { blookId: 'deep-narwhal', count: 1 },
      { blookId: 'fruit-starfruit', count: 1 },
    ],
  },
  {
    id: 'craft-deep-kraken',
    targetBlookId: 'deep-kraken',
    ingredients: [
      { blookId: 'deep-manta', count: 1 },
      { blookId: 'chess-king', count: 1 },
      { blookId: 'circus-elephant', count: 1 },
    ],
  },
  {
    id: 'craft-deep-leviathan',
    targetBlookId: 'deep-leviathan',
    ingredients: [
      { blookId: 'deep-kraken', count: 1 },
      { blookId: 'chess-grandmaster', count: 1 },
      { blookId: 'fruit-sun-ambrosia', count: 1 },
      { blookId: 'the-golden-ticket', count: 1 },
    ],
  },
  // --- DRINKS PACK MIXED BAZAAR OFFERS ---
  {
    id: 'craft-drink-boba',
    targetBlookId: 'drink-boba',
    ingredients: [
      { blookId: 'drink-milkshake', count: 3 },
      { blookId: 'fruit-strawberry', count: 2 },
      { blookId: 'deep-clownfish', count: 2 },
    ],
  },
  {
    id: 'craft-drink-iced-coffee',
    targetBlookId: 'drink-iced-coffee',
    ingredients: [
      { blookId: 'drink-water', count: 3 },
      { blookId: 'chess-clock', count: 2 },
      { blookId: 'popcorn', count: 2 },
    ],
  },
  {
    id: 'craft-drink-root-beer',
    targetBlookId: 'drink-root-beer',
    ingredients: [
      { blookId: 'drink-boba', count: 2 },
      { blookId: 'cotton-candy', count: 1 },
      { blookId: 'fruit-peach', count: 1 },
    ],
  },
  {
    id: 'craft-drink-matcha',
    targetBlookId: 'drink-matcha',
    ingredients: [
      { blookId: 'drink-root-beer', count: 2 },
      { blookId: 'fruit-tanghulu', count: 1 },
      { blookId: 'deep-jellyfish', count: 2 },
    ],
  },
  {
    id: 'craft-drink-slushie',
    targetBlookId: 'drink-slushie',
    ingredients: [
      { blookId: 'drink-matcha', count: 1 },
      { blookId: 'deep-shark', count: 1 },
      { blookId: 'fruit-pineapple', count: 1 },
    ],
  },
  {
    id: 'craft-drink-galaxy-soda',
    targetBlookId: 'drink-galaxy-soda',
    ingredients: [
      { blookId: 'drink-matcha', count: 1 },
      { blookId: 'chess-queen', count: 1 },
      { blookId: 'circus-ball', count: 1 },
    ],
  },
  {
    id: 'craft-drink-elixir',
    targetBlookId: 'drink-elixir',
    ingredients: [
      { blookId: 'drink-slushie', count: 1 },
      { blookId: 'drink-galaxy-soda', count: 1 },
      { blookId: 'fruit-starfruit', count: 1 },
    ],
  },
  {
    id: 'craft-drink-golden-nectar',
    targetBlookId: 'drink-golden-nectar',
    ingredients: [
      { blookId: 'drink-elixir', count: 1 },
      { blookId: 'fruit-dragonfruit', count: 1 },
      { blookId: 'the-golden-ticket', count: 1 },
    ],
  },
  // --- BALL PACK MIXED BAZAAR OFFERS ---
  {
    id: 'craft-ball-soccer',
    targetBlookId: 'ball-soccer',
    ingredients: [
      { blookId: 'ball-tennis', count: 3 },
      { blookId: 'athlete-football', count: 2 },
      { blookId: 'deep-starfish', count: 2 },
    ],
  },
  {
    id: 'craft-ball-volleyball',
    targetBlookId: 'ball-volleyball',
    ingredients: [
      { blookId: 'ball-beach', count: 3 },
      { blookId: 'drink-lemonade', count: 2 },
      { blookId: 'athlete-basketball', count: 2 },
    ],
  },
  {
    id: 'craft-ball-bowling',
    targetBlookId: 'ball-bowling',
    ingredients: [
      { blookId: 'ball-soccer', count: 2 },
      { blookId: 'canon-ball', count: 1 },
      { blookId: 'chess-rook', count: 1 },
    ],
  },
  {
    id: 'craft-ball-eight',
    targetBlookId: 'ball-eight',
    ingredients: [
      { blookId: 'ball-bowling', count: 2 },
      { blookId: 'chess-knight', count: 1 },
      { blookId: 'athlete-golfer', count: 1 },
    ],
  },
  {
    id: 'craft-ball-disco',
    targetBlookId: 'ball-disco',
    ingredients: [
      { blookId: 'ball-eight', count: 1 },
      { blookId: 'circus-ball', count: 1 },
      { blookId: 'athlete-soccer', count: 1 },
    ],
  },
  {
    id: 'craft-ball-crystal',
    targetBlookId: 'ball-crystal',
    ingredients: [
      { blookId: 'ball-eight', count: 1 },
      { blookId: 'deep-shark', count: 1 },
      { blookId: 'chess-queen', count: 1 },
    ],
  },
  {
    id: 'craft-ball-plasma',
    targetBlookId: 'ball-plasma',
    ingredients: [
      { blookId: 'ball-disco', count: 1 },
      { blookId: 'ball-crystal', count: 1 },
      { blookId: 'deep-orca', count: 1 },
    ],
  },
  {
    id: 'craft-ball-super',
    targetBlookId: 'ball-super',
    ingredients: [
      { blookId: 'ball-plasma', count: 1 },
      { blookId: 'drink-elixir', count: 1 },
      { blookId: 'fruit-blood-orange', count: 1 },
    ],
  },
  // --- DESSERT PACK MIXED BAZAAR OFFERS ---
  {
    id: 'craft-dessert-macaron',
    targetBlookId: 'dessert-macaron',
    ingredients: [
      { blookId: 'dessert-donut', count: 3 },
      { blookId: 'fruit-strawberry', count: 2 },
      { blookId: 'drink-milkshake', count: 2 },
    ],
  },
  {
    id: 'craft-dessert-cheesecake',
    targetBlookId: 'dessert-cheesecake',
    ingredients: [
      { blookId: 'dessert-cookie', count: 3 },
      { blookId: 'fruit-peach', count: 2 },
      { blookId: 'popcorn', count: 2 },
    ],
  },
  {
    id: 'craft-dessert-cinnamon-roll',
    targetBlookId: 'dessert-cinnamon-roll',
    ingredients: [
      { blookId: 'dessert-cupcake', count: 3 },
      { blookId: 'dessert-ice-cream', count: 2 },
      { blookId: 'cotton-candy', count: 1 },
    ],
  },
  {
    id: 'craft-dessert-lava-cake',
    targetBlookId: 'dessert-lava-cake',
    ingredients: [
      { blookId: 'dessert-cinnamon-roll', count: 2 },
      { blookId: 'drink-root-beer', count: 1 },
      { blookId: 'fruit-tanghulu', count: 1 },
    ],
  },
  {
    id: 'craft-dessert-aurora-parfait',
    targetBlookId: 'dessert-aurora-parfait',
    ingredients: [
      { blookId: 'dessert-lava-cake', count: 1 },
      { blookId: 'drink-matcha', count: 1 },
      { blookId: 'deep-jellyfish', count: 1 },
    ],
  },
  {
    id: 'craft-dessert-crystal-candy',
    targetBlookId: 'dessert-crystal-candy',
    ingredients: [
      { blookId: 'dessert-lava-cake', count: 1 },
      { blookId: 'ball-eight', count: 1 },
      { blookId: 'chess-queen', count: 1 },
    ],
  },
  {
    id: 'craft-dessert-mystic-souffle',
    targetBlookId: 'dessert-mystic-souffle',
    ingredients: [
      { blookId: 'dessert-aurora-parfait', count: 1 },
      { blookId: 'dessert-crystal-candy', count: 1 },
      { blookId: 'fruit-starfruit', count: 1 },
    ],
  },
  {
    id: 'craft-dessert-nebula-cake',
    targetBlookId: 'dessert-nebula-cake',
    ingredients: [
      { blookId: 'dessert-mystic-souffle', count: 1 },
      { blookId: 'ball-plasma', count: 1 },
      { blookId: 'the-golden-ticket', count: 1 },
    ],
  },
];


