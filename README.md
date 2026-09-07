# Multi-Wallet Testnet Balance Checker

Aplikasi antarmuka web (GUI) interaktif berkinerja tinggi untuk memeriksa saldo (*native balance*) banyak alamat dompet EVM (multi-wallet) secara simultan di **8 jaringan testnet EVM**. Dirancang untuk airdrop hunter, pengembang smart contract, tester node, dan komunitas Web3 yang mengelola puluhan hingga ratusan wallet tanpa perlu mengecek satu per satu di block explorer.

---

## 🚀 Fitur Utama

- **Pengecekan Saldo Simultan & Non-blocking:**
  - Memeriksa puluhan hingga ratusan wallet sekaligus di berbagai jaringan pilihan secara paralel dengan mekanisme *batching* untuk mencegah pemblokiran *rate-limit* RPC.
  - Mekanisme **RPC Fallback Otomatis**: Jika endpoint RPC utama mengalami kegagalan/timeout, sistem secara otomatis beralih ke RPC cadangan.
- **Dukungan 8 Jaringan Testnet EVM:**
  - **ETH GIWA Testnet** (Dunamu / Upbit L2 OP-Stack)
  - **SepoliaETH** (Ethereum Sepolia PoS)
  - **KRYVORA ETH Testnet** (Kryvora Network L2)
  - **Litvm ETH** (LitVM LiteForge Caldera Nitro Rollup)
  - **Base ETH** (Base Sepolia L2)
  - **BNB Testnet** (BNB Smart Chain Testnet)
  - **Arbitrum Sepolia** (Arbitrum One Rollup Sepolia)
  - **Avalanche Fuji** (Avalanche C-Chain Fuji Testnet)
- **Fleksibilitas Input Alamat:**
  - Input teks bebas: tempel daftar wallet yang dipisahkan baris baru, koma, spasi, atau titik koma.
  - **Import File**: Dukungan unggah file `.txt` atau `.csv`.
  - **Tombol Clipboard**: Tempel langsung dari papan klip dengan satu klik.
  - **Validasi Otomatis**: Mendeteksi pola alamat EVM valid (`0x...` 40 karakter heksadesimal) dan memisahkan masukan yang tidak valid.
  - **Contoh Cepat (Sample Wallets)**: Muat 5 contoh wallet untuk menguji fungsi aplikasi secara instan.
  - **Keyboard Shortcut**: Tekan `Ctrl + Enter` (atau `Cmd + Enter`) pada textarea untuk langsung memulai pengecekan.
- **Tabel Matriks Saldo (Balance Matrix):**
  - Tampilan matriks interaktif dengan kolom alamat *sticky* (tetap terlihat saat scroll horizontal).
  - Penandaan warna visual (badge hijau *emerald* untuk wallet bersaldo > 0, warna redup untuk saldo 0).
  - Tautan langsung ke Block Explorer resmi untuk masing-masing wallet di setiap jaringan.
  - Tombol **Cek Ulang (Retry)** untuk setiap sel saldo atau seluruh baris wallet yang gagal.
  - Baris total akumulasi saldo per token di bagian bawah tabel (*footer summary*).
- **Statistik & Ringkasan Cepat (Summary Cards):**
  - Total wallet aktif yang memiliki saldo (`Active Wallets`).
  - Total akumulasi koin testnet per jenis token (`ETH`, `tBNB`, `AVAX`, `zkLTC`).
  - Indikator progres pengecekan real-time dengan persentase keberhasilan.
- **Penyaringan & Ekspor Data:**
  - **Pencarian Cepat**: Filter wallet berdasarkan awalan/akhiran alamat.
  - **Filter Saldo Positif**: Opsi sakelar *"Hanya Saldo > 0"* untuk menyembunyikan wallet kosong.
  - **Ekspor CSV**: Unduh laporan lengkap saldo ke dalam format file spreadsheet Excel/CSV.
  - **Ekspor JSON**: Simpan data mentah terstruktur untuk keperluan otomatisasi script atau bot.
  - **Salin Teks**: Salin format ringkasan teks bersih ke clipboard.
- **Pengaturan Jaringan & RPC Kustom:**
  - Uji latensi (*ping latency*) endpoint RPC secara real-time.
  - Kustomisasi URL RPC untuk setiap jaringan bila ingin menggunakan provider pribadi (misal: Alchemy, Infura, QuickNode, atau private node).
  - Reset ke URL RPC standar kapan saja.
- **Daftar Tautan Faucet:**
  - Modal akses cepat ke faucet resmi dan tepercaya untuk mendapatkan token gratis di semua 8 jaringan yang didukung.

---

## 🌐 Daftar Jaringan & Konfigurasi RPC

