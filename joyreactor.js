const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

let link = `http://joyreactor.cc`;

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
                
                
                $(html).find('div.uhead_nick').each((index,element)=>{
                    
                    let item = {
                        name: $(element).find('a').text()
                    }
                    console.log(item);
                    arr.push(item)

                   flag=true;
                })

                
            })
            .catch(error => console.log(error))
       
        if(flag){
            fs.writeFile('joy.json',JSON.stringify(arr),e=>{
                if(e) throw e;
                console.log('Saved joy.json')
            })
            break;
        }
        
    }
} catch (error) {
    console.log(error)
}
}
parseSite();