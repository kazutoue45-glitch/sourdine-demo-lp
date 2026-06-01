/* SOURDINE — motion & randomness (vanilla JS, 外部ライブラリ不使用) */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var rand = function (a, b) { return a + Math.random() * (b - a); };

  /* ---------- 1. スクロール出現（IntersectionObserver） ---------- */
  /* JS有効時だけ隠す。JS不達やreduce時はコンテンツを常時表示（消えない） */
  if (!reduce) {
    document.documentElement.classList.add("js-reveal");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    document.querySelectorAll("[data-reveal]").forEach(function (el) {
      var sibs = Array.prototype.indexOf.call(el.parentNode.children, el);
      el.style.setProperty("--rd", Math.min(sibs, 6) * 70 + "ms");
      io.observe(el);
    });
  }

  /* ---------- 2. 散らしのランダム性（微小な回転・縦ずれ） ---------- */
  if (!reduce) {
    document.querySelectorAll("[data-scatter]").forEach(function (el) {
      el.style.setProperty("--rot", rand(-0.9, 0.9).toFixed(2) + "deg");
      el.style.setProperty("--ny", rand(-12, 20).toFixed(0) + "px");
    });
  }

  /* ---------- 3. 画像クロスフェード（自動・ランダム開始） ---------- */
  document.querySelectorAll("[data-slideshow]").forEach(function (ss) {
    var imgs = Array.prototype.slice.call(ss.querySelectorAll("img"));
    if (imgs.length < 2) return;
    var i = Math.floor(Math.random() * imgs.length);     // ランダムな開始フレーム
    imgs.forEach(function (im, k) { im.classList.toggle("is-on", k === i); });
    if (reduce) return;
    var iv = 3000 + Math.random() * 1800;                // 間隔をばらして同期させない
    setInterval(function () {
      imgs[i].classList.remove("is-on");
      i = (i + 1) % imgs.length;
      imgs[i].classList.add("is-on");
    }, iv);
  });

  /* ---------- 4. グリッドのシャッフル（毎ロードで並びが変わる） ---------- */
  document.querySelectorAll("[data-shuffle]").forEach(function (parent) {
    var kids = Array.prototype.slice.call(parent.children);
    for (var k = kids.length - 1; k > 0; k--) {
      var j = (Math.random() * (k + 1)) | 0;
      var t = kids[k]; kids[k] = kids[j]; kids[j] = t;
    }
    kids.forEach(function (c) { parent.appendChild(c); });
  });

  /* ---------- 5. 軽いパララックス ---------- */
  if (!reduce) {
    var px = Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
    if (px.length) {
      var ticking = false;
      var update = function () {
        var vh = window.innerHeight;
        px.forEach(function (el) {
          var r = el.getBoundingClientRect();
          var c = (r.top + r.height / 2 - vh / 2) / vh;   // -1..1
          el.style.setProperty("--py", (c * -26).toFixed(1) + "px");
        });
        ticking = false;
      };
      window.addEventListener("scroll", function () {
        if (!ticking) { requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
      update();
    }
  }
})();
