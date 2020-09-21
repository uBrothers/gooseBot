const Upbit = require('./upbit_lib')

async function start() {
    const upbit = new Upbit('token1', 'token2')

    //console.log('-- market_all -------------------------------------------------')
    //let json = await upbit.market_all()
    //console.log(json.data)

    {
        //console.log('-- market_minute -------------------------------------------------')
        let {'success':success, 'message':message, 'data':data, 'remain_min':remain_min, 'remain_sec':remain_sec} = await upbit.market_minute('KRW-BTC', 1, '', 3);

        //console.log('remain_sec:',remain_sec);
        //console.log('remain_min:',remain_min);

        //console.log('-----account-----------');
        let {'data':account} = await upbit.accounts();
        for (var i = 0; i < account.length; i++) {
          var sum=parseInt(account[0].balance)+parseInt(account[i].locked);
          //console.log(account[i].currency+" 계좌 : "+sum);
          //console.log("주문 가능 : "+account[i].balance);
          //console.log("주문 대기 : "+account[i].locked);
          if (account[i].currency=="KRW") {
              //console.log("한화있음");
              var max=account[i].balance/data[0].trade_price;
              max = max*0.99949;
              max=Math.floor(max*10000)/10000;
              if (data[1].trade_price>=data[1].opening_price && data[2].trade_price>=data[2].opening_price) {
                if (data[0].trade_price>=data[1].trade_price && data[1].trade_price>=data[2].trade_price) {
                  //maker
                  upbit.order_bid('KRW-BTC',max,parseInt(data[0].trade_price)+2000);
                }
              }
          }else if (account[i].currency=="BTC") {
              if(parseInt(account[i].avg_buy_price)*0.995>parseInt(data[0].trade_price)){
                //console.log("-1퍼 이상 하락");
                //taker
                upbit.order_ask('KRW-BTC',account[i].balance,parseInt(data[0].trade_price)-2000);
              }else if (data[1].trade_price<=data[1].opening_price && data[2].trade_price<=data[2].opening_price) {
                if (data[0].trade_price<=data[1].trade_price && data[1].trade_price<=data[2].trade_price) {
                  if (parseInt(account[i].avg_buy_price)*1.0033<parseInt(data[0].trade_price)) {
                    //taker
                    upbit.order_ask('KRW-BTC',account[i].balance,parseInt(data[0].trade_price)-2000);
                  }
                }
              }
          }
        }
    }

    /*
    {
        console.log('-- order_chance -------------------------------------------------')
        let {'data':data} = await upbit.order_chance('KRW-BTC');
        console.log("KRW 계좌 : "+data.bid_account.balance);
        console.log("BTC 계좌 : "+data.ask_account.balance);
    }
    */

}

setInterval(start, 1000);
