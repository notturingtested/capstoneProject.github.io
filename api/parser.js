module.exports = class parser {
  constructor() {
      this.simpleMap = new Map();
      this.count = 0;
      this.indexMap = new Map();
      this.other = "Other";
      this.indexMap.set(this.other, this.count++);
      this.allNodes = [];
      this.jsonObj = {
          nodes: [],
          links: []
      };
  }    
  
  parse(res) {
      // other is the sum of everything besides top 9
      let other = res.summaryData.totals[0];
      // forEach through the data.rows to store nodes into JSON
      res.rows.forEach(element => {
          this.indexMap.set(element.value, this.count++);
          // remove the top 9 from total value
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
      return this.simpleMap;
  }    
  
  parseToJson(fromPage, data) {
      // toOther is the sum of everything besides top 9
      let toOther = data.summaryData.totals[0];
      // forEach through the data.rows to store links into JSON
      data.rows.forEach(element => {
          // remove the top 9 from total value
          toOther = toOther - element.data[0];
          // store to JSON
          this.jsonObj.links.push({
              source: this.indexMap.get(fromPage),
              target: this.indexMap.get(element.value),
              value: parseInt(element.data[0])
          });
      });
      // store link to OTHER into JSON
      if (toOther) {
          this.jsonObj.links.push({
              source: this.indexMap.get(fromPage),
              target: this.indexMap.get(this.other),
              value: toOther
          });
      }
  }
}