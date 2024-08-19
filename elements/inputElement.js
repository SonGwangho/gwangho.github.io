class InputFile extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    const input = document.createElement("input");
    input.type = "file";
    input.style.display = "none"; // 기본 파일 입력 숨기기

    const button = document.createElement("button");
    button.textContent = "파일 선택";
    button.style.padding = "10px 20px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";

    button.addEventListener("click", () => {
      input.click();
    });

    input.addEventListener("change", () => {
      const fileName =
        input.files.length > 0
          ? input.files[0].name
          : "백업했던 json 파일을 업로드 해주세요";
      button.textContent = fileName;
    });

    shadow.appendChild(button);
    shadow.appendChild(input);
  }
}
customElements.define("input-file", InputFile);
