/* Borislav Knežević – GSAP animations (runs after main.js).
   If GSAP doesn't load or the visitor prefers reduced motion, the site works without animations. */
(function () {
  "use strict";
  var root = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!window.gsap || reduce) { root.classList.remove("motion"); return; }

  var gsap = window.gsap;
  var hasST = !!window.ScrollTrigger;
  if (hasST) gsap.registerPlugin(window.ScrollTrigger);
  var $ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- 1. hero intro ---------- */
  var h1 = document.querySelector(".hero h1");
  if (h1) {
    h1.setAttribute("aria-label", $(".line", h1).map(function (l) { return l.textContent.trim(); }).join(" "));
    $(".line", h1).forEach(function (line) {
      var txt = line.textContent;
      line.textContent = "";
      line.setAttribute("aria-hidden", "true");
      Array.from(txt).forEach(function (ch) {
        var s = document.createElement("span");
        s.className = "ch";
        s.textContent = ch;
        line.appendChild(s);
      });
    });
  }
  var tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  gsap.set([".hero-text > *", ".machine", ".stripes i"], { autoAlpha: 1 });
  root.classList.remove("motion");
  tl.from(".stripes i", { yPercent: -120, duration: 1.1, stagger: 0.08, ease: "power4.out" }, 0)
    .from(".hero h1 .ch", { yPercent: 115, rotate: 6, duration: 0.9, stagger: 0.035 }, 0.15)
    .from(".hero-role", { y: 24, autoAlpha: 0, duration: 0.6 }, 0.75)
    .from(".hero-lead", { y: 24, autoAlpha: 0, duration: 0.6 }, 0.85)
    .from(".hero-cta > *", { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 0.95)
    .from(".machine", { y: 60, rotate: 2, autoAlpha: 0, duration: 1, ease: "back.out(1.4)" }, 0.45)
    .from(".bulbs i", { scale: 0, duration: 0.3, stagger: { each: 0.03, from: "center" } }, 1.0);

  /* bulbs chase around while reels spin, payline flashes when they land */
  var machine = document.querySelector(".machine");
  if (machine && "MutationObserver" in window) {
    var wasSpinning = false;
    new MutationObserver(function () {
      var spinning = machine.classList.contains("is-spinning");
      if (wasSpinning && !spinning) {
        gsap.fromTo(".payline", { boxShadow: "0 0 0 0 rgba(242,31,12,0)" },
          { boxShadow: "0 0 28px 4px rgba(242,31,12,.75)", duration: 0.25, yoyo: true, repeat: 3, ease: "power1.inOut" });
        gsap.fromTo(".reel", { y: -6 }, { y: 0, duration: 0.5, ease: "bounce.out", stagger: 0.06 });
      }
      wasSpinning = spinning;
    }).observe(machine, { attributes: true, attributeFilter: ["class"] });
  }

  /* spin button squash on press */
  var spinBtn = document.querySelector(".spin");
  if (spinBtn) spinBtn.addEventListener("pointerdown", function () {
    gsap.fromTo(spinBtn, { scale: 0.94 }, { scale: 1, duration: 0.4, ease: "back.out(3)" });
  });

  if (!hasST) return;
  var ST = window.ScrollTrigger;

  /* ---------- 2. stripes parallax ---------- */
  gsap.to(".stripes", { yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

  /* ---------- 3. client logos ---------- */
  gsap.from(".clients li", { y: 20, autoAlpha: 0, duration: 0.5, stagger: 0.07, ease: "power2.out",
    scrollTrigger: { trigger: ".clients", start: "top 90%", once: true } });

  /* ---------- 4. section headings slide in ---------- */
  $(".section h2, .edu-title").forEach(function (h) {
    gsap.from(h, { x: -40, autoAlpha: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: h, start: "top 88%", once: true } });
  });

  /* ---------- 5. portfolio grid reveals in batches ---------- */
  var works = $(".work");
  gsap.set(works, { autoAlpha: 0, y: 46 });
  ST.batch(works, {
    start: "top 92%",
    once: true,
    onEnter: function (batch) {
      gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", overwrite: true });
    }
  });
  /* after a filter or "show all": show what's visible now, then recalc positions */
  function revealVisible() {
    var visible = works.filter(function (w) { return !w.hidden; });
    gsap.fromTo(visible, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.025, ease: "power2.out", overwrite: true });
    ST.refresh();
  }
  $(".filter, .more").forEach(function (b) { b.addEventListener("click", function () { setTimeout(revealVisible, 0); }); });
  $(".filters .filter").forEach(function (b) {
    b.addEventListener("pointerdown", function () { gsap.fromTo(b, { scale: 0.92 }, { scale: 1, duration: 0.35, ease: "back.out(3)" }); });
  });

  gsap.from(".vid", { y: 50, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "power3.out",
    scrollTrigger: { trigger: ".videos", start: "top 88%", once: true } });

  /* ---------- 6. services + timeline rows ---------- */
  [".services li", ".timeline li"].forEach(function (sel) {
    $(sel).forEach(function (li) {
      gsap.from(li, { y: 30, autoAlpha: 0, duration: 0.6, ease: "power2.out", scrollTrigger: { trigger: li, start: "top 90%", once: true } });
    });
  });

  /* ---------- 7. about: portrait + counting numbers ---------- */
  gsap.from(".portrait", { scale: 0.85, rotate: -6, autoAlpha: 0, duration: 1, ease: "back.out(1.6)",
    scrollTrigger: { trigger: ".portrait", start: "top 85%", once: true } });
  $(".facts dt").forEach(function (dt) {
    var m = dt.textContent.trim().match(/^(\d+)(.*)$/);
    if (!m) return;
    var end = parseInt(m[1], 10), suffix = m[2], obj = { v: 0 };
    dt.textContent = "0" + suffix;
    gsap.to(obj, { v: end, duration: 1.6, ease: "power2.out", snap: { v: 1 },
      scrollTrigger: { trigger: dt, start: "top 90%", once: true },
      onUpdate: function () { dt.textContent = Math.round(obj.v) + suffix; } });
  });

  /* ---------- 8. contact ---------- */
  gsap.from(".mail", { y: 40, autoAlpha: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: ".mail", start: "top 90%", once: true } });
  gsap.from(".socials li", { y: 24, autoAlpha: 0, duration: 0.5, stagger: 0.07, ease: "power2.out",
    scrollTrigger: { trigger: ".socials", start: "top 90%", once: true } });
  gsap.from(".form", { x: 40, autoAlpha: 0, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ".form", start: "top 90%", once: true } });

  /* images load lazily and change heights: recalc trigger positions when they do */
  var rt;
  function refreshSoon() { clearTimeout(rt); rt = setTimeout(function () { ST.refresh(); }, 200); }
  $("img[loading='lazy']").forEach(function (img) { if (!img.complete) img.addEventListener("load", refreshSoon, { once: true }); });
})();
