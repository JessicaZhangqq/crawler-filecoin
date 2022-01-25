/*
used for: get two filecoin addresses' balance from filescan
ceated on: 02 Nov 2021
Created by: Jessica Zhang
Description: run on utc 0:00 every day
*/
// get target data from website using crawler

const playwright = require('playwright');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const xlsx = require('xlsx')

const rule = new schedule.RecurrenceRule();
rule.hour = 20;
rule.minute = 00;



// var length = 1 ;
const addresses = ['f01238519','f01264125']
// addresses.forEach((address)=>{
  const job = schedule.scheduleJob(rule, function(){
    console.log('The answer to life, the universe, and everything!');
    (async () => {
      for (const browserType of [playwright.chromium]) {
        const browser = await browserType.launch({headless:true, slowMo:1000});
        const context = await browser.newContext();
        const page = await context.newPage();
        await page.goto('https://filscan.io/address/miner?address=f01238519');
        //get content of the page
        var contentHtml = await page.content()
        // load html content
        var $ = cheerio.load(contentHtml);
        //total balance
        const totalBalanceElement = $('div .num');
        const totalBalance = totalBalanceElement.text();
        const qualityPowerElement = $('div .subtitle');
        const qualityPowerLabel = qualityPowerElement.text();
        //four values 
        var fruits = [];
        var values = [];
  
        //get div element of balance-info
        $('span').each(function(i, elem) {
          fruits[i] = $(this).text();
        });
        const account = fruits[9];
        const availabe = fruits[10];
        const sectorDeposits = fruits[11];
        const preCommitDeposits = fruits[12];
        const lockedRewards = fruits[13];
        const qualityPower = fruits[14];
        // total all values
        $('div.value').each(function(i, elem) {
          values[i] = $(this).text();
        });
        const totalReward = values[4];
        const wb = xlsx.readFile('./filecoin.xlsx',{cellDates:true})
        const ws= wb.Sheets['filecoin']
        var data = xlsx.utils.sheet_to_json(ws)
        console.log('data on file now',data)
        const length = data.length
        console.log('length of the file',length)
        newRecord ={
          "account": account,
          "Date" : new Date(),
          "total Balance" : totalBalance,
          "sector Deposits": sectorDeposits,
          "availabe" : availabe,
          "pre Commit Deposits": preCommitDeposits,
          "locked Rewards" : lockedRewards,
          "quality Power" : qualityPower,
          "Total reward" : totalReward
        }
        data.push(newRecord)
        newLength = data.length;
        console.log('new lenght is',newLength)
        // Printing data
        console.log('new data',data)
        
        
        var newWB = xlsx.utils.book_new()
        var newWS = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(newWB,newWS,'filecoin')
  
        xlsx.writeFile(newWB,"filecoin.xlsx")
        console.log('data saved')
        await browser.close();
        // })
      }
    })();
    // length+=1
  });
// })

