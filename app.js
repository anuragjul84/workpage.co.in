(function () {
  "use strict";
  var cfg = window.WORKPAGE_CONFIG;
  var ICONS = { trophy: "i-trophy", linkedin: "i-linkedin", github: "i-github", mail: "i-mail" };

  function icon(name, size) {
    size = size || 16;
    return '<svg class="icon" width="' + size + '" height="' + size + '"><use href="#' + (ICONS[name] || name) + '"/></svg>';
  }
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  /* ---------------- Theme switcher ---------------- */
  function initTheme() {
    var saved = localStorage.getItem("workpage-theme") || "lavender";
    document.documentElement.setAttribute("data-theme", saved);
    var btn = document.getElementById("themeBtn");
    var menu = document.getElementById("themeMenu");
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      menu.classList.toggle("open");
    });
    document.addEventListener("click", function () { menu.classList.remove("open"); });
    document.querySelectorAll("[data-theme-set]").forEach(function (b) {
      b.addEventListener("click", function () {
        var theme = b.getAttribute("data-theme-set");
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("workpage-theme", theme);
        menu.classList.remove("open");
      });
    });
  }

  /* ---------------- Greeting + streak + focus ring ---------------- */
  function initHero() {
    var hour = new Date().getHours();
    var greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    document.getElementById("greetingLabel").textContent = greeting + ", " + cfg.profile.name.split(" ")[0];

    var start = new Date(cfg.profile.streakStartDate);
    var days = Math.max(1, Math.floor((Date.now() - start.getTime()) / 86400000));
    document.getElementById("streakLabel").textContent = days + "-day tracking streak";

    var f = cfg.todayFocus;
    document.getElementById("focusTitle").textContent = f.title;
    document.getElementById("focusDetail").textContent = f.detail;
    document.getElementById("focusDue").innerHTML = icon("i-check", 12) + f.dueLabel;
    document.getElementById("focusRing").style.setProperty("--pct", f.progress);
    document.getElementById("focusRingLabel").textContent = f.progress + "%";
  }

  /* ---------------- Quick stats ---------------- */
  function initStats() {
    var grid = document.getElementById("statGrid");
    cfg.quickStats.forEach(function (s) {
      grid.appendChild(el(
        '<div class="stat-pill"><div class="stat-value">' + s.value + '</div><div class="stat-label">' + s.label + '</div></div>'
      ));
    });
  }

  /* ---------------- Notes (localStorage) ---------------- */
  function loadNotes() {
    try { return JSON.parse(localStorage.getItem("workpage-notes") || "[]"); }
    catch (e) { return []; }
  }
  function saveNotes(notes) { localStorage.setItem("workpage-notes", JSON.stringify(notes)); }
  function renderNotes() {
    var list = document.getElementById("noteList");
    var notes = loadNotes();
    list.innerHTML = "";
    if (!notes.length) {
      list.appendChild(el('<div class="note-empty">No notes yet — add your first above.</div>'));
      return;
    }
    notes.slice().reverse().forEach(function (n) {
      var item = el('<div class="note-item"><span></span><button aria-label="Delete note">' + icon("i-x", 13) + "</button></div>");
      item.querySelector("span").textContent = n.text;
      item.querySelector("button").addEventListener("click", function () {
        var updated = loadNotes().filter(function (x) { return x.id !== n.id; });
        saveNotes(updated);
        renderNotes();
      });
      list.appendChild(item);
    });
  }
  function initNotes() {
    renderNotes();
    var input = document.getElementById("noteInput");
    function add() {
      var text = input.value.trim();
      if (!text) return;
      var notes = loadNotes();
      notes.push({ id: Date.now(), text: text });
      saveNotes(notes);
      input.value = "";
      renderNotes();
    }
    document.getElementById("noteAddBtn").addEventListener("click", add);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") add(); });
  }

  /* ---------------- Learning ---------------- */
  function initLearning() {
    var wrap = document.getElementById("learningList");
    cfg.learning.forEach(function (l) {
      wrap.appendChild(el(
        '<div class="bar-row"><div class="bar-label"><span>' + l.skill + '</span><span>' + l.progress +
        '%</span></div><div class="bar-track"><div class="bar-fill" style="width:' + l.progress + '%"></div></div></div>'
      ));
    });
  }

  /* ---------------- Achievements ---------------- */
  function initAchievements() {
    var grid = document.getElementById("achievementGrid");
    cfg.achievements.forEach(function (a) {
      grid.appendChild(el(
        '<div class="achievement"><span class="chip-icon" style="background:var(--accent-soft);color:var(--accent)">' +
        icon(a.icon, 14) + '</span><div><div class="achievement-name">' + a.name +
        '</div><div class="achievement-detail">' + a.detail + "</div></div></div>"
      ));
    });
    document.getElementById("linkedinLink").href = cfg.linkedinUrl;
  }

  /* ---------------- GitHub (live, public API, no key needed) ---------------- */
  function initGithub() {
    var user = cfg.github.username;
    document.getElementById("ghHandle").textContent = "@" + user;
    document.getElementById("ghProfileLink").href = "https://github.com/" + user;
    var statsWrap = document.getElementById("ghStats");
    var repoWrap = document.getElementById("ghRepoList");

    function statPill(value, label) {
      return '<div class="stat-pill"><div class="stat-value">' + value + '</div><div class="stat-label">' + label + "</div></div>";
    }

    fetch("https://api.github.com/users/" + user)
      .then(function (r) { if (!r.ok) throw new Error("profile"); return r.json(); })
      .then(function (data) {
        statsWrap.innerHTML =
          statPill(data.public_repos, "Public repos") +
          statPill(data.followers, "Followers") +
          statPill(data.following, "Following");
      })
      .catch(function () {
        statsWrap.innerHTML = statPill("—", "Public repos") + statPill("—", "Followers") + statPill("—", "Following");
      });

    fetch("https://api.github.com/users/" + user + "/repos?sort=updated&per_page=4")
      .then(function (r) { if (!r.ok) throw new Error("repos"); return r.json(); })
      .then(function (repos) {
        repoWrap.innerHTML = "";
        if (!Array.isArray(repos) || !repos.length) throw new Error("empty");
        repos.forEach(function (repo) {
          repoWrap.appendChild(el(
            '<a class="gh-repo" href="' + repo.html_url + '" target="_blank" rel="noopener"><div><div class="gh-repo-name">' +
            repo.name + '</div><div class="gh-repo-desc">' + (repo.description || "No description") +
            '</div></div><div class="gh-repo-lang">' + (repo.language || "") + "</div></a>"
          ));
        });
      })
      .catch(function () {
        repoWrap.innerHTML = '<div class="note-empty">Set your GitHub username in js/config.js to show live repos here.</div>';
      });
  }

  /* ---------------- AI Studio ---------------- */
  function initAiStudio() {
    var grid = document.getElementById("aiToolGrid");
    var input = document.getElementById("aiInput");

    function openTool(tool) {
      var q = input.value.trim();
      if (q && navigator.clipboard) { navigator.clipboard.writeText(q).catch(function () {}); }
      var url = tool.url;
      if (q && tool.queryParam) {
        url += (url.indexOf("?") === -1 ? "?" : "&") + tool.queryParam + "=" + encodeURIComponent(q);
      }
      window.open(url, "_blank", "noopener");
    }

    cfg.aiTools.forEach(function (tool) {
      var btn = el('<button class="ai-tool">' + icon("i-sparkles", 16) + "<span>" + tool.name + "</span></button>");
      btn.addEventListener("click", function () { openTool(tool); });
      grid.appendChild(btn);
    });

    document.getElementById("aiCopyBtn").addEventListener("click", function () {
      var q = input.value.trim();
      if (!q) return;
      if (navigator.clipboard) navigator.clipboard.writeText(q).catch(function () {});
      var btn = document.getElementById("aiCopyBtn");
      var original = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(function () { btn.textContent = original; }, 1200);
    });
  }

  /* ---------------- Music ---------------- */
  function initMusic() {
    document.getElementById("spotifyFrame").src = cfg.music.spotifyEmbedUrl;
    var wrap = document.getElementById("musicLinks");
    cfg.music.links.forEach(function (l) {
      wrap.appendChild(el('<a class="music-link" href="' + l.url + '" target="_blank" rel="noopener">' + l.name + "</a>"));
    });
  }

  /* ---------------- Picks ---------------- */
  function initPicks() {
    var grid = document.getElementById("picksGrid");
    cfg.picks.forEach(function (p) {
      grid.appendChild(el(
        '<a class="pick-card" href="' + p.url + '" target="_blank" rel="noopener sponsored"><div class="pick-name">' +
        p.name + '</div><div class="pick-note">' + p.note + '</div><div class="pick-price">' + p.price + "</div></a>"
      ));
    });
    document.getElementById("affiliateNote").textContent = cfg.amazonNote;
  }

  /* ---------------- Quick links ---------------- */
  function initQuickLinks() {
    var grid = document.getElementById("quickLinkGrid");
    cfg.quickLinks.forEach(function (l) {
      grid.appendChild(el(
        '<a class="quick-link" href="' + l.url + '" target="_blank" rel="noopener">' + icon("i-link", 14) + "<span>" + l.name + "</span></a>"
      ));
    });
  }

  /* ---------------- Profile / footer ---------------- */
  function initProfile() {
    document.getElementById("profileName").textContent = cfg.profile.name;
    document.getElementById("profileTitle").textContent = cfg.profile.title + " · " + cfg.profile.company;
    document.getElementById("profileAvatar").textContent = cfg.profile.avatarInitials;
    document.getElementById("headerAvatar").textContent = cfg.profile.avatarInitials;

    var row = document.getElementById("socialRow");
    cfg.socials.forEach(function (s) {
      row.appendChild(el(
        '<a class="social-btn" href="' + s.url + '" target="_blank" rel="noopener" aria-label="' + s.name + '">' + icon(s.icon, 17) + "</a>"
      ));
    });
  }

  function init() {
    initTheme();
    initHero();
    initStats();
    initNotes();
    initLearning();
    initAchievements();
    initGithub();
    initAiStudio();
    initMusic();
    initPicks();
    initQuickLinks();
    initProfile();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
