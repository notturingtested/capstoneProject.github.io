import React from 'react';
//import ReactDOM from 'react-dom';
import './App.css';
import './UpdateWindow'; 
import VegaChartContainer from './src/charts/VegaChartContainer'; 
//import VegaDataFormatter from './src/charts/VegaDataFormatter';  

// TODO: Delete later on...
import {miserables, pages} from './TempData'; 
const apiCaller = require('api/main');
const vega = window.vega;  

class App extends React.Component {
  constructor(props) {
    super(props);

    this._chartContainerRef = React.createRef();

    this.state = {
      isVizPrepped: false,
      data: [],
      startDate: "2019-01-01",
      endDate: "2021-01-01",
      username: "tsaizhihao",
      companyName: "OBU Eng SC", 
      APIToken: "Bearer SC:f11f6dc274d9e488d728ff413aa415363654e17ef257aaeb7e78a1535956d451",
      errorMessage: "", 
      dimension: "variables/page",
      prefetchedData: "miserables",
      loadPreviousRequest: false,
      limit: 10,
      loading: false
    }

    this.setEventTargetValue = this.setEventTargetValue.bind(this); 
    this.setEventTargetValueNum = this.setEventTargetValueNum.bind(this); 
    this.setIncrememtalLimit = this.setIncrememtalLimit.bind(this); 
    this.setDimension = this.setDimension.bind(this); 
    this.setPrefetchedData = this.setPrefetchedData.bind(this); 

    this.expandGraph = this._expandGraph.bind(this);

    vega.expressionFunction("loadMore", this.expandGraph);

    document.body.className = 'light-theme'; 
  }

  componentDidUpdate(prevProps, prevState) {
    // Note: For now this will always re-render when the data array updates, 
    // even if the information in data is the same (which is ok, since the 
    // user wants to make a new request each time). 
    if (prevState.data !== this.state.data) {
      this._displayChart(); 
    }
  }

  // Used for <input /> fields.
  setEventTargetValue(event, value) {
    const name = event.target.name; 
    let stateValue = value ? value : event.target.value; 
    this.setState({[name]: stateValue});
  }

  setIncrememtalLimit(event) {
    const value = parseInt(event.target.value, 10); 

    if (value < 10 || value > 100) {
      this.setState({errorMessage: "Node count must be between 10 and 100."});
    }
    else {
      this.setEventTargetValue(event, value); 
    }
  }

  setEventTargetValueNum(event) {
    const value = parseInt(event.target.value, 10); 
    this.setEventTargetValue(event, value); 
  }

  setDimension(event) {
    this.setState({dimension: event.target.value}); 
  }

  setPrefetchedData(event) {
    this.setState({prefetchedData: event.target.value}); 
  }

  //////////////////////////////////////////////////////////////// Start Mock Functions

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
    this.setState({loading: true});
    let missingFieldMessage = ""; 
    if (!this.state.startDate || !this.state.endDate || !this.state.username || 
        !this.state.companyName || !this.state.APIToken) {
          missingFieldMessage = "Please fill in all fields to build a new graph.";
          this.setState({errorMessage: missingFieldMessage});
          return; 
    }

    const dateRange = this.getDateRange(this.state.startDate, this.state.endDate); 
    let apiData = await apiCaller.getData(this.state.APIToken, this.state.companyName, this.state.username, dateRange, this.state.dimension, this.state.limit); 
    let objApiData = JSON.parse(apiData); 

    const vegaData = [{
      "name": "node-data",
      "values": objApiData.nodes
    },
    {
      "name": "link-data",
      "values": objApiData.links
    }];

    console.log("API_DATA");
    console.log(vegaData);

