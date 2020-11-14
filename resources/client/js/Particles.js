let canvas = document.getElementById("screen"); //capturing canvas element so that canvas may be used.
let ctx = canvas.getContext("2d"); // drawings in canvas are set to 2 dimensional.
console.log(ctx);
canvas.width = 800; //width of canvas modified due to canvas initially small
canvas.height = 600;// height of canvas modified due to canvas initially small

function Particle(px, py, vx, vy, radius, colour) {
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
    this.mass = 1;

    this.load = function () {
        ctx.beginPath();
        ctx.arc(this.px, this.py, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = this.colour;
        ctx.fill();
    }



    this.move = function () {
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
let Proton= new Particle( 10, 300,3,0,8,"yellow");
function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    Proton.load();
    window.requestAnimationFrame(draw);

}

draw();


