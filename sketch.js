let r = 320;
let noiseScale = 0.03;
let noiseAmount = 100;
let tempo = 0;
 
function setup(){
  createCanvas(400,400);
noFill();
 background(0);

port = createSerial();//initialise serial connection 


//create a button to connect with Arduino
connectBtn = createButton('Connect to Arduino');
connectBtn.position(20, 360);
connectBtn.mousePressed(connectBtnClick);
}

 
function distortedGrid(cols = 10, rows = 10, size = 20) {
 let cellWidth = width / cols;
 let cellHeight = height / rows;
 for (let i = 0; i <= cols; i++) {
   for (let j = 0; j <= rows; j++) {
     let x = i * cellWidth;
     let y = j * cellHeight;
     x += map(noise(noiseScale * x, noiseScale * y, frameCount / 200), 0, 1, -noiseAmount, noiseAmount);
     y += map(noise(noiseScale * x, noiseScale * y, 1 + frameCount / 300), 0, 1, -noiseAmount, noiseAmount);
 
     fill(lerpColor(color('yellow'), color('red'), noise(frameCount / 100 + i * j)));
     ellipse(x, y, size);
   }
 }
}
 
function draw() {


  //map the sensor readings and then use if statements to split into three groups
  let val = port.readUntil("\n"); 
  myVal = val;

  tempo = map(myVal, 0, 1023, 0, 3);
  noiseAmount = map(myVal, 0, 1023, 50, 500);

  //depending on the sensor readings the background changes and the distorted grid changes
 if (tempo < 1) {
   background(10, 20, 40, 30);
   distortedGrid(5, 5, 15);

 } else if (tempo >= 1 && tempo < 2) {
   background(30, 60, 90, 50);
   distortedGrid(10, 10, 25);

 } else if (tempo >= 2) {
   background(100, 150, 200, 100);
   distortedGrid(20, 20, 30);
 }
}

function connectBtnClick() {
  console.log('my button is working');
  if (!port.opened()) {             
    port.open('Arduino', 9600);      
  } else {
    port.close();                   
  }
}
