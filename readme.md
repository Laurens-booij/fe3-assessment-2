# Interactive grouped bar chart
## Preview
![alt text][preview]

## Description
This is a interactive grouped bar chart based on [Block 3887051][source] by [Mike Bostock][author].
## Background
The chart displays the deaths for different age groups. The user can interact with it by clicking the buttons for men and women. The chart then displays the corresponding data.

## Changes
First I separated the `index.html` file into separate files. The files are listed below. After that I made changes to the files to achieve my end result. The changes I made are listed below:

### index.html
* Removed `<svg>` tag.
* Added `<html>`, `<head>`, `<body>`, `<meta>` and `<title>` tags.
* Added `<link>` tag linking `index.html` to `index.css`.
* Added `<script>` tag linking `index.html` to `index.js`.
* Added `<button>` tags that can be targeted by eventlisteners in `index.js`. The code looks as follows:

```
<button class="buttonMen">Men</button>
<button class="buttonWomen">Women</button>
```

### index.css
The only css that was included in the original file was the following line:

`.axis .domain {
  display: none;
}`

Further than that  I wrote all the css myself.

### JavaScript
* Added code to create the svg in the `.js` file instead of in the `html` file.
* Changed the code that loads the data file to:
```javascript
d3.text("index.txt") // get text from file `indext.txt`
  .get(onload);      // run function `onload()`

 function onload(error, data){}
```
* Changed hex codes to give the bars and legend my desired colors. This is done in the following code:
```javascript
var z = d3.scaleOrdinal()
    .range(["#c3d4ce", "#448fa3", "#002c45", "#009999", "#f89521"]);
```

* Added code to clean the data:
```javascript
let doc = data;                                         // store `data` in variable `doc`
let getHeader = data.indexOf('Periods');                // get index of header
let getHeaderEnd = data.indexOf('\n', getHeader);       // get index of '\n' in the header a.k.a. the end of the header
    doc = doc.slice(getHeaderEnd).trim();               // slice `data`, without the header, from the doc and trim the remainder
let footer = doc.indexOf('� Statistics Netherlands');   // get index of the footer
    doc = doc.slice(0, footer - 3);                     // slice the needed data, without the footer, from the doc
    doc = doc.replace(/;/g,',');                        // replace all instances of `;` with `,`
    doc = doc.replace(/,"number"/g,'');                 // replace all instances of `,"number"` with ``
    doc = doc.replace(/"/g,'');                         // replace all quostation marks
```

* Added code to parse the data into csv format and store it in objects. This way it is suitable to use in the function that uses the data to create the chart. I did this twice, each with different index numbers, in order to create two datasets that can be loaded into the chart.  See code below:
```javascript
var dataMen = d3.csvParseRows(doc, mapMen);             // parse data in csv format
var dataWomen= d3.csvParseRows(doc, mapWomen);          // for different datasets

  function mapMen(d) {                          // Get data about men and store values in objects
      return {
                    Year: d[0],
               "0 years": Number(d[1]),         // Get data as number type
          "1 to 5 years": Number(d[2]),
        "20 to 25 years": Number(d[3]),
        "40 to 45 years": Number(d[4]),
        "60 to 65 years": Number(d[5]),
      };
    }

    function mapWomen(d) {                      // Get data about women and store values in objects
        return {
                      Year: d[0],
                 "0 years": Number(d[6]),       // Get data as number type
            "1 to 5 years": Number(d[7]),
          "20 to 25 years": Number(d[8]),
          "40 to 45 years": Number(d[9]),
          "60 to 65 years": Number(d[10]),
        };
      }
```

* Changed:
```javascript
var keys = data.columns.slice(1);
```

  To:

  ```javascript
  var keys = ["0 years", "1 to 5 years", "20 to 25 years", "40 to 45 years", "60 to 65 years"]; // manually create value for variable `keys`
  ```

  This solution manually stores the label values. At first I did not understand why the original code did not work for me. I eventually ran the source code and logged many of its variables, in order to see what it does. I found out that variable `keys` stored the values of the labels in an array. Because my data file did not deliver the labels properly, I ended up manually storing the values in variable `keys`.

* Added event listener that are linked to the `<button>` tags in the html file. Each eventlistener runs the `adjust()` function, but with a different dataset. The code looks as follows:
  ```javascript
  d3.select(".buttonWomen").on("click", function(){adjust(dataWomen);});
  d3.select(".buttonMen").on("click", function(){adjust(dataMen);});  
 ```

* Added `show(dataWomen);` to load the initial chart upon loading the page.

* Added function `adjust()` to adjust the bars according to the given dataset.

## Data

The data that I used is about the amount of death in different age groups. I got the data from the website of the [cbs][dataset].

I selected the following age groups in my data:
  * 0 years
  * 1 to 5 years
  * 20 to 25 years
  * 40 to 45 years
  * 60 to 65 years

## Features
The chart makes use of the [d3 library](https://d3js.org/).

## License
Released under the GNU General Public License, version 3. © Laurens Booij

[source]:https://bl.ocks.org/mbostock/3887051
[author]:https://bl.ocks.org/mbostock
[cbs]: http://statline.cbs.nl/Statweb/publication/?DM=SLEN&PA=7052eng&D1=0&D2=1-2&D3=1-2%2c6%2c10%2c14&D4=61-65&LA=EN&HDR=G1&STB=T%2cG3%2cG2&VW=T
[preview]: preview.png
