const navigateTo = (url) => {
  history.pushState(null, null, url);
  App();
};

const routes = [
  {
    path: "/index",
    view: () => {
      console.log("메인화면입니다.");
    },
  },
  {
    path: "/index.html",
    view: () => {
      console.log("메인화면입니다.");
    },
  },
  {
    path: "/",
    view: () => {
      console.log("메인화면입니다.");
    },
  },
  {
    path: "/about",
    view: () => {
      console.log("마이페이지입니다.");
    },
  },
];

const App = async () => {
  const pageMatches = routes.map((route) => {
    return {
      route: route,
      isMatch: window.location.pathname === route.path,
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
