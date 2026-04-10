#!/usr/bin/env node
/**
 * Headless performance benchmark runner for Angular Forms Showdown.
 *
 * Navigates to each form page using Playwright, clicks the "Add 1k / Update 1k"
 * benchmark button twice (once for add, once for update), captures console timing
 * output and heap memory snapshots, then writes the results to:
 *   src/app/data/benchmarks.ts
 *
 * Prerequisites:
 *   - A local dev server running at http://localhost:4200  (npm start)
 *   - Playwright browsers installed: npx playwright install chromium
 *
 * Usage:
 *   npm run benchmark
 *
 * Options (environment variables):
 *   BASE_URL    Dev server URL              (default: http://localhost:4200)
 *   RUNS        Number of repeated runs     (default: 3)
 */

import { chromium } from '@playwright/test';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_URL = process.env.BASE_URL ?? 'http://localhost:4200';
const RUNS = parseInt(process.env.RUNS ?? '3', 10);

const PAGES = [
  { key: 'template', url: `${BASE_URL}/template` },
  { key: 'reactive', url: `${BASE_URL}/reactive` },
  { key: 'signal',   url: `${BASE_URL}/signal` },
];

/** Selector for the benchmark toggle button on each form page */
const BENCHMARK_BTN_SELECTOR = '[data-testid="benchmark-btn"]';

/** Collect console messages that match the timing log pattern */
function parseTimingLog(msg) {
  const text = msg.text();
  const addMatch = text.match(/add 1k address time:\s*([\d.]+)/);
  if (addMatch) return { type: 'add', value: parseFloat(addMatch[1]) };
  const updateMatch = text.match(/update 1k address time:\s*([\d.]+)/);
  if (updateMatch) return { type: 'update', value: parseFloat(updateMatch[1]) };
  return null;
}

/** Return heap memory in MB (Chrome-only; falls back to 0 in other browsers) */
async function getHeapMB(page) {
  return page.evaluate(() => {
    const mem = performance.memory;
    return mem ? mem.usedJSHeapSize / 1024 / 1024 : 0;
  });
}

async function runBenchmarkOnPage(browser, url) {
  const page = await browser.newPage();

  const timings = { add: [], update: [] };

  page.on('console', (msg) => {
    const parsed = parseTimingLog(msg);
    if (parsed) timings[parsed.type].push(parsed.value);
  });

  await page.goto(url, { waitUntil: 'networkidle' });

  const memStart = await getHeapMB(page);

  // First click → "Add 1k addresses"
  const btn = page.locator(BENCHMARK_BTN_SELECTOR);
  await btn.click();
  // Wait for add timing log to appear
  await page.waitForFunction(
    () => document.querySelectorAll('[data-testid="benchmark-btn"]').length > 0,
  );
  // Small settle time for the log to flush
  await page.waitForTimeout(500);

  const memPeak = await getHeapMB(page);

  // Second click → "Update 1k addresses"
  await btn.click();
  await page.waitForTimeout(500);

  const memEnd = await getHeapMB(page);

  await page.close();

  return {
    addJs: timings.add[0] ?? 0,
    updateJs: timings.update[0] ?? 0,
    memStart,
    memPeak,
    memEnd,
  };
}

/**
 * Read existing INP values from benchmarks.ts so that a script run does not
 * zero them out.  Returns a map of { template, reactive, signal } → { add1kInp, update1kInp }.
 * Falls back to 0 if the file is missing or a value cannot be parsed.
 */
function readExistingInpValues(outPath) {
  const defaults = {
    template: { add1kInp: 0, update1kInp: 0 },
    reactive: { add1kInp: 0, update1kInp: 0 },
    signal:   { add1kInp: 0, update1kInp: 0 },
  };

  if (!existsSync(outPath)) return defaults;

  const src = readFileSync(outPath, 'utf8');

  // Extract the BENCHMARKS object literal and parse INP fields per form type.
  // Pattern: inside a "template:" / "reactive:" / "signal:" block, find
  // add1kInp: <number> and update1kInp: <number>.
  const sectionRe = /(template|reactive|signal)\s*:\s*\{([^}]+)\}/g;
  const inpRe = (field) => new RegExp(`${field}\\s*:\\s*([\\d.]+)`);

  let match;
  while ((match = sectionRe.exec(src)) !== null) {
    const key = match[1];
    const body = match[2];
    const addMatch = inpRe('add1kInp').exec(body);
    const updateMatch = inpRe('update1kInp').exec(body);
    if (addMatch)    defaults[key].add1kInp    = parseFloat(addMatch[1]);
    if (updateMatch) defaults[key].update1kInp = parseFloat(updateMatch[1]);
  }

  return defaults;
}

