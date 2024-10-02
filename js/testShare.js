function clicked(cls) {
  let imgUrl = URL("url(./assets/img/share/1.jpg)");
  if (cls === "right") imgUrl = URL("url(./assets/img/share/2.jpg)");
  const kakaoApi = new KakaoAPI();
  const dom = kakaoApi.getShareFeedButton(
    "심리테스트",
    ["짜장면", "짬뽕"],
    imgUrl,
    `https://songwangho.github.io/gwangho.github.io/testShare?kakao_api_key=b39aea3597014313f631b83f061c6a95&choice=${cls}`
  );
  const h3 = document.createElement("h3");
  h3.innerText = "카카오톡으로 내용 공유하기";
  document.querySelector("#testShare_div").appendChild(h3);
  document.querySelector("#testShare_div").appendChild(dom);
}
