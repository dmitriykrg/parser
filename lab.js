const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

let link = `https://labinsk-city.ru/ru/`;

const parseSite = async ()=>{
try {
    let arr=[];
    
    let flag = false;
    
    while(true){
        
        await axios.get(link)
            .then(response => response.data)
            .then(response =>{
                let html = response;
                $ = cheerio.load(html);
                
                
                $(html).find('div.iblock-list-item.position-relative.mb-4').each((index,element)=>{
                    
                    let item = {
                        name: $(element).find('a').text().replace(/\s+/g,' ')
                    }
                    console.log(item);
                    arr.push(item)

                   flag=true;
                })

                
            })
            .catch(error => console.log(error))
       
        if(flag){
            fs.writeFile('lab.json',JSON.stringify(arr),e=>{
                if(e) throw e;
                console.log('Saved lab.json')
            })
            break;
        }
        
    }
} catch (error) {
    console.log(error)
}
}
parseSite();