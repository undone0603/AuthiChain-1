# AuthiChain Demo Mapping

This table maps each target **industry** to the demo folder that implements
its storymode walkthrough. Use this as the canonical reference when routing
inbound intake requests (see [`intake.md`](./intake.md)) or when writing
investor / marketing material that references live demos.

## Canonical industry → demo path

| Industry     | Demo Path                |
|--------------|--------------------------|
| Pharma       | /app/demos/pharma        |
| Cannabis     | /app/demos/cannabis      |
| Luxury       | /app/demos/luxury        |
| Collectibles | /app/demos/collectibles  |
| Supply Chain | /app/demos/supplychain   |

## Current implementation status

The canonical list above is the target marketing lineup. The table below
reflects which demos currently ship in the `app/demos/*` tree today, so
marketing, sales, and engineering can see the gap at a glance.

| Industry     | Target path              | Current path                  | Status     |
|--------------|--------------------------|-------------------------------|------------|
| Pharma       | /app/demos/pharma        | `app/demos/pharma/page.tsx`       | ✅ Live    |
| Luxury       | /app/demos/luxury        | `app/demos/luxury-watch/page.tsx` | ✅ Live (as Luxury Watch) |
| Fashion      | /app/demos/fashion       | `app/demos/fashion/page.tsx`      | ✅ Live (multi-brand fashion) |
| Supply Chain | /app/demos/supplychain   | `app/demos/supply-chain/page.tsx` | ✅ Live    |
| Cannabis     | /app/demos/cannabis      | _not yet implemented_             | ⏳ Planned |
| Collectibles | /app/demos/collectibles  | _not yet implemented_             | ⏳ Planned |

## How to add a new demo

1. Create `app/demos/<industry>/page.tsx`.
2. Prepend the required marketing header block (see
   [`README.md`](./README.md) → *How to write a new demo with a marketing
   header*).
3. Add the new row to the **Canonical industry → demo path** table above.
4. Add a matching product + `why` + `value` entry in
   `outputs/storymode-demo-manifest.json` if the demo ships a storymode
   product.
5. Link the new demo from `app/demos/page.tsx` (the demos index).