| Jaringan | Chain ID | Simbol Token | RPC Default | Block Explorer |
| :--- | :--- | :--- | :--- | :--- |
| **ETH GIWA Testnet** | `91342` | `ETH` | `https://sepolia-rpc.giwa.io` | [sepolia-explorer.giwa.io](https://sepolia-explorer.giwa.io) |
| **SepoliaETH** | `11155111` | `ETH` | `https://ethereum-sepolia-rpc.publicnode.com` | [sepolia.etherscan.io](https://sepolia.etherscan.io) |
| **KRYVORA ETH** | `73833260` | `ETH` | `https://rpc-testnet.kryvora.network` | [explorer-testnet.kryvora.network](https://explorer-testnet.kryvora.network) |
| **Litvm ETH (LiteForge)** | `4441` | `zkLTC` | `https://liteforge.rpc.caldera.xyz/http` | [liteforge.explorer.caldera.xyz](https://liteforge.explorer.caldera.xyz) |
| **Base ETH (Base Sepolia)** | `84532` | `ETH` | `https://sepolia.base.org` | [sepolia.basescan.org](https://sepolia.basescan.org) |
| **BNB Testnet (BSC)** | `97` | `tBNB` | `https://bsc-testnet-rpc.publicnode.com` | [testnet.bscscan.com](https://testnet.bscscan.com) |
| **Arbitrum Sepolia** | `421614` | `ETH` | `https://sepolia-rollup.arbitrum.io/rpc` | [sepolia.arbiscan.io](https://sepolia.arbiscan.io) |
| **Avalanche Fuji** | `43113` | `AVAX` | `https://api.avax-test.network/ext/bc/C/rpc` | [testnet.snowtrace.io](https://testnet.snowtrace.io) |

---

## 📖 Panduan Penggunaan

1. **Masukkan Alamat Wallet:**
   - Masukkan satu atau banyak alamat EVM (format `0x...`) ke kotak textarea.
   - Atau klik **"Unggah File"** untuk memasukkan daftar wallet dari file `.txt` atau `.csv`.
   - Atau klik **"Contoh 5 Wallet"** untuk mencoba langsung dengan alamat demo.
2. **Pilih Jaringan Target:**
   - Centang atau hapus centang jaringan yang ingin dicek pada panel *Target Jaringan*.
   - Gunakan tombol **"Pilih Semua"** untuk memilih ke-8 jaringan sekaligus.
3. **Mulai Pengecekan:**
   - Klik tombol **"Mulai Cek Saldo"** atau gunakan tombol pintas `Ctrl + Enter`.
   - Progres pengecekan real-time akan muncul pada progress bar.
4. **Analisis & Ekspor Hasil:**
   - Periksa tabel matriks saldo untuk melihat rincian saldo per jaringan.
   - Gunakan filter *"Hanya Saldo > 0"* untuk mengisolasi wallet yang memiliki saldo aktif.
   - Klik tombol **"Ekspor CSV"** atau **"JSON"** untuk mengunduh laporan hasil pengecekan.

---

## 💻 Menjalankan Secara Lokal (Development)

### Prasyarat
- [Node.js](https://nodejs.org/) versi 18 atau lebih tinggi
- Pengelola paket: `npm`, `pnpm`, atau `bun`

### Langkah Instalasi

1. **Clone repository atau ekstrak file proyek:**
   ```bash
   cd multi-wallet-testnet-balance-checker
   ```

2. **Instal dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan server development:**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

4. **Kompilasi build produksi:**
   ```bash
   npm run build
   ```

5. **Validasi TypeScript:**
   ```bash
   npm run lint
   ```

---

## 📁 Struktur Direktori

```text
├── index.html                    # Entry point HTML aplikasi
├── metadata.json                 # Metadata konfigurasi aplikasi
├── package.json                  # Konfigurasi dependensi dan skrip npm
├── src/
│   ├── App.tsx                   # Komponen utama & orkestrasi state pengecekan
│   ├── components/
│   │   ├── BalanceMatrixTable.tsx   # Tabel matriks saldo interaktif & sticky scroll
│   │   ├── FaucetLinksModal.tsx     # Modal daftar faucet resmi 8 testnet
│   │   ├── NetworkSelector.tsx      # Pemilih jaringan & quick toggle
│   │   ├── NetworkSettingsModal.tsx # Modal kustomisasi RPC URL & uji latensi
│   │   ├── SummaryStats.tsx         # Kartu metrik ringkasan total saldo
│   │   └── WalletInputSection.tsx   # Panel input textarea, import file & validasi
│   ├── constants/
│   │   └── networks.ts           # Daftar konfigurasi RPC, explorer, faucet, & chain ID
│   ├── services/
│   │   └── rpc.ts                # Client JSON-RPC EVM (eth_getBalance, hex to decimal, fallback)
│   ├── types.ts                  # Definisi antarmuka & tipe TypeScript
│   ├── index.css                 # Konfigurasi styling Tailwind CSS
│   └── main.tsx                  # Root mount React 19
└── tsconfig.json                 # Konfigurasi TypeScript
```

---

## 🔒 Keamanan & Privasi

- **Hanya Membaca (Read-Only)**: Aplikasi ini hanya memanggil metode JSON-RPC standar `eth_getBalance` yang bersifat publik.
- **Tanpa Kunci Privat**: Aplikasi **TIDAK PERNAH** meminta, membaca, ataupun menyimpan private key atau mnemonic seed phrase.
- **Client-Side Saja**: Seluruh panggilan RPC dilakukan langsung dari browser pengguna ke penyedia RPC publik tanpa perantara database server internal.
