/* =========================================================================
   Page behavior: mobile nav, content rendering (itineraries, hotels,
   registry, FAQ accordion), copy-registry-links button.
   Content itself lives in js/content.js — edit there, not here.
   ========================================================================= */

(function () {
  "use strict";

  var CONTENT = window.SITE_CONTENT;

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  /* ---------------- mobile nav ----------------------------------------- */

  var toggle = document.getElementById("nav-toggle");
  var menu = document.getElementById("nav-menu");
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("open", !open);
  });
  // Close the menu after picking a link (mobile)
  menu.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("open");
    }
  });

  /* ---------------- click-to-load Google Map ---------------------------- */
  // The map placeholder is a real button; clicking it swaps in Google's
  // iframe. Until then, no request to google.com is made (privacy + speed).

  var mapLoader = document.getElementById("map-loader");
  if (mapLoader) {
    mapLoader.addEventListener("click", function () {
      var iframe = document.createElement("iframe");
      iframe.src = mapLoader.dataset.mapSrc;
      iframe.title = "Map to Salvage One, 1840 W Hubbard St, Chicago";
      iframe.loading = "lazy";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "no-referrer-when-downgrade";
      mapLoader.replaceWith(iframe);
    });
  }

  /* ---------------- itineraries ----------------------------------------- */

  var itGrid = document.getElementById("itinerary-grid");
  CONTENT.itineraries.forEach(function (it) {
    var card = document.createElement("article");
    card.className = "card itinerary-card";
    card.innerHTML =
      '<h4><span aria-hidden="true">' + it.emoji + "</span> " + escapeHtml(it.title) + "</h4>" +
      '<p class="itinerary-blurb">' + escapeHtml(it.blurb) + "</p>" +
      "<ul>" + it.stops.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("") + "</ul>";
    itGrid.appendChild(card);
  });

  /* ---------------- hotels ---------------------------------------------- */

  var hotelGrid = document.getElementById("hotel-grid");
  CONTENT.hotels.forEach(function (h) {
    var details = document.createElement("details");
    details.className = "card hotel-card";
    var badge = h.confirmed ? "" : ' <span class="badge">details coming soon</span>';
    var booking = h.url
      ? '<a class="btn btn-ghost" href="' + escapeHtml(h.url) + '" target="_blank" rel="noopener">Book a room</a>'
      : "";
    details.innerHTML =
      "<summary><strong>" + escapeHtml(h.name) + "</strong> · " + escapeHtml(h.area) + badge + "</summary>" +
      '<div class="hotel-body"><p>' + escapeHtml(h.note) + "</p>" +
      '<a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(h.mapQuery) + '" target="_blank" rel="noopener">View area on map</a>' +
      booking + "</div>";
    hotelGrid.appendChild(details);
  });

  /* ---------------- registry -------------------------------------------- */

  var regGrid = document.getElementById("registry-grid");
  CONTENT.registries.forEach(function (r) {
    var card = document.createElement("a");
    card.className = "card registry-card";
    card.href = r.url;
    card.target = "_blank";
    card.rel = "noopener";
    card.innerHTML =
      '<span class="registry-logo" aria-hidden="true">' + escapeHtml(r.initials) + "</span>" +
      "<h4>" + escapeHtml(r.store) + "</h4>" +
      "<p>" + escapeHtml(r.note) + "</p>" +
      '<span class="registry-go">Visit registry →</span>';
    regGrid.appendChild(card);
  });

  var copyBtn = document.getElementById("copy-registry");
  var toast = document.getElementById("copy-toast");
  copyBtn.addEventListener("click", function () {
    var text = CONTENT.registries
      .map(function (r) { return r.store + ": " + r.url; })
      .join("\n");
    function done(ok) {
      toast.textContent = ok ? "Links copied — paste away!" : "Couldn't copy automatically. Links are above!";
      setTimeout(function () { toast.textContent = ""; }, 4000);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      done(false);
    }
  });

  /* ---------------- FAQ accordion ---------------------------------------- */

  var acc = document.getElementById("faq-accordion");
  CONTENT.faqs.forEach(function (f, i) {
    var item = document.createElement("div");
    item.className = "accordion-item";
    var btnId = "faq-btn-" + i;
    var panelId = "faq-panel-" + i;
    item.innerHTML =
      '<h3 class="accordion-heading">' +
      '<button type="button" class="accordion-trigger" id="' + btnId + '" aria-expanded="false" aria-controls="' + panelId + '">' +
      escapeHtml(f.q) + '<span class="accordion-icon" aria-hidden="true">+</span></button></h3>' +
      '<div class="accordion-panel" id="' + panelId + '" role="region" aria-labelledby="' + btnId + '" hidden><p>' +
      escapeHtml(f.a) + "</p></div>";
    acc.appendChild(item);
  });

  acc.addEventListener("click", function (e) {
    var btn = e.target.closest(".accordion-trigger");
    if (!btn) return;
    var expanded = btn.getAttribute("aria-expanded") === "true";
    btn.setAttribute("aria-expanded", String(!expanded));
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    panel.hidden = expanded;
    btn.querySelector(".accordion-icon").textContent = expanded ? "+" : "–";
  });
})();
