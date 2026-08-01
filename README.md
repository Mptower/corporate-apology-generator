# The Corporate Apology Generator

A polished satire app that turns tiny workplace mistakes into wildly disproportionate public statements from fictional technology executives.

The deployed app uses Cloudflare Workers AI when available and automatically falls back to its full local generator when AI is unavailable or the free daily allocation is exhausted.

AI usage is hard-capped at 200 generations per UTC day and five generations per client per minute. The 900-token output ceiling keeps that daily maximum around 7,000 neurons, leaving a safety margin below Cloudflare's free 10,000-neuron allocation. The Worker makes one bounded inference attempt and never retries against a paid model or provider.

**Live site:** <https://apology.polzinit.com>

## Stack

- React 19 and TypeScript
- Vite 8
- Cloudflare Workers, Workers AI, and static assets
- Vitest, Testing Library, and jsdom
- Plain CSS with responsive and reduced-motion support

## Local development

Requires Node.js 20.19+ or 22.12+.

```bash
npm install
npm run dev
```

Open the URL printed by Vite, usually <http://localhost:5173>.

To run the complete Worker locally, including the remote Workers AI binding:

```bash
npx wrangler login
npm run dev:worker
```

## Checks

```bash
npm test
npm run build
```

To preview the production build:

```bash
npm run preview
```

The GitHub Pages workflow remains as a static fallback. Deploy the Worker and its AI binding with:

```bash
npm run deploy:worker
```

## How it works

Enter a minor mistake or choose an example, then generate a statement. The Worker asks a small instruction-tuned model for a structured apology and validates every response before it reaches the browser. If that request fails, a bounded local engine composes five distinct narrative archetypes from fictional companies, executives, accountability language, stakeholder concern, reflection, governance theater, rhetorical devices, leadership transitions, and solemn closings.

Use **Regenerate** for a structurally different version or **Copy** to place the complete statement on your clipboard.

All generated companies, executives, events, and consequences are fictional. This project is satire and does not imitate any real person.
