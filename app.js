/* Local chart specifications keep the page portable to a GitHub project URL. */
(() => {
  "use strict";

  const entries = Array.from({ length: 13 }, (_, index) => {
    const number = String(index + 1).padStart(2, "0");
    return {
      id: `chart-${number}`,
      url: `specs/${number}.json`,
      host: document.getElementById(`chart-${number}`),
      source: null,
      result: null,
      width: 0,
      controls: [],
      queue: Promise.resolve(),
    };
  });

  window.chartViews = Object.create(null);
  window.chartErrors = Object.create(null);

  const clone = value => JSON.parse(JSON.stringify(value));

  function boundSignalNames(specification) {
    const names = new Set();
    const visit = value => {
      if (!value || typeof value !== "object") return;
      for (const kind of ["params", "signals"]) {
        if (Array.isArray(value[kind])) {
          value[kind].forEach(parameter => {
            if (parameter.name && parameter.bind) names.add(parameter.name);
          });
        }
      }
      for (const [key, child] of Object.entries(value)) {
        if (["data", "datasets", "values", "config"].includes(key)) continue;
        if (Array.isArray(child)) child.forEach(visit);
        else if (child && typeof child === "object") visit(child);
      }
    };
    visit(specification);
    return [...names];
  }

  function savedControls(entry) {
    const saved = {};
    if (!entry.result) return saved;
    for (const name of entry.controls) {
      try {
        const value = entry.result.view.signal(name);
        if (value !== undefined) saved[name] = clone(value);
      } catch (_) {
        // Selection bindings can compile to different internal signal names.
      }
    }
    return saved;
  }

  function reportError(entry, error) {
    const message = error instanceof Error ? error.message : String(error);
    window.chartErrors[entry.id] = message;
    delete window.chartViews[entry.id];
    entry.host.replaceChildren();
    const box = document.createElement("div");
    box.className = "chart-error";
    box.setAttribute("role", "alert");
    const heading = document.createElement("p");
    heading.textContent = "This chart could not load. Check your connection and try again.";
    const details = document.createElement("p");
    details.className = "error-detail";
    details.textContent = message;
    const retry = document.createElement("button");
    retry.type = "button";
    retry.textContent = "Retry chart";
    retry.addEventListener("click", () => scheduleRender(entry, true));
    const link = document.createElement("a");
    link.href = entry.url;
    link.textContent = "Open chart file";
    box.append(heading, details, retry, link);
    entry.host.append(box);
    entry.host.setAttribute("aria-busy", "false");
    console.error(`[${entry.id}]`, error);
  }

  async function render(entry, force = false) {
    if (!entry.host) return { id: entry.id, status: "missing-container" };
    const width = Math.floor(entry.host.clientWidth);
    if (width < 1) return { id: entry.id, status: "hidden" };
    if (!force && entry.result && Math.abs(width - entry.width) < 2) {
      return { id: entry.id, status: "ready" };
    }
    entry.host.setAttribute("aria-busy", "true");
    try {
      if (typeof window.vegaEmbed !== "function") {
        throw new Error("The chart library is unavailable. Reload the page when your internet connection is ready.");
      }
      if (!entry.source) {
        const response = await fetch(entry.url);
        if (!response.ok) throw new Error(`Chart file returned HTTP ${response.status}: ${entry.url}`);
        entry.source = await response.json();
        entry.controls = boundSignalNames(entry.source);
      }
      const remembered = savedControls(entry);
      const specification = clone(entry.source);
      specification.width = width;
      if (entry.id === "chart-12") specification.height = Math.max(260, Math.min(430, Math.round(width * 0.44)));
      if (entry.result) {
        entry.result.finalize();
        entry.result = null;
      }
      entry.host.replaceChildren();
      const result = await window.vegaEmbed(entry.host, specification, {
        renderer: "svg",
        actions: false,
        tooltip: true,
        defaultStyle: false,
      });
      for (const [name, value] of Object.entries(remembered)) {
        try { result.view.signal(name, value); } catch (_) { /* Non-signal selection. */ }
      }
      await result.view.runAsync();
      entry.result = result;
      entry.width = width;
      window.chartViews[entry.id] = result.view;
      delete window.chartErrors[entry.id];
      const svg = entry.host.querySelector("svg");
      if (svg) {
        svg.setAttribute("role", "img");
        const title = entry.host.closest("figure")?.querySelector("h3")?.textContent;
        if (title && !svg.getAttribute("aria-label")) svg.setAttribute("aria-label", title);
      }
      entry.host.setAttribute("aria-busy", "false");
      return { id: entry.id, status: "ready", width };
    } catch (error) {
      reportError(entry, error);
      return { id: entry.id, status: "error", message: String(error) };
    }
  }

  function scheduleRender(entry, force = false) {
    entry.queue = entry.queue.catch(() => {}).then(() => render(entry, force));
    return entry.queue;
  }

  // A stable promise makes the complete initial rendering observable for QA.
  window.__chartsReady = Promise.all(entries.map(entry => scheduleRender(entry)));

  let resizeTimer;
  const queueResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      entries.forEach(entry => scheduleRender(entry));
    }, 220);
  };
  window.addEventListener("resize", queueResize, { passive: true });
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(queueResize);
    entries.forEach(entry => { if (entry.host) observer.observe(entry.host); });
  }
  if (document.fonts?.ready) document.fonts.ready.then(queueResize);
})();
