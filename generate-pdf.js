const puppeteer = require("puppeteer");
const Path = require("path");

function pathToFileURL(path) {
  let pathName = path.replace(/\\/g, "/");
  // Windows drive letter must be prefixed with a slash.
  if (!pathName.startsWith("/")) pathName = "/" + pathName;
  return "file://" + pathName;
}

(async () => {

	const browser = await puppeteer.launch({
		args: ['--headless', '--disable-gpu', '--full-memory-crash-report', '--unlimited-storage',
					 '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
	});

  const page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 3 });
  await page.goto(pathToFileURL(Path.join(__dirname, "html/chart.html")), {
    waitUntil: ["load", "networkidle0"],
  });

  await page.pdf({
    path: "./headers.pdf",
    printBackground: true,
    landscape: true,
    displayHeaderFooter: true,
    headerTemplate: `
        <span style="font-size: 12px;">
            This is a custom PDF for
            <span class="title"></span> (<span class="url"></span>)
        </span>
        `,
    footerTemplate: `
        <span style="font-size: 12px;">
            Generated on: <span class="date"></span><br/>
            Pages <span class="pageNumber"></span> of <span class="totalPages"></span>
        </span>`,
    margin: {
      top: "110px",
      bottom: "100px",
    },
  });
  await browser.close();
})();
