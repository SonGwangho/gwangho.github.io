class Modal {
  static showModal(contents = undefined) {
    let modal = document.getElementsByClassName("modal")[0];
    const content = modal.querySelector(".modal_content");
    if (contents) {
      content.innerHTML = "";
      content.appendChild(contents);
    } else {
      const div = document.createElement("div");
      div.style.width = "100%";
      div.style.height = "100%";
    }

    modal.style.display = "flex";
    modal.classList.add("overflowHidden");
  }

  static hideModal() {
    let modal = document.getElementsByClassName("modal")[0];
    const body = modal.querySelector(".modal_body");
    if (body.className != "modal_loading") {
      modal.style.display = "none";
      modal.classList.remove("overflowHidden");
    }
  }

  static startLoading() {
    try {
      let modal = document.getElementsByClassName("modal")[0];
      const body = modal.querySelector(".modal_body");
      body.className = "modal_loading";
      const oldHtml = body.innerHTML;
      MyStorage.saveSession("beforeLoadingHtml", oldHtml);
      const loadingHtml = '<span class="loading_spinner"></span>';
      body.innerHTML = loadingHtml;
      modal.style.display = "flex";
      modal.classList.add("overflowHidden");
    } catch (e) {
      console.warn(e);
    }
  }

  static stopLoading() {
    try {
      let modal = document.getElementsByClassName("modal")[0];
      const body = modal.querySelector(".modal_loading");
      body.className = "modal_body";
      const oldHtml = MyStorage.getSessionData("beforeLoadingHtml");
      body.innerHTML = oldHtml;
      modal.style.display = "none";
      modal.classList.remove("overflowHidden");
    } catch (e) {
      console.warn(e);
    }
  }
}
