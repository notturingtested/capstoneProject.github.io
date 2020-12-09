import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import VegaChartContainer from './src/charts/VegaChartContainer'; 
import VegaDataFormatter from './src/charts/VegaDataFormatter'; 
import embed from 'vega-embed';
const apiCaller = require('api/app'); 
var vega = require('vega'); 
window.vega = vega; 
window.vegaEmbed = embed;

class App extends React.Component {
  constructor(props) {
    super(props);

    this._chartContainerRef = React.createRef();

    this.state = {
      isVizPrepped: false,
      data: [],
      startDate: "",
      endDate: "",
      username: "",
      companyName: "", 
      APIToken: "",
      errorMessage: "", 
      dimension: "variables/page"
    }

    this.setEnd = this.setEnd.bind(this);
    this.setStart = this.setStart.bind(this);
    this.setAPI = this.setAPI.bind(this);
    this.setCompanyName = this.setCompanyName.bind(this); 
    this.setName = this.setName.bind(this);
    this.setDimension = this.setDimension.bind(this); 
  }

  componentDidUpdate(prevProps, prevState) {
    // Note: For now this will always re-render when the data array updates, 
    // even if the information in data is the same (which is ok, since the 
    // user wants to make a new request each time). 
    if (prevState.data !== this.state.data) {
      this._displayChart(); 
    }
  }

  setEnd(event) {
    this.setState({endDate: event.target.value});
  }

  setStart(event) {
    this.setState({startDate: event.target.value});
  }

  setAPI(event) {
    this.setState({APIToken: event.target.value});
  }
  
  setCompanyName(event) {
    this.setState({companyName: event.target.value});
  }

  setName(event) {
    this.setState({username: event.target.value});
  }

  setDimension(event) {
    this.setState({dimension: event.target.value}); 
  }

  //////////////////////////////////////////////////////////////// Start Mock Functions...

  // Note: We are not dealing with data conversion yet (Adobe may handle this later on). 
  _buildFakeData() {
    const numDataSets = 5;
    let data = []; 
    for (let i = 0; i < numDataSets; ++i) {
      let rawDataSet = {
        data: [], 
        y: []
      }; 

      rawDataSet.data.push({"Hello": "World!"})
      data.push(rawDataSet);
    }
  }

  _buildHardCodedColors() {
    let colors = []; 
    let NUM_HARDCODED_COLORS = 8; 

    // Just push the same color for now.  
    for (let i = 0; i < NUM_HARDCODED_COLORS; ++i) {
      colors.push("#3683BB"); 
    }

    return colors; 
  }

  _fakeIsLegendEnabled = () => {
    return true; 
  }

  //////////////////////////////////////////////////////////////// End Mock Functions.  

  async _buildInitialVisualization() {
    // Wait to import until vega is accessible.
    await import('./src/charts/ForceDirected/ForceDirected');
    this.setState({isVizPrepped: true});
  }

  _displayChart() {
    this._chartContainerRef.current.draw(document.getElementById("Viz-Display-Area"));
  }

