//load json data
d3.json("data/samples.json").then((data) => {
  // create variables to hold different secionts of samples data set
  names = data.names;
  metadata = data.metadata;
  samples = data.samples;
  //Add an instruction menu option
  names.unshift("Select an ID");
  //Populate the drop down menu with ids
  d3.select("#selDataset").selectAll("option")
      .data(names)
      .enter()
      .append("option")
      .html(function(d){
          return `${d}`;
  });
});

//define optionChanged function  
function optionChanged(id){
  console.log(id);
  var idint = parseInt(id);
  
  //filter metadata by id selected by user
  var sample_metadata = metadata.filter(metadata => metadata.id === idint);
  var metadata_obj = sample_metadata[0];
  var metadata_arr = d3.entries(metadata_obj);
  console.log(metadata_arr);
  
  //clear Demographic Info before reload another id
  d3.select("#sample-metadata").selectAll("p").remove();

  //Populate Demographic Info by id
  d3.select("#sample-metadata").selectAll("p")
      .data(metadata_arr)
      .enter()
      .append("p")
      .html(function(d){
          console.log(d);
          return `<b>${d["key"]}:${d["value"]}</b>`;
      });
  
  //filter samples by id, and assign array of otu)ids, sample_values, and sample_labels to a variable
    var sample_data = samples.filter(samples => samples.id === id);
    console.log(sample_data);

    //var otu_ids = sample_data.otu_ids;
    var otu_ids = sample_data.map(function(d) { return d.otu_ids; })
    //var sample_values = sample_data.sample_values;
    var sample_values = sample_data.map(function(d) { return d.sample_values; })
    //var sample_labels = sample_data.otu_labels;
    var sample_labels = sample_data.map(function(d) { return d.otu_labels; })

    //Grab the first 10 sample values - data is already sorted
    var top_10_sample_values = sample_values[0].slice(0, 10);
    var top_10_otu_ids = otu_ids[0].slice(0,10);
    var top_10_sample_labels = sample_labels[0].slice(0,10);
    top_10_sample_values = top_10_sample_values.reverse();
    top_10_otu_ids = top_10_otu_ids.reverse();
    top_10_sample_labels = top_10_sample_labels.reverse();
    var otu_ids_label = top_10_otu_ids.map(el => 'OTU ' + el );
    
    //Draw the bar chart
    var trace1 = {
        x: top_10_sample_values,
        y: otu_ids_label,
        type: "bar",
        orientation: "h",
        marker: {
          color: 'rgb(142,124,195)'
        },
        text: top_10_sample_labels
      };
      
      var layout = {
        title: "Top 10 Bacteria Cultures Found",
      }; 

      var data1 = [trace1];

      Plotly.newPlot("bar", data1, layout);
    
    //Draw the bubble chart
    var trace2 = {      
        x: otu_ids[0],
        y: sample_values[0],
        mode: 'markers',
        marker: {
            size: sample_values[0],
            color: otu_ids[0],
        },
        text: sample_labels[0],
    };

    var data = [trace2];

    var layout = {
        title: 'Bacteria Cultures Per Sample',
        showlegend: false,
        xaxis: {
          title: {
            text: 'OTU ID',
          },
        },
    };

    Plotly.newPlot('bubble', data, layout);

    // Draw the gauge
    var data = [
        {
          domain: { x: [0, 1], y: [0, 1] },
          value: metadata_obj.wfreq,
          title: { 
                  text: "Belly Button Washing Frequency",
                },
          type: "indicator",
          mode: "gauge",
          delta: { reference: 380 },
          gauge: {
            axis: { range: [null, 9] },
            steps: [
              {range: [0,1], color: "Gainsboro"},
              {range: [1,2], color: "LightGray"},
              {range: [2,3], color: "Silver"},
              {range: [3,4], color: "DarkGray"},
              {range: [4,5], color: "Gray"},
              {range: [5,6], color: "DimGray"},
              {range: [6,7], color: "LightSlateGray"},
              {range: [7,8], color: "SlateGray"},
              {range: [8,9], color: "DarkSlateGray"},
            ],
            threshold: {
              line: { color: "red", width: 4 },
              thickness: 0.75,
              value: metadata_obj.wfreq,
            }
          }
        }
      ];
      
      var layout = {width: 600, 
                    height: 450, 
                    margin: { t: 0, b: 0 }, 
                    };
      Plotly.newPlot('gauge', data, layout);
};