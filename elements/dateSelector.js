class dateCalendar extends HTMLElement {
  constructor() {
    super();
    this.setToday(new Date());
  }

  static get observedAttributes() {
    return ["value", "caption"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value") {
      this.date(newValue);
    } else if (name === "caption") {
      this.caption.innerText = newValue;
    }
  }

  renderCalendar() {
    this.shadow = null;
    this.shadow = this.attachShadow({ mode: "closed" });
    const now = this.today;

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthArea = document.createElement("div");

    const month = document.createElement("h1");
    month.style.textAlign = "center";
    month.style.color = "orange";
    month.style.display = "inline-block";
    month.innerText = monthNames[now.getMonth()];

    const beforeMonth = document.createElement("button");
    beforeMonth.style.background = "transparent";
    beforeMonth.style.border = "0";
    beforeMonth.style.display = "inline-block";
    beforeMonth.innerText = "<";

    const afterMonth = document.createElement("button");
    afterMonth.style.background = "transparent";
    afterMonth.style.border = "0";
    afterMonth.style.display = "inline-block";
    afterMonth.innerText = ">";

    monthArea.appendChild(beforeMonth);
    monthArea.appendChild(month);
    monthArea.appendChild(afterMonth);

    const table = document.createElement("table");
    this.caption = document.createElement("caption");
    caption.style.captionSide = "bottom";
    caption.style.fontSize = "30px";
    caption.style.paddingLeft = "20px";

    const tableHead = document.createElement("thead");
    let headRow = document.createElement("tr");
    headRow.classList.add("thead_row");

    "일월화수목금토".split("").forEach((element) => {
      let headCol = document.createElement("td");
      headCol.classList.add("thead_column");
      headCol.innerText = element;
      if (element === "일") {
        headCol.style.color = "red";
      } else if (element === "토") {
        headCol.style.color = "blue";
      }
      headRow.appendChild(headCol);
    });

    const weekdays = this.getDayWithweekdays(now);

    const tableBody = document.createElement("tbody");
    let tr = document.createElement("tr");
    while (weekdays.length > 0) {
      weekday = weekdays.shift();
      tr.classList.add("tbody_row");
      if (tableBody.children.length < 1 && tr.children.length < 1) {
        for (let i = 0; i < weekday.weekdayNumber; i++) {
          const nullDay = document.createElement("td");
          nullDay.classList.add("tbody_column");
          tr.appendChild(nullDay);
        }
      }

      const td = document.createElement("td");
      td.classList.add("tbody_column");
      if (weekday.Day == now.getDate()) {
        const outer = document.createElement("div");
        outer.style.textAlign = "center";
        const inner = document.createElement("div");
        inner.style.border = "2px solid";
        inner.style.borderRadius = "50%";
        inner.style.margin = "auto";
        inner.style.maxHeight = "25px";
        inner.style.aspectRatio = "1";
        inner.style.borderColor = "lightgreen";
        inner.style.backgroundColor = "#87cefa40";
        // inner.style.backgroundColor = "#90ee9040";
        inner.innerText = weekday.Day;

        outer.appendChild(inner);
        td.appendChild(outer);
      } else {
        td.innerText = weekday.Day;
      }
      if (weekday.weekday === "일") {
        td.style.color = "red";
        tableBody.appendChild(tr);
        tr = document.createElement("tr");
      } else if (weekday.weekday === "토") {
        td.style.color = "blue";
      }

      tr.appendChild(td);
    }
    tableBody.appendChild(tr);

    tableHead.appendChild(headRow);
    table.appendChild(caption);
    table.appendChild(tableHead);
    table.appendChild(tableBody);

    this.shadow.appendChild(monthArea);
    this.shadow.appendChild(table);
    this.shadow.appendChild(document.createElement("br"));
  }

  getDayWithweekdays(date) {
    const today = new Date(date);
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const firstDayOfNextMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      1
    );
    const lastDayOfMonth = new Date(firstDayOfNextMonth - 1);
    const daysOfWeek = "일월화수목금토".split("");

    lst = [];
    for (
      let day = firstDayOfMonth;
      day <= lastDayOfMonth;
      day.setDate(day.getDate() + 1)
    ) {
      const weekday = daysOfWeek[day.getDay()];
      let d = day.getDate().toString();
      lst.push({ Day: d, weekday: weekday, weekdayNumber: day.getDay() });
    }

    return lst;
  }

  set setToday(datetime) {
    try {
      const date = new Date(Date.parse(datetime));
      this.today = date;

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      const replacements = {
        yyyy: year,
        MM: month,
        dd: day,
        HH: hours,
        mm: minutes,
        ss: seconds,
      };

      this.todayString = "yyyy-MM-dd".replace(
        /yyyy|MM|dd|HH|mm|ss/g,
        (match) => replacements[match]
      );

      this.renderCalendar();
    } catch (e) {
      console.warn(e);
    }
  }

  get today() {
    return this.todayString;
  }
}

customElements.define("date-calendar", dateCalendar);
