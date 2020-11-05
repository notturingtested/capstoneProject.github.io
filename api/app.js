const fetch = require("node-fetch");

var temp_token = "<token>";
var temp_dateRange = "2020-09-30T00:00:00.000/2020-11-04T00:00:00.000";
var temp_dimension = "variables/browser";
var temp_company = "<companyId>";
var temp_user = "<userId>";

var simple = false;

if (simple) {
    getRequest(temp_token, temp_company, temp_user, temp_dateRange, temp_dimension)
        .then(res => {
            console.log(res);
            // res.rows.forEach(element => {
            //     console.log(element)
            // }); 
        });
} else {
    getSequenceRequest(temp_token, temp_company, temp_user, temp_dateRange, temp_dimension)
        .then(res => {
            // console.log(res);
            res.rows.forEach(element => {
                console.log(element)
            });
        });
}

async function getRequest(token, company, user, dateRange, dimension) {
    const res = await fetch("https://appservice5.omniture.com/analytics/1.0/reports?allowRemoteLoad=default&useCache=true&includeOberonXml=false&includePlatformPredictiveObjects=false", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh-CN;q=0.7,zh;q=0.6",
            "authorization": token,
            "cache-control": "no-cache",
            "content-type": "application/json;charset=UTF-8",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-proxy-company-id": company,
            "x-proxy-userid": user,
            "x-request-client-type": "AW",
            "x-request-entity-id": "5ef391a23126e227c822f579",
            "x-request-entity-name-base64": "U2hhcmVkIHdpdGggYWxsIHRvIG5vbi1hZG1pbg==",
            "x-request-id": "15ba90be825944d681cfd268e2517a04",
            "x-request-timing-group-id": "cb073b95f7b34ff8ad8067d547494234"
        },
        "referrer": "https://sc5.omniture.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{
            "rsid": "a4t-test.geometrixxqc",
            "globalFilters": [
                {
                    "type": "dateRange",
                    "dateRange": "${dateRange}"
                }
            ],
            "metricContainer": {
                "metrics": [
                    {
                        "columnId": "0",
                        "id": "metrics/occurrences",
                        "sort": "desc"
                    }
                ]
            },
            "dimension": "${dimension}",
            "settings": {
                "countRepeatInstances": true,
                "limit": 50,
                "page": 0,
                "nonesBehavior": "return-nones"
            },
            "statistics": {
                "functions": [
                    "col-max",
                    "col-min"
                ]
            }
        }`,
        "method": "POST",
        "mode": "cors"
    });
    const json = await res.json();

    return json;
}

async function getSequenceRequest(token, company, user, dateRange, dimension) {
    const res = await fetch("https://appservice5.omniture.com/analytics/1.0/reports?allowRemoteLoad=default&useCache=true&includeOberonXml=false&includePlatformPredictiveObjects=false", {
        "headers": {
            "accept": "application/json",
            "accept-language": "en-US,en;q=0.9,zh-TW;q=0.8,zh-CN;q=0.7,zh;q=0.6",
            "authorization": token,
            "cache-control": "no-cache",
            "content-type": "application/json;charset=UTF-8",
            "pragma": "no-cache",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-site",
            "x-proxy-company-id": company,
            "x-proxy-userid": user,
            "x-request-client-type": "AW",
            "x-request-entity-id": "5ef391a23126e227c822f579",
            "x-request-entity-name-base64": "U2hhcmVkIHdpdGggYWxsIHRvIG5vbi1hZG1pbg==",
            "x-request-id": "15ba90be825944d681cfd268e2517a04",
            "x-request-timing-group-id": "cb073b95f7b34ff8ad8067d547494234"
        },
        "referrer": "https://sc5.omniture.com/",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": `{
            "rsid": "a4t-test.geometrixxqc",
            "globalFilters": [
                {
                    "type": "dateRange",
                    "dateRange": "2020-11-04T00:00:00.000/2020-12-02T00:00:00.000"
                }
            ],
            "metricContainer": {
                "metrics": [
                    {
                        "columnId": "1",
                        "id": "metrics/pageviews",
                        "filters": [
                            "0"
                        ]
                    },
                    {
                        "columnId": "2",
                        "id": "metrics/pageviews",
                        "sort": "desc",
                        "filters": [
                            "1"
                        ]
                    }
                ],
                "metricFilters": [
                    {
                        "id": "0",
                        "type": "segment",
                        "segmentId": "All_Visits"
                    },
                    {
                        "id": "1",
                        "type": "segment",
                        "segmentId": "s300000022_5fa18c39bc5fc40a09b063c5"
                    }
                ]
            },
            "dimension": "variables/page",
            "settings": {
                "countRepeatInstances": true,
                "limit": 50,
                "page": 0,
                "nonesBehavior": "exclude-nones"
            },
            "statistics": {
                "functions": [
                    "col-max",
                    "col-min"
                ]
            }
        }`,
        "method": "POST",
        "mode": "cors"
    });
    const json = await res.json();

    return json;
}


