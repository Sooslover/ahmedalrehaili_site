#!/usr/bin/env node
/**
 * Fetch Google Scholar metrics automatically using Puppeteer
 */

const fs = require('fs');
const https = require('https');

const SCHOLAR_ID = 'tMmhq2MAAAAJ';
const SCHOLAR_URL = `https://scholar.google.com/citations?user=${SCHOLAR_ID}&hl=en`;

// Try using simple HTTPS request with browser-like headers
function fetchWithHTTPS() {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Cache-Control': 'max-age=0'
      }
    };

    https.get(SCHOLAR_URL, options, (res) => {
      if (res.statusCode === 403) {
        reject(new Error('403 Forbidden - Google Scholar is blocking automated access'));
        return;
      }

      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseMetrics(html) {
  // Extract citation metrics from HTML
  const citationsMatch = html.match(/<td class="gsc_rsb_std">(\d+)<\/td>/);
  const allMetrics = html.match(/<td class="gsc_rsb_std">(\d+)<\/td>/g);

  if (!allMetrics || allMetrics.length < 3) {
    throw new Error('Could not parse metrics from HTML');
  }

  const numbers = allMetrics.map(m => parseInt(m.match(/\d+/)[0]));

  return {
    citations: numbers[0],
    h_index: numbers[1],
    i10_index: numbers[2]
  };
}

async function main() {
  console.log('Fetching Google Scholar data...');

  try {
    const html = await fetchWithHTTPS();
    const metrics = parseMetrics(html);

    // Save to metrics.json
    const outputPath = 'data/metrics.json';
    fs.writeFileSync(outputPath, JSON.stringify(metrics, null, 2));

    console.log('\n✓ Successfully updated metrics:');
    console.log(`  Citations: ${metrics.citations}`);
    console.log(`  h-index: ${metrics.h_index}`);
    console.log(`  i10-index: ${metrics.i10_index}`);
    console.log(`\nMetrics saved to ${outputPath}`);

    process.exit(0);
  } catch (error) {
    console.error('\n✗ Error:', error.message);
    console.error('\nGoogle Scholar blocks automated scraping.');
    console.error('Please update data/metrics.json manually with your current numbers.');
    process.exit(1);
  }
}

main();
