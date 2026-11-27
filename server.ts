import express from 'express';
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import dotenv from 'dotenv';
import { attachMultiplayerServer, type ChatMessageRecord } from './serverMultiplayer.ts';
import { ALL_BLOOKS, calculateInventoryWorth } from './src/data/blooks.ts';
import {
  BUILTIN_PROMO_CODES,
  type CustomPromoCodeRecord,
  type PromoCodeDefinition,
  type RedeemedCodeRecord,
} from './src/data/codes.ts';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'clicket-db.json');

export interface TradeHistoryEntry {
  id: string;
  timestamp: string;
  partnerUsername: string;
  gaveBlookId: string;
  receivedBlookId: string;
}

interface StoredUser {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  verified: boolean;
  verificationCode: string | null;
  codeExpiresAt: number | null;
  resetCode?: string | null;
  resetCodeExpiresAt?: number | null;
  tokens: number;
  inventory: Record<string, number>;
  clickUpgradeLevel: number;
  bestDailyClicks: number;
  equippedBlookId: string;
  lastDailyPlayAt?: number | null;
  lastWheelSpinAt?: number | null;
  lastHourlyClaimAt?: number | null;
  dailyStreak?: number;
  bestDailyStreak?: number;
  lastDailyStreakAt?: number | null;
  tradeHistory?: TradeHistoryEntry[];
  clanId?: string | null;
  achievements?: string[];
  revokedAchievements?: string[];
  redeemedCodes?: RedeemedCodeRecord[];
  createdAt: string;
}

export interface ClanMessage {
  id: string;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface ClanRecord {
  id: string;
  name: string;
  tag: string;
  description: string;
  bannerColor: string;
  emblemBlookId: string;
  leaderId: string;
  memberIds: string[];
  officerIds: string[];
  messages: ClanMessage[];
  createdAt: string;
}

export interface GlobalTradeListing {
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

interface SetPlayStats {
  totalPlays: number;
  uniquePlayerIds: string[];
}

interface DatabaseSchema {
  users: Record<string, StoredUser>; // keyed by lowercased email
  sessions: Record<string, string>; // sessionToken -> lowercased email
  setStats?: Record<string, SetPlayStats>;
  clans?: Record<string, ClanRecord>;
  chatMessages?: ChatMessageRecord[];
  globalTrades?: GlobalTradeListing[];
  promoCodes?: Record<string, CustomPromoCodeRecord>;
}

let dbCache: DatabaseSchema | null = null;

const SEED_CHAT_MESSAGES: ChatMessageRecord[] = [
  {
    id: 'msg-seed-owner-welcome',
    userId: 'system-owner',
    username: 'ClicketOwnerOfficial',
    avatarBlookId: 'magician',
    achievements: ['owner', 'developer', 'day_one'],
    isOwner: true,
    text: 'Welcome to CLICKET! Chat with players, collect Blooks, and trade across the Global Market!',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

function isBotGlobalTrade(t: GlobalTradeListing): boolean {
  return (
    String(t.id || '').startsWith('gt-seed-') ||
    String(t.creatorId || '').startsWith('seed-trader-')
  );
}

async function loadDb(): Promise<DatabaseSchema> {
  if (dbCache) return dbCache;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as DatabaseSchema;
    if (!parsed.setStats) parsed.setStats = {};
    if (!parsed.clans) parsed.clans = {};
    if (!parsed.promoCodes) parsed.promoCodes = {};
    if (!Array.isArray(parsed.chatMessages) || parsed.chatMessages.length === 0) {
      parsed.chatMessages = [...SEED_CHAT_MESSAGES];
    }
    const cleanedTrades = Array.isArray(parsed.globalTrades)
      ? parsed.globalTrades.filter((t) => !isBotGlobalTrade(t))
      : [];
    const hadBots = Array.isArray(parsed.globalTrades) && cleanedTrades.length !== parsed.globalTrades.length;
    parsed.globalTrades = cleanedTrades;
    dbCache = parsed;
    if (hadBots) {
      await saveDb(dbCache);
    }
  } catch {
    dbCache = {
      users: {},
      sessions: {},
      setStats: {},
      clans: {},
      chatMessages: [...SEED_CHAT_MESSAGES],
      globalTrades: [],
      promoCodes: {},
    };
    await saveDb(dbCache);
  }
  return dbCache;
}

async function saveDb(db: DatabaseSchema): Promise<void> {
  dbCache = db;
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
}

function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, keyHex] = storedHash.split(':');
  if (!salt || !keyHex) return false;
  const keyBuf = Buffer.from(keyHex, 'hex');
  const derivedBuf = crypto.scryptSync(password, salt, 64);
  if (keyBuf.length !== derivedBuf.length) return false;
  return crypto.timingSafeEqual(keyBuf, derivedBuf);
}

function generateSixDigitCode(): string {
  return crypto.randomInt(100000, 1000000).toString();
}

const OWNER_IDENTIFIERS = new Set(['clicketownerofficial']);
const VALID_ACHIEVEMENT_IDS = new Set([
  'owner',
  'developer',
  'day_one',
  'legendary',
  'chroma',
  'op',
]);
const BLOOK_RARITY_BY_ID = new Map(ALL_BLOOKS.map((b) => [b.id, b.rarity]));

function resolveUserAchievements(u: StoredUser): string[] {
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
    if ((rarity === 'Mystic' || rarity === 'Godly' || rarity === 'Secret') && !revoked.has('op')) set.add('op');
  }
  return Array.from(set).filter((a) => VALID_ACHIEVEMENT_IDS.has(a));
}

function sanitizeUser(u: StoredUser) {
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
    dailyStreak: Math.max(0, Math.floor(u.dailyStreak || 0)),
    bestDailyStreak: Math.max(0, Math.floor(u.bestDailyStreak || 0)),
    lastDailyStreakAt: u.lastDailyStreakAt ?? null,
    tradeHistory: (u.tradeHistory || []).slice(0, 50),
    clanId: u.clanId ?? null,
    achievements: resolveUserAchievements(u),
    redeemedCodes: (u.redeemedCodes || []).slice(0, 100),
  };
}

function updateStoredChatAvatars(
  db: DatabaseSchema,
  userId: string,
  username: string,
  avatarBlookId: string
): boolean {
  if (!Array.isArray(db.chatMessages) || db.chatMessages.length === 0) return false;
  let changed = false;
  const cleanName = username.trim().toLowerCase();
  for (const m of db.chatMessages) {
    if (m.userId === userId && m.avatarBlookId !== avatarBlookId) {
      m.avatarBlookId = avatarBlookId;
      changed = true;
    }
    if (
      m.replyToUsername &&
      m.replyToUsername.trim().toLowerCase() === cleanName &&
      (m.replyToAvatar || '') !== avatarBlookId
    ) {
      m.replyToAvatar = avatarBlookId;
      changed = true;
    }
  }
  return changed;
}

function findUserByUsername(db: DatabaseSchema, username: string): StoredUser | undefined {
  const target = username.trim().toLowerCase();
  if (!target) return undefined;
  return Object.values(db.users).find(
    (u) => u.username.trim().toLowerCase() === target
  );
}

function findUserEntry(
  db: DatabaseSchema,
  identifier: string
): { key: string; user: StoredUser } | undefined {
  const clean = identifier.trim().toLowerCase();
  if (!clean) return undefined;
  if (db.users[clean]) {
    return { key: clean, user: db.users[clean] };
  }
  const byUserKey = `user:${clean}`;
  if (db.users[byUserKey]) {
    return { key: byUserKey, user: db.users[byUserKey] };
  }
  for (const [key, u] of Object.entries(db.users)) {
    if (
      u.username.trim().toLowerCase() === clean ||
      (u.email && u.email.trim().toLowerCase() === clean)
    ) {
      return { key, user: u };
    }
  }
  return undefined;
}

const DEFAULT_RESEND_FROM = 'Clicket <onboarding@resend.dev>';

function resolveFromEmail(): string {
  const configured = process.env.RESEND_FROM_EMAIL?.trim() || '';
  if (
    !configured ||
    /yourdomain\.com|example\.com|your-domain/i.test(configured)
  ) {
    return DEFAULT_RESEND_FROM;
  }
  return configured;
}

