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
  pool.query('DELETE FROM logs WHERE date < CURRENT_DATE - MAKE_INTERVAL(days => 7);')//now - 7
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
  purgeOlderThanWeek();
};

//returns the lowest occupancy time in interval
//start, end are two element arrays [day of week, time]
//time in format XX:XX
const bestTimeInInterval = (start, end) => { 

  pool.query('SELECT * '
  + 'FROM logs '
  + 'WHERE count = (SELECT MIN(count) FROM logs)'
  + `AND time BETWEEN '${start[1]}'::time AND '${end[1]}'::time;`
  + `AND date BETWEEN `)
    .then((res) => console.log(res.rows[0].time + " " + res.rows[0].count));
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

  if (currDay > day) {
    date.setDate(date.getDate() - date.getDay() + day);
    return date.getFullYear() + '-' + ;
  }
  date.setDate(date.getDate() - date.getDay() - 7 + day);
  return date.toString();
}
console.log(getLastDay(0));
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