# Write Them Home

An AI-assisted letter-writing campaign to stop ICE warehouse detention facilities.

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "Add New Project" → Import this repo
4. Add environment variable: `ANTHROPIC_API_KEY` = your key from console.anthropic.com
5. Click Deploy

## Custom Domain

After deploying, go to Settings → Domains in Vercel and add your subdomain (e.g. `writethem.samstern.life`).

Then in Squarespace DNS, add a CNAME record:
- Host: `writethem`
- Value: `cname.vercel-dns.com`

## Local Development

```bash
npm install
echo "ANTHROPIC_API_KEY=sk-ant-..." > .env.local
npm run dev
```
