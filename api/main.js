const apiCaller = require('./app.js');

const apiParser = require('./parser.js');

// var temp_token = "Bearer SC:00f9ce39d9469e76337519f621e87aa1e0d5a5711f29cb169ab768ff6f216031";

// var temp_dateRange = "2020-09-30T00:00:00.000/2020-11-04T00:00:00.000";

// var temp_dimension = "variables/page";

// var temp_company = "OBU Eng SC";

// var temp_user = "tsaizhihao";

var temp_token = "Bearer SC:e2f90eeddee45513739be55f765cca5aa49ff89e2818f896f972e7a5ec0d8b58";

var temp_dateRange = "2020-09-30T00:00:00.000/2020-11-04T00:00:00.000";

var temp_dimension = "variables/page";

var temp_company = "OBU Eng SC";

var temp_user = "tschen";

exports.getData = getData; 

// getData(temp_token,temp_company,temp_user,temp_dateRange,temp_dimension, 100);
// apiCaller.getSeqRequest(temp_token,temp_company,temp_user,temp_dateRange,temp_dimension, "Home", "Home").then(data => console.log(data));
async function getData(token, company, user, dateRange, dimension, limit) {
    let parser  = new apiParser();
    // Simple request to get the top 10
    let data = await apiCaller.getRequest(token, company, user, dateRange, dimension, limit);

    // store the top 10 nodes to JSON, and name and item to map for future use
    parser.parse(data);

    // for loop through to make individual request fromAllPagesToOnePage, *forEach doesn't work with async
    let promises = [];
    for (const [key, value] of parser.simpleMap.entries()) {
        promises.push(apiCaller.getToAllRequest(token, company, user, dateRange, dimension, key, parser.allNodes))
    }

    // load to jsonObj
    await Promise.all(promises).then(res => {
        res.forEach(data => parser.parseToJson(data));
    });

    // convert js object to JSON
    return JSON.stringify(parser.jsonObj);
}

getData(temp_token,temp_company,temp_user,temp_dateRange,temp_dimension,10).then(res => console.log(res));

// module.exports = apiClass;