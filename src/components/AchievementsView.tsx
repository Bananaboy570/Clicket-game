import React, { useState } from 'react';
import { Lock, CheckCircle2, Sparkles, ShieldCheck } from 'lucide-react';
import { apiFetch } from '../lib/apiClient';

export const OwnerAchievementIcon: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="ownerShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="55%" stopColor="#dc2626" />
        <stop offset="100%" stopColor="#7f1d1d" />
      </linearGradient>
      <linearGradient id="ownerCrownGold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fef08a" />
        <stop offset="45%" stopColor="#fbbf24" />
        <stop offset="100%" stopColor="#b45309" />
      </linearGradient>
    </defs>
    {/* Royal Hexagon Crest */}
    <polygon
      points="60,8 104,28 108,74 60,112 12,74 16,28"
      fill="url(#ownerShieldGrad)"
      stroke="#fde047"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <polygon
      points="60,16 96,33 99,71 60,102 21,71 24,33"
      fill="none"
      stroke="rgba(255,255,255,0.28)"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* 3D Royal Crown */}
    <path
      d="M28 74 L24 44 L44 58 L60 34 L76 58 L96 44 L92 74 Z"
      fill="url(#ownerCrownGold)"
      stroke="#78350f"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Crown Base Band */}
    <rect
      x="28"
      y="72"
      width="64"
      height="11"
      rx="4"
      fill="#f59e0b"
      stroke="#78350f"
      strokeWidth="2.2"
    />
    {/* Crown Tip Pearls */}
    <circle cx="24" cy="41" r="4.5" fill="#fef08a" stroke="#78350f" strokeWidth="1.8" />
    <circle cx="60" cy="31" r="5.5" fill="#fef08a" stroke="#78350f" strokeWidth="1.8" />
    <circle cx="96" cy="41" r="4.5" fill="#fef08a" stroke="#78350f" strokeWidth="1.8" />
    {/* Ruby Center Gem */}
    <polygon
      points="60,49 67,59 60,69 53,59"
      fill="#fb7185"
      stroke="#881337"
      strokeWidth="1.8"
    />
    <polygon points="60,52 63.5,58 60,64 56.5,58" fill="#fecdd3" opacity="0.85" />
    {/* Accent Sparkles */}
    <path d="M98 20 L100 24 L104 26 L100 28 L98 32 L96 28 L92 26 L96 24 Z" fill="#fef08a" />
    <path d="M22 22 L23.5 25 L26.5 26.5 L23.5 28 L22 31 L20.5 28 L17.5 26.5 L20.5 25 Z" fill="#fef08a" />
  </svg>
);

export const DeveloperAchievementIcon: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="devBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0284c7" />
        <stop offset="55%" stopColor="#2563eb" />
        <stop offset="100%" stopColor="#312e81" />
      </linearGradient>
      <linearGradient id="devCodeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="100%" stopColor="#38bdf8" />
      </linearGradient>
    </defs>
    {/* Cyber Octagon Crest */}
    <polygon
      points="38,10 82,10 110,38 110,82 82,110 38,110 10,82 10,38"
      fill="url(#devBadgeGrad)"
      stroke="#38bdf8"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    {/* Inner Terminal Screen */}
    <rect
      x="23"
      y="28"
      width="74"
      height="64"
      rx="12"
      fill="#0f172a"
      stroke="#7dd3fc"
      strokeWidth="2.5"
    />
    {/* Terminal Top Bar Dots */}
    <circle cx="33" cy="37" r="2.8" fill="#f87171" />
    <circle cx="42" cy="37" r="2.8" fill="#fbbf24" />
    <circle cx="51" cy="37" r="2.8" fill="#4ade80" />
    <line x1="24" y1="45" x2="96" y2="45" stroke="#1e293b" strokeWidth="2" />
    {/* Crisp Code Brackets </> */}
    <path
      d="M44 58 L32 68 L44 78"
      stroke="url(#devCodeGlow)"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M76 58 L88 68 L76 78"
      stroke="url(#devCodeGlow)"
      strokeWidth="5.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line
      x1="65"
      y1="54"
      x2="55"
      y2="82"
      stroke="#facc15"
      strokeWidth="5"
      strokeLinecap="round"
    />
    {/* Circuit Nodes */}
    <circle cx="60" cy="18" r="3.5" fill="#7dd3fc" />
    <circle cx="60" cy="102" r="3.5" fill="#7dd3fc" />
    <circle cx="17" cy="60" r="3" fill="#38bdf8" />
    <circle cx="103" cy="60" r="3" fill="#38bdf8" />
  </svg>
);

