


var cryptoCurrencies = [];
var ctx = document.getElementById('ChartCanvas').getContext('2d');

const plugin = {
    id: 'custom_canvas_background_color',
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext('2d');
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = '#303030';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    },
   
  };

Chart.Legend.defaults.display = false;
Chart.defaults.scales.showLine = false;
var gradientFill = ctx.createLinearGradient(2000, 0, 100, 0);
gradientFill.addColorStop(0, " rgba(89,0,255,0.5)");
gradientFill.addColorStop(1, " rgba(89,0,255,0)");
var myChart = new Chart(ctx, {
    
    data: {
        labels: [],
        datasets: [{
            type: 'line',
            label: '',
            data: [],
            backgroundColor: '',
            fillColor:'white',
            borderColor: '',
            borderWidth: 2,
            pointRadius: 0,
            pointHitRadius: 40,
            fill: {
                target: 'origin',
                above: gradientFill,
               
            }
        },]
    },
   
    options: {
        responsive:true,
        
        legend:{
            display:false,
        },
        scales: {
            
           x:{
               ticks:{
                   display:true,
                   color:'#999999'
               },
               color:'white',
               
           },
          
          
        }
    },
    plugins:[plugin]

});
Chart.Legend.defaults.display = false;
Chart.defaults.scales.showLine = false;
Chart.defaults.plugins.legend = false;

var daysToShow = 1;
var dropDown = document.getElementById('dropDownSelector');
var active = 0;
var activeID = [];
var currentPrices = [];
var done = false;
var timeFrame = document.getElementById('timeSelect')


getData('bitcoin');
function getData(id){
    if(!done){
        done = true
  
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h`)
        .then(response => response.json())
        .then(responseData=>{
          
            let i = 0;
            responseData.forEach(element => {
                //let pr = element.current_price.toString();
                element.current_price = new Intl.NumberFormat('us-US',{style:'currency',currency: "USD"}).format(element.current_price)
                /*if(pr.indexOf('.') != -1){
                    pr = pr.slice(0,pr.indexOf('.')+3);
                }*/
                currentPrices.push(element.current_price)
                activeID.push(element.id)
                
                cryptoCurrencies.push(element.price_change_percentage_24h);
                let percent = document.createElement('span');
                let image = document.createElement('img');
                image.src = element.image
                image.classList.add('cryptoSmallImage');    
                
                percent.innerText = element.current_price + ' ' +element.price_change_percentage_24h.toFixed(2) + '% ' ;
                percent.classList.add('percent');
                
                let toAdd = document.getElementById(`${i}`)
                toAdd.addEventListener('click', () =>{
                    if(active != toAdd.id){
                        active = toAdd.id;
                       
                        //console.log(responseData[toAdd.id].image);
                        document.getElementById('selectedCrypto').innerText = responseData[toAdd.id].name
                        document.getElementById('dropdownImageSelected').src = responseData[toAdd.id].image;
                        
                        getData(responseData[toAdd.id].id);
                    }
                    
                    
                })
                toAdd.appendChild(image);
                if(element.price_change_percentage_24h >= 0){
                    percent.classList.add('positivePercent');
                    toAdd.classList.add('positiveLine');
                }else{
                    percent.classList.add('negativePercent');
                    
                    toAdd.classList.add('negativeLine');
                }
                
                toAdd.appendChild(percent);
               
                i++;
               
                if(element.name == "Bitcoin"){
                    
                    let bitPrice = document.createElement('div');
                    let pricePercent = document.createElement('span');
                    let bitElem = document.getElementById('bitcoinPrice')
                    bitPrice.innerHTML = `${element.current_price}`
                    pricePercent.innerText = `(${element.price_change_percentage_24h.toFixed(2)}%)`;
                    if(element.price_change_percentage_24h >= 0){
                        bitPrice.classList.add('positivePercent');
                        pricePercent.classList.add('positivePercent');
                    }else{
                        bitPrice.classList.add('negativePercent');
                        pricePercent.classList.add('negativePercent');
                    }
                    pricePercent.classList.add('smallText')
                    bitElem.appendChild(bitPrice);
                    
                    bitElem.appendChild(pricePercent);
                }
                if(element.name == "Ethereum"){
                    
                    let bitPrice = document.createElement('div');
                    let pricePercent = document.createElement('span');
                    let bitElem = document.getElementById('etherumPrice')
                    bitPrice.innerHTML = `${element.current_price}`
                    pricePercent.innerText = `(${element.price_change_percentage_24h.toFixed(2)}%)`;
                    if(element.price_change_percentage_24h >= 0){
                        bitPrice.classList.add('positivePercent');
                        pricePercent.classList.add('positivePercent');
                    }else{
                        bitPrice.classList.add('negativePercent');
                        pricePercent.classList.add('negativePercent');
                    }
                    pricePercent.classList.add('smallText')
                    bitElem.appendChild(bitPrice);
                    
                    bitElem.appendChild(pricePercent);
                }
            });
            document.getElementById('currentSelectedPrice').innerText = currentPrices[0] ;
        })
    
    fetch(`https://api.coingecko.com/api/v3/global`)
        .then(response => response.json())
        .then(responseData=>{
            //console.log(responseData.data.market_cap_change_percentage_24h_usd);
            if(responseData.data.market_cap_change_percentage_24h_usd < 0){
                document.getElementById('infoCard').classList.add('negativeMarket')

            }else{
                document.getElementById('infoCard').classList.add('positiveMarket')
            }
            document.getElementById('activeCrypto').innerText = responseData.data.active_cryptocurrencies;
            
        })
    }
    fetch(`https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${daysToShow}`)    
        .then(response => response.json())
        .then(responseData =>{
          
            
            let unixTime = 0;
            let cryptoArrayTime = []
            let cryptoArrayPrice = []
           
            let now = new Date().getDate();

            responseData.prices.forEach(element => {
                
                unixTime = element[0];
                var date = new Date(unixTime);
                var moments = moment(unixTime);
                
                
                if(now !== date.getDate()){
                    moments = moment(moments).format('DD.MM.YYYY HH:MM');
                    //console.log(moments,'v');
                    now = date.getDate()
                }else{
                    if(daysToShow === 1){
                        moments = moment(moments).format('HH:MM:SS')
                    }else{
                        moments = moment(moments).format('DD.MM HH:MM:SS');
                    }
                    
                
            }
                
               
                //moments = moment(moments).format('DD.MM.YYYY HH:MM:SS')
                
                cryptoArrayTime.push(moments);
                cryptoArrayPrice.push(element[1]);
                
            });
           //console.log(responseData,active );
        
            myChart.data.labels = cryptoArrayTime;
            let name = id.replace(/^\w/, (c) => c.toUpperCase());
            myChart.data.datasets[0].label = name;
            //console.log(name);
            myChart.data.datasets[0].data = cryptoArrayPrice
            
            //console.log(currentPrices,'bitno');
            document.getElementById('currentSelectedPrice').innerText = currentPrices[active] ;
            
            if(name === 'Bitcoin'){
                document.getElementById('chartCard').setAttribute("style", "background-color: rgba(255,255,0,0.7);")
                
                myChart.data.datasets[0].borderColor = 'yellow';
                myChart.data.datasets[0].backgroundColor = 'yellow'
                gradientFill = ctx.createLinearGradient(2000, 0, 100, 0);
                gradientFill.addColorStop(0, " rgba(255,255,0,0.5)");
                gradientFill.addColorStop(1, " rgba(255,255,0,0)");
                myChart.data.datasets[0].fill.above = gradientFill;

            }else if(name === "Ethereum"){
                document.getElementById('chartCard').setAttribute("style", "background-color: rgba(130, 47, 255, 0.5);")

                myChart.data.datasets[0].borderColor = 'rgba(138,146,178,1)';
                myChart.data.datasets[0].backgroundColor = 'rgba(138,146,178,1)';
                gradientFill = ctx.createLinearGradient(2000, 0, 100, 0);
                gradientFill.addColorStop(0, " rgba(100,0,255,0.5)");
                gradientFill.addColorStop(1, " rgba(100,0,255,0)");
                myChart.data.datasets[0].fill.above = gradientFill;
            }else{
                var randomColor1 = randomColor({
                    format: 'rgbArray',
                    luminosity: 'light'
                });
                
                //console.log(randomColor1);
                document.getElementById('chartCard').setAttribute(`style`, `background-color: rgba(${randomColor1[0]},${randomColor1[1]},${randomColor1[2]},1);`)
                myChart.data.datasets[0].borderColor = `rgba(${randomColor1[0]},${randomColor1[1]},${randomColor1[2]},1`;
                myChart.data.datasets[0].backgroundColor = `rgba(${randomColor1[0]},${randomColor1[1]},${randomColor1[2]},1`;
                gradientFill = ctx.createLinearGradient(2000, 0, 100, 0);
                gradientFill.addColorStop(0,`rgba(${randomColor1[0]},${randomColor1[1]},${randomColor1[2]},0.3`);
                gradientFill.addColorStop(1,`rgba(${randomColor1[0]},${randomColor1[1]},${randomColor1[2]},0`);
                myChart.data.datasets[0].fill.above = gradientFill;
            }

            myChart.update();
        })
            //if(cryptoCurrencies[0])
      //
      
        //labels = cryptoCurrencies;
        //myChart.update()
}

