# DreamPrice

[![Deploy](https://github.com/ETOgaosion/DreamPrice/actions/workflows/deploy.yml/badge.svg)](https://github.com/ETOgaosion/DreamPrice/actions/workflows/deploy.yml)

**[dreamprice — what the dream actually costs →](https://etogaosion.github.io/DreamPrice/)**

Six assets across three countries, costed line by line from primary sources, and priced per year,
per month, and per day.

| | Asset | Where |
|---|---|---|
| 🇨🇳 | Lotus Emeya (new) | Shenzhen |
| 🇨🇳 | Duplex loft (rented) | Shenzhen |
| 🇯🇵 | Nissan GT-R R35 (used) | Tokyo |
| 🇯🇵 | Tower mansion (rented) | Tokyo |
| 🇳🇴 | Mercedes-AMG (used) | Tromsø |
| 🇳🇴 | Small house (rented) | Tromsø / Lofoten |

## What it does

Two pages, deliberately.

**The front page answers the question and nothing else** — four tables, one per period: per year
(每年), per quarter (每季度), per month (每月), per day (每天). Each lists the six assets dearest first,
with a tint behind each row showing its share, and a total. The one-off cost sits separately below,
because it is not a period and folding it into the tables would make them lie.

**The detail page is where you configure and interrogate.** Pick a trim, a model year, a district and a
mileage; every line item expands to show what it is, where the number came from, and where it is shaky.
It also carries the composition chart, the caveats and the source list.

Settings live in `localStorage`, so anything you change on one page is already applied on the other.
Three scenarios (optimistic / realistic / pessimistic) drive every range at once, and a horizon slider
runs the year-by-year schedule including depreciation.

Both cars are budgeted second-hand at roughly ¥500,000 CNY each — about ¥11.4M in Tokyo and
NOK 695,000 in Tromsø.

## Data

Research date **2026-09-15**. Sourcing is primary or official wherever one exists: Chinese State
Council and MOF tax notices, Japanese prefectural tax tables and Nissan's own R35-specific service
price list, Norwegian Lovdata statutes and Skatteetaten rate tables, SSB and 総務省 statistics,
manufacturer price lists, and live listings from Guazi, goo-net, FINN and 贝壳. Where only listings or
trade estimates exist, the line is tagged `estimate` in the UI. All 160-plus sources are linked at the
bottom of the page.

A few findings worth knowing before you read the numbers:

- **The NEV purchase-tax holiday ended.** From 2026 the relief is capped at ¥15,000, so an Emeya pays
  exactly ¥15,000 more than it would have in 2025 — and Lotus has separately cut the entry price from
  ¥668,000 to ¥538,000, which makes repricing rather than wear the dominant cost of ownership.
- **環境性能割 was abolished on 2026-03-31.** Any Japanese cost guide written before this year is wrong.
- **You cannot insure an early R35 for what you pay for it.** Real 2026 quotes on a 2008 car returned an
  agreed value of ¥4.35–4.90M against a ¥9–10M purchase price, and hull cover disappears entirely at 20
  years from registration.
- **Buying used in Norway skips engangsavgift entirely.** It is paid once at first registration and
  never re-levied, so a NOK 700,000 budget reaches cars that cost NOK 1.5M new. Your whole tax bill is
  1,942–4,532 kr.
- **SSB does not publish Tromsø rent.** Live FINN listings for an actual house are 22,000–36,000 kr, not
  the 13,000 kr that gets quoted second-hand.

## Running it

Static site, no build step, no dependencies.

```sh
python3 -m http.server 8000   # then open http://localhost:8000
node scripts/check.mjs        # validate the model and data
```

## Layout

```
index.html              overview — the four period tables
details.html            configuration, line items, caveats, sources
assets/css/styles.css
assets/js/data.js       researched figures, sources and caveats
assets/js/model.js      cost engine, FX, periods, year-by-year schedule
assets/js/state.js      shared settings, persisted across both pages
assets/js/overview.js   renders the period tables
assets/js/details.js    renders the asset cards and chart
scripts/check.mjs       pre-deploy validation
.github/workflows/deploy.yml
```

## CI

Every push to `main` runs three jobs; a pull request runs only the first.

**Validate** walks every asset against every variant, scenario, per-asset input extreme and horizon —
about 300,000 assertions in half a second. It checks that each line item is finite and non-negative,
carries a known category, and cites a source that exists in the registry; that each asset's inputs
default to legal values; that FX conversion round-trips losslessly; that a quarter really is a year
divided by four and each period table's rows sum to the total it prints; and that every element each
page's script writes into actually exists in that page's markup, with the two pages linking to each
other. It also asserts **scenario ordering**: the optimistic case must cost less than the realistic one,
which must cost less than the pessimistic one. That last check exists because it caught a real bug —
the R35's appreciation ranges were inverted, which made the pessimistic scenario come out cheapest.

**Deploy** publishes to GitHub Pages via `actions/deploy-pages`, uploading only `index.html`,
`details.html`, `assets/` and `.nojekyll`.

**Verify** then fetches the live URLs and confirms both pages and every asset file return 200 and the
markup still contains its entry points — because deploying successfully and rendering correctly are
different things.

To change an assumption, edit `data.js` — it is deliberately the only file with numbers in it. Ranges
are `{low, base, high}` where `low` is the optimistic case.

## Caveat

Not financial advice, not a quote, and not a substitute for calling an insurer. Four lines in
particular need real quotes before you act on them: Emeya insurance, GT-R tyre life, and AMG insurance
and servicing.
