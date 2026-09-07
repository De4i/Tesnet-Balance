import React, { useState } from 'react';
import { NetworkConfig, NetworkPingStatus } from '../types';
import { X, Check, Globe, RefreshCw, AlertCircle } from 'lucide-react';
import { pingRpc } from '../services/evmRpc';

interface NetworkSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  networks: NetworkConfig[];
  customRpcs: Record<string, string>;
  onSaveCustomRpc: (networkId: string, url: string) => void;
  onResetCustomRpcs: () => void;
}

export const NetworkSettingsModal: React.FC<NetworkSettingsModalProps> = ({
  isOpen,
  onClose,
  networks,
  customRpcs,
  onSaveCustomRpc,
  onResetCustomRpcs
}) => {
  const [testingId, setTestingId] = useState<string | null>(null);
  const [pingResults, setPingResults] = useState<Record<string, NetworkPingStatus>>({});

  if (!isOpen) return null;

  const handleTestRpc = async (net: NetworkConfig) => {
    setTestingId(net.id);
    const customUrl = customRpcs[net.id];
    const res = await pingRpc(net, customUrl);
    setPingResults((prev) => ({ ...prev, [net.id]: res }));
    setTestingId(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Pengaturan RPC Jaringan Testnet</h3>
              <p className="text-xs text-slate-400">
                Lihat atau sesuaikan RPC URL untuk masing-masing jaringan
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-6 overflow-y-auto space-y-4 divide-y divide-slate-800/60">
          {networks.map((net) => {
            const currentCustom = customRpcs[net.id] || '';
            const ping = pingResults[net.id];
            const isTesting = testingId === net.id;

            return (
              <div key={net.id} className="pt-3 first:pt-0 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: net.accentColor }}
                    />
                    <span className="font-semibold text-sm text-slate-200">{net.name}</span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                      Chain ID: {net.chainId}
                    </span>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                      Token: {net.currency}
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={isTesting}
                    onClick={() => handleTestRpc(net)}
                    className="text-xs px-2 py-1 rounded border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin text-indigo-400' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Tes Latensi'}</span>
                  </button>
                </div>

                <div className="text-xs text-slate-400">{net.description}</div>

                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-slate-400 block">
                    RPC Endpoint Aktif:
                  </label>
                  <input
                    type="text"
                    value={currentCustom || net.rpcUrls[0]}
                    onChange={(e) => onSaveCustomRpc(net.id, e.target.value)}
                    placeholder={net.rpcUrls[0]}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 font-mono text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {ping && (
                  <div className="text-[11px] font-mono flex items-center gap-2 mt-1">
                    {ping.status === 'online' ? (
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        Online ({ping.latencyMs}ms) {ping.lastBlock && `• Block #${ping.lastBlock}`}
                      </span>
                    ) : ping.status === 'slow' ? (
                      <span className="text-amber-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Slow ({ping.latencyMs}ms)
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Gagal terhubung / offline
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={onResetCustomRpcs}
            className="text-xs text-rose-400 hover:text-rose-300 underline cursor-pointer"
          >
            Reset ke RPC Default
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold cursor-pointer transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
