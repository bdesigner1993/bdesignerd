/* Borislav Knežević – portfolio interactions (no libraries) */
(function () {
  "use strict";
  var doc = document;
  var T = JSON.parse(doc.getElementById("i18n").textContent);
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- header: shadow on scroll, hide on scroll down ---------- */
  var header = doc.querySelector(".site-header");
  var lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    header.classList.toggle("is-scrolled", y > 8);
    var menuOpen = nav && nav.classList.contains("is-open");
    header.classList.toggle("is-hidden", !menuOpen && y > 400 && y > lastY + 4);
    if (y < lastY - 4 || y < 400) header.classList.remove("is-hidden");
    lastY = y;
  }, { passive: true });

  /* ---------- mobile menu ---------- */
  var menuBtn = doc.querySelector(".menu-btn");
  var nav = doc.getElementById("nav");
  function closeMenu() { nav.classList.remove("is-open"); menuBtn.setAttribute("aria-expanded", "false"); }
  menuBtn.addEventListener("click", function () {
    var open = !nav.classList.contains("is-open");
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });
  doc.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });

  /* ---------- active nav link ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.setAttribute("aria-current", a.getAttribute("href") === "#" + en.target.id ? "true" : "false"); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(function (a) { var s = doc.querySelector(a.getAttribute("href")); if (s) io.observe(s); });
  }

  /* ---------- portfolio data ---------- */
  var works = Array.prototype.slice.call(doc.querySelectorAll(".work"));
  var byKey = {};
  works.forEach(function (li, i) { li.dataset.index = i; byKey[li.dataset.key] = li; });

  /* ---------- filters + "show all" ---------- */
  var filters = Array.prototype.slice.call(doc.querySelectorAll(".filter"));
  var moreBtn = doc.querySelector(".more");
  var expanded = false, current = "all";
  function applyFilter() {
    works.forEach(function (li) {
      var inCat = current === "all" || li.dataset.cat === current;
      li.hidden = !inCat || (current === "all" && !expanded && li.hasAttribute("data-more"));
    });
    moreBtn.parentNode.hidden = !(current === "all" && !expanded);
  }
  filters.forEach(function (btn) {
    btn.addEventListener("click", function () {
      current = btn.dataset.filter;
      filters.forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      applyFilter();
    });
  });
  moreBtn.addEventListener("click", function () {
    expanded = true; applyFilter();
    var next = works.filter(function (w) { return w.hasAttribute("data-more"); })[0];
    if (next) next.querySelector(".work-btn").focus({ preventScroll: true });
  });
  applyFilter();

  /* ---------- lightbox ---------- */
  var lb = doc.getElementById("lightbox");
  var lbImg = lb.querySelector(".lb-figure img");
  var lbT = lb.querySelector(".lb-cap .t");
  var lbC = lb.querySelector(".lb-cap .c");
  var lbCount = lb.querySelector(".lb-count");
  var list = [], pos = 0;

  function show(i) {
    pos = (i + list.length) % list.length;
    var li = list[pos], img = li.querySelector("img");
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    lbImg.width = img.getAttribute("width"); lbImg.height = img.getAttribute("height");
    lbT.textContent = li.querySelector(".t").textContent;
    lbC.textContent = li.querySelector(".c").textContent;
    lbCount.textContent = (pos + 1) + " / " + list.length;
  }
  function openAt(li) {
    list = viewable.filter(function (w) { return !w.hidden; });
    if (list.indexOf(li) < 0) list = viewable.slice();
    show(list.indexOf(li));
    if (typeof lb.showModal === "function") lb.showModal(); else lb.setAttribute("open", "");
    doc.body.style.overflow = "hidden";
  }
  function closeLb() { if (lb.open) lb.close(); }
  lb.addEventListener("close", function () { doc.body.style.overflow = ""; });
  var viewable = works.filter(function (w) { return !w.classList.contains("work--link"); });
  viewable.forEach(function (li) { li.querySelector(".work-btn").addEventListener("click", function () { openAt(li); }); });
  lb.querySelector(".lb-prev").addEventListener("click", function () { show(pos - 1); });
  lb.querySelector(".lb-next").addEventListener("click", function () { show(pos + 1); });
  lb.querySelector(".lb-close").addEventListener("click", closeLb);
  lb.addEventListener("click", function (e) { if (e.target === lb || e.target.classList.contains("lb-figure")) closeLb(); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") show(pos - 1);
    if (e.key === "ArrowRight") show(pos + 1);
  });
  var tx = null;
  lb.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) show(pos + (dx < 0 ? 1 : -1));
  });

  /* ---------- slot machine with portfolio reels ---------- */
  var machine = doc.querySelector(".machine");
  var spinBtn = machine.querySelector(".spin");
  var live = machine.querySelector(".machine-live");
  var payline = machine.querySelector(".payline");
  var LOOPS = 4;
  var reels = Array.prototype.slice.call(machine.querySelectorAll(".reel")).map(function (el) {
    var strip = el.querySelector(".strip");
    var cells = Array.prototype.slice.call(strip.children);
    for (var k = 1; k < LOOPS + 1; k++) {
      cells.forEach(function (c) {
        var cl = c.cloneNode(true);
        strip.appendChild(cl);
      });
    }
    return { el: el, strip: strip, n: cells.length, idx: Math.floor(Math.random() * cells.length) };
  });

  function cellH(r) { return r.strip.firstElementChild.getBoundingClientRect().height; }
  function place(r, i, animate, dur) {
    var h = cellH(r), win = r.el.getBoundingClientRect().height;
    r.strip.style.transition = animate ? "transform " + dur + "ms cubic-bezier(.12,.62,.16,1)" : "none";
    r.strip.style.transform = "translateY(" + ((win - h) / 2 - i * h) + "px)";
  }
  function layout() {
    reels.forEach(function (r) { place(r, r.idx, false); });
    payline.style.setProperty("--cell-h", cellH(reels[0]) + "px");
  }
  function landedKeys() { return reels.map(function (r) { return r.strip.children[r.idx].dataset.key; }); }
  function announce() {
    var names = landedKeys().map(function (k) { return byKey[k] ? byKey[k].querySelector(".t").textContent : ""; });
    live.textContent = T.shown + " " + names.join(", ") + ".";
  }

  var spinning = false;
  function spin() {
    if (spinning) return;
    spinning = true;
    spinBtn.disabled = true;
    machine.classList.add("is-spinning");
    var done = 0;
    reels.forEach(function (r, k) {
      var target = Math.floor(Math.random() * r.n);
      if (reduce) { r.idx = target; place(r, target, false); done++; return; }
      place(r, r.idx, false);
      void r.strip.offsetHeight;
      var dist = target + r.n * (2 + (k === 2 ? 1 : 0));
      var dur = 1500 + k * 450;
      place(r, dist, true, dur);
      setTimeout(function () {
        r.idx = target; place(r, target, false);
        if (++done === reels.length) finish();
      }, dur + 40);
    });
    if (reduce) finish();
  }
  function finish() {
    spinning = false;
    spinBtn.disabled = false;
    machine.classList.remove("is-spinning");
    announce();
  }
  spinBtn.addEventListener("click", spin);
  reels.forEach(function (r) {
    r.el.addEventListener("click", function () {
      if (spinning) return;
      var li = byKey[r.strip.children[r.idx].dataset.key];
      if (li) openAt(li);
    });
  });

  window.addEventListener("resize", function () { if (!spinning) layout(); });
  var first = machine.querySelector(".cell img");
  function boot() { layout(); if (!reduce) setTimeout(spin, 450); else announce(); }
  if (first.complete) boot(); else { first.addEventListener("load", boot, { once: true }); first.addEventListener("error", boot, { once: true }); }

  /* ---------- videos: load only when clicked, one plays at a time ---------- */
  Array.prototype.slice.call(doc.querySelectorAll(".vid-btn")).forEach(function (btn) {
    btn.addEventListener("click", function () {
      Array.prototype.slice.call(doc.querySelectorAll(".vid video")).forEach(function (v) { v.pause(); });
      var v = doc.createElement("video");
      v.src = btn.dataset.src;
      v.poster = btn.querySelector("img").src;
      v.controls = true; v.autoplay = true; v.muted = true; v.loop = true;
      v.setAttribute("playsinline", ""); v.setAttribute("preload", "auto");
      v.setAttribute("aria-label", btn.getAttribute("aria-label"));
      v.addEventListener("play", function () {
        Array.prototype.slice.call(doc.querySelectorAll(".vid video")).forEach(function (o) { if (o !== v) o.pause(); });
      });
      btn.replaceWith(v);
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      v.focus();
    });
  });

  /* ---------- skill rings: fill up when they scroll into view ---------- */
  var rings = Array.prototype.slice.call(doc.querySelectorAll(".ring"));
  function fillRing(r) {
    if (r.classList.contains("is-on")) return;
    r.classList.add("is-on");
    var num = r.querySelector(".num"), end = +r.dataset.value;
    if (reduce) { num.textContent = end; return; }
    var t0 = null;
    (function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / 1600), e = 1 - Math.pow(1 - p, 3);
      num.textContent = Math.round(end * e);
      if (p < 1) requestAnimationFrame(step);
    })(performance.now());
  }
  if ("IntersectionObserver" in window && !reduce) {
    rings.forEach(function (r) { r.querySelector(".num").textContent = "0"; });
    var rio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var i = rings.indexOf(en.target);
        setTimeout(function () { fillRing(en.target); }, (i % 4) * 140);
        rio.unobserve(en.target);
      });
    }, { threshold: 0.5 });
    rings.forEach(function (r) { rio.observe(r); });
  } else rings.forEach(fillRing);

  /* ---------- contact form: sends straight to e-mail via FormSubmit ---------- */
  var form = doc.getElementById("contact-form");
  if (form) form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var name = form.name.value.trim(), from = form.email.value.trim(), msg = form.message.value.trim();
    var err = form.querySelector(".form-err");
    var btn = form.querySelector("button[type=submit]");
    var okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(from);
    [["name", !name], ["email", !okMail], ["message", !msg]].forEach(function (p) { form[p[0]].setAttribute("aria-invalid", String(p[1])); });
    err.classList.remove("is-ok");
    if (!name || !okMail || !msg) { err.textContent = form.dataset.err; return; }
    if (form._honey.value) return;
    var label = btn.innerHTML;
    btn.disabled = true; btn.textContent = form.dataset.sending; err.textContent = "";
    fetch("https://formsubmit.co/ajax/" + form.dataset.email, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ name: name, email: from, message: msg, _subject: form.dataset.subject + " – " + name, _replyto: from, _template: "table" })
    }).then(function (r) { return r.json().then(function (j) { if (!r.ok || String(j.success) !== "true") throw new Error(j.message || "fail"); }); })
      .then(function () { form.reset(); err.classList.add("is-ok"); err.textContent = form.dataset.ok; })
      .catch(function (e) { err.textContent = /activat/i.test(e.message) ? "FormSubmit: " + e.message : form.dataset.fail; })
      .then(function () { btn.disabled = false; btn.innerHTML = label; });
  });

  /* ---------- copy e-mail ---------- */
  var toast = doc.querySelector(".toast");
  var copyBtn = doc.querySelector(".copy");
  if (copyBtn) copyBtn.addEventListener("click", function () {
    var email = copyBtn.dataset.email;
    function ok() { toast.textContent = T.copied; toast.classList.add("is-on"); setTimeout(function () { toast.classList.remove("is-on"); }, 2200); }
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(email).then(ok, fallback);
    else fallback();
    function fallback() {
      var ta = doc.createElement("textarea"); ta.value = email; ta.setAttribute("readonly", "");
      ta.style.position = "fixed"; ta.style.opacity = "0"; doc.body.appendChild(ta); ta.select();
      try { doc.execCommand("copy"); ok(); } catch (e) { window.location.href = "mailto:" + email; }
      doc.body.removeChild(ta);
    }
  });
})();
