import React from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';

import VegaChartContainer from './src/charts/VegaChartContainer';


class App extends React.Component {
    constructor(props) {
        super(props);

        this._chartContainerRef = React.createRef();

        this.state = {
            isVizPrepared: false,
            data: [],
            val: "worked",
            endDate: " ",
            startDate: " ",
            APIToken: "",
            name: ""
        }
        this.setEnd = this.setEnd.bind(this);
        this.setStart = this.setStart.bind(this)
        this.setAPI = this.setAPI.bind(this);
        this.setName = this.setName.bind(this)
        this.submitRequest = this.submitRequest.bind(this)
    }

    // See https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx
    // for adding scripts to react (old way).
    componentDidMount() {
        // Load Vega and Vega Embed.
        this._addScript("https://cdn.jsdelivr.net/npm/vega@5");
        this._addScript("https://cdn.jsdelivr.net/npm/vega-lite@4");
        this._addScript("https://cdn.jsdelivr.net/npm/vega-embed@6");
    }

    _addScript(scriptSrc) {
        const script = document.createElement("script");
        script.src = scriptSrc;
        document.head.appendChild(script);
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

    setName(event) {
        this.setState({name: event.target.value});
    }

    submitRequest() {
        console.log(this.state.val);
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

        return data;
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
        // Wait to import until vega has been downloaded.
        await import('./src/charts/ForceDirected/ForceDirected');
        this.setState({isVizPrepared: true});
    }

    _displayChart() {
        this._chartContainerRef.current.draw(document.getElementById("Viz-Display-Area"));
    }

    async _makeApiRequest() {
        // TODO: API Team add your code here. If you can, have it follow
        // the structure of the hardcoded data below. Make sure to set
        // the state afterwards (as seen below).

        const data = [{
            "name": "node-data",
            "values": [{
                "name": "Shopping Cart|Cart Details",
                "group": 1,
                "index": 0
            }, {
                "name": "Home",
                "group": 2,
                "index": 1
            }, {
                "name": "Search Results",
                "group": 3,
                "index": 2
            }, {
                "name": "Store Locator|Search",
                "group": 4,
                "index": 3
            }, {
                "name": "Shopping Cart|Shipping Information",
                "group": 5,
                "index": 4
            }, {
                "name": "Equipment",
                "group": 6,
                "index": 5
            }, {
                "name": "Product List",
                "group": 7,
                "index": 6
            }, {
                "name": "Store Locator|Results",
                "group": 8,
                "index": 7
            }, {
                "name": "Shopping Cart|Billing Information",
                "group": 9,
                "index": 8
            }, {
                "name": "Account Registration|Form",
                "group": 10,
                "index": 9
            }]
        },
            {
                "name": "link-data",
                "values": [{
                    "source": 0,
                    "target": 0,
                    "value": 34809
                }, {
                    "source": 0,
                    "target": 1,
                    "value": 20819
                }, {
                    "source": 0,
                    "target": 2,
                    "value": 10473
                }, {
                    "source": 0,
                    "target": 3,
                    "value": 11176
                }, {
                    "source": 0,
                    "target": 4,
                    "value": 107736
                }, {
                    "source": 0,
                    "target": 5,
                    "value": 5948
                }, {
                    "source": 0,
                    "target": 6,
                    "value": 2996
                }, {
                    "source": 0,
                    "target": 7,
                    "value": 0
                }, {
                    "source": 0,
                    "target": 8,
                    "value": 0
                }, {
                    "source": 0,
                    "target": 9,
                    "value": 17647
                }, {
                    "source": 1,
                    "target": 0,
                    "value": 30087
                }, {
                    "source": 1,
                    "target": 1,
                    "value": 8458
                }, {
                    "source": 1,
                    "target": 2,
                    "value": 52043
                }, {
                    "source": 1,
                    "target": 3,
                    "value": 23112
                }, {
                    "source": 1,
                    "target": 4,
                    "value": 1
                }, {
                    "source": 1,
                    "target": 5,
                    "value": 38796
                }, {
                    "source": 1,
                    "target": 6,
                    "value": 19618
                }, {
                    "source": 1,
                    "target": 7,
                    "value": 0
                }, {
                    "source": 1,
                    "target": 8,
                    "value": 2
                }, {
                    "source": 1,
                    "target": 9,
                    "value": 9052
                }, {
                    "source": 2,
                    "target": 0,
                    "value": 35313
                }, {
                    "source": 2,
                    "target": 1,
                    "value": 17226
                }, {
                    "source": 2,
                    "target": 2,
                    "value": 17380
                }, {
                    "source": 2,
                    "target": 3,
                    "value": 24545
                }, {
                    "source": 2,
                    "target": 4,
                    "value": 0
                }, {
                    "source": 2,
                    "target": 5,
                    "value": 14273
                }, {
                    "source": 2,
                    "target": 6,
                    "value": 7115
                }, {
                    "source": 2,
                    "target": 7,
                    "value": 1
                }, {
                    "source": 2,
                    "target": 8,
                    "value": 0
                }, {
                    "source": 2,
                    "target": 9,
                    "value": 15030
                }, {
                    "source": 3,
                    "target": 0,
                    "value": 7961
                }, {
                    "source": 3,
                    "target": 1,
                    "value": 6869
                }, {
                    "source": 3,
                    "target": 2,
                    "value": 6392
                }, {
                    "source": 3,
                    "target": 3,
                    "value": 4973
                }, {
                    "source": 3,
                    "target": 4,
                    "value": 0
                }, {
                    "source": 3,
                    "target": 5,
                    "value": 1266
                }, {
                    "source": 3,
                    "target": 6,
                    "value": 634
                }, {
                    "source": 3,
                    "target": 7,
                    "value": 78580
                }, {
                    "source": 3,
                    "target": 8,
                    "value": 0
                }, {
                    "source": 3,
                    "target": 9,
                    "value": 2782
                }, {
                    "source": 4,
                    "target": 0,
                    "value": 9395
                }, {
                    "source": 4,
                    "target": 1,
                    "value": 3009
                }, {
                    "source": 4,
                    "target": 2,
                    "value": 7532
                }, {
                    "source": 4,
                    "target": 3,
                    "value": 3908
                }, {
                    "source": 4,
                    "target": 4,
                    "value": 0
                }, {
                    "source": 4,
                    "target": 5,
                    "value": 1367
                }, {
                    "source": 4,
                    "target": 6,
                    "value": 656
                }, {
                    "source": 4,
                    "target": 7,
                    "value": 0
                }, {
                    "source": 4,
                    "target": 8,
                    "value": 77856
                }, {
                    "source": 4,
                    "target": 9,
                    "value": 2254
                }, {
                    "source": 5,
                    "target": 0,
                    "value": 20614
                }, {
                    "source": 5,
                    "target": 1,
                    "value": 5802
                }, {
                    "source": 5,
                    "target": 2,
                    "value": 5673
                }, {
                    "source": 5,
                    "target": 3,
                    "value": 14450
                }, {
                    "source": 5,
                    "target": 4,
                    "value": 0
                }, {
                    "source": 5,
                    "target": 5,
                    "value": 4729
                }, {
                    "source": 5,
                    "target": 6,
                    "value": 33404
                }, {
                    "source": 5,
                    "target": 7,
                    "value": 1
                }, {
                    "source": 5,
                    "target": 8,
                    "value": 0
                }, {
                    "source": 5,
                    "target": 9,
                    "value": 5573
                }, {
                    "source": 6,
                    "target": 0,
                    "value": 23229
                }, {
                    "source": 6,
                    "target": 1,
                    "value": 11069
                }, {
                    "source": 6,
                    "target": 2,
                    "value": 7829
                }, {
                    "source": 6,
                    "target": 3,
                    "value": 10489
                }, {
                    "source": 6,
                    "target": 4,
                    "value": 0
                }, {
                    "source": 6,
                    "target": 5,
                    "value": 6829
                }, {
                    "source": 6,
                    "target": 6,
                    "value": 3473
                }, {
                    "source": 6,
                    "target": 7,
                    "value": 0
                }, {
                    "source": 6,
                    "target": 8,
                    "value": 0
                }, {
                    "source": 6,
                    "target": 9,
                    "value": 6247
                }, {
                    "source": 7,
                    "target": 0,
                    "value": 1
                }, {
                    "source": 7,
                    "target": 1,
                    "value": 6973
                }, {
                    "source": 7,
                    "target": 2,
                    "value": 3370
                }, {
                    "source": 7,
                    "target": 3,
                    "value": 1
                }, {
                    "source": 7,
                    "target": 4,
                    "value": 0
                }, {
                    "source": 7,
                    "target": 5,
                    "value": 1
                }, {
                    "source": 7,
                    "target": 6,
                    "value": 0
                }, {
                    "source": 7,
                    "target": 7,
                    "value": 0
                }, {
                    "source": 7,
                    "target": 8,
                    "value": 0
                }, {
                    "source": 7,
                    "target": 9,
                    "value": 14
                }, {
                    "source": 8,
                    "target": 0,
                    "value": 9124
                }, {
                    "source": 8,
                    "target": 1,
                    "value": 23668
                }, {
                    "source": 8,
                    "target": 2,
                    "value": 12616
                }, {
                    "source": 8,
                    "target": 3,
                    "value": 3768
                }, {
                    "source": 8,
                    "target": 4,
                    "value": 0
                }, {
                    "source": 8,
                    "target": 5,
                    "value": 1329
                }, {
                    "source": 8,
                    "target": 6,
                    "value": 665
                }, {
                    "source": 8,
                    "target": 7,
                    "value": 0
                }, {
                    "source": 8,
                    "target": 8,
                    "value": 0
                }, {
                    "source": 8,
                    "target": 9,
                    "value": 2141
                }, {
                    "source": 9,
                    "target": 0,
                    "value": 11317
                }, {
                    "source": 9,
                    "target": 1,
                    "value": 15036
                }, {
                    "source": 9,
                    "target": 2,
                    "value": 14323
                }, {
                    "source": 9,
                    "target": 3,
                    "value": 3197
                }, {
                    "source": 9,
                    "target": 4,
                    "value": 0
                }, {
                    "source": 9,
                    "target": 5,
                    "value": 7657
                }, {
                    "source": 9,
                    "target": 6,
                    "value": 3860
                }, {
                    "source": 9,
                    "target": 7,
                    "value": 1
                }, {
                    "source": 9,
                    "target": 8,
                    "value": 0
                }, {
                    "source": 9,
                    "target": 9,
                    "value": 1349
                }]
            }];

        this.setState({data: data});
    }

    render() {
        // Build hard coded colors.
        const colors = this._buildHardCodedColors();

        let mainCode;

        if (!this.state.isVizPrepared) {
            mainCode = (
                <button onClick={() => this._buildInitialVisualization()}>
                    Prepare initial visualization
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


                    <br/>
                    <input type="date" id="start" name="start"
                           value={this.state.startDate}
                           onChange={this.setStart}
                           min="2018-01-01" max="2021-12-31"/>

                    <input type="date" id="end" name="end"
                           value={this.state.endDate}
                           onChange={this.setEnd}
                           min="2018-01-01" max="2021-12-31"/>
                    <br/>
                    <input type="text" id="name" name="name"
                           value={this.state.name}
                           onChange={this.setName}/>
                    <br/>
                    <input type="password" id="APIToken" name="APIToken"
                           minLength="0" required value={this.state.APIToken} onChange={this.setAPI}/>
                    <br/>
                    <button onClick={this.submitRequest}>Submit</button>

            
                    <button
                        onClick={() => this._displayChart()}
                    >
                        Display Chart
                    </button>
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
