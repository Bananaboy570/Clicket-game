// Unified API client that uses the live Express backend (/api/*) when available,
// and seamlessly falls back to browser-local persistence when hosted as a static website (e.g. GitHub Pages).

import { ALL_BLOOKS } from '../data/blooks';
import {
  BUILTIN_PROMO_CODES,
  type CustomPromoCodeRecord,
  type PromoCodeDefinition,
  type RedeemedCodeRecord,
} from '../data/codes';

const STATIC_DB_KEY = 'clicket_static_db_v1';
const ONE_HOUR_MS = 60 * 60 * 1000;
const OWNER_IDENTIFIERS = new Set(['clicketownerofficial']);
const VALID_ACHIEVEMENTS = new Set(['owner', 'developer', 'day_one', 'legendary', 'chroma', 'op']);
const BLOOK_RARITY_BY_ID = new Map(ALL_BLOOKS.map((b) => [b.id, b.rarity]));

interface StaticTradeHistoryEntry {
  id: string;
  timestamp: string;
  partnerUsername: string;
  gaveBlookId: string;
  receivedBlookId: string;
}

interface StaticStoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  tokens: number;
  inventory: Record<string, number>;
  clickUpgradeLevel: number;
  bestDailyClicks: number;
  equippedBlookId: string;
  lastDailyPlayAt: number | null;
  lastWheelSpinAt: number | null;
  lastHourlyClaimAt: number | null;
  tradeHistory: StaticTradeHistoryEntry[];
  clanId: string | null;
  achievements: string[];
  revokedAchievements?: string[];
  redeemedCodes?: RedeemedCodeRecord[];
  createdAt: string;
}

interface StaticClanMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

interface StaticClanRecord {
  id: string;
  name: string;
  tag: string;
  description: string;
  bannerColor: string;
  emblemBlookId: string;
  leaderId: string;
  memberIds: string[];
  officerIds: string[];
  messages: StaticClanMessage[];
  createdAt: string;
}

interface StaticSetStats {
  totalPlays: number;
  uniquePlayerIds: string[];
}

export interface StaticChatMessage {
  id: string;
  userId: string;
  username: string;
  avatarBlookId: string;
  achievements: string[];
  isOwner: boolean;
  text: string;
  createdAt: string;
  clanTag?: string;
  clanColor?: string;
  replyToId?: string;
  replyToUsername?: string;
  replyToAvatar?: string;
  replyToText?: string;
}

export interface StaticGlobalTradeListing {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorAvatarBlookId: string;
  creatorAchievements: string[];
  creatorIsOwner: boolean;
  offeredBlookId: string;
  requestedBlookId: string | null;
  requestedRarity: string | null;
  note: string;
  status: 'OPEN' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
  fulfilledByUsername?: string;
  fulfilledAt?: string;
}

interface StaticDatabase {
  users: Record<string, StaticStoredUser>;
  sessions: Record<string, string>;
  setStats: Record<string, StaticSetStats>;
  clans: Record<string, StaticClanRecord>;
  chatMessages: StaticChatMessage[];
  globalTrades: StaticGlobalTradeListing[];
  promoCodes?: Record<string, CustomPromoCodeRecord>;
}

const STATIC_CHAT_CHANNEL = 'clicket_static_chat';
const STATIC_TRADES_CHANNEL = 'clicket_static_trades';

function notifyStaticChatUpdated(): void {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(STATIC_CHAT_CHANNEL);
      ch.postMessage({ type: 'chat:updated' });
      ch.close();
    }
  } catch {
    // Ignore BroadcastChannel unavailability
  }
}

function notifyStaticTradesUpdated(): void {
  try {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(STATIC_TRADES_CHANNEL);
      ch.postMessage({ type: 'trades:updated' });
      ch.close();
    }
  } catch {
    // Ignore BroadcastChannel unavailability
  }
}

export function getApiBaseUrl(): string {
  const configured = String(
    import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_URL || ''
  ).trim();
  return configured.replace(/\/+$/, '');
}

export function getWebSocketUrl(): string {
  const configuredWs = String(import.meta.env.VITE_WS_URL || '').trim();
  if (configuredWs) return configuredWs;
  const base = getApiBaseUrl();
  if (base) {
    try {
      const u = new URL(base);
      const wsProto = u.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${wsProto}//${u.host}/ws`;
    } catch {
      // Fallback to window location below
    }
  }
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${protocol}//${window.location.host}/ws`;
}

let staticModeDetected = false;
const staticListeners = new Set<() => void>();

export function isStaticMode(): boolean {
  return staticModeDetected;
}

export function markStaticMode(): void {
  if (!staticModeDetected) {
    staticModeDetected = true;
    staticListeners.forEach((cb) => {
      try {
        cb();
      } catch {
        // Ignore listener errors
      }
    });
  }
}

export function onStaticModeChange(listener: () => void): () => void {
  staticListeners.add(listener);
  return () => {
    staticListeners.delete(listener);
  };
}

