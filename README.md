# A/B Testing Server

A minimal Node.js + Express server demonstrating how to run an A/B test using sticky cookie-based variant assignment. Zero external services — the whole experiment fits in a single repo.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)

## What it demonstrates

- Assign each visitor to a variant (`A` or `B`) on their first request
- Persist the assignment in a cookie so the same visitor always sees the same variant
- Serve different content per variant from `/abTesting` routes
- Keep the experiment logic server-side (no flash of wrong content)

It's a useful starter before you adopt a heavier tool like GrowthBook, LaunchDarkly, or Optimizely — good for reading the essentials end-to-end.

## Quick start

```bash
git clone https://github.com/Hassan-Naeem-code/A-B-Testing.git
cd A-B-Testing

npm install
node server.js
```

Visit http://localhost:3000/abTesting — open it in an incognito window a few times to see variant assignment in action.

## How it works

```
GET /abTesting
    │
    ├── Has variant cookie?
    │      ├── Yes → serve the cached variant
    │      └── No  → hash user/session, assign A or B, set cookie, serve
    │
    └── Log exposure for analysis
```

Deterministic hashing of a user-stable identifier + experiment key means:
- The same user always sees the same variant
- SSR and client render agree
- You can add more variants (multivariate) without restructuring

## Project layout

```
.
├── server.js              # Express app entry
├── routes/
│   └── abTesting.js       # variant assignment + serving
├── public/                # static files served to all users
└── package.json
```

## Extending it

- **Log exposures** to a real analytics sink (Segment, PostHog, warehouse)
- **Multivariate** — allow `A/B/C/D` with custom weights
- **Guardrails** — exclude bots, internal users, or specific paths
- **Kill-switch** — a single env var that forces everyone to `A`

A zero-dependency TypeScript version of the assignment function (deterministic variant picker) lives as a gist: [A/B testing helper](https://gist.github.com/Hassan-Naeem-code/de0c91ce7ec80fe146da1bc05db684dd).

## License

MIT
