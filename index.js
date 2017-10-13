var svg = d3.select("body").append("svg").attr("width", "1200").attr("height", "500"), // Appends a svg to the body and adds height and width attributes to it
    margin = {top: 50, right: 20, bottom: 30, left: 60},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#c3d4ce", "#448fa3", "#002c45", "#009999", "#f89521"]);

d3.text("index.txt") // get text from file `indext.txt`
  .get(onload);      // run function `onload()`

 function onload(error, data) {
  if (error) throw error;

  var doc = data;                                         // store `data` in variable `doc`
  var getHeader = data.indexOf('Periods');                // get index of header
  var getHeaderEnd = data.indexOf('\n', getHeader);       // get index of '\n' in the header a.k.a. the end of the header
      doc = doc.slice(getHeaderEnd).trim();               // slice `data`, without the header, from the doc and trim the remainder
  var footer = doc.indexOf('� Statistics Netherlands');   // get index of the footer
      doc = doc.slice(0, footer - 3);                     // slice the needed data, without the footer, from the doc
      doc = doc.replace(/;/g,',');                        // replace all instances of `;` with `,`
      doc = doc.replace(/,"number"/g,'');                 // replace all instances of `,"number"` with ``
      doc = doc.replace(/"/g,'');                         // replace all qoutation marks

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

  var keys = ["0 years", "1 to 5 years", "20 to 25 years", "40 to 45 years", "60 to 65 years"]; // manually create value for variable `keys`

  show(dataWomen);  // show the initial chart

  d3.select(".buttonWomen").on("click", function(){adjust(dataWomen);}); // add eventlistener to button with class `.buttonWomen` and run function `adjust()` with the data about women
  d3.select(".buttonMen").on("click", function(){adjust(dataMen);});       // add eventlistener to button with class `.buttonMen` and run function `adjust()` with the data about men

  function show(data) {

    x0.domain(data.map(function(d) { return d.Year; }));
    x1.domain(keys).rangeRound([0, x0.bandwidth()]);
    y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();


    // create bars and give them the correct properties
    g.append("g")
      .selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.Year) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("class", ("bar"))
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth())
        .attr("height", function(d) { return height - y(d.value); })
        .attr("fill", function(d) { return z(d.key); });

    g.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x0));

    g.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y).ticks(null, "s"))
      .append("text")
        .attr("x", 2)
        .attr("y", y(y.ticks().pop()) + 0.5)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "start")
        .text("Deaths");

    // create legend and store it in variable
    var legend = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "start") // changed anchor to `start`
      .selectAll("g")
      .data(keys.slice().reverse())
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    // add bars with correct colors to the legend give them the right position
    legend.append("rect")
        .attr("x", width + 30)
        .attr("width", 40)
        .attr("height", 18)
        .attr("fill", z);

    // add text to the legend and give it the right position
    legend.append("text")
        .attr("x", width + 80)
        .attr("y", 9.5)
        .attr("dy", "0.32em")
        .text(function(d) { return d; });
  }


    // adjust bars so it matches the data from `dataMen`
    function adjust(data) {
      x0.domain(data.map(function(d) { return d.Year; }));
      x1.domain(keys).rangeRound([0, x0.bandwidth()]);
      y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

      g.append("g")
        .selectAll("g")
        .data(data)
        .enter().append("g")
          .attr("transform", function(d) { return "translate(" + x0(d.Year) + ",0)"; })
        .selectAll(".bar")
        .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; });
      });

        g.selectAll(".bar")                                     // select all `g` elements with class `bar`
          .transition()                                         // add a transiton
          .duration(1000)                                       // of 1s
          .attr("x", function(d) { return x1(d.key); })
          .attr("y", function(d) { return y(d.value); })
          .attr("width", x1.bandwidth())
          .attr("height", function(d) { return height - y(d.value); })
          .attr("fill", function(d) { return z(d.key); });
    }
}
