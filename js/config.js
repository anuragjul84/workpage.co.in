/* ============================================================
   WORKPAGE CONFIG
   Edit this file to personalize your site. Nothing else needs
   to change for day-to-day updates — logos, notes, links, etc.
   ============================================================ */

window.WORKPAGE_CONFIG = {

  profile: {
    name: "Anurag Thakur",
    title: "Tech Lead — Microsoft Dynamics 365 & Power Platform",
    company: "LTIMindtree",
    location: "Bengaluru, India",
    avatarInitials: "AT",
    // Used to compute "today's focus" streak. Set once, leave it —
    // it just counts days since you started tracking here.
    streakStartDate: "2026-06-01"
  },

  todayFocus: {
    title: "WDS Account Connect — New Security Model",
    detail: "Wire 17 lookup controls via registerCustomLookupFilters, verify in form designer, publish.",
    progress: 65, // percent, 0-100
    dueLabel: "Due Jun 18"
  },

  quickStats: [
    { label: "Years in IT", value: "18" },
    { label: "Team size", value: "18" },
    { label: "Certifications", value: "7" },
    { label: "Active programmes", value: "2" }
  ],

  notes: {
    // Notes are stored in your browser (localStorage) so they stay
    // private to your device — nothing here needs editing.
  },

  learning: [
    { skill: "Power Platform / Dataverse", progress: 90 },
    { skill: "Dynamics 365 CE Architecture", progress: 88 },
    { skill: "Azure DevOps & DevSecOps", progress: 75 },
    { skill: "Agentic AI (Copilot Studio, MCP)", progress: 40 },
    { skill: "Python for automation", progress: 55 }
  ],

  achievements: [
    { name: "PL-600", detail: "Power Platform Solution Architect Expert", icon: "trophy" },
    { name: "Lean Six Sigma", detail: "Black Belt", icon: "trophy" },
    { name: "UiPath", detail: "Advanced Developer", icon: "trophy" },
    { name: "AWS", detail: "Cloud Practitioner", icon: "trophy" },
    { name: "AWS", detail: "Business Professional", icon: "trophy" },
    { name: "Google", detail: "Agile Project Management", icon: "trophy" },
    { name: "MS-900", detail: "Microsoft 365 Fundamentals", icon: "trophy" }
  ],
  linkedinUrl: "https://www.linkedin.com/in/your-handle",

  github: {
    username: "your-github-username" // live stats are pulled from api.github.com
  },

  aiTools: [
    { name: "Claude", url: "https://claude.ai/new", queryParam: null },
    { name: "ChatGPT", url: "https://chatgpt.com/", queryParam: "q" },
    { name: "Gemini", url: "https://gemini.google.com/app", queryParam: null },
    { name: "Copilot", url: "https://copilot.microsoft.com/", queryParam: null },
    { name: "NotebookLM", url: "https://notebooklm.google.com/", queryParam: null }
  ],

  music: {
    // Paste any public Spotify playlist/album/track share link here.
    spotifyEmbedUrl: "https://open.spotify.com/embed/playlist/37i9dQZF1DXcBWIGoYBM5M",
    links: [
      { name: "Apple Music", url: "https://music.apple.com/" },
      { name: "Amazon Prime Music", url: "https://music.amazon.in/" },
      { name: "YouTube Music", url: "https://music.youtube.com/" }
    ]
  },

  picks: [
    {
      name: "Mechanical Keyboard",
      note: "Daily driver for coding sessions",
      url: "https://www.amazon.in/",
      price: "₹6,499"
    },
    {
      name: "Noise-Cancelling Headphones",
      note: "For focus blocks & calls",
      url: "https://www.amazon.in/",
      price: "₹19,990"
    },
    {
      name: "Standing Desk Converter",
      note: "Saves the back during long QBR prep",
      url: "https://www.amazon.in/",
      price: "₹8,999"
    },
    {
      name: "Raspberry Pi 5",
      note: "For the edge-AI assistant project",
      url: "https://www.amazon.in/",
      price: "₹7,499"
    }
  ],
  amazonNote: "Add your Amazon Associates tag to each URL above, e.g. ?tag=yourtag-21",

  quickLinks: [
    { name: "Azure DevOps", url: "https://dev.azure.com/" },
    { name: "Power Platform Admin", url: "https://admin.powerplatform.microsoft.com/" },
    { name: "XRM Toolbox", url: "https://www.xrmtoolbox.com/" },
    { name: "Resume (PDF)", url: "#" }
  ],

  socials: [
    { name: "LinkedIn", url: "https://www.linkedin.com/in/your-handle", icon: "linkedin" },
    { name: "GitHub", url: "https://github.com/your-github-username", icon: "github" },
    { name: "Email", url: "mailto:you@workpage.co.in", icon: "mail" }
  ],

  /* ---------------- Sidebar widgets ---------------- */
  sidebar: {

    // Outlook Calendar + flagged mail ("action items"). Requires a free
    // Azure AD app registration — see README for the 5-minute setup.
    // Leave clientId blank to hide this widget's live features.
    outlook: {
      clientId: "",                                  // Azure AD "Application (client) ID"
      authority: "https://login.microsoftonline.com/common",
      redirectUri: "https://workpage.co.in/"          // must exactly match your Azure app's redirect URI
    },

    // One entry per place you care about — powers the clocks, weather,
    // public holidays and news widgets all at once.
    regions: [
      { label: "Bengaluru", tz: "Asia/Kolkata", countryCode: "IN", lat: 12.9716, lon: 77.5946, newsQuery: "India business technology" },
      { label: "New York", tz: "America/New_York", countryCode: "US", lat: 40.7128, lon: -74.0060, newsQuery: "United States technology" },
      { label: "London", tz: "Europe/London", countryCode: "GB", lat: 51.5072, lon: -0.1276, newsQuery: "United Kingdom technology" }
    ],

    // TradingView symbols (free, no key) for the market ticker.
    // Format: "EXCHANGE:SYMBOL". Find symbols at tradingview.com/symbols/
    marketSymbols: [
      { proName: "NSE:NIFTY", title: "Nifty 50" },
      { proName: "BSE:SENSEX", title: "Sensex" },
      { proName: "FX_IDC:USDINR", title: "USD/INR" },
      { proName: "NASDAQ:IXIC", title: "Nasdaq" },
      { proName: "DJ:DJI", title: "Dow Jones" }
    ]
  }
};
