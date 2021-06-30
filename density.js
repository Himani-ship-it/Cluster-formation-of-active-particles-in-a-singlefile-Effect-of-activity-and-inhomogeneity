let n = 100; //Number of particles
let r = 300; //radius of circle
let size = 3; //Size of particle
let center = 500; //for coordinate of center of circle
let group = 10; //Taking this as maximum size of cluster
let x = new Array; //For x-coordinates of particles
let y = new Array; //For y-coordinates of particles
let histo = new Array; //To store final probabilities according to cluster sizes
let positions = new Array; //To store positions of each particle at any given step
let occupied = new Array; //To check and update occupancy of cells at any given step
let clusters = new Array; //An array representing cluster sizes
let total = 0;
let cells = 500; //Total number of cells
let angle = 2*Math.PI/(cells); //Angle covered by particle in one step
let s = cells/n;
let dps = []; //To store data points to be plotted

//Initiating all data points to 0
for(let i=0; i<group; i++)histo[i] = 0;

//Following segment explained in Motion.js
for(let i = 0; i<cells; i++) occupied[i] = false;
for(let i = 0; i<cells; i++){
        if(i%s==0){
        positions.push(i);
        occupied[i] = true;
    }
}

//Ruleset explained in Motion.js
function ruleset(){
    p = 5;
    for(i=0; i<n; i++){
        probability = Math.floor(Math.random()*10);
        if(positions[i] >0 && positions[i]<cells-1){
            if(probability<p && occupied[positions[i]+1]==false){
                occupied[positions[i]] = false;
                occupied[positions[i]+1] = true;
                positions[i] +=1;                
            }
            else if(probability>=p && occupied[positions[i]-1]==false){
                occupied[positions[i]] = false;
                occupied[positions[i]-1] = true;
                positions[i] -=1;                
            }
        }
        else if(positions[i] ==0){
            if(probability<p && occupied[positions[i]+1]==false){
                occupied[positions[i]] = false;
                occupied[positions[i]+1] = true;
                positions[i] +=1;
            }
            else if(probability>=p && occupied[cells-1]==false){
                occupied[positions[i]] = false;
                occupied[cells -1] = true;
                positions[i] = cells -1;
            }
        }
        else if(positions[i] ==cells-1){
            if(probability<p && occupied[0]==false){
                occupied[positions[i]] = false;
                occupied[0] = true;
                positions[i] =0;
            }
            else if(probability>=p && occupied[positions[i]-1]==false){
                occupied[positions[i]] = false;
                occupied[positions[i]-1] = true;
                positions[i] -=1;
            }
        }
        x[i] = center + r*Math.cos(positions[i]*angle);
        y[i] = center + r*Math.sin(positions[i]*angle);
    }
}

//To calculate Probability of occurence of each cluster size
function density(){
    let sum;
    let join; //A variable introduced specifically for clusters at booundaries (clusters containing cells 0 and/or 499)
    //join represents cluster beginning at cell 0, that should be joined to cluster that ends at cell 499
    //Taking 5000 iterations/steps
    for(let i=0; i<5000; i++)ruleset();

    for(let k=0; k<5000; k++){
        ruleset();
        join = 0;
        sum = 0;

        //Checking occupancy at each cell
        for(let i=0;i<cells; i++){
            if(occupied[i] ==true && occupied[i-1]==false){
                sum =1;
                //sum tracks number of particles in cluster so far
                index = i //index indicates cell number where the cluster began
                if(i== cells-1 && join>0){
                    sum = sum + join
                    clusters.push(sum);
                }
            }
            else if(occupied[i] ==true) {
                sum +=1;
                if(i== cells-1){
                    if(join>0)sum = sum + join
                    else if(join==0 && occupied[0]==true)sum = sum +1

                    clusters.push(sum);
                }
            }
            else if(occupied[i]==false && sum>1){
                if(index !=0){
                    clusters.push(sum);
                    sum =0;
                }
                else if(index ==0) join = sum; 
            }
            else {
                if(i == cells-1 && join >1){
                    clusters.push(sum)
                }                
            }
        }
    } 
    //Clusters now contains all the cluster sizes obtained in 5000 iterations

    //Counting clusters of each sizes
    for(let i=0;i<clusters.length; i++){
        for(let j=2; j<group; j++){
            if(clusters[i] ==j) histo[j-2] +=1;
            total +=1;
        }
    }

    //Storing that data in probability form in the dps array to be plotted
    for(let i=0; i<group; i++){
        dps.push({
            x: i + 2,
            y: histo[i]/total
        })    
    }
}
    
//Calling the above function
density();

//Function to plot the data set thus obtained
window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        zoomType: "xy",
        exportEnabled: true,
        title: {
            text: "Particle Density Distribution"
        },
        axisX: {
            titleFontColor: "#4B81BC",
            title: "Cluster Size",
            minimum: 1
        },
        axisY: {
            title: "Probability Distribution",
            titleFontColor: "#4F81BC",
        },
        legend:{
            cursor:"pointer"
        },
        data: [{
            type: "column",
            dataPoints: dps
        }]
    });
    
    chart.render();    
}

//To print the value of data points to be plotted
for(let i=0;i<25; i++) document.write("<br>");
for(let i =0; i<histo.length; i++){
    document.write(histo[i]/total, ",");
    document.write("<br>");
} 