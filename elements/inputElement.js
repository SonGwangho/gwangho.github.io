class InputFile extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = `
    {
      button:hover {
        font-weight: 700;
      }
    }`;
    shadow.appendChild(style);

    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none"; // 기본 파일 입력 숨기기

    const button = document.createElement("button");
    button.textContent = "백업했던 json 파일을 업로드 해주세요.";
    button.style.padding = "3px 5px";
    button.style.backgroundColor = "transparent";
    button.style.border = "0";
    button.style.cursor = "pointer";
    button.style.margin = "0 10px";
    button.style.fontFamily = "'Ownglyph_noocar-Rg', sans-serif";

    button.addEventListener("click", () => {
      input.click();
    });

    input.addEventListener("change", () => {
      const fileName =
        input.files.length > 0
          ? input.files[0].name
          : "파일이 선택되지 않았습니다.";
      button.textContent = fileName;
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
