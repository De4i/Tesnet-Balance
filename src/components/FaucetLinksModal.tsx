import React from 'react';
import { NetworkConfig } from '../types';
import { X, ExternalLink, Droplets, Info } from 'lucide-react';

interface FaucetLinksModalProps {
  isOpen: boolean;
  onClose: () => void;
  networks: NetworkConfig[];
}

export const FaucetLinksModal: React.FC<FaucetLinksModalProps> = ({
  isOpen,
  onClose,
  networks
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Daftar Faucet Testnet Resmi</h3>
              <p className="text-xs text-slate-400">
                Link untuk klaim saldo token testnet gratis di 8 jaringan
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

        {/* Tip Box */}
        <div className="px-6 pt-4">
          <div className="bg-indigo-950/30 border border-indigo-500/30 rounded-xl p-3 flex items-start gap-2.5 text-xs text-indigo-300">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              Klaim testnet token biasanya membutuhkan verifikasi captcha, akun GitHub/Twitter, atau saldo minimal di mainnet untuk mencegah botting.
            </span>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3">
          {networks.map((net) => (
            <div
              key={net.id}
              className="p-3.5 rounded-xl border border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: net.accentColor }}
                  />
                  <span className="font-semibold text-sm text-slate-200">{net.name}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400">
                    {net.currency}
                  </span>
                </div>
                <div className="text-xs text-slate-400">{net.description}</div>
              </div>

              <a
                href={net.faucetUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors whitespace-nowrap"
              >
                <span>Buka Faucet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
