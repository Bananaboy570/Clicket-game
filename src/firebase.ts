import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDocFromServer,
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase Firestore is offline or unconfigured.');
    }
    return false;
  }
}

// -------------------------------------------------------------
// REAL-TIME FIRESTORE TYPES & HELPERS
// -------------------------------------------------------------

export interface FirestoreChatMessage {
  id: string;
  userId: string;
  username: string;
  avatarBlookId?: string;
  achievements?: string[];
  isOwner?: boolean;
  text: string;
  createdAt: string;
  clanTag?: string;
  clanColor?: string;
  replyToId?: string;
  replyToUsername?: string;
  replyToAvatar?: string;
  replyToText?: string;
}

export interface FirestorePlayerPresence {
  id: string;
  userId: string;
  username: string;
  avatarBlookId?: string;
  unlockedCount?: number;
  isOwner?: boolean;
  achievements?: string[];
  lastSeen: number;
  typingUntil?: number;
}

export interface FirestoreGlobalTrade {
  id: string;
  creatorId: string;
  creatorUsername: string;
  creatorAvatarBlookId?: string;
  creatorAchievements?: string[];
  creatorIsOwner?: boolean;
  offeredBlookId: string;
  requestedBlookId?: string | null;
  requestedRarity?: string | null;
  note?: string;
  status: 'OPEN' | 'FULFILLED' | 'CANCELLED';
  createdAt: string;
  fulfilledByUsername?: string;
  fulfilledAt?: string;
}

/**
 * Real-time listener for public lobby chat messages
 */
export function subscribeFirestoreChat(
  onMessages: (messages: FirestoreChatMessage[]) => void
): () => void {
  const chatPath = 'chat_messages';
  const q = query(collection(db, chatPath), orderBy('createdAt', 'asc'), limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const msgs: FirestoreChatMessage[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        msgs.push({
          id: d.id,
          userId: data.userId || '',
          username: data.username || 'Player',
          avatarBlookId: data.avatarBlookId || '',
          achievements: Array.isArray(data.achievements) ? data.achievements : [],
          isOwner: Boolean(data.isOwner),
          text: data.text || '',
          createdAt: data.createdAt || new Date().toISOString(),
          ...(data.clanTag ? { clanTag: String(data.clanTag) } : {}),
          ...(data.clanColor ? { clanColor: String(data.clanColor) } : {}),
          ...(data.replyToId ? { replyToId: String(data.replyToId) } : {}),
          ...(data.replyToUsername ? { replyToUsername: String(data.replyToUsername) } : {}),
          ...(data.replyToAvatar ? { replyToAvatar: String(data.replyToAvatar) } : {}),
          ...(data.replyToText ? { replyToText: String(data.replyToText) } : {}),
        });
      });
      onMessages(msgs);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, chatPath);
    }
  );
}

/**
 * Send a new chat message to Firestore
 */
