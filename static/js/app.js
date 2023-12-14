// define url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"


// API call to url as instructed
d3.json(url).then(function(data) {

    // old testing print statements to look at shape of json data
    //console.log(data.metadata[0]);
    //console.log(data.names[0]);
    //console.log(data.samples[0]);

    let metadataArr = [];
    let samplesArr = [];

    // data has metadata, names, samples
    // each one is an array with 153 entries

    for (let i=0; i<153; i++) {
        // this is going through the data
        // add it to our big list
        //console.log(data.metadata[i], data.samples[i]);
        metadataArr.push(data.metadata[i]);
        samplesArr.push(data.samples[i]);
    }


    // use the makelabels function on the slice of otu ids
    bar_y = makeLabels(samplesArr[0].otu_ids.slice(0,10));

    let barData = [{
        type: 'bar',
        x: samplesArr[0].sample_values.slice(0,10),
        y: bar_y,
        text: samplesArr[0].otu_labels.slice(0,10),
        orientation: 'h'
    }]

    let bubbleData = [{
        x: samplesArr[0].otu_ids,
        y: samplesArr[0].sample_values,
        mode: 'markers',
        marker: {size: samplesArr[0].sample_values, 
                 color: samplesArr[0].otu_ids},
        text: samplesArr[0].otu_labels
    }];

    Plotly.newPlot("bar", barData);
    Plotly.newPlot("bubble", bubbleData);


    // define var to hold metadata, literally jsut convenient
    let metadataText = `id: ${data.metadata[0].id} \n
    \n ethnicity: ${data.metadata[0].ethnicity} \n
    gender: ${data.metadata[0].gender} \n
    age: ${data.metadata[0].age} \n
    location: ${data.metadata[0].location} \n
    bbtype: ${data.metadata[0].bbtype} \n
    wfreq: ${data.metadata[0].wfreq}`;

    // put metadata into panel
    d3.select(".panel-body").text(metadataText);
    console.log(data.metadata[0]);


});



// define function out here to use in both inner scopes

function makeLabels(numbers) {
    labels = [];
    for (let i=0; i<numbers.length; i++) {
        // stick OTU on the front of this number and save it to new list
        labels.push("OTU " + numbers[i]);
    }

    return labels;
}




function optionChanged() {

    // get the new value from the dropdown
    let newID = d3.select("#selDataset").property("value");
    


    // need to use data in here
    d3.json("samples.json").then(function(data) {

        let newIndex;

        // loop through data to find selected id
        for (let i=0; i<153; i++) {
            if (data.metadata[i].id == newID) {
                // this is where we found selected id !
                // save this to newindex variable so we can reuse outside the loop
                newIndex = i;
            }
        }

        //console.log(data.metadata[newIndex]);
        //console.log(data.samples[newIndex]);

        // get y labels again for bar chart
        let bar_y = makeLabels(data.samples[newIndex].otu_ids.slice(0,10));
        
        // update bar chart x y and hover text
        // type and orientation of chart remain unchanged
        Plotly.restyle("bar", "x", [data.samples[newIndex].sample_values.slice(0,10)]);
        Plotly.restyle("bar", "y", [bar_y]);
        Plotly.restyle("bar", "text", [data.samples[newIndex].otu_labels.slice(0,10)]);


        // update bubble chart, x y marker color size and text all change
        let bubbleUpdate = {
            x: [data.samples[newIndex].otu_ids],
            y: [data.samples[newIndex].sample_values],
            marker: {size: data.samples[newIndex].sample_values, 
            color: data.samples[newIndex].otu_labels},
            text: data.samples[newIndex].otu_labels
        };

        // update bubble chart the same way
        Plotly.restyle("bubble", bubbleUpdate);
        
        // i cant get the color or size of the bubble chart to update
        // trying to pass them as nested doesnt work
        // and examples online only use static values
        // i give up here. sorry. chart has grey bubbles and weird size when you use the dropdown


        // update metadata text same way we set it
        let metadataText = `id: ${data.metadata[newIndex].id} \n
        \n ethnicity: ${data.metadata[newIndex].ethnicity} \n
        gender: ${data.metadata[newIndex].gender} \n
        age: ${data.metadata[newIndex].age} \n
        location: ${data.metadata[newIndex].location} \n
        bbtype: ${data.metadata[newIndex].bbtype} \n
        wfreq: ${data.metadata[newIndex].wfreq}`;

        d3.select(".panel-body").text(metadataText);

    });

}


