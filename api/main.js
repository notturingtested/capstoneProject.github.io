// import getRequest from './app.js';

const apiCaller = require('./app.js');

const apiParser = require('./parser.js');

var temp_token = "Token";

var temp_dateRange = "2020-09-30T00:00:00.000/2020-11-04T00:00:00.000";

var temp_dimension = "variables/page";

var temp_company = "<companyId>";

var temp_user = "<userId>";



let parser  = new apiParser();

apiCaller.getRequest(temp_token, temp_company, temp_user, temp_dateRange, temp_dimension)
    .then( res => {
                console.log(parser.parse(res))
            } 
    );
