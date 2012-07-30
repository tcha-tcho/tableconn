/**
 * Tableconn v0.0.1pre - A lightweight Google Spreadsheet connector
 * http://github.com/tcha-tcho/tableconn
 * Author: Tcha-Tcho
 * Copyright 2012 Estadão
 * License: http://www.gnu.org/licenses/licenses.html#GPL
 */

var Tableconn = (function (window,document,ss) {
  //SQL needs as_feeds:false
  // https://developers.google.com/chart/interactive/docs/querylanguage
  var pub = {};
  function reset_args(args){
    pub.url      = "";
    pub.sql      = "select *";
    pub.as_feeds = false;
    pub.gdata    = false;
    pub.parsed   = [];
    for(arg in pub) {if(args[arg] !== undefined) pub[arg] = args[arg] }
  }

  pub.set_gdata = function (_gdata){pub.gdata = _gdata};
  if(typeof this.google == "undefined") this.google = {visualization:{Query:{setResponse:pub.set_gdata}}};

  function parse_google_url() {
    var key = (pub.url.match(/http(s)*:/))?pub.url.match(/key=(.*?)(&|#)/i)[1] : pub.url;
    var final_url = (pub.as_feeds)?("feeds/cells/" + key + "/od6/public/basic?") : ("tq?out=json&key=" + key + "&");
    return ( "http://spreadsheets.google.com/" + final_url + "tq=" + encodeURIComponent(pub.sql) + "&alt=json-in-script&callback=Tableconn.set_gdata");
  }
  function is_header(entr){return ((entr.title.$t.length == 2) && (entr.title.$t.substr(1,1) == "1")); }
  function column_char(entr){return entr.title.$t.charAt(0)}

  pub.load = function (args,callback) {
    reset_args(args)
    var newScript = document.createElement('script');
    newScript.type = 'text/javascript';
    newScript.src = parse_google_url() + "&s_id=" + (new Date().getTime());
    document.getElementsByTagName("head")[0].appendChild(newScript);
    safetyCounter = 0;
    var intervalId = setInterval(function(){
      if ((safetyCounter++ > 20) || (pub.gdata)) {
        clearInterval(intervalId);
        pub.parse_raw_data(pub.gdata,callback);
      }
    }, 200);
  };
  pub.filter = function (params,callback) {
    var result = []
    for (var i = 0; i < pub.parsed.length; i++) {
      var candidate = 0;
      for(param in params){
        if(pub.parsed[i][param] !== undefined && pub.parsed[i][param] == params[param]) candidate++;
      }
      if(candidate > 0) result.push(pub.parsed[i])
    };
    callback(result);
  };

  pub.prototype = {
    constructor: Tableconn,
    version:"0.0.1pre"
  }

  pub.parse_raw_data = function(gdata,callback) {
    if (gdata.status == "error"){ callback(gdata.errors[0]); return false }
    var entries = (pub.as_feeds?gdata.feed.entry:gdata.table.rows), key_names = {};
    pub.parsed = [];
    function append_data(line,column,value){
      if (typeof pub.parsed[line] == "undefined") pub.parsed[line] = {}
      pub.parsed[line][column] = (value || null);
    }
    for (var i = 0; i < entries.length; i++) { //fill objects into arrays using tableconn formating
      if (pub.as_feeds) {
        if(is_header(entries[i])){
          key_names[column_char(entries[i])] = entries[i].content.$t
        } else {
          append_data(parseInt(entries[i].title.$t.substr(1)), key_names[column_char(entries[i])], entries[i].content.$t)
        }
      }else{
        for (var j = 0; j < entries[i].c.length; j++) {
          append_data(i, gdata.table.cols[j].label, (entries[i].c[j])?entries[i].c[j].v:null)
        };
      };
    }
    if(pub.as_feeds) pub.parsed.splice(0,2)
    callback(pub.parsed);
  };
  return pub;
})(window,document,Tableconn);

window.Tableconn = window.TC = Tableconn;
