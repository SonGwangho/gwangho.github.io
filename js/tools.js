class MyDate {
  static getNow(format = "yyyy-MM-dd HH:mm:ss") {
    const now = new Date();
    return this.convert_date_format(noew, format);
  }

  static convertDateFormat(date, format) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    const replacements = {
      yyyy: year,
      MM: month,
      dd: day,
      HH: hours,
      mm: minutes,
      ss: seconds,
    };

    return format.replace(
      /yyyy|MM|dd|HH|mm|ss/g,
      (match) => replacements[match]
    );
  }
}

class MyStorage {
  static saveLocal(key, data) {
    try {
      const value = typeof data === "object" ? JSON.stringify(data) : data;
      localStorage.setItem(key, value);
    } catch (err) {
      console.error(`Can't Save ${key}`, err);
    }
  }

  static getLocalData(key) {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        try {
          const jsonData = JSON.parse(data);
          return jsonData;
        } catch (error) {
          return data;
        }
      } else {
        console.log(`Can't find ${key}`);
        return null;
      }
    } catch (err) {
      console.error(`Can't retrieving ${key}`, err);
    }
  }

  static saveSession(key, data) {
    try {
      const value = typeof data === "object" ? JSON.stringify(data) : data;
      sessionStorage.setItem(key, value);
    } catch (err) {
      console.error(`Can't Save ${key}`, err);
    }
  }

  static getSessionData(key) {
    try {
      const data = sessionStorage.getItem(key);
      if (data) {
        try {
          const jsonData = JSON.parse(data);
          return jsonData;
        } catch (error) {
          return data;
        }
      } else {
        console.log(`Cant't find ${key}`);
        return null;
      }
    } catch (err) {
      console.error(`Can't retrieving ${key}`, err);
    }
  }
}

class MyToast {
  // Toastify({
  //   text: "This is a toast",
  //   duration: 3000,
  //   destination: "https://github.com/apvarun/toastify-js",
  //   newWindow: true,
  //   close: true,
  //   gravity: "top", // `top` or `bottom`
  //   position: "left", // `left`, `center` or `right`
  //   stopOnFocus: true, // Prevents dismissing of toast on hover
  //   style: {
  //     background: "linear-gradient(to right, #00b09b, #96c93d)",
  //   },
  //   onClick: function(){} // Callback after click
  // }).showToast();

  static showToast(text, option) {
    Toastify(
      Object.assign(
        {
          text: text,
        },
        option
      )
    ).showToast();
  }
}

class MyNotification {
  static checkPermission() {
    if (Notification.permission === "granted") {
      return true;
    }
    return false;
  }

  static sendPermission(callback = undefined) {
    if (Notification.permission != "granted") {
      Notification.requestPermission().then((permission) => {
        if (permission != "granted") {
          console.error("fail get permission");
        } else {
          if (!this.callback) callback();
        }
      });
    }
  }

  static sendNotification(title, option = undefined) {
    if (!this.checkPermission()) {
      sendPermission(sendNotification(title, option));
    }
    if (!option) return;
    const notification = new Notification(
      title,
      Object.assign(
        {
          tag: "message",
        },
        option
      )
    );

    notification.onclick = function (event) {
      event.preventDefault(); // 브라우저가 포커스를 이동하지 않도록 방지
      window.open("https://songwangho.github.io/gwangho.github.io", "_blank");
    };
  }
}

