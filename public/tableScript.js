let currentPage = 1;
let query = window.location.search;
query = query.slice(1)
console.log(query);
if(!query){
    currentPage = 1;
}else{
    currentPage = query;
}
console.log(currentPage);

let numofPages = 1;

if(currentPage <= 0){
    alert("Грешка! Не постои таква страна!")
    currentPage = 1;
}

currentPage = Number(currentPage);

fetch(`https://api.coingecko.com/api/v3/global`)
    .then(response => response.json())
        .then(responseData=>{
            console.log(responseData.data.active_cryptocurrencies)
            numofPages = Math.ceil(responseData.data.active_cryptocurrencies/100);
            console.log(numofPages);
            numofPages = Number(numofPages);
            if(currentPage > numofPages || currentPage <= 0 ){
                alert("Грешка! Не постои таква страна!")
                currentPage = 1;
            }

            if(currentPage == 1){
                document.getElementById('previous').setAttribute('disabled',true)
                
            }
            
            if(currentPage >= numofPages){
                document.getElementById('next').setAttribute('disabled',true)
            }
            document.getElementById('previous').href = `/topCoins?${currentPage-1}`
            document.getElementById('next').href = `/topCoins?${currentPage+1}`
            pageArray = [];
            pageArray.push(1);
            if(currentPage - 1 > 1){
                pageArray.push(currentPage-1);
            }
           
            if(currentPage != 1){
                pageArray.push(Number(currentPage));
            }
           
            if(currentPage + 1 <numofPages){
                
                pageArray.push(currentPage+1);
            }
           
            if(currentPage == numofPages){
                pageArray.pop();
            }
            pageArray.push(numofPages);
            let elipseArray = [];
            console.log(pageArray);
            let pageList = document.getElementById('pageList');
            for(let i = 0; i < pageArray.length-1;i++){
                if(pageArray[i+1] - pageArray[i] != 1){
                    elipseArray.push(i+1);
                }
            }
            let j = 0;
            console.log(elipseArray);
            
            
            
            for(let i = 0; i < pageArray.length;i++){
                if(elipseArray[j] === i){
                    j++;
                    let ellipsisElement = document.createElement('span');
                    ellipsisElement.classList.add('pagination-ellipsis')
                    ellipsisElement.innerHTML = '&hellip;'
                    ellipsisList = document.createElement('li');
                    ellipsisList.appendChild(ellipsisElement)
                    pageList.appendChild(ellipsisList);
                }
                console.log(currentPage);
                let liElem = document.createElement('li');
                let aElem = document.createElement('a');

                aElem.classList.add('pagination-link')
                aElem.setAttribute('aria-label',`Goto page ${pageArray[i]}`);
                aElem.href = `/topCoins?${pageArray[i]}`
             
                if(currentPage == pageArray[i]){
                    
                    aElem.classList.add('is-current');
                    aElem.setAttribute('aria-current','page');
                }
                aElem.innerText = pageArray[i];
                liElem.appendChild(aElem);
                pageList.appendChild(liElem);

                
                


                
            }


        })



function getTableInfo(){
    fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=${currentPage}&sparkline=false&price_change_percentage=1h%2C24h%2C7d`)
    .then(response => response.json())
        .then(responseData=>{

            let index = (currentPage-1)*100 +1 ;
            responseData.forEach(element => {
                
                
               //console.log(element)
               
                let tableRowtoAdd = document.createElement('tr');
                
                let indexElem = document.createElement('td');
                indexElem.innerText = index;
                tableRowtoAdd.appendChild(indexElem);
                
                let nameElem = document.createElement('td');
                let anchorTag = document.createElement('a')
                anchorTag.href = `./crypto?${element.id}`
                anchorTag.target = "_blank";
                anchorTag.innerText = element.name

                nameElem.innerText = "";
                nameElem.appendChild(anchorTag);
                let imgElem = document.createElement('img');
                imgElem.src = element.image;
                imgElem.classList.add('cryptoSmallImage');
                nameElem.appendChild(imgElem);
                tableRowtoAdd.appendChild(nameElem);
                let symb = document.createElement('span');
                symb.innerText = element.symbol.toUpperCase();
                symb.classList.add('symbol');
                nameElem.appendChild(symb); 

                let priceElem = document.createElement('td');
                priceElem.innerText = new Intl.NumberFormat('us-US',{style:'currency',currency: "USD"}).format(element.current_price)
                tableRowtoAdd.appendChild(priceElem)

                let price1hElem = document.createElement('td');
                price1hElem.innerText = new Intl.NumberFormat().format(element.price_change_percentage_1h_in_currency) + `%`
                if(element.price_change_percentage_1h_in_currency < 0){
                    price1hElem.classList.add(`negativePercent`);
                }else{
                    price1hElem.classList.add(`positivePercent`);
                }

                let price24hElem = document.createElement('td');
                price24hElem.innerText = new Intl.NumberFormat().format(element.price_change_percentage_24h_in_currency) + `%`
                if(element.price_change_percentage_24h_in_currency < 0){
                    price24hElem.classList.add(`negativePercent`);
                }else{
                    price24hElem.classList.add(`positivePercent`);
                }

                let price7dElem = document.createElement('td');
                price7dElem.innerText = new Intl.NumberFormat().format(element.price_change_percentage_7d_in_currency) + `%`
                if(element.price_change_percentage_7d_in_currency < 0){
                    price7dElem.classList.add(`negativePercent`);
                }else{
                    price7dElem.classList.add(`positivePercent`);
                }
                tableRowtoAdd.appendChild(price1hElem);
                tableRowtoAdd.appendChild(price24hElem);
                tableRowtoAdd.appendChild(price7dElem);

                let totalvol = document.createElement('td');
                totalvol.innerText = new Intl.NumberFormat('us-US',{style:'currency',currency: "USD"}).format(element.total_volume);
                tableRowtoAdd.appendChild(totalvol);

                let marketCap = document.createElement('td');
                marketCap.innerText = new Intl.NumberFormat('us-US',{style:'currency',currency: "USD"}).format(element.market_cap)
                tableRowtoAdd.appendChild(marketCap);
                index++;
                tableRowtoAdd.addEventListener('click',()=>{
                    window.open(`./crypto?${element.id}`)
                    //window.location = `./crypto?${element.id}`
                })
                
                document.getElementById('TableInsert').appendChild(tableRowtoAdd);
                
            });

        })
}


getTableInfo();