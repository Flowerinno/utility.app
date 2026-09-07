# Utilito

A focused Shopify developer toolkit — debug Liquid, verify webhooks, fetch tokens, run GraphQL, and handle everyday env conversions.

## Tools

### General

- **Env → JSON** — Paste `.env` content and convert to formatted JSON.

### Shopify

- **Shopify Snippets** — Browse and copy Liquid `console.table` debug snippets for product, collection, customer, cart, shop, article, search, metaobjects, and routes.
- **Shopify Token** — OAuth authorize + code exchange for Admin API access tokens.
- **Verify Token** — Check whether an Admin API access token belongs to a given shop.
- **Webhook HMAC** — Verify `X-Shopify-Hmac-Sha256` signatures against a raw request body.
- **Shop Admin Links** — Generate admin, theme editor, GraphiQL, and storefront URLs from a shop handle.
- **GraphQL Playground** — Run Admin API GraphQL queries with a pasted access token.
- **Metafield Builder** — Build metafield definition JSON and `shopify.app.toml` snippets.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run lint` | ESLint |

## Security (public deployment)

Tools that accept secrets (OAuth credentials, access tokens) follow these rules:

- Credentials and tokens are **never stored or logged** — request-scoped only.
- API proxy routes (`/api/shopify-token`, `/api/shopify-graphql`) use in-memory rate limiting.
- Sensitive tool pages use `noindex` so they are not indexed by search engines.
- Input size limits are enforced on API routes.

Do not paste production secrets on any public utility site unless you trust the deployment.

## Stack

Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS.
