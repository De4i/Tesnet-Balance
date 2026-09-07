import { NetworkConfig } from '../types';

export const DEFAULT_NETWORKS: NetworkConfig[] = [
  {
    id: 'giwa-sepolia',
    name: 'ETH GIWA Testnet',
    shortName: 'GIWA ETH',
    chainId: 91342,
    currency: 'ETH',
    rpcUrls: [
      'https://sepolia-rpc.giwa.io',
    ],
    explorerUrl: 'https://sepolia-explorer.giwa.io',
    explorerAddressUrl: 'https://sepolia-explorer.giwa.io/address/',
    faucetUrl: 'https://faucet.giwa.io',
    badgeBg: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    badgeBorder: 'border-blue-500',
    badgeText: 'text-blue-600 dark:text-blue-400',
    accentColor: '#3b82f6',
    description: 'Ethereum L2 OP-Stack testnet by Dunamu / Upbit'
  },
  {
    id: 'sepolia-eth',
    name: 'SepoliaETH',
    shortName: 'Sepolia ETH',
    chainId: 11155111,
    currency: 'ETH',
    rpcUrls: [
      'https://ethereum-sepolia-rpc.publicnode.com',
      'https://rpc.sepolia.org',
      'https://1rpc.io/sepolia',
      'https://sepolia.drpc.org'
    ],
    explorerUrl: 'https://sepolia.etherscan.io',
    explorerAddressUrl: 'https://sepolia.etherscan.io/address/',
    faucetUrl: 'https://sepoliafaucet.com',
    badgeBg: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    badgeBorder: 'border-purple-500',
    badgeText: 'text-purple-600 dark:text-purple-400',
    accentColor: '#8b5cf6',
    description: 'Ethereum primary PoS testnet'
  },
  {
    id: 'kryvora-eth',
    name: 'KRYVORA ETH Testnet',
    shortName: 'Kryvora ETH',
    chainId: 73833260,
    currency: 'ETH',
    rpcUrls: [
      'https://rpc-testnet.kryvora.network'
    ],
    explorerUrl: 'https://explorer-testnet.kryvora.network',
    explorerAddressUrl: 'https://explorer-testnet.kryvora.network/address/',
    faucetUrl: 'https://faucet-testnet.kryvora.network/',
    badgeBg: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    badgeBorder: 'border-emerald-500',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    accentColor: '#10b981',
    description: 'Kryvora EVM-compatible scalable L2 testnet'
  },
  {
    id: 'litvm-eth',
    name: 'Litvm ETH (LiteForge)',
    shortName: 'LitVM ETH',
    chainId: 4441,
    currency: 'zkLTC',
    rpcUrls: [
      'https://liteforge.rpc.caldera.xyz/http',
      'https://rpc.lite-node.com'
    ],
    explorerUrl: 'https://liteforge.explorer.caldera.xyz',
    explorerAddressUrl: 'https://liteforge.explorer.caldera.xyz/address/',
    faucetUrl: 'https://liteforge.hub.caldera.xyz/',
    badgeBg: 'bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/30',
    badgeBorder: 'border-slate-500',
    badgeText: 'text-slate-600 dark:text-slate-400',
    accentColor: '#64748b',
    description: 'LitVM LiteForge EVM Nitro Rollup testnet'
  },
  {
    id: 'base-eth',
    name: 'Base ETH (Base Sepolia)',
    shortName: 'Base ETH',
    chainId: 84532,
    currency: 'ETH',
    rpcUrls: [
      'https://sepolia.base.org',
      'https://base-sepolia-rpc.publicnode.com'
    ],
    explorerUrl: 'https://sepolia.basescan.org',
    explorerAddressUrl: 'https://sepolia.basescan.org/address/',
    faucetUrl: 'https://www.coinbase.com/faucets/base-ethereum-sepolia-faucet',
    badgeBg: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
    badgeBorder: 'border-sky-500',
    badgeText: 'text-sky-600 dark:text-sky-400',
    accentColor: '#0284c7',
    description: 'Coinbase Base Layer 2 Sepolia testnet'
  },
  {
    id: 'bnb-testnet',
    name: 'BNB Testnet (BSC)',
    shortName: 'BNB Testnet',
    chainId: 97,
    currency: 'tBNB',
    rpcUrls: [
      'https://bsc-testnet-rpc.publicnode.com',
      'https://data-seed-prebsc-1-s1.binance.org:8545/'
    ],
    explorerUrl: 'https://testnet.bscscan.com',
    explorerAddressUrl: 'https://testnet.bscscan.com/address/',
    faucetUrl: 'https://www.bnbchain.org/en/testnet-faucet',
    badgeBg: 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30',
    badgeBorder: 'border-amber-500',
    badgeText: 'text-amber-600 dark:text-amber-400',
    accentColor: '#d97706',
    description: 'BNB Smart Chain (BSC) Testnet'
  },
  {
    id: 'arbitrum-sepolia',
    name: 'Arbitrum Sepolia',
    shortName: 'Arb Sepolia',
    chainId: 421614,
    currency: 'ETH',
    rpcUrls: [
      'https://sepolia-rollup.arbitrum.io/rpc',
      'https://arbitrum-sepolia-rpc.publicnode.com'
    ],
    explorerUrl: 'https://sepolia.arbiscan.io',
    explorerAddressUrl: 'https://sepolia.arbiscan.io/address/',
    faucetUrl: 'https://faucet.quicknode.com/arbitrum/sepolia',
    badgeBg: 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    badgeBorder: 'border-cyan-500',
    badgeText: 'text-cyan-600 dark:text-cyan-400',
    accentColor: '#0891b2',
    description: 'Arbitrum One Rollup Sepolia testnet'
  },
  {
    id: 'avalanche-fuji',
    name: 'Avalanche Fuji',
    shortName: 'AVAX Fuji',
    chainId: 43113,
    currency: 'AVAX',
    rpcUrls: [
      'https://api.avax-test.network/ext/bc/C/rpc',
      'https://avalanche-fuji-c-chain-rpc.publicnode.com'
    ],
    explorerUrl: 'https://testnet.snowtrace.io',
    explorerAddressUrl: 'https://testnet.snowtrace.io/address/',
    faucetUrl: 'https://core.app/tools/testnet-faucet/',
    badgeBg: 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30',
    badgeBorder: 'border-rose-500',
    badgeText: 'text-rose-600 dark:text-rose-400',
    accentColor: '#e11d48',
    description: 'Avalanche C-Chain Fuji testnet'
  }
];

export const SAMPLE_WALLETS = [
  '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  '0x000000000000000000000000000000000000dEaD',
  '0x1111111254EEB25477B68fb85Ed929f73A960582',
  '0x28C6c06298d514Db089934071355E5743bf21d60',
  '0x71C7656EC7ab88b098defB751B7401B5f6d8976F'
];
