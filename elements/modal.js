let modal = document.getElementsByClassName("modal")[0];

document.addEventListener("DOMContentLoaded", () => {
  modal = document.getElementsByClassName("modal")[0];
  const button = document.getElementsByClassName("btn_close_modal")[0];

  button.addEventListener("click", () => {
    modal.style.display = "none";
  });
});

function startLoading() {
  const body = modal.querySelector(".modal_body");
  body.className = "modal_loading";
  const oldHtml = body.innerHTML;
  MyStorage.save_session("beforeLoadingHtml", oldHtml);
  const loadingHtml = '<span class="loading_spinner"></span>';
  body.innerHTML = loadingHtml;
  modal.style.display = "flex";
}

function stopLoading() {
  const body = modal.querySelector(".modal_loading");
  body.className = "modal_body";
  const oldHtml = MyStorage.get_session_data("beforeLoadingHtml");
  body.innerHTML = oldHtml;
  modal.style.display = "none";
}
