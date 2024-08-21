function loadCalendar(now = new Date()) {
  now = new Date(now);
  const calendarDiv = document.getElementById("calendar_div");
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
  let data = MyStorage.getLocalData("calendar");
  if (!data) {
    data = `{"${monthNames[now.getMonth()]}": {"days":[]}}`;
  }
  const clicked = JSON.parse(data)[monthNames[now.getMonth()]]
    ? JSON.parse(data)[monthNames[now.getMonth()]]
    : JSON.parse('{"days":[]}');

  const month = document.createElement("h1");
  month.style.textAlign = "center";
  month.style.color = "orange";
  month.innerText = monthNames[now.getMonth()];

  const table = document.createElement("table");
  const caption = document.createElement("caption");
  caption.style.captionSide = "bottom";
  caption.style.fontSize = "30px";
  caption.style.paddingLeft = "20px";
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

  const weekdays = getDayWithweekdays(now);

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

    td.addEventListener("click", (e) => {
      let day = e.target.innerText;
      let data = MyStorage.getLocalData("calendar");
      if (!data) {
        data = `{"${monthNames[now.getMonth()]}": {"days":[]}}`;
      }

      let json = JSON.parse(data)[monthNames[now.getMonth()]]
        ? JSON.parse(data)[monthNames[now.getMonth()]]
        : JSON.parse('{"days":[]}');

      if (json.days.includes(day)) {
        json.days = json.days.filter((item) => item != day);
        e.target.classList.remove("clicked_calendar");
      } else {
        json.days.push(day);
        e.target.classList.add("clicked_calendar");
      }
      const month = monthNames[now.getMonth()];
      caption.innerText =
        getSum(JSON.stringify(`{"${month}": ${JSON.stringify(json)}}`)) + " 번";
      MyStorage.saveLocal(
        "calendar",
        JSON.stringify(`{"${month}": ${JSON.stringify(json)}}`)
      );
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

  const clickHandler = (e) => {
    e.preventDefault();
    calendarDiv.innerHTML = "";
    loadCalendar(now.setMonth(now.getMonth() + 1));
    calendarDiv.removeEventListener("click", clickHandler);
  };

  const contextMenuHandler = (e) => {
    e.preventDefault();
    calendarDiv.innerHTML = "";
    loadCalendar(now.setMonth(now.getMonth() - 1));
    calendarDiv.removeEventListener("contextmenu", contextMenuHandler);
  };

  calendarDiv.addEventListener("click", clickHandler);
  calendarDiv.addEventListener("contextmenu", contextMenuHandler);
}

function getDayWithweekdays(date) {
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

function getSum(data) {
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
  let sum = 0;
  let json = JSON.parse(JSON.parse(data));
  for (let month of monthNames) {
    if (json[month]) {
      sum += json[month].days.length;
    }
  }
  return sum;
}

function makeWatch() {
  const time = document.createElement("div");
  const watchOut = document.createElement("div");
  const watchIn = document.createElement("div");

  time.classList.add("watch_time");
  watchOut.classList.add("watch_out");
  watchIn.classList.add("watch_in");

  const hour = document.createElement("div");
  const minute = document.createElement("div");
  const second = document.createElement("div");

  hour.classList.add("watch_hour");
  minute.classList.add("watch_minute");
  second.classList.add("watch_second");
  hour.classList.add("watch_stick");
  minute.classList.add("watch_stick");
  second.classList.add("watch_stick");

  for (let i = 0; i < 12; i++) {
    const deg = i * 30;
    let x = 270 * Math.sin((deg * Math.PI) / 180);
    let y = 270 * Math.cos((deg * Math.PI) / 180);

    const hourLine = document.createElement("div");
    hourLine.classList.add("hour_line");
    hourLine.style.zIndex = 990 - i;
    hourLine.style.transform = `
    translateX(${270 - x}px) 
    translateY(${260 + y}px) 
    rotate(${deg}deg)`;

    watchIn.appendChild(hourLine);
  }

  watchIn.appendChild(hour);
  watchIn.appendChild(minute);
  watchIn.appendChild(second);

  watchOut.appendChild(watchIn);

  setInterval(() => {
    moveStick();
  }, 1000);

  const dom = document.createElement("div");
  dom.appendChild(watchOut);
  dom.appendChild(time);

  dom.style.margin = "auto";
  dom.style.width = "fit-content";

  return dom;
}

function moveStick() {
  try {
    const date = new Date();
    const hh = date.getHours();
    const mm = date.getMinutes();
    const ss = date.getSeconds();

    const moveCenterText = "translate(270px, 270px) ";

    const time = document.getElementsByClassName("watch_time")[0];
    const hour = document.getElementsByClassName("watch_hour")[0];
    const minute = document.getElementsByClassName("watch_minute")[0];
    const second = document.getElementsByClassName("watch_second")[0];

    hour.style.transform =
      moveCenterText + `rotate(${hh * 30 - 90 + mm * 0.5 + ss * 0.008}deg)`;
    minute.style.transform =
      moveCenterText + `rotate(${mm * 6 - 90 + ss * 0.1}deg)`;
    second.style.transform = moveCenterText + `rotate(${ss * 6 - 90}deg)`;

    time.innerHTML = `현재 시각 - ${hh}시 ${mm}분 ${ss}초`;
  } catch (e) {
    console.warn(e);
  }
}

function toggleWatchImg() {
  const watch = document.getElementsByClassName("watch_in")[0];
  if (watch.classList.contains("watch_dance"))
    watch.classList.remove("watch_dance");
  else watch.classList.add("watch_dance");
}

function initDDAY() {
  const span = document.getElementsByClassName("timer_dday")[0];
  const ddayList = span.querySelectorAll("input");
  const dday = MyStorage.getLocalData("timer_dday");
  let inputValues = [];
  if (dday) {
    document
      .getElementById("timer_div")
      .parentElement.setAttribute("open", true);

    const [date, time] = dday.split(" ");
    const dateParts = date.split("-").map(Number);
    const timeParts = time.split(":").map(Number);

    inputValues = [...dateParts, ...timeParts];
  } else {
    const now = new Date();
    inputValues = [now.getFullYear() + 1, "01", "01", "00", "00", "00"];
  }
  for (let i = 0; i < ddayList.length; i++) {
    ddayList[i].value = inputValues[i];
  }
}

function handleTickInit(tick) {
  const span = document.getElementsByClassName("timer_dday")[0];
  const ddayList = span.querySelectorAll("input");
  const dday = `${ddayList[0].value}-${ddayList[1].value}-${ddayList[2].value} ${ddayList[3].value}:${ddayList[4].value}:${ddayList[5].value}`;

  Tick.count.down(dday).onupdate = function (value) {
    tick.value = value;
  };
}

function changeDDAY() {
  const span = document.getElementsByClassName("timer_dday")[0];
  const ddayList = span.querySelectorAll("input");
  const dday = `${ddayList[0].value}-${ddayList[1].value}-${ddayList[2].value} ${ddayList[3].value}:${ddayList[4].value}:${ddayList[5].value}`;
  MyStorage.saveLocal("timer_dday", dday);
  location.reload();
}

function loadFlipJs() {
  const script = document.createElement("script");
  script.type = "text/javascript";
  script.src = `./lib/flip.min.js`;
  script.async = false;
  document.head.appendChild(script);
}
