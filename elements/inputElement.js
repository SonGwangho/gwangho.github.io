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

/**
 * element.selectedDate 여기에 날짜 들어있음
 */
class InputDate extends HTMLElement {
  constructor() {
    super();
    this._selectedDate = null;
    this._width = 200;
    this._height = 200;
    this.dateView = document.createElement("div");
    const shadow = this.attachShadow({ mode: "closed" });

    const style = document.createElement("style");
    style.textContent = `
      .inputDate {
        font-size: ${this._width * 0.17}px;
        cursor: pointer;
      }
      span {
        margin: 2px 2px;
        font-size: ${this._width * 0.12}px;
      }`;
    shadow.appendChild(style);

    const year = document.createElement("span");
    year.classList.add("inputDate", "year");
    const month = document.createElement("span");
    month.classList.add("inputDate", "month");
    const day = document.createElement("span");
    day.classList.add("inputDate", "day");
    const dash1 = document.createElement("span");
    dash1.textContent = "-";
    const dash2 = document.createElement("span");
    dash2.textContent = "-";

    this.dateView.appendChild(year);
    this.dateView.appendChild(dash1);
    this.dateView.appendChild(month);
    this.dateView.appendChild(dash2);
    this.dateView.appendChild(day);

    year.addEventListener("click", () => {});

    const calendarDiv = document.createElement("div");
    calendarDiv.classList.add("inputDate_calendar_div");
    const calendar = document.createElement("date-calendar");
    calendar.classList.add("inputDate_calendar");

    this.dateView.style.width = `${this._width}px`;
    this.dateView.style.height = `fit-content`;
    calendarDiv.style.width = `${this._width}px`;
    calendarDiv.style.height = `fit-content`;

    calendar.style.width = `100%`;
    calendar.style.height = `${this._height}px`;

    calendar.addEventListener("click", (event) => {
      this.selectedDate = calendar.getToday;
    });

    calendarDiv.appendChild(calendar);
    calendarDiv.style.display = "none";
    calendarDiv.style.position = "absolute";

    this.dateView.addEventListener("click", () => {
      calendarDiv.style.display === "block"
        ? (calendarDiv.style.display = "none")
        : (calendarDiv.style.display = "block");
    });

    shadow.appendChild(this.dateView);
    shadow.appendChild(calendarDiv);

    this.init();
  }

  init() {
    this.selectedDate = new Date();
  }

  setYear() {
    const year = this.dateView.querySelector(".year");
    year.textContent = this.getYear();
  }

  getYear() {
    return new Date(this._selectedDate).getFullYear();
  }

  setMonth() {
    const month = this.dateView.querySelector(".month");
    month.textContent = this.getMonth();
  }

  getMonth() {
    const dateStr = "00" + (new Date(this._selectedDate).getMonth() + 1);
    return dateStr.substring(dateStr.length - 2, dateStr.length);
  }

  setDay() {
    const day = this.dateView.querySelector(".day");
    day.textContent = this.getDay();
  }

  getDay() {
    const dateStr = "00" + new Date(this._selectedDate).getDate();
    return dateStr.substring(dateStr.length - 2, dateStr.length);
  }

  set selectedDate(date) {
    const newDate = new Date(date);
    this._selectedDate = newDate;
    this.setYear();
    this.setMonth();
    this.setDay();
  }

  get selectedDate() {
    return this._selectedDate;
  }

  static get observedAttributes() {
    return ["width", "height"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "width") {
      this._width = newValue;
    } else if (name === "height") {
      this._height = newValue;
    }
  }
}
customElements.define("input-date", InputDate);
