const express = require("express");
const puppeteer = require('puppeteer');
const app = express();
const Pool = require('pg').Pool;
const PORT = 8000;
const CronJob = require('cron').CronJob;

const pool = new Pool({
  user: 'wilsongymstats',
  host: 'localhost',
  database: 'occupancy',
  password: 'password',
  port: 5432,
})

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));

app.use(express.json());

const purgeOlderThanWeek = () => {
  pool.query('DELETE FROM logs WHERE time < NOW() - MAKE_INTERVAL(days => 7);')//now - 7
};

//launch puppeteer
const updateData = () => {
  puppeteer.launch().then(async function(browser) {
      const page = await browser.newPage();
      await page.goto('https://myrec.recreation.duke.edu/FacilityOccupancy');
      await page.waitForSelector('.occupancy-count');
      const element = await page.$('.occupancy-count');
      const occupancy = parseInt(await page.evaluate(el => el.innerText, element));
      pool.query(`INSERT INTO logs (time, count) VALUES (NOW(), ${occupancy});`);
      await browser.close();
  });
  purgeOlderThanWeek();
};

//setInterval(updateData, 5000);

const job = new CronJob(
  '*/30 6-22 * * *', //every 30 min from 6am to 10pm
  updateData,
  null,
  true,
  'America/Los_Angeles'
);

job.start();

app.get("/", function (req, res) {
  res.status(200).json({
    name: "benjamin"
  });
});