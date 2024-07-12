class MyDate {
  static get_now(format = "yyyy-MM-dd HH:mm:ss") {
    const now = new Date();
    return this.convert_date_format(noew, format);
  }

  static convert_date_format(date, format) {
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
  static save_local(key, data) {
    try {
      const value = typeof data === "object" ? JSON.stringify(data) : data;
      localStorage.setItem(key, value);
    } catch (err) {
      console.error(`Can't Save ${key}`, err);
    }
  }

  static get_local_data(key) {
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

  static save_session(key, data) {
    try {
      const value = typeof data === "object" ? JSON.stringify(data) : data;
      sessionStorage.setItem(key, value);
    } catch (err) {
      console.error(`Can't Save ${key}`, err);
    }
  }

  static get_session_data(key) {
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

// myNotification.sendNotification("제목", { body: "내용" });
