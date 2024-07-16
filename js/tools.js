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
        console.log(`Cant't find ${key}`);
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

class myNotification {
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

class myRss {
  static async getXml(url) {
    // https://www.youtube.com/feeds/videos.xml?channel_id=UC4aF4vjC__D4QPeTXB-l8NQ
    return await fetch(url)
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const xml = parser.parseFromString(data);
        return xml;
      });
  }

  static getEntrys(xml) {
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
    return data;
  }

  static entry2dom(datas) {
    datas.forEach((data) => {});
  }
}

// myNotification.sendNotification("제목", { body: "내용" });
class Gist {
  static async getData() {
    const url = `https://api.github.com/gists/408041afe99b1a0b7d06197726070074`;
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

  static async saveData(json) {
    const url = `https://api.github.com/gists/408041afe99b1a0b7d06197726070074`;
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization:
          "token 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",
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
}
