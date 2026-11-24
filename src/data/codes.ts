export interface PromoCodeDefinition {
  code: string;
  title: string;
  description: string;
  tokens: number;
  blookId?: string;
  blookQty?: number;
  isPublic: boolean;
  maxUses?: number | null;
  active: boolean;
  isBuiltIn?: boolean;
  createdAt?: string;
}

export interface CustomPromoCodeRecord extends PromoCodeDefinition {
  usesCount: number;
  createdBy: string;
  createdAt: string;
}

export interface RedeemedCodeRecord {
  code: string;
  title: string;
  tokens: number;
  blookId?: string;
  blookQty?: number;
  redeemedAt: string;
}

export interface PublicPromoCodeInfo {
  code: string;
  title: string;
  description: string;
  tokens: number;
  blookId?: string;
  blookQty?: number;
  alreadyRedeemed: boolean;
  isBuiltIn: boolean;
}

export const BUILTIN_PROMO_CODES: PromoCodeDefinition[] = [
  {
    code: 'CLICKET',
    title: 'Welcome to CLICKET',
    description: 'Starter token drop for every collector.',
    tokens: 250,
    isPublic: true,
    active: true,
    isBuiltIn: true,
  },
  {
    code: 'CIRCUS25',
    title: 'Circus Big Top Gift',
    description: 'Celebrate the Circus Pack with bonus tokens and a Balloon Dog.',
    tokens: 200,
    blookId: 'balloon-dog',
    blookQty: 1,
    isPublic: true,
    active: true,
    isBuiltIn: true,
  },
  {
    code: 'FRUITBOWL',
    title: 'Fruit Harvest Bonus',
    description: 'Fresh orchard tokens and a crisp Apple Blook.',
    tokens: 150,
    blookId: 'fruit-apple',
    blookQty: 1,
    isPublic: true,
    active: true,
    isBuiltIn: true,
  },
  {
    code: 'CHESSMASTER',
    title: 'Chess Pack Launch',
    description: 'Opening move reward with tokens and a White Pawn.',
    tokens: 150,
    blookId: 'chess-pawn-white',
    blookQty: 1,
    isPublic: true,
    active: true,
    isBuiltIn: true,
  },
  {
    code: 'GOLDENCLICK',
    title: 'Secret Clicker Stash',
    description: 'Hidden vault code for dedicated CLICKET players.',
    tokens: 500,
    isPublic: false,
    active: true,
    isBuiltIn: true,
  },
];
