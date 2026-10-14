# Milk, made in Australia

An interactive Australian dairy story by Senuth Dias for FIT3179 Data Visualisation 2, prepared 14 October 2026 using data checked 13 October 2026.

## View and publish

This is a static site. Enable GitHub Pages from the `main` branch and `/(root)` folder. The repository root must contain `index.html`, `styles.css`, `app.js`, `data/`, `specs/` and `assets/`. No build or package installation is needed. The three pinned Vega libraries load from jsDelivr, so an internet connection is required.

For local preview, run `python3 -m http.server 8765` in this folder, then open http://localhost:8765/. Opening `index.html` directly as a file will prevent some browsers from loading chart data.

## Source and design

The page contains 13 original Vega/Vega-Lite constructions, including a proportional-symbol map, a production-change choropleth and an export flow map. Readable specifications are in `specs/01.json` through `specs/13.json`. CSVs and geographic data are in `data/`. Charts can be inspected without a private account.

The revised storytelling includes a six-state slope comparison of approximate cows per registered farm (2011–12 versus 2024–25), an ABS butterfly comparing positive grams/person/day (2018–19 versus a selectable later year, on matched 0–220 scales), and two 100-square waffles comparing the drinking-milk mix (2010–11 versus a selectable later year). Each waffle square is approximately 1%; largest-remainder allocation makes exactly 100 cells, while tooltips preserve actual million litres and exact shares. The two panels are one chart/idiom. There are ten native dropdowns across the page, with All choices for highlighting.

Under the supplied basic/advanced classification, 12 of the 13 charts are advanced: three maps, heatmap, waterfall, connected-dot comparison, slope, parallel coordinates, Sankey, butterfly, waffle comparison and treemap. The annual production line deliberately remains basic because it clearly communicates the six-year trend. This inventory is not a guarantee of assessment credit.

Substantive sources are Dairy Australia's production statistics and *Australian Dairy Industry In Focus 2025*, plus the Australian Bureau of Statistics' *Apparent Consumption of Selected Foodstuffs, Australia, 2023–24*. Full links, dates, units and coverage limitations appear in the webpage. Geographic context comes from ABS ASGS 2021 and Natural Earth via Vega Datasets. Fraunces is distributed under the included SIL Open Font License.

Production charts use the revised 2020–21 to 2025–26 series. Structural comparisons preserve the 2025 report vintage. Approximate cows per registered farm divides rounded March cow counts by annual registered farms; it is not a typical-farm survey. Slope connections join two endpoints, not intermediate observations. ABS retail estimates are purchases, not measured diet. Butterfly bars are positive on both sides; leftward direction identifies the baseline period. Waffles show relative composition, not absolute market size: the 2010–11 total is 2,314 ML and the 2024–25 total is 2,340 ML. Export links are schematic relationships, not shipping routes. Small islands are generalised for display, and ACT/NT have no separate dairy data.

AI assistance is acknowledged in the webpage. The author must review the work and understand its data and design for the studio interview.

The assessed hand-drawn sketch is not included in this package. Add the genuine paper sketch as `sketch.pdf` after scanning it, then insert its public URL and image into the separate assignment report.
