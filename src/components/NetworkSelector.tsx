import React from 'react';
import { NetworkConfig, NetworkPingStatus } from '../types';
import { Check, Globe, RefreshCw, Settings2, ExternalLink } from 'lucide-react';

interface NetworkSelectorProps {
  networks: NetworkConfig[];
  selectedNetworkIds: string[];
  onToggleNetwork: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  pingStatuses: Record<string, NetworkPingStatus>;
  onRefreshPings: () => void;
  onOpenSettings: () => void;
  onOpenFaucets: () => void;
}

export const NetworkSelector: React.FC<NetworkSelectorProps> = ({
  networks,
  selectedNetworkIds,
  onToggleNetwork,
  onSelectAll,
  onDeselectAll,
  pingStatuses,
  onRefreshPings,
  onOpenSettings,
  onOpenFaucets
}) => {
  const allSelected = selectedNetworkIds.length === networks.length;

  return (
    <div id="network-selector-panel" className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              Jaringan Testnet ({selectedNetworkIds.length}/{networks.length} Aktif)
            </h2>
            <p className="text-xs text-slate-400">
              Pilih jaringan yang ingin dicek secara simultan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-select-all"
            type="button"
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors font-medium cursor-pointer"
          >
            {allSelected ? 'Hapus Semua' : 'Pilih Semua (8)'}
          </button>
          <button
            id="btn-refresh-pings"
            type="button"
            title="Cek Latensi RPC"
            onClick={onRefreshPings}
            className="p-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-open-faucets"
            type="button"
            onClick={onOpenFaucets}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 transition-colors font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Faucet List</span>
          </button>
          <button
            id="btn-open-settings"
            type="button"
            onClick={onOpenSettings}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors font-medium flex items-center gap-1.5 cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Custom RPC</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {networks.map((net) => {
          const isSelected = selectedNetworkIds.includes(net.id);
          const ping = pingStatuses[net.id];

          return (
            <button
              id={`network-chip-${net.id}`}
              key={net.id}
              type="button"
              onClick={() => onToggleNetwork(net.id)}
              className={`relative flex flex-col p-3 rounded-xl border text-left transition-all cursor-pointer select-none ${
                isSelected
                  ? 'bg-slate-800/90 border-indigo-500/60 shadow-sm shadow-indigo-500/10 ring-1 ring-indigo-500/30'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-60 hover:opacity-90 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: net.accentColor }}
                />
                <div className="flex items-center gap-1">
                  {ping && (
                    <span
                      title={
                        ping.status === 'online'
                          ? `Online (${ping.latencyMs}ms)`
                          : ping.status === 'slow'
                          ? `Lambat (${ping.latencyMs}ms)`
                          : 'Offline / Gagal dihubungi'
                      }
                      className={`inline-block w-1.5 h-1.5 rounded-full ${
                        ping.status === 'online'
                          ? 'bg-emerald-400 animate-pulse'
                          : ping.status === 'slow'
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                      }`}
                    />
                  )}
                  <div
                    className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'border border-slate-600 text-transparent'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                  </div>
                </div>
              </div>

              <div className="font-semibold text-xs text-slate-200 truncate" title={net.name}>
                {net.shortName}
              </div>

              <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400">
                <span className="font-mono">ID:{net.chainId}</span>
                <span className="font-semibold px-1 py-0.2 rounded bg-slate-800 border border-slate-700/50 text-[9px] text-slate-300">
                  {net.currency}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