class Rss {
  static async getXml(url) {
    return await fetch(url)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data, "application/xml");
        return xml;
      });
  }

  static parsing(xml) {
    const entry = xml.querySelectorAll("entry");
    const data = {};
    data["self"] = {
      title: a.querySelector("author name"),
      uri: a.querySelector("author uri"),
    };
    data["entrys"] = [];
    Array.from(entry).map((item) =>
      data["entrys"].push({
        title: item.querySelector("title").textContent,
        link: item.querySelector("link").getAttribute("href"),
        published: item.querySelector("published").textContent,
        updated: item.querySelector("updated").textContent,
        id: item.getElementsByTagName("yt:videoId")[0].textContent,
        description:
          item.getElementsByTagName("media:description")[0].textContent,
        content: item
          .getElementsByTagName("media:content")[0]
          .getAttribute("url"),
        thumbnail: item
          .getElementsByTagName("media:thumbnail")[0]
          .getAttribute("url"),
        views: item
          .getElementsByTagName("media:community")[0]
          .getElementsByTagName("media:statistics")[0]
          .getAttribute("views"),
      })
    );
    return data;
  }

  static entry2dom(entry) {
    const dom = document.createElement("div");
    dom.classList.add("youtube_entry");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("youtube_entry_left");
    const title = document.createElement("h1");
    thumbnail.classList.add("youtube_entry_title");
    title.innerText = entry.title;

    const thumbnail = document.createElement("img");
    thumbnail.classList.add("youtube_entry_thumbnail");
    thumbnail.src = entry.thumbnail;

    const description = document.createElement("span");
    thumbnail.classList.add("youtube_entry_description");
    description.innerText = entry.description;

    titleDiv.appendChild(title);
    titleDiv.appendChild(thumbnail);
    titleDiv.appendChild(description);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("youtube_entry_right");

    const published = document.createElement("span");
    published.innerText =
      "게시일: " +
      MyDate.convertDateFormat(
        new Date(entry.published),
        "yyyy-MM-dd HH:mm:ss"
      );
    const updated = document.createElement("span");
    updated.innerText =
      "마지막 업데이트: " +
      MyDate.convertDateFormat(new Date(entry.updated), "yyyy-MM-dd HH:mm:ss");
    const views = document.createElement("span");
    views.innerText = "조회수: " + entry.views + " 번";

    infoDiv.appendChild(published);
    infoDiv.appendChild(updated);
    infoDiv.appendChild(views);

    dom.appendChild(titleDiv);
    dom.appendChild(infoDiv);
    return dom;
  }
}

// myNotification.sendNotification("제목", { body: "내용" });
class Gist {
  static async getData(gist_id) {
    const url = `https://api.github.com/gists/${gist_id}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      const jsonContent = JSON.parse(data.files["mem.json"].content);
      return jsonContent;
    } else {
      console.error(
        "Failed to fetch Gist:",
        response.status,
        response.statusText
      );
    }
  }

  static async saveData(json, gist_id) {
    let GITHUB_TOKEN = MyStorage.getLocalData("github_token");
    if (!GITHUB_TOKEN) {
      let urlParams = new URLSearchParams(
        window.location.hash.replace("#!", "").split("?")[1]
      );
      if (!urlParams) return;
      let token = urlParams.get("token");
      MyStorage.saveLocal("github_token", token);
      GITHUB_TOKEN = token;
    }
    const url = `https://api.github.com/gists/${gist_id}`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        files: {
          "mem.json": {
            content: JSON.stringify(json, null, 2),
          },
        },
      }),
    });

    if (response.ok) {
      return await response.json();
    } else {
      console.error(
        "Failed to update Gist:",
        response.status,
        response.statusText
      );
    }
  }

  static getGistDom(gist_id) {
    const mainDiv = document.createElement("div");
    mainDiv.classList.add("code_main_div");

    const iframe = document.createElement("iframe");
    iframe.src = `data:text/html;charset=utf-8,<script src='https://gist.github.com/SonGwangho/${gist_id}.js'><\/script>`;
    iframe.style.margin = "auto";
    iframe.width = "800px";
    iframe.height = "400px";
    iframe.frameBorder = 0;
    mainDiv.appendChild(iframe);

    return mainDiv;
  }
}

class Task {
  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

class Random {
  static getNumber(min = 0, max = 100) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static getItem(array = undefined) {
    if (!array || !Array.isArray(array)) return null;
    const index = this.getNumber(0, array.length - 1);
    console.log(index, array);
    return array[index];
  }

  static shuffle(array = undefined) {
    if (Array.isArray(array)) {
      const new_array = [];
      while (array.length > 0) {
        const index = this.getNumber(0, array.length - 1);
        new_array.push(array[index]);
        array = array
          .slice(0, index)
          .concat(array.slice(index + 1, array.length));
      }
      return new_array;
    } else {
      return null;
    }
  }
}

class MyURL {
  static getParams() {
    const urlParams = new URLSearchParams(
      window.location.hash.replace("#!", "").split("?")[1]
    );
    if (!urlParams) return;
    // let token = urlParams.get("token");

    return urlParams;
  }

  static addParam(key, value) {
    const urlParams = this.getParams();
    urlParams.append(key, value);

    let url = location.href.split("?")[0] + "?";
    for (let param of urlParams) {
      if (url.lastIndexOf("?") === url.length - 1) {
        url += param.join("=");
      } else {
        url += "&" + param.join("=");
      }
    }
    location.href = url;
  }

  static getParam(key) {
    const urlParams = this.getParams();
    return urlParams.get(key);
  }
}
