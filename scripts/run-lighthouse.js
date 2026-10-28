import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import lighthouse from 'lighthouse';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const TARGET_URL = 'http://localhost:4173/?audit=true';
const PORT = 9222;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function checkChromeReady() {
  return new Promise((resolve, reject) => {
    http.get({ host: '127.0.0.1', port: PORT, path: '/json/version' }, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', () => resolve(false));
  });
}

async function main() {
  console.log('1. Starting Headless Chrome for Lighthouse...');
  const userDataDir = process.env.TEMP + '\\lh_chrome_' + Date.now();
  const chrome = spawn(CHROME_PATH, [
    `--remote-debugging-port=${PORT}`,
    '--headless=new',
    '--enable-automation',
    '--window-size=1280,800',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${userDataDir}`,
    'about:blank'
  ], { stdio: 'ignore' });

  let ready = false;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    if (await checkChromeReady()) {
      ready = true;
      break;
    }
  }

  if (!ready) {
    console.error('Failed to connect to Chrome debugging port.');
    chrome.kill();
    process.exit(1);
  }

  console.log('2. Running Lighthouse Mobile Audit against', TARGET_URL, '...');
  const options = {
    logLevel: 'error',
    output: 'json',
    port: PORT,
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'agentic-browsing'],
  };

  try {
    const runnerResult = await lighthouse(TARGET_URL, options);
    const reportJson = JSON.parse(runnerResult.report);
    fs.writeFileSync('./lighthouse-final-report.json', runnerResult.report);

    console.log('\n=============================================');
    console.log('         CREVINOX LIGHTHOUSE AUDIT RESULTS   ');
    console.log('=============================================');
    const cats = reportJson.categories;
    console.log(`Performance:      ${Math.round(cats.performance.score * 100)}/100`);
    console.log(`Accessibility:    ${Math.round(cats.accessibility.score * 100)}/100`);
    console.log(`Best Practices:   ${Math.round(cats['best-practices'].score * 100)}/100`);
    console.log(`SEO:              ${Math.round(cats.seo.score * 100)}/100`);
    if (cats['agentic-browsing']) {
      console.log(`Agentic Browsing: ${Math.round(cats['agentic-browsing'].score * 100)}/100`);
    }

    console.log('\n--- CORE METRICS ---');
    const audits = reportJson.audits;
    console.log(`FCP (First Contentful Paint):    ${audits['first-contentful-paint'].displayValue} (Score: ${Math.round(audits['first-contentful-paint'].score * 100)})`);
    console.log(`LCP (Largest Contentful Paint):  ${audits['largest-contentful-paint'].displayValue} (Score: ${Math.round(audits['largest-contentful-paint'].score * 100)})`);
    console.log(`TBT (Total Blocking Time):       ${audits['total-blocking-time'].displayValue} (Score: ${Math.round(audits['total-blocking-time'].score * 100)})`);
    console.log(`CLS (Cumulative Layout Shift):   ${audits['cumulative-layout-shift'].displayValue} (Score: ${Math.round(audits['cumulative-layout-shift'].score * 100)})`);
    console.log(`Speed Index:                     ${audits['speed-index'].displayValue} (Score: ${Math.round(audits['speed-index'].score * 100)})`);

    console.log('\n--- DIAGNOSTICS & AUDIT HIGHLIGHTS ---');
    console.log('Render Blocking Resources:', audits['render-blocking-resources']?.displayValue || 'None');
    console.log('Unsized Images:', audits['unsized-images']?.score === 1 ? 'Passed (All sized)' : 'Needs attention');
    console.log('Modern Image Formats:', audits['modern-image-formats']?.score === 1 ? 'Passed' : audits['modern-image-formats']?.displayValue || 'N/A');
    console.log('Layout Shift Elements:', audits['layout-shift-elements']?.details?.items?.length || 0, 'elements causing shift');

    // Check agent accessibility / llms.txt if present in audits
    for (const key of Object.keys(audits)) {
      if (key.includes('llm') || key.includes('agent') || audits[key].title?.toLowerCase().includes('llms.txt')) {
        console.log(`LLMs.txt Audit [${key}]: ${audits[key].score} - ${audits[key].displayValue || audits[key].title}`);
      }
    }

  } catch (err) {
    console.error('Lighthouse audit error:', err);
  } finally {
    chrome.kill();
  }
}

main().catch(console.error);