const INITIAL_STATIC_CHAT: StaticChatMessage[] = [
  {
    id: 'msg-welcome-owner',
    userId: 'system-owner',
    username: 'ClicketOwnerOfficial',
    avatarBlookId: 'magician',
    achievements: ['owner', 'developer', 'day_one'],
    isOwner: true,
    text: 'Welcome to CLICKET! Chat with players, collect Blooks, and trade across the Global Market!',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

function isBotStaticTrade(t: StaticGlobalTradeListing): boolean {
  return (
    String(t.id || '').startsWith('gt-seed-') ||
    String(t.creatorId || '').startsWith('seed-trader-')
  );
}

function loadStaticDb(): StaticDatabase {
  try {
    const raw = localStorage.getItem(STATIC_DB_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<StaticDatabase>;
      const rawTrades = Array.isArray(parsed.globalTrades) ? parsed.globalTrades : [];
      const cleanedTrades = rawTrades.filter((t) => !isBotStaticTrade(t));
      const db: StaticDatabase = {
        users: parsed.users || {},
        sessions: parsed.sessions || {},
        setStats: parsed.setStats || {},
        clans: parsed.clans || {},
        chatMessages:
          Array.isArray(parsed.chatMessages) && parsed.chatMessages.length > 0
            ? parsed.chatMessages
            : [...INITIAL_STATIC_CHAT],
        globalTrades: cleanedTrades,
        promoCodes: parsed.promoCodes || {},
      };
      if (cleanedTrades.length !== rawTrades.length) {
        saveStaticDb(db);
      }
      return db;
    }
  } catch {
    // Ignore storage read error
  }
  const initial: StaticDatabase = {
    users: {},
    sessions: {},
    setStats: {},
    clans: {},
    chatMessages: [...INITIAL_STATIC_CHAT],
    globalTrades: [],
    promoCodes: {},
  };
  saveStaticDb(initial);
  return initial;
}

function saveStaticDb(db: StaticDatabase): void {
  try {
    localStorage.setItem(STATIC_DB_KEY, JSON.stringify(db));
  } catch {
    // Ignore storage quota error
  }
}

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

async function hashPasswordClient(password: string, salt?: string): Promise<string> {
  const s = salt || Math.random().toString(36).slice(2, 14) + Date.now().toString(36);
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const data = new TextEncoder().encode(`${s}:${password}`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const hex = Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return `${s}:${hex}`;
  }
  // Simple fallback hash if crypto.subtle is unavailable
  let h = 2166136261;
  const input = `${s}:${password}`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `${s}:${(h >>> 0).toString(16)}`;
}

async function verifyPasswordClient(password: string, stored: string): Promise<boolean> {
  const idx = stored.indexOf(':');
  if (idx === -1) return false;
  const salt = stored.slice(0, idx);
  const candidate = await hashPasswordClient(password, salt);
  return candidate === stored;
}

function resolveAchievements(u: StaticStoredUser): string[] {
  const revoked = new Set<string>(
    Array.isArray(u.revokedAchievements) ? u.revokedAchievements : []
  );
  const set = new Set<string>(Array.isArray(u.achievements) ? u.achievements : []);
  const cleanEmail = (u.email || '').trim().toLowerCase();
  const cleanUser = (u.username || '').trim().toLowerCase();
  if (OWNER_IDENTIFIERS.has(cleanEmail) || OWNER_IDENTIFIERS.has(cleanUser)) {
    set.add('owner');
    set.add('developer');
  }
  if (!revoked.has('day_one')) {
    set.add('day_one');
  }
  for (const [blookId, count] of Object.entries(u.inventory || {})) {
    if (Number(count) <= 0) continue;
    const rarity = BLOOK_RARITY_BY_ID.get(blookId);
    if (rarity === 'Legendary' && !revoked.has('legendary')) set.add('legendary');
    if (rarity === 'Chroma' && !revoked.has('chroma')) set.add('chroma');
    if (rarity === 'Mystic' && !revoked.has('op')) set.add('op');
  }
  return Array.from(set).filter((a) => VALID_ACHIEVEMENTS.has(a));
}

function sanitizeStaticUser(u: StaticStoredUser) {
  const safeEquipped =
    u.equippedBlookId && (u.inventory?.[u.equippedBlookId] || 0) > 0
      ? u.equippedBlookId
      : '';
  return {
    id: u.id,
    username: u.username,
    email: u.email,
    verified: u.verified,
    tokens: u.tokens,
    inventory: u.inventory,
    clickUpgradeLevel: u.clickUpgradeLevel,
    bestDailyClicks: u.bestDailyClicks,
    equippedBlookId: safeEquipped,
    lastDailyPlayAt: u.lastDailyPlayAt ?? null,
    lastWheelSpinAt: u.lastWheelSpinAt ?? null,
    lastHourlyClaimAt: u.lastHourlyClaimAt ?? null,
    tradeHistory: (u.tradeHistory || []).slice(0, 50),
    clanId: u.clanId ?? null,
    achievements: resolveAchievements(u),
    redeemedCodes: (u.redeemedCodes || []).slice(0, 100),
  };
}

function findUserByUsername(db: StaticDatabase, username: string): StaticStoredUser | undefined {
  const target = username.trim().toLowerCase();
  if (!target) return undefined;
  return Object.values(db.users).find((u) => u.username.trim().toLowerCase() === target);
}

function getUserByBearer(db: StaticDatabase, headers: Headers): { key: string; user: StaticStoredUser } | null {
  const authHeader = headers.get('authorization') || headers.get('Authorization') || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) return null;
  const key = db.sessions[token];
  if (!key || !db.users[key]) return null;
  return { key, user: db.users[key] };
}

function buildStaticClanSummary(clan: StaticClanRecord, db: StaticDatabase) {
  const members = clan.memberIds
    .map((uid) => Object.values(db.users).find((u) => u.id === uid))
    .filter((u): u is StaticStoredUser => Boolean(u))
    .map((u) => {
      const uniqueBlooksCount = Object.values(u.inventory || {}).filter((c) => c > 0).length;
      const role: 'Leader' | 'Officer' | 'Member' =
        clan.leaderId === u.id
          ? 'Leader'
          : clan.officerIds.includes(u.id)
          ? 'Officer'
          : 'Member';
      return {
        id: u.id,
        username: u.username,
        equippedBlookId:
          u.equippedBlookId && (u.inventory?.[u.equippedBlookId] || 0) > 0
            ? u.equippedBlookId
            : '',
        tokens: u.tokens || 0,
        uniqueBlooksCount,
        achievements: resolveAchievements(u),
        role,
      };
    });

  members.sort((a, b) => {
    const rank = { Leader: 0, Officer: 1, Member: 2 };
    if (rank[a.role] !== rank[b.role]) return rank[a.role] - rank[b.role];
    return b.tokens - a.tokens;
  });

  const totalTokens = members.reduce((sum, m) => sum + m.tokens, 0);
  const totalUniqueBlooks = members.reduce((sum, m) => sum + m.uniqueBlooksCount, 0);
  const leader = members.find((m) => m.id === clan.leaderId);

  return {
    id: clan.id,
    name: clan.name,
    tag: clan.tag,
    description: clan.description,
    bannerColor: clan.bannerColor,
    emblemBlookId: clan.emblemBlookId,
    leaderId: clan.leaderId,
    leaderUsername: leader?.username || 'Leader',
    memberCount: members.length,
    totalTokens,
    totalUniqueBlooks,
    powerScore: totalTokens + totalUniqueBlooks * 250,
    members,
    messages: clan.messages.slice(-40),
    createdAt: clan.createdAt,
  };
}

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

async function handleStaticApi(input: string, init?: RequestInit): Promise<Response> {
  const url = input.split('?')[0];
  const method = (init?.method || 'GET').toUpperCase();
  const headers = new Headers(init?.headers);
  let body: Record<string, unknown> = {};
  if (typeof init?.body === 'string' && init.body.trim()) {
    try {
      body = JSON.parse(init.body) as Record<string, unknown>;
    } catch {
      body = {};
    }
  }

  const db = loadStaticDb();

  // AUTH: SIGNUP
  if (url === '/api/auth/signup' && method === 'POST') {
    const cleanUsername = String(body.username || '').trim();
    const rawPassword = String(body.password || '');
    if (cleanUsername.length < 2 || cleanUsername.length > 30) {
      return jsonRes({ error: 'Username must be between 2 and 30 characters.' }, 400);
    }
    if (rawPassword.length < 6) {
      return jsonRes({ error: 'Password must be at least 6 characters.' }, 400);
    }
    if (findUserByUsername(db, cleanUsername)) {
      return jsonRes({ error: 'That username is already taken! Please choose another one.' }, 409);
    }
    const lowerUser = cleanUsername.toLowerCase();
    const userKey = `user:${lowerUser}`;
    const user: StaticStoredUser = {
      id: randomId(),
      username: cleanUsername,
      email: '',
      passwordHash: await hashPasswordClient(rawPassword),
      verified: true,
      tokens: 20,
      inventory: {},
      clickUpgradeLevel: 0,
      bestDailyClicks: 0,
      equippedBlookId: '',
      lastDailyPlayAt: null,
      lastWheelSpinAt: null,
      lastHourlyClaimAt: null,
      tradeHistory: [],
      clanId: null,
      achievements: [],
      createdAt: new Date().toISOString(),
    };
    user.achievements = resolveAchievements(user);
    db.users[userKey] = user;
    const sessionToken = randomId() + randomId();
    db.sessions[sessionToken] = userKey;
    saveStaticDb(db);
    return jsonRes({ ok: true, sessionToken, user: sanitizeStaticUser(user) });
  }

  // AUTH: LOGIN
  if (url === '/api/auth/login' && method === 'POST') {
    const identifier = String(body.username || body.email || '').trim().toLowerCase();
    const rawPassword = String(body.password || '');
    if (!identifier || !rawPassword) {
      return jsonRes({ error: 'Please enter both username and password.' }, 400);
    }
    const entry = Object.entries(db.users).find(
      ([, u]) =>
        u.username.trim().toLowerCase() === identifier ||
        (u.email && u.email.trim().toLowerCase() === identifier)
    );
    if (!entry || !(await verifyPasswordClient(rawPassword, entry[1].passwordHash))) {
      return jsonRes({ error: 'Invalid username or password.' }, 401);
    }
    entry[1].achievements = resolveAchievements(entry[1]);
    const sessionToken = randomId() + randomId();
    db.sessions[sessionToken] = entry[0];
    saveStaticDb(db);
    return jsonRes({ ok: true, sessionToken, user: sanitizeStaticUser(entry[1]) });
  }

  // AUTH: ME
  if (url === '/api/auth/me' && method === 'GET') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Session expired' }, 401);
    return jsonRes({ user: sanitizeStaticUser(auth.user) });
  }

  // AUTH: LOGOUT
  if (url === '/api/auth/logout' && method === 'POST') {
    const authHeader = headers.get('authorization') || headers.get('Authorization') || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (token && db.sessions[token]) {
      delete db.sessions[token];
      saveStaticDb(db);
    }
    return jsonRes({ ok: true });
  }

  // USER: RENAME
  if (url === '/api/user/rename' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const cleanUsername = String(body.username || '').trim();
    if (cleanUsername.length < 2 || cleanUsername.length > 30) {
      return jsonRes({ error: 'Username must be between 2 and 30 characters.' }, 400);
    }
    const existing = findUserByUsername(db, cleanUsername);
    if (existing && existing.id !== auth.user.id) {
      return jsonRes({ error: 'That username is already taken! Please choose another one.' }, 409);
    }
    auth.user.username = cleanUsername;
    saveStaticDb(db);
    return jsonRes({ ok: true, user: sanitizeStaticUser(auth.user) });
  }

  // USER: SYNC
  if (url === '/api/user/sync' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const { user } = auth;
    if (typeof body.tokens === 'number' && Number.isFinite(body.tokens) && body.tokens >= 0) {
      user.tokens = Math.floor(body.tokens);
    }
    if (body.inventory && typeof body.inventory === 'object') {
      user.inventory = body.inventory as Record<string, number>;
    }
    if (
      typeof body.clickUpgradeLevel === 'number' &&
      Number.isFinite(body.clickUpgradeLevel) &&
      body.clickUpgradeLevel >= 0
    ) {
      user.clickUpgradeLevel = Math.floor(body.clickUpgradeLevel);
    }
    if (
      typeof body.bestDailyClicks === 'number' &&
      Number.isFinite(body.bestDailyClicks) &&
      body.bestDailyClicks >= 0
    ) {
      user.bestDailyClicks = Math.max(user.bestDailyClicks, Math.floor(body.bestDailyClicks));
    }
    if (typeof body.equippedBlookId === 'string') {
      user.equippedBlookId = body.equippedBlookId;
    }
    if (typeof body.lastDailyPlayAt === 'number' || body.lastDailyPlayAt === null) {
      user.lastDailyPlayAt = body.lastDailyPlayAt as number | null;
    }
    if (typeof body.lastWheelSpinAt === 'number' || body.lastWheelSpinAt === null) {
      user.lastWheelSpinAt = body.lastWheelSpinAt as number | null;
    }
    user.achievements = resolveAchievements(user);
    saveStaticDb(db);
    return jsonRes({ ok: true, user: sanitizeStaticUser(user) });
  }

  // REWARDS: HOURLY
  if (url === '/api/rewards/hourly' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const now = Date.now();
    const lastClaim = auth.user.lastHourlyClaimAt ?? 0;
    const elapsed = now - lastClaim;
    if (lastClaim > 0 && elapsed < ONE_HOUR_MS) {
      return jsonRes(
        {
          error: 'Hourly Reward is still on cooldown.',
          remainingMs: ONE_HOUR_MS - elapsed,
          lastHourlyClaimAt: lastClaim,
        },
        429
      );
    }
    const reward = 300 + Math.floor(Math.random() * 121) * 5;
    auth.user.tokens = (auth.user.tokens || 0) + reward;
    auth.user.lastHourlyClaimAt = now;
    saveStaticDb(db);
    return jsonRes({
      ok: true,
      reward,
      tokens: auth.user.tokens,
      lastHourlyClaimAt: now,
    });
  }

  // PROMO CODES AREA
  if (url === '/api/codes' && method === 'GET') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const redeemedSet = new Set(
      (auth.user.redeemedCodes || []).map((r) => String(r.code || '').toUpperCase())
    );
    const customCodes = Object.values(db.promoCodes || {});
    const allDefs: PromoCodeDefinition[] = [...BUILTIN_PROMO_CODES, ...customCodes];
    const publicCodes = allDefs
      .filter((c) => {
        if (!c.active || !c.isPublic) return false;
        if (!c.isBuiltIn) {
          const custom = c as CustomPromoCodeRecord;
          if (custom.maxUses != null && custom.usesCount >= custom.maxUses) {
            return redeemedSet.has(c.code.toUpperCase());
          }
        }
        return true;
      })
      .map((c) => ({
        code: c.code.toUpperCase(),
        title: c.title,
        description: c.description,
        tokens: c.tokens,
        blookId: c.blookId,
        blookQty: c.blookQty || (c.blookId ? 1 : undefined),
        alreadyRedeemed: redeemedSet.has(c.code.toUpperCase()),
        isBuiltIn: Boolean(c.isBuiltIn),
      }));

    const isOwner = resolveAchievements(auth.user).includes('owner');
    return jsonRes({
      publicCodes,
      redeemedCodes: (auth.user.redeemedCodes || []).slice(0, 100),
      ...(isOwner
        ? {
            customCodes: customCodes.sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            ),
          }
        : {}),
    });
  }

  if (url === '/api/codes/redeem' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const rawCode = String(body.code || '').trim().toUpperCase();
    if (!rawCode || !/^[A-Z0-9_-]{3,24}$/.test(rawCode)) {
      return jsonRes(
        { error: 'Please enter a valid code (3–24 letters, numbers, dashes, or underscores).' },
        400
      );
    }

    const customPromo = db.promoCodes?.[rawCode];
    const builtInPromo = BUILTIN_PROMO_CODES.find((c) => c.code.toUpperCase() === rawCode);
    const promo: PromoCodeDefinition | undefined = customPromo || builtInPromo;
    if (!promo) {
      return jsonRes(
        { error: "That code doesn't exist. Double-check the spelling and try again." },
        404
      );
    }
    if (!promo.active) {
      return jsonRes({ error: 'This code has expired or is currently disabled.' }, 400);
    }
    if (!auth.user.redeemedCodes) auth.user.redeemedCodes = [];
    if (auth.user.redeemedCodes.some((r) => String(r.code || '').toUpperCase() === rawCode)) {
      return jsonRes({ error: "You've already redeemed this code!" }, 409);
    }
    if (customPromo && customPromo.maxUses != null && customPromo.usesCount >= customPromo.maxUses) {
      return jsonRes(
        { error: 'This code has reached its maximum number of redemptions.' },
        400
      );
    }

    const grantedTokens = Math.max(0, Math.floor(promo.tokens || 0));
    const grantedBlookId =
      promo.blookId && BLOOK_RARITY_BY_ID.has(promo.blookId) ? promo.blookId : undefined;
    const grantedBlookQty = grantedBlookId ? Math.max(1, Math.floor(promo.blookQty || 1)) : 0;

    auth.user.tokens = (auth.user.tokens || 0) + grantedTokens;
    if (grantedBlookId && grantedBlookQty > 0) {
      if (!auth.user.inventory) auth.user.inventory = {};
      auth.user.inventory[grantedBlookId] =
        (auth.user.inventory[grantedBlookId] || 0) + grantedBlookQty;
    }
    const redeemedEntry: RedeemedCodeRecord = {
      code: rawCode,
      title: promo.title,
      tokens: grantedTokens,
      ...(grantedBlookId ? { blookId: grantedBlookId, blookQty: grantedBlookQty } : {}),
      redeemedAt: new Date().toISOString(),
    };
    auth.user.redeemedCodes = [redeemedEntry, ...auth.user.redeemedCodes].slice(0, 100);
    auth.user.achievements = resolveAchievements(auth.user);
    if (customPromo) customPromo.usesCount = (customPromo.usesCount || 0) + 1;
    saveStaticDb(db);
    return jsonRes({
      ok: true,
      reward: redeemedEntry,
      user: sanitizeStaticUser(auth.user),
    });
  }

  if (url === '/api/codes/create' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    if (!resolveAchievements(auth.user).includes('owner')) {
      return jsonRes({ error: 'Owner access required.' }, 403);
    }
    const rawCode = String(body.code || '').trim().toUpperCase();
    if (!/^[A-Z0-9_-]{3,24}$/.test(rawCode)) {
      return jsonRes(
        { error: 'Code must be 3–24 characters using letters, numbers, dashes, or underscores.' },
        400
      );
    }
    if (
      BUILTIN_PROMO_CODES.some((c) => c.code.toUpperCase() === rawCode) ||
      db.promoCodes?.[rawCode]
    ) {
      return jsonRes({ error: `Code "${rawCode}" already exists.` }, 409);
    }
    const title = String(body.title || '').trim().slice(0, 48) || rawCode;
    const description =
      String(body.description || '').trim().slice(0, 120) || 'Custom CLICKET reward code.';
    const tokens = Math.max(0, Math.min(1000000, Math.floor(Number(body.tokens ?? 0))));
    const rawBlookId = String(body.blookId || '').trim();
    const blookId = rawBlookId && BLOOK_RARITY_BY_ID.has(rawBlookId) ? rawBlookId : undefined;
    const blookQty = blookId
      ? Math.max(1, Math.min(25, Math.floor(Number(body.blookQty ?? 1))))
      : undefined;
    if (tokens <= 0 && !blookId) {
      return jsonRes({ error: 'Code must grant at least 1 token or a Blook.' }, 400);
    }
    const rawMaxUses = body.maxUses;
    const maxUses =
      rawMaxUses !== null && rawMaxUses !== undefined && rawMaxUses !== ''
        ? Math.max(1, Math.floor(Number(rawMaxUses)))
        : null;
    if (!db.promoCodes) db.promoCodes = {};
    const record: CustomPromoCodeRecord = {
      code: rawCode,
      title,
      description,
      tokens,
      ...(blookId ? { blookId, blookQty } : {}),
      isPublic: Boolean(body.isPublic),
      maxUses,
      active: true,
      isBuiltIn: false,
      usesCount: 0,
      createdBy: auth.user.username,
      createdAt: new Date().toISOString(),
    };
    db.promoCodes[rawCode] = record;
    saveStaticDb(db);
    return jsonRes({ ok: true, promoCode: record });
  }

  if (url === '/api/codes/toggle' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    if (!resolveAchievements(auth.user).includes('owner')) {
      return jsonRes({ error: 'Owner access required.' }, 403);
    }
    const rawCode = String(body.code || '').trim().toUpperCase();
    const record = db.promoCodes?.[rawCode];
    if (!record) return jsonRes({ error: 'Custom code not found.' }, 404);
    record.active = !record.active;
    saveStaticDb(db);
    return jsonRes({ ok: true, promoCode: record });
  }

  if (url === '/api/codes/delete' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    if (!resolveAchievements(auth.user).includes('owner')) {
      return jsonRes({ error: 'Owner access required.' }, 403);
    }
    const rawCode = String(body.code || '').trim().toUpperCase();
    if (!db.promoCodes?.[rawCode]) return jsonRes({ error: 'Custom code not found.' }, 404);
    delete db.promoCodes[rawCode];
    saveStaticDb(db);
    return jsonRes({ ok: true });
  }

  // SETS: STATS
  if (url === '/api/sets/stats' && method === 'GET') {
    const summary: Record<string, { uniquePlayers: number; totalPlays: number }> = {};
    for (const [setId, stat] of Object.entries(db.setStats || {})) {
      summary[setId] = {
        uniquePlayers: stat.uniquePlayerIds.length,
        totalPlays: stat.totalPlays,
      };
    }
    return jsonRes({ stats: summary });
  }

  // SETS: PLAY
  const setPlayMatch = url.match(/^\/api\/sets\/([^/]+)\/play$/);
  if (setPlayMatch && method === 'POST') {
    const setId = decodeURIComponent(setPlayMatch[1]);
    const auth = getUserByBearer(db, headers);
    const playerId = auth?.user.id || 'guest';
    if (!db.setStats[setId]) {
      db.setStats[setId] = { totalPlays: 0, uniquePlayerIds: [] };
    }
    db.setStats[setId].totalPlays += 1;
    if (!db.setStats[setId].uniquePlayerIds.includes(playerId)) {
      db.setStats[setId].uniquePlayerIds.push(playerId);
    }
    saveStaticDb(db);
    return jsonRes({
      ok: true,
      setId,
      uniquePlayers: db.setStats[setId].uniquePlayerIds.length,
      totalPlays: db.setStats[setId].totalPlays,
    });
  }

  // CLANS: LIST
  if (url === '/api/clans' && method === 'GET') {
    const list = Object.values(db.clans || {})
      .map((c) => buildStaticClanSummary(c, db))
      .filter((c) => c.memberCount > 0)
      .sort((a, b) => b.powerScore - a.powerScore);
    return jsonRes({ clans: list });
  }

  // CLANS: CREATE
  if (url === '/api/clans/create' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const { user } = auth;
    if (user.clanId && db.clans[user.clanId]) {
      return jsonRes({ error: 'Leave your current clan before creating a new one.' }, 400);
    }
    const name = String(body.name || '').trim();
    const tag = String(body.tag || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    const description = String(body.description || '').trim().slice(0, 140);
    const bannerColor = /^#[0-9a-fA-F]{6}$/.test(String(body.bannerColor || ''))
      ? String(body.bannerColor)
      : '#dc2626';
    const emblemBlookId = String(body.emblemBlookId || 'jester').trim() || 'jester';
    if (name.length < 2 || name.length > 24) {
      return jsonRes({ error: 'Clan name must be between 2 and 24 characters.' }, 400);
    }
    if (tag.length < 2 || tag.length > 5) {
      return jsonRes({ error: 'Clan tag must be 2 to 5 letters/numbers.' }, 400);
    }
    const duplicate = Object.values(db.clans).find(
      (c) => c.name.toLowerCase() === name.toLowerCase() || c.tag.toLowerCase() === tag.toLowerCase()
    );
    if (duplicate) {
      return jsonRes({ error: 'A clan with that name or tag already exists!' }, 409);
    }
    const clanId = randomId();
    const clan: StaticClanRecord = {
      id: clanId,
      name,
      tag,
      description: description || 'Welcome to our CLICKET clan!',
      bannerColor,
      emblemBlookId,
      leaderId: user.id,
      memberIds: [user.id],
      officerIds: [],
      messages: [
        {
          id: randomId(),
          userId: user.id,
          username: user.username,
          text: `Founded [${tag}] ${name}!`,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
    };
    db.clans[clanId] = clan;
    user.clanId = clanId;
    saveStaticDb(db);
    return jsonRes({ ok: true, clan: buildStaticClanSummary(clan, db) });
  }

  // CLANS: LEAVE
  if (url === '/api/clans/leave' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const { user } = auth;
    const clanId = user.clanId;
    if (!clanId || !db.clans[clanId]) {
      user.clanId = null;
      saveStaticDb(db);
      return jsonRes({ ok: true });
    }
    const clan = db.clans[clanId];
    clan.memberIds = clan.memberIds.filter((id) => id !== user.id);
    clan.officerIds = clan.officerIds.filter((id) => id !== user.id);
    user.clanId = null;
    if (clan.memberIds.length === 0) {
      delete db.clans[clanId];
    } else if (clan.leaderId === user.id) {
      clan.leaderId = clan.officerIds[0] || clan.memberIds[0];
      clan.officerIds = clan.officerIds.filter((id) => id !== clan.leaderId);
    }
    saveStaticDb(db);
    return jsonRes({ ok: true });
  }

  // CLANS: JOIN / MESSAGE / KICK / ROLE / UPDATE
  const clanActionMatch = url.match(/^\/api\/clans\/([^/]+)\/(join|message|kick|role|update)$/);
  if (clanActionMatch && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const { user } = auth;
    const clanId = decodeURIComponent(clanActionMatch[1]);
    const action = clanActionMatch[2];
    const clan = db.clans[clanId];
    if (!clan) return jsonRes({ error: 'Clan not found.' }, 404);

    if (action === 'join') {
      if (user.clanId && db.clans[user.clanId] && user.clanId !== clanId) {
        return jsonRes({ error: 'Leave your current clan first.' }, 400);
      }
      if (!clan.memberIds.includes(user.id)) {
        if (clan.memberIds.length >= 30) {
          return jsonRes({ error: 'This clan is full (30/30 members).' }, 400);
        }
        clan.memberIds.push(user.id);
        clan.messages.push({
          id: randomId(),
          userId: user.id,
          username: user.username,
          text: `${user.username} joined the clan!`,
          createdAt: new Date().toISOString(),
        });
      }
      user.clanId = clanId;
      saveStaticDb(db);
      return jsonRes({ ok: true, clan: buildStaticClanSummary(clan, db) });
    }

    if (action === 'message') {
      if (!clan.memberIds.includes(user.id)) {
        return jsonRes({ error: 'Join this clan to chat.' }, 403);
      }
      const text = String(body.text || '').trim().slice(0, 220);
      if (!text) return jsonRes({ error: 'Message cannot be empty.' }, 400);
      clan.messages.push({
        id: randomId(),
        userId: user.id,
        username: user.username,
        text,
        createdAt: new Date().toISOString(),
      });
      if (clan.messages.length > 60) clan.messages = clan.messages.slice(-60);
      saveStaticDb(db);
      return jsonRes({ ok: true, messages: clan.messages.slice(-40) });
    }

    if (action === 'kick') {
      const targetUserId = String(body.targetUserId || '').trim();
      const isLeader = clan.leaderId === user.id;
      const isOfficer = clan.officerIds.includes(user.id);
      if (!isLeader && !isOfficer) {
        return jsonRes({ error: 'Only Leaders or Officers can remove members.' }, 403);
      }
      if (targetUserId === clan.leaderId) {
        return jsonRes({ error: 'Cannot kick the Clan Leader.' }, 400);
      }
      clan.memberIds = clan.memberIds.filter((id) => id !== targetUserId);
      clan.officerIds = clan.officerIds.filter((id) => id !== targetUserId);
      const target = Object.values(db.users).find((u) => u.id === targetUserId);
      if (target) target.clanId = null;
      saveStaticDb(db);
      return jsonRes({ ok: true, clan: buildStaticClanSummary(clan, db) });
    }

    if (action === 'role') {
      if (clan.leaderId !== user.id) {
        return jsonRes({ error: 'Only the Clan Leader can change member roles.' }, 403);
      }
      const targetUserId = String(body.targetUserId || '').trim();
      const role = String(body.role || '');
      if (!clan.memberIds.includes(targetUserId) || targetUserId === clan.leaderId) {
        return jsonRes({ error: 'Invalid member.' }, 400);
      }
      if (role === 'Officer') {
        if (!clan.officerIds.includes(targetUserId)) clan.officerIds.push(targetUserId);
      } else {
        clan.officerIds = clan.officerIds.filter((id) => id !== targetUserId);
      }
      saveStaticDb(db);
      return jsonRes({ ok: true, clan: buildStaticClanSummary(clan, db) });
    }

    if (action === 'update') {
      if (clan.leaderId !== user.id) {
        return jsonRes({ error: 'Only the clan leader can edit clan settings.' }, 403);
      }
      if (typeof body.description === 'string') {
        clan.description = body.description.trim().slice(0, 140);
      }
      if (typeof body.bannerColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(body.bannerColor)) {
        clan.bannerColor = body.bannerColor;
      }
      if (typeof body.emblemBlookId === 'string' && body.emblemBlookId.trim()) {
        clan.emblemBlookId = body.emblemBlookId.trim();
      }
      saveStaticDb(db);
      return jsonRes({ ok: true, clan: buildStaticClanSummary(clan, db) });
    }
  }

  // ACHIEVEMENTS: GRANT
  if (url === '/api/achievements/grant' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const callerAchievements = resolveAchievements(auth.user);
    if (!callerAchievements.includes('owner')) {
      return jsonRes({ error: 'Only an Owner can grant Owner or Developer achievements.' }, 403);
    }
    const targetUsername = String(body.username || '').trim();
    const achievementId = String(body.achievementId || '').trim();
    const grant = body.grant !== false;
    if (!VALID_ACHIEVEMENTS.has(achievementId)) {
      return jsonRes({ error: 'Invalid achievement ID.' }, 400);
    }
    const targetUser = findUserByUsername(db, targetUsername);
    if (!targetUser) {
      return jsonRes({ error: `No player found with username "${targetUsername}".` }, 404);
    }
    const revoked = new Set<string>(
      Array.isArray(targetUser.revokedAchievements) ? targetUser.revokedAchievements : []
    );
    const current = new Set(resolveAchievements(targetUser));
    if (grant) {
      revoked.delete(achievementId);
      current.add(achievementId);
    } else {
      revoked.add(achievementId);
      current.delete(achievementId);
    }
    targetUser.revokedAchievements = Array.from(revoked);
    targetUser.achievements = Array.from(current);
    saveStaticDb(db);
    return jsonRes({
      ok: true,
      targetUsername: targetUser.username,
      targetAchievements: resolveAchievements(targetUser),
      selfUser: targetUser.id === auth.user.id ? sanitizeStaticUser(targetUser) : undefined,
    });
  }

  // ADMIN PANEL ENDPOINTS (Owner only)
  if (url.startsWith('/api/admin/')) {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    if (!resolveAchievements(auth.user).includes('owner')) {
      return jsonRes({ error: 'Owner access required.' }, 403);
    }

    if (url === '/api/admin/overview' && method === 'GET') {
      const allUsers = Object.values(db.users)
        .map((u) => {
          const inv = u.inventory || {};
          const uniqueBlooksCount = Object.values(inv).filter((c) => c > 0).length;
          const totalBlooksCount = Object.values(inv).reduce((s, c) => s + (c > 0 ? c : 0), 0);
          const safeEquipped =
            u.equippedBlookId && (inv[u.equippedBlookId] || 0) > 0 ? u.equippedBlookId : '';
          return {
            id: u.id,
            username: u.username,
            tokens: u.tokens || 0,
            uniqueBlooksCount,
            totalBlooksCount,
            equippedBlookId: safeEquipped,
            achievements: resolveAchievements(u),
            clanId: u.clanId ?? null,
            bestDailyClicks: u.bestDailyClicks || 0,
            clickUpgradeLevel: u.clickUpgradeLevel || 0,
            createdAt: u.createdAt,
            inventory: inv,
          };
        })
        .sort((a, b) => b.tokens - a.tokens);

      const clans = Object.values(db.clans || {}).map((c) => {
        const s = buildStaticClanSummary(c, db);
        return {
          id: s.id,
          name: s.name,
          tag: s.tag,
          memberCount: s.memberCount,
          powerScore: s.powerScore,
          leaderUsername: s.leaderUsername,
        };
      });

      const totalTokens = allUsers.reduce((sum, u) => sum + u.tokens, 0);
      return jsonRes({
        stats: {
          totalUsers: allUsers.length,
          totalTokens,
          totalClans: clans.length,
          activeSessions: Object.keys(db.sessions || {}).length,
        },
        users: allUsers,
        clans,
      });
    }

    if (url === '/api/admin/user/tokens' && method === 'POST') {
      const targetUserId = String(body.userId || '').trim();
      const mode = body.mode === 'set' ? 'set' : 'add';
      const amount = Math.floor(Number(body.amount ?? 0));
      const targetUser = Object.values(db.users).find((u) => u.id === targetUserId);
      if (!targetUser) return jsonRes({ error: 'Player not found.' }, 404);
      targetUser.tokens =
        mode === 'set' ? Math.max(0, amount) : Math.max(0, (targetUser.tokens || 0) + amount);
      saveStaticDb(db);
      return jsonRes({
        ok: true,
        targetUser: sanitizeStaticUser(targetUser),
        selfUser: targetUser.id === auth.user.id ? sanitizeStaticUser(targetUser) : undefined,
      });
    }

    if (url === '/api/admin/user/blook' && method === 'POST') {
      const targetUserId = String(body.userId || '').trim();
      const unlockAll = Boolean(body.unlockAll);
      const blookId = String(body.blookId || '').trim();
      const quantity = Math.floor(Number(body.quantity ?? 1));
      const targetUser = Object.values(db.users).find((u) => u.id === targetUserId);
      if (!targetUser) return jsonRes({ error: 'Player not found.' }, 404);
      if (!targetUser.inventory) targetUser.inventory = {};

      if (unlockAll && Array.isArray(body.allBlookIds)) {
        for (const id of body.allBlookIds) {
          const clean = String(id || '').trim();
          if (clean) {
            targetUser.inventory[clean] = Math.max(1, targetUser.inventory[clean] || 0);
          }
        }
      } else if (blookId && Number.isFinite(quantity)) {
        const nextCount = (targetUser.inventory[blookId] || 0) + quantity;
        if (nextCount <= 0) delete targetUser.inventory[blookId];
        else targetUser.inventory[blookId] = nextCount;
        if (targetUser.equippedBlookId === blookId && !targetUser.inventory[blookId]) {
          targetUser.equippedBlookId = '';
        }
      } else {
        return jsonRes({ error: 'Missing Blook details.' }, 400);
      }
      targetUser.achievements = resolveAchievements(targetUser);
      saveStaticDb(db);
      return jsonRes({
        ok: true,
        targetUser: sanitizeStaticUser(targetUser),
        selfUser: targetUser.id === auth.user.id ? sanitizeStaticUser(targetUser) : undefined,
      });
    }

    if (url === '/api/admin/user/reset-cooldowns' && method === 'POST') {
      const targetUserId = String(body.userId || '').trim();
      const targetUser = Object.values(db.users).find((u) => u.id === targetUserId);
      if (!targetUser) return jsonRes({ error: 'Player not found.' }, 404);
      targetUser.lastDailyPlayAt = null;
      targetUser.lastWheelSpinAt = null;
      targetUser.lastHourlyClaimAt = null;
      saveStaticDb(db);
      return jsonRes({
        ok: true,
        targetUsername: targetUser.username,
        selfUser: targetUser.id === auth.user.id ? sanitizeStaticUser(targetUser) : undefined,
      });
    }

    if (url === '/api/admin/user/delete' && method === 'POST') {
      const targetUserId = String(body.userId || '').trim();
      const entry = Object.entries(db.users).find(([, u]) => u.id === targetUserId);
      if (!entry) return jsonRes({ error: 'Player not found.' }, 404);
      const [userKey, targetUser] = entry;
      if (
        targetUser.id === auth.user.id ||
        OWNER_IDENTIFIERS.has(targetUser.username.trim().toLowerCase())
      ) {
        return jsonRes({ error: 'Cannot delete the Owner account.' }, 400);
      }
      for (const [tok, key] of Object.entries(db.sessions)) {
        if (key === userKey) delete db.sessions[tok];
      }
      const deletedUsername = targetUser.username;
      delete db.users[userKey];
      saveStaticDb(db);
      return jsonRes({ ok: true, deletedUsername });
    }

    if (url === '/api/admin/clan/delete' && method === 'POST') {
      const clanId = String(body.clanId || '').trim();
      const clan = db.clans?.[clanId];
      if (!clan) return jsonRes({ error: 'Clan not found.' }, 404);
      for (const u of Object.values(db.users)) {
        if (u.clanId === clanId) u.clanId = null;
      }
      const deletedClanName = clan.name;
      delete db.clans[clanId];
      saveStaticDb(db);
      return jsonRes({ ok: true, deletedClanName });
    }
  }

  // ONLINE CHAT: LIST / SEND / DELETE
  if (url === '/api/chat/messages' && method === 'GET') {
    return jsonRes({ messages: (db.chatMessages || []).slice(-100) });
  }

  if (url === '/api/chat/messages' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Sign in to send chat messages.' }, 401);
    const { user } = auth;
    const cleanText = String(body.text || '').trim().slice(0, 300);
    if (!cleanText) return jsonRes({ error: 'Message cannot be empty.' }, 400);

    const achievements = resolveAchievements(user);
    const isOwner =
      achievements.includes('owner') ||
      OWNER_IDENTIFIERS.has((user.username || '').trim().toLowerCase());
    const safeEquipped =
      user.equippedBlookId && (user.inventory?.[user.equippedBlookId] || 0) > 0
        ? user.equippedBlookId
        : '';

    const userClan = user.clanId && db.clans?.[user.clanId] ? db.clans[user.clanId] : null;
    const replyToId = body.replyToId ? String(body.replyToId).trim().slice(0, 128) : '';
    const replyToUsername = body.replyToUsername ? String(body.replyToUsername).trim().slice(0, 32) : '';
    const replyToAvatar = body.replyToAvatar ? String(body.replyToAvatar).trim().slice(0, 64) : '';
    const replyToText = body.replyToText ? String(body.replyToText).trim().slice(0, 120) : '';

    const message: StaticChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      userId: user.id,
      username: user.username,
      avatarBlookId: safeEquipped,
      achievements,
      isOwner,
      text: cleanText,
      createdAt: new Date().toISOString(),
      ...(userClan?.tag ? { clanTag: userClan.tag } : {}),
      ...(userClan?.bannerColor ? { clanColor: userClan.bannerColor } : {}),
      ...(replyToId ? { replyToId } : {}),
      ...(replyToUsername ? { replyToUsername } : {}),
      ...(replyToAvatar ? { replyToAvatar } : {}),
      ...(replyToText ? { replyToText } : {}),
    };

    if (!Array.isArray(db.chatMessages)) db.chatMessages = [];
    db.chatMessages.push(message);
    if (db.chatMessages.length > 100) {
      db.chatMessages = db.chatMessages.slice(-100);
    }
    saveStaticDb(db);
    notifyStaticChatUpdated();
    return jsonRes({ ok: true, message });
  }

  const chatDeleteMatch = url.match(/^\/api\/chat\/messages\/([^/]+)$/);
  if (chatDeleteMatch && method === 'DELETE') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    if (!resolveAchievements(auth.user).includes('owner')) {
      return jsonRes({ error: 'Owner access required.' }, 403);
    }
    const messageId = decodeURIComponent(chatDeleteMatch[1]);
    db.chatMessages = (db.chatMessages || []).filter((m) => m.id !== messageId);
    saveStaticDb(db);
    notifyStaticChatUpdated();
    return jsonRes({ ok: true, messageId });
  }

  // GLOBAL TRADING: LIST / CREATE / FULFILL / CANCEL
  if (url === '/api/trades/global' && method === 'GET') {
    const openTrades = (db.globalTrades || []).filter(
      (t) => t.status === 'OPEN' && !isBotStaticTrade(t)
    );
    return jsonRes({ trades: openTrades.slice(-80).reverse() });
  }

  if (url === '/api/trades/global/create' && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const { user } = auth;
    const offeredBlookId = String(body.offeredBlookId || '').trim();
    const requestedBlookId = body.requestedBlookId ? String(body.requestedBlookId).trim() : null;
    const requestedRarity = body.requestedRarity ? String(body.requestedRarity).trim() : null;
    const note = String(body.note || '').trim().slice(0, 80);

    if (!offeredBlookId) {
      return jsonRes({ error: 'Please choose a Blook to offer.' }, 400);
    }
    if ((user.inventory?.[offeredBlookId] || 0) < 1) {
      return jsonRes({ error: 'You do not own that Blook.' }, 400);
    }
    if (!requestedBlookId && !requestedRarity) {
      return jsonRes({ error: 'Please specify what Blook or rarity you want in return.' }, 400);
    }

    user.inventory[offeredBlookId] -= 1;
    if (user.inventory[offeredBlookId] <= 0) delete user.inventory[offeredBlookId];
    if (user.equippedBlookId === offeredBlookId && !user.inventory[offeredBlookId]) {
      user.equippedBlookId = '';
    }

    const achievements = resolveAchievements(user);
    const isOwner =
      achievements.includes('owner') ||
      OWNER_IDENTIFIERS.has((user.username || '').trim().toLowerCase());
    const safeEquipped =
      user.equippedBlookId && (user.inventory?.[user.equippedBlookId] || 0) > 0
        ? user.equippedBlookId
        : '';

    const tradeListing: StaticGlobalTradeListing = {
      id: `gt-${Date.now()}-${randomId().slice(0, 6)}`,
      creatorId: user.id,
      creatorUsername: user.username,
      creatorAvatarBlookId: safeEquipped,
      creatorAchievements: achievements,
      creatorIsOwner: isOwner,
      offeredBlookId,
      requestedBlookId,
      requestedRarity,
      note,
      status: 'OPEN',
      createdAt: new Date().toISOString(),
    };

    if (!Array.isArray(db.globalTrades)) db.globalTrades = [];
    db.globalTrades.push(tradeListing);
    saveStaticDb(db);
    notifyStaticTradesUpdated();
    return jsonRes({ ok: true, trade: tradeListing, user: sanitizeStaticUser(user) });
  }

  const tradeFulfillMatch = url.match(/^\/api\/trades\/global\/([^/]+)\/fulfill$/);
  if (tradeFulfillMatch && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const { user } = auth;
    const tradeId = decodeURIComponent(tradeFulfillMatch[1]);
    if (!Array.isArray(db.globalTrades)) db.globalTrades = [];
    const trade = db.globalTrades.find((t) => t.id === tradeId);

    if (!trade || trade.status !== 'OPEN') {
      return jsonRes({ error: 'This trade offer is no longer available.' }, 404);
    }
    if (trade.creatorId === user.id) {
      return jsonRes({ error: 'You cannot fulfill your own trade offer.' }, 400);
    }

    const givenBlookId = String(body.givenBlookId || trade.requestedBlookId || '').trim();
    if (!givenBlookId) {
      return jsonRes({ error: 'Please choose which Blook you are giving.' }, 400);
    }
    if ((user.inventory?.[givenBlookId] || 0) < 1) {
      return jsonRes({ error: 'You do not own that Blook.' }, 400);
    }

    if (trade.requestedBlookId && trade.requestedBlookId !== givenBlookId) {
      return jsonRes({ error: 'That does not match the requested Blook.' }, 400);
    }

    if (trade.requestedRarity) {
      const blookObj = ALL_BLOOKS.find((b) => b.id === givenBlookId);
      if (!blookObj || blookObj.rarity !== trade.requestedRarity) {
        return jsonRes({ error: `That Blook is not a ${trade.requestedRarity}.` }, 400);
      }
    }

    user.inventory[givenBlookId] -= 1;
    if (user.inventory[givenBlookId] <= 0) delete user.inventory[givenBlookId];
    user.inventory[trade.offeredBlookId] = (user.inventory[trade.offeredBlookId] || 0) + 1;
    if (user.equippedBlookId === givenBlookId && !user.inventory[givenBlookId]) {
      user.equippedBlookId = '';
    }

    const creator = Object.values(db.users).find((u) => u.id === trade.creatorId);
    const nowIso = new Date().toISOString();
    const tradeRef = `gt-${Date.now()}-${randomId().slice(0, 6)}`;

    const historyEntryFulfiller: StaticTradeHistoryEntry = {
      id: `${tradeRef}-f`,
      timestamp: nowIso,
      partnerUsername: trade.creatorUsername,
      gaveBlookId: givenBlookId,
      receivedBlookId: trade.offeredBlookId,
    };

    user.tradeHistory = [historyEntryFulfiller, ...(user.tradeHistory || [])].slice(0, 50);
    user.achievements = resolveAchievements(user);

    if (creator) {
      if (!creator.inventory) creator.inventory = {};
      creator.inventory[givenBlookId] = (creator.inventory[givenBlookId] || 0) + 1;
      const historyEntryCreator: StaticTradeHistoryEntry = {
        id: `${tradeRef}-c`,
        timestamp: nowIso,
        partnerUsername: user.username,
        gaveBlookId: trade.offeredBlookId,
        receivedBlookId: givenBlookId,
      };
      creator.tradeHistory = [historyEntryCreator, ...(creator.tradeHistory || [])].slice(0, 50);
      creator.achievements = resolveAchievements(creator);
    }

    trade.status = 'FULFILLED';
    trade.fulfilledByUsername = user.username;
    trade.fulfilledAt = nowIso;

    saveStaticDb(db);
    notifyStaticTradesUpdated();

    return jsonRes({
      ok: true,
      trade,
      user: sanitizeStaticUser(user),
      receivedBlookId: trade.offeredBlookId,
      gaveBlookId: givenBlookId,
      partnerUsername: trade.creatorUsername,
    });
  }

  const tradeCancelMatch = url.match(/^\/api\/trades\/global\/([^/]+)\/cancel$/);
  if (tradeCancelMatch && method === 'POST') {
    const auth = getUserByBearer(db, headers);
    if (!auth) return jsonRes({ error: 'Not authenticated' }, 401);
    const { user } = auth;
    const tradeId = decodeURIComponent(tradeCancelMatch[1]);
    if (!Array.isArray(db.globalTrades)) db.globalTrades = [];
    const trade = db.globalTrades.find((t) => t.id === tradeId);

    if (!trade || trade.status !== 'OPEN') {
      return jsonRes({ error: 'Trade not found or already closed.' }, 404);
    }
    if (trade.creatorId !== user.id) {
      return jsonRes({ error: 'You can only cancel your own trade listings.' }, 403);
    }

    user.inventory[trade.offeredBlookId] = (user.inventory[trade.offeredBlookId] || 0) + 1;
    trade.status = 'CANCELLED';

    saveStaticDb(db);
    notifyStaticTradesUpdated();
    return jsonRes({ ok: true, user: sanitizeStaticUser(user) });
  }

  return jsonRes({ error: 'Endpoint unavailable in static mode.' }, 404);
}

export async function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  if (staticModeDetected) {
    return handleStaticApi(input, init);
  }

  const base = getApiBaseUrl();
  const targetUrl = base && input.startsWith('/') ? `${base}${input}` : input;

  try {
    const res = await window.fetch(targetUrl, init);
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    const isJsonResponse = contentType.includes('application/json');

    // On GitHub Pages or any static file server, /api/* returns HTML or non-JSON 404/405
    if (!isJsonResponse && (contentType.includes('text/html') || res.status === 404 || res.status === 405)) {
      markStaticMode();
      return handleStaticApi(input, init);
    }

    return res;
  } catch {
    // Network error reaching /api/* -> switch cleanly to static browser-local mode
    markStaticMode();
    return handleStaticApi(input, init);
  }
}
