let n = 250; // Number of particles
let r = 320; //radius of circle
let occupied = new Array; //array to check occupancy of each cell
let cells = 500; //number of cells in the system
let steps = 500; //total steps(time) to be taken
let averagedVelocity = new Array; //to store averaged Velocity 
let positions = new Array; //to store position of every particle at any given step
let angle = 2*Math.PI/(cells); //angle covered in a single step
let stepCount = new Array; //to track displacement of particle for every step
let dps = [];


//Following segment explained in motion.js
let s = cells/n;
function initialCondition(){
    for(let i = 0; i<cells; i++) occupied[i] = false;
    for(let i = 0; i<cells; i++){
    if(i%s==0){
    positions.push(i);
    occupied[i] = true;
    }
}
for(let i=0; i< n; i++) stepCount[i] = 0;

averagedVelocity[0] = 0;
}

initialCondition();
//Ruleset explained in Motion.js
function ruleset(){
    p = 9;
    for(i=0; i<n; i++){
        probability = Math.floor(Math.random()*10);
        if(positions[i] >0 && positions[i]<cells-1){
            if(probability<p && occupied[positions[i]+1]==false){
                occupied[positions[i]] = false;
                occupied[positions[i]+1] = true;
                positions[i] +=1;
                stepCount[i] +=1;
            }
            else if(probability>=p && occupied[positions[i]-1]==false){
                occupied[positions[i]] = false;
                occupied[positions[i]-1] = true;
                positions[i] -=1;
                stepCount[i] -=1;
            }
        }
        else if(positions[i] ==0){
            if(probability<p && occupied[positions[i]+1]==false){
                occupied[positions[i]] = false;
                occupied[positions[i]+1] = true;
                positions[i] +=1;
                stepCount[i] +=1;
            }
            else if(probability>=p && occupied[cells-1]==false){
                occupied[positions[i]] = false;
                occupied[cells -1] = true;
                positions[i] = cells -1;
                stepCount[i] -=1;
            }
        }
        else if(positions[i] ==cells-1){
            if(probability<p && occupied[0]==false){
                occupied[positions[i]] = false;
                occupied[0] = true;
                positions[i] =0;
                stepCount[i] +=1;
            }
            else if(probability>=p && occupied[positions[i]-1]==false){
                occupied[positions[i]] = false;
                occupied[positions[i]-1] = true;
                positions[i] -=1;
                stepCount[i] -=1;
            }
        }
    }
}
//Initializing a 2D array to 0. to store instantaneous velocities of each particle
let velData = new Array;
for(let i=0; i<steps; i++) {
    velData[i] = new Array(n);
    for(let j=0; j<n; j++)velData[i][j]=0;
}

let stringVelocities = new Array; // to string together velocities of individual particles in steady state
let glidingAvg = new Array; // to store gliding average of particle velocities stringed together
glidingAvg[0] = 0;

//Function to calculate single particle tracking averagedVelocity (averaged for all particles for better results)
let sum;
let displ = new Array(n); // to store i_th displacement of all particles
function avgVel(){
    initialCondition();
    for(let i=0; i<steps; i++){
        sum = 0;
        //sum adds averagedVelocity of each particle at ith step
        for(let j=0; j<n; j++) displ[j] = stepCount[j];
    
        //Storing current displacements in the array
        ruleset();
        for(let j=0; j<n; j++) {
            sum += stepCount[j] - displ[j];
            velData[i][j] = stepCount[j] - displ[j];
        }
        //average averagedVelocity of all particles to be added in averagedVelocity array
        averagedVelocity.push(sum/n);
    }
}
//avgVel = Function to store velocity of every individual particle, and averaged velocities 

function stringingVelocities(){
    initialCondition();
    for(let i = 0; i<5000; i++)ruleset();

    for(let i=0; i<steps; i++) {
        velData[i] = new Array(n);
        for(let j=0; j<n; j++)velData[i][j]=0; //Initiating matrix to 0
    }   
    for(let i=0; i<steps; i++){
        for(let j=0; j<n; j++) displ[j] = stepCount[j];
        //Storing current displacements in the array
        ruleset();
        for(let j=0; j<n; j++) velData[i][j] = stepCount[j] - displ[j];
    }

    for(let j = 0; j<n; j++){
        for(let i = steps-10; i<steps; i++)stringVelocities.push(velData[i][j]);
            }
}

stringingVelocities(); 
//function to calculate gliding average
function glidingAverage(arr){
    let avg;
    let total; //to store summed values
    let counter; //to count the number of terms being added
    for(let dt=1; dt<arr.length; dt++){
        avg = 0;
        counter = 0;
        for(let i = 0; i<=arr.length-dt; i++){
            total = 0;
            for(let j=i; j<i+dt; j++)total +=arr[j];
            avg += total/dt;
            counter += 1
        }
        glidingAvg[dt] = avg/counter;
        dps.push({
            x: dt,
            y: glidingAvg[dt]
        })
    }
}
//avgVel();
let histo = [];
function histogram(arr){
    let total; 
    dt = 10
    for(let i = 0; i<=arr.length-dt; i++){
        total = 0;
        for(let j=i; j<i+dt; j++)total +=arr[j];
        histo[i] = total/dt;
        }
}

//histogram(stringVelocities);
glidingAverage(stringVelocities);

//Function to calculate mean
function mean(arr){
    let mean;
    var total = 0;
    for(let i=0; i<arr.length; i++){
        total +=arr[i]
    }
    mean = total/arr.length;
    return mean;
}

//Function to calculate third moment
function skewness(arr){
    let skewness;
    var total = 0;
    for(let i=0; i<arr.length; i++)total += (arr[i] - mean(arr))**3;
    skewness = total/((arr.length-1)*standardDev(arr)**(3/2));
    return skewness;
}
//Fourth Moment
function kurtosis(arr){
    let kurtosis;
    var total = 0;
    for(let i=0; i<arr.length; i++)total += (arr[i] - mean(arr))**4;
    kurtosis = total/((arr.length-1)*standardDev(arr)**2);
    return kurtosis;
}
//Standard Deviation    
function standardDev(arr){
    let sD;
    var total = 0;
    for(let i=0; i<arr.length; i++)total += (arr[i] - mean(arr))**2;
    sD = (total/arr.length)**(1/2);
    return sD;
}

window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        zoomType: "xy",
        exportEnabled: true,
        title: {
            text: "Mean Velocity"
        },
        axisX: {
            logarithmic: true,
            titleFontColor: "#4B81BC",
            title: "Time",
            minimum: .01
        },
        axisY: {
            title: "MSD",
            logarithmic: true,
            titleFontColor: "#4F81BC",
        },
        legend:{
            cursor:"pointer"
        },
        data: [{
            type: "line",
            dataPoints: dps
        }]
    });
    
    chart.render();    
}

for(let i=0;i<25; i++) document.write("<br>");
//Function to print averagedVelocity values on screen (to be stored in csv format to analyze better in origin)
/*document.write("Mean:", mean(glidingAvg));
document.write("<br>");
document.write("Standard Deviation:", standardDev(glidingAvg));
document.write("<br>");
document.write("Skewness:", skewness(glidingAvg));
document.write("<br>");
document.write("Kurtosis:", kurtosis(glidingAvg));
document.write("<br>");

/*for(let i = 0; i<steps; i++){
    for(let j = 0; j<n; j++){
        document.write(velData[i][j], ",")
    }
    document.write(averagedVelocity[i], ",")
    document.write("<br>")
}
*/

for(let i = 1; i<glidingAvg.length; i++){
    document.write(glidingAvg[i]);
    document.write("<br>");
}

 