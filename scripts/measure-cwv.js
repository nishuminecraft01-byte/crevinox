// Measure Core Web Vitals directly via headless Chrome DevTools Protocol
import { spawn } from 'node:child_process';
import http from 'node:http';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://localhost:4173/';
const DEBUG_PORT = 9222;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getJson(path) {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port: DEBUG_PORT, path }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Launching headless Chrome...');
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--headless=new',
    '--window-size=1280,800',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + process.env.TEMP + '\\chrome_perf_test_' + Date.now(),
    'about:blank'
  ], { stdio: 'ignore' });

  // Wait for Chrome to bind
  let connected = false;
  for (let i = 0; i < 20; i++) {
    await sleep(300);
    try {
      await getJson('/json/version');
      connected = true;
      break;
    } catch {}
  }

  if (!connected) {
    console.error('Could not connect to Chrome debugging port.');
    chrome.kill();
    process.exit(1);
  }

  console.log('Connected to Chrome DevTools Protocol.');
  const targets = await getJson('/json/list');
  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  const wsUrl = pageTarget.webSocketDebuggerUrl;

  const ws = new WebSocket(wsUrl);
  let msgId = 1;
  const pending = new Map();

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.id && pending.has(data.id)) {
      const { resolve, reject } = pending.get(data.id);
      pending.delete(data.id);
      if (data.error) reject(data.error);
      else resolve(data.result);
    }
  };

  await new Promise(r => ws.onopen = r);

  console.log('Enabling Page & Performance domains...');
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Performance.enable');

  // Inject CWV measurement script before page loads
  const cwvScript = `
    window.__cwv = {
      fcp: null,
      lcp: null,
      cls: 0,
      tbt: 0,
      nav: null,
      errors: []
    };

    window.addEventListener('error', (e) => {
      window.__cwv.errors.push(e.message || String(e));
    });

    // FCP & Paint
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          window.__cwv.fcp = entry.startTime;
        }
      }
    }).observe({ type: 'paint', buffered: true });

    // LCP
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        window.__cwv.lcp = {
          startTime: entry.startTime,
          size: entry.size,
          element: entry.element ? entry.element.tagName + (entry.element.className ? '.' + entry.element.className : '') : 'unknown'
        };
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // CLS
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__cwv.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // Long Tasks (for TBT estimation)
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        const blockingTime = entry.duration - 50;
        if (blockingTime > 0) {
          window.__cwv.tbt += blockingTime;
        }
      }
    }).observe({ type: 'longtask', buffered: true });
  `;

  await send('Page.addScriptToEvaluateOnNewDocument', { source: cwvScript });

  console.log('Navigating to', TARGET_URL, '...');
  await send('Page.navigate', { url: TARGET_URL });

  // Wait 4 seconds for full hydration, intro transition, and idle
  await sleep(4000);

  // Evaluate CWV results
  const evalResult = await send('Runtime.evaluate', {
    expression: `JSON.stringify({
      cwv: window.__cwv,
      paints: performance.getEntriesByType('paint'),
      lcpTimeline: performance.getEntriesByType('largest-contentful-paint'),
      navTiming: performance.getEntriesByType('navigation')[0],
      resources: performance.getEntriesByType('resource').map(r => ({
        name: r.name.split('/').pop(),
        transferSize: r.transferSize,
        duration: r.duration,
        type: r.initiatorType
      }))
    })`,
    returnByValue: true
  });

  const perfMetrics = await send('Performance.getMetrics');

  ws.close();
  chrome.kill();

  const data = JSON.parse(evalResult.result.value);
  console.log('\n=== REAL CHROME CORE WEB VITALS AUDIT ===');
  const fcpEntry = data.paints ? data.paints.find(p => p.name === 'first-contentful-paint') : null;
  const fcpMs = data.cwv.fcp || (fcpEntry ? fcpEntry.startTime : null);
  console.log('FCP (First Contentful Paint):', fcpMs ? `${fcpMs.toFixed(1)} ms` : 'N/A');
  const lcpEntry = (data.lcpTimeline && data.lcpTimeline.length) ? data.lcpTimeline[data.lcpTimeline.length - 1] : null;
  const lcpMs = data.cwv.lcp ? data.cwv.lcp.startTime : (lcpEntry ? lcpEntry.startTime : null);
  console.log('LCP (Largest Contentful Paint):', lcpMs ? `${lcpMs.toFixed(1)} ms (element: ${data.cwv.lcp ? data.cwv.lcp.element : 'detected'})` : 'N/A');
  console.log('CLS (Cumulative Layout Shift):', data.cwv.cls.toFixed(4));
  console.log('TBT (Total Blocking Time from LongTasks):', `${data.cwv.tbt.toFixed(1)} ms`);
  console.log('DOM Content Loaded:', `${data.navTiming.domContentLoadedEventEnd.toFixed(1)} ms`);
  console.log('Page Load Complete:', `${data.navTiming.loadEventEnd.toFixed(1)} ms`);
  console.log('Page JavaScript Errors:', data.cwv.errors.length === 0 ? 'None (0 errors)' : data.cwv.errors);

  const totalTransfer = data.resources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
  console.log('Total Transferred Resource Payload:', (totalTransfer / 1024).toFixed(1), 'KB');
  console.log('Total Resource Requests:', data.resources.length);

  console.log('\n=== CDP PERFORMANCE METRICS ===');
  for (const m of perfMetrics.metrics) {
    if (['Timestamp', 'AudioHandlers'].includes(m.name)) continue;
    if (['DomContentLoaded', 'NavigationStart', 'FirstMeaningfulPaint'].includes(m.name) || m.name.includes('Duration') || m.name.includes('Count')) {
      console.log(`- ${m.name}: ${m.value}`);
    }
  }
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
