# workpage.co.in

A personal professional dashboard: Notes, Learning, Achievements, GitHub, AI Studio,
Music, Favorite Picks, Quick Links and Profile — in one page, with four switchable
themes (Lavender / Peach / Mint / Midnight).

## 1. Personalize it

Open `js/config.js`. Everything you're likely to change lives there:
name, title, today's focus, learning skills, certifications, GitHub username,
Spotify playlist link, Amazon picks, quick links, and social URLs.
No HTML/CSS editing needed for routine updates.

To add a 5th theme, copy a `[data-theme="..."]` block in `css/style.css`,
rename it, then add a matching button in the `theme-menu` in `index.html`.

## 2. Try it locally

Just open `index.html` in a browser — everything runs client-side.
(Some browsers block `fetch` on `file://`; if GitHub stats don't load locally,
that's why — they'll work fine once hosted.)

## 3. Deploy (recommended: GitHub Pages, free)

1. Create a new **public** GitHub repo, e.g. `workpage`.
2. Push these files to it (`index.html`, `css/`, `js/`).
3. In the repo, add a file named `CNAME` (no extension) containing exactly:
   ```
   workpage.co.in
   ```
4. Repo Settings → Pages → Source: deploy from the `main` branch, root folder.
5. In Squarespace Domains (formerly Google Domains, where `workpage.co.in` lives),
   go to DNS settings and add:
   - Four **A** records for `@` pointing to GitHub Pages' IPs:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME** record: `www` → `your-github-username.github.io`
6. Back in GitHub Pages settings, wait for DNS to verify, then enable
   **Enforce HTTPS**.

DNS changes can take up to a few hours to propagate.

### Alternative: Netlify or Vercel
Drag-and-drop this folder into Netlify or connect the repo — either works,
and both make it easy to later add serverless functions (for example, if you
ever want the AI Studio section to call each model's API directly instead of
opening it in a new tab).

## 4. Notes on the integrations

- **Notes** — stored in your browser's local storage, private to your device.
  There's no server, so notes won't sync across devices unless you extend this
  (e.g. wiring it to a small database) later.
- **GitHub** — pulls live public data from `api.github.com`, no key required.
- **Achievements/LinkedIn** — LinkedIn has no public API for personal profile
  data, so this list is manually maintained in `config.js`; the card links out
  to your LinkedIn profile.
- **AI Studio** — copies your question to the clipboard and opens each tool in
  a new tab. ChatGPT prefills the question via URL; Claude, Gemini, Copilot and
  NotebookLM don't support reliable URL prefill, so just paste (Ctrl/Cmd+V).
- **Music** — the Spotify embed works with any public playlist/track/album link
  (Share → Copy embed code → grab the `src` URL, or just the share link — both
  work). Apple Music and Prime Music don't offer a simple embeddable player, so
  those are link-outs instead.
- **Amazon picks** — add your Associates tracking ID to each product URL in
  `config.js`, e.g. `?tag=yourtag-21`.

## 5. Sidebar widgets

All of these are configured in `js/config.js` under `sidebar`.

- **World clocks, weather, public holidays, news** — work immediately, no
  setup. They're driven by `sidebar.regions`: add, remove, or edit entries
  (label, IANA timezone, ISO country code, lat/lon, a news search phrase) and
  every widget that uses that list updates together.
  - Weather comes from **Open-Meteo** (free, no key).
  - Holidays come from **Nager.Date** (free, no key).
  - News comes from Google News RSS via **rss2json.com**'s free tier. It's
    rate-limited on shared IPs; if headlines stop loading, each region still
    shows a fallback link straight to Google News.
- **Markets** — a TradingView ticker tape (free, no key). Edit
  `sidebar.marketSymbols` with any `EXCHANGE:SYMBOL` pair — find symbols at
  tradingview.com/symbols/.
- **Outlook (Calendar + flagged mail as action items)** — this is the one
  integration that needs a one-time setup, because it reads your real mailbox:
  1. Go to entra.microsoft.com (Azure AD) → **App registrations** →
     **New registration**.
  2. Name it anything (e.g. "workpage"). Under **Redirect URI**, choose
     **Single-page application (SPA)** and enter `https://workpage.co.in/`
     (must match `sidebar.outlook.redirectUri` in `config.js` exactly,
     including the trailing slash).
  3. After creation, copy the **Application (client) ID** from the Overview
     page into `sidebar.outlook.clientId` in `config.js`.
  4. Go to **API permissions** → **Add a permission** → **Microsoft Graph** →
     **Delegated permissions** → add `Calendars.Read` and `Mail.Read`. No
     admin consent is needed for a personal/work account reading its own data.
  5. Deploy, then click **Connect** in the Outlook widget and sign in. It
     shows today's meetings and mail you've flagged in Outlook (Graph has no
     literal "action items" field, so flagged mail is the closest real
     equivalent — you can flag anything in Outlook to have it show up here).
  This app registration is free on any Microsoft/Microsoft 365 account and
  the data only ever flows from Microsoft Graph to your own browser.
