var Tableconn=function(a,b,c){function e(a){d.url="",d.sql="select *",d.as_feeds=!1,d.gdata=!1,d.hosted=!1,d.parsed=[];for(arg in d)a[arg]!==undefined&&(d[arg]=a[arg])}function f(){if(d.url.match(/^[\/|\.]/)||d.hosted)return d.url;var a=d.url.match(/http(s)*:/)?d.url.match(/key=(.*?)(&|#)/i)[1]:d.url,b=d.as_feeds?"feeds/cells/"+a+"/od6/public/basic?":"tq?out=json&key="+a+"&";return"http://spreadsheets.google.com/"+b+"tq="+encodeURIComponent(d.sql)+"&alt=json-in-script&callback=Tableconn.set_gdata"+"&s_id="+(new Date).getTime()}function g(a){return a.title.$t.length==2&&a.title.$t.substr(1,1)=="1"}function h(a){return a.title.$t.charAt(0)}var d={};return d.set_gdata=function(a){d.gdata=a},typeof this.google=="undefined"&&(this.google={visualization:{Query:{setResponse:d.set_gdata}}}),d.load=function(a,c){e(a);var g=b.createElement("script");g.type="text/javascript",g.src=f(),b.getElementsByTagName("head")[0].appendChild(g),safetyCounter=0;var h=setInterval(function(){if(safetyCounter++>20||d.gdata)clearInterval(h),d.parse_raw_data(d.gdata,c)},200)},d.filter=function(a,b){var c=[];for(var e=0;e<d.parsed.length;e++){var f=0;for(param in a)d.parsed[e][param]!==undefined&&d.parsed[e][param]==a[param]&&f++;f>0&&c.push(d.parsed[e])}b(c)},d.prototype={constructor:Tableconn,version:"0.0.1pre"},d.parse_raw_data=function(a,b){function f(a,b,c){typeof d.parsed[a]=="undefined"&&(d.parsed[a]={}),d.parsed[a][b]=c||null}if(a.status=="error")return b(a.errors[0]),!1;var c=d.as_feeds?a.feed.entry:a.table.rows,e={};d.parsed=[];for(var i=0;i<c.length;i++)if(d.as_feeds)g(c[i])?e[h(c[i])]=c[i].content.$t:f(parseInt(c[i].title.$t.substr(1)),e[h(c[i])],c[i].content.$t);else for(var j=0;j<c[i].c.length;j++){var k=a.table.cols[j].label||c[0].c[j].v;f(i,k,c[i].c[j]?c[i].c[j].v:null)}d.as_feeds&&d.parsed.splice(0,2),b(d.parsed)},d}(window,document,Tableconn);window.Tableconn=window.TC=Tableconn