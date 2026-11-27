import React, { useState, useMemo } from 'react';
import {
  Globe,
  Plus,
  ArrowLeftRight,
  AlertTriangle,
  Check,
  X,
  Sparkles,
  Search,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import {
  ALL_BLOOKS,
  RARITY_COLORS,
  Rarity,
} from '../data/blooks';
import { BlookArt, DefaultAvatarPfp } from './BlookArt';
import { OwnerAchievementIcon } from './AchievementsView';
import type { GlobalTradeListing, TradeCompletedNotice } from './TradingView';

interface BazaarViewProps {
  myUserId: string;
  inventory: Record<string, number>;
  globalTrades: GlobalTradeListing[];
  loadingGlobalTrades: boolean;
  tradeError: string | null;
  tradeNotice: TradeCompletedNotice | null;
  onDismissNotice: () => void;
  onPostGlobalTrade: (data: {
    offeredBlookId: string;
    requestedBlookId: string | null;
    requestedRarity: string | null;
    note: string;
  }) => Promise<boolean>;
  onFulfillGlobalTrade: (tradeId: string, givenBlookId: string) => Promise<boolean>;
  onCancelGlobalTrade: (tradeId: string) => Promise<boolean>;
  onRefreshGlobalTrades: () => Promise<void>;
}

const RARITY_TABS: Array<'All' | Rarity> = [
  'All',
  'Uncommon',
  'Rare',
  'Epic',
  'Legendary',
  'Chroma',
  'Mystic',
  'Clicked',
  'Godly',
  'Secret',
];

export const BazaarView: React.FC<BazaarViewProps> = ({
  myUserId,
  inventory,
  globalTrades,
  loadingGlobalTrades,
  tradeError,
  tradeNotice,
  onDismissNotice,
  onPostGlobalTrade,
  onFulfillGlobalTrade,
  onCancelGlobalTrade,
  onRefreshGlobalTrades,
}) => {
  const [subTab, setSubTab] = useState<'market' | 'post'>('market');

  // Global Bazaar Filters
  const [marketSearch, setMarketSearch] = useState('');
  const [marketRarityFilter, setMarketRarityFilter] = useState<'All' | Rarity>('All');
  const [onlyFulfillable, setOnlyFulfillable] = useState(false);
  const [onlyMyTrades, setOnlyMyTrades] = useState(false);

  // Post Global Trade Form State
  const [postOfferedBlookId, setPostOfferedBlookId] = useState<string>('');
  const [requestMode, setRequestMode] = useState<'specific' | 'rarity'>('specific');
  const [postRequestedBlookId, setPostRequestedBlookId] = useState<string>('popcorn');
  const [postRequestedRarity, setPostRequestedRarity] = useState<Rarity>('Rare');
  const [postNote, setPostNote] = useState('');
  const [postingBusy, setPostingBusy] = useState(false);
  const [postFormError, setPostFormError] = useState<string | null>(null);

  // Fulfill Modal for Rarity-based trades
  const [fulfillingTrade, setFulfillingTrade] = useState<GlobalTradeListing | null>(null);
  const [selectedGivenBlookId, setSelectedGivenBlookId] = useState<string>('');
  const [fulfillBusy, setFulfillBusy] = useState(false);

  const ownedBlooks = ALL_BLOOKS.filter((b) => (inventory[b.id] || 0) > 0);

  const canPlayerFulfill = (trade: GlobalTradeListing): boolean => {
    if (trade.creatorId === myUserId) return false;
    if (trade.requestedBlookId) {
      return (inventory[trade.requestedBlookId] || 0) > 0;
    }
    if (trade.requestedRarity) {
      return ownedBlooks.some((b) => b.rarity === trade.requestedRarity);
    }
    return false;
  };

  const filteredGlobalTrades = useMemo(() => {
    return globalTrades.filter((t) => {
      if (t.status !== 'OPEN') return false;

      if (onlyMyTrades && t.creatorId !== myUserId) return false;
      if (onlyFulfillable && !canPlayerFulfill(t)) return false;

      const offeredBlook = ALL_BLOOKS.find((b) => b.id === t.offeredBlookId);
      const requestedBlook = t.requestedBlookId
        ? ALL_BLOOKS.find((b) => b.id === t.requestedBlookId)
        : null;

      if (marketRarityFilter !== 'All') {
        if (offeredBlook?.rarity !== marketRarityFilter && t.requestedRarity !== marketRarityFilter) {
          return false;
        }
      }

      if (marketSearch.trim()) {
        const query = marketSearch.trim().toLowerCase();
        const matchesOffered = offeredBlook?.name.toLowerCase().includes(query);
        const matchesRequested = requestedBlook?.name.toLowerCase().includes(query);
        const matchesRarity = t.requestedRarity?.toLowerCase().includes(query);
        const matchesCreator = t.creatorUsername.toLowerCase().includes(query);
        const matchesNote = t.note.toLowerCase().includes(query);
        if (!matchesOffered && !matchesRequested && !matchesRarity && !matchesCreator && !matchesNote) {
          return false;
        }
      }

      return true;
    });
  }, [globalTrades, onlyMyTrades, onlyFulfillable, marketRarityFilter, marketSearch, inventory, myUserId]);

  const handleCreateGlobalListing = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostFormError(null);

    if (!postOfferedBlookId) {
      setPostFormError('Please select a Blook from your locker to offer.');
      return;
    }
    if ((inventory[postOfferedBlookId] || 0) < 1) {
      setPostFormError('You do not own that Blook.');
      return;
    }

    setPostingBusy(true);
    try {
      const ok = await onPostGlobalTrade({
        offeredBlookId: postOfferedBlookId,
        requestedBlookId: requestMode === 'specific' ? postRequestedBlookId : null,
        requestedRarity: requestMode === 'rarity' ? postRequestedRarity : null,
        note: postNote.trim(),
      });
      if (ok) {
        setPostOfferedBlookId('');
        setPostNote('');
        setSubTab('market');
      }
    } finally {
      setPostingBusy(false);
    }
  };

  const handleStartFulfill = (trade: GlobalTradeListing) => {
    if (trade.requestedBlookId) {
      void onFulfillGlobalTrade(trade.id, trade.requestedBlookId);
      return;
    }
    const eligible = ownedBlooks.filter((b) => b.rarity === trade.requestedRarity);
    if (eligible.length === 0) return;
    setSelectedGivenBlookId(eligible[0].id);
    setFulfillingTrade(trade);
  };

  const handleConfirmModalFulfill = async () => {
    if (!fulfillingTrade || !selectedGivenBlookId) return;
    setFulfillBusy(true);
    try {
      const ok = await onFulfillGlobalTrade(fulfillingTrade.id, selectedGivenBlookId);
      if (ok) {
        setFulfillingTrade(null);
      }
    } finally {
      setFulfillBusy(false);
    }
  };

  const completedGave = tradeNotice
    ? ALL_BLOOKS.find((b) => b.id === tradeNotice.gaveBlookId)
    : null;
  const completedGot = tradeNotice
    ? ALL_BLOOKS.find((b) => b.id === tradeNotice.receivedBlookId)
    : null;

  const openOffersCount = globalTrades.filter((t) => t.status === 'OPEN').length;

  return (
    <div className="relative z-10 px-4 sm:px-9 pt-6 pb-16 min-h-full flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-titan text-white text-[40px] sm:text-[46px] leading-none tracking-wide drop-shadow-[0_3px_0_rgba(0,0,0,0.18)] flex items-center gap-3">
            <Globe className="w-10 h-10 text-amber-200" />
            <span>Bazaar</span>
          </h1>
          <p className="font-nunito font-extrabold text-white/90 text-sm mt-1">
            Post global trade listings or browse and fulfill offers from players worldwide!
          </p>
        </div>

        {/* Active Offers Pill */}
        <div className="bg-[#991b1b] text-white px-4 py-2 rounded-2xl border-2 border-white/20 flex items-center gap-2 shadow-md">
          <Globe className="w-4 h-4 text-amber-300" />
          <span className="font-titan text-base">
            {openOffersCount} Active Global Offers
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6 bg-black/20 p-1.5 rounded-2xl backdrop-blur-xs self-start">
        <button
          type="button"
          onClick={() => setSubTab('market')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-titan text-sm cursor-pointer transition-all ${
            subTab === 'market'
              ? 'bg-white text-slate-900 shadow-md scale-102'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>Global Listings</span>
          <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-black">
            {openOffersCount}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab('post')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-titan text-sm cursor-pointer transition-all ${
            subTab === 'post'
              ? 'bg-[#fbbf24] text-amber-950 shadow-md scale-102'
              : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>Post Global Trade</span>
        </button>
      </div>

      {/* Trade Notice Banner */}
      {tradeNotice && completedGave && completedGot && (
        <div className="mb-6 bg-white border-4 border-emerald-400 rounded-3xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 animate-pop-reveal">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-titan text-xl text-emerald-700 leading-tight">
                Trade Completed with {tradeNotice.partnerUsername}!
              </h3>
              <p className="font-nunito font-extrabold text-xs text-slate-600">
                Gave <strong>{completedGave.name}</strong> ({completedGave.rarity}) → Received{' '}
                <strong>{completedGot.name}</strong> ({completedGot.rarity})!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onDismissNotice}
            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-nunito font-black text-xs cursor-pointer"
          >
            Awesome!
          </button>
        </div>
      )}

      {tradeError && (
        <div className="mb-5 bg-white border-2 border-rose-400 text-rose-700 px-5 py-3 rounded-2xl shadow-lg font-nunito font-extrabold text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{tradeError}</span>
        </div>
      )}

      {/* SUB-TAB 1: GLOBAL BAZAAR LISTINGS */}
      {subTab === 'market' && (
        <div className="flex flex-col gap-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-3xl p-5 shadow-[0_8px_0_rgba(0,0,0,0.18)] border-4 border-white/80">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Blook name or player..."
                  value={marketSearch}
                  onChange={(e) => setMarketSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-slate-200 font-nunito font-bold text-sm text-slate-800 focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
                {RARITY_TABS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setMarketRarityFilter(r)}
                    className={`px-3 py-1.5 rounded-xl font-nunito font-black text-xs cursor-pointer transition-colors ${
                      marketRarityFilter === r
                        ? 'bg-[#dc2626] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setOnlyFulfillable((v) => !v)}
                  className={`px-3.5 py-2 rounded-xl font-nunito font-black text-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                    onlyFulfillable
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Can Fulfill</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOnlyMyTrades((v) => !v)}
                  className={`px-3.5 py-2 rounded-xl font-nunito font-black text-xs cursor-pointer transition-colors ${
                    onlyMyTrades
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  My Listings
                </button>

                <button
                  type="button"
                  onClick={() => void onRefreshGlobalTrades()}
                  disabled={loadingGlobalTrades}
                  title="Refresh Global Trades"
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingGlobalTrades ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>

          {filteredGlobalTrades.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-[0_8px_0_rgba(0,0,0,0.18)]">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="font-titan text-2xl text-slate-800 mb-1">
                {onlyMyTrades
                  ? "You don't have any active global listings"
                  : onlyFulfillable
                  ? 'No matching trades you can fulfill right now'
                  : 'No trade offers match your search'}
              </h3>
              <p className="font-nunito font-bold text-sm text-slate-500 max-w-md mx-auto mb-5">
                {onlyMyTrades
                  ? 'Post a Blook you own to the Bazaar and players across the world will see it!'
                  : 'Try clearing your search or post your own offer for others to fulfill!'}
              </p>
              <button
                type="button"
                onClick={() => setSubTab('post')}
                className="px-6 py-2.5 rounded-xl bg-[#fbbf24] hover:brightness-105 active:translate-y-0.5 active:shadow-none shadow-[0_4px_0_#b45309] text-amber-950 font-titan text-base cursor-pointer inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Post Global Trade</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGlobalTrades.map((trade) => {
                const offeredBlook = ALL_BLOOKS.find((b) => b.id === trade.offeredBlookId);
                const requestedBlook = trade.requestedBlookId
                  ? ALL_BLOOKS.find((b) => b.id === trade.requestedBlookId)
                  : null;
                const isMine = trade.creatorId === myUserId;
                const canFulfill = canPlayerFulfill(trade);

                return (
                  <div
                    key={trade.id}
                    className={`bg-white rounded-3xl p-5 shadow-[0_8px_0_rgba(0,0,0,0.18)] border-4 flex flex-col justify-between transition-all ${
                      isMine
                        ? 'border-amber-300'
                        : canFulfill
                        ? 'border-emerald-300 ring-2 ring-emerald-400/30'
                        : 'border-white/80'
                    }`}
                  >
                    {/* Creator Row */}
                    <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-3.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                          {trade.creatorAvatarBlookId ? (
                            <BlookArt id={trade.creatorAvatarBlookId} className="w-full h-full" />
                          ) : (
                            <DefaultAvatarPfp className="w-full h-full rounded-lg" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`truncate text-sm ${
                                trade.creatorIsOwner
                                  ? 'font-titan owner-rainbow-glow'
                                  : 'font-nunito font-black text-slate-800'
                              }`}
                            >
                              {trade.creatorUsername}
                            </span>
                            {trade.creatorIsOwner && (
                              <OwnerAchievementIcon className="w-4 h-4 shrink-0" />
                            )}
                          </div>
                          <span className="block font-nunito font-bold text-[10px] text-slate-400">
                            {new Date(trade.createdAt).toLocaleDateString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>

                      {isMine ? (
                        <span className="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-nunito font-black text-xs">
                          Your Offer
                        </span>
                      ) : canFulfill ? (
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-nunito font-black text-xs flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ready
                        </span>
                      ) : null}
                    </div>

                    {/* Trade Exchange Display */}
                    <div className="grid grid-cols-11 items-center gap-2 bg-slate-50 rounded-2xl p-3 border-2 border-slate-100 mb-3">
                      <div className="col-span-5 flex flex-col items-center text-center">
                        <span className="font-nunito font-black text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                          OFFERING
                        </span>
                        <div className="w-16 h-16 mb-1">
                          {offeredBlook && (
                            <BlookArt id={offeredBlook.id} className="w-full h-full" />
                          )}
                        </div>
                        <span className="font-titan text-sm text-slate-800 truncate max-w-full">
                          {offeredBlook?.name}
                        </span>
                        {offeredBlook && (
                          <span
                            className="mt-0.5 px-2 py-0.5 rounded-md font-nunito font-black text-[10px] text-white"
                            style={{ backgroundColor: RARITY_COLORS[offeredBlook.rarity] }}
                          >
                            {offeredBlook.rarity}
                          </span>
                        )}
                      </div>

                      <div className="col-span-1 flex items-center justify-center text-[#dc2626]">
                        <ArrowLeftRight className="w-4 h-4" />
                      </div>

                      <div className="col-span-5 flex flex-col items-center text-center">
                        <span className="font-nunito font-black text-[10px] text-slate-400 uppercase tracking-wider mb-1">
                          WANTS
                        </span>
                        {requestedBlook ? (
                          <>
                            <div className="w-16 h-16 mb-1">
                              <BlookArt id={requestedBlook.id} className="w-full h-full" />
                            </div>
                            <span className="font-titan text-sm text-slate-800 truncate max-w-full">
                              {requestedBlook.name}
                            </span>
                            <span
                              className="mt-0.5 px-2 py-0.5 rounded-md font-nunito font-black text-[10px] text-white"
                              style={{ backgroundColor: RARITY_COLORS[requestedBlook.rarity] }}
                            >
                              {requestedBlook.rarity}
                            </span>
                          </>
                        ) : trade.requestedRarity ? (
                          <>
                            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-300 bg-amber-50 flex items-center justify-center text-amber-700 font-titan text-xl mb-1">
                              ?
                            </div>
                            <span className="font-titan text-sm text-slate-800">
                              Any {trade.requestedRarity}
                            </span>
                            <span
                              className="mt-0.5 px-2 py-0.5 rounded-md font-nunito font-black text-[10px] text-white"
                              style={{
                                backgroundColor:
                                  RARITY_COLORS[trade.requestedRarity as Rarity] || '#dc2626',
                              }}
                            >
                              {trade.requestedRarity}
                            </span>
                          </>
                        ) : (
                          <span className="font-nunito font-bold text-xs text-slate-500">
                            Any Offer
                          </span>
                        )}
                      </div>
                    </div>

                    {trade.note && (
                      <p className="font-nunito font-bold text-xs text-slate-600 bg-amber-50/70 border border-amber-200/80 rounded-xl px-3 py-1.5 mb-3 italic">
                        &ldquo;{trade.note}&rdquo;
                      </p>
                    )}

                    <div className="mt-auto pt-2">
                      {isMine ? (
                        <button
                          type="button"
                          onClick={() => void onCancelGlobalTrade(trade.id)}
                          className="w-full py-2 rounded-xl bg-slate-100 hover:bg-rose-100 hover:text-rose-700 text-slate-600 font-nunito font-black text-xs cursor-pointer transition-colors"
                        >
                          Cancel Listing & Reclaim Blook
                        </button>
                      ) : canFulfill ? (
                        <button
                          type="button"
                          onClick={() => handleStartFulfill(trade)}
                          className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:translate-y-0.5 text-white font-titan text-sm shadow-[0_4px_0_#065f46] active:shadow-none flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Sparkles className="w-4 h-4 text-amber-300" />
                          <span>Accept & Fulfill Trade</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          disabled
                          className="w-full py-2 rounded-xl bg-slate-100 text-slate-400 font-nunito font-black text-xs cursor-not-allowed text-center"
                        >
                          {trade.requestedBlookId
                            ? `Need ${requestedBlook?.name || trade.requestedBlookId}`
                            : `Need a ${trade.requestedRarity} Blook`}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: POST GLOBAL TRADE */}
      {subTab === 'post' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_8px_0_rgba(0,0,0,0.18)] max-w-4xl mx-auto w-full">
          <div className="border-b-2 border-slate-100 pb-4 mb-6">
            <h2 className="font-titan text-2xl text-slate-900 flex items-center gap-2.5">
              <Plus className="w-6 h-6 text-[#dc2626]" />
              <span>Post a Global Trade to the Bazaar</span>
            </h2>
            <p className="font-nunito font-bold text-xs text-slate-500 mt-1">
              Offer 1 obtained Blook from your locker. Players across the world can browse and fulfill it anytime!
            </p>
          </div>

          {postFormError && (
            <div className="mb-5 bg-rose-50 border-2 border-rose-300 text-rose-700 p-3 rounded-2xl font-nunito font-bold text-xs">
              {postFormError}
            </div>
          )}

          <form onSubmit={handleCreateGlobalListing} className="flex flex-col gap-6">
            <div>
              <label className="block font-titan text-base text-slate-800 mb-2">
                1. Select 1 Blook to Offer
              </label>
              {ownedBlooks.length === 0 ? (
                <p className="font-nunito font-bold text-sm text-slate-500 py-3">
                  You don&apos;t own any Blooks yet! Open packs in the Market first.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-56 overflow-y-auto p-1 border-2 border-slate-100 rounded-2xl bg-slate-50">
                  {ownedBlooks.map((blook) => {
                    const isSelected = postOfferedBlookId === blook.id;
                    const count = inventory[blook.id] || 0;
                    return (
                      <button
                        key={blook.id}
                        type="button"
                        onClick={() => setPostOfferedBlookId(blook.id)}
                        className={`p-2 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-amber-50 border-amber-400 scale-103 shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-12 h-12 mb-1">
                          <BlookArt id={blook.id} className="w-full h-full" />
                        </div>
                        <span className="font-nunito font-black text-[11px] text-slate-800 truncate max-w-full">
                          {blook.name}
                        </span>
                        <span
                          className="font-nunito font-extrabold text-[10px]"
                          style={{ color: RARITY_COLORS[blook.rarity] }}
                        >
                          x{count} · {blook.rarity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <label className="block font-titan text-base text-slate-800 mb-2">
                2. What do you want in return?
              </label>

              <div className="flex items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setRequestMode('specific')}
                  className={`px-4 py-2 rounded-xl font-titan text-xs cursor-pointer transition-colors ${
                    requestMode === 'specific'
                      ? 'bg-[#dc2626] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  A Specific Blook
                </button>
                <button
                  type="button"
                  onClick={() => setRequestMode('rarity')}
                  className={`px-4 py-2 rounded-xl font-titan text-xs cursor-pointer transition-colors ${
                    requestMode === 'rarity'
                      ? 'bg-[#dc2626] text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Any Blook of a Specific Rarity
                </button>
              </div>

              {requestMode === 'specific' ? (
                <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2.5 max-h-56 overflow-y-auto p-1 border-2 border-slate-100 rounded-2xl bg-slate-50">
                  {ALL_BLOOKS.map((blook) => {
                    const isSelected = postRequestedBlookId === blook.id;
                    return (
                      <button
                        key={blook.id}
                        type="button"
                        onClick={() => setPostRequestedBlookId(blook.id)}
                        className={`p-2 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-red-50 border-[#dc2626] scale-103 shadow-md'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="w-12 h-12 mb-1">
                          <BlookArt id={blook.id} className="w-full h-full" />
                        </div>
                        <span className="font-nunito font-black text-[11px] text-slate-800 truncate max-w-full">
                          {blook.name}
                        </span>
                        <span
                          className="font-nunito font-extrabold text-[10px]"
                          style={{ color: RARITY_COLORS[blook.rarity] }}
                        >
                          {blook.rarity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(
                    [
                      'Uncommon',
                      'Rare',
                      'Epic',
                      'Legendary',
                      'Chroma',
                      'Mystic',
                      'Clicked',
                      'Godly',
                      'Secret',
                    ] as Rarity[]
                  ).map((rarity) => (
                    <button
                      key={rarity}
                      type="button"
                      onClick={() => setPostRequestedRarity(rarity)}
                      className={`p-4 rounded-2xl border-2 font-titan text-sm cursor-pointer transition-all text-center ${
                        postRequestedRarity === rarity
                          ? 'bg-red-50 border-[#dc2626] text-[#dc2626] scale-103 shadow-md'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <div
                        className="w-4 h-4 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: RARITY_COLORS[rarity] }}
                      />
                      <span>Any {rarity}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block font-titan text-base text-slate-800 mb-1">
                3. Trade Note (Optional)
              </label>
              <input
                type="text"
                maxLength={80}
                placeholder="e.g. Looking to complete my Circus pack, fast trade!"
                value={postNote}
                onChange={(e) => setPostNote(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 font-nunito font-bold text-sm text-slate-800 focus:outline-none focus:border-[#dc2626]"
              />
            </div>

            <button
              type="submit"
              disabled={postingBusy || !postOfferedBlookId}
              className="w-full py-3.5 rounded-2xl bg-[#fbbf24] hover:brightness-105 active:translate-y-0.5 active:shadow-none shadow-[0_5px_0_#b45309] text-amber-950 font-titan text-lg flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Globe className="w-5 h-5" />
              <span>{postingBusy ? 'Publishing Offer...' : 'Post Global Trade to Bazaar'}</span>
            </button>
          </form>
        </div>
      )}

      {/* MODAL: FULFILL RARITY-BASED GLOBAL TRADE */}
      {fulfillingTrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border-4 border-emerald-400 animate-pop-reveal">
            <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4">
              <h3 className="font-titan text-2xl text-slate-900">Fulfill Global Trade</h3>
              <button
                type="button"
                onClick={() => setFulfillingTrade(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="font-nunito font-bold text-sm text-slate-600 mb-4">
              <strong>{fulfillingTrade.creatorUsername}</strong> is offering{' '}
              <strong>{ALL_BLOOKS.find((b) => b.id === fulfillingTrade.offeredBlookId)?.name}</strong> for any{' '}
              <strong>{fulfillingTrade.requestedRarity}</strong> Blook! Choose which one to give:
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-56 overflow-y-auto p-1 mb-5">
              {ownedBlooks
                .filter((b) => b.rarity === fulfillingTrade.requestedRarity)
                .map((blook) => {
                  const isSelected = selectedGivenBlookId === blook.id;
                  const count = inventory[blook.id] || 0;
                  return (
                    <button
                      key={blook.id}
                      type="button"
                      onClick={() => setSelectedGivenBlookId(blook.id)}
                      className={`p-2 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 scale-103 shadow-md'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="w-12 h-12 mb-1">
                        <BlookArt id={blook.id} className="w-full h-full" />
                      </div>
                      <span className="font-nunito font-black text-xs text-slate-800 truncate max-w-full">
                        {blook.name}
                      </span>
                      <span className="font-nunito font-extrabold text-[10px] text-slate-400">
                        x{count}
                      </span>
                    </button>
                  );
                })}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFulfillingTrade(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-nunito font-black text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={fulfillBusy || !selectedGivenBlookId}
                onClick={handleConfirmModalFulfill}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-titan text-base shadow-[0_4px_0_#065f46] cursor-pointer disabled:opacity-50"
              >
                {fulfillBusy ? 'Processing...' : 'Confirm Trade'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
