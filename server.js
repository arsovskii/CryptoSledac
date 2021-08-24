const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const ejs = require('ejs');

const CoinGecko = require('coingecko-api');
const CoinGeckoClient = new CoinGecko();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));

var cryptoCurrencies = [];
var getCryptoData = async() =>{
    
    CoinGecko.ORDER.MARKET_CAP_DESC;
    try{
        var podat = await CoinGeckoClient.coins.markets({
            per_page: 10,
        })
    }catch(e){
        console.error(e);
    }
    cryptoCurrencies = []
    podat.data.forEach(element => {
        cryptoCurrencies.push([element.name,element.id])
    });
    
}
getCryptoData();


app.get('/', (req, res) => {

    getCryptoData();
    res.render('index.ejs', {data: cryptoCurrencies});

  })

app.get('/topCoins', (req, res) =>{
    getCryptoData();

    res.render('topCoins.ejs')
})

app.get('/crypto',(req,res) =>{
    
    res.render('cryptoInfo.ejs');
})
app.use(function (req,res,next){
	res.status(404).render('error.ejs');
});




app.listen(PORT, () => {
  console.log(`CryptoSledac listening at ${PORT}`)
})
