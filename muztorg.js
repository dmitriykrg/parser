const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

let link = `https://www.muztorg.ru/category/klassicheskie-gitary?in-stock=1&pre-order=1&page=`;

const parseSite = async ()=>{
try {
    let arr=[];
    let i = 1;
    let flag = false;
    i = 9;
    while(true){
        console.log('step - ',i)
        await axios.get(link+i)
            .then(response => response.data)
            .then(response =>{
                let html = response;
                $ = cheerio.load(html);
                let pagination = $('li.next.disabled').html();
                
                $(html).find('section.product-thumbnail').each((index,element)=>{
                    
                    let item = {
                        name: $(element).find('p.price').text().replace(/\s+/g,'')
                    }
                    console.log(item);
                    arr.push(item)

                  
                })

                if(pagination !== null){
                    flag = true;
                }
            })
            .catch(error => console.log(error))
       
        if(flag){
            fs.writeFile('muztorg.json',JSON.stringify(arr),e=>{
                if(e) throw e;
                console.log('Saved muztorg.json')
            })
            break;
        }
        i++;
    }
} catch (error) {
    console.log(error)
}
}
parseSite();