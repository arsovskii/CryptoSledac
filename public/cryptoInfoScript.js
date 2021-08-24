
let query = window.location.search;
query = query.slice(1)
console.log(query);







fetch(`https://api.coingecko.com/api/v3/coins/${query}?localization=false&tickers=false&market_data=false&community_data=true&developer_data=false&sparkline=true`)
    .then(response => response.json())
        .then(responseData=>{
            if(responseData.error){
                
                alert("Не постои таков ID! Пробај повторно!");
                window.close();
            }else{
                console.log(responseData);

                document.getElementById('coinName').innerText= `${responseData.name} (${responseData.symbol.toUpperCase()})`;

                document.getElementById('bigImage').src = responseData.image.large;

                if(responseData.description.en === ""){
                    document.getElementById('coinDesc').remove();
                }else{
                    document.getElementById('coinDesc').innerHTML = responseData.description.en;
                }
                if(responseData.market_cap_rank){
                    document.getElementById('rankInfo').innerText = `Ранк: ${responseData.market_cap_rank}`
                    
                }else{
                    document.getElementById('rankInfo').innerText = ``;
                }
                

                if(responseData.hashing_algorithm){
                    document.getElementById('hashInfo').innerText = `Хешинг алгоритам: ${responseData.hashing_algorithm}`
                }else{
                    document.getElementById('hashInfo').innerText = ``
                }
               console.log(responseData.links)
               let socialMedia = document.getElementById('socialMedia')

               if(responseData.links.blockchain_site[0]){
                   let blockchainSite = document.createElement('button');
                   blockchainSite.innerText = `Official ${responseData.name} Blockchain Site`;
                   blockchainSite.addEventListener('click',() =>{
                     window.open(responseData.links.blockchain_site[0])
                   })
                   blockchainSite.classList.add('button');
                   blockchainSite.classList.add('is-link');
                   socialMedia.appendChild(blockchainSite);
               }
               if(responseData.links.homepage[0]){
                   let homepage = document.createElement('button');
                   homepage.innerHTML = `${responseData.name} Homepage`
                   homepage.addEventListener('click',() =>{
                    window.open(responseData.links.homepage[0])
                  })
                   homepage.classList.add('button');
                   homepage.classList.add('is-link');
                   socialMedia.appendChild(homepage);
               }
            }
           
        });

fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${query}&vs_currencies=usd&include_market_cap=true&include_24hr_change=true`)
        .then(response => response.json())
        .then(responseData =>{
            console.log(responseData,'eve')
            responseData[query].usd = new Intl.NumberFormat('us-US',{style:'currency',currency: "USD"}).format(responseData[query].usd)
            responseData[query].usd_market_cap = new Intl.NumberFormat('us-US',{style:'currency',currency: "USD"}).format(responseData[query].usd_market_cap)
            responseData[query].usd_24h_change = new Intl.NumberFormat('us-US').format(responseData[query].usd_24h_change) 
            document.getElementById('currentPriceInfo').innerHTML = `${responseData[query].usd}<br> ${responseData[query].usd_24h_change}%` ;
            if(responseData[query].usd_24h_change > 0 ){
                document.getElementById('currentPriceInfo').classList.add('positivePercent')
            }else{
                document.getElementById('currentPriceInfo').classList.add('negativePercent')
            }
            
            document.getElementById('marketCapInfo').innerText = responseData[query].usd_market_cap

        })



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
        gradientFill.addColorStop(0, " rgba(89,0,255,0.6)");
        gradientFill.addColorStop(1, " rgba(89,0,255,0.2)");
        var myChart = new Chart(ctx, {
            
            data: {
                labels: [],
                datasets: [{
                    type: 'line',
                    label: '',
                    data: [],
                    backgroundColor: '',
                    fillColor:'white',
                    borderColor: "rgba(162, 111, 255, 1)",
                    borderWidth: 1.5,
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
        


fetch(`https://api.coingecko.com/api/v3/coins/${query}/market_chart?vs_currency=usd&days=max`)    
    .then(response => response.json())
    .then(responseData =>{
  
    
    let unixTime = 0;
    let cryptoArrayTime = []
    let cryptoArrayPrice = []
   
    let now = new Date().getDate()
    responseData.prices.forEach(element => {
        
        unixTime = element[0];
        var date = new Date(unixTime);
        var moments = moment(unixTime);
        
        
        if(now !== date.getDate()){
            moments = moment(moments).format('DD.MM.YYYY HH:MM');
            
            now = date.getDate()
        }else{
           
            
                moments = moment(moments).format('DD.MM HH:MM:SS');
            
            
        
    }
        
       
        //moments = moment(moments).format('DD.MM.YYYY HH:MM:SS')
        
        cryptoArrayTime.push(moments);
        cryptoArrayPrice.push(element[1]);
        
    });
    
    myChart.data.labels = cryptoArrayTime;
    let name = query.replace(/^\w/, (c) => c.toUpperCase());
    myChart.data.datasets[0].label = name;
    
    myChart.data.datasets[0].data = cryptoArrayPrice
    

    myChart.update()
   
})
   
