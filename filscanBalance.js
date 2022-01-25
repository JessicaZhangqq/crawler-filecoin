/*
used for: get all filecoin addresses' balance from filescan
ceated on: Jan 25 2022
Created by: Jessica Zhang
Description: run on utc 0:00 every day
*/

const playwright = require('playwright');
const cheerio = require('cheerio');
const schedule = require('node-schedule');
const xlsx = require('xlsx');
const { add } = require('cheerio/lib/api/traversing');

const rule = new schedule.RecurrenceRule();
rule.hour = 14;
rule.minute = 32;
// var length = 1 ;
const addresses = ['f092228',
'f0130884',
'f0112667',
'f0155050',
'f0402661',
'f0672951',
'f01602479',
'f01606675',
'f01606849',
'f01641612',
'f01238519',
'f01264125',
'f01466173',
'f01372912',
'f01479781',
'f1livyzkvxnyjiwnohoknroahl2xijofeijh2ccea',
'f1yxsl2ogifprlbh5jxegetrvjc2lwtv6kkftzxaq',
'f14sqo6zmuevnxo2xw3iznlik5jxmkazaqt2s3j2y',
'f3r36y4ygdk7nmipvbrwfz3pq6vansyk4lr2v35hfm34xggthsdplc3autj246u3gpitisd2beb4as3ieyo4pq',
'f3rdbjmn5doznz2uuaqphfuu6bwft57tdevqw5m34s5dnrxy6g6s2yrxqqbhiltoanqfts6huldlzvk25tqama',
'f3skrfvc35dc7yjk3gldqevlebtkn4plbs7phveb4lupc6kabx4srnvmb3yaz3dxae6ulmqk2nmnkvj2nyf2za',
'f3qi3bqtmexye7sdsvvdlhw4jw56whfdswxjkhwtcpofe34iasqbh4tqtihxajqx3xsshqbszgoxj2ojgac2vq',
'f1x2orbp3a2qo4lffppgrb7suzriggrjq5tcs3ymq',
'f1bmrynnveocp6p5or6ud4f4vjz234gw23ku5a3cy',
'f01189138',
'f2qd2oedpjbw2zzikht52xl2aqiznf7xc5wrokvwy',
'f2qjjarrkvvjyggxqqy4pavjgk7ngofqhynrrf2nq',
'f2zohgra2hzwl3lfxji3mv2sxv3gye2exrx7jppvy',
'f01335671',
'f3qagm3ih4a3rgxxjxdyrtyk2qc72sv24klynohupdaejtv7wdyjk6jc75epnnv3qh3d6zzcmfhndtotwphr4a',
'f3wio472p3zvrpnmjerhhy7kqmqtb6lvzuskvadbaaw3l4neabozyztc4cej6lpmo4x6sx73dddbawc3pe2nca',
'f3sssxrtux3vrhp5c4cs3437lpryvbnwiyviwkdrxiiaastnznotaylblql4crpzp3quwpwtdfjzev5t7agcra',
'f3s4r2vsyzoolg3znoavol6p5od5lw6sgl6ijvoygmk4xrwkyca2hcilub7naumstmawspcwn3rxtc6wrxqdqa',
'f3urnjmgbtmpdirfw6z3ctpwcs4qk3gyn5rfw5desmd3jwbsq655i73ba4x2sk22no3q32lz6lgw7anvvko3bq',
'f3xf4cdhnxpcis2t4mgivi3ti2iyvydrir6cxeigahppxj4e475b4aaeuws3mupaxmwaali3ciz5wzq33vvrda',
'f3u2frya4upurpa6ov4rrkptyoaywjcadbrds4np5doi64fmg4jxmccarxgwkjr4akl6p664hvtj6nvicg33pq',
'f3ua4rz2pdgor2ztv756lrz64xhgovmxkg5erzxgdgczxaarob4hheluyhzkif637f2jsfsh4pdeuy3tim3qka',
'f3qxlnocqg7yiwwxvqhnywia37yzwxrv5srcfafken4nwmnnmercjmyv65ospfvoedcrq3cu5ejeca22nfzhaq',
'f3ta6m5o3u5xkn67y236zfruhti5xk5c6em3fxnta5wnwk6mptnulwjedlbuigh7hbtovwxf4jj47hrlmznyma',
'f3va37ati2zdnwf4j55e7xwlzisrl3biuxho4xpoo2wbxolhjhbpikjvhvb3i23fplctqy5inw4zi225f6rbza',
'f3v6v2bew2tnvnlj7n4gmig4ldwnrb7wi4s33dbzspth7uryhbleswxuerlo25fq7an3yl6dpltppe77jutaza',
'f3s4otir3hgq6fdbd343usawhh7yay6tzb2bermgmjg35e6fbnxswu47dcaa2x44tr7pkwpvy2d7bzzdvwgsgq',
'f3rp7d3tp23leia6fx6rq5net5xe5qsumgeattmcnpye4d5nlk2t7ikee3fpwjhkdg2tctr7tqxi6e6mbqudsq',
'f3sfgekq462uzidxk72zd5x225cv2ukqmo2p2f7wstyoljq5iena5v7pmn3uqzbaddipbeb6yhsko4g7jbyroq',
'f3tb7jirgn5qxjhwsqzmlkh6eu3q2t56gnlnsn34k7r7qgml4uxyo37soqvjvnwq3uvukniecnml6ktv5be5aq',
'f3qolf55rtaejclw4slcvxefq5dlpd4wmwzobn5kpji5qezl5xkshr7qujixyniz7qggm4r745yv7judkasxsq',
'f3rjntcvi5kidm4nk3eolvdnozahykeqlk74ip2jnxhk3xow2w3b3vqmpofcgethnr32zwqts2pq3cdcsb7e4q',
'f3tdngwf36id7zmtnjxpwxqgohfvi5d3dzljhyrd2uz6ws6awkbbrwutqr6enumxkqtafcy53ymuyfteixfqaa',
'f3r2smu4icyge3bmbgbrajccgzcqinr362es5uylyi25iecnr4r652a53si3dwgs7ewl3ptkif6lof4nzlr4qq',
'f3vvzixpuajbmdjlemfgpcrlprhxcjjisyjp2sk24dxbnxeno6myfnicjjhs65wo6f3ljqd5n7hjjwtg6fy4fq',
'f3qln4t7f6m7xfmvctq565hf5n4drnykxwwm7snqjp5irz33pnumwm7ksqi4g52fqy5a7it645st3tf3hfapha',
'f3xd3lnxr4gh4dlrtrz7xgydurmit7a22luadw2lsn3mn7thcfjirvcnv7ocj73dc4zyd75qk2udi6ngr7dyxq',
'f3r7zwprrxqv77wdl3w2sre6a2htxehc5raex4es7mwggkqkrhtrpm2u2ktuu5t43hd2gqaonn5hq2ct46rh5a',
'f3uhhz5dbquzdo5mrswuzcmnmvipu56u3a6m5tswksnadzsqz7y5bds2x4gnucqccm2ju6phk6wudruw6zjflq',
'f3r4yxsbpaevaj4xpsey3vixtjgg7gcbtsc66opk6gh4i44gg4lfsnohpft34st2si3oxo7ld72gehclnak7eq',
'f3sxjuao74whiwmcnd7ad7hltkrbquzu7tp3rjqwlqa5mpngyvdsvo4x4g5hx5zl6xnvvoitewpwboagkacdmq',
'f3vrvpai2ebi32hmjs56ovaqmpbkn7up3lf3e7dzm2qlq6txkxbe6ujl4tyrnpeaqu2y3g672dsqr6qfjnnysq',
'f3vxjm2tjmhsqrvzgvlwnzrii5rscwyhn4uty6pehk7oyyqwxwm33wyabszqw4woovbk4gf7q3nwyt3q6umq2a',
'f3ss2626xwbftlxcnhhq5pqdqqpz5udmex7hgn67qic7sqmo5l24ggmzhzzdfxkgplkjjf2nwh3g7lf5x55zia',
'f3q6igcc2rqkxgpqxtqszbk3r3hx3m2cdfsxfa7caabztc6hbx4tzupo6wwa4njk2y64t2hcbylfsxa63yjt4q',
'f3thnzbbmdf5xyotnoeul54jnv57r7qazoenc2okkeflwju5ixkqid26peksvw2msoxjkn5vnthgthnhsoxvpq',
'f3udhjgzordbmxgg7mcaolkfi64zblr3uw736nqu2y6agkh2ebtg67q4qc2mg44wt6z7rqdooc6exmzf3u3uyq',
'f3wr24vqgvrizbitmnhqsua54yuuubrp7q4elmfn43yiinl5ipssn5fgcsqulrer4khzvd22ttvlxevynry6ka',
'f3vvfpxjai7p3ds43qzeu7u6ihm63ry2sqatjyfoanskqy5p3ioaz3ulpl5gbf4jp27ppehl4jatrz5lcgjf7a',
'f3vzi4sqizrwvwhzvbbbr3k2rvhwlzvoillmzomx6ta2nz2mxkndzrvbsizm456sc544ile4yiuhiw5jirvmba',
'f3w5m4funfxmr6igos3dwbatsneg34bhxzgx5inqnhojlx5j2i4u42kfdrdbufklgngk3kokupictckhkdkt2a',
'f3xe5xlzpg6kqtdyrxvfqpam3dksarhct23q7cczsn7wwm4np4ghg556o6ye3p3nlj32efhcmr2qmv4y5iqliq',
'f3wasdjh3a7v6e5jj4nbuam5qpta6c4fonanu43j44kkjflrwheno4ivuja5l33sf3ydi63wviiguihdjki6gq',
'f3v4l4bobfan5ne3qbrnfomusfojdwo477okyvxwbi5qdo33pzugtctvjmczuhpmc5qd37cv4vt63xtvqyywfq',
'f3qe7phesjdoohqkcrleqpwsrkqvuwtmim77uespztqnbtvenq5aybgjli3zn7gfnheiptft2tmlwueiynzlbq',
'f3wulvjwjw2uanmbtqwplru7j2wpg5kg2nbeq5lgtu4a4msedtafvzl7ke43dzz6dphe2dtts7plwu3bgm4qqq',
'f3sl5hr4eccgbyojajf25zhpuz4v5jfjbcv5n44zdaq3pqdspngqkhrbqdtpv3iq5a25wtk5l4e6guomqap2uq',
'f3vmedrfibzpbaczhbw2wv5f365ufrxsuco3xtdhw6kegpe72cha2pq5nj7a2nyjpwxdpqrg7yyxygdksoqmta',
'f3wwz4e27vx6e24y2bh2lzasvsw2d6fv4lbi3zsdr72gsndtucfy72pz3dpatri4heovvt3xh7xl3w6yqmco7q',
'f3ue6jwqmpjxve3drlxdm5t6gtnewyujjhi76d324qi6dr2hmvi43uooyq2lbbe3tqaw5dmkeuucl3q6p6ln6a',
'f3wo6xfrkjmzgddxzmrwwr7k7l4xht4khbqt2q3gfuw5y7knpd27bcoje2zqyupjgizjkaullteq6bmrusrzua',
'f3ultton3lkv67n6aijq64hcoza362rkif5nrbh44kexm7gjebzabovevjqzxf5bisqgh63s5oq6hkb44l3cyq',
'f3rfuhdclpqomogpmookmvw2ihbptwemty2llrbgokn5l2ly4tzl552zcgj75cyuha6lilwi554tdb7okn6awq',
'f3tb5dq22nginq6lfxnxyznc6vxofe73qeio7q5hvimdexsfhvsexsbkl3d2gaij6udi6vdc7poa3impojhpma',
'f3qojncgvvcobibidmhs4c2bbmcjl3tcpwlxhf4334jai2mrxrxb3vh4bsqjvab5g3jaorris3kmxlphwc3ftq',
'f3vqcmfxjgl56g7rkbafjfr5vqxhpfgyow7b2litnvm7j6crkp22obicvrbb7x7ya7qdparetchabewdq2ncmq',
'f3qdizy2qyfdnlyqtxhnsd7fiqfworulnfa2hkb6oshd6nusoogrk7otw7xi4gjqbyu4u77ojx2inspyvpwovq',
'f3q6dnekjxzpf7mvtwsljrghpfagefajlahmjwrl4mivn6yu2t6sitqek5s66ayued7nkpljnqwj6s66xw67vq',
'f3qakz5gancba5m3ak3beykca5x5vzhgibaq2teatt4vsyag4lwo3pqkrwdgedbyiovtm7dlrtihtybha5te5q',
'f3uprkfjrs72foz54mq2lzgelvxntpei5vzvknag7ppljev4u5nbe643qo5jwlgb3vxerg5475ssgx4vykrroq',
'f3uqshbzcorkuwjacgqxdlzz5wcbztj3aujy6n3olak5wj2tv6daffztebqelulc7e56sbkcaazqnuvrzivpzq',
'f3wawf3dgkoic4fn54avywljgjib4njamyn7mt5uu7yf4ffvebj3ta4qpz2qo7qokhcm5dznfmbv64vr5qvjya',
'f3wb3yi47g52z4w7s44qzoaj35urz4erwsktp6azamz7izjvlgjgyynilaaxepw2jp2glzrfp5oxa6ge4zckmq',
'f3vgdka3dcodiwlgq4ytfhj6cj7fu7zhye76jduxxovhxxocpxkl3dmctnishp6irapsiaf7n4qf4lmawpnmta',
'f3wqvcfaof4iag6tecv5mi6h4wjj7macux6lxtvbp22bhydjdgt6bum47pyuv2jmwuhpwc26fq5kln33wjjjda',
'f3xfo2muulazpwzu6ae3szz5dppyza5phg55dbyiaht4wxbbxe7c72iuea2kqloj6ux5d37zotar3qcre7cbha',
'f3sqnmdy4i4nb4xgblergtls45hyuegnllltvlftphqj4wsgjdpatmxdmczmjgvyo2toswr3lkz33hiztcmr3q',
'f3uls6elfv6emoqo74kwxuyid4hlf54qlb2m7qi7o5mcxv47tbbveotwqiz2l36g5xerbmcskad4adxdyqc7hq',
'f3w5acabi4aalimr7stt7dm2agzulr7vrupog337ygugxxq64ol3ow7xpj523vvp443y5fcvkusghf5kg2aenq']
   
 function addRecord(contentHtml,dataList,address){
  var $ = cheerio.load(contentHtml);    
  const totalBalanceElement = $('div .num');
  var totalBalance = totalBalanceElement.text();
  var newtotalBalance= totalBalance.trim()
  var location = newtotalBalance.indexOf('F')
  console.log(location)
  newtotalBalance= newtotalBalance.substring( 0,location)

  const qualityPowerElement = $('div .subtitle');
  const qualityPowerLabel = qualityPowerElement.text();
  //four values 
  var fruits = [];
  var values = [];

  //get div element of balance-info
  $('span').each(function(i, elem) {
    fruits[i] = $(this).text();
  });
  var account = fruits[9];
  var newAccount = account.substring(13,23);

  var availabe = fruits[10];
  location = availabe.indexOf('F')
  availabe = availabe.substring(5,location)

  var sectorDeposits = fruits[11];
  location = sectorDeposits.indexOf('F')
  sectorDeposits= sectorDeposits.substring(6,location)

  var preCommitDeposits = fruits[12];
  location = preCommitDeposits.indexOf('F')
  preCommitDeposits = preCommitDeposits.substring(5,location)

  var lockedRewards = fruits[13];
  location = lockedRewards.indexOf('F')
  lockedRewards=lockedRewards.substring(6,location)

  var qualityPower = fruits[14];
  location = qualityPower.indexOf('P')
  qualityPower=qualityPower.substring(0,location)

  // total all values
  $('div.value').each(function(i, elem) {
    values[i] = $(this).text();
  });
  var totalReward = values[4];
  location = totalReward.indexOf('F')
  totalReward= totalReward.substring(0,location)

  const wb = xlsx.readFile('./filecoin.xlsx',{cellDates:true})
  const ws= wb.Sheets['filecoin']
  var data = xlsx.utils.sheet_to_json(ws)
  console.log('data on file now',data)
  
  newRecord ={
    "account": address,
    "Date" : new Date(),
    "total Balance" : newtotalBalance,
    "sector Deposits": sectorDeposits,
    "availabe" : availabe,
    "pre Commit Deposits": preCommitDeposits,
    "locked Rewards" : lockedRewards,
    "quality Power" : qualityPower,
    "Total reward" : totalReward
  }
  dataList.push(newRecord)
  // Printing data
  console.log('the length of is new data',dataList.length)
}
//end of function addRecord

const job = schedule.scheduleJob(rule, function(){
    (async () => {
        const browser = await playwright['chromium'].launch({headless:false, slowMo:1000});
        const context = await browser.newContext();
        var page = await context.newPage();
        await page.goto('https://filscan.io/address/miner?address=f01606849');
        //get content of the page
        var contentHtml = await page.content()
        // load html content
        const wb = xlsx.readFile('./filecoin.xlsx',{cellDates:true})
        const ws= wb.Sheets['filecoin']
        var data = xlsx.utils.sheet_to_json(ws)
        addRecord(contentHtml,data,'f01606849')  

        for(var i =0; i<addresses.length; i++){
          console.log('inside the for loop, now is the ',i)
          await page.goto('https://filscan.io/address/miner?address='+addresses[i]);
          contentHtml = await page.content()
          addRecord(contentHtml,data,addresses[i])
        }//for
        var newWB = xlsx.utils.book_new()
        var newWS = xlsx.utils.json_to_sheet(data)
        xlsx.utils.book_append_sheet(newWB,newWS,'filecoin')
        //save to file
        xlsx.writeFile(newWB,"filecoin.xlsx")
        console.log('data saved')
        await browser.close();
    })(); //async
})//  schedule
    

