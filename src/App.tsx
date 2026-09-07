import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DEFAULT_NETWORKS, SAMPLE_WALLETS } from './constants/networks';
import {
  NetworkConfig,
  WalletBalanceRow,
  CheckProgress,
  NetworkPingStatus,
  BalanceResult
} from './types';
import {
  extractEvmAddresses,
  fetchBalance,
  pingRpc,
  runWithConcurrency
} from './services/evmRpc';
import { NetworkSelector } from './components/NetworkSelector';
import { WalletInputSection } from './components/WalletInputSection';
import { SummaryStats } from './components/SummaryStats';
import { BalanceMatrixTable } from './components/BalanceMatrixTable';
import { NetworkSettingsModal } from './components/NetworkSettingsModal';
import { FaucetLinksModal } from './components/FaucetLinksModal';
import {
  Coins,
  ShieldCheck,
  Zap,
  Globe2,
  HelpCircle,
  Sparkles,
  Layers,
  Check
} from 'lucide-react';

export default function App() {
  const [networks, setNetworks] = useState<NetworkConfig[]>(DEFAULT_NETWORKS);
  const [selectedNetworkIds, setSelectedNetworkIds] = useState<string[]>(() =>
    DEFAULT_NETWORKS.map((n) => n.id)
  );
  const [rawInput, setRawInput] = useState<string>(() => SAMPLE_WALLETS.slice(0, 3).join('\n'));
  const [rows, setRows] = useState<WalletBalanceRow[]>([]);
  const [customRpcs, setCustomRpcs] = useState<Record<string, string>>({});
  const [pingStatuses, setPingStatuses] = useState<Record<string, NetworkPingStatus>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPositiveOnly, setFilterPositiveOnly] = useState(false);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFaucetsOpen, setIsFaucetsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [progress, setProgress] = useState<CheckProgress>({
    isChecking: false,
    totalTasks: 0,
    completedTasks: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Ping RPCs on initial mount
  useEffect(() => {
    handleRefreshPings();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3500);
  };

  const handleRefreshPings = async () => {
    const promises = networks.map(async (net) => {
      const res = await pingRpc(net, customRpcs[net.id]);
      setPingStatuses((prev) => ({ ...prev, [net.id]: res }));
    });
    await Promise.all(promises);
  };

  const handleToggleNetwork = (id: string) => {
    setSelectedNetworkIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedNetworkIds(networks.map((n) => n.id));
  };

  const handleDeselectAll = () => {
    setSelectedNetworkIds([]);
  };

  const handleSaveCustomRpc = (networkId: string, url: string) => {
    setCustomRpcs((prev) => ({ ...prev, [networkId]: url.trim() }));
  };

  const handleResetCustomRpcs = () => {
    setCustomRpcs({});
    showToast('RPC dikembalikan ke setelan default');
  };

  // Start Checking Balances
  const handleStartCheck = async () => {
    const { valid } = extractEvmAddresses(rawInput);
    if (valid.length === 0) {
      showToast('Silakan masukan minimal 1 address EVM yang valid (0x...)');
      return;
    }

    if (selectedNetworkIds.length === 0) {
      showToast('Pilih minimal 1 jaringan testnet untuk dicek');
      return;
    }

    // Cancel existing if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    const activeNetworks = networks.filter((n) => selectedNetworkIds.includes(n.id));

    // Initialize rows
    const initialRows: WalletBalanceRow[] = valid.map((address) => {
      const existing = rows.find((r) => r.address === address);
      const balances: Record<string, BalanceResult> = {};

      for (const net of activeNetworks) {
        balances[net.id] = existing?.balances[net.id] || {
          balanceWei: '0x0',
          balanceFormatted: '...',
          balanceNumber: 0,
          status: 'loading'
        };
      }

      return {
        address,
        balances,
        totalPositiveNetworks: existing?.totalPositiveNetworks || 0
      };
    });

    setRows(initialRows);

    const totalTasks = valid.length * activeNetworks.length;
    setProgress({
      isChecking: true,
      totalTasks,
      completedTasks: 0,
      currentTaskDescription: `Memulai pengecekan ${valid.length} wallet di ${activeNetworks.length} jaringan...`
    });

    // Generate task functions
    const tasks: (() => Promise<void>)[] = [];
    let completedCount = 0;

    for (const address of valid) {
      for (const net of activeNetworks) {
        tasks.push(async () => {
          if (abortController.signal.aborted) return;

          const res = await fetchBalance(
            address,
            net,
            customRpcs[net.id],
            abortController.signal
          );

          if (abortController.signal.aborted) return;

          completedCount++;
          setProgress((prev) => ({
            ...prev,
            completedTasks: completedCount,
            currentTaskDescription: `${address.slice(0, 6)}... on ${net.shortName}: ${res.balanceFormatted} ${net.currency}`
          }));

          setRows((currentRows) =>
            currentRows.map((row) => {
              if (row.address !== address) return row;
              const newBalances = { ...row.balances, [net.id]: res };
              const positiveCount = (Object.values(newBalances) as BalanceResult[]).filter(
                (b) => b && b.status === 'success' && b.balanceNumber > 0
              ).length;

              return {
                ...row,
                balances: newBalances,
                totalPositiveNetworks: positiveCount
              };
            })
          );
        });
      }
    }

    try {
      // Run with concurrency of 6 parallel requests for high speed and no rate-limit blocking
      await runWithConcurrency(tasks, 6);
      setProgress((prev) => ({ ...prev, isChecking: false }));
      showToast(`Selesai! Berhasil memeriksa ${valid.length} wallet di ${activeNetworks.length} jaringan.`);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error(err);
      }
      setProgress((prev) => ({ ...prev, isChecking: false }));
    }
  };

  const handleCancelCheck = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setProgress((prev) => ({ ...prev, isChecking: false }));
    showToast('Pengecekan dihentikan oleh pengguna');
  };

  const handleRecheckWallet = async (address: string) => {
    const activeNetworks = networks.filter((n) => selectedNetworkIds.includes(n.id));

    // Set row to loading
    setRows((current) =>
      current.map((row) => {
        if (row.address !== address) return row;
        const newBal = { ...row.balances };
        for (const net of activeNetworks) {
          newBal[net.id] = { ...newBal[net.id], status: 'loading' };
        }
        return { ...row, balances: newBal };
      })
    );

    const tasks = activeNetworks.map((net) => async () => {
      const res = await fetchBalance(address, net, customRpcs[net.id]);
      setRows((current) =>
        current.map((row) => {
          if (row.address !== address) return row;
          const newBalances = { ...row.balances, [net.id]: res };
          const positiveCount = (Object.values(newBalances) as BalanceResult[]).filter(
            (b) => b && b.status === 'success' && b.balanceNumber > 0
          ).length;
          return {
            ...row,
            balances: newBalances,
            totalPositiveNetworks: positiveCount
          };
        })
      );
    });

    await runWithConcurrency(tasks, 4);
    showToast(`Wallet ${address.slice(0, 6)}... berhasil diperbarui`);
  };

  const handleRecheckSingleCell = async (address: string, networkId: string) => {
    const net = networks.find((n) => n.id === networkId);
    if (!net) return;

    setRows((current) =>
      current.map((row) => {
        if (row.address !== address) return row;
        return {
          ...row,
          balances: {
            ...row.balances,
            [networkId]: {
              ...(row.balances[networkId] || {
                balanceWei: '0x0',
                balanceFormatted: '...',
                balanceNumber: 0
              }),
              status: 'loading'
            }
          }
        };
      })
    );

    const res = await fetchBalance(address, net, customRpcs[networkId]);

    setRows((current) =>
      current.map((row) => {
        if (row.address !== address) return row;
        const newBalances = { ...row.balances, [networkId]: res };
        const positiveCount = (Object.values(newBalances) as BalanceResult[]).filter(
          (b) => b && b.status === 'success' && b.balanceNumber > 0
        ).length;
        return {
          ...row,
          balances: newBalances,
          totalPositiveNetworks: positiveCount
        };
      })
    );
  };

  // Filtered rows
  const filteredRows = useMemo(() => {
    let result = rows;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((r) => r.address.toLowerCase().includes(q));
    }

    if (filterPositiveOnly) {
      result = result.filter((r) => r.totalPositiveNetworks > 0);
    }

    return result;
  }, [rows, searchQuery, filterPositiveOnly]);

  // Export handlers
  const handleExportCsv = () => {
    const activeNetworks = networks.filter((n) => selectedNetworkIds.includes(n.id));
    const header = ['Wallet Address', ...activeNetworks.map((n) => `${n.name} (${n.currency})`), 'Networks With Balance'];

    const csvRows = [header.join(',')];

    for (const row of filteredRows) {
      const line = [
        row.address,
        ...activeNetworks.map((n) => {
          const b = row.balances[n.id];
          return b && b.status === 'success' ? b.balanceFormatted : '0';
        }),
        row.totalPositiveNetworks
      ];
      csvRows.push(line.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `testnet-balances-${Date.now()}.csv`;
    link.click();
    showToast('File CSV berhasil di-download');
  };

  const handleExportJson = () => {
    const data = filteredRows.map((r) => ({
      address: r.address,
      balances: r.balances,
      totalPositiveNetworks: r.totalPositiveNetworks
    }));

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `testnet-balances-${Date.now()}.json`;
    link.click();
    showToast('File JSON berhasil di-download');
  };

  const handleCopySummary = () => {
    const activeNetworks = networks.filter((n) => selectedNetworkIds.includes(n.id));
    let text = `=== MULTI-WALLET TESTNET BALANCE CHECKER ===\n`;
    text += `Waktu: ${new Date().toLocaleString()}\n`;
    text += `Jaringan: ${activeNetworks.map((n) => n.shortName).join(', ')}\n\n`;

    for (const row of filteredRows) {
      text += `Wallet: ${row.address}\n`;
      for (const net of activeNetworks) {
        const b = row.balances[net.id];
        const val = b && b.status === 'success' ? `${b.balanceFormatted} ${net.currency}` : '0.0000';
        text += `  • ${net.shortName}: ${val}\n`;
      }
      text += '\n';
    }

    navigator.clipboard.writeText(text);
    showToast('Ringkasan teks berhasil disalin ke clipboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Toast Banner */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-indigo-400/40 animate-fade-in">
          <Sparkles className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20 text-white font-black text-lg">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-extrabold text-white tracking-tight">
                  Multi-Wallet Testnet Balance Checker
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 uppercase tracking-wide">
                  8 Networks
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Pengecekan saldo multi-wallet simultan di jaringan testnet EVM
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Client-Side Read Only</span>
            </div>
            <button
              type="button"
              onClick={() => setIsFaucetsOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium transition-colors cursor-pointer"
            >
              Daftar Faucet
            </button>
            <button
              type="button"
              onClick={() => setIsSettingsOpen(true)}
              className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-medium transition-colors cursor-pointer"
            >
              RPC Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Network Selector Panel */}
        <NetworkSelector
          networks={networks}
          selectedNetworkIds={selectedNetworkIds}
          onToggleNetwork={handleToggleNetwork}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          pingStatuses={pingStatuses}
          onRefreshPings={handleRefreshPings}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenFaucets={() => setIsFaucetsOpen(true)}
        />

        {/* Wallet Input Section */}
        <WalletInputSection
          rawInput={rawInput}
          onChangeInput={setRawInput}
          onStartCheck={handleStartCheck}
          onCancelCheck={handleCancelCheck}
          isChecking={progress.isChecking}
          selectedCount={selectedNetworkIds.length}
        />

        {/* Summary KPIs & Search/Filter Controls */}
        <SummaryStats
          rows={rows}
          networks={networks}
          selectedNetworkIds={selectedNetworkIds}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterPositiveOnly={filterPositiveOnly}
          onToggleFilterPositive={() => setFilterPositiveOnly((prev) => !prev)}
          onExportCsv={handleExportCsv}
          onExportJson={handleExportJson}
          onCopySummary={handleCopySummary}
          progress={progress}
        />

        {/* Primary Matrix Table */}
        <BalanceMatrixTable
          rows={filteredRows}
          networks={networks}
          selectedNetworkIds={selectedNetworkIds}
          onRecheckWallet={handleRecheckWallet}
          onRecheckSingleCell={handleRecheckSingleCell}
        />

        {/* Network Badges Summary Footer */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-300">8 Testnet Didukung:</span>
            {DEFAULT_NETWORKS.map((n) => (
              <span
                key={n.id}
                className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 flex items-center gap-1"
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: n.accentColor }} />
                {n.shortName}
              </span>
            ))}
          </div>

          <div className="text-[11px] text-slate-500">
            Powered by JSON-RPC <code className="font-mono text-slate-400">eth_getBalance</code>
          </div>
        </div>
      </main>

      {/* Modals */}
      <NetworkSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        networks={networks}
        customRpcs={customRpcs}
        onSaveCustomRpc={handleSaveCustomRpc}
        onResetCustomRpcs={handleResetCustomRpcs}
      />

      <FaucetLinksModal
        isOpen={isFaucetsOpen}
        onClose={() => setIsFaucetsOpen(false)}
        networks={networks}
      />
    </div>
  );
}
