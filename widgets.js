(function () {
  "use strict";
  var cfg = window.WORKPAGE_CONFIG;
  var sb = cfg.sidebar;

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }
  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- World clocks ---------------- */
  function initClocks() {
    var grid = document.getElementById("clockGrid");
    if (!grid) return;
    sb.regions.forEach(function (r) {
      grid.appendChild(el(
        '<div class="clock-item" data-tz="' + r.tz + '"><div class="clock-time">--:--</div>' +
        '<div class="clock-label">' + r.label + '</div><div class="clock-date">—</div></div>'
      ));
    });
    function tick() {
      grid.querySelectorAll(".clock-item").forEach(function (item) {
        var tz = item.getAttribute("data-tz");
        var now = new Date();
        try {
          item.querySelector(".clock-time").textContent =
            new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: true }).format(now);
          item.querySelector(".clock-date").textContent =
            new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short", day: "numeric", month: "short" }).format(now);
        } catch (e) { /* invalid tz, ignore */ }
      });
    }
    tick();
    setInterval(tick, 1000);
  }

  /* ---------------- Weather (Open-Meteo, no key) ---------------- */
  var WEATHER_CODES = {
    0: "Clear", 1: "Mostly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Fog", 48: "Fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
    75: "Heavy snow", 80: "Rain showers", 81: "Rain showers", 82: "Violent showers",
    95: "Thunderstorm", 96: "Thunderstorm", 99: "Thunderstorm"
  };
  function initWeather() {
    var list = document.getElementById("weatherList");
    if (!list) return;
    list.innerHTML = '<div class="widget-empty">Loading…</div>';
    Promise.all(sb.regions.map(function (r) {
      var url = "https://api.open-meteo.com/v1/forecast?latitude=" + r.lat + "&longitude=" + r.lon + "&current_weather=true";
      return fetch(url).then(function (res) { return res.json(); })
        .then(function (data) { return { region: r, weather: data.current_weather || null }; })
        .catch(function () { return { region: r, weather: null }; });
    })).then(function (results) {
      list.innerHTML = "";
      results.forEach(function (item) {
        var w = item.weather;
        var temp = w ? Math.round(w.temperature) + "°C" : "—";
        var desc = w ? (WEATHER_CODES[w.weathercode] || "—") : "Unavailable";
        list.appendChild(el(
          '<div class="widget-row"><div class="widget-row-main"><strong>' + item.region.label +
          '</strong><span>' + desc + '</span></div><div class="widget-row-value">' + temp + "</div></div>"
        ));
      });
    });
  }

  /* ---------------- Public holidays (Nager.Date, no key) ---------------- */
  function initHolidays() {
    var list = document.getElementById("holidayList");
    if (!list) return;
    list.innerHTML = '<div class="widget-empty">Loading…</div>';
    var seen = {};
    var countries = sb.regions.filter(function (r) {
      if (seen[r.countryCode]) return false;
      seen[r.countryCode] = true;
      return true;
    });
    Promise.all(countries.map(function (r) {
      return fetch("https://date.nager.at/api/v3/NextPublicHolidays/" + r.countryCode)
        .then(function (res) { return res.json(); })
        .then(function (data) { return { region: r, holiday: (data && data[0]) || null }; })
        .catch(function () { return { region: r, holiday: null }; });
    })).then(function (results) {
      list.innerHTML = "";
      results.forEach(function (item) {
        if (!item.holiday) {
          list.appendChild(el(
            '<div class="widget-row"><div class="widget-row-main"><strong>' + item.region.countryCode +
            '</strong><span>No upcoming holiday found</span></div></div>'
          ));
          return;
        }
        var h = item.holiday;
        var days = Math.ceil((new Date(h.date) - new Date()) / 86400000);
        list.appendChild(el(
          '<div class="widget-row"><div class="widget-row-main"><strong>' + escapeHtml(h.localName) +
          "</strong><span>" + item.region.countryCode + " · " + h.date + '</span></div><div class="widget-row-value">' +
          (days <= 0 ? "Today" : "in " + days + "d") + "</div></div>"
        ));
      });
    });
  }

  /* ---------------- Markets (TradingView embed, no key) ---------------- */
  function initMarkets() {
    var container = document.getElementById("marketTicker");
    if (!container) return;
    var isDark = document.documentElement.getAttribute("data-theme") === "midnight";
    var wrap = el('<div class="tradingview-widget-container"><div class="tradingview-widget-container__widget"></div></div>');
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.text = JSON.stringify({
      symbols: sb.marketSymbols,
      showSymbolLogo: true,
      colorTheme: isDark ? "dark" : "light",
      isTransparent: true,
      displayMode: "adaptive",
      locale: "en"
    });
    wrap.appendChild(script);
    container.innerHTML = "";
    container.appendChild(wrap);
  }

  /* ---------------- News (Google News RSS via rss2json, no key required for light use) ---------------- */
  function initNews() {
    var wrap = document.getElementById("newsList");
    if (!wrap) return;
    wrap.innerHTML = '<div class="widget-empty">Loading…</div>';
    Promise.all(sb.regions.map(function (r) {
      var rssUrl = "https://news.google.com/rss/search?q=" + encodeURIComponent(r.newsQuery) +
        "&hl=en-" + r.countryCode + "&gl=" + r.countryCode + "&ceid=" + r.countryCode + ":en";
      var apiUrl = "https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent(rssUrl);
      return fetch(apiUrl).then(function (res) { return res.json(); })
        .then(function (data) { return { region: r, items: (data.items || []).slice(0, 3), rssUrl: rssUrl }; })
        .catch(function () { return { region: r, items: [], rssUrl: rssUrl }; });
    })).then(function (results) {
      wrap.innerHTML = "";
      results.forEach(function (item) {
        var block = el('<div><div class="news-region-label">' + item.region.label + "</div></div>");
        if (!item.items.length) {
          block.appendChild(el(
            '<a class="news-item" href="' + item.rssUrl.replace("/rss/", "/") + '" target="_blank" rel="noopener">' +
            "Open Google News for " + item.region.label + " →</a>"
          ));
        } else {
          item.items.forEach(function (n) {
            block.appendChild(el(
              '<a class="news-item" href="' + n.link + '" target="_blank" rel="noopener">' + escapeHtml(n.title) + "</a>"
            ));
          });
        }
        wrap.appendChild(block);
      });
    });
  }

  /* ---------------- Outlook: Calendar + flagged mail as "action items" ---------------- */
  function initOutlook() {
    var btn = document.getElementById("outlookAuthBtn");
    var body = document.getElementById("outlookBody");
    if (!btn || !body) return;
    var oCfg = sb.outlook;

    if (!oCfg.clientId) {
      btn.textContent = "Setup needed";
      btn.addEventListener("click", function () {
        body.innerHTML = '<p class="outlook-note">Add your Azure AD app\'s Client ID to <code>sidebar.outlook</code> in <code>js/config.js</code> — 5-minute setup steps are in README.md.</p>';
      });
      return;
    }
    if (typeof msal === "undefined") {
      btn.textContent = "Unavailable";
      body.innerHTML = '<p class="outlook-note">MSAL library did not load — check your network/ad-blocker.</p>';
      return;
    }

    var msalInstance = new msal.PublicClientApplication({
      auth: { clientId: oCfg.clientId, authority: oCfg.authority, redirectUri: oCfg.redirectUri }
    });
    var scopes = ["Calendars.Read", "Mail.Read"];
    var account = null;

    function renderPrompt() {
      body.innerHTML = '<p style="font-size:12.5px">Connect your Microsoft account to see today\'s meetings and flagged mail here.</p>';
      btn.textContent = "Connect";
    }

    function renderOutlookData(events, mails) {
      var html = '<div class="outlook-signed-in">';
      html += '<div><div class="outlook-section-label">Today\'s meetings</div>';
      html += events.length ? "" : '<div class="widget-empty">Nothing on your calendar today.</div>';
      events.forEach(function (e) {
        var t = new Date(e.start.dateTime + "Z");
        html += '<div class="widget-row"><div class="widget-row-main"><strong>' + escapeHtml(e.subject || "(no subject)") +
          "</strong></div><div class=\"widget-row-value\">" +
          t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + "</div></div>";
      });
      html += "</div><div><div class=\"outlook-section-label\">Flagged / action items</div>";
      html += mails.length ? "" : '<div class="widget-empty">No flagged mail.</div>';
      mails.forEach(function (m) {
        var sender = (m.from && m.from.emailAddress && m.from.emailAddress.name) || "";
        html += '<a class="widget-row" href="' + m.webLink + '" target="_blank" rel="noopener"><div class="widget-row-main"><strong>' +
          escapeHtml(m.subject || "(no subject)") + "</strong><span>" + escapeHtml(sender) + "</span></div></a>";
      });
      html += "</div></div>";
      body.innerHTML = html;
    }

    function loadGraphData(token) {
      body.innerHTML = '<div class="widget-empty">Loading…</div>';
      var headers = { Authorization: "Bearer " + token };
      var startOfDay = new Date(); startOfDay.setHours(0, 0, 0, 0);
      var endOfDay = new Date(); endOfDay.setHours(23, 59, 59, 999);
      var calUrl = "https://graph.microsoft.com/v1.0/me/calendarView?startDateTime=" +
        startOfDay.toISOString() + "&endDateTime=" + endOfDay.toISOString() + "&$orderby=start/dateTime&$top=5";
      var mailUrl = "https://graph.microsoft.com/v1.0/me/messages?$filter=flag/flagStatus eq 'flagged'&$top=5&$select=subject,from,webLink";

      Promise.all([
        fetch(calUrl, { headers: headers }).then(function (r) { return r.json(); }),
        fetch(mailUrl, { headers: headers }).then(function (r) { return r.json(); })
      ]).then(function (res) {
        renderOutlookData(res[0].value || [], res[1].value || []);
      }).catch(function () {
        body.innerHTML = '<p class="outlook-note">Could not load Outlook data. Try reconnecting.</p>';
      });
    }

    btn.addEventListener("click", function () {
      if (account) {
        msalInstance.logoutPopup({ account: account }).then(function () {
          account = null;
          renderPrompt();
        });
        return;
      }
      msalInstance.loginPopup({ scopes: scopes }).then(function (res) {
        account = res.account;
        btn.textContent = "Disconnect";
        return msalInstance.acquireTokenSilent({ scopes: scopes, account: account })
          .catch(function () { return msalInstance.acquireTokenPopup({ scopes: scopes, account: account }); });
      }).then(function (tokenRes) {
        if (tokenRes) loadGraphData(tokenRes.accessToken);
      }).catch(function () {
        body.innerHTML = '<p class="outlook-note">Sign-in failed or was cancelled.</p>';
      });
    });
  }

  function init() {
    initClocks();
    initWeather();
    initHolidays();
    initMarkets();
    initNews();
    initOutlook();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
