function getLanguageTitle(title) {
  const h1 = document.createElement("h1");
  h1.innerText = title;
  h1.style.width = "800px";
  h1.style.margin = "100px auto 40px";
  return h1;
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

    const dom = Gist.getGistDom(gist.id);
    const div = document.createElement("div");
    div.appendChild(title);
    div.appendChild(wrapDetail(dom, "정답코드"));
    return div;
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
