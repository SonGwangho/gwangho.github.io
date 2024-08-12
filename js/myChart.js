function makeChart() {
  const canvas = document.getElementsByClassName("chart")[0];

  const weight = MyStorage.getLocalData("weight");
  let datas = [50, 60, 70, 60, 50, 80.4];
  let labels = [];
  for (let i = datas.length; i > 0; i--) {
    let date = new Date();
    date.setDate(date.getDate() - i);
    labels.push(MyDate.convertDateFormat(date, "yyyy-MM-dd"));
  }

  if (weight) {
    datas = Array.from(weight.labels.split(","));
    labels = Array.from(weight.datas.split(","));
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
        text: "일별 무게 변화 차트..",
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "day",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "Weight",
        },
        suggestedMin: 40,
        suggestedMax: 120,
      },
    },
  };

  let chart = new Chart(canvas, {
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
    datas = Array.from(json.labels.split(","));
    labels = Array.from(json.datas.split(","));
  } else {
    json = {
      datas: datas,
      labels: labels,
    };
  }

  const today = MyDate.convertDateFormat(new Date(), "yyyy-MM-dd");

  if (labels[labels.length - 1] == today) {
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
