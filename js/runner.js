class Dino {
  constructor(x, y, width, height, canvasHeight) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dy = 0;
    this.gravity = 0.6;
    this.jumpStrength = -13;
    this.grounded = true;
    this.canvasHeight = canvasHeight;
    this.image = new Image();
    this.image.src = "./assets/img/runner_character.png";
  }

  jump() {
    if (this.grounded) {
      this.dy = this.jumpStrength;
      this.grounded = false;
    }
  }

  update() {
    this.dy += this.gravity;
    this.y += this.dy;

    if (this.y > this.canvasHeight - this.height) {
      this.y = this.canvasHeight - this.height;
      this.dy = 0;
      this.grounded = true;
    }
  }

  draw(ctx) {
    // ctx.fillStyle = "black";
    // ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  constructor(x, y, width, height, speed) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 200;
    this.dino = new Dino(50, 150, 30, 80, this.canvas.height);
    this.obstacles = [];
    this.score = 0;
    this.gameSpeed = 3;
    this.isGameOver = false;

    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        this.dino.jump();
      }
    });

    this.loop();
  }

  update() {
    if (this.isGameOver) return;

    this.dino.update();

    if (Math.random() < 0.01) {
      this.obstacles.push(
        new Obstacle(this.canvas.width, 150, 20, 150, this.gameSpeed)
      );
    }

    this.obstacles.forEach((obstacle) => obstacle.update());
    this.obstacles = this.obstacles.filter(
      (obstacle) => obstacle.x + obstacle.width > 0
    );

    this.obstacles.forEach((obstacle) => {
      if (
        this.dino.x < obstacle.x + obstacle.width &&
        this.dino.x + this.dino.width > obstacle.x &&
        this.dino.y < obstacle.y + obstacle.height &&
        this.dino.y + this.dino.height > obstacle.y
      ) {
        this.isGameOver = true;
        alert("졌다! 점수: this.score");
        document.location.reload();
      }
    });

    this.score++;
    document.getElementById("score").innerText = this.score;
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.dino.draw(this.ctx);
    this.obstacles.forEach((obstacle) => obstacle.draw(this.ctx));
  }

  loop() {
    this.update();
    this.draw();
    if (!this.isGameOver) {
      requestAnimationFrame(this.loop.bind(this));
    }
  }
}
