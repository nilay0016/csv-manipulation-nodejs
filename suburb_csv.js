const axios = require('axios');
const converter = require('json-2-csv');
const fs = require('fs');
const csvFilePath='./suburb_csv/WA_output.csv'
const csv=require('csvtojson')

// const nsw_url = 'http://108.61.185.46:8983/solr/orbigo.orbigoSearch_p/select?q=state%3A%22New+South+Wales%22&fq=vertex_type%3Asuburb&rows=5000&wt=json&indent=true';
// const nt_url = 'http://108.61.185.46:8983/solr/orbigo.orbigoSearch_p/select?q=*%3A*&fq=vertex_type%3Asuburb&rows=16000&wt=json&indent=true';
//  const qld_url = 'http://108.61.185.46:8983/solr/orbigo.orbigoSearch_p/select?q=state%3A%22Queensland%22&fq=vertex_type%3Asuburb&rows=3500&wt=json&indent=true';
//  const sa_url = 'http://108.61.185.46:8983/solr/orbigo.orbigoSearch_p/select?q=state%3A%22Southern+Australia%22&fq=vertex_type%3Asuburb&rows=2000&wt=json&indent=true';
// const tas_url = 'http://108.61.185.46:8983/solr/orbigo.orbigoSearch_p/select?q=state%3A%22Tasmania%22&fq=vertex_type%3Asuburb&rows=800&wt=json&indent=true';
// const vic_url = 'http://108.61.185.46:8983/solr/orbigo.orbigoSearch_p/select?q=state%3A%22Victoria%22&fq=vertex_type%3Asuburb&rows=3000&wt=json&indent=true';
const wa_url = 'http://108.61.185.46:8983/solr/orbigo.orbigoSearch_p/select?q=state%3A%22Western+Australia%22&fq=vertex_type%3Asuburb&rows=2000&wt=json&indent=true';

csv({
    delimiter:"|"
})
.fromFile(csvFilePath)
.then((jsonObj)=>{
    let suburbJson = jsonObj;
    let solrSuburb = runSolrQuery(suburbJson);
})


runSolrQuery = async (suburbJson) => {
    await axios.get(wa_url, {
    auth: {
        username:"orbigo",
        password:"mJJd1EJ8vULODFUbDc3xxE"
    }
}).then(response => {
    let json = suburbJson;
    let solrResponse  = response.data.response.docs;
    // console.log(json[0]);
    // console.log(solrResponse[0].search_item_id);
    var finalCSV = [];
    for(let i=0; i<solrResponse.length; i++)
    {
        let suburb = solrResponse[i];;
        for(let j=0; j<json.length; j++)
        {
            if(suburb.vertex_id == json[j].suburbId)
            {
                let record = {
                    search_item_id: `${suburb.search_item_id}`,
                    region: `${suburb.region}`,
                    suburb: `${suburb.suburb}`,
                    albumPath: `${suburb.albumPath}`,
                    name: `${suburb.name}`,
                    state: `${suburb.state}`,
                    startDate: `${suburb.startDate}`,
                    country: `${suburb.country}`,
                    location: `${json[j].location}`,
                    vertex_id: `${suburb.vertex_id}`,
                    vertex_type: `${suburb.vertex_type}`,
                    endDate: `${suburb.endDate}`,
                    operationalHours: `${suburb.operationalHours}`,
                    budget: `${suburb.budget}`
                }
                finalCSV.push(record);
            }
        }
    }

    // console.log(finalCSV)
    converter.json2csv(finalCSV, (err, csv)  => {
        if (err) {
            throw err;
        }
    
        // print CSV string
        // console.log(csv);
        fs.writeFileSync('./orbigoSearch_Suburb_WA.csv', csv);
    });
})
.catch(error => {
    console.log(error);
})
}