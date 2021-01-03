const Upbit = require('./upbit_lib');
const math = require('mathjs');
var mongojs = require('mongojs');
var trade = mongojs('goose',['save']);
var balance = mongojs('goose',['check']);
var moment = require('moment'); require('moment-timezone'); moment.tz.setDefault("Asia/Seoul");
async function start() {
  var time = moment().format('YYYY-MM-DD HH:mm:ss');
  var utc = moment().utc().format('YYYY-MM-DD HH:mm:ss');
  var num_before=100;
  const upbit = new Upbit('token1', 'token2');
  let {'success':success, 'message':message, 'data':data, 'remain_min':remain_min, 'remain_sec':remain_sec} = await upbit.market_minute('KRW-BTC', 1, '', num_before);
  let {'data':account} = await upbit.accounts();
  var money=0;
  for (var i = 0; i < account.length; i++) {
    if (account[i].currency=="KRW") {
      money+=Math.floor(account[i].balance);
    }else if (account[i].currency=="BTC") {
      money+=account[i].balance*data[0].trade_price;
    }
  }
  balance.check.findOne({},function(err, bal){
    if(err) return res.json({success:false, message:err});
    if(bal){
      balance.check.update({}, {$set: {balance:Math.floor(money)}}, { multi: true });
    }else {
      balance.check.insert({balance:Math.floor(money)});
    }
  });


//market_all
    //let json = await upbit.market_all();
    //console.log(json.data);
//30일 선
        var line30;
        line30=math.mean([data[0].trade_price,data[1].trade_price,data[2].trade_price,data[3].trade_price,data[4].trade_price,data[5].trade_price,data[6].trade_price,data[7].trade_price,data[8].trade_price,data[9].trade_price,data[10].trade_price,data[11].trade_price,data[12].trade_price,data[13].trade_price,data[14].trade_price,data[15].trade_price,data[16].trade_price,data[17].trade_price,data[18].trade_price,data[19].trade_price,data[20].trade_price,data[21].trade_price,data[22].trade_price,data[23].trade_price,data[24].trade_price,data[25].trade_price,data[26].trade_price,data[27].trade_price,data[28].trade_price,data[29].trade_price]);
//볼린저밴드
        var bollinger0, bollinger_std0, bollinger_up0, bollinger_down0;
        bollinger_std0=math.std([data[0].trade_price,data[1].trade_price,data[2].trade_price,data[3].trade_price,data[4].trade_price,data[5].trade_price,data[6].trade_price,data[7].trade_price,data[8].trade_price,data[9].trade_price,data[10].trade_price,data[11].trade_price,data[12].trade_price,data[13].trade_price,data[14].trade_price,data[15].trade_price,data[16].trade_price,data[17].trade_price,data[18].trade_price,data[19].trade_price],'uncorrected');
        bollinger0=math.mean([data[0].trade_price,data[1].trade_price,data[2].trade_price,data[3].trade_price,data[4].trade_price,data[5].trade_price,data[6].trade_price,data[7].trade_price,data[8].trade_price,data[9].trade_price,data[10].trade_price,data[11].trade_price,data[12].trade_price,data[13].trade_price,data[14].trade_price,data[15].trade_price,data[16].trade_price,data[17].trade_price,data[18].trade_price,data[19].trade_price]);
        bollinger_up0=bollinger0+2*bollinger_std0;
        bollinger_down0=bollinger0-2*bollinger_std0;
//1분전 볼린저밴드
        var bollinger1, bollinger_std1, bollinger_up1, bollinger_down1;
        bollinger_std1=math.std([data[1].trade_price,data[2].trade_price,data[3].trade_price,data[4].trade_price,data[5].trade_price,data[6].trade_price,data[7].trade_price,data[8].trade_price,data[9].trade_price,data[10].trade_price,data[11].trade_price,data[12].trade_price,data[13].trade_price,data[14].trade_price,data[15].trade_price,data[16].trade_price,data[17].trade_price,data[18].trade_price,data[19].trade_price,data[20].trade_price],'uncorrected');
        bollinger1=math.mean([data[1].trade_price,data[2].trade_price,data[3].trade_price,data[4].trade_price,data[5].trade_price,data[6].trade_price,data[7].trade_price,data[8].trade_price,data[9].trade_price,data[10].trade_price,data[11].trade_price,data[12].trade_price,data[13].trade_price,data[14].trade_price,data[15].trade_price,data[16].trade_price,data[17].trade_price,data[18].trade_price,data[19].trade_price,data[20].trade_price]);
        bollinger_up1=bollinger1+2*bollinger_std1;
        bollinger_down1=bollinger1-2*bollinger_std1;
//RSI
        var rsi_up=0, rsi_down=0, rsi0;
        for (var n = num_before-1; n > 0; n--) {
          if(n>num_before-14){
            if(data[n-1].trade_price-data[n].trade_price>0){
              rsi_up+=(data[n-1].trade_price-data[n].trade_price)/14;
            }else{
              rsi_down-=(data[n-1].trade_price-data[n].trade_price)/14;
            }
          }else {
            if(data[n-1].trade_price-data[n].trade_price>0){
              rsi_up=(rsi_up*13+(data[n-1].trade_price-data[n].trade_price))/14;
              rsi_down=rsi_down*13/14;
            }else{
              rsi_down=(rsi_down*13-(data[n-1].trade_price-data[n].trade_price))/14;
              rsi_up=rsi_up*13/14;
            }
          }
        }
        rsi0=rsi_up*100/(rsi_up+rsi_down);
//1분전 RSI
        var rsi1;
        rsi_up=0; rsi_down=0;
        for (var n = num_before-1; n > 1; n--) {
          if(n>num_before-14){
            if(data[n-1].trade_price-data[n].trade_price>0){
              rsi_up+=(data[n-1].trade_price-data[n].trade_price)/14;
            }else{
              rsi_down-=(data[n-1].trade_price-data[n].trade_price)/14;
            }
          }else {
            if(data[n-1].trade_price-data[n].trade_price>0){
              rsi_up=(rsi_up*13+(data[n-1].trade_price-data[n].trade_price))/14;
              rsi_down=rsi_down*13/14;
            }else{
              rsi_down=(rsi_down*13-(data[n-1].trade_price-data[n].trade_price))/14;
              rsi_up=rsi_up*13/14;
            }
          }
        }
        rsi1=rsi_up*100/(rsi_up+rsi_down);
//CCI
        var cci0, m=0, x14=0;
        for(var i = 0; i < 14; i++){
          data[i].M = (data[i].trade_price+data[i].high_price+data[i].low_price)/3;
          m += data[i].M;
        }
        m = m/14;
        for(var i = 0; i < 14; i++){
          if(data[i].M<m){
            data[i].d = m-data[i].M;
          }else{
           data[i].d = data[i].M-m;
          }
          x14 += data[i].d;
        }
        x14 = x14/14;
        cci0 = (data[0].M-m)/(x14*0.015);
//1분전 CCI
        var cci1;
        m=0; x14=0;
        for(var i = 1; i < 15; i++){
          data[i].M = (data[i].trade_price+data[i].high_price+data[i].low_price)/3;
          m += data[i].M;
        }
        m = m/14;
        for(var i = 1; i < 15; i++){
          if(data[i].M<m){
            data[i].d = m-data[i].M;
          }else{
           data[i].d = data[i].M-m;
          }
          x14 += data[i].d;
        }
        x14 = x14/14;
        cci1 = (data[1].M-m)/(x14*0.015);
//2분전 CCI
        var cci2;
        m=0; x14=0;
        for(var i = 2; i < 16; i++){
          data[i].M = (data[i].trade_price+data[i].high_price+data[i].low_price)/3;
          m += data[i].M;
        }
        m = m/14;
        for(var i = 2; i < 16; i++){
          if(data[i].M<m){
            data[i].d =m-data[i].M;
          }else{
            data[i].d=data[i].M-m;
          }
          x14 += data[i].d;
        }
        x14 = x14/14;
        cci2 = (data[2].M-m)/(x14*0.015);
//maker & taker logic
        for (var i = 0; i < account.length; i++) {
          if (account[i].currency=="KRW") {
            var max=Math.floor(account[i].balance*0.9995);
            if(rsi0<38 && cci1<-100 && cci2<-100){
              if(cci0>cci1 && cci0>-105){
                if(max>1000 && parseInt(data[1].high_price)<bollinger1 && parseInt(data[0].high_price)<bollinger0){
                  upbit.order_bid('KRW-BTC',max);
                  trade.save.insert({coin:"KRW-BTC", option:"maker", position:"저점매수", price:parseInt(data[0].trade_price)+1000, amount:max, time:time, utc:utc});
                }
              }
            }
		 /* else if (rsi0>58 && cci0>95) {
              if(cci1>cci2 && cci1>80){
                if(max>1000 && parseInt(data[1].low_price)>bollinger1 && parseInt(data[0].low_price)>bollinger0){
                  upbit.order_bid('KRW-BTC',max);
                  trade.save.insert({coin:"KRW-BTC", option:"maker", position:"추격매수", price:parseInt(data[0].trade_price)+1000, amount:max, time:time, utc:utc});
                }
              }
            }*/

          }else if (account[i].currency=="BTC") {
            if(rsi0>58 && cci1>100 && cci2>100){
              if(cci0<cci1 && cci0<105){
                if (account[i].balance>0 && parseInt(data[1].low_price)>bollinger1 && parseInt(data[0].low_price)>bollinger0) {
                  upbit.order_ask('KRW-BTC',account[i].balance);
                  trade.save.insert({coin:"KRW-BTC", option:"taker", position:"고점매도", price:parseInt(data[0].trade_price)-1000, amount:account[i].balance, time:time, utc:utc});
                }
              }
            }
            /* else if (rsi0<38 && cci0<-95) {
              if(cci1<cci2 && cci1>-100){
                if(account[i].balance>0 && parseInt(data[1].high_price)<bollinger1 && parseInt(data[0].high_price)<bollinger0){
                  upbit.order_ask('KRW-BTC',account[i].balance);
                  trade.save.insert({coin:"KRW-BTC", option:"taker", position:"하락매도", price:parseInt(data[0].trade_price)-1000, amount:account[i].balance, time:time, utc:utc});
                }
              }
            } */
            else if (parseInt(account[i].avg_buy_price)*0.995>parseInt(data[0].trade_price)) {
              if(account[i].balance>0){
                upbit.order_ask('KRW-BTC',account[i].balance);
                trade.save.insert({coin:"KRW-BTC", option:"taker", position:"0.5%손절", price:parseInt(data[0].trade_price)-1000, amount:account[i].balance, time:time, utc:utc});
              }
            }
          }
        }
}
setInterval(start, 1000);
