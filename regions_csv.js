const axios = require('axios');
const converter = require('json-2-csv');
const fs = require('fs');
const url = 'http://108.61.185.46:8983/solr/orbigo.orbigoSearch_p/select?q=*%3A*&fq=vertex_type%3Aregion&rows=600&wt=json&indent=true';


axios.get(url, {
    auth: {
        username:"orbigo",
        password:"mJJd1EJ8vULODFUbDc3xxE"
    }
}).then(response => {
    let solrResponse  = response.data.response.docs;
    console.log(solrResponse.length);
    converter.json2csv(solrResponse, (err, csv)  => {
        if (err) {
            throw err;
        }
    
        // print CSV string
        // console.log(csv);
        fs.writeFileSync('./orbigoSeach_Region.csv', csv);
    });
})
.catch(error => {
    console.log(error);
})


console.log("Hello World");




