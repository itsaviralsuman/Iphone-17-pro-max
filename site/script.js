/* ============================================================
   iPhone 17 Pro — interactions
   ============================================================ */
(function () {
  "use strict";

  /* ---------- nav scroll state ---------- */
  var nav = document.getElementById("nav");
  var onScroll = function () {
    if (window.scrollY > 30) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- reveal observer ---------- */
  var revealEls = document.querySelectorAll(".reveal, .mask");
  var io = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var el = e.target;
          var d = el.getAttribute("data-delay");
          if (d) el.style.transitionDelay = d + "ms";
          el.classList.add("in");
          io.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach(function (el) { io.observe(el); });

  /* ---------- color switcher ---------- */
  var colorImg = document.getElementById("colorImg");
  var colorGlow = document.getElementById("colorGlow");
  var colorName = document.getElementById("colorName");
  var swatches = document.querySelectorAll(".swatch");
  swatches.forEach(function (sw) {
    sw.addEventListener("click", function () {
      swatches.forEach(function (s) { s.classList.remove("active"); });
      sw.classList.add("active");
      var img = sw.getAttribute("data-img");
      var name = sw.getAttribute("data-name");
      var glow = sw.getAttribute("data-glow");
      if (colorImg && img) {
        colorImg.style.opacity = "0";
        setTimeout(function () {
          colorImg.src = img;
          colorImg.style.opacity = "1";
        }, 260);
      }
      if (colorName && name) colorName.textContent = name;
      if (colorGlow && glow) colorGlow.style.setProperty("--g", glow);
    });
  });

  /* ---------- zoom lab (focal length switcher) ---------- */
  var zoomImg = document.getElementById("zoomImg");
  var zoomLabel = document.getElementById("zoomLabel");
  var zoomMag = document.getElementById("zoomMag");
  var zoomBtns = document.querySelectorAll(".zoom-btn");
  zoomBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      zoomBtns.forEach(function (x) { x.classList.remove("active"); });
      b.classList.add("active");
      var src = b.getAttribute("data-img");
      var label = b.getAttribute("data-label");
      var mag = b.getAttribute("data-mag");
      if (zoomImg && src) {
        // crossfade: set new src, force reflow, toggle class
        zoomImg.classList.remove("in");
        var tmp = new Image();
        tmp.onload = function () {
          zoomImg.src = src;
          requestAnimationFrame(function () { zoomImg.classList.add("in"); });
        };
        tmp.src = src;
      }
      if (zoomLabel && label) zoomLabel.textContent = label;
      if (zoomMag && mag) zoomMag.textContent = mag;
    });
  });
  // ensure initial active image is shown
  if (zoomImg) zoomImg.classList.add("in");

  /* ---------- count-up stats ---------- */
  var counts = document.querySelectorAll(".num[data-count]");
  var cObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        var target = parseInt(el.getAttribute("data-count"), 10);
        var suffix = el.getAttribute("data-unit") || "";
        var start = null;
        var dur = 1400;
        var step = function (ts) {
          if (!start) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(target * eased) + (suffix ? "" : "");
          if (suffix && p >= 1) el.textContent = target + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        cObserver.unobserve(el);
      });
    },
    { threshold: 0.6 }
  );
  counts.forEach(function (c) { cObserver.observe(c); });

  /* ---------- running timecode for filmmaker section ---------- */
  var tcEl = document.getElementById("timecode");
  if (tcEl) {
    var frames = 0;
    var fps = 24;
    var section = document.getElementById("filmmaker");
    var active = false;
    var secObserver = new IntersectionObserver(
      function (es) { active = es[0].isIntersecting; },
      { threshold: 0.25 }
    );
    if (section) secObserver.observe(section);
    var fmt = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () {
      if (active) {
        var f = frames % fps;
        var s = Math.floor(frames / fps) % 60;
        var m = Math.floor(frames / (fps * 60)) % 60;
        var h = Math.floor(frames / (fps * 3600));
        tcEl.textContent = fmt(h) + ":" + fmt(m) + ":" + fmt(s) + ":" + fmt(f);
        frames++;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* ---------- smooth-scroll active link highlighting ---------- */
  var navLinks = document.querySelectorAll(".nav-links a");
  var sections = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href").replace("#", "");
    var s = document.getElementById(id);
    if (s) sections.push({ link: a, el: s });
  });
  var hlObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          navLinks.forEach(function (a) { a.style.color = ""; });
          var match = sections.find(function (x) { return x.el === e.target; });
          if (match) match.link.style.color = "#fff";
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach(function (s) { hlObserver.observe(s.el); });

  /* ---------- keyboard accessibility for swatches/zoom buttons ---------- */
  document.querySelectorAll(".swatch, .zoom-btn").forEach(function (el) {
    el.setAttribute("tabindex", "0");
    el.addEventListener("keydown", function (ev) {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        el.click();
      }
    });
  });
})();