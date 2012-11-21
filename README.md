# Tableconn.js
A lightweight Google Spreadsheet Table connector

### The Problem
I work for a major Brazilian newspaper (Estadão) and others may have the same problem as me. Large companies do not allow to change the header of the server to do CORS, not without months of meetings. This can be a bit stressful. Sometimes we just want to create a visualization with few data and be able to maintain the data from time to time.

### The Advantage
I agree that in general terms is not a good idea to use JSONP. But in the case of GDocs maybe we could make an exception. This would allow, for example, that your code operate without requiring a server. Great advantage for beginners. :)

I wrote a first implementation of how this might work. It groups the two main ways that google allows to download data from the tables. Via feeds and [SQL query](https://developers.google.com/chart/interactive/docs/querylanguage). So the client does not need to download the entire table at once. That first implementation has less than 50 lines, but We can try to reduce more =)


`if you planning to use SQL: Google has a bug on retrieving tables using SQL.`
`Insert a first column called 'ID' and a second row with '1'.`

### Requirements
The table must be configured as public. The first row of the table must have the column names.

#### Restrictions
Google Spreadsheet does not allow more than 20MB or 400.000 cells. So this strategy does not replace a good database.

## Usage
```javascript
TC.load ({
    url: "", //url or table key
    sql: "", //table selection [optional]
    hosted: false, //you can use google response from your own server [optional] 
    as_feed: false //strategy used to download data [optional]
}, function (data) {
    //where magic happens

    //if you need to filter your data
    TC.filter({column_name:"match"},function(result){
      //'result' is a new array
    })
})
```
### D3js
The data structure is similar to that used by https://github.com/mbostock/d3 . Thus, you can use the 'tableconn' integrated with your visualization!

### Security
The URL is disassembled, reassembled and parsed with a single callback enabled and it will runs within the Tableconn

### Testing
Please open "/test/test.html" at your browser

**TO-DO** *Include support for choose specific Sheets on table*

