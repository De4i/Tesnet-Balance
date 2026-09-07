import React, { useState } from 'react';
import { WalletBalanceRow, NetworkConfig, BalanceResult } from '../types';
import {
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  Inbox,
  ArrowUpRight
} from 'lucide-react';

interface BalanceMatrixTableProps {
  rows: WalletBalanceRow[];
  networks: NetworkConfig[];
  selectedNetworkIds: string[];
  onRecheckWallet: (address: string) => void;
  onRecheckSingleCell: (address: string, networkId: string) => void;
}

export const BalanceMatrixTable: React.FC<BalanceMatrixTableProps> = ({
  rows,
  networks,
  selectedNetworkIds,
  onRecheckWallet,
  onRecheckSingleCell
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const activeNetworks = networks.filter((n) => selectedNetworkIds.includes(n.id));

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAddress(text);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const truncateAddress = (addr: string) => {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  // Calculate column totals
  const columnTotals: Record<string, number> = {};
  for (const net of activeNetworks) {
    let sum = 0;
    for (const row of rows) {
      const b = row.balances[net.id];
      if (b && b.status === 'success' && b.balanceNumber > 0) {
        sum += b.balanceNumber;
      }
    }
    columnTotals[net.id] = sum;
  }

  if (rows.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
        <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto text-slate-500 mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-slate-200">Belum ada wallet yang ditampilkan</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Masukan address wallet pada kolom input di atas atau klik tombol <strong>"Contoh 5 Wallet"</strong> untuk memulai pengecekan.
        </p>
      </div>
    );
  }

  return (
    <div id="balance-matrix-container" className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[850px]">
          {/* Header */}
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3.5 px-4 sticky left-0 z-20 bg-slate-950 min-w-[190px] border-r border-slate-800/80">
                Wallet Address
              </th>
              {activeNetworks.map((net) => (
                <th
                  key={net.id}
                  className="py-3.5 px-3 min-w-[130px] border-r border-slate-800/40 text-center font-semibold"
                >
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-1 text-slate-200">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: net.accentColor }}
                      />
                      <span className="truncate max-w-[100px]" title={net.name}>
                        {net.shortName}
                      </span>
                      <a
                        href={net.explorerUrl}
                        target="_blank"
                        rel="noreferrer"
                        title={`Buka explorer ${net.name}`}
                        className="text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 font-normal mt-0.5">
                      {net.currency}
                    </span>
                  </div>
                </th>
              ))}
              <th className="py-3.5 px-3 text-center min-w-[90px]">
                Aksi
              </th>
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {rows.map((row, idx) => {
              const isCopied = copiedAddress === row.address;
              const hasBalance = row.totalPositiveNetworks > 0;

              return (
                <tr
                  key={row.address}
                  className={`transition-colors hover:bg-slate-800/40 ${
                    idx % 2 === 0 ? 'bg-slate-900/30' : 'bg-slate-900/60'
                  }`}
                >
                  {/* Sticky Address Column */}
                  <td className="py-3 px-4 sticky left-0 z-10 bg-slate-900 border-r border-slate-800/80 font-mono">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[10px] text-slate-500 font-mono w-4">
                          {idx + 1}.
                        </span>
                        <span
                          className="font-medium text-slate-200 hover:text-indigo-400 cursor-pointer transition-colors"
                          title={row.address}
                          onClick={() => handleCopy(row.address)}
                        >
                          {truncateAddress(row.address)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleCopy(row.address)}
                          title="Salin Address"
                          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          {isCopied ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Network Balance Cells */}
                  {activeNetworks.map((net) => {
                    const balanceData: BalanceResult | undefined = row.balances[net.id];

                    return (
                      <td
                        key={net.id}
                        className="py-2.5 px-3 text-center border-r border-slate-800/40 font-mono relative group"
                      >
                        {!balanceData || balanceData.status === 'idle' ? (
                          <span className="text-slate-600">-</span>
                        ) : balanceData.status === 'loading' ? (
                          <div className="flex items-center justify-center py-1">
                            <RefreshCw className="w-3.5 h-3.5 text-indigo-400 animate-spin" />
                          </div>
                        ) : balanceData.status === 'error' ? (
                          <div className="inline-flex items-center justify-center gap-1 text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded text-[11px]" title={balanceData.error || 'RPC Error'}>
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            <span>Error</span>
                            <button
                              type="button"
                              onClick={() => onRecheckSingleCell(row.address, net.id)}
                              title="Ulangi Cek"
                              className="opacity-60 hover:opacity-100 hover:text-white transition-opacity ml-0.5"
                            >
                              <RefreshCw className="w-2.5 h-2.5" />
                            </button>
                          </div>
                        ) : balanceData.balanceNumber > 0 ? (
                          <div className="inline-flex flex-col items-center">
                            <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold text-xs shadow-xs">
                              {balanceData.balanceFormatted}
                            </span>
                            <a
                              href={`${net.explorerAddressUrl}${row.address}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[9px] text-slate-500 hover:text-slate-300 flex items-center gap-0.5 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <span>txs</span>
                              <ArrowUpRight className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">
                            0.0000
                          </span>
                        )}
                      </td>
                    );
                  })}

                  {/* Action Column */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onRecheckWallet(row.address)}
                      title="Periksa ulang wallet ini"
                      className="p-1.5 rounded-lg border border-slate-700/80 bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Footer with Column Totals */}
          <tfoot>
            <tr className="bg-slate-950/90 border-t-2 border-slate-800 font-mono text-xs">
              <td className="py-3 px-4 sticky left-0 z-20 bg-slate-950 border-r border-slate-800 font-bold text-slate-300">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Total Saldo Jaringan</span>
                </div>
              </td>
              {activeNetworks.map((net) => {
                const total = columnTotals[net.id] || 0;
                return (
                  <td
                    key={net.id}
                    className="py-3 px-3 text-center border-r border-slate-800/40 font-bold"
                  >
                    <div className="text-slate-200">
                      {total > 0
                        ? total.toLocaleString(undefined, { maximumFractionDigits: 4 })
                        : '0.0000'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-normal">
                      {net.currency}
                    </div>
                  </td>
                );
              })}
              <td className="py-3 px-3"></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