/** Arithmetic mean */
const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

/** Round to 2 decimal places */
const round2 = (n) => Math.round(n * 100) / 100;

async function benchmarkPage(browser, { key, url }, existingInp) {
  console.log(`\n  Benchmarking ${key} (${RUNS} runs)…`);

  const results = { addJs: [], updateJs: [], memStart: [], memPeak: [], memEnd: [] };

  for (let i = 0; i < RUNS; i++) {
    process.stdout.write(`    run ${i + 1}/${RUNS}… `);
    const r = await runBenchmarkOnPage(browser, url);
    results.addJs.push(r.addJs);
    results.updateJs.push(r.updateJs);
    results.memStart.push(r.memStart);
    results.memPeak.push(r.memPeak);
    results.memEnd.push(r.memEnd);
    console.log(`add=${round2(r.addJs)}ms  update=${round2(r.updateJs)}ms  peak=${round2(r.memPeak)}MB`);
  }

  // INP (user-visible latency) cannot be measured headlessly — preserve the
  // values already in benchmarks.ts so a script run doesn't zero them out.
  const add1kInp    = existingInp.add1kInp;
  const update1kInp = existingInp.update1kInp;
  if (add1kInp !== 0 || update1kInp !== 0) {
    console.log(`    INP preserved from existing file: add=${add1kInp}ms  update=${update1kInp}ms`);
  } else {
    console.log(`    INP: no existing values — set manually from Chrome DevTools recordings.`);
  }

  return {
    add1kJs: round2(mean(results.addJs)),
    update1kJs: round2(mean(results.updateJs)),
    add1kInp,
    update1kInp,
    memoryStart: round2(mean(results.memStart)),
    memoryPeak: round2(mean(results.memPeak)),
    memoryEnd: round2(mean(results.memEnd)),
  };
}

function formatTs(benchmarks) {
  const now = new Date().toISOString();
  return `/**
 * Performance benchmark results for the three Angular form approaches.
 *
 * Generated by: npm run benchmark
 * Source:       scripts/benchmark.mjs (Playwright headless runner)
 * Generated at: ${now}
 *
 * Runs averaged: ${RUNS}
 *
 * Note: add1kInp / update1kInp (user-visible latency) are not measurable
 * headlessly — set them manually from Chrome DevTools Performance recordings.
 */

export interface BenchmarkRun {
  /** JS execution time in ms measured via performance.now() */
  add1kJs: number;
  /** JS execution time in ms measured via performance.now() */
  update1kJs: number;
  /** User-visible INP equivalent in ms (set manually from DevTools) */
  add1kInp: number;
  /** User-visible INP equivalent in ms (set manually from DevTools) */
  update1kInp: number;
  /** Heap memory in MB before benchmark starts */
  memoryStart: number;
  /** Peak heap memory in MB during benchmark */
  memoryPeak: number;
  /** Heap memory in MB after benchmark completes */
  memoryEnd: number;
}

export interface Benchmarks {
  template: BenchmarkRun;
  reactive: BenchmarkRun;
  signal: BenchmarkRun;
}

/** Run \`npm run benchmark\` to regenerate. */
export const BENCHMARKS: Benchmarks = ${JSON.stringify(benchmarks, null, 2)
    .replace(/"([^"]+)":/g, '$1:')};
`;
}

async function main() {
  console.log(`Angular Forms Showdown — Performance Benchmark`);
  console.log(`Base URL : ${BASE_URL}`);
  console.log(`Runs     : ${RUNS}`);
  console.log(`\nMake sure "npm start" is running before proceeding.\n`);

  const browser = await chromium.launch({ args: ['--enable-precise-memory-info'] });

  const outPath = path.resolve(__dirname, '../src/app/data/benchmarks.ts');
  const existingInp = readExistingInpValues(outPath);

  const benchmarks = {};

  try {
    for (const page of PAGES) {
      benchmarks[page.key] = await benchmarkPage(browser, page, existingInp[page.key]);
    }
  } finally {
    await browser.close();
  }

  writeFileSync(outPath, formatTs(benchmarks), 'utf8');

  console.log(`\nResults written to: ${outPath}`);
  console.log('\nSummary:');
  for (const [key, data] of Object.entries(benchmarks)) {
    console.log(`  ${key.padEnd(10)} add=${data.add1kJs}ms  update=${data.update1kJs}ms  peak=${data.memoryPeak}MB`);
  }
  console.log(
    '\nNote: add1kInp / update1kInp must be filled in manually from Chrome DevTools recordings.',
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
