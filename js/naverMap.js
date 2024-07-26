class NaverMap {
  constructor() {
    this.API_KEY_ID = MyURL.getParam("API_KEY_ID");
    this.API_KEY = MyURL.getParam("API_KEY");
  }

  static appendScript() {
    const API_KEY_ID = MyURL.getParam("API_KEY_ID");
    const API_KEY = MyURL.getParam("API_KEY");
    if (!API_KEY || !API_KEY_ID) MyToast.showToast("API키가 없네요 ㅋㅋ");
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${API_KEY_ID}`;
    document.head.appendChild(script);
  }

  makeMap(id) {
    const mapOptions = {
      center: new NaverMap.maps.LatLng(37.3595704, 127.105399),
      zoom: 10,
      disableDoubleTapZoom: true,
    };

    const map = new NaverMap.maps.Map(id, mapOptions);
  }
}
