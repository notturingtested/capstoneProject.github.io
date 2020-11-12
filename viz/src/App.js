import React from 'react';
import ReactDOM from 'react-dom'; 
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  // See https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx for adding scripts to react (old way). 
  componentDidMount() {
    // Load Vega and Vega Embed. 
    this._addScript("https://cdn.jsdelivr.net/npm/vega@5"); 
    this._addScript("https://cdn.jsdelivr.net/npm/vega-embed@6");   
  }

  _addScript(scriptSrc) {
    const script = document.createElement("script"); 
    script.src = scriptSrc; 
    script.async = true; 
    document.body.appendChild(script);
  }

  render() {
    return (
      <div className="App">
        <h1>Force Directed Layout by Vega</h1>
        <div id="view"/>
        <h1>Hello world</h1>
      </div>
    );
  }
}

export default App;
