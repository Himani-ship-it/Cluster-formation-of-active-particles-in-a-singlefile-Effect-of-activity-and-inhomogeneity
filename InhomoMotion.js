let n = 100; //Number of particles in the system
let m = 50;
let r = 300; //Radius of the system
let size = 3; //Size of each particle
let center = 500; //For co-ordinates of center of circle
let x = new Array; //for x-coordinates of particle
let y = new Array; //for y-coordinates of particle
let positions = new Array; //To store momentary positions for each particle
let occupied = new Array; //To check occupancy of each cell
let cells = 500; //Number of cells in a system
let angle = 2*Math.PI/(cells); //Angle covered by a particle in single step
let s = cells/n; 

var randomNumbers = [];
while(randomNumbers.length < m){
var numb = Math.floor(Math.random()*n);
if(randomNumbers.indexOf(numb) === -1) randomNumbers.push(numb);}
console.log(randomNumbers);

//Declaring all cells as empty at first
for(let i = 0; i<cells; i++) {
    occupied[i] = new Array;
    occupied[i][0] = false;
    occupied[i][1] = false;
}


//Distributing n particles uniformly across the system
for(let i = 0; i<cells; i++){
        if(i%s==0){
        positions.push(i);
        //Changing occupancy of these cells from false to true
        occupied[i][0] = true;
    }
}

for(let i = 0; i<randomNumbers.length; i++)occupied[positions[randomNumbers[i]]][1] = true;


//console.table(occupied);

//To create space of 12000x12000 on screen for motion
function setup(){
    createCanvas (12000, 12000);
    frameRate(100);
}

//To Visualize the motion
//draw function is a loop and keeps on running until you close the program
function draw(){
    fill(255); //Number represents colour to be filled, 255==white
    //Two concentric circles to create ring
    ellipse(center, center, 2*(r+size), 2*(r+size)); 
    ellipse(center, center, 2*(r-size), 2*(r-size));

    ruleset(); //to be declared
    
    //Drawing all the particles
    for(let i=0; i<n; i++){
        fill(0); //0==black
        ellipse(x[i], y[i], size, size);
    }
}

/*Ruleset to declare particle behaviour
If probabilistic motion tells particle to go clockwise:
    a. If next cell in clockwise direction is occupied, particle stays in original cell
    b. If next cell in clockwise direction is free, particle goes to that cell
    c. It does not go anticlockwise until probability says so
*/
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
                else if(probability>=p1 && occupied[positions[i]-1][0]==false){
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
        //Updating coordinates
        x[i] = center + r*Math.cos(positions[i]*angle);
        y[i] = center + r*Math.sin(positions[i]*angle);
    }
}


