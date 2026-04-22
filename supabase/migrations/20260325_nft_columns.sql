-- Migration: Add NFT certificate columns to products table
-- These columns are written by /api/nft/mint after a successful on-chain mint.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS nft_token_id   TEXT,
  ADD COLUMN IF NOT EXISTS nft_tx_hash    TEXT,
  ADD COLUMN IF NOT EXISTS nft_contract   TEXT;

CREATE INDEX IF NOT EXISTS idx_products_nft_token_id ON products(nft_token_id);
