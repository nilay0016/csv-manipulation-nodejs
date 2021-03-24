const axios = require('axios');
const converter = require('json-2-csv');
const fs = require('fs');
const stateUrl = 'http://108.61.185.46:8983/solr/orbigo.orbigoSearch_p/select?q=*%3A*&fq=vertex_type%3Astate&wt=json&indent=true';

const options = {
    delimiter: '|'
}

axios.get(stateUrl, {
    auth: {
        username:"orbigo",
        password:"mJJd1EJ8vULODFUbDc3xxE"
    }
}).then(response => {
    let solrResponse  = response.data.response.docs;
    console.log(solrResponse);
    converter.json2csv(solrResponse,(err, csv)  => {
        if (err) {
            throw err;
        }
    
        // print CSV string
        // console.log(csv);
        fs.writeFileSync('./orbigoSeach_State.csv', csv);
    });
})
.catch(error => {
    console.log(error);
})


console.log("Hello World");




