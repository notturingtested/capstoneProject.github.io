module.exports = class parser {
    constructor() { 
        this.simpleMap = new Map();
        this.simpleMapTraffic = new Map();
        this.jsonObj = {
            nodes: [],
            links: []
        };
    }

    parse(res) {
        // console.log(res);
        // other is the sum of everything besides top 9
        let other = res.summaryData.totals;
        // forEach through the data.rows to store nodes into JSON
        res.rows.forEach(element => {
            // remove the top 9 from total value
            other = other - element.data[0];
            // set to the map for future use
            this.simpleMap.set(element.value, element.itemId);
            this.simpleMapTraffic.set(element.value, element.data[0]);
            // store to JSON
            this.jsonObj.nodes.push({
                name: element.value,
                group: parseInt(element.itemId),
                index: parseInt(element.itemId),
                volume: element.data[0]
            })
        });
        // store node OTHER into JSON
        this.jsonObj.nodes.push({
            name: "Other",
            group: -1,
            index: -1,
            volume: other
        })

        return this.simpleMap;
    }

    parseToJson(fromPage, data) {
        // console.log(data);
        // toOther is the sum of everything besides top 9
        let toOther = 0;
        data.rows.forEach(element => {
            // store to JSON
            this.jsonObj.links.push({
                source: parseInt(element.itemId),
                target: parseInt(this.simpleMap.get(fromPage)),
                value: parseInt(element.data[0])
            });
            // calculate other
            let old = this.simpleMapTraffic.get(fromPage);
            this.simpleMapTraffic.set(fromPage, old - element.data[0]);
        });
    }

    setOther() {
        for (const [key2, value2] of this.simpleMapTraffic.entries()) {
            this.jsonObj.links.push({
                source: parseInt(this.simpleMap.get(key2)),
                target: -1,
                value: value2
            });
        }
    }
}