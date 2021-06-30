let n = 100;
let m = 90;
let r = 300;
let size = 3;
let center = 500;
let group = 10;
let x = new Array;
let y = new Array;
let sizes = new Array;
let positions = new Array;
let occupied = new Array;
let steps = 500;
let cells = 500;
let angle = 2*Math.PI/(cells);
let s = cells/n;
let dps = []; //to store data points to be plotted
let indices = []; //3D array
let clusterData = []; //To sort data of old and new clusters with sizes from indices array 
let clustLifetime = []; //To store size and occurence of a cluster in a lieftime

var randomNumbers = [];
while(randomNumbers.length < m){
var numb = Math.floor(Math.random()*n);
if(randomNumbers.indexOf(numb) === -1) randomNumbers.push(numb);}
for(let i = 0; i<cells; i++) {
    occupied[i] = new Array;
    occupied[i][0] = false;
    occupied[i][1] = false;
}
for(let i = 0; i<cells; i++){
    if(i%s==0){
    positions.push(i);
    occupied[i][0] = true;
    }
}
for(let i = 0; i<randomNumbers.length; i++)occupied[positions[randomNumbers[i]]][1] = true;

for(let i=0; i<steps; i++)indices[i] = new Array;

function ruleset(){
    p1 = 5; //Probability to go clockwise
    p2 = 9; //Probability to go clockwise for active particles
    //Applying ruleset to all particles
    for(i=0; i<n; i++){
        probability = Math.floor(Math.random()*10); //Picking random number from 0-9

        //for particles which are not in 0th or 499th cell
        if(positions[i] >0 && positions[i]<cells-1){
            if(occupied[positions[i]][1] == false){
                if(probability<p1 && occupied[positions[i]+1][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]+1][0] = true;
                    positions[i] +=1;                
                }
                else if(probability>=p2 && occupied[positions[i]-1][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]-1][0] = true;
                    positions[i] -=1;                
                }
            }

            else if(occupied[positions[i]][1] == true){
                if(probability<p2 && occupied[positions[i]+1][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]][1] = false;
                    occupied[positions[i]+1][0] = true;
                    occupied[positions[i]+1][1] = true;
                    positions[i] +=1;                
                    }
                    else if(probability>=p2 && occupied[positions[i]-1][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]][1] = false;
                    occupied[positions[i]-1][0] = true;
                    occupied[positions[i]-1][1] = true;
                    positions[i] -=1;                
                    }
            }    
        }

        //For particle which is at 0th position
        else if(positions[i] ==0){
            if(occupied[0][1] == false){
                if(probability<p1 && occupied[positions[i]+1][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]+1][0] = true;
                    positions[i] +=1;
                }
                else if(probability>=p1 && occupied[cells-1][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[cells -1][0] = true;
                    positions[i] = cells -1;
                }
            }
            else if(occupied[0][1] == true){
                if(probability<p2 && occupied[positions[i]+1][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]][1] = false;
                    occupied[positions[i]+1][0] = true;
                    occupied[positions[i]+1][1] = true;
                    positions[i] +=1;
                }
                else if(probability>=p2 && occupied[cells-1][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]][1] = false;
                    occupied[cells -1][0] = true;
                    occupied[cells -1][1] = true;
                    positions[i] = cells -1;
                }
            }
        }

        //For particle which is at 499th position
        else if(positions[i] ==cells-1){
            if(occupied[cells -1][1] == false){
                if(probability<p1 && occupied[0][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[0][0] = true;
                    positions[i] =0;
                }
                else if(probability>=p1 && occupied[positions[i]-1]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]-1][0] = true;
                    positions[i] -=1;
                }
            }
            else if(occupied[cells -1][1] == true){
                if(probability<p2 && occupied[0][0]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]][1] = false;
                    occupied[0][0] = true;
                    occupied[0][1] = true;
                    positions[i] =0;
                }
                else if(probability>=p2 && occupied[positions[i]-1]==false){
                    occupied[positions[i]][0] = false;
                    occupied[positions[i]][1] = false;
                    occupied[positions[i]-1][0] = true;
                    occupied[positions[i]-1][1] = true;
                    positions[i] -=1;
                }
            }   
        }
    }
}
//function to store cluster size and their indices with new row for each step
function clusterSizes(){
    let index = 0;
    let sum=0;
    let join;
    for(let m=0; m<steps; m++){
        ruleset();
        join = 0;
        sum = 0;
        for(let i=0;i<cells; i++){
            if(i>0 && occupied[i][0] ==true && occupied[i-1][0]==false){
                sum =1;
                index = i;
                if(i== cells-1 && join>0){
                    sum = sum + join;
                    indices[m].push([index, sum]);
                }
            }
            else if(occupied[i][0] ==true) {
                sum +=1;
                if(i== cells-1){
                    if(join>0)sum = sum + join;
                    else if(join==0 && occupied[0][0]==true)sum = sum +1;

                    indices[m].push([index, sum]);
                }
            }
            else if(occupied[i][0]==false && sum>1){
                if(index !=0){
                    indices[m].push([index, sum]);
                    sum =0;
                }
                else if(index ==0) join = sum; 
            }
            else {
                if(i == cells-1 && join >1){
                    indices[m].push([0, join]);
                }
            }
        }
    }   
}
let total = 0;
//Function to sort old and new clusters and their corresponding sizes in a 2D matrix
function clusterInstances(){
    let endCluster = 0;
    let label;
    let start;
    let end;
    let oldCluster;

    for(let j=0; j<10;j++){
        if(indices[j].length>0){
            for(let i=0; i<indices[j].length; i++){
                endCluster = indices[j][i][0]+indices[j][i][1] -1
                clusterData.push([i, indices[j][i][1], indices[j][i][0], endCluster]);
                label = i;
                start = 0;
                end = clusterData.length;
            }
            break;
        }
    }
    
    let startIndex1, endIndex1;
    let startIndex2, endIndex2;
    for(let m = 1; m<indices.length; m++){
        /*document.write(end-start);
        document.write("<br>");
        document.write(indices[m-1].length);
        document.write("<br>");*/

        for(let i = 0; i<indices[m].length; i++){
            total +=1;
            startIndex1 = indices[m][i][0];
            endIndex1 = indices[m][i][0] + indices[m][i][1]-1;
            for(let j = start; j<end; j++){
                startIndex2 = clusterData[j][2];
                endIndex2 = clusterData[j][3];

                if(endIndex2>=500 && startIndex1>=0 && startIndex1<=(endIndex2-500)){
                    clusterData.push([clusterData[j][0], indices[m][i][1], startIndex1, endIndex1]);
                    oldCluster = true;
                    break;
                }
                else if(endIndex1>=500 && startIndex2>=0 && startIndex2<=(endIndex1 - 500)){
                    clusterData.push([clusterData[j][0], indices[m][i][1], startIndex1, endIndex1]);
                    oldCluster = true;
                    break;
                }
                else if(startIndex2>endIndex1) {
                    label ++;
                    clusterData.push([label, indices[m][i][1], startIndex1, endIndex1]);
                    oldCluster = true;
                    break;
                }

                oldCluster = (startIndex1<=endIndex2 && startIndex1>=startIndex2) || (endIndex1<=endIndex2 && endIndex1>=startIndex2) || (startIndex2<=endIndex1&&startIndex2>=startIndex1) || (endIndex2<=endIndex1&&endIndex2>=startIndex1);

                if(oldCluster){
                    clusterData.push([clusterData[j][0], indices[m][i][1], startIndex1, endIndex1]);
                    break;
                }
            }
            if(!oldCluster){
                label ++;
                clusterData.push([label, indices[m][i][1], startIndex1, endIndex1]);
            }     
        }
        start = end;
        end = clusterData.length;
       // document.write(start);
       // document.write("<br>");
       // document.write(end);
       // document.write("<br>");
    }
}

