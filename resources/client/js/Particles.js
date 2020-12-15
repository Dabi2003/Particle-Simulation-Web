let canvas; //the canvas in HTML
let ctx; //the context of the canvas
let p1; //particle  entered by user
let p2; //particle clone that user has entered
let p3;// anti particle
let p4;//product particle
let check=0;// at first no particle is created so check is at false
let collide=false;// at first there is no collision detected so 'collide' is false.
let p3load=false; // no particles that should appear after the process must appear at the start of simulation.
let p4load=false;
let pause;
function getParticle(){   //API used ti fetch particle data from database
    console.log("Invoked getParticle()");
    const Name= document.getElementById("Particle").value;
    let Speed=document.getElementById("speed").value;
    const url="/Particles/get/";
    fetch(url+Name,{
        method:"GET",
    }).then(response=>{
        return response.json();
    }).then(response=>{
        if(response.hasOwnProperty("Error")){
            alert(JSON.stringify(response));
        } else{
            p1= new Particle(10,300,parseFloat(Speed),0.0,response.Radius,getRandomColor(),response.Symbol); //the particle the user has entered is created
            p2= new Particle(700,300,parseFloat(Speed),0.0,response.Radius,getRandomColor(),response.Symbol);//the particle clone is created as well
            p3= new Particle(400,300,parseFloat(Speed),0.0,p1.radius,getRandomColor(),response.AntiSymbol); //the anti particle that is made after the process.
            p4=new Particle(300,300,parseFloat(Speed)*-1,0.0,p1.radius,getRandomColor(),response.Symbol);//product particle created/
            console.log(p1.radius);
            console.log(p1.vx);
            check=1;
            return(check);



        }

    })



}
function pageLoad() {

    canvas = document.getElementById("canvas"); //capturing canvas element so that canvas may be used.
    ctx = canvas.getContext('2d'); // drawings in canvas are set to 2 dimensional.
    console.log(ctx);
    canvas.width = 800; //width of canvas modified due to canvas initially small
    canvas.height = 600;// height of canvas modified due to canvas initially small

    Proton= new Particle( 10, 300,3,0,8,"yellow","p"); //proton particle created



}

function Particle(px, py, vx, vy, radius, colour,symbol) {    // class named particles t take values of the x and y position, radius and colour
    this.px = px;
    this.py = py;
    this.vx = vx;
    this.vy = vy;
    this.velocity = {
        x: vx,
        y: vy
    }
    this.radius = radius;
    this.colour = colour;
    this.mass = 1; // mass of particles is one.
    this.symbol=symbol;

    this.load = function () { //method to load the particle on screen
        ctx.beginPath();
        ctx.arc(this.px, this.py, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "white";
        ctx.font="20px Arial";
        ctx.fillText(symbol,this.px+10,this.py+5); //positioning the symbol
        ctx.fillStyle=this.colour;
        ctx.fill();
    }



    this.move = function () { //method to for the particle to move and deflect from walls.
        this.px += this.velocity.x;
        this.py += this.velocity.y;
        if (this.px+radius < 0 || this.px+radius > canvas.width) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.py+radius < 0 || this.py+radius > canvas.height) {
            this.velocity.y = -this.velocity.y;
        }


    }
}

function draw() { //main function runs the canvas animation
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    p1.vx=0;
    p1.load();
    p1.move();
    p2.load();
    p2.move();
    let d=getDistance(p1.px,p1.py,p2.px,p2.py);//'d' is for distance between the two particles
    let d2=getDistance(p2.px,p2.py,p3.px,p3.py); //distance between the clone and produced particle
    let d3=getDistance(p1.px,p1.py,p3.px,p3.py);
    let d4=getDistance(p4.px,p4.py,p3.px,p3.py);
    let d5=getDistance(p4.px,p4.py,p2.px,p2.py);
    let d6=getDistance(p4.px,p4.py,p1.px,p1.py);//distance between the orginal particle and reduced particle
    //detecting and resolving collisions for all cases of particles
    if(d<(p1.radius+p2.radius)){
        resolveCollision(p1,p2);
        collide=true;
    }
    if(d2<(p2.radius+p3.radius)&&p3load==true){
        resolveCollision(p2,p3);
    }
    if(d3<(p1.radius+p3.radius)&&p3load==true){
        resolveCollision(p1,p3);
    }
    if(d4<(p4.radius+p3.radius)&&p4load==true){
        resolveCollision(p4,p3)
    }
    if(d5<(p4.radius+p2.radius)&&p4load==true){
        resolveCollision(p4,p2);
    }
    if(d6<(p4.radius+p1.radius)&&p4load==true){
        resolveCollision(p4,p1);
    }
    if(collide==true){
        p3.colour=getRandomColor();
        p3.load();
        p3.move();
        p4.load();
        p4.move();
        p3load=true;
        p4load=true;
    }
    if(pause==false) { // no other frame is outputted when pause unless the animation is unpaused
        window.requestAnimationFrame(draw);
    }



}

function goHome(){ //returning to main menu
    window.open("http://localhost:8081/client/Menu.html")
}
function Start(){
    pause=false;
    collide=false; //added these to make sure that when the start button is pressed again there are no collisions and no product particle
    p3load=false;
    p4load=false;
    getParticle(check);
   if(check==1){
       draw();
       console.log(check);
    }
}
function Stop(){ // function to set pause to be true so animation stops
    pause=true;
    console.log(pause);
}
function getRandomColor() { //function to set a random colour for a particle
    let letters = '0123456789ABCDEF'; //colours are represented as Hexadecimal
    let colour = '#'; //hash is required to use hexadecimal
    for (var i = 0; i < 6; i++) {
        colour += letters[Math.floor(Math.random() * 16)]; //random colour generated by mixing up the letters
    }
    return(colour);// random colour returned

}
// distance between the two particles on screen, by using pythagoras theorem.
function getDistance(x1,y1,x2,y2){
    let xDistance=x2-x1;
    let yDistance=y2-y1;
    let distance=Math.sqrt(Math.pow(xDistance,2)+Math.pow(yDistance,2));
    return(distance);
}
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.y* Math.sin(angle) + velocity.x * Math.cos(angle)
    };

    return rotatedVelocities;
}
function resolveCollision(Particle1,Particle2){
    const Diffvx=Particle1.velocity.x-Particle2.velocity.y;
    const Diffvy=Particle1.velocity.y-Particle2.velocity.y;

    const xDist=Particle2.px-Particle1.px;
    const yDist=Particle2.py-Particle2.py;

    //Prevent accidental overlap
    if((Diffvx*xDist)+(Diffvy*yDist)>=0){
        //Grab angle between two particles
        const angle=-Math.atan2(Particle2.py-Particle1.py,Particle2.px-Particle1.py);

        const m1=Particle1.mass;
        const m2=Particle2.mass;

        //Velocity before equation
        const u1=rotate(Particle1.velocity,angle);
        const u2=rotate(Particle2.velocity,angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1,-angle);
        const vFinal2 = rotate(v2,-angle);

        // Swap particle velocities for realistic bounce effect
        Particle1.velocity.x = vFinal1.x;
        Particle1.velocity.y = vFinal1.y;

        Particle2.velocity.x = vFinal2.x;
        Particle2.velocity.y = vFinal2.y;



    }





}
