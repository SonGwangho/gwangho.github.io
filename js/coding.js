function getLanguageTitle(title) {
  let title = document.createElement("h1");
  title.innerText = title;
  title.style.width = "800px";
  title.style.margin = "100px auto 40px";
  return title;
}

function getCodeDetails(gist_list) {
  for (let gist of gist_list) {
    const title = document.createElement("h2");
    title.style.width = "800px";
    title.style.margin = "40px auto 10px";
    title.style.cursor = "pointer";
    title.innerText = `${gist.title} - ${["★", "★", "★", "★", "★"]
      .slice(0, parseInt(gist.level))
      .join("")}`;
    title.addEventListener("click", () => {
      const a = document.createElement("a");
      a.target = "_blank";
      a.href = gist.url;
      a.click();
    });
    body.appendChild(title);
    const dom = Gist.getGistDom(gist.id);

    return wrapDetail(dom, "정답코드");
  }
}

function wrapDetail(dom, summaryText) {
  const detail = document.createElement("details");
  detail.style.width = "800px";
  detail.style.margin = "auto";
  const summary = document.createElement("summary");
  summary.innerText = summaryText;
  detail.appendChild(summary);
  detail.appendChild(dom);
  return detail;
}
