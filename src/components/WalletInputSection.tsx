import React, { useRef, useState } from 'react';
import { extractEvmAddresses } from '../services/evmRpc';
import { SAMPLE_WALLETS } from '../constants/networks';
import {
  Wallet,
  Play,
  Square,
  UploadCloud,
  ClipboardPaste,
  Sparkles,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Search
} from 'lucide-react';

interface WalletInputSectionProps {
  rawInput: string;
  onChangeInput: (val: string) => void;
  onStartCheck: () => void;
  onCancelCheck: () => void;
  isChecking: boolean;
  selectedCount: number;
}

export const WalletInputSection: React.FC<WalletInputSectionProps> = ({
  rawInput,
  onChangeInput,
  onStartCheck,
  onCancelCheck,
  isChecking,
  selectedCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copyNotification, setCopyNotification] = useState<string | null>(null);

  const { valid, invalid } = extractEvmAddresses(rawInput);

  const handleLoadSamples = () => {
    onChangeInput(SAMPLE_WALLETS.join('\n'));
    triggerNotice('5 contoh wallet berhasil dimuat!');
  };

  const handleClear = () => {
    onChangeInput('');
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChangeInput(rawInput ? `${rawInput}\n${text}` : text);
        triggerNotice('Konten clipboard berhasil ditempel!');
      }
    } catch (e) {
      alert('Tidak dapat mengakses clipboard. Silakan tempel manual dengan Ctrl+V.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
  };

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onChangeInput(rawInput ? `${rawInput}\n${content}` : content);
        triggerNotice(`File ${file.name} berhasil dimuat!`);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      readFile(e.dataTransfer.files[0]);
    }
  };

  const handleCleanInvalid = () => {
    onChangeInput(valid.join('\n'));
    triggerNotice('Alamat tidak valid berhasil dibersihkan!');
  };

  const triggerNotice = (msg: string) => {
    setCopyNotification(msg);
    setTimeout(() => setCopyNotification(null), 3000);
  };

  return (
    <div
      id="wallet-input-card"
      className={`bg-slate-900/70 border transition-all rounded-2xl p-5 shadow-sm ${
        isDragOver ? 'border-indigo-500 bg-indigo-950/20' : 'border-slate-800/80'
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              Daftar Wallet EVM
            </h2>
            <p className="text-xs text-slate-400">
              Masukan 1 atau banyak address wallet EVM (0x...) per baris atau dipisah koma
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            id="btn-sample-wallets"
            type="button"
            onClick={handleLoadSamples}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-indigo-500/40 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Contoh 5 Wallet</span>
          </button>

          <button
            id="btn-paste-clipboard"
            type="button"
            onClick={handlePasteClipboard}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            <span>Tempel</span>
          </button>

          <button
            id="btn-upload-file"
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".txt,.csv"
            className="hidden"
          />

          {rawInput && (
            <button
              id="btn-clear-wallets"
              type="button"
              onClick={handleClear}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-700/80 bg-slate-800/50 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 text-slate-400 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
          )}
        </div>
      </div>

      {/* Textarea */}
      <div className="relative">
        <textarea
          id="wallets-textarea"
          value={rawInput}
          onChange={(e) => onChangeInput(e.target.value)}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault();
              if (valid.length > 0 && selectedCount > 0 && !isChecking) {
                onStartCheck();
              }
            }
          }}
          placeholder={`0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045\n0x000000000000000000000000000000000000dEaD\n0x1111111254EEB25477B68fb85Ed929f73A960582\n\n(Tempel hingga ratusan address di sini atau seret file .txt / .csv • Tekan Ctrl+Enter untuk Cek)`}
          rows={5}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 font-mono text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 resize-y transition-all"
        />

        {copyNotification && (
          <div className="absolute top-2 right-2 px-2.5 py-1 rounded bg-indigo-600/90 text-white text-xs font-medium shadow-md animate-fade-in">
            {copyNotification}
          </div>
        )}
      </div>

      {/* Input Stats & Action Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className={`w-4 h-4 ${valid.length > 0 ? 'text-emerald-400' : 'text-slate-500'}`} />
            <span className="text-slate-300 font-semibold">{valid.length}</span>
            <span className="text-slate-400">Wallet Valid</span>
          </div>

          {invalid.length > 0 && (
            <div className="flex items-center gap-1.5 text-amber-400">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{invalid.length} data tidak valid</span>
              <button
                type="button"
                onClick={handleCleanInvalid}
                className="underline hover:text-amber-300 text-[11px] ml-1 cursor-pointer font-medium"
              >
                Hapus
              </button>
            </div>
          )}

          {valid.length > 0 && (
            <span className="text-slate-500 text-[11px] hidden sm:inline">
              Total kueri: {valid.length} wallet × {selectedCount} jaringan ={' '}
              <strong className="text-slate-300">{valid.length * selectedCount} RPC calls</strong>
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isChecking ? (
            <button
              id="btn-stop-check"
              type="button"
              onClick={onCancelCheck}
              className="px-4 py-2.5 rounded-xl border border-rose-500/40 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Hentikan Proses</span>
            </button>
          ) : (
            <button
              id="btn-start-check"
              type="button"
              disabled={valid.length === 0 || selectedCount === 0}
              onClick={onStartCheck}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                valid.length > 0 && selectedCount > 0
                  ? 'bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-indigo-500/20 active:scale-[0.98]'
                  : 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Cek Balance Sekarang ({valid.length})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
