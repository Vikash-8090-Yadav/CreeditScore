# Crypto Address Analyzer

A modern web application that provides comprehensive analysis of Ethereum addresses, including credit scoring, transaction history, and NFT holdings.

## Features

- **Address Analysis**: Get detailed insights about any Ethereum address
- **Credit Scoring**: Proprietary algorithm to assess address risk and creditworthiness
- **Transaction History**: View complete transaction history with timestamps
- **NFT Holdings**: Track NFT transactions and holdings
- **Real-time Data**: Powered by Blockscout API for accurate, up-to-date information
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Blockchain Data**: Blockscout API
- **State Management**: React Hooks
- **Icons**: Lucide Icons

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/crypto-address-analyzer.git
cd crypto-address-analyzer
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_API_BASE_URL=https://eth.blockscout.com/api
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
crypto-address-analyzer/
├── app/                    # Next.js app directory
│   ├── analyze/           # Analysis page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── address-overview/  # Address information display
│   ├── credit-score/      # Credit score visualization
│   └── nft-transactions/  # NFT transaction history
├── services/             # API services
│   ├── balance-api.ts    # Balance fetching
│   ├── transaction-api.ts # Transaction history
│   └── nft-transactions-api.ts # NFT data
└── public/               # Static assets
```

## API Integration

The application uses the Blockscout API for fetching blockchain data:

- Balance: `/api?module=account&action=balance&address={address}`
- Transactions: `/api?module=account&action=txlist&address={address}`
- NFT Transactions: `/api?module=account&action=tokennfttx&address={address}`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Blockscout](https://blockscout.com/) for providing the blockchain data API
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Lucide Icons](https://lucide.dev/) for beautiful icons 