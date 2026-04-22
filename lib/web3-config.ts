// Deployed smart contract addresses
export const CONTRACTS = {
  // AuthiChainNFT on Polygon Amoy Testnet
  NFT_TESTNET: '0x4da4D2675e52374639C9c954f4f653887A9972BE',
  // To be deployed on Polygon Mainnet before production
  NFT_MAINNET: '',
  SUBSCRIPTION_MAINNET: '',
}

// Supported ERC-20 payment tokens on Polygon
export const PAYMENT_TOKENS = {
  USDC: {
    address: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
    symbol: 'USDC',
    decimals: 6,
    name: 'USD Coin',
  },
  USDT: {
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    symbol: 'USDT',
    decimals: 6,
    name: 'Tether USD',
  },
  MATIC: {
    address: '0x0000000000000000000000000000000000001010',
    symbol: 'MATIC',
    decimals: 18,
    name: 'Polygon',
  },
} as const

// Subscription prices in USD — converted to token amounts on the fly
export const CRYPTO_PRICING = {
  starter: {
    monthly: 50,
    yearly: 500,
  },
  professional: {
    monthly: 100,
    yearly: 1000,
  },
} as const

// 5% discount for paying with crypto
export const CRYPTO_DISCOUNT = 0.95
