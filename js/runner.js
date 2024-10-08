class Dino {
  constructor(x, y, width, height, canvasHeight) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dy = 0;
    this.gravity = 0.7;
    this.jumpStrength = -12;
    this.grounded = true;
    this.doubleJumpAble = true;
    this.canvasHeight = canvasHeight;
    this.image = new Image();
    this.image.src = "./assets/img/runner_character.png";

    this.image_jump = new Image();
    this.image_jump.src = "./assets/img/runner_character_jump.png";
  }

  jump() {
    if (this.grounded) {
      this.dy += this.jumpStrength;
      this.grounded = false;
    } else if (this.doubleJumpAble) {
      this.dy += this.jumpStrength;
      this.doubleJumpAble = false;
    }
  }

  update() {
    this.dy += this.gravity;
    this.y += this.dy;

    if (this.y > this.canvasHeight - this.height) {
      this.y = this.canvasHeight - this.height;
      this.dy = 0;
      this.grounded = true;
      this.doubleJumpAble = true;
    }
  }

  draw(ctx) {
    this.grounded
      ? ctx.drawImage(this.image, this.x, this.y, this.width, this.height)
      : ctx.drawImage(this.image_jump, this.x, this.y, this.width, this.height);
  }
}

class Obstacle {
  constructor(x, y, width, height, speed, color = "red") {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.color = color;
  }

  update() {
    this.x -= this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.canvas.width = 800;
    this.canvas.height = 400;
    this.dino = new Dino(50, 350, 30, 80, this.canvas.height);
    this.obstacles = [];
    this.score = 0;
    this.oldScore = -50;
    this.gameSpeed = 5;
    this.isGameOver = false;

    document.addEventListener("click", (event) => {
      event.preventDefault();
      this.dino.jump();
    });

    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
      }
    });

    document.addEventListener("keyup", (event) => {
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
        new Obstacle(this.canvas.width, 100, 80, 30, this.gameSpeed, "grey")
      );
    }

    if (Math.random() < 0.01 && this.score > this.oldScore + 30) {
      const random_height = Math.random() * 50;
      this.obstacles.push(
        new Obstacle(
          this.canvas.width,
          0,
          20,
          250 + random_height,
          this.gameSpeed + (this.gameSpeed * this.score) / 300
        )
      );
      this.oldScore = this.score;
    }
    if (Math.random() < 0.015 && this.score > this.oldScore + 60) {
      const random_height = (Math.random() - 1) * 30;
      this.obstacles.push(
        new Obstacle(
          this.canvas.width,
          350 - random_height,
          20,
          145 + random_height,
          this.gameSpeed + (this.gameSpeed * this.score) / 300
        )
      );
      this.oldScore = this.score;
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

        let highScore = parseInt(MyStorage.getLocalData("runner_high_score"));
        if (!highScore) highScore = 0;

        if (highScore < this.score) {
          MyStorage.saveLocal("runner_high_score", this.score);
          alert(`졌다! 하지만 최고기록!! - ${this.score}`);
        } else {
          alert(`졌다! 점수: ${this.score}`);
        }
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
