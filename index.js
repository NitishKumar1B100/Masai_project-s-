const fetchData = async ()=>{
    try{
    const response = await fetch('mock_data.json')
    const jsObj = await response.json()

    return jsObj
    }catch(err){
        console.log(err)
    }
}

let allData;

const getyear = document.querySelector('.hideyear'),
getyearbox = document.querySelector('.hideyearBox'),
getyearbutton = document.getElementById('submityear');

getyear.addEventListener('click', (e)=>{
    getyear.classList.remove('getyear')
    getyearbox.classList.remove('yearbox')
})

getyearbox.addEventListener('click', (e)=>{
    e.stopPropagation()
})
getyearbutton.addEventListener('click', ()=>{
    const yearInp = document.getElementById('year')
    
    if(!yearInp.value) return
    
    getyear.classList.remove('getyear')
    getyearbox.classList.remove('yearbox')

    total_price_after_year2(allData, yearInp.value)
    yearInp.value = ''
})

const Renderdata = async (data) =>{
    allData = data
    allDetails(data)
    // setTimeout(async ()=>{
    //     await allDetails(data)
    // }, 0)
    // console.log('helo')
    
    // Average_Discount_per_Brand(allData)
    // oldest_android_phone(data)
    // price_after_discount(data)
    // total_price_after_year(data)
    return
}
function handleSelect(){
    const select1 = document.getElementById('select1')
    const select1Val = select1.value

    switch(select1Val){
        case 'Average Discount per Brand':
            Average_Discount_per_Brand(allData)
            break
        case 'Oldest Phone Model with Android OS':
            oldest_android_phone(allData)
            break
        case 'Price After Discount':
            price_after_discount(allData)
            break
        case 'Total Price of Phones Released After a Certain Year':
            total_price_after_year(allData)
            break
        case 'Most Expensive Brand':
            most_expensive_brand(allData)
            break
        default:
            Default(allData)
    }
}

const allDetails = async (data)=>{
    const codeobj = document.getElementById('codeObj')
    codeobj.innerHTML = ''
    
    let html = ''
    for(let obj of data){
        let result = `<span id='topCurly'>{</span> <br/>`
        for(let keys in obj){
            const keyval = `<span id='objKey'>"${keys}"</span><span id='colonal'>:</span> <span id='objVal'>"${obj[keys]}"</span> <br/>`;
            result += keyval
        }
        result += `<span id='downCurly'>}</span>`
        html += result
    }

    codeobj.innerHTML = html
}
const Default = (data)=>{
    allDetails(data)
    return
}

const Average_Discount_per_Brand = (data) =>{
    let brand_discount = {}
    let brand_count = {}
    let avgDiscount = []

    for(let obj of data){
        let brand = obj['brand']
        let discount = obj['discount']

        if(brand_count[brand]){
            brand_discount[brand] += discount
            brand_count[brand] += 1
        }else{
            brand_discount[brand] = discount
            brand_count[brand] = 1
        }
    }
    for(let sol in brand_count){
        avgDiscount.push({brand:sol, brand_count:brand_count[sol], 
            discount: brand_discount[sol], avgerage_discount: brand_discount[sol] / brand_count[sol]})
    }
    allDetails(avgDiscount)
}


const oldest_android_phone = (data)=>{
    let model_name = null
    let oldest_year = Infinity

    for(let obj of data){
        if(obj.os.includes('Android') && obj.release_data < oldest_year){
            oldest_year = obj.release_data
            model_name = obj.model
        }
    }

    allDetails([{model:model_name, year:oldest_year}])
}

const price_after_discount = (data) =>{
    const result = []

    for(let obj of data){
        result.push({model:obj.model, discounted_price: obj.price*(1-obj.discount)})
    }
    allDetails(result)
}

const total_price_after_year = (data)=>{
    setTimeout(()=>{
        getyear.classList.add('getyear')
        getyearbox.classList.add('yearBox')
    }, 200)
}
const total_price_after_year2 = (data, year)=>{
    let total_price = 0

    for(let obj of data){
        if(obj.release_data > year){
            total_price += obj.price
        }
    }
    allDetails([{total_price: total_price}])
}


const most_expensive_brand = (data)=>{
    const brand_price = {}
    const brand_count = {}

    for(let obj of data){
        if(brand_price[obj.model]){
            brand_price[obj.model] += obj.price
            brand_count[obj.model] += 1
        }else{
            brand_price[obj.model] = obj.price
            brand_count[obj.model] = 1
        }
    }

    let mostExpensive = -Infinity
    let mostExpensive_brand = null

    for(let key in brand_count){
        const avg = brand_price[key] / brand_count[key]

        if(mostExpensive < avg){
            mostExpensive = avg
            mostExpensive_brand = key
        }
    }

    allDetails([{most_expensive_brand: mostExpensive_brand, most_expensive_brand_price: mostExpensive}])
}
(
    async ()=>{
        try{
            let data = await fetchData()
            Renderdata(data)
        }catch(err){
            console.log(err)
        }
    }
)();
