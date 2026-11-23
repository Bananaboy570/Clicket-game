import React, { useState, useEffect, useCallback } from 'react';
import {
  Crown,
  Users,
  Shield,
  Coins,
  Sparkles,
  Search,
  RefreshCw,
  Trash2,
  Clock,
  Plus,
  Minus,
  Gift,
  User,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { ALL_BLOOKS, RARITY_COLORS } from '../data/blooks';
import { BlookArt, BlooketTokenIcon } from './BlookArt';
import { OwnerAchievementIcon, DeveloperAchievementIcon } from './AchievementsView';
import { apiFetch } from '../lib/apiClient';
import type { AuthenticatedUser } from './AuthScreen';

interface AdminUserSummary {
  id: string;
  username: string;
  tokens: number;
  uniqueBlooksCount: number;
  totalBlooksCount: number;
  equippedBlookId: string;
  achievements: string[];
  clanId: string | null;
  bestDailyClicks: number;
  clickUpgradeLevel: number;
  createdAt: string;
  inventory: Record<string, number>;
}

interface AdminClanSummary {
  id: string;
  name: string;
  tag: string;
  memberCount: number;
  powerScore: number;
  leaderUsername: string;
}

interface AdminOverviewStats {
  totalUsers: number;
  totalTokens: number;
  totalClans: number;
  activeSessions: number;
}

interface AdminPanelViewProps {
  currentUser: AuthenticatedUser;
  sessionToken: string | null;
  luckMultiplier: number;
  onChangeLuckMultiplier: (mult: number) => void;
  onAddSelfTokens: (amount: number) => void;
  onSyncSelfUser: (user: AuthenticatedUser) => void;
  onRefreshUser: () => Promise<void>;
}

export const AdminPanelView: React.FC<AdminPanelViewProps> = ({
  currentUser,
  sessionToken,
  luckMultiplier,
  onChangeLuckMultiplier,
  onAddSelfTokens,
  onSyncSelfUser,
  onRefreshUser,
}) => {
  const [stats, setStats] = useState<AdminOverviewStats>({
    totalUsers: 0,
    totalTokens: 0,
    totalClans: 0,
    activeSessions: 0,
  });
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [clans, setClans] = useState<AdminClanSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string>(currentUser.id);
  const [tokenAmountInput, setTokenAmountInput] = useState<string>('500');
  const [selectedBlookId, setSelectedBlookId] = useState<string>(ALL_BLOOKS[0]?.id || 'tightrope-walker');
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);
  const [confirmDeleteClanId, setConfirmDeleteClanId] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<{ ok: boolean; text: string } | null>(null);

  const loadOverview = useCallback(async () => {
    if (!sessionToken) return;
    setLoading(true);
    try {
      const res = await apiFetch('/api/admin/overview', {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setStatusBanner({ ok: false, text: data.error || 'Could not load admin overview.' });
        return;
      }
      setStats(data.stats || { totalUsers: 0, totalTokens: 0, totalClans: 0, activeSessions: 0 });
      const fetchedUsers: AdminUserSummary[] = Array.isArray(data.users) ? data.users : [];
      setUsers(fetchedUsers);
      setClans(Array.isArray(data.clans) ? data.clans : []);
      if (fetchedUsers.length > 0 && !fetchedUsers.some((u) => u.id === selectedUserId)) {
        setSelectedUserId(fetchedUsers[0].id);
      }
    } catch {
      setStatusBanner({ ok: false, text: 'Network error while loading admin panel.' });
    } finally {
      setLoading(false);
    }
  }, [sessionToken, selectedUserId]);

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const showNotice = (ok: boolean, text: string) => {
    setStatusBanner({ ok, text });
  };

  const handleTokenAction = async (userId: string, mode: 'add' | 'set', amount: number) => {
    if (!sessionToken || !Number.isFinite(amount)) return;
    setBusyKey(`tokens-${userId}`);
    try {
      const res = await apiFetch('/api/admin/user/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ userId, mode, amount: Math.floor(amount) }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(false, data.error || 'Failed to update tokens.');
        return;
      }
      if (data.selfUser) {
        onSyncSelfUser(data.selfUser);
      }
      showNotice(
        true,
        `${mode === 'set' ? 'Set' : amount >= 0 ? 'Added' : 'Removed'} tokens for ${data.targetUser?.username || 'player'} (now ${(data.targetUser?.tokens ?? 0).toLocaleString()}).`
      );
      await loadOverview();
    } catch {
      showNotice(false, 'Network error updating tokens.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleBlookAction = async (
    userId: string,
    options: { blookId?: string; quantity?: number; unlockAll?: boolean }
  ) => {
    if (!sessionToken) return;
    setBusyKey(`blook-${userId}`);
    try {
      const res = await apiFetch('/api/admin/user/blook', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          userId,
          blookId: options.blookId,
          quantity: options.quantity ?? 1,
          unlockAll: Boolean(options.unlockAll),
          allBlookIds: options.unlockAll ? ALL_BLOOKS.map((b) => b.id) : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(false, data.error || 'Failed to update Blooks.');
        return;
      }
      if (data.selfUser) {
        onSyncSelfUser(data.selfUser);
      }
      showNotice(
        true,
        options.unlockAll
          ? `Unlocked all ${ALL_BLOOKS.length} Blooks for ${data.targetUser?.username || 'player'}!`
          : `Updated Blook inventory for ${data.targetUser?.username || 'player'}.`
      );
      await loadOverview();
    } catch {
      showNotice(false, 'Network error updating Blook inventory.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleToggleBadge = async (
    targetUsername: string,
    achievementId: 'owner' | 'developer',
    currentlyHas: boolean
  ) => {
    if (!sessionToken) return;
    setBusyKey(`badge-${targetUsername}-${achievementId}`);
    try {
      const res = await apiFetch('/api/achievements/grant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          username: targetUsername,
          achievementId,
          grant: !currentlyHas,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(false, data.error || 'Could not update badge.');
        return;
      }
      if (data.selfUser) {
        onSyncSelfUser(data.selfUser);
      }
      await onRefreshUser();
      await loadOverview();
      showNotice(
        true,
        `${!currentlyHas ? 'Granted' : 'Removed'} ${achievementId === 'owner' ? 'Owner' : 'Developer'} badge for ${targetUsername}.`
      );
    } catch {
      showNotice(false, 'Network error updating badge.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleResetCooldowns = async (userId: string) => {
    if (!sessionToken) return;
    setBusyKey(`cooldown-${userId}`);
    try {
      const res = await apiFetch('/api/admin/user/reset-cooldowns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(false, data.error || 'Failed to reset cooldowns.');
        return;
      }
      if (data.selfUser) {
        onSyncSelfUser(data.selfUser);
      }
      showNotice(true, `Reset Daily Clicker, Wheel & Hourly cooldowns for ${data.targetUsername}.`);
    } catch {
      showNotice(false, 'Network error resetting cooldowns.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!sessionToken) return;
    setBusyKey(`delete-user-${userId}`);
    try {
      const res = await apiFetch('/api/admin/user/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(false, data.error || 'Could not delete player.');
        return;
      }
      setConfirmDeleteUserId(null);
      showNotice(true, `Deleted player account "${data.deletedUsername}".`);
      await loadOverview();
    } catch {
      showNotice(false, 'Network error deleting player.');
    } finally {
      setBusyKey(null);
    }
  };

  const handleDeleteClan = async (clanId: string) => {
    if (!sessionToken) return;
    setBusyKey(`delete-clan-${clanId}`);
    try {
      const res = await apiFetch('/api/admin/clan/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ clanId }),
      });
      const data = await res.json();
      if (!res.ok) {
        showNotice(false, data.error || 'Could not disband clan.');
        return;
      }
      setConfirmDeleteClanId(null);
      await onRefreshUser();
      await loadOverview();
      showNotice(true, `Disbanded clan "${data.deletedClanName}".`);
    } catch {
      showNotice(false, 'Network error disbanding clan.');
    } finally {
      setBusyKey(null);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );
  const selectedUser = users.find((u) => u.id === selectedUserId) || filteredUsers[0] || null;
  const selectedBlook = ALL_BLOOKS.find((b) => b.id === selectedBlookId) || ALL_BLOOKS[0];

  return (
    <div className="relative z-10 px-6 sm:px-9 pt-6 pb-16 min-h-full flex flex-col max-w-6xl">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-[#991b1b] border-2 border-amber-300 flex items-center justify-center shadow-lg">
            <Crown className="w-8 h-8 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-titan text-white text-[40px] leading-none tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.18)]">
                Admin Panel
              </h1>
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-300 text-amber-950 font-nunito font-black text-xs uppercase tracking-wider">
                Owner Only
              </span>
            </div>
            <p className="font-nunito font-extrabold text-white/90 text-sm mt-1">
              Manage players, tokens, Blooks, badges, cooldowns &amp; clans
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={loadOverview}
          disabled={loading}
          className="px-4 py-2.5 rounded-2xl bg-white text-[#dc2626] font-titan text-base shadow-[0_4px_0_#991b1b] active:translate-y-0.5 active:shadow-none flex items-center gap-2 cursor-pointer disabled:opacity-60"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {statusBanner && (
        <div
          className={`mb-5 px-4 py-3 rounded-2xl border-2 font-nunito font-extrabold text-sm flex items-center justify-between gap-3 shadow-md ${
            statusBanner.ok
              ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
              : 'bg-rose-50 border-rose-300 text-rose-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusBanner.ok ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{statusBanner.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusBanner(null)}
            className="text-xs font-black underline cursor-pointer shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Economy & Server Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-3xl p-4 shadow-[0_6px_0_rgba(0,0,0,0.16)] border-2 border-white/60 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-red-100 text-[#dc2626] flex items-center justify-center shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-nunito font-black text-[11px] text-slate-400 uppercase">
              Total Players
            </span>
            <span className="font-titan text-2xl text-slate-800">
              {stats.totalUsers.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-[0_6px_0_rgba(0,0,0,0.16)] border-2 border-white/60 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-nunito font-black text-[11px] text-slate-400 uppercase">
              Economy Tokens
            </span>
            <span className="font-titan text-2xl text-slate-800">
              {stats.totalTokens.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-[0_6px_0_rgba(0,0,0,0.16)] border-2 border-white/60 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-nunito font-black text-[11px] text-slate-400 uppercase">
              Total Clans
            </span>
            <span className="font-titan text-2xl text-slate-800">
              {stats.totalClans.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-4 shadow-[0_6px_0_rgba(0,0,0,0.16)] border-2 border-white/60 flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="block font-nunito font-black text-[11px] text-slate-400 uppercase">
              Pack Luck
            </span>
            <span className="font-titan text-2xl text-slate-800">{luckMultiplier}x</span>
          </div>
        </div>
      </div>

      {/* Owner Quick Self-Tools */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_8px_0_rgba(0,0,0,0.18)] border-2 border-amber-300 mb-6">
        <h2 className="font-titan text-2xl text-[#dc2626] mb-3 flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-500" />
          <span>Owner Quick Controls</span>
        </h2>

        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {[100, 1000, 10000, 100000].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => onAddSelfTokens(amt)}
              className="px-3.5 py-2 rounded-xl bg-[#fbbf24] hover:brightness-105 text-amber-950 font-nunito font-black text-sm shadow-[0_4px_0_#b45309] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer"
            >
              <BlooketTokenIcon className="w-4 h-4" />
              <span>+{amt.toLocaleString()}</span>
            </button>
          ))}

          <button
            type="button"
            disabled={busyKey === `blook-${currentUser.id}`}
            onClick={() => handleBlookAction(currentUser.id, { unlockAll: true })}
            className="px-4 py-2 rounded-xl bg-[#7c3aed] hover:brightness-110 text-white font-nunito font-black text-sm shadow-[0_4px_0_#5b21b6] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Gift className="w-4 h-4" />
            <span>Unlock All {ALL_BLOOKS.length} Blooks</span>
          </button>

          <button
            type="button"
            disabled={busyKey === `cooldown-${currentUser.id}`}
            onClick={() => handleResetCooldowns(currentUser.id)}
            className="px-4 py-2 rounded-xl bg-[#0ea5e9] hover:brightness-110 text-white font-nunito font-black text-sm shadow-[0_4px_0_#0369a1] active:translate-y-0.5 active:shadow-none flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
          >
            <Clock className="w-4 h-4" />
            <span>Reset My Cooldowns</span>
          </button>
        </div>

        {/* Pack Luck Selector */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-2">
          <span className="font-nunito font-black text-xs text-slate-500 uppercase mr-2">
            Market Pack Luck Multiplier:
          </span>
          {[1, 2, 5, 10, 100].map((mult) => (
            <button
              key={mult}
              type="button"
              onClick={() => onChangeLuckMultiplier(mult)}
              className={`px-3 py-1.5 rounded-xl font-titan text-sm cursor-pointer transition-all ${
                luckMultiplier === mult
                  ? 'bg-[#dc2626] text-white shadow-[0_3px_0_#991b1b]'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {mult}x
            </button>
          ))}
        </div>
      </div>

      {/* Main Split: Player Roster + Selected Player Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left: Player Directory */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 shadow-[0_8px_0_rgba(0,0,0,0.18)] flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="font-titan text-2xl text-slate-800">
              Players ({filteredUsers.length})
            </h2>
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players by username..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 font-nunito font-bold text-sm text-slate-800 focus:outline-none focus:border-[#dc2626]"
            />
          </div>

          <div className="flex flex-col gap-2 max-h-[440px] overflow-y-auto pr-1">
            {filteredUsers.length === 0 ? (
              <div className="py-10 text-center font-nunito font-bold text-sm text-slate-400">
                {loading ? 'Loading players...' : 'No matching players found.'}
              </div>
            ) : (
              filteredUsers.map((u) => {
                const isSelected = selectedUser?.id === u.id;
                const isOwner = u.achievements.includes('owner');
                const isDev = u.achievements.includes('developer');

                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => {
                      setSelectedUserId(u.id);
                      setConfirmDeleteUserId(null);
                    }}
                    className={`w-full text-left p-3 rounded-2xl border-2 flex items-center justify-between gap-3 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-red-50 border-[#dc2626] shadow-sm'
                        : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                        {u.equippedBlookId ? (
                          <BlookArt id={u.equippedBlookId} className="w-full h-full" />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-nunito font-black text-sm text-slate-800 truncate">
                            {u.username}
                          </span>
                          {isOwner && <OwnerAchievementIcon className="w-4 h-4 shrink-0" />}
                          {isDev && <DeveloperAchievementIcon className="w-4 h-4 shrink-0" />}
                        </div>
                        <span className="block font-nunito font-bold text-[11px] text-slate-400">
                          {u.uniqueBlooksCount}/{ALL_BLOOKS.length} Blooks · Best Daily:{' '}
                          {u.bestDailyClicks}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 font-nunito font-black text-xs shrink-0">
                      <BlooketTokenIcon className="w-4 h-4" />
                      <span>{u.tokens.toLocaleString()}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right: Selected Player Admin Inspector */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-5 shadow-[0_8px_0_rgba(0,0,0,0.18)] flex flex-col">
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 font-nunito font-bold text-sm py-16">
              Select a player on the left to manage their account.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Player Header */}
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-red-50 border-2 border-red-200 p-1 flex items-center justify-center shrink-0">
                    {selectedUser.equippedBlookId ? (
                      <BlookArt id={selectedUser.equippedBlookId} className="w-full h-full" />
                    ) : (
                      <User className="w-6 h-6 text-[#dc2626]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-titan text-2xl text-slate-800 truncate">
                        {selectedUser.username}
                      </h3>
                      {selectedUser.achievements.includes('owner') && (
                        <OwnerAchievementIcon className="w-5 h-5 shrink-0" />
                      )}
                      {selectedUser.achievements.includes('developer') && (
                        <DeveloperAchievementIcon className="w-5 h-5 shrink-0" />
                      )}
                    </div>
                    <p className="font-nunito font-bold text-xs text-slate-400">
                      Tokens: {selectedUser.tokens.toLocaleString()} · Unique Blooks:{' '}
                      {selectedUser.uniqueBlooksCount}/{ALL_BLOOKS.length}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={busyKey === `cooldown-${selectedUser.id}`}
                  onClick={() => handleResetCooldowns(selectedUser.id)}
                  className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 font-nunito font-black text-xs flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Reset Cooldowns</span>
                </button>
              </div>

              {/* Token Controls */}
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="block font-nunito font-black text-xs text-amber-900 uppercase mb-2">
                  Modify Tokens
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    value={tokenAmountInput}
                    onChange={(e) => setTokenAmountInput(e.target.value)}
                    className="w-28 px-3 py-2 rounded-xl border-2 border-amber-200 bg-white font-nunito font-black text-sm text-slate-800 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    disabled={busyKey === `tokens-${selectedUser.id}`}
                    onClick={() =>
                      handleTokenAction(selectedUser.id, 'add', Number(tokenAmountInput) || 0)
                    }
                    className="px-3 py-2 rounded-xl bg-[#5cb61f] hover:brightness-105 text-white font-nunito font-black text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                  <button
                    type="button"
                    disabled={busyKey === `tokens-${selectedUser.id}`}
                    onClick={() =>
                      handleTokenAction(selectedUser.id, 'add', -(Number(tokenAmountInput) || 0))
                    }
                    className="px-3 py-2 rounded-xl bg-[#ef4444] hover:brightness-105 text-white font-nunito font-black text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                    <span>Subtract</span>
                  </button>
                  <button
                    type="button"
                    disabled={busyKey === `tokens-${selectedUser.id}`}
                    onClick={() =>
                      handleTokenAction(selectedUser.id, 'set', Number(tokenAmountInput) || 0)
                    }
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:brightness-105 text-white font-nunito font-black text-xs cursor-pointer"
                  >
                    Set Exact
                  </button>
                </div>
              </div>

              {/* Blook Inventory Controls */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-nunito font-black text-xs text-slate-600 uppercase">
                    Grant or Remove Blooks
                  </span>
                  <button
                    type="button"
                    disabled={busyKey === `blook-${selectedUser.id}`}
                    onClick={() => handleBlookAction(selectedUser.id, { unlockAll: true })}
                    className="px-2.5 py-1 rounded-lg bg-violet-600 hover:bg-violet-700 text-white font-nunito font-black text-[11px] cursor-pointer"
                  >
                    Unlock All Blooks
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                    {selectedBlook && <BlookArt id={selectedBlook.id} className="w-full h-full" />}
                  </div>
                  <select
                    value={selectedBlookId}
                    onChange={(e) => setSelectedBlookId(e.target.value)}
                    className="flex-1 min-w-[160px] px-3 py-2 rounded-xl border-2 border-slate-200 bg-white font-nunito font-bold text-xs text-slate-800"
                  >
                    {ALL_BLOOKS.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.rarity}) — Owned: {selectedUser.inventory?.[b.id] || 0}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={busyKey === `blook-${selectedUser.id}`}
                    onClick={() =>
                      handleBlookAction(selectedUser.id, { blookId: selectedBlookId, quantity: 1 })
                    }
                    className="px-3 py-2 rounded-xl bg-[#5cb61f] hover:brightness-105 text-white font-nunito font-black text-xs cursor-pointer"
                  >
                    +1 Blook
                  </button>
                  <button
                    type="button"
                    disabled={busyKey === `blook-${selectedUser.id}`}
                    onClick={() =>
                      handleBlookAction(selectedUser.id, { blookId: selectedBlookId, quantity: -1 })
                    }
                    className="px-3 py-2 rounded-xl bg-rose-500 hover:brightness-105 text-white font-nunito font-black text-xs cursor-pointer"
                  >
                    -1 Blook
                  </button>
                </div>
                {selectedBlook && (
                  <p
                    className="mt-1.5 font-nunito font-extrabold text-[11px]"
                    style={{ color: RARITY_COLORS[selectedBlook.rarity] }}
                  >
                    {selectedBlook.packId === 'athletes' ? 'Athletes Pack' : 'Circus Pack'} ·{' '}
                    {selectedBlook.rarity} ({selectedBlook.chanceLabel})
                  </p>
                )}
              </div>

              {/* Badges & Moderation */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  {(['owner', 'developer'] as const).map((badge) => {
                    const has = selectedUser.achievements.includes(badge);
                    return (
                      <button
                        key={badge}
                        type="button"
                        disabled={busyKey === `badge-${selectedUser.username}-${badge}`}
                        onClick={() => handleToggleBadge(selectedUser.username, badge, has)}
                        className={`px-3 py-1.5 rounded-xl font-nunito font-black text-xs flex items-center gap-1.5 cursor-pointer border-2 transition-colors ${
                          has
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {badge === 'owner' ? (
                          <OwnerAchievementIcon className="w-4 h-4" />
                        ) : (
                          <DeveloperAchievementIcon className="w-4 h-4" />
                        )}
                        <span>{has ? `Remove ${badge}` : `Grant ${badge}`}</span>
                      </button>
                    );
                  })}
                </div>

                {selectedUser.id !== currentUser.id &&
                  selectedUser.username.trim().toLowerCase() !== 'clicketownerofficial' && (
                    <div>
                      {confirmDeleteUserId === selectedUser.id ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={busyKey === `delete-user-${selectedUser.id}`}
                            onClick={() => handleDeleteUser(selectedUser.id)}
                            className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-nunito font-black text-xs cursor-pointer"
                          >
                            Confirm Delete
                          </button>
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteUserId(null)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-nunito font-black text-xs cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteUserId(selectedUser.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-nunito font-black text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Player</span>
                        </button>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Clans Moderation */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_8px_0_rgba(0,0,0,0.18)]">
        <h2 className="font-titan text-2xl text-slate-800 mb-3">
          Clans Moderation ({clans.length})
        </h2>

        {clans.length === 0 ? (
          <p className="font-nunito font-bold text-sm text-slate-400">No clans have been created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clans.map((clan) => (
              <div
                key={clan.id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <span className="font-titan text-lg text-slate-800 block truncate">
                    [{clan.tag}] {clan.name}
                  </span>
                  <span className="font-nunito font-bold text-xs text-slate-500">
                    Leader: {clan.leaderUsername} · {clan.memberCount} members · Power{' '}
                    {clan.powerScore.toLocaleString()}
                  </span>
                </div>

                {confirmDeleteClanId === clan.id ? (
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={busyKey === `delete-clan-${clan.id}`}
                      onClick={() => handleDeleteClan(clan.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-nunito font-black text-xs cursor-pointer"
                    >
                      Confirm
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteClanId(null)}
                      className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 font-nunito font-black text-xs cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteClanId(clan.id)}
                    className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-nunito font-black text-xs flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Disband</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