export const DayOneAchievementIcon: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="dayOneMedalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde047" />
        <stop offset="50%" stopColor="#f59e0b" />
        <stop offset="100%" stopColor="#d97706" />
      </linearGradient>
      <linearGradient id="dayOneRibbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#ef4444" />
        <stop offset="100%" stopColor="#991b1b" />
      </linearGradient>
    </defs>
    {/* Medal Ribbons */}
    <path d="M36 68 L26 110 L46 98 L54 112 L58 72 Z" fill="url(#dayOneRibbonGrad)" stroke="#7f1d1d" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M84 68 L94 110 L74 98 L66 112 L62 72 Z" fill="url(#dayOneRibbonGrad)" stroke="#7f1d1d" strokeWidth="2.5" strokeLinejoin="round" />
    {/* Sunburst Medal Disc */}
    <circle cx="60" cy="50" r="38" fill="url(#dayOneMedalGrad)" stroke="#fef08a" strokeWidth="4.5" />
    <circle cx="60" cy="50" r="29" fill="#b45309" stroke="#fde047" strokeWidth="2" />
    {/* Bold "#1" Emblem */}
    <path
      d="M57 32 H65 V68 H56 V43 L48 48 L45 40 L57 32 Z"
      fill="#fef9c3"
      stroke="#78350f"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Star Sparkles */}
    <path d="M20 26 L22 30 L26 32 L22 34 L20 38 L18 34 L14 32 L18 30 Z" fill="#fef08a" />
    <path d="M100 26 L102 30 L106 32 L102 34 L100 38 L98 34 L94 32 L98 30 Z" fill="#fef08a" />
  </svg>
);

export const LegendaryAchievementIcon: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="legendShieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fbbf24" />
        <stop offset="55%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#c2410c" />
      </linearGradient>
    </defs>
    {/* Flaming Crest */}
    <polygon
      points="60,8 98,28 106,74 60,112 14,74 22,28"
      fill="url(#legendShieldGrad)"
      stroke="#fef08a"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <polygon
      points="60,22 70,46 96,49 76,66 82,92 60,78 38,92 44,66 24,49 50,46"
      fill="#fef3c7"
      stroke="#9a3412"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <circle cx="60" cy="60" r="10" fill="#ff910f" stroke="#7c2d12" strokeWidth="2.5" />
  </svg>
);

export const ChromaAchievementIcon: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chromaPrismGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#67e8f9" />
        <stop offset="50%" stopColor="#00ccff" />
        <stop offset="100%" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    {/* Crystalline Diamond */}
    <polygon
      points="60,8 108,48 60,112 12,48"
      fill="url(#chromaPrismGrad)"
      stroke="#e0f2fe"
      strokeWidth="4.5"
      strokeLinejoin="round"
    />
    <polygon points="60,8 84,48 60,112 36,48" fill="rgba(255,255,255,0.22)" />
    <line x1="12" y1="48" x2="108" y2="48" stroke="#e0f2fe" strokeWidth="3" />
    <polygon points="36,48 60,22 84,48 60,90" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinejoin="round" />
    <path d="M92 16 L94 21 L99 23 L94 25 L92 30 L90 25 L85 23 L90 21 Z" fill="#ffffff" />
  </svg>
);

export const OpAchievementIcon: React.FC<{ className?: string }> = ({
  className = 'w-20 h-20',
}) => (
  <svg viewBox="0 0 120 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="opMysticGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e879f9" />
        <stop offset="50%" stopColor="#9900ff" />
        <stop offset="100%" stopColor="#4c1d95" />
      </linearGradient>
    </defs>
    {/* Mystic Star-Burst Crest */}
    <circle cx="60" cy="60" r="48" fill="url(#opMysticGrad)" stroke="#fde047" strokeWidth="4.5" />
    <circle cx="60" cy="60" r="38" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeDasharray="6 4" />
    {/* Bold OP Emblem */}
    <text
      x="60"
      y="72"
      textAnchor="middle"
      fill="#fef08a"
      stroke="#4c1d95"
      strokeWidth="4"
      paintOrder="stroke fill"
      fontFamily="'Titan One', cursive, sans-serif"
      fontSize="36"
      fontWeight="bold"
    >
      OP
    </text>
    {/* Sparkles */}
    <path d="M26 24 L28 29 L33 31 L28 33 L26 38 L24 33 L19 31 L24 29 Z" fill="#fef08a" />
    <path d="M94 82 L96 86 L100 88 L96 90 L94 94 L92 90 L88 88 L92 86 Z" fill="#fef08a" />
  </svg>
);

export type AchievementId =
  | 'owner'
  | 'developer'
  | 'day_one'
  | 'legendary'
  | 'chroma'
  | 'op';

export interface AchievementDefinition {
  id: AchievementId;
  name: string;
  tierLabel: string;
  accentColor: string;
  bgGradient: string;
  description: string;
  howToUnlock: string;
}

