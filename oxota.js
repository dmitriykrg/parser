const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

let link = `https://ohotaktiv.ru/catalog/gladkostvolnoe_oruzhie/?PAGEN_1=`;

const parseSite = async ()=>{
try {
    let arr=[];
    let i = 1;
    let flag = false;
    i = 23;
    while(true){
        console.log('step - ',i)
        await axios.get(link+i)
            .then(response => response.data)
            .then(response =>{
                let html = response;
                $ = cheerio.load(html);
                let ulli = $('ul.pagination__list').text().replace(/\s+/g,' ').trim(); // получили числа страниц, доступные снизу для перехода на сайте
                let pagination = $('a.pagination__link.pagination__link--current').html(); // получили текущую выбранную страницу сайта
                
                let arrLi= ulli.split(' '); // превратили набор чисел страниц в массив
            
                $(html).find('a.swiper-slide.card-prod.card-prod-new.new-prod__slide').each((index,element)=>{ //Делаем цикл из элементов a
                    let item = {
                        price: $(element).attr('data-current') //достаём данные из атрибутов элемента a
                    }
                    arr.push(item)

                })

                if(pagination == arrLi[arrLi.length - 1]){ //Если текущая страница равна последнему числу в наборе страниц, то она конечная и флаг переходит в тру
                    flag = true;
                }
            })
            .catch(error => console.log(error))
       
        if(flag){
            let resultArr=arr.filter(elem => {  // Фильтруем мусор(пустые объекты) и засовываем в новую переменную
                if(elem.price !== ''){
                    return elem
                }
                }
                    );
            fs.writeFile('oxota.json',JSON.stringify(resultArr),e=>{
                if(e) throw e;
                console.log('Saved oxota.json')
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