module.exports = class parser {
    constructor() { this.lists = new Map();}

    parse(res) {
        let other = res.summaryData.totals;
    
        res.rows.forEach(element => {
            other = other - element['data']
            this.lists.set(element.value, element['data'])
        });
        this.lists.set("Other", other)
        return this.lists;
    }
}