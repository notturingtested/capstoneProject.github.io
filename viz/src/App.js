import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
//import './workflow-icons.css'; 
import './flow.scss';
import './UpdateWindow'; 
import VegaChartContainer from './src/charts/VegaChartContainer'; 
import {Button, defaultTheme, Flex, Grid, Item, Picker, Provider, Section, Text, TextField, View} from '@adobe/react-spectrum';
import WebPage from '@spectrum-icons/workflow/WebPage';
import GraphBarVertical from '@spectrum-icons/workflow/GraphBarVertical';
import Curate from '@spectrum-icons/workflow/Curate';
import {NumberField} from '@react-spectrum/numberfield';
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
      data: [],
      startDate: "2020-10-31",
      endDate: "2021-01-01",
      username: "zacharyyoung",
      companyName: "OBU Eng SC", 
      APIToken: "Bearer SC:fd42dbc25c8878d9f64a6e4e13d85e397e584ad29457d1ea558de864aebf9334",
      errorMessage: "", 
      dimension: "variables/page",
      prefetchedData: "miserables",
      loadPreviousRequest: false,
      limit: 10,
      loading: false,
      hasBuiltGraph: false,
      showPanel: false
    }

    this.setEventTargetValue = this.setEventTargetValue.bind(this); 
    this.setEventTargetValueNum = this.setEventTargetValueNum.bind(this); 
    this.setIncrememtalLimit = this.setIncrememtalLimit.bind(this); 
    this.setDimension = this.setDimension.bind(this); 
    this.setPrefetchedData = this.setPrefetchedData.bind(this); 
    this.setIncrememtalLimitValue = this.setIncrememtalLimitValue.bind(this); 
    this.setValue = this.setValue.bind(this); 

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

  //////////////////////////////////////////////////////////////// Start Setters

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

  setDimension(dimension) {
    this.setState({dimension: dimension}); 
  }

  setPrefetchedData(event) {
    this.setState({prefetchedData: event.target.value}); 
  }
  
  setIncrememtalLimitValue(limit) {
    const value = parseInt(limit, 10); 

    if (value < 10 || value > 100) {
      alert("Node count must be between 10 and 100.");
    }
    else {
      console.log("Setting limit: ", value); 
      this.setState({limit: limit}); 
      //this.setEventTargetValue(event, value); 
    }
  }

  setValue(state, value) {
    this.setState({[state]: value});
  }

  //////////////////////////////////////////////////////////////// End Setters

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

  //////////////////////////////////////////////////////////////// Start opts functions

  _getEdgesFromNode(node, links) {
    return links.filter(link => link.source.datum.index === node.index); 
  }

  _sortEdgesByVolume(links) {
    const compareLinks = function(linkA, linkB) {
      if (linkA.value < linkB.value) {
        return 1; 
      }

      if (linkA.value > linkB.value) {
        return -1; 
      }

      return 0; 
    }

    return links.sort(compareLinks);
  }

  _getTopVolumeEdges(node, links, numLinks, opts) {
    const sortedLinks = opts.sortEdges(opts.getEdges(node, links)); 
    return sortedLinks.slice(0, numLinks);    
  }

  // Note: This function is similar to the 'pointTooltipContent' in the LineReportlet class. 
  _nodeTooltipContent({data}, {links}, swatchColors) {
    // TODO (Zach): add const {data} = d; for website version. 

    let tooltipTopData = 
      <div className="an-Pathing-tooltip">
        <div className="an-Pathing-tooltipHeader">
          <div className="an-Pathing-tooltipTitle">Name: {data.name}</div>
          <div className="an-Pathing-tooltipLineItem">
            <div className="an-Pathing-lineItemValues" style={{justifyContent: 'center'}}>
              <span className="an-Pathing-lineItemValue">Volume: {data.volume}</span>
            </div>
          </div>
        </div>
      </div>; 

    let tooltipData = tooltipTopData;  

    if (links.length > 0) {
      tooltipData = 
        <div>
          {tooltipTopData}
          <div className="an-Pathing-tooltipPaths">
            <div className="an-Pathing-tooltipTitle">Top {links.length} links from this node</div>
            {links.map((link, i) => { 
              return (
                <div key={links[i].target.datum.index} className="an-Pathing-tooltipLineItem">
                  <div className="an-Pathing-lineItemSwatch" style={{backgroundColor: swatchColors[i]}}>&nbsp;</div>
                    <div className="an-Pathing-lineItemValues" style={{fontSize: 10, textAlign: 'left'}}>
                    <span>{link.source.datum.name + "-" + link.target.datum.name + ": " + link.value}</span>
                  </div>
                </div>
              ); 
            })}  
          </div>
        </div>
    }
    else {
      tooltipData = 
        <div>
          {tooltipTopData}
          <div className="an-Pathing-tooltipPaths">
            <div className="an-Pathing-tooltipTitle">No links from this node</div>
          </div>
        </div>
    }

    const contentDiv = document.createElement('div');
    
		ReactDOM.render(
			tooltipData,
			contentDiv
		);

    return contentDiv; 
  }
  
  _getVizOpts() {
    return {
      isLegendEnabled: this._fakeIsLegendEnabled,
      getEdges: this._getEdgesFromNode, 
      sortEdges: this._sortEdgesByVolume, 
      swatchColors: [
        "rgb(38, 192, 199)", "rgb(81, 81, 211)", 
        "rgb(230, 134, 25)", "rgb(216, 55, 144)",
        "rgb(144, 141, 250)"
      ],
      // Similar to the 'lineTooltipContent' in the 'LineReportlet.js' class.
      nodeTooltipContent: this._nodeTooltipContent,
      getTopVolumeEdges: this._getTopVolumeEdges,
      allowSignalBinds: !this.state.showPanel
    }; 
  }

  //////////////////////////////////////////////////////////////// End opts functions

  //////////////////////////////////////////////////////////////// Start React/Graph functions

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

  //////////////////////////////////////////////////////////////// End React/Graph functions

  render() {
    const colors = this._buildHardCodedColors();
    
    //Build hard coded colors.
    if (this.state.showPanel) {
      return (
        <Provider theme={defaultTheme}>
          <VegaChartContainer
            ref={this._chartContainerRef}
            colors={colors}
            data={this.state.data}
            type='ForceDirected'
            opts={this._getVizOpts()}
          />
          <Flex direction="column"> 

            {/* Top Row */}
            <View height="size-600" backgroundColor="gray-900">
              <Flex height="size-600" direction="row" justifyContent="end" alignItems="center"> 
                <Button onClick={() => this.setState({showPanel: !this.state.showPanel})}>
                  Hide Panel
                </Button>
                <TextField
                    marginEnd="size-200"
                    label="Company"
                    labelPosition="side"
                    placeholder="Good Co."
                    width="size-2000"
                    value={this.state.companyName}
                    onChange={value => this.setValue("companyName", value)}
                />
                <TextField
                    marginEnd="size-200"
                    label="Username"
                    labelPosition="side"
                    placeholder="Cletus"
                    width="size-2000"
                    value={this.state.username}
                    onChange={value => this.setValue("username", value)}
                  />
                <TextField
                    marginEnd="size-200"
                    label="Auth Token"
                    labelPosition="side"
                    placeholder="123"
                    width="size-2000"
                    value={this.state.APIToken}
                    onChange={value => this.setValue("APIToken", value)}
                />
              </Flex>
            </View>

            {/* BYU Demo Row */}
            <View height="size-800" backgroundColor="gray-50" borderBottomWidth="thin" borderBottomColor="gray-300">
              <Flex height="size-800" direction="row" alignItems="center">
                <View gridArea="demo" marginStart="size-100">BYU DEMO</View>
              </Flex>
            </View>

            {/* Main Row */}
            <Flex height="size-6000" direction="row" alignItems="center">

              {/* Fake Task Bar */}
              <View height="size-6000" borderEndWidth="thin" borderEndColor="gray-300" backgroundColor="gray-50" width="size-700"> 
                <Flex height="100%" flex="column" width="size-700" direction="column" alignItems="center">
                  <View marginTop="size-100"><WebPage label="Webpage"/></View>
                  <View marginTop="size-100"><GraphBarVertical label="Graph Bar Vertical"/></View>
                  <View marginTop="size-100"><Curate label="Curate"/></View>
                </Flex>
              </View>

               {/* Specific Node Section */}
              <View height="size-6000" borderEndWidth="thin" borderEndColor="gray-300" backgroundColor="gray-50" width="size-3000"> 
                <Flex flex="column" height="100%" width="size-3000" direction="column" alignItems="center">
                  <View gridArea="demo" marginStart="size-50">BYU DEMO</View>
                  <View gridArea="demo" marginStart="size-50">BYU DEMO</View>
                  <View gridArea="demo" marginStart="size-50">BYU DEMO</View>
                </Flex>
              </View>

              {/* Main Panel Section */}
              <View backgroundColor="gray-150" flex> 
                <Flex flex="column" height="size-6000" direction="column" alignItems="center" justifyContent="center">
                  <View marginTop="size-800" borderRadius="medium" borderWidth="thick" borderColor="blue-500" gridArea="demo" width="96.5%" height="120%" backgroundColor="gray-50" marginStart="size-50">
                    <Flex direction="column" height="100%">
                      <View height="size-700" borderBottomWidth="thin" borderBottomColor="gray-300">
                        <Flex marginStart="size-250" marginEnd="size-150" height="100%" direction="row" justifyContent="space-between" alignItems="center">
                          <View fontSize="font-size-500">
                            <strong>Force Directed Panel</strong>
                          </View>
                          <Flex direction="row">
                            <View>
                              X
                            </View>
                          </Flex>
                        </Flex>
                      </View>
                      <View height="size-675" borderBottomWidth="thin" borderBottomColor="gray-300">
                        <Flex marginStart="size-150" marginEnd="size-150" height="100%" direction="row" justifyContent="end" alignItems="center">
                          <View>
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
                            </form>
                          </View>
                        </Flex>
                      </View>
                      <Flex height="size-5000" width="90%" alignItems="center" justifyContent="center" alignSelf="center">
                        <View height="90%" width="100%" borderWidth="thin" borderColor="gray-300">
                          {/*<Flex direction="row" alignItems="center" marginStart="size-100" marginTop="size-100">
                            <View height="size-100" width="size-100" borderRadius="medium" backgroundColor="blue-400" />
                            <View marginStart="size-200">Force Directed</View>
                            </Flex>*/}
                          { 
                            !this.state.hasBuiltGraph ? 
                              <Flex height="100%" direction="column" alignItems="center" justifyContent="center"> 
                              <View>Customize the Graph Below</View>
                              <Picker label="Dimension" onSelectionChange={this.setDimension}>
                                <Item key="variables/page">Page</Item>
                                <Item key="variables/browser">Browser</Item>
                                <Item key="variables/product">Product</Item>
                                <Item key="variables/daterangeday">Day</Item>
                                <Item key="variables/evar9">Gender</Item>
                              </Picker>
                              <NumberField label="Nodes" defaultValue={this.state.limit} maxValue="50" minValue="10" onChange={this.setIncrememtalLimitValue} />
                              <Button onPress={() => {this.setState({hasBuiltGraph: true}); this._makeApiRequest()}} marginTop="size-250" variant="primary">Build</Button> 
                              </Flex> : null
                          }
                          <div style={{marginTop: '0', height: '100%', width: '95%'}} id="Viz-Display-Area"/>
                        </View>
                      </Flex>
                    </Flex>
                  </View>
                </Flex>
              </View>
            </Flex>
            <View height="size-6000" backgroundColor="gray-150" /> 
          </Flex>
        </Provider>
      );
    }
    else {
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
                        defaultValue={this.state.username}
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
          <button onClick={() => this.setState({showPanel: !this.state.showPanel})}>
            Show panel
          </button>
          <h3>{this.state.errorMessage}</h3>
          {this.state.loading ?
            <p>Loading...</p> :
            <div id="Viz-Display-Area"/>
          }
          <div id="Bottom-Area"/>
      </div>);

      return (
        <div className="App">
          <h1>Force Directed Layout by Vega</h1>
          {mainCode}
        </div>
      );
    }
  }
}

export default App;
