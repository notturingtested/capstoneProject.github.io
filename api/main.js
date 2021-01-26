const apiCaller = require('./app.js');

const apiParser = require('./parser.js');

var temp_token = "Bearer SC:d150f9fd729453ff3aff90ec56f8caa30d9901ef7eb9687e0b3b71834e6eed4c";

var temp_dateRange = "2020-09-30T00:00:00.000/2020-11-04T00:00:00.000";

var temp_dimension = "variables/page";

var temp_company = "OBU Eng SC";

var temp_user = "tsaizhihao";

exports.getData = getData; 

//getData(temp_token,temp_company,temp_user,temp_dateRange,temp_dimension);
// apiCaller.getSeqRequest(temp_token,temp_company,temp_user,temp_dateRange,temp_dimension, "Home", "Home").then(data => console.log(data));

async function getData(token, company, user, dateRange, dimension, limit) {
    let parser  = new apiParser();
    // Simple request to get the top 10
    let data = await apiCaller.getRequest(token, company, user, dateRange, dimension, limit);
    // store the top 10 nodes to JSON, and name and item to map for future use
    parser.parse(data)
    // for loop through to make individual request fromAllPagesToOnePage, *forEach doesn't work with async
    for (const [key, value] of parser.simpleMap.entries()) {
        await apiCaller.getToAllRequest(token, company, user, dateRange, dimension, key, parser.allNodes)
            .then(res => {
                parser.parseToJson(key, res);
            });        
    }
    console.log(parser.jsonObj);
    // convert js object to JSON
    return JSON.stringify(parser.jsonObj);
}