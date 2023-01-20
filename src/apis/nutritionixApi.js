let appID = 'a9dde67e'
let apiKey = 'a85317f6041e49488efef8ce2178a6bd'

export default function nutritionixApi(){
    console.log('nutritionixApi can be called from here')
}

// function nutritionixAuth(){

// }

export async function nlpApiPost(nlpString){
    var myHeaders = new Headers();
    myHeaders.append("x-app-id", appID);
    myHeaders.append("x-app-key", apiKey);
    myHeaders.append("x-remote-user-id","0");
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("query", nlpString);

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: urlencoded,
        redirect: 'follow'
    };

    let result = fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", requestOptions)
        .then(response => response.text())
        .then(result => {return JSON.parse(result);})
        .catch(error => console.log('error: ', error))
    

    console.log('foods log: ', await result.foods)
    console.log(await result)

    return await result
}

// async function nutritionJsonParse(result){
//     console.log('parse: ', result);

//     console.log('foods: ', await result.foods)
// }