  async _makeApiRequest() {
    let missingFieldMessage = ""; 
    
    const allFields = this.state.startDate + this.state.endDate + this.state.username + this.state.companyName + this.state.APIToken + this.state.dimension;
    console.log(allFields);

    if (!this.state.startDate || !this.state.endDate || !this.state.username || 
        !this.state.companyName || !this.state.APIToken) {
          missingFieldMessage = "Please fill in all fields to build a new graph.";
          this.setState({errorMessage: missingFieldMessage});
          return; 
    }

    const dateRange = this.getDateRange(this.state.startDate, this.state.endDate); 
    console.log(dateRange); 
    //let apiData = await apiCaller.getRequest(this.state.APIToken, this.state.companyName, this.state.username, dateRange, this.state.dimension); 
    //console.log(apiData); 

    const data = [{
      "name": "node-data",
      "values": [{
        "name": "Myriel",
        "group": 1,
        "index": 0
    }, {
        "name": "Napoleon",
        "group": 1,
        "index": 1
    }, {
        "name": "Mlle.Baptistine",
        "group": 1,
        "index": 2
    }, {
        "name": "Mme.Magloire",
        "group": 1,
        "index": 3
    }, {
        "name": "CountessdeLo",
        "group": 1,
        "index": 4
    }, {
        "name": "Geborand",
        "group": 1,
        "index": 5
    }, {
        "name": "Champtercier",
        "group": 1,
        "index": 6
    }, {
        "name": "Cravatte",
        "group": 1,
        "index": 7
    }, {
        "name": "Count",
        "group": 1,
        "index": 8
    }, {
        "name": "OldMan",
        "group": 1,
        "index": 9
    }, {
        "name": "Labarre",
        "group": 2,
        "index": 10
    }, {
        "name": "Valjean",
        "group": 2,
        "index": 11
    }, {
        "name": "Marguerite",
        "group": 3,
        "index": 12
    }, {
        "name": "Mme.deR",
        "group": 2,
        "index": 13
    }, {
        "name": "Isabeau",
        "group": 2,
        "index": 14
    }, {
        "name": "Gervais",
        "group": 2,
        "index": 15
    }, {
        "name": "Tholomyes",
        "group": 3,
        "index": 16
    }, {
        "name": "Listolier",
        "group": 3,
        "index": 17
    }, {
        "name": "Fameuil",
        "group": 3,
        "index": 18
    }, {
        "name": "Blacheville",
        "group": 3,
        "index": 19
    }, {
        "name": "Favourite",
        "group": 3,
        "index": 20
    }, {
        "name": "Dahlia",
        "group": 3,
        "index": 21
    }, {
        "name": "Zephine",
        "group": 3,
        "index": 22
    }, {
        "name": "Fantine",
        "group": 3,
        "index": 23
    }, {
        "name": "Mme.Thenardier",
        "group": 4,
        "index": 24
    }, {
        "name": "Thenardier",
        "group": 4,
        "index": 25
    }, {
        "name": "Cosette",
        "group": 5,
        "index": 26
    }, {
        "name": "Javert",
        "group": 4,
        "index": 27
    }, {
        "name": "Fauchelevent",
        "group": 0,
        "index": 28
    }, {
        "name": "Bamatabois",
        "group": 2,
        "index": 29
    }, {
        "name": "Perpetue",
        "group": 3,
        "index": 30
    }, {
        "name": "Simplice",
        "group": 2,
        "index": 31
    }, {
        "name": "Scaufflaire",
        "group": 2,
        "index": 32
    }, {
        "name": "Woman1",
        "group": 2,
        "index": 33
    }, {
        "name": "Judge",
        "group": 2,
        "index": 34
    }, {
        "name": "Champmathieu",
        "group": 2,
        "index": 35
    }, {
        "name": "Brevet",
        "group": 2,
        "index": 36
    }, {
        "name": "Chenildieu",
        "group": 2,
        "index": 37
    }, {
        "name": "Cochepaille",
        "group": 2,
        "index": 38
    }, {
        "name": "Pontmercy",
        "group": 4,
        "index": 39
    }, {
        "name": "Boulatruelle",
        "group": 6,
        "index": 40
    }, {
        "name": "Eponine",
        "group": 4,
        "index": 41
    }, {
        "name": "Anzelma",
        "group": 4,
        "index": 42
    }, {
        "name": "Woman2",
        "group": 5,
        "index": 43
    }, {
        "name": "MotherInnocent",
        "group": 0,
        "index": 44
    }, {
        "name": "Gribier",
        "group": 0,
        "index": 45
    }, {
        "name": "Jondrette",
        "group": 7,
        "index": 46
    }, {
        "name": "Mme.Burgon",
        "group": 7,
        "index": 47
    }, {
        "name": "Gavroche",
        "group": 8,
        "index": 48
    }, {
        "name": "Gillenormand",
        "group": 5,
        "index": 49
    }, {
        "name": "Magnon",
        "group": 5,
        "index": 50
    }, {
        "name": "Mlle.Gillenormand",
        "group": 5,
        "index": 51
    }, {
        "name": "Mme.Pontmercy",
        "group": 5,
        "index": 52
    }, {
        "name": "Mlle.Vaubois",
        "group": 5,
        "index": 53
    }, {
        "name": "Lt.Gillenormand",
        "group": 5,
        "index": 54
    }, {
        "name": "Marius",
        "group": 8,
        "index": 55
    }, {
        "name": "BaronessT",
        "group": 5,
        "index": 56
    }, {
        "name": "Mabeuf",
        "group": 8,
        "index": 57
    }, {
        "name": "Enjolras",
        "group": 8,
        "index": 58
    }, {
        "name": "Combeferre",
        "group": 8,
        "index": 59
    }, {
        "name": "Prouvaire",
        "group": 8,
        "index": 60
    }, {
        "name": "Feuilly",
        "group": 8,
        "index": 61
    }, {
        "name": "Courfeyrac",
        "group": 8,
        "index": 62
    }, {
        "name": "Bahorel",
        "group": 8,
        "index": 63
    }, {
        "name": "Bossuet",
        "group": 8,
        "index": 64
    }, {
        "name": "Joly",
        "group": 8,
        "index": 65
    }, {
        "name": "Grantaire",
        "group": 8,
        "index": 66
    }, {
        "name": "MotherPlutarch",
        "group": 9,
        "index": 67
    }, {
        "name": "Gueulemer",
        "group": 4,
        "index": 68
    }, {
        "name": "Babet",
        "group": 4,
        "index": 69
    }, {
        "name": "Claquesous",
        "group": 4,
        "index": 70
    }, {
        "name": "Montparnasse",
        "group": 4,
        "index": 71
    }, {
        "name": "Toussaint",
        "group": 5,
        "index": 72
    }, {
        "name": "Child1",
        "group": 10,
        "index": 73
    }, {
        "name": "Child2",
        "group": 10,
        "index": 74
    }, {
        "name": "Brujon",
        "group": 4,
        "index": 75
    }, {
        "name": "Mme.Hucheloup",
        "group": 8,
        "index": 76
    }]
    },
    {
      "name": "link-data",
      "values": [{
        "source": 0,
        "target": 1,
        "value": 20
    }, {
        "source": 1,
        "target": 0,
        "value": 1
    }, {
        "source": 2,
        "target": 0,
        "value": 8
    }, {
        "source": 3,
        "target": 0,
        "value": 10
    }, {
        "source": 3,
        "target": 2,
        "value": 6
    }, {
        "source": 4,
        "target": 0,
        "value": 1
    }, {
        "source": 5,
        "target": 0,
        "value": 1
    }, {
        "source": 6,
        "target": 0,
        "value": 1
    }, {
        "source": 7,
        "target": 0,
        "value": 1
    }, {
        "source": 8,
        "target": 0,
        "value": 2
    }, {
        "source": 9,
        "target": 0,
        "value": 1
    }, {
        "source": 11,
        "target": 10,
        "value": 1
    }, {
        "source": 11,
        "target": 3,
        "value": 3
    }, {
        "source": 11,
        "target": 2,
        "value": 3
    }, {
        "source": 11,
        "target": 0,
        "value": 5
    }, {
        "source": 12,
        "target": 11,
        "value": 1
    }, {
        "source": 13,
        "target": 11,
        "value": 1
    }, {
        "source": 14,
        "target": 11,
        "value": 1
    }, {
        "source": 15,
        "target": 11,
        "value": 1
    }, {
        "source": 17,
        "target": 16,
        "value": 4
    }, {
        "source": 18,
        "target": 16,
        "value": 4
    }, {
        "source": 18,
        "target": 17,
        "value": 4
    }, {
        "source": 19,
        "target": 16,
        "value": 4
    }, {
        "source": 19,
        "target": 17,
        "value": 4
    }, {
        "source": 19,
        "target": 18,
        "value": 4
    }, {
        "source": 20,
        "target": 16,
        "value": 3
    }, {
        "source": 20,
        "target": 17,
        "value": 3
    }, {
        "source": 20,
        "target": 18,
        "value": 3
    }, {
        "source": 20,
        "target": 19,
        "value": 4
    }, {
        "source": 21,
        "target": 16,
        "value": 3
    }, {
        "source": 21,
        "target": 17,
        "value": 3
    }, {
        "source": 21,
        "target": 18,
        "value": 3
    }, {
        "source": 21,
        "target": 19,
        "value": 3
    }, {
        "source": 21,
        "target": 20,
        "value": 5
    }, {
        "source": 22,
        "target": 16,
        "value": 3
    }, {
        "source": 22,
        "target": 17,
        "value": 3
    }, {
        "source": 22,
        "target": 18,
        "value": 3
    }, {
        "source": 22,
        "target": 19,
        "value": 3
    }, {
        "source": 22,
        "target": 20,
        "value": 4
    }, {
        "source": 22,
        "target": 21,
        "value": 4
    }, {
        "source": 23,
        "target": 16,
        "value": 3
    }, {
        "source": 23,
        "target": 17,
        "value": 3
    }, {
        "source": 23,
        "target": 18,
        "value": 3
    }, {
        "source": 23,
        "target": 19,
        "value": 3
    }, {
        "source": 23,
        "target": 20,
        "value": 4
    }, {
        "source": 23,
        "target": 21,
        "value": 4
    }, {
        "source": 23,
        "target": 22,
        "value": 4
    }, {
        "source": 23,
        "target": 12,
        "value": 2
    }, {
        "source": 23,
        "target": 11,
        "value": 9
    }, {
        "source": 24,
        "target": 23,
        "value": 2
    }, {
        "source": 24,
        "target": 11,
        "value": 7
    }, {
        "source": 25,
        "target": 24,
        "value": 13
    }, {
        "source": 25,
        "target": 23,
        "value": 1
    }, {
        "source": 25,
        "target": 11,
        "value": 12
    }, {
        "source": 26,
        "target": 24,
        "value": 4
    }, {
        "source": 26,
        "target": 11,
        "value": 31
    }, {
        "source": 26,
        "target": 16,
        "value": 1
    }, {
        "source": 26,
        "target": 25,
        "value": 1
    }, {
        "source": 27,
        "target": 11,
        "value": 17
    }, {
        "source": 27,
        "target": 23,
        "value": 5
    }, {
        "source": 27,
        "target": 25,
        "value": 5
    }, {
        "source": 27,
        "target": 24,
        "value": 1
    }, {
        "source": 27,
        "target": 26,
        "value": 1
    }, {
        "source": 28,
        "target": 11,
        "value": 8
    }, {
        "source": 28,
        "target": 27,
        "value": 1
    }, {
        "source": 29,
        "target": 23,
        "value": 1
    }, {
        "source": 29,
        "target": 27,
        "value": 1
    }, {
        "source": 29,
        "target": 11,
        "value": 2
    }, {
        "source": 30,
        "target": 23,
        "value": 1
    }, {
        "source": 31,
        "target": 30,
        "value": 2
    }, {
        "source": 31,
        "target": 11,
        "value": 3
    }, {
        "source": 31,
        "target": 23,
        "value": 2
    }, {
        "source": 31,
        "target": 27,
        "value": 1
    }, {
        "source": 32,
        "target": 11,
        "value": 1
    }, {
        "source": 33,
        "target": 11,
        "value": 2
    }, {
        "source": 33,
        "target": 27,
        "value": 1
    }, {
        "source": 34,
        "target": 11,
        "value": 3
    }, {
        "source": 34,
        "target": 29,
        "value": 2
    }, {
        "source": 35,
        "target": 11,
        "value": 3
    }, {
        "source": 35,
        "target": 34,
        "value": 3
    }, {
        "source": 35,
        "target": 29,
        "value": 2
    }, {
        "source": 36,
        "target": 34,
        "value": 2
    }, {
        "source": 36,
        "target": 35,
        "value": 2
    }, {
        "source": 36,
        "target": 11,
        "value": 2
    }, {
        "source": 36,
        "target": 29,
        "value": 1
    }, {
        "source": 37,
        "target": 34,
        "value": 2
    }, {
        "source": 37,
        "target": 35,
        "value": 2
    }, {
        "source": 37,
        "target": 36,
        "value": 2
    }, {
        "source": 37,
        "target": 11,
        "value": 2
    }, {
        "source": 37,
        "target": 29,
        "value": 1
    }, {
        "source": 38,
        "target": 34,
        "value": 2
    }, {
        "source": 38,
        "target": 35,
        "value": 2
    }, {
        "source": 38,
        "target": 36,
        "value": 2
    }, {
        "source": 38,
        "target": 37,
        "value": 2
    }, {
        "source": 38,
        "target": 11,
        "value": 2
    }, {
        "source": 38,
        "target": 29,
        "value": 1
    }, {
        "source": 39,
        "target": 25,
        "value": 1
    }, {
        "source": 40,
        "target": 25,
        "value": 1
    }, {
        "source": 41,
        "target": 24,
        "value": 2
    }, {
        "source": 41,
        "target": 25,
        "value": 3
    }, {
        "source": 42,
        "target": 41,
        "value": 2
    }, {
        "source": 42,
        "target": 25,
        "value": 2
    }, {
        "source": 42,
        "target": 24,
        "value": 1
    }, {
        "source": 43,
        "target": 11,
        "value": 3
    }, {
        "source": 43,
        "target": 26,
        "value": 1
    }, {
        "source": 43,
        "target": 27,
        "value": 1
    }, {
        "source": 44,
        "target": 28,
        "value": 3
    }, {
        "source": 44,
        "target": 11,
        "value": 1
    }, {
        "source": 45,
        "target": 28,
        "value": 2
    }, {
        "source": 47,
        "target": 46,
        "value": 1
    }, {
        "source": 48,
        "target": 47,
        "value": 2
    }, {
        "source": 48,
        "target": 25,
        "value": 1
    }, {
        "source": 48,
        "target": 27,
        "value": 1
    }, {
        "source": 48,
        "target": 11,
        "value": 1
    }, {
        "source": 49,
        "target": 26,
        "value": 3
    }, {
        "source": 49,
        "target": 11,
        "value": 2
    }, {
        "source": 50,
        "target": 49,
        "value": 1
    }, {
        "source": 50,
        "target": 24,
        "value": 1
    }, {
        "source": 51,
        "target": 49,
        "value": 9
    }, {
        "source": 51,
        "target": 26,
        "value": 2
    }, {
        "source": 51,
        "target": 11,
        "value": 2
    }, {
        "source": 52,
        "target": 51,
        "value": 1
    }, {
        "source": 52,
        "target": 39,
        "value": 1
    }, {
        "source": 53,
        "target": 51,
        "value": 1
    }, {
        "source": 54,
        "target": 51,
        "value": 2
    }, {
        "source": 54,
        "target": 49,
        "value": 1
    }, {
        "source": 54,
        "target": 26,
        "value": 1
    }, {
        "source": 55,
        "target": 51,
        "value": 6
    }, {
        "source": 55,
        "target": 49,
        "value": 12
    }, {
        "source": 55,
        "target": 39,
        "value": 1
    }, {
        "source": 55,
        "target": 54,
        "value": 1
    }, {
        "source": 55,
        "target": 26,
        "value": 21
    }, {
        "source": 55,
        "target": 11,
        "value": 19
    }, {
        "source": 55,
        "target": 16,
        "value": 1
    }, {
        "source": 55,
        "target": 25,
        "value": 2
    }, {
        "source": 55,
        "target": 41,
        "value": 5
    }, {
        "source": 55,
        "target": 48,
        "value": 4
    }, {
        "source": 56,
        "target": 49,
        "value": 1
    }, {
        "source": 56,
        "target": 55,
        "value": 1
    }, {
        "source": 57,
        "target": 55,
        "value": 1
    }, {
        "source": 57,
        "target": 41,
        "value": 1
    }, {
        "source": 57,
        "target": 48,
        "value": 1
    }, {
        "source": 58,
        "target": 55,
        "value": 7
    }, {
        "source": 58,
        "target": 48,
        "value": 7
    }, {
        "source": 58,
        "target": 27,
        "value": 6
    }, {
        "source": 58,
        "target": 57,
        "value": 1
    }, {
        "source": 58,
        "target": 11,
        "value": 4
    }, {
        "source": 59,
        "target": 58,
        "value": 15
    }, {
        "source": 59,
        "target": 55,
        "value": 5
    }, {
        "source": 59,
        "target": 48,
        "value": 6
    }, {
        "source": 59,
        "target": 57,
        "value": 2
    }, {
        "source": 60,
        "target": 48,
        "value": 1
    }, {
        "source": 60,
        "target": 58,
        "value": 4
    }, {
        "source": 60,
        "target": 59,
        "value": 2
    }, {
        "source": 61,
        "target": 48,
        "value": 2
    }, {
        "source": 61,
        "target": 58,
        "value": 6
    }, {
        "source": 61,
        "target": 60,
        "value": 2
    }, {
        "source": 61,
        "target": 59,
        "value": 5
    }, {
        "source": 61,
        "target": 57,
        "value": 1
    }, {
        "source": 61,
        "target": 55,
        "value": 1
    }, {
        "source": 62,
        "target": 55,
        "value": 9
    }, {
        "source": 62,
        "target": 58,
        "value": 17
    }, {
        "source": 62,
        "target": 59,
        "value": 13
    }, {
        "source": 62,
        "target": 48,
        "value": 7
    }, {
        "source": 62,
        "target": 57,
        "value": 2
    }, {
        "source": 62,
        "target": 41,
        "value": 1
    }, {
        "source": 62,
        "target": 61,
        "value": 6
    }, {
        "source": 62,
        "target": 60,
        "value": 3
    }, {
        "source": 63,
        "target": 59,
        "value": 5
    }, {
        "source": 63,
        "target": 48,
        "value": 5
    }, {
        "source": 63,
        "target": 62,
        "value": 6
    }, {
        "source": 63,
        "target": 57,
        "value": 2
    }, {
        "source": 63,
        "target": 58,
        "value": 4
    }, {
        "source": 63,
        "target": 61,
        "value": 3
    }, {
        "source": 63,
        "target": 60,
        "value": 2
    }, {
        "source": 63,
        "target": 55,
        "value": 1
    }, {
        "source": 64,
        "target": 55,
        "value": 5
    }, {
        "source": 64,
        "target": 62,
        "value": 12
    }, {
        "source": 64,
        "target": 48,
        "value": 5
    }, {
        "source": 64,
        "target": 63,
        "value": 4
    }, {
        "source": 64,
        "target": 58,
        "value": 10
    }, {
        "source": 64,
        "target": 61,
        "value": 6
    }, {
        "source": 64,
        "target": 60,
        "value": 2
    }, {
        "source": 64,
        "target": 59,
        "value": 9
    }, {
        "source": 64,
        "target": 57,
        "value": 1
    }, {
        "source": 64,
        "target": 11,
        "value": 1
    }, {
        "source": 65,
        "target": 63,
        "value": 5
    }, {
        "source": 65,
        "target": 64,
        "value": 7
    }, {
        "source": 65,
        "target": 48,
        "value": 3
    }, {
        "source": 65,
        "target": 62,
        "value": 5
    }, {
        "source": 65,
        "target": 58,
        "value": 5
    }, {
        "source": 65,
        "target": 61,
        "value": 5
    }, {
        "source": 65,
        "target": 60,
        "value": 2
    }, {
        "source": 65,
        "target": 59,
        "value": 5
    }, {
        "source": 65,
        "target": 57,
        "value": 1
    }, {
        "source": 65,
        "target": 55,
        "value": 2
    }, {
        "source": 66,
        "target": 64,
        "value": 3
    }, {
        "source": 66,
        "target": 58,
        "value": 3
    }, {
        "source": 66,
        "target": 59,
        "value": 1
    }, {
        "source": 66,
        "target": 62,
        "value": 2
    }, {
        "source": 66,
        "target": 65,
        "value": 2
    }, {
        "source": 66,
        "target": 48,
        "value": 1
    }, {
        "source": 66,
        "target": 63,
        "value": 1
    }, {
        "source": 66,
        "target": 61,
        "value": 1
    }, {
        "source": 66,
        "target": 60,
        "value": 1
    }, {
        "source": 67,
        "target": 57,
        "value": 3
    }, {
        "source": 68,
        "target": 25,
        "value": 5
    }, {
        "source": 68,
        "target": 11,
        "value": 1
    }, {
        "source": 68,
        "target": 24,
        "value": 1
    }, {
        "source": 68,
        "target": 27,
        "value": 1
    }, {
        "source": 68,
        "target": 48,
        "value": 1
    }, {
        "source": 68,
        "target": 41,
        "value": 1
    }, {
        "source": 69,
        "target": 25,
        "value": 6
    }, {
        "source": 69,
        "target": 68,
        "value": 6
    }, {
        "source": 69,
        "target": 11,
        "value": 1
    }, {
        "source": 69,
        "target": 24,
        "value": 1
    }, {
        "source": 69,
        "target": 27,
        "value": 2
    }, {
        "source": 69,
        "target": 48,
        "value": 1
    }, {
        "source": 69,
        "target": 41,
        "value": 1
    }, {
        "source": 70,
        "target": 25,
        "value": 4
    }, {
        "source": 70,
        "target": 69,
        "value": 4
    }, {
        "source": 70,
        "target": 68,
        "value": 4
    }, {
        "source": 70,
        "target": 11,
        "value": 1
    }, {
        "source": 70,
        "target": 24,
        "value": 1
    }, {
        "source": 70,
        "target": 27,
        "value": 1
    }, {
        "source": 70,
        "target": 41,
        "value": 1
    }, {
        "source": 70,
        "target": 58,
        "value": 1
    }, {
        "source": 71,
        "target": 27,
        "value": 1
    }, {
        "source": 71,
        "target": 69,
        "value": 2
    }, {
        "source": 71,
        "target": 68,
        "value": 2
    }, {
        "source": 71,
        "target": 70,
        "value": 2
    }, {
        "source": 71,
        "target": 11,
        "value": 1
    }, {
        "source": 71,
        "target": 48,
        "value": 1
    }, {
        "source": 71,
        "target": 41,
        "value": 1
    }, {
        "source": 71,
        "target": 25,
        "value": 1
    }, {
        "source": 72,
        "target": 26,
        "value": 2
    }, {
        "source": 72,
        "target": 27,
        "value": 1
    }, {
        "source": 72,
        "target": 11,
        "value": 1
    }, {
        "source": 73,
        "target": 48,
        "value": 2
    }, {
        "source": 74,
        "target": 48,
        "value": 2
    }, {
        "source": 74,
        "target": 73,
        "value": 3
    }, {
        "source": 75,
        "target": 69,
        "value": 3
    }, {
        "source": 75,
        "target": 68,
        "value": 3
    }, {
        "source": 75,
        "target": 25,
        "value": 3
    }, {
        "source": 75,
        "target": 48,
        "value": 1
    }, {
        "source": 75,
        "target": 41,
        "value": 1
    }, {
        "source": 75,
        "target": 70,
        "value": 1
    }, {
        "source": 75,
        "target": 71,
        "value": 1
    }, {
        "source": 76,
        "target": 64,
        "value": 1
    }, {
        "source": 76,
        "target": 65,
        "value": 1
    }, {
        "source": 76,
        "target": 66,
        "value": 1
    }, {
        "source": 76,
        "target": 63,
        "value": 1
    }, {
        "source": 76,
        "target": 62,
        "value": 1
    }, {
        "source": 76,
        "target": 48,
        "value": 1
    }, {
        "source": 76,
        "target": 58,
        "value": 1
    }]
  }]; 

    setTimeout(() => this.setState({data: data, errorMessage: missingFieldMessage}), 500);
  }

