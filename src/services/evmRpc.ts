import { NetworkConfig, BalanceResult, NetworkPingStatus } from '../types';

/**
 * Validates Ethereum / EVM address format (0x followed by 40 hexadecimal characters)
 */
export function isValidEvmAddress(address: string): boolean {
  if (!address) return false;
  const trimmed = address.trim();
  return /^0x[a-fA-F0-9]{40}$/.test(trimmed);
}

/**
 * Extracts and deduplicates EVM addresses from raw text (newlines, commas, spaces, CSV)
 */
export function extractEvmAddresses(rawText: string): { valid: string[]; invalid: string[] } {
  const tokens = rawText
    .split(/[\r\n,;\s]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const validSet = new Set<string>();
  const invalidList: string[] = [];

  for (const token of tokens) {
    if (isValidEvmAddress(token)) {
      validSet.add(token.toLowerCase());
    } else {
      if (token.length > 3) {
        invalidList.push(token);
      }
    }
  }

  return {
    valid: Array.from(validSet),
    invalid: invalidList
  };
}

/**
 * Formats Wei string to human-readable ETH/Native token number and string
 */
export function formatWeiToEther(weiHexOrDec: string): { formatted: string; numberVal: number } {
  try {
    if (!weiHexOrDec || weiHexOrDec === '0x' || weiHexOrDec === '0x0') {
      return { formatted: '0.0000', numberVal: 0 };
    }

    let weiBig: bigint;
    if (weiHexOrDec.startsWith('0x') || weiHexOrDec.startsWith('0X')) {
      weiBig = BigInt(weiHexOrDec);
    } else {
      weiBig = BigInt(weiHexOrDec);
    }

    if (weiBig === 0n) {
      return { formatted: '0.0000', numberVal: 0 };
    }

    const divisor = 10n ** 18n;
    const integerPart = weiBig / divisor;
    const remainder = weiBig % divisor;

    // Pad remainder to 18 digits
    const remainderStr = remainder.toString().padStart(18, '0');

    // Float approximation for numeric comparisons and sorting
    const num = Number(integerPart) + Number(remainder) / 1e18;

    // Display formatted string with intelligent precision
    if (integerPart > 0n) {
      const decimals = remainderStr.slice(0, 4);
      return {
        formatted: `${integerPart.toString()}.${decimals}`,
        numberVal: num
      };
    } else {
      // Small fraction
      if (num < 0.000001 && num > 0) {
        return {
          formatted: '< 0.000001',
          numberVal: num
        };
      }
      const trimmed = remainderStr.slice(0, 6);
      return {
        formatted: `0.${trimmed}`,
        numberVal: num
      };
    }
  } catch (err) {
    console.error('Error formatting wei:', err);
    return { formatted: '0.0000', numberVal: 0 };
  }
}

/**
 * Fetches balance for a given address on a network with RPC fallback
 */
export async function fetchBalance(
  address: string,
  network: NetworkConfig,
  customRpcUrl?: string,
  signal?: AbortSignal
): Promise<BalanceResult> {
  const rpcsToTry = customRpcUrl ? [customRpcUrl, ...network.rpcUrls] : network.rpcUrls;
  let lastError = 'RPC request failed';

  for (const rpcUrl of rpcsToTry) {
    try {
      const response = await fetch(rpcUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method: 'eth_getBalance',
          params: [address, 'latest']
        }),
        signal: signal || AbortSignal.timeout(9000)
      });

      if (!response.ok) {
        lastError = `HTTP ${response.status}: ${response.statusText}`;
        continue;
      }

      const data = await response.json();
      if (data.error) {
        lastError = data.error.message || 'RPC returned error';
        continue;
      }

      if (typeof data.result === 'string') {
        const { formatted, numberVal } = formatWeiToEther(data.result);
        return {
          balanceWei: data.result,
          balanceFormatted: formatted,
          balanceNumber: numberVal,
          status: 'success',
          updatedAt: Date.now(),
          usedRpc: rpcUrl
        };
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw err;
      }
      lastError = err.message || 'Network error';
    }
  }

  return {
    balanceWei: '0x0',
    balanceFormatted: 'Error',
    balanceNumber: 0,
    status: 'error',
    error: lastError,
    updatedAt: Date.now()
  };
}

/**
 * Pings an RPC endpoint to test latency and check latest block
 */
export async function pingRpc(
  network: NetworkConfig,
  customRpcUrl?: string
): Promise<NetworkPingStatus> {
  const rpcUrl = customRpcUrl || network.rpcUrls[0];
  const startTime = performance.now();

  try {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_blockNumber',
        params: []
      }),
      signal: AbortSignal.timeout(6000)
    });

    const elapsed = Math.round(performance.now() - startTime);

    if (!response.ok) {
      return {
        networkId: network.id,
        latencyMs: null,
        status: 'offline'
      };
    }

    const data = await response.json();
    if (data.result) {
      const blockNum = parseInt(data.result, 16);
      return {
        networkId: network.id,
        latencyMs: elapsed,
        status: elapsed > 1500 ? 'slow' : 'online',
        lastBlock: blockNum
      };
    }

    return {
      networkId: network.id,
      latencyMs: elapsed,
      status: 'slow'
    };
  } catch (err) {
    return {
      networkId: network.id,
      latencyMs: null,
      status: 'offline'
    };
  }
}

/**
 * Concurrency worker queue to process tasks with a maximum concurrency limit
 */
export async function runWithConcurrency<T>(
  tasks: (() => Promise<T>)[],
  concurrencyLimit = 5
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let currentIndex = 0;

  async function worker() {
    while (currentIndex < tasks.length) {
      const index = currentIndex++;
      try {
        results[index] = await tasks[index]();
      } catch (e: any) {
        // Handle error gracefully
        results[index] = null as any;
      }
    }
  }

  const workers = Array.from({ length: Math.min(concurrencyLimit, tasks.length) }, () => worker());
  await Promise.all(workers);
  return results;
}
