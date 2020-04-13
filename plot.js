// intitial function on startup
function init() {
    var selector = d3.select("#selDataset");
    
    d3.json("samples.json").then((data) => {
      console.log(data);
      var sampleNames = data.names;
      sampleNames.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
    }
  )};
  // Populates browser on load up
  optionChanged(940);
// function that calls other two functions when select box is changed
function optionChanged(newSample) {
    buildMetadata(newSample);
    buildCharts(newSample);
}
// function to populte demographic panel
function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
      var PANEL = d3.select("#sample-metadata");
  
      PANEL.html("");
    
      Object.entries(result).forEach(([key,value]) => PANEL.append("h6").text(`${key}: ${value}`));
      
    
    });
  }
// function to build charts based on selected id in select box
function buildCharts(sample) {
  d3.json("samples.json").then((data) => {
    // sample data
    var samples = data.samples;
    var resultArray = samples.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // metadata data
    var metadata = data.metadata;
    var resultArrays = metadata.filter(sampleObj => sampleObj.id == sample);
    var results = resultArrays[0];

    // bar chart 
    var sampleValues = result.sample_values.slice(0,10).reverse();
    var otuID = result.otu_ids.slice(0,10);
    var otuIDstr = otuID.map(number => "OTU "+ number.toString()).reverse();

    var trace = {
      x: sampleValues,
      y: otuIDstr,
      text: result.otu_labels.slice(0,10).reverse(),
      type: 'bar',
      orientation: 'h'
    };

    var data = [trace];
    var layout = {
      title: "Top 10 Bacteria"
    };

    Plotly.newPlot("bar", data, layout);

    // bubble chart
    var trace1 = {
      x: result.otu_ids,
      y: result.sample_values,
      mode: 'markers',
      marker: {size: result.sample_values,
        color: result.otu_ids
      },
      text: result.otu_labels
    };

    var data = [trace1];

    var layout = {
      title: 'Bubble Chart of Bacteria'
    };

    Plotly.newPlot("bubble", data, layout);
    
    // wfreq indicator chart
    var data = [{
      type: "indicator",
      mode: "gauge+number",
      domain: {x: [0,1], y: [0,1]},
      value: results.wfreq,
      title: {text: "Weekly Washing Frequency"},
      gauge: {axis: {range: [null,9]}}
    }];
    
    var layout = { width: 600, height: 400 };

    Plotly.newPlot('gauge', data, layout);

  });
;}

init();