export const ACHIEVEMENTS_LIST: AchievementDefinition[] = [
  {
    id: 'day_one',
    name: 'Day One',
    tierLabel: 'FOUNDING PLAYER',
    accentColor: '#f59e0b',
    bgGradient: 'from-yellow-400 via-amber-500 to-orange-600',
    description: "You've been with us since day one!",
    howToUnlock: 'Awarded to players who joined CLICKET since Day One.',
  },
  {
    id: 'legendary',
    name: 'Legendary',
    tierLabel: 'LEGENDARY DROP',
    accentColor: '#ff910f',
    bgGradient: 'from-amber-400 via-orange-500 to-red-600',
    description: 'Obtained a Legendary Blook!',
    howToUnlock: 'Unlock any Legendary Blook from a Pack, Crafting, Bazaar, or Trade.',
  },
  {
    id: 'chroma',
    name: 'Chroma',
    tierLabel: 'CHROMA DROP',
    accentColor: '#00ccff',
    bgGradient: 'from-cyan-400 via-sky-500 to-blue-700',
    description: 'Obtained an ultra-rare Chroma Blook!',
    howToUnlock: 'Unlock any Chroma Blook from a Pack, Crafting, Bazaar, or Trade.',
  },
  {
    id: 'op',
    name: 'OP',
    tierLabel: 'MYSTICAL DROP',
    accentColor: '#9900ff',
    bgGradient: 'from-fuchsia-500 via-purple-600 to-indigo-900',
    description: 'Obtained a Mystical Blook — unstoppable luck!',
    howToUnlock: 'Unlock any Mystical Blook from a Pack, Crafting, Bazaar, or Trade.',
  },
  {
    id: 'owner',
    name: 'Owner',
    tierLabel: 'FOUNDER BADGE',
    accentColor: '#dc2626',
    bgGradient: 'from-amber-500 via-red-600 to-rose-800',
    description: 'Awarded exclusively to the Creator & Owner of CLICKET.',
    howToUnlock: 'Granted to the official Clicket owner account.',
  },
  {
    id: 'developer',
    name: 'Developer',
    tierLabel: 'BUILDER BADGE',
    accentColor: '#0ea5e9',
    bgGradient: 'from-cyan-500 via-blue-600 to-indigo-800',
    description: 'Awarded to the engineers & builders who help craft CLICKET.',
    howToUnlock: 'Granted by the Clicket Owner to verified developers.',
  },
];

export const renderAchievementIcon = (id: AchievementId, className = 'w-20 h-20') => {
  switch (id) {
    case 'owner':
      return <OwnerAchievementIcon className={className} />;
    case 'developer':
      return <DeveloperAchievementIcon className={className} />;
    case 'day_one':
      return <DayOneAchievementIcon className={className} />;
    case 'legendary':
      return <LegendaryAchievementIcon className={className} />;
    case 'chroma':
      return <ChromaAchievementIcon className={className} />;
    case 'op':
      return <OpAchievementIcon className={className} />;
  }
};