  getDateRange(startTime, endTime) {
    let startTimeIso = new Date(startTime).toISOString().slice(0, -1); 
    let endTimeIso = new Date(startTime).toISOString().slice(0, -1);
    return startTimeIso + "/" + endTimeIso; 
  }

  render() {
    // Build hard coded colors.
    const colors = this._buildHardCodedColors();

    let mainCode;

    if (!this.state.isVizPrepped) {
      mainCode = (
        <button onClick={() => this._buildInitialVisualization()}>
            Load visualization
        </button>
      );
    } else {
      mainCode = (
        <div>
          <VegaChartContainer
            ref={this._chartContainerRef}
            colors={colors}
            data={this.state.data}
            type='ForceDirected'
            opts={{isLegendEnabled: this._fakeIsLegendEnabled}}
          />
          <form>
            <label>Start Date:
              <input type="date" id="start" name="start"
                      value={this.state.startDate}
                      onChange={this.setStart}
                      min="2018-01-01" max="2021-12-31"/>
            </label>
            <br/>
            <label>End Date:
              <input type="date" id="end" name="end"
                      value={this.state.endDate}
                      onChange={this.setEnd}
                      min="2018-01-01" max="2021-12-31"/>
            </label>
            <br/>
            <label>Company Name:
              <input type="text" name="name"
                      value={this.state.comapnyName}
                      onChange={this.setCompanyName}/>
            </label>
            <br/>
            <label>User Name:
              <input type="text" id="name" name="name"
                      value={this.state.name}
                      onChange={this.setName}/>
            </label>
            <br/>
            <label>API token:
              <input type="password" id="APIToken" name="APIToken"
                      minLength="0" required value={this.state.APIToken} onChange={this.setAPI}/>
            </label>
            <br/>
            <label>Dimension:
              <select value={this.state.value} id="dimension" onChange={this.setDimension}>
                <option value="variables/page">Page</option>
              </select>
            </label>
          </form>
          <button onClick={() => this._makeApiRequest()}>
            Build Graph
          </button> 
          <h3>{this.state.errorMessage}</h3>
          <div id="Viz-Display-Area"/>
      </div>);
    }

    return (
      <div className="App">
        <h1>Force Directed Layout by Vega</h1>
        {mainCode}
      </div>
    );
  }
}

export default App;