export async function sendFirestoreChatMessage(message: FirestoreChatMessage): Promise<void> {
  const docPath = `chat_messages/${message.id}`;
  try {
    const payload: Record<string, unknown> = {
      id: message.id,
      userId: message.userId,
      username: message.username.slice(0, 32),
      avatarBlookId: (message.avatarBlookId || '').slice(0, 64),
      achievements: message.achievements || [],
      isOwner: Boolean(message.isOwner),
      text: message.text.slice(0, 300),
      createdAt: message.createdAt || new Date().toISOString(),
    };
    if (message.clanTag) payload.clanTag = message.clanTag.slice(0, 10);
    if (message.clanColor) payload.clanColor = message.clanColor.slice(0, 16);
    if (message.replyToId) payload.replyToId = message.replyToId.slice(0, 128);
    if (message.replyToUsername) payload.replyToUsername = message.replyToUsername.slice(0, 32);
    if (message.replyToAvatar) payload.replyToAvatar = message.replyToAvatar.slice(0, 64);
    if (message.replyToText) payload.replyToText = message.replyToText.slice(0, 120);

    await setDoc(doc(db, 'chat_messages', message.id), payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Delete a chat message from Firestore (owner or system admin)
 */
export async function deleteFirestoreChatMessage(messageId: string): Promise<void> {
  const docPath = `chat_messages/${messageId}`;
  try {
    await deleteDoc(doc(db, 'chat_messages', messageId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}

/**
 * Real-time listener for online presence heartbeats
 */
export function subscribeFirestorePresence(
  onPlayers: (players: FirestorePlayerPresence[]) => void
): () => void {
  const presencePath = 'presence';
  const presenceCol = collection(db, presencePath);

  return onSnapshot(
    presenceCol,
    (snapshot) => {
      const now = Date.now();
      const cutoff = now - 60000; // Active within the last 60 seconds
      const list: FirestorePlayerPresence[] = [];

      snapshot.forEach((d) => {
        const data = d.data();
        const lastSeen = Number(data.lastSeen) || 0;
        if (lastSeen > cutoff) {
          list.push({
            id: d.id,
            userId: data.userId || d.id,
            username: data.username || 'Player',
            avatarBlookId: data.avatarBlookId || '',
            unlockedCount: Number(data.unlockedCount) || 0,
            isOwner: Boolean(data.isOwner),
            achievements: Array.isArray(data.achievements) ? data.achievements : [],
            lastSeen,
            typingUntil: Number(data.typingUntil) || 0,
          });
        }
      });
      onPlayers(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, presencePath);
    }
  );
}

/**
 * Update player's real-time heartbeat in Firestore
 */
export async function updateFirestorePresence(
  playerId: string,
  presence: Omit<FirestorePlayerPresence, 'id' | 'lastSeen'>
): Promise<void> {
  const docPath = `presence/${playerId}`;
  try {
    await setDoc(doc(db, 'presence', playerId), {
      id: playerId,
      userId: presence.userId,
      username: presence.username.slice(0, 32),
      avatarBlookId: (presence.avatarBlookId || '').slice(0, 64),
      unlockedCount: presence.unlockedCount || 0,
      isOwner: Boolean(presence.isOwner),
      achievements: presence.achievements || [],
      lastSeen: Date.now(),
      typingUntil: Number(presence.typingUntil) || 0,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Remove player presence on disconnect/logout
 */
export async function removeFirestorePresence(playerId: string): Promise<void> {
  const docPath = `presence/${playerId}`;
  try {
    await deleteDoc(doc(db, 'presence', playerId));
  } catch {
    // Non-fatal if presence removal fails on page close
  }
}

/**
 * Real-time listener for Global Trade listings
 */
export function subscribeFirestoreTrades(
  onTrades: (trades: FirestoreGlobalTrade[]) => void
): () => void {
  const tradesPath = 'global_trades';
  const q = query(collection(db, tradesPath), orderBy('createdAt', 'desc'), limit(100));

  return onSnapshot(
    q,
    (snapshot) => {
      const trades: FirestoreGlobalTrade[] = [];
      snapshot.forEach((d) => {
        const data = d.data();
        const isBot =
          d.id.startsWith('gt-seed-') || String(data.creatorId || '').startsWith('seed-trader-');
        if (data.status === 'OPEN' && !isBot) {
          trades.push({
            id: d.id,
            creatorId: data.creatorId || '',
            creatorUsername: data.creatorUsername || 'Trader',
            creatorAvatarBlookId: data.creatorAvatarBlookId || '',
            creatorAchievements: Array.isArray(data.creatorAchievements) ? data.creatorAchievements : [],
            creatorIsOwner: Boolean(data.creatorIsOwner),
            offeredBlookId: data.offeredBlookId || '',
            requestedBlookId: data.requestedBlookId || null,
            requestedRarity: data.requestedRarity || null,
            note: data.note || '',
            status: data.status || 'OPEN',
            createdAt: data.createdAt || new Date().toISOString(),
            fulfilledByUsername: data.fulfilledByUsername,
            fulfilledAt: data.fulfilledAt,
          });
        }
      });
      onTrades(trades);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, tradesPath);
    }
  );
}

/**
 * Create a new global trade listing in Firestore
 */
export async function createFirestoreTrade(trade: FirestoreGlobalTrade): Promise<void> {
  const docPath = `global_trades/${trade.id}`;
  try {
    await setDoc(doc(db, 'global_trades', trade.id), {
      id: trade.id,
      creatorId: trade.creatorId,
      creatorUsername: trade.creatorUsername,
      creatorAvatarBlookId: trade.creatorAvatarBlookId || '',
      creatorAchievements: trade.creatorAchievements || [],
      creatorIsOwner: Boolean(trade.creatorIsOwner),
      offeredBlookId: trade.offeredBlookId,
      requestedBlookId: trade.requestedBlookId || null,
      requestedRarity: trade.requestedRarity || null,
      note: trade.note || '',
      status: 'OPEN',
      createdAt: trade.createdAt || new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

/**
 * Fulfill a global trade in Firestore
 */
export async function fulfillFirestoreTrade(
  tradeId: string,
  fulfillerUsername: string
): Promise<void> {
  const docPath = `global_trades/${tradeId}`;
  try {
    await updateDoc(doc(db, 'global_trades', tradeId), {
      status: 'FULFILLED',
      fulfilledByUsername: fulfillerUsername,
      fulfilledAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

/**
 * Cancel a global trade in Firestore
 */
export async function cancelFirestoreTrade(tradeId: string): Promise<void> {
  const docPath = `global_trades/${tradeId}`;
  try {
    await updateDoc(doc(db, 'global_trades', tradeId), {
      status: 'CANCELLED',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, docPath);
  }
}

// -------------------------------------------------------------
// AUTH METHODS
// -------------------------------------------------------------

export async function signInWithGooglePopup(): Promise<{
  idToken: string;
  email: string;
  displayName: string;
}> {
  const result = await signInWithPopup(auth, googleProvider);
  const idToken = await result.user.getIdToken();
  return {
    idToken,
    email: result.user.email || '',
    displayName: result.user.displayName || '',
  };
}

export async function signUpWithEmailConfirmation(
  email: string,
  password: string,
  username: string
): Promise<
  | { status: 'NEEDS_CONFIRMATION'; email: string }
  | { status: 'ALREADY_VERIFIED'; idToken: string; email: string; displayName: string }
> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim();

  try {
    const cred = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    if (cleanUsername) {
      await updateProfile(cred.user, { displayName: cleanUsername }).catch(() => {});
    }
    await sendEmailVerification(cred.user);
    return { status: 'NEEDS_CONFIRMATION', email: cred.user.email || cleanEmail };
  } catch (err: unknown) {
    const code =
      typeof err === 'object' && err !== null && 'code' in err
        ? String((err as { code?: unknown }).code)
        : '';

    if (code === 'auth/email-already-in-use') {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      await cred.user.reload();
      if (!cred.user.emailVerified) {
        if (cleanUsername) {
          await updateProfile(cred.user, { displayName: cleanUsername }).catch(() => {});
        }
        await sendEmailVerification(cred.user);
        return { status: 'NEEDS_CONFIRMATION', email: cred.user.email || cleanEmail };
      }
      const idToken = await cred.user.getIdToken(true);
      return {
        status: 'ALREADY_VERIFIED',
        idToken,
        email: cred.user.email || cleanEmail,
        displayName: cred.user.displayName || cleanUsername,
      };
    }

    throw err;
  }
}

export async function resendConfirmationEmail(): Promise<void> {
  if (!auth.currentUser) {
    throw new Error('No active sign-up session. Please fill out the form again.');
  }
  await sendEmailVerification(auth.currentUser);
}

export async function reloadAndCheckEmailConfirmation(): Promise<
  | { verified: false }
  | { verified: true; idToken: string; email: string; displayName: string }
> {
  if (!auth.currentUser) {
    throw new Error('No active sign-up session. Please sign up or log in again.');
  }
  await auth.currentUser.reload();
  if (!auth.currentUser.emailVerified) {
    return { verified: false };
  }
  const idToken = await auth.currentUser.getIdToken(true);
  return {
    verified: true,
    idToken,
    email: auth.currentUser.email || '',
    displayName: auth.currentUser.displayName || '',
  };
}

export async function signInWithEmailAndGetStatus(
  email: string,
  password: string
): Promise<
  | { verified: false; email: string; displayName: string }
  | { verified: true; idToken: string; email: string; displayName: string }
> {
  const cleanEmail = email.trim().toLowerCase();
  const cred = await signInWithEmailAndPassword(auth, cleanEmail, password);
  await cred.user.reload();
  if (!cred.user.emailVerified) {
    return {
      verified: false,
      email: cred.user.email || cleanEmail,
      displayName: cred.user.displayName || '',
    };
  }
  const idToken = await cred.user.getIdToken(true);
  return {
    verified: true,
    idToken,
    email: cred.user.email || cleanEmail,
    displayName: cred.user.displayName || '',
  };
}

export async function signOutFirebase(): Promise<void> {
  try {
    await signOut(auth);
  } catch {
    // Ignore sign-out errors
  }
}
