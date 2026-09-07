export interface NetworkConfig {
  id: string;
  name: string;
  shortName: string;
  chainId: number;
  currency: string;
  rpcUrls: string[];
  explorerUrl: string;
  explorerAddressUrl: string;
  faucetUrl: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  accentColor: string;
  description: string;
}

export interface BalanceResult {
  balanceWei: string;
  balanceFormatted: string;
  balanceNumber: number;
  status: 'idle' | 'loading' | 'success' | 'error';
  error?: string;
  updatedAt?: number;
  usedRpc?: string;
}

export interface WalletBalanceRow {
  address: string;
  label?: string;
  balances: Record<string, BalanceResult>;
  totalPositiveNetworks: number;
}

export interface CheckProgress {
  isChecking: boolean;
  totalTasks: number;
  completedTasks: number;
  currentTaskDescription?: string;
}

export interface NetworkPingStatus {
  networkId: string;
  latencyMs: number | null;
  status: 'online' | 'slow' | 'offline' | 'checking';
  lastBlock?: number;
}
