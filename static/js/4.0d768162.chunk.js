(this.webpackJsonpcapstone_project=this.webpackJsonpcapstone_project||[]).push([[4],{459:function(e,t){},460:function(e,t){},461:function(e,t){},473:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return Z}));var a=n(268),r=n(14),o=n.n(r),i=n(28),s=n(7),u=n(9),l=n(43),c=n(35),d=n(15),h=n(16),f=n(12),p=n(5),g=n(459),v=n.n(g),m=n(460),y=n.n(m),b=n(461),k=n.n(b),w="undefined"!==typeof window&&"undefined"!==typeof window.l10nify?window.l10nify:{},x={};x.validLocales=w.validLocales||["en_US"],x.translations=w.translations||{},x.currentLocale=w.currentLocale||"en_US",x.showL10nTokens="boolean"===typeof w.showL10nTokens&&w.showL10nTokens,"undefined"!==typeof window&&window.location&&window.location.href&&window.location.href.includes&&window.location.href.includes("showL10nTokens=true")&&(x.showL10nTokens=!0);var O={de_DE:"de-DE",en_US:"en",es_ES:"es-ES",fr_FR:"fr-FR",ja_JP:"ja-JP",ko_KR:"ko-KR",pt_BR:"pt-BR",zh_CN:"zh-Hans",zh_TW:"zh-Hant"},C={de_DE:"de",en_US:"en",es_ES:"es",fr_FR:"fr",ja_JP:"jp",ko_KR:"kr",pt_BR:"br",zh_CN:"cn",zh_TW:"tw"},L=(new(function(){function e(){var t=this,n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=n.validLocales,o=void 0===r?x.validLocales:r,i=n.translations,u=void 0===i?x.translations:i,l=n.currentLocale,c=void 0===l?x.currentLocale:l,d=n.showL10nTokens,h=void 0===d?x.showL10nTokens:d;Object(s.a)(this,e),this.validLocales=o,this.translations=u,this._currentLocale=c,this.showL10nTokens=h,this.translate=this.translate.bind(this),this.translate.config=this,this.translate.newInstance=function(){var n=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},r=new e(Object(a.a)(Object(a.a)({},{validLocales:Object(p.a)(t.validLocales),translations:Object(a.a)({},t.translations),currentLocale:t.currentLocale,showL10nTokens:t.showL10nTokens}),n));return r.translate}}return Object(u.a)(e,[{key:"currentLocale",get:function(){return this._currentLocale},set:function(e){if(!this.validLocales.includes(e))throw new Error("".concat(e," is not a valid locale. Valid locales include ").concat(JSON.stringify(this.validLocales)));this._currentLocale=e}},{key:"currentLocaleForDocs",get:function(){return O[this._currentLocale]}},{key:"currentLocaleForHelpx",get:function(){return C[this._currentLocale]}},{key:"currentIETFLocaleCode",get:function(){return{de_DE:"de",en_US:"en",es_ES:"es",fr_FR:"fr",ja_JP:"ja",ko_KR:"ko",pt_BR:"pt-br",zh_CN:"zh-cn",zh_TW:"zh-tw"}[this._currentLocale]}},{key:"update",value:function(e){e&&(this.validLocales=e.validLocales||this.validLocales,this.translations=e.translations||this.translations,this._currentLocale=e.currentLocale||this._currentLocale,this.showL10nTokens=e.showL10nTokens||this.showL10nTokens)}},{key:"translate",value:function(e){for(var t=arguments.length,n=new Array(t>1?t-1:0),a=1;a<t;a++)n[a-1]=arguments[a];var r,o=null;Array.isArray(e)?e=v.a.apply(null,[e].concat(Object(p.a)(n))):("string"===typeof n[0]&&(o=n[0],n.splice(0,1)),1===(n=n.reduce((function(e,t){return e.concat(t)}),[])).length&&void 0===n[0]&&(n=[])),o=o||y()(e);var i=this.translations[this.currentLocale]||{};if(r=Array.isArray(n)&&n.length?k()(i[o]||e,n):i[o]||e,this.showL10nTokens){var s=Object.prototype.hasOwnProperty.call(i,o);return"{Key: ".concat(o," HasKey: ").concat(s," Value: ").concat(r,"}")}return r}}]),e}())).translate,j=n(462),_=n.n(j);["pull","remove","fill","pullAt"].forEach((function(e){if(_.a[e]){var t=_.a[e];_.a[e]=function(){for(var n=arguments.length,a=new Array(n),r=0;r<n;r++)a[r]=arguments[r];var o=a[0];return o.isObservableList&&console.error("WARNING: Do not use _.".concat(e," with an observable list - change events will not be emitted. Check ObservableList.js for the appropriate helper function")),t.apply(_.a,a)}}})),_.a.an=_.a.an||{},_.a.an.get=function(e,t,n){var a=_.a.get(e,t);if(_.a.isFunction(a)){for(var r=arguments.length,o=new Array(r>3?r-3:0),i=3;i<r;i++)o[i-3]=arguments[i];a=a.apply(e,o)}return void 0===a&&(a=n),a},_.a.isDefined=function(e){return!_.a.isUndefined(e)},_.a.noConflict();var S=_.a,T=n(457);n(463),n(464),n(465),n(466),n(467),n(468),n(469),n(470);var F=T,D=function(){function e(){Object(s.a)(this,e)}return Object(u.a)(e,[{key:"format",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.precision,a=void 0===n?0:n,r=t.decimalSeparator,o=void 0===r?".":r,i=t.thousandsSeparator,s=void 0===i?",":i;if("number"!==typeof e&&(e=Number(e)),e===1/0)return L("Infinity");if(Number.isNaN(e))return e.toString();-1===a&&(a=this.getPrecision(e)),a=Math.min(a,20);var u=(e=e.toFixed(a)).toString().split("."),l=Object(f.a)(u,2),c=l[0],d=l[1];d=a&&"undefined"!==typeof d?"."+d:"",e=(e=(e=c.replace(/\B(?=(\d{3})+(?!\d))/g,"thousandsSeparator")+d).replace(/\./g,o)).replace(/thousandsSeparator/g,s);var h=/[1-9]+/.test(e);return 0!==e.indexOf("-")||h||(e=e.substr(1)),e}},{key:"getPrecision",value:function(e){return(e+".").split(".")[1].length}},{key:"numberToPrecision",value:function(e,t){return parseFloat(Number(e).toFixed(t))}}]),e}(),M=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=t.currencyCode,a=void 0===n?"USD":n,r=t.thousandsSeparator,o=void 0===r?",":r,i=t.decimalSeparator,u=void 0===i?".":i;Object(s.a)(this,e),this.currencyCode=a,this.formatterOpts={decimalSeparator:u,thousandsSeparator:o},this.numberFormatter=new D}return Object(u.a)(e,[{key:"format",value:function(e){var t,n,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=a.type,o=void 0===r?"int":r,i=a.precision,s=void 0===i?0:i,u=a.abbreviate,l=void 0!==u&&u;if("raw"===o){if("number"===typeof e)return this.round(e,s);if("string"===typeof e){var c=e.split(this.formatterOpts.decimalSeparator),d=Object(f.a)(c,2),h=d[0],p=d[1];void 0===h&&(h="0"),void 0===p&&(p="0");var g=-1!==h.indexOf("-"),v=(h=parseFloat(h.replace(/[^0-9]/g,"")))+(p=parseFloat("0."+p.replace(/[^0-9]/g,"")));return g&&(v*=-1),this.round(v,s)}}if(e=+e||0,"time"===o){var m=e<0;e=Math.abs(e);L.config.currentLocale;if(l)return(m?"- ":"")+F.duration(1e3*e).humanize();var y=Math.floor(e%60),b=Math.floor(e/60%60),k=Math.floor(e/60/60);return(m?"-":"")+(k<10?"0":"")+k.toString().replace(/\B(?=(\d{3})+(?!\d))/g,this.formatterOpts.thousandsSeparator)+":"+(b<10?"0":"")+b+":"+(y<10?"0":"")+y}if("percent"===o)return this.numberFormatter.format(100*e,Object.assign({precision:s},this.formatterOpts))+"%";if(e<0&&(n=!0,e*=-1),l)if(e>=1e3&&e<1e15){var w=(t=(t=this.numberFormatter.format(e,this.formatterOpts)).split(this.formatterOpts.thousandsSeparator)).length-1;"000"!==t[1]?(t=Number(t[0]+"."+t[1]),t=this.numberFormatter.format(t,Object.assign({precision:s},this.formatterOpts))):t=t[0],1===w?t=L("%sK",[t]):2===w?t=L("%sM",[t]):3===w?t=L("%sB",[t]):4===w&&(t=L("%sT",[t]))}else t=this.numberFormatter.format(e,this.formatterOpts);else t=this.numberFormatter.format(e,Object.assign({precision:s},this.formatterOpts));"currency"===o&&(t="USD"===this.currencyCode?"$"+t:t+" "+this.currencyCode);var x=/[1-9]+/.test(t);return n&&x&&(t="-"+t),t}},{key:"round",value:function(e,t){return-1===t&&(t=this.getCurrentPrecision(e)),S.round(e,t)}},{key:"getCurrentPrecision",value:function(e){return((e=+e||0)+".").split(".")[1].length}}]),e}(),I="undefined"!==typeof window?window.d3:{};function R(e){return new Promise((function(t){return setTimeout(t,e)}))}var z,N=n(474),A=(Date.now().toString(16).substring(5),function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.delimiter,n=void 0===t?"-":t,a=e.lowerCase,r=void 0!==a&&a,o=Object(N.a)();return"-"!==n&&(o=o.replace(/-/g,n)),r||(o=o.toUpperCase()),o}),V=n(325),H=function(){function e(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};Object(s.a)(this,e),this._setOpts(t)}return Object(u.a)(e,[{key:"draw",value:function(){var e=Object(i.a)(o.a.mark((function e(){var t,n=arguments;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:t=n.length>0&&void 0!==n[0]?n[0]:{},this._setOpts(t);case 2:case"end":return e.stop()}}),e,this)})));return function(){return e.apply(this,arguments)}}()},{key:"validate",value:function(e){return!!e&&(!this.isUnitTest||(this.el.innerHTML=JSON.stringify(e,null,2),!1))}},{key:"isUnitTest",get:function(){return!!window.isUnitTest}},{key:"refresh",value:function(){}},{key:"onResize",value:function(){this.refresh()}},{key:"destroy",value:function(){}},{key:"_callOptsHandler",value:function(e,t){if(this._opts[e])return this._opts[e].apply(null,t)}},{key:"formatNumber",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return this._numberFormatter(e,n?Object.assign({},t,n):t)}},{key:"onMouseOver",value:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return this._callOptsHandler("onMouseOver",t)}},{key:"onMouseOut",value:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return this._callOptsHandler("onMouseOut",t)}},{key:"onContextMenu",value:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return this._callOptsHandler("onContextMenu",t)}},{key:"onRender",value:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return this._callOptsHandler("onRender",t)}},{key:"highlightDataByIds",value:function(e){}},{key:"unhighlightData",value:function(){}},{key:"onError",value:function(){this.el&&!this.isUnitTest&&(this.el.innerHTML="");for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];return this._callOptsHandler("onError",t)}},{key:"locale",get:function(){return this._opts.locale||"en-US"}},{key:"l10nConfig",get:function(){return this._opts.l10n||{}}},{key:"_setOpts",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};if(this.el=e.el,e.numberFormatter)this._numberFormatter=e.numberFormatter;else if(!this._numberFormatter){var t=new M;this._numberFormatter=t.format.bind(t)}this._opts=e}}]),e}(),E=function(){function e(){Object(s.a)(this,e)}return Object(u.a)(e,[{key:"getMarks",value:function(e){return S.compact([this.getNodeMarks(e),this.getNodeTextMarks(e),this.getLinkMarks(e)])}},{key:"getNodeMarks",value:function(e){return{name:"nodes",type:"symbol",zindex:1,from:{data:"node-data"},on:[{trigger:"fix",modify:"node",values:"fix === true ? {fx: node.x, fy: node.y} : {fx: fix[0], fy: fix[1]}"},{trigger:"!fix",modify:"node",values:"{fx: null, fy: null}"}],encode:{enter:{fill:{scale:"color",field:"group"},stroke:{value:"black"},tooltip:{signal:"{Name: datum.name, Value: format(datum.volume, ',')}"},size:{scale:"size",field:"normalizeVolume"}},update:{cursor:{value:"pointer"}}},transform:[this.getForceTransform(e)]}}},{key:"getForceTransform",value:function(e){return{type:"force",iterations:300,restart:{signal:"restart"},static:{signal:"static"},signal:"force",forces:[{force:"center",x:{signal:"cx"},y:{signal:"cy"}},{force:"collide",radius:{signal:"nodeRadius"}},{force:"nbody",strength:{signal:"nodeCharge"}},{force:"link",links:"link-data",distance:{signal:"linkDistance"}}]}}},{key:"getNodeTextMarks",value:function(e){return{type:"text",name:"node-text",from:{data:"nodes"},zindex:2,encode:{enter:{align:{value:"center"},baseline:{value:"middle"},fontSize:{value:12},fill:{value:"black"}},update:{text:{signal:"[substring(datum.datum.name, 0, floor(nodeRadius / 2.5)), getAdjustedVolume(datum.datum.volume)]"},x:{signal:"datum.x"},y:{signal:"datum.y"},tooltip:{signal:"{Name: datum.datum.name, Value: format(datum.datum.volume, ',')}"},cursor:{value:"pointer"}}}}}},{key:"getLinkMarks",value:function(e){return{type:"path",from:{data:"link-data"},interactive:!1,encode:{update:{stroke:{signal:"node ? getHighlightColor(node, datum, getChartOpts('".concat(e.chartID,'\')) : "#ccc"')},strokeWidth:{field:"normalizeValue"},tooltip:{value:"{left}"},zindex:{signal:"node ? getZIndex(node, datum, getChartOpts('".concat(e.chartID,"')) : 0")}}},transform:[{type:"linkpath",require:{signal:"force"},shape:"curve",sourceX:"datum.source.x",sourceY:"datum.source.y",targetX:"datum.target.x",targetY:"datum.target.y"}]}}}],[{key:"create",value:function(e){return(new this).getMarks(e)}}]),e}(),P=function(){function e(){Object(s.a)(this,e)}return Object(u.a)(e,[{key:"getScales",value:function(e){return S.compact([this.getColorScales(e),this.getVolumeScale(e)])}},{key:"getColorScales",value:function(e){return{name:"color",type:"ordinal",domain:{data:"node-data",field:"group"},range:{scheme:"category20c"}}}},{key:"getVolumeScale",value:function(e){return{name:"size",domain:{data:"node-data",field:"normalizeVolume"},zero:!1,range:[200,1e3]}}}],[{key:"create",value:function(e){return(new this).getScales(e)}}]),e}(),B=function(){function e(){Object(s.a)(this,e)}return Object(u.a)(e,[{key:"getSignals",value:function(e){return S.compact([this.getCx(e),this.getCy(e),this.getNodeRadius(e),this.getNodeCharge(e),this.getLinkDistance(e),this.getStatic(e),this.getFix(e),this.getClicked(e),this.getNode(e),this.getRestart(e)])}},{key:"getCx",value:function(e){return{name:"cx",update:"width / 2"}}},{key:"getCy",value:function(e){return{name:"cy",update:"height / 2"}}},{key:"getNodeRadius",value:function(e){return{name:"nodeRadius",value:20,bind:e.allowSignalBinds?{input:"range",min:30,max:75,step:1}:null}}},{key:"getNodeCharge",value:function(e){return{name:"nodeCharge",value:-30,bind:e.allowSignalBinds?{input:"range",min:-100,max:10,step:1}:null}}},{key:"getLinkDistance",value:function(e){return{name:"linkDistance",value:30,bind:e.allowSignalBinds?{input:"range",min:5,max:100,step:1}:null}}},{key:"getStatic",value:function(e){return{name:"static",value:!0,bind:e.allowSignalBinds?{input:"checkbox"}:null}}},{key:"getFix",value:function(e){return{description:"State variable for active node fix status.",name:"fix",value:!1,on:[{events:"symbol:mouseout[!event.buttons], window:mouseup",update:"false"},{events:"symbol:mouseover, text:mouseover",update:"fix || true"},{events:"[symbol:mousedown, window:mouseup] > window:mousemove!",update:"xy()",force:!0}]}}},{key:"getClicked",value:function(e){return{description:"Clicked an active node.",name:"clicked",value:!1,on:[{events:"symbol:click",update:"datum.name == 'Other Pages' ? loadMore() : null"}]}}},{key:"getNode",value:function(e){return{description:"Graph node most recently interacted with.",name:"node",value:null,on:[{events:"symbol:mouseover",update:"fix === true ? item() : node"},{events:"text:mouseover",update:"fix === true ? datum.datum : node"}]}}},{key:"getRestart",value:function(e){return{description:"Flag to restart Force simulation upon data changes.",name:"restart",value:!1,on:[{events:{signal:"fix"},update:"fix && fix.length"}]}}}],[{key:"create",value:function(e){return(new this).getSignals(e)}}]),e}(),U=function(){function e(){Object(s.a)(this,e)}return Object(u.a)(e,[{key:"formatDataForVega",value:function(e){return{formattedData:e.data,aggregateData:{}}}}],[{key:"format",value:function(e){return(new this).formatDataForVega(e)}}]),e}(),W=(n(1),n(48),function(){function e(){Object(s.a)(this,e)}return Object(u.a)(e,null,[{key:"registerChartInstance",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},a=e.expressionFunction("getAllCharts")();a[t]=n,e.expressionFunction("getAllCharts",(function(){return a}))}},{key:"registerStaticExpressions",value:function(e){e.expressionFunction("getAllCharts",(function(){return{}})),e.expressionFunction("getChartOpts",(function(t){return e.expressionFunction("getAllCharts")()[t]})),e.expressionFunction("getHighlightColor",(function(e,t,n){for(var a=n.getTopVolumeEdges(e,n.links,5,n),r=0;r<a.length;++r)if(t.source.datum.name===a[r].source.datum.name&&t.target.datum.name===a[r].target.datum.name)return n.swatchColors[r];return"#ccc"})),e.expressionFunction("getZIndex",(function(e,t,n){for(var a=n.getTopVolumeEdges(e,n.links,5,n),r=0;r<a.length;++r)if(t.source.datum.name===a[r].source.datum.name&&t.target.datum.name===a[r].target.datum.name)return 1;return 0})),e.expressionFunction("getAdjustedVolume",(function(e){for(var t=parseInt(e),n=0;t>1e3;)t/=1e3,++n;return Math.round(t)+["","k","m","b"][n]})),e.expressionFunction("checkValue",(function(e){return null}))}}]),e}()),J=function(){function e(){Object(s.a)(this,e)}return Object(u.a)(e,null,[{key:"showTooltip",value:function(e,t,n,a,r,o,i){var s=o.selectAll("#".concat(i)).data([e]);e.cx=e.cx||e.x+e.width/2,e.cy=e.cy||e.y+e.height/2,e.dx=e.dx||e.x+e.width,e.dy=e.dy||e.y+e.height,t.dx=t.dx||t.x+t.width,t.dy=t.dy||t.y+t.height;var u=s.enter().append("div").classed("dv-tooltip",!0).attr("id",i).style("top",0).style("left",0);u.append("div").classed("content",!0),u.append("b").classed("notch",!0),s.select(".content").html(""),"string"!==typeof n?s.select(".content").node().appendChild(n):s.select(".content").html(n);var l=s.select(".notch"),c=s.node(),d=Math.min(c.offsetWidth,t.width),h=Math.min(c.offsetHeight,t.height),f=0,p=0,g=function(e,t,n){return Math.min(Math.max(t,e),n)},v=function(t){var n,a;switch(t){case"left":n=e.x-d-r,a=e.cy-h/2;break;case"right":n=e.x+e.width+r,a=e.cy-h/2;break;case"top":n=e.cx-d/2,a=e.y-h-r;break;case"bottom":n=e.cx-d/2,a=e.dy+r}return{left:n,top:a}},m=function(){var e,n=[];switch(a){case"left":e=["left","right","top","bottom"];break;case"right":e=["right","left","top","bottom"];break;case"top":e=["top","bottom","left","right"];break;case"bottom":e=["bottom","top","left","right"]}return v("left").left<t.x&&n.push("left"),v("right").left+d>t.dx&&n.push("right"),v("top").top<t.y&&n.push("top"),v("bottom").top+h>t.dy&&n.push("bottom"),e.filter((function(e){return n.indexOf(e)<0}))[0]}();m&&(a=m);var y=v(a);p=y.left,f=y.top,"left"===a||"right"===a?(f<t.y&&(f=t.y),f+h>t.dy&&(f=t.dy-h),l.style("top",g(e.cy-f-5,3,h-13)+"px"),l.style("left",null)):(p<t.x&&(p=t.x),p+d>t.dx&&(p=t.dx-d),l.style("left",g(e.cx-p-5,3,d-13)+"px"),l.style("top",null)),s.classed("top right left bottom hide",!1).classed(a,!0),u.style("top",f+"px").style("left",p+"px"),s.style("top",f+"px").style("left",p+"px")}},{key:"removeTooltip",value:function(e,t){e.selectAll("#".concat(t)).classed("hide",!0)}}]),e}(),K=function(){function e(t){Object(s.a)(this,e),this.opts=t}return Object(u.a)(e,[{key:"getItemWidth",value:function(e){return e.bounds.x2-e.bounds.x1}},{key:"getItemHeight",value:function(e){return e.bounds.y2-e.bounds.y1}},{key:"getCx",value:function(e){return this.getItemWidth(e)/2+e.bounds.x1}},{key:"getCy",value:function(e){return this.getItemHeight(e)/2+e.bounds.y1}},{key:"checkIfOverNode",value:function(e,t){var n=this.getCx(t),a=this.getCy(t),r=n-t.bounds.x1;if(r=Math.round(100*r)/100,e.layerY===t.cy&&e.layerX>t.bounds.x1&&e.layerX<t.bounds.x2)return!0;if(e.layerX===t.cx&&e.layerY>t.bounds.xy&&e.layerY<t.bounds.xy)return!0;return r-1.5>Math.sqrt(Math.pow(Math.abs(e.layerX-n),2)+Math.pow(Math.abs(e.layerY-a),2))}},{key:"show",value:function(e,t,n,a){if(n){var r=!1;"node-text"===n.mark.name&&(r=this.currentTooltip&&this.currentTooltip.datum.name===n.datum.datum.name,n=n.datum);var o=e._el;if(t&&"mouseout"===t.vegaType){if(!this.checkIfOverNode(t,this.currentTooltip)){this.currentTooltip=null,this.tooltipCancelId=setTimeout((function(){J.removeTooltip(I.select(o),"node-tooltip")}),500)}}else if(n!==this.currentTooltip&&!r){this.currentTooltip=n;var i=this.opts.nodeTooltipContent({data:n.datum},{links:this.opts.getTopVolumeEdges(n.datum,this.opts.links,5,this.opts)},this.opts.swatchColors),s=n.bounds.x1+this.opts.padding.left,u=n.bounds.y1+this.opts.padding.top,l=this.getItemWidth(n),c=this.getItemHeight(n);clearTimeout(this.tooltipCancelId);var d={x:s,width:l,y:u,height:c},h={y:0,x:0,height:o.offsetHeight,width:o.offsetWidth};try{J.showTooltip(d,h,i,"left",10,I.select(o),"node-tooltip")}catch(f){J.showTooltip(d,h,i,"left",10,I.select(o),"node-tooltip")}}}}}]),e}();function X(e){var t;return null===(t=getComputedStyle(document.body).getPropertyValue(e))||void 0===t?void 0:t.trim()}var Y=window,G=Y.vega,q=Y.vegaEmbed;W.registerStaticExpressions(G);var Z=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"draw",value:function(){var e=Object(i.a)(o.a.mark((function e(t){return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Object(l.a)(Object(c.a)(n.prototype),"draw",this).call(this,t);case 2:return this.chartID||(this.chartID=A()),e.next=5,this.setupChart(t);case 5:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"setupChart",value:function(){var e=Object(i.a)(o.a.mark((function e(t){var n,r,i,s,u,l,c,d,h,f,p,g;return o.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(n=A(),this.cancelPendingRenders({newPendingRenderId:n}),this.destroy(),this.opts=t,this.validate(t)){e.next=6;break}return e.abrupt("return");case 6:if((r=this.el.querySelector(".vega-container"))&&r.remove(),(i=document.createElement("div")).classList.add("vega-container"),!this.shouldShowLoadingState(t)){e.next=17;break}return t.showLoadingState(i),this.el.appendChild(i),e.next=15,R(500);case 15:e.next=18;break;case 17:this.el.appendChild(i);case 18:return s=Object(a.a)(Object(a.a)({},t),{},{height:this.el.clientHeight,width:this.el.clientWidth,padding:this.padding,chartID:this.chartID}),u=U.format(s),l=u.formattedData,c=u.aggregateData,Object.assign(s,Object(a.a)({formattedData:l},c)),d=new K(s),s.links="link-data"===s.formattedData[1].name?s.formattedData[1].values:s.formattedData[0].values,h=d.show.bind(d),W.registerChartInstance(G,this.chartID,s),f=this.getChartConfig(s),p={tooltip:h},e.next=29,q(i,f,p);case 29:g=e.sent,this.isCancelledRender(n)?(g.view.finalize(),g.view.container().remove()):this.vegaView=g;case 31:case"end":return e.stop()}}),e,this)})));return function(t){return e.apply(this,arguments)}}()},{key:"shouldShowLoadingState",value:function(e){return!0}},{key:"cancelPendingRenders",value:function(e){var t=e.newPendingRenderId;this.lastRenderId=t}},{key:"isCancelledRender",value:function(e){return e!==this.lastRenderId}},{key:"destroy",value:function(){this.vegaView&&(this.vegaView.view.finalize(),this.vegaView.view.container().remove())}},{key:"getChartConfig",value:function(e){return{$schema:"https://vega.github.io/schema/vega/v5.json",autosize:{type:"fit",contains:"padding"},padding:e.padding,background:(z||(z={fontFamilies:"adobe-clean, Helvetica, Arial, sans-serif",axisLabelColor:"#b2b2b2",axisGridColor:"#ebebeb",vizBackgroundColor:"#ffffff"},"undefined"!==typeof window&&"undefined"!==typeof window.document&&"undefined"!==typeof window.document.body&&"undefined"!==typeof getComputedStyle&&(z.fontFamilies="".concat(X("--aa-fonts"),", ").concat(z.fontFamilies),z.axisLabelColor=X("--aa-axis-label-color"),z.axisGridColor=X("--aa-axis-grid-color"),z.vizBackgroundColor=X("--aa-viz-bg")),z)).vizBackgroundColor,width:e.width,height:e.height,data:e.formattedData,signals:B.create(e),marks:E.create(e),scales:P.create(e),config:{}}}},{key:"padding",get:function(){return{left:0,top:0,right:0,bottom:0}}}]),n}(H);V.a.registerChart(Z)}}]);
//# sourceMappingURL=4.0d768162.chunk.js.map