async function sendViaResend(
  resendApiKey: string,
  fromEmail: string,
  toEmail: string,
  username: string,
  code: string,
  kind: 'verify' | 'reset' = 'verify'
): Promise<{ ok: boolean; status: number; errText: string }> {
  const isReset = kind === 'reset';
  const subject = isReset
    ? `Your Clicket Password Reset Code: ${code}`
    : `Your Clicket Verification Code: ${code}`;
  const heading = isReset ? 'Clicket Password Reset' : 'Clicket Verification';
  const bodyCopy = isReset
    ? 'Enter this 6-digit password reset code to choose a new password for your Clicket account:'
    : 'Enter this 6-digit verification code to unlock your Clicket account:';

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; border-radius: 16px; background: #f8fafc; border: 2px solid #933da8;">
          <h1 style="color: #933da8; margin: 0 0 12px;">${heading}</h1>
          <p style="color: #334155; font-size: 15px;">Hi <strong>${username}</strong>,</p>
          <p style="color: #334155; font-size: 15px;">${bodyCopy}</p>
          <div style="font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #0f172a; background: #ffffff; padding: 16px; text-align: center; border-radius: 12px; border: 2px dashed #18a4e0; margin: 20px 0;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 12px;">This code expires in 10 minutes.</p>
        </div>
      `,
    }),
  });

  if (response.ok) {
    return { ok: true, status: response.status, errText: '' };
  }
  return { ok: false, status: response.status, errText: await response.text() };
}

async function dispatchVerificationEmail(
  toEmail: string,
  username: string,
  code: string,
  kind: 'verify' | 'reset' = 'verify'
): Promise<{ deliveryMode: 'email' | 'preview'; previewCode?: string; deliveryReason?: string }> {
  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const primaryFrom = resolveFromEmail();

  if (resendApiKey) {
    try {
      let attempt = await sendViaResend(resendApiKey, primaryFrom, toEmail, username, code, kind);

      // If a custom RESEND_FROM_EMAIL domain isn't verified yet, retry with Resend's default sender
      if (!attempt.ok && attempt.status === 403 && primaryFrom !== DEFAULT_RESEND_FROM) {
        console.warn(`Custom sender "${primaryFrom}" is not verified on Resend; retrying with ${DEFAULT_RESEND_FROM}.`);
        attempt = await sendViaResend(resendApiKey, DEFAULT_RESEND_FROM, toEmail, username, code, kind);
      }

      if (attempt.ok) {
        return { deliveryMode: 'email' };
      }

      console.warn('Resend fell back to in-app preview:', attempt.errText);
      return {
        deliveryMode: 'preview',
        previewCode: code,
        deliveryReason:
          'Resend free testing mode only delivers directly to your own Resend account email without a verified domain,',
      };
    } catch (err) {
      console.warn('Could not reach Resend API, using in-app preview:', err);
      return {
        deliveryMode: 'preview',
        previewCode: code,
        deliveryReason: 'Could not reach the email provider,',
      };
    }
  }

  console.log(`[Clicket Email (${kind})] To: ${toEmail} | Code: ${code}`);
  return {
    deliveryMode: 'preview',
    previewCode: code,
    deliveryReason: 'No email API key (RESEND_API_KEY) is configured on the server,',
  };
}

async function createServer() {
  const app = express();
  let multiplayerApi: ReturnType<typeof attachMultiplayerServer> | null = null;
  app.use(express.json({ limit: '2mb' }));

  // Enable CORS for cross-origin frontend hosts (e.g. Vercel, GitHub Pages, custom domains)
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Sign Up: Username and Password only (no duplicate usernames allowed)
  app.post('/api/auth/signup', async (req, res) => {
    try {
      const { username, password } = req.body ?? {};

      const cleanUsername = String(username || '').trim();
      const rawPassword = String(password || '');

      if (cleanUsername.length < 2 || cleanUsername.length > 30) {
        res.status(400).json({ error: 'Username must be between 2 and 30 characters.' });
        return;
      }

      if (rawPassword.length < 6) {
        res.status(400).json({ error: 'Password must be at least 6 characters.' });
        return;
      }

      const db = await loadDb();
      const taken = findUserByUsername(db, cleanUsername);
      if (taken) {
        res.status(409).json({ error: 'That username is already taken! Please choose another one.' });
        return;
      }

      const lowerUser = cleanUsername.toLowerCase();
      const userKey = `user:${lowerUser}`;
      if (db.users[userKey] || db.users[lowerUser]) {
        res.status(409).json({ error: 'That username is already taken! Please choose another one.' });
        return;
      }

      const user: StoredUser = {
        id: crypto.randomUUID(),
        username: cleanUsername,
        email: '',
        passwordHash: hashPassword(rawPassword),
        verified: true,
        verificationCode: null,
        codeExpiresAt: null,
        tokens: 20,
        inventory: {},
        clickUpgradeLevel: 0,
        bestDailyClicks: 0,
        equippedBlookId: '',
        dailyStreak: 0,
        bestDailyStreak: 0,
        lastDailyStreakAt: null,
        achievements: [],
        createdAt: new Date().toISOString(),
      };
      user.achievements = resolveUserAchievements(user);

      db.users[userKey] = user;
      const sessionToken = crypto.randomBytes(32).toString('hex');
      db.sessions[sessionToken] = userKey;
      await saveDb(db);

      res.json({
        ok: true,
        sessionToken,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Signup error:', err);
      res.status(500).json({ error: 'Failed to create account.' });
    }
  });

  // Resend 6-digit verification code
  app.post('/api/auth/resend', async (req, res) => {
    try {
      const cleanEmail = String(req.body?.email || '').trim().toLowerCase();
      const db = await loadDb();
      const user = db.users[cleanEmail];

      if (!user) {
        res.status(404).json({ error: 'No pending account found for this email.' });
        return;
      }

      const code = generateSixDigitCode();
      user.verificationCode = code;
      user.codeExpiresAt = Date.now() + 10 * 60 * 1000;
      await saveDb(db);

      const delivery = await dispatchVerificationEmail(cleanEmail, user.username, code);
      res.json({
        ok: true,
        email: cleanEmail,
        deliveryMode: delivery.deliveryMode,
        previewCode: delivery.previewCode,
        deliveryReason: delivery.deliveryReason,
      });
    } catch (err) {
      console.error('Resend error:', err);
      res.status(500).json({ error: 'Failed to resend verification code.' });
    }
  });

  // Verify 6-digit code
  app.post('/api/auth/verify', async (req, res) => {
    try {
      const cleanEmail = String(req.body?.email || '').trim().toLowerCase();
      const cleanCode = String(req.body?.code || '').trim();

      const db = await loadDb();
      const user = db.users[cleanEmail];

      if (!user) {
        res.status(404).json({ error: 'Account not found.' });
        return;
      }

      if (!user.verificationCode || !user.codeExpiresAt) {
        res.status(400).json({ error: 'No active verification code. Please resend a new code.' });
        return;
      }

      if (Date.now() > user.codeExpiresAt) {
        res.status(400).json({ error: 'Verification code expired. Please click Resend Code.' });
        return;
      }

      if (user.verificationCode !== cleanCode) {
        res.status(400).json({ error: 'Invalid 6-digit verification code.' });
        return;
      }

      user.verified = true;
      user.verificationCode = null;
      user.codeExpiresAt = null;

      const sessionToken = crypto.randomBytes(32).toString('hex');
      db.sessions[sessionToken] = cleanEmail;
      await saveDb(db);

      res.json({
        ok: true,
        sessionToken,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Verify error:', err);
      res.status(500).json({ error: 'Verification failed.' });
    }
  });

  // Log In with Username & Password
  app.post('/api/auth/login', async (req, res) => {
    try {
      const identifier = String(req.body?.username || req.body?.email || '').trim();
      const rawPassword = String(req.body?.password || '');

      if (!identifier || !rawPassword) {
        res.status(400).json({ error: 'Please enter both username and password.' });
        return;
      }

      const db = await loadDb();
      const found = findUserEntry(db, identifier);

      if (!found || !verifyPassword(rawPassword, found.user.passwordHash)) {
        res.status(401).json({ error: 'Invalid username or password.' });
        return;
      }

      found.user.verified = true;
      found.user.verificationCode = null;
      found.user.codeExpiresAt = null;
      found.user.achievements = resolveUserAchievements(found.user);

      const sessionToken = crypto.randomBytes(32).toString('hex');
      db.sessions[sessionToken] = found.key;
      await saveDb(db);

      res.json({
        ok: true,
        sessionToken,
        user: sanitizeUser(found.user),
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Login failed.' });
    }
  });

  // Log in / Sign up with Google (verifies Firebase ID token via Google Identity Toolkit)
  app.post('/api/auth/google', async (req, res) => {
    try {
      const idToken = String(req.body?.idToken || '').trim();
      if (!idToken) {
        res.status(400).json({ error: 'Missing Google sign-in token.' });
        return;
      }

      let firebaseApiKey = '';
      try {
        const cfgRaw = await fs.readFile(
          path.resolve(process.cwd(), 'firebase-applet-config.json'),
          'utf-8'
        );
        const cfg = JSON.parse(cfgRaw) as { apiKey?: string };
        firebaseApiKey = String(cfg.apiKey || '').trim();
      } catch {
        firebaseApiKey = '';
      }

      if (!firebaseApiKey) {
        res.status(500).json({ error: 'Firebase configuration missing on server.' });
        return;
      }

      const verifyRes = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(firebaseApiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken }),
        }
      );

      if (!verifyRes.ok) {
        res.status(401).json({ error: 'Google sign-in could not be verified.' });
        return;
      }

      const verifyData = (await verifyRes.json()) as {
        users?: Array<{ localId?: string; email?: string; displayName?: string }>;
      };
      const gUser = verifyData.users?.[0];
      const cleanEmail = String(gUser?.email || '').trim().toLowerCase();
      if (!cleanEmail) {
        res.status(400).json({ error: 'Google account did not provide an email address.' });
        return;
      }

      const db = await loadDb();
      let user = db.users[cleanEmail];
      if (!user) {
        const rawName = (gUser?.displayName || cleanEmail.split('@')[0] || 'Player').trim();
        const cleanName = rawName.slice(0, 18) || 'Player';
        user = {
          id: crypto.randomUUID(),
          username: cleanName,
          email: cleanEmail,
          passwordHash: hashPassword(crypto.randomBytes(24).toString('hex')),
          verified: true,
          verificationCode: null,
          codeExpiresAt: null,
          tokens: 20,
          inventory: {},
          clickUpgradeLevel: 0,
          bestDailyClicks: 0,
          equippedBlookId: 'tightrope-walker',
          createdAt: new Date().toISOString(),
        };
        db.users[cleanEmail] = user;
      } else {
        user.verified = true;
        user.verificationCode = null;
        user.codeExpiresAt = null;
      }

      const sessionToken = crypto.randomBytes(32).toString('hex');
      db.sessions[sessionToken] = cleanEmail;
      await saveDb(db);

      res.json({
        ok: true,
        sessionToken,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Google auth error:', err);
      res.status(500).json({ error: 'Google sign-in failed.' });
    }
  });

  // Check current session
  app.get('/api/auth/me', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const db = await loadDb();
      const email = db.sessions[token];
      const user = email ? db.users[email] : undefined;

      if (!user || !user.verified) {
        res.status(401).json({ error: 'Invalid session' });
        return;
      }

      res.json({ user: sanitizeUser(user) });
    } catch (err) {
      console.error('Auth me error:', err);
      res.status(500).json({ error: 'Failed to load user' });
    }
  });

  // Log out
  app.post('/api/auth/logout', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      if (token) {
        const db = await loadDb();
        delete db.sessions[token];
        await saveDb(db);
      }
      res.json({ ok: true });
    } catch {
      res.json({ ok: true });
    }
  });

  // Rename Username (strictly unique across all accounts)
  app.post('/api/user/rename', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const db = await loadDb();
      const sessionKey = db.sessions[token];
      const user = sessionKey ? db.users[sessionKey] : undefined;
      if (!user) {
        res.status(401).json({ error: 'Session not found' });
        return;
      }

      const cleanUsername = String(req.body?.username || '').trim();
      if (cleanUsername.length < 2 || cleanUsername.length > 30) {
        res.status(400).json({ error: 'Username must be between 2 and 30 characters.' });
        return;
      }

      const conflict = findUserByUsername(db, cleanUsername);
      if (conflict && conflict.id !== user.id) {
        res.status(409).json({ error: 'That username is already taken! Try a different one.' });
        return;
      }

      user.username = cleanUsername;
      await saveDb(db);
      res.json({ ok: true, user: sanitizeUser(user) });
    } catch (err) {
      console.error('Rename error:', err);
      res.status(500).json({ error: 'Failed to update username.' });
    }
  });

  // Sync user game progress
  app.post('/api/user/sync', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const db = await loadDb();
      const email = db.sessions[token];
      const user = email ? db.users[email] : undefined;
      if (!user || !user.verified) {
        res.status(401).json({ error: 'Session not found' });
        return;
      }

      const {
        username,
        tokens,
        inventory,
        clickUpgradeLevel,
        bestDailyClicks,
        equippedBlookId,
        lastDailyPlayAt,
        lastWheelSpinAt,
      } = req.body ?? {};

      const prevEquipped =
        user.equippedBlookId && (user.inventory?.[user.equippedBlookId] || 0) > 0
          ? user.equippedBlookId
          : '';
      const prevUsername = user.username;
      if (typeof username === 'string' && username.trim().length >= 2 && username.trim().length <= 30) {
        const conflict = findUserByUsername(db, username.trim());
        if (!conflict || conflict.id === user.id) {
          user.username = username.trim();
        }
      }
      if (typeof tokens === 'number' && Number.isFinite(tokens) && tokens >= 0) {
        user.tokens = Math.floor(tokens);
      }
      if (inventory && typeof inventory === 'object') {
        user.inventory = inventory as Record<string, number>;
      }
      if (typeof clickUpgradeLevel === 'number' && Number.isFinite(clickUpgradeLevel) && clickUpgradeLevel >= 0) {
        user.clickUpgradeLevel = Math.floor(clickUpgradeLevel);
      }
      if (typeof bestDailyClicks === 'number' && Number.isFinite(bestDailyClicks) && bestDailyClicks >= 0) {
        user.bestDailyClicks = Math.max(user.bestDailyClicks, Math.floor(bestDailyClicks));
      }
      if (typeof equippedBlookId === 'string') {
        const cleanId = equippedBlookId.trim();
        user.equippedBlookId =
          cleanId && (user.inventory?.[cleanId] || 0) > 0 ? cleanId : '';
      } else if (user.equippedBlookId && (user.inventory?.[user.equippedBlookId] || 0) <= 0) {
        user.equippedBlookId = '';
      }
      if (typeof lastDailyPlayAt === 'number' && Number.isFinite(lastDailyPlayAt) && lastDailyPlayAt > 0) {
        user.lastDailyPlayAt = Math.max(user.lastDailyPlayAt ?? 0, lastDailyPlayAt);
      }
      if (typeof lastWheelSpinAt === 'number' && Number.isFinite(lastWheelSpinAt) && lastWheelSpinAt > 0) {
        user.lastWheelSpinAt = Math.max(user.lastWheelSpinAt ?? 0, lastWheelSpinAt);
      }

      const nextEquipped = user.equippedBlookId || '';
      updateStoredChatAvatars(db, user.id, user.username, nextEquipped);
      if (prevUsername !== user.username && Array.isArray(db.chatMessages)) {
        for (const m of db.chatMessages) {
          if (m.userId === user.id) {
            m.username = user.username;
          }
        }
      }

      user.achievements = resolveUserAchievements(user);
      await saveDb(db);
      if (prevEquipped !== nextEquipped) {
        multiplayerApi?.broadcastChatAvatarUpdated({
          userId: user.id,
          username: user.username,
          avatarBlookId: nextEquipped,
        });
      }
      res.json({ ok: true, user: sanitizeUser(user) });
    } catch (err) {
      console.error('Sync error:', err);
      res.status(500).json({ error: 'Failed to sync progress' });
    }
  });

  // Forgot Password: send 6-digit reset code
  app.post('/api/auth/forgot-password', async (req, res) => {
    try {
      const cleanEmail = String(req.body?.email || '').trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
        res.status(400).json({ error: 'Please enter a valid email address.' });
        return;
      }

      const db = await loadDb();
      const user = db.users[cleanEmail];
      if (!user) {
        res.status(404).json({ error: 'No Clicket account found for that email.' });
        return;
      }

      const code = generateSixDigitCode();
      user.resetCode = code;
      user.resetCodeExpiresAt = Date.now() + 10 * 60 * 1000;
      await saveDb(db);

      const delivery = await dispatchVerificationEmail(cleanEmail, user.username, code, 'reset');
      res.json({
        ok: true,
        email: cleanEmail,
        deliveryMode: delivery.deliveryMode,
        previewCode: delivery.previewCode,
        deliveryReason: delivery.deliveryReason,
      });
    } catch (err) {
      console.error('Forgot password error:', err);
      res.status(500).json({ error: 'Failed to send password reset email.' });
    }
  });

  // Reset Password with 6-digit code
  app.post('/api/auth/reset-password', async (req, res) => {
    try {
      const cleanEmail = String(req.body?.email || '').trim().toLowerCase();
      const cleanCode = String(req.body?.code || '').trim();
      const newPassword = String(req.body?.newPassword || '');
      const retypePassword = String(req.body?.retypePassword || '');

      if (newPassword.length < 6) {
        res.status(400).json({ error: 'New password must be at least 6 characters.' });
        return;
      }
      if (newPassword !== retypePassword) {
        res.status(400).json({ error: 'Passwords do not match.' });
        return;
      }

      const db = await loadDb();
      const user = db.users[cleanEmail];
      if (!user) {
        res.status(404).json({ error: 'Account not found.' });
        return;
      }

      if (!user.resetCode || !user.resetCodeExpiresAt) {
        res.status(400).json({ error: 'No active reset code. Request a new code first.' });
        return;
      }
      if (Date.now() > user.resetCodeExpiresAt) {
        res.status(400).json({ error: 'Reset code expired. Please request a new code.' });
        return;
      }
      if (user.resetCode !== cleanCode) {
        res.status(400).json({ error: 'Invalid 6-digit reset code.' });
        return;
      }

      user.passwordHash = hashPassword(newPassword);
      user.verified = true;
      user.resetCode = null;
      user.resetCodeExpiresAt = null;

      const sessionToken = crypto.randomBytes(32).toString('hex');
      db.sessions[sessionToken] = cleanEmail;
      await saveDb(db);

      res.json({
        ok: true,
        sessionToken,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Reset password error:', err);
      res.status(500).json({ error: 'Failed to reset password.' });
    }
  });

  // Discover real unique player counts per trivia set
  const recordSetPlay = async (setId: string, userId?: string) => {
    const db = await loadDb();
    if (!db.setStats) db.setStats = {};
    const entry = db.setStats[setId] || { totalPlays: 0, uniquePlayerIds: [] };
    entry.totalPlays += 1;
    if (userId && !entry.uniquePlayerIds.includes(userId)) {
      entry.uniquePlayerIds.push(userId);
    }
    db.setStats[setId] = entry;
    await saveDb(db);
  };

  const awardUserTokens = async (userId: string, amount: number) => {
    if (!userId || amount <= 0) return;
    const db = await loadDb();
    const user = Object.values(db.users).find((u) => u.id === userId);
    if (!user) return;
    user.tokens += Math.floor(amount);
    await saveDb(db);
  };

  app.get('/api/sets/stats', async (_req, res) => {
    try {
      const db = await loadDb();
      const raw = db.setStats || {};
      const stats: Record<string, { uniquePlayers: number; totalPlays: number }> = {};
      for (const [id, s] of Object.entries(raw)) {
        stats[id] = {
          uniquePlayers: s.uniquePlayerIds.length,
          totalPlays: s.totalPlays,
        };
      }
      res.json({ stats });
    } catch {
      res.json({ stats: {} });
    }
  });

  app.post('/api/sets/:setId/play', async (req, res) => {
    try {
      const setId = String(req.params.setId || '').trim();
      if (!setId) {
        res.status(400).json({ error: 'Missing setId' });
        return;
      }

      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      const db = await loadDb();
      const email = token ? db.sessions[token] : undefined;
      const user = email ? db.users[email] : undefined;

      await recordSetPlay(setId, user?.id);
      const entry = db.setStats?.[setId] || { totalPlays: 0, uniquePlayerIds: [] };
      res.json({
        ok: true,
        uniquePlayers: entry.uniquePlayerIds.length,
        totalPlays: entry.totalPlays,
      });
    } catch {
      res.status(500).json({ error: 'Failed to record set play' });
    }
  });

  app.get('/api/trades/history', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || '';
      const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
      if (!token) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const db = await loadDb();
      const sessionKey = db.sessions[token];
      const user = sessionKey ? db.users[sessionKey] : undefined;
      if (!user) {
        res.status(401).json({ error: 'Session not found' });
        return;
      }

      res.json({ history: (user.tradeHistory || []).slice(0, 50) });
    } catch {
      res.status(500).json({ error: 'Failed to load trading history' });
    }
  });

  // Global Trade Listings: Browse, Create, Fulfill, Cancel
  app.get('/api/trades/global', async (_req, res) => {
    try {
      const db = await loadDb();
      const openTrades = (db.globalTrades || []).filter(
        (t) => t.status === 'OPEN' && !isBotGlobalTrade(t)
      );
      res.json({ trades: openTrades.slice(-80).reverse() });
    } catch (err) {
      console.error('List global trades error:', err);
      res.status(500).json({ error: 'Failed to load global trades' });
    }
  });

  app.post('/api/trades/global/create', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const offeredBlookId = String(req.body?.offeredBlookId || '').trim();
      const requestedBlookId = req.body?.requestedBlookId
        ? String(req.body.requestedBlookId).trim()
        : null;
      const requestedRarity = req.body?.requestedRarity
        ? String(req.body.requestedRarity).trim()
        : null;
      const note = String(req.body?.note || '').trim().slice(0, 80);

      if (!offeredBlookId) {
        res.status(400).json({ error: 'Please choose a Blook to offer.' });
        return;
      }
      if ((user.inventory?.[offeredBlookId] || 0) < 1) {
        res.status(400).json({ error: 'You do not own that Blook.' });
        return;
      }
      if (!requestedBlookId && !requestedRarity) {
        res.status(400).json({ error: 'Please specify what Blook or rarity you want in return.' });
        return;
      }

      // Deduct offered Blook into trade escrow
      user.inventory[offeredBlookId] -= 1;
      if (user.inventory[offeredBlookId] <= 0) delete user.inventory[offeredBlookId];
      if (user.equippedBlookId === offeredBlookId && !user.inventory[offeredBlookId]) {
        user.equippedBlookId = '';
      }

      const achievements = resolveUserAchievements(user);
      const isOwner =
        achievements.includes('owner') ||
        OWNER_IDENTIFIERS.has((user.username || '').trim().toLowerCase());
      const safeEquipped =
        user.equippedBlookId && (user.inventory?.[user.equippedBlookId] || 0) > 0
          ? user.equippedBlookId
          : '';

      const tradeListing: GlobalTradeListing = {
        id: `gt-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
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
      await saveDb(db);
      multiplayerApi?.broadcastGlobalTradesUpdated();

      res.json({ ok: true, trade: tradeListing, user: sanitizeUser(user) });
    } catch (err) {
      console.error('Create global trade error:', err);
      res.status(500).json({ error: 'Failed to create global trade' });
    }
  });

  app.post('/api/trades/global/:tradeId/fulfill', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const tradeId = String(req.params.tradeId || '').trim();
      if (!Array.isArray(db.globalTrades)) db.globalTrades = [];
      const trade = db.globalTrades.find((t) => t.id === tradeId);

      if (!trade || trade.status !== 'OPEN') {
        res.status(404).json({ error: 'This trade offer is no longer available.' });
        return;
      }
      if (trade.creatorId === user.id) {
        res.status(400).json({ error: 'You cannot fulfill your own trade offer.' });
        return;
      }

      const givenBlookId = String(req.body?.givenBlookId || trade.requestedBlookId || '').trim();
      if (!givenBlookId) {
        res.status(400).json({ error: 'Please choose which Blook you are giving.' });
        return;
      }
      if ((user.inventory?.[givenBlookId] || 0) < 1) {
        res.status(400).json({ error: 'You do not own that Blook.' });
        return;
      }

      // If trade requested a specific blook, ensure it matches
      if (trade.requestedBlookId && trade.requestedBlookId !== givenBlookId) {
        res.status(400).json({ error: 'That does not match the requested Blook.' });
        return;
      }

      // If trade requested a rarity, ensure given blook matches rarity
      if (trade.requestedRarity) {
        const blookObj = ALL_BLOOKS.find((b) => b.id === givenBlookId);
        if (!blookObj || blookObj.rarity !== trade.requestedRarity) {
          res.status(400).json({ error: `That Blook is not a ${trade.requestedRarity}.` });
          return;
        }
      }

      // Deduct given Blook from fulfiller and give offered Blook
      user.inventory[givenBlookId] -= 1;
      if (user.inventory[givenBlookId] <= 0) delete user.inventory[givenBlookId];
      user.inventory[trade.offeredBlookId] = (user.inventory[trade.offeredBlookId] || 0) + 1;
      if (user.equippedBlookId === givenBlookId && !user.inventory[givenBlookId]) {
        user.equippedBlookId = '';
      }

      // Give given Blook to creator (if found in db)
      const creator = Object.values(db.users).find((u) => u.id === trade.creatorId);
      const nowIso = new Date().toISOString();
      const tradeRef = `gt-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;

      const historyEntryFulfiller: TradeHistoryEntry = {
        id: `${tradeRef}-f`,
        timestamp: nowIso,
        partnerUsername: trade.creatorUsername,
        gaveBlookId: givenBlookId,
        receivedBlookId: trade.offeredBlookId,
      };

      user.tradeHistory = [historyEntryFulfiller, ...(user.tradeHistory || [])].slice(0, 50);
      user.achievements = resolveUserAchievements(user);

      if (creator) {
        if (!creator.inventory) creator.inventory = {};
        creator.inventory[givenBlookId] = (creator.inventory[givenBlookId] || 0) + 1;
        const historyEntryCreator: TradeHistoryEntry = {
          id: `${tradeRef}-c`,
          timestamp: nowIso,
          partnerUsername: user.username,
          gaveBlookId: trade.offeredBlookId,
          receivedBlookId: givenBlookId,
        };
        creator.tradeHistory = [historyEntryCreator, ...(creator.tradeHistory || [])].slice(0, 50);
        creator.achievements = resolveUserAchievements(creator);
      }

      trade.status = 'FULFILLED';
      trade.fulfilledByUsername = user.username;
      trade.fulfilledAt = nowIso;

      await saveDb(db);
      multiplayerApi?.broadcastGlobalTradesUpdated();

      res.json({
        ok: true,
        trade,
        user: sanitizeUser(user),
        receivedBlookId: trade.offeredBlookId,
        gaveBlookId: givenBlookId,
        partnerUsername: trade.creatorUsername,
      });
    } catch (err) {
      console.error('Fulfill global trade error:', err);
      res.status(500).json({ error: 'Failed to fulfill global trade' });
    }
  });

  app.post('/api/trades/global/:tradeId/cancel', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const tradeId = String(req.params.tradeId || '').trim();
      if (!Array.isArray(db.globalTrades)) db.globalTrades = [];
      const trade = db.globalTrades.find((t) => t.id === tradeId);

      if (!trade || trade.status !== 'OPEN') {
        res.status(404).json({ error: 'Trade not found or already closed.' });
        return;
      }
      if (trade.creatorId !== user.id) {
        res.status(403).json({ error: 'You can only cancel your own trade listings.' });
        return;
      }

      // Return offered Blook to user
      user.inventory[trade.offeredBlookId] = (user.inventory[trade.offeredBlookId] || 0) + 1;
      trade.status = 'CANCELLED';

      await saveDb(db);
      multiplayerApi?.broadcastGlobalTradesUpdated();

      res.json({ ok: true, user: sanitizeUser(user) });
    } catch (err) {
      console.error('Cancel global trade error:', err);
      res.status(500).json({ error: 'Failed to cancel trade' });
    }
  });

  const getAuthenticatedUser = async (req: express.Request) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
    if (!token) return null;
    const db = await loadDb();
    const sessionKey = db.sessions[token];
    const user = sessionKey ? db.users[sessionKey] : undefined;
    if (!user || !user.verified) return null;
    return { db, user };
  };

  const buildClanSummary = (clan: ClanRecord, db: DatabaseSchema) => {
    const usersById = new Map<string, StoredUser>();
    for (const u of Object.values(db.users)) {
      usersById.set(u.id, u);
    }

    const members = clan.memberIds
      .map((memberId) => {
        const u = usersById.get(memberId);
        if (!u) return null;
        const uniqueBlooksCount = Object.values(u.inventory || {}).filter((c) => c > 0).length;
        const role: 'Leader' | 'Officer' | 'Member' =
          clan.leaderId === u.id
            ? 'Leader'
            : clan.officerIds.includes(u.id)
            ? 'Officer'
            : 'Member';
        const safeEquipped =
          u.equippedBlookId && (u.inventory?.[u.equippedBlookId] || 0) > 0
            ? u.equippedBlookId
            : '';
        return {
          id: u.id,
          username: u.username,
          equippedBlookId: safeEquipped,
          tokens: u.tokens || 0,
          uniqueBlooksCount,
          achievements: resolveUserAchievements(u),
          role,
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .sort((a, b) => {
        const roleRank = { Leader: 0, Officer: 1, Member: 2 };
        if (roleRank[a.role] !== roleRank[b.role]) return roleRank[a.role] - roleRank[b.role];
        return b.tokens - a.tokens;
      });

    const totalTokens = members.reduce((sum, m) => sum + m.tokens, 0);
    const totalUniqueBlooks = members.reduce((sum, m) => sum + m.uniqueBlooksCount, 0);
    const powerScore = totalTokens + totalUniqueBlooks * 50;
    const leaderUser = usersById.get(clan.leaderId);

    return {
      id: clan.id,
      name: clan.name,
      tag: clan.tag,
      description: clan.description,
      bannerColor: clan.bannerColor,
      emblemBlookId: clan.emblemBlookId,
      leaderId: clan.leaderId,
      leaderUsername: leaderUser?.username || 'Leader',
      memberCount: members.length,
      totalTokens,
      totalUniqueBlooks,
      powerScore,
      members,
      messages: (clan.messages || []).slice(-40),
      createdAt: clan.createdAt,
    };
  };

  // Global Net Worth Leaderboard (Tokens + Total Worth of all owned Blooks)
  app.get('/api/leaderboard', async (_req, res) => {
    try {
      const db = await loadDb();
      const mapped = Object.values(db.users)
        .map((u) => {
          const worth = calculateInventoryWorth(u.inventory);
          const tokens = Math.max(0, Math.floor(Number(u.tokens) || 0));
          const totalWorth = tokens + worth.blooksWorth;
          const achievements = resolveUserAchievements(u);
          const isOwner =
            achievements.includes('owner') ||
            OWNER_IDENTIFIERS.has((u.username || '').trim().toLowerCase());
          const safeEquipped =
            u.equippedBlookId && (u.inventory?.[u.equippedBlookId] || 0) > 0
              ? u.equippedBlookId
              : '';
          const userClan = u.clanId && db.clans?.[u.clanId] ? db.clans[u.clanId] : null;
          return {
            id: u.id,
            username: u.username,
            tokens,
            blooksWorth: worth.blooksWorth,
            totalWorth,
            uniqueBlooksCount: worth.uniqueBlooksCount,
            totalBlooksCount: worth.totalBlooksCount,
            mostValuableBlookId: worth.mostValuableBlookId,
            equippedBlookId: safeEquipped,
            achievements,
            isOwner,
            ...(userClan?.tag ? { clanTag: userClan.tag } : {}),
            ...(userClan?.bannerColor ? { clanColor: userClan.bannerColor } : {}),
          };
        })
        .sort(
          (a, b) =>
            b.totalWorth - a.totalWorth ||
            b.blooksWorth - a.blooksWorth ||
            b.tokens - a.tokens
        );

      const seenNames = new Set<string>();
      const leaderboard = mapped
        .filter((entry) => {
          const nameKey = (entry.username || '').trim().toLowerCase();
          if (!nameKey || seenNames.has(nameKey)) return false;
          seenNames.add(nameKey);
          return true;
        })
        .slice(0, 100);
      res.json({ leaderboard });
    } catch (err) {
      console.error('Leaderboard error:', err);
      res.status(500).json({ error: 'Failed to load leaderboard' });
    }
  });

  // List all clans (sorted by powerScore descending)
  app.get('/api/clans', async (_req, res) => {
    try {
      const db = await loadDb();
      const clans = Object.values(db.clans || {})
        .map((c) => buildClanSummary(c, db))
        .sort((a, b) => b.powerScore - a.powerScore);
      res.json({ clans });
    } catch (err) {
      console.error('List clans error:', err);
      res.status(500).json({ error: 'Failed to load clans' });
    }
  });

  // Create a new clan
  app.post('/api/clans/create', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      if (!db.clans) db.clans = {};

      if (user.clanId && db.clans[user.clanId]) {
        res.status(400).json({ error: 'Leave your current clan before creating a new one.' });
        return;
      }

      const name = String(req.body?.name || '').trim();
      const rawTag = String(req.body?.tag || '')
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '');
      const description = String(req.body?.description || '').trim().slice(0, 140);
      const bannerColor = /^#[0-9a-fA-F]{6}$/.test(String(req.body?.bannerColor || ''))
        ? String(req.body.bannerColor)
        : '#dc2626';
      const emblemBlookId = String(req.body?.emblemBlookId || 'jester').trim() || 'jester';

      if (name.length < 2 || name.length > 24) {
        res.status(400).json({ error: 'Clan name must be between 2 and 24 characters.' });
        return;
      }
      if (rawTag.length < 2 || rawTag.length > 5) {
        res.status(400).json({ error: 'Clan tag must be 2 to 5 letters/numbers.' });
        return;
      }

      const duplicateName = Object.values(db.clans).find(
        (c) => c.name.toLowerCase() === name.toLowerCase()
      );
      if (duplicateName) {
        res.status(409).json({ error: 'A clan with that name already exists.' });
        return;
      }

      const duplicateTag = Object.values(db.clans).find((c) => c.tag === rawTag);
      if (duplicateTag) {
        res.status(409).json({ error: 'That clan tag is already taken.' });
        return;
      }

      const clanId = `clan-${crypto.randomUUID().slice(0, 8)}`;
      const clan: ClanRecord = {
        id: clanId,
        name,
        tag: rawTag,
        description: description || `Welcome to [${rawTag}] ${name}!`,
        bannerColor,
        emblemBlookId,
        leaderId: user.id,
        memberIds: [user.id],
        officerIds: [],
        messages: [
          {
            id: `cmsg-${Date.now()}`,
            userId: user.id,
            username: user.username,
            text: `Founded [${rawTag}] ${name}!`,
            createdAt: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
      };

      db.clans[clanId] = clan;
      user.clanId = clanId;
      await saveDb(db);

      res.json({
        ok: true,
        clan: buildClanSummary(clan, db),
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Create clan error:', err);
      res.status(500).json({ error: 'Failed to create clan.' });
    }
  });

  // Join an existing clan
  app.post('/api/clans/:clanId/join', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      if (!db.clans) db.clans = {};

      const clanId = String(req.params.clanId || '').trim();
      const clan = db.clans[clanId];
      if (!clan) {
        res.status(404).json({ error: 'Clan not found.' });
        return;
      }

      if (user.clanId && db.clans[user.clanId] && user.clanId !== clanId) {
        res.status(400).json({ error: 'Leave your current clan before joining another.' });
        return;
      }

      if (!clan.memberIds.includes(user.id)) {
        if (clan.memberIds.length >= 30) {
          res.status(400).json({ error: 'This clan is full (30/30 members).' });
          return;
        }
        clan.memberIds.push(user.id);
        clan.messages = [
          ...(clan.messages || []),
          {
            id: `cmsg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            userId: user.id,
            username: user.username,
            text: `joined the clan!`,
            createdAt: new Date().toISOString(),
          },
        ].slice(-40);
      }
      user.clanId = clanId;
      await saveDb(db);

      res.json({
        ok: true,
        clan: buildClanSummary(clan, db),
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Join clan error:', err);
      res.status(500).json({ error: 'Failed to join clan.' });
    }
  });

  // Leave current clan
  app.post('/api/clans/leave', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      if (!db.clans) db.clans = {};

      const clanId = user.clanId;
      if (clanId && db.clans[clanId]) {
        const clan = db.clans[clanId];
        clan.memberIds = clan.memberIds.filter((id) => id !== user.id);
        clan.officerIds = clan.officerIds.filter((id) => id !== user.id);
        if (clan.memberIds.length === 0) {
          delete db.clans[clanId];
        } else if (clan.leaderId === user.id) {
          clan.leaderId = clan.officerIds[0] || clan.memberIds[0];
          clan.officerIds = clan.officerIds.filter((id) => id !== clan.leaderId);
        }
      }

      user.clanId = null;
      await saveDb(db);
      res.json({ ok: true, user: sanitizeUser(user) });
    } catch (err) {
      console.error('Leave clan error:', err);
      res.status(500).json({ error: 'Failed to leave clan.' });
    }
  });

  // Post a message to clan chat / noticeboard
  app.post('/api/clans/:clanId/message', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const clanId = String(req.params.clanId || '').trim();
      const clan = db.clans?.[clanId];
      if (!clan || !clan.memberIds.includes(user.id)) {
        res.status(403).json({ error: 'You must be a member of this clan to post.' });
        return;
      }

      const text = String(req.body?.text || '').trim().slice(0, 200);
      if (!text) {
        res.status(400).json({ error: 'Message cannot be empty.' });
        return;
      }

      clan.messages = [
        ...(clan.messages || []),
        {
          id: `cmsg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          userId: user.id,
          username: user.username,
          text,
          createdAt: new Date().toISOString(),
        },
      ].slice(-40);

      await saveDb(db);
      res.json({ ok: true, clan: buildClanSummary(clan, db) });
    } catch (err) {
      console.error('Clan message error:', err);
      res.status(500).json({ error: 'Failed to post message.' });
    }
  });

  // Kick a member (Leader only)
  app.post('/api/clans/:clanId/kick', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const clanId = String(req.params.clanId || '').trim();
      const targetUserId = String(req.body?.targetUserId || '').trim();
      const clan = db.clans?.[clanId];
      if (!clan || clan.leaderId !== user.id) {
        res.status(403).json({ error: 'Only the clan leader can kick members.' });
        return;
      }
      if (!targetUserId || targetUserId === user.id) {
        res.status(400).json({ error: 'Invalid target member.' });
        return;
      }

      clan.memberIds = clan.memberIds.filter((id) => id !== targetUserId);
      clan.officerIds = clan.officerIds.filter((id) => id !== targetUserId);
      const targetUser = Object.values(db.users).find((u) => u.id === targetUserId);
      if (targetUser && targetUser.clanId === clanId) {
        targetUser.clanId = null;
      }

      await saveDb(db);
      res.json({ ok: true, clan: buildClanSummary(clan, db) });
    } catch (err) {
      console.error('Kick member error:', err);
      res.status(500).json({ error: 'Failed to kick member.' });
    }
  });

  // Promote/demote officer (Leader only)
  app.post('/api/clans/:clanId/role', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const clanId = String(req.params.clanId || '').trim();
      const targetUserId = String(req.body?.targetUserId || '').trim();
      const clan = db.clans?.[clanId];
      if (!clan || clan.leaderId !== user.id) {
        res.status(403).json({ error: 'Only the clan leader can manage roles.' });
        return;
      }
      if (!targetUserId || targetUserId === user.id || !clan.memberIds.includes(targetUserId)) {
        res.status(400).json({ error: 'Invalid clan member.' });
        return;
      }

      if (clan.officerIds.includes(targetUserId)) {
        clan.officerIds = clan.officerIds.filter((id) => id !== targetUserId);
      } else {
        clan.officerIds.push(targetUserId);
      }

      await saveDb(db);
      res.json({ ok: true, clan: buildClanSummary(clan, db) });
    } catch (err) {
      console.error('Role update error:', err);
      res.status(500).json({ error: 'Failed to update role.' });
    }
  });

  // Update clan description / color / emblem (Leader only)
  app.post('/api/clans/:clanId/update', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const clanId = String(req.params.clanId || '').trim();
      const clan = db.clans?.[clanId];
      if (!clan || clan.leaderId !== user.id) {
        res.status(403).json({ error: 'Only the clan leader can edit clan settings.' });
        return;
      }

      if (typeof req.body?.description === 'string') {
        clan.description = req.body.description.trim().slice(0, 140);
      }
      if (typeof req.body?.bannerColor === 'string' && /^#[0-9a-fA-F]{6}$/.test(req.body.bannerColor)) {
        clan.bannerColor = req.body.bannerColor;
      }
      if (typeof req.body?.emblemBlookId === 'string' && req.body.emblemBlookId.trim()) {
        clan.emblemBlookId = req.body.emblemBlookId.trim();
      }

      await saveDb(db);
      res.json({ ok: true, clan: buildClanSummary(clan, db) });
    } catch (err) {
      console.error('Update clan error:', err);
      res.status(500).json({ error: 'Failed to update clan.' });
    }
  });

  // Grant or revoke Owner / Developer achievements (Owner only)
  app.post('/api/achievements/grant', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const callerAchievements = resolveUserAchievements(user);
      if (!callerAchievements.includes('owner')) {
        res.status(403).json({ error: 'Only an Owner can grant Owner or Developer achievements.' });
        return;
      }

      const targetUsername = String(req.body?.username || '').trim();
      const achievementId = String(req.body?.achievementId || '').trim();
      const grant = req.body?.grant !== false;

      if (!VALID_ACHIEVEMENT_IDS.has(achievementId)) {
        res.status(400).json({ error: 'Invalid achievement ID.' });
        return;
      }

      const targetUser = findUserByUsername(db, targetUsername);
      if (!targetUser) {
        res.status(404).json({ error: `No player found with username "${targetUsername}".` });
        return;
      }

      const revoked = new Set<string>(
        Array.isArray(targetUser.revokedAchievements) ? targetUser.revokedAchievements : []
      );
      const current = new Set(resolveUserAchievements(targetUser));
      if (grant) {
        revoked.delete(achievementId);
        current.add(achievementId);
      } else {
        revoked.add(achievementId);
        current.delete(achievementId);
      }
      targetUser.revokedAchievements = Array.from(revoked);
      targetUser.achievements = Array.from(current);
      await saveDb(db);

      res.json({
        ok: true,
        targetUsername: targetUser.username,
        targetAchievements: resolveUserAchievements(targetUser),
        selfUser: targetUser.id === user.id ? sanitizeUser(targetUser) : undefined,
      });
    } catch (err) {
      console.error('Achievement grant error:', err);
      res.status(500).json({ error: 'Failed to update achievement.' });
    }
  });

  // Hourly Reward: claim 300-900 tokens (divisible by 5) once every hour
  const ONE_HOUR_MS = 60 * 60 * 1000;
  app.post('/api/rewards/hourly', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const now = Date.now();
      const lastClaim = user.lastHourlyClaimAt ?? 0;
      const elapsed = now - lastClaim;

      if (lastClaim > 0 && elapsed < ONE_HOUR_MS) {
        const remainingMs = ONE_HOUR_MS - elapsed;
        res.status(429).json({
          error: 'Hourly Reward is still on cooldown.',
          remainingMs,
          lastHourlyClaimAt: lastClaim,
        });
        return;
      }

      // 300 to 900 inclusive, divisible by 5 (121 possible values: 300, 305, ..., 900)
      const reward = 300 + crypto.randomInt(0, 121) * 5;
      user.tokens = (user.tokens || 0) + reward;
      user.lastHourlyClaimAt = now;
      await saveDb(db);

      res.json({
        ok: true,
        reward,
        tokens: user.tokens,
        lastHourlyClaimAt: now,
      });
    } catch (err) {
      console.error('Hourly reward error:', err);
      res.status(500).json({ error: 'Failed to claim hourly reward.' });
    }
  });

  // Daily Streak Reward: claim once every 24h; keeps streak if claimed within 48h of previous claim
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const STREAK_GRACE_MS = 48 * 60 * 60 * 1000;
  const getDailyStreakReward = (streakDay: number): number => {
    const baseTiers = [150, 225, 300, 400, 500, 650];
    if (streakDay <= baseTiers.length) return baseTiers[Math.max(0, streakDay - 1)];
    return 800 + Math.min(streakDay - 7, 23) * 50;
  };

  app.post('/api/rewards/daily-streak', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const now = Date.now();
      const lastClaim = user.lastDailyStreakAt ?? 0;
      const elapsed = now - lastClaim;

      if (lastClaim > 0 && elapsed < ONE_DAY_MS) {
        const remainingMs = ONE_DAY_MS - elapsed;
        res.status(429).json({
          error: 'Daily Streak is still on cooldown.',
          remainingMs,
          lastDailyStreakAt: lastClaim,
          dailyStreak: user.dailyStreak ?? 0,
          bestDailyStreak: user.bestDailyStreak ?? 0,
        });
        return;
      }

      const prevStreak = Math.max(0, Math.floor(user.dailyStreak || 0));
      const keptStreak = lastClaim > 0 && elapsed < STREAK_GRACE_MS;
      const nextStreak = keptStreak ? prevStreak + 1 : 1;
      const reward = getDailyStreakReward(nextStreak);

      user.dailyStreak = nextStreak;
      user.bestDailyStreak = Math.max(user.bestDailyStreak || 0, nextStreak);
      user.lastDailyStreakAt = now;
      user.tokens = (user.tokens || 0) + reward;
      await saveDb(db);

      res.json({
        ok: true,
        reward,
        tokens: user.tokens,
        dailyStreak: user.dailyStreak,
        bestDailyStreak: user.bestDailyStreak,
        lastDailyStreakAt: now,
      });
    } catch (err) {
      console.error('Daily streak reward error:', err);
      res.status(500).json({ error: 'Failed to claim daily streak reward.' });
    }
  });

  // Owner-only helper
  const requireOwner = async (req: express.Request, res: express.Response) => {
    const auth = await getAuthenticatedUser(req);
    if (!auth) {
      res.status(401).json({ error: 'Not authenticated' });
      return null;
    }
    const callerAchievements = resolveUserAchievements(auth.user);
    if (!callerAchievements.includes('owner')) {
      res.status(403).json({ error: 'Owner access required.' });
      return null;
    }
    return auth;
  };

  // Promo Codes Area APIs
  const BUILTIN_CODE_MAP = new Map<string, PromoCodeDefinition>(
    BUILTIN_PROMO_CODES.map((c) => [c.code.toUpperCase(), c])
  );

  app.get('/api/codes', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const redeemedSet = new Set(
        (user.redeemedCodes || []).map((r) => String(r.code || '').toUpperCase())
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

      const isOwner = resolveUserAchievements(user).includes('owner');
      res.json({
        publicCodes,
        redeemedCodes: (user.redeemedCodes || []).slice(0, 100),
        ...(isOwner
          ? {
              customCodes: customCodes.sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              ),
            }
          : {}),
      });
    } catch (err) {
      console.error('Get codes error:', err);
      res.status(500).json({ error: 'Failed to load promo codes.' });
    }
  });

  app.post('/api/codes/redeem', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }
      const { db, user } = auth;
      const rawCode = String(req.body?.code || '').trim().toUpperCase();
      if (!rawCode || !/^[A-Z0-9_-]{3,24}$/.test(rawCode)) {
        res.status(400).json({
          error: 'Please enter a valid code (3–24 letters, numbers, dashes, or underscores).',
        });
        return;
      }

      const customPromo = db.promoCodes?.[rawCode];
      const builtInPromo = BUILTIN_CODE_MAP.get(rawCode);
      const promo: PromoCodeDefinition | undefined = customPromo || builtInPromo;

      if (!promo) {
        res.status(404).json({
          error: "That code doesn't exist. Double-check the spelling and try again.",
        });
        return;
      }

      if (!promo.active) {
        res.status(400).json({ error: 'This code has expired or is currently disabled.' });
        return;
      }

      if (!user.redeemedCodes) user.redeemedCodes = [];
      const alreadyRedeemed = user.redeemedCodes.some(
        (r) => String(r.code || '').toUpperCase() === rawCode
      );
      if (alreadyRedeemed) {
        res.status(409).json({ error: "You've already redeemed this code!" });
        return;
      }

      if (customPromo && customPromo.maxUses != null && customPromo.usesCount >= customPromo.maxUses) {
        res.status(400).json({ error: 'This code has reached its maximum number of redemptions.' });
        return;
      }

      const grantedTokens = Math.max(0, Math.floor(promo.tokens || 0));
      const grantedBlookId =
        promo.blookId && BLOOK_RARITY_BY_ID.has(promo.blookId) ? promo.blookId : undefined;
      const grantedBlookQty = grantedBlookId ? Math.max(1, Math.floor(promo.blookQty || 1)) : 0;

      user.tokens = (user.tokens || 0) + grantedTokens;
      if (grantedBlookId && grantedBlookQty > 0) {
        if (!user.inventory) user.inventory = {};
        user.inventory[grantedBlookId] = (user.inventory[grantedBlookId] || 0) + grantedBlookQty;
      }

      const redeemedEntry: RedeemedCodeRecord = {
        code: rawCode,
        title: promo.title,
        tokens: grantedTokens,
        ...(grantedBlookId ? { blookId: grantedBlookId, blookQty: grantedBlookQty } : {}),
        redeemedAt: new Date().toISOString(),
      };
      user.redeemedCodes = [redeemedEntry, ...user.redeemedCodes].slice(0, 100);
      user.achievements = resolveUserAchievements(user);

      if (customPromo) {
        customPromo.usesCount = (customPromo.usesCount || 0) + 1;
      }

      await saveDb(db);
      res.json({
        ok: true,
        reward: redeemedEntry,
        user: sanitizeUser(user),
      });
    } catch (err) {
      console.error('Redeem code error:', err);
      res.status(500).json({ error: 'Failed to redeem code.' });
    }
  });

  app.post('/api/codes/create', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db, user } = auth;

      const rawCode = String(req.body?.code || '').trim().toUpperCase();
      if (!/^[A-Z0-9_-]{3,24}$/.test(rawCode)) {
        res.status(400).json({
          error: 'Code must be 3–24 characters using letters, numbers, dashes, or underscores.',
        });
        return;
      }
      if (BUILTIN_CODE_MAP.has(rawCode) || db.promoCodes?.[rawCode]) {
        res.status(409).json({ error: `Code "${rawCode}" already exists.` });
        return;
      }

      const title = String(req.body?.title || '').trim().slice(0, 48) || rawCode;
      const description =
        String(req.body?.description || '').trim().slice(0, 120) || 'Custom CLICKET reward code.';
      const tokens = Math.max(0, Math.min(1000000, Math.floor(Number(req.body?.tokens ?? 0))));
      const rawBlookId = String(req.body?.blookId || '').trim();
      const blookId = rawBlookId && BLOOK_RARITY_BY_ID.has(rawBlookId) ? rawBlookId : undefined;
      const blookQty = blookId
        ? Math.max(1, Math.min(25, Math.floor(Number(req.body?.blookQty ?? 1))))
        : undefined;

      if (tokens <= 0 && !blookId) {
        res.status(400).json({ error: 'Code must grant at least 1 token or a Blook.' });
        return;
      }

      const rawMaxUses = req.body?.maxUses;
      const maxUses =
        rawMaxUses !== null && rawMaxUses !== undefined && rawMaxUses !== ''
          ? Math.max(1, Math.floor(Number(rawMaxUses)))
          : null;
      const isPublic = Boolean(req.body?.isPublic);

      if (!db.promoCodes) db.promoCodes = {};
      const record: CustomPromoCodeRecord = {
        code: rawCode,
        title,
        description,
        tokens,
        ...(blookId ? { blookId, blookQty } : {}),
        isPublic,
        maxUses,
        active: true,
        isBuiltIn: false,
        usesCount: 0,
        createdBy: user.username,
        createdAt: new Date().toISOString(),
      };
      db.promoCodes[rawCode] = record;
      await saveDb(db);
      res.json({ ok: true, promoCode: record });
    } catch (err) {
      console.error('Create code error:', err);
      res.status(500).json({ error: 'Failed to create promo code.' });
    }
  });

  app.post('/api/codes/toggle', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db } = auth;
      const rawCode = String(req.body?.code || '').trim().toUpperCase();
      const record = db.promoCodes?.[rawCode];
      if (!record) {
        res.status(404).json({ error: 'Custom code not found.' });
        return;
      }
      record.active = !record.active;
      await saveDb(db);
      res.json({ ok: true, promoCode: record });
    } catch (err) {
      console.error('Toggle code error:', err);
      res.status(500).json({ error: 'Failed to update code status.' });
    }
  });

  app.post('/api/codes/delete', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db } = auth;
      const rawCode = String(req.body?.code || '').trim().toUpperCase();
      if (!db.promoCodes?.[rawCode]) {
        res.status(404).json({ error: 'Custom code not found.' });
        return;
      }
      delete db.promoCodes[rawCode];
      await saveDb(db);
      res.json({ ok: true });
    } catch (err) {
      console.error('Delete code error:', err);
      res.status(500).json({ error: 'Failed to delete code.' });
    }
  });

  app.get('/api/admin/overview', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db } = auth;

      const allUsers = Object.values(db.users).map((u) => {
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
          achievements: resolveUserAchievements(u),
          clanId: u.clanId ?? null,
          bestDailyClicks: u.bestDailyClicks || 0,
          clickUpgradeLevel: u.clickUpgradeLevel || 0,
          createdAt: u.createdAt,
          inventory: inv,
        };
      });

      allUsers.sort((a, b) => {
        const aOwner = a.achievements.includes('owner') ? 1 : 0;
        const bOwner = b.achievements.includes('owner') ? 1 : 0;
        if (aOwner !== bOwner) return bOwner - aOwner;
        return b.tokens - a.tokens;
      });

      const clans = Object.values(db.clans || {}).map((c) => {
        const summary = buildClanSummary(c, db);
        return {
          id: summary.id,
          name: summary.name,
          tag: summary.tag,
          memberCount: summary.memberCount,
          powerScore: summary.powerScore,
          leaderUsername: summary.leaderUsername,
        };
      });

      const totalTokens = allUsers.reduce((sum, u) => sum + u.tokens, 0);
      res.json({
        stats: {
          totalUsers: allUsers.length,
          totalTokens,
          totalClans: clans.length,
          activeSessions: Object.keys(db.sessions || {}).length,
        },
        users: allUsers,
        clans,
      });
    } catch (err) {
      console.error('Admin overview error:', err);
      res.status(500).json({ error: 'Failed to load admin overview.' });
    }
  });

  app.post('/api/admin/user/tokens', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db, user } = auth;
      const targetUserId = String(req.body?.userId || '').trim();
      const mode = req.body?.mode === 'set' ? 'set' : 'add';
      const amount = Math.floor(Number(req.body?.amount ?? 0));
      if (!Number.isFinite(amount)) {
        res.status(400).json({ error: 'Invalid token amount.' });
        return;
      }
      const targetUser = Object.values(db.users).find((u) => u.id === targetUserId);
      if (!targetUser) {
        res.status(404).json({ error: 'Player not found.' });
        return;
      }
      if (mode === 'set') {
        targetUser.tokens = Math.max(0, amount);
      } else {
        targetUser.tokens = Math.max(0, (targetUser.tokens || 0) + amount);
      }
      await saveDb(db);
      res.json({
        ok: true,
        targetUser: sanitizeUser(targetUser),
        selfUser: targetUser.id === user.id ? sanitizeUser(targetUser) : undefined,
      });
    } catch (err) {
      console.error('Admin token update error:', err);
      res.status(500).json({ error: 'Failed to update tokens.' });
    }
  });

  app.post('/api/admin/user/blook', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db, user } = auth;
      const targetUserId = String(req.body?.userId || '').trim();
      const unlockAll = Boolean(req.body?.unlockAll);
      const blookId = String(req.body?.blookId || '').trim();
      const quantity = Math.floor(Number(req.body?.quantity ?? 1));

      const targetUser = Object.values(db.users).find((u) => u.id === targetUserId);
      if (!targetUser) {
        res.status(404).json({ error: 'Player not found.' });
        return;
      }
      if (!targetUser.inventory) targetUser.inventory = {};

      if (unlockAll && Array.isArray(req.body?.allBlookIds)) {
        for (const id of req.body.allBlookIds) {
          const clean = String(id || '').trim();
          if (clean) {
            targetUser.inventory[clean] = Math.max(1, targetUser.inventory[clean] || 0);
          }
        }
      } else if (blookId && Number.isFinite(quantity)) {
        const nextCount = (targetUser.inventory[blookId] || 0) + quantity;
        if (nextCount <= 0) {
          delete targetUser.inventory[blookId];
        } else {
          targetUser.inventory[blookId] = nextCount;
        }
        if (targetUser.equippedBlookId === blookId && !targetUser.inventory[blookId]) {
          targetUser.equippedBlookId = '';
          updateStoredChatAvatars(db, targetUser.id, targetUser.username, '');
          multiplayerApi?.broadcastChatAvatarUpdated({
            userId: targetUser.id,
            username: targetUser.username,
            avatarBlookId: '',
          });
        }
      } else {
        res.status(400).json({ error: 'Missing Blook details.' });
        return;
      }

      targetUser.achievements = resolveUserAchievements(targetUser);
      await saveDb(db);
      res.json({
        ok: true,
        targetUser: sanitizeUser(targetUser),
        selfUser: targetUser.id === user.id ? sanitizeUser(targetUser) : undefined,
      });
    } catch (err) {
      console.error('Admin blook update error:', err);
      res.status(500).json({ error: 'Failed to update Blook inventory.' });
    }
  });

  app.post('/api/admin/user/reset-cooldowns', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db, user } = auth;
      const targetUserId = String(req.body?.userId || '').trim();
      const targetUser = Object.values(db.users).find((u) => u.id === targetUserId);
      if (!targetUser) {
        res.status(404).json({ error: 'Player not found.' });
        return;
      }
      targetUser.lastDailyPlayAt = null;
      targetUser.lastWheelSpinAt = null;
      targetUser.lastHourlyClaimAt = null;
      targetUser.lastDailyStreakAt =
        targetUser.dailyStreak && targetUser.dailyStreak > 0
          ? Date.now() - 25 * 60 * 60 * 1000
          : null;
      await saveDb(db);
      res.json({
        ok: true,
        targetUsername: targetUser.username,
        selfUser: targetUser.id === user.id ? sanitizeUser(targetUser) : undefined,
      });
    } catch (err) {
      console.error('Admin reset cooldowns error:', err);
      res.status(500).json({ error: 'Failed to reset cooldowns.' });
    }
  });

  app.post('/api/admin/user/delete', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db, user } = auth;
      const targetUserId = String(req.body?.userId || '').trim();
      const entry = Object.entries(db.users).find(([, u]) => u.id === targetUserId);
      if (!entry) {
        res.status(404).json({ error: 'Player not found.' });
        return;
      }
      const [userKey, targetUser] = entry;
      if (
        targetUser.id === user.id ||
        OWNER_IDENTIFIERS.has(targetUser.username.trim().toLowerCase())
      ) {
        res.status(400).json({ error: 'Cannot delete the Owner account.' });
        return;
      }

      if (targetUser.clanId && db.clans?.[targetUser.clanId]) {
        const clan = db.clans[targetUser.clanId];
        clan.memberIds = clan.memberIds.filter((id) => id !== targetUser.id);
        clan.officerIds = clan.officerIds.filter((id) => id !== targetUser.id);
        if (clan.memberIds.length === 0) {
          delete db.clans[targetUser.clanId];
        } else if (clan.leaderId === targetUser.id) {
          clan.leaderId = clan.officerIds[0] || clan.memberIds[0];
        }
      }

      for (const [tok, key] of Object.entries(db.sessions)) {
        if (key === userKey) delete db.sessions[tok];
      }
      const deletedUsername = targetUser.username;
      delete db.users[userKey];
      await saveDb(db);
      res.json({ ok: true, deletedUsername });
    } catch (err) {
      console.error('Admin delete user error:', err);
      res.status(500).json({ error: 'Failed to delete player.' });
    }
  });

  app.post('/api/admin/clan/delete', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db } = auth;
      const clanId = String(req.body?.clanId || '').trim();
      const clan = db.clans?.[clanId];
      if (!db.clans || !clan) {
        res.status(404).json({ error: 'Clan not found.' });
        return;
      }
      for (const u of Object.values(db.users)) {
        if (u.clanId === clanId) {
          u.clanId = null;
        }
      }
      const deletedClanName = clan.name;
      delete db.clans[clanId];
      await saveDb(db);
      res.json({ ok: true, deletedClanName });
    } catch (err) {
      console.error('Admin delete clan error:', err);
      res.status(500).json({ error: 'Failed to disband clan.' });
    }
  });

  // Online Chat & Global Trades WebSocket broadcast routes follow

  app.get('/api/chat/messages', async (_req, res) => {
    try {
      const db = await loadDb();
      res.json({ messages: (db.chatMessages || []).slice(-100) });
    } catch (err) {
      console.error('Load chat messages error:', err);
      res.status(500).json({ error: 'Failed to load chat messages.' });
    }
  });

  app.post('/api/chat/messages', async (req, res) => {
    try {
      const auth = await getAuthenticatedUser(req);
      if (!auth) {
        res.status(401).json({ error: 'Sign in to send chat messages.' });
        return;
      }
      const { db, user } = auth;
      const cleanText = String(req.body?.text || '').trim().slice(0, 300);
      if (!cleanText) {
        res.status(400).json({ error: 'Message cannot be empty.' });
        return;
      }

      const achievements = resolveUserAchievements(user);
      const isOwner =
        achievements.includes('owner') ||
        OWNER_IDENTIFIERS.has((user.username || '').trim().toLowerCase());
      const safeEquipped =
        user.equippedBlookId && (user.inventory?.[user.equippedBlookId] || 0) > 0
          ? user.equippedBlookId
          : '';
      const userClan = user.clanId && db.clans?.[user.clanId] ? db.clans[user.clanId] : null;
      const replyToId = req.body?.replyToId ? String(req.body.replyToId).trim().slice(0, 128) : '';
      const replyToUsername = req.body?.replyToUsername
        ? String(req.body.replyToUsername).trim().slice(0, 32)
        : '';
      const replyToAvatar = req.body?.replyToAvatar
        ? String(req.body.replyToAvatar).trim().slice(0, 64)
        : '';
      const replyToText = req.body?.replyToText
        ? String(req.body.replyToText).trim().slice(0, 120)
        : '';

      const chatMessage: ChatMessageRecord = {
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
      db.chatMessages.push(chatMessage);
      if (db.chatMessages.length > 100) {
        db.chatMessages = db.chatMessages.slice(-100);
      }
      await saveDb(db);
      multiplayerApi?.broadcastChatMessage(chatMessage);

      res.json({ ok: true, message: chatMessage });
    } catch (err) {
      console.error('Send chat message error:', err);
      res.status(500).json({ error: 'Failed to send message.' });
    }
  });

  app.delete('/api/chat/messages/:messageId', async (req, res) => {
    try {
      const auth = await requireOwner(req, res);
      if (!auth) return;
      const { db } = auth;
      const messageId = String(req.params.messageId || '').trim();
      if (!messageId) {
        res.status(400).json({ error: 'Missing message ID.' });
        return;
      }
      if (!Array.isArray(db.chatMessages)) db.chatMessages = [];
      const before = db.chatMessages.length;
      db.chatMessages = db.chatMessages.filter((m) => m.id !== messageId);
      if (db.chatMessages.length !== before) {
        await saveDb(db);
        multiplayerApi?.broadcastChatDeleted(messageId);
      }
      res.json({ ok: true, messageId });
    } catch (err) {
      console.error('Delete chat message error:', err);
      res.status(500).json({ error: 'Failed to delete message.' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  const executeBlookTrade = async (
    userIdA: string,
    blookIdA: string,
    userIdB: string,
    blookIdB: string
  ): Promise<{
    ok: boolean;
    error?: string;
    inventoryA?: Record<string, number>;
    equippedA?: string;
    historyEntryA?: TradeHistoryEntry;
    inventoryB?: Record<string, number>;
    equippedB?: string;
    historyEntryB?: TradeHistoryEntry;
  }> => {
    const db = await loadDb();
    const userA = Object.values(db.users).find((u) => u.id === userIdA);
    const userB = Object.values(db.users).find((u) => u.id === userIdB);
    if (!userA || !userB) {
      return { ok: false, error: 'One or both players could not be found.' };
    }
    if ((userA.inventory?.[blookIdA] || 0) < 1) {
      return { ok: false, error: `${userA.username} no longer owns that Blook.` };
    }
    if ((userB.inventory?.[blookIdB] || 0) < 1) {
      return { ok: false, error: `${userB.username} no longer owns that Blook.` };
    }

    userA.inventory[blookIdA] -= 1;
    if (userA.inventory[blookIdA] <= 0) delete userA.inventory[blookIdA];
    userA.inventory[blookIdB] = (userA.inventory[blookIdB] || 0) + 1;

    userB.inventory[blookIdB] -= 1;
    if (userB.inventory[blookIdB] <= 0) delete userB.inventory[blookIdB];
    userB.inventory[blookIdA] = (userB.inventory[blookIdA] || 0) + 1;

    if (userA.equippedBlookId && (userA.inventory[userA.equippedBlookId] || 0) <= 0) {
      userA.equippedBlookId = '';
      updateStoredChatAvatars(db, userA.id, userA.username, '');
      multiplayerApi?.broadcastChatAvatarUpdated({
        userId: userA.id,
        username: userA.username,
        avatarBlookId: '',
      });
    }
    if (userB.equippedBlookId && (userB.inventory[userB.equippedBlookId] || 0) <= 0) {
      userB.equippedBlookId = '';
      updateStoredChatAvatars(db, userB.id, userB.username, '');
      multiplayerApi?.broadcastChatAvatarUpdated({
        userId: userB.id,
        username: userB.username,
        avatarBlookId: '',
      });
    }

    const nowIso = new Date().toISOString();
    const tradeRef = `th-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`;
    const historyEntryA: TradeHistoryEntry = {
      id: `${tradeRef}-a`,
      timestamp: nowIso,
      partnerUsername: userB.username,
      gaveBlookId: blookIdA,
      receivedBlookId: blookIdB,
    };
    const historyEntryB: TradeHistoryEntry = {
      id: `${tradeRef}-b`,
      timestamp: nowIso,
      partnerUsername: userA.username,
      gaveBlookId: blookIdB,
      receivedBlookId: blookIdA,
    };

    userA.tradeHistory = [historyEntryA, ...(userA.tradeHistory || [])].slice(0, 50);
    userB.tradeHistory = [historyEntryB, ...(userB.tradeHistory || [])].slice(0, 50);
    userA.achievements = resolveUserAchievements(userA);
    userB.achievements = resolveUserAchievements(userB);

    await saveDb(db);
    return {
      ok: true,
      inventoryA: { ...userA.inventory },
      equippedA: userA.equippedBlookId,
      historyEntryA,
      inventoryB: { ...userB.inventory },
      equippedB: userB.equippedBlookId,
      historyEntryB,
    };
  };

  const httpServer = http.createServer(app);
  multiplayerApi = attachMultiplayerServer(httpServer, {
    onRecordSetPlay: recordSetPlay,
    onAwardTokens: awardUserTokens,
    onGetUserChatMeta: async (userId: string) => {
      const db = await loadDb();
      const found = Object.values(db.users).find((u) => u.id === userId);
      if (!found) return null;
      const achievements = resolveUserAchievements(found);
      const isOwner =
        achievements.includes('owner') ||
        OWNER_IDENTIFIERS.has((found.username || '').trim().toLowerCase());
      const safeEquipped =
        found.equippedBlookId && (found.inventory?.[found.equippedBlookId] || 0) > 0
          ? found.equippedBlookId
          : '';
      const userClan = found.clanId && db.clans?.[found.clanId] ? db.clans[found.clanId] : null;
      return {
        username: found.username,
        avatarBlookId: safeEquipped,
        achievements,
        isOwner,
        clanTag: userClan?.tag,
        clanColor: userClan?.bannerColor,
      };
    },
    onLoadChatMessages: async () => {
      const db = await loadDb();
      return (db.chatMessages || []).slice(-100);
    },
    onAppendChatMessage: async (message: ChatMessageRecord) => {
      const db = await loadDb();
      if (!Array.isArray(db.chatMessages)) db.chatMessages = [];
      db.chatMessages.push(message);
      if (db.chatMessages.length > 100) {
        db.chatMessages = db.chatMessages.slice(-100);
      }
      await saveDb(db);
    },
    onDeleteChatMessage: async (messageId: string) => {
      const db = await loadDb();
      if (!Array.isArray(db.chatMessages)) return false;
      const before = db.chatMessages.length;
      db.chatMessages = db.chatMessages.filter((m) => m.id !== messageId);
      if (db.chatMessages.length === before) return false;
      await saveDb(db);
      return true;
    },
    onExecuteBlookTrade: executeBlookTrade,
  });

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`Clicket server listening on http://localhost:${PORT}`);
  });
}

createServer();
