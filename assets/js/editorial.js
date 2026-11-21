(function () {
  "use strict";

  var WA = "https://wa.me/2347049889936";
  var LOOKS = [
    {
      name: "Santa’s gift",
      unit: "14″ Vietnamese Bone-straight",
      spec: "300g · HD lace · ready-made",
      price: "₦320,000.00",
      href: "https://leriezplace.com/product/14-vietnamese-bonestraight-straight-300g/"
    },
    {
      name: "Body wave",
      unit: "Blonde bouncy 12″ 100g",
      spec: "Donor bouncy · light density",
      price: "₦95,000.00",
      href: "https://leriezplace.com/product/blonde-bouncy-12-100g/"
    },
    {
      name: "Lace close-up",
      unit: "10″ Bonestraight 5×5 HD closure",
      spec: "5×5 HD lace closure",
      price: "₦100,000.00",
      href: "https://leriezplace.com/product/10-bonestraight-55-hd-lace-closure/"
    },
    {
      name: "Espresso layers",
      unit: "Cajun brown",
      spec: "Layered espresso · human hair",
      price: "",
      href: "https://leriezplace.com/product/cajun-brown/"
    }
  ];

  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }
  function qsa(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function setSelected(buttons, index) {
    buttons.forEach(function (btn, i) {
      var on = i === index;
      btn.setAttribute("aria-selected", on ? "true" : "false");
      btn.tabIndex = on ? 0 : -1;
    });
  }

  function bindTablist(list, onChange) {
    if (!list) return;
    var buttons = qsa('[role="tab"]', list);
    buttons.forEach(function (btn, i) {
      btn.addEventListener("click", function () { onChange(i); });
      btn.addEventListener("keydown", function (e) {
        var next = i;
        if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % buttons.length;
        else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + buttons.length) % buttons.length;
        else if (e.key === "Home") next = 0;
        else if (e.key === "End") next = buttons.length - 1;
        else return;
        e.preventDefault();
        onChange(next);
        buttons[next].focus();
      });
    });
  }

  function initHero() {
    var tabs = qs("#look-tabs");
    var slides = qsa(".hero-arch img.slide");
    var unit = qs("#look-unit");
    var spec = qs("#look-spec");
    var price = qs("#look-price");
    var view = qs("#look-view");
    var book = qs("#look-book");
    var buttons = tabs ? qsa('[role="tab"]', tabs) : [];
    var i = 0;

    function show(n) {
      i = ((n % LOOKS.length) + LOOKS.length) % LOOKS.length;
      slides.forEach(function (img, idx) { img.classList.toggle("is-on", idx === i); });
      setSelected(buttons, i);
      var look = LOOKS[i];
      if (unit) unit.textContent = look.unit;
      if (spec) spec.textContent = look.spec;
      if (price) {
        price.textContent = look.price || "Custom / View options";
        price.hidden = false;
      }
      if (view) view.href = look.href;
      if (book) book.href = "#book";
    }

    if (book) {
      book.addEventListener("click", function (ev) {
        ev.preventDefault();
        document.dispatchEvent(new CustomEvent("leriez:book-look", { detail: { unit: LOOKS[i].unit } }));
      });
    }

    bindTablist(tabs, show);
    show(0);
  }

  function initMenu() {
    var toggle = qs(".menu-toggle");
    var panel = qs("#mobile-panel");
    if (!toggle || !panel) return;
    toggle.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      panel.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  function initFilters() {
    var rail = qs("#filters");
    var cards = qsa("[data-tags]");
    if (!rail) return;
    var buttons = qsa('[role="tab"]', rail);
    bindTablist(rail, function (index) {
      var value = buttons[index].getAttribute("data-filter");
      setSelected(buttons, index);
      cards.forEach(function (card) {
        var tags = (card.getAttribute("data-tags") || "").split(/\s+/);
        var show = value === "all" || tags.indexOf(value) !== -1;
        card.classList.toggle("is-hidden", !show);
      });
    });
    setSelected(buttons, 0);
  }

  function initPerks() {
    qsa(".perk").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var open = btn.getAttribute("aria-expanded") === "true";
        qsa(".perk").forEach(function (other) {
          other.setAttribute("aria-expanded", "false");
          var body = qs("#" + other.getAttribute("aria-controls"));
          if (body) body.classList.remove("is-open");
        });
        if (!open) {
          btn.setAttribute("aria-expanded", "true");
          var panel = qs("#" + btn.getAttribute("aria-controls"));
          if (panel) panel.classList.add("is-open");
        }
      });
    });
  }

  function initGuides() {
    var list = qs("#guide-tabs");
    var copy = qs("#guide-copy");
    if (!list || !copy) return;
    var buttons = qsa('[role="tab"]', list);
    bindTablist(list, function (index) {
      setSelected(buttons, index);
      copy.textContent = buttons[index].getAttribute("data-copy") || "";
    });
    setSelected(buttons, 0);
    copy.textContent = buttons[0].getAttribute("data-copy") || "";
  }

  function initBooking() {
    var form = qs("#booking-builder");
    if (!form) return;

    var state = {
      service: "HD Lace Wig Install",
      unit: "Bringing a Leriez unit",
      look: "",
      date: "",
      slot: "Morning 10am–1pm",
      rewards: "",
      note: ""
    };

    function bindGroup(id, key) {
      var list = qs(id);
      if (!list) return;
      var buttons = qsa("button", list);
      buttons.forEach(function (btn) {
        btn.addEventListener("click", function () {
          buttons.forEach(function (b) { b.setAttribute("aria-selected", "false"); });
          btn.setAttribute("aria-selected", "true");
          state[key] = btn.getAttribute("data-value") || btn.textContent.trim();
          render();
        });
      });
    }

    bindGroup("#service-pills", "service");
    bindGroup("#unit-pills", "unit");
    bindGroup("#slot-pills", "slot");

    var date = qs("#book-date");
    if (date) {
      var today = new Date();
      var iso = today.toISOString().slice(0, 10);
      date.min = iso;
      date.addEventListener("change", function () {
        state.date = date.value;
        render();
      });
    }
    var rewards = qs("#book-rewards");
    var note = qs("#book-note");
    if (rewards) rewards.addEventListener("input", function () { state.rewards = rewards.value; render(); });
    if (note) note.addEventListener("input", function () { state.note = note.value; render(); });

    function message() {
      var when = state.date || "date to confirm";
      var lines = [
        "Hi Leriez Place — I'd like to book a festive install.",
        "Service: " + state.service,
        "Unit: " + state.unit
      ];
      if (state.look) lines.push("Look: " + state.look);
      lines.push("Preferred: " + when + ", " + state.slot);
      if (state.rewards.trim()) lines.push("Rewards ID: " + state.rewards.trim());
      if (state.note.trim()) lines.push("Note: " + state.note.trim());
      lines.push("Studio: F283, M.I. Wushishi Estate, Chanchaga LGA, Minna, Niger State.");
      return lines.join("\n");
    }

    function render() {
      var box = qs("#book-summary");
      var wa = qs("#book-whatsapp");
      var copyBtn = qs("#book-copy");
      var text = message();
      if (box) box.textContent = text;
      if (wa) wa.href = WA + "?text=" + encodeURIComponent(text);
      if (copyBtn) {
        copyBtn.onclick = function () {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text);
            copyBtn.textContent = "Copied";
            setTimeout(function () { copyBtn.textContent = "Copy Details"; }, 1600);
          }
        };
      }
    }

    document.addEventListener("leriez:book-look", function (e) {
      var name = (e.detail && e.detail.unit) || "";
      state.look = name;
      state.unit = "Shopping for a unit";
      state.note = name ? "Book this look: " + name : state.note;
      if (note) note.value = state.note;
      qsa("#unit-pills button").forEach(function (btn) {
        btn.setAttribute("aria-selected", btn.getAttribute("data-value") === state.unit ? "true" : "false");
      });
      render();
      var section = qs("#book");
      if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    render();
  }

  function initHash() {
    function go() {
      var hash = (location.hash || "").replace("#", "");
      if (hash === "booking") {
        var book = qs("#book");
        if (book) book.scrollIntoView();
      }
    }
    window.addEventListener("hashchange", go);
    if (location.hash === "#booking") {
      requestAnimationFrame(go);
    }
  }

  function initMobileNav() {
    var links = qsa(".mobile-bottom a[data-watch]");
    if (!links.length || !("IntersectionObserver" in window)) return;
    var map = {};
    links.forEach(function (a) {
      var id = (a.getAttribute("href") || "").replace("#", "");
      if (id) map[id] = a;
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) { a.classList.remove("is-active"); });
        var link = map[entry.target.id];
        if (link) link.classList.add("is-active");
      });
    }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.1 });
    ["hero", "collection", "featured", "book"].forEach(function (id) {
      var el = qs("#" + id);
      if (el) observer.observe(el);
    });
  }

  function initReveals() {
    var items = qsa(".bento-card, .product-card");
    if (!items.length) return;
    items.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.transitionDelay = (i % 4) * 80 + "ms";
    });
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { observer.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initHero();
    initMenu();
    initFilters();
    initPerks();
    initGuides();
    initBooking();
    initHash();
    initMobileNav();
    initReveals();
  });
})();
