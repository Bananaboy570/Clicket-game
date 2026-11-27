import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  BarChart3,
  Crown,
  Medal,
  RefreshCw,
  Search,
  Sparkles,
  User,
  Briefcase,
} from 'lucide-react';
import {
  BLOOK_BY_ID,
  RARITY_COLORS,
  RARITY_RANK,
  calculateInventoryWorth,
  type Rarity,
} from '../data/blooks';
import { BlookArt, BlooketTokenIcon, DefaultAvatarPfp } from './BlookArt';
import { OwnerAchievementIcon, DeveloperAchievementIcon } from './AchievementsView';
import { apiFetch } from '../lib/apiClient';
import {
  fetchFirestoreLeaderboard,
  type FirestoreLeaderboardProfile,
} from '../firebase';

export interface LeaderboardEntry {
  id: string;
  username: string;
  tokens: number;
  blooksWorth: number;
  totalWorth: number;
  uniqueBlooksCount: number;
  totalBlooksCount: number;
  mostValuableBlookId?: string;
  equippedBlookId?: string;
  achievements?: string[];
  isOwner?: boolean;
  clanTag?: string;
  clanColor?: string;
}

type SortMetric = 'totalWorth' | 'blooksWorth' | 'tokens';

interface LeaderboardViewProps {
  myUserId: string;
  myUsername: string;
  myTokens: number;
  myInventory: Record<string, number>;
  myEquippedBlookId: string;
  myAchievements: string[];
  myIsOwner: boolean;
  myClanInfo: { tag: string; bannerColor: string } | null;
  onGoToMarket?: () => void;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({
  myUserId,
  myUsername,
  myTokens,
  myInventory,
  myEquippedBlookId,
  myAchievements,
  myIsOwner,
  myClanInfo,
  onGoToMarket,
}) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortMetric>('totalWorth');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showRarityBreakdown, setShowRarityBreakdown] = useState<boolean>(false);

  const myWorth = useMemo(() => calculateInventoryWorth(myInventory), [myInventory]);
  const safeMyTokens = Math.max(0, Math.floor(Number(myTokens) || 0));
  const myTotalWorth = safeMyTokens + myWorth.blooksWorth;

  const myTopBlook = useMemo(
    () => (myWorth.mostValuableBlookId ? BLOOK_BY_ID.get(myWorth.mostValuableBlookId) || null : null),
    [myWorth.mostValuableBlookId]
  );

  // Compute breakdown of your Blook worth by rarity
  const myRarityBreakdown = useMemo(() => {
    const map = new Map<Rarity, { count: number; unique: number; worth: number }>();
    for (const [blookId, rawCount] of Object.entries(myInventory || {})) {
      const count = Math.floor(Number(rawCount) || 0);
      if (count <= 0) continue;
      const blook = BLOOK_BY_ID.get(blookId);
      if (!blook) continue;
      const prev = map.get(blook.rarity) || { count: 0, unique: 0, worth: 0 };
      prev.count += count;
      prev.unique += 1;
      prev.worth += Math.max(0, Math.floor(blook.sellPrice || 0)) * count;
      map.set(blook.rarity, prev);
    }
    return Array.from(map.entries())
      .map(([rarity, stats]) => ({ rarity, ...stats }))
      .sort((a, b) => RARITY_RANK[b.rarity] - RARITY_RANK[a.rarity]);
  }, [myInventory]);

  const loadLeaderboard = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const [apiRes, fsProfiles] = await Promise.all([
        apiFetch('/api/leaderboard').catch(() => null),
        fetchFirestoreLeaderboard().catch(() => [] as FirestoreLeaderboardProfile[]),
      ]);

      const merged = new Map<string, LeaderboardEntry & { updatedAt?: number }>();

      if (apiRes && apiRes.ok) {
        const data = await apiRes.json().catch(() => null);
        if (Array.isArray(data?.leaderboard)) {
          for (const item of data.leaderboard as LeaderboardEntry[]) {
            if (!item || !item.id || !item.username) continue;
            const nameKey = item.username.trim().toLowerCase();
            if (!nameKey) continue;
            const existing = merged.get(nameKey);
            if (!existing || item.totalWorth > existing.totalWorth) {
              merged.set(nameKey, item);
            }
          }
        }
      }

      for (const p of fsProfiles) {
        if (!p || !p.id || !p.username) continue;
        const nameKey = p.username.trim().toLowerCase();
        if (!nameKey) continue;
        const existing = merged.get(nameKey);
        const existingUpdatedAt = existing?.updatedAt || 0;
        const fsUpdatedAt = p.updatedAt || 0;
        const shouldUseFs =
          !existing ||
          (existing.id === p.id && p.totalWorth >= existing.totalWorth) ||
          fsUpdatedAt > existingUpdatedAt && p.totalWorth >= existing.totalWorth ||
          p.totalWorth > existing.totalWorth;

        if (shouldUseFs) {
          merged.set(nameKey, {
            id: p.id,
            username: p.username,
            tokens: p.tokens,
            blooksWorth: p.blooksWorth,
            totalWorth: p.totalWorth,
            uniqueBlooksCount: p.uniqueBlooksCount,
            totalBlooksCount: p.totalBlooksCount,
            mostValuableBlookId: p.mostValuableBlookId,
            equippedBlookId: p.equippedBlookId,
            achievements: p.achievements,
            isOwner: p.isOwner,
            clanTag: p.clanTag,
            clanColor: p.clanColor,
            updatedAt: p.updatedAt,
          });
        }
      }

      setEntries(Array.from(merged.values()));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadLeaderboard(false);
  }, [loadLeaderboard]);

  // Always overlay the active player's live in-memory tokens & blooks worth (deduplicated by username)
  const combinedEntries = useMemo(() => {
    const map = new Map<string, LeaderboardEntry>();
    const myNameKey = myUsername.trim().toLowerCase();
    for (const entry of entries) {
      const nameKey = entry.username.trim().toLowerCase();
      if (!nameKey || entry.id === myUserId || nameKey === myNameKey) continue;
      if (!map.has(nameKey)) {
        map.set(nameKey, entry);
      }
    }
    const safeAvatar =
      myEquippedBlookId && (myInventory[myEquippedBlookId] || 0) > 0
        ? myEquippedBlookId
        : '';

    map.set(myNameKey || myUserId, {
      id: myUserId,
      username: myUsername,
      tokens: safeMyTokens,
      blooksWorth: myWorth.blooksWorth,
      totalWorth: myTotalWorth,
      uniqueBlooksCount: myWorth.uniqueBlooksCount,
      totalBlooksCount: myWorth.totalBlooksCount,
      mostValuableBlookId: myWorth.mostValuableBlookId,
      equippedBlookId: safeAvatar,
      achievements: myAchievements,
      isOwner: myIsOwner,
      clanTag: myClanInfo?.tag,
      clanColor: myClanInfo?.bannerColor,
    });

    const list = Array.from(map.values());
    list.sort((a, b) => {
      if (sortBy === 'blooksWorth') {
        return b.blooksWorth - a.blooksWorth || b.totalWorth - a.totalWorth || b.tokens - a.tokens;
      }
      if (sortBy === 'tokens') {
        return b.tokens - a.tokens || b.totalWorth - a.totalWorth || b.blooksWorth - a.blooksWorth;
      }
      return b.totalWorth - a.totalWorth || b.blooksWorth - a.blooksWorth || b.tokens - a.tokens;
    });
    return list;
  }, [
    entries,
    myUserId,
    myUsername,
    safeMyTokens,
    myWorth,
    myTotalWorth,
    myEquippedBlookId,
    myInventory,
    myAchievements,
    myIsOwner,
    myClanInfo,
    sortBy,
  ]);

  const myRank = useMemo(() => {
    const idx = combinedEntries.findIndex((e) => e.id === myUserId);
    return idx >= 0 ? idx + 1 : 1;
  }, [combinedEntries, myUserId]);

  const filteredEntries = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return combinedEntries;
    return combinedEntries.filter(
      (e) =>
        e.username.toLowerCase().includes(q) ||
        (e.clanTag && e.clanTag.toLowerCase().includes(q))
    );
  }, [combinedEntries, searchQuery]);

  const blooksSharePct =
    myTotalWorth > 0 ? Math.round((myWorth.blooksWorth / myTotalWorth) * 100) : 0;
  const tokensSharePct = myTotalWorth > 0 ? 100 - blooksSharePct : 0;

  const safeMyAvatar =
    myEquippedBlookId && (myInventory[myEquippedBlookId] || 0) > 0
      ? myEquippedBlookId
      : '';

  return (
    <div className="relative z-10 px-4 sm:px-8 pt-6 pb-16 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-titan text-white text-[38px] sm:text-[44px] leading-none drop-shadow-[0_3px_0_rgba(0,0,0,0.18)]">
            Leaderboard
          </h1>
          <p className="font-nunito font-bold text-white/95 text-sm sm:text-base mt-1.5 drop-shadow-[0_1px_0_rgba(0,0,0,0.15)]">
            Ranked by total net worth — your tokens plus the combined value of all your Blooks.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void loadLeaderboard(true)}
          disabled={refreshing}
          className="px-4 py-2.5 rounded-xl bg-white hover:bg-red-50 text-[#dc2626] font-titan text-sm shadow-[0_4px_0_#991b1b] active:translate-y-0.5 active:shadow-none transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh Ranks'}</span>
        </button>
      </div>

      {/* YOUR WORTH HERO CARD */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_8px_0_rgba(0,0,0,0.18)] border-2 border-white mb-7">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-14 h-14 rounded-2xl bg-red-50 border-2 border-red-100 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
              {safeMyAvatar ? (
                <BlookArt id={safeMyAvatar} animated className="w-full h-full" />
              ) : (
                <DefaultAvatarPfp className="w-full h-full rounded-xl" />
              )}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-titan text-2xl sm:text-[26px] text-slate-800 truncate">
                  {myUsername}
                </h2>
                {myIsOwner && (
                  <span title="Official Owner" className="shrink-0">
                    <OwnerAchievementIcon className="w-5 h-5" />
                  </span>
                )}
                {myAchievements.includes('developer') && !myIsOwner && (
                  <span title="Developer" className="shrink-0">
                    <DeveloperAchievementIcon className="w-5 h-5" />
                  </span>
                )}
                {myClanInfo?.tag && (
                  <span
                    className="font-nunito font-black text-xs px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: myClanInfo.bannerColor || '#dc2626' }}
                  >
                    [{myClanInfo.tag}]
                  </span>
                )}
              </div>
              <p className="font-nunito font-bold text-xs sm:text-sm text-slate-500 mt-0.5">
                Your Net Worth Summary ·{' '}
                <span className="text-slate-700 font-extrabold">
                  {myWorth.totalBlooksCount.toLocaleString()}
                </span>{' '}
                {myWorth.totalBlooksCount === 1 ? 'Blook' : 'Blooks'} owned ({myWorth.uniqueBlooksCount} unique)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-amber-50 border-2 border-amber-200 rounded-2xl px-4 py-2.5 shrink-0">
            <Medal className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <span className="block font-nunito font-extrabold text-[11px] uppercase tracking-wide text-amber-800">
                Your Rank
              </span>
              <span className="font-titan text-2xl text-amber-950 tabular-nums leading-none">
                #{myRank}
                <span className="font-nunito font-bold text-xs text-amber-700 ml-1">
                  of {combinedEntries.length}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* 3 Core Worth Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {/* Total Worth */}
          <div className="rounded-2xl bg-gradient-to-br from-[#dc2626] to-[#991b1b] text-white p-5 shadow-[0_5px_0_#7f1d1d]">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-nunito font-extrabold text-xs uppercase tracking-wider text-red-100">
                Your Total Worth
              </span>
              <BarChart3 className="w-4 h-4 text-amber-300" />
            </div>
            <div className="flex items-center gap-2.5">
              <BlooketTokenIcon className="w-8 h-8 shrink-0" />
              <span className="font-titan text-3xl sm:text-4xl tabular-nums leading-none">
                {myTotalWorth.toLocaleString()}
              </span>
            </div>
            <p className="font-nunito font-bold text-xs text-red-100 mt-2.5 tabular-nums">
              {myWorth.blooksWorth.toLocaleString()} from Blooks + {safeMyTokens.toLocaleString()} Tokens
            </p>
          </div>

          {/* All Blooks Worth */}
          <div className="rounded-2xl bg-slate-50 border-2 border-slate-200 p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-nunito font-extrabold text-xs uppercase tracking-wider text-slate-500">
                All Blooks Worth
              </span>
              <Briefcase className="w-4 h-4 text-[#dc2626]" />
            </div>
            <div className="flex items-center gap-2">
              <BlooketTokenIcon className="w-7 h-7 shrink-0" />
              <span className="font-titan text-3xl text-slate-800 tabular-nums leading-none">
                {myWorth.blooksWorth.toLocaleString()}
              </span>
            </div>
            <p className="font-nunito font-bold text-xs text-slate-500 mt-2.5 tabular-nums">
              {myWorth.totalBlooksCount.toLocaleString()} total Blooks · {myWorth.uniqueBlooksCount} unique
            </p>
          </div>

          {/* Your Tokens */}
          <div className="rounded-2xl bg-slate-50 border-2 border-slate-200 p-5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="font-nunito font-extrabold text-xs uppercase tracking-wider text-slate-500">
                Your Tokens
              </span>
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div className="flex items-center gap-2">
              <BlooketTokenIcon className="w-7 h-7 shrink-0" />
              <span className="font-titan text-3xl text-slate-800 tabular-nums leading-none">
                {safeMyTokens.toLocaleString()}
              </span>
            </div>
            <p className="font-nunito font-bold text-xs text-slate-500 mt-2.5 tabular-nums">
              {tokensSharePct}% of your total net worth
            </p>
          </div>
        </div>

        {/* Worth Composition Bar + Top Blook & Rarity Breakdown */}
        <div className="mt-5 pt-5 border-t border-slate-100 flex flex-col gap-4">
          <div>
            <div className="flex items-center justify-between text-xs font-nunito font-extrabold text-slate-600 mb-1.5 tabular-nums">
              <span>Blooks Worth: {blooksSharePct}% ({myWorth.blooksWorth.toLocaleString()})</span>
              <span>Tokens: {tokensSharePct}% ({safeMyTokens.toLocaleString()})</span>
            </div>
            <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
              <div
                className="h-full bg-[#dc2626] transition-all duration-300"
                style={{ width: `${blooksSharePct}%` }}
              />
              <div
                className="h-full bg-[#fbbf24] transition-all duration-300"
                style={{ width: `${tokensSharePct}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            {myTopBlook ? (
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 p-1 flex items-center justify-center shrink-0">
                  <BlookArt id={myTopBlook.id} animated className="w-full h-full" />
                </div>
                <div>
                  <span className="block font-nunito font-extrabold text-[11px] uppercase tracking-wide text-slate-400">
                    Most Valuable Blook
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-titan text-base text-slate-800">
                      {myTopBlook.name}
                    </span>
                    <span
                      className="font-nunito font-black text-xs"
                      style={{
                        color:
                          myTopBlook.rarity === 'Godly'
                            ? '#a16207'
                            : RARITY_COLORS[myTopBlook.rarity],
                      }}
                    >
                      {myTopBlook.rarity}
                    </span>
                    <span className="font-nunito font-bold text-xs text-slate-500 tabular-nums">
                      · {myTopBlook.sellPrice.toLocaleString()} each ({myInventory[myTopBlook.id] || 0}x)
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <p className="font-nunito font-bold text-sm text-slate-500">
                  You don&apos;t own any Blooks yet — open packs in the Market to grow your net worth!
                </p>
                {onGoToMarket && (
                  <button
                    type="button"
                    onClick={onGoToMarket}
                    className="px-3.5 py-1.5 rounded-xl bg-[#fbbf24] hover:brightness-105 text-amber-950 font-titan text-xs shadow-[0_3px_0_#b45309] cursor-pointer whitespace-nowrap shrink-0"
                  >
                    Go to Market
                  </button>
                )}
              </div>
            )}

            {myRarityBreakdown.length > 0 && (
              <button
                type="button"
                onClick={() => setShowRarityBreakdown((v) => !v)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-nunito font-extrabold text-xs cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                {showRarityBreakdown ? 'Hide Rarity Breakdown' : 'Show Worth by Rarity'}
              </button>
            )}
          </div>

          {showRarityBreakdown && myRarityBreakdown.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 pt-2">
              {myRarityBreakdown.map((item) => {
                const color = RARITY_COLORS[item.rarity];
                return (
                  <div
                    key={item.rarity}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span
                        className="block font-nunito font-black text-xs truncate"
                        style={{ color: item.rarity === 'Godly' ? '#a16207' : color }}
                      >
                        {item.rarity}
                      </span>
                      <span className="block font-nunito font-bold text-[11px] text-slate-500 tabular-nums">
                        {item.count.toLocaleString()} owned ({item.unique} unique)
                      </span>
                    </div>
                    <span className="font-titan text-sm text-slate-800 tabular-nums shrink-0">
                      {item.worth.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* GLOBAL WORTH LEADERBOARD */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 shadow-[0_8px_0_rgba(0,0,0,0.18)] border-2 border-white">
        {/* Controls Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl self-start">
            {(
              [
                { id: 'totalWorth', label: 'Total Worth' },
                { id: 'blooksWorth', label: 'Blooks Worth' },
                { id: 'tokens', label: 'Tokens' },
              ] as { id: SortMetric; label: string }[]
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSortBy(tab.id)}
                className={`px-3.5 py-1.5 rounded-lg font-nunito font-extrabold text-xs sm:text-sm transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  sortBy === tab.id
                    ? 'bg-white text-[#dc2626] shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player or clan tag..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border-2 border-slate-200 focus:border-[#dc2626] outline-none font-nunito font-bold text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Rankings Table */}
        {loading && entries.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-titan text-xl text-slate-600">Loading player rankings...</p>
          </div>
        ) : filteredEntries.length === 0 ? (
          <div className="py-12 text-center">
            <p className="font-titan text-xl text-slate-700 mb-1">No matching players found</p>
            <p className="font-nunito font-bold text-sm text-slate-500">
              Try clearing your search filter to view everyone on the leaderboard.
            </p>
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[620px]">
              <thead>
                <tr className="border-b-2 border-slate-100 text-[11px] font-nunito font-black uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 pl-3 pr-2 w-16">Rank</th>
                  <th className="py-2.5 px-3">Player</th>
                  <th className="py-2.5 px-3 text-right">Blooks</th>
                  <th className="py-2.5 px-3 text-right">Blooks Worth</th>
                  <th className="py-2.5 px-3 text-right">Tokens</th>
                  <th className="py-2.5 pl-3 pr-3 text-right">Total Worth</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEntries.map((player) => {
                  const globalRank =
                    combinedEntries.findIndex((p) => p.id === player.id) + 1;
                  const isMe = player.id === myUserId;
                  const isTop1 = globalRank === 1;
                  const isTop2 = globalRank === 2;
                  const isTop3 = globalRank === 3;
                  const topBlook = player.mostValuableBlookId
                    ? BLOOK_BY_ID.get(player.mostValuableBlookId)
                    : undefined;

                  return (
                    <tr
                      key={player.id}
                      className={`transition-colors ${
                        isMe
                          ? 'bg-red-50/80 hover:bg-red-50'
                          : 'hover:bg-slate-50/80'
                      }`}
                    >
                      <td className="py-3 pl-3 pr-2">
                        <span
                          className={`inline-flex items-center justify-center min-w-[34px] h-8 px-2 rounded-lg font-titan text-sm tabular-nums ${
                            isTop1
                              ? 'bg-amber-400 text-amber-950 shadow-sm'
                              : isTop2
                              ? 'bg-slate-200 text-slate-800'
                              : isTop3
                              ? 'bg-orange-200 text-orange-950'
                              : 'text-slate-500 font-nunito font-black'
                          }`}
                        >
                          {isTop1 ? (
                            <span className="flex items-center gap-1">
                              <Crown className="w-3.5 h-3.5" />1
                            </span>
                          ) : (
                            `#${globalRank}`
                          )}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                            {player.equippedBlookId ? (
                              <BlookArt
                                id={player.equippedBlookId}
                                className="w-full h-full"
                              />
                            ) : (
                              <DefaultAvatarPfp className="w-full h-full rounded-lg" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-nunito font-black text-sm sm:text-base text-slate-800 truncate max-w-[180px]">
                                {player.username}
                              </span>
                              {player.isOwner && (
                                <span title="Official Owner" className="shrink-0">
                                  <OwnerAchievementIcon className="w-4 h-4" />
                                </span>
                              )}
                              {player.achievements?.includes('developer') &&
                                !player.isOwner && (
                                  <span title="Developer" className="shrink-0">
                                    <DeveloperAchievementIcon className="w-4 h-4" />
                                  </span>
                                )}
                              {player.clanTag && (
                                <span
                                  className="font-nunito font-black text-[10px] px-1.5 py-0.5 rounded text-white shrink-0"
                                  style={{
                                    backgroundColor: player.clanColor || '#dc2626',
                                  }}
                                >
                                  [{player.clanTag}]
                                </span>
                              )}
                              {isMe && (
                                <span className="font-nunito font-black text-[11px] text-[#dc2626] shrink-0">
                                  (You)
                                </span>
                              )}
                            </div>
                            {topBlook && (
                              <span className="block font-nunito font-bold text-[11px] text-slate-400 truncate">
                                Best: {topBlook.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 text-right font-nunito font-bold text-xs sm:text-sm text-slate-600 tabular-nums">
                        {player.totalBlooksCount.toLocaleString()}
                        <span className="text-slate-400 ml-1">
                          ({player.uniqueBlooksCount})
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right font-nunito font-extrabold text-sm text-slate-700 tabular-nums">
                        {player.blooksWorth.toLocaleString()}
                      </td>

                      <td className="py-3 px-3 text-right font-nunito font-extrabold text-sm text-slate-700 tabular-nums">
                        {player.tokens.toLocaleString()}
                      </td>

                      <td className="py-3 pl-3 pr-3 text-right">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <BlooketTokenIcon className="w-4 h-4 shrink-0" />
                          <span className="font-titan text-base sm:text-lg text-[#dc2626] tabular-nums">
                            {player.totalWorth.toLocaleString()}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};
