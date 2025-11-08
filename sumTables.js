// sumTables.js
import playwright from "playwright";

const urls = [
  "https://sanand0.github.io/tdsdata/js_table/?seed=27",
  "https://sanand0.github.io/tdsdata/js_table/?seed=28",
  "https://sanand0.github.io/tdsdata/js_table/?seed=29",
  "https://sanand0.github.io/tdsdata/js_table/?seed=30",
  "https://sanand0.github.io/tdsdata/js_table/?seed=31",
  "https://sanand0.github.io/tdsdata/js_table/?seed=32",
  "https://sanand0.github.io/tdsdata/js_table/?seed=33",
  "https://sanand0.github.io/tdsdata/js_table/?seed=34",
  "https://sanand0.github.io/tdsdata/js_table/?seed=35",
  "https://sanand0.github.io/tdsdata/js_table/?seed=36"
];

(async () => {
  const browser = await playwright.chromium.launch({ args: ["--no-sandbox"] });
  const context = await browser.newContext();
  const page = await context.newPage();

  let grandTotal = 0;

  for (const url of urls) {
    console.log(`\nVisiting: ${url}`);
    try {
      await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });

      const pageTables = await page.$$eval("table", tables => tables.map(t => t.innerText || ""));

      if (pageTables.length === 0) {
        console.log("  No <table> elements found on page.");
      }

      let pageTotal = 0;
      for (const [idx, txt] of pageTables.entries()) {
        const parsed = (txt.match(/-?\d{1,3}(?:,\d{3})*(?:\.\d+)?|-?\d+(?:\.\d+)?/g) || []);
        const numbers = parsed.map(s => parseFloat(s.replace(/,/g, ""))).filter(Number.isFinite);
        const tableSum = numbers.reduce((a,b) => a + b, 0);
        console.log(`  Table ${idx+1}: found ${numbers.length} numbers, table sum = ${tableSum}`);
        pageTotal += tableSum;
      }

      console.log(`  Page total for ${url}: ${pageTotal}`);
      grandTotal += pageTotal;
    } catch (err) {
      console.error(`  Error scraping ${url}: ${err.message}`);
    }
  }

  console.log(`\n=== GRAND TOTAL (all pages) ===`);
  console.log(grandTotal);

  await browser.close();
  process.exit(0);
})();
