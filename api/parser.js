// import d3
let d3 = require("d3");

module.exports = class parser {
  constructor() {
      this.simpleMap = new Map();
      this.count = 0;
      this.indexMap = new Map();
      this.other = "Other Pages";
      this.indexMap.set(this.other, this.count++);
      this.allNodes = [];
      this.jsonObj = {
          nodes: [],
          links: []
      };
  }  
  
  
  parse(res) {

      // other is the sum of everything besides top limit
      let other = res.summaryData.totals[0];
    
      // forEach through the data.rows to store nodes into JSON
      res.rows.forEach((element,index) => {
          this.indexMap.set(element.value, this.count++);
          // remove the top limit from total value
          other = other - element['data'];
          // set to the map for future use
          this.simpleMap.set(element.value, element.itemId);
          this.allNodes.push(element.itemId);
          // store to JSON
          this.jsonObj.nodes.push({
              name: element.value,
              group: this.indexMap.get(element.value),
              index: this.indexMap.get(element.value),
              volume: element.data[0]
          })
      });
      // store node OTHER into JSON
      this.jsonObj.nodes.push({
          name: this.other,
          group: this.indexMap.get(this.other),
          index: this.indexMap.get(this.other),
          volume: other
      })
      
      // normalize the nodes
      this.normalizeFunction(this.jsonObj.nodes);
  }    
  
  parseToJson(data) {
    console.log(data);
    let res = [];
    // toOther is the sum of everything besides top limit
    let toOther = data.summaryData.totals[0];
    // forEach through the data.rows to store links into JSON
    data.rows.forEach(element => {
        // remove the top limit from total value
        toOther = toOther - element.data[0];
        // store to JSON
        this.jsonObj.links.push({
            source: this.indexMap.get(data.fromPage),
            target: this.indexMap.get(element.value),
            value: parseInt(element.data[0])
        });
    });
    // store link to OTHER into JSON
    if (toOther) {
      this.jsonObj.links.push({
            source: this.indexMap.get(data.fromPage),
            target: this.indexMap.get(this.other),
            value: toOther
        });
    }

    //normalize the edges
    this.normalizeEdgeFunction(this.jsonObj.links);
    return res;
}

  loadToJson(results) {
    this.jsonObj.links.push(results);
  }

  normalizeFunction(arr) {
    let max = arr[0].volume > arr[arr.length-1].volume ? arr[0].volume: arr[arr.length-1].volume
    let scale = d3.scaleLinear().domain([0, max]).range([200, 1000]);
    for (var i in arr) {
        arr[i].normalizeVolume = scale(arr[i].volume);
    }
  }

  normalizeEdgeFunction(arr) {
    const max = arr[0].value;
    let scale = d3.scaleLinear().domain([0, max]).range([0, 12]);
    for (var i in arr) {
        arr[i].normalizeValue = scale(arr[i].value);
    }
  }

}