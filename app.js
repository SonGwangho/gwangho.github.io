const navigateTo = (url) => {
  history.pushState(null, null, url);
  App();
};
const front = "/gwangho.github.io";
const routes = [
  {
    path: "/index",
    view: () => {
      return "메인화면입니다.";
    },
  },
  {
    path: "/index.html",
    view: () => {
      return "메인화면입니다.";
    },
  },
  {
    path: "/",
    view: () => {
      return "메인화면입니다.";
    },
  },
  {
    path: "/about",
    view: () => {
      return "마이페이지입니다.";
    },
  },
];

const App = async () => {
  if (window.location.hash != "") {
    const path = window.location.hash.replace("#!/", "");

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
};

window.addEventListener("popstate", App);

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  App();
});
