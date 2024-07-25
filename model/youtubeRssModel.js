class YoutubeRssModel {
  constructor() {}

  init(xml) {
    this.url = xml.querySelector("link").getAttribute("href");
    this.title = xml.querySelector("title");

    const entry = xml.querySelectorAll("entry");
    const data = Array.from(entry).map((item) => ({
      title: item.querySelector("title").textContent,
      link: item.querySelector("link").getAttribute("href"),
      published: item.querySelector("published").textContent,
      updated: item.querySelector("updated").textContent,
      id: item.querySelector("yt\\:videoId").textContent,
      description: item.querySelector("media\\:description").textContent,
      content: item.querySelector("media\\:content").getAttribute("url"),
      thumbnail: item.querySelector("media\\:thumbnail").getAttribute("url"),
      views: item
        .querySelector("media\\:community")
        .querySelector("media\\:statistics")
        .getAttribute("views"),
    }));
  }
}
