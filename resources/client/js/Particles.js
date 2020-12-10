let canvas;
let ctx;
let Proton;
let p1;
let check=0;
function getParticle(){
    console.log("Invoked getParticle()");
    const Name= document.getElementById("Particle").value;
    const Speed=document.getElementById("speed").value;
    const url="/Particles/get/";
    fetch(url+Name,{
        method:"GET",
    }).then(response=>{
        return response.json();
    }).then(response=>{
        if(response.hasOwnProperty("Error")){
            alert(JSON.stringify(response));
        } else{
            p1= new Particle(10,300,parseFloat(Speed),0.0,response.Radius,"blue",response.Symbol);
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
        ctx.fillText(symbol,this.px+10,this.py+5); //positioning the symbol
        ctx.fillStyle=this.colour;
        ctx.fill();
    }



    this.move = function () { //method to for the particle to move and deflect from walls.
        this.px += this.velocity.x;
        this.py += this.velocity.y;
        if (this.px < 0 || this.px > canvas.width) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.py < 0 || this.py > canvas.height) {
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
    window.requestAnimationFrame(draw);

}

function goHome(){ //returning to main menu
    window.open("http://localhost:8081/client/Menu.html")
}
function Start(){
    getParticle(check);
   if(check==1){
       animate()
       console.log(check);
    }
}
function animate(){
    draw();
}