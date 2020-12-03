module.exports = class parser {
    constructor() { 
        this.simpleMap = new Map();
        this.jsonObj = {
            nodes: [],
            links: []
        };
    }

    parse(res) {
        // other is the sum of everything besides top 9
        let other = res.summaryData.totals;
        // forEach through the data.rows to store nodes into JSON
        res.rows.forEach(element => {
            // remove the top 9 from total value
            other = other - element['data'];
            // set to the map for future use
            this.simpleMap.set(element.value, element.itemId);
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
        // toOther is the sum of everything besides top 9
        let toOther = 0;
        // forEach through the data.rows to store links into JSON
        data.rows.forEach(element => {
            if (this.simpleMap.has(element.value)) {
                // store to JSON
                this.jsonObj.links.push({
                    source: parseInt(element.itemId),
                    target: parseInt(this.simpleMap.get(fromPage)),
                    value: parseInt(element.data[0])
                });
            } else {
                // toOther of everything besides top 9
                toOther += parseInt(element['data']);
            }
        });
        // store link to OTHER into JSON
        this.jsonObj.links.push({
            source: -1,
            target: parseInt(this.simpleMap.get(fromPage)),
            value: toOther
        });
    }
}