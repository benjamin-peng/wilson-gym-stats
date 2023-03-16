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

const purgeOlderThanTwoWeek = () => {
  pool.query('DELETE FROM logs WHERE date < CURRENT_DATE - MAKE_INTERVAL(days => 14);')//now - 14
};

//launch puppeteer
const updateData = () => {
  puppeteer.launch({
    executablePath: '/opt/homebrew/bin/chromium'
  }).then(async function(browser) {
      const page = await browser.newPage();
      await page.goto('https://myrec.recreation.duke.edu/FacilityOccupancy');
      await page.waitForSelector('.occupancy-count');
      const element = await page.$('.occupancy-count');
      console.log("CRON");
      const occupancy = parseInt(await page.evaluate(el => el.innerText, element));
      //truncated to the nearest min
      pool.query(`INSERT INTO logs (count, date, time) VALUES (${occupancy}, CURRENT_DATE, DATE_TRUNC('minute', NOW())::time);`);
      await browser.close();
  });
  purgeOlderThanTwoWeek();
};

//returns the lowest occupancy time in interval
//start, end are two element arrays [day of week, time]
//time in format XX:XX
const bestTimeInInterval = (start, end) => { 

  const startDate = getLastDay(start[0]);
  const endDate = getLastDay(end[0]);

  const dateQuery = 'SELECT * FROM logs '
  + 'WHERE count = (SELECT MIN(count) FROM logs '
  + `WHERE time BETWEEN '${start[1]}'::time AND '${end[1]}'::time `
  + `AND date BETWEEN '${startDate}'::date AND '${endDate}'::date);`

  console.log(dateQuery);

  pool.query(dateQuery)
    .then((res) => console.log(res.rows));
};

//setInterval(updateData, 5000);

const job = new CronJob(
  '*/1 6-22 * * *', //every 30 min from 6am to 10pm
  updateData,
  null,
  true,
  'America/New_York'
);

//day = int: 0=sun, 1=mon, 2=tues, etc
//returns in yyyy-mm-dd string
const getLastDay = (day) => {
  const date = new Date();
  const currDay = date.getDay();

  /*
  if (currDay > day) {
    date.setDate(date.getDate() - date.getDay() + day);
    return date.getUTCFullYear() + '-' +
      ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
      ('00' + date.getUTCDate()).slice(-2);
  }
  */
  date.setDate(date.getDate() - date.getDay() - 8 + day);
  return date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2);
}
//console.log(getLastDay(0));
bestTimeInInterval([1, "06:00"], [7, "15:00"]);
/*
const date = new Date();
date.setDate(date.getDate() - date.getDay());
console.log(date.toString());
date.setDate(date.getDate() - 7);
console.log(date.toString());
*/
//bestTimeInInterval(Date.now(), Date.now());
job.start();
//purgeOlderThanWeek();

app.get("/", function (req, res) {
  res.status(200).json({
    name: "benjamin"
  });
});