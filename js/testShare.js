function clicked(cls) {
  const body = document.querySelector("#testShare_div");
  const h2 = document.createElement("h2");
  h2.innerText =
    cls === "left"
      ? "당신은 짜장면을 좋아하는 타입"
      : "당신은 짬뽕을 좋아하는 타입";
  body.appendChild(h2);
  let imgUrl = "url(./assets/img/share/1.jpg)";
  if (cls === "right") imgUrl = "url(./assets/img/share/2.jpg)";
  const kakaoApi = new KakaoAPI();

  kakaoApi.getShareFeedButton(
    `#kakao_button`,
    "심리테스트",
    ["#짜장면", "#짬뽕"],
    imgUrl,
    `https://songwangho.github.io/gwangho.github.io/testShare?kakao_api_key=b39aea3597014313f631b83f061c6a95&choice=${cls}`
  );

  document.getElementById("share_footer").style.display = "block";
}