/*document.write(total);
document.write("<br>");
document.write(clusterData.length);*/

function lifeTime(){
    let time;
    let size;
    let index;
    for(let i=0; i<clusterData.length; i++){
        index = clusterData[i][0];
        time = 1;
        size = clusterData[i][1];
        for(let j = i + 1; j<clusterData.length; j++){
             if(clusterData[j][0] == index){
                time +=1;
                size += clusterData[j][1];
                clusterData.splice(j,1);
                j = j-1;
             }
        }
        size = size/time;
        clustLifetime.push([index, time, parseFloat(size.toFixed(2))]);
    }
}

for(let i=0; i<5000; i++)ruleset();
clusterSizes();
clusterInstances();
lifeTime();
let sizeVTime = [];

for(let i=0; i<clustLifetime.length; i++){
    let time1=clustLifetime[i][1];
    let count = 1;
    for(let j=i+1; j<clustLifetime.length; j++){
        if(clustLifetime[j][2] == clustLifetime[i][2]){
            count +=1;
            time1 += clustLifetime[j][1];
            clustLifetime.splice(j,1);
            j = j-1;
        }
    }
    sizeVTime.push([clustLifetime[i][2], time1/count]);
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}

sizeVTime.sort(sortFunction);

let allSizes = [];
let allLifetimes = [];

for(let i=0; i<sizeVTime.length; i++){
    allSizes.push(sizeVTime[i][0]);
    allLifetimes.push(sizeVTime[i][1]);
    dps.push({
        x: sizeVTime[i][0],
        y: sizeVTime[i][1]    
    });
}

function average(arr){
    let sum = 0;
    let avg = 0;
    for(let i=0; i<arr.length; i++)sum += arr[i];
    avg = sum/arr.length;
    return avg;
}

//console.table(clusterData);
 window.onload = function () {
    var chart = new CanvasJS.Chart("chartContainer", {
        zoomEnabled: true,
        zoomType: "xy",
        exportEnabled: true,
        title: {
            text: "Average lifetime of Clusters"
        },
        axisX: {
            titleFontColor: "#4B81BC",
            title: "Cluster Size",
            minimum: 1.8
        },
        axisY: {
            title: "Average Lifetime",
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

for(let i=0;i<30; i++) document.write("<br>");
document.write("Average Size: ", average(allSizes));
document.write("<br>");
document.write("Average Lifetime: ", average(allLifetimes));
document.write("<br>");
for(let i=0; i<clustLifetime.length; i++){
    document.write(dps[i].x, " , ", dps[i].y);
    document.write("<br>");
}


