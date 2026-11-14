(function () {
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  var form = document.getElementById("quote-form");
  if (form) {
    var params = new URLSearchParams(window.location.search);
    var interest = params.get("interest");
    if (interest) {
      var select = form.querySelector('[name="interest"]');
      if (select) {
        var match = Array.prototype.find.call(select.options, function (opt) {
          return opt.value === interest;
        });
        if (match) select.value = interest;
      }
    }
  }

  var galleryImgs = Array.prototype.slice.call(document.querySelectorAll(".gallery-item img"));
  if (galleryImgs.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.setAttribute("aria-label", "Photo viewer");
    box.innerHTML =
      '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
      '<button type="button" class="lightbox-prev" aria-label="Previous photo">&#10094;</button>' +
      '<figure><img alt=""><figcaption class="lightbox-caption"></figcaption></figure>' +
      '<button type="button" class="lightbox-next" aria-label="Next photo">&#10095;</button>';
    document.body.appendChild(box);
    var imgEl = box.querySelector("img");
    var capEl = box.querySelector(".lightbox-caption");
    var index = 0;

    function openAt(i) {
      index = (i + galleryImgs.length) % galleryImgs.length;
      var src = galleryImgs[index];
      imgEl.src = src.currentSrc || src.src;
      imgEl.alt = src.alt || "";
      var fig = src.closest("figure");
      var cap = fig ? fig.querySelector("figcaption") : null;
      capEl.textContent = cap ? cap.textContent : "";
      box.classList.add("is-open");
      document.body.classList.add("lightbox-open");
      box.querySelector(".lightbox-close").focus();
    }
    function close() {
      box.classList.remove("is-open");
      document.body.classList.remove("lightbox-open");
      imgEl.src = "";
    }

    galleryImgs.forEach(function (img, i) {
      var item = img.closest(".gallery-item") || img;
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.setAttribute("aria-label", (img.alt || "Open photo") + " (opens larger view)");
      item.addEventListener("click", function (ev) {
        ev.preventDefault();
        openAt(i);
      });
      item.addEventListener("keydown", function (ev) {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          openAt(i);
        }
      });
    });

    box.querySelector(".lightbox-close").addEventListener("click", close);
    box.querySelector(".lightbox-prev").addEventListener("click", function () { openAt(index - 1); });
    box.querySelector(".lightbox-next").addEventListener("click", function () { openAt(index + 1); });
    box.addEventListener("click", function (ev) {
      if (ev.target === box) close();
    });
    document.addEventListener("keydown", function (ev) {
      if (!box.classList.contains("is-open")) return;
      if (ev.key === "Escape") close();
      if (ev.key === "ArrowLeft") openAt(index - 1);
      if (ev.key === "ArrowRight") openAt(index + 1);
    });
  }
})();

(function () {
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)");
  function stopHeroVideos() {
    document.querySelectorAll("video.hero-video").forEach(function (video) {
      video.pause();
      video.removeAttribute("autoplay");
      video.setAttribute("preload", "none");
      video.querySelectorAll("source").forEach(function (s) { s.removeAttribute("src"); });
      video.removeAttribute("src");
      video.load();
    });
  }
  if (reduce && reduce.matches) stopHeroVideos();
  if (reduce && reduce.addEventListener) {
    reduce.addEventListener("change", function () {
      if (reduce.matches) stopHeroVideos();
    });
  }
})();

