let n = 2; //Number of particles
let r = 320; //radius of circle
let total = 3; //Steps to be taken
let occupied = new Array; //To check occupancy of each cell at any given step
let cells = 500; //Number of cells in system
let msd = new Array; //To store mean square displacement 
let positions = new Array; //To store position at any given step of each particle
let angle = 2*Math.PI/(cells); //Angle covered in single step
let steps = []; //2d Array
let stepCount = new Array; //To count steps taken by each particle since time elapsed
var dps = []; //to store data points to be plotted
let mean = [];

//Below sectoion explained in Motion.js
let s = cells/n;
for(let i = 0; i<cells; i++) occupied[i] = false;

for(let i = 0; i<cells; i++){
    if(i%s==0){
        positions.push(i);
        occupied[i] = true;
    }
}

//Initiating step array to 0
for(let i = 0; i<n; i++){
    steps[i] = new Array;
    stepCount[i] = 0;
    steps[i].push(0);
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
        //steps is 2d array storing displacement from initial position for all 100000 steps
        steps[i].push(stepCount[i]);
    }
}

//Algorithm to calculate mean square displacement
function newAlgo(){
    //To let the system run for all 100000 steps an store displacement data
    for(let i=0; i<total; i++){
        ruleset();
    }
    //To calculate msd vs time
    //dt represents step(time)
    for(let dt = 1; dt< total; dt ++){
        mean = [];
        //msd at dt = summation of (x(t + dt) - x(t))^2 over all t, which is in turn averaged over all particles
        for(let j=0; j<n; j++){
            //j represents jth particle
            let sum =0;
            for(let i=1; i<total; i++){
                if(i+dt < steps[j].length){
                sum += Math.pow((steps[j][i+dt] - steps[j][i]),2)}
            }
            //Storing the average(obtained for individual particle) of these in mean array
            mean[j] = sum/(total-dt); 
        }
        //Adding average msd of each particle in msd array corresponding that particular dt
        msd.push(average(mean));
        //storing data in log format for log-log plot
        dps.push({
            x: Math.log(dt),
            y: Math.log(average(mean))
        });
    }
}

//Introducing average function
function average(arr){
    let tot = 0;
    for(let i=0; i<arr.length; i++){
        tot += arr[i];
    }
    return tot/arr.length;
}

//Calling the function
newAlgo();

//Plotting dataset
window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        zoomType: "xy",
        exportEnabled: true,
        title: {
            text: "Mean Square Displacement"
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

//To print data points on screen
for(let i=0;i<25; i++) document.write("<br>");
var csv = msd.toString();
for(let i =0; i<msd.length; i++){
    document.write(msd[i], ",");
    document.write("<br>");
} 


 