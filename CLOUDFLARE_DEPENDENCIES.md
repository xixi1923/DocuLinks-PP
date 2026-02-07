# Add these dependencies to your package.json

## For Cloudflare Workers

```bash
npm install wrangler --save-dev
npm install itty-router
npm install --save-dev @cloudflare/workers-types
```

## Dependencies to add to package.json:

```json
{
  "devDependencies": {
    "wrangler": "^3.0.0",
    "@cloudflare/workers-types": "^4.0.0",
    "typescript": "^5.0.0"
  },
  "dependencies": {
    "itty-router": "^4.0.0"
  },
  "scripts": {
    "wrangler:dev": "wrangler dev",
    "wrangler:deploy": "wrangler deploy",
    "wrangler:login": "wrangler login"
  }
}
```

## Commands to run:

```bash
# Install Wrangler
npm install wrangler --save-dev

# Login to Cloudflare
npm run wrangler:login

# Test locally
npm run wrangler:dev

# Deploy to production
npm run wrangler:deploy
```
