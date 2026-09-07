import React from 'react';
import { WalletBalanceRow, NetworkConfig, CheckProgress } from '../types';
import {
  Coins,
  CheckCircle,
  FileSpreadsheet,
  FileCode,
  Copy,
  Search,
  Filter,
  Layers,
  Sparkles
} from 'lucide-react';

interface SummaryStatsProps {
  rows: WalletBalanceRow[];
  networks: NetworkConfig[];
  selectedNetworkIds: string[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterPositiveOnly: boolean;
  onToggleFilterPositive: () => void;
  onExportCsv: () => void;
  onExportJson: () => void;
  onCopySummary: () => void;
  progress: CheckProgress;
}

export const SummaryStats: React.FC<SummaryStatsProps> = ({
  rows,
  networks,
  selectedNetworkIds,
  searchQuery,
  onSearchChange,
  filterPositiveOnly,
  onToggleFilterPositive,
  onExportCsv,
  onExportJson,
  onCopySummary,
  progress
}) => {
  const totalWallets = rows.length;
  const activeNetworks = networks.filter((n) => selectedNetworkIds.includes(n.id));

  // Count wallets with any positive balance
  const positiveWallets = rows.filter((r) => r.totalPositiveNetworks > 0).length;

  // Aggregate total balance per currency across selected networks
  const currencyTotals: Record<string, number> = {};
  for (const row of rows) {
    for (const net of activeNetworks) {
      const b = row.balances[net.id];
      if (b && b.status === 'success') {
        const curr = net.currency;
        currencyTotals[curr] = (currencyTotals[curr] || 0) + (b.balanceNumber || 0);
      }
    }
  }

  const percentProgress =
    progress.totalTasks > 0
      ? Math.round((progress.completedTasks / progress.totalTasks) * 100)
      : 0;

  return (
    <div className="space-y-4">
      {/* Progress Bar (Visible while checking) */}
      {progress.isChecking && (
        <div id="check-progress-bar" className="bg-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-md animate-pulse">
          <div className="flex items-center justify-between text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
              <span className="font-semibold text-indigo-300">
                Memeriksa Balance Testnet... ({progress.completedTasks} / {progress.totalTasks} selesai)
              </span>
            </div>
            <span className="font-mono text-indigo-400 font-bold">{percentProgress}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${percentProgress}%` }}
            />
          </div>
          {progress.currentTaskDescription && (
            <div className="mt-1.5 text-[11px] font-mono text-slate-400 truncate">
              {progress.currentTaskDescription}
            </div>
          )}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Wallet</span>
            <Layers className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-xl font-bold text-slate-100 font-mono">{totalWallets}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {activeNetworks.length} Jaringan aktif
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Wallet Ada Saldo</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400 font-mono">
            {positiveWallets}
            <span className="text-xs text-slate-400 font-normal ml-1">/ {totalWallets}</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {totalWallets > 0 ? `${Math.round((positiveWallets / totalWallets) * 100)}% memiliki saldo` : 'Belum dicek'}
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 col-span-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Total Token Akumulasi (Testnet)</span>
            <Coins className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {Object.keys(currencyTotals).length === 0 ? (
              <span className="text-xs text-slate-500">Mulai cek untuk melihat akumulasi</span>
            ) : (
              Object.entries(currencyTotals).map(([curr, amt]) => (
                <span
                  key={curr}
                  className="px-2 py-1 rounded-md bg-slate-800/90 border border-slate-700/80 font-mono text-xs font-semibold text-slate-200"
                >
                  {amt > 0 ? amt.toLocaleString(undefined, { maximumFractionDigits: 4 }) : '0'}{' '}
                  <span className="text-indigo-400">{curr}</span>
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Table Controls: Search, Filters & Export */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/50 border border-slate-800/80 rounded-xl p-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="search-wallet-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari address wallet (0x...)"
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            id="filter-positive-toggle"
            type="button"
            onClick={onToggleFilterPositive}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              filterPositiveOnly
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>Hanya Saldo &gt; 0</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            id="btn-copy-summary"
            type="button"
            onClick={onCopySummary}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Salin hasil ke clipboard (format teks)"
          >
            <Copy className="w-3 h-3" />
            <span className="hidden sm:inline">Salin Teks</span>
          </button>

          <button
            id="btn-export-csv"
            type="button"
            onClick={onExportCsv}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download CSV file"
          >
            <FileSpreadsheet className="w-3 h-3 text-emerald-400" />
            <span>CSV</span>
          </button>

          <button
            id="btn-export-json"
            type="button"
            onClick={onExportJson}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download JSON file"
          >
            <FileCode className="w-3 h-3 text-indigo-400" />
            <span>JSON</span>
          </button>
        </div>
      </div>
    </div>
  );
};
