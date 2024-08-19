class InputFile extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
      button:hover {
        font-weight: 700;
      }`;
    shadow.appendChild(style);

    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none";

    const button = document.createElement("button");
    button.textContent = "파일 선택";
    button.style.padding = "3px 5px";
    button.style.backgroundColor = "transparent";
    button.style.border = "0";
    button.style.cursor = "pointer";
    button.style.margin = "0 10px";
    button.style.fontFamily = "'Ownglyph_noocar-Rg', sans-serif";
    button.style.fontSize = "18px";

    button.addEventListener("click", () => {
      input.click();
    });

    input.addEventListener("change", (event) => {
      const fileName =
        input.files.length > 0
          ? input.files[0].name
          : "파일이 선택되지 않았습니다.";
      button.textContent = fileName;

      this.dispatchEvent(new Event("change"));
      if (this.getAttribute("onchange")) {
        const onchangeHandler = new Function(this.getAttribute("onchange"));
        onchangeHandler.call(this, event);
      }
    });

    shadow.appendChild(button);
    shadow.appendChild(input);
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
