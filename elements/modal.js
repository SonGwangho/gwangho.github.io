let modal = document.getElementsByClassName("modal")[0];

document.addEventListener("DOMContentLoaded", () => {
  modal = document.getElementsByClassName("modal")[0];
  const button = document.getElementsByClassName("btn_close_modal")[0];

  button.addEventListener("click", () => {
    Modal.hideModal();
  });
});

class Modal {
  static showModal(contents = undefined) {
    const content = modal.querySelector("modal_content");
    if (!contents) content.innerHTML = contents;
    else {
      const div = document.createElement("div");
      div.style.width = "100%";
      div.style.height = "100%";
    }

    modal.style.display = "flex";
  }

  static hideModal() {
    modal.style.display = "none";
  }

  static startLoading() {
    const body = modal.querySelector(".modal_body");
    body.className = "modal_loading";
    const oldHtml = body.innerHTML;
    MyStorage.saveSession("beforeLoadingHtml", oldHtml);
    const loadingHtml = '<span class="loading_spinner"></span>';
    body.innerHTML = loadingHtml;
    modal.style.display = "flex";
  }

  static stopLoading() {
    const body = modal.querySelector(".modal_loading");
    body.className = "modal_body";
    const oldHtml = MyStorage.getSessionData("beforeLoadingHtml");
    body.innerHTML = oldHtml;
    modal.style.display = "none";
  }
}
