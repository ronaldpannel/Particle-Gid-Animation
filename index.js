/**@type{HTMLCanvasElement} */

const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 600;
canvas.height = 600;
// ctx.strokeStyle = "white";

class Particle {
  constructor(effect) {
    this.effect = effect;
    this.rad = Math.floor(Math.random() * 10 + 10);
    this.x = randomIntFromRange(this.rad, this.effect.width - this.rad);
    this.y = randomIntFromRange(0, this.effect.height);
    this.velX = Math.random() * 2 - 1;
    this.velY = Math.random() * 0.25 + 0.25;
    this.angle = Math.random() + 3 - 3;
  }
  draw(ctx) {
    const col = Math.floor(this.x / this.effect.cellSize);
    const row = Math.floor(this.y / this.effect.cellSize);
    if (
      col >= 0 &&
      col < this.effect.cols &&
      row >= 0 &&
      row < this.effect.rows
    ) {
      const hue = this.effect.grid[col][row];
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`; // Set the color based on the grid's hue value
    } else {
      ctx.fillStyle = "black"; // Default color if out of bounds
    }

    ctx.beginPath();
    ctx.fillStyle = this.effect.color;
    ctx.arc(this.x, this.y, this.rad, 0, Math.PI * 2);
    ctx.fill();
  }
  update() {
    this.x += this.velX;
    this.y += this.velY;

    if (this.y > this.effect.height + this.rad * 2) {
      this.y = -this.rad * 2;
    }
    if (this.x < this.rad || this.x > this.effect.width - this.rad) {
      this.velX *= -1;
    }
    this.angle += 0.01;
  }
}

class Effect {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.numParticles = 50;
    this.particleArray = [];
    this.grid = [];
    this.cols = 10;
    this.rows = 10;
    this.cellSize = this.width / this.rows;
    this.color;
    this.debug = true;
    this.init();
    window.addEventListener("keypress", (e) => {
      if (e.key.toLowerCase() == "d") {
        console.log(e.key);
        this.debug = !this.debug;
      }
    });

    const btn = document.getElementById("debug");
    btn.addEventListener("click", () => {
      this.debug = !this.debug;
    });
  }
  init() {
    for (let i = 0; i < this.numParticles; i++) {
      this.particleArray.push(new Particle(this));
    }
    //create Grid
    if (
      this.cols < this.width ||
      (this.cols > 0 && this.rows < this.height) ||
      this.rows > 0
    ) {
      for (let i = 0; i < this.cols; i++) {
        this.grid[i] = [];
        for (let j = 0; j < this.rows; j++) {
          this.grid[i][j] = Math.floor(Math.random() * 360);
        }
      }
    }
  }
  drawGrid(ctx) {
    if (!this.debug) {
      ctx.strokeStyle = " white";
      for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
          ctx.rect(
            i * this.cellSize,
            j * this.cellSize,
            this.cellSize,
            this.cellSize
          );
          ctx.stroke();
          ctx.font = "20px Arial";
          ctx.fillStyle = "white";
          ctx.fillText(this.grid[i][j], i * this.cellSize, j * this.cellSize);
        }
      }
    }
  }
  render(ctx) {
    this.particleArray.forEach((particle) => {
      particle.draw(ctx);
      particle.update();
    });
    this.drawGrid(ctx);
  }
}

const effect = new Effect(canvas.width, canvas.height);

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  effect.render(ctx);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener("resize", () => {
  canvas.width = canvas.width;
  canvas.height = canvas.height;
});
