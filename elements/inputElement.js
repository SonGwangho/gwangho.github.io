class InputFile extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = `
      button:hover {
        font-weight: 700;
      }`;
    shadow.appendChild(style);

    this.input = document.createElement("input");
    this.input.type = "file";
    this.input.style.display = "none";

    this.button = document.createElement("button");
    this.button.textContent = "파일 선택";
    this.button.style.padding = "3px 5px";
    this.button.style.backgroundColor = "transparent";
    this.button.style.border = "0";
    this.button.style.cursor = "pointer";
    this.button.style.margin = "0 10px";
    this.button.style.fontFamily = "'Ownglyph_noocar-Rg', sans-serif";
    this.button.style.fontSize = "18px";

    this.button.addEventListener("click", () => {
      this.input.click();
    });

    this.input.addEventListener("change", (event) => {
      const fileName =
        this.input.files.length > 0
          ? this.input.files[0].name
          : "파일이 선택되지 않았습니다.";
      this.button.textContent = fileName;

      this.dispatchEvent(
        new Event("change", { bubbles: true, composed: true })
      );
    });

    shadow.appendChild(this.button);
    shadow.appendChild(this.input);
  }

  static get observedAttributes() {
    return ["text"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "text") {
      this.button.textContent = newValue;
    }
  }

  get files() {
    return this.input.files;
  }
}
customElements.define("input-file", InputFile);
