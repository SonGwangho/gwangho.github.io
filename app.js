const navigateTo = (url) => {
  history.pushState(null, null, url);
  App();
};
const front = "/gwangho.github.io";
const routes = [
  {
    path: "/index",
    view: () => {
      return getView("/home.html");
    },
  },
  {
    path: "/index.html",
    view: () => {
      return getView("/home.html");
    },
  },
  {
    path: "/",
    view: () => {
      return getView("/home.html");
    },
  },
  {
    path: "/memo",
    view: () => {
      return getView("/memo.html");
    },
  },
  {
    path: "/about",
    view: () => {
      return "마이페이지입니다.";
    },
  },
  {
    path: "/calendar",
    view: () => {
      return getView("/calendar.html");
    },
  },
  {
    path: "/pokemon",
    view: () => {
      return getView("/pokemon.html");
    },
  },
  {
    path: "/coding",
    view: () => {
      return getView("/coding.html");
    },
  },
  {
    path: "/runner",
    view: () => {
      return getView("/runner.html");
    },
  },
  {
    path: "/test",
    view: () => {
      return getView("/test.html");
    },
  },
  {
    path: "/map",
    view: () => {
      return getView("/map.html");
    },
  },
  {
    path: "/myChart",
    view: () => {
      return getView("/myChart.html");
    },
  },
  {
    path: "/samePicture",
    view: () => {
      return getView("/samePicture.html");
    },
  },
  {
    path: "/mine",
    view: () => {
      return getView("/mine.html");
    },
  },
  {
    path: "/testShare",
    view: () => {
      return getView("/testShare.html");
    },
  },
  {
    path: "/dice",
    view: () => {
      return getView("/dice.html");
    },
  },
  {
    path: "/games",
    view: () => {
      return getView("/games.html");
    },
  },
];

const getView = async (url) => {
  const response = await fetch(front + "/frontend" + url);
  return await response.text();
};

const App = async () => {
  if (window.location.hash != "") {
    const path = window.location.hash.replace("#!", "").split("?")[0];
    const pageMatches = routes.map((route) => {
      return {
        route: route,
        isMatch: path === front + route.path,
      };
    });

    let match = pageMatches.find((pageMatch) => pageMatch.isMatch);
    if (!match) {
      match = {
        route: routes[0],
        isMatch: true,
      };
    }
    document.querySelector("#app").innerHTML = await match.route.view();
  } else {
    const pageMatches = routes.map((route) => {
      return {
        route: route,
        isMatch: window.location.pathname === front + route.path,
      };
    });

    let match = pageMatches.find((pageMatch) => pageMatch.isMatch);
    if (!match) {
      match = {
        route: routes[0],
        isMatch: true,
      };
    }
    document.querySelector("#app").innerHTML = await match.route.view();
  }
  triggerLoadEvents(document.querySelector("#app"));
};

let loadPage = function () {};
let destroyPage = function () {};

const triggerLoadEvents = (element) => {
  try {
    destroyPage();
    eval(element.querySelector("script").innerText);
    loadPage();
  } catch (e) {
    console.warn(e);
  }
};

window.addEventListener("popstate", App);

document.addEventListener("DOMContentLoaded", () => {
  if (!navigator.userAgent.toLowerCase().includes("chrome")) {
    MyToast.showToast("가능하시면 크롬으로 봐주세요...");
    MyToast.showToast("크롬에서 최적화 되어있습니다.");
  }

  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  App();
});
