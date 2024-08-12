function initKind() {
  const chartKind = document.getElementsByClassName("chart_kind")[0];
  const day = chartKind.children[0];
  const month = chartKind.children[1];

  let weight = MyStorage.getLocalData("weight_kind");
  if (!weight) MyStorage.saveLocal("weight_kind", "day");

  weight = MyStorage.getLocalData("weight_kind");
  if (weight === "day") {
    day.classList.add("active");
  } else {
    month.classList.add("active");
  }
  day.addEventListener("click", () => {
    MyStorage.saveLocal("weight_kind", "day");
    location.reload();
  });

  month.addEventListener("click", () => {
    MyStorage.saveLocal("weight_kind", "month");
    location.reload();
  });
}

function makeChart() {
  const kind = MyStorage.getLocalData("weight_kind");

  const canvas = document.getElementsByClassName("chart")[0];
  const weight = MyStorage.getLocalData("weight");
  let datas = [];
  let labels = [];
  let title = "일별 무게 변화 차트..";

  if (weight) {
    datas = weight.datas;
    labels = weight.labels;

    if (kind === "month") {
      datas = [];
      labels = [];
      for (let i = 0; i < 100; i++) datas.push(Random.getNumber(500, 900) / 10);
      for (let i = datas.length; i > 0; i--) {
        let date = new Date();
        date.setDate(date.getDate() - i);
        labels.push(MyDate.convertDateFormat(date, "yyyy-MM-dd"));
      }
    }

    if (datas.length == 1) {
      datas.push(datas[0]);
      labels.push(
        MyDate.convertDateFormat(
          new Date(
            new Date(labels[0]).setDate(parseInt(labels[0].split("-")[2]) - 1)
          ),
          "yyyy-MM-dd"
        )
      );
    }
  } else {
    MyToast.showToast("추가해도 님만 보여요!");
    title = " 아래는 대충 테스트 데이터입니다...";
    datas = [50, 60, 70, 60, 50, 80.4];
    for (let i = datas.length; i > 0; i--) {
      let date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(MyDate.convertDateFormat(date, "yyyy-MM-dd"));
    }
  }

  const datasets = [
    {
      label: "무게",
      data: datas,
    },
  ];

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: kind,
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Weight(kg)",
        },
        suggestedMin: 40,
        suggestedMax: Math.max(...datas) * 1.1,
      },
    },
  };

  new Chart(canvas, {
    type: "line",
    data: {
      labels: labels,
      datasets: datasets,
    },
    options: options,
  });
}

function addWeight(weight) {
  let json = MyStorage.getLocalData("weight");
  let datas = [];
  let labels = [];

  if (json) {
    datas = json.datas;
    labels = json.labels;
  } else {
    json = {
      datas: datas,
      labels: labels,
    };
  }

  const today = MyDate.convertDateFormat(new Date(), "yyyy-MM-dd");

  if (labels.length > 0 && labels[labels.length - 1] == today) {
    labels.pop();
    datas.pop();
  }

  datas.push(weight);
  labels.push(today);

  json.datas = datas;
  json.labels = labels;
  MyStorage.saveLocal("weight", JSON.stringify(json));
  location.reload();
}

function clickAddWeight() {
  const input = document.getElementsByClassName("input_weight")[0];
  if (input.value) addWeight(parseFloat(input.value).toFixed(1));
}

function initWeight() {
  json = {
    datas: [],
    labels: [],
  };
  MyStorage.saveLocal("weight", JSON.stringify(json));
}
