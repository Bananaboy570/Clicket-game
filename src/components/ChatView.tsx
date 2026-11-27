import React, { useState, useRef, useEffect } from 'react';
import {
  User,
  Trash2,
  Smile,
  Reply,
  X,
  MessageSquare,
} from 'lucide-react';
import { BlookArt, DefaultAvatarPfp } from './BlookArt';
import { OwnerAchievementIcon, DeveloperAchievementIcon } from './AchievementsView';
import type { OnlinePlayerSummary } from './TradingView';

export interface OnlineChatMessage {
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

export interface ChatReplyTarget {
  id: string;
  username: string;
  avatarBlookId: string;
  text: string;
}

interface ChatViewProps {
  myUserId: string;
  myUsername: string;
  myIsOwner: boolean;
  myAvatarBlookId?: string;
  myUnlockedCount?: number;
  myAchievements?: string[];
  wsConnected: boolean;
  messages: OnlineChatMessage[];
  onlinePlayers: OnlinePlayerSummary[];
  knownAvatarsByUserId?: Record<string, string>;
  knownAvatarsByUsername?: Record<string, string>;
  typingUsernames?: string[];
  chatError: string | null;
  onSendMessage: (text: string, replyTo?: ChatReplyTarget | null) => void | Promise<void>;
  onDeleteMessage: (messageId: string) => void | Promise<void>;
  onTypingChange?: (isTyping: boolean) => void;
}

const QUICK_EMOTES = ['👋', '🔥', '🎉', '💎', '👑', '🎪', '⚡', '🍀', '😂', '❤️'];

function renderMessageWithMentions(text: string): React.ReactNode {
  const parts = text.split(/(@[A-Za-z0-9_.\-]+)/g);
  return parts.map((part, idx) => {
    if (/^@[A-Za-z0-9_.\-]+$/.test(part)) {
      return (
        <span
          key={idx}
          className="font-black text-amber-100 underline decoration-white/35 underline-offset-2"
        >
          {part}
        </span>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function formatTypingBanner(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length === 1) return `${names[0]} is typing...`;
  if (names.length === 2) return `${names[0]} and ${names[1]} are typing...`;
  return `${names[0]}, ${names[1]} and ${names.length - 2} more are typing...`;
}

export const ChatView: React.FC<ChatViewProps> = ({
  myUserId,
  myUsername,
  myIsOwner,
  myAvatarBlookId = '',
  myUnlockedCount = 0,
  myAchievements = [],
  wsConnected,
  messages,
  onlinePlayers,
  knownAvatarsByUserId = {},
  knownAvatarsByUsername = {},
  typingUsernames = [],
  chatError,
  onSendMessage,
  onDeleteMessage,
  onTypingChange,
}) => {
  const [draft, setDraft] = useState('');
  const [showEmotes, setShowEmotes] = useState(false);
  const [showOnlinePopover, setShowOnlinePopover] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatReplyTarget | null>(null);
  const feedEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const onlineMenuRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef<number>(0);

  // Build live avatar lookup maps so whenever any player updates their PFP (or unequips to default),
  // every comment and reply preview beside their name updates immediately.
  const liveAvatarsByUserId = new Map<string, string>(Object.entries(knownAvatarsByUserId));
  const liveAvatarsByUsername = new Map<string, string>();
  for (const [uname, av] of Object.entries(knownAvatarsByUsername)) {
    liveAvatarsByUsername.set(uname.trim().toLowerCase(), av);
  }
  for (const p of onlinePlayers) {
    if (p.userId) {
      liveAvatarsByUserId.set(p.userId, p.avatarBlookId || '');
    }
    if (p.username) {
      liveAvatarsByUsername.set(p.username.trim().toLowerCase(), p.avatarBlookId || '');
    }
  }
  if (myUserId) {
    liveAvatarsByUserId.set(myUserId, myAvatarBlookId || '');
  }
  if (myUsername) {
    liveAvatarsByUsername.set(myUsername.trim().toLowerCase(), myAvatarBlookId || '');
  }

  const resolveCommentAvatar = (
    userId: string | undefined,
    username: string | undefined,
    fallbackAvatar: string | undefined
  ): string => {
    if (userId && liveAvatarsByUserId.has(userId)) {
      return liveAvatarsByUserId.get(userId) || '';
    }
    const cleanName = (username || '').trim().toLowerCase();
    if (cleanName && liveAvatarsByUsername.has(cleanName)) {
      return liveAvatarsByUsername.get(cleanName) || '';
    }
    return fallbackAvatar || '';
  };

  // Auto-scroll to bottom on initial load or when new messages arrive
  useEffect(() => {
    if (messages.length > prevCountRef.current || prevCountRef.current === 0) {
      feedEndRef.current?.scrollIntoView({
        behavior: prevCountRef.current === 0 ? 'auto' : 'smooth',
      });
    }
    prevCountRef.current = messages.length;
  }, [messages.length]);

  // Close online players popover on outside click or Escape
  useEffect(() => {
    if (!showOnlinePopover) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (onlineMenuRef.current && !onlineMenuRef.current.contains(e.target as Node)) {
        setShowOnlinePopover(false);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowOnlinePopover(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [showOnlinePopover]);

  const handleDraftChange = (val: string) => {
    setDraft(val);
    onTypingChange?.(val.trim().length > 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    const replyTarget = replyingTo;
    setDraft('');
    setShowEmotes(false);
    setReplyingTo(null);
    onTypingChange?.(false);
    void onSendMessage(trimmed, replyTarget);
  };

  const startReply = (msg: OnlineChatMessage) => {
    setReplyingTo({
      id: msg.id,
      username: msg.username,
      avatarBlookId: resolveCommentAvatar(msg.userId, msg.username, msg.avatarBlookId),
      text: msg.text.slice(0, 120),
    });
    if (!draft.trim()) {
      setDraft(`@${msg.username} `);
    }
    inputRef.current?.focus();
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Deduplicate online players by userId (Owner first, then alphabetically)
  const effectiveOnlineSource: OnlinePlayerSummary[] =
    onlinePlayers.length > 0 || wsConnected
      ? onlinePlayers
      : myUserId
      ? [
          {
            clientId: `local-${myUserId}`,
            userId: myUserId,
            username: myUsername,
            avatarBlookId: myAvatarBlookId,
            unlockedCount: myUnlockedCount,
            inTrade: false,
            achievements: myAchievements,
            isOwner: myIsOwner,
          },
        ]
      : [];

  const uniqueOnlinePlayers = Array.from(
    effectiveOnlineSource
      .reduce((map, p) => {
        map.set(p.userId, p);
        return map;
      }, new Map<string, OnlinePlayerSummary>())
      .values()
  ).sort((a, b) => {
    const aOwner = a.isOwner || a.achievements?.includes('owner') ? 1 : 0;
    const bOwner = b.isOwner || b.achievements?.includes('owner') ? 1 : 0;
    if (aOwner !== bOwner) return bOwner - aOwner;
    return a.username.localeCompare(b.username);
  });

  const typingBanner = formatTypingBanner(typingUsernames);

  return (
    <div className="relative z-10 h-full w-full flex flex-col overflow-hidden">
      {/* Top-Right Dark Translucent Online Badge + Popover (matches reference layout) */}
      <div ref={onlineMenuRef} className="absolute top-3 right-4 z-30">
        <button
          type="button"
          onClick={() => setShowOnlinePopover((v) => !v)}
          className="bg-black/40 hover:bg-black/55 backdrop-blur-xs text-white px-4 py-2 rounded-xl border border-white/15 shadow-lg flex items-center gap-2 cursor-pointer transition-colors"
        >
          <User className="w-4 h-4 fill-white text-white" />
          <span className="font-nunito font-black text-sm tabular-nums">
            {uniqueOnlinePlayers.length} online
          </span>
        </button>

        {showOnlinePopover && (
          <div className="absolute right-0 mt-2 w-72 max-h-[360px] bg-slate-950/92 backdrop-blur-md text-white rounded-2xl border border-white/15 shadow-2xl p-3 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
              <span className="font-titan text-base tracking-wide">
                Online Players ({uniqueOnlinePlayers.length})
              </span>
              <button
                type="button"
                onClick={() => setShowOnlinePopover(false)}
                aria-label="Close online list"
                className="p-1 rounded-lg text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {uniqueOnlinePlayers.length === 0 ? (
                <p className="font-nunito font-bold text-xs text-white/60 py-4 text-center">
                  No other players online right now.
                </p>
              ) : (
                uniqueOnlinePlayers.map((p) => {
                  const playerIsOwner = p.isOwner || p.achievements?.includes('owner');
                  const playerIsDev = !playerIsOwner && p.achievements?.includes('developer');
                  return (
                    <div
                      key={p.clientId}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-8 h-8 flex items-center justify-center shrink-0">
                        {p.avatarBlookId ? (
                          <BlookArt id={p.avatarBlookId} className="w-full h-full" />
                        ) : (
                          <DefaultAvatarPfp className="w-7 h-7 rounded-lg" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`truncate text-sm ${
                              playerIsOwner
                                ? 'font-titan owner-rainbow-glow'
                                : 'font-nunito font-black text-white'
                            }`}
                          >
                            {p.username}
                          </span>
                          {playerIsOwner && (
                            <OwnerAchievementIcon className="w-4 h-4 shrink-0" />
                          )}
                          {playerIsDev && (
                            <DeveloperAchievementIcon className="w-3.5 h-3.5 shrink-0" />
                          )}
                        </div>
                        <span className="block font-nunito font-bold text-[11px] text-white/60 tabular-nums">
                          {p.unlockedCount} Blooks Unlocked
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>

      {/* Transient Error Banner */}
      {chatError && (
        <div className="mx-4 sm:mx-6 mt-3 rounded-xl bg-black/55 border border-rose-300/60 px-4 py-2 text-rose-100 font-nunito font-extrabold text-xs shrink-0 max-w-md z-20">
          {chatError}
        </div>
      )}

      {/* Open-Canvas Messages Stream directly over BlookBackground */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 pt-5 pb-3 space-y-3.5">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
            <div className="w-14 h-14 rounded-2xl bg-black/25 text-white flex items-center justify-center mb-3">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="font-titan text-2xl text-white drop-shadow-[0_2px_0_rgba(0,0,0,0.2)]">
              No messages yet!
            </h3>
            <p className="font-nunito font-bold text-sm text-white/85 mt-1 max-w-xs drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
              Be the first to say hello to everyone playing CLICKET!
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const msgIsOwner = msg.isOwner || msg.achievements?.includes('owner');
            const msgIsDev = !msgIsOwner && msg.achievements?.includes('developer');
            const resolvedAvatar = resolveCommentAvatar(
              msg.userId,
              msg.username,
              msg.avatarBlookId
            );
            const resolvedReplyAvatar = msg.replyToUsername
              ? resolveCommentAvatar(undefined, msg.replyToUsername, msg.replyToAvatar)
              : '';

            return (
              <div key={msg.id} className="group flex flex-col">
                {/* Inline Reply Preview Header */}
                {msg.replyToText && msg.replyToUsername && (
                  <div className="flex items-center gap-1.5 pl-4 mb-0.5 text-xs text-white/85 drop-shadow-[0_1px_1px_rgba(0,0,0,0.35)]">
                    <span
                      aria-hidden="true"
                      className="w-3.5 h-2.5 border-l-2 border-t-2 border-white/45 rounded-tl-md shrink-0 mt-1"
                    />
                    {resolvedReplyAvatar ? (
                      <BlookArt id={resolvedReplyAvatar} className="w-4 h-4 shrink-0" />
                    ) : (
                      <DefaultAvatarPfp className="w-4 h-4 rounded shrink-0" />
                    )}
                    <span className="font-nunito font-black text-white shrink-0">
                      @{msg.replyToUsername}
                    </span>
                    <span className="font-nunito font-bold text-white/80 truncate max-w-[460px]">
                      {msg.replyToText}
                    </span>
                  </div>
                )}

                {/* Main Message Row */}
                <div className="flex items-start gap-3">
                  {/* Blook Avatar directly on background */}
                  <div className="w-10 h-10 sm:w-11 sm:h-11 shrink-0 flex items-center justify-center">
                    {resolvedAvatar ? (
                      <BlookArt
                        id={resolvedAvatar}
                        className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)]"
                      />
                    ) : (
                      <DefaultAvatarPfp className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.28)]" />
                    )}
                  </div>

                  {/* Sender Header + Message Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 leading-tight">
                      {msg.clanTag && (
                        <span
                          className="font-titan text-[14.5px] tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.55)]"
                          style={{ color: msg.clanColor && msg.clanColor !== '#dc2626' ? msg.clanColor : '#fef08a' }}
                        >
                          [{msg.clanTag}]
                        </span>
                      )}

                      {msgIsOwner ? (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-titan text-[16.5px] tracking-wide owner-rainbow-glow">
                            {msg.username}
                          </span>
                          <span title="CLICKET Owner Badge" className="inline-flex items-center shrink-0">
                            <OwnerAchievementIcon className="w-4 h-4 drop-shadow-sm" />
                          </span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="font-nunito font-black text-[15.5px] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)]">
                            {msg.username}
                          </span>
                          {msgIsDev && (
                            <span title="Developer Badge" className="inline-flex items-center shrink-0">
                              <DeveloperAchievementIcon className="w-4 h-4 drop-shadow-sm" />
                            </span>
                          )}
                        </span>
                      )}

                      <span className="font-nunito font-bold text-[11.5px] text-white/75 tabular-nums ml-1 drop-shadow-[0_1px_1px_rgba(0,0,0,0.28)]">
                        {formatTime(msg.createdAt)}
                      </span>

                      {/* Subtle Hover Reply / Delete Controls */}
                      <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity inline-flex items-center gap-1 ml-1.5">
                        <button
                          type="button"
                          title="Reply"
                          onClick={() => startReply(msg)}
                          className="p-1 rounded-md bg-black/25 hover:bg-black/45 text-white/85 hover:text-white cursor-pointer"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                        {myIsOwner && (
                          <button
                            type="button"
                            title="Delete message"
                            onClick={() => onDeleteMessage(msg.id)}
                            className="p-1 rounded-md bg-black/25 hover:bg-rose-700/80 text-white/85 hover:text-white cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="mt-0.5 font-nunito font-bold text-[15px] text-white break-words leading-snug drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                      {renderMessageWithMentions(msg.text)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={feedEndRef} />
      </div>

      {/* Bottom Docked Compose Bar */}
      <div className="shrink-0 px-4 sm:px-5 pb-2 pt-1.5 relative">
        {/* Replying-to Indicator */}
        {replyingTo && (
          <div className="mb-1.5 px-3 py-1.5 rounded-lg bg-black/35 border border-white/15 text-white text-xs font-nunito font-bold flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <Reply className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
              <span className="text-white/80 shrink-0">Replying to</span>
              <span className="font-black text-white shrink-0">@{replyingTo.username}</span>
              <span className="text-white/70 truncate">{replyingTo.text}</span>
            </div>
            <button
              type="button"
              aria-label="Cancel reply"
              onClick={() => setReplyingTo(null)}
              className="p-0.5 rounded hover:bg-white/15 text-white/75 hover:text-white cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Quick Emote Picker Popover */}
        {showEmotes && (
          <div className="absolute bottom-18 right-24 sm:right-28 bg-slate-950/92 backdrop-blur-md border border-white/20 rounded-xl p-2 shadow-2xl flex flex-wrap items-center gap-1.5 max-w-[260px] z-30">
            {QUICK_EMOTES.map((emoji) => (
              <button
                key={emoji}
                type="button"
                onClick={() => {
                  handleDraftChange((draft + emoji).slice(0, 300));
                  inputRef.current?.focus();
                }}
                className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 text-lg flex items-center justify-center cursor-pointer transition-transform active:scale-95"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Compose Form Row */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
          <input
            ref={inputRef}
            type="text"
            value={draft}
            onChange={(e) => handleDraftChange(e.target.value)}
            maxLength={300}
            placeholder="Chat..."
            className="flex-1 min-w-0 h-11 px-4 rounded-lg bg-black/30 border border-white/15 text-white placeholder-white/60 font-nunito font-bold text-[14.5px] focus:outline-none focus:border-white/45 focus:bg-black/38 transition-colors"
          />

          <button
            type="button"
            onClick={() => setShowEmotes((v) => !v)}
            aria-label="Quick emotes"
            className={`w-11 h-11 rounded-lg border border-white/15 flex items-center justify-center shrink-0 cursor-pointer shadow-sm transition-colors ${
              showEmotes
                ? 'bg-[#147a53] text-amber-200'
                : 'bg-[#0d5c3e] hover:bg-[#10704b] text-white'
            }`}
          >
            <Smile className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!draft.trim()}
            className="h-11 px-6 rounded-lg bg-[#0a8754] hover:bg-[#0d9c62] active:translate-y-0.5 text-white font-titan text-base tracking-wide border border-white/15 shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0 transition-all"
          >
            Send
          </button>
        </form>

        {/* Typing Status Footer */}
        <div className="h-5 mt-1 px-0.5 flex items-center">
          {typingBanner && (
            <span className="font-nunito font-bold text-[12px] text-white/95 drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] truncate">
              {typingBanner}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
