class KakaoAPI {
  constructor() {
    this.API_KEY = MyURL.getParam("kakao_api_key");
    if (!this.API_KEY) {
      this.API_KEY = MyStorage.getLocalData("kakao_api_key");
    }

    if (!this.API_KEY) {
      MyToast.showToast("apikey를 문의하세용");
      return;
    }

    Kakao.init(this.API_KEY);

    if (!Kakao.isInitialized()) {
      MyToast.showToast("카카오 api 초기화 실패!");
      return;
    }
    MyStorage.saveLocal("kakao_api_key", this.API_KEY);
  }

  getShareTextButton(text, link) {
    const a = document.createElement("a");
    a.id = "kakao_share_button_" + Random.getId();
    a.href = "javascript:;";

    Kakao.Share.createDefaultButton({
      container: "#" + a.id,
      objectType: "text",
      text: text,
      link: {
        mobileWebUrl: link,
        webUrl: link,
      },
    });
    return a;
  }

  getShareFeedButton(title, descriptions, imageUrl, link) {
    const a = document.createElement("a");
    a.id = "kakao_share_button_" + Random.getId();
    a.href = "javascript:;";

    Kakao.Share.createDefaultButton({
      container: "#kakaotalk-sharing-btn",
      objectType: "feed",
      content: {
        title: title,
        description: descriptions.join(" "),
        imageUrl: imageUrl,
        link: {
          mobileWebUrl: link,
          webUrl: link,
        },
      },
      // social: {
      //   likeCount: 286,
      //   commentCount: 45,
      //   sharedCount: 845,
      // },
      buttons: [
        {
          title: "링크로 이동",
          link: {
            mobileWebUrl: link,
            webUrl: link,
          },
        },
      ],
    });

    return a;
  }
}
