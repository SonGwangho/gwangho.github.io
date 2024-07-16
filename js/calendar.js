function loadCalendar() {
  const calendarDiv = document.getElementById("calendar_div");
  const clicked = MyStorage.getLocalData("calendar")
    ? MyStorage.getLocalData("calendar")
    : JSON.parse('{"days":[]}');
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
  const month = document.createElement("h1");
  month.style.textAlign = "center";
  month.style.color = "orange";
  month.innerText = monthNames[new Date().getMonth()];

  const table = document.createElement("table");
  const caption = document.createElement("caption");
  caption.style.captionSide = "bottom";
  caption.innerText = clicked.days.length + " 번";

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

  const weekdays = getDayWithweekdays();

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
    if (clicked.days.includes(weekday.Day)) {
      td.classList.add("clicked_calendar");
    }
    if (weekday.Day == new Date().getDate()) {
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

    td.addEventListener("click", (e) => {
      let day = e.target.innerText;
      let data = MyStorage.getLocalData("calendar");
      let json = data ? data : JSON.parse('{"days":[]}');
      if (json.days.includes(day)) {
        json.days = json.days.filter((item) => item != day);
        e.target.classList.remove("clicked_calendar");
      } else {
        json.days.push(day);
        e.target.classList.add("clicked_calendar");
      }
      MyStorage.saveLocal("calendar", JSON.stringify(json));
    });

    tr.appendChild(td);
  }
  tableBody.appendChild(tr);

  tableHead.appendChild(headRow);
  table.appendChild(caption);
  table.appendChild(tableHead);
  table.appendChild(tableBody);

  calendarDiv.appendChild(month);
  calendarDiv.appendChild(table);
  calendarDiv.appendChild(document.createElement("br"));
}

function getDayWithweekdays() {
  const today = new Date();
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