interface AchievementsViewProps {
  unlockedIds: string[];
  sessionToken: string | null;
  onRefreshUser: () => Promise<void>;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({
  unlockedIds,
  sessionToken,
  onRefreshUser,
}) => {
  const isOwner = unlockedIds.includes('owner');
  const [targetUsername, setTargetUsername] = useState('');
  const [selectedAch, setSelectedAch] = useState<AchievementId>('developer');
  const [grantMode, setGrantMode] = useState<boolean>(true);
  const [statusMsg, setStatusMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const unlockedCount = ACHIEVEMENTS_LIST.filter((a) => unlockedIds.includes(a.id)).length;

  const handleGrantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken || !targetUsername.trim()) return;
    setSubmitting(true);
    setStatusMsg(null);
    try {
      const res = await apiFetch('/api/achievements/grant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          username: targetUsername.trim(),
          achievementId: selectedAch,
          grant: grantMode,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusMsg({ ok: false, text: data.error || 'Could not update achievement.' });
      } else {
        const achDef = ACHIEVEMENTS_LIST.find((a) => a.id === selectedAch);
        setStatusMsg({
          ok: true,
          text: `${grantMode ? 'Granted' : 'Removed'} ${achDef?.name || selectedAch} badge for ${data.targetUsername}!`,
        });
        setTargetUsername('');
        await onRefreshUser();
      }
    } catch {
      setStatusMsg({ ok: false, text: 'Network error while updating achievement.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 px-6 sm:px-9 pt-6 pb-16 min-h-full flex flex-col max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-titan text-white text-[44px] leading-none tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.18)]">
            Achievements
          </h1>
          <p className="font-nunito font-extrabold text-white/90 text-sm mt-1">
            Special CLICKET milestones, rarity drops & creator honors
          </p>
        </div>

        <div className="bg-[#991b1b] text-white px-4 py-2 rounded-2xl border-2 border-white/20 flex items-center gap-2 shadow-md">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="font-titan text-lg tracking-wide">
            {unlockedCount} / {ACHIEVEMENTS_LIST.length} Unlocked
          </span>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ACHIEVEMENTS_LIST.map((ach) => {
          const isUnlocked = unlockedIds.includes(ach.id);
          return (
            <div
              key={ach.id}
              className={`rounded-3xl p-6 shadow-[0_8px_0_rgba(0,0,0,0.2)] border-4 flex flex-col justify-between gap-5 transition-transform ${
                isUnlocked
                  ? 'bg-white border-amber-300'
                  : 'bg-white/90 border-white/40'
              }`}
            >
              <div className="flex items-start gap-5">
                {/* Achievement Icon Box */}
                <div
                  className={`relative w-24 h-24 rounded-3xl shrink-0 flex items-center justify-center p-2 shadow-inner ${
                    isUnlocked
                      ? `bg-gradient-to-br ${ach.bgGradient}`
                      : 'bg-slate-200'
                  }`}
                >
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={!isUnlocked ? { filter: 'grayscale(1) opacity(0.55)' } : undefined}
                  >
                    {renderAchievementIcon(ach.id, 'w-20 h-20 drop-shadow-md')}
                  </div>

                  {!isUnlocked && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-700 text-white border-2 border-white flex items-center justify-center shadow">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Achievement Details */}
                <div className="flex-1 min-w-0">
                  <span
                    className="inline-block px-2.5 py-0.5 rounded-lg font-nunito font-black text-[11px] tracking-wider text-white mb-1.5"
                    style={{
                      backgroundColor: isUnlocked ? ach.accentColor : '#94a3b8',
                    }}
                  >
                    {ach.tierLabel}
                  </span>
                  <h2 className="font-titan text-3xl text-slate-800 leading-tight">
                    {ach.name}
                  </h2>
                  <p className="font-nunito font-bold text-sm text-slate-600 mt-1 leading-snug">
                    {ach.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between gap-3">
                <span className="font-nunito font-extrabold text-xs text-slate-400">
                  {ach.howToUnlock}
                </span>

                {isUnlocked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-100 text-emerald-700 font-nunito font-black text-xs shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Unlocked</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 text-slate-500 font-nunito font-black text-xs shrink-0">
                    <Lock className="w-3.5 h-3.5" />
                    <span>Locked</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Owner-only Badge Management Panel */}
      {isOwner && (
        <div className="mt-8 bg-white rounded-3xl p-6 shadow-[0_8px_0_rgba(0,0,0,0.18)] border-2 border-amber-300">
          <div className="flex items-center gap-2.5 mb-2">
            <ShieldCheck className="w-6 h-6 text-[#dc2626]" />
            <h3 className="font-titan text-2xl text-[#dc2626]">Owner Badge Controls</h3>
          </div>
          <p className="font-nunito font-bold text-xs text-slate-500 mb-4">
            As the Clicket Owner, you can grant or revoke any achievement badge for any player username.
          </p>

          {statusMsg && (
            <div
              className={`mb-4 px-4 py-2.5 rounded-xl font-nunito font-extrabold text-xs border-2 ${
                statusMsg.ok
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <form onSubmit={handleGrantSubmit} className="flex flex-wrap items-center gap-3">
            <input
              type="text"
              value={targetUsername}
              onChange={(e) => setTargetUsername(e.target.value)}
              placeholder="Player username..."
              className="flex-1 min-w-[180px] px-4 py-2.5 rounded-xl border-2 border-slate-200 font-nunito font-bold text-sm text-slate-800 focus:outline-none focus:border-[#dc2626]"
            />

            <select
              value={selectedAch}
              onChange={(e) => setSelectedAch(e.target.value as AchievementId)}
              className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 font-nunito font-extrabold text-sm text-slate-700 bg-white cursor-pointer"
            >
              {ACHIEVEMENTS_LIST.map((ach) => (
                <option key={ach.id} value={ach.id}>
                  {ach.name}
                </option>
              ))}
            </select>

            <select
              value={grantMode ? 'grant' : 'revoke'}
              onChange={(e) => setGrantMode(e.target.value === 'grant')}
              className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 font-nunito font-extrabold text-sm text-slate-700 bg-white cursor-pointer"
            >
              <option value="grant">Grant Badge</option>
              <option value="revoke">Revoke Badge</option>
            </select>

            <button
              type="submit"
              disabled={submitting || !targetUsername.trim()}
              className="px-5 py-2.5 rounded-xl bg-[#f87171] hover:brightness-105 shadow-[0_4px_0_#dc2626] active:translate-y-0.5 active:shadow-none text-white font-titan text-base cursor-pointer disabled:opacity-50 whitespace-nowrap shrink-0"
            >
              {submitting ? 'Saving...' : 'Apply'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
