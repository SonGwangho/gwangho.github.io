class DiceElement extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const scene = document.createElement("div");
    scene.classList.add("scene");

    const dice = document.createElement("div");
    dice.classList.add("dice");

    const sides = ["one", "two", "three", "four", "five", "six"];
    const numbers = ["1", "2", "3", "4", "5", "6"];

    sides.forEach((side, index) => {
      const face = document.createElement("div");
      face.classList.add(side);
      face.textContent = numbers[index];
      dice.appendChild(face);
    });

    scene.appendChild(dice);
    this.shadowRoot.appendChild(scene);

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
        width: 100px;
        height: 100px;
      }

      .scene {
        width: 100%;
        height: 100%;
        perspective: 600px;
        margin: 20px auto;
      }

      .dice {
        width: 100%;
        height: 100%;
        position: relative;
        transform-style: preserve-3d;
        transform: rotateX(0deg) rotateY(0deg);
        transition: transform 1s ease-out;
      }

      .dice div {
        position: absolute;
        width: 100%;
        height: 100%;
        background-color: white;
        border: 2px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 30px;
        font-weight: bold;
      }

      .one { transform: rotateY(0deg) translateZ(50px); }
      .two { transform: rotateY(90deg) translateZ(50px); }
      .three { transform: rotateY(180deg) translateZ(50px); }
      .four { transform: rotateY(-90deg) translateZ(50px); }
      .five { transform: rotateX(90deg) translateZ(50px); }
      .six { transform: rotateX(-90deg) translateZ(50px); }
    `;
    this.shadowRoot.appendChild(style);
  }

  connectedCallback() {
    const scene = this.shadowRoot.querySelector(".scene");
    const margin = this.style.margin;

    if (margin) {
      scene.style.margin = margin;
    }
  }

  rollDice() {
    const dice = this.shadowRoot.querySelector(".dice");
    let rotations = 0;
    const maxRotations = 7;
    let currentDelay = 500;

    const interval = setInterval(() => {
      rotations++;
      const xRotation = Math.floor(Math.random() * 360) + 360;
      const yRotation = Math.floor(Math.random() * 360) + 360;

      dice.style.transition = `transform ${currentDelay / 1000}s ease-out`;
      dice.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;

      currentDelay += 50;

      if (rotations >= maxRotations) {
        clearInterval(interval);
        setTimeout(() => this.finalRoll(dice), currentDelay);
      }
    }, currentDelay);
  }

  finalRoll(dice) {
    const result = Math.floor(Math.random() * 6) + 1;
    this.value = result;

    let xRotation = 0;
    let yRotation = 0;

    switch (result) {
      case 1:
        xRotation = 0;
        yRotation = 0;
        break;
      case 2:
        xRotation = 0;
        yRotation = 90;
        break;
      case 3:
        xRotation = 0;
        yRotation = 180;
        break;
      case 4:
        xRotation = 0;
        yRotation = -90;
        break;
      case 5:
        xRotation = 90;
        yRotation = 0;
        break;
      case 6:
        xRotation = -90;
        yRotation = 0;
        break;
    }

    dice.style.transition = `transform 1s ease-out`;
    dice.style.transform = `rotateX(${xRotation}deg) rotateY(${yRotation}deg)`;
  }

  get value() {
    return this.value;
  }
}
customElements.define("dice-element", DiceElement);
