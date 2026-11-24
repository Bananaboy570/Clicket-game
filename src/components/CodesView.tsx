import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Ticket,
  Check,
  Copy,
  Plus,
  Trash2,
  PauseCircle,
  PlayCircle,
  AlertCircle,
  Gift,
  Crown,
} from 'lucide-react';
import { ALL_BLOOKS } from '../data/blooks';
import type {
  CustomPromoCodeRecord,
  PublicPromoCodeInfo,
  RedeemedCodeRecord,
} from '../data/codes';
import { BlookArt, BlooketTokenIcon } from './BlookArt';
import type { AuthenticatedUser } from './AuthScreen';
import { apiFetch } from '../lib/apiClient';

interface CodesViewProps {
  currentUser: AuthenticatedUser;
  sessionToken: string | null;
  isOwner: boolean;
  onSyncUser: (user: AuthenticatedUser) => void;
}

export const CodesView: React.FC<CodesViewProps> = ({
  currentUser,
  sessionToken,
  isOwner,
  onSyncUser,
}) => {
  const [codeInput, setCodeInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [publicCodes, setPublicCodes] = useState<PublicPromoCodeInfo[]>([]);
  const [redeemedCodes, setRedeemedCodes] = useState<RedeemedCodeRecord[]>(
    currentUser.redeemedCodes || []
  );
  const [customCodes, setCustomCodes] = useState<CustomPromoCodeRecord[]>([]);
  const [feedback, setFeedback] = useState<{
    ok: boolean;
    message: string;
    reward?: RedeemedCodeRecord;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Owner Code Studio form state
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTokens, setNewTokens] = useState('250');
  const [newBlookId, setNewBlookId] = useState('');
  const [newBlookQty, setNewBlookQty] = useState('1');
  const [newMaxUses, setNewMaxUses] = useState('');
  const [newIsPublic, setNewIsPublic] = useState(false);
  const [creatingCode, setCreatingCode] = useState(false);
  const [ownerStatus, setOwnerStatus] = useState<{ ok: boolean; text: string } | null>(null);

  const blookMap = useMemo(() => new Map(ALL_BLOOKS.map((b) => [b.id, b])), []);

  const fetchCodes = useCallback(async () => {
    if (!sessionToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await apiFetch('/api/codes', {
        headers: { Authorization: `Bearer ${sessionToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.publicCodes)) setPublicCodes(data.publicCodes);
        if (Array.isArray(data.redeemedCodes)) setRedeemedCodes(data.redeemedCodes);
        if (Array.isArray(data.customCodes)) setCustomCodes(data.customCodes);
      }
    } catch {
      // Keep existing local state on transient fetch error
    } finally {
      setLoading(false);
    }
  }, [sessionToken]);

  useEffect(() => {
    void fetchCodes();
  }, [fetchCodes]);

  const redeemCode = async (targetCode: string) => {
    const clean = targetCode.trim().toUpperCase();
    if (!clean || !sessionToken || submitting) return;

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await apiFetch('/api/codes/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ code: clean }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFeedback({
          ok: false,
          message: data.error || 'Could not redeem that code.',
        });
      } else {
        const reward = data.reward as RedeemedCodeRecord;
        setFeedback({
          ok: true,
          message: `Redeemed "${reward.code}" — ${reward.title}!`,
          reward,
        });
        setCodeInput('');
        if (data.user) {
          onSyncUser(data.user as AuthenticatedUser);
        }
        await fetchCodes();
      }
    } catch {
      setFeedback({
        ok: false,
        message: 'Network error while redeeming code. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void redeemCode(codeInput);
  };

  const handleCopyCode = (code: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    setTimeout(() => setCopiedCode((prev) => (prev === code ? null : prev)), 1500);
  };

  const handleCreateCustomCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionToken || creatingCode) return;
    setCreatingCode(true);
    setOwnerStatus(null);
    try {
      const res = await apiFetch('/api/codes/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          code: newCode.trim().toUpperCase(),
          title: newTitle.trim(),
          description: newDescription.trim(),
          tokens: Number(newTokens) || 0,
          blookId: newBlookId || undefined,
          blookQty: newBlookId ? Number(newBlookQty) || 1 : undefined,
          maxUses: newMaxUses.trim() ? Number(newMaxUses) : null,
          isPublic: newIsPublic,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setOwnerStatus({ ok: false, text: data.error || 'Failed to create code.' });
      } else {
        setOwnerStatus({
          ok: true,
          text: `Created code "${data.promoCode.code}" (${data.promoCode.isPublic ? 'Public' : 'Secret'}).`,
        });
        setNewCode('');
        setNewTitle('');
        setNewDescription('');
        setNewTokens('250');
        setNewBlookId('');
        setNewBlookQty('1');
        setNewMaxUses('');
        await fetchCodes();
      }
    } catch {
      setOwnerStatus({ ok: false, text: 'Network error while creating code.' });
    } finally {
      setCreatingCode(false);
    }
  };

  const handleToggleCustomCode = async (code: string) => {
    if (!sessionToken) return;
    try {
      const res = await apiFetch('/api/codes/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        await fetchCodes();
      }
    } catch {
      // Ignore transient error
    }
  };

  const handleDeleteCustomCode = async (code: string) => {
    if (!sessionToken) return;
    try {
      const res = await apiFetch('/api/codes/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ code }),
      });
      if (res.ok) {
        await fetchCodes();
      }
    } catch {
      // Ignore transient error
    }
  };

  const unclaimedCount = publicCodes.filter((c) => !c.alreadyRedeemed).length;

  return (
    <div className="relative z-10 px-6 sm:px-9 pt-6 pb-16 min-h-full flex flex-col max-w-5xl">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-titan text-white text-[44px] leading-none tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.18)]">
            Codes
          </h1>
          <p className="font-nunito font-extrabold text-white/95 text-sm mt-1.5">
            Redeem event, starter, and creator codes for bonus Tokens and Blooks
          </p>
        </div>

        <div className="bg-[#991b1b] text-white px-4 py-2 rounded-2xl border-2 border-white/20 flex items-center gap-2.5 shadow-md font-nunito font-extrabold text-sm tabular-nums">
          <Ticket className="w-5 h-5 text-amber-300 shrink-0" />
          <span>{redeemedCodes.length} Redeemed</span>
          <span className="text-white/40" aria-hidden="true">
            ·
          </span>
          <span>{unclaimedCount} Available</span>
        </div>
      </div>

      {/* Primary Focal Anchor: Redeem a Code Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border-4 border-white/80 shadow-[0_8px_0_rgba(0,0,0,0.18)] mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-red-100 text-[#dc2626] flex items-center justify-center shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-titan text-2xl text-slate-900 leading-tight">Redeem a Code</h2>
            <p className="font-nunito font-bold text-xs text-slate-500">
              Codes are case-insensitive and can be redeemed once per account
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
            placeholder="ENTER CODE (E.G. CLICKET)"
            maxLength={24}
            aria-label="Promo code"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#dc2626] focus:outline-none bg-slate-50 font-mono font-bold text-base sm:text-lg tracking-wider text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={submitting || !codeInput.trim()}
            className={`px-6 py-3 rounded-xl font-titan text-lg tracking-wide flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-all ${
              submitting || !codeInput.trim()
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-[#dc2626] hover:brightness-105 active:translate-y-0.5 active:shadow-none shadow-[0_5px_0_#991b1b] text-white cursor-pointer'
            }`}
          >
            <Ticket className="w-5 h-5" />
            <span>{submitting ? 'Checking...' : 'Redeem Code'}</span>
          </button>
        </form>

        {feedback && (
          <div
            className={`mt-4 p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3 ${
              feedback.ok
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedback.ok ? (
                <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <span className="font-nunito font-extrabold text-sm">{feedback.message}</span>
            </div>

            {feedback.ok && feedback.reward && (
              <div className="flex items-center gap-3 font-nunito font-black text-sm tabular-nums">
                {feedback.reward.tokens > 0 && (
                  <span className="flex items-center gap-1.5 text-amber-800">
                    <BlooketTokenIcon className="w-5 h-5" />
                    <span>+{feedback.reward.tokens.toLocaleString()} Tokens</span>
                  </span>
                )}
                {feedback.reward.blookId && (
                  <span className="flex items-center gap-1.5 text-slate-800">
                    <span className="w-7 h-7 inline-flex items-center justify-center">
                      <BlookArt id={feedback.reward.blookId} className="w-full h-full" />
                    </span>
                    <span>
                      +{feedback.reward.blookQty || 1}×{' '}
                      {blookMap.get(feedback.reward.blookId)?.name || feedback.reward.blookId}
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2-Column Content: Starter Codes & Redeemed History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Available Public Codes */}
        <section className="bg-white rounded-3xl p-6 border-4 border-white/80 shadow-[0_8px_0_rgba(0,0,0,0.16)] flex flex-col">
          <div className="flex items-baseline justify-between gap-2 mb-4">
            <h3 className="font-titan text-2xl text-slate-900">Starter Codes</h3>
            <span className="font-nunito font-bold text-xs text-slate-500 tabular-nums">
              {publicCodes.length} Active
            </span>
          </div>

          {loading ? (
            <div className="py-10 text-center font-nunito font-bold text-slate-400 text-sm">
              Loading active codes...
            </div>
          ) : publicCodes.length === 0 ? (
            <div className="py-10 text-center font-nunito font-bold text-slate-400 text-sm">
              No public starter codes right now. Try entering a secret code above!
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100">
              {publicCodes.map((item) => {
                const rewardBlook = item.blookId ? blookMap.get(item.blookId) : undefined;
                return (
                  <div
                    key={item.code}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-base text-[#dc2626] tracking-wide">
                          {item.code}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-nunito font-extrabold text-sm text-slate-800 truncate">
                          {item.title}
                        </span>
                      </div>
                      <p className="font-nunito font-semibold text-xs text-slate-500 mt-0.5">
                        {item.description}
                      </p>
                      <div className="mt-1.5 flex items-center gap-3 text-xs font-nunito font-extrabold text-slate-700 tabular-nums">
                        {item.tokens > 0 && (
                          <span className="inline-flex items-center gap-1 text-amber-700">
                            <BlooketTokenIcon className="w-4 h-4" />
                            <span>+{item.tokens.toLocaleString()} Tokens</span>
                          </span>
                        )}
                        {rewardBlook && (
                          <span className="inline-flex items-center gap-1">
                            <span className="w-5 h-5 inline-flex items-center justify-center">
                              <BlookArt id={rewardBlook.id} className="w-full h-full" />
                            </span>
                            <span>
                              +{item.blookQty || 1}× {rewardBlook.name}
                            </span>
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={item.alreadyRedeemed || submitting}
                      onClick={() => void redeemCode(item.code)}
                      className={`px-4 py-2 rounded-xl font-nunito font-black text-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 transition-all ${
                        item.alreadyRedeemed
                          ? 'bg-slate-100 text-slate-400 cursor-default'
                          : 'bg-[#fbbf24] hover:brightness-105 active:translate-y-0.5 text-amber-950 shadow-[0_3px_0_#b45309] cursor-pointer'
                      }`}
                    >
                      {item.alreadyRedeemed ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Claimed</span>
                        </>
                      ) : (
                        <span>Claim</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Redeemed History */}
        <section className="bg-white rounded-3xl p-6 border-4 border-white/80 shadow-[0_8px_0_rgba(0,0,0,0.16)] flex flex-col">
          <div className="flex items-baseline justify-between gap-2 mb-4">
            <h3 className="font-titan text-2xl text-slate-900">Redeemed History</h3>
            <span className="font-nunito font-bold text-xs text-slate-500 tabular-nums">
              {redeemedCodes.length} Total
            </span>
          </div>

          {redeemedCodes.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-slate-400">
              <Ticket className="w-9 h-9 mb-2 opacity-40" />
              <p className="font-nunito font-bold text-sm">
                No codes redeemed yet. Enter a code above or claim a starter code!
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 max-h-[360px] overflow-y-auto pr-1">
              {redeemedCodes.map((entry) => {
                const rewardBlook = entry.blookId ? blookMap.get(entry.blookId) : undefined;
                const formattedDate = new Date(entry.redeemedAt).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });
                return (
                  <div
                    key={`${entry.code}-${entry.redeemedAt}`}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-sm text-slate-900">
                          {entry.code}
                        </span>
                        <span className="text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-nunito font-bold text-xs text-slate-600 truncate">
                          {entry.title}
                        </span>
                      </div>
                      <span className="block font-nunito font-semibold text-[11px] text-slate-400 mt-0.5">
                        Redeemed {formattedDate}
                      </span>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 font-nunito font-extrabold text-xs tabular-nums">
                      {entry.tokens > 0 && (
                        <span className="inline-flex items-center gap-1 text-amber-700">
                          <BlooketTokenIcon className="w-4 h-4" />
                          <span>+{entry.tokens.toLocaleString()}</span>
                        </span>
                      )}
                      {rewardBlook && (
                        <span className="inline-flex items-center gap-1 text-slate-700">
                          <span className="w-6 h-6 inline-flex items-center justify-center">
                            <BlookArt id={rewardBlook.id} className="w-full h-full" />
                          </span>
                          <span>+{entry.blookQty || 1}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Owner Code Studio (strictly visible to ClicketOwnerOfficial) */}
      {isOwner && (
        <section className="mt-8 bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-[0_8px_0_rgba(0,0,0,0.16)]">
          <div className="flex items-center gap-2.5 mb-4">
            <Crown className="w-6 h-6 text-amber-500 shrink-0" />
            <div>
              <h3 className="font-titan text-2xl text-slate-900 leading-tight">
                Owner Code Studio
              </h3>
              <p className="font-nunito font-bold text-xs text-slate-500">
                Create public or secret promo codes for players
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateCustomCode} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
            <input
              type="text"
              value={newCode}
              onChange={(e) => setNewCode(e.target.value.toUpperCase())}
              placeholder="CODE (E.G. STREAM500)"
              maxLength={24}
              required
              className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#dc2626] focus:outline-none font-mono font-bold text-sm text-slate-900"
            />
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title (e.g. Stream Drop)"
              maxLength={48}
              className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#dc2626] focus:outline-none font-nunito font-bold text-sm text-slate-900"
            />
            <input
              type="text"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Short description"
              maxLength={120}
              className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#dc2626] focus:outline-none font-nunito font-bold text-sm text-slate-900"
            />
            <input
              type="number"
              min={0}
              max={1000000}
              value={newTokens}
              onChange={(e) => setNewTokens(e.target.value)}
              placeholder="Token reward"
              className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#dc2626] focus:outline-none font-nunito font-bold text-sm text-slate-900 tabular-nums"
            />
            <select
              value={newBlookId}
              onChange={(e) => setNewBlookId(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#dc2626] focus:outline-none font-nunito font-bold text-sm text-slate-900 bg-white"
            >
              <option value="">No Bonus Blook</option>
              {ALL_BLOOKS.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.rarity})
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={1}
                value={newMaxUses}
                onChange={(e) => setNewMaxUses(e.target.value)}
                placeholder="Max uses (blank = ∞)"
                className="flex-1 px-3.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#dc2626] focus:outline-none font-nunito font-bold text-sm text-slate-900 tabular-nums"
              />
              {newBlookId && (
                <input
                  type="number"
                  min={1}
                  max={25}
                  value={newBlookQty}
                  onChange={(e) => setNewBlookQty(e.target.value)}
                  title="Blook quantity"
                  className="w-16 px-2.5 py-2.5 rounded-xl border-2 border-slate-200 focus:border-[#dc2626] focus:outline-none font-nunito font-bold text-sm text-slate-900 tabular-nums"
                />
              )}
            </div>

            <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap items-center justify-between gap-3 pt-1">
              <label className="inline-flex items-center gap-2 font-nunito font-bold text-sm text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newIsPublic}
                  onChange={(e) => setNewIsPublic(e.target.checked)}
                  className="w-4 h-4 accent-[#dc2626] rounded cursor-pointer"
                />
                <span>List publicly under Starter Codes (uncheck for secret code)</span>
              </label>

              <button
                type="submit"
                disabled={creatingCode || !newCode.trim()}
                className="px-5 py-2.5 rounded-xl bg-[#dc2626] hover:brightness-105 text-white font-nunito font-black text-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                <span>{creatingCode ? 'Creating...' : 'Create Code'}</span>
              </button>
            </div>
          </form>

          {ownerStatus && (
            <p
              className={`mb-4 font-nunito font-extrabold text-xs ${
                ownerStatus.ok ? 'text-emerald-700' : 'text-rose-600'
              }`}
            >
              {ownerStatus.text}
            </p>
          )}

          {customCodes.length > 0 && (
            <div className="border-t border-slate-100 pt-4 divide-y divide-slate-100">
              {customCodes.map((c) => {
                const blook = c.blookId ? blookMap.get(c.blookId) : undefined;
                return (
                  <div
                    key={c.code}
                    className="py-2.5 flex flex-wrap items-center justify-between gap-3 text-sm"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-black text-slate-900">{c.code}</span>
                        <span className="text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-nunito font-bold text-slate-700">{c.title}</span>
                        <span className="text-slate-300" aria-hidden="true">
                          ·
                        </span>
                        <span className="font-nunito font-bold text-xs text-slate-500">
                          {c.isPublic ? 'Public' : 'Secret'} ·{' '}
                          {c.active ? 'Active' : 'Paused'} ·{' '}
                          <span className="tabular-nums">
                            {c.usesCount}
                            {c.maxUses != null ? `/${c.maxUses}` : ''} uses
                          </span>
                        </span>
                      </div>
                      <div className="font-nunito font-bold text-xs text-slate-500 tabular-nums mt-0.5">
                        {c.tokens > 0 ? `+${c.tokens.toLocaleString()} Tokens` : ''}
                        {c.tokens > 0 && blook ? ' · ' : ''}
                        {blook ? `+${c.blookQty || 1}× ${blook.name}` : ''}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopyCode(c.code)}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-nunito font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {copiedCode === c.code ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleToggleCustomCode(c.code)}
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-nunito font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        {c.active ? (
                          <>
                            <PauseCircle className="w-3.5 h-3.5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <PlayCircle className="w-3.5 h-3.5" />
                            <span>Resume</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteCustomCode(c.code)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-nunito font-bold text-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
};