dropDown.addEventListener('click',() =>{
    if(dropDown.classList.contains('is-active')){
        dropDown.classList.remove('is-active');
    }else{
        dropDown.classList.add('is-active');
    }
    
})
timeFrame.addEventListener('click',() =>{
    if(timeFrame.classList.contains('is-active')){
        timeFrame.classList.remove('is-active');
    }else{
        timeFrame.classList.add('is-active');
    }
    
})
var timeButton = document.getElementById('timeFrameSelect');
document.getElementById('1den').addEventListener('click',() =>{
    if(daysToShow != 1){
        //console.log(activeID);
        daysToShow = 1;
        timeButton.innerText = '1 Ден'
        getData(activeID[active])
    }
    
})
document.getElementById('7den').addEventListener('click',() =>{
    if(daysToShow != 7){
        //console.log(activeID);
        daysToShow = 7;
        timeButton.innerText = '7 Дена'
        getData(activeID[active])
    }
    
})
document.getElementById('1mesec').addEventListener('click',() =>{
    if(daysToShow != 30){
        daysToShow = 30;
        timeButton.innerText = '1 Месец'
        getData(activeID[active])
    }
    
})
document.getElementById('6mesec').addEventListener('click',() =>{
    if(daysToShow != 180){
        daysToShow = 180;
        timeButton.innerText = '6 Месеци'
        getData(activeID[active])
    }
    
})
document.getElementById('1godina').addEventListener('click',() =>{
    if(daysToShow != 365){
        daysToShow = 365;
        timeButton.innerText = '1 Година'
        getData(activeID[active])
    }
    
})
document.getElementById('maxtime').addEventListener('click',() =>{
    if(daysToShow != 'max'){
        daysToShow = 'max';
        timeButton.innerText = 'Максимум'
        getData(activeID[active])
    }
    
})