    setTimeout(() => this.setState({data: vegaData, errorMessage: missingFieldMessage, loading: false}), 500);
  }

  getDateRange(startTime, endTime) {
    let startTimeIso = new Date(startTime).toISOString().slice(0, -1); 
    let endTimeIso = new Date(endTime).toISOString().slice(0, -1);
    return startTimeIso + "/" + endTimeIso; 
  }

  // TODO: There should be a simpler way to handle setting/toggling state. 
  _toggleRequestType() {
    this.setState({loadPreviousRequest: !this.state.loadPreviousRequest}); 
  }

  _expandGraph() {
    console.log("node clicked");
    if (this.state.limit + 10 > 100) {
      this.setState({errorMessage: "The graph cannot be extended past 100 nodes."}); 
    }
    else {
      this.setState({ limit: this.state.limit + 10 },() => this._makeApiRequest());
    }
  }

  _setCorrespondingPrefetchedData() {
    let prefetchedData = this.state.prefetchedData; 
    switch(prefetchedData) {
      case "miserables": 
        this.setState({data: miserables});
        break; 
      case "pages": 
        this.setState({data: pages}); 
        break; 
      default: 
        throw new Error("No corresponding prefetched dataset.")
    }
  }

  _nodeTooltipContent({data}, {links}) {
    // TODO (Zach): add const {data} = d; for website version. 

    //console.log("LINK DATA IN NODE!!!");
    //console.log(links); 

    return (
      `<div class="an-Pathing-tooltipHeader">
        <div class="an-Pathing-tooltipTitle">Entry - Name: ${data.name}</div>
          <div class="an-Pathing-tooltipLineItem">
            <div class="an-Pathing-lineItemValues">
              <span class="an-Pathing-lineItemValue">Volume: ${data.volume}</span>
            </div>
          </div>
        </div>
      </div>`
    );
      /*
    const contentDiv = document.createElement('div');
    
		ReactDOM.render(
			<h1>${data.name}</h1>,
			contentDiv,
		);

    return contentDiv;
    */ 
  }

  _getVizOpts() {
    return {
      isLegendEnabled: this._fakeIsLegendEnabled,
      // Similar to the 'lineTooltipContent' in the 'LineReportlet.js' class.
      nodeTooltipContent: this._nodeTooltipContent
    }; 
  }

  render() {
    // Build hard coded colors.
    const colors = this._buildHardCodedColors();

    let mainCode;

    let loadMore;
    if (this.state.loadPreviousRequest) {
      loadMore = (<div/>);
    } else {
      loadMore = (
        <button onClick={() => this._expandGraph()}>
          Load More Nodes
        </button>
      )
    }

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
            opts={this._getVizOpts()}
          />
          {!this.state.loadPreviousRequest ? 
            <form>
              <label>Start Date:
                <input type="date" id="start" name="startDate"
                        value={this.state.startDate}
                        onChange={this.setEventTargetValue}
                        min="2018-01-01" max="2021-12-31"/>
              </label>
              <br/>
              <label>End Date:
                <input type="date" id="end" name="endDate"
                        value={this.state.endDate}
                        onChange={this.setEventTargetValue}
                        min="2018-01-01" max="2021-12-31"/>
              </label>
              <br/>
              <label>Company Name:
                <input type="text" name="companyName"
                        value={this.state.comapnyName}
                        defaultValue="OBU Eng SC"
                        onChange={this.setEventTargetValue}/>
              </label>
              <br/>
              <label>User Name:
                <input type="text" id="name" name="userName"
                        value={this.state.name}
                        defaultValue="tsaizhihao"
                        onChange={this.setEventTargetValue}/>
              </label>
              <br/>
              <label>API token:
                <input type="password" id="APIToken" name="APIToken"
                        minLength="0" required value={this.state.APIToken} onChange={this.setEventTargetValue}/>
              </label>
              <br/>
              <label>Dimension:
                <select value={this.state.value} id="dimension" onChange={this.setDimension}>
                  <option value="variables/page">Page</option>
                  <option value="variables/browser">Browser</option>
                  <option value="variables/product">Product</option>
                  <option value="variables/daterangeday">Day</option>
                  <option value="variables/evar9">Gender</option>
                </select>
              </label>
              <br/>
              <label>Number Nodes:
                <input type="number" name="limit" value={this.state.limit} id="limit" onChange={this.setIncrememtalLimit}/>
              </label>
            </form> : 
            <label>Dimension:
            <select value={this.state.value} id="prefetched visualization" onChange={this.setPrefetchedData}>
              <option value="miserables">Les Miserables</option>
              <option value="pages">Page</option>
            </select>
          </label>} 
          <button onClick={() => this._toggleRequestType()}>
            {this.state.loadPreviousRequest ? "Load from Dynamic Request" : "Load from Pre-Fetched Request"}
          </button>
          <button onClick={() => {!this.state.loadPreviousRequest ? this._makeApiRequest() : this._setCorrespondingPrefetchedData()}}>
            Build Graph
          </button>
          {loadMore}
          <h3>{this.state.errorMessage}</h3>
          {this.state.loading ?
            <p>Loading...</p> :
            <div id="Viz-Display-Area"/>
          }
          <div id="Bottom-Area"/>
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
