import {select} from 'd3-selection'; 
import embed from 'vega-embed';
var vega = require('vega'); 
var d3 = {select: select}; 
window.d3 = d3; 
window.vega = vega; 
window.vegaEmbed = embed;

console.log("Select: ", select); 