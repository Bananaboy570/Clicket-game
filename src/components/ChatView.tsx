import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Users,
  User,
  Trash2,
  Sparkles,
  Smile,
} from 'lucide-react';
import { BlookArt } from './BlookArt';
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
  chatError: string | null;
  onSendMessage: (text: string) => void | Promise<void>;
  onDeleteMessage: (messageId: string) => void | Promise<void>;
}

const QUICK_EMOTES = ['👋', '🔥', '🎉', '💎', '👑', '🎪', '⚡', '🍀'];

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
  chatError,
  onSendMessage,
  onDeleteMessage,
}) => {
  const [draft, setDraft] = useState('');
  const [showEmotes, setShowEmotes] = useState(false);
  const feedEndRef = useRef<HTMLDivElement | null>(null);
  const feedContainerRef = useRef<HTMLDivElement | null>(null);
  const prevCountRef = useRef<number>(0);

  // Auto-scroll to bottom on initial load or when new messages arrive
  useEffect(() => {
    if (messages.length > prevCountRef.current || prevCountRef.current === 0) {
      feedEndRef.current?.scrollIntoView({ behavior: prevCountRef.current === 0 ? 'auto' : 'smooth' });
    }
    prevCountRef.current = messages.length;
  }, [messages.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = draft.trim();
    if (!trimmed) return;
    setDraft('');
    setShowEmotes(false);
    void onSendMessage(trimmed);
  };

  const formatTime = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  // Deduplicate online players by userId (keep latest client entry, sort Owner first then alphabetically).
  // When using HTTP/static fallback while signed in, include the current signed-in player.
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

  return (
    <div className="relative z-10 px-4 sm:px-9 pt-6 pb-10 h-full flex flex-col max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5 shrink-0">
        <div>
          <h1 className="font-titan text-white text-[40px] sm:text-[44px] leading-none tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.18)] flex items-center gap-3">
            <MessageSquare className="w-9 h-9 text-amber-200" />
            <span>Online Chat</span>
          </h1>
          <p className="font-nunito font-extrabold text-white/90 text-sm mt-1">
            Chat live with everyone currently playing CLICKET!
          </p>
        </div>

        <div className="bg-[#991b1b] text-white px-4 py-2 rounded-2xl border-2 border-white/20 flex items-center gap-2 shadow-md">
          <Users className="w-4 h-4 text-emerald-300" />
          <span className="font-titan text-base tracking-wide">
            {uniqueOnlinePlayers.length} Online
          </span>
        </div>
      </div>

      {chatError && (
        <div className="mb-4 rounded-2xl bg-rose-100 border-2 border-rose-300 px-4 py-2.5 text-rose-800 font-nunito font-extrabold text-sm shrink-0">
          {chatError}
        </div>
      )}

      {/* Main Chat + Online Players Grid */}
      <div className="flex-1 min-h-[420px] flex flex-col lg:flex-row gap-6 overflow-hidden">
        {/* Chat Feed Panel */}
        <div className="flex-1 bg-white rounded-3xl shadow-[0_8px_0_rgba(0,0,0,0.18)] border-4 border-white/80 flex flex-col overflow-hidden min-h-[420px]">
          {/* Chat Top Bar */}
          <div className="px-5 py-3.5 bg-gradient-to-r from-[#dc2626] to-[#ef4444] text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span className="font-titan text-xl tracking-wide">Global Lobby</span>
            </div>
            <span className="font-nunito font-extrabold text-xs text-white/90">
              Signed in as{' '}
              <span className={myIsOwner ? 'owner-rainbow-glow font-black' : 'underline'}>
                {myUsername}
              </span>
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div
            ref={feedContainerRef}
            className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3 bg-slate-50/70"
          >
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-16 h-16 rounded-2xl bg-red-100 text-[#dc2626] flex items-center justify-center mb-3">
                  <MessageSquare className="w-8 h-8" />
                </div>
                <h3 className="font-titan text-2xl text-slate-700">No messages yet!</h3>
                <p className="font-nunito font-bold text-sm text-slate-500 mt-1 max-w-xs">
                  Be the first to say hello to the CLICKET community!
                </p>
              </div>
            ) : (
              messages.map((msg) => {
                const isMine = msg.userId === myUserId;
                const msgIsOwner = msg.isOwner || msg.achievements?.includes('owner');
                const msgIsDev = !msgIsOwner && msg.achievements?.includes('developer');

                return (
                  <div
                    key={msg.id}
                    className={`group flex items-start gap-3 p-3 rounded-2xl border-2 transition-colors ${
                      msgIsOwner
                        ? 'bg-gradient-to-r from-amber-50/90 via-white to-rose-50/80 border-amber-300 shadow-sm'
                        : isMine
                        ? 'bg-red-50/60 border-red-200'
                        : 'bg-white border-slate-200/80'
                    }`}
                  >
                    {/* Sender Blook Avatar */}
                    <div
                      className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center p-1 border-2 ${
                        msgIsOwner
                          ? 'bg-amber-100 border-amber-400'
                          : 'bg-slate-100 border-slate-200'
                      }`}
                    >
                      {msg.avatarBlookId ? (
                        <BlookArt id={msg.avatarBlookId} className="w-full h-full" />
                      ) : (
                        <User className="w-5 h-5 text-slate-400" />
                      )}
                    </div>

                    {/* Name + Badges + Message */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                        {msgIsOwner ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="font-titan text-[17px] tracking-wide owner-rainbow-glow">
                              {msg.username}
                            </span>
                            <span title="CLICKET Owner Badge" className="inline-flex items-center shrink-0">
                              <OwnerAchievementIcon className="w-5 h-5 drop-shadow-sm" />
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-gradient-to-r from-red-600 to-amber-500 text-white font-nunito font-black text-[10px] tracking-wider shadow-xs">
                              OWNER
                            </span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="font-nunito font-black text-[15px] text-slate-800">
                              {msg.username}
                            </span>
                            {msgIsDev && (
                              <span title="Developer Badge" className="inline-flex items-center shrink-0">
                                <DeveloperAchievementIcon className="w-4 h-4" />
                              </span>
                            )}
                          </span>
                        )}

                        {isMine && !msgIsOwner && (
                          <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-[#dc2626] font-nunito font-black text-[10px]">
                            YOU
                          </span>
                        )}

                        <span className="ml-auto font-nunito font-bold text-[11px] text-slate-400 tabular-nums">
                          {formatTime(msg.createdAt)}
                        </span>

                        {myIsOwner && (
                          <button
                            type="button"
                            title="Delete message"
                            onClick={() => onDeleteMessage(msg.id)}
                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <p className="font-nunito font-bold text-[14.5px] text-slate-700 break-words leading-snug">
                        {msg.text}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
            <div ref={feedEndRef} />
          </div>

          {/* Emote Quick Picker */}
          {showEmotes && (
            <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center gap-1.5 shrink-0">
              {QUICK_EMOTES.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setDraft((d) => (d + emoji).slice(0, 300))}
                  className="w-9 h-9 rounded-xl bg-white hover:bg-amber-50 border border-slate-200 text-lg flex items-center justify-center cursor-pointer transition-transform active:scale-95"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Compose Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3.5 bg-white border-t-2 border-slate-100 flex items-center gap-2.5 shrink-0"
          >
            <button
              type="button"
              onClick={() => setShowEmotes((v) => !v)}
              aria-label="Quick emotes"
              className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                showEmotes
                  ? 'bg-amber-100 border-amber-300 text-amber-700'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-700'
              }`}
            >
              <Smile className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={300}
              placeholder="Type a message to everyone online..."
              className="flex-1 min-w-0 px-4 py-2.5 rounded-xl border-2 border-slate-200 font-nunito font-bold text-sm text-slate-800 focus:outline-none focus:border-[#dc2626]"
            />

            <button
              type="submit"
              disabled={!draft.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#fbbf24] hover:brightness-105 active:translate-y-0.5 active:shadow-none shadow-[0_4px_0_#b45309] text-amber-950 font-titan text-base flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Right Sidebar: Players Currently Online */}
        <div className="w-full lg:w-72 shrink-0 bg-white/95 rounded-3xl p-5 shadow-[0_8px_0_rgba(0,0,0,0.18)] border-4 border-white/80 flex flex-col max-h-[340px] lg:max-h-none overflow-hidden">
          <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-3 shrink-0">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-[#dc2626]" />
              <h2 className="font-titan text-xl text-slate-800">Online Players</h2>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-700 font-nunito font-black text-xs">
              {uniqueOnlinePlayers.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {uniqueOnlinePlayers.length === 0 ? (
              <p className="font-nunito font-bold text-xs text-slate-400 py-4 text-center">
                No other players online right now.
              </p>
            ) : (
              uniqueOnlinePlayers.map((p) => {
                const playerIsOwner = p.isOwner || p.achievements?.includes('owner');
                const playerIsDev = !playerIsOwner && p.achievements?.includes('developer');

                return (
                  <div
                    key={p.clientId}
                    className={`flex items-center gap-2.5 p-2.5 rounded-2xl border-2 ${
                      playerIsOwner
                        ? 'bg-gradient-to-r from-amber-50 to-rose-50 border-amber-300'
                        : 'bg-slate-50 border-slate-200/70'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                      {p.avatarBlookId ? (
                        <BlookArt id={p.avatarBlookId} className="w-full h-full" />
                      ) : (
                        <User className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span
                          className={`truncate text-sm ${
                            playerIsOwner
                              ? 'font-titan owner-rainbow-glow'
                              : 'font-nunito font-black text-slate-800'
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
                      <span className="block font-nunito font-bold text-[11px] text-slate-400">
                        {p.unlockedCount} Blooks Unlocked
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
