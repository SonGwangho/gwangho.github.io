class MyDate {
  static get_now(format = "yyyy-MM-dd HH:mm:ss") {
    const now = new Date();
    return convert_date_format(noew, format);
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
