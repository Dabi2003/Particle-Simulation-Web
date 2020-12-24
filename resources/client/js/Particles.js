let canvas; //the canvas in HTML
let ctx; //the context of the canvas
let p1; //particle  entered by user
let p2; //particle clone that user has entered
let p3;// anti particle
let p4;//other particle
let check=0;// at first no particle is created so check is at false
let collide=false;// at first there is no collision detected so 'collide' is false.
let p3load=false; // no particles that should appear after the process must appear at the start of simulation.
let p4load=false;
let pause;// variable need to stop the canvas animation.
let E1;

let P1;
let P2;

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
function pageLoad() { //set up canvas

    canvas = document.getElementById("canvas"); //capturing canvas element so that canvas may be used.
    ctx = canvas.getContext('2d'); // drawings in canvas are set to 2 dimensional.
    console.log(ctx);
    canvas.width = 800; //width of canvas modified due to canvas initially small
    canvas.height = 600;// height of canvas modified due to canvas initially small
    E1=  new Particle(Math.random()*canvas.width,Math.random()*canvas.height,1,1,5,"blue",'e-');
    P1= new Particle(Math.random()*canvas.width,Math.random()*canvas.height,3,3,10,"yellow",'p');
    P2=new Particle(Math.random()*canvas.width,Math.random()*canvas.height,3,3,10,"yellow",'p');
    // the particles that are instaniated are needed for the VIEW page, I had to add them on page load so that all values will caught when they load on canvas.




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
        ctx.fillText(this.symbol,this.px+10,this.py+5); //positioning the symbol
        ctx.fillStyle=this.colour;
        ctx.fill();
    }
    this.attract= function(x,y,OtherParticle) {
        let dx = -(this.px - x);
        let dy = -(this.py - y);
        let vx = (dx / 50)
        let vy = (dy / 50)
        this.px += vx;
        this.py += vy;
        if (this.px + (this.radius) < this.radius || this.px + (this.radius) > canvas.width) {
            vx = -vx;
        }
        if (this.py + this.radius < this.radius || this.py + this.radius > canvas.height) {
            vy = -vy;
        }
        if (getDistance(OtherParticle.px, OtherParticle.py, this.px, this.py) < (OtherParticle.radius + this.radius)) {
            vx=-vx;
        }
    }






    this.move = function () { //method to for the particle to move and deflect from walls.

        this.px += this.velocity.x;
        this.py += this.velocity.y;
        if (this.px+(this.radius) < this.radius || this.px+(this.radius) > canvas.width) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.py+(this.radius) < this.radius || this.py+(this.radius) > canvas.height) {
            this.velocity.y = -this.velocity.y;
        }


    }
}

function draw() { //main function runs the canvas animation
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    p1.load();
    p1.move();
    p2.load();
    p2.move();

    if ( getDistance(p1.px, p1.py, p2.px, p2.py)< (p1.radius + p2.radius)) {
        resolveCollision(p1, p2);
        collide = true;
    }
    if (getDistance(p2.px, p2.py, p3.px, p3.py) < (p2.radius + p3.radius) && p3load == true) {
        resolveCollision(p2, p3);
    }
    if (  getDistance(p1.px, p1.py, p3.px, p3.py) < (p1.radius + p3.radius) && p3load == true) {
        resolveCollision(p1, p3);
    }
    if (getDistance(p4.px, p4.py, p3.px, p3.py) < (p4.radius + p3.radius) && p4load == true) {
        resolveCollision(p4, p3)
    }
    if (getDistance(p4.px, p4.py, p2.px, p2.py) < (p4.radius + p2.radius) && p4load == true) {
        resolveCollision(p4, p2);
    }
    if ( getDistance(p4.px, p4.py, p1.px, p1.py) < (p4.radius + p1.radius) && p4load == true) {
        resolveCollision(p4, p1);
    }
    if (collide == true && p1.vx>=5) { //when the particle pair entered by user collide with a speed greater or equal to 5
        p3.colour = getRandomColor();
        p3.load();
        p3.move();
        p4.load();
        p4.move();
        p3load = true;
        p4load = true;
    }
    if (pause == false) { // no other frame is outputted when pause unless the animation is unpaused
        window.requestAnimationFrame(draw);
    }
}
    function draw2(){
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        p1.load();
        p1.move();
        p3.load();
        p3.move();
        let d = getDistance(p1.px, p1.py, p3.px, p3.py);//'d' is for distance between the two particles
        if (d < (p1.radius + p3.radius)) {
            resolveCollision(p1, p3);
            collide = true;
        }
        if(collide==true){
            p1.radius=5
            p3.radius=5;
            p1.colour=getRandomColor();  // transforming the particles into photons oce they collide.
            p3.colour=getRandomColor();
            p1.symbol="γ";
            p3.symbol="γ";
        }

        if(pause==false) { // no other frame is outputted when pause unless the animation is unpaused
            window.requestAnimationFrame(draw2);
        }

    }


function draw3(){
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    P1.load();
    P1.move();
    P2.load();
    P2.move();
    E1.load();


    let attraction_d= getDistance(E1.px,E1.py,P1.px,P1.py);
    let attraction_d2=getDistance(E1.px,E1.py,P2.px,P2.py);
    let repel_d=getDistance(P1.px,P1.py,P2.px,P2.py);
    if(attraction_d<200){
        E1.attract(P1.px,P1.py,P1);
        console.log(E1.vx);
    } else{
        if(attraction_d>200){
            while(E1.velocity.x!=0){
                E1.velocity.x-=0.5;
                E1.velocity.y-=0.5;
            }
        }
    }
    if(attraction_d2<200){
        E1.attract(P2.px,P2.py,P2);

    } else{
        if(attraction_d2>200){
            while(E1.velocity.x!=0){
                E1.velocity.x-=0.5;
                E1.velocity.y-=0.5;
            }
        }
    }
    if(repel_d<100) {
        P1.velocity.x=-(P1.velocity.x);
        P1.velocity.y=-(P1.velocity.y);
        P2.velocity.x=-(P2.velocity.x);
        P2.velocity.y=-(P2.velocity.y);

    }






    if(pause==false){
        window.requestAnimationFrame(draw3);
    }

}



function goHome(){ //returning to main menu
    window.open("http://localhost:8081/client/Menu.html")
}
function StartPP(){
    pause=false;
    collide=false; //added these to make sure that when the start button is pressed again there are no collisions and no product particle
    p3load=false;
    p4load=false;
    getParticle(check);
   if(check==1){
           draw(); //when the button in the pair production page is clicked, start the simulation.
       console.log(check);
    }
}
function StartANN(){
    pause=false;
    collide=false
    getParticle(check);
    if(check==1){
        draw2(); //when the button in the pair production page is clicked, start the simulation.
        console.log(check);
    }

}

function StartVIEW(){
    pause=false;
    collide=false;
    draw3();

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
