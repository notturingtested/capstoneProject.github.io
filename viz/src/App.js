import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import VegaChartContainer from './src/charts/VegaChartContainer'; 
import VegaDataFormatter from './src/charts/VegaDataFormatter';  
import embed from 'vega-embed';

// TODO: Delete later on...
import {miserables, pages} from './TempData'; 
const apiCaller = require('api/main'); 
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
      dimension: "variables/page",
      prefetchedData: "miserables",
      loadPreviousRequest: false,
      limit: 100
    }

    this.setEnd = this.setEnd.bind(this);
    this.setStart = this.setStart.bind(this);
    this.setAPI = this.setAPI.bind(this);
    this.setCompanyName = this.setCompanyName.bind(this); 
    this.setName = this.setName.bind(this);
    this.setDimension = this.setDimension.bind(this); 
    this.setPrefetchedData = this.setPrefetchedData.bind(this); 
    this.setLimit = this.setLimit.bind(this);
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

  setPrefetchedData(event) {
    this.setState({prefetchedData: event.target.value}); 
  }

  setLimit(event) {
    this.setState({limit: event.target.value});
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

    setTimeout(() => this.setState({data: vegaData, errorMessage: missingFieldMessage}), 500);
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
          {!this.state.loadPreviousRequest ? 
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
                  <option value="variables/browser">Browser</option>
                  <option value="variables/product">Product</option>
                  <option value="variables/daterangeday">Day</option>
                  <option value="variables/evar9">Gender</option>
                </select>
              </label>
              <br/>
              <label>Number Nodes:
                <input type="number" name="limit" value={this.state.limit} id="limit" onChange={this.setLimit}/>
              </label>
            </form> : null} 
          {this.state.loadPreviousRequest ? 
            <label>Dimension:
            <select value={this.state.value} id="prefetched visualization" onChange={this.setPrefetchedData}>
              <option value="miserables">Les Miserables</option>
              <option value="pages">Page</option>
            </select>
          </label>
           : null} 
          <button onClick={() => this._toggleRequestType()}>
            {this.state.loadPreviousRequest ? "Load from Dynamic Request" : "Load from Pre-Fetched Request"}
          </button>
          <button onClick={() => {!this.state.loadPreviousRequest ? this._makeApiRequest() : this._setCorrespondingPrefetchedData()}}>
            Build Graph
          </button> 
          <h3>{this.state.errorMessage}</h3>
          <div id="Viz-Display-Area"/>
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

