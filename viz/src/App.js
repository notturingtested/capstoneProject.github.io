import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './UpdateWindow'; 
import VegaChartContainer from './src/charts/VegaChartContainer'; 
import VegaDataFormatter from './src/charts/VegaDataFormatter';  

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

/*
<div role="group" class="an-panel-subpanels">
  <div data-group="subpanels" class="an-subpanel-grid-wrapper">
    <div class="drop-target an-Grid-container" aria-label="Drop area" data-test-id="an-Grid-container-subPanels" style="min-height: 669px;">
      <div class="an-Grid-item an-Grid-item-sub-panel an-Grid-auto-size-true an-Grid-default-height-40 ui-draggable ui-resizable ui-resizable-autohide" data-model-id="5F9C69D5-282E-42CB-B6A4-38E4520D44E4" data-model-name="Flow" data-test-id="an-Grid-item-subPanels" style="width: 100%; left: 0%; top: 0px;">
        <section data-section-type="subpanel" id="5F9C69D5-282E-42CB-B6A4-38E4520D44E4" data-sub-panel-id="5F9C69D5-282E-42CB-B6A4-38E4520D44E4" class="an-Grid-item-content js-an-sub-panel js-panel-sub-panel an-sub-panel an-sub-panel--genericSubPanel an-sub-panel--Flow" aria-label="Visualization: Flow">
        <div class="sub-panel-header an-Grid-item-content-handle ui-draggable-handle"><header class="header-outer">
          <div class="left-content data-source-icon-wrapper"><svg viewBox="0 0 36 36" focusable="false" aria-hidden="true" role="img" class="spectrum-Icon spectrum-Icon--sizeXXS swatch-icon an-Grid-not-handle" data-test-id="data-source-settings-icon" data-tooltip="" data-test-icon="circle" style="color: rgb(38, 192, 199);">
            <circle cx="18" cy="18" r="16"></circle></svg></div>
              <div class="main-content-and-vizList-wrapper">
                <div class="main-content overflow-truncate">
                  <div class="overflow-truncate">
                    <div role="heading" aria-level="3" class="ad-content-editable an-sub-panel-title ad-content-presentation" value="Flow" placeholder="Flow">
                      <span data-test-id="content-editable-label" tabindex="0" class="ad-content-editable-label use-aa-focus-ring spectrum-Heading5" data-title="true" style="display: inline-block;"><label class="sr-only">Visualization name:</label>Flow</span>
                        <div style="display: none;"><input data-test-id="content-editable-input" class="ad-content-editable-input an-Grid-not-handle spectrum-Heading5" value="Flow" style="box-sizing: content-box; width: 2px;">
                          <div style="position: absolute; top: 0px; left: 0px; visibility: hidden; height: 0px; overflow: scroll; white-space: pre; font-size: 16px; font-family: adobe-clean, Helvetica, Arial, sans-serif; font-weight: 700; font-style: normal; letter-spacing: normal; text-transform: none;">Flow</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="right-content hide-for-print"><div class="status-label-VizList-wrapper"></div><div class="sub-panel-controls js-sub-panel-controls"><button data-test-id="subpanel-settings-button" aria-label="Visualization settings" class="spectrum-ActionButton spectrum-ActionButton--quiet an-Grid-not-handle js-settings-gear hide-for-editDisabled"><svg viewBox="0 0 36 36" focusable="false" aria-hidden="true" role="img" class="spectrum-Icon spectrum-Icon--sizeS" data-tooltip="Settings" data-test-icon="gear"><path d="M32.9 15.793h-3.111a11.934 11.934 0 0 0-1.842-4.507l2.205-2.206a1.1 1.1 0 0 0 0-1.56l-1.673-1.672a1.1 1.1 0 0 0-1.561 0l-2.205 2.2a11.935 11.935 0 0 0-4.507-1.841V3.1A1.1 1.1 0 0 0 19.1 2h-2.2a1.1 1.1 0 0 0-1.1 1.1v3.112a11.935 11.935 0 0 0-4.507 1.841l-2.205-2.2a1.1 1.1 0 0 0-1.561 0L5.848 7.52a1.1 1.1 0 0 0 0 1.56l2.205 2.205a11.934 11.934 0 0 0-1.842 4.507H3.1A1.1 1.1 0 0 0 2 16.9v2.2a1.1 1.1 0 0 0 1.1 1.1h3.111a11.932 11.932 0 0 0 1.841 4.507l-2.2 2.2a1.1 1.1 0 0 0 0 1.56l1.672 1.672a1.1 1.1 0 0 0 1.561 0l2.2-2.2a11.934 11.934 0 0 0 4.507 1.842V32.9A1.1 1.1 0 0 0 16.9 34h2.2a1.1 1.1 0 0 0 1.1-1.1v-3.112a11.934 11.934 0 0 0 4.507-1.842l2.2 2.2a1.1 1.1 0 0 0 1.561 0l1.672-1.672a1.1 1.1 0 0 0 0-1.56l-2.2-2.2a11.932 11.932 0 0 0 1.841-4.507H32.9A1.1 1.1 0 0 0 34 19.1v-2.2a1.1 1.1 0 0 0-1.1-1.107zM22.414 18A4.414 4.414 0 1 1 18 13.586 4.414 4.414 0 0 1 22.414 18z"></path></svg></button><button data-test-id="subpanel-collapse-expand-button" aria-label="Collapse visualization" class="spectrum-ActionButton spectrum-ActionButton--quiet an-Grid-not-handle hide-for-print subpanel-collapse-expand-button"><svg viewBox="0 0 48 48" focusable="false" aria-hidden="true" role="img" class="spectrum-Icon spectrum-Icon--sizeM" data-test-icon="accordionDown"><path d="M22.585 31.7L11.94 21.05a2 2 0 0 1 0-2.828l.282-.282a2.006 2.006 0 0 1 2.828 0L24 26.888l8.949-8.948a2.006 2.006 0 0 1 2.828 0l.282.282a2 2 0 0 1 0 2.828L25.414 31.7a2 2 0 0 1-2.829 0z"></path></svg></button><button data-test-id="close-subpanel-button" aria-label="Delete visualization" class="spectrum-ActionButton spectrum-ActionButton--quiet an-Grid-not-handle delete-chart an-Grid-not-handle"><svg viewBox="0 0 36 36" focusable="false" aria-hidden="true" role="img" class="spectrum-Icon spectrum-Icon--sizeS" data-tooltip="Delete visualization" data-test-icon="close"><path d="M26.485 6.686L18 15.172 9.515 6.686a1 1 0 0 0-1.414 0L6.686 8.1a1 1 0 0 0 0 1.414L15.172 18l-8.486 8.485a1 1 0 0 0 0 1.414L8.1 29.314a1 1 0 0 0 1.414 0L18 20.828l8.485 8.485a1 1 0 0 0 1.414 0l1.415-1.413a1 1 0 0 0 0-1.414L20.828 18l8.485-8.485a1 1 0 0 0 0-1.414L27.9 6.686a1 1 0 0 0-1.415 0z"></path></svg></button></div></div></header><div data-group="quill" class="ad-content-editable-block nopadding an-sub-panel-description an-Grid-not-handle" value="" placeholder="Description" id="1C2AEBB9-5711-4EB1-B19A-865C51968D4D" style="display: none;"></div><div></div><object style="display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; opacity: 0;" aria-hidden="true" tabindex="-1" data-focusable-ignore="true" type="text/html" data="about:blank"></object></div><div class="an-subpanel-contents" tabindex="0"><div class="an-Reportlet an-Flow" tabindex="-1"><div class="an-AlertList placement-top" style="top: 0px;"><span></span></div><div class="an-Flow"><div class="an-Chart"><div class="pathing-cv-info-wrapper"><div class="pathing-cv-wrapper cv-wrapper is-taller is-wider" style="width: 305px;"><div class="pathing-cv-container svg-wrapper" style="width: 320px; height: 584.365px;"><svg class="pathing-svg" style=""><g class="pathing-svg-container" transform="translate(30,80)"><g class="link-container" transform="translate(0,51.5)"><path class="link entry-path filter" d="M100,0C130,0 130,0 160,0v97.82349754133776C130,97.82349754133776 130,97.82349754133776 100,97.82349754133776Z"></path><path class="link entry-path filter" d="M100,97.82349754133776C130,97.82349754133776 130,131.82349754133776 160,131.82349754133776v7.21850614837015C122.78149385162985,139.0420036897079 122.78149385162985,105.04200368970791 100,105.04200368970791Z"></path><path class="link entry-path filter" d="M100,105.04200368970791C130,105.04200368970791 130,183.32349754133776 160,183.32349754133776v5.030528560945333C124.96947143905467,188.3540261022831 124.96947143905467,110.07253225065324 100,110.07253225065324Z"></path><path class="link entry-path filter" d="M100,110.07253225065324C130,110.07253225065324 130,234.82349754133776 160,234.82349754133776v4.5623471480203825C125.43765285197962,239.38584468935815 125.43765285197962,114.63487939867362 100,114.63487939867362Z"></path><path class="link entry-path filter" d="M100,114.63487939867362C130,114.63487939867362 130,286.32349754133776 160,286.32349754133776v4.323706716228542C125.67629328377146,290.6472042575663 125.67629328377146,118.95858611490216 100,118.95858611490216Z"></path><path class="link entry-path filter" d="M100,118.95858611490216C130,118.95858611490216 130,337.82349754133776 160,337.82349754133776v95.04141388509782C130,432.8649114264356 130,214 100,214Z"></path></g><g class="path-overlay-container" transform="translate(0,51.5)"><path class="link path0" d="M0,0C50,0 50,0 100,0v97.82349754133776C50,97.82349754133776 50,97.82349754133776 0,97.82349754133776Z" style="fill: #26C0C7;"></path><path class="link path0" d="M100,0C398,0 398,0 696,0v97.82349754133776C398,97.82349754133776 398,97.82349754133776 100,97.82349754133776Z" style="fill: #26C0C7;"></path><path class="link path0" d="M696,0C746,0 746,0 796,0v97.82349754133776C746,97.82349754133776 746,97.82349754133776 696,97.82349754133776Z" style="fill: #26C0C7;"></path></g><g class="node-container" transform="translate(0,51.5)"><g class="node filter an-Pathing-focusFlag" transform="translate(0,0)" id="geom1-0-0"><rect class="node-bg" width="100" height="213.99999999999997"></rect><text class="node-title" y="-5" x="2" text-anchor="start">* Entry (Page)</text><text class="node-metric-name" text-anchor="start" y="35" x="2">Path views</text><rect class="node-hit-area" height="217.99999999999997" y="-4" width="100" style="opacity: 0;"></rect><text class="node-total" y="17.5" x="2" text-anchor="start">729,055</text></g><g class="node" transform="translate(160,0)" id="geom1-1-0"><rect class="node-bg" width="100" height="97.82349754133776"></rect><text class="node-title" y="-5" x="96" text-anchor="end">Home</text><rect class="node-hit-area" height="101.82349754133776" y="-4" width="100" style="opacity: 0;"></rect><text class="node-total" y="17.5" x="96" text-anchor="end">333,265</text></g><g class="node" transform="translate(160,131.82350158691406)" id="geom1-2-0"><rect class="node-bg" width="100" height="7.21850614837015"></rect><text class="node-title" y="-5" x="96" text-anchor="end">Equipment</text><rect class="node-hit-area" height="11.21850614837015" y="-4" width="100" style="opacity: 0;"></rect><text class="node-total" y="17.5" x="96" text-anchor="end">24,592</text></g><g class="node" transform="translate(160,183.32350158691406)" id="geom1-3-0"><rect class="node-bg" width="100" height="5.030528560945333"></rect><text class="node-title" y="-5" x="96" text-anchor="end">Search Results</text><rect class="node-hit-area" height="9.030528560945333" y="-4" width="100" style="opacity: 0;"></rect><text class="node-total" y="17.5" x="96" text-anchor="end">17,138</text></g><g class="node" transform="translate(160,234.82350158691406)" id="geom1-4-0"><rect class="node-bg" width="100" height="4.5623471480203825"></rect><text class="node-title" y="-5" x="96" text-anchor="end">Men</text><rect class="node-hit-area" height="8.562347148020383" y="-4" width="100" style="opacity: 0;"></rect><text class="node-total" y="17.5" x="96" text-anchor="end">15,543</text></g><g class="node" transform="translate(160,286.323486328125)" id="geom1-5-0"><rect class="node-bg" width="100" height="4.323706716228542"></rect><text class="node-title" y="-5" x="96" text-anchor="end">Women</text><rect class="node-hit-area" height="8.323706716228543" y="-4" width="100" style="opacity: 0;"></rect><text class="node-total" y="17.5" x="96" text-anchor="end">14,730</text></g><g class="node" transform="translate(160,337.823486328125)" id="geom1-6-0"><rect class="node-bg" width="100" height="95.04141388509782"></rect><text class="node-title" y="-5" x="96" text-anchor="end">+117 more</text><rect class="node-hit-area" height="99.04141388509782" y="-4" width="100" style="opacity: 0;"></rect><text class="node-total" y="17.5" x="96" text-anchor="end">323,787</text></g></g><g class="column-label-container"><text transform="translate(0, 0)" class="column-label" x="2" text-anchor="start">Page</text><text transform="translate(160, 0)" class="column-label" x="96" text-anchor="end">Page</text></g><g class="selected-overlay" style="pointer-events: none;"></g></g><style>.pathing-svg .exit { fill: url(#exitFill); } 
.pathing-svg .entry { fill: url(#entryFill); } 
.pathing-svg .exit:hover { fill: url(#exitHighlightFill); } 
.pathing-svg .entry:hover { fill: url(#entryHighlightFill); } 
.pathing-svg .pivot-entry { mask: url(#pivotEnterMask); } 
.pathing-svg .pivot-exit { mask: url(#pivotExitMask); } 
.pathing-svg .link-container .entry-path { fill: url(#entryGradient); } 
.pathing-svg .link-container .exit-path { fill: url(#exitGradient); } 
</style><defs><g class="path-fills"></g></defs></svg></div></div></div><div class="dv-tooltip right hide" style="top: 200px; left: 182px;"><div class="content"><div id="tooltip_206"><div class="an-Pathing-tooltipHeader"><div class="an-Pathing-tooltipTitle">Entry - Page: Home</div><div class="an-Pathing-tooltipLineItem"><div class="an-Pathing-lineItemValues"><span class="an-Pathing-lineItemValue">333,265</span><span class="an-Pathing-lineItemPercentage">45.7%</span></div></div></div></div></div><b class="notch" style="top: 3px;"></b></div></div></div></div></div></section><object style="display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1; opacity: 0;" aria-hidden="true" tabindex="-1" data-focusable-ignore="true" type="text/html" data="about:blank"></object><div class="ui-resizable-handle ui-resizable-e" style="z-index: 90; display: none;"></div><div class="ui-resizable-handle ui-resizable-se ui-icon ui-icon-gripsmall-diagonal-se" style="z-index: 90; display: none;"></div><div class="ui-resizable-handle ui-resizable-s" style="z-index: 90; display: none;"></div><div class="ui-resizable-handle ui-resizable-sw" style="z-index: 90; display: none;"></div><div class="ui-resizable-handle ui-resizable-w" style="z-index: 90; display: none;"></div></div><div class="an-Grid-item placeholder an-Grid-item-sub-panel" data-model-id="" data-model-name="" data-test-id="an-Grid-item-undefined"><div class="placeholder-content"></div></div></div></div></div>
*/
