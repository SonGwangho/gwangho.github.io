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
    if (!Kakao.isInitialized()) Kakao.init(this.API_KEY);
    if (!this.isInit()) return;
    MyStorage.saveLocal("kakao_api_key", this.API_KEY);
  }

  isInit() {
    if (!Kakao.isInitialized()) {
      MyToast.showToast("카카오 api가 초기화 되지 않았어요.");
      return false;
    }
    return true;
  }

  makeShareTextButton(dom, text, link) {
    if (!this.isInit()) return;
    Kakao.Share.createDefaultButton({
      container: dom,
      objectType: "text",
      text: text,
      link: {
        mobileWebUrl: link,
        webUrl: link,
      },
    });
  }

  getShareFeedButton(dom, title, descriptions, imageUrl, link) {
    if (!this.isInit()) return;
    Kakao.Share.createDefaultButton({
      container: dom,
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
  }
}
