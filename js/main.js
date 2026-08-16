/* =========================================================================
   Page behavior: mobile nav, content rendering (itineraries, hotels,
   registry, FAQ accordion), copy-registry-links button.
   Content itself lives in js/content.js — edit there, not here.
   ========================================================================= */

(function () {
  "use strict";

  // Owner-editable content lives in js/content.js. If it's missing or has a
  // typo, we don't want the whole page to go blank — so read defensively.
  var CONTENT = window.SITE_CONTENT || {};
  if (!window.SITE_CONTENT) {
    console.warn(
      "SITE_CONTENT is missing — check js/content.js for a typo. " +
      "The page will still load; content-driven sections are skipped."
    );
  }

  // Returns CONTENT[key] if it's a usable array, else logs which key is bad
  // and returns an empty array so the rest of the page keeps rendering.
  function contentList(key) {
    if (!Array.isArray(CONTENT[key])) {
      console.warn(
        'SITE_CONTENT.' + key + ' is missing or not a list — skipping that ' +
        'section. Check js/content.js.'
      );
      return [];
    }
    return CONTENT[key];
  }

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
  contentList("itineraries").forEach(function (it) {
    var card = document.createElement("article");
    card.className = "card itinerary-card";
    card.innerHTML =
      '<h4><span aria-hidden="true">' + it.emoji + "</span> " + escapeHtml(it.title) + "</h4>" +
      '<p class="itinerary-blurb">' + escapeHtml(it.blurb) + "</p>" +
      "<ul>" + it.stops.map(function (s) { return "<li>" + escapeHtml(s) + "</li>"; }).join("") + "</ul>";
    itGrid.appendChild(card);
  });

  /* ---------------- hotels ---------------------------------------------- */

  // Hotel cards deliberately mirror the registry cards below: same circular
  // logo, heading, and centred body. They stay open (no <details>) because
  // there are only three and each carries a link or two.
  var hotelGrid = document.getElementById("hotel-grid");
  contentList("hotels").forEach(function (h) {
    var card = document.createElement("div");
    card.className = "card hotel-card" + (h.confirmed ? "" : " hotel-soon");
    var badge = h.confirmed ? "" : '<span class="badge">details coming soon</span>';
    var booking = h.url
      ? '<a class="btn btn-ghost" href="' + escapeHtml(h.url) + '" target="_blank" rel="noopener">Book a room</a>'
      : (h.cta ? '<span class="hotel-cta">' + escapeHtml(h.cta) + "</span>" : "");
    card.innerHTML =
      '<span class="hotel-logo" aria-hidden="true">' + escapeHtml(h.initials || "🏨") + "</span>" +
      "<h4>" + escapeHtml(h.name) + "</h4>" +
      '<span class="hotel-area">' + escapeHtml(h.area) + "</span>" +
      (h.rate ? '<span class="hotel-rate">' + escapeHtml(h.rate) + "</span>" : "") +
      badge +
      "<p>" + escapeHtml(h.note) + "</p>" +
      '<a class="btn btn-ghost" href="https://www.google.com/maps/search/?api=1&query=' +
      encodeURIComponent(h.mapQuery) + '" target="_blank" rel="noopener">View area on map</a>' +
      booking;
    hotelGrid.appendChild(card);
  });

  /* ---------------- registry -------------------------------------------- */

  var regGrid = document.getElementById("registry-grid");
  contentList("registries").forEach(function (r) {
    // The joke item is a <button> that opens the "agreement" dialog instead
    // of linking straight out; regular items stay plain links.
    var card = document.createElement(r.joke ? "button" : "a");
    card.className = "card registry-card" + (r.joke ? " registry-joke" : "");
    if (r.joke) {
      card.type = "button";
      card.addEventListener("click", function () { openNamingRights(r); });
    } else {
      card.href = r.url;
      card.target = "_blank";
      card.rel = "noopener";
    }
    card.innerHTML =
      '<span class="registry-logo" aria-hidden="true">' + escapeHtml(r.initials) + "</span>" +
      "<h4>" + escapeHtml(r.store) + "</h4>" +
      (r.price ? '<span class="registry-price">' + escapeHtml(r.price) + "</span>" : "") +
      "<p>" + escapeHtml(r.note) + "</p>" +
      '<span class="registry-go">' + escapeHtml(r.cta || "Visit registry →") + "</span>";
    regGrid.appendChild(card);
  });

  /* ---- the naming-rights "agreement" (joke item) ---- */

  var nrDialog = document.getElementById("naming-rights-dialog");
  var nrUrl = "";

  function openNamingRights(item) {
    nrUrl = item.url;
    document.getElementById("nr-ack-joke").checked = false;
    document.getElementById("nr-ack-refund").checked = false;
    document.getElementById("nr-signature").value = "";
    updateNrAgree();
    nrDialog.showModal();
  }

  // "Take my money" unlocks only after both acknowledgements + a signature.
  function updateNrAgree() {
    var signed = document.getElementById("nr-signature").value.trim().length >= 2;
    var acked = document.getElementById("nr-ack-joke").checked &&
      document.getElementById("nr-ack-refund").checked;
    document.getElementById("nr-agree").disabled = !(signed && acked);
  }

  if (nrDialog) {
    nrDialog.addEventListener("input", updateNrAgree);
    nrDialog.addEventListener("change", updateNrAgree);
    document.getElementById("nr-cancel").addEventListener("click", function () {
      nrDialog.close();
    });
    document.getElementById("naming-rights-form").addEventListener("submit", function () {
      window.open(nrUrl, "_blank", "noopener");
    });
  }

  var copyBtn = document.getElementById("copy-registry");
  var toast = document.getElementById("copy-toast");
  copyBtn.addEventListener("click", function () {
    var text = contentList("registries")
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
  contentList("faqs").forEach(function (f, i) {
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
