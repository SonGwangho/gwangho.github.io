let modal = document.getElementsByClassName("modal")[0];

document.addEventListener("DOMContentLoaded", () => {
  modal = document.getElementsByClassName("modal")[0];
  const button = document.getElementsByClassName("btn_close_modal")[0];

  button.addEventListener("click", () => {
    Modal.hide_modal();
  });
});

class Modal {
  static show_modal() {
    modal.style.display = "flex";
  }

  static hide_modal() {
    modal.style.display = "none";
  }

  static start_loading() {
    const body = modal.querySelector(".modal_body");
    body.className = "modal_loading";
    const oldHtml = body.innerHTML;
    MyStorage.save_session("beforeLoadingHtml", oldHtml);
    const loadingHtml = '<span class="loading_spinner"></span>';
    body.innerHTML = loadingHtml;
    modal.style.display = "flex";
  }

  static stop_loading() {
    const body = modal.querySelector(".modal_loading");
    body.className = "modal_body";
    const oldHtml = MyStorage.get_session_data("beforeLoadingHtml");
    body.innerHTML = oldHtml;
    modal.style.display = "none";
  }
